import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Text,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  useColorModeValue,
  useColorMode,
  ColorModeScript,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  SlideFade,
  VStack,
  useToast,
} from "@chakra-ui/react";
import Glow from "../../background/Glow";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { addVideoToDB } from "../../../utils/notionHelper";
import IVideo from "../../../interfaces/IVideo";

export interface INotionAddApiForm {}

const NotionAddApiForm: React.FC<INotionAddApiForm> = ({ ...glowProps }) => {
  type IFormInput = {
    playlist: string;
    token: string;
    database_id: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>();

  const toast = useToast();

  //'success', 'error', 'warning', 'info'
  function addToast(msg: string = "", status: any = "success") {
    toast({
      status: status,
      isClosable: true,
      description: msg,
    });
  }
  /**
   * @param data
   * @param e
   * @returns
   */
  const importPlaylistNow: SubmitHandler<IFormInput> = (data) => {
    // e?.defaultPrevented();
    return new Promise<void>(async (resolve) => {
      const _playlist: string = data.playlist.split("list=")[1];
      if (_playlist) {
        const res = await fetch(`api/youtube?playlist=${_playlist}`);
        const _data = (await res.json()) as IVideo;
        const videos = new Map(Object.entries(_data));
        let vids: IVideo[] = [];
        let finalRes: Response | undefined;
        videos.forEach(async (video) => {
          const vid: IVideo = {
            id: video.id,
            title: video.title,
            author: video.author,
            duration: video.duration.simple_text,
            thumbnails: video.thumbnails[3].url,
          };
          vids.push(vid);
        });
        finalRes = await addVideoToDB(vids, data.token, data.database_id);
        if (finalRes!.ok) {
          addToast("Successfully import 😊");
          resolve();
        } else {
          addToast("Failed! please check your input.", "error");
          resolve();
        }
      } else {
        console.log("Playlist issue");
        resolve();
      }
    });
  };

  return (
    <Stack>
      <form onSubmit={handleSubmit(importPlaylistNow)}>
        <Stack spacing={4}>
          <FormControl isInvalid={errors.playlist && true}>
            <FormLabel htmlFor="playlist">Youtube Playlist Link</FormLabel>
            <Input
              type="url"
              id="playlist"
              {...register("playlist", {
                required: "This is required",
                pattern: {
                  value: /^.*(youtu.be\/|list=)([^#\&\?]*).*/,
                  message: "Please make sure you put youtube playlist URL",
                },
              })}
              placeholder="https://www.youtube.com/watch?v=bbcm9OLTnsE&list=PLz..."
              bg={useColorModeValue("gray.100", "gray.200")}
              border={0}
              color={useColorModeValue("gray.500", "gray.900")}
              _placeholder={{
                color: "gray.400",
              }}
            />
            <FormErrorMessage>
              {errors.playlist && errors.playlist.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.token && true}>
            <FormLabel htmlFor="token">Notion Token</FormLabel>
            <Input
              type="text"
              id="token"
              {...register("token", {
                required: "This is required",
                minLength: {
                  value: 16,
                  message: "Wrong Notion Token",
                },
              })}
              placeholder="secret_K2k*********t64crk2FPPp"
              bg={useColorModeValue("gray.100", "gray.200")}
              border={0}
              color={useColorModeValue("gray.500", "gray.900")}
              _placeholder={{
                color: "gray.400",
              }}
            />
            {errors?.token && <p>{errors.token.message}</p>}

            <FormErrorMessage>
              {errors.token && errors.token.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.database_id && true}>
            <FormLabel htmlFor="database_id">
              Notion Database URL or ID
            </FormLabel>
            <Input
              //type='url'
              id="database_id"
              {...register("database_id", {
                required: "This is required",
                minLength: {
                  value: 16,
                  message: "Wrong Notion Database ID",
                },
              })}
              placeholder="https://www.notion.so/fc42b..."
              bg={useColorModeValue("gray.100", "gray.200")}
              border={0}
              color={useColorModeValue("gray.500", "gray.900")}
              _placeholder={{
                color: "gray.400",
              }}
            />
            <FormErrorMessage>
              {errors.database_id && errors.database_id.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>
        <Button
          isLoading={isSubmitting}
          type="submit"
          fontFamily={"heading"}
          mt={8}
          w={"full"}
          bgGradient="linear(to-r, red.400,pink.400)"
          color={"white"}
          _hover={{
            bgGradient: "linear(to-r, red.400,pink.400)",
            boxShadow: "xl",
          }}
        >
          Import Playlist
        </Button>
      </form>
    </Stack>
  );
};
export default NotionAddApiForm;
