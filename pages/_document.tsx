import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import Favicon from "../components/Favicon";
import theme from "../theme";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Favicon />
        <meta property="og:title" content="Youtube Playlist To Notion" />
        <meta
          property="og:description"
          content="Watch your favorite Youtube playlist without leaving Notion."
        />
        <meta
          name="description"
          content="Watch your favorite Youtube playlist without leaving Notion."
        />
        <meta charSet="utf-8" />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
