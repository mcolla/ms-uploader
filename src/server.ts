import express from 'express';
import { router } from './routes';

const app = express();

app.use(router);

app.get('/', (request, response) => {
  return response.json({ message: "It's running" });
});

app.listen(3333, () => {
  console.log('🚀 microservice started');
});
