import { del, get, put } from "@vercel/blob";

/**
 * Private Vercel Blob helpers. Auth comes from the environment: on Vercel the
 * OIDC token plus BLOB_STORE_ID, locally whatever `vercel env pull` provides.
 */

export async function putPrivatePdf(pathname: string, body: Buffer) {
  return put(pathname, body, {
    access: "private",
    contentType: "application/pdf",
    addRandomSuffix: false,
    allowOverwrite: false,
  });
}

/** Reads a private blob into memory; null when it doesn't exist. */
export async function getPrivatePdf(pathname: string): Promise<Buffer | null> {
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return Buffer.from(await new Response(result.stream).arrayBuffer());
}

export async function deletePrivateBlob(pathname: string) {
  await del(pathname);
}
