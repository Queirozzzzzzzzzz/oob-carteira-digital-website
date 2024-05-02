import { jwtVerify } from "jose";

async function getUserPayload(token) {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET),
    { algorithms: ["HS256"] }
  );

  return payload;
}

module.exports = {
  getUserPayload,
};
