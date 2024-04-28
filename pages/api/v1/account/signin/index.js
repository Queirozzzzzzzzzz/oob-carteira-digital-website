import Account from "models/account";
import { SignJWT } from "jose";
import cookie from "cookie";
const { createSecretKey } = require("crypto");

export default async function Signin(req, res) {
  const { cpf, password } = req.body;
  const result = await Account.signin(cpf, password);

  if (Object.prototype.toString.call(result) == "[object Object]") {
    if (result.is_admin == 1) {
      const secretKey = createSecretKey(process.env.JWT_SECRET, "utf-8");
      const token = await new SignJWT({ id: process.env.JWT_ID })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer(process.env.HOST)
        .setAudience(process.env.HOST)
        .setExpirationTime(process.env.JWT_EXPIRATION_TIME)
        .sign(secretKey);

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60,
          sameSite: "none",
          path: "/",
        })
      );
      res.writeHead(302, { Location: "/notification" }).end();
    } else {
      res.status(200).json(result);
    }
  } else {
    res
      .writeHead(302, {
        Location: `/?message=${encodeURIComponent("error " + result)}`,
      })
      .end();
  }
}
