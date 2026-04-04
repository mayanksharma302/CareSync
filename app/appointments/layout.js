import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AppointmentsLayout({ children }) {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar userName={session.name} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
