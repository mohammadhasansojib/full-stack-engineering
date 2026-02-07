import { Response, Request } from "express"
import {users} from "./data"
import jwt from "jsonwebtoken";
import {AuthRequest} from "./authMiddleware"

// login
const login = (req: Request, res: Response) => {
    const {name} = req.body;

    const user = users.find(u => u.name === name);

    if(!user) return res.status(404).json({message: "User not found"});
    
    const token = jwt.sign(
        {id: user.id, name: user.name},
        process.env.JWT_SECRET as string,
        {expiresIn: "50s"}
    );

    res.json({token})
}
// get /profile
const profile = (req: AuthRequest, res: Response) => {
    try{
        res.json({user: req.user});
    }catch(err){
        res.status(500).json({message: "Something went wrong"});
    }
}

// get users/
const getUsers = (req: Request, res: Response) => {
    res.json(users)
}
// get users/:id
const getUserById = (req: Request, res: Response) => {
    let id = Number(req.params.id);

    let user = users.find(u => u.id === id);

    if(!user) return res.status(404).json({message: "User not found"});

    res.status(200).json(user);
}
// post users/
const createUser = (req: Request, res: Response) => {
    const {name} = req.body;

    if(!name) return res.status(400).json({message: "Name Required"});

    if(!name || name.length < 3) return res.status(400).json({message: "Name is too short"});

    const lastId = users.length ? users[users.length-1].id : 0;

    const newUser = {id: lastId+1, name};

    users.push(newUser);

    res.status(201).json(newUser);
}
// delete users/:id
const deleteUser = (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const index = users.findIndex(u => u.id === id);

    if(index === -1) return res.status(404).json({message: "User not found"});

    users.splice(index, 1);

    res.json({message: "Deleted"});
}
// put users/:id
const updateUser = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const {name} = req.body;

    const index = users.findIndex(u => u.id === id);

    if(index === -1) return res.status(404).json({message: "User not found"});

    if(!name || name.length < 3) return res.status(400).json({message: "Name is too short"});

    users[index].name = name;

    res.json(users[index]);
}

export default {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
    login,
    profile,
}