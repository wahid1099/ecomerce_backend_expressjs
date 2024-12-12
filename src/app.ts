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

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Multi Vendor Ecomerce  System..",
  });
});

app.use("/api", router);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
