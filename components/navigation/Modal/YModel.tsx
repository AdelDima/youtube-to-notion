import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  AspectRatio,
} from "@chakra-ui/react";
import React from "react";
import { FaPlayCircle } from "react-icons/fa";

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
      <Button
      leftIcon={<FaPlayCircle />}
        onClick={() => {
          setOverlay(<OverlayOne />);
          onOpen();
        }}
      >
        See How it Work?
      </Button>
      <Modal isCentered isOpen={isOpen} size="xl" onClose={onClose}>
        {overlay}
        <ModalContent>
          <AspectRatio  ratio={16 / 9}>
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
