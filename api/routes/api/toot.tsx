import { HandlerContext } from "$fresh/server.ts";
import * as Hooks from "preact/hooks";
import JWT from "../api/jwt.ts";
import SaveUserData from "../../islands/SaveUserData.tsx";

const MASTODON_CLIENT_KEY_ID = Deno.env.get(`MASTODON_CLIENT_KEY_ID`);
const MASTODON_CLIENT_SECRET_KEY = Deno.env.get(`MASTODON_CLIENT_SECRET_KEY`);
const WOOLLY_URL_TOKEN_REDIRECT = Deno.env.get(`WOOLLY_URL_TOKEN_REDIRECT`);

let publishToot = async ({ access_token, token_type }, { status, visibility }) => {
  let resp = await fetch("https://mas.to/api/v1/statuses", {
    method: "POST",
    headers: { "Authorization": `${token_type} ${access_token}` },
    body: {
      status,
      visibility, 
    }
  });
  let too = await resp.json();
  return {
      url: user.url,
      username: user.username,
      displayName: user.display_name,
      avatar: user.avatar,
    };
}

export const handler = async (req: Request, ctx: HandlerContext): Response => {
  try {
    let url = new URL(req.url);
    let jwt = req.headers.get("Authentication").replace("Bearer ", "");
    const grant = await JWT.decode(jwt, jwtKey);
    console.log(grant);

    let {status, visibility} = await req.json();
    return ctx.render();
  } catch (e) {
    console.error(e);
    return new Response("Invalid JWT\n", {status: 401});
  }
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
