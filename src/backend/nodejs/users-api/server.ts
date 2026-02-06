import express, {Request, Response, NextFunction} from "express"
import dotenv from "dotenv";
import router from "./routes"
dotenv.config();

const app = express();
const port = process.env.USERS_API_PORT || 3000;

// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
    
    const start = Date.now();

    res.on("finish", () => {
        const time = Date.now() - start;
        console.log(
            `${req.method} ${req.originalUrl} → ${res.statusCode} (${time}ms)`
        );
    });

    next();
}
app.use(logger);

// json body parser
app.use(express.json());

// routes
app.use("/users", router);

app.listen(port, () => console.log(`Server running at port ${port}`));

