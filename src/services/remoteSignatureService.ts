interface RemoteSignatureResponse {
  success: boolean;
  message: string;
}

export async function submitRemoteSignature(
  signatureToken: string,
  signatureDataUrl: string
): Promise<RemoteSignatureResponse> {
  const response = await fetch('/api/remote-signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signatureToken, signatureDataUrl })
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: 'El servidor devolvió una respuesta inválida.'
  })) as RemoteSignatureResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'No fue posible registrar la firma.');
  }

  return payload;
}
