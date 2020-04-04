const {AuthenticationError, ForbiddenError} = require("apollo-server-errors");

module.exports = async (prisma, _, args, {request}) => {
    const {userId} = request;
    if (userId === null || userId === "" || userId === undefined) {
        return new AuthenticationError("Inicia sesión para continuar")
    }
    const user = await prisma.user({id: userId})

    if (!user) {
        return new AuthenticationError("Inicia sesión para continuar")
    }
    if (!user.is_admin) {
        return new AuthenticationError("Inicia sesión para continuar")
    }
    return prisma.createProduct({...args.data})
}