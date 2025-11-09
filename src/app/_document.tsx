/* eslint-disable @next/next/no-document-import-in-page */
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentProps,
} from "next/document";
import { generateNonce } from "../lib/nonce";
import {
  buildCspWithNonce,
  CSP_NONCE_PLACEHOLDER,
} from "../../security-headers.mjs";

type DocumentPropsWithNonce = DocumentProps & { nonce: string };

class AppDocument extends Document<DocumentPropsWithNonce> {
  static async getInitialProps(ctx: DocumentContext) {
    const nonce = generateNonce();
    const cspNonceValue = "'nonce-" + nonce + "'";
    const response = ctx.res;
    if (response) {
      const originalSetHeader = response.setHeader.bind(response);
      response.setHeader = (name, value) => {
        if (
          typeof name === "string" &&
          name.toLowerCase() === "content-security-policy"
        ) {
          if (typeof value === "string") {
            return originalSetHeader(
              name,
              value.replaceAll(CSP_NONCE_PLACEHOLDER, cspNonceValue),
            );
          }

          if (Array.isArray(value)) {
            return originalSetHeader(
              name,
              value.map((entry) =>
                entry.replaceAll(CSP_NONCE_PLACEHOLDER, cspNonceValue),
              ),
            );
          }
        }

        return originalSetHeader(name, value);
      };

      const existingHeader = response.getHeader("Content-Security-Policy");
      if (typeof existingHeader !== "undefined") {
        response.setHeader("Content-Security-Policy", existingHeader);
      }
    }

    const initialProps = await Document.getInitialProps(ctx);

    if (response && !response.getHeader("Content-Security-Policy")) {
      response.setHeader(
        "Content-Security-Policy",
        buildCspWithNonce(nonce),
      );
    }

    return {
      ...initialProps,
      nonce,
    };
  }

  render() {
    const { nonce } = this.props;

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
}

export default AppDocument;
