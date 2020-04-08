const jwt = require('jsonwebtoken')


module.exports = async (prisma, request) => {
    console.log("HOLA", request.access_token)
    const {customerId, access_token} = request;
    if (!customerId) {
        // SE VA A CREAR UN NUEVO USUARIO ANONIMO Y SE VA A RETORNAR EL TOKEN  Y EL CUSTOMER ID

        const customer = await prisma.createCustomer({lienItemCount: 0})
        const token = jwt.sign({customerId: customer.id}, "demo_secret")
        return {customer, token}
    } else {
        try {
            // SE PRUEBA SI EL TOKEN SE PUEDE DESENCRIPTAR, SI LO HACE ENTONCES SE REALIZA UNA BUSQUEDA DEL CUSTOMER
            // SI LO ENCUENTRA RETORNA EL CUSTOMER, DE LO CONTRARIO SE CREA UNO NUEVO
            const {customerId} = jwt.verify(access_token, "demo_secret");
            const customer = await prisma.customer({id: customerId})
            if (customer) {
                return {customer, token: access_token}
            } else {
                const customer = await prisma.createCustomer({lienItemCount: 0})
                const token = jwt.sign({customerId: customer.id}, "demo_secret")
                return {customer, token}
            }
        } catch (e) {
            const customer = await prisma.createCustomer({lienItemCount: 0})
            const token = jwt.sign({customerId: customer.id}, "demo_secret")
            return {customer, token}
        }
    }
}