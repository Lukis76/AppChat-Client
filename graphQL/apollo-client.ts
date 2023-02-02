import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
//
enum STORAGE {
  user = "user",
}

enum UTILS {
  uriGraphql = "http://localhost:4000/graphql",
  urlGraphqlSubs = "ws://localhost:4000/graphql/subscriptions",
}

type userStorage = {
  id: string;
  username: string;
  email: string;
  token: string;
};

//
const getStorage = () => {
  const storage =
    typeof window !== "undefined" && localStorage.getItem(STORAGE.user);
  const user: userStorage | null = storage && JSON.parse(storage);
  return user;
};
//
//
const httpLink = new HttpLink({
  uri: UTILS.uriGraphql,
  headers: {
    authorization: `Bearer: ${getStorage()?.token || ""}`,
  },
  credentials: "same-origin",
});
//////////////////////////////////////////
const authLink = setContext((_, { headers }) => {
  return {
    ...headers,
    authorization: `Bearer ${getStorage()?.token || ""}`,
  };
});

///////////////////////////////////////////////////////////
const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: UTILS.urlGraphqlSubs,
          connectionParams: { authToken: getStorage()?.token || null },
        })
      )
    : null;
///////////////////////////////////////////////////////////////////////////////

const splitLink =
  typeof window !== "undefined" && wsLink !== null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;
//////////////////////////////////////////////////////////////////////////////////////////////////////

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: UTILS.uriGraphql,
  headers: {
    authorization: `Bearer ${getStorage()?.token || ""}`,
  },
  link: authLink.concat(splitLink),
  // headers: authLink
  // connectToDevTools: true,
});
