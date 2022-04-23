interface LoggedInUserObject {
    code?: string 
    createdAt?: string
    email?: string
    full_name?: string
    phone?: string
    role?: string
    status?: boolean
    updatedAt?: boolean
    __v?: number
    _id?: string,
    avatar?: string
  }
  
  type AuthState = {
    userObject: LoggedInUserObject
  }
  
  type AuthAction = {
    type: string
    userObject: LoggedInUserObject
  }
  
  type DispatchType = (args: AuthAction) => AuthAction