import {   NextResponse } from 'next/server';

export async function POST(){
  const response = new NextResponse(null, { status:404 })

  response.cookies.delete('accessToken')

  return response

}