import * as Supabase from "https://esm.sh/@supabase/supabase-js";
import { HandlerContext } from "$fresh/server.ts";
import SaveUserData from "../../islands/SaveUserData.tsx";
import JWT from "../api/jwt.ts";

const MASTODON_APP_SCOPE = `read:accounts write:statuses`;

const MASTODON_CLIENT_KEY_ID = Deno.env.get(`MASTODON_CLIENT_KEY_ID`) || "";

const MASTODON_CLIENT_SECRET_KEY =
  (Deno.env.get(`MASTODON_CLIENT_SECRET_KEY`) || "");

const WOOLLY_URL_TOKEN_REDIRECT =
  (Deno.env.get(`WOOLLY_URL_TOKEN_REDIRECT`) || "");

const WOOLLY_SUPABASE_URL = Deno.env.get(`WOOLLY_SUPABASE_URL`);
const WOOLLY_SUPABASE_KEY = Deno.env.get(`WOOLLY_SUPABASE_KEY`);

const options = {
  schema: "public",
  headers: { "x-my-custom-header": "my-app-name" },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

const supabase = Supabase.createClient(
  WOOLLY_SUPABASE_URL,
  WOOLLY_SUPABASE_KEY,
  options,
);

const getGrant = async ({ instanceHost, code }) => {
  const tokenUrl = new URL(`https://${instanceHost}/oauth/token`);
  tokenUrl.searchParams.set("grant_type", "authorization_code");
  tokenUrl.searchParams.set("redirect_uri", WOOLLY_URL_TOKEN_REDIRECT);
  tokenUrl.searchParams.set("scope", MASTODON_APP_SCOPE);
  tokenUrl.searchParams.set("code", code);

  const { data, error } = await supabase.from("apps")
    .select()
    .eq("instance_host", instanceHost);

  if (error) {
    console.error("Error when logging into", instanceHost, error);
    return new Response("Something went wrong", { status: 500 });
  }

  tokenUrl.searchParams.set("client_id", data[0].client_key);
  tokenUrl.searchParams.set("client_secret", data[0].client_secret);

  const resp = await fetch(tokenUrl, { method: "POST" });

  if (resp.status >= 400 && resp.status < 600) {
    const error = await resp.text();
    throw new Error(`Could not create oauth token: ${error}`);
  }

  return await resp.json();
};

const getUser = async (instanceHost, { access_token, token_type }) => {
  const resp = await fetch(
    `https://${instanceHost}/api/v1/accounts/verify_credentials`,
    {
      headers: { "Authorization": `${token_type} ${access_token}` },
    },
  );

  if (resp.status >= 400 && resp.status < 600) {
    const error = await resp.text();
    throw new Error(`Could not verify credentials due to: ${error}`);
  }

  const user = await resp.json();
  console.log(`Logged in ${user.url}`);
  return {
    url: user.url,
    username: user.username,
    displayName: user.display_name,
    avatar: user.avatar,
  };
};

export const handler = async (req: Request, ctx: HandlerContext): Response => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const instanceHost = url.searchParams.get("state");

  const grant = await getGrant({ instanceHost, code });
  const user = await getUser(instanceHost, grant);

  const jwt = await JWT.encode({ grant, user });

  return ctx.render({ grant, user, jwt });
};

export default ({ data: { grant, jwt, user } }) => {
  if (grant.error === "invalid_grant") {
    return (
      <div>
        Something went wrong while validating your grant. Can you{" "}
        <a href="/login">log in again</a>?
      </div>
    );
  }

  return <SaveUserData jwt={jwt} user={user} />;
};
