import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  AspectRatio,
  Stack,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { FaPlayCircle } from "react-icons/fa";
import Image from 'next/image'

export interface IYModel {}
const YModel: React.FC<IYModel> = ({ ...glowProps }) => {
  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropInvert="80%"
      backdropBlur="2px"
    />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);

  return (
    <>
      <Flex gap={5}>
        <a
          href="https://www.producthunt.com/posts/youtube-playlist-to-notion?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-youtube&#0045;playlist&#0045;to&#0045;notion"
          target="_blank" rel="noreferrer"
        >
          <Image
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=366369&theme=dark"
            alt="Youtube&#0032;Playlist&#0032;To&#0032;Notion - Watch&#0032;your&#0032;favorite&#0032;Youtube&#0032;playlist&#0032;without&#0032;leaving&#0032;Notion | Product Hunt"
            width="190"
            height="50"
          />
        </a>

        <Button
          leftIcon={<FaPlayCircle />}
          onClick={() => {
            setOverlay(<OverlayOne />);
            onOpen();
          }}
        >
          See How it Work?
        </Button>
      </Flex>

      <Modal isCentered isOpen={isOpen} size="xl" onClose={onClose}>
        {overlay}
        <ModalContent>
          <AspectRatio ratio={16 / 9}>
            <iframe
              title="How to use it"
              src="https://www.youtube.com/embed/IWFG7fSCWb4"
            />
          </AspectRatio>
        </ModalContent>
      </Modal>
    </>
  );
};

export default YModel;
