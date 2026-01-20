import express from "express";
import { Request, Response, NextFunction } from "express";

const app = express();

// middleware
const middleware = (req: Request, res: Response, next: NextFunction) => {
    console.log("This is a middleware");
    next();
}

// controller funciton
const controllerFun = (req: Request, res: Response) => {
    res.send({message: "Hello World"});
}

// route
app.get("/", middleware, controllerFun);


app.listen(3000, () => console.log("Server running at localhost:3000 ..."));