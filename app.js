import express from "express";
import jwt from "jsonwebtoken";
const app = express();
export default app;

export const verifyToken = () => {
	const authHeader = req.headers["Authorization"];
	const token = authHeader.split(" ")[1];
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	req.user = decoded;
	next();
};

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).send("Sorry! Something went wrong.");
});
