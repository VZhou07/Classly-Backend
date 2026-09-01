import { httpServerHandler } from "cloudflare:node";
import app from "./app.js";
import { deleteExpiredSessions } from "./lib/session-cleanup.js";

const PORT = 3000;
app.listen(PORT);
const worker: ExportedHandler = httpServerHandler({ port: PORT });

async function runSessionCleanup() {
  try {
    const count = await deleteExpiredSessions();
    if (count > 0) {
      console.log(`Deleted ${count} expired session(s)`);
    }
  } catch (error) {
    console.error("Failed to delete expired sessions:", error);
  }
}

worker.scheduled = async () => {
  await runSessionCleanup();
};

export default worker;
