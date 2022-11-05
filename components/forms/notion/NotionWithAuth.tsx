import { useState, useEffect } from "react";
import {
  Button,
  Center,
  Flex,
  Text,
  Stack,
  useColorModeValue,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
  Spacer,
  Grid,
} from "@chakra-ui/react";
import {
  useUser,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import { Database } from "../../../utils/database.types";
import { SubmitHandler, useForm } from "react-hook-form";
import IVideo from "../../../interfaces/IVideo";
import { addVideoToDB } from "../../../utils/notionHelper";
import React from "react";
// type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Account(props: any) {
  const authEvent: string = props.authEvent;
  const session: Session = props.session;
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const setLoading = (loading: string) => {
    if (typeof window !== "undefined") localStorage.setItem("loading", loading);
  };
  const getLoading = () => {
    if (typeof window !== "undefined") return localStorage.getItem("loading");
  };

  const setFullName = (loading: string = "") => {
    if (typeof window !== "undefined")
      localStorage.setItem("fullName", loading);
  };
  const getToken = () => {
    if (typeof window !== "undefined")
      return localStorage.getItem("provider_token");
  };

  const setToken = (loading: string = "") => {
    if (typeof window !== "undefined")
      localStorage.setItem("provider_token", loading);
  };

  const getFullName = () => {
    if (typeof window !== "undefined") return localStorage.getItem("fullName");
  };

  type IFormInput = {
    playlist: string;
    database_id: string;
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>();

  const toast = useToast();

  function addToast(
    msg: string = "",
    status: "success" | "error" | "info" | "warning" = "success"
  ) {
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

        finalRes = await addVideoToDB(vids, getToken()!, data.database_id);
        if (finalRes!.ok) {
          addToast("Successfully import 😊");
          resolve();
        } else {
          addToast(finalRes?.statusText, "error");
          resolve();
        }
      } else {
        console.log("Playlist issue");
        resolve();
      }
    });
  };

  useEffect(() => {
    if (getLoading() !== "false") {
      if (authEvent === "SIGNED_IN") {
        updateToken();
        getProfile();
      }
      setLoading("false");
    }
  }, [session]);

  async function updateToken() {
    if (session) {
      if (session.provider_token) {
        const { error } = await supabase
          .from("profiles")
          .update({ provider_token: session.provider_token })
          .eq("id", session!.user.id);
      }
    }
  }

  async function getProfile() {
    try {
      console.log("getProfile called");

      if (!user) throw new Error("No user");
      let { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name,provider_token`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullName(data.full_name!);
        if(session.provider_token){
          setToken(session.provider_token);
        }else {
          addToast("Token empty, please try re-connect to Notion.", "error");
        }
      }
    } catch (error) {
      addToast("Error loading user data!", "error");
      console.log(error);
    }
  }
  const signOutUser = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Stack spacing={4}>
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
      <Flex>
        <Center>
            <a className="underline" href="#" onClick={() => signOutUser()}>
              Sign Out
            </a>
        </Center>
      </Flex>


    </Stack>
  );
}
