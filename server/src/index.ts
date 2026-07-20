import "dotenv/config";
import app from "./app";
export * from "./app";
export default app;

// If executed directly, run the server
if (require.main === module) {
  import("./server");
}
