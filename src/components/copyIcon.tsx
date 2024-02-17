import { copyToClipBoard } from "@/tools";
import { CopyIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";

interface copyProps {
  content: string;
}

export default function CopyICON(p: copyProps) {
  const toast = useToast();

 
  async function handleClick(content: string) {
    try {
      const result = await copyToClipBoard(content);
      if (result === "success") {
        toast({
          title: `copy`,
          description: "Copied to Clipboard",
          position: "top-right",
          isClosable: true,
          status: "success",
          variant: "left-accent",
        });
      }
    } catch (error: any) {
      toast({
        title: `copy`,
        description: `Failed To Copy, ${error.toString()}`,
        position: "top-right",
        isClosable: true,
        status: "error",
        variant: "left-accent",
      });
    }
  }
  return (
    <CopyIcon
      onClick={() => {
        handleClick(p.content);
      }}
      transform="scale(1.1)"
      cursor="pointer"
      _hover={{ transform: "scale(1.3)" }}
    />
  );
}
