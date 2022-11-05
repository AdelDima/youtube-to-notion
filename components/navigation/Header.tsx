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
  ColorModeScript,
} from "@chakra-ui/react";

export interface IHeader extends React.ComponentPropsWithoutRef<"header"> {}

const Header: React.FC<IHeader> = ({ className, ...headerProps }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box as="nav">
      <Container maxW={"7xl"} p={{ base: 4, sm: 6, md: 8 }}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Menu>
                <Link href="https://twitter.com/TahriAdel" isExternal>
                  <Avatar size={"lg"} src={"/avatar.svg"} />
                </Link>
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
