import { NextResponse } from "next/server";
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    const uploadsDir = path.join(publicDir, 'uploads');
    await createDirIfNotExists(uploadsDir);

    // Save file with unique name
    const uniqueFilename = `${session.user.id}-${Date.now()}${path.extname(file.name)}`;
    const filePath = path.join('uploads', uniqueFilename);
    const fullPath = path.join(publicDir, filePath);
    await writeFile(fullPath, buffer);

    // Update user's image in database
    const imageUrl = `/${filePath}`;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    // Update or create profile with avatarUrl
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        avatarUrl: imageUrl,
      },
      update: {
        avatarUrl: imageUrl,
      },
    });

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

async function createDirIfNotExists(dir: string) {
  try {
    await writeFile(dir, '', { flag: 'wx' });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
} 