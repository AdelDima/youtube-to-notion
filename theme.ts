// theme.ts

// 1. import `extendTheme` function
import {
  defineStyle,
  defineStyleConfig,
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
} from "@chakra-ui/react";

const notionButton = defineStyle({
  background: "#e16259",
  color: "white",
  fontWeight: "500",
  // _dark: {
  //   background: "#e16259",
  //   color: "#FFFFFF",
  // },
});

export const buttonTheme = defineStyleConfig({
  variants: { notionButton },
});

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

// 3. extend the theme
const theme = extendTheme(
  {
    config,
  },
  { components: { Button: buttonTheme } }
);

export default theme;
