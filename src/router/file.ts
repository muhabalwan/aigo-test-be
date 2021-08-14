import { json } from 'body-parser';
import express from 'express';
import { calculatePolygonArea, formatJsonToGeoJson, sortOutFeatures, splitGeoJsonByGroup } from '../utils';
const app = express.Router();

app.get('/', async (req, res) => {
    return res.send(`PAGE Received a GET HTTP method ${"result"}`);
});



app.post('/', async (req, res) => {
    if (res.statusCode === 200) {
        const jsonD = req.body;
        const result = formatJsonToGeoJson(jsonD)
        console.log('result --->', result);
        const mappedRes = splitGeoJsonByGroup(result);
        const sortedMappedRes = sortOutFeatures(mappedRes);
        return res.send( sortedMappedRes);
    }
    // TODO: handle errors
    // Add data validation
    // Through error msg if data form is incorrect
});

export default app;