const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const foundUser = await User.findOne({
                    _id: context.user._id
                })
                return foundUser
            } else {
                throw AuthenticationError
            }
        }
    },

    Mutation: {
        login: async (parent, { email, password }, context) => {
            const user = await User.findOne({email})

            if (!user) {
                throw AuthenticationError
            } 

            const checkPassword = await user.isCorrectPassword(password)

            if (!checkPassword) {
                throw AuthenticationError
            } 

            const token = signToken(user)
            return {token, user}
        }, 

        addUser: async (parent, args, context) => {
            const user = await User.create(args);

            if (!user) {
                throw AuthenticationError
            }

            const token = signToken(user)
            return {token, user};
        },

        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $addToSet: { savedBooks: args }},
                    { new: true });
                    return updatedUser;
            } else {
                throw AuthenticationError
            }
        }, 

        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    { $pull: { savedBooks: {bookId: args.bookId} }},
                    { new: true });
                    return updatedUser;
            } else {
                throw AuthenticationError
            }
        }
    }
}


module.exports = resolvers;