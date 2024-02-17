export * from "./createNewDir";
export * from "./encryptPK";
export * from "./readDirectory";
export * from "./readPath";
export * from "./savePath";
export * from "./secureFilePath";
export * from "./writeEncryptedWalletJSON";
export * from "./generateRandomName";
export * from "./toast";
export * from "./validatePassword"
export * from "./extractNameFromPath"
export * from "./copyToClipboard"
export * from "./createBaseDir";
export interface walletData {
  walletType: "EVM" | "BTC";
 
  address: string;
  encryptedJson: any;
}
