import { gql } from "@apollo/client";

export const MESSAGE_IMAGE_UPLOAD = gql`
  mutation uploadMessageContentImage($messageId: String! $file: Upload!) {
    uploadMessageContentImage(messageId: $messageId file: $file) 
  }
`;
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
export const UPDATE_PROFILE = gql`
mutation updateadmin($input: AdminInput!){
  updateadmin(input: $input) {
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
`;

export const CREATE_ADMIN = gql`
  mutation register($input: AdminInput!){
      register(input: $input) {
        email
        phone
        full_name
        role
        status
        createdAt
        updatedAt
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

export const EDIT_MESSAGE = gql`
  mutation updateMessage($messageId: String! $input:  MessageInput!) {
    updateMessage(messageId: $messageId  input: $input ) {
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
// MESSAGES

export const CREATE_PRAYER = gql`
  mutation createPrayer($input: PrayerInput!) {
    createPrayer(input: $input ) {
      _id
      title
      subtitle
      content
      author
      monthPublished
      yearPublished
      createdAt
    }
  }
`;


