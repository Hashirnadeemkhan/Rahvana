"use client";

import dynamic from "next/dynamic";

// Dynamic import with ssr: false to avoid hydration mismatch from browser extensions
const FloatingChatWidget = dynamic(
  () => import("../chat/FloatingChatWidget").then((mod) => mod.FloatingChatWidget),
  { ssr: false }
);

export function ClientWidgets() {
  return <FloatingChatWidget />;
}
