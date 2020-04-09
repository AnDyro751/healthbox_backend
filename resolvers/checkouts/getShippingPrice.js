const {AuthenticationError, ForbiddenError} = require("apollo-server-errors")


module.exports = async (prisma, request) => {
    const {customerId} = request;
    if (!customerId) {
        return new AuthenticationError("Ha ocurrudo un error, intenta de nuevo");
    }
    const customer = await prisma.customer({
        id: customerId
    })
    if (!customer) {
        return new AuthenticationError("Ha ocurrido un error, intenta de nuevo");
    }
    let total_weight = 0
    const line_items = await prisma.lineItems({
        where: {
            customer: {
                id: customerId
            }
        }
    })

    line_items.map(async (li) => {
        const product = await prisma.lineItem({id: li.id}).product()
        total_weight += product.people
        console.log("TOTAL", total_weight, product.people)
    })

    console.log("KKK", total_weight);
    return {price: 0}
}