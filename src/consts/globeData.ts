interface FighterData {
  name: string;
  country: string;
  city: string;
  geoJson: {
    type: string;
    features: {
      type: string;
      properties: {
        name: string;
      };
      geometry: {
        type: string;
        coordinates: number[][][][];
      };
    }[];
  };
  point: {
    lat: number;
    lng: number;
    altitude: number;
    radius: number;
    color: string;
  };
  label: {
    lat: number;
    lng: number;
    altitude: number;
    text: string;
    color: string;
    size: number;
  };
  color: string;
  cameraPosition: {
    lat: number;
    lng: number;
    altitude: number;
  };
}

export interface FightersDataType {
  [key: string]: FighterData;
}

// Definición de GeoJSON para los países más comunes
const spainGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Espana",
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            // Peninsula
            [
              [-9.165669013544374, 43.1163550319562],
              [-8.711842769370321, 42.045850176676595],
              [-6.530542249529276, 42.101137435390285],
              [-6.178754868230271, 41.56046140393508],
              [-7.330055396135691, 37.216650274177766],
              [-5.6498459466756685, 36.13852351114356],
              [-4.568276648935381, 36.76486076798582],
              [-2.27929259453569, 36.945725709476974],
              [-0.5200562049114694, 38.33004571865183],
              [0.04504764857810528, 38.67206219966218],
              [-0.45150431243419575, 39.390347867446025],
              [0.8501000473549425, 41.04341578902756],
              [3.13260613049016, 41.878759306307444],
              [3.1323929366901666, 42.376285826628305],
              [0.7303471061756568, 42.61549310628891],
              [-0.673485104345815, 42.721504268402526],
              [-1.8134804069275958, 43.30744434288681],
            ],
          ],
        ],
      },
    },
  ],
};

const argentinaGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Argentina",
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            // Forma simplificada de Argentina
            [
              [-73.4, -55.25],
              [-73.2, -50.0],
              [-70.0, -52.0],
              [-68.63, -52.63],
              [-68.63, -54.8],
              [-66.95, -54.89],
              [-65.05, -54.89],
              [-65.05, -42.0],
              [-64.4, -40.0],
              [-63.77, -38.0],
              [-62.8, -37.12],
              [-62.16, -36.0],
              [-62.16, -35.0],
              [-58.16, -34.78],
              [-57.5, -34.78],
              [-57.5, -30.0],
              [-56.5, -28.0],
              [-56.5, -27.0],
              [-58.0, -25.0],
              [-58.0, -22.0],
              [-64.0, -22.0],
              [-64.0, -24.0],
              [-67.0, -24.0],
              [-67.0, -26.0],
              [-71.0, -26.0],
              [-71.0, -34.0],
              [-71.0, -42.0],
              [-72.0, -50.0],
            ],
          ],
        ],
      },
    },
  ],
};

const mexicoGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Mexico",
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            // Forma simplificada de México
            [
              [-117.0858975081847, 32.48112482780567],
              [-109.9159239470788, 22.951453286704094],
              [-109.05328149983544, 23.490897175303232],
              [-114.94918530231277, 31.005001875997024],
              [-113.66629701961847, 31.545517865126456],
              [-105.14251965008333, 21.380873463504372],
              [-103.531932001276, 18.32967865617435],
              [-96.24336028240992, 15.696959963483764],
              [-92.00485229319128, 16.036866515224744],
              [-87.75146882362242, 19.30606515766533],
              [-87.84358990331353, 21.511524465673574],
              [-95.03454808677418, 18.296682937904464],
              [-98.91655947278485, 26.218540868158584],
              [-106.59403997821352, 31.576767217083344],
              [-117.23916733736428, 32.555425851768845],
            ],
          ],
        ],
      },
    },
  ],
};

// Crear constantes para valores repetidos
const DEFAULT_POINT = {
  altitude: 0.25,
  radius: 0.05,
  color: "white",
};

const DEFAULT_LABEL_CONFIG = {
  altitude: 0.25,
  color: "white",
  size: 5,
};

const DEFAULT_COLOR = "#f19fca";

// Función ayudante para crear datos de peleadores con menos repetición
function createFighterData(
  name: string,
  country: string,
  city: string,
  geoJson: any,
  coordinates: { lat: number; lng: number },
  cameraPosition: { lat: number; lng: number; altitude: number }
): FighterData {
  return {
    name,
    country,
    city,
    geoJson,
    point: {
      ...coordinates,
      ...DEFAULT_POINT,
    },
    label: {
      ...coordinates,
      text: `${name}: ${city}, ${country}`,
      ...DEFAULT_LABEL_CONFIG,
    },
    color: DEFAULT_COLOR,
    cameraPosition,
  };
}

// Ahora puedes definir peleadores de forma más concisa
export const fightersData: FightersDataType = {
  peereira7: createFighterData(
    "Peereira7",
    "Espana",
    "La Coruna",
    spainGeoJson,
    { lat: 43.3623, lng: -8.4115 },
    { lat: 40.4, lng: -3.7, altitude: 2.5 }
  ),
  rivaldios: createFighterData(
    "Rivaldios",
    "Mexico",
    "Culiacan",
    mexicoGeoJson,
    { lat: 24.8091, lng: -107.394 },
    { lat: 23.6345, lng: -102.5528, altitude: 2.5 }
  ),
  perxitaa: createFighterData(
    "Perxitaa",
    "Espana",
    "Valencia",
    spainGeoJson,
    { lat: 39.4699, lng: -0.3763 },
    { lat: 40.4, lng: -3.7, altitude: 2.5 }
  ),
  gaspi: createFighterData(
    "Gaspi",
    "Argentina",
    "Buenos Aires",
    argentinaGeoJson,
    { lat: -34.6037, lng: -58.3816 },
    { lat: -38.4161, lng: -63.6167, altitude: 2.5 }
  ),
  abby: createFighterData(
    "Abby",
    "Espana",
    "Palma de Mallorca",
    spainGeoJson,
    { lat: 39.5696, lng: 2.6502 },
    { lat: 40.4, lng: -3.7, altitude: 2.5 }
  ),
  roro: createFighterData(
    "Roro",
    "Espana",
    "Madrid",
    spainGeoJson,
    { lat: 40.4168, lng: -3.7038 },
    { lat: 40.4, lng: -3.7, altitude: 2.5 }
  ),
  andoni: createFighterData(
    "Andoni",
    "Espana",
    "San Sebastian",
    spainGeoJson,
    { lat: 43.3183, lng: -1.9812 },
    { lat: 40.4, lng: -3.7, altitude: 2.5 }
  ),
  carlosBelcast: createFighterData(
    "Carlos Belcast",
    "Mexico",
    "Monterrey",
    mexicoGeoJson,
    { lat: 25.6866, lng: -100.3161 },
    { lat: 23.6345, lng: -102.5528, altitude: 2.5 }
  ),
  alana: createFighterData(
    "Alana",
    "Mexico",
    "Mexico City",
    mexicoGeoJson,
    { lat: 19.4326, lng: -99.1332 },
    { lat: 23.6345, lng: -102.5528, altitude: 2.5 }
  ),
  ariGeli: createFighterData(
    "Ari Geli",
    "Espana",
    "Barcelona",
    spainGeoJson,
    { lat: 41.3851, lng: 2.1734 },
    { lat: 40.4, lng: -3.7, altitude: 2.5 }
  ),
  viruzz: createFighterData(
    "Viruzz",
    "Espana",
    "Zaragoza",
    spainGeoJson,
    { lat: 41.6488, lng: -0.8891 },
    { lat: 40.4, lng: -3.7, altitude: 2.5 }
  ),
  tomasMazza: createFighterData(
    "Tomas Mazza",
    "Argentina",
    "Buenos Aires",
    argentinaGeoJson,
    { lat: -34.6037, lng: -58.3816 },
    { lat: -38.4161, lng: -63.6167, altitude: 2.5 }
  ),
};
