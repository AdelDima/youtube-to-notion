import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import Image from "next/image";
import glow_homepage from "../../public/glow-homepage.webp";

export interface IGlow {}

const Glow: React.FC<IGlow> = ({ ...glowProps }) => {
  return (
    <Box className="overflow-hidden -z-10 absolute inset-0 flex justify-center h-full">
      <Image
        src={glow_homepage}
        className="max-w-none origin-top scale-150"
        alt=""
        decoding="async"
        loading="lazy"
        data-nimg="future"
        // fill
      />
    </Box>
  );
};

export default Glow;
