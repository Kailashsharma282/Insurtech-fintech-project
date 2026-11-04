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
    name: 'Ghatal Block (Purba Medinipur)',
    aliases: ['ghatal', 'ghatal block', 'ghatal village', 'ghatal central', 'silabati basin', 'silabati'],
    type: 'BLOCK',
    district: 'Purba Medinipur',
    state: 'West Bengal',
    description: 'Primary Pilot Cadastral Study Area in Silabati River Floodplain with 20 monitored farms',
    centroid: [22.6667, 87.6875],
    bounds: [[22.541667, 87.583333], [22.791667, 87.791667]],
    boundary: [
  [
    22.789889,
    87.753939
  ],
  [
    22.786078,
    87.742843
  ],
  [
    22.777185,
    87.748114
  ],
  [
    22.76372,
    87.740901
  ],
  [
    22.758893,
    87.727586
  ],
  [
    22.75,
    87.718154
  ],
  [
    22.749238,
    87.710941
  ],
  [
    22.757114,
    87.708999
  ],
  [
    22.759909,
    87.704561
  ],
  [
    22.75686,
    87.693742
  ],
  [
    22.751525,
    87.688471
  ],
  [
    22.752287,
    87.68431
  ],
  [
    22.740346,
    87.688471
  ],
  [
    22.740092,
    87.671549
  ],
  [
    22.736027,
    87.671549
  ],
  [
    22.729421,
    87.683478
  ],
  [
    22.721799,
    87.678484
  ],
  [
    22.718496,
    87.670162
  ],
  [
    22.722307,
    87.654904
  ],
  [
    22.719513,
    87.65213
  ],
  [
    22.712145,
    87.652963
  ],
  [
    22.705793,
    87.642144
  ],
  [
    22.690803,
    87.640202
  ],
  [
    22.680387,
    87.632989
  ],
  [
    22.669716,
    87.619119
  ],
  [
    22.674543,
    87.612738
  ],
  [
    22.678862,
    87.613293
  ],
  [
    22.675305,
    87.612184
  ],
  [
    22.665143,
    87.620228
  ],
  [
    22.658283,
    87.620228
  ],
  [
    22.64126,
    87.610796
  ],
  [
    22.638212,
    87.613571
  ],
  [
    22.626525,
    87.613016
  ],
  [
    22.618141,
    87.593042
  ],
  [
    22.612805,
    87.599978
  ],
  [
    22.613313,
    87.610796
  ],
  [
    22.604421,
    87.605248
  ],
  [
    22.601626,
    87.595816
  ],
  [
    22.592226,
    87.608577
  ],
  [
    22.585366,
    87.609409
  ],
  [
    22.579523,
    87.624667
  ],
  [
    22.586128,
    87.63188
  ],
  [
    22.585366,
    87.638815
  ],
  [
    22.592226,
    87.648801
  ],
  [
    22.59375,
    87.66184
  ],
  [
    22.587907,
    87.663504
  ],
  [
    22.607978,
    87.664891
  ],
  [
    22.616362,
    87.675155
  ],
  [
    22.61433,
    87.682645
  ],
  [
    22.618649,
    87.700677
  ],
  [
    22.626017,
    87.697903
  ],
  [
    22.634909,
    87.705393
  ],
  [
    22.632114,
    87.710664
  ],
  [
    22.636433,
    87.742566
  ],
  [
    22.635417,
    87.772248
  ],
  [
    22.632114,
    87.77641
  ],
  [
    22.634655,
    87.78168
  ],
  [
    22.618141,
    87.78279
  ],
  [
    22.617124,
    87.789725
  ],
  [
    22.619919,
    87.789725
  ],
  [
    22.618141,
    87.784177
  ],
  [
    22.634147,
    87.784177
  ],
  [
    22.634655,
    87.77419
  ],
  [
    22.647866,
    87.771139
  ],
  [
    22.650153,
    87.764758
  ],
  [
    22.672765,
    87.748669
  ],
  [
    22.679878,
    87.748946
  ],
  [
    22.682673,
    87.753939
  ],
  [
    22.693598,
    87.746172
  ],
  [
    22.707063,
    87.746172
  ],
  [
    22.712399,
    87.739237
  ],
  [
    22.722561,
    87.738682
  ],
  [
    22.728405,
    87.743675
  ],
  [
    22.727389,
    87.750333
  ],
  [
    22.728913,
    87.743675
  ],
  [
    22.722561,
    87.738127
  ],
  [
    22.712145,
    87.738682
  ],
  [
    22.707063,
    87.745617
  ],
  [
    22.693598,
    87.745895
  ],
  [
    22.682673,
    87.753385
  ],
  [
    22.680641,
    87.748391
  ],
  [
    22.675559,
    87.747836
  ],
  [
    22.683943,
    87.738682
  ],
  [
    22.693344,
    87.741733
  ],
  [
    22.706809,
    87.737017
  ],
  [
    22.714939,
    87.730914
  ],
  [
    22.717734,
    87.722037
  ],
  [
    22.742632,
    87.724257
  ],
  [
    22.751017,
    87.719263
  ],
  [
    22.757368,
    87.727031
  ],
  [
    22.764736,
    87.746172
  ],
  [
    22.769563,
    87.74423
  ],
  [
    22.779472,
    87.749223
  ],
  [
    22.785824,
    87.744508
  ],
  [
    22.789889,
    87.753939
  ]
],
    totalAcreageHa: 1450,
    monitoredPlots: 20
  },
  {
    id: 'area-purba-medinipur',
    name: 'Purba Medinipur District',
    aliases: ['purba medinipur', 'east medinipur', 'midnapore east', 'medinipur east', 'tamluk', 'haldia', 'contai'],
    type: 'DISTRICT',
    district: 'Purba Medinipur',
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
    district: 'Purba Medinipur',
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
    district: 'Purba Medinipur',
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
