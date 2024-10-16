import { prismaClient } from '@/app/lib/prismaClient';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { compare } from 'bcryptjs'
import { env } from '@/config/env';
import {sign} from 'jsonwebtoken'

const schema = z.object({
  email: z.string().email('Informe um email válido'),
  password: z.string().min(8, 'Pelo menos 8 caracteres')
})

const SEVEN_DAYS_IN_SECONDS = 7* 24 * 60 * 60

export async function POST(request: NextRequest){
  const body = await request.json()

  const {success,error,data} = schema.safeParse(body);

  if(!success){
    return NextResponse.json(
      {erros: error.issues},
      {status:400}
    )
  }

  const {email,password} = data;

  const user = await prismaClient.user.findUnique({
    where:{ email },
    select: { id:  true, email:true, password:true }
  })

  if(!user){
    return NextResponse.json(
      {erros:'Invalid credentials'},
      {status:401}
    )
  }

  const isPasswordValid = await compare(password, user.password)

  if(!isPasswordValid) {
    return NextResponse.json(
      {erros:'Invalid credentials'},
      {status:401}
    )
  }

  const accessToken = sign(
    {sub: user.id},
    env.jwtSecret,
    {expiresIn: '7d'}
  )

  const response = new NextResponse(null, { status:404 })

  response.cookies.set(
    'accessToken',
    accessToken,
    {
      httpOnly:true,
      maxAge: SEVEN_DAYS_IN_SECONDS,
      path: '/',
      sameSite: 'strict',
      secure:true
    }
  )

  return response

}