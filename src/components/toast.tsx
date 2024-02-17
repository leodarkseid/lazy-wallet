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

export default function Toast(props: toastProps) {
  const toast = useToast();
  return (
    <>
      {toast({
        title: props.title,
        description: props.description,
        position: "top-right",
        isClosable: true,
        status: props.status,
        duration: props.status === "success" ? 2000 : 7000,
        variant: "left-accent",
      })}
      ;
    </>
  );
}
