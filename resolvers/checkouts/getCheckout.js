const {AuthenticationError, ForbiddenError} = require("apollo-server-errors");
const {v4} = require("uuid")
module.exports = async (prisma, args, request) => {
    const {customerId} = request;
    if (!customerId) {
        return new ForbiddenError("Ha ocurrido un error, intenta de nuevo")
    }
    const customer = prisma.customer({id: customerId})
    if (!customer) {
        return new AuthenticationError("Ha ocurrido un error, intenta de nuevo")
    }
    const lastPendingCheckout = await prisma.checkouts({
        where: {
            customer: {
                id: customerId
            },
            status: "PENDING"
        }
    })
    if (lastPendingCheckout.length > 0) {
        // RETORNAMOS EL CHECKOUT QUE YA SE HA CREADO
        return {checkout: lastPendingCheckout[0]}
    } else {
        const new_checkout = prisma.createCheckout({
            uuid: v4(),
            customer:{
                connect:{
                    id: customerId
                }
            }
        })
        return {checkout: new_checkout}
        // CREAMOS UN NUEVO CHECKOUT
    }
}