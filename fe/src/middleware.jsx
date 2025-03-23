import { NextResponse } from "next/server";
export function middleware(req) {
    const token = req.cookies.get('auth_token');
    if (!token) {
        return NextResponse.redirect(new URL("/404", req.get));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile'],
};