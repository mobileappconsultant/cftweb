import { gql } from '@apollo/client';


export const GET_ALL_BIBLE_VERSIONS = gql`
  query VersionDTO {
    getBibleBookVersions {
      translation
    }
  }
`;
export const GET_ALL_BRANCHES = gql`
  query BranchDTO {
    getAllBranch {
      _id
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
// Dashboard
export const DASHBOARD_USER_COUNT = gql`
  query DashboardUserCountDTO {
    dashboardUserCount {
      totalNumberOfAdmins
      totalNumberOfActiveUsers
      totalNumberOfSuspendedUsers
    }
  }
`;
// query DashboardGraphDTO ($startDate: String! $endDate: String!) {
//   dashBoardGraph(startDate:$startDate endDate:$endDate) {
//     totalDonations
//     totalOfferings
//     totalWelfare
//   }
// }
export const DASHBOARD_GET_REVENUE = gql`
  query DashboardGraphDTO ($startDate: String! $endDate: String!) {
    dashBoardGraph(startDate:$startDate endDate:$endDate) {
      totalDonations
      totalOfferings
      totalWelfare
    }
  }
`;

// Groups
export const GET_ALL_GROUPS = gql`
  query GroupDTO {
    getAllGroups {
      _id
      name
      group_head
      members{
        email
        _id
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
      _id
      name
      group_head
      members{
        email
        _id
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
      id
      email
      phone
      full_name
      avatar
      role{
        id
        name
        permissions{
          id
          name
          description
          module
        }
      }
      status
      createdAt
      updatedAt
    }
  }
`;

// Admins
export const GET_ALL_INVITED_ADMINS = gql`
  query AdminDTO{
    getAllInvitedAdmin{
      email
      phone
      full_name
      role{
        id
        name
        permissions{
          id
          name
          description
          module
        }
      }
      status
      createdAt
      updatedAt
    }
  }
`;

// Roles
export const GET_ALL_ROLES = gql`
  query RoleDTO{
    getRoles{
      id
      name
    }
  }
`;
export const GET_SINGLE_ROLE = gql`
  query RoleDTO($id: String!){
    getRole(id:$id){
      id
      name
      permissions{
        id
        name
        description
        module
        moduleName
      }
    }
  }
`;

export const GET_ALL_PERMISSIONS = gql`
  query PermissionDTO{
    getPermissions{
      id
      name
      description
      module
      moduleName
    }
  }
`;

// Members
export const GET_ALL_MEMBERS = gql`
  query UserDTO($page: Float! $limit: Float!){
    getAllUser(page:$page limit:$limit ){
      _id
      email
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
export const GET_SINGLE_MEMBER = gql`
  query UserDTO($userID: String!){
    getUser(userID: $userID){
      _id
      email
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
  query ApostleDeskDTO($flag: String! $page: Float! $limit: Float!){
    getAllMessages(flag:$flag page:$page limit:$limit ){
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
      published
      minuteRead
      createdAt
      updatedAt
      
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

export const GET_BIBLE_PASSAGE = gql`
  query VerseDTO ($verse: String! $chapter: String! $book: String! $version:String!) {
    getBibleBookVerse(verse: $verse chapter:$chapter book:$book version:$version) {
      num
      text
    }
  }
`;

export const GET_BIBLE_FULL_CHAPTER = gql`
  query ChapterDTO ($chapter: String! $book: String! $version:String!) {
    getBibleBookChapter( chapter:$chapter book:$book version:$version) {
      verse{
        num
        text
        }
      num
    }
  }
`;

// Prayers
export const GET_ALL_PRAYERS = gql`
query PrayerDTO ($flag: String! $page: Float! $limit: Float!){
  getAllPrayers (flag:$flag page:$page limit:$limit ){
    _id
    title
    subtitle
    preface
    image
    author
    dailyPrayers{
      _id
      day
      subtitle
      scripture {
        text
        refrence
      }
      heading
      content
      supportingVerse{
        text
        refrence
      }
      prayer_points
      prayerMannerId
      published
      createdAt
      updatedAt
    }
    published
    createdAt
    updatedAt
  }
}
`;

export const GET_SINGLE_PRAYER = gql`
query PrayerDTO  ($prayerId: String!) {
  getPrayer(prayerId: $prayerId) {
    _id
    title
    subtitle
    author
    preface
    dailyPrayers{
        _id
        day
        subtitle
        scripture {
          text
          refrence
        }
        heading
        content
        supportingVerse{
          text
          refrence
        }
        prayer_points
        prayerMannerId
        published
        createdAt
        updatedAt
    }
    createdAt
  }
}
`;

// BIBLE STUDY
export const GET_ALL_BIBLE_STUDY_CONTENT = gql`
query BibleStudyDTO($flag: String! $page: Float! $limit: Float!){
  getAllBibleStudyContent(flag:$flag page:$page limit:$limit ){
      _id
      topic
      minister
      memoryVerse{
        text
        refrence
      }
      message
      published
      createdAt
      updatedAt
    }
  }
`;

export const GET_SINGLE_BIBLE_STUDY_CONTENT = gql`
  query BibleStudyDTO($bibleStudyContentId: String!) {
    getBibleStudyContent(bibleStudyContentId: $bibleStudyContentId) {
      _id
      topic
      minister
      memoryVerse{
        text
        refrence
      }
      publishedAt
      message
      createdAt
    }
  }
`;

// SERMONS
export const  GET_ALL_SERMONS = gql`
query SermonDTO($flag: String! $page: Float! $limit: Float!){
  getAllSermons(flag:$flag page:$page limit:$limit ){
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
    published
    minuteRead
    createdAt
    updatedAt
    
  }
}
`;

export const  GET_SINGLE_SERMON = gql`
query SermonDTO($messageId: String!) {
  getSermon(messageId: $messageId) {
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
    published
    minuteRead
    createdAt
    updatedAt
  }
}
`;
// Pastors forum
export const  GET_ALL_PASTORS_FORUM_MESSAGES = gql`
query PastorForumDTO($flag: String! $page: Float! $limit: Float!){
  getAllMessagesFromPastorForum(flag:$flag page:$page limit:$limit ){
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
    published
    minuteRead
    createdAt
    updatedAt
    
  }
}
`;

export const  GET_SINGLE_PASTORS_FORUM_MESSAGE = gql`
query PastorForumDTO($id: String!){
  getMessageDetailFromPastorForum(id:$id ){
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
    published
    minuteRead
    createdAt
    updatedAt
    
  }
}
`;
// Daily bible reading

export const  GET_ALL_DAILY_BIBLE_READING = gql`
query DailyBibleReadingDTO($flag: String! $page: Float! $limit: Float!){
  getAllDailyBibleContent(flag:$flag page:$page limit:$limit ){
    _id
    verseContent
    verseOfTheDayText
    bibleText
    published
    publishedAt
    createdAt
    updatedAt
  }
}
`;

export const  GET_SINGLE_DAILY_BIBLE_READING = gql`
query DailyBibleReadingDTO($biibleReadingContentId: String!){
  getDailyBibleContent(biibleReadingContentId:$biibleReadingContentId ){
    _id
    verseContent
    verseOfTheDayText
    bibleText
    published
    publishedAt
    createdAt
    updatedAt
  }
}
`;
// Calendar/events
export const GET_ALL_EVENTS = gql`
  query EventDTO{
    getEvents{
      _id
      eventName
      startDate
      endDate
      time
      repeat
      repeatId
      createdAt
      updatedAt
      
    }
  }
`;

export const GET_SINGLE_EVENT = gql`
  query EventDTO($eventID: String!){
    getEvent(eventID:$eventID ){
      _id
      eventName
      startDate
      endDate
      time
      repeat
      repeatId
      childEvents{
        _id
        eventTheme
        day
        time
        eventId
        createdAt
        updatedAt
        }
      createdAt
      updatedAt
    }
  }
`;

// Transactions
export const GET_ALL_TRANSACTIONS = gql`
  query TransactionDTO($page: Float! $limit: Float!  $status: String! $paymentMethod: String! $paymentType: String! ){
    getAllTransactions(page:$page limit:$limit  status:$status paymentMethod: $paymentMethod paymentType: $paymentType ){
      _id
      paymentType
      transactionId
      amount
      paymentPlatform
      transactionDate
      status
    }
  }
`;