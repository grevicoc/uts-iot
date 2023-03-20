import express, { Express } from "express";
import bodyParser from "body-parser";
import CreateClient from "./outbounds/mqtt";
import { calculateRunTime, meanRunTime } from "./services/insight";
import { data } from "./global/data";

const PORT = 3663;

const app: Express = express();
const jsonParser = bodyParser.json();

const client = CreateClient("status");

app.use(jsonParser);

app.get("/status", (req, res) => {
  const errorMsg = meanRunTime(data) > 0.5 ? "Device is up for too long!" : null;
  console.log(meanRunTime(data))
  console.log(data);
  return res.json({
    data: data[data.length-1] ?? null,
    message: errorMsg
  })
});

app.post("/status", (req, res) => {
  const { command } = req.body;
  if (command === 'on'){
    console.log(command);
    client.publish('change', '1');
  }
  if (command === 'off'){
    console.log("here!");
    client.publish('change', '0');
  }

  return res.sendStatus(200);
});

app.get('/insights/:insight', (req, res) => {
  const {insight} = req.params;
  if (insight === 'runtime'){
    return res.json({
      data: calculateRunTime(data)
    })
  }

  if (insight === 'mean'){
    return res.json({
      data: meanRunTime(data)
    })
  }
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
