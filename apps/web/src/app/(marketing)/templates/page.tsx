import { redirect } from 'next/navigation';

/** Legacy URL — template previews moved to kit pages and public transformation prompts. */
export default function TemplatesPageRedirect() {
  redirect('/prompts');
}
