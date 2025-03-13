"use client";

import React, { useState } from 'react';
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const UserProfile: React.FC = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { data: session } = useSession();

    const handleSignOut = () => {
        signOut();
    };

    return (
        <div className="absolute top-[10px] right-[10px]">
            <div className="relative">
                <img
                    src="/profile.png"
                    alt="Profile"
                    className="w-20 h-20 rounded-full cursor-pointer"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                />
                {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-2 px-4 border-b">
                            <p className="block w-full px-2 py-1 text-sm font-medium text-gray-700">
                                {session?.user?.name || "Пользователь"}
                            </p>
                        </div>
                        <div className="py-1">
                            <button
                                onClick={handleSignOut}
                                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                ВЫЙТИ ИЗ ПРОФИЛЯ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;