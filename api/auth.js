import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { createUser, getUserByUsername } from "./db/queries/users.js";

const router = express.Router();
router.use(express.json());

router.post("/users/register", async (req, res, next) => {
	const { username, password } = req.body;
	if (!username || !password){
		return res.status(400).send("Missing required info.")};
	const newUser = await createUser({
		username,
		password: await bcrypt.hash(password, 5)
	});
    if (!newUser){
        return res.status(401).send("Couldn't register new user.")
    }
    const token = jwt.sign({id: newUser.id, username: newUser.username}, process.env.JWT_SECRET)
    res.status(201).json({token, username: username})
});

router.post("/users/login", async (req, res, next) => {
	const { username, password } = req.body;
	if (!username || !password){
		return res.status(400).send("Missing required info.")};
	const realInfo = await getUserByUsername({username})
    if (!realInfo){
        return res.status(404).send("Couldn't find user.")
    }
    const passMatch = await bcrypt.compare(password, realInfo.password);
    if(!passMatch){
        return res.status(401).send("Wrong info.")
    }
    const token = jwt.sign({id: realInfo.id, username: realInfo.username}, process.env.JWT_SECRET)
    res.status(200).json({token, username: realInfo.username})
});

export default router;