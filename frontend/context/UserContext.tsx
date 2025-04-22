import React, { createContext, useEffect, useState, useContext } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { getUserByAuthId } from "@/app/api/api";

export interface User {
  user_id: number;
  username: string;
  nickname: string;
  description: string;
  auth_id: string;
  storage_id: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userId, isSignedIn } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function setUserContext() {
      if (isSignedIn && userId) {
        try {
          const user = await getUserByAuthId(userId);
          setUser(user);
        } catch (err) {
          console.error(err);
        }
      }
    }

    setUserContext();
  }, [isSignedIn, userId]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
