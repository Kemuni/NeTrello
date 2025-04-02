'use client'

import React, { useEffect, useState } from 'react';
import {signIn, useSession} from "next-auth/react";
import {redirect} from "next/navigation";

export default function Home() {
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);

  if (status === "authenticated") return redirect('/boards')

  useEffect(() => {
    setMounted(true);

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.height = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="monomakh-regular fixed top-0 left-0 w-screen h-screen bg-[url('/image.png')] bg-cover bg-center flex items-center justify-center"
    >
      <button
        onClick={() => signIn("gitlab")}
        className="monomakh-regular bg-[rgba(102,102,102,0.75)] text-white font-bold py-[10px] px-[32px] rounded-lg shadow-md border-2 border-[rgb(134,134,134)] text-[45px] no-underline flex items-center gap-2 cursor-pointer hover:bg-[rgba(102,102,102,0.85)] transition-colors"
      >
        Авторизоваться через Гитлаб
        <img
          src="/gitlab-logo.png"
          alt="GitLab Logo"
          className="w-[74px] h-[74px]"
        />
      </button>
    </div>
  );
}