import account from "models/account";
import { SignJWT } from "jose";
import cookie from "cookie";
const { createSecretKey } = require("crypto");

export default async function Signin(req, res) {
  const { cpf, password } = req.body;
  const result = await account.signin(cpf, password);

  if (Object.prototype.toString.call(result) == "[object Object]") {
    const token = await getToken(result);
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: process.env.AUTH_EXPIRATION_TIME,
        sameSite: "lax",
        path: "/",
      })
    );

    if (result.is_admin == 1) {
      res.status(200).json({ admin_logged: true });
    }

    res.status(200).json({ logged: true });
  } else {
    if (result.startsWith("admin ")) {
      if (result.startsWith("admin ")) {
        res
          .writeHead(302, {
            Location: `/?message=${encodeURIComponent("error " + result.replace("admin ", ""))}`,
          })
          .end();
      }
    }
    res.status(422).json(result);
  }
}

async function getToken(result) {
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

  return token;
}
