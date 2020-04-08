const {AuthenticationError, ForbiddenError} = require("apollo-server-errors");
const {v4} = require("uuid")
const stripe = require('stripe')('sk_test_2kjNkDR7DADs6OGSuFBm2znb00AEw4nl5H');
module.exports = async (prisma, args, request) => {
    const {customerId} = request;
    if (!customerId) {
        return new ForbiddenError("Ha ocurrido un error, intenta de nuevo")
    }
    const customer = prisma.customer({id: customerId})
    if (!customer) {
        return new AuthenticationError("Ha ocurrido un error, intenta de nuevo")
    }
    let all_products = []

    const line_items = await prisma.lineItems({
        where: {
            customer: {
                id: customerId,
            },
        }
    })

    if (line_items.length <= 0) {
        return new Error("Aún no tienes productos en el carrito")
    }

    line_items.map(async (li) => {
        const product = await prisma.lineItem({id: li.id}).product()
        all_products.push({
            name: product.name,
            images: [product.image],
            amount: product.price * 100,
            quantity: li.quantity,
            currency: "mxn"
        })
    })
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
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: all_products,
            success_url: `http://localhost:3000/creando?complete=${lastPendingCheckout[0].uuid}`,
            cancel_url: 'http://healthbox.now.sh/cart'
        });
        return {checkout: lastPendingCheckout[0], stripe_token: session.id}

    } else {
        const new_checkout = await prisma.createCheckout({
            uuid: v4(),
            customer: {
                connect: {
                    id: customerId
                }
            }
        })
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: all_products,
            success_url: `http://localhost:3000/creando?complete=${new_checkout.uuid}`,
            cancel_url: 'http://healthbox.now.sh/cart'
        });
        return {checkout: new_checkout, stripe_token: session.id}
        // CREAMOS UN NUEVO CHECKOUT
    }
}