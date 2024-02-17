// "use client";
// import ListEmployee from "@/components/listComponent";
// import {
//   Container,
//   Box,
//   FormControl,
//   Input,
//   Button,
//   Spinner,
//   Flex,
//   Text,
//   Icon,
//   FormHelperText,
//   FormErrorMessage,
//   InputRightElement,
//   InputGroup,
//   useToast,
// } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import { Image } from "@chakra-ui/next-js";
// import NoData from "@/images/noData.jpg";
// import {
//   exists,
//   BaseDirectory,
//   writeTextFile,
//   readTextFile,
//   createDir,
//   readDir,
// } from "@tauri-apps/api/fs";
// import { open } from "@tauri-apps/api/dialog";

// import { GoFileDirectory } from "react-icons/go";



// interface walletData {
//   walletType: "EVM" | "BTC";
//   name: string;
//   address: string;
//   encryptedJson: any;
// }

// export default function HomePage() {
//   const [wallet, setWallet] = useState<walletData[]>([]);
//   const [loadingWallet, setLoadingWallet] = useState(false);
//   const [formInput, setFormInput] = useState<string>("");
//   const [formPassword, setFormPassword] = useState<string>("");
//   const [formInputLoading, setFormInputLoading] = useState<boolean>(false);
//   const [openSelectLoading, setOpenSelectLoading] = useState<boolean>(false);
//   const [selectedDir, setSelectedDir] = useState<string | string[]>("");
//   const [show, setShow] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setTimeout(() => {
//       setMounted(true);
//     }, 2000); // 2000 milliseconds = 2 seconds
//   });
//   const handleClick = () => setShow(!show);

//   const toast = useToast();

//   const defaultDir: BaseDirectory.AppConfig = BaseDirectory.AppConfig;

//   const formInputListLength = (): number => {
//     return formInput == "" ? 0 : formInput.split(",").length;
//   };
//   const formPasswordListLength = (): number => {
//     return formPassword == "" ? 0 : formPassword.split(",").length;
//   };

//   useEffect(() => {
//     async function read() {
//       const y = await readPath();
//       setSelectedDir(y);
//     }
//     read();
//   }, [setOpenSelectLoading, selectedDir, mounted, formInputLoading]);

//   async function savePath(dir: string | string[]) {
//     const temp = { path: dir };
//     await writeTextFile("lazy_wallet.conf", `${JSON.stringify(temp)}`, {
//       dir: BaseDirectory.Document,
//     });
//   }
//   async function readPath() {
//     let contents = await readTextFile("lazy_wallet.conf", {
//       dir: BaseDirectory.Document,
//     });
//     let result = JSON.parse(contents);
//     return result.path;
//   }

//   async function createNewDir(path: string) {
//     if (await exists(`${path}/wallets`)) {
//     } else {
//       await createDir(`${path}/wallets`);
//     }
//   }

//   async function openAndSelect() {
//     try {
//       setOpenSelectLoading(true);
//       let selected = await open({
//         directory: true,
//       });
//       if (selected === null) {
//         // user cancelled the selection
//         setSelectedDir("");
//         return;
//       } else {
//         // user selected a single directory
//         await savePath(selected)
//           .then(async () => await createNewDir(selected!.toString()))
//           .catch((error: any) => {
//             toast({
//               title: `save path`,
//               description: error.toString(),
//               position: "top-right",
//               isClosable: true,
//               status: error,
//               variant: "left-accent",
//             });
//           })
//           .then(() => setSelectedDir(selected!));
//       }
//     } catch (error: any) {
//       toast({
//         title: `save path`,
//         description: error.toString(),
//         position: "top-right",
//         isClosable: true,
//         status: error,
//         variant: "left-accent",
//       });
//     } finally {
//       setOpenSelectLoading(false);
//     }
//   }

//   const secureFilePath = async (path: string) => {
//     var count = 0;
//     while (await exists(path))
//       path = `${path.split(".")[0]} (${count++}).${path
//         .split(".")
//         .slice(1)
//         .join(".")}`;
//     return path;
//   };

//   async function writeEncrytedWalletJSON(
//     dir: string,
//     walletData: walletData,

//   ) {
//     try {
//       const path: string = await secureFilePath(
//         `${dir}/wallets/${walletData.name}.json`
//       );

//       await writeTextFile(path, `${JSON.stringify(walletData)}`).then(() => {
//         toast({
//           title: `Save`,
//           description: `Wallet Encrypted and Saved`,
//           position: "top-right",
//           isClosable: true,
//           status: "success",
//           duration: 9000,
//           variant: "left-accent",
//         });
//       });
//     } catch (error: any) {
//       toast({
//         title: `writeEncrytedWalletJSON`,
//         description: error.toString(),
//         position: "top-right",
//         isClosable: true,
//         status: error,
//         variant: "left-accent",
//       });
//     }
//   }

//   function generateRandomName(length: number) {
//     const characters =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let randomString = "";
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       randomString += characters[randomIndex];
//     }
//     return randomString;
//   }

//   async function encrypt(
//     pk: string,
//     password: string,
//     name: string
//   ): Promise<walletData> {
//     let result: walletData = {
//       address: pk,
//       name: name,
//       walletType: "EVM",
//       encryptedJson: "json",
//     };
//     return result;
//   }

//   async function handleSubmit() {
//     try {
//       if(!await exists(`${selectedDir}/wallets`)){
//         createDir(`${selectedDir}/wallets`);
//       }
//       setFormInputLoading(true);
//       const resultPassword: string[] = formPassword.split(",");
//       const resultPK: string[] = formInput.split(",");
//       for (let i = 0; i < formInputListLength(); i++) {
//         await writeEncrytedWalletJSON(
//           selectedDir.toString(),
//           await encrypt(resultPK[i], resultPassword[i], generateRandomName(24))
//         );
//       }
//     } catch (error: any) {
//       toast({
//         title: `Submit Form`,
//         description: error.toString(),
//         position: "top-right",
//         isClosable: true,
//         status: "error",
//         variant: "left-accent",
//       });
//     } finally {
//       setFormInputLoading(false);
//     }
//   }

//   async function readDirectory(path: string) {
//     return await readDir(path);
//   }

//   useEffect(() => {
//     console.log();
//     if (mounted) {
//       readFilesInDir();
//     }
//   }, [mounted, selectedDir]);

//   async function processEntries(entries: any) {
//     setWallet([]);
//     for (const entry of entries) {
//       if (entry.path.slice(-5) === ".json") {
//         try {
//           const result = await readTextFile(entry.path);
//           const contents: walletData = JSON.parse(result);
//           setWallet((prevWallet) => [...prevWallet, contents]);
//         } catch (error: any) {
//           toast({
//             title: `Process Entries`,
//             description: error.toString(),
//             position: "top-right",
//             isClosable: true,
//             status: "error",
//             duration: 1000,
//           });
//         }
//       }
//     }
//   }

//   async function readFilesInDir() {
//     try {
//       setLoadingWallet(true);
//       const data = await readDirectory(`${selectedDir.toString()}/wallets`);
//       await processEntries(data);
//     } catch (error: any) {
//       toast({
//         title: `Read Files`,
//         description: error.toString(),
//         position: "top-right",
//         duration: 10000,
//         isClosable: true,
//       });
//     } finally {
//       setLoadingWallet(false);
//     }
//   }

//   return (
//     <Container as="section" justifyContent="center" alignItems="center">
//       <Box
//         mt={5}
//         display="flex"
//         flexDirection="column"
//         verticalAlign="center"
//         alignItems="center"
//         justifyContent="center"
//         alignContent="center"
//       >
//         <Button
//           justifySelf="center"
//           isLoading={openSelectLoading}
//           onClick={async () => {
//             await openAndSelect();
//           }}
//         >
//           <Text pr={2}>Directory </Text>
//           <br /> <Icon as={GoFileDirectory} />
//         </Button>
//         <Input
//           mt={3}
//           disabled={true}
//           placeholder={selectedDir ? selectedDir.toString() : "Default"}
//           _placeholder={{
//             display: "flex",
//             textAlign: "center",
//             color: "lightBlue",
//           }}
//         />
//       </Box>

//       <Box
//         mt="100px"
//         display="flex"
//         alignContent="center"
//         alignItems="center"
//         justifyContent="center"
//         justifyItems="center"
//       >
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSubmit();
//           }}
//         >
//           <FormControl
//             display="flex"
//             flexDirection="column"
//             gap="5"
//             justifyItems="center"
//             alignItems="center"
//           >
//             <Box>
//               <Text
//                 textAlign="center"
//                 rounded={5}
//                 px={5}
//                 py={3}
//                 bgColor="#0D6EFD"
//                 color="white"
//               >
//                 Place in Your Private Key(s) Into the Form and Click Submit
//                 <Text as="p" fontSize="xs">
//                   (If more than one seperate with commas )
//                 </Text>
//               </Text>
//             </Box>
//             <FormControl
//               isInvalid={formInputListLength() != formPasswordListLength()}
//             >
//               <Input
//                 onChange={(e) => setFormInput(e.target.value)}
//                 color="#0D6EFD"
//                 borderColor="#FFEFCA"
//                 borderRadius={0}
//                 placeholder="42424242424, 0x424242424"
//                 _placeholder={{
//                   display: "flex",
//                   textAlign: "center",
//                   color: "lightBlue",
//                 }}
//                 variant="filled"
//                 required
//               />
//               {formInput.length < 1 ||
//               formInputListLength() == formPasswordListLength() ? (
//                 <FormHelperText>
//                   Your Private Key must be 40 or 42 characters, you can use more
//                   than one but you must seperate with Commas
//                 </FormHelperText>
//               ) : (
//                 <FormErrorMessage>
//                   Private Key is Invalid, It must have the same amount of
//                   Objects as Password{" "}
//                 </FormErrorMessage>
//               )}
//             </FormControl>
//             <InputGroup>
//               <FormControl
//                 isInvalid={
//                   formPasswordListLength() < 1 ||
//                   formInputListLength() != formPasswordListLength()
//                 }
//               >
//                 <Input
//                   onChange={(e) => setFormPassword(e.target.value)}
//                   color="#0D6EFD"
//                   borderColor="#FFEFCA"
//                   borderRadius={0}
//                   placeholder="42424242424, 0x424242424"
//                   _placeholder={{
//                     display: "flex",
//                     textAlign: "center",
//                     color: "lightBlue",
//                   }}
//                   type={show ? "text" : "password"}
//                   variant="filled"
//                   required
//                 />
//                 <InputRightElement width="4.5rem">
//                   <Button h="1.75rem" size="sm" onClick={handleClick}>
//                     {show ? "Hide" : "Show"}
//                   </Button>
//                 </InputRightElement>
//                 {formInputListLength() == formPasswordListLength() ? (
//                   <FormHelperText>
//                     Your Private Key must be 40 or 42 characters, you can use
//                     more than one but you must seperate with Commas
//                   </FormHelperText>
//                 ) : (
//                   <FormErrorMessage>
//                     Private Key is Invalid, It must be the same amount of Object
//                     as private key & Make sure to separate with commas{" "}
//                   </FormErrorMessage>
//                 )}
//               </FormControl>
//             </InputGroup>

//             <Button
//               type="submit"
//               colorScheme="green"
//               isLoading={formInputLoading}
//             >
//               {" "}
//               Submit
//             </Button>
//           </FormControl>
//         </form>
//       </Box>
//       <Box
//         mt={5}
//         width="100%"
//         display="flex"
//         flexDirection="column"
//         verticalAlign="center"
//         alignItems="center"
//         justifyContent="center"
//       >
//         {loadingWallet && (
//           <Spinner
//             thickness="4px"
//             speed="0.65s"
//             emptyColor="gray.200"
//             color="blue.500"
//             size="xl"
//             mb={4}
//           />
//         )}
//       </Box>

//       <Box
//         mt="50px"
//         display="flex"
//         flexDirection="column"
//         justifyContent="center"
//       >
//         <Button
//           colorScheme="blue"
//           my={3}
//           onClick={async () => {
//             await readFilesInDir();
//           }}
//         >
//           Refresh
//         </Button>
//         {/* <ListEmployee key={1} id={1} address={"fsf"} /> */}
//         {wallet.length >= 1 ? (
//           wallet.map((data: walletData, index: number) => (
//             <ListEmployee key={index++} id={index++} address={data.name} />
//           ))
//         ) : (
//           <Flex justifyContent="center">
//             {" "}
//             <Image
//               src={NoData}
//               alt="No Data"
//               boxSize={{ base: "200px", md: "350px", lg: "400px" }}
//               style={{ fill: "context-fill" }}
//             />
//           </Flex>
//         )}
//       </Box>
//     </Container>
//   );
// }
