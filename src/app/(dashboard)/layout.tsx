import { redirect } from 'next/dist/server/api-utils';
import { auth } from '../lib/auth';
import { AppBar } from './_components/AppBar';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await auth()

  if(!user){
    return redirect
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppBar />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
