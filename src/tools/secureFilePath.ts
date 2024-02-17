import { exists } from "@tauri-apps/api/fs";

export const secureFilePath = async (path: string) => {
  try {
    var count = 0;
    while (await exists(path))
      path = `${path.split(".")[0]} (${count++}).${path
        .split(".")
        .slice(1)
        .join(".")}`;
    return path;
  } catch (error) {
    throw error;
  }
};
