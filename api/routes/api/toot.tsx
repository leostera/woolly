import { HandlerContext } from "$fresh/server.ts";
import * as Hooks from "preact/hooks";
import JWT from "../api/jwt.ts";
import SaveUserData from "../../islands/SaveUserData.tsx";

const MASTODON_CLIENT_KEY_ID = Deno.env.get(`MASTODON_CLIENT_KEY_ID`);
const MASTODON_CLIENT_SECRET_KEY = Deno.env.get(`MASTODON_CLIENT_SECRET_KEY`);
const WOOLLY_URL_TOKEN_REDIRECT = Deno.env.get(`WOOLLY_URL_TOKEN_REDIRECT`);

let publishToot = async ({ access_token, token_type }, toot) => {
  let formData = new FormData();
  Object.entries(toot).forEach(([k,v]) => {
    if (v !== null && v !== undefined) {
      formData.append(k, v)
    }
  });

  let req = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${access_token}`,
    },
    body: formData,
  };
  let resp = await fetch("https://mas.to/api/v1/statuses", req);
  return await resp.json();
}

export const handler = async (req: Request, ctx: HandlerContext): Response => {
  try {
    let url = new URL(req.url);
    let jwt = req.headers.get("Authorization").replace("Bearer ", "");
    const grant = await JWT.decode(jwt);

    let tootDesc = await req.json();
    let toot = await publishToot(grant.grant, tootDesc);
    return new Response(JSON.stringify(toot));
  } catch (e) {
    console.error(e);
    return new Response("Invalid JWT\n", {status: 401});
  }
};
