import fs from "node:fs/promises";
import path from "node:path";

const contentRoot = path.join(process.cwd(), "src/content");

export async function readJsonFile<T>(relativePath: string): Promise<T> {
  const fullPath = path.join(contentRoot, relativePath);
  const raw = await fs.readFile(fullPath, "utf8");
  return JSON.parse(raw) as T;
}

export async function readJsonDirectory<T>(relativePath: string): Promise<T[]> {
  const dir = path.join(contentRoot, relativePath);
  const entries = await fs.readdir(dir);
  const files = entries.filter((entry) => entry.endsWith(".json")).sort();
  return Promise.all(files.map((file) => readJsonFile<T>(path.join(relativePath, file))));
}
