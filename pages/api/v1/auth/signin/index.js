import account from "models/account";
import { SignJWT } from "jose";
import cookie from "cookie";
const { createSecretKey } = require("crypto");

export default async function Signin(req, res) {
  const { cpf, password } = req.body;
  const result = await account.signin(cpf, password);

  if (Object.prototype.toString.call(result) == "[object Object]") {
    const secretKey = createSecretKey(process.env.JWT_SECRET, "utf-8");
    const token = await new SignJWT({
      id: process.env.JWT_ID,
      cpf: result.cpf,
      is_admin: result.is_admin,
      is_student: result.is_student,
    })
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
        sameSite: "lax",
        path: "/",
      })
    );

    if (result.is_admin == 1) {
      res.writeHead(302, { Location: "/admin/notification" }).end();
    }

    res.status(200).json({ logged: true });
  } else {
    res
      .writeHead(302, {
        Location: `/?message=${encodeURIComponent("error " + result)}`,
      })
      .end();
  }
}
