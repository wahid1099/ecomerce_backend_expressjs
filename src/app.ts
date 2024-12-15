import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
import httpStatus from "http-status";
import notFound from "./app/middlewares/notFound";

const app: Application = express();
// app.use(cors());

app.use(
  cors({
    origin: "http://localhost:5173", // Allow this specific origin
    credentials: true, // Allow cookies and headers like Authorization
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route
app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Multi Vendor Ecomerce  System..",
  });
});

app.use("/api", router);

// Not found handler
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);
export default app;
