// theme.ts

// 1. import `extendTheme` function
import {
  createMultiStyleConfigHelpers,
  defineStyle,
  defineStyleConfig,
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
} from "@chakra-ui/react";
import { switchAnatomy } from "@chakra-ui/anatomy";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style

  thumb: {
    bg: "gray.500",
    _checked: {
      bg: "gray.100",
    },
  },
  track: {
    bg: "gray.50",
    _checked: {
      bg: "#e16259",
    },
  },

});

export const switchTheme = defineMultiStyleConfig({ baseStyle });

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
  { components: { Button: buttonTheme, Switch: switchTheme } }
);

export default theme;
