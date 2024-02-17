import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";

export async function readPath() {
  try {
    let contents = await readTextFile("lazy_wallet.conf", {
      dir: BaseDirectory.AppConfig,
      
    });
    let result = JSON.parse(contents);
    return result.path;
  } catch (error: any) {
    throw new Error(`[-readPath-], ${error.toString()}`);
  }
}
