import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";

import { CgProfile } from "react-icons/cg";
import CopyICON from "./copyIcon";

interface ListCardProps {
  id: number;
  name: string;
  address: string;
  path: string;
}
export default function ListEmployee(props: ListCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.600"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent
          borderTop="solid 15px"
          borderColor="#0d6efd"
          alignItems="center"
          display="flex"
          sx={{ maxW: "70%" }}
        >
          <ModalHeader>
            <Text
              bgColor="#AAAABC"
              p={2}
              rounded="5px"
              color="white"
              noOfLines={2}
            >
              {props.name}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            p={0}
            w="100%"
            padding={5}
          >

            <Text alignSelf="center" bgColor='#0d6efd' color='white' rounded={5} px={2} py={1} mb={3}>Address</Text>
            <Flex
              gap={2}
              flexDirection="row"
              w="100%"
              p={2}
              border="solid 2px"
              borderColor="lightBlue"
              cursor="text"
              justifyContent="center"
            >
              <Text textAlign="center" noOfLines={1} color='#0d6efd'>
                {props.address}
              </Text>
              <CopyICON content={props.address} />
            </Flex>

            {/* style="position: relative; text-align: left; box-sizing: border-box;
            padding: 0px; overflow: auto hidden; white-space: pre; font-family:
            &quot;SF Mono&quot;, Menlo, monospace; color: rgb(214, 222, 235);
            background-color: rgb(1, 22, 39); font-size: 14px;" */}
            {/* <CopyIcon /> */}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      <Box
        bgColor="#E6F4F1"
        as="div"
        display="grid"
        gap="2"
        gridTemplateColumns="5% 25% 55% 15%"
        color="#0d6efd"
        verticalAlign="center"
        alignItems="center"
        px={3}
        overflow="hidden"
        roundedBottom="4px"
        width="100%"
        mb={3}
        cursor="pointer"
        transitionTimingFunction="cubicBezier(0.4, 0, 0.2, 1)"
        transitionProperty="all"
        transitionDuration="500ms"
        _hover={{ transform: "scale(1.07)" }}
        minHeight="25px"
        onClick={() => {
          onOpen();
        }}
      >
        <Text noOfLines={1}>{props.id}</Text>
        <span>
          <CgProfile />
        </span>
        <Text noOfLines={1}>{props.name}</Text>
      </Box>
    </>
  );
}
