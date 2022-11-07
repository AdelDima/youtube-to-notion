import {
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  useColorModeValue,
  VStack,
  Text,
  Button,
  Divider,
  Switch,
  Center,
  Grid,
  Spacer,
} from "@chakra-ui/react";

import Header from "../components/navigation/Header";
import NotionAddApiForm from "../components/forms/notion/NotionAddApiForm";
import YModel from "../components/navigation/Modal/YModel";
import { motion } from "framer-motion";
import Glow from "../components/background/Glow";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Account from "../components/forms/notion/NotionWithAuth";
import { Icon, createIcon } from "@chakra-ui/react";
import { useState } from "react";

const NotionIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"
    />
  </Icon>
);
// export default theme;
export default function Home() {
  const [checkedItems, setCheckedItems] = useState([true, true]);
  const supabase = useSupabaseClient();
  const session = useSession();
  const textColor = useColorModeValue("gray.500", "gray.400");
  const headingColor = useColorModeValue("gray.800", "gray.50");
  const boxBg = useColorModeValue(
    "w-full rounded-lg border bg-gray-700 bg-opacity-[0.08] border-gray-400/10 backdrop-blur",
    "w-full rounded-lg border bg-gray-300 bg-opacity-[0.06] border-white/10 backdrop-blur"
  );

  const variants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
  };

  const setAuthEvent = (accessToken: string) => {
    if (typeof window !== "undefined")
      localStorage.setItem("authEvent", accessToken);
  };

  const getAuthEvent = () => {
    if (typeof window !== "undefined") return localStorage.getItem("authEvent");
  };

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event == "SIGNED_IN") {
      setAuthEvent(event);
    } else if (event == "SIGNED_OUT") {
      if (typeof window !== "undefined") localStorage.setItem("authEvent", "");
      if (typeof window !== "undefined")
        localStorage.setItem("loading", "true");
      if (typeof window !== "undefined")
        localStorage.setItem("provider_token", "");
      if (typeof window !== "undefined") localStorage.setItem("fullName", "");
    }
  });

  async function signIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "notion",
    });
    if (data && !error) true;
  }
  let props = {
    session: session,
    authEvent: getAuthEvent(),
  };
  return (
    <Box position={"relative"} className="h-screen lg:h-full">
      <Header />
      <Container
        as={SimpleGrid}
        maxW={"7xl"}
        columns={{ base: 1, md: 1 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}
      >
        <Flex align={"center"} justify={"center"} id="app">
          <VStack spacing={10} align="center" textAlign={"center"}>
            <Heading
              as="h1"
              lineHeight={1.1}
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "7xl" }}
            >
              <Text
                as={"span"}
                bgGradient="linear(to-r, red.400,red.600)"
                bgClip="text"
              >
                Youtube
              </Text>{" "}
              Playlist To Notion
            </Heading>
            <Text color={textColor} fontSize={{ base: "sm", sm: "md" }}>
              Watch your favorite Youtube playlist without leaving Notion !
            </Text>
            <YModel />
            <motion.div
              variants={variants} // Pass the variant object into Framer Motion
              initial="hidden" // Set the initial state to variants.hidden
              animate="enter" // Animated state to variants.enter
              exit="exit" // Exit state (used later) to variants.exit
              transition={{ ease: "easeOut" }}
              className="w-full max-w-3xl flex justify-center"
            >
              <Stack
                className={boxBg}
                rounded={"xl"}
                p={{ base: 4, sm: 6, md: 8 }}
                spacing={{ base: 8 }}
                maxW={{ lg: "lg" }}
              >
                {!session ? (
                  <Stack spacing={4}>
                    <Heading
                      color={headingColor}
                      lineHeight={1.1}
                      fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
                    >
                      Connect to Notio
                    </Heading>
                    <Text color={textColor} fontSize={{ base: "sm", sm: "md" }}>
                      Import playlist from Youtube to Notion database is very
                      easy now !
                    </Text>
                  </Stack>
                ) : (
                  []
                )}
                ;
                {!session ? (
                  <Box>
                    <Divider mb={10} />

                    <Flex justifyContent={"center"} mb={10}>
                      <Text mr="5">Connect to Notion using API </Text>
                      <Switch
                        isChecked={checkedItems[0]}
                        colorScheme="switchTheme"
                        size="lg"
                        onChange={(e) => {
                          // console.log(e.target.value);
                          console.log(e.target.checked);
                          setCheckedItems([e.target.checked, e.target.checked]);
                        }}
                      />
                    </Flex>
                    {checkedItems[0] ? (
                      <Button
                        variant="notionButton"
                        onClick={() => signIn()}
                        leftIcon={<NotionIcon boxSize={6} />}
                      >
                        {" "}
                        Connect with Notion
                      </Button>
                    ) : (
                      <NotionAddApiForm />
                    )}
                  </Box>
                ) : (
                  <Account {...props} />
                )}
              </Stack>
            </motion.div>
          </VStack>
        </Flex>
        <Glow />
      </Container>
    </Box>
  );
}
