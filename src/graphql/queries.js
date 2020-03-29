import gql from 'graphql-tag'
import unionBy from 'lodash/unionBy'
import differenceBy from 'lodash/differenceBy'

export const VOLUNTEER = gql`
query volunteer ($id: Int!) {
  volunteers_by_pk(id: $id) {
    id
    joined_at
    first_name
    last_name
    email
    phone
    street
    city
  }
}`

export const VOLUNTEER_LIST = gql`
query volunteerList (
  $offset: Int!,
  $limit: Int!
) {
  volunteers(
    order_by: {last_name: asc, first_name: asc},
    limit: $limit,
    offset: $offset
  ) {
    id
    first_name
    last_name
    volunteer_shows_aggregate {
      aggregate {
        count
      }
    }
  }
}`

export const SEARCH_VOLUNTEER_LIST = gql`
query searchVolunteerList (
  $offset: Int!,
  $limit: Int!,
  $first_name: String!,
  $last_name: String!
) {
  volunteers(where: {
    _and: [
      {_or: [
        {first_name: {_ilike: $first_name}},
        {last_name: {_ilike: $first_name}}
      ]},
      {_or: [
        {first_name: {_ilike: $last_name}},
        {last_name: {_ilike: $last_name}}
      ]},
    ]},
    order_by: {last_name: asc, first_name: asc},
    limit: $limit,
    offset: $offset
  ) {
    id
    first_name
    last_name
    volunteer_shows_aggregate {
      aggregate {
        count
      }
    }
  }
}`

export const VOLUNTEER_POSITIONS = gql`
query existingPositions ($volunteer_id: Int!, $show_id: Int!) {
  positions (
    where: {
      show_id: { _eq: $show_id },
      volunteer_id: { _eq: $volunteer_id } },
    order_by: { job: { name: asc } }
  ) {
    id
    job {
      id
      name
    }
    hours
    points
  }
}`

export const VOLUNTEER_WITH_JOBS_AND_SHOWS = gql`
query volunteer($id: Int!) {
  volunteers_by_pk(id: $id) {
    id
    joined_at
    first_name
    last_name
    email
    phone
    street
    city
    volunteer_shows {
      points
      show {
        id
        name
        occurred_at
        positions (where: {volunteer_id: {_eq: $id}}) {
          job {
            id
            name
            points
          }
        }
      }
    }
  }
}`

export const cache = {
  setData (store, results, returningKey) {
    this.store = store
    this.fullResults = results
    this.results = this.fullResults.data[returningKey].returning
  },

  updateCache (query, variables, updateHandler) {
    const results = this.store.readQuery({ query: query, variables: variables })
    const data = updateHandler(results, this.results)
    this.store.writeQuery({ query, variables, data })
  },

  onDeletePosition (store, results) {
    this.setData(store, results, 'delete_positions')
    const volunteerId = this.results[0].volunteer_id
    const showId = this.results[0].show_id

    this.updateCache(
      VOLUNTEER_POSITIONS,
      { volunteer_id: volunteerId, show_id: showId },
      (queryResults, mutationResults) => {
        return { positions: differenceBy(queryResults.positions, mutationResults, 'id') }
      }
    )

    this.updateCache(
      VOLUNTEER_WITH_JOBS_AND_SHOWS,
      { id: volunteerId },
      (queryResults, mutationResults) => {
        const positions = queryResults.volunteers_by_pk.positions
        const newPositions = differenceBy(positions, mutationResults, 'id')
          .sort((a, b) => a.job.name.localeCompare(b.job.name))
        return { volunteers_by_pk: { ...queryResults.volunteers_by_pk, positions: newPositions } }
      }
    )
  },

  onAddPosition (store, results) {
    this.setData(store, results, 'insert_positions')
    const volunteer = this.results[0].volunteer
    const showId = this.results[0].show.id

    this.updateCache(
      VOLUNTEER_POSITIONS,
      { volunteer_id: volunteer.id, show_id: showId },
      (queryResults, mutationResults) => {
        const newPositions = unionBy(mutationResults, queryResults.positions, 'id')
          .sort((a, b) => a.job.name.localeCompare(b.job.name))
        return { positions: newPositions }
      }
    )

    this.updateCache(
      VOLUNTEER_WITH_JOBS_AND_SHOWS,
      { id: volunteer.id },
      (queryResults, mutationResults) => {
        const newPositions = unionBy(mutationResults, queryResults.volunteers_by_pk.positions, 'id')
          .sort((a, b) => -a.show.occurred_at.localeCompare(b.show.occurred_at))
        return { volunteers_by_pk: { ...queryResults.volunteers_by_pk, positions: newPositions } }
      }
    )
  }
}
