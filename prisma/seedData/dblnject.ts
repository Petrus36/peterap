// npm install --save-dev tsx

// npx tsx prisma/seedData/dbInject.ts


import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    const data = JSON.parse(fs.readFileSync('prisma/seedData/seed-data.json', 'utf8'));

  // Insert Users, Profiles, and Posts into your DB
  // Because of relations, we can create them in the correct order or use createMany.
  for (const item of data) {
    // Create user
    const createdUser = await prisma.user.create({
      data: {
        id: item.id,
        name: item.name,
        email: item.email,
        emailVerified: item.emailVerified,
        image: item.image,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    });

    // Create profile
    if (item.profile) {
      await prisma.profile.create({
        data: {
          id: item.profile.id,
          userId: item.profile.userId,
          bio: item.profile.bio,
          avatarUrl: item.profile.avatarUrl,
          location: item.profile.location,
          interests: item.profile.interests,
          createdAt: item.profile.createdAt,
          updatedAt: item.profile.updatedAt
        }
      });
    }

    // Create posts
    if (item.posts && item.posts.length > 0) {
      await prisma.post.createMany({
        data: item.posts.map((p: any) => ({
          id: p.id,
          userId: p.userId,
          imageUrl: p.imageUrl,
          caption: p.caption,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        }))
      });
    }
  }

  console.log('Database seeded successfully!');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});