import express from "express";
import 'dotenv/config'
import logger from "./logger.js";
import morgan from "morgan";

const morganFormat = ":method :url :status :response-time ms";



const app = express();
const port = 3003;
app.use(express.json());

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let CoffeeData = [];
let nextId = 1;

app.post("/coffee", (req, res) => {
  const { name, price } = req.body;
  const newCoffee = { id: nextId++, name, price };
  CoffeeData.push(newCoffee);
  res.status(201).send(newCoffee);
});

app.get("/coffee", (req, res) => {
  res.status(200).send(CoffeeData);
});

app.get("/coffee/:id", (req, res) => {
  const coffee = CoffeeData.find((t) => t.id === parseInt(req.params.id));
  if (!coffee) {
    return res.status(404).send("Not found");
  } else {
    res.status(200).send(coffee);
  }
});

app.put("/coffee/:id", (req, res) => {
  const coffee = CoffeeData.find((t) => t.id === parseInt(req.params.id));
  if (!coffee) {
    return res.status(404).send("Coffee not found");
  }
  const { name, price } = req.body;
  coffee.name = name;
  coffee.price = price;
  res.send(200).send(coffee);
});

app.delete("/coffee/:id", (req, res) => {
  const index = CoffeeData.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send("coffee not found");
  }
  CoffeeData.splice(index, 1);
  return res.status(204).send("deleted");
});
app.listen(port, () => {
  console.log(`Server is running on port: ${port}...`);
});
