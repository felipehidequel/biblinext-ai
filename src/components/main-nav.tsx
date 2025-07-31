'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import { BookOpenCheck, History, ShieldCheck, MailQuestion } from 'lucide-react';
import { getUser } from '@/lib/data';

export function MainNav() {
  const pathname = usePathname();
  const user = getUser('user-1'); // Simplified: get current user

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="/">
          <SidebarMenuButton isActive={pathname === '/'} tooltip="Book Catalog">
            <BookOpenCheck />
            Book Catalog
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <Link href="/my-loans">
          <SidebarMenuButton isActive={pathname === '/my-loans'} tooltip="My Loans">
            <History />
            My Loans
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <Link href="/my-requests">
          <SidebarMenuButton isActive={pathname === '/my-requests'} tooltip="My Requests">
            <MailQuestion />
            My Requests
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      {user?.role === 'admin' && (
        <SidebarMenuItem>
          <Link href="/admin">
            <SidebarMenuButton isActive={pathname === '/admin'} tooltip="Admin Panel">
              <ShieldCheck />
              Admin
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
