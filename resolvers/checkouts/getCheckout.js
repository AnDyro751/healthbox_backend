const {AuthenticationError, ForbiddenError} = require("apollo-server-errors");
const {v4} = require("uuid")
const stripe = require('stripe')('sk_test_G0SpvEsAzOLHpOXBh7QI7Vvp00XSWZ52NN');
module.exports = async (prisma, args, request) => {
    const {customerId} = request;
    if (!customerId) {
        return new ForbiddenError("Ha ocurrido un error, intenta de nuevo")
    }
    const customer = prisma.customer({id: customerId})
    if (!customer) {
        return new AuthenticationError("Ha ocurrido un error, intenta de nuevo")
    }
    const line_items = await prisma.lineItems({
        where: {
            customer: {
                id: customerId,
            },
        }
    });
    if (line_items.length <= 0) {
        return new Error("Aún no tienes productos en el carrito")
    }
    let all_products = []
    //     [{
    //     name: 'T-shirt',
    //     description: 'Comfortable cotton t-shirt',
    //     images: ['https://example.com/t-shirt.png'],
    //     amount: 5000,
    //     currency: 'mxn',
    //     quantity: 1,
    // }]
    line_items.map((pr)=>{
        all_products.push({
            name: pr.product()
        })
    })
    console.log("PROD", products)
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
            success_url: `https://example.com/success/${lastPendingCheckout[0].uuid}`,
            cancel_url: 'https://example.com/cancel',
        });
        return {checkout: lastPendingCheckout[0], stripe_token: session.id}

    } else {
        const new_checkout = prisma.createCheckout({
            uuid: v4(),
            customer: {
                connect: {
                    id: customerId
                }
            }
        })
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                name: 'T-shirt',
                description: 'Comfortable cotton t-shirt',
                images: ['https://example.com/t-shirt.png'],
                amount: 5000,
                currency: 'mxn',
                quantity: 1,
            }],
            success_url: `https://example.com/success/${new_checkout.uuid}`,
            cancel_url: 'https://example.com/cancel',
        });
        return {checkout: new_checkout, stripe_token: session.od}
        // CREAMOS UN NUEVO CHECKOUT
    }
}