import express, { Express } from "express";
import bodyParser from "body-parser";
import CreateClient from "./outbounds/mqtt";
import { calculateRunTime, meanRunTime } from "./services/insight";
import { data } from "./global/data";
import cors from 'cors';

const PORT = 3663;

const app: Express = express();
const jsonParser = bodyParser.json();

const client = CreateClient("status");

const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions));

app.use(jsonParser);

app.get("/status", (req, res) => {
  const errorMsg = meanRunTime(data) > 0.5 ? "Device is up for too long!" : null;
  return res.json({
    data: data[data.length-1] ?? null,
    message: errorMsg
  })
});

app.post("/status", (req, res) => {
  const { command } = req.body;
  if (command === 'on'){
    client.publish('change', '1');
  }
  if (command === 'off'){
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
