"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export function SignInButton() {
  const session = useSession();

  const handleSign = async () => {
    await signIn("github", { callbackUrl: "/" });
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return session.data ? (
    <button
      type="button"
      className="h-12 ml-auto flex gap-4 items-center rounded-full bg-gray-800 px-6 text-white font-bold transition hover:transition-all hover:brightness-75"
    >
      <FaGithub className="text-green-500 text-2xl" />
      {session.data?.user?.name}

      <FiX
        className="text-gray-200 text-lg cursor-pointer"
        onClick={handleSignOut}
      />
    </button>
  ) : (
    <button
      onClick={handleSign}
      className="h-12 ml-auto flex gap-4 items-center rounded-full bg-gray-800 px-6 text-white font-bold transition hover:transition-all hover:brightness-75"
    >
      <FaGithub className="text-yellow-500 text-2xl" />
      Sign in with GitHub
    </button>
  );
}
