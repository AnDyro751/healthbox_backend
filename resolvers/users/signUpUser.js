const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {AuthenticationError, ForbiddenError} = require("apollo-server-errors");


module.exports = async (prisma, _, args, request) => {
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

    const otherUser = await prisma.$exists.user({email: args.data.email});
    if (otherUser) {
        return new AuthenticationError("errors.users.same_email")
    }

    const password = await bcrypt.hash(args.data.password, 10)
    const new_user = await prisma.createUser({...args.data, password})
    const token = jwt.sign({userId: new_user.id}, "demo_secret")
    return {user: new_user, token: token}
}