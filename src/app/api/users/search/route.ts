import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    try {
        const users = await prisma.user.findMany({
            where: query ? {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } }
                ]
            } : {},
            select: {
                id: true,
                name: true,
                email: true,
                image: true
            },
            take: query ? 10 : 50 // Return more users when no search query
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        return NextResponse.json(
            { error: "Failed to search users" },
            { status: 500 }
        );
    }
} 