import { Box } from "@chakra-ui/react";

import router, { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Header from "../components/navigation/Header";
import getRawBody from "raw-body";

// export default theme;
export default function Home() {
  return (
    <Box position={"relative"}>
      <Header />
    </Box>
  );
}
