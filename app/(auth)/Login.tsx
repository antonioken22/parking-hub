"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="p-2">
      <Button onClick={() => signIn()}>Sign In</Button>
    </div>
  );
}
