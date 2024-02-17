import { exists, createDir, BaseDirectory } from "@tauri-apps/api/fs";

export async function createBaseDir() {
  try {
    if (
      await exists("", {
        dir: BaseDirectory.AppConfig,
      })
    ) {
    } else {
      await createDir("", {
        dir: BaseDirectory.AppConfig,
        recursive: true,
      });
    }
    return "success";
  } catch (error: any) {
    throw new Error(`[-createBaseDir-], ${error.toString()}`);
  }
}

// /home/leo/.config/com.lazy_wallet.dev/lazy_wallet.conf
