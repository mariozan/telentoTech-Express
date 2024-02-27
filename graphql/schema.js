const { buildSchema } = require('graphql')

const schema = buildSchema(`
    type: User {
        id: ID!
        name: String!
        lastname: String!
        email: String!
        avatar: String!
    }
    type: Message {
        id: ID!
        body: String!
        from: User!
        to: User!
        readed: Boolean
    }
    type: House {
        id: ID!
        address: String!
        city: String!
        state: String!
        size: Int!
        type: String!
        zip_code: String!
        code: String!
        rooms: Int!
        bathrooms: Int!
        price: Int!
        image: String!
    }`)

module.exports = schema