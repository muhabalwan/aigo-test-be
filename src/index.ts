import express from 'express';
import file from './router/file';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json({limit: '50mb'}));
app.use(cors());
app.use(express.urlencoded({ limit: '50mb',extended: true }));
app.use(express.json())



// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });


// app.use(
//   '/api',
//   createProxyMiddleware({
//     target: 'http://localhost:3080',
//     changeOrigin: true,
//   })
// );

app.use("/api/file", file);

app.get('/', (req, res) => {
  res.send(`Node Express Typescript project is running on ${PORT}!`);
});



app.listen(PORT, () => {
  return console.log(`server is listening on ${PORT}`);
});