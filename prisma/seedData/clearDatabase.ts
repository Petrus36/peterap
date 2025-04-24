// npx ts-node prisma/seedData/clearDatabase.ts

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * This script clears all data from the database tables.
 */
async function clearDatabase() {
    console.log('🧹 Starting database cleanup...');

    try {
        // The order matters due to foreign key constraints

        // Start with tables that have foreign keys to other tables
        console.log('Deleting notification data...');
        await prisma.notification.deleteMany();

        console.log('Deleting bookmark data...');
        await prisma.bookmark.deleteMany();

        console.log('Deleting commentLike data...');
        await prisma.commentLike.deleteMany();

        console.log('Deleting comment data...');
        await prisma.comment.deleteMany();

        console.log('Deleting like data...');
        await prisma.like.deleteMany();

        console.log('Deleting follow data...');
        await prisma.follow.deleteMany();

        console.log('Deleting post data...');
        await prisma.post.deleteMany();

        console.log('Deleting profile data...');
        await prisma.profile.deleteMany();

        console.log('Deleting session data...');
        await prisma.session.deleteMany();

        console.log('Deleting verificationToken data...');
        await prisma.verificationToken.deleteMany();

        console.log('Deleting authenticator data...');
        await prisma.authenticator.deleteMany();

        console.log('Deleting account data...');
        await prisma.account.deleteMany();

        // Users should be last as many tables reference users
        console.log('Deleting user data...');
        await prisma.user.deleteMany();

        console.log('✅ All data has been cleared from the database!');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the function if this script is executed directly
if (require.main === module) {
    clearDatabase()
        .then(() => {
            console.log('Database clearing completed successfully.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Failed to clear database:', error);
            process.exit(1);
        });
}

module.exports = { clearDatabase }; 