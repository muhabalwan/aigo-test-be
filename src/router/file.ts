import express from 'express';
import { formatJsonToGeoJson, sortOutFeatures, splitGeoJsonByGroup } from '../utils';

const app = express.Router();

app.get('/', async (req, res) => {
    return res.send(`PAGE Received a GET HTTP method ${"result"}`);
});

app.post('/', async (req, res) => {
    if (res.statusCode === 200) {
        const jsonD = req.body;
        const result = formatJsonToGeoJson(jsonD)
        const mappedRes = splitGeoJsonByGroup(result);
        const sortedMappedRes = sortOutFeatures(mappedRes);
        return res.send( sortedMappedRes);
    }
});

export default app;