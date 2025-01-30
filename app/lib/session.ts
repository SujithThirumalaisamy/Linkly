import { NextResponse } from "next/server";

export const setSessionCookie = (response: NextResponse, token: string) => {
  response.headers.set(
    "Set-Cookie",
    `jwt=${token}; HttpOnly; Path=/; Max-Age=${
      30 * 24 * 60 * 60
    }; SameSite=Strict; ${
      process.env.NODE_ENV !== "development" ? "Secure" : ""
    }`
  );
};

export const clearSessionCookie = (response: NextResponse) => {
  response.headers.set(
    "Set-Cookie",
    "jwt=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure"
  );
};
