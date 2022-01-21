import { gql } from '@apollo/client';

export const GET_ALL_BRANCHES = gql`
  query BranchDTO {
    getAllBranch {
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

// Groups
export const GET_ALL_GROUPS = gql`
  query GroupDTO {
    getAllGroups {
      id
      name
      group_head
      members{
        email
        userID
        phone
        full_name
        church_group
        branch
        country
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;


export const GET_SINGLE_GROUP = gql`
  query GroupDTO ($groupId: String!) {
    getGroup(groupId: $groupId) {
      id
      name
      group_head
      members{
        email
        userID
        phone
        full_name
        church_group
        branch
        country
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

// Admins
export const GET_ALL_ADMINS = gql`
  query AdminDTO{
    getAllAdmin{
      email
      password
      phone
      full_name
      role
      status
      createdAt
      updatedAt
    }
  }
`;


// Members
export const GET_ALL_MEMBERS = gql`
  query UserDTO{
    getAllMembers{
      email
      userID
      phone
      full_name
      church_group
      code
      avartar
      branch
      country
      account_verification
      reset_password
      status
      createdAt
      updatedAt
    }
  }
`;

// Messages
export const GET_ALL_MESSAGES = gql`
  query MessageDTO{
    getMessages{
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
      createdAt
    }
  }
`;

export const GET_SINGLE_MESSAGE = gql`
  query MessageDTO ($messageId: String!) {
    getMessage(messageId: $messageId) {
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
      createdAt
    }
  }
`;

export const GET_MESSAGE_CONTENT = gql`
  query ContentDTO ($messageId: String!) {
    getContents(messageId: $messageId) {
      _id
      subtitle
      paragraphs
      message{
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
        createdAt
      }
      image
      prayer_point
      status
    }
  }
`;