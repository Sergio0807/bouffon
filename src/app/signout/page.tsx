import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export default function SignOutPage() {
  // Créer une réponse de redirection
  const response = NextResponse.redirect(new URL('/', 'http://localhost:3000'));
  
  // Supprimer le cookie de session
  response.headers.set(
    'Set-Cookie',
    'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly'
  );

  return response;
}
