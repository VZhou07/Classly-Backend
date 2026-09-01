import "dotenv/config";
import app from "./app.js";

const PORT_RAW = process.env.PORT;
const PORT =
  PORT_RAW && Number.isFinite(Number(PORT_RAW)) ? Number(PORT_RAW) : 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}/`);
});
