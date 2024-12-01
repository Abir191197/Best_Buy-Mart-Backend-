import { Server } from "http";
import config from "./config"; // Make sure this contains any other required configurations
import app from "./app";

async function main() {
  // Use Heroku's assigned PORT or fallback to a default port for local development
  const port = process.env.PORT || config.port || 3000;

  const server: Server = app.listen(port, () => {
    console.log("Server is running on port ", port);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
      });
    }
    process.exit(1);
  };

  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception: ", error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled rejection: ", error);
    exitHandler();
  });
}

main();
