import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
    console.log(request.nextUrl.pathname);
    const accessToken = request.cookies.get('accessToken');

    if(!accessToken) {
        return NextResponse.redirect(new URL('/',request.url));
    }

  return NextResponse.next();
}

export const config = {
    matcher: ['/internal/:path*'],
}