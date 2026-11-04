export interface SearchableArea {
  id: string;
  name: string;
  aliases: string[];
  type: 'VILLAGE' | 'BLOCK' | 'DISTRICT' | 'SUB_DISTRICT';
  district: string;
  state: string;
  description: string;
  centroid: [number, number]; // [lat, lng]
  bounds: [[number, number], [number, number]]; // SW, NE
  boundary: [number, number][]; // Polygon coords [lat, lng]
  totalAcreageHa?: number;
  monitoredPlots?: number;
}

export const SEARCHABLE_AREAS: SearchableArea[] = [
  {
    id: 'area-ghatal-block',
    name: 'Ghatal Block (Paschim Medinipur)',
    aliases: ['ghatal', 'ghatal block', 'ghatal village', 'ghatal central', 'silabati basin', 'silabati'],
    type: 'BLOCK',
    district: 'Paschim Medinipur',
    state: 'West Bengal',
    description: 'Primary Pilot Cadastral Study Area in Silabati River Floodplain with 20 monitored farms',
    centroid: [22.6667, 87.6875],
    bounds: [[22.541667, 87.583333], [22.791667, 87.791667]],
    boundary: [
      [22.760813, 87.708692],
      [22.760813, 87.703916],
      [22.757648, 87.696156],
      [22.752374, 87.691380],
      [22.752901, 87.686306],
      [22.747099, 87.686306],
      [22.742353, 87.690783],
      [22.739716, 87.689589],
      [22.739188, 87.686306],
      [22.742353, 87.675561],
      [22.740770, 87.672875],
      [22.736024, 87.673173],
      [22.731013, 87.684814],
      [22.728376, 87.685112],
      [22.720201, 87.678844],
      [22.718355, 87.671382],
      [22.722574, 87.660936],
      [22.720728, 87.653176],
      [22.711762, 87.653176],
      [22.707279, 87.647505],
      [22.706751, 87.642431],
      [22.705169, 87.641237],
      [22.689610, 87.639446],
      [22.685654, 87.637357],
      [22.677479, 87.629596],
      [22.674315, 87.622433],
      [22.670095, 87.618254],
      [22.653218, 87.617359],
      [22.649789, 87.614374],
      [22.644779, 87.613479],
      [22.639241, 87.608405],
      [22.636340, 87.611091],
      [22.624473, 87.610792],
      [22.618144, 87.600346],
      [22.618671, 87.591690],
      [22.616825, 87.589899],
      [22.614188, 87.590198],
      [22.609705, 87.598555],
      [22.612078, 87.603331],
      [22.610496, 87.607211],
      [22.603376, 87.604525],
      [22.598365, 87.595272],
      [22.595992, 87.600346],
      [22.589135, 87.605718],
      [22.582279, 87.606614],
      [22.576477, 87.618851],
      [22.576477, 87.623925],
      [22.583334, 87.631387],
      [22.582015, 87.637954],
      [22.588344, 87.644818],
      [22.590454, 87.663622],
      [22.598102, 87.660637],
      [22.598365, 87.664518],
      [22.603112, 87.663324],
      [22.611287, 87.671382],
      [22.613661, 87.676457],
      [22.611551, 87.683918],
      [22.613661, 87.688097],
      [22.613924, 87.694663],
      [22.616562, 87.698543],
      [22.615770, 87.702722],
      [22.617089, 87.703021],
      [22.617089, 87.698842],
      [22.619199, 87.697947],
      [22.628692, 87.703618],
      [22.632384, 87.708095],
      [22.630011, 87.714661],
      [22.632912, 87.731375],
      [22.631593, 87.739136],
      [22.634494, 87.748388],
      [22.633175, 87.781220],
      [22.641878, 87.777639],
      [22.646097, 87.777937],
      [22.648998, 87.770774],
      [22.652426, 87.769878],
      [22.662448, 87.759730],
      [22.665085, 87.759730],
      [22.664557, 87.756746],
      [22.667722, 87.754059],
      [22.674315, 87.754059],
      [22.674051, 87.751373],
      [22.679853, 87.745404],
      [22.684336, 87.743911],
      [22.693566, 87.746896],
      [22.705433, 87.742717],
      [22.714135, 87.736450],
      [22.717564, 87.726301],
      [22.722047, 87.727495],
      [22.728903, 87.726003],
      [22.741034, 87.728689],
      [22.747363, 87.726600],
      [22.750528, 87.723018],
      [22.749737, 87.714661],
      [22.757121, 87.712870]
    ],
    totalAcreageHa: 1450,
    monitoredPlots: 20
  },
  {
    id: 'area-purba-medinipur',
    name: 'Paschim Medinipur District',
    aliases: ['purba medinipur', 'east medinipur', 'midnapore east', 'medinipur east', 'tamluk', 'haldia', 'contai'],
    type: 'DISTRICT',
    district: 'Paschim Medinipur',
    state: 'West Bengal',
    description: 'Coastal and Alluvial Delta District in Southern Bengal comprising 25 administrative blocks',
    centroid: [22.280, 87.850],
    bounds: [[21.60, 87.45], [22.85, 88.20]],
    boundary: [
  [
    22.791,
    87.754
  ],
  [
    22.68,
    87.785
  ],
  [
    22.45,
    87.92
  ],
  [
    22.28,
    88.1
  ],
  [
    22.05,
    88.18
  ],
  [
    21.8,
    88.05
  ],
  [
    21.62,
    87.75
  ],
  [
    21.68,
    87.52
  ],
  [
    21.9,
    87.55
  ],
  [
    22.15,
    87.68
  ],
  [
    22.4,
    87.62
  ],
  [
    22.58,
    87.6
  ],
  [
    22.72,
    87.655
  ],
  [
    22.791,
    87.754
  ]
],
    totalAcreageHa: 471300,
    monitoredPlots: 20
  },
  {
    id: 'area-kharar',
    name: 'Kharar Municipal / Gram Panchayat Unit',
    aliases: ['kharar', 'kharar town', 'kharar gp', 'north ghatal'],
    type: 'VILLAGE',
    district: 'Paschim Medinipur',
    state: 'West Bengal',
    description: 'Northern buffer sector adjacent to Ghatal Block boundary with highland paddy terraces',
    centroid: [22.745, 87.720],
    bounds: [[22.725, 87.695], [22.770, 87.745]],
    boundary: [
  [
    22.75,
    87.7
  ],
  [
    22.765,
    87.725
  ],
  [
    22.755,
    87.74
  ],
  [
    22.735,
    87.73
  ],
  [
    22.73,
    87.705
  ],
  [
    22.75,
    87.7
  ]
],
    totalAcreageHa: 340,
    monitoredPlots: 4
  },
  {
    id: 'area-chandrakona',
    name: 'Kshirpai & Chandrakona Sector',
    aliases: ['kshirpai', 'chandrakona', 'chandrakona-i', 'west buffer'],
    type: 'SUB_DISTRICT',
    district: 'Paschim Medinipur',
    state: 'West Bengal',
    description: 'Western bordering sub-district with transition soils and Silabati river inflow',
    centroid: [22.712, 87.635],
    bounds: [[22.680, 87.610], [22.745, 87.675]],
    boundary: [
  [
    22.725,
    87.62
  ],
  [
    22.74,
    87.66
  ],
  [
    22.705,
    87.67
  ],
  [
    22.685,
    87.635
  ],
  [
    22.7,
    87.615
  ],
  [
    22.725,
    87.62
  ]
],
    totalAcreageHa: 580,
    monitoredPlots: 5
  },
  {
    id: 'area-nadia',
    name: 'Nadia District (Ranaghat & Santipur Ag-Belt)',
    aliases: ['nadia', 'ranaghat', 'santipur', 'krishnanagar', 'nadia district'],
    type: 'DISTRICT',
    district: 'Nadia',
    state: 'West Bengal',
    description: 'Gangetic alluvial floodplain insurance unit known for Aman Paddy and winter Potato crops',
    centroid: [23.240, 88.450],
    bounds: [[22.95, 88.35], [23.50, 88.68]],
    boundary: [
  [
    23.5,
    88.4
  ],
  [
    23.45,
    88.65
  ],
  [
    23.15,
    88.68
  ],
  [
    22.95,
    88.55
  ],
  [
    23.0,
    88.35
  ],
  [
    23.25,
    88.38
  ],
  [
    23.5,
    88.4
  ]
],
    totalAcreageHa: 980,
    monitoredPlots: 8
  },
  {
    id: 'area-burdwan',
    name: 'Burdwan District (Kalna North Ag-Belt)',
    aliases: ['burdwan', 'bardhaman', 'purba bardhaman', 'kalna', 'kalna north'],
    type: 'DISTRICT',
    district: 'Burdwan',
    state: 'West Bengal',
    description: 'Granary of Bengal with extensive canal irrigation network and high yield Aman paddy',
    centroid: [23.210, 88.360],
    bounds: [[23.05, 88.05], [23.45, 88.45]],
    boundary: [
  [
    23.45,
    88.15
  ],
  [
    23.4,
    88.42
  ],
  [
    23.15,
    88.45
  ],
  [
    23.05,
    88.2
  ],
  [
    23.2,
    88.05
  ],
  [
    23.45,
    88.15
  ]
],
    totalAcreageHa: 2100,
    monitoredPlots: 6
  },
  {
    id: 'area-hooghly',
    name: 'Hooghly District (Tarakeswar Tuber Basin)',
    aliases: ['hooghly', 'hugli', 'tarakeswar', 'tarakeswar south'],
    type: 'DISTRICT',
    district: 'Hooghly',
    state: 'West Bengal',
    description: 'High density commercial tuber and potato corridor with intensive micro-irrigation',
    centroid: [22.870, 88.020],
    bounds: [[22.70, 87.98], [23.02, 88.45]],
    boundary: [
  [
    23.02,
    88.15
  ],
  [
    22.98,
    88.45
  ],
  [
    22.75,
    88.4
  ],
  [
    22.7,
    88.1
  ],
  [
    22.85,
    87.98
  ],
  [
    23.02,
    88.15
  ]
],
    totalAcreageHa: 1320,
    monitoredPlots: 4
  },
  {
    id: 'area-murshidabad',
    name: 'Murshidabad District (Berhampore Jute Corridor)',
    aliases: ['murshidabad', 'berhampore', 'berhampore rural', 'jute corridor'],
    type: 'DISTRICT',
    district: 'Murshidabad',
    state: 'West Bengal',
    description: 'Northern agro-ecological jute corridor with seasonal flood pulses and monsoon retting pools',
    centroid: [24.080, 88.250],
    bounds: [[23.85, 87.95], [24.35, 88.45]],
    boundary: [
  [
    24.35,
    88.1
  ],
  [
    24.28,
    88.45
  ],
  [
    23.95,
    88.38
  ],
  [
    23.85,
    88.12
  ],
  [
    24.1,
    87.95
  ],
  [
    24.35,
    88.1
  ]
],
    totalAcreageHa: 1850,
    monitoredPlots: 5
  }
];
