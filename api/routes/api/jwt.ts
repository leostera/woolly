import * as JWT from "https://deno.land/x/djwt@v2.8/mod.ts";

const _jwk_key = JSON.parse(Deno.env.get("WOOLLY_JWT_SIGN_KEY"));

const KEY = await crypto.subtle.importKey(
  "jwk", _jwk_key, { name: "HMAC", hash: "SHA-512" }, true, ["sign", "verify"]
);

const encode = async (payload) => {
  return await JWT.create({ alg: "HS512", typ: "JWT" }, payload, KEY);
};

const decode = async (payload) => {
  return await JWT.verify(payload, KEY);
};

export default { encode, decode };
