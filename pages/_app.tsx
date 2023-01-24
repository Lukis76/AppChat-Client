import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import "@styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import { client } from "graphQL/apollo-client";
import { Toaster } from "react-hot-toast";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
// import es from 'javascript-time-ago/locale/es-AR.json'
import { AuthUserProvider } from "context/authContext";

// TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(en);

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
  return (
    <AuthUserProvider>
      <ApolloProvider client={client}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
          <Toaster />
        </SessionProvider>
      </ApolloProvider>
    </AuthUserProvider>
  );
}
