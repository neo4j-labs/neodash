export const GetSolutionById = `
  query GetSolutionById($id: ID!) {
    solution: getSolutionById(id: $id) {
      id
      name
      type
      image
      github
      readme
      domain
      dateCreated
      canCurrentUserEdit
      canCurrentUserDelete
      users {
        user {
          name
          email
          picture
        }
        role
      }
      tags {
        name
      }
      usecases {
        name
      }
      verticals {
        name
      }
      deployments {
        id
        url
        name
      }
    }
  }
`;
