"use client";
import ListEmployee from "@/components/listComponent";
import {
  Container,
  Box,
  FormControl,
  Input,
  Button,
  Spinner,
  Flex,
  Text,
  Icon,
  FormHelperText,
  FormErrorMessage,
  InputRightElement,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Image } from "@chakra-ui/next-js";
import NoData from "@/images/noData.jpg";
import {
  exists,
  BaseDirectory,
  writeTextFile,
  readTextFile,
  createDir,
  readDir,
} from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { Wallet } from "ethers";

import { GoFileDirectory } from "react-icons/go";
import {
  createBaseDir,
  createNewDir,
  encrypt,
  extractNameFromPath,
  generateRandomName,
  isAccount,
  readDirectory,
  readPath,
  savePath,
  secureFilePath,
  validatePassword,
  walletData,
} from "@/tools";

interface walletNeededData {
  name: string;
  address: string;
  path: string;
  walletType: "EVM" | "BTC";
}

export default function HomePage() {
  const [wallet, setWallet] = useState<walletNeededData[]>([]);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [formInput, setFormInput] = useState<string>("");
  const [formPassword, setFormPassword] = useState<string>("");
  const [formInputLoading, setFormInputLoading] = useState<boolean>(false);
  const [openSelectLoading, setOpenSelectLoading] = useState<boolean>(false);
  const [selectedDir, setSelectedDir] = useState<string | string[]>("");
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 2000); // 2000 milliseconds = 2 seconds
  });
  const handleClick = () => setShow(!show);

  const toast = useToast();

  const defaultDir: BaseDirectory.AppConfig = BaseDirectory.AppConfig;

  const formInputListLength = (): number => {
    return formInput == "" ? 0 : formInput.split(",").length;
  };
  const formPasswordListLength = (): number => {
    return formPassword == "" ? 0 : formPassword.split(",").length;
  };

  const allFormIsAccount = (): boolean => {
    return formInput.split(",").every((e) => {
      return e.length === 64 || e.length === 66;
    });
  };

  const checkAllPassword = (): boolean => {
    return formPassword.split(",").every((password) => {
      return validatePassword(password);
    });
  };

  useEffect(() => {
    async function read() {
      try {
        await createBaseDir();
        //save default path

        const y = await readPath().catch(async () => {
          try {
            await savePath("$APPCONFIG/com.lazy_wallet.dev/wallets");
          } catch (error: any) {
            throw new Error("my error with", error.toString());
          }
        });
        setSelectedDir(y);
      } catch (error: any) {
        toast({
          title: `save path`,
          description: error.toString(),
          position: "top-right",
          isClosable: true,
          status: "error",
          variant: "left-accent",
          duration: 90000,
        });
      }
    }
    read();
  }, [openSelectLoading]);

  useEffect(() => {
    console.log();
    if (mounted) {
      readFilesInDir();
    }
  }, [mounted, selectedDir]);

  async function openAndSelect() {
    try {
      setOpenSelectLoading(true);
      let selected = await open({
        directory: true,
      });
      if (selected === null) {
        // user cancelled the selection
        setSelectedDir("");
        return;
      } else {
        // user selected a single directory
        await savePath(selected)
          .then(async () => await createNewDir(selected!.toString()))
          .catch((error: any) => {
            toast({
              title: `save path(open & select)`,
              description: error.toString(),
              position: "top-right",
              isClosable: true,
              status: "error",
              variant: "left-accent",
              duration: 90000,
            });
          })
          .then(() => setSelectedDir(selected!));
      }
    } catch (error: any) {
      toast({
        title: `open and select`,
        description: error.toString(),
        position: "top-right",
        isClosable: true,
        status: "error",
        variant: "left-accent",
        duration: 90000,
      });
    } finally {
      setOpenSelectLoading(false);
    }
  }

  async function writeEncrytedWalletJSON(
    dir: string,
    walletData: walletData,
    name: String
  ) {
    try {
      const path: string = await secureFilePath(`${dir}/wallets/${name}.json`);

      await writeTextFile(path, `${JSON.stringify(walletData)}`).then(() => {
        toast({
          title: `Save`,
          description: `Wallet Encrypted and Saved`,
          position: "top-right",
          isClosable: true,
          status: "success",
          duration: 90000,
          variant: "left-accent",
        });
      });
    } catch (error: any) {
      toast({
        title: `writeEncrytedWalletJSON`,
        description: error.toString(),
        position: "top-right",
        isClosable: true,
        status: error,
        variant: "left-accent",
        duration: 90000,
      });
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    e.target.reset();

    try {
      setFormInputLoading(true);
      if (!(await exists(`${selectedDir}/wallets`))) {
        createDir(`${selectedDir}/wallets`);
      }

      const resultPassword: string[] = formPassword.split(",");
      const resultPK: string[] = formInput.split(",");
      setFormPassword("");
      setFormInput("");
      for (let i = 0; i < formInputListLength(); i++) {
        await writeEncrytedWalletJSON(
          selectedDir.toString(),
          await encrypt(resultPK[i], resultPassword[i]),
          generateRandomName(24)
        );
      }
    } catch (error: any) {
      toast({
        title: `Submit Form`,
        description: error.toString(),
        position: "top-right",
        isClosable: true,
        status: "error",
        variant: "left-accent",
        duration: 90000,
      });
    } finally {
      setFormInputLoading(false);
      await readFilesInDir();
    }
  }

  async function processEntries(entries: any) {
    setWallet([]);
    for (const entry of entries) {
      if (entry.path.slice(-5) === ".json") {
        try {
          const result = await readTextFile(entry.path);
          const jsonParsed: walletData = JSON.parse(result);
          const contents: walletNeededData = {
            name: extractNameFromPath(entry.path),
            address: jsonParsed.address,
            path: entry.path,
            walletType: jsonParsed.walletType,
          };
          setWallet((prevWallet) => [...prevWallet, contents]);
        } catch (error: any) {
          toast({
            title: `Process Entries`,
            description: error.toString(),
            position: "top-right",
            isClosable: true,
            status: "error",
            duration: 90000,
          });
        }
      }
    }
  }

  async function readFilesInDir() {
    try {
      setLoadingWallet(true);
      const data = await readDirectory(`${selectedDir.toString()}/wallets`);
      await processEntries(data);
    } catch (error: any) {
      toast({
        title: `Read Files`,
        description: error.toString(),
        position: "top-right",
        duration: 90000,
        isClosable: true,
      });
    } finally {
      setLoadingWallet(false);
    }
  }

  return (
    <Container as="section" justifyContent="center" alignItems="center">
      <Box
        mt={5}
        display="flex"
        flexDirection="column"
        verticalAlign="center"
        alignItems="center"
        justifyContent="center"
        alignContent="center"
      >
        <Button
          justifySelf="center"
          isLoading={openSelectLoading}
          onClick={async () => {
            await openAndSelect();
          }}
        >
          <Text pr={2}>Directory </Text>
          <br /> <Icon as={GoFileDirectory} />
        </Button>
        <Input
          mt={3}
          disabled={true}
          cursor="text"
          placeholder={selectedDir ? selectedDir.toString() : "Default"}
          _placeholder={{
            display: "flex",
            textAlign: "center",
            color: "blue.400",
          }}
          focusBorderColor="pink.400"
          borderColor="blue.400"
          errorBorderColor="blue.200"
        />
      </Box>

      <Box
        mt="100px"
        display="flex"
        alignContent="center"
        alignItems="center"
        justifyContent="center"
        justifyItems="center"
        flexDirection="column"
      >
        <Box mt={3}>
          <Text
            textAlign="center"
            rounded={5}
            px={5}
            py={3}
            bgColor="#0D6EFD"
            color="white"
          >
            Place in Your Private Key(s) and Password(s) Into the Form and Click
            Submit
            <Text as="p" fontSize="xs">
              (If more than one seperate with commas )
            </Text>
          </Text>
        </Box>
        <form onSubmit={handleSubmit}>
          <InputGroup
            display="flex"
            flexDirection="column"
            gap="5"
            justifyItems="center"
            alignItems="center"
            mt={4}
          >
            <FormControl
              isInvalid={
                formInputListLength() != formPasswordListLength() ||
                !allFormIsAccount()
              }
              w="50vw"
            >
              <Input
                onChange={(e) => setFormInput(e.target.value)}
                color="#0D6EFD"
                borderColor="#FFEFCA"
                errorBorderColor="blue.200"
                borderRadius={0}
                placeholder="Private Key(s)"
                _placeholder={{
                  display: "flex",
                  textAlign: "center",
                  color: "lightBlue",
                }}
                variant="filled"
                type={show ? "text" : "password"}
                required
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
              {formInput.length > 40 &&
                formInputListLength() == formPasswordListLength() &&
                allFormIsAccount() && (
                  <FormHelperText>
                    Your Private Key(s) Looks Good
                  </FormHelperText>
                )}

              {formInputListLength() != formPasswordListLength() && (
                <FormErrorMessage>
                  Private Key is Invalid, It must have the same amount of
                  Objects as Password{" "}
                </FormErrorMessage>
              )}

              {formInput.length > 0 && !allFormIsAccount() && (
                <FormErrorMessage>
                  Private Key(s) is Invalid, one or more are not valid EVM keys
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              isInvalid={
                formPassword.length < 1 ||
                formInputListLength() != formPasswordListLength() ||
                !checkAllPassword()
              }
            >
              <Input
                onChange={(e) => setFormPassword(e.target.value)}
                color="#0D6EFD"
                borderColor="#FFEFCA"
                errorBorderColor="blue.200"
                borderRadius={0}
                placeholder="Password(s)"
                _placeholder={{
                  display: "flex",
                  textAlign: "center",
                  color: "lightBlue",
                }}
                type={show ? "text" : "password"}
                variant="filled"
                required
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
              {checkAllPassword() &&
                formInputListLength() == formPasswordListLength() && (
                  <FormHelperText>Your Password(s) looks Good</FormHelperText>
                )}{" "}
              {formInputListLength() != formPasswordListLength() && (
                <FormErrorMessage>
                  Password(s) is/are Invalid, It must be the same amount of
                  Object as private key & Make sure to separate with commas{" "}
                </FormErrorMessage>
              )}
              {formPassword.length > 0 && !checkAllPassword() && (
                <FormErrorMessage>
                  Password is Invalid, It must have at least one of each( Min
                  length of 14, Symbol, Uppercase, Lowercase and Number)
                </FormErrorMessage>
              )}
            </FormControl>

            <Button
              type="submit"
              colorScheme="green"
              isLoading={formInputLoading}
            >
              {" "}
              Submit
            </Button>
          </InputGroup>
        </form>
      </Box>
      <Box
        mt={5}
        width="100%"
        display="flex"
        flexDirection="column"
        verticalAlign="center"
        alignItems="center"
        justifyContent="center"
      >
        {loadingWallet && (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
            mb={4}
          />
        )}
      </Box>

      <Box
        mt="50px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Button
          colorScheme="blue"
          my={3}
          onClick={async () => {
            await readFilesInDir();
          }}
        >
          Refresh
        </Button>
        {/* <ListEmployee key={1} id={1} address={"fsf"} /> */}
        {wallet.length >= 1 ? (
          wallet.map((data: walletNeededData, index: number) => (
            <ListEmployee
              key={index++}
              id={index + 1}
              name={data.name}
              address={data.address}
              path={data.path}
            />
          ))
        ) : (
          <Flex justifyContent="center">
            {" "}
            <Image
              src={NoData}
              alt="No Data"
              boxSize={{ base: "200px", md: "350px", lg: "400px" }}
              style={{ fill: "context-fill" }}
            />
          </Flex>
        )}
      </Box>
    </Container>
  );
}
