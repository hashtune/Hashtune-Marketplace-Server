import { prisma } from '../singletons/prisma';

export default async function getGlobalData() {
    const users = await prisma.user.findMany({});
    const artworks = await prisma.artwork.findMany({});
    if (!users || !artworks) throw new Error("Unable to set up global data");
    return { users, artworks }
}