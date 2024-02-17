import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";

export async function savePath(dir: string | string[]) {
  try {
    const temp = { path: dir };
    await writeTextFile("lazy_wallet.conf", `${JSON.stringify(temp)}`, {
      dir: BaseDirectory.AppConfig,
    });
  } catch (error: any) {
    throw new Error(`[-savePath-], ${error.toString()}`);
  }
}
