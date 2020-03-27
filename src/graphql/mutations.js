import gql from 'graphql-tag'

export const INSERT_VOLUNTEER = gql`
mutation insertVolunteer (
  $first_name: String!,
  $last_name: String!,
  $email: String,
  $phone: String,
  $street: String,
  $city: String
) {
  insert_volunteers(
    objects: {
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      phone: $phone,
      street: $street,
      city: $city
    },
  ) {
    returning {
      id
    }
  }
}`

export const UPDATE_VOLUNTEER = gql`
mutation updateVolunteer (
  $id: Int!,
  $first_name: String!,
  $last_name: String!,
  $email: String,
  $phone: String,
  $street: String,
  $city: String
) {
  update_volunteers(
    where: {id: {_eq: $id}},
    _set: {
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      phone: $phone,
      street: $street,
      city: $city
    },
  ) {
    returning {
      id
    }
  }
}`
