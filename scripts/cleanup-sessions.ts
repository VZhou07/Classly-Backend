import "dotenv/config";
import { deleteExpiredSessions } from "../src/lib/session-cleanup.js";

const main = async () => {
    const count = await deleteExpiredSessions();
    console.log(`Deleted ${count} expired session(s)`);
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
