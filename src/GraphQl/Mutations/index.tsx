   
import { gql } from "@apollo/client";


export const LOGIN = gql`
  mutation login($creds:  LoginInput!) {
    login(creds: $creds ) {
      token
      admin{
        email
        phone
        full_name
        code
        role
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_BRANCH = gql`
mutation createBranch($input:  BranchInput!) {
  createBranch(input: $input ) {
    id
    name
    branch_president
    geo_point{
      lat
      long
    }
    branch_address
    status
    createdAt
    updatedAt
  }
}
`;

export const UPDATE_BRANCH = gql`
  mutation createBranch($input:  BranchInput!) {
    createBranch(input: $input ) {
      id
      name
      branch_president
      geo_point{
        lat
        long
      }
      branch_address
      status
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_GROUP = gql`
mutation createGroup($input:  GroupInput!) {
  createGroup(input: $input ) {
    id
    name
    group_head
    createdAt
    updatedAt
  }
}
`;