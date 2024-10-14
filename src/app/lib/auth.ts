import { cookies } from 'next/headers';
import {} from 'jsonwebtoken'

export function getAccessToken(){
  return cookies().get('accessToken')?.value
}


export async function auth(): Promise<null>{
  const accessToken = getAccessToken()

  if(!accessToken){
    return null
  }

  verify
}