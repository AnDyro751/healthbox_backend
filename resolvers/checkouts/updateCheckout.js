const {AuthenticationError, ForbiddenError} = require("apollo-server-errors")

module.exports = async (prisma, args, request) => {
		const {customerId} = request;
		if (!customerId) {
			return new ForbiddenError("Ha ocurrido un error, intenta de nuevo")
		}
		const customer = prisma.customer({id: customerId})
		if (!customer) {
			return new AuthenticationError("Ha ocurrido un error, intenta de nuevo")
		}

		const checkout = await prisma.checkouts({
			where: {
				customer: {
					id: customerId
				},
				uuid: args.where.id
			}
		})
		if (checkout[0]) {
			if (checkout[0].status === 'PENDING') {
				const lineItems = await prisma.lineItems({
					where: {
						customer: {
							id: customerId
						}
					}
				})
				lineItems.forEach(async (item) => {
					await prisma.deleteLineItem({
						id: item.id
					})
				})
				await prisma.updateCustomer({
					where: {
						id: customerId
					},
					data: {
						lienItemCount: 0
					}
				})
				await prisma.updateCheckout({
					data: {
						status: 'SUCCESS'
					},
					where: {
						id: checkout[0].id
					}
				})
			}
		}
	return checkout[0]
}