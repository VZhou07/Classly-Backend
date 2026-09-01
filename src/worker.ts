import { httpServerHandler } from "cloudflare:node";
import app from "./app.js";
import { deleteExpiredSessions } from "./lib/session-cleanup.js";

const PORT = 3000;
app.listen(PORT);

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

export default {
  fetch: httpServerHandler({ port: PORT }),
  async scheduled() {
    await runSessionCleanup();
  },
};
