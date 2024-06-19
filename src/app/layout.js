"use client";

import "./globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "../lib/client";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>My Blog</title>
      </head>
      <body>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </body>
    </html>
  );
}
