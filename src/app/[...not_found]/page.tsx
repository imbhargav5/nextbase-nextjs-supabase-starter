import { notFound } from 'next/navigation';

export default function NotFoundCatchAll() {
  notFound();
  return null;
}
