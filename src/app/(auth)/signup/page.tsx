'use client'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import axios from 'axios'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import {toast} from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const schema = z.object({
  firstName: z.string().min(2, 'Informe um nome válido'),
  lastName: z.string().min(2, 'Informe um sobrenome válido'),
  email: z.string().email('Informe um email válido'),
  password: z.string().min(8, 'Pelo menos 8 caracteres')
})

type FormData = z.infer<typeof schema>

export default function SignUp() {
  const router = useRouter()

  const [isLoading,setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    }
  });

  const handleSubmit = form.handleSubmit(async (formData) => {
    try{
      setIsLoading(true)
      await axios.post('/api/auth/signup',formData)
      router.push('/signin')
      toast("Conta cadastrada com sucesso",{
        description:'Faça login agora mesmo'
      })
    } catch {
      toast.error('Erro ao criar sua conta')
      setIsLoading(false)
    } 
  })
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Cadastre-se</CardTitle>
        <CardDescription>
          Crie uma conta gratuita!
        </CardDescription >
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input autoComplete='name' placeholder="Fulano" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input autoComplete='name' placeholder="da Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input autoComplete='email' placeholder="seuemail@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input placeholder="*********" autoComplete='new-password' type='password'{...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {!isLoading && 'Criar conta'}
              {isLoading && ' Criando conta...'}
            </Button>
            <Button variant="outline" type='button' className="w-full">
              Cadastrar com GitHub
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Já tem uma conta?{" "}
          <Link href="/signin" className="underline">
            Acesse agora!
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
