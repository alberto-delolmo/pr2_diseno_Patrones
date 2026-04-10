import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/order", (req, res) => {
  const { price, email } = req.body;

  const now = new Date();
  const emailText = email ? ` - Email: ${email}` : "";

  const line = `${now.toLocaleString()} - Pedido de ${price}€${emailText}\n`;

  const filePath = path.join(process.cwd(), "orders.txt");
  fs.appendFileSync(filePath, line);

  res.sendStatus(200);
});

app.listen(3001, () => {
  console.log("Backend corriendo en http://localhost:3001");
});