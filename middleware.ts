import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
    publicRoutes: ["/", "/api/upload-test","/api/gen-virtual-character","/api/get-virtual-characters", "/api/get-user-info"],
    afterAuth(auth, req, evt) {
      if (!auth.userId && !auth.isPublicRoute) {
        if (auth.isApiRoute) {
          return NextResponse.json(
            { code: -2, message: "no auth" },
            { status: 401 }
          );
        } else {
          return NextResponse.redirect(new URL("/sign-in", req.url));
        }
      }
  
      return NextResponse.next();
    },
  });
  
  export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api)(.*)"],
  };
