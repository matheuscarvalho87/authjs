'use client'

import Link from "next/link"

import { Button } from "@/components/ui/button"
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
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const schema = z.object({
  email: z.string().email('Informe um email válido'),
  password: z.string().min(1, 'Informe a senha')
})

type FormData = z.infer<typeof schema>
export default function SignIn() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const handleSubmit = form.handleSubmit(async(formData) => {
    try{
      setIsLoading(true)
      await axios.post('/api/auth/signin',formData)
      router.push('/')
    } catch {
      toast.error('Houve algum erro ao entrar na sua conta')
      setIsLoading(false)
    }
  })
  return (
    <div className='min-h-screen grid place-items-center p-4'>
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Acesse sua conta</CardTitle>
          <CardDescription>
            Faça login para continuar usando a platforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form} >
            <form className="grid gap-4" onSubmit={handleSubmit}>
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
                    <div className="flex items-center">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Link href="#" className="ml-auto inline-block text-sm underline">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <FormControl>
                      <Input placeholder="*********" autoComplete='current-password' type='password'{...field} />
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
                {!isLoading && 'Entrar'}
                {isLoading && 'Carregando...'}
              </Button>
              <Button variant="outline" type="button" className="w-full">
                Login com Google
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="signup  " className="underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
