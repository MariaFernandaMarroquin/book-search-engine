import { gql } from '@apollo/client';

export const QUERY_ME = gql `
query me {
    user {
        _id
        username
        email
        bookCount
        savedBooks {
            authors
            description
            bookId
            image
            link
            title
        }
    }
}
`
