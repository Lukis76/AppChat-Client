import type { AppProps } from "next/app";
import "@styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import { client } from "graphQL/apollo-client";
import { Toaster } from "react-hot-toast";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
// import es from 'javascript-time-ago/locale/es-AR.json'
import { AuthUserProvider } from "context/authUserProvider";
import { Refresh } from "@components/refresh";

// TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(en);

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <AuthUserProvider>
      <ApolloProvider client={client}>
        <Refresh>
          <Component {...pageProps} />
          <Toaster />
        </Refresh>
      </ApolloProvider>
    </AuthUserProvider>
  );
}
