interface IFeature {
    type: string,
    author: string,
    category: string,
    geometry: {
        type: string,
        coordinates: Array<Array<Array<number>>>
        area?: number
    }
}

// GeoJsonData format: https://en.wikipedia.org/wiki/GeoJSON

export interface IGeoJsonData {
    type: string,
    area: number,
    features: Array<IFeature>
}

interface IPoint {
    x: number,
    y: number,
}

interface IPolygoneData {
    author: string,
    category: string,
    polygon: {
        points: Array<IPoint>
    }
}
export interface IPolygon {
    author: string,
    category: string,
    polygon: {
        points: Array<IPoint>
    }
}


export interface JsonRawData {
    payload: {
        area: number,
        config: string,
        points: Array<number>,
        polygons: Array<IPolygon>
    }

}

export const getFormattedPolygons = (rawData: JsonRawData) => {
    rawData.payload.polygons.map((poly: IPolygoneData) => {
        return {
            author: poly.author,
            category: poly.category,
            polygon: {
                points: [poly.polygon.points.map(point => [point.x, point.y])]
            }
        }
    });
    return rawData.payload.polygons;
}



export const formatJsonToGeoJson = (rawData: JsonRawData) => {
    const geojsonObject: IGeoJsonData = {
        type: "FeatureCollection",
        area: rawData.payload.area,
        features: rawData.payload.polygons.map(poly => {
            return {
                author: poly.author,
                category: poly.category,
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [poly.polygon.points.map(point => [point.x, point.y])],
                    area: calculatePolygonArea(poly.polygon.points)
                }
            }

        })
    }
    return geojsonObject;
}

interface IGeoJsonMap {
    [category: string]: {
        type: string,
        features: Array<IFeature>
    }
}

export const splitGeoJsonByGroup = (geoJson: IGeoJsonData) => {
    const geoJsonMap: IGeoJsonMap = {};
    geoJson.features.forEach(feature => {
        geoJsonMap[feature.category] = {
            type: "FeatureCollection",
            features: []
        }
    })
    Object.keys(geoJsonMap).forEach(key => {
        geoJson.features.forEach(feature => {
            if (feature.category === key) {
                geoJsonMap[key].features.push(feature)
            }
        })
    })
    return geoJsonMap;
}


export const sortOutFeatures = (geoJsonMap: IGeoJsonMap) => {
    Object.keys(geoJsonMap).forEach(key => {
        geoJsonMap[key].features.sort((a, b) => {
            if (a.geometry.area && b.geometry.area)
                return a.geometry.area - b.geometry.area;
            return 0;
        });
    })
    return geoJsonMap;
}

type TPoints = Array<{
    x: number, y: number,
}>;

export function calculatePolygonArea(points: TPoints) {
    const pointsLength = points.length;
    let det = 0
    points = points.map(normalize)
    if (points[0] != points[points.length - 1])
        points = points.concat(points[0])

    for (var i = 0; i < pointsLength; i++)
        det += points[i].x * points[i + 1].y
            - points[i].y * points[i + 1].x

    return Math.abs(det) / 2
}

function normalize(point: { x: number, y: number }) {
    if (!Array.isArray(point)) return point
    return {
        x: point[0],
        y: point[1]
    }
}