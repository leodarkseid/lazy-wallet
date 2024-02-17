import Toast from "@/components/toast";
import { writeTextFile } from "@tauri-apps/api/fs";
import { secureFilePath } from "./secureFilePath";
import { walletData } from ".";
import { useToast } from "@chakra-ui/react";

export async function writeEncrytedWalletJSON(
  dir: string,
  walletData: walletData
) {
  const toast = useToast();
  try {
    const path: string = await secureFilePath(
      `${dir}/wallets/${walletData.name}.json`
    );

    await writeTextFile(path, `${JSON.stringify(walletData)}`).then(() => {
      return "success";
    });
  } catch (error: any) {
    throw error;
  }
}
