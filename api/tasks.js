import express from "express";
import { verifyToken } from "./app.js";

import { createTask, getTasksbyUser, updateTask, deleteTask } from "./db/queries/tasks.js";
import { getTaskById } from "#db/queries/tasks";

const router = express.Router();
router.use(express.json());

function isValidId(id) {
	const num = Number(id);
	return Number.isInteger(num) && num > 0;
}

router.post("/tasks", verifyToken, async (req, res, next) => {
	if (!req.body) {
		return res.status(400).send({ error: "Missing body" });
	}

	const { title, done, user_id } = req.body;

	if (!title || !done || user_id == null) {
		return res.status(400).send({ error: "Missing required fields" });
	}

	const newTask = await createTask({
		title,
		done,
		user_id,
	});

	res.status(201).send(newTask);
});

router.get("/tasks", verifyToken, async (req, res, next) => {
	const tasks = await getTasksbyUser(user_id);
	res.send(tasks);
});

router.delete("/tasks/:id", verifyToken, async (req, res, next) => {
	const id = Number(req.params.id);

	if (!isValidId(id)) {
		return res.status(400).send({ error: "ID must be a positive integer" });
	}

	const deletedTask = await deleteTask(id);

	if (!deletedTask) {
		return res.status(404).send({ error: "Task not found" });
	}

	res.sendStatus(204);
});

router.put("/tasks/:id", verifyToken, async (req, res, next) => {
	const id = Number(req.params.id);

	if (!isValidId(id)) {
		return res.status(400).send({ error: "ID must be a positive integer" });
	}

	if (!req.body || Object.keys(req.body).length === 0) {
		return res.status(400).send({ error: "Missing body" });
	}

	const { title, done, user_id } = req.body;

	if (!title || !done || user_id === undefined) {
		return res.status(400).send({ error: "Missing required fields" });
	}

	const task = await getTaskById(id);
	if (!task) {
		return res.status(404).send({ error: "Task not found" });
	}

	const updatedTask = await updateTask({
		id,
        title,
		done,
		user_id
	});

	if (!updatedTask) {
		return res.status(404).send({ error: "Task not found" });
	}

	res.send(updatedTask);
});

export default router;