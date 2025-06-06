import db from "#db/client";

export async function createUser({ username, password }) {
	const sql = `
        INSERT INTO users (username, password)
        VALUES ($1, $2)
        RETURNING *;`;
    const newPassword = await bcrypt.hash(password, 5)
	const { rows: user } = await db.query(sql, [
		username,
		newPassword
	]);
	return user[0];
}

export async function getUsers() {
	const sql = `
  SELECT * FROM users;`;
	const { rows: users } = await db.query(sql);
	return users;
}

export async function getUser(id) {
	const sql = `
      SELECT * FROM users WHERE id = $1;
      `;
	const { rows: user } = await db.query(sql, [id]);
	return user[0];
}

export async function getUserByUsername(username) {
    const sql = `
    SELECT * FROM users WHERE username = $1;`;
    const {rows:user} = await db.query(sql, [username]);
    return user[0];
}

export async function updateUser({ username, password }) {
    const sql = `
      UPDATE users
      SET username = $1, password = $2
      WHERE id = $3
      RETURNING *;
    `;
    const { rows: user } = await db.query(sql, [username, password, id]);
    return user[0];
  }

export async function deleteUser(id) {
    const sql = `
      DELETE FROM users WHERE id = $1
      RETURNING *;
    `;
    const { rows: user } = await db.query(sql, [id]);
    return user;
  }