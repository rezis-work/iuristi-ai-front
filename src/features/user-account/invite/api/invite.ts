


export async function inviteUser(email: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invite`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return response.json();
}