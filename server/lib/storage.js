import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const messagesFile = path.join(dataDir, "messages.json");

export async function saveMessage(entry) {
  await mkdir(dataDir, { recursive: true });
  const line = JSON.stringify({ ...entry, receivedAt: new Date().toISOString() });
  await appendFile(messagesFile, line + "\n", "utf8");
}
