'use client';

import {
  AppShell,
  Burger,
  Button,
  Group,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size="lg" fw={700}>
              Media Collection
            </Text>
          </Group>
          {session ? (
            <Group>
              <Text>Welcome, {session.user?.name}</Text>
              <Button variant="light" onClick={() => signOut()}>
                Sign out
              </Button>
            </Group>
          ) : (
            <Group>
              <Button component={Link} href="/auth/signin" variant="light">
                Sign in
              </Button>
              <Button component={Link} href="/auth/signup">
                Sign up
              </Button>
            </Group>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <UnstyledButton
          component={Link}
          href="/"
          fw={isActive('/') ? 700 : 400}
          mb="sm"
          display="block"
        >
          Movies
        </UnstyledButton>
        <UnstyledButton
          component={Link}
          href="/games"
          fw={isActive('/games') ? 700 : 400}
          mb="sm"
          display="block"
        >
          Games
        </UnstyledButton>
        <UnstyledButton
          component={Link}
          href="/books"
          fw={isActive('/books') ? 700 : 400}
          mb="sm"
          display="block"
        >
          Books
        </UnstyledButton>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
