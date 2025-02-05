// src/app/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
//import AuthHomeView from "@/sections/AuthHomeView";
import NonAuthHomeView from "@/sections/NonAuthHomeView";
import { redirect } from "next/navigation";

export const metadata = { title: "Domov | PokecNaPoker" };

export default async function HomePage() {
  // Fetch session on the server
  const session = await getServerSession(authOptions);

  // Conditionally render authenticated or non-authenticated home view
  return session ? redirect('/prispevok') : <NonAuthHomeView />;
}

