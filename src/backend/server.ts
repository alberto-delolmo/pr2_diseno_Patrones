import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/order", (req, res) => {
  const { email, descripcion } = req.body;

  const now = new Date();
  const newEmail = email ? ` Email: ${email}` : "Anónimo";

  const message = `${now.toLocaleString()} - ${newEmail}:\nPedido: ${descripcion}`;

  const filePath = path.join(process.cwd(), "orders.txt");
  fs.appendFileSync(filePath, message);

  res.sendStatus(200);
});

app.listen(3001, () => {
  console.log("Backend corriendo en http://localhost:3001");
});