import { promises as fs } from "fs";

export async function loadFont(name: string) {
  return fs.readFile(process.cwd() + "/fonts/" + name);
}
