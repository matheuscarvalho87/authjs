import { prismaClient } from '@/app/lib/prismaClient';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hash } from 'bcryptjs'

const schema = z.object({
  firstName: z.string().min(2, 'Informe um nome válido'),
  lastName: z.string().min(2, 'Informe um sobrenome válido'),
  email: z.string().email('Informe um email válido'),
  password: z.string().min(8, 'Pelo menos 8 caracteres')
})

export async function POST(request: NextRequest){
  const body = await request.json()

  const {success,error,data} = schema.safeParse(body);
  //Paramos em 2:11 salvando cookies
  if(!success){
    return NextResponse.json(
      {erros: error.issues},
      {status:400}
    )
  }

  const {email,firstName,lastName,password} = data;
  
  const emailAlreadyInUse = await prismaClient.user.findUnique({
    where:{ email },
    select: { id:  true }
  })

  if(emailAlreadyInUse) {
    return NextResponse.json(
      { error: 'Email already in use' },
      { status: 409 }
    )
  }

  const hashedPassword = await hash(password,12)

  await prismaClient.user.create({
    data:{
      email,
      firstName,
      lastName,
      password: hashedPassword
    }
  })

  return new NextResponse(null, {status: 204})
}