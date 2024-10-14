import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAccessToken } from '../lib/auth';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accessToken = getAccessToken()
  if(accessToken){
    return redirect('/')
  }
  return (
    <div className='min-h-screen grid place-items-center p-4'>
      {children}
    </div>
  );
}
