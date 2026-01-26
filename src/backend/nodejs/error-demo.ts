import express from 'express';
import {Request, Response, NextFunction} from 'express';

const app = express();

// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
    // login();
    next();
}

app.get("/login", logger, (req: Request, res: Response) => {
    throw new Error("Login Failed");
})

// central error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    res.status(500).json({message: err.message});
});

app.listen(3000, () => console.log("Server running on port 3000"));