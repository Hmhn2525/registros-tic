import { createClient } from '@supabase/supabase-js';

interface SignatureRequestBody {
  signatureToken?: unknown;
  signatureDataUrl?: unknown;
}

interface RuntimeGlobals {
  process?: {
    env?: Record<string, string | undefined>;
  };
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PNG_DATA_URL_PATTERN = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/;
const MAX_ENCODED_SIGNATURE_LENGTH = 2_000_000;
const MAX_SIGNATURE_BYTES = 1_500_000;

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' }
  });
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function decodeBase64(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, message: 'Método no permitido.' }), {
        status: 405,
        headers: {
          'Allow': 'POST',
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      });
    }

    const runtimeProcess = (globalThis as typeof globalThis & RuntimeGlobals).process;
    const supabaseUrl = runtimeProcess?.env?.SUPABASE_URL || runtimeProcess?.env?.VITE_SUPABASE_URL;
    const serverSecretKey = runtimeProcess?.env?.SUPABASE_SECRET_KEY || runtimeProcess?.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serverSecretKey) {
      console.error('Faltan VITE_SUPABASE_URL/SUPABASE_URL o SUPABASE_SECRET_KEY en Vercel.');
      return jsonResponse(503, {
        success: false,
        message: 'El servicio de firma no está configurado. Contacta al área de TIC.'
      });
    }

    try {
      const body = await request.json() as SignatureRequestBody;
      const signatureToken = typeof body.signatureToken === 'string' ? body.signatureToken : '';
      const signatureDataUrl = typeof body.signatureDataUrl === 'string' ? body.signatureDataUrl : '';

      if (signatureDataUrl.length > MAX_ENCODED_SIGNATURE_LENGTH) {
        return jsonResponse(413, { success: false, message: 'La firma excede el tamaño permitido.' });
      }

      const signatureMatch = signatureDataUrl.match(PNG_DATA_URL_PATTERN);
      if (!UUID_PATTERN.test(signatureToken) || !signatureMatch) {
        return jsonResponse(400, { success: false, message: 'El enlace o la firma no son válidos.' });
      }

      const signatureBytes = decodeBase64(signatureMatch[1]);
      if (signatureBytes.length === 0 || signatureBytes.length > MAX_SIGNATURE_BYTES) {
        return jsonResponse(413, { success: false, message: 'La firma excede el tamaño permitido.' });
      }

      const supabase = createClient(supabaseUrl, serverSecretKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
      const signatureTokenHash = await sha256(signatureToken);

      const { data: ticket, error: lookupError } = await supabase
        .from('tickets')
        .select('id, estado')
        .eq('firma_token_hash', signatureTokenHash)
        .maybeSingle();

      if (lookupError) throw lookupError;
      if (!ticket) {
        return jsonResponse(404, { success: false, message: 'El enlace de firma no existe o ya no es válido.' });
      }
      if (ticket.estado !== 'Pendiente') {
        return jsonResponse(409, { success: false, message: 'Este ticket ya fue firmado o cerrado.' });
      }

      const filePath = `remotas/${ticket.id}/firma_${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('firmas')
        .upload(filePath, signatureBytes, { contentType: 'image/png', upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('firmas').getPublicUrl(filePath);
      const { data: updatedTicket, error: updateError } = await supabase
        .from('tickets')
        .update({ url_firma: publicUrlData.publicUrl, estado: 'Atendido' })
        .eq('id', ticket.id)
        .eq('firma_token_hash', signatureTokenHash)
        .eq('estado', 'Pendiente')
        .select('id, estado, url_firma')
        .single();

      if (updateError || !updatedTicket) {
        await supabase.storage.from('firmas').remove([filePath]);
        if (updateError) throw updateError;
        throw new Error('La actualización no confirmó ningún ticket.');
      }

      return jsonResponse(200, {
        success: true,
        message: 'Firma registrada correctamente.',
        ticketId: updatedTicket.id,
        estado: updatedTicket.estado
      });
    } catch (error: unknown) {
      console.error('Error al procesar la firma remota:', error);
      return jsonResponse(500, {
        success: false,
        message: 'No fue posible registrar la firma. Inténtalo nuevamente.'
      });
    }
  }
};
