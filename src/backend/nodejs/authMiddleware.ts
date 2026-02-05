import express, {Request, Response, NextFunction} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const jwt_secret = "my-jwt-secret";

declare global{
    namespace Express{
        interface Request{
            user?: JwtPayload
        }
    }
}

const auth = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({message: "No token provided"});
    }

    const token = authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({message: "Invalid token format"});
    }

    try{
        const decoded = jwt.verify(
            token,
            jwt_secret
        ) as JwtPayload;

        req.user = decoded;

        next();
    }catch(err){
        return res.status(401).json({message: "Invalid or expired token!"});
    }
}

app.post("/login", (req: Request, res: Response) => {
    let user = req.body;

    if (!user?.username) {
        return res.status(400).json({ message: "Username required" });
    }

    const token = jwt.sign(
        {username: user.username},
        jwt_secret,
        {expiresIn: "1h"}
    );

    res.status(200).json({
        token,
        user
    })
})

app.get("/profile", auth, (req: Request, res: Response) => {
    res.status(200).json({user: req.user});
})

app.listen(3000, () => console.log("Server running at port 3000..."));