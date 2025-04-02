'use client'

import  React, {useEffect, useState} from 'react';
import {useFetchUserRepositories} from "../../services/gitlab";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import Link from "next/link";
import Cheburator from "../../components/cheburator";
import Modal from "../../components/modal/modal";


export default function Boards() {
  const { data: session, status } = useSession();
  // @ts-ignore
  if (status !== "authenticated" || session?.accessToken === undefined) redirect('/')

  // @ts-ignore
  const {repos, isLoading, error} = useFetchUserRepositories(session.accessToken);
  console.log(repos, isLoading, error)


  return (
    <div
      className="monomakh-regular min-h-screen bg-[url('/image3.png')] bg-cover bg-center flex items-center justify-center p-5">
      <Cheburator/>
      <div
        className="w-[80%] mt-[100px] max-w-[900px] bg-[rgba(124,124,124,0.6)] rounded-[25px] shadow-md grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 row-gap-[30px] p-5">
        {repos.map((repo) => (
          <Link
            href={`/boards/${repo.id}`}
            key={repo.id}
            className="relative rounded-[15px] overflow-hidden shadow-sm w-full h-[150px] hover:scale-[1.02] transition-transform"
          >
            <img
              src={repo.avatar_url ?? `/board${repo.id % 3 + 1}.jpg`}
              alt={repo.name}
              className="w-full h-full object-cover block"
            />
            <div className="absolute top-[10px] left-[10px] bg-[rgba(0,0,0,0.5)] text-white px-[10px] py-[5px] rounded">
              {repo.name}
            </div>
          </Link>
        ))}
        {/*<Modal/>*/}
      </div>
    </div>
  );
}