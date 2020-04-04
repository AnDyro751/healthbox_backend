module.exports = (prisma, _, args, ctx) => {
    return prisma.users(args)
}
