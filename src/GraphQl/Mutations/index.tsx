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

export const INITIATE_FORGOT_PASSWORD = gql`
  mutation initiateForgotPassword($email:  String!) {
    initiateForgotPassword(email: $email ) {
      msg
    }
  }
`;

export const CONFIRM_PASSWORD = gql`
  mutation confirmPassword($new_password: String! $code: String!){
    confirmPassword(new_password: $new_password code: $code ) {
      msg
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

export const CREATE_MESSAGE = gql`
  mutation createMessage($input:  MessageInput!) {
    createMessage(input: $input ) {
      _id
      title
      minister
      image
      bibleReading{
        text
        refrence
      }
      message
      prayer_point
      category
      weekPublished
      monthPublished
      yearPublished

    }
  }
`;