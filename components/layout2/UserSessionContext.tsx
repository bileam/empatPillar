"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { UserProfile } from "@/data/dummy/users";

const UserSessionContext = createContext<UserProfile | null>(null);

export function UserSessionProvider({
  user,
  children,
}: {
  user: UserProfile;
  children: ReactNode;
}) {
  return (
    <UserSessionContext.Provider value={user}>
      {children}
    </UserSessionContext.Provider>
  );
}

export function useCurrentParticipant() {
  return useContext(UserSessionContext);
}
