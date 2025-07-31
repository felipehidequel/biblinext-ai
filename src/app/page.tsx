import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the main admin page
  redirect('/admin/books');
}
