const getCheckout = require("./checkouts/getCheckout");
const currentCustomer = require("./customers/currentCustomer");
const addLineItem = require("./line_items/addLineItem");
const createProduct = require("./products/createProduct")
const signUpUser = require("./users/signUpUser")
const {prisma} = require("../generated/prisma-client");

module.exports.resolvers = {
	Query: {
		currentCustomer: (_, __, {request}) => {
			return currentCustomer(prisma, request);
		},
		users: async (_, args) => {
			return prisma.users({...args})
		},
		customer: (_, args) => {
			return prisma.customer({...args.where})
		},
		// LINE ITEMS
		lineItems: (_, args) => {
			return prisma.lineItems({...args})
		},
		// PRODUCTS
		products: (_, args) => {
			return prisma.products({...args})
		},
		customers: (_, args) => {
			return prisma.customers({...args})
		},
	},
	Customer: {
		line_items: async (parent) => {
			return prisma.customer({id: parent.id}).line_items()
		},
	},
	LineItem: {
		product: async (parent) => {
			const product = await prisma.lineItem({id: parent.id}).product()
			console.log("PROD",product)
			return product
		}
	},

	// MUTATIONS
	Mutation: {
		// CHECKOUTS
		getCheckout: (_, args, {request}) => {
			return getCheckout(prisma, args, request)
		},
		addLineItem: (_, args, {request}) => {
			return addLineItem(prisma, args, request);
		},
		signUpUser: (_, args, {request}) => {
			return signUpUser(prisma, _, args, request);
		},
		updateUser: (_, args) => {
			return prisma.updateUser(args)
		},
		deleteManyUsers: async (_, args) => {
			return prisma.deleteManyUsers(args.where)
		},
		// PRODUCTS
		createProduct: async (_, args, ctx) => {
			return createProduct(prisma, _, args, ctx);
		},
		deleteProduct: async (_, args) => {
			await prisma.deleteManyLineItems({
				product: {
					id: args.where.id
				}
			});
			return prisma.deleteProduct({...args.where})
		},
		updateProduct: async (_, args) => {
			await prisma.updateProduct(args)
		},
		// CUSTOMERS
		createCustomer: (_, args) => {
			return prisma.createCustomer({...args.data})
		},
		updateCustomer: async (_, args) => {
			await prisma.updateCustomer(args)
		},
		deleteManyCustomers: async (_, args) => {
			await prisma.deleteManyCheckouts({
				customer: {
					id_not_contains: "jasjabsna"
				}
			})
			return prisma.deleteManyCustomers(args.where)
		},
	}
}