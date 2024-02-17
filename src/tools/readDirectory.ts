import { readDir } from "@tauri-apps/api/fs";

export async function readDirectory(path: string) {
  try {
    return await readDir(path);
  } catch (error) {
    throw error;
  }
}
