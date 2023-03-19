import express, { Express } from 'express';
import CreateClient from './outbounds/mqtt';

const PORT=3663

const app: Express = express();

const clientStatus = CreateClient('status');

app.listen(PORT, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${PORT}`
  );
});