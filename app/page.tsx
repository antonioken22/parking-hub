"use client";

import { signOut, useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { query, collection } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { db } from "../firebase/config";

export default function Home() {
  const session = useSession();

  const [users] = useCollection(query(collection(db, "users")));

  return (
    <>
      <div className="p-2">
        <Button onClick={() => signOut()}>Logout</Button>
      </div>
      <div className="pl-2">{session?.data?.user?.name}</div>
      <div className="pl-2">{users?.docs[0].data().email}</div>
    </>
  );
}
