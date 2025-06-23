"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HomeFeed } from "@/components/home-feed";
import { DarkToggle } from "@/components/dark-toggle";
import { NewPostForm } from "@/components/new-post-form";

export default function FeedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="text-center mt-20">Checking authentication...</div>;
  }

  return <>
      <NewPostForm />
      <>
      <DarkToggle />
      <HomeFeed />
    </>
    </>;
}
