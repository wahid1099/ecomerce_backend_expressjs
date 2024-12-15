"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const app = (0, express_1.default)();
// app.use(cors());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://wahidsbdshop.netlify.app"],
    credentials: true, // Allow cookies and headers like Authorization
}));
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Home route
app.get("/", (req, res) => {
    res.send({
        Message: "Multi Vendor Ecomerce  System..",
    });
});
app.use("/api", routes_1.default);
// Not found handler
app.use(notFound_1.default);
// Global error handler
app.use(globalErrorHandler_1.default);
exports.default = app;
