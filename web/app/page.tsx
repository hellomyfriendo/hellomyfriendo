import { auth } from "@/auth";
import { SignInButton, SignOutButton } from "@/app/components";

export default async function Home() {
  const session = await auth();

  return (
    <main>
      {session?.user && (
        <>
          <p>Signed in as {session.user.email}</p>
          <SignOutButton />
        </>
      )}

      {!session?.user && (
        <>
          <p>Not signed in</p>
          <SignInButton />
        </>
      )}
    </main>
  );
}
