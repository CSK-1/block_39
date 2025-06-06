import db from "#db/client";
import bcrypt from 'bcrypt'

import { createTask } from "./queries/tasks.js";
import { createUser } from "./queries/users.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  try {
    await db.connect();

    const user1 = await createUser({ username: "testuser", password: "password"});

    await Promise.all([
      createTask({ title: "Go to grocery store", done: true, user_id: user1.id }),
      createTask({ title: "Go to REI", done: false, user_id: user1.id }),
      createTask({ title: "Go camping", done: false, user_id: user1.id })
    ]);

    console.log("🌱 Database seeded.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await db.end();
  }
}
