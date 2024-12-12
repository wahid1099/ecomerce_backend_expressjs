"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const index_1 = __importDefault(require("./config/index"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Set up Mongoose event listeners
        mongoose_1.default.connection.on("connected", () => {
            console.log("Database connected successfully");
        });
        mongoose_1.default.connection.on("error", (err) => {
            console.log("Database connection error:", err);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            console.log("Database disconnected");
        });
        try {
            yield mongoose_1.default.connect(index_1.default.database_url);
            app_1.default.listen(index_1.default.port, () => {
                console.log(`App is listening on port ${index_1.default.port}`);
            });
        }
        catch (err) {
            console.log("Database connection failed:", err);
        }
    });
}
main();
