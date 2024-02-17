import { writeText, readText } from "@tauri-apps/api/clipboard";
import assert from "assert";

export async function copyToClipBoard(content: string) {
  try {
    await writeText(content);
    assert(await readText(), content);
    return "success";
  } catch (error) {
    throw error;
  }
}
