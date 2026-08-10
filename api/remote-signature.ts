import type { IncomingMessage, ServerResponse } from 'node:http';
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

type RequestWithBody = IncomingMessage & { body?: unknown };

interface SignatureRequestBody {
  signatureToken?: unknown;
  signatureDataUrl?: unknown;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PNG_DATA_URL_PATTERN = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/;
const MAX_REQUEST_BYTES = 2_500_000;

function sendJson(res: ServerResponse, statusCode: number, body: Record<string, unknown>) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readRequestBody(req: RequestWithBody): Promise<SignatureRequestBody> {
  if (req.body && typeof req.body === 'object') {
    return req.body as SignatureRequestBody;
  }

  let rawBody = '';
  for await (const chunk of req) {
    rawBody += chunk.toString();
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_REQUEST_BYTES) {
      throw new Error('PAYLOAD_TOO_LARGE');
    }
  }

  return JSON.parse(rawBody) as SignatureRequestBody;
}

export default async function handler(req: RequestWithBody, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { success: false, message: 'Método no permitido.' });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serverSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serverSecretKey) {
    console.error('Faltan VITE_SUPABASE_URL/SUPABASE_URL o SUPABASE_SECRET_KEY en Vercel.');
    sendJson(res, 503, {
      success: false,
      message: 'El servicio de firma no está configurado. Contacta al área de TIC.'
    });
    return;
  }

  try {
    const body = await readRequestBody(req);
    const signatureToken = typeof body.signatureToken === 'string' ? body.signatureToken : '';
    const signatureDataUrl = typeof body.signatureDataUrl === 'string' ? body.signatureDataUrl : '';
    const signatureMatch = signatureDataUrl.match(PNG_DATA_URL_PATTERN);

    if (!UUID_PATTERN.test(signatureToken) || !signatureMatch) {
      sendJson(res, 400, { success: false, message: 'El enlace o la firma no son válidos.' });
      return;
    }

    const signatureBuffer = Buffer.from(signatureMatch[1], 'base64');
    if (signatureBuffer.length === 0 || signatureBuffer.length > 1_500_000) {
      sendJson(res, 413, { success: false, message: 'La firma excede el tamaño permitido.' });
      return;
    }

    const supabase = createClient(supabaseUrl, serverSecretKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const signatureTokenHash = createHash('sha256').update(signatureToken).digest('hex');

    const { data: ticket, error: lookupError } = await supabase
      .from('tickets')
      .select('id, estado')
      .eq('firma_token_hash', signatureTokenHash)
      .maybeSingle();

    if (lookupError) throw lookupError;
    if (!ticket) {
      sendJson(res, 404, { success: false, message: 'El enlace de firma no existe o ya no es válido.' });
      return;
    }
    if (ticket.estado !== 'Pendiente') {
      sendJson(res, 409, { success: false, message: 'Este ticket ya fue firmado o cerrado.' });
      return;
    }

    const filePath = `remotas/${ticket.id}/firma_${Date.now()}.png`;
    const { error: uploadError } = await supabase.storage
      .from('firmas')
      .upload(filePath, signatureBuffer, { contentType: 'image/png', upsert: false });

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

    sendJson(res, 200, {
      success: true,
      message: 'Firma registrada correctamente.',
      ticketId: updatedTicket.id,
      estado: updatedTicket.estado
    });
  } catch (error: unknown) {
    console.error('Error al procesar la firma remota:', error);
    const statusCode = error instanceof Error && error.message === 'PAYLOAD_TOO_LARGE' ? 413 : 500;
    sendJson(res, statusCode, {
      success: false,
      message: statusCode === 413
        ? 'La firma excede el tamaño permitido.'
        : 'No fue posible registrar la firma. Inténtalo nuevamente.'
    });
  }
}
