import pkg from "openid-client";
const { Issuer } = pkg;

let clients = {};

export async function getOidcClient({ issuerUrl, client_id, client_secret, redirect_uris }) {
  if (!issuerUrl) throw new Error('issuerUrl is required');
  if (!client_id) throw new Error('OIDC_CLIENT_ID is missing');
  if (!redirect_uris?.length) throw new Error('OIDC_REDIRECT_URI is missing');

  if (!clients[issuerUrl]) {
    console.log(`[OIDC] Discovering issuer at: ${issuerUrl}`);
    const issuer = await Issuer.discover(issuerUrl);
    console.log('[OIDC] Discovered issuer metadata:', issuer.metadata);

    clients[issuerUrl] = new issuer.Client({
      client_id,
      client_secret,
      redirect_uris,
      response_types: ['code'],
    });
  }

  return clients[issuerUrl];
}
