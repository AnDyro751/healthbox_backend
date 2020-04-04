module.exports = (prisma, _, args, ctx) => {
    return prisma.createUser({...args.data})
}

