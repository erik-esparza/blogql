import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://revenuehunt.local/graphql",
});

const authLink = setContext((_, { headers }) => {
  // Manually add the JWT token to the headers
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vcmV2ZW51ZWh1bnQubG9jYWwiLCJpYXQiOjE3MTgzMjQzNjIsIm5iZiI6MTcxODMyNDM2MiwiZXhwIjoxNzE4OTI5MTYyLCJkYXRhIjp7InVzZXIiOnsiaWQiOiIxIn19fQ.qMtUZEk9M8pNpnE2Q1JEPgCqpGMImz62pySh6lZvd4M"; // Replace with your actual JWT token
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
