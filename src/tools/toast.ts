import { useToast } from "@chakra-ui/react";

type statusType =
  | undefined
  | "success"
  | "error"
  | "info"
  | "warning"
  | "loading";
interface toastProps {
  title: string;
  description: string;
  status: statusType;
}

export function Toast(title: string, description: string, status: statusType) {
  const toast = useToast();
  return toast({
    title: title,
    description: description,
    position: "top-right",
    isClosable: true,
    status: status,
    duration: status === "success" ? 2000 : 7000,
    variant: "left-accent",
  });
}
