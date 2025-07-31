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
          <SidebarMenuButton isActive={pathname === '/admin/books'} tooltip="Book Management">
            <BookOpenCheck />
            Books
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <Link href="/admin">
          <SidebarMenuButton isActive={pathname === '/admin'} tooltip="Loan Requests">
            <MailQuestion />
            Requests
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
