'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import { BookOpenCheck, MailQuestion } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="/admin/books">
          <SidebarMenuButton isActive={pathname.startsWith('/admin/books')} tooltip="Gerenciar Livros">
            <BookOpenCheck />
            Livros
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <Link href="/admin">
          <SidebarMenuButton isActive={pathname === '/admin'} tooltip="Solicitações de Empréstimo">
            <MailQuestion />
            Solicitações
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
