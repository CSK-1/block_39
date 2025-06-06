import db from "./db/client.js";

export async function createTask({ title, done, user_id }) {
    const sql = `
        INSERT INTO tasks (title, done, user_id)
        VALUES ($1, $2, $3)
        RETURNING *;`;
    const { rows: task } = await db.query(sql, [
        title,
        done,
        user_id
    ]);
    return task[0];
}

export async function getTasksbyUser(user_id) {
    const sql = `
  SELECT * FROM tasks WHERE user_id = $1;`;
    const { rows: tasks } = await db.query(sql, [user_id]);
    return tasks;
}

export async function getTaskById(id) {
    const sql = `
      SELECT * FROM tasks WHERE id = $1;
      `;
    const { rows: task } = await db.query(sql, [id]);
    return task[0];
}

export async function updateTask({ title, done, user_id }) {
    const sql = `
      UPDATE tasks
      SET title = $1, done = $2, user_id = $3
      WHERE id = $4
      RETURNING *;
    `;
    const { rows: task } = await db.query(sql, [title, done, user_id, id]);
    return task[0];
  }

export async function deleteTask(id) {
    const sql = `
      DELETE FROM tasks WHERE id = $1
      RETURNING *;
    `;
    const { rows: task } = await db.query(sql, [id]);
    return task;
  }