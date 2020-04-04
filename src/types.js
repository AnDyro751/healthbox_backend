const {mergeTypes, fileLoader} = require('merge-graphql-schemas');
const path = require("path");
const typesArray = fileLoader(path.join(__dirname, "./generated"));
module.exports.merginTypes = () => {
    const typeDefs = mergeTypes(typesArray, {all: true});
    return typeDefs
}
