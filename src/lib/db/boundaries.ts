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
      [22.761223, 87.705733],
      [22.761223, 87.701493],
      [22.758127, 87.693860],
      [22.755289, 87.689903],
      [22.752709, 87.689337],
      [22.753483, 87.684249],
      [22.749355, 87.683684],
      [22.746517, 87.684815],
      [22.742905, 87.688489],
      [22.740583, 87.687641],
      [22.740067, 87.683401],
      [22.743163, 87.673225],
      [22.741099, 87.671246],
      [22.737229, 87.671246],
      [22.734133, 87.676334],
      [22.733359, 87.680574],
      [22.731037, 87.683118],
      [22.728973, 87.683118],
      [22.720717, 87.676334],
      [22.719427, 87.673507],
      [22.719427, 87.669267],
      [22.723555, 87.659656],
      [22.723039, 87.654285],
      [22.720201, 87.651459],
      [22.717105, 87.652589],
      [22.712719, 87.652307],
      [22.708075, 87.646936],
      [22.707817, 87.642413],
      [22.706011, 87.641000],
      [22.701883, 87.641282],
      [22.698013, 87.639869],
      [22.691048, 87.639303],
      [22.686662, 87.637325],
      [22.683308, 87.633085],
      [22.679696, 87.631106],
      [22.675310, 87.622625],
      [22.671182, 87.618951],
      [22.655444, 87.618385],
      [22.651316, 87.615276],
      [22.645898, 87.614145],
      [22.640996, 87.609340],
      [22.637642, 87.612166],
      [22.625774, 87.611601],
      [22.623710, 87.609622],
      [22.622420, 87.605665],
      [22.619840, 87.601990],
      [22.620356, 87.593510],
      [22.619066, 87.591814],
      [22.616486, 87.591531],
      [22.612358, 87.596619],
      [22.611326, 87.600577],
      [22.613390, 87.602555],
      [22.613390, 87.607644],
      [22.612616, 87.609057],
      [22.611326, 87.609057],
      [22.608488, 87.605948],
      [22.604618, 87.605382],
      [22.603070, 87.603121],
      [22.602812, 87.599729],
      [22.600232, 87.596902],
      [22.597910, 87.601707],
      [22.594298, 87.603686],
      [22.590944, 87.607078],
      [22.583978, 87.607926],
      [22.583462, 87.611884],
      [22.578302, 87.619799],
      [22.578302, 87.624322],
      [22.585268, 87.631388],
      [22.585526, 87.633933],
      [22.583978, 87.637890],
      [22.589138, 87.642696],
      [22.590170, 87.644957],
      [22.591460, 87.658808],
      [22.592750, 87.661918],
      [22.596104, 87.661635],
      [22.597910, 87.659939],
      [22.603586, 87.660504],
      [22.613906, 87.670963],
      [22.615196, 87.676052],
      [22.613390, 87.679726],
      [22.613390, 87.682553],
      [22.614938, 87.684815],
      [22.615454, 87.692730],
      [22.618034, 87.694991],
      [22.621130, 87.695556],
      [22.626806, 87.699514],
      [22.634546, 87.702906],
      [22.634546, 87.705450],
      [22.631966, 87.709125],
      [22.631450, 87.711386],
      [22.632482, 87.713365],
      [22.634030, 87.725803],
      [22.634030, 87.730891],
      [22.632998, 87.734566],
      [22.635836, 87.743894],
      [22.635836, 87.750678],
      [22.634804, 87.753223],
      [22.634546, 87.759159],
      [22.634804, 87.773293],
      [22.642544, 87.773010],
      [22.646156, 87.770183],
      [22.655960, 87.758593],
      [22.661636, 87.755484],
      [22.664474, 87.752657],
      [22.676342, 87.745308],
      [22.681760, 87.740785],
      [22.685630, 87.739654],
      [22.693627, 87.742763],
      [22.707301, 87.737958],
      [22.712461, 87.732870],
      [22.715557, 87.731739],
      [22.716847, 87.724955],
      [22.718395, 87.722693],
      [22.723039, 87.723824],
      [22.724845, 87.722693],
      [22.729489, 87.722411],
      [22.732069, 87.723824],
      [22.743679, 87.724955],
      [22.747033, 87.723541],
      [22.750645, 87.719867],
      [22.751161, 87.717322],
      [22.750387, 87.711104],
      [22.757353, 87.709973]
    ],
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
