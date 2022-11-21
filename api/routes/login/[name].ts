import { HandlerContext } from "$fresh/server.ts";

const MASTODON_APP_SCOPE = `read:accounts write:statuses`;
const MASTODON_CLIENT_KEY_ID = Deno.env.get(`MASTODON_CLIENT_KEY_ID`);
const WOOLLY_URL_WELCOME_URL = Deno.env.get(`WOOLLY_URL_WELCOME_URL`);

export const handler = async (req: Request, _ctx: HandlerContext): Response => {
  let instanceHost = req.url.split("@")[2] || "mas.to";
  let url = new URL(`https://${instanceHost}/oauth/authorize`);
  url.searchParams.set("client_id", MASTODON_CLIENT_KEY_ID);
  url.searchParams.set("redirect_uri", WOOLLY_URL_WELCOME_URL);
  url.searchParams.set("scope", MASTODON_APP_SCOPE);
  url.searchParams.set("response_type", `code`);
  return Response.redirect(url, 301);
};
