/* eslint-disable @next/next/no-document-import-in-page */
import { Html, Head, Main, NextScript } from "next/document";
import { generateNonce } from "../lib/nonce";

export default function Document() {
  const nonce = generateNonce();

  return (
    <Html lang="en">
      <Head nonce={nonce} />
      <body>
        <Main />
        <NextScript nonce={nonce} />
      </body>
    </Html>
  );
}
