import { HandlerContext } from "$fresh/server.ts";
import JWT from "../api/jwt.ts";

const publishToot = async (
  { grant: { access_token }, user: { url } },
  toot,
) => {
  const formData = new FormData();
  Object.entries(toot).forEach(([k, v]) => {
    if (v !== null && v !== undefined) {
      formData.append(k, v);
    }
  });

  const req = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${access_token}`,
    },
    body: formData,
  };
  const instanceHost = new URL(url).host;
  const resp = await fetch(`https://${instanceHost}/api/v1/statuses`, req);
  return await resp.json();
};

export const handler = async (req: Request, ctx: HandlerContext): Response => {
  try {
    const url = new URL(req.url);
    const jwt = req.headers.get("Authorization").replace("Bearer ", "");
    const grant = await JWT.decode(jwt);

    const tootDesc = await req.json();
    const toot = await publishToot(grant, tootDesc);
    return new Response(JSON.stringify(toot));
  } catch (e) {
    console.error(e);
    return new Response("Invalid JWT\n", { status: 401 });
  }
};
