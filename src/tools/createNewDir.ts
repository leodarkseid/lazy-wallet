import { exists, createDir } from "@tauri-apps/api/fs";

export async function createNewDir(path: string) {
  try {
    if (await exists(`${path}/wallets`)) {
    } else {
      await createDir(`${path}/wallets`);
    }
    return "success";
  } catch (error: any) {
    throw new Error(`[-createNewDir-], ${error.toString()}`);
  }
}
