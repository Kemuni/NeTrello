'use client'

import React, {useEffect, useState} from 'react';
import {useFetchUserRepositories} from "../../services/gitlab";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import Link from "next/link";


export default function Boards() {
  const { data: session, status } = useSession();
  // @ts-ignore
  if (status !== "authenticated" || session?.accessToken === undefined) redirect('/')

  // @ts-ignore
  const {repos, isLoading, error} = useFetchUserRepositories(session.accessToken);
  console.log(repos, isLoading, error)

  return (
    <div
      className="monomakh-regular"
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/image3.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '80%',
          marginTop: '100px',
          maxWidth: '900px',
          
          backgroundColor: 'rgba(124, 124, 124, 0.6)',
          borderRadius: '25px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          rowGap: '30px',
          padding: '20px'
        }}
      >
        {repos.map((repo) => (
          <Link
            href={`/boards/${repo.id}`}
            key={repo.id}
            style={{
              position: 'relative',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              width: '100%',
              height: '150px'
            }}
          >
            <img
              src={repo.avatar_url ?? `/board${repo.id % 3 + 1}.jpg`}
              alt={repo.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px'
              }}
            >
              {repo.name}
            </div>
          </Link>
        ))}

        {/* Карточка-кнопка для добавления новых карточек */}
        <div
          style={{
            position: 'relative',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            width: '100%',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Прозрачный фон
            cursor: 'pointer'
          }}
          onClick={() => alert('Добавить новую карточку')}
        >
          <span style={{ color: 'white', fontSize: '24px' }}>+</span>
        </div>
      </div>
    </div>
  );
}