import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { createClient } from "@libsql/client";

const client = createClient({ url: "file:agendamentos.db" });

async function seedIfNeeded() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL
    );
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL,
      hora TEXT NOT NULL,
      status TEXT NOT NULL,
      usuarioId INTEGER NOT NULL
    );
  `);
  const usuariosCount = await client.execute(
    "SELECT COUNT(*) as count FROM usuarios"
  );
  const count = Number(usuariosCount.rows[0].count);
  if (count === 0) {
    await client.execute(
      "INSERT INTO usuarios (nome, email) VALUES (?, ?), (?, ?), (?, ?)",
      [
        "Fulano",
        "fulano@edu.unifor.br",
        "Beltrano",
        "beltrano@edu.unifor.br",
        "Sicrano",
        "sicrano@edu.unifor.br",
      ]
    );
    await client.execute(
      `INSERT INTO agendamentos (data, hora, status, usuarioId)
        VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)`,
      [
        "2023-11-10",
        "14:00",
        "ativo",
        1,
        "2023-11-12",
        "09:00",
        "concluido",
        2,
        "2023-11-15",
        "16:30",
        "ativo",
        3,
      ]
    );
  }
}
await seedIfNeeded();

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .get("/usuarios", async () => {
    const res = await client.execute("SELECT * FROM usuarios");
    return res.rows;
  })
  .post("/usuarios", async ({ body }) => {
    const { nome, email } = body as { nome?: string; email?: string };
    if (!nome || !email) return { error: "Nome e email obrigatórios" };
    await client.execute("INSERT INTO usuarios (nome, email) VALUES (?, ?)", [
      String(nome),
      String(email),
    ]);
    const res = await client.execute(
      "SELECT * FROM usuarios ORDER BY id DESC LIMIT 1"
    );
    return res.rows[0];
  })
  .put("/usuarios/:id", async ({ params, body }) => {
    const id = Number(params.id);
    const { nome, email } = body as { nome?: string; email?: string };
    if (!nome || !email) return { error: "Nome e email obrigatórios" };
    await client.execute(
      "UPDATE usuarios SET nome = ?, email = ? WHERE id = ?",
      [String(nome), String(email), id]
    );
    const res = await client.execute("SELECT * FROM usuarios WHERE id = ?", [
      id,
    ]);
    return res.rows[0] || { error: "Usuário não encontrado" };
  })
  .delete("/usuarios/:id", async ({ params }) => {
    const id = Number(params.id);
    await client.execute("DELETE FROM agendamentos WHERE usuarioId = ?", [id]);
    await client.execute("DELETE FROM usuarios WHERE id = ?", [id]);
    return { ok: true };
  })
  .get("/agendamentos", async () => {
    const res = await client.execute("SELECT * FROM agendamentos");
    return res.rows;
  })
  .post("/agendamentos", async ({ body }) => {
    const { data, hora, status, usuarioId } = body as {
      data?: string;
      hora?: string;
      status?: string;
      usuarioId?: number;
    };
    if (!data || !hora || !status || typeof usuarioId !== "number")
      return { error: "Todos os campos são obrigatórios" };
    await client.execute(
      "INSERT INTO agendamentos (data, hora, status, usuarioId) VALUES (?, ?, ?, ?)",
      [String(data), String(hora), String(status), usuarioId]
    );
    const res = await client.execute(
      "SELECT * FROM agendamentos ORDER BY id DESC LIMIT 1"
    );
    return res.rows[0];
  })
  .put("/agendamentos/:id", async ({ params, body }) => {
    const id = Number(params.id);
    const { data, hora, status, usuarioId } = body as {
      data?: string;
      hora?: string;
      status?: string;
      usuarioId?: number;
    };
    if (!data || !hora || !status || typeof usuarioId !== "number")
      return { error: "Todos os campos são obrigatórios" };
    await client.execute(
      "UPDATE agendamentos SET data = ?, hora = ?, status = ?, usuarioId = ? WHERE id = ?",
      [String(data), String(hora), String(status), usuarioId, id]
    );
    const res = await client.execute(
      "SELECT * FROM agendamentos WHERE id = ?",
      [id]
    );
    return res.rows[0] || { error: "Agendamento não encontrado" };
  })
  .delete("/agendamentos/:id", async ({ params }) => {
    const id = Number(params.id);
    await client.execute("DELETE FROM agendamentos WHERE id = ?", [id]);
    return { ok: true };
  })
  .listen(3001);

console.log("Rodando em http://localhost:3001");
