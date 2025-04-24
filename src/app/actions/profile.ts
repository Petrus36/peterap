"use server";

import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

interface UpdateProfileData {
  name: string;
  bio?: string;
  location?: string;
}

export async function updateProfile(data: UpdateProfileData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  try {
    // Update user name
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: data.name },
    });

    // Update or create profile
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        bio: data.bio || null,
        location: data.location || null,
      },
      update: {
        bio: data.bio || null,
        location: data.location || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
} 