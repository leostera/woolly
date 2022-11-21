import * as JWT from "https://deno.land/x/djwt@v2.8/mod.ts";

const KEY = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

const encode = async (payload) => {
  return await JWT.create({ alg: "HS512", typ: "JWT" }, payload, KEY);
};

const decode = async (payload) => {
  return await JWT.verify(payload, KEY);
};

export default { encode, decode };
