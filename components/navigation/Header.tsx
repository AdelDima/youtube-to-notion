import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  useColorModeValue,
  useColorMode,
  VisuallyHidden,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { FaGithub, FaTwitter } from "react-icons/fa";

export interface IHeader extends React.ComponentPropsWithoutRef<"header"> {}

const Header: React.FC<IHeader> = ({ className, ...headerProps }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const SocialButton = ({
    children,
    label,
    href,
  }: {
    children: ReactNode;
    label: string;
    href: string;
  }) => {
    return (
      <Button
        bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
        rounded={"full"}
        w={12}
        h={12}
        cursor={"pointer"}
        as={"a"}
        href={href}
        display={"inline-flex"}
        alignItems={"center"}
        justifyContent={"center"}
        transition={"background 0.3s ease"}
        _hover={{
          bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
        }}
      >
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </Button>
    );
  };
  return (
    <Box as="nav">
      <Container
        maxW={"6xl"}
        p={{ base: 8, sm: 6, md: 8 }}
      >
        <Flex h={6} alignItems={"center"} justifyContent={"space-between"}>
          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={5}>
              <Menu>
                <Link href="https://twitter.com/TahriAdel" isExternal>
                  <Avatar size={"md"} src={"/avatar.svg"} />
                </Link>
                <Stack direction={"row"} spacing={3}>
                  <SocialButton
                    label={"Twitter"}
                    href={"https://twitter.com/TahriAdel"}
                  >
                    <FaTwitter />
                  </SocialButton>
                  <SocialButton label={"Github"} href={"https://github.com/AdelDima/youtube-to-notion"}>
                    <FaGithub />
                  </SocialButton>
                </Stack>
              </Menu>
            </Stack>
          </Flex>
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
