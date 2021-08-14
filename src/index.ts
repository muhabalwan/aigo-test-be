import express from 'express';
import file from './router/file';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb',extended: true }));
app.use(express.json());

app.use("/api/file", file);

app.get('/', (req, res) => {
  res.send(`Node Express Typescript project is running on ${PORT}!`);
});



app.listen(PORT, () => {
  return console.log(`server is listening on ${PORT}`);
});