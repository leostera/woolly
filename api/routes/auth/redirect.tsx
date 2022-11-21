import { HandlerContext } from "$fresh/server.ts";
import * as Hooks from "preact/hooks";
import * as JWT from "https://deno.land/x/djwt@v2.8/mod.ts";
import SaveUserData from "../../islands/SaveUserData.tsx";

const jwtKey = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);


const MASTODON_CLIENT_KEY_ID = Deno.env.get(`MASTODON_CLIENT_KEY_ID`);
const MASTODON_CLIENT_SECRET_KEY = Deno.env.get(`MASTODON_CLIENT_SECRET_KEY`);
const WOOLLY_URL_TOKEN_REDIRECT = Deno.env.get(`WOOLLY_URL_TOKEN_REDIRECT`);

let getGrant = async ({code}) => {
  let tokenUrl = new URL(`https://mas.to/oauth/token`);
  tokenUrl.searchParams.set("client_id", MASTODON_CLIENT_KEY_ID);
  tokenUrl.searchParams.set("client_secret", MASTODON_CLIENT_SECRET_KEY);
  tokenUrl.searchParams.set("grant_type", "authorization_code");
  tokenUrl.searchParams.set("redirect_uri", WOOLLY_URL_TOKEN_REDIRECT);
  tokenUrl.searchParams.set("code", code);

  let resp = await fetch(tokenUrl, { method: "POST" });
  return await resp.json()
}

let getUser = async ({ access_token, token_type }) => {
  let resp = await fetch("https://mas.to/api/v1/accounts/verify_credentials", {
    headers: { "Authorization": `${token_type} ${access_token}` }
  });
  let user = await resp.json();
  return {
      url: user.url,
      username: user.username,
      displayName: user.display_name,
      avatar: user.avatar,
    };
}

export const handler = async (req: Request, ctx: HandlerContext): Response => {
  let url = new URL(req.url);
  let code = url.searchParams.get("code");

  let grant = await getGrant({code});
  let user = await getUser(grant);

  const jwt = await JWT.create(
    { alg: "HS512", typ: "JWT" },
    { grant, user },
    jwtKey,
  );

  return ctx.render({grant, user, jwt});
};

export default ({data: { grant, jwt, user }}) => {
  if (grant.error === "invalid_grant") {
    return (<div>
      Something went wrong while validating your grant. Can you <a href="/login">log in again</a>?
      </div>
    );
  }

  return <SaveUserData jwt={jwt} user={user} />
}
