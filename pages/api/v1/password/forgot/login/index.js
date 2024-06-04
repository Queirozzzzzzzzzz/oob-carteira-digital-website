import cookie from "cookie";

export default async function Login(req, res) {
  try {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", req.query.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: process.env.AUTH_EXPIRATION_TIME,
        sameSite: "lax",
        path: "/",
      })
    );

    res
      .writeHead(302, {
        Location: `/password/reset`,
      })
      .end();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
