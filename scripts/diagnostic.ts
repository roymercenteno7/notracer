import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- USER DATA DIAGNOSTIC ---');
    const users = await prisma.user.findMany({
        include: { _count: { select: { links: true } } }
    });

    console.table(users.map(u => ({
        id: u.id,
        email: u.email,
        links: u._count.links,
        createdAt: u.createdAt
    })));

    console.log('\n--- RECENT LINKS ---');
    const links = await prisma.link.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
    });
    console.table(links.map(l => ({
        slug: l.slug,
        userId: l.userId,
        createdAt: l.createdAt
    })));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
