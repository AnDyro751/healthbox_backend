// ADD LINE ITEMS
// POR CADA ARTICULO QUE SE AGREGUÉ SE VA A AGREGAR UN LINE ITEM O SE VA A ACTUALIZAR SI ES QUE YA HAY UNO
// SE BUSCA EL REGISTRO PARA SABER SI EXISTE UN LINE ITEM
// SE VERFICIA EL LINE ITEM
// SE ACTUALIZA O SE CREA EL LINE ITEM
const {AuthenticationError, ForbiddenError} = require("apollo-server-errors");


module.exports = async (prisma, args, request) => {
    const {customerId} = request;
    console.log("OPERATION", args)
    const {operation, product_id} = args.data
    if (!customerId || !product_id) {
        return new ForbiddenError("Ha ocurrido un error, intenta de nuevo");
    }
    const customer = await prisma.customer({id: customerId});
    if (!customer) {
        return new ForbiddenError("Ha ocurrido un error, intenta de nuevo");
    }
    const product = await prisma.product({id: product_id})
    if (!product) {
        return new ForbiddenError(("El producto que deseas agregar ya no está disponible"))
    }
    // {customer: {id: customerId}, product: {id: args.data.product_id}}
    const recordExist = await prisma.lineItems({
        where: {
            customer: {
                id: customerId
            },
            product: {
                id: product_id
            }
        }
    })
    if (recordExist.length <= 0 && operation === "DELETE") {
        return new Error("No puedes borrar este elemento")
    }
    if (recordExist.length > 0) {
        // ACTUALIZAR EL RECORD
        const currentRecord = recordExist[0];
        const new_line_item = await prisma.updateLineItem({
            where: {
                id: currentRecord.id
            },
            data: {
                quantity: operation === "ADD" ? currentRecord.quantity += 1 : currentRecord.quantity -= 1

            }
        })
        const new_customer = await prisma.updateCustomer({
            where: {
                id: customerId
            },
            data: {
                lienItemCount: operation === "ADD" ? customer.lienItemCount += 1 : customer.lienItemCount -= 1
            }
        });
        return {product: product, customer: new_customer}
    } else {

        // SE VA A CREAR EL LINE ITEM
        const new_customer = await prisma.updateCustomer({
            where: {
                id: customerId
            },
            data: {
                lienItemCount: customer.lienItemCount += 1
            }
        });
        const line_item = await prisma.createLineItem({
            product: {
                connect: {
                    id: args.data.product_id
                }
            },
            customer: {
                connect: {
                    id: customerId
                }
            }
        })
        return {product: product, customer: new_customer}
    }
}