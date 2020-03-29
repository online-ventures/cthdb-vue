import gql from 'graphql-tag'

export const INSERT_VOLUNTEER = gql`
mutation insertVolunteer (
  $first_name: String!,
  $last_name: String!,
  $email: String,
  $phone: String,
  $street: String,
  $city: String,
  $notes: String,
  $all_star: Boolean
) {
  insert_volunteers(
    objects: {
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      phone: $phone,
      street: $street,
      city: $city,
      notes: $notes,
      all_star: $all_star
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
  $city: String,
  $notes: String,
  $all_star: Boolean
) {
  update_volunteers(
    where: {id: {_eq: $id}},
    _set: {
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      phone: $phone,
      street: $street,
      city: $city,
      notes: $notes,
      all_star: $all_star
    },
  ) {
    returning {
      id
    }
  }
}`
