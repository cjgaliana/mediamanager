import { Games } from '@/components/Games';
import { Navigation } from '@/components/Navigation';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function GamesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <Navigation>
      <Games />
    </Navigation>
  );
}
