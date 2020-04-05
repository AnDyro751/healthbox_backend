const createUser = require("./users/createUser");
const getCheckout = require("./checkouts/getCheckout");
const currentCustomer = require("./customers/currentCustomer");
const addLineItem = require("./line_items/addLineItem");
const getUsers = require("./users/getUsers");
const createProduct = require("./products/createProduct")
const signUpUser = require("./users/signUpUser")
const {prisma} = require("../generated/prisma-client");
const {addFragmentToInfo} = require('graphql-binding')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const uuid = require("uuid")

module.exports.resolvers = {
    Query: {
        currentCustomer: (_, args, {request}) => {
            return currentCustomer(prisma, request);
        },
        users: async (parent, args, ctx) => {
            return prisma.users({...args})
        },
        customer: (_, args) => {
            return prisma.customer({...args.where})
        },
        // PRODUCTS
        products: (_, args, ctx) => {
            return prisma.products({...args})
        },
        customers: (_, args) => {
            return prisma.customers({...args})
        }
    },
    Customer: {
        line_items: async (parent, args) => {
            return prisma.customer({id: parent.id}).line_items()
        },
    },
    LineItem: {
        product: (parent, args) => {
            return prisma.lineItem({id: parent.id}).product()
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
        updateUser: (_, args, ctx) => {
            return prisma.updateUser(args)
        },
        deleteManyUsers: async (_, args, ctx) => {
            return prisma.deleteManyUsers(args.where)
        },
        // PRODUCTS
        createProduct: async (_, args, ctx) => {
            return createProduct(prisma, _, args, ctx);
        },
        // CUSTOMERS
        createCustomer: (_, args, ctx) => {
            return prisma.createCustomer({...args.data})
        },
        deleteManyCustomers: async (_, args, ctx) => {
            return prisma.deleteManyCustomers(args.where)
        },
    }
}