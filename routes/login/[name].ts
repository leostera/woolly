import { HandlerContext } from "$fresh/server.ts";
import * as Supabase from "https://esm.sh/@supabase/supabase-js";

const MASTODON_APP_SCOPE = `read:accounts write:statuses`;
const MASTODON_CLIENT_KEY_ID = Deno.env.get(`MASTODON_CLIENT_KEY_ID`);
const WOOLLY_URL_WELCOME_URL = Deno.env.get(`WOOLLY_URL_WELCOME_URL`);

const WOOLLY_URL = Deno.env.get(`WOOLLY_URL`);

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

export const handler = async (req: Request, _ctx: HandlerContext): Response => {
  const instanceHost = req.url.split("@")[2];

  const url = new URL(`https://${instanceHost}/oauth/authorize`);
  url.searchParams.set("redirect_uri", WOOLLY_URL_WELCOME_URL);
  url.searchParams.set("scope", MASTODON_APP_SCOPE);
  url.searchParams.set("response_type", `code`);
  url.searchParams.set("state", instanceHost);

  // 1. check if host app is registered
  const { data, error } = await supabase.from("apps")
    .select()
    .eq("instance_host", instanceHost);

  if (error) {
    console.error("Error when logging into", instanceHost, error);
    return new Response("Something went wrong", { status: 500 });
  }

  if (data[0] !== undefined) {
    url.searchParams.set("client_id", data[0].client_key);
  } else {
    const app = await createApp({ instanceHost });

    const { error } = await supabase.from("apps").insert({
      instance_host: instanceHost,
      client_key: app.client_id,
      client_secret: app.client_secret,
      client_app_id: app.id,
      vapid_key: app.vapid_key,
    });

    if (error) {
      console.error("Error when creating Woolly app for", instanceHost, error);
      return new Response("Something went wrong", { status: 500 });
    }

    url.searchParams.set("client_id", app.client_id);
  }

  return Response.redirect(url, 302);
};

async function createApp({ instanceHost }) {
  const body = new FormData();
  body.append("client_name", "woolly");
  body.append(
    "redirect_uris",
    `${WOOLLY_URL_WELCOME_URL}
https://woolly.deno.dev/auth/redirect
`,
  );
  body.append("scopes", MASTODON_APP_SCOPE);
  body.append("website", WOOLLY_URL);
  const response = await fetch(`https://${instanceHost}/api/v1/apps`, {
    method: "POST",
    body,
  });

  if (response.status >= 400) {
    const error = await response.text();
    throw new Error(`Error when creating app for ${instanceHost}: ${error}`);
  }

  return await response.json();
}
