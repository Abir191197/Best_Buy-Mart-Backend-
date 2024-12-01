"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config")); // Make sure this contains any other required configurations
const app_1 = __importDefault(require("./app"));
async function main() {
    // Use Heroku's assigned PORT or fallback to a default port for local development
    const port = process.env.PORT || config_1.default.port || 3000;
    const server = app_1.default.listen(port, () => {
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
