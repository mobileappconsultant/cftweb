import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
// import { RestLink } from "apollo-link-rest";
import Cookies from 'js-cookie';
const httpLink = new HttpLink({
  uri: "https://admin.cftchurchesdevenvironment.xyz/graphql/",
});


const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from cookies.
  const token = Cookies.get('access-token');
  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? token : ''
    }
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});


export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  
});
