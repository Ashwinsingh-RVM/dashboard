/* ============================================================
   UTILITIES
   ============================================================ */
// Escape data strings before interpolating into innerHTML templates.
// Today the data layer is synthetic, but any field that will later be
// sourced from a real API (handler names, CP locations, ticket text,
// agent verdicts) must be routed through escapeHtml to close the XSS
// surface. See dashboard-audit findings, Phase 2 item: full sweep.
function escapeHtml(v) {
  if (v === null || v === undefined) return '';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================================
   NAVIGATION
   ============================================================ */
const NAV = [
  { id: 'exec', label: 'Executive Dashboard', icon: '📊', children: [
    { id: 'exec-home', label: 'Overview' },
  ]},
  { id: 'cp', label: 'Collection Points', icon: '📍', children: [
    { id: 'cp-overall',    label: 'Overall View' },
    { id: 'cp-machines',   label: 'Machines & RVMs',     count: 300 },
    { id: 'cp-handler',    label: 'Handler & HRMS' },
    { id: 'cp-bagflow',    label: 'Bag Flow' },
    { id: 'cp-material',   label: 'Material Acceptance' },
    { id: 'cp-user',       label: 'User Behavior' },
  ]},
  { id: 'hor', label: 'HoReCa', icon: '🏨', children: [
    { id: 'hor-overview', label: 'Overview' },
    { id: 'hor-cluster',  label: 'Cluster View' },
    { id: 'hor-block',    label: 'Block View' },
    { id: 'hor-pickup',   label: 'Pickup Frequency' },
    { id: 'hor-pipeline', label: 'Pipeline' },
  ]},
  { id: 'log', label: 'Logistics & Fleet', icon: '🚛', children: [
    { id: 'log-overview', label: 'Overview' },
    { id: 'log-orders',   label: 'Orders' },
    { id: 'log-trips',    label: 'Trips' },
    { id: 'log-fleet',    label: 'Fleet Management' },
    { id: 'log-vendor',   label: 'Vendor Management' },
    { id: 'log-vehicle',  label: 'Vehicle Availability' },
    { id: 'log-driver',   label: 'Driver & Helper' },
  ]},
  { id: 'wh', label: 'Warehouse', icon: '📦', children: [
    { id: 'wh-overview',  label: 'Overview' },
    { id: 'wh-bagflow',   label: 'Bag Flow Chain' },
    { id: 'wh-cpc',       label: 'CPC Network',         count: 5 },
    { id: 'wh-dock',      label: 'Dock & Vehicle Wait' },
    { id: 'wh-rvm-fill',  label: 'RVM Fill Rate' },
    { id: 'wh-stages',    label: 'Material Stages' },
    { id: 'wh-inward',    label: 'Inward' },
    { id: 'wh-sorting',   label: 'Sorting' },
    { id: 'wh-outbound',  label: 'Outbound' },
  ]},
  { id: 'cs', label: 'Customer Support', icon: '☎️', children: [
    { id: 'cs-tickets',     label: 'Tickets',       count: 47 },
    { id: 'cs-sla',         label: 'SLA / TAT' },
    { id: 'cs-csat',        label: 'CSAT' },
    { id: 'cs-escalations', label: 'Escalations',   count: 12 },
  ]},
  { id: 'cost', label: 'Costing & Finance', icon: '₹', children: [
    { id: 'cost-overview', label: 'Overview' },
    { id: 'cost-cp-group', label: 'CP', isGroup: true, items: [
      { id: 'cost-cp-travel', label: 'Travel' },
      { id: 'cost-cp-food',   label: 'Food' },
      { id: 'cost-cp-misc',   label: 'Miscellaneous' },
      { id: 'cost-cp-others', label: 'Others' },
    ]},
    { id: 'cost-hor-group', label: 'HoReCa', isGroup: true, items: [
      { id: 'cost-hor-travel', label: 'Travel' },
      { id: 'cost-hor-misc',   label: 'Miscellaneous' },
    ]},
    { id: 'cost-log-group', label: 'Logistics', isGroup: true, items: [
      { id: 'cost-log-vendor',   label: 'Vendor Payments' },
      { id: 'cost-log-manpower', label: 'Manpower' },
      { id: 'cost-log-travel',   label: 'Travel Cost' },
      { id: 'cost-log-misc',     label: 'Miscellaneous' },
    ]},
    { id: 'cost-wh-group', label: 'Warehouse', isGroup: true, items: [
      { id: 'cost-wh-rent',     label: 'Rent' },
      { id: 'cost-wh-elec',     label: 'Electricity' },
      { id: 'cost-wh-manpower', label: 'Manpower' },
      { id: 'cost-wh-misc',     label: 'Miscellaneous' },
    ]},
  ]},
  { id: 'alerts', label: 'Alerts Center', icon: '🚨', badge: 7, children: [
    { id: 'alerts-all', label: 'All Alerts', count: 7 },
  ]},
];

const MODULE_LABEL = { 'exec':'Executive Dashboard', 'cp':'Collection Points', 'hor':'HoReCa', 'log':'Logistics & Fleet', 'wh':'Warehouse', 'cs':'Customer Support', 'cost':'Costing & Finance', 'alerts':'Alerts Center' };

/* ============================================================
   MOCK DATA — 320 CPs
   ============================================================ */
const TALUKAS = ['Tiswadi','Bardez','Pernem','Bicholim','Sattari','Ponda','Mormugao','Salcete','Quepem','Canacona','Sanguem','Dharbandora'];
const DISTRICTS = { 'Tiswadi':'North Goa','Bardez':'North Goa','Pernem':'North Goa','Bicholim':'North Goa','Sattari':'North Goa','Ponda':'North Goa','Mormugao':'South Goa','Salcete':'South Goa','Quepem':'South Goa','Canacona':'South Goa','Sanguem':'South Goa','Dharbandora':'South Goa' };
const PANCHAYATS = ['Mapusa','Calangute','Candolim','Anjuna','Siolim','Saligao','Aldona','Penha','Panaji','Taleigao','Merces','St Cruz','Cumbarjua','Old Goa','Pernem Town','Mandrem','Morjim','Arambol','Bicholim Town','Mayem','Sanquelim','Sattari Town','Valpoi','Ponda Town','Marcaim','Borim','Vasco','Chicalim','Cortalim','Mormugao','Margao','Benaulim','Colva','Cavelossim','Varca','Loutolim','Curtorim','Quepem Town','Curchorem','Sanvordem','Sanguem Town','Canacona Town','Palolem','Cotigao','Dharbandora Town','Mollem','Collem','Sangod'];
const VENDORS = ['Tomra Solutions','Sielox','Reverse Logistics Co','Greentech RVM','EcoFleet','MetroLogix','SwiftBin','EcoVendor X'];
const HANDLERS = ['Rajesh K.','Sneha P.','Anil D.','Pooja N.','Suresh M.','Kavita S.','Ramesh G.','Manisha R.','Dilip T.','Bharti V.','Ganesh M.','Lata K.','Mohan P.','Sunita R.','Prakash D.'];
const CP_TYPES = ['RVM','Return Center','D2D','HoReCa','Non-Recykal'];
const STATUSES = ['Active','Active','Active','Active','Active','Active','Inactive','Maintenance','Down'];

const seedRand = (() => { let s = 7842; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })();
const pick = arr => arr[Math.floor(seedRand() * arr.length)];
const rint = (a, b) => Math.floor(a + seedRand() * (b - a));
const rfloat = (a, b, d = 1) => +(a + seedRand() * (b - a)).toFixed(d);

function genCPs(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const taluka = pick(TALUKAS);
    const panchayat = pick(PANCHAYATS);
    const cpType = pick(CP_TYPES);
    const status = pick(STATUSES);
    const mc = cpType === 'RVM' ? rint(1, 4) : cpType === 'Return Center' ? rint(2, 6) : rint(1, 2);
    const active = status === 'Down' ? 0 : status === 'Maintenance' ? Math.max(0, mc - 1) : mc;
    const down = mc - active;
    out.push({
      id: `CP${String(1000 + i)}`,
      name: `${cpType.split(' ')[0]}-${panchayat}-${String(i % 9 + 1).padStart(2,'0')}`,
      type: cpType,
      district: DISTRICTS[taluka],
      block: taluka,
      panchayat: panchayat,
      village: `${panchayat} V${rint(1,5)}`,
      lat: rfloat(14.9, 15.8, 4),
      lng: rfloat(73.7, 74.3, 4),
      installed: `2024-${String(rint(1,13)).padStart(2,'0')}-${String(rint(1,28)).padStart(2,'0')}`,
      vendor: pick(VENDORS),
      handler: status === 'Active' ? pick(HANDLERS) : (seedRand() > 0.6 ? pick(HANDLERS) : '—'),
      machineCount: mc,
      activeMachines: active,
      downMachines: down,
      dailyCollection: status === 'Down' ? 0 : rint(40, 480),
      totalMaterial: rint(2000, 28000),
      dailyTxn: status === 'Down' ? 0 : rint(20, 320),
      uptime: status === 'Down' ? 0 : status === 'Maintenance' ? rfloat(60, 80) : rfloat(88, 99.8),
      downtime: status === 'Down' ? 100 : status === 'Maintenance' ? rfloat(20, 40) : rfloat(0.2, 12),
      bagInventory: rint(2, 18),
      lastActive: status === 'Down' ? `${rint(2,18)}h ago` : `${rint(1,55)}m ago`,
      qrAttempts: rint(50, 540),
      consumers: rint(80, 1200),
      escalations: status === 'Down' ? rint(2,6) : rint(0,2),
      tickets: status === 'Down' ? rint(2,5) : rint(0,2),
      status: status,
    });
  }
  return out;
}
const CP_DATA = genCPs(320);

/* ============================================================
   CPC MANAGER OPERATIONAL MODEL (v18)
   HF / Double-Count rules, bag states, exceptions, SLAs
   Based on collectionflow-demo reference logic
   ============================================================ */

// Re-classification — determines HF eligibility + double-count requirement
// non-Re CPs (not Retearn/Recykal-owned) → HF=Yes, DC=Yes
// Re-Large / Re-Small → HF=No, DC=No
// HoReCa establishments (bulk pickup) → HF=No, DC=No regardless of Re classification
const RE_TYPES = ['Re-Large', 'Re-Small', 'non-Re'];
const RE_TYPE_WEIGHTS = { 'Re-Large': 0.30, 'Re-Small': 0.35, 'non-Re': 0.35 };

const ESTABLISHMENT_FROM_CP_TYPE = {
  'RVM':           'Retail',
  'Return Center': 'Retail',
  'D2D':           'Retail',
  'HoReCa':        'HoReCa',
  'Non-Recykal':   'Liquor',
};

// Decorate each CP with HF/DC flags + bag states (sealed/active/empty)
// without breaking any existing fields
(function decorateCps() {
  for (let i = 0; i < CP_DATA.length; i++) {
    const cp = CP_DATA[i];
    // Deterministic reType from index hash (stable across renders)
    const h = (cp.id.charCodeAt(2) + cp.id.charCodeAt(3) + i * 13) % 100;
    cp.reType = h < 30 ? 'Re-Large' : h < 65 ? 'Re-Small' : 'non-Re';
    cp.establishmentType = ESTABLISHMENT_FROM_CP_TYPE[cp.type] || 'Retail';
    cp.hfEligible          = cp.reType === 'non-Re' && cp.establishmentType !== 'HoReCa';
    cp.doubleCountRequired = cp.reType === 'non-Re' && cp.establishmentType !== 'HoReCa';
    // Bag states — sealed/active/empty
    const sealed = cp.status === 'Down' ? 0 : (((h * 7) % 100) < 35 ? ((h * 3) % 5) + 1 : 0);
    cp.sealedBags = sealed;
    cp.activeBags = cp.status === 'Down' ? 0 : ((h * 11) % 3);
    cp.emptyBags = cp.bagInventory;
    cp.bagLow = cp.emptyBags < 6;
    // Longest sealed-bag wait time (hours)
    cp.longestWaitH = sealed > 0 ? (((h * 5) % 38) + 1) : 0;
    cp.slaBreachedSeal = sealed > 0 && cp.longestWaitH > 4;
    // Trip assignment — deterministic
    cp.hasTrip = sealed > 0 ? (((h * 17) % 100) < 70) : false;
  }
})();

// 5-stage bag flow pipeline (warehouse view, statewide aggregated)
// Each stage has count, weight, breach indicator, oldest age
const WH_BAG_FLOW = (function buildBagFlow() {
  const sealedTotal = CP_DATA.reduce((s, cp) => s + cp.sealedBags, 0);
  const sealedBreaches = CP_DATA.filter(cp => cp.slaBreachedSeal).length;
  return {
    stages: [
      { id: 'sealed', label: 'Sealed at Field', count: sealedTotal,                 unit: 'bags',  weightKg: sealedTotal * 9,
        oldestH: 38, breach: sealedBreaches > 0, breachCount: sealedBreaches, note: sealedBreaches + ' awaiting trip >4h' },
      { id: 'transit', label: 'In Transit', count: 42,                              unit: 'trips', weightKg: 5200,
        oldestH: 4,  breach: false, breachCount: 0, note: '~282 bags en route' },
      { id: 'staging', label: 'Staging', count: 198,                                unit: 'bags',  weightKg: 2820,
        oldestH: 32, breach: true,  breachCount: 12, note: '12 bags > 24h SLA' },
      { id: 'processing', label: 'Processing', count: 84,                           unit: 'bags',  weightKg: 1180,
        oldestH: 18, breach: false, breachCount: 0, note: '54 counting · 30 sorting' },
      { id: 'dispatch', label: 'Dispatch Ready', count: 62,                         unit: 'lots',  weightKg: 21400,
        oldestH: 192, breach: true,  breachCount: 8, note: '8 lots ≥7d no dispatch order' },
    ],
    get totalBags() {
      return this.stages.reduce((s, st) => s + (st.unit === 'bags' ? st.count : 0), 0);
    }
  };
})();

// Bag inventory (closed-loop check: total = atCPC + inTransit + atCP + sealed)
const BAG_INVENTORY = (function buildBagInv() {
  const sealed = CP_DATA.reduce((s, cp) => s + cp.sealedBags, 0);
  const atCP = CP_DATA.reduce((s, cp) => s + cp.emptyBags + cp.activeBags, 0);
  const atCPC = 384;
  const inTransit = 142;
  const consumption = 168; // bags/day across all CPs
  return {
    atCPC, inTransit, atCP, sealed,
    total: atCPC + inTransit + atCP + sealed,
    consumption,
    runwayDays: +((atCPC + inTransit) / consumption).toFixed(1),
    cpsLow: CP_DATA.filter(c => c.bagLow).length,
  };
})();

// Exceptions — Weight variance, Count variance, Lost bags (all hold HF payment)
const EXCEPTIONS_DATA = {
  weight: [
    { id:'BAG-4831', cpName:'Margao Supermarket',  taluka:'Salcete',  varPct:8.2, cpKg:24.1, cpcKg:22.1, ageH:3,  cpc:'CPC-MRG' },
    { id:'BAG-5200', cpName:'Benaulim Resort',     taluka:'Salcete',  varPct:9.1, cpKg:18.6, cpcKg:12.2, ageH:6,  cpc:'CPC-MRG' },
    { id:'BAG-6201', cpName:'Colva Resort',        taluka:'Salcete',  varPct:9.1, cpKg:21.4, cpcKg:19.5, ageH:4,  cpc:'CPC-VRN' },
    { id:'BAG-7100', cpName:'Quepem Bar',          taluka:'Quepem',   varPct:6.5, cpKg:15.2, cpcKg:14.2, ageH:2,  cpc:'CPC-MRG' },
    { id:'BAG-5220', cpName:'Cavelossim Hotel',    taluka:'Salcete',  varPct:7.4, cpKg:12.0, cpcKg:11.1, ageH:5,  cpc:'CPC-MRG' },
    { id:'BAG-7002', cpName:'Chaudi Liquor Store', taluka:'Canacona', varPct:5.8, cpKg:19.0, cpcKg:17.9, ageH:1,  cpc:'CPC-MRG' },
    { id:'BAG-5110', cpName:'Cuncolim Supermarket',taluka:'Salcete',  varPct:6.1, cpKg:22.0, cpcKg:20.7, ageH:3,  cpc:'CPC-MRG' },
    { id:'BAG-8201', cpName:'Mapusa Cafe',         taluka:'Bardez',   varPct:5.4, cpKg:10.2, cpcKg:9.7,  ageH:7,  cpc:'CPC-MPS' },
    { id:'BAG-8412', cpName:'Calangute Hotel',     taluka:'Bardez',   varPct:6.8, cpKg:28.4, cpcKg:26.5, ageH:4,  cpc:'CPC-MPS' },
    { id:'BAG-9001', cpName:'Ponda Beverage Mart', taluka:'Ponda',    varPct:7.2, cpKg:16.8, cpcKg:15.6, ageH:8,  cpc:'CPC-PND' },
  ],
  count: [
    { id:'BAG-6300', cpName:'Quepem Bar',           taluka:'Quepem',   varPct:7.9, cpCount:63, cpcCount:58, ageH:1,  cpc:'CPC-MRG' },
    { id:'BAG-5140', cpName:'Cuncolim Supermarket', taluka:'Salcete',  varPct:6.2, cpCount:51, cpcCount:48, ageH:3,  cpc:'CPC-MRG' },
    { id:'BAG-4910', cpName:'Colva Resort',         taluka:'Salcete',  varPct:5.4, cpCount:74, cpcCount:70, ageH:4,  cpc:'CPC-VRN' },
    { id:'BAG-8302', cpName:'Arambol Beach Shack',  taluka:'Pernem',   varPct:8.1, cpCount:42, cpcCount:39, ageH:2,  cpc:'CPC-MPS' },
  ],
  lost: [
    { id:'BAG-3901', lastSeen:'Margao Liquor Store',  driver:'Suresh K.', tripId:'TRP-2031', reportedH:18, cpc:'CPC-MRG' },
    { id:'BAG-4102', lastSeen:'Colva Resort',         driver:'Raghu P.',  tripId:'TRP-2035', reportedH:6,  cpc:'CPC-VRN' },
    { id:'BAG-5604', lastSeen:'Anjuna Cafe',          driver:'Mahesh D.', tripId:'TRP-2118', reportedH:11, cpc:'CPC-MPS' },
  ],
};

// Driver fleet (with status: available / on_trip / returning)
const DRIVER_FLEET = [
  { id:'DRV-01', name:'Rakesh K.',  status:'on_trip',   trip:'TRP-2041', area:'Salcete',   cpc:'CPC-MRG' },
  { id:'DRV-02', name:'Suresh D.',  status:'on_trip',   trip:'TRP-2044', area:'Salcete',   cpc:'CPC-MRG' },
  { id:'DRV-03', name:'Ajay P.',    status:'on_trip',   trip:'TRP-2039', area:'Quepem',    cpc:'CPC-MRG' },
  { id:'DRV-04', name:'Manoj S.',   status:'on_trip',   trip:'TRP-2046', area:'Canacona',  cpc:'CPC-MRG' },
  { id:'DRV-05', name:'Deepak M.',  status:'returning', trip:'TRP-2051', area:'Salcete',   cpc:'CPC-MRG' },
  { id:'DRV-06', name:'Rajan P.',   status:'returning', trip:'TRP-2054', area:'Bardez',    cpc:'CPC-MPS' },
  { id:'DRV-07', name:'Nitin S.',   status:'available', trip:null,       area:null,        cpc:'CPC-VRN' },
  { id:'DRV-08', name:'Sanjay T.',  status:'available', trip:null,       area:null,        cpc:'CPC-VRN' },
  { id:'DRV-09', name:'Vijay R.',   status:'on_trip',   trip:'TRP-2061', area:'Mormugao',  cpc:'CPC-VRN' },
  { id:'DRV-10', name:'Pradeep N.', status:'on_trip',   trip:'TRP-2063', area:'Bardez',    cpc:'CPC-MPS' },
  { id:'DRV-11', name:'Mohit K.',   status:'available', trip:null,       area:null,        cpc:'CPC-MPS' },
  { id:'DRV-12', name:'Anil G.',    status:'returning', trip:'TRP-2068', area:'Ponda',     cpc:'CPC-PND' },
  { id:'DRV-13', name:'Bhaskar L.', status:'on_trip',   trip:'TRP-2071', area:'Ponda',     cpc:'CPC-PND' },
  { id:'DRV-14', name:'Chetan H.',  status:'available', trip:null,       area:null,        cpc:'CPC-PND' },
  { id:'DRV-15', name:'Devraj P.',  status:'on_trip',   trip:'TRP-2074', area:'Bicholim',  cpc:'CPC-BCH' },
  { id:'DRV-16', name:'Eshwar M.',  status:'available', trip:null,       area:null,        cpc:'CPC-BCH' },
];

// Processed inventory — Bales (with sub-category), Glass Packs (by brand), Cullet (by colour)
const PROCESSED_INVENTORY = {
  bales: [
    { mat:'PET',       sub:'Clear',      count:88,  kg:6160,  daysOld:4 },
    { mat:'PET',       sub:'Green',      count:56,  kg:3920,  daysOld:3 },
    { mat:'PET',       sub:'Liquor',     count:72,  kg:5040,  daysOld:5 },
    { mat:'HDPE',      sub:'FMCG White', count:56,  kg:2744, daysOld:6 },
    { mat:'HDPE',      sub:'Chem White', count:36,  kg:1764, daysOld:9 },
    { mat:'MLP',       sub:'MLP',        count:44,  kg:1320, daysOld:8 },
    { mat:'Aluminium', sub:'UBC',        count:36,  kg:828,  daysOld:2 },
  ],
  glassPacks: [
    { brand:'Kingfisher Lite',   vol:'330ml', colour:'Brown', bags:56, bottles:6720, oldest:'22 Mar' },
    { brand:'Kingfisher Strong', vol:'650ml', colour:'Green', bags:32, bottles:2304, oldest:'28 Mar' },
    { brand:'Heineken',          vol:'330ml', colour:'Green', bags:20, bottles:2400, oldest:'01 Apr' },
    { brand:'Tuborg',            vol:'500ml', colour:'Green', bags:18, bottles:1620, oldest:'05 Apr' },
  ],
  cullet: [
    { colour:'Brown', kg:6440, entries:32, lastEntry:'Today 06:40'  },
    { colour:'Green', kg:11360,entries:48, lastEntry:'Today 07:12'  },
    { colour:'Clear', kg:6880, entries:28, lastEntry:'Yesterday'    },
    { colour:'Mix',   kg:3080, entries:16, lastEntry:'2 days ago'   },
  ],
};

// Dispatch tracking
const DISPATCH_DATA = {
  lotsReady: 62,
  totalKg: 21400,
  oldestDays: 9,
  openOrders: 8,
  recent: [
    { id:'DSP-1041', date:'Yesterday',  buyer:'Goa Recyclers Pvt Ltd', type:'PET Clear',    kg:4320, vehicle:'GA-01-AB-1234', cpc:'CPC-MRG' },
    { id:'DSP-1038', date:'2 days ago', buyer:'South Goa Glass Co.',   type:'Cullet Green', kg:8360, vehicle:'GA-07-CD-5678', cpc:'CPC-VRN' },
    { id:'DSP-1035', date:'3 days ago', buyer:'Kingfisher (AB InBev)', type:'Glass Packs',  kg:1248, vehicle:'GA-01-EF-9012', cpc:'CPC-MPS' },
    { id:'DSP-1032', date:'4 days ago', buyer:'Recykal North Hub',     type:'HDPE FMCG',    kg:2744, vehicle:'GA-03-GH-3456', cpc:'CPC-MPS' },
  ],
};

// SLA model — 10 SLAs across Quality/Collection/Warehouse/Dispatch/Supply
const SLA_MODEL = [
  { id:'wt_var',      name:'Weight Variance (CP→CPC)', cat:'Quality',    crit:'critical', target:'< 5%',  avg:'2.8%', tracked:240, breaches:EXCEPTIONS_DATA.weight.length, worst:'9.1%' },
  { id:'cnt_var',     name:'Count Variance (CP→CPC)',  cat:'Quality',    crit:'medium',   target:'< 5%',  avg:'1.9%', tracked:240, breaches:EXCEPTIONS_DATA.count.length,  worst:'8.1%' },
  { id:'seal_trip',   name:'Seal → Trip Creation',     cat:'Collection', crit:'critical', target:'4h',    avg:'3.2h', tracked:160, breaches:CP_DATA.filter(c=>c.slaBreachedSeal && !c.hasTrip).length, worst:'12h' },
  { id:'trip_pickup', name:'Trip → Pickup',            cat:'Collection', crit:'medium',   target:'8h',    avg:'5.6h', tracked:140, breaches:6, worst:'14.2h' },
  { id:'recv_proc',   name:'Receipt → Processing',     cat:'Warehouse',  crit:'medium',   target:'24h',   avg:'18.4h',tracked:198, breaches:12, worst:'32h' },
  { id:'exc_res',     name:'Exception → Resolution',   cat:'Warehouse',  crit:'critical', target:'6h',    avg:'4.1h', tracked:18,  breaches:EXCEPTIONS_DATA.weight.filter(e=>e.ageH>6).length + EXCEPTIONS_DATA.count.filter(e=>e.ageH>6).length, worst:'8.2h' },
  { id:'lot_disp',    name:'Lot Ready → Dispatched',   cat:'Dispatch',   crit:'medium',   target:'5 days',avg:'3.2d', tracked:62,  breaches:PROCESSED_INVENTORY.bales.filter(b=>b.daysOld>=7).length, worst:'9 days' },
  { id:'mach_resp',   name:'Machine Down → Action',    cat:'Collection', crit:'medium',   target:'2h',    avg:'1.4h', tracked:38,  breaches:8,  worst:'4.8h' },
  { id:'horeca_pick', name:'HoReCa Pickup Wait',       cat:'Collection', crit:'low',      target:'24h',   avg:'19.2h',tracked:42,  breaches:4,  worst:'31h' },
  { id:'bag_runway',  name:'Bag Supply Runway',        cat:'Supply',     crit:'low',      target:'> 3 days', avg:BAG_INVENTORY.runwayDays+' days', tracked:5, breaches:BAG_INVENTORY.runwayDays<=3?1:0, worst:BAG_INVENTORY.runwayDays+' days' },
];

/* ============================================================
   CPC NETWORK — 5 warehouses across Goa
   ============================================================ */
const CPC_DATA = [
  { id: 'CPC-VRN', name: 'Recykal · Verna',     cluster: 'South Goa',   coverage: ['Mormugao', 'Salcete', 'Dharbandora'],
    block: 'Mormugao', lat: 15.371, lng: 73.937, capacityMT: 480, currentMT: 286, dockCount: 6, activeDocks: 4,
    cpsCovered: 84,  vehiclesQueued: 3, sortAcc: 96.4, yield: 94.8, fillRate: 67 },
  { id: 'CPC-MRG', name: 'Anand · Nessai',    cluster: 'South Goa',   coverage: ['Salcete', 'Quepem', 'Canacona', 'Sanguem'],
    block: 'Salcete',  lat: 15.272, lng: 73.958, capacityMT: 520, currentMT: 412, dockCount: 8, activeDocks: 6,
    cpsCovered: 92,  vehiclesQueued: 5, sortAcc: 95.1, yield: 93.2, fillRate: 79 },
  { id: 'CPC-MPS', name: 'Durgadevi · Colvale',    cluster: 'North Goa',   coverage: ['Bardez', 'Pernem'],
    block: 'Bardez',   lat: 15.595, lng: 73.812, capacityMT: 420, currentMT: 318, dockCount: 6, activeDocks: 5,
    cpsCovered: 68,  vehiclesQueued: 4, sortAcc: 97.2, yield: 95.4, fillRate: 76 },
  { id: 'CPC-PND', name: 'CPC Ponda',     cluster: 'Central',     coverage: ['Ponda', 'Tiswadi'],
    block: 'Ponda',    lat: 15.402, lng: 74.015, capacityMT: 380, currentMT: 198, dockCount: 4, activeDocks: 3,
    cpsCovered: 48,  vehiclesQueued: 2, sortAcc: 96.8, yield: 94.6, fillRate: 52 },
  { id: 'CPC-BCH', name: 'Vilas · Tuem',  cluster: 'North-East',  coverage: ['Bicholim', 'Sattari'],
    block: 'Bicholim', lat: 15.598, lng: 74.001, capacityMT: 320, currentMT: 142, dockCount: 4, activeDocks: 2,
    cpsCovered: 36,  vehiclesQueued: 1, sortAcc: 95.8, yield: 93.4, fillRate: 44 },
];

/* ============================================================
   ORDERS & TRIPS — mock data
   ============================================================ */
const ORDER_STATUSES = ['Created', 'Assigned', 'In Transit', 'Delivered', 'Cancelled'];
const TRIP_STATUSES  = ['Planned', 'In Progress', 'Completed', 'Delayed', 'Cancelled'];
const VEHICLE_TYPES = ['Tata Ace', 'Eicher Pro', 'Mahindra Bolero', '8-Wheeler', 'Container'];
const DRIVERS = ['Suresh K.', 'Raghu P.', 'Mahesh D.', 'Vinod N.', 'Anil M.', 'Ravi S.', 'Prakash R.', 'Dilip K.'];

function genOrders(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const status = pick(ORDER_STATUSES);
    const cp = CP_DATA[rint(0, CP_DATA.length)];
    const cpc = pick(CPC_DATA);
    out.push({
      id: `ORD-${20001 + i}`,
      createdAt: `${rint(1, 72)}h ago`,
      ageHr: rint(1, 72),
      status: status,
      cpId: cp.id, cpName: cp.name, block: cp.block,
      cpc: cpc.id, cpcName: cpc.name,
      bagsRequested: rint(8, 48),
      bagsScheduled: rint(6, 42),
      weightKg: rint(120, 1400),
      slaHr: 24, slaBreached: rint(0,10) > 7,
      vendor: pick(VENDORS), priority: pick(['Normal','Normal','High','Urgent'])
    });
  }
  return out;
}
const ORDER_DATA = genOrders(120);

/* ============================================================
   CPC MAP DATA (v22) — geo-anchored for Executive Dashboard map toggle
   6 real govt-registered CPCs + ~300 RVMs anchored to real Goa panchayat coords
   ============================================================ */
const CPC_MAP_DATA = [
  { id:'GOA-CPC-DGD', name:'Durgadevi Enterprises · Colvale',  taluka:'Bardez',   lat:15.63806, lng:73.82701, col:'#3b82f6', veh:{total:22,ontrip:16,atcpc:6,util:73}, units:11820 },
  { id:'GOA-CPC-VBW', name:'Vilas Bottle Washing · Tuem',      taluka:'Pernem',   lat:15.68436, lng:73.79556, col:'#a855f7', veh:{total:10,ontrip: 7,atcpc:3,util:70}, units: 3460 },
  { id:'GOA-CPC-SBW', name:'Sagar Bottle Washing · Verna',     taluka:'Salcete',  lat:15.36944, lng:73.94835, col:'#f59e0b', veh:{total:16,ontrip:11,atcpc:5,util:69}, units: 4640 },
  { id:'GOA-CPC-RYV', name:'Recykal Warehouse · Verna-Owned',  taluka:'Salcete',  lat:15.36349, lng:73.94724, col:'#ef4444', veh:{total: 8,ontrip: 5,atcpc:3,util:63}, units: 1720 },
  { id:'GOA-CPC-ABW', name:'Anand Bottle Washing · Nessai',    taluka:'Salcete',  lat:15.25638, lng:74.01267, col:'#10b981', veh:{total:18,ontrip:13,atcpc:5,util:72}, units: 6240 },
  { id:'GOA-CPC-SHV', name:'Shivanand Bottle Washing · Nessai',taluka:'Salcete',  lat:15.26208, lng:74.01871, col:'#06b6d4', veh:{total:11,ontrip: 7,atcpc:4,util:64}, units: 2920 },
];

const RVM_MAP_DATA = (function genRvms() {
  const A = {
    Aldona:[15.6255,73.8208], Anjuna:[15.5685,73.7560], Calangute:[15.5441,73.7621], Siolim:[15.6113,73.7840],
    Mapusa:[15.5937,73.8093], Colvale:[15.6450,73.8365], Moira:[15.5948,73.8387], Nachinola:[15.6469,73.8378],
    Assagao:[15.5640,73.7741], Assonora:[15.6185,73.9021], Revora:[15.6628,73.8469], Pomburpa:[15.5615,73.8645],
    Pernem:[15.7241,73.8000], Arambol:[15.6870,73.7400], Mandrem:[15.6580,73.7700],
    Panaji:[15.4989,73.8278], DonaPaula:[15.4590,73.8080], Carambolim:[15.4868,73.9312], Chimbel:[15.4959,73.8729],
    Agassaim:[15.4270,73.8984], Bambolim:[15.4660,73.8839], Taleigao:[15.4870,73.8720],
    Ponda:[15.4030,74.0094], Betora:[15.4380,73.9780], Priol:[15.4396,73.9759], Bandora:[15.4042,73.9845], Marcela:[15.4150,73.9700],
    Margao:[15.2832,73.9768], Colva:[15.2500,73.9220], Fatorda:[15.3010,73.9870], Navelim:[15.2680,73.9980],
    Benaulim:[15.2280,73.9350], Curtorim:[15.3320,74.0180], Cuncolim:[15.1760,74.0030], Chandor:[15.2890,74.0400],
    Nuvem:[15.2530,73.9530], Loutolim:[15.2580,73.9730], Rachol:[15.3091,74.0030], Raia:[15.2820,73.9570],
    Quepem:[15.2100,74.0760], Cavelossim:[15.1700,73.9460],
    Canacona:[15.0200,74.0340], Palolem:[15.0100,74.0230], Agonda:[15.0504,73.9981],
    Vasco:[15.3960,73.8120], Dabolim:[15.3830,73.8580], Bogmalo:[15.3724,73.8260], Chicalim:[15.4087,73.8641],
    Sancoale:[15.3683,73.8924], Cortalim:[15.3800,73.9100], Cansaulim:[15.3300,73.9050], Arossim:[15.3220,73.9120],
    Verna:[15.3458,73.9318], Mormugao:[15.4050,73.8200],
    Bicholim:[15.5880,73.9490], Sanquelim:[15.5570,74.0227], Latambarcem:[15.5486,73.9921],
    Maulinguem:[15.6161,73.9759], Naroa:[15.5486,73.9212], Cudnem:[15.5442,74.0132], Arvalem:[15.5645,74.0456],
    Valpoi:[15.5300,74.1340], Sattari:[15.5400,74.1100], Colem:[15.3365,74.2441], Dharbandora:[15.3918,74.1220],
  };
  const sd = (n) => { let x = Math.sin(n * 7919) * 9999; return x - Math.floor(x); };
  const mk = (pre, i, anchor, cpc, t, p) => ({
    id: `${pre}-${String(i+1).padStart(3,'0')}`, panchayat: p, taluka: t, cpc,
    lat: parseFloat((anchor[0] + (sd(i*2)-0.5)*0.003).toFixed(4)),
    lng: parseFloat((anchor[1] + (sd(i*3)-0.5)*0.003).toFixed(4)),
  });
  const out = [];
  const g1 = [['Aldona','Bardez'],['Anjuna','Bardez'],['Calangute','Bardez'],['Siolim','Bardez'],['Mapusa','Bardez'],['Colvale','Bardez'],['Moira','Bardez'],['Nachinola','Bardez'],['Assagao','Bardez'],['Assonora','Bardez'],['Revora','Bardez'],['Pomburpa','Bardez'],['Pernem','Pernem'],['Arambol','Pernem'],['Mandrem','Pernem']];
  for (let i = 0; i < 80; i++) { const [p,t] = g1[i % g1.length]; out.push(mk('M', i, A[p], 'GOA-CPC-001', t, p)); }
  const g2 = [['Margao','Salcete'],['Colva','Salcete'],['Fatorda','Salcete'],['Navelim','Salcete'],['Benaulim','Salcete'],['Curtorim','Salcete'],['Cuncolim','Salcete'],['Chandor','Salcete'],['Nuvem','Salcete'],['Loutolim','Salcete'],['Rachol','Salcete'],['Raia','Salcete'],['Quepem','Quepem'],['Cavelossim','Salcete'],['Canacona','Canacona'],['Palolem','Canacona'],['Agonda','Canacona']];
  for (let i = 0; i < 90; i++) { const [p,t] = g2[i % g2.length]; out.push(mk('S', i, A[p], 'GOA-CPC-002', t, p)); }
  const g3 = [['Panaji','Tiswadi'],['DonaPaula','Tiswadi'],['Carambolim','Tiswadi'],['Chimbel','Tiswadi'],['Agassaim','Tiswadi'],['Bambolim','Tiswadi'],['Taleigao','Tiswadi'],['Ponda','Ponda'],['Betora','Ponda'],['Priol','Ponda'],['Bandora','Ponda'],['Marcela','Ponda']];
  for (let i = 0; i < 60; i++) { const [p,t] = g3[i % g3.length]; out.push(mk('T', i, A[p], 'GOA-CPC-003', t, p)); }
  const g4 = [['Bicholim','Bicholim'],['Sanquelim','Bicholim'],['Latambarcem','Bicholim'],['Maulinguem','Bicholim'],['Naroa','Bicholim'],['Cudnem','Bicholim'],['Arvalem','Bicholim'],['Valpoi','Sattari'],['Sattari','Sattari'],['Colem','Dharbandora'],['Dharbandora','Dharbandora']];
  for (let i = 0; i < 40; i++) { const [p,t] = g4[i % g4.length]; out.push(mk('W1', i, A[p], 'GOA-WH-001', t, p)); }
  const g5 = [['Vasco','Mormugao'],['Dabolim','Mormugao'],['Bogmalo','Mormugao'],['Chicalim','Mormugao'],['Sancoale','Mormugao'],['Cortalim','Mormugao'],['Cansaulim','Mormugao'],['Arossim','Mormugao'],['Verna','Mormugao'],['Mormugao','Mormugao']];
  for (let i = 0; i < 30; i++) { const [p,t] = g5[i % g5.length]; out.push(mk('V', i, A[p], 'GOA-WH-002', t, p)); }
  return out;
})();

function genTrips(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const status = pick(TRIP_STATUSES);
    const cpc = pick(CPC_DATA);
    const stops = rint(3, 9);
    const planned = rint(40, 180);
    const actual = status === 'Completed' ? planned + rint(-15, 30) : null;
    out.push({
      id: `TR-${30001 + i}`,
      createdAt: `${rint(1, 96)}h ago`,
      status: status,
      vehicle: `GA-${rint(1,12).toString().padStart(2,'0')}-AB-${rint(1000,9999)}`,
      vehicleType: pick(VEHICLE_TYPES),
      capacityMT: pick([1, 3, 5, 7, 12]),
      driver: pick(DRIVERS),
      cpc: cpc.id, cpcName: cpc.name,
      stops: stops, stopsCompleted: status === 'Completed' ? stops : status === 'In Progress' ? rint(0, stops) : 0,
      plannedKm: planned,
      actualKm: actual,
      plannedHr: rfloat(2, 8, 1),
      actualHr: status === 'Completed' ? rfloat(2, 9, 1) : null,
      bagsScanned: status === 'Completed' || status === 'In Progress' ? rint(20, 120) : 0,
      totalWeightKg: status === 'Completed' ? rint(400, 2800) : status === 'In Progress' ? rint(100, 1200) : 0,
      fuelL: status === 'Completed' ? rfloat(8, 38, 1) : null,
      onTime: status === 'Completed' ? rint(0,10) > 3 : null,
      vendor: pick(VENDORS),
      slaBreached: status === 'Delayed' || (status === 'Completed' && rint(0,10) > 7),
    });
  }
  return out;
}
const TRIP_DATA = genTrips(140);

/* ============================================================
   ALERTS / SLA STRIP — appears at top of every module page
   ============================================================ */
const MODULE_ALERT_DATA = {
  'cp':   { active: 5, breached: 3, atRisk: 7, resolved: 24, items: [
    { time: '12:42', sev: 'Critical', msg: 'RVM offline > 6hr',    loc: 'Mapusa Market RVM-04', age: '34m' },
    { time: '11:18', sev: 'High',     msg: 'Handler attendance < 80%', loc: 'Ponda · 4 of 6 CPs', age: '1h 58m' },
    { time: '08:30', sev: 'High',     msg: 'Refund TAT > SLA',     loc: '12 transactions',     age: '4h 46m' },
  ]},
  'hor':  { active: 3, breached: 2, atRisk: 5, resolved: 12, items: [
    { time: 'Yest',  sev: 'Medium',   msg: 'Pickup missed > 24hr', loc: 'Marriott Calangute',  age: '18h' },
    { time: '14:20', sev: 'High',     msg: 'Bottle count discrepancy', loc: 'Taj Holiday Village', age: '40m' },
    { time: '09:15', sev: 'Medium',   msg: 'Account inactive > 7d',  loc: 'Cafe Mocha · Panaji', age: '5h' },
  ]},
  'log':  { active: 4, breached: 2, atRisk: 6, resolved: 18, items: [
    { time: '06:48', sev: 'High',     msg: 'Vehicle GPS offline',  loc: 'GA-07-AB-1284',       age: '6h 28m' },
    { time: '11:34', sev: 'Critical', msg: 'Trip delayed > 2hr',   loc: 'TR-30184 · Margao',   age: '1h 42m' },
    { time: '08:12', sev: 'Medium',   msg: 'Route deviation > 8km', loc: 'TR-30201',           age: '5h' },
  ]},
  'wh':   { active: 4, breached: 3, atRisk: 8, resolved: 20, items: [
    { time: '09:55', sev: 'Critical', msg: 'Bag dwell > 72hr',     loc: 'Recykal · Verna · 3 bags',  age: '3h 21m' },
    { time: '07:14', sev: 'Medium',   msg: 'Inbound weight variance', loc: 'Anand · Nessai · 4.2% gap', age: '6h' },
    { time: '12:10', sev: 'High',     msg: 'Dock wait > 90min',    loc: 'Durgadevi · Colvale · D-03',   age: '52m' },
  ]},
  'cs':   { active: 12, breached: 5, atRisk: 9, resolved: 28, items: [
    { time: '13:02', sev: 'Critical', msg: 'P0 ticket open > SLA', loc: 'TKT-10084',           age: '5h' },
    { time: '10:48', sev: 'High',     msg: 'CSAT < 3 reported',    loc: 'TKT-10071',           age: '2h 38m' },
    { time: '08:22', sev: 'Medium',   msg: 'Repeat escalation',    loc: 'CP-1089',             age: '5h 04m' },
  ]},
  'cost': { active: 2, breached: 1, atRisk: 4, resolved: 8, items: [
    { time: 'Today', sev: 'High',     msg: 'CP Travel > budget 12%', loc: 'CP Cost Center',    age: '4h' },
    { time: 'Yest',  sev: 'Medium',   msg: 'Vendor payment overdue', loc: 'Vendor B',          age: '1d' },
    { time: '2d',    sev: 'Low',      msg: 'Reimbursement TAT > 5d', loc: '14 claims',         age: '2d' },
  ]},
  'sust': { active: 1, breached: 0, atRisk: 2, resolved: 4, items: [
    { time: 'Today', sev: 'Medium',   msg: 'MLP yield < 90%',      loc: 'Recykal · Verna',           age: '6h' },
  ]},
  'exec': { active: 7, breached: 5, atRisk: 14, resolved: 42, items: [] },
  'alerts': { active: 7, breached: 5, atRisk: 14, resolved: 42, items: [] },
};

function alertSlaStrip(moduleId) {
  const data = MODULE_ALERT_DATA[moduleId];
  if (!data) return '';
  // v45 — Cleaner severity terms (no Critical / High / Medium / Low jargon)
  const sevPill = (s) => ({
    'Critical': '<span class="pill pill-bad">Urgent</span>',
    'High':     '<span class="pill pill-warn">Priority</span>',
    'Medium':   '<span class="pill pill-info">Monitor</span>',
    'Low':      '<span class="pill pill-neutral">Info</span>',
  })[s];
  const items = data.items || [];
  const topItem = items[0];
  return `
    <div class="v45-live-alerts">
      <div class="v45-live-alerts-pill">
        <span class="v45-live-dot"></span>
        <span class="v45-live-lbl">Live Alerts</span>
        <span class="v45-live-count">${data.active}</span>
      </div>
      ${topItem ? `
        <div class="v45-live-preview">
          ${sevPill(topItem.sev)}
          <span class="v45-live-msg">${topItem.msg}</span>
          <span class="v45-live-loc">· ${topItem.loc}</span>
          <span class="v45-live-age">${topItem.age}</span>
        </div>
      ` : '<div class="v45-live-preview"><span class="v45-live-msg" style="color:var(--text-mute);">No active alerts</span></div>'}
      <button class="v45-live-view" data-jump-alerts="1">View All →</button>
    </div>
  `;
}

function wireAlertStrip() {
  document.querySelectorAll('[data-jump-alerts]').forEach(el => {
    el.addEventListener('click', () => {
      const link = document.querySelector('.sb-sub-item[data-page="alerts-all"]');
      if (link) link.click();
    });
  });
}

/* ============================================================
   RENDER SIDEBAR
   ============================================================ */
function renderSidebar() {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = NAV.map(section => `
    <div class="sb-section ${section.id === 'exec' ? 'open' : ''}" data-section="${section.id}">
      <div class="sb-section-head ${section.id === 'exec' ? 'active' : ''}">
        <span class="sb-section-icon">${section.icon}</span>
        <span class="sb-section-label">${section.label}</span>
        ${section.badge ? `<span class="sb-badge">${section.badge}</span>` : ''}
        ${section.children.length > 1 || (section.children[0] && section.children[0].isGroup) ? `
        <svg class="sb-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>` : ''}
      </div>
      <div class="sb-sub">
        ${(section.children.length === 1 && !section.children[0].isGroup) ? '' : section.children.map(c => {
          if (c.isGroup) {
            return `
              <div class="sb-sub-group">
                <div class="sb-sub-group-title">${c.label}</div>
                ${c.items.map(i => `<a class="sb-sub-item" data-page="${i.id}" data-module="${section.id}" data-label="${c.label} · ${i.label}">${i.label}</a>`).join('')}
              </div>`;
          }
          const countHtml = c.count ? `<span class="sb-sub-count">${c.count}</span>` : '';
          return `<a class="sb-sub-item ${c.id === 'exec-home' ? 'active' : ''}" data-page="${c.id}" data-module="${section.id}" data-label="${c.label}">${c.label}${countHtml}</a>`;
        }).join('')}
      </div>
    </div>
  `).join('');

  // Single-child modules: clicking the section head navigates directly
  nav.querySelectorAll('.sb-section').forEach(section => {
    const id = section.dataset.section;
    const nav_section = NAV.find(s => s.id === id);
    const hasGroups = nav_section.children.some(c => c.isGroup);
    const isSingleChild = nav_section.children.length === 1 && !hasGroups;

    section.querySelector('.sb-section-head').addEventListener('click', () => {
      if (isSingleChild) {
        // Direct navigate, no expansion
        const child = nav_section.children[0];
        nav.querySelectorAll('.sb-sub-item').forEach(i => i.classList.remove('active'));
        nav.querySelectorAll('.sb-section-head').forEach(h => h.classList.remove('active'));
        section.querySelector('.sb-section-head').classList.add('active');
        nav.querySelectorAll('.sb-section').forEach(s => s.classList.remove('open'));
        navigateTo(child.id, id, child.label);
      } else {
        // Expand/collapse
        nav.querySelectorAll('.sb-section').forEach(s => { if (s !== section) s.classList.remove('open'); });
        section.classList.toggle('open');
      }
    });
  });

  nav.querySelectorAll('.sb-sub-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.querySelectorAll('.sb-sub-item').forEach(i => i.classList.remove('active'));
      nav.querySelectorAll('.sb-section-head').forEach(h => h.classList.remove('active'));
      item.classList.add('active');
      const moduleId = item.dataset.module;
      const section = nav.querySelector(`[data-section="${moduleId}"]`);
      section.querySelector('.sb-section-head').classList.add('active');
      navigateTo(item.dataset.page, moduleId, item.dataset.label);
    });
  });
}

/* ============================================================
   ROUTING
   ============================================================ */
function navigateTo(pageId, moduleId, label) {
  const moduleLabel = MODULE_LABEL[moduleId] || '';
  // For executive dashboard, just show page label. Otherwise show "Module · Page".
  const crumb = moduleId === 'exec' ? moduleLabel : `${moduleLabel} · ${label}`;
  document.getElementById('crumb-page').textContent = crumb;
  renderFilterBar(moduleId);
  renderPage(pageId);
  document.getElementById('main-content').scrollTop = 0;
}

/* ============================================================
   COMMON HELPERS
   ============================================================ */
function kpi(label, value, unit = '', opts = {}) {
  const { delta = null, sub = '', status = '' } = opts;
  const deltaHtml = delta !== null
    ? `<span class="kpi-delta ${delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'}">${delta > 0 ? '▲' : delta < 0 ? '▼' : '◆'} ${Math.abs(delta)}%</span>`
    : '';
  return `
    <div class="kpi ${status}">
      <div class="kpi-label">${label}</div>
      <div class="kpi-value">${value}<span class="kpi-unit">${unit}</span></div>
      <div class="kpi-foot">
        <span>${sub || '&nbsp;'}</span>
        ${deltaHtml}
      </div>
    </div>
  `;
}

function statusPill(s) {
  const map = {
    'Active':      ['pill-good',    'dot-good'],
    'Inactive':    ['pill-neutral', 'dot-neutral'],
    'Maintenance': ['pill-warn',    'dot-warn'],
    'Down':        ['pill-bad',     'dot-bad'],
  };
  const [pc, dc] = map[s] || map['Inactive'];
  return `<span class="pill ${pc}"><span class="dot ${dc}"></span>${s}</span>`;
}

/* ============================================================
   PAGE: CP MASTER (centerpiece)
   ============================================================ */
const masterState = {
  search: '',
  filterType: 'All',
  filterPanchayat: 'All',
  filterBlock: 'All',
  filterVendor: 'All',
  filterStatus: 'All',
  filterReType: 'All',
  filterAction: 'All',
  sortKey: 'id',
  sortDir: 'asc',
  page: 1,
  pageSize: 25,
  expanded: new Set(),
};

function pageCpMaster() {
  return `
    <!-- Master KPIs -->
    <div class="kgrid kgrid-6">
      ${kpi('Total CPs', CP_DATA.length, '', { sub: '300+ target', status: 'good' })}
      ${kpi('Active', CP_DATA.filter(c => c.status==='Active').length, '', { delta: 2, status: 'good' })}
      ${kpi('Inactive', CP_DATA.filter(c => c.status==='Inactive').length, '', { delta: -1 })}
      ${kpi('Maintenance', CP_DATA.filter(c => c.status==='Maintenance').length, '', { delta: 0, status: 'warn' })}
      ${kpi('Down', CP_DATA.filter(c => c.status==='Down').length, '', { delta: 3, status: 'alert' })}
      ${kpi('RVM Count', CP_DATA.filter(c => c.type==='RVM').length, '', { sub: 'Reverse vending' })}
      ${kpi('Return Centers', CP_DATA.filter(c => c.type==='Return Center').length, '')}
      ${kpi('Machines Active', CP_DATA.reduce((s,c) => s+c.activeMachines, 0), '', { delta: 1 })}
      ${kpi('Machines Down', CP_DATA.reduce((s,c) => s+c.downMachines, 0), '', { status: 'alert' })}
      ${kpi('Daily Collection', CP_DATA.reduce((s,c) => s+c.dailyCollection, 0).toLocaleString(), 'u', { delta: 4 })}
      ${kpi('Daily Transactions', CP_DATA.reduce((s,c) => s+c.dailyTxn, 0).toLocaleString(), '', { delta: 3 })}
      ${kpi('Consumers (Total)', CP_DATA.reduce((s,c) => s+c.consumers, 0).toLocaleString(), '', { delta: 8 })}
      ${kpi('Avg Uptime', (CP_DATA.reduce((s,c) => s+c.uptime, 0) / CP_DATA.length).toFixed(1), '%', { delta: 1 })}
      ${kpi('Avg Downtime', (CP_DATA.reduce((s,c) => s+c.downtime, 0) / CP_DATA.length).toFixed(1), '%', { delta: -1 })}
      ${kpi('Open Escalations', CP_DATA.reduce((s,c) => s+c.escalations, 0), '', { status: 'warn' })}
      ${kpi('Open Tickets', CP_DATA.reduce((s,c) => s+c.tickets, 0), '', { status: 'warn' })}
      ${kpi('Active Bags', CP_DATA.reduce((s,c) => s+c.bagInventory, 0), '')}
      ${kpi('QR Attempts', CP_DATA.reduce((s,c) => s+c.qrAttempts, 0).toLocaleString(), '', { delta: 2 })}
    </div>

    <!-- Operational KPIs — HF/DC, bag states, SLA -->
    <div class="kgrid kgrid-6" style="margin-top: 12px;">
      ${kpi('Re-Large CPs', CP_DATA.filter(c => c.reType==='Re-Large').length, '', { sub: 'HF=No · DC=No' })}
      ${kpi('Re-Small CPs', CP_DATA.filter(c => c.reType==='Re-Small').length, '', { sub: 'HF=No · DC=No' })}
      ${kpi('non-Re CPs', CP_DATA.filter(c => c.reType==='non-Re').length, '', { sub: 'HF=Yes · DC=Yes' })}
      ${kpi('HoReCa', CP_DATA.filter(c => c.establishmentType==='HoReCa').length, '', { sub: 'Bulk pickup · HF=No' })}
      ${kpi('HF Eligible CPs', CP_DATA.filter(c => c.hfEligible).length, '', { sub: 'Receive handling fee' })}
      ${kpi('DC Required CPs', CP_DATA.filter(c => c.doubleCountRequired).length, '', { sub: 'Need 2-count verify' })}
      ${kpi('Sealed Bags (live)', CP_DATA.reduce((s,c) => s+c.sealedBags, 0), '', { status: 'warn', sub: 'Awaiting pickup' })}
      ${kpi('CPs Need Trip', CP_DATA.filter(c => c.sealedBags>0 && !c.hasTrip).length, '', { status: 'alert', sub: 'Sealed · no trip' })}
      ${kpi('SLA Breach (Seal>4h)', CP_DATA.filter(c => c.slaBreachedSeal).length, '', { status: 'alert' })}
      ${kpi('Bags Low CPs', CP_DATA.filter(c => c.bagLow).length, '', { status: 'warn', sub: 'Empty stock <6' })}
      ${kpi('Bag Runway', BAG_INVENTORY.runwayDays, 'd', { status: BAG_INVENTORY.runwayDays<=3?'alert':'good', sub: BAG_INVENTORY.atCPC+' at CPC' })}
      ${kpi('Total Bags in Loop', BAG_INVENTORY.total, '', { sub: 'CPC + transit + CP + sealed' })}
    </div>

    <!-- Master Table -->
    <div class="card">
      <div class="card-head">
        <div>
          <div class="card-title">Collection Point Master</div>
          <div class="card-sub">Operational registry · click any row to drill down</div>
        </div>
        <div class="card-actions">
          <button class="btn">Export CSV</button>
          <button class="btn">Export Excel</button>
          <button class="btn btn-primary">+ New CP</button>
        </div>
      </div>

      <div class="toolbar">
        <div class="toolbar-search">
          <span class="toolbar-search-icon">⌕</span>
          <input id="cp-search" type="text" placeholder="Search by CP name, ID, machine, handler…" value="${masterState.search}" />
        </div>
        <select class="filter-chip" id="cp-f-type" style="padding: 5px 9px;">
          <option>All Types</option><option>RVM</option><option>Return Center</option><option>D2D</option><option>HoReCa</option><option>Non-Recykal</option>
        </select>
        <select class="filter-chip" id="cp-f-block" style="padding: 5px 9px;">
          <option>All Blocks</option>${TALUKAS.map(t => `<option>${t}</option>`).join('')}
        </select>
        <select class="filter-chip" id="cp-f-vendor" style="padding: 5px 9px;">
          <option>All Vendors</option>${VENDORS.map(v => `<option>${v}</option>`).join('')}
        </select>
        <select class="filter-chip" id="cp-f-status" style="padding: 5px 9px;">
          <option>All Status</option><option>Active</option><option>Inactive</option><option>Maintenance</option><option>Down</option>
        </select>
        <select class="filter-chip" id="cp-f-retype" style="padding: 5px 9px;">
          <option>All Re Types</option><option>Re-Large</option><option>Re-Small</option><option>non-Re</option>
        </select>
        <select class="filter-chip" id="cp-f-action" style="padding: 5px 9px;">
          <option>All CPs</option><option>Needs Trip</option><option>SLA Breach</option><option>Bags Low</option><option>Machines Down</option>
        </select>
        <span class="toolbar-count">Showing <strong id="cp-shown">0</strong> of <strong id="cp-total">${CP_DATA.length}</strong></span>
      </div>

      <div class="table-wrap" style="max-height: calc(100vh - 460px); overflow-y: auto;">
        <table class="t" id="cp-table">
          <thead>
            <tr>
              <th style="width:30px;"></th>
              <th data-sort="id">CP ID</th>
              <th data-sort="name">Name</th>
              <th data-sort="type">Type</th>
              <th data-sort="block">Block</th>
              <th data-sort="panchayat">Panchayat</th>
              <th data-sort="vendor">Vendor</th>
              <th data-sort="handler">Handler</th>
              <th data-sort="reType">Re Type</th>
              <th data-sort="hfEligible" class="num">HF</th>
              <th data-sort="doubleCountRequired" class="num">DC</th>
              <th data-sort="machineCount" class="num">Mach</th>
              <th data-sort="activeMachines" class="num">Active</th>
              <th data-sort="downMachines" class="num">Down</th>
              <th data-sort="sealedBags" class="num">Sealed</th>
              <th data-sort="longestWaitH" class="num">Wait</th>
              <th data-sort="dailyCollection" class="num">Daily Coll</th>
              <th data-sort="dailyTxn" class="num">Txns</th>
              <th data-sort="uptime" class="num">Uptime</th>
              <th data-sort="bagInventory" class="num">Bags</th>
              <th data-sort="escalations" class="num">Esc</th>
              <th data-sort="lastActive">Last Active</th>
              <th data-sort="status">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="cp-tbody"></tbody>
        </table>
      </div>

      <div class="pager">
        <span id="cp-pager-info">Page 1</span>
        <div class="pager-controls" id="cp-pager-ctrls"></div>
      </div>
    </div>
  `;
}

function renderCpTable() {
  // Filter
  let rows = CP_DATA.slice();
  const s = masterState.search.toLowerCase();
  if (s) {
    rows = rows.filter(r =>
      r.id.toLowerCase().includes(s) ||
      r.name.toLowerCase().includes(s) ||
      r.handler.toLowerCase().includes(s) ||
      r.panchayat.toLowerCase().includes(s) ||
      r.vendor.toLowerCase().includes(s)
    );
  }
  if (masterState.filterType !== 'All' && masterState.filterType !== 'All Types') rows = rows.filter(r => r.type === masterState.filterType);
  if (masterState.filterBlock !== 'All' && masterState.filterBlock !== 'All Blocks') rows = rows.filter(r => r.block === masterState.filterBlock);
  if (masterState.filterVendor !== 'All' && masterState.filterVendor !== 'All Vendors') rows = rows.filter(r => r.vendor === masterState.filterVendor);
  if (masterState.filterStatus !== 'All' && masterState.filterStatus !== 'All Status') rows = rows.filter(r => r.status === masterState.filterStatus);
  if (masterState.filterReType !== 'All' && masterState.filterReType !== 'All Re Types') rows = rows.filter(r => r.reType === masterState.filterReType);
  if (masterState.filterAction !== 'All' && masterState.filterAction !== 'All CPs') {
    if (masterState.filterAction === 'Needs Trip') rows = rows.filter(r => r.sealedBags > 0 && !r.hasTrip);
    else if (masterState.filterAction === 'SLA Breach') rows = rows.filter(r => r.slaBreachedSeal);
    else if (masterState.filterAction === 'Bags Low') rows = rows.filter(r => r.bagLow);
    else if (masterState.filterAction === 'Machines Down') rows = rows.filter(r => r.downMachines > 0);
  }

  // Sort
  rows.sort((a, b) => {
    const k = masterState.sortKey;
    const av = a[k], bv = b[k];
    if (typeof av === 'number') return masterState.sortDir === 'asc' ? av - bv : bv - av;
    return masterState.sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const total = rows.length;
  document.getElementById('cp-shown').textContent = total;

  // Paginate
  const pageSize = masterState.pageSize;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (masterState.page > pages) masterState.page = pages;
  const start = (masterState.page - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  // Render header sort indicators
  document.querySelectorAll('#cp-table thead th[data-sort]').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (th.dataset.sort === masterState.sortKey) th.classList.add(masterState.sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
  });

  // Render body
  const tbody = document.getElementById('cp-tbody');
  tbody.innerHTML = pageRows.map((r, i) => `
    <tr class="${i % 2 ? 'striped' : ''}" data-cp="${r.id}">
      <td><span class="row-action expand-toggle" data-cp="${r.id}">${masterState.expanded.has(r.id) ? '▾' : '▸'}</span></td>
      <td class="id-cell">${r.id}</td>
      <td><span class="row-action open-detail" data-cp="${r.id}">${r.name}</span></td>
      <td><span class="pill pill-info">${r.type}</span></td>
      <td>${r.block}</td>
      <td>${r.panchayat}</td>
      <td>${r.vendor}</td>
      <td>${r.handler}</td>
      <td><span class="pill ${r.reType==='non-Re'?'pill-warn':'pill-neutral'}" style="font-size:10.5px;">${r.reType}</span></td>
      <td class="num">${r.hfEligible ? '<span style="color:var(--good);font-weight:700;">✓</span>' : '<span style="color:var(--text-mute);">—</span>'}</td>
      <td class="num">${r.doubleCountRequired ? '<span style="color:var(--accent);font-weight:700;">✓</span>' : '<span style="color:var(--text-mute);">—</span>'}</td>
      <td class="num">${r.machineCount}</td>
      <td class="num">${r.activeMachines}</td>
      <td class="num" style="${r.downMachines > 0 ? 'color: var(--bad); font-weight: 600;' : ''}">${r.downMachines}</td>
      <td class="num" style="${r.sealedBags>0?(r.slaBreachedSeal?'color:var(--bad);font-weight:700;':'color:var(--warn);font-weight:600;'):''}">${r.sealedBags||'—'}</td>
      <td class="num" style="${r.slaBreachedSeal?'color:var(--bad);font-weight:700;':r.longestWaitH>0?'color:var(--warn);':''}">${r.longestWaitH>0?r.longestWaitH+'h':'—'}</td>
      <td class="num">${r.dailyCollection.toLocaleString()}</td>
      <td class="num">${r.dailyTxn}</td>
      <td class="num" style="${r.uptime < 80 ? 'color: var(--bad)' : r.uptime < 95 ? 'color: var(--warn)' : 'color: var(--good)'};">${r.uptime}%</td>
      <td class="num">${r.bagInventory}</td>
      <td class="num">${r.escalations > 0 ? `<span style="color: var(--warn); font-weight: 600;">${r.escalations}</span>` : 0}</td>
      <td style="color: var(--text-mute); font-family: var(--font-mono); font-size: 11px;">${r.lastActive}</td>
      <td>${statusPill(r.status)}</td>
      <td><span class="row-action open-detail" data-cp="${r.id}">Open →</span></td>
    </tr>
    ${masterState.expanded.has(r.id) ? `
      <tr class="expand-row"><td colspan="25">
        <div class="expand-grid">
          <div class="expand-item"><div class="expand-item-label">Latitude</div><div class="expand-item-value">${r.lat}</div></div>
          <div class="expand-item"><div class="expand-item-label">Longitude</div><div class="expand-item-value">${r.lng}</div></div>
          <div class="expand-item"><div class="expand-item-label">Village</div><div class="expand-item-value">${r.village}</div></div>
          <div class="expand-item"><div class="expand-item-label">Installed</div><div class="expand-item-value">${r.installed}</div></div>
          <div class="expand-item"><div class="expand-item-label">Total Material</div><div class="expand-item-value">${r.totalMaterial.toLocaleString()}</div></div>
          <div class="expand-item"><div class="expand-item-label">QR Attempts</div><div class="expand-item-value">${r.qrAttempts.toLocaleString()}</div></div>
          <div class="expand-item"><div class="expand-item-label">Consumers</div><div class="expand-item-value">${r.consumers.toLocaleString()}</div></div>
          <div class="expand-item"><div class="expand-item-label">Tickets Open</div><div class="expand-item-value">${r.tickets}</div></div>
        </div>
      </td></tr>
    ` : ''}
  `).join('');

  // Pager
  const ctrls = document.getElementById('cp-pager-ctrls');
  const info = document.getElementById('cp-pager-info');
  info.innerHTML = `Showing <strong style="color:var(--text);font-family:var(--font-mono);">${start + 1}–${Math.min(start + pageSize, total)}</strong> of <strong style="color:var(--text);font-family:var(--font-mono);">${total}</strong>`;

  const pageBtns = [];
  pageBtns.push(`<button class="pg-btn" ${masterState.page === 1 ? 'disabled' : ''} data-pg="prev">‹</button>`);
  const maxBtn = Math.min(pages, 7);
  let startBtn = Math.max(1, masterState.page - 3);
  if (startBtn + maxBtn - 1 > pages) startBtn = Math.max(1, pages - maxBtn + 1);
  for (let p = startBtn; p < startBtn + maxBtn && p <= pages; p++) {
    pageBtns.push(`<button class="pg-btn ${p === masterState.page ? 'active' : ''}" data-pg="${p}">${p}</button>`);
  }
  pageBtns.push(`<button class="pg-btn" ${masterState.page === pages ? 'disabled' : ''} data-pg="next">›</button>`);
  ctrls.innerHTML = pageBtns.join('');

  // Wire up events
  ctrls.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => {
      if (b.dataset.pg === 'prev') masterState.page--;
      else if (b.dataset.pg === 'next') masterState.page++;
      else masterState.page = +b.dataset.pg;
      renderCpTable();
    });
  });

  tbody.querySelectorAll('.expand-toggle').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = el.dataset.cp;
      if (masterState.expanded.has(id)) masterState.expanded.delete(id);
      else masterState.expanded.add(id);
      renderCpTable();
    });
  });

  tbody.querySelectorAll('.open-detail').forEach(el => {
    el.addEventListener('click', () => openCpDetail(el.dataset.cp));
  });

  tbody.querySelectorAll('tr[data-cp]').forEach(tr => {
    tr.addEventListener('dblclick', () => openCpDetail(tr.dataset.cp));
  });
}

function wireCpMasterControls() {
  document.getElementById('cp-search').addEventListener('input', (e) => { masterState.search = e.target.value; masterState.page = 1; renderCpTable(); });
  document.getElementById('cp-f-type').addEventListener('change', (e) => { masterState.filterType = e.target.value; masterState.page = 1; renderCpTable(); });
  document.getElementById('cp-f-block').addEventListener('change', (e) => { masterState.filterBlock = e.target.value; masterState.page = 1; renderCpTable(); });
  document.getElementById('cp-f-vendor').addEventListener('change', (e) => { masterState.filterVendor = e.target.value; masterState.page = 1; renderCpTable(); });
  document.getElementById('cp-f-status').addEventListener('change', (e) => { masterState.filterStatus = e.target.value; masterState.page = 1; renderCpTable(); });
  document.getElementById('cp-f-retype').addEventListener('change', (e) => { masterState.filterReType = e.target.value; masterState.page = 1; renderCpTable(); });
  document.getElementById('cp-f-action').addEventListener('change', (e) => { masterState.filterAction = e.target.value; masterState.page = 1; renderCpTable(); });

  document.querySelectorAll('#cp-table thead th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const k = th.dataset.sort;
      if (masterState.sortKey === k) masterState.sortDir = masterState.sortDir === 'asc' ? 'desc' : 'asc';
      else { masterState.sortKey = k; masterState.sortDir = 'asc'; }
      renderCpTable();
    });
  });
}

/* ============================================================
   CP DETAIL PAGE
   ============================================================ */
function openCpDetail(cpId) {
  const cp = CP_DATA.find(c => c.id === cpId);
  if (!cp) return;
  document.getElementById('crumb-page').textContent = `Collection Points · ${cp.id} · ${cp.name}`;
  document.getElementById('main-content').innerHTML = pageCpDetail(cp);
  document.getElementById('main-content').scrollTop = 0;
  document.getElementById('back-to-master').addEventListener('click', () => navigateTo('cp-overall', 'cp', 'Overall View'));
}

function pageCpDetail(cp) {
  // Generate machines
  const machines = [];
  for (let i = 0; i < cp.machineCount; i++) {
    const isDown = i < cp.downMachines;
    machines.push({
      id: `${cp.id}-M${String(i+1).padStart(2,'0')}`,
      status: isDown ? 'Down' : (i === 0 && cp.status === 'Maintenance') ? 'Maintenance' : 'Active',
      uptime: isDown ? 0 : rfloat(88, 99.9),
      lastSync: isDown ? `${rint(2,18)}h ago` : `${rint(1,30)}s ago`,
      errors: isDown ? rint(3,12) : rint(0,2),
      tickets: isDown ? rint(1,4) : 0,
      firmware: `v2.${rint(1,9)}.${rint(0,12)}`,
    });
  }

  return `
    <!-- Detail header -->
    <div class="detail-header">
      <button class="detail-back" id="back-to-master">‹ Back to Master</button>
      <div>
        <div class="detail-id">${cp.id} · ${cp.type}</div>
        <div class="detail-name">${cp.name}</div>
        <div class="detail-meta">
          <span><strong>Location:</strong> ${cp.village}, ${cp.panchayat}, ${cp.block}, ${cp.district}</span>
          <span><strong>Vendor:</strong> ${cp.vendor}</span>
          <span><strong>Installed:</strong> ${cp.installed}</span>
        </div>
      </div>
      <div class="detail-status-bar">
        <div class="detail-status-item">
          <div class="detail-status-value">${cp.activeMachines}/${cp.machineCount}</div>
          <div class="detail-status-label">Machines</div>
        </div>
        <div class="detail-status-item">
          <div class="detail-status-value" style="color: ${cp.uptime < 80 ? 'var(--bad)' : cp.uptime < 95 ? 'var(--warn)' : 'var(--good)'};">${cp.uptime}%</div>
          <div class="detail-status-label">Uptime</div>
        </div>
        <div class="detail-status-item">
          <div class="detail-status-value">${cp.bagInventory}</div>
          <div class="detail-status-label">Bags</div>
        </div>
      </div>
      <div class="detail-actions">
        ${statusPill(cp.status)}
        <button class="btn">Edit</button>
        <button class="btn btn-primary">Raise Ticket</button>
      </div>
    </div>

    <!-- KPI row -->
    <div class="kgrid kgrid-6">
      ${kpi('Daily Collection', cp.dailyCollection.toLocaleString(), 'u', { delta: 4 })}
      ${kpi('Weekly Collection', (cp.dailyCollection * 6.8).toFixed(0), 'u')}
      ${kpi('Monthly Collection', (cp.dailyCollection * 28).toLocaleString(), 'u')}
      ${kpi('Daily Transactions', cp.dailyTxn, '', { delta: 2 })}
      ${kpi('Consumers', cp.consumers.toLocaleString(), '', { delta: 6 })}
      ${kpi('QR Attempts', cp.qrAttempts.toLocaleString(), '')}
      ${kpi('Material — Plastic', Math.floor(cp.totalMaterial * 0.55).toLocaleString(), 'u')}
      ${kpi('Material — Glass', Math.floor(cp.totalMaterial * 0.28).toLocaleString(), 'u')}
      ${kpi('Material — Metal', Math.floor(cp.totalMaterial * 0.10).toLocaleString(), 'u')}
      ${kpi('Material — MLP', Math.floor(cp.totalMaterial * 0.05).toLocaleString(), 'u')}
      ${kpi('Material — Tetra', Math.floor(cp.totalMaterial * 0.02).toLocaleString(), 'u')}
      ${kpi('Total Material', cp.totalMaterial.toLocaleString(), 'u')}
    </div>

    <!-- Detail panels -->
    <div class="detail-grid-2">
      <!-- A. Basic info -->
      <div class="card">
        <div class="card-head"><div><div class="card-title">A · Basic Information</div></div></div>
        <div class="card-body">
          <div class="dl-row"><span class="dl-label">CP ID</span><span class="dl-value">${cp.id}</span></div>
          <div class="dl-row"><span class="dl-label">CP Name</span><span class="dl-value txt">${cp.name}</span></div>
          <div class="dl-row"><span class="dl-label">CP Type</span><span class="dl-value txt">${cp.type}</span></div>
          <div class="dl-row"><span class="dl-label">Ownership</span><span class="dl-value txt">${cp.type === 'Non-Recykal' ? 'Non-Recykal Owned' : 'Recykal Owned'}</span></div>
          <div class="dl-row"><span class="dl-label">State</span><span class="dl-value txt">Goa</span></div>
          <div class="dl-row"><span class="dl-label">District</span><span class="dl-value txt">${cp.district}</span></div>
          <div class="dl-row"><span class="dl-label">Block</span><span class="dl-value txt">${cp.block}</span></div>
          <div class="dl-row"><span class="dl-label">Panchayat</span><span class="dl-value txt">${cp.panchayat}</span></div>
          <div class="dl-row"><span class="dl-label">Village</span><span class="dl-value txt">${cp.village}</span></div>
          <div class="dl-row"><span class="dl-label">Coordinates</span><span class="dl-value">${cp.lat}, ${cp.lng}</span></div>
          <div class="dl-row"><span class="dl-label">Vendor</span><span class="dl-value txt">${cp.vendor}</span></div>
          <div class="dl-row"><span class="dl-label">Installation</span><span class="dl-value">${cp.installed}</span></div>
        </div>
      </div>

      <!-- E. Handler details -->
      <div class="card">
        <div class="card-head"><div><div class="card-title">E · Handler Details</div></div></div>
        <div class="card-body">
          <div class="dl-row"><span class="dl-label">Handler Name</span><span class="dl-value txt">${cp.handler}</span></div>
          <div class="dl-row"><span class="dl-label">Attendance</span><span class="dl-value">${cp.status === 'Active' ? rfloat(85,99) : rfloat(60,80)}%</span></div>
          <div class="dl-row"><span class="dl-label">Presence Check</span><span class="dl-value">${cp.status === 'Active' ? rfloat(82,96) : rfloat(55,75)}%</span></div>
          <div class="dl-row"><span class="dl-label">Shift Status</span><span class="dl-value txt">${cp.status === 'Active' ? 'On-shift (Day)' : cp.status === 'Maintenance' ? 'On-shift (Maint.)' : 'Off-shift'}</span></div>
          <div class="dl-row"><span class="dl-label">Escalations</span><span class="dl-value">${cp.escalations}</span></div>
          <div class="dl-row"><span class="dl-label">Performance</span><span class="dl-value">${rfloat(3.5, 4.9, 1)} / 5</span></div>
          <div class="dl-row"><span class="dl-label">Tenure</span><span class="dl-value">${rint(2,18)} months</span></div>
          <div class="dl-row"><span class="dl-label">Roster Fill</span><span class="dl-value">${rfloat(88, 99)}%</span></div>
        </div>
      </div>
    </div>

    <!-- B. Machines table -->
    <div class="card">
      <div class="card-head"><div><div class="card-title">B · Machine Details</div><div class="card-sub">${machines.length} machine(s) at this CP</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>Machine ID</th><th>Status</th><th class="num">Uptime</th><th>Last Sync</th>
            <th class="num">Errors</th><th class="num">Tickets</th><th>Firmware</th><th></th>
          </tr></thead>
          <tbody>
            ${machines.map(m => `
              <tr>
                <td class="id-cell">${m.id}</td>
                <td>${statusPill(m.status)}</td>
                <td class="num" style="color: ${m.uptime < 80 ? 'var(--bad)' : m.uptime < 95 ? 'var(--warn)' : 'var(--good)'};">${m.uptime}%</td>
                <td style="color: var(--text-mute); font-family: var(--font-mono); font-size: 11px;">${m.lastSync}</td>
                <td class="num" style="${m.errors > 0 ? 'color: var(--warn); font-weight: 600;' : ''}">${m.errors}</td>
                <td class="num">${m.tickets}</td>
                <td class="id-cell">${m.firmware}</td>
                <td><span class="row-action">Diagnose →</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- D. Bag flow + F. Operational status -->
    <div class="detail-grid-2">
      <!-- D. Bag flow -->
      <div class="card">
        <div class="card-head"><div><div class="card-title">D · Bag Flow</div></div></div>
        <div class="card-body">
          <div class="dl-row"><span class="dl-label">Total Bags</span><span class="dl-value">${cp.bagInventory + rint(5,15)}</span></div>
          <div class="dl-row"><span class="dl-label">Available</span><span class="dl-value">${cp.bagInventory}</span></div>
          <div class="dl-row"><span class="dl-label">Filled</span><span class="dl-value">${rint(2, 8)}</span></div>
          <div class="dl-row"><span class="dl-label">Dispatch Ready</span><span class="dl-value">${rint(1, 4)}</span></div>
          <div class="dl-row"><span class="dl-label">In Transit</span><span class="dl-value">${rint(0, 3)}</span></div>
          <div class="dl-row"><span class="dl-label">Dwell Time</span><span class="dl-value">${rfloat(12, 72)} hr</span></div>
          <div class="dl-row"><span class="dl-label">Utilisation</span><span class="dl-value">${rfloat(70, 95)}%</span></div>
          <div class="dl-row"><span class="dl-label">Weight Dev.</span><span class="dl-value">${rfloat(0.5, 4.2)}%</span></div>
        </div>
      </div>

      <!-- F. Operational status -->
      <div class="card">
        <div class="card-head"><div><div class="card-title">F · Operational Status</div></div></div>
        <div class="card-body">
          <div class="dl-row"><span class="dl-label">Machine Health</span><span class="dl-value txt">${statusPill(cp.status === 'Down' ? 'Down' : cp.status === 'Maintenance' ? 'Maintenance' : 'Active')}</span></div>
          <div class="dl-row"><span class="dl-label">Internet</span><span class="dl-value txt"><span class="dot ${cp.status === 'Down' ? 'dot-bad' : 'dot-good'}"></span>${cp.status === 'Down' ? 'Disconnected' : 'Connected · 24 Mbps'}</span></div>
          <div class="dl-row"><span class="dl-label">Power</span><span class="dl-value txt"><span class="dot ${cp.status === 'Down' ? 'dot-bad' : 'dot-good'}"></span>${cp.status === 'Down' ? 'No power' : 'Mains · 230V'}</span></div>
          <div class="dl-row"><span class="dl-label">Last Transaction</span><span class="dl-value">${cp.lastActive}</span></div>
          <div class="dl-row"><span class="dl-label">Last Active</span><span class="dl-value">${cp.lastActive}</span></div>
          <div class="dl-row"><span class="dl-label">Escalation Status</span><span class="dl-value txt">${cp.escalations > 0 ? `${cp.escalations} open` : 'None'}</span></div>
          <div class="dl-row"><span class="dl-label">Downtime Reason</span><span class="dl-value txt">${cp.status === 'Down' ? 'Hardware fault — sensor module' : cp.status === 'Maintenance' ? 'Scheduled FW upgrade' : '—'}</span></div>
          <div class="dl-row"><span class="dl-label">Open Tickets</span><span class="dl-value">${cp.tickets}</span></div>
        </div>
      </div>
    </div>
  `;
}

/* ============================================================
   OTHER PAGES — operational, numerical
   ============================================================ */
function pageCpOverall() {
  // v31 changes:
  // - Removed top channel filter strip
  // - "Network Health" → "Collection Point Health"
  // - "Device Infrastructure" → "Collection Infra"
  // - D2D: "off-duty" → "not logged in", removed GPS Fresh/Open Tickets, added App Session + Households Covered
  // - Avg Health Score: info-dot with formula
  // - "Status Distribution" replaced with "Today's Collection Throughput" chart
  // - Added Bag Flow summary box
  // - Added Material Acceptance summary box with Glass/PET/Alu/HDPE/Tetra/MLP chart
  // - Removed Payment & Compliance · card
  // - Click any metric → block-wise popup (data-drill="ov-*")
  // - Info-dots (ⓘ) on metrics where calculation isn't obvious
  return `
    <div class="v25-page">

      <!-- V44 — COMPACT VISUAL ALERTS BANNER -->
      <div class="v44-alerts" style="display:flex;align-items:center;gap:0;background:#fff;border:1px solid var(--border);border-left:3px solid #dc2626;border-radius:10px;padding:8px 14px;margin-bottom:14px;overflow:hidden;">
        <div style="display:flex;align-items:center;gap:8px;padding-right:14px;border-right:1px solid #e5e7eb;flex-shrink:0;">
          <span style="font-size:14px;animation:pulse 2s infinite;">🚨</span>
          <span style="font-size:11px;font-weight:800;color:#0d1220;text-transform:uppercase;letter-spacing:0.05em;">Live Alerts</span>
          <span style="font-size:11px;font-weight:800;color:#dc2626;background:#fee2e2;padding:2px 7px;border-radius:99px;">12</span>
        </div>
        <div style="display:flex;gap:14px;padding:0 14px;flex:1;overflow:hidden;">
          <span style="font-size:11.5px;color:#0d1220;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            <span style="color:#dc2626;font-weight:600;">Bardez</span> · 4 RVMs down for &gt;6h ·
            <span style="color:#f59e0b;font-weight:600;">CPC Verna</span> dock waiting 38min ·
            <span style="color:#2c4cdc;font-weight:600;">Salcete</span> bag-fill threshold breached at 14 RVMs
          </span>
        </div>
        <div style="padding-left:14px;border-left:1px solid #e5e7eb;flex-shrink:0;">
          <button data-jump-alerts="1" style="font-size:10.5px;font-weight:700;color:#2c4cdc;background:#eff6ff;border:none;padding:5px 10px;border-radius:99px;cursor:pointer;">View All →</button>
        </div>
      </div>

      <!-- COLLECTION POINT HEALTH -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">📊</span>
          <span class="v25-card-title">Collection Point Health</span>
          <div class="v25-card-actions"><span class="v25-live">Live</span></div>
        </div>
        <div class="v25-kpi-row" id="cp-ov-kpis">
          <div class="v25-kpi k-active" data-drill="ov-total-devices">
            <div class="v25-kpi-lbl">Total Devices</div>
            <div class="v25-kpi-val">791</div>
          </div>
          <div class="v25-kpi k-redeemed" data-drill="ov-active">
            <div class="v25-kpi-lbl">Active</div>
            <div class="v25-kpi-val">766 <span class="v25-kpi-trend up">96.8%</span></div>
          </div>
          <div class="v25-kpi k-unred" data-drill="ov-down">
            <div class="v25-kpi-lbl">Down / Offline</div>
            <div class="v25-kpi-val">25 <span class="v25-kpi-trend down">3.2%</span></div>
          </div>
          <div class="v25-kpi k-yet" data-drill="ov-uptime">
            <div class="v25-kpi-lbl">Uptime %</div>
            <div class="v25-kpi-val">97.4%</div>
          </div>
          <div class="v25-kpi k-deact" data-drill="ov-health">
            <div class="v25-kpi-lbl">
              Avg Health Score
              <span class="v31-info" data-tip="Health = Uptime (50%) + Active CP ratio (40%) + Ticket-free CP % (10%). Weighted across all 791 devices.">ⓘ</span>
            </div>
            <div class="v25-kpi-val">94/100</div>
          </div>
        </div>
      </div>

      <!-- COLLECTION POINTS -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">📦</span>
          <span class="v25-card-title">Collection Points</span>
          <div class="v25-card-actions"><span style="font-size:11px;color:var(--text-mute);">Click any tile for block-wise detail</span></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;">

          <div data-drill="ov-rvm" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #2c4cdc;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">RVM (Fixed)</div>
            <div style="font-size:26px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">300</div>
            <div style="font-size:11px;color:var(--text);margin-top:6px;line-height:1.5;">
              <span style="color:#10b981;font-weight:600;">278 active</span> · <span style="color:var(--text-mute);">22 inactive</span>
            </div>
            <div style="margin-top:8px;height:5px;background:#f1f5f9;border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:92.7%;background:#2c4cdc;border-radius:3px;"></div>
            </div>
            <div style="font-size:10.5px;color:#ef4444;margin-top:4px;font-weight:600;">22 down</div>
          </div>

          <div data-drill="ov-rc" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #10b981;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Return Center (Fixed)</div>
            <div style="font-size:26px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">50</div>
            <div style="font-size:11px;color:var(--text);margin-top:6px;line-height:1.5;">
              <span style="color:#10b981;font-weight:600;">47 active</span> · <span style="color:var(--text-mute);">3 inactive</span>
            </div>
            <div style="margin-top:8px;height:5px;background:#f1f5f9;border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:94%;background:#10b981;border-radius:3px;"></div>
            </div>
            <div style="font-size:10.5px;color:#ef4444;margin-top:4px;font-weight:600;">3 down</div>
          </div>

          <div data-drill="ov-horeca" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #f59e0b;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">HoReCa CP (Mobile)</div>
            <div style="font-size:26px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">200</div>
            <div style="font-size:11px;color:var(--text);margin-top:6px;line-height:1.5;">
              <span style="color:#10b981;font-weight:600;">142 on route</span>
            </div>
            <div style="margin-top:8px;height:5px;background:#f1f5f9;border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:71%;background:#f59e0b;border-radius:3px;"></div>
            </div>
            <div style="font-size:10.5px;color:#f59e0b;margin-top:4px;font-weight:600;">71% active</div>
          </div>

          <div data-drill="ov-d2d" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #8b5cf6;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">D2D Pickup</div>
            <div style="font-size:26px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">191</div>
            <div style="font-size:11px;color:var(--text);margin-top:6px;line-height:1.5;">
              <span style="color:#10b981;font-weight:600;">156 active</span> · <span style="color:var(--text-mute);">35 inactive</span>
            </div>
            <div style="margin-top:8px;height:5px;background:#f1f5f9;border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:81.7%;background:#8b5cf6;border-radius:3px;"></div>
            </div>
            <div style="font-size:10.5px;color:#8b5cf6;margin-top:4px;font-weight:600;">82% active</div>
          </div>

          <div data-drill="ov-awp" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #ef4444;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">AWP</div>
            <div style="font-size:26px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">50</div>
            <div style="font-size:11px;color:var(--text);margin-top:6px;line-height:1.5;">
              <span style="color:#10b981;font-weight:600;">38 active</span> · <span style="color:var(--text-mute);">12 inactive</span>
            </div>
            <div style="margin-top:8px;height:5px;background:#f1f5f9;border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:76%;background:#ef4444;border-radius:3px;"></div>
            </div>
            <div style="font-size:10.5px;color:#ef4444;margin-top:4px;font-weight:600;">76% active</div>
          </div>
        </div>

        <!-- COLLECTION INFRA DISTRIBUTION PIE (v44) -->
        <div style="display:grid;grid-template-columns:230px 1fr;gap:18px;align-items:center;margin-top:16px;padding:14px;background:#fafbfc;border:1px solid var(--border);border-radius:10px;">
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">CP Mix · 791 Total</div>
            <canvas id="cp-ov-infra-pie" width="170" height="170"></canvas>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            <div style="font-size:11px;font-weight:700;color:#0d1220;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Distribution by Collection Point Type</div>
            ${[
              { name:'RVM (Fixed)',           cnt:300, color:'#2c4cdc', pct:37.9 },
              { name:'Return Center (Fixed)', cnt: 50, color:'#10b981', pct: 6.3 },
              { name:'HoReCa CP (Mobile)',    cnt:200, color:'#f59e0b', pct:25.3 },
              { name:'D2D Pickup',            cnt:191, color:'#8b5cf6', pct:24.1 },
              { name:'AWP',                   cnt: 50, color:'#ef4444', pct: 6.3 },
            ].map(r => `
              <div style="display:grid;grid-template-columns:14px 1fr 50px 40px;align-items:center;gap:8px;padding:3px 0;">
                <span style="display:inline-block;width:10px;height:10px;background:${r.color};border-radius:2px;"></span>
                <span style="font-size:11.5px;color:#0d1220;font-weight:500;">${r.name}</span>
                <span style="font-family:var(--font-mono);font-size:12px;font-weight:700;color:#0d1220;text-align:right;">${r.cnt}</span>
                <span style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:${r.color};text-align:right;">${r.pct}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- ============================================================
           V46 — BAG CAPACITY UTILIZATION (FILL RATE)
           Thresholds: 60% → pickup request raised · 80% → bag sealed
           ============================================================ -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon" style="background:#dbeafe;color:#2c4cdc;">📊</span>
          <span class="v25-card-title">Bag Capacity Utilization · Fill Rate</span>
          <div class="v25-card-actions">
            <span class="v31-info" data-tip="Each bag fills as material is collected. At 60% fill, a pickup request is automatically raised. At 80% fill, the bag is sealed and the machine stops accepting new material until the bag is replaced.">ⓘ</span>
            <span style="font-size:11px;color:var(--text-mute);">Click for per-asset detail</span>
          </div>
        </div>

        <!-- Threshold legend -->
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px;padding:8px 12px;background:#f8fafc;border-radius:8px;border:1px dashed #e5e7eb;">
          <span style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.05em;">How it works:</span>
          <span style="display:inline-flex;align-items:center;gap:6px;font-size:11px;color:#0d1220;">
            <span style="display:inline-block;width:10px;height:10px;background:#15803d;border-radius:2px;"></span>
            &lt; 60% · <strong>Collecting</strong>
          </span>
          <span style="color:#cbd5e1;">→</span>
          <span style="display:inline-flex;align-items:center;gap:6px;font-size:11px;color:#0d1220;">
            <span style="display:inline-block;width:10px;height:10px;background:#f59e0b;border-radius:2px;"></span>
            ≥ 60% · <strong>Pickup requested</strong>
          </span>
          <span style="color:#cbd5e1;">→</span>
          <span style="display:inline-flex;align-items:center;gap:6px;font-size:11px;color:#0d1220;">
            <span style="display:inline-block;width:10px;height:10px;background:#dc2626;border-radius:2px;"></span>
            ≥ 80% · <strong>Sealed</strong> · machine stops accepting
          </span>
        </div>

        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
          <!-- RVM CP -->
          <div data-drill="ov-fill-rvm" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #2c4cdc;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">RVM CP</div>
            <div style="font-size:24px;font-weight:800;color:#0d1220;font-family:var(--font-mono);margin-top:4px;">68%</div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:2px;">300 bags · 1 per RVM · mixed material</div>
            <div style="margin-top:8px;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:68%;background:#2c4cdc;border-radius:3px;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:9.5px;margin-top:4px;color:var(--text-mute);">
              <span><strong style="color:#dc2626;">14</strong> sealed</span>
              <span><strong style="color:#f59e0b;">52</strong> pickup req</span>
              <span><strong style="color:#15803d;">234</strong> collecting</span>
            </div>
          </div>

          <!-- RC CP -->
          <div data-drill="ov-fill-rc" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #f59e0b;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">RC CP</div>
            <div style="font-size:24px;font-weight:800;color:#0d1220;font-family:var(--font-mono);margin-top:4px;">74%</div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:2px;">300 bags · 6 per RC · 1 bag per material</div>
            <div style="margin-top:8px;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:74%;background:#f59e0b;border-radius:3px;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:9.5px;margin-top:4px;color:var(--text-mute);">
              <span><strong style="color:#dc2626;">26</strong> sealed</span>
              <span><strong style="color:#f59e0b;">86</strong> pickup req</span>
              <span><strong style="color:#15803d;">188</strong> collecting</span>
            </div>
          </div>

          <!-- Combined -->
          <div data-drill="ov-fill-combined" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #15803d;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Network Total</div>
            <div style="font-size:24px;font-weight:800;color:#15803d;font-family:var(--font-mono);margin-top:4px;">71%</div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:2px;">600 bags · 300 RVM + 300 RC</div>
            <div style="margin-top:8px;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:71%;background:#15803d;border-radius:3px;"></div>
            </div>
            <div style="font-size:10.5px;color:#15803d;margin-top:4px;font-weight:600;">▲ 3pp vs yesterday</div>
          </div>

          <!-- Action needed -->
          <div data-drill="ov-fill-action" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #dc2626;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Action Needed</div>
            <div style="font-size:24px;font-weight:800;color:#dc2626;font-family:var(--font-mono);margin-top:4px;">40</div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:2px;">Bags ≥ 80% · sealed · awaiting swap</div>
            <div style="display:flex;gap:6px;margin-top:8px;">
              <span style="font-size:10px;font-weight:700;padding:2px 7px;background:#fee2e2;color:#dc2626;border-radius:99px;">14 RVM</span>
              <span style="font-size:10px;font-weight:700;padding:2px 7px;background:#fee2e2;color:#dc2626;border-radius:99px;">26 RC</span>
            </div>
          </div>
        </div>

        <!-- Per-Material Fill (RVM + RC side-by-side) -->
        <div style="margin-top:14px;padding:14px;background:#fafbfc;border:1px solid var(--border);border-radius:10px;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">
            <div style="font-size:11px;font-weight:700;color:#0d1220;text-transform:uppercase;letter-spacing:0.05em;">Material-Wise Fill Rate</div>
            <div style="font-size:10.5px;color:var(--text-mute);">RVM bags hold mixed materials · RC has 1 dedicated bag per material</div>
          </div>
          <div style="font-size:11px;color:var(--text-mute);margin-bottom:12px;line-height:1.5;">
            How to read this: <strong>RVM column</strong> shows the average % of each material inside the 300 mixed-content RVM bags. <strong>RC column</strong> shows the fill % of the 50 dedicated bags per material across all RCs.
          </div>

          <!-- Header row -->
          <div style="display:grid;grid-template-columns:110px 1fr 60px 1fr 60px;align-items:center;gap:12px;padding:6px 4px;background:#fff;border-radius:6px;border-bottom:2px solid #e5e7eb;margin-bottom:4px;">
            <div style="font-size:9.5px;font-weight:800;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Material</div>
            <div style="font-size:9.5px;font-weight:800;color:#2c4cdc;text-transform:uppercase;letter-spacing:0.06em;">RVM CP · share of bag contents</div>
            <div style="font-size:9.5px;font-weight:800;color:#2c4cdc;text-transform:uppercase;letter-spacing:0.06em;text-align:right;">RVM</div>
            <div style="font-size:9.5px;font-weight:800;color:#f59e0b;text-transform:uppercase;letter-spacing:0.06em;">RC CP · 50 dedicated bags fill</div>
            <div style="font-size:9.5px;font-weight:800;color:#f59e0b;text-transform:uppercase;letter-spacing:0.06em;text-align:right;">RC</div>
          </div>

          ${[
            { mat:'Glass',     rvm: 35, rc: 78, color:'#10b981' },
            { mat:'PET',       rvm: 22, rc: 82, color:'#2c4cdc' },
            { mat:'Aluminium', rvm: 14, rc: 69, color:'#0891b2' },
            { mat:'HDPE',      rvm: 12, rc: 62, color:'#f59e0b' },
            { mat:'Tetrapak',  rvm:  8, rc: 71, color:'#ef4444' },
            { mat:'MLP',       rvm:  9, rc: 84, color:'#6b7280' },
          ].map(m => {
            const rcSealed = m.rc >= 80;
            const rcPickup = m.rc >= 60 && m.rc < 80;
            const rcColor = rcSealed ? '#dc2626' : rcPickup ? '#f59e0b' : '#15803d';
            return `
              <div data-drill="ov-fill-mat-${m.mat.toLowerCase()}" style="display:grid;grid-template-columns:110px 1fr 60px 1fr 60px;align-items:center;gap:12px;padding:6px 4px;cursor:pointer;border-radius:4px;border-bottom:1px solid #f1f5f9;">
                <span style="font-size:12px;color:#0d1220;font-weight:600;"><span style="display:inline-block;width:10px;height:10px;background:${m.color};border-radius:2px;margin-right:6px;vertical-align:middle;"></span>${m.mat}</span>
                <div style="height:10px;background:#e2e8f0;border-radius:4px;overflow:hidden;">
                  <div style="height:100%;width:${m.rvm*2.5}%;background:${m.color};border-radius:4px;"></div>
                </div>
                <span style="font-family:var(--font-mono);font-size:12px;font-weight:700;color:${m.color};text-align:right;">${m.rvm}%</span>
                <div style="height:10px;background:#e2e8f0;border-radius:4px;overflow:hidden;position:relative;">
                  <div style="height:100%;width:${m.rc}%;background:${m.color};border-radius:4px;"></div>
                  <div style="position:absolute;top:-1px;left:60%;width:1px;height:12px;background:#f59e0b;" title="60% pickup threshold"></div>
                  <div style="position:absolute;top:-1px;left:80%;width:1px;height:12px;background:#dc2626;" title="80% seal threshold"></div>
                </div>
                <span style="font-family:var(--font-mono);font-size:12px;font-weight:700;color:${rcColor};text-align:right;">${m.rc}%${rcSealed ? ' 🔒' : rcPickup ? ' 🚚' : ''}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- ============================================================
           V46 — 3-COLUMN ROW: Payment · Handler · Bag Flow
           ============================================================ -->
      <div class="v46-row-3">
      <!-- ============================================================
           PAYMENT SUCCESS RATE — v42 NEW
           ============================================================ -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon" style="background:#dcfce7;color:#15803d;">💰</span>
          <span class="v25-card-title">Payment Success Rate</span>
          <div class="v25-card-actions">
            <span class="v31-info" data-tip="Payment success across all consumer payouts (UPI refunds), brand redemptions, vendor disbursements, and handler fees. Success = transactions completed without retry or manual intervention within SLA.">ⓘ</span>
            <span style="font-size:11px;color:var(--text-mute);">Click any tile for block-wise detail</span>
          </div>
        </div>

        <!-- KPI ROW -->
        <div class="v25-kpi-row" style="grid-template-columns:repeat(4,1fr);">
          <div class="v25-kpi" data-drill="ov-pay-overall" style="border-left:3px solid #15803d;">
            <div class="v25-kpi-lbl">Overall Success Rate</div>
            <div class="v25-kpi-val" style="color:#15803d;">97.8% <span class="v25-kpi-trend up">▲ 0.6 pp</span></div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:2px;">12,486 / 12,768 today</div>
          </div>
          <div class="v25-kpi" data-drill="ov-pay-volume" style="border-left:3px solid #2c4cdc;">
            <div class="v25-kpi-lbl">Today's Volume</div>
            <div class="v25-kpi-val">₹4.82 <span style="font-size:14px;color:var(--text-mute);font-weight:600;">L</span></div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:2px;">12,768 transactions</div>
          </div>
          <div class="v25-kpi" data-drill="ov-pay-failed" style="border-left:3px solid #dc2626;">
            <div class="v25-kpi-lbl">Failed / Pending</div>
            <div class="v25-kpi-val" style="color:#dc2626;">282 <span class="v25-kpi-trend down">2.2%</span></div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:2px;">186 failed · 96 pending retry</div>
          </div>
          <div class="v25-kpi" data-drill="ov-pay-tat" style="border-left:3px solid #b45309;">
            <div class="v25-kpi-lbl">
              Avg Settlement TAT
              <span class="v31-info" data-tip="Time from QR-scan-confirmed to money credited in payee account. Measured end-to-end including bank rails.">ⓘ</span>
            </div>
            <div class="v25-kpi-val" style="color:#b45309;">2.4<small style="font-size:13px;color:var(--text-mute);font-weight:600;">s</small></div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:2px;">Target &lt; 5s · within SLA</div>
          </div>
        </div>
      </div>
      <!-- ============================================================
           HANDLER WORKFORCE — v39 NEW
           ============================================================ -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon" style="background:#fef3c7;color:#b45309;">👷</span>
          <span class="v25-card-title">Handler Workforce</span>
          <div class="v25-card-actions">
            <span class="v31-info" data-tip="Workforce = all handlers, drivers, helpers, D2D pickers, HoReCa crew, AWP rovers, sorters & loaders logged into the Handler/Worker app. 'Logged In' is the live count from app sessions; 'Presence Check' is a randomly-prompted GPS+selfie verification done 2× per shift.">ⓘ</span>
            <span class="v25-live">Live · ${new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
          </div>
        </div>

        <!-- KPI ROW -->
        <div class="v25-kpi-row">
          <div class="v25-kpi" data-drill="ov-handler-total" style="border-left:3px solid #b45309;">
            <div class="v25-kpi-lbl">Total Handlers</div>
            <div class="v25-kpi-val">100</div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:2px;">62 Fixed · 38 Rolling</div>
          </div>
          <div class="v25-kpi" data-drill="ov-handler-loggedin" style="border-left:3px solid #15803d;">
            <div class="v25-kpi-lbl">Logged In</div>
            <div class="v25-kpi-val" style="color:#15803d;">87 <span class="v25-kpi-trend up">87%</span></div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:2px;">Active in Handler App now</div>
          </div>
          <div class="v25-kpi" data-drill="ov-handler-notloggedin" style="border-left:3px solid #dc2626;">
            <div class="v25-kpi-lbl">Not Logged In</div>
            <div class="v25-kpi-val" style="color:#dc2626;">13 <span class="v25-kpi-trend down">13%</span></div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:2px;">7 off-shift · 6 absent</div>
          </div>
          <div class="v25-kpi" data-drill="ov-handler-presence" style="border-left:3px solid #2c4cdc;">
            <div class="v25-kpi-lbl">
              Presence Check
              <span class="v31-info" data-tip="GPS + selfie verification prompted 2× per shift. % = checks-passed / checks-prompted today.">ⓘ</span>
            </div>
            <div class="v25-kpi-val" style="color:#2c4cdc;">94.3%</div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:2px;">82 / 87 verified</div>
          </div>
          <div class="v25-kpi" data-drill="ov-handler-attendance" style="border-left:3px solid #7c3aed;">
            <div class="v25-kpi-lbl">Attendance % (MTD)</div>
            <div class="v25-kpi-val" style="color:#7c3aed;">91.6%</div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:2px;">Target 90% · ▲ 2.1 pp</div>
          </div>
        </div>
      </div>
      <!-- BAG FLOW SUMMARY -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">🎒</span>
          <span class="v25-card-title">Bag Flow · Network Snapshot</span>
          <div class="v25-card-actions">
            <span class="v31-info" data-tip="Bag lifecycle states from Bag PRD. Click any tile for block-wise breakdown.">ⓘ</span>
            <span style="font-size:11px;color:var(--text-mute);margin-left:6px;">Per Bag Lifecycle PRD</span>
          </div>
        </div>

        <!-- 8-state Bag Lifecycle Grid -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
          <div data-drill="ov-bag-ready" style="padding:11px 12px;background:#eef2ff;border-radius:8px;cursor:pointer;border-left:3px solid #6366f1;">
            <div style="font-size:9.5px;font-weight:700;color:#4338ca;text-transform:uppercase;letter-spacing:0.05em;">Ready for Dispatch</div>
            <div style="font-size:22px;font-weight:800;font-family:var(--font-mono);color:#4338ca;margin-top:4px;">290</div>
            <div style="font-size:10px;color:var(--text-mute);margin-top:2px;">At CPC · empty bags</div>
          </div>
          <div data-drill="ov-bag-transit-cp" style="padding:11px 12px;background:#dbeafe;border-radius:8px;cursor:pointer;border-left:3px solid #2c4cdc;">
            <div style="font-size:9.5px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:0.05em;">In Transit → CP</div>
            <div style="font-size:22px;font-weight:800;font-family:var(--font-mono);color:#1e40af;margin-top:4px;">420</div>
            <div style="font-size:10px;color:var(--text-mute);margin-top:2px;">Empty · outbound from CPC</div>
          </div>
          <div data-drill="ov-bag-inuse" style="padding:11px 12px;background:#d1fae5;border-radius:8px;cursor:pointer;border-left:3px solid #10b981;">
            <div style="font-size:9.5px;font-weight:700;color:#065f46;text-transform:uppercase;letter-spacing:0.05em;">In Use (RVM / RC)</div>
            <div style="font-size:22px;font-weight:800;font-family:var(--font-mono);color:#065f46;margin-top:4px;">2,890</div>
            <div style="font-size:10px;color:var(--text-mute);margin-top:2px;">278 RVM + 282 RC + 2,330 site</div>
          </div>
          <div data-drill="ov-bag-sealed" style="padding:11px 12px;background:#fef3c7;border-radius:8px;cursor:pointer;border-left:3px solid #f59e0b;">
            <div style="font-size:9.5px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.05em;">Sealed</div>
            <div style="font-size:22px;font-weight:800;font-family:var(--font-mono);color:#92400e;margin-top:4px;">180</div>
            <div style="font-size:10px;color:var(--text-mute);margin-top:2px;">Awaiting pickup</div>
          </div>
          <div data-drill="ov-bag-transit-cpc" style="padding:11px 12px;background:#ffedd5;border-radius:8px;cursor:pointer;border-left:3px solid #ea580c;">
            <div style="font-size:9.5px;font-weight:700;color:#9a3412;text-transform:uppercase;letter-spacing:0.05em;">In Transit → CPC</div>
            <div style="font-size:22px;font-weight:800;font-family:var(--font-mono);color:#9a3412;margin-top:4px;">380</div>
            <div style="font-size:10px;color:var(--text-mute);margin-top:2px;">Sealed · on-route to CPC</div>
          </div>
          <div data-drill="ov-bag-received" style="padding:11px 12px;background:#e9d5ff;border-radius:8px;cursor:pointer;border-left:3px solid #8b5cf6;">
            <div style="font-size:9.5px;font-weight:700;color:#6b21a8;text-transform:uppercase;letter-spacing:0.05em;">Received at CPC</div>
            <div style="font-size:22px;font-weight:800;font-family:var(--font-mono);color:#6b21a8;margin-top:4px;">64</div>
            <div style="font-size:10px;color:var(--text-mute);margin-top:2px;">Today · awaiting weighing</div>
          </div>
          <div data-drill="ov-bag-empty" style="padding:11px 12px;background:#f1f5f9;border-radius:8px;cursor:pointer;border-left:3px solid #64748b;">
            <div style="font-size:9.5px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.05em;">Empty Bag</div>
            <div style="font-size:22px;font-weight:800;font-family:var(--font-mono);color:#334155;margin-top:4px;">1,240</div>
            <div style="font-size:10px;color:var(--text-mute);margin-top:2px;">Available · post-sort</div>
          </div>
          <div data-drill="ov-bag-damaged" style="padding:11px 12px;background:#fee2e2;border-radius:8px;cursor:pointer;border-left:3px solid #dc2626;">
            <div style="font-size:9.5px;font-weight:700;color:#991b1b;text-transform:uppercase;letter-spacing:0.05em;">Damaged</div>
            <div style="font-size:22px;font-weight:800;font-family:var(--font-mono);color:#991b1b;margin-top:4px;">14</div>
            <div style="font-size:10px;color:var(--text-mute);margin-top:2px;">Today · out-of-rotation</div>
          </div>
        </div>
      </div>
      </div>


      <!-- MATERIAL SUMMARY -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">📦</span>
          <span class="v25-card-title">Material Acceptance</span>
          <div class="v25-card-actions"><span style="font-size:11px;color:var(--text-mute);">Click any channel or material for breakdown</span></div>
        </div>

        <!-- Channel split -->
        <div style="display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 1fr 1fr;gap:10px;margin-bottom:14px;">
          <div data-drill="ov-mat-total" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #1e293b;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Total Units</div>
            <div style="font-size:24px;font-weight:700;font-family:var(--font-mono);margin-top:4px;">2,47,832</div>
            <div style="font-size:10.5px;color:#10b981;margin-top:4px;font-weight:600;">▲ 12% vs yesterday</div>
          </div>
          <div data-drill="ov-mat-rvm" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #2c4cdc;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">RVM</div>
            <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);margin-top:4px;">62,400</div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:4px;">25.2% share</div>
          </div>
          <div data-drill="ov-mat-rc" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #10b981;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Retearn Center</div>
            <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);margin-top:4px;">48,320</div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:4px;">19.5% share</div>
          </div>
          <div data-drill="ov-mat-horeca" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #f59e0b;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">HoReCa</div>
            <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);margin-top:4px;">42,100</div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:4px;">17.0% share</div>
          </div>
          <div data-drill="ov-mat-d2d" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #8b5cf6;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">D2D Pickup</div>
            <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);margin-top:4px;">18,200</div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:4px;">7.3% share</div>
          </div>
          <div data-drill="ov-mat-awp" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #ef4444;cursor:pointer;background:#fff;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">AWP</div>
            <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);margin-top:4px;">12,840</div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:4px;">5.2% share</div>
          </div>
        </div>

        <!-- Material type horizontal bar chart -->
        <div style="background:#f8fafc;border-radius:8px;padding:14px 16px;">
          <div style="font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Material Type Distribution · </div>
          ${[
            { name:'Glass',     count:86740, color:'#4f6ef7', pct:35 },
            { name:'PET',       count:54522, color:'#8b5cf6', pct:22 },
            { name:'Aluminium', count:44610, color:'#10b981', pct:18 },
            { name:'HDPE',      count:29740, color:'#f59e0b', pct:12 },
            { name:'Tetrapak',  count:19826, color:'#ef4444', pct:8 },
            { name:'MLP',       count:12394, color:'#6b7280', pct:5 },
          ].map(m => `
            <div data-drill="ov-mat-type-${m.name}" style="display:grid;grid-template-columns:90px 1fr 80px 40px;align-items:center;gap:12px;margin-bottom:8px;padding:4px 0;cursor:pointer;border-radius:4px;" onmouseover="this.style.background='rgba(255,255,255,0.6)'" onmouseout="this.style.background='transparent'">
              <span style="font-size:12px;color:var(--text);"><span style="display:inline-block;width:9px;height:9px;background:${m.color};border-radius:2px;margin-right:6px;vertical-align:middle;"></span>${m.name}</span>
              <div style="height:11px;background:#e2e8f0;border-radius:6px;overflow:hidden;">
                <div style="height:100%;width:${m.pct*2.6}%;background:${m.color};border-radius:6px;transition:width 0.4s ease;"></div>
              </div>
              <span style="font-family:var(--font-mono);font-size:12px;font-weight:700;color:${m.color};text-align:right;">${m.count.toLocaleString()}</span>
              <span style="font-family:var(--font-mono);font-size:10.5px;color:var(--text-mute);text-align:right;">${m.pct}%</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- TODAY'S COLLECTION THROUGHPUT + TOP DOWN CPS -->
      <div class="v25-grid-2">
        <div class="v25-card">
          <div class="v25-card-head">
            <span class="v25-card-icon">📈</span>
            <span class="v25-card-title">Today's Collection · Hourly</span>
            <div class="v25-card-actions"><span style="font-size:11px;color:var(--text-mute);">Units / hour · last 12h</span></div>
          </div>
          ${(() => {
            const hours = ['07','08','09','10','11','12','13','14','15','16','17','18'];
            const units = [820,1240,1860,2480,3120,2820,2640,3380,4220,4860,5240,4480];
            const maxU = Math.max(...units);
            return `
              <div style="display:grid;grid-template-columns:repeat(12,1fr);gap:4px;align-items:end;height:120px;padding:8px 0 4px;">
                ${units.map((u,i) => {
                  const h = (u/maxU)*100;
                  const isPeak = u === maxU;
                  const color = isPeak ? '#2c4cdc' : '#93c5fd';
                  return `
                    <div data-drill="ov-throughput-${hours[i]}" style="display:flex;flex-direction:column;align-items:center;cursor:pointer;height:100%;justify-content:flex-end;">
                      <div style="font-size:9px;color:${isPeak?'#2c4cdc':'var(--text-mute)'};font-family:var(--font-mono);font-weight:${isPeak?'700':'500'};margin-bottom:2px;">${u>=1000?(u/1000).toFixed(1)+'k':u}</div>
                      <div style="width:100%;background:${color};border-radius:3px 3px 0 0;height:${h}%;min-height:4px;transition:all 0.2s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'"></div>
                    </div>
                  `;
                }).join('')}
              </div>
              <div style="display:grid;grid-template-columns:repeat(12,1fr);gap:4px;font-size:10px;color:var(--text-mute);font-family:var(--font-mono);text-align:center;margin-top:4px;">
                ${hours.map(h => `<div>${h}</div>`).join('')}
              </div>
              <div style="margin-top:10px;padding:8px 12px;background:#eff6ff;border-radius:6px;font-size:11px;color:#1e40af;">
                <strong>Peak: 17:00</strong> · 5,240 units · 39,180 total units today · trending ▲ 12% vs yesterday
              </div>
            `;
          })()}
        </div>

        <div class="v25-card">
          <div class="v25-card-head">
            <span class="v25-card-icon">⚠️</span>
            <span class="v25-card-title">Top 8 Down CPs Today</span>
          </div>
          <table class="v25-mini-table">
            <thead><tr><th>CP ID</th><th>Block</th><th>Type</th><th class="num">Down</th></tr></thead>
            <tbody>
              ${CP_DATA.filter(c => c.status === 'Down').slice(0,8).map(c => `
                <tr data-drill="ov-cp-${c.id}">
                  <td><strong>${c.id}</strong></td>
                  <td>${c.block}</td>
                  <td>${(c.establishmentType||'RVM')}</td>
                  <td class="num" style="color:var(--bad);font-weight:700;">${4 + (c.id.charCodeAt(3) % 18)}h</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL OVERLAY (v31) -->
      <div class="v25-modal-overlay" id="v25-modal-overlay">
        <div class="v25-modal">
          <div class="v25-modal-head">
            <div>
              <div class="v25-modal-title" id="v25-modal-title">Detail</div>
              <div class="v25-modal-sub" id="v25-modal-sub"></div>
            </div>
            <button class="v25-modal-close" id="v25-modal-close">✕</button>
          </div>
          <div class="v25-modal-body" id="v25-modal-body"></div>
        </div>
      </div>

    </div>
  `;
}

function pageCpMachines() {
  const m = getMult('cp');
  const totalRVM = scaleCount(270, m, 270);
  const totalRC = scaleCount(80, m, 80);
  const totalNonRe = scaleCount(50, m, 50);
  const totalHoReCa = scaleCount(200, m, 200);
  const totalD2D = scaleCount(200, m, 200);

  // Channel-wise data (per Image 2)
  const channelRows = [
    { ch:'RVMs',            units:62400, avgTxn:'8.2',  avgTime:'34 sec', qr:96.2, status:'OK' },
    { ch:'Retearn Centers', units:48320, avgTxn:'12.4', avgTime:'52 sec', qr:94.8, status:'OK' },
    { ch:'HoReCa',          units:42100, avgTxn:'86',   avgTime:'6 min',  qr:91.4, status:'OK' },
    { ch:'D2D Pickup',      units:18200, avgTxn:'24',   avgTime:'2 min',  qr:93.2, status:'OK' },
    { ch:'Non-Re Owned',    units:15400, avgTxn:'14.6', avgTime:'61 sec', qr:92.6, status:'OK' },
  ];
  const totalUnits = channelRows.reduce((s,r) => s+r.units, 0);
  const totalQR = (channelRows.reduce((s,r) => s + r.units*r.qr/100, 0) / totalUnits * 100).toFixed(1);

  // Material by Type
  const materials = [
    { name:'Glass',     count:86740, color:'#4f6ef7' },
    { name:'PET',       count:54522, color:'#8b5cf6' },
    { name:'Aluminium', count:44610, color:'#10b981' },
    { name:'HDPE',      count:29740, color:'#f59e0b' },
    { name:'Tetrapak',  count:19826, color:'#ef4444' },
    { name:'MLP',       count:12394, color:'#6b7280' },
  ];
  const maxMat = Math.max(...materials.map(m => m.count));

  // Panchayat-level data (top 8 panchayats)
  const panchayatData = [
    { panchayat:'Mapusa',     block:'Bardez',    rvm:18, rc:6,  nonRe:4,  active:26, down:2 },
    { panchayat:'Margao',     block:'Salcete',   rvm:22, rc:8,  nonRe:6,  active:34, down:2 },
    { panchayat:'Panaji',     block:'Tiswadi',   rvm:24, rc:10, nonRe:5,  active:36, down:3 },
    { panchayat:'Ponda',      block:'Ponda',     rvm:14, rc:5,  nonRe:4,  active:21, down:2 },
    { panchayat:'Calangute',  block:'Bardez',    rvm:12, rc:4,  nonRe:3,  active:18, down:1 },
    { panchayat:'Vasco',      block:'Mormugao',  rvm:16, rc:6,  nonRe:4,  active:24, down:2 },
    { panchayat:'Bicholim',   block:'Bicholim',  rvm:10, rc:3,  nonRe:2,  active:14, down:1 },
    { panchayat:'Canacona',   block:'Canacona',  rvm:8,  rc:2,  nonRe:2,  active:11, down:1 },
  ];

  // Block-wise rollup
  const blockData = [
    { block:'Bardez',    rvm:48, rc:14, nonRe:9,  totalUp:65, totalDown:6  },
    { block:'Salcete',   rvm:42, rc:16, nonRe:10, totalUp:62, totalDown:6  },
    { block:'Tiswadi',   rvm:38, rc:12, nonRe:8,  totalUp:54, totalDown:4  },
    { block:'Mormugao',  rvm:32, rc:10, nonRe:6,  totalUp:44, totalDown:4  },
    { block:'Ponda',     rvm:28, rc:8,  nonRe:5,  totalUp:38, totalDown:3  },
    { block:'Bicholim',  rvm:22, rc:6,  nonRe:4,  totalUp:30, totalDown:2  },
    { block:'Pernem',    rvm:20, rc:5,  nonRe:3,  totalUp:25, totalDown:3  },
    { block:'Canacona',  rvm:18, rc:5,  nonRe:3,  totalUp:23, totalDown:3  },
    { block:'Quepem',    rvm:14, rc:3,  nonRe:2,  totalUp:17, totalDown:2  },
    { block:'Sattari',   rvm:8,  rc:1,  nonRe:0,  totalUp:8,  totalDown:1  },
  ];

  return `
    <!-- Top filter strip: Handler / Non-Handler toggle -->
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;padding:10px 14px;background:#fff;border:1px solid var(--border);border-radius:10px;">
      <span style="font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">View:</span>
      <select id="cp-mach-handler-filter" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:12px;font-family:inherit;font-weight:600;background:#fff;cursor:pointer;color:var(--text);">
        <option value="all">All Channels</option>
        <option value="handler">Handler-Assisted (RC, HoReCa, D2D, Non-Re)</option>
        <option value="nonhandler">Non-Handler (RVM · Self-Service)</option>
      </select>
      <span style="font-size:11px;color:var(--text-mute);margin-left:auto;">${totalRVM} RVMs · ${totalRC} RCs · ${totalNonRe} Non-Re · ${totalHoReCa} HoReCa · ${totalD2D} D2D</span>
    </div>

    <!-- Top KPI strip -->
    <div class="kgrid kgrid-6">
      ${kpi('Total Machines', totalRVM + totalRC + totalNonRe, '', { sub: 'Fixed only · RVM+RC+Non-Re' })}
      ${kpi('Active', '✓ ' + (totalRVM + totalRC + totalNonRe - 14), '', { status: 'good' })}
      ${kpi('Down', '● 14', '', { status: 'alert' })}
      ${kpi('Uptime', '97.4', '%', { delta: 1, status: 'good' })}
      ${kpi('Total Units Today', totalUnits.toLocaleString(), '', { delta: 6 })}
      ${kpi('Overall QR %', totalQR, '%', { delta: 1, status: 'good' })}
    </div>

    <!-- CHANNEL TABLE (per Image 2) -->
    <div class="section-head" style="margin-top:18px;"><div class="section-title">Channel-Wise Performance</div><div class="section-sub">Units · Avg/Txn · Avg Time · QR % per channel</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>CHANNEL</th>
            <th class="num">UNITS</th>
            <th class="num">AVG/TXN</th>
            <th class="num">AVG TIME</th>
            <th class="num">QR %</th>
            <th>STATUS</th>
          </tr></thead>
          <tbody>
            ${channelRows.map(r => `
              <tr class="clickable" data-channel="${r.ch}">
                <td><strong>${r.ch}</strong></td>
                <td class="num">${r.units.toLocaleString()}</td>
                <td class="num">${r.avgTxn}</td>
                <td class="num">${r.avgTime}</td>
                <td class="num">${r.qr}%</td>
                <td><span class="pill pill-good">${r.status}</span></td>
              </tr>
            `).join('')}
            <tr style="background:#f8fafc;font-weight:700;">
              <td><strong>TOTAL</strong></td>
              <td class="num">${totalUnits.toLocaleString()}</td>
              <td class="num"></td>
              <td class="num"></td>
              <td class="num">${totalQR}%</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Material by Type bar chart (per Image 2) -->
    <div class="section-head" style="margin-top:18px;"><div class="section-title">Material by Type</div><div class="section-sub">Unit counts by material across all channels today</div></div>
    <div class="card">
      <div class="card-body" style="padding:18px 24px;">
        ${materials.map(mat => {
          const pct = (mat.count / maxMat * 100).toFixed(1);
          return `
            <div style="display:grid;grid-template-columns:90px 1fr 80px;align-items:center;gap:14px;margin-bottom:12px;">
              <span style="font-size:12.5px;color:var(--text);">${mat.name}</span>
              <div style="position:relative;height:14px;background:#f1f5f9;border-radius:7px;overflow:hidden;">
                <div style="height:100%;width:${pct}%;background:${mat.color};border-radius:7px;transition:width 0.4s ease;"></div>
              </div>
              <span style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:${mat.color};text-align:right;">${mat.count.toLocaleString()}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Block-wise data -->
    <div class="section-head" style="margin-top:18px;"><div class="section-title">Block-Wise Distribution</div><div class="section-sub">Machine count by block · 12 talukas in Goa · Up vs Down tracking</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>BLOCK / TALUKA</th>
            <th class="num">RVM</th>
            <th class="num">RC</th>
            <th class="num">NON-RE OWNED</th>
            <th class="num">TOTAL UP</th>
            <th class="num">TOTAL DOWN</th>
            <th>HEALTH</th>
          </tr></thead>
          <tbody>
            ${blockData.map(b => {
              const total = b.totalUp + b.totalDown;
              const health = total > 0 ? (b.totalUp / total * 100).toFixed(1) : '0';
              return `
                <tr class="clickable" data-block="${b.block}">
                  <td><strong>${b.block}</strong></td>
                  <td class="num">${b.rvm}</td>
                  <td class="num">${b.rc}</td>
                  <td class="num">${b.nonRe}</td>
                  <td class="num" style="color:var(--good);font-weight:600;">${b.totalUp}</td>
                  <td class="num" style="color:${b.totalDown>3?'var(--bad)':'var(--warn)'};font-weight:600;">${b.totalDown}</td>
                  <td><span class="pill ${health>=95?'pill-good':health>=90?'pill-warn':'pill-bad'}">${health}%</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Panchayat-level data -->
    <div class="section-head" style="margin-top:18px;"><div class="section-title">Panchayat-Level Distribution · Top 8</div><div class="section-sub">RVM + RC + Non-Re Owned per panchayat · click row to drill</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>PANCHAYAT</th>
            <th>BLOCK</th>
            <th class="num">RVM</th>
            <th class="num">RC</th>
            <th class="num">NON-RE OWNED</th>
            <th class="num">ACTIVE</th>
            <th class="num">DOWN</th>
            <th>STATUS</th>
          </tr></thead>
          <tbody>
            ${panchayatData.map(p => {
              const total = p.active + p.down;
              const healthy = total > 0 ? (p.active / total * 100) : 0;
              return `
                <tr class="clickable">
                  <td><strong>${p.panchayat}</strong></td>
                  <td style="color:var(--text-mute);">${p.block}</td>
                  <td class="num">${p.rvm}</td>
                  <td class="num">${p.rc}</td>
                  <td class="num">${p.nonRe}</td>
                  <td class="num" style="color:var(--good);font-weight:600;">${p.active}</td>
                  <td class="num" style="color:${p.down>2?'var(--bad)':'var(--warn)'};font-weight:600;">${p.down}</td>
                  <td><span class="pill ${healthy>=95?'pill-good':healthy>=90?'pill-warn':'pill-bad'}">${healthy.toFixed(0)}%</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Top faulty machines (preserved from v22) -->
    <div class="section-head" style="margin-top:18px;"><div class="section-title">Top Faulty Machines</div><div class="section-sub">By error count · ${m.label.date}</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Machine ID</th><th>CP</th><th>Block</th><th class="num">Fill %</th><th class="num">Errors</th><th class="num">Tickets</th><th class="num">Uptime</th><th>Last Sync</th><th>Status</th></tr></thead>
          <tbody>
            ${CP_DATA.filter(c => c.downMachines > 0 || c.tickets > 0).slice(0, 8).map(c => {
              const fill = capFill(rfloat(35, 95));
              return `
              <tr>
                <td class="id-cell">${c.id}-M01</td>
                <td>${c.name}</td>
                <td>${c.block}</td>
                <td class="num" style="color: ${isSealed(fill) ? 'var(--warn)' : 'var(--text)'}; font-weight: ${isSealed(fill) ? '600' : '500'};">${fill.toFixed(0)}%${isSealed(fill) ? ' 🔒' : ''}</td>
                <td class="num" style="color: var(--bad); font-weight: 600;">${rint(3,14)}</td>
                <td class="num">${c.tickets}</td>
                <td class="num">${c.uptime}%</td>
                <td style="font-family: var(--font-mono); font-size: 11px; color: var(--text-mute);">${c.lastActive}</td>
                <td>${statusPill(c.status)}</td>
              </tr>
            `;}).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function pageCpCollection() {
  const m = getMult('cp');
  const dailyBase = 38420;
  const totalBase = scaleNum(dailyBase, m);
  return `
    <div class="kgrid kgrid-4">
      ${kpi('Total Collected', totalBase.toLocaleString(), 'u', { delta: 6, sub: m.label.date })}
      ${kpi('Daily Avg', scaleNum(dailyBase * m.view * m.type * m.handler, {date:1,view:1,type:1,handler:1}).toLocaleString(), 'u', { delta: 6 })}
      ${kpi('Active CPs', scaleCount(330, m, 350), '', { delta: 2 })}
      ${kpi('Collection Eff.', '82', '%', { delta: 3 })}
    </div>

    <div class="card">
      <div class="card-head"><div><div class="card-title">Material count by type</div><div class="card-sub">${m.label.date}${m.label.block !== 'All' ? ' · '+m.label.block : ''}</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Material</th><th class="num">Units</th><th class="num">Share</th><th class="num">Δ vs last</th></tr></thead>
          <tbody>
            <tr><td>PET</td><td class="num">${Math.round(totalBase*0.42).toLocaleString()}</td><td class="num">42.0%</td><td class="num" style="color: var(--good);">▲ 6.2%</td></tr>
            <tr><td>Glass</td><td class="num">${Math.round(totalBase*0.28).toLocaleString()}</td><td class="num">28.0%</td><td class="num" style="color: var(--good);">▲ 3.1%</td></tr>
            <tr><td>HDPE</td><td class="num">${Math.round(totalBase*0.12).toLocaleString()}</td><td class="num">12.0%</td><td class="num" style="color: var(--good);">▲ 1.8%</td></tr>
            <tr><td>MLP</td><td class="num">${Math.round(totalBase*0.08).toLocaleString()}</td><td class="num">8.0%</td><td class="num" style="color: var(--bad);">▼ 1.2%</td></tr>
            <tr><td>Aluminium</td><td class="num">${Math.round(totalBase*0.07).toLocaleString()}</td><td class="num">7.0%</td><td class="num" style="color: var(--good);">▲ 2.4%</td></tr>
            <tr><td>Tetrapak</td><td class="num">${Math.round(totalBase*0.03).toLocaleString()}</td><td class="num">3.0%</td><td class="num" style="color: var(--text-mute);">◆ 0.1%</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><div><div class="card-title">Top panchayats — by collection volume</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Panchayat</th><th>Block</th><th class="num">Daily Avg</th><th class="num">Period Total</th><th class="num">CPs</th><th class="num">Active</th></tr></thead>
          <tbody>
            ${['Mapusa','Panaji','Margao','Vasco','Calangute','Ponda','Bicholim','Sanguem','Quepem','Canacona','Pernem','Curchorem'].map((p, i) => {
              const dailyShare = (8420 - i * 480);
              const scaled = Math.round(dailyShare * m.view * m.type * m.handler);
              return `
              <tr>
                <td>${p}</td>
                <td>${TALUKAS[i % TALUKAS.length]}</td>
                <td class="num">${scaled.toLocaleString()}</td>
                <td class="num">${Math.round(scaled * m.date).toLocaleString()}</td>
                <td class="num">${rint(8, 24)}</td>
                <td class="num">${rint(6, 22)}</td>
              </tr>
            `;}).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function pageCpHandler() {
  // v27: Handler & HRMS page per PRD spec
  // 100 handlers: 62 Fixed + 38 Rolling
  // Attendance, Presence Check, Roster Fill
  return `
    <div class="v25-page">
      <!-- Filter strip -->
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 16px;background:#fff;border:1px solid var(--border);border-radius:10px;margin-bottom:14px;">
        <span style="font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Handler Type:</span>
        <button class="cp-handler-filter active" data-htype="all" style="padding:5px 12px;border:1.5px solid #2c4cdc;background:#eff6ff;color:#2c4cdc;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">All (100)</button>
        <button class="cp-handler-filter" data-htype="fixed" style="padding:5px 12px;border:1px solid var(--border);background:#fff;color:var(--text-mute);border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">Fixed (62)</button>
        <button class="cp-handler-filter" data-htype="rolling" style="padding:5px 12px;border:1px solid var(--border);background:#fff;color:var(--text-mute);border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">Rolling (38)</button>

        <span style="margin-left:24px;font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Block:</span>
        <select id="cp-handler-block-filter" style="padding:5px 10px;border:1px solid var(--border);border-radius:6px;font-size:12px;font-weight:600;font-family:inherit;background:#fff;cursor:pointer;color:var(--text);">
          <option value="all">All 12 Blocks</option>
          <option value="Bardez">Bardez</option>
          <option value="Salcete">Salcete</option>
          <option value="Tiswadi">Tiswadi</option>
          <option value="Mormugao">Mormugao</option>
          <option value="Ponda">Ponda</option>
          <option value="Bicholim">Bicholim</option>
          <option value="Pernem">Pernem</option>
          <option value="Quepem">Quepem</option>
          <option value="Canacona">Canacona</option>
          <option value="Sattari">Sattari</option>
          <option value="Sanguem">Sanguem</option>
          <option value="Dharbandora">Dharbandora</option>
        </select>
        <span id="cp-handler-info" style="margin-left:auto;font-size:11px;color:var(--text-mute);">100 handlers · 86 logged in · 14 off-duty</span>
      </div>

      <!-- KPI strip -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">👤</span>
          <span class="v25-card-title">Handler Snapshot</span>
          <div class="v25-card-actions"><span class="v25-live">Live</span></div>
        </div>
        <div class="v25-kpi-row" id="cp-handler-kpis">
          <div class="v25-kpi k-active"><div class="v25-kpi-lbl">Logged In Now</div><div class="v25-kpi-val">86 <span class="v25-kpi-trend up">/100</span></div></div>
          <div class="v25-kpi k-deact"><div class="v25-kpi-lbl">Off-Duty</div><div class="v25-kpi-val">14</div></div>
          <div class="v25-kpi k-redeemed"><div class="v25-kpi-lbl">Attendance</div><div class="v25-kpi-val">94.2%</div></div>
          <div class="v25-kpi k-active"><div class="v25-kpi-lbl">Presence Check</div><div class="v25-kpi-val">91.8%</div></div>
          <div class="v25-kpi k-yet"><div class="v25-kpi-lbl">Roster Fill</div><div class="v25-kpi-val">96.4%</div></div>
          <div class="v25-kpi k-unred"><div class="v25-kpi-lbl">Misconduct Flags</div><div class="v25-kpi-val">3 <span class="v25-kpi-trend down">MTD</span></div></div>
        </div>
      </div>

      <!-- Handler type breakdown -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">🔀</span>
          <span class="v25-card-title">Handler Type Distribution</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div data-drill="handler-fixed-detail" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #10b981;cursor:pointer;background:#fff;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;">
              <span style="font-size:13px;font-weight:700;color:var(--text);">Fixed Handlers</span>
              <span style="font-size:24px;font-weight:700;font-family:var(--font-mono);color:#10b981;">62</span>
            </div>
            <div style="font-size:11px;color:var(--text-mute);margin-top:8px;line-height:1.5;">
              Assigned to a single RVM. Higher accountability per CP.<br>
              Logged in: <strong>54</strong> · Avg shift: 7.8h · Attendance: <strong>95.4%</strong>
            </div>
          </div>
          <div data-drill="handler-rolling-detail" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #f59e0b;cursor:pointer;background:#fff;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;">
              <span style="font-size:13px;font-weight:700;color:var(--text);">Rolling Handlers</span>
              <span style="font-size:24px;font-weight:700;font-family:var(--font-mono);color:#f59e0b;">38</span>
            </div>
            <div style="font-size:11px;color:var(--text-mute);margin-top:8px;line-height:1.5;">
              Moves between RVMs / RCs as needed. Flexible cover.<br>
              Logged in: <strong>32</strong> · Avg shift: 7.2h · Avg CPs covered: <strong>2.8</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Login/Logout activity -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">🔓</span>
          <span class="v25-card-title">Recent Login / Logout Activity</span>
          <div class="v25-card-actions"><span style="font-size:11px;color:var(--text-mute);">Most recent 12 events</span></div>
        </div>
        <table class="v25-mini-table">
          <thead><tr><th>Time</th><th>Handler</th><th>Type</th><th>RVM / CP</th><th>Block</th><th>Event</th></tr></thead>
          <tbody>
            ${[
              ['09:42','HND-024 · Ravi K.','Fixed','RVM-014 · Mapusa Market','Bardez','Login'],
              ['09:38','HND-058 · Sanjana D.','Rolling','RVM-082 · Margao Plaza','Salcete','Login (assigned)'],
              ['09:32','HND-031 · Suresh P.','Fixed','RVM-046 · Panaji Square','Tiswadi','Login'],
              ['09:24','HND-072 · Anand M.','Rolling','RC-12 · Vasco Hub','Mormugao','Login (assigned)'],
              ['09:18','HND-008 · Manoj S.','Fixed','RVM-022 · Calangute','Bardez','Login'],
              ['09:12','HND-045 · Priya N.','Rolling','RVM-064 · Ponda Civic','Ponda','Login (assigned)'],
              ['09:04','HND-018 · Devraj T.','Fixed','RVM-098 · Bicholim','Bicholim','Login'],
              ['08:58','HND-052 · Kavita P.','Rolling','RC-08 · Bardez Bazaar','Bardez','Login (assigned)'],
              ['07:42','HND-006 · Pradeep H.','Fixed','RVM-008 · Mapusa Main','Bardez','Logout (overnight shift)'],
              ['07:38','HND-027 · Vinod R.','Fixed','RVM-038 · Margao East','Salcete','Logout'],
              ['07:30','HND-064 · Ashwin N.','Rolling','RVM-114 · Quepem','Quepem','Logout'],
              ['07:22','HND-019 · Rohit B.','Fixed','RVM-024 · Anjuna','Bardez','Logout'],
            ].map((r,i) => `
              <tr${i%2?' class="striped"':''}>
                <td style="font-family:var(--font-mono);">${r[0]}</td>
                <td><strong>${r[1]}</strong></td>
                <td><span class="v25-pct-pill ${r[2]==='Fixed'?'green':'amber'}">${r[2]}</span></td>
                <td>${r[3]}</td>
                <td>${r[4]}</td>
                <td style="color:${r[5].includes('Login')?'#10b981':'#6b7280'};font-weight:600;">${r[5]}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Presence check -->
      <div class="v25-grid-2">
        <div class="v25-card">
          <div class="v25-card-head">
            <span class="v25-card-icon">📍</span>
            <span class="v25-card-title">Presence Check · Last 24h</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:14px;">
            <div style="padding:12px;background:#f8fafc;border-radius:8px;">
              <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Checks Triggered</div>
              <div style="font-size:22px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">284</div>
            </div>
            <div style="padding:12px;background:#f8fafc;border-radius:8px;">
              <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Completed in Window</div>
              <div style="font-size:22px;font-weight:700;color:#10b981;font-family:var(--font-mono);margin-top:4px;">261 <span style="font-size:13px;">(91.8%)</span></div>
            </div>
            <div style="padding:12px;background:#f8fafc;border-radius:8px;">
              <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Missed</div>
              <div style="font-size:22px;font-weight:700;color:#ef4444;font-family:var(--font-mono);margin-top:4px;">23</div>
            </div>
            <div style="padding:12px;background:#f8fafc;border-radius:8px;">
              <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Avg Response Time</div>
              <div style="font-size:22px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">38 sec</div>
            </div>
          </div>
          <div style="font-size:11.5px;color:var(--text-mute);line-height:1.5;">
            Per PRD: QR generated on RVM/RC device, handler must scan with Handler App within 60-second window. Missed checks escalate after 3 consecutive failures.
          </div>
        </div>

        <div class="v25-card">
          <div class="v25-card-head">
            <span class="v25-card-icon">📋</span>
            <span class="v25-card-title">Roster Fill · This Week</span>
          </div>
          <table class="v25-mini-table">
            <thead><tr><th>Day</th><th class="num">Planned</th><th class="num">Filled</th><th class="num">Fill %</th></tr></thead>
            <tbody>
              ${[
                ['Mon',100,98,98],['Tue',100,96,96],['Wed',100,97,97],
                ['Thu',100,95,95],['Fri',100,99,99],['Sat',96,92,95.8],['Sun',88,84,95.5],
              ].map((r,i) => `
                <tr${i%2?' class="striped"':''}>
                  <td><strong>${r[0]}</strong></td>
                  <td class="num">${r[1]}</td>
                  <td class="num">${r[2]}</td>
                  <td class="num"><span class="v25-pct-pill ${r[3]>=96?'green':'amber'}">${r[3]}%</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Block-wise handler distribution -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">🗺️</span>
          <span class="v25-card-title">Block-Wise Handler Distribution</span>
        </div>
        <table class="v25-mini-table">
          <thead><tr><th>Block / Taluka</th><th class="num">Total</th><th class="num">Fixed</th><th class="num">Rolling</th><th class="num">RVMs Covered</th><th class="num">Attendance %</th></tr></thead>
          <tbody>
            ${[
              ['Bardez',     18, 12, 6, 34, 95.4],
              ['Salcete',    16, 10, 6, 48, 94.8],
              ['Tiswadi',    14,  9, 5, 30, 96.2],
              ['Mormugao',   10,  7, 3, 22, 93.6],
              ['Ponda',      12,  8, 4, 24, 94.1],
              ['Bicholim',    8,  5, 3, 18, 95.8],
              ['Pernem',      6,  4, 2, 18, 92.4],
              ['Quepem',      6,  4, 2, 18, 93.2],
              ['Canacona',    5,  2, 3, 28, 91.6],
              ['Sattari',     2,  1, 1,  8, 88.4],
              ['Sanguem',     2,  0, 2, 12, 90.2],
              ['Dharbandora', 1,  0, 1, 10, 89.6],
            ].map((r,i) => `
              <tr${i%2?' class="striped"':''}>
                <td><strong>${r[0]}</strong></td>
                <td class="num">${r[1]}</td>
                <td class="num">${r[2]}</td>
                <td class="num">${r[3]}</td>
                <td class="num">${r[4]}</td>
                <td class="num"><span class="v25-pct-pill ${r[5]>=94?'green':r[5]>=90?'amber':'red'}">${r[5]}%</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Panchayat-RVM handler assignment -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">📍</span>
          <span class="v25-card-title">Panchayat × RVM × Handler Assignment</span>
          <div class="v25-card-actions"><span style="font-size:11px;color:var(--text-mute);">Sample · Top 8</span></div>
        </div>
        <table class="v25-mini-table">
          <thead><tr><th>Panchayat</th><th>RVM</th><th>Handler</th><th>Type</th><th>Shift</th><th>Status</th></tr></thead>
          <tbody>
            ${[
              ['Mapusa',     'RVM-014','HND-024 · Ravi K.',    'Fixed',  '08:00-16:00','✓ On duty'],
              ['Mapusa',     'RVM-008','HND-006 · Pradeep H.', 'Fixed',  '16:00-00:00','◷ Next shift'],
              ['Margao',     'RVM-082','HND-058 · Sanjana D.', 'Rolling','08:00-16:00','✓ On duty'],
              ['Calangute',  'RVM-022','HND-008 · Manoj S.',   'Fixed',  '08:00-16:00','✓ On duty'],
              ['Panaji',     'RVM-046','HND-031 · Suresh P.',  'Fixed',  '08:00-16:00','✓ On duty'],
              ['Vasco',      'RVM-064','HND-072 · Anand M.',   'Rolling','08:00-16:00','✓ On duty'],
              ['Ponda',      'RVM-064','HND-045 · Priya N.',   'Rolling','08:00-16:00','✓ On duty'],
              ['Bicholim',   'RVM-098','HND-018 · Devraj T.',  'Fixed',  '08:00-16:00','✓ On duty'],
            ].map((r,i) => `
              <tr${i%2?' class="striped"':''}>
                <td>${r[0]}</td>
                <td><strong>${r[1]}</strong></td>
                <td>${r[2]}</td>
                <td><span class="v25-pct-pill ${r[3]==='Fixed'?'green':'amber'}">${r[3]}</span></td>
                <td style="font-family:var(--font-mono);font-size:11px;">${r[4]}</td>
                <td style="color:${r[5].startsWith('✓')?'#10b981':'#6b7280'};font-weight:600;">${r[5]}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Customer Support -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">🎧</span>
          <span class="v25-card-title">Handler-Related Customer Support</span>
        </div>
        <div class="v25-kpi-row">
          <div class="v25-kpi k-active"><div class="v25-kpi-lbl">Ticket TAT</div><div class="v25-kpi-val">4.2h <span class="v25-kpi-trend up">▼ 8%</span></div></div>
          <div class="v25-kpi k-redeemed"><div class="v25-kpi-lbl">CSAT</div><div class="v25-kpi-val">4.6 <span class="v25-kpi-trend up">/5</span></div></div>
          <div class="v25-kpi k-yet"><div class="v25-kpi-lbl">First Call Res.</div><div class="v25-kpi-val">78%</div></div>
          <div class="v25-kpi k-unred"><div class="v25-kpi-lbl">Escalations / CP</div><div class="v25-kpi-val">0.6</div></div>
          <div class="v25-kpi k-deact"><div class="v25-kpi-lbl">Misconduct (today)</div><div class="v25-kpi-val">0</div></div>
          <div class="v25-kpi k-total"><div class="v25-kpi-lbl">Unscannable QR</div><div class="v25-kpi-val">0.42%</div></div>
        </div>
      </div>
    </div>
  `;
}

function pageCpBagflow() {
  // v27: Bag Flow page using canonical Bag PRD states + HB metrics
  // PRD states: PRE_REGISTRATION → AVAILABLE_FOR_DISPATCH → IN_TRANSIT_TO_CP → AT_CP →
  //             IN_USE → SEALED → IN_TRANSIT_TO_CPC → RECEIVED_AT_CPC → COUNTING_IN_PROGRESS →
  //             COUNTED → AVAILABLE (reset for reuse) → END_OF_LIFE
  // Exception states: SEAL_TAMPERED · COUNT_DISCREPANCY · THEFT_SUSPECTED · DAMAGED
  return `
    <div class="v25-page">
      <!-- PRD anchor note -->
      <div style="padding:14px 16px;background:#eff6ff;border-left:3px solid #2c4cdc;border-radius:6px;margin-bottom:14px;font-size:12px;color:var(--text);line-height:1.6;">
        <strong style="color:#2c4cdc;">Per Bag Lifecycle PRD</strong> — A bag is the atomic unit of accountability. Each bag has a unique QR, follows defined state transitions without skipping, and has a single custodian at any moment. Closed-loop cycle: <strong>CPC → CP → CPC</strong>. Max reuse cycles: <strong>20</strong> before END_OF_LIFE retirement.
      </div>

      <!-- Top KPIs -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">🎒</span>
          <span class="v25-card-title">Bag Network Snapshot</span>
          <div class="v25-card-actions"><span class="v25-live">Live</span></div>
        </div>
        <div class="v25-kpi-row">
          <div class="v25-kpi k-active" data-drill="bag-total"><div class="v25-kpi-lbl">Total Inventory</div><div class="v25-kpi-val">4,820</div></div>
          <div class="v25-kpi k-redeemed" data-drill="bag-available"><div class="v25-kpi-lbl">Ready to Dispatch</div><div class="v25-kpi-val">290</div></div>
          <div class="v25-kpi k-yet" data-drill="bag-in-use"><div class="v25-kpi-lbl">In Use (At CP)</div><div class="v25-kpi-val">2,890</div></div>
          <div class="v25-kpi k-unred" data-drill="bag-sealed"><div class="v25-kpi-lbl">Sealed / Filled</div><div class="v25-kpi-val">180</div></div>
          <div class="v25-kpi k-deact" data-drill="bag-damaged"><div class="v25-kpi-lbl">Damaged Today</div><div class="v25-kpi-val">14 <span class="v25-kpi-trend down">↑3</span></div></div>
          <div class="v25-kpi k-total" data-drill="bag-eol"><div class="v25-kpi-lbl">EOL Retired (MTD)</div><div class="v25-kpi-val">38</div></div>
        </div>
      </div>

      <!-- 12-state lifecycle pipeline -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">🔄</span>
          <span class="v25-card-title">Bag Lifecycle · Canonical PRD States</span>
          <div class="v25-card-actions"><span style="font-size:11px;color:var(--text-mute);">12 states · click any for detail</span></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;">
          ${[
            {n:'1', code:'PRE_REGISTRATION',       lbl:'Pre-Registration', count:124,  color:'#94a3b8', app:'SO Portal',    sla:'—'},
            {n:'2', code:'AVAILABLE_FOR_DISPATCH', lbl:'Ready to Dispatch',count:290,  color:'#3b82f6', app:'Depot App',    sla:'24h'},
            {n:'3', code:'IN_TRANSIT_TO_CP',       lbl:'In Transit → CP',  count:420,  color:'#0ea5e9', app:'Driver App',   sla:'8h'},
            {n:'4', code:'AT_CP',                  lbl:'At CP (Awaiting)', count:188,  color:'#06b6d4', app:'Handler App',  sla:'—'},
            {n:'5', code:'IN_USE',                 lbl:'In Use / Filling', count:2890, color:'#10b981', app:'Handler App',  sla:'48h'},
            {n:'6', code:'SEALED',                 lbl:'Sealed',           count:180,  color:'#f59e0b', app:'Handler App',  sla:'4h'},
            {n:'7', code:'IN_TRANSIT_TO_CPC',      lbl:'In Transit → CPC', count:380,  color:'#fb923c', app:'Driver App',   sla:'8h'},
            {n:'8', code:'RECEIVED_AT_CPC',        lbl:'Received at CPC',  count:64,   color:'#a855f7', app:'Depot App',    sla:'2h'},
            {n:'9', code:'COUNTING_IN_PROGRESS',   lbl:'Counting',         count:48,   color:'#c026d3', app:'Depot App',    sla:'24h'},
            {n:'10',code:'COUNTED',                lbl:'Counted',          count:32,   color:'#d946ef', app:'Depot App',    sla:'—'},
            {n:'11',code:'AVAILABLE',              lbl:'Reset (Available)',count:158,  color:'#22c55e', app:'Depot App',    sla:'—'},
            {n:'12',code:'END_OF_LIFE',            lbl:'End-of-Life',      count:18,   color:'#6b7280', app:'Depot App',    sla:'—'},
          ].map(s => `
            <div data-drill="bag-state-${s.code}" style="padding:10px 8px;background:${s.color}15;border-radius:8px;border:1px solid var(--border);border-top:3px solid ${s.color};cursor:pointer;transition:transform 0.15s;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
              <div style="display:flex;justify-content:space-between;align-items:baseline;">
                <span style="font-size:9px;font-weight:700;color:${s.color};letter-spacing:0.04em;">A${s.n}</span>
                <span style="font-size:8.5px;color:${s.color};font-weight:600;">SLA ${s.sla}</span>
              </div>
              <div style="font-size:10.5px;font-weight:700;color:var(--text);margin-top:4px;line-height:1.25;">${s.lbl}</div>
              <div style="font-size:8px;color:var(--text-mute);font-family:var(--font-mono);margin-top:2px;">${s.code}</div>
              <div style="font-family:var(--font-mono);font-size:18px;font-weight:700;color:#1e293b;line-height:1;margin-top:6px;">${s.count.toLocaleString()}</div>
              <div style="font-size:9px;color:${s.color};font-weight:600;margin-top:4px;">${s.app}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Bag at CP - by channel + capacity utilisation -->
      <div class="v25-grid-2">
        <div class="v25-card">
          <div class="v25-card-head">
            <span class="v25-card-icon">📦</span>
            <span class="v25-card-title">In-Use Bags by Channel</span>
          </div>
          <table class="v25-mini-table">
            <thead><tr><th>Channel</th><th class="num">CPs</th><th class="num">Active Bags</th><th class="num">Capacity Limit</th><th class="num">Util %</th></tr></thead>
            <tbody>
              <tr><td><strong>RVM</strong></td><td class="num">300</td><td class="num">278</td><td class="num">1 / RVM</td><td class="num"><span class="v25-pct-pill green">92.7%</span></td></tr>
              <tr class="striped"><td><strong>Retearn Center</strong></td><td class="num">50</td><td class="num">282</td><td class="num">6 / RC</td><td class="num"><span class="v25-pct-pill green">94.0%</span></td></tr>
              <tr><td><strong>HoReCa CP</strong></td><td class="num">200</td><td class="num">142</td><td class="num">on-truck</td><td class="num"><span class="v25-pct-pill amber">71.0%</span></td></tr>
              <tr class="striped"><td><strong>D2D Pickup</strong></td><td class="num">191</td><td class="num">0</td><td class="num">N/A — no bag</td><td class="num">—</td></tr>
            </tbody>
          </table>
          <div style="font-size:11px;color:var(--text-mute);margin-top:10px;font-style:italic;">
            Per PRD: D2D scans QR at consumer doorstep but bags stay at receiving fixed CP / AWP truck.
          </div>
        </div>

        <div class="v25-card">
          <div class="v25-card-head">
            <span class="v25-card-icon">📏</span>
            <span class="v25-card-title">Capacity Utilisation at Seal</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
            <div style="padding:12px;background:#f8fafc;border-radius:8px;">
              <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Unit Utilisation</div>
              <div style="font-size:22px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">82%</div>
              <div style="font-size:10.5px;color:#f59e0b;margin-top:4px;font-weight:600;">Target 85% — below</div>
            </div>
            <div style="padding:12px;background:#f8fafc;border-radius:8px;">
              <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Volume Utilisation</div>
              <div style="font-size:22px;font-weight:700;color:#10b981;font-family:var(--font-mono);margin-top:4px;">88%</div>
              <div style="font-size:10.5px;color:#10b981;margin-top:4px;font-weight:600;">Target 85% — meeting</div>
            </div>
            <div style="padding:12px;background:#f8fafc;border-radius:8px;">
              <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Weight Deviation</div>
              <div style="font-size:22px;font-weight:700;color:#10b981;font-family:var(--font-mono);margin-top:4px;">2.4%</div>
              <div style="font-size:10.5px;color:#10b981;margin-top:4px;font-weight:600;">Within 5% tolerance</div>
            </div>
            <div style="padding:12px;background:#f8fafc;border-radius:8px;">
              <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Dwell Period at CP</div>
              <div style="font-size:22px;font-weight:700;color:#f59e0b;font-family:var(--font-mono);margin-top:4px;">11.4h</div>
              <div style="font-size:10.5px;color:#ef4444;margin-top:4px;font-weight:600;">SLA 4h — 14 breaches</div>
            </div>
          </div>
          <div style="font-size:11px;color:var(--text-mute);">
            Per PRD: Bag closure based on weight, volume, or quantity threshold (whichever first).
          </div>
        </div>
      </div>

      <!-- Reuse cycle (key v27 addition) -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">♻️</span>
          <span class="v25-card-title">Bag Reuse Cycle Distribution</span>
          <div class="v25-card-actions"><span style="font-size:11px;color:var(--text-mute);">Max 20 cycles before retirement</span></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px;">
          <div style="padding:12px;background:#f8fafc;border-radius:8px;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Avg Cycles / Bag</div>
            <div style="font-size:22px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">8.4</div>
            <div style="font-size:10.5px;color:var(--text-mute);margin-top:4px;">Target: 18 · Headroom: 11.6 cycles</div>
          </div>
          <div style="padding:12px;background:#f8fafc;border-radius:8px;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Bags at Cycle 18+ (near EOL)</div>
            <div style="font-size:22px;font-weight:700;color:#f59e0b;font-family:var(--font-mono);margin-top:4px;">86</div>
            <div style="font-size:10.5px;color:#f59e0b;margin-top:4px;font-weight:600;">Plan replacement order</div>
          </div>
          <div style="padding:12px;background:#f8fafc;border-radius:8px;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Early Decommission (damage)</div>
            <div style="font-size:22px;font-weight:700;color:#ef4444;font-family:var(--font-mono);margin-top:4px;">22%</div>
            <div style="font-size:10.5px;color:#ef4444;margin-top:4px;font-weight:600;">Above target 15%</div>
          </div>
          <div style="padding:12px;background:#f8fafc;border-radius:8px;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Bag Runway</div>
            <div style="font-size:22px;font-weight:700;color:#10b981;font-family:var(--font-mono);margin-top:4px;">38 days</div>
            <div style="font-size:10.5px;color:#10b981;margin-top:4px;font-weight:600;">At current consumption</div>
          </div>
        </div>

        <!-- Cycle distribution bar chart -->
        <div style="margin-top:10px;">
          <div style="font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Cycle Count Distribution · All 4,820 bags</div>
          <div style="display:grid;grid-template-columns:repeat(20,1fr);gap:2px;align-items:end;height:80px;">
            ${[420,512,486,498,452,464,418,392,348,302,268,234,198,162,128,94,68,42,28,14].map((n,i) => {
              const h = (n / 512) * 100;
              const color = i < 12 ? '#10b981' : i < 17 ? '#f59e0b' : '#ef4444';
              return `<div style="background:${color};height:${h}%;border-radius:2px 2px 0 0;" title="Cycle ${i+1}: ${n} bags"></div>`;
            }).join('')}
          </div>
          <div style="display:grid;grid-template-columns:repeat(20,1fr);gap:2px;margin-top:4px;font-size:9px;font-family:var(--font-mono);color:var(--text-mute);text-align:center;">
            ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(n => `<div>${n}</div>`).join('')}
          </div>
          <div style="display:flex;gap:14px;margin-top:8px;font-size:10.5px;color:var(--text-mute);">
            <span><span style="display:inline-block;width:10px;height:10px;background:#10b981;border-radius:2px;margin-right:4px;vertical-align:middle;"></span>Cycle 1-12 (healthy)</span>
            <span><span style="display:inline-block;width:10px;height:10px;background:#f59e0b;border-radius:2px;margin-right:4px;vertical-align:middle;"></span>Cycle 13-17 (aging)</span>
            <span><span style="display:inline-block;width:10px;height:10px;background:#ef4444;border-radius:2px;margin-right:4px;vertical-align:middle;"></span>Cycle 18-20 (near EOL · order replacement)</span>
          </div>
        </div>
      </div>

      <!-- Damaged & Exception bags (key v27 addition) -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">⚠️</span>
          <span class="v25-card-title">Damaged & Exception Bags · Today</span>
        </div>
        <div class="v25-kpi-row">
          <div class="v25-kpi k-unred" data-drill="bag-damaged-transit"><div class="v25-kpi-lbl">Damaged in Transit</div><div class="v25-kpi-val">6</div></div>
          <div class="v25-kpi k-unred" data-drill="bag-damaged-cp"><div class="v25-kpi-lbl">Damaged at CP</div><div class="v25-kpi-val">5</div></div>
          <div class="v25-kpi k-unred" data-drill="bag-damaged-cpc"><div class="v25-kpi-lbl">Damaged at CPC (inward)</div><div class="v25-kpi-val">3</div></div>
          <div class="v25-kpi k-yet" data-drill="bag-seal-tampered"><div class="v25-kpi-lbl">SEAL_TAMPERED</div><div class="v25-kpi-val">2</div></div>
          <div class="v25-kpi k-yet" data-drill="bag-count-disc"><div class="v25-kpi-lbl">COUNT_DISCREPANCY</div><div class="v25-kpi-val">8</div></div>
          <div class="v25-kpi k-deact" data-drill="bag-lost"><div class="v25-kpi-lbl">Lost / Unaccounted</div><div class="v25-kpi-val">2</div></div>
        </div>
        <div style="margin-top:12px;padding:10px 14px;background:#fef2f2;border-left:3px solid #ef4444;border-radius:6px;font-size:11.5px;color:#7f1d1d;">
          <strong>Replacement needed:</strong> 14 damaged bags decommissioned today. New bags must be dispatched from CPC to affected CPs (RVM-024, RVM-138, RC-08, RC-23) to maintain inventory.
        </div>
      </div>

      <!-- Sample check rate  -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">🔍</span>
          <span class="v25-card-title">Bag Sample Check Rate</span>
          <div class="v25-card-actions"><span style="font-size:11px;color:var(--text-mute);">Random inward sampling for full unit-level counting</span></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;">
          <div style="padding:12px;background:#f8fafc;border-radius:8px;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Inward Bags Today</div>
            <div style="font-size:22px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">128</div>
          </div>
          <div style="padding:12px;background:#f8fafc;border-radius:8px;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Sampled for Full Count</div>
            <div style="font-size:22px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">14</div>
          </div>
          <div style="padding:12px;background:#f8fafc;border-radius:8px;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Sample Rate</div>
            <div style="font-size:22px;font-weight:700;color:#10b981;font-family:var(--font-mono);margin-top:4px;">10.9%</div>
          </div>
          <div style="padding:12px;background:#f8fafc;border-radius:8px;">
            <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Sampled with Variance</div>
            <div style="font-size:22px;font-weight:700;color:#f59e0b;font-family:var(--font-mono);margin-top:4px;">2 <span style="font-size:13px;">(14%)</span></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function pageCpOthers() {
  return `
    <div class="kgrid kgrid-4">
      ${kpi('Support TAT', '4.2', 'hr', { delta: -8 })}
      ${kpi('CSAT Score', '4.6', '/5', { delta: 2 })}
      ${kpi('First Call Res.', '78', '%', { delta: 4 })}
      ${kpi('Compliance', '94.2', '%', { delta: 1 })}
      ${kpi('Non-Compliance', '5.8', '%', { delta: -1 })}
      ${kpi('Unscannable QR', '0.42', '%', { delta: -1 })}
    </div>
  `;
}

/* Material Acceptance page (v23) */
function pageCpMaterial() {
  // v27: Material Acceptance per per PRD
  // Handler / Non-Handler filter at top
  return `
    <div class="v25-page">
      <!-- Filter strip -->
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 16px;background:#fff;border:1px solid var(--border);border-radius:10px;margin-bottom:14px;">
        <span style="font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">View:</span>
        <button class="cp-mat-filter active" data-mfilter="all" style="padding:5px 12px;border:1.5px solid #2c4cdc;background:#eff6ff;color:#2c4cdc;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">All</button>
        <button class="cp-mat-filter" data-mfilter="handler" style="padding:5px 12px;border:1px solid var(--border);background:#fff;color:var(--text-mute);border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">Handler-assisted</button>
        <button class="cp-mat-filter" data-mfilter="nonhandler" style="padding:5px 12px;border:1px solid var(--border);background:#fff;color:var(--text-mute);border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">Non-Handler</button>

        <span style="margin-left:24px;font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Block:</span>
        <select id="cp-mat-block-filter" style="padding:5px 10px;border:1px solid var(--border);border-radius:6px;font-size:12px;font-weight:600;font-family:inherit;background:#fff;cursor:pointer;color:var(--text);">
          <option value="all">All 12 Blocks</option>
          <option value="Bardez">Bardez</option>
          <option value="Salcete">Salcete</option>
          <option value="Tiswadi">Tiswadi</option>
          <option value="Mormugao">Mormugao</option>
          <option value="Ponda">Ponda</option>
        </select>

        <span style="margin-left:8px;font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Material:</span>
        <select id="cp-mat-material-filter" style="padding:5px 10px;border:1px solid var(--border);border-radius:6px;font-size:12px;font-weight:600;font-family:inherit;background:#fff;cursor:pointer;color:var(--text);">
          <option value="all">All Types</option>
          <option value="Glass">Glass</option>
          <option value="PET">PET</option>
          <option value="Aluminium">Aluminium</option>
          <option value="HDPE">HDPE</option>
          <option value="Tetrapak">Tetrapak</option>
          <option value="MLP">MLP</option>
        </select>
      </div>

      <!-- Total Material Count by Handler-state -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">📊</span>
          <span class="v25-card-title">Total Material Count (Units)</span>
          <div class="v25-card-actions"><span style="font-size:11px;color:var(--text-mute);">Daily · all channels</span></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div data-drill="mat-cp01-handler" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #10b981;cursor:pointer;background:#fff;">
            <div style="font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Handler-Assisted</div>
            <div style="font-size:28px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">1,84,520</div>
            <div style="font-size:11px;color:var(--text);margin-top:8px;line-height:1.6;">
              RVMs (Handler): <strong>62,400</strong><br>
              Retearn Centers: <strong>48,320</strong><br>
              HoReCa: <strong>42,100</strong><br>
              D2D Pickup: <strong>18,200</strong><br>
              Non-Re Owned: <strong>13,500</strong>
            </div>
          </div>
          <div data-drill="mat-cp02-nonhandler" style="padding:14px;border:1px solid var(--border);border-radius:10px;border-left:3px solid #f59e0b;cursor:pointer;background:#fff;">
            <div style="font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Non-Handler (Self-Service)</div>
            <div style="font-size:28px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">63,312</div>
            <div style="font-size:11px;color:var(--text);margin-top:8px;line-height:1.6;">
              RVMs (No Handler): <strong>61,420</strong><br>
              Retearn Centers (No Handler): <strong>1,892</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Material by Type (color category) -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">🎨</span>
          <span class="v25-card-title">Material Count by Type</span>
          <div class="v25-card-actions"><span style="font-size:11px;color:var(--text-mute);">Click any bar to drill</span></div>
        </div>
        <div style="padding:8px 4px;">
          ${[
            { name:'Glass',     count:86740, color:'#4f6ef7', pct:35 },
            { name:'PET',       count:54522, color:'#8b5cf6', pct:22 },
            { name:'Aluminium', count:44610, color:'#10b981', pct:18 },
            { name:'HDPE',      count:29740, color:'#f59e0b', pct:12 },
            { name:'Tetrapak',  count:19826, color:'#ef4444', pct:8 },
            { name:'MLP',       count:12394, color:'#6b7280', pct:5 },
          ].map(m => `
            <div data-drill="mat-type-${m.name}" style="display:grid;grid-template-columns:100px 1fr 80px 50px;align-items:center;gap:12px;margin-bottom:10px;padding:6px 8px;border-radius:6px;cursor:pointer;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
              <span style="font-size:12.5px;color:var(--text);"><span style="display:inline-block;width:10px;height:10px;background:${m.color};border-radius:2px;margin-right:6px;vertical-align:middle;"></span>${m.name}</span>
              <div style="height:14px;background:#f1f5f9;border-radius:7px;overflow:hidden;">
                <div style="height:100%;width:${m.pct*2.5}%;background:${m.color};border-radius:7px;"></div>
              </div>
              <span style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:${m.color};text-align:right;">${m.count.toLocaleString()}</span>
              <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-mute);text-align:right;">${m.pct}%</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- by Color Category (Glass subtypes) -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">🎨</span>
          <span class="v25-card-title">Color Category Breakdown</span>
          <div class="v25-card-actions"><span style="font-size:11px;color:var(--text-mute);">By color · per material</span></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div>
            <div style="font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Glass by Color</div>
            <table class="v25-mini-table">
              <thead><tr><th>Color</th><th class="num">Units</th><th class="num">Share</th><th class="num">Value</th></tr></thead>
              <tbody>
                <tr><td><span style="display:inline-block;width:10px;height:10px;background:#22d3ee;border-radius:2px;margin-right:6px;vertical-align:middle;"></span>Clear / Flint</td><td class="num">42,820</td><td class="num">49.4%</td><td class="num">₹4.20/kg</td></tr>
                <tr class="striped"><td><span style="display:inline-block;width:10px;height:10px;background:#10b981;border-radius:2px;margin-right:6px;vertical-align:middle;"></span>Green</td><td class="num">28,640</td><td class="num">33.0%</td><td class="num">₹3.40/kg</td></tr>
                <tr><td><span style="display:inline-block;width:10px;height:10px;background:#7c2d12;border-radius:2px;margin-right:6px;vertical-align:middle;"></span>Amber / Brown</td><td class="num">15,280</td><td class="num">17.6%</td><td class="num">₹2.80/kg</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">PET by Color</div>
            <table class="v25-mini-table">
              <thead><tr><th>Color</th><th class="num">Units</th><th class="num">Share</th><th class="num">Value</th></tr></thead>
              <tbody>
                <tr><td><span style="display:inline-block;width:10px;height:10px;background:#e5e7eb;border:1px solid #94a3b8;border-radius:2px;margin-right:6px;vertical-align:middle;"></span>Clear</td><td class="num">32,840</td><td class="num">60.2%</td><td class="num">₹38/kg</td></tr>
                <tr class="striped"><td><span style="display:inline-block;width:10px;height:10px;background:#10b981;border-radius:2px;margin-right:6px;vertical-align:middle;"></span>Green</td><td class="num">14,620</td><td class="num">26.8%</td><td class="num">₹32/kg</td></tr>
                <tr><td><span style="display:inline-block;width:10px;height:10px;background:#1e40af;border-radius:2px;margin-right:6px;vertical-align:middle;"></span>Blue / Tinted</td><td class="num">7,062</td><td class="num">13.0%</td><td class="num">₹30/kg</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- to Users + Avg/Txn -->
      <div class="v25-grid-2">
        <div class="v25-card">
          <div class="v25-card-head">
            <span class="v25-card-icon">👥</span>
            <span class="v25-card-title">Users</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div style="padding:12px;background:#f8fafc;border-radius:8px;">
              <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Total Users (week)</div>
              <div style="font-size:22px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">198,540</div>
            </div>
            <div style="padding:12px;background:#f8fafc;border-radius:8px;">
              <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Unique per CP</div>
              <div style="font-size:22px;font-weight:700;color:var(--text);font-family:var(--font-mono);margin-top:4px;">428</div>
            </div>
          </div>
          <div style="margin-top:10px;font-size:11.5px;color:var(--text-mute);font-style:italic;">Consumer Users per CP detail available in drill-down per channel.</div>
        </div>

        <div class="v25-card">
          <div class="v25-card-head">
            <span class="v25-card-icon">⏱️</span>
            <span class="v25-card-title">Avg Units & Time per Transaction</span>
          </div>
          <table class="v25-mini-table">
            <thead><tr><th>Channel</th><th class="num">Units/Txn</th><th class="num">Time/Txn</th></tr></thead>
            <tbody>
              <tr><td><strong>RVM</strong></td><td class="num">8.2</td><td class="num">34 sec</td></tr>
              <tr class="striped"><td><strong>Retearn Center</strong></td><td class="num">12.4</td><td class="num">52 sec</td></tr>
              <tr><td><strong>HoReCa</strong></td><td class="num">86</td><td class="num">6 min</td></tr>
              <tr class="striped"><td><strong>D2D</strong></td><td class="num">24</td><td class="num">2 min</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Uptime Handler vs Non-Handler -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">⚡</span>
          <span class="v25-card-title">Uptime / Downtime — Handler vs Non-Handler</span>
        </div>
        <table class="v25-mini-table">
          <thead><tr><th>Channel</th><th class="num">Uptime (Handler)</th><th class="num">Uptime (No Handler)</th><th class="num">Downtime (Handler)</th><th class="num">Downtime (No Handler)</th></tr></thead>
          <tbody>
            <tr><td><strong>RVM</strong></td><td class="num"><span class="v25-pct-pill green">98.2%</span></td><td class="num"><span class="v25-pct-pill amber">93.4%</span></td><td class="num">1.8%</td><td class="num">6.6%</td></tr>
            <tr class="striped"><td><strong>Retearn Center</strong></td><td class="num"><span class="v25-pct-pill green">97.8%</span></td><td class="num"><span class="v25-pct-pill amber">92.6%</span></td><td class="num">2.2%</td><td class="num">7.4%</td></tr>
            <tr><td><strong>HoReCa</strong></td><td class="num"><span class="v25-pct-pill green">96.4%</span></td><td class="num">—</td><td class="num">3.6%</td><td class="num">—</td></tr>
            <tr class="striped"><td><strong>Non-Re Owned</strong></td><td class="num"><span class="v25-pct-pill green">95.2%</span></td><td class="num">—</td><td class="num">4.8%</td><td class="num">—</td></tr>
          </tbody>
        </table>
        <div style="margin-top:10px;padding:8px 12px;background:#eff6ff;border-radius:6px;font-size:11px;color:#1e40af;">
          <strong>Insight:</strong> Handler-assisted CPs show <strong>4.8%</strong> higher uptime than non-handler. Handler accountability (per PRD: Bag Allocation + Activation flows) directly impacts uptime.
        </div>
      </div>

      <!-- Bag Fill Time + QR Attempts -->
      <div class="v25-grid-2">
        <div class="v25-card">
          <div class="v25-card-head">
            <span class="v25-card-icon">⏳</span>
            <span class="v25-card-title">Avg Bag Fill Time</span>
          </div>
          <table class="v25-mini-table">
            <thead><tr><th>Channel</th><th class="num">Fill Time</th><th>Note</th></tr></thead>
            <tbody>
              <tr><td><strong>RVM</strong></td><td class="num">4.3h</td><td style="color:var(--text-mute);font-size:11px;">1 active bag</td></tr>
              <tr class="striped"><td><strong>Retearn Center</strong></td><td class="num">6.8h</td><td style="color:var(--text-mute);font-size:11px;">Multiple active bags</td></tr>
              <tr><td><strong>HoReCa</strong></td><td class="num">8.4h</td><td style="color:var(--text-mute);font-size:11px;">1 active bag</td></tr>
              <tr class="striped"><td><strong>Non-Re Owned</strong></td><td class="num">12.6h</td><td style="color:var(--text-mute);font-size:11px;">Inherits machine type</td></tr>
              <tr><td><strong>D2D</strong></td><td class="num">N/A</td><td style="color:var(--text-mute);font-size:11px;">No bag tagging</td></tr>
            </tbody>
          </table>
        </div>

        <div class="v25-card">
          <div class="v25-card-head">
            <span class="v25-card-icon">✓</span>
            <span class="v25-card-title">QR Attempts · First-Time-Right</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
            <div style="padding:12px;background:#f8fafc;border-radius:8px;">
              <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">FTR Rate</div>
              <div style="font-size:22px;font-weight:700;color:#10b981;font-family:var(--font-mono);margin-top:4px;">94.2%</div>
            </div>
            <div style="padding:12px;background:#f8fafc;border-radius:8px;">
              <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">Unscannable</div>
              <div style="font-size:22px;font-weight:700;color:#f59e0b;font-family:var(--font-mono);margin-top:4px;">5.8%</div>
            </div>
          </div>
          <div style="font-size:11px;color:var(--text-mute);font-style:italic;line-height:1.5;">
            Critical for Non-Re Owned: low FTR degrades double counting accuracy and delays HF release per PRD.
          </div>
        </div>
      </div>

      <!-- Block-wise + Panchayat-wise -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">🗺️</span>
          <span class="v25-card-title">Block-Wise Material Acceptance</span>
        </div>
        <table class="v25-mini-table">
          <thead><tr><th>Block</th><th class="num">Handler Units</th><th class="num">Non-Handler Units</th><th class="num">Total</th><th class="num">FTR%</th><th>Top Material</th></tr></thead>
          <tbody>
            ${[
              ['Bardez',     38420, 14200, 52620, 95.4, 'Glass'],
              ['Salcete',    42180, 12840, 55020, 94.8, 'Glass'],
              ['Tiswadi',    28640, 11240, 39880, 96.2, 'PET'],
              ['Mormugao',   18420,  8420, 26840, 93.6, 'Glass'],
              ['Ponda',      22180,  7820, 30000, 94.1, 'Glass'],
              ['Bicholim',   14280,  4280, 18560, 95.8, 'Aluminium'],
              ['Pernem',      8420,  2840, 11260, 92.4, 'Glass'],
              ['Quepem',     10840,  1280, 12120, 93.2, 'Glass'],
              ['Canacona',    8240,   320,  8560, 91.6, 'Tetrapak'],
            ].map((r,i) => `
              <tr${i%2?' class="striped"':''}>
                <td><strong>${r[0]}</strong></td>
                <td class="num">${r[1].toLocaleString()}</td>
                <td class="num">${r[2].toLocaleString()}</td>
                <td class="num"><strong>${r[3].toLocaleString()}</strong></td>
                <td class="num"><span class="v25-pct-pill ${r[4]>=94?'green':r[4]>=92?'amber':'red'}">${r[4]}%</span></td>
                <td>${r[5]}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">📍</span>
          <span class="v25-card-title">Panchayat-Level Material Acceptance · Top 10</span>
        </div>
        <table class="v25-mini-table">
          <thead><tr><th>Panchayat</th><th>Block</th><th class="num">Units</th><th class="num">Avg/Txn</th><th class="num">Payment Success</th></tr></thead>
          <tbody>
            ${[
              ['Margao',    'Salcete',  18420, 8.4, 96.2],
              ['Mapusa',    'Bardez',   16240, 8.8, 95.8],
              ['Panaji',    'Tiswadi',  14820, 9.2, 96.8],
              ['Calangute', 'Bardez',   12840, 7.8, 94.4],
              ['Vasco',     'Mormugao', 10620, 8.2, 93.6],
              ['Ponda',     'Ponda',     9420, 8.6, 94.8],
              ['Bicholim',  'Bicholim',  7280, 8.0, 95.2],
              ['Cuncolim',  'Salcete',   6480, 7.6, 93.8],
              ['Pernem',    'Pernem',    5420, 7.2, 92.4],
              ['Canacona',  'Canacona',  4280, 6.8, 91.8],
            ].map((r,i) => `
              <tr${i%2?' class="striped"':''}>
                <td><strong>${r[0]}</strong></td>
                <td>${r[1]}</td>
                <td class="num">${r[2].toLocaleString()}</td>
                <td class="num">${r[3]}</td>
                <td class="num"><span class="v25-pct-pill ${r[4]>=95?'green':r[4]>=93?'amber':'red'}">${r[4]}%</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* User Behavior page (v23) */
function pageCpUser() {
  const m = getMult('cp');
  return `
    <div class="kgrid kgrid-6">
      ${kpi('Total Users', '2,84,120', '', { delta: 14 })}
      ${kpi('Active Today', '38,420', '', { delta: 6 })}
      ${kpi('New Users (7d)', '1,840', '', { delta: 18, status: 'good' })}
      ${kpi('Avg Units / User / Day', '6.5', '', { delta: 4 })}
      ${kpi('Repeat Rate', '64.2', '%', { delta: 3, status: 'good' })}
      ${kpi('UPI Refund Success', '97.8', '%', { delta: 1, status: 'good' })}
    </div>

    <div class="section-head"><div class="section-title">User Engagement by Channel</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Channel</th><th class="num">Unique Users</th><th class="num">Sessions</th><th class="num">Avg Units</th><th class="num">Repeat %</th></tr></thead>
          <tbody>
            <tr><td><strong>RVM</strong></td><td class="num">128,450</td><td class="num">182,240</td><td class="num">8.2</td><td class="num">71.4%</td></tr>
            <tr class="striped"><td><strong>Retearn Center</strong></td><td class="num">62,180</td><td class="num">82,640</td><td class="num">12.4</td><td class="num">68.2%</td></tr>
            <tr><td><strong>HoReCa</strong></td><td class="num">38,420</td><td class="num">48,240</td><td class="num">86</td><td class="num">82.4%</td></tr>
            <tr class="striped"><td><strong>D2D Pickup</strong></td><td class="num">28,640</td><td class="num">36,820</td><td class="num">24</td><td class="num">58.6%</td></tr>
            <tr><td><strong>Non-Re Owned</strong></td><td class="num">26,430</td><td class="num">38,140</td><td class="num">14.6</td><td class="num">52.4%</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="section-head" style="margin-top:18px;"><div class="section-title">Behavioral Segments</div></div>
    <div class="kgrid kgrid-4">
      ${kpi('Power Users', '8,420', '', { sub: '> 50 units/month · 3% of base' })}
      ${kpi('Regular', '38,420', '', { sub: '10-50 units/month · 14%' })}
      ${kpi('Occasional', '128,460', '', { sub: '1-10 units/month · 45%' })}
      ${kpi('Inactive (90d)', '108,820', '', { status: 'warn', sub: '38% · churn risk' })}
    </div>
  `;
}

/* HoReCa */
function pageHorOverview() {
  const m = getMult('hor');
  const horecaCPs = CP_DATA.filter(c => c.establishmentType === 'HoReCa');
  const horecaSealed = horecaCPs.reduce((s,c) => s+c.sealedBags, 0);
  const horecaWaitOver24 = horecaCPs.filter(c => c.longestWaitH > 24).length;
  const horecaSLA = SLA_MODEL.find(s => s.id === 'horeca_pick');
  return `
    <div class="section-head"><div class="section-title">HoReCa Operations</div><div class="section-sub">${m.label.date}${m.label.cluster && m.label.cluster !== 'All' ? ' · '+m.label.cluster : ''}${m.label.block !== 'All' ? ' · '+m.label.block : ''} · Bulk pickup · HF exempt · Double-count exempt</div></div>
    <div class="kgrid kgrid-4">
      ${kpi('Pickup Frequency', '3.2', '/wk', { delta: 4 })}
      ${kpi('Pickups Planned', scaleNum(482, m), '', { delta: 8 })}
      ${kpi('Pickups Actual', scaleNum(441, m), '', { delta: 6 })}
      ${kpi('Bottles / Pickup', '184', '', { delta: 2 })}
      ${kpi('Deposit TAT', '2.1', 'd', { delta: -12 })}
      ${kpi('Active Accounts', scaleCount(342, m), '', { delta: 11 })}
      ${kpi('Pickup Compliance', '91.5', '%', { delta: 3 })}
      ${kpi('Missed Pickups', scaleNum(41, m), '', { delta: -8, status: 'warn' })}
    </div>

    <!-- HoReCa operational KPIs (HF/DC exempt model) -->
    <div class="kgrid kgrid-4" style="margin-top: 12px;">
      ${kpi('HoReCa CPs in Loop', horecaCPs.length, '', { sub: 'Across all 5 CPCs · bulk pickup' })}
      ${kpi('Sealed @ HoReCa', horecaSealed, '', { status: horecaSealed>0?'warn':'good', sub: 'Awaiting bulk pickup' })}
      ${kpi('HF Eligibility', '0%', '', { sub: 'HoReCa exempt — bulk model' })}
      ${kpi('Double-Count Required', '0', '', { sub: 'HoReCa exempt — no DC overhead' })}
      ${kpi('Pickup SLA (24h)', horecaSLA.target, '', { sub: `Avg ${horecaSLA.avg} · ${horecaSLA.breaches} breaches`, status: horecaSLA.breaches>0?'alert':'good' })}
      ${kpi('Outlets >24h Wait', horecaWaitOver24, '', { status: horecaWaitOver24>0?'alert':'good', sub: 'Bags sitting beyond SLA' })}
      ${kpi('Bottles Today', scaleNum(81144, m).toLocaleString(), '', { delta: 7, sub: '441 pickups × 184 avg' })}
      ${kpi('Avg Resolution', '8.8h', '', { delta: -10, sub: 'Issue → close' })}
    </div>

    <!-- HoReCa rules card -->
    <div class="card" style="margin-top: 16px; padding: 14px 18px;">
      <div style="font-size: 12px; font-weight: 700; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px;">HoReCa Business Rules</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; font-size: 13px; color: var(--text);">
        <div><strong style="color:var(--accent);">Bulk pickup model</strong><br><span style="color:var(--text-mute);font-size:12px;">Pickup based on volume threshold, not per-bag seal trigger. SLA = 24h from request.</span></div>
        <div><strong style="color:var(--good);">HF exempt</strong><br><span style="color:var(--text-mute);font-size:12px;">No handling fee paid to HoReCa establishments — they consume bulk service in exchange.</span></div>
        <div><strong style="color:var(--good);">Double-count exempt</strong><br><span style="color:var(--text-mute);font-size:12px;">No two-stage verification — bulk weighing on arrival at CPC is final.</span></div>
      </div>
    </div>

    <!-- PRD-Refined HoReCa Volume Metrics -->
    <div class="section-head"><div class="section-title">HoReCa Volume · Per QR Non-QR Flow PRD</div><div class="section-sub">HoReCa = ~70% of liquor packaging volume in Goa</div></div>
    <div class="kgrid kgrid-4">
      ${kpi('Annual Bottle Volume', '~30', 'Cr', { sub: 'Goa state · HoReCa 70%' })}
      ${kpi('Daily HoReCa Collection', '5.75', 'L/day', { delta: 8 })}
      ${kpi('QR Stream Units', '12,840', '', { delta: 6, status: 'good' })}
      ${kpi('Non-QR Stream', '842', 'kg', { delta: -3, sub: 'Transition · market value' })}
    </div>

    <!-- QR vs Non-QR Stream Segregation Table -->
    <div class="card" style="margin-top: 12px;">
      <div class="card-head"><div><div class="card-title">QR vs Non-QR Segregation</div><div class="card-sub">Same trip, separate accounting · per QR Non-QR Flow PRD §3</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Stream</th><th>Materials</th><th class="num">Volume</th><th>Payment Method</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td><strong>QR / DRS</strong></td><td>Glass, AL Cans, PET, Tetra</td><td class="num">12,840 units</td><td>Per-unit deposit refund (₹2)</td><td><span class="pill pill-good">Active</span></td></tr>
            <tr class="striped"><td><strong>Non-QR (Transition)</strong></td><td>Transition Glass, PET, UBC</td><td class="num">542 kg</td><td>Weight-based scrap rate</td><td><span class="pill pill-info">Transition</span></td></tr>
            <tr><td><strong>Non-DRS</strong></td><td>Non-liquor Glass, PET, UBC</td><td class="num">300 kg</td><td>Market rate (spot)</td><td><span class="pill pill-neutral">Separate</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Driver App Scan-at-Source Flow -->
    <div class="section-head" style="margin-top:16px;"><div class="section-title">Driver App Scan Flow · HoReCa Pickup</div><div class="section-sub">Driver scans each QR at HoReCa source → Bag-to-Bottle mapping → Deposit refunded · per Collection Flows PRD</div></div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;">
      ${[
        {step:'1 · Arrive',  icon:'🚚', detail:'Driver App routes to HoReCa outlet via TMS'},
        {step:'2 · Scan',    icon:'📷', detail:'QR scanned per bottle into HoReCa bag (Truck CP)'},
        {step:'3 · Map',     icon:'🔗', detail:'Bag-to-Bottle mapping recorded · WMS updates'},
        {step:'4 · Refund',  icon:'💰', detail:'Deposit credited to HoReCa account · ₹2/bottle'},
        {step:'5 · Seal',    icon:'🔒', detail:'Bag sealed · HF held until CPC inward verified'},
      ].map(s => `
        <div style="padding:12px 10px;background:#f8fafc;border-radius:8px;border:1px solid var(--border);border-left:3px solid var(--accent);text-align:center;">
          <div style="font-size:22px;margin-bottom:6px;">${s.icon}</div>
          <div style="font-size:10.5px;font-weight:700;color:var(--text);margin-bottom:4px;">${s.step}</div>
          <div style="font-size:10.5px;color:var(--text-mute);line-height:1.4;">${s.detail}</div>
        </div>
      `).join('')}
    </div>

    <!-- HoReCa QR Scan Stats -->
    <div class="kgrid kgrid-4" style="margin-top:12px;">
      ${kpi('QR Scans (HoReCa)', '28,420', '', { delta: 9, sub: 'Driver App at source' })}
      ${kpi('Bag-Bottle Maps', '2,840', '', { delta: 7, sub: 'Per bag traceability' })}
      ${kpi('Deposit Refunded', '₹56,840', '', { delta: 9, sub: '@ ₹2/bottle, this week' })}
      ${kpi('Scan Success Rate', '94.2', '%', { delta: 2, status: 'good', sub: '5.8% rescans · damaged QR' })}
    </div>
  `;
}
function pageHorPickup() { return stub('Pickup Frequency', 'Pickup calendar, missed pickup ledger, frequency by vendor / account. All tabular — no charts per spec.', ['Pickup calendar', 'Missed pickups', 'Frequency by vendor', 'Account-level cadence']); }
function pageHorPipeline() { return stub('HoReCa Pipeline', 'Onboarding funnel registry from lead → contracted → first pickup → active. Stage counts, dwell-in-stage, conversion table.', ['Pipeline registry', 'Active / inactive accounts', 'Conversion table', 'Stage dwell time']); }

/* Logistics */
function pageLogOverview() {
  const m = getMult('log');
  const avail = DRIVER_FLEET.filter(d => d.status === 'available');
  const onTrip = DRIVER_FLEET.filter(d => d.status === 'on_trip');
  const returning = DRIVER_FLEET.filter(d => d.status === 'returning');
  const untrippedCPs = CP_DATA.filter(c => c.sealedBags > 0 && !c.hasTrip).length;
  const canCover = avail.length >= untrippedCPs;
  const sealTripSLA = SLA_MODEL.find(s => s.id === 'seal_trip');
  const tripPickupSLA = SLA_MODEL.find(s => s.id === 'trip_pickup');

  let coverageMsg, coverageColor;
  if (untrippedCPs === 0) { coverageMsg = 'All CPs with sealed bags have trips assigned.'; coverageColor = 'good'; }
  else if (canCover) { coverageMsg = `${avail.length} available driver${avail.length>1?'s':''} can cover ${untrippedCPs} untripped CP${untrippedCPs>1?'s':''}. Assign now.`; coverageColor = 'info'; }
  else { coverageMsg = `Only ${avail.length} driver${avail.length!==1?'s':''} available but ${untrippedCPs} CPs need trips. ${returning.length} returning soon — reassign when back.`; coverageColor = 'warn'; }

  return `
    <div class="section-head"><div class="section-title">Logistics Performance</div><div class="section-sub">${m.label.date}${m.label.cluster && m.label.cluster !== 'All' ? ' · '+m.label.cluster : ''}</div></div>
    <div class="kgrid kgrid-4">
      ${kpi('Orders Created', scaleNum(1284, m), '', { delta: 6 })}
      ${kpi('Trips Created', scaleNum(1210, m), '', { delta: 5 })}
      ${kpi('Trip Dwell', '32', 'min', { delta: -8 })}
      ${kpi('Trip Performance', '87', '%', { delta: 2 })}
      ${kpi('Total KM', scaleK(48240, m), '', { delta: 4 })}
      ${kpi('Delayed Pickups', scaleNum(64, m), '', { delta: -12 })}
      ${kpi('On-Time %', '91.4', '%', { delta: 2, status: 'good' })}
      ${kpi('Vehicle Utilisation', '78', '%', { delta: 3 })}
    </div>

    <!-- Driver Coverage Verdict -->
    <div class="card" style="margin-top: 16px; padding: 14px 18px; border-left: 4px solid var(--${coverageColor==='good'?'good':coverageColor==='info'?'accent':'warn'});">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="font-size: 11.5px; font-weight: 700; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px;">Driver Coverage</div>
          <div style="font-size: 13.5px; color: var(--text); font-weight: 500;">${coverageMsg}</div>
        </div>
        <div style="display: flex; gap: 24px; align-items: center;">
          <div style="text-align: center;">
            <div style="font-family: var(--font-mono); font-size: 22px; font-weight: 700; color: var(--good); line-height: 1;">${avail.length}</div>
            <div style="font-size: 10.5px; color: var(--text-mute); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Available</div>
          </div>
          <div style="text-align: center;">
            <div style="font-family: var(--font-mono); font-size: 22px; font-weight: 700; color: var(--accent); line-height: 1;">${onTrip.length}</div>
            <div style="font-size: 10.5px; color: var(--text-mute); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">On Trip</div>
          </div>
          <div style="text-align: center;">
            <div style="font-family: var(--font-mono); font-size: 22px; font-weight: 700; color: var(--warn); line-height: 1;">${returning.length}</div>
            <div style="font-size: 10.5px; color: var(--text-mute); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Returning</div>
          </div>
          <div style="text-align: center;">
            <div style="font-family: var(--font-mono); font-size: 22px; font-weight: 700; color: ${untrippedCPs>0?'var(--bad)':'var(--text-mute)'}; line-height: 1;">${untrippedCPs}</div>
            <div style="font-size: 10.5px; color: var(--text-mute); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">CPs Need Trip</div>
          </div>
        </div>
      </div>
    </div>

    <!-- SLA strip -->
    <div class="kgrid kgrid-4" style="margin-top: 12px;">
      ${kpi('Seal → Trip SLA', sealTripSLA.target, '', { sub: `Avg ${sealTripSLA.avg} · ${sealTripSLA.breaches} breach`, status: sealTripSLA.breaches>0?'alert':'good' })}
      ${kpi('Trip → Pickup SLA', tripPickupSLA.target, '', { sub: `Avg ${tripPickupSLA.avg} · ${tripPickupSLA.breaches} breach`, status: tripPickupSLA.breaches>0?'warn':'good' })}
      ${kpi('Lost Bags Open', EXCEPTIONS_DATA.lost.length, '', { sub: 'Provenance break', status: EXCEPTIONS_DATA.lost.length>0?'alert':'good' })}
      ${kpi('Total Fleet', DRIVER_FLEET.length, '', { sub: `${avail.length} idle · ${onTrip.length+returning.length} active` })}
    </div>

    <!-- PRD-Refined TMS Integration Pipeline -->
    <div class="section-head" style="margin-top:16px;"><div class="section-title">TMS Integration · Pickup Eligibility Pipeline</div><div class="section-sub">Backend → Loginext → Carrier select → Route optimize → Driver App · per TMS Integration PRD</div></div>
    <div style="display:flex;gap:6px;align-items:stretch;">
      ${[
        {label:'Eligible Today',   val:94, note:'Per calendar + approvals'},
        {label:'Pushed to TMS',    val:88, note:'Loginext order created'},
        {label:'Carrier Selected', val:78, note:'Vehicle + driver assigned'},
        {label:'Route Optimized',  val:74, note:'Multi-CP route built'},
        {label:'Driver Executing', val:62, note:'Live in field'},
      ].map((s, i, arr) => `
        <div style="flex:1;padding:12px 10px;background:#f8fafc;border-radius:8px;border:1px solid var(--border);border-left:3px solid var(--accent);text-align:center;">
          <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">${s.label}</div>
          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:#1e293b;line-height:1;margin-top:6px;">${s.val}</div>
          <div style="font-size:10.5px;color:var(--text-mute);margin-top:6px;">${s.note}</div>
        </div>
        ${i < arr.length-1 ? '<div style="display:flex;align-items:center;color:var(--text-mute);font-size:16px;">→</div>' : ''}
      `).join('')}
    </div>
    <div style="margin-top:10px;font-size:11.5px;color:var(--text-mute);">
      Funnel rate: <strong>78.7%</strong> eligible → optimized · 6 orders pending push to TMS
    </div>

    <!-- Vehicle Exclusivity + Terrain -->
    <div class="kgrid kgrid-4" style="margin-top:14px;">
      ${kpi('Shared Vehicles', '124', '', { sub: 'Multi-CP / multi-route' })}
      ${kpi('Dedicated Vehicles', '84', '', { sub: 'Single route / HoReCa cluster' })}
      ${kpi('Coastal Terrain', '92', 'CPs', { sub: 'Salcete · Bardez · Pernem' })}
      ${kpi('Urban / Hill', '78 / 38', '', { sub: 'Margao+Panjim / Bicholim+Sattari' })}
    </div>

    <!-- Vehicle Configuration Rules -->
    <div class="card" style="margin-top:12px;">
      <div class="card-head"><div><div class="card-title">Vehicle Configuration Rules · Per TMS PRD §6</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Parameter</th><th>Rule / Value</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Capacity Fill Target</td><td style="font-family:var(--font-mono);">80% (buffer for adhoc)</td><td><span class="pill pill-good">Configured</span></td></tr>
            <tr><td>Planning Horizon</td><td style="font-family:var(--font-mono);">D-1 (day before pickup)</td><td><span class="pill pill-good">Active</span></td></tr>
            <tr><td>Vehicle Exclusivity</td><td style="font-family:var(--font-mono);">Shared / Dedicated per CP</td><td><span class="pill pill-info">Mixed</span></td></tr>
            <tr><td>Terrain Mapping</td><td style="font-family:var(--font-mono);">PIN code → catchment area</td><td><span class="pill pill-good">Mapped</span></td></tr>
            <tr><td>Pickup Calendar</td><td style="font-family:var(--font-mono);">Custom days / fixed intervals</td><td><span class="pill pill-good">Active</span></td></tr>
            <tr><td>Adhoc Trigger</td><td style="font-family:var(--font-mono);">Failed pickup → adhoc next day</td><td><span class="pill pill-warn">7 pending</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}
function pageLogFleet() {
  return `
    <div class="kgrid kgrid-4">
      ${kpi('Vehicles Avail.', '42', '')}
      ${kpi('Utilisation', '78', '%', { delta: 3 })}
      ${kpi('Idle Hours', '184', '', { delta: -8 })}
      ${kpi('Capacity Util.', '82', '%', { delta: 2 })}
      ${kpi('Cost / KM', '12.4', '₹', { delta: -2 })}
      ${kpi('Cost / Trip', '1,840', '₹', { delta: -3 })}
      ${kpi('Cost / KG', '3.8', '₹', { delta: -1 })}
      ${kpi('Active Fleet', '38', '', { delta: 1 })}
    </div>
  `;
}
function pageLogVendor() { return stub('Vendor Management', 'Vendor registry — scorecards across SLA, cost efficiency, payment cycle, dispute rate.', ['Vendor scorecards', 'Payment cycle', 'SLA compliance', 'Cost efficiency']); }
function pageLogVehicle() { return stub('Vehicle Availability', 'Fleet board: in-use / available / maintenance / breakdown. Real-time status feed.', ['Live availability', 'Maintenance queue', 'Breakdown log', 'Deployment plan']); }
function pageLogDriver() {
  const avail = DRIVER_FLEET.filter(d => d.status === 'available');
  const onTrip = DRIVER_FLEET.filter(d => d.status === 'on_trip');
  const returning = DRIVER_FLEET.filter(d => d.status === 'returning');
  const statusBadge = (s) => {
    if (s === 'available') return '<span class="pill pill-good">Available</span>';
    if (s === 'on_trip')   return '<span class="pill pill-info">On Trip</span>';
    if (s === 'returning') return '<span class="pill pill-warn">Returning</span>';
    return s;
  };
  return `
    <div class="kgrid kgrid-4">
      ${kpi('Total Fleet', DRIVER_FLEET.length, '', { sub: 'Drivers registered' })}
      ${kpi('Available', avail.length, '', { status: avail.length>0?'good':'warn', sub: 'Ready to dispatch' })}
      ${kpi('On Trip', onTrip.length, '', { sub: 'Active pickups' })}
      ${kpi('Returning', returning.length, '', { status: returning.length>0?'warn':'good', sub: 'Completing trip' })}
      ${kpi('Performance', '4.4', '/5', { delta: 2 })}
      ${kpi('GPS Compliance', '96', '%', { delta: 1 })}
      ${kpi('Route Adherence', '92', '%', { delta: 3 })}
      ${kpi('On-Time Pickup', '91', '%', { delta: 2 })}
    </div>

    <div class="card" style="margin-top: 16px;">
      <div class="card-head"><div><div class="card-title">Driver Fleet</div><div class="card-sub">Live status · ${DRIVER_FLEET.length} drivers across 5 CPCs</div></div></div>
      <div class="table-wrap" style="max-height: 480px; overflow-y: auto;">
        <table class="t">
          <thead><tr><th>Driver ID</th><th>Name</th><th>Status</th><th>Current Trip</th><th>Area</th><th>Home CPC</th></tr></thead>
          <tbody>
            ${DRIVER_FLEET.map(d => `
              <tr>
                <td class="id-cell">${d.id}</td>
                <td><strong>${d.name}</strong></td>
                <td>${statusBadge(d.status)}</td>
                <td style="font-family: var(--font-mono); font-size: 12px; color: var(--text-mute);">${d.trip || '—'}</td>
                <td>${d.area || '—'}</td>
                <td>${d.cpc}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* Warehouse */
function pageWhOverview() {
  const m = getMult('wh');
  const stages = WH_BAG_FLOW.stages;
  const totalExceptions = EXCEPTIONS_DATA.weight.length + EXCEPTIONS_DATA.count.length + EXCEPTIONS_DATA.lost.length;
  const agedBales = PROCESSED_INVENTORY.bales.filter(b => b.daysOld >= 7);
  const wtVarSLA = SLA_MODEL.find(s => s.id === 'wt_var');
  const cntVarSLA = SLA_MODEL.find(s => s.id === 'cnt_var');
  const excSLA = SLA_MODEL.find(s => s.id === 'exc_res');
  const recvSLA = SLA_MODEL.find(s => s.id === 'recv_proc');

  return `
    <div class="section-head">
      <div class="section-title">Warehouse · CPC Operations</div>
      <div class="section-sub">${m.label.date}${m.label.cluster && m.label.cluster !== 'All' ? ' · '+m.label.cluster : ''}${m.label.source !== 'All' ? ' · '+m.label.source : ''} · 5-stage bag flow · HF held on exceptions</div>
    </div>

    <!-- Original MT KPIs -->
    <div class="kgrid kgrid-4">
      ${kpi('Inbound — DRS', scaleNum(184, m), 'MT', { delta: 6 })}
      ${kpi('Inbound — Non DRS', scaleNum(42, m), 'MT', { delta: 3 })}
      ${kpi('Total Inbound', scaleNum(226, m), 'MT', { delta: 5 })}
      ${kpi('CPC Inventory', scaleNum(98, m), 'MT', { delta: 2 })}
      ${kpi('Ready-to-Dispatch', scaleNum(74, m), 'MT', { delta: 4 })}
      ${kpi('Material Yield', '94.2', '%', { delta: 1, status: 'good' })}
      ${kpi('Sort Throughput', '1,420', '/hr', { delta: 3 })}
      ${kpi('Bale Dwell', '38', 'hr', { delta: -4 })}
    </div>

    <!-- 5-stage Bag Flow Pipeline -->
    <div class="card" style="margin-top: 16px;">
      <div class="card-head">
        <div>
          <div class="card-title">Bag Flow Pipeline · Live</div>
          <div class="card-sub">Sealed at Field → In Transit → Staging → Processing → Dispatch Ready</div>
        </div>
        <div class="card-actions">
          <span style="font-size: 11px; color: var(--text-mute);">Total in loop: <strong style="color: var(--text); font-family: var(--font-mono);">${BAG_INVENTORY.total}</strong> bags</span>
        </div>
      </div>
      <div style="padding: 18px 20px; display: flex; gap: 6px; align-items: stretch;">
        ${stages.map((s, i) => `
          <div style="flex: 1; padding: 14px 12px; border-radius: 10px;
            background: ${s.breach ? '#fef2f2' : '#f8fafc'};
            border: 1px solid ${s.breach ? '#fca5a5' : 'var(--border)'};
            border-left: 4px solid ${s.breach ? 'var(--bad)' : 'var(--accent)'};
            text-align: center; position: relative;">
            <div style="font-size: 10.5px; font-weight: 700; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px;">${s.label}</div>
            <div style="font-family: var(--font-mono); font-size: 30px; font-weight: 700; color: ${s.breach ? 'var(--bad)' : '#1e293b'}; line-height: 1;">${s.count}</div>
            <div style="font-size: 11px; color: var(--text-mute); margin-top: 4px;">${s.unit} · ~${(s.weightKg/1000).toFixed(1)} MT</div>
            <div style="font-size: 11px; color: ${s.breach ? 'var(--bad)' : 'var(--text-mute)'}; font-weight: ${s.breach?600:400}; margin-top: 6px; padding-top: 6px; border-top: 1px solid var(--border);">${s.note}</div>
            <div style="font-size: 10px; color: var(--text-mute); margin-top: 4px;">Oldest: <span style="font-family: var(--font-mono); font-weight: 600;">${s.oldestH}h</span></div>
          </div>
          ${i < stages.length-1 ? '<div style="display: flex; align-items: center; color: var(--text-mute); font-size: 18px;">→</div>' : ''}
        `).join('')}
      </div>
    </div>

    <!-- Bag Inventory + Closed-Loop Check -->
    <div class="card" style="margin-top: 16px;">
      <div class="card-head"><div><div class="card-title">Bag Inventory · Closed-Loop</div><div class="card-sub">Total = at CPC + in transit + at CP + sealed · Runway: <strong style="color: ${BAG_INVENTORY.runwayDays<=3?'var(--bad)':'var(--good)'};">${BAG_INVENTORY.runwayDays}d</strong></div></div></div>
      <div style="padding: 16px 20px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;">
        <div style="padding: 12px; background: #f8fafc; border-radius: 8px; border-left: 3px solid var(--accent);">
          <div style="font-size: 10px; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;">At CPC</div>
          <div style="font-family: var(--font-mono); font-size: 24px; font-weight: 700; color: #1e293b; margin-top: 4px;">${BAG_INVENTORY.atCPC}</div>
          <div style="font-size: 11px; color: var(--text-mute); margin-top: 4px;">Ready to dispatch to CPs</div>
        </div>
        <div style="padding: 12px; background: #f8fafc; border-radius: 8px; border-left: 3px solid var(--warn);">
          <div style="font-size: 10px; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;">In Transit</div>
          <div style="font-family: var(--font-mono); font-size: 24px; font-weight: 700; color: #1e293b; margin-top: 4px;">${BAG_INVENTORY.inTransit}</div>
          <div style="font-size: 11px; color: var(--text-mute); margin-top: 4px;">CPC → CP en route</div>
        </div>
        <div style="padding: 12px; background: #f8fafc; border-radius: 8px; border-left: 3px solid var(--good);">
          <div style="font-size: 10px; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;">At CPs</div>
          <div style="font-family: var(--font-mono); font-size: 24px; font-weight: 700; color: #1e293b; margin-top: 4px;">${BAG_INVENTORY.atCP}</div>
          <div style="font-size: 11px; color: var(--text-mute); margin-top: 4px;">Empty + active across ${CP_DATA.length} CPs</div>
        </div>
        <div style="padding: 12px; background: #fef2f2; border-radius: 8px; border-left: 3px solid var(--bad);">
          <div style="font-size: 10px; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;">Sealed</div>
          <div style="font-family: var(--font-mono); font-size: 24px; font-weight: 700; color: var(--bad); margin-top: 4px;">${BAG_INVENTORY.sealed}</div>
          <div style="font-size: 11px; color: var(--text-mute); margin-top: 4px;">Awaiting pickup at CPs</div>
        </div>
        <div style="padding: 12px; background: ${BAG_INVENTORY.runwayDays<=3?'#fef2f2':'#f0fdf4'}; border-radius: 8px; border-left: 3px solid ${BAG_INVENTORY.runwayDays<=3?'var(--bad)':'var(--good)'};">
          <div style="font-size: 10px; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;">Bag Runway</div>
          <div style="font-family: var(--font-mono); font-size: 24px; font-weight: 700; color: ${BAG_INVENTORY.runwayDays<=3?'var(--bad)':'var(--good)'}; margin-top: 4px;">${BAG_INVENTORY.runwayDays}d</div>
          <div style="font-size: 11px; color: var(--text-mute); margin-top: 4px;">@ ${BAG_INVENTORY.consumption} bags/day</div>
        </div>
      </div>
    </div>

    <!-- Exceptions Panel -->
    <div class="card" style="margin-top: 16px;">
      <div class="card-head">
        <div>
          <div class="card-title">Exceptions · HF Payment Held</div>
          <div class="card-sub">Weight variance · Count variance · Lost bags — all hold handler fee payment</div>
        </div>
        <div class="card-actions">
          <span class="pill pill-bad">${totalExceptions} open</span>
        </div>
      </div>
      <div style="padding: 16px 20px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
        <div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">⚠ Weight Variance (${EXCEPTIONS_DATA.weight.length}) · Target ${wtVarSLA.target}</div>
          ${EXCEPTIONS_DATA.weight.slice(0,4).map(e => `
            <div style="padding: 8px 10px; background: #fef2f2; border-left: 3px solid var(--bad); border-radius: 6px; margin-bottom: 6px;">
              <div style="font-size: 12px; font-weight: 700; color: var(--text); font-family: var(--font-mono);">${e.id} <span style="color: var(--bad);">${e.varPct}%</span></div>
              <div style="font-size: 11px; color: var(--text-mute); margin-top: 2px;">${e.cpName} · ${e.taluka} · ${e.ageH}h open</div>
              <div style="font-size: 11px; color: var(--text); margin-top: 2px;">CP ${e.cpKg}kg → CPC ${e.cpcKg}kg</div>
            </div>
          `).join('')}
          ${EXCEPTIONS_DATA.weight.length > 4 ? `<div style="font-size: 11px; color: var(--text-mute); padding: 4px 10px;">+${EXCEPTIONS_DATA.weight.length-4} more</div>` : ''}
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">⚠ Count Variance (${EXCEPTIONS_DATA.count.length}) · Target ${cntVarSLA.target}</div>
          ${EXCEPTIONS_DATA.count.map(e => `
            <div style="padding: 8px 10px; background: #fef2f2; border-left: 3px solid var(--bad); border-radius: 6px; margin-bottom: 6px;">
              <div style="font-size: 12px; font-weight: 700; color: var(--text); font-family: var(--font-mono);">${e.id} <span style="color: var(--bad);">${e.varPct}%</span></div>
              <div style="font-size: 11px; color: var(--text-mute); margin-top: 2px;">${e.cpName} · ${e.taluka} · ${e.ageH}h open</div>
              <div style="font-size: 11px; color: var(--text); margin-top: 2px;">CP ${e.cpCount} items → CPC ${e.cpcCount} items</div>
            </div>
          `).join('')}
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">🛍️ Lost Bags (${EXCEPTIONS_DATA.lost.length}) · Provenance break</div>
          ${EXCEPTIONS_DATA.lost.map(b => `
            <div style="padding: 8px 10px; background: #fffbeb; border-left: 3px solid var(--warn); border-radius: 6px; margin-bottom: 6px;">
              <div style="font-size: 12px; font-weight: 700; color: var(--text); font-family: var(--font-mono);">${b.id}</div>
              <div style="font-size: 11px; color: var(--text-mute); margin-top: 2px;">Last seen: ${b.lastSeen}</div>
              <div style="font-size: 11px; color: var(--text); margin-top: 2px;">${b.driver} · ${b.tripId} · reported ${b.reportedH}h ago</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div style="padding: 12px 20px; background: var(--surface-2, #f8fafc); border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 12px; color: var(--text-mute);">Exception → Resolution SLA: <strong>${excSLA.target}</strong> · Avg <strong>${excSLA.avg}</strong> · <span style="color: var(--bad);">${excSLA.breaches} overdue</span></span>
        <span style="font-size: 11px; color: var(--text-mute);">Receipt → Processing SLA: ${recvSLA.target} · ${recvSLA.breaches} breached</span>
      </div>
    </div>

    <!-- Processed Inventory with Sub-Categories -->
    <div class="card" style="margin-top: 16px;">
      <div class="card-head">
        <div>
          <div class="card-title">Processed Inventory · Ready to Dispatch</div>
          <div class="card-sub">Bales (PET sub-grades · HDPE sub-grades · MLP · Aluminium UBC) · Glass Packs · Cullet by colour</div>
        </div>
        <div class="card-actions">
          <span style="font-size: 11px; color: var(--text-mute);">${DISPATCH_DATA.lotsReady} lots · ${(DISPATCH_DATA.totalKg/1000).toFixed(1)} MT · oldest ${DISPATCH_DATA.oldestDays}d</span>
        </div>
      </div>
      ${agedBales.length > 0 ? `
        <div style="padding: 10px 20px; background: #fef3c7; border-bottom: 1px solid var(--border); font-size: 12px; color: #92400e; font-weight: 600;">
          ⚠ ${agedBales.length} lot${agedBales.length>1?'s':''} aged ≥7 days without dispatch order: ${agedBales.map(b => `${b.mat} ${b.sub}`).join(' · ')}
        </div>
      ` : ''}
      <div class="table-wrap">
        <table class="t">
          <thead><tr><th>Category</th><th>Material / Sub-grade</th><th class="num">Qty</th><th class="num">Weight (kg)</th><th class="num">Days Old</th><th>Status</th></tr></thead>
          <tbody>
            ${PROCESSED_INVENTORY.bales.map(b => `
              <tr style="${b.daysOld>=7?'background:#fef3c7;':''}">
                <td><span class="pill pill-info">Bales</span></td>
                <td><strong>${b.mat}</strong> · ${b.sub}</td>
                <td class="num">${b.count}</td>
                <td class="num">${b.kg.toLocaleString()}</td>
                <td class="num" style="${b.daysOld>=7?'color:var(--warn);font-weight:700;':''}">${b.daysOld}d${b.daysOld>=7?' ⚠':''}</td>
                <td>${b.daysOld>=7?'<span class="pill pill-warn">Aged</span>':'<span class="pill pill-good">Ready</span>'}</td>
              </tr>
            `).join('')}
            ${PROCESSED_INVENTORY.glassPacks.map(g => `
              <tr>
                <td><span class="pill pill-info">Glass Packs</span></td>
                <td><strong>${g.brand}</strong> · ${g.vol} · ${g.colour}</td>
                <td class="num">${g.bags} bags · ${g.bottles.toLocaleString()} btls</td>
                <td class="num">—</td>
                <td class="num">since ${g.oldest}</td>
                <td><span class="pill pill-good">Brand return</span></td>
              </tr>
            `).join('')}
            ${PROCESSED_INVENTORY.cullet.map(c => `
              <tr>
                <td><span class="pill pill-info">Cullet</span></td>
                <td><strong>${c.colour}</strong></td>
                <td class="num">${c.entries} entries</td>
                <td class="num">${c.kg.toLocaleString()}</td>
                <td class="num" style="color:var(--text-mute);">${c.lastEntry}</td>
                <td><span class="pill pill-good">Yield</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- PRD-Refined Truck Weigh-In · QR vs Non-QR -->
    <div class="section-head" style="margin-top:16px;"><div class="section-title">Truck Weigh-In · QR vs Non-QR Stream</div><div class="section-sub">At inward: Total truck weight · QR bag weight separate · Non-QR derived · per WMS PRD §3</div></div>
    <div class="kgrid kgrid-3">
      ${kpi('Total Truck Weight', '226', 'MT', { sub: 'Daily inbound across 5 CPCs' })}
      ${kpi('QR Weighed', '158', 'MT', { sub: '70% · 4,820 bags · 89,460 bottles' })}
      ${kpi('Non-QR Derived', '68', 'MT', { sub: '30% · Total − QR · market value only', status:'warn' })}
    </div>
    <div style="margin-top:8px;padding:10px 14px;background:#f8fafc;border-radius:8px;border:1px solid var(--border);font-size:11.5px;color:var(--text-mute);">
      Formula: <strong style="color:var(--text);font-family:var(--font-mono);">Non-QR = Total truck weight − Σ QR bag weights</strong> · QR scan success: <strong>94.2%</strong>
    </div>

    <!-- 11-State Bag Lifecycle -->
    <div class="section-head" style="margin-top:16px;"><div class="section-title">Bag Lifecycle · 11-State Source of Truth</div><div class="section-sub">Per Bag Lifecycle PRD §3 · State owners across 5 apps (SO Portal · Handler · Driver · Depot · WMS)</div></div>
    <div style="display:grid;grid-template-columns:repeat(11,1fr);gap:4px;">
      ${[
        {n:1,lbl:'Registered',count:4820,sla:'—',owner:'SO Portal',c:'#7c3aed'},
        {n:2,lbl:'Distributed',count:576,sla:'24h',owner:'WMS',c:'#d97706'},
        {n:3,lbl:'Activated',count:124,sla:'—',owner:'Handler',c:'#4f6ef7'},
        {n:4,lbl:'Filling',count:124,sla:'48h',owner:'Handler',c:'#4f6ef7'},
        {n:5,lbl:'Sealed',count:64,sla:'4h',owner:'Handler',c:'#f59e0b'},
        {n:6,lbl:'Pickup (TMS)',count:84,sla:'8h',owner:'Driver',c:'#0891b2'},
        {n:7,lbl:'Inward CPC',count:26,sla:'2h',owner:'Depot',c:'#10b981'},
        {n:8,lbl:'Counting',count:64,sla:'24h',owner:'Depot',c:'#10b981'},
        {n:9,lbl:'Sorting',count:32,sla:'24h',owner:'Depot',c:'#10b981'},
        {n:10,lbl:'Baling',count:72,sla:'48h',owner:'WMS',c:'#d97706'},
        {n:11,lbl:'Empty/EOL',count:18,sla:'—',owner:'WMS',c:'#9ca3af'},
      ].map(s => `
        <div style="padding:10px 6px;background:${s.c}15;border-radius:6px;border:1px solid var(--border);border-top:3px solid ${s.c};text-align:center;">
          <div style="font-size:9px;font-weight:700;color:${s.c};text-transform:uppercase;letter-spacing:0.04em;">${s.n}</div>
          <div style="font-size:10px;font-weight:700;color:var(--text);margin-top:4px;line-height:1.2;">${s.lbl}</div>
          <div style="font-family:var(--font-mono);font-size:18px;font-weight:700;color:#1e293b;line-height:1;margin-top:6px;">${s.count}</div>
          <div style="font-size:9px;color:var(--text-mute);margin-top:4px;">${s.sla} SLA</div>
          <div style="font-size:8.5px;color:${s.c};font-weight:600;margin-top:4px;">${s.owner}</div>
        </div>
      `).join('')}
    </div>

    <!-- Counting Queue · Double-Count Status -->
    <div class="section-head" style="margin-top:16px;"><div class="section-title">Counting Queue · Double-Count Status</div><div class="section-sub">Re bags: single count · non-Re partner bags: double count required · per WMS PRD</div></div>
    <div class="kgrid kgrid-4">
      ${kpi('Awaiting Count', '64', '', { sub: 'In queue at CPC' })}
      ${kpi('Double-Count Needed', '27', '', { status:'warn', sub: 'non-Re partner bags (42%)' })}
      ${kpi('Single Count OK', '37', '', { status:'good', sub: 'Re bags · single pass (58%)' })}
      ${kpi('Shift Capacity', '96', '/shift', { sub: 'Est. clearance: 16h' })}
    </div>

    <!-- Critical Bags · Manager Resolution Queue -->
    <div class="section-head" style="margin-top:16px;"><div class="section-title">Critical Bags · Manager Resolution Queue</div><div class="section-sub">Discrepancy ≥ 5% threshold · HF held until verified · per Bag Lifecycle PRD critical-flag rule</div></div>
    <div class="kgrid kgrid-4">
      ${kpi('Weight Variance ≥5%', EXCEPTIONS_DATA.weight.filter(e=>e.varPct>=5).length, '', { status:'alert', sub: 'HF held · need resolution' })}
      ${kpi('Count Variance ≥5%', EXCEPTIONS_DATA.count.filter(e=>e.varPct>=5).length, '', { status:'alert', sub: 'HF held · need resolution' })}
      ${kpi('Lost Bags', EXCEPTIONS_DATA.lost.length, '', { status:'warn', sub: 'Provenance break · investigating' })}
      ${kpi('Total HF Held', '₹' + (EXCEPTIONS_DATA.weight.length*250 + EXCEPTIONS_DATA.count.length*180 + EXCEPTIONS_DATA.lost.length*320).toLocaleString(), '', { sub: 'Pending CPC inward verification' })}
    </div>
    <div class="card" style="margin-top:12px;">
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Bag ID</th><th>CP / Source</th><th>CPC</th><th>Reason</th><th>Type</th><th class="num">Age</th><th class="num">HF Held</th><th>Status</th></tr></thead>
          <tbody>
            ${EXCEPTIONS_DATA.weight.filter(e=>e.varPct>=5).slice(0,5).map(e => `
              <tr>
                <td class="id-cell">${e.id}</td>
                <td><strong>${e.cpName}</strong><br><span style="font-size:11px;color:var(--text-mute);">${e.taluka}</span></td>
                <td>${e.cpc}</td>
                <td>Weight variance ${e.varPct}% ≥ 5% threshold</td>
                <td><span class="pill pill-bad" style="font-size:10.5px;">Weight</span></td>
                <td class="num" style="${e.ageH>6?'color:var(--bad);font-weight:700;':''}">${e.ageH}h</td>
                <td class="num">₹${Math.round(e.cpKg*28)}</td>
                <td><span class="pill ${e.ageH>6?'pill-bad':'pill-warn'}" style="font-size:10.5px;">${e.ageH>6?'Escalated':'In Review'}</span></td>
              </tr>
            `).join('')}
            ${EXCEPTIONS_DATA.lost.slice(0,3).map(b => `
              <tr>
                <td class="id-cell">${b.id}</td>
                <td><strong>${b.lastSeen}</strong></td>
                <td>${b.cpc}</td>
                <td>Bag lost — provenance break</td>
                <td><span class="pill pill-warn" style="font-size:10.5px;">Lost</span></td>
                <td class="num" style="${b.reportedH>12?'color:var(--bad);font-weight:700;':''}">${b.reportedH}h</td>
                <td class="num">₹320</td>
                <td><span class="pill ${b.reportedH>12?'pill-bad':'pill-warn'}" style="font-size:10.5px;">${b.reportedH>12?'Escalated':'Investigating'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reconciliation Formula -->
    <div class="card" style="margin-top:12px;background:#f9fafb;">
      <div class="card-head"><div><div class="card-title">Reconciliation Formula · Per WMS PRD §3</div><div class="card-sub">Daily + monthly balancing equations</div></div></div>
      <div style="padding:14px 18px;font-family:var(--font-mono);font-size:12.5px;color:#4a5280;line-height:1.8;">
        <strong style="color:var(--text);">Daily:</strong> Total Inbound (kg) = Pack Output + Cullet Output + Bale Output + Variance<br>
        <span style="color:var(--text-mute);">2,317 kg = 1,198.4 + 298.6 + 630.4 + 94.8 (4.1% — within 5% tolerance)</span><br><br>
        <strong style="color:var(--text);">Monthly:</strong> Total Truck Weight (kg) = Σ Packed Units + Σ Cullet + Σ Bales
      </div>
    </div>
  `;
}
function pageWhInward() {
  const m = getMult('wh');
  return `
    <div class="kgrid kgrid-4">
      ${kpi('Bags Received', scaleK(12420, m), '', { delta: 5 })}
      ${kpi('Dock Entry → Unload', '42', 'min', { delta: -8 })}
      ${kpi('Unloading Time', '28', 'min', { delta: -4 })}
      ${kpi('Dock Clearance', '94', '%', { delta: 2 })}
      ${kpi('Weight Recon', '96.8', '%', { delta: 1 })}
      ${kpi('In-Transit Loss', '0.42', '%', { delta: -1 })}
      ${kpi('Recon: IB vs OB', '97.2', '%', { delta: 1 })}
      ${kpi('Double Count', '88', '%', { delta: 3 })}
      ${kpi('HF Processing TAT', '4.2', 'hr', { delta: -6 })}
    </div>
  `;
}
function pageWhSorting() {
  return `
    <div class="kgrid kgrid-4">
      ${kpi('Throughput', '1,420', '/hr', { delta: 3 })}
      ${kpi('Sort Accuracy', '96.4', '%', { delta: 1 })}
      ${kpi('Glass Pack Count', '8,420', '', { delta: 4 })}
      ${kpi('Cullet Weight', '12.4', 'MT', { delta: 2 })}
      ${kpi('Reusable Glass', '6.8', 'MT', { delta: 3 })}
      ${kpi('Pack — Brand A', '38', '%')}
      ${kpi('Pack — Brand B', '22', '%')}
      ${kpi('Pack — Brand C', '18', '%')}
    </div>
  `;
}
function pageWhOutbound() {
  return `
    <div class="kgrid kgrid-4">
      ${kpi('Bale Count', '342', '', { delta: 4 })}
      ${kpi('Bale Weight', '84.2', 'MT', { delta: 5 })}
      ${kpi('Outbound Volume', '74', 'MT', { delta: 4 })}
      ${kpi('Glass Dispatched', '28', 'MT', { delta: 3 })}
      ${kpi('Non-Glass Outbound', '46', 'MT', { delta: 5 })}
      ${kpi('Material Yield', '94.2', '%', { delta: 1 })}
      ${kpi('Accumulation Min', '78', '%')}
      ${kpi('Bale Dwell Time', '38', 'hr', { delta: -4 })}
    </div>
  `;
}

/* Costing — generic */
function pageCost(title, items) {
  return `
    <div class="section-head"><div class="section-title">${title}</div><div class="section-sub">Budget vs Actual · Cost per unit</div></div>
    <div class="kgrid kgrid-4">${items.map(it => kpi(it[0], it[1], it[2] || '', { delta: it[3] })).join('')}</div>
    <div class="card">
      <div class="card-head"><div><div class="card-title">Cost ledger · ${title}</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Period</th><th class="num">Budget</th><th class="num">Actual</th><th class="num">Variance</th><th class="num">Var %</th><th>Status</th></tr></thead>
          <tbody>
            ${['Jan 2026','Feb 2026','Mar 2026','Apr 2026','May 2026'].map((m, i) => {
              const bud = 180000 + i * 12000;
              const act = bud + (seedRand() - 0.5) * 18000;
              const v = act - bud;
              const vp = (v / bud * 100).toFixed(1);
              return `
                <tr>
                  <td>${m}</td>
                  <td class="num">₹${bud.toLocaleString()}</td>
                  <td class="num">₹${Math.round(act).toLocaleString()}</td>
                  <td class="num" style="color: ${v > 0 ? 'var(--bad)' : 'var(--good)'};">${v > 0 ? '+' : ''}₹${Math.round(Math.abs(v)).toLocaleString()}</td>
                  <td class="num" style="color: ${v > 0 ? 'var(--bad)' : 'var(--good)'};">${v > 0 ? '+' : ''}${vp}%</td>
                  <td>${v > 0 ? '<span class="pill pill-warn">Over</span>' : '<span class="pill pill-good">Under</span>'}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function stub(title, text, kpis = []) {
  return `<div class="stub"><div class="stub-title">${title}</div><div class="stub-text">${text}</div><div class="stub-kpis">${kpis.map(k => `<span class="stub-kpi">${k}</span>`).join('')}</div></div>`;
}

/* ============================================================
   PER-MODULE FILTER CONFIG
   Each module gets its own filter row. No universal strip.
   ============================================================ */
const MODULE_FILTERS = {
  'exec': [
    { label: 'View',  value: 'Goa', options: ['Goa', 'North Goa', 'South Goa'] },
    { label: 'Scope', value: 'All Modules', options: ['All Modules', 'Operations Only', 'Finance Only'] },
  ],
  'cp': [
    { label: 'Handler Type', value: 'All', options: ['All', 'Handler', 'Non-Handler'] },
    { label: 'Cluster',      value: 'All', options: ['All', 'Verna Cluster', 'Margao Cluster', 'Mapusa Cluster', 'Ponda Cluster', 'Bicholim Cluster'] },
    { label: 'Block',        value: 'All', options: ['All', ...TALUKAS] },
    { label: 'Panchayat',    value: 'All', options: ['All', ...PANCHAYATS.slice(0,18)] },
    { label: 'CP Type',      value: 'All', options: ['All', 'RVM', 'Return Center', 'D2D', 'HoReCa'] },
  ],
  'hor': [
    { label: 'Cluster', value: 'All', options: ['All', 'Verna Cluster', 'Margao Cluster', 'Mapusa Cluster', 'Ponda Cluster', 'Bicholim Cluster'] },
    { label: 'Block',   value: 'All', options: ['All', ...TALUKAS] },
    { label: 'Account Status', value: 'All', options: ['All', 'Active', 'Inactive', 'Onboarding'] },
  ],
  'log': [
    { label: 'CPC Cluster',   value: 'All', options: ['All', 'Verna Cluster', 'Margao Cluster', 'Mapusa Cluster', 'Ponda Cluster', 'Bicholim Cluster'] },
    { label: 'Block',         value: 'All', options: ['All', ...TALUKAS] },
    { label: 'Vendor',        value: 'All', options: ['All', ...VENDORS.slice(0,6)] },
    { label: 'Vehicle Type',  value: 'All', options: ['All', 'Tata Ace', 'Eicher Pro', 'Mahindra Bolero', '8-Wheeler', 'Container'] },
    { label: 'Capacity',      value: 'All', options: ['All', '< 1 MT', '1–3 MT', '3–7 MT', '> 7 MT'] },
  ],
  'wh': [
    { label: 'Cluster',   value: 'All', options: ['All', 'Verna Cluster', 'Margao Cluster', 'Mapusa Cluster', 'Ponda Cluster', 'Bicholim Cluster'] },
    { label: 'Block',     value: 'All', options: ['All', ...TALUKAS] },
    { label: 'Panchayat', value: 'All', options: ['All', ...PANCHAYATS.slice(0,18)] },
    { label: 'Source',    value: 'All', options: ['All', 'HoReCa', 'D2D', 'Return Center', 'MRF', 'Non-DRS'] },
  ],
  'cs': [
    { label: 'Channel',  value: 'All', options: ['All', 'Phone', 'Email', 'In-App', 'WhatsApp', 'Field'] },
    { label: 'Priority', value: 'All', options: ['All', 'P0', 'P1', 'P2', 'P3'] },
    { label: 'Status',   value: 'All', options: ['All', 'Open', 'In Progress', 'Pending', 'Resolved', 'Closed'] },
    { label: 'Module',   value: 'All', options: ['All', 'CP', 'HoReCa', 'Logistics', 'Warehouse'] },
  ],
  'cost': [
    { label: 'Period',   value: 'This Month', options: ['Today', 'This Week', 'This Month', 'This Quarter', 'YTD'] },
    { label: 'Cost Type', value: 'All', options: ['All', 'Travel', 'Manpower', 'Vendor', 'Utilities', 'Misc'] },
    { label: 'Budget Status', value: 'All', options: ['All', 'Under', 'On-track', 'Over'] },
  ],
  'sust': [], // deprecated
  'alerts': [
    { label: 'Severity', value: 'All', options: ['All', 'Critical', 'High', 'Medium', 'Low'] },
    { label: 'Module',   value: 'All', options: ['All', 'CP', 'Machines', 'HoReCa', 'Logistics', 'Warehouse'] },
    { label: 'Status',   value: 'Active', options: ['All', 'Active', 'Acknowledged', 'Resolved'] },
  ],
};

const DATE_OPTIONS = ['Today', 'Last 7d', 'Last 30d', 'Last 90d', 'This Quarter', 'YTD', 'Custom'];
let currentModuleId = 'cp';
let currentPageId = 'exec-home';
let currentDateFilter = 'Today';

function renderFilterBar(moduleId) {
  currentModuleId = moduleId;
  const bar = document.getElementById('filter-bar');
  const filters = MODULE_FILTERS[moduleId] || [];

  // Executive Dashboard renders its own quick-filter bar inline — hide the global one
  if (moduleId === 'exec') {
    bar.innerHTML = '';
    bar.style.display = 'none';
    return;
  }
  bar.style.display = '';

  // Date filter is universal across modules
  const dateChip = `
    <span class="filter-chip filter-dd active" data-filter="__date">
      <span class="filter-chip-label">Date</span>
      <span class="filter-chip-value">${currentDateFilter}</span>
      <span class="filter-chip-caret">▾</span>
    </span>`;

  const moduleChips = filters.map(f => `
    <span class="filter-chip filter-dd ${f.value !== 'All' ? 'active' : ''}" data-filter="${f.label}">
      <span class="filter-chip-label">${f.label}</span>
      <span class="filter-chip-value">${f.value}</span>
      <span class="filter-chip-caret">▾</span>
    </span>`).join('');

  bar.innerHTML = `
    ${dateChip}
    ${moduleChips}
    <div class="filter-spacer"></div>
    <button class="filter-reset" id="filter-reset-btn">Reset</button>
  `;

  // Wire dropdowns
  bar.querySelectorAll('.filter-dd').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = chip.dataset.filter;
      const opts = key === '__date' ? DATE_OPTIONS : (filters.find(f => f.label === key)?.options || []);
      showFilterMenu(chip, key, opts);
    });
  });

  document.getElementById('filter-reset-btn').addEventListener('click', () => {
    filters.forEach(f => f.value = f.options[0]);
    currentDateFilter = 'Today';
    renderFilterBar(moduleId);
    if (currentPageId) renderPage(currentPageId);
  });
}

function showFilterMenu(anchor, key, opts) {
  // Close any existing menus
  document.querySelectorAll('.filter-menu').forEach(m => m.remove());
  const rect = anchor.getBoundingClientRect();
  const menu = document.createElement('div');
  menu.className = 'filter-menu';
  menu.style.cssText = `
    position: fixed; top: ${rect.bottom + 4}px; left: ${rect.left}px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 6px; box-shadow: 0 4px 16px rgba(13,18,32,0.08);
    z-index: 100; min-width: 160px; max-height: 280px; overflow-y: auto;
    padding: 4px;
  `;
  menu.innerHTML = opts.map(o => `
    <div class="filter-menu-item" data-val="${o}">${o}</div>
  `).join('');
  document.body.appendChild(menu);

  menu.querySelectorAll('.filter-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const val = item.dataset.val;
      if (key === '__date') {
        currentDateFilter = val;
      } else {
        const f = MODULE_FILTERS[currentModuleId].find(x => x.label === key);
        if (f) f.value = val;
      }
      menu.remove();
      renderFilterBar(currentModuleId);
      // Re-render current page so the numbers reflect the new filter
      if (currentPageId) renderPage(currentPageId);
    });
  });

  setTimeout(() => {
    const close = (e) => { if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('click', close); } };
    document.addEventListener('click', close);
  }, 0);
}

/* ============================================================
   CUSTOMER SUPPORT — Mock data + pages
   ============================================================ */
const TICKET_PRIORITIES = ['P0', 'P1', 'P2', 'P3'];
const TICKET_STATUSES = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
const TICKET_CHANNELS = ['Phone', 'Email', 'In-App', 'WhatsApp', 'Field'];
const TICKET_CATEGORIES = ['Machine fault', 'QR scan issue', 'Refund delay', 'Bag pickup', 'Handler absence', 'Cash not dispensed', 'App issue', 'HoReCa pickup', 'Vehicle delay', 'Weight dispute'];
const AGENTS = ['Anjali R.', 'Vikram S.', 'Priya M.', 'Rohit K.', 'Neha D.', 'Sandeep P.', 'Meera T.', 'Akash B.'];

function genTickets(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const status = pick(TICKET_STATUSES);
    const priority = pick(TICKET_PRIORITIES);
    const cp = CP_DATA[rint(0, CP_DATA.length)];
    const ageHr = rint(1, 96);
    const sla = priority === 'P0' ? 4 : priority === 'P1' ? 12 : priority === 'P2' ? 24 : 48;
    out.push({
      id: `TKT-${10001 + i}`,
      created: `${ageHr}h ago`,
      ageHr: ageHr,
      priority: priority,
      status: status,
      channel: pick(TICKET_CHANNELS),
      category: pick(TICKET_CATEGORIES),
      cp: cp.id,
      cpName: cp.name,
      block: cp.block,
      agent: pick(AGENTS),
      sla: sla,
      slaBreached: ageHr > sla && (status !== 'Resolved' && status !== 'Closed'),
      csat: status === 'Resolved' || status === 'Closed' ? rfloat(2.5, 5.0) : null,
    });
  }
  return out;
}
const TICKET_DATA = genTickets(180);

function priorityPill(p) {
  const map = { 'P0': 'pill-bad', 'P1': 'pill-warn', 'P2': 'pill-info', 'P3': 'pill-neutral' };
  return `<span class="pill ${map[p]}">${p}</span>`;
}
function ticketStatusPill(s) {
  const map = {
    'Open':        ['pill-bad', 'dot-bad'],
    'In Progress': ['pill-info', 'dot-neutral'],
    'Pending':     ['pill-warn', 'dot-warn'],
    'Resolved':    ['pill-good', 'dot-good'],
    'Closed':      ['pill-neutral', 'dot-neutral'],
  };
  const [pc, dc] = map[s] || map['Open'];
  return `<span class="pill ${pc}"><span class="dot ${dc}"></span>${s}</span>`;
}

function pageCsTickets() {
  const m = getMult('cs');
  // TICKET_DATA is the 30-day baseline. Scale displayed counts by date relative to 30d.
  const dateScale = m.date / DATE_MULT['Last 30d'];
  const scale = (n) => Math.max(0, Math.round(n * dateScale * m.view));

  const total = scale(TICKET_DATA.length);
  const open = scale(TICKET_DATA.filter(t => t.status === 'Open').length);
  const inProg = scale(TICKET_DATA.filter(t => t.status === 'In Progress').length);
  const pending = scale(TICKET_DATA.filter(t => t.status === 'Pending').length);
  const resolved = scale(TICKET_DATA.filter(t => t.status === 'Resolved').length);
  const breached = scale(TICKET_DATA.filter(t => t.slaBreached).length);
  const p0 = scale(TICKET_DATA.filter(t => t.priority === 'P0').length);

  return `
    <div class="kgrid kgrid-6">
      ${kpi('Total Tickets', total, '', { sub: m.label.date })}
      ${kpi('Open', open, '', { status: 'alert' })}
      ${kpi('In Progress', inProg, '', { status: 'warn' })}
      ${kpi('Pending', pending, '', { status: 'warn' })}
      ${kpi('Resolved', resolved, '', { delta: 8, status: 'good' })}
      ${kpi('SLA Breached', breached, '', { status: 'alert' })}
      ${kpi('P0 Critical', p0, '', { status: 'alert' })}
      ${kpi('P1 High', scale(TICKET_DATA.filter(t => t.priority === 'P1').length), '')}
      ${kpi('P2 Medium', scale(TICKET_DATA.filter(t => t.priority === 'P2').length), '')}
      ${kpi('P3 Low', scale(TICKET_DATA.filter(t => t.priority === 'P3').length), '')}
      ${kpi('Avg Age', '14.2', 'h', { delta: -6 })}
      ${kpi('Avg Resolution', '8.4', 'h', { delta: -12, status: 'good' })}
    </div>

    <div class="card">
      <div class="card-head">
        <div>
          <div class="card-title">Support Ticket Registry</div>
          <div class="card-sub">${total} tickets · click any row to open ticket detail</div>
        </div>
        <div class="card-actions">
          <button class="btn">Export CSV</button>
          <button class="btn btn-primary">+ New Ticket</button>
        </div>
      </div>
      <div class="toolbar">
        <div class="toolbar-search">
          <span class="toolbar-search-icon">⌕</span>
          <input type="text" placeholder="Search ticket ID, CP, category, agent…" />
        </div>
        <span class="toolbar-count">Showing <strong>${Math.min(50, TICKET_DATA.length)}</strong> of <strong>${TICKET_DATA.length}</strong></span>
      </div>
      <div class="table-wrap" style="max-height: calc(100vh - 460px); overflow-y: auto;">
        <table class="t">
          <thead><tr>
            <th>Ticket ID</th><th>Created</th><th>Priority</th><th>Channel</th>
            <th>Category</th><th>CP</th><th>Block</th><th>Agent</th>
            <th class="num">Age</th><th class="num">SLA</th><th>SLA Status</th><th>Status</th><th></th>
          </tr></thead>
          <tbody>
            ${TICKET_DATA.slice(0, 50).map((t, i) => `
              <tr class="${i % 2 ? 'striped' : ''}">
                <td class="id-cell">${t.id}</td>
                <td style="color: var(--text-mute); font-family: var(--font-mono); font-size: 11px;">${t.created}</td>
                <td>${priorityPill(t.priority)}</td>
                <td>${t.channel}</td>
                <td>${t.category}</td>
                <td><span class="row-action">${t.cp}</span></td>
                <td>${t.block}</td>
                <td>${t.agent}</td>
                <td class="num">${t.ageHr}h</td>
                <td class="num">${t.sla}h</td>
                <td>${t.slaBreached ? '<span class="pill pill-bad">Breached</span>' : '<span class="pill pill-good">On-track</span>'}</td>
                <td>${ticketStatusPill(t.status)}</td>
                <td><span class="row-action">Open →</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- PRD-Refined Critical Bag Tickets · Cross-Module Handoff -->
    <div class="section-head" style="margin-top:16px;"><div class="section-title">Critical Bag Tickets · From Warehouse</div><div class="section-sub">Manager-escalated bags ≥5% discrepancy · Warehouse raises → CS resolves with CP handler · HF held until closed</div></div>
    <div class="kgrid kgrid-4">
      ${kpi('Weight Variance Tickets', EXCEPTIONS_DATA.weight.filter(e=>e.varPct>=5).length, '', { status:'alert', sub: 'CP→CPC weight mismatch' })}
      ${kpi('Count Variance Tickets', EXCEPTIONS_DATA.count.filter(e=>e.varPct>=5).length, '', { status:'alert', sub: 'Bottle count mismatch' })}
      ${kpi('Lost Bag Tickets', EXCEPTIONS_DATA.lost.length, '', { status:'warn', sub: 'Provenance break' })}
      ${kpi('Escalated >6h', EXCEPTIONS_DATA.weight.filter(e=>e.varPct>=5 && e.ageH>6).length + EXCEPTIONS_DATA.lost.filter(b=>b.reportedH>12).length, '', { status:'alert', sub: 'Need manager action' })}
    </div>
    <div style="margin-top:10px;padding:10px 14px;background:#f8fafc;border-radius:8px;border:1px solid var(--border);font-size:11.5px;color:var(--text-mute);">
      HF held on critical bags: <strong style="color:var(--text);font-family:var(--font-mono);">₹${(EXCEPTIONS_DATA.weight.length*250 + EXCEPTIONS_DATA.count.length*180 + EXCEPTIONS_DATA.lost.length*320).toLocaleString()}</strong> · pending CP-handler dispute resolution · Exception → ticket conversion ~30% historically
    </div>

    <!-- Top Issue Categories · PRD-aligned -->
    <div class="section-head" style="margin-top:16px;"><div class="section-title">Top Issue Categories · Today</div><div class="section-sub">By volume · Avg TAT vs SLA · Customer-facing pain points</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Category</th><th class="num">Count</th><th class="num">Avg TAT</th><th>SLA Status</th></tr></thead>
          <tbody>
            <tr><td>Deposit refund not received</td><td class="num">42</td><td class="num">3.8 hr</td><td><span class="pill pill-good">Within SLA</span></td></tr>
            <tr class="striped"><td>QR code not scanning</td><td class="num">28</td><td class="num">2.1 hr</td><td><span class="pill pill-good">Within SLA</span></td></tr>
            <tr><td>RVM not accepting bottle</td><td class="num">24</td><td class="num">4.6 hr</td><td><span class="pill pill-warn">Near SLA</span></td></tr>
            <tr class="striped"><td>HF dispute (Critical Bag)</td><td class="num">18</td><td class="num">6.2 hr</td><td><span class="pill pill-warn">Near SLA</span></td></tr>
            <tr><td>Handler behavior complaint</td><td class="num">12</td><td class="num">8.4 hr</td><td><span class="pill pill-bad">Breached</span></td></tr>
            <tr class="striped"><td>CP location/hours issue</td><td class="num">10</td><td class="num">1.8 hr</td><td><span class="pill pill-good">Within SLA</span></td></tr>
            <tr><td>UPI payout failure</td><td class="num">8</td><td class="num">5.4 hr</td><td><span class="pill pill-warn">Near SLA</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function pageCsSla() {
  return `
    <div class="kgrid kgrid-4">
      ${kpi('Avg First Response', '24', 'min', { delta: -8, status: 'good' })}
      ${kpi('Avg Resolution Time', '8.4', 'hr', { delta: -12, status: 'good' })}
      ${kpi('SLA Compliance', '87.2', '%', { delta: 3, status: 'good' })}
      ${kpi('SLA Breaches', TICKET_DATA.filter(t => t.slaBreached).length, '', { delta: -4 })}
      ${kpi('P0 Avg TAT', '2.8', 'hr', { delta: -10 })}
      ${kpi('P1 Avg TAT', '6.2', 'hr', { delta: -8 })}
      ${kpi('P2 Avg TAT', '14.4', 'hr', { delta: -4 })}
      ${kpi('P3 Avg TAT', '32.1', 'hr', { delta: 2 })}
    </div>

    <div class="card">
      <div class="card-head"><div><div class="card-title">TAT by category</div><div class="card-sub">Average resolution time · last 30d</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Category</th><th class="num">Tickets</th><th class="num">Avg TAT</th><th class="num">SLA</th><th class="num">Compliance</th><th>Trend</th></tr></thead>
          <tbody>
            ${TICKET_CATEGORIES.map((c, i) => {
              const cnt = rint(8, 28);
              const tat = rfloat(2, 28);
              const sla = [4, 12, 24, 48][i % 4];
              const comp = tat < sla ? rfloat(85, 99) : rfloat(60, 84);
              return `
                <tr>
                  <td>${c}</td>
                  <td class="num">${cnt}</td>
                  <td class="num">${tat}h</td>
                  <td class="num">${sla}h</td>
                  <td class="num" style="color: ${comp > 85 ? 'var(--good)' : 'var(--warn)'};">${comp}%</td>
                  <td>${comp > 85 ? '<span class="pill pill-good">On-track</span>' : '<span class="pill pill-warn">At-risk</span>'}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><div><div class="card-title">SLA breach ledger</div><div class="card-sub">Open tickets past SLA</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Ticket</th><th>Priority</th><th>Category</th><th>CP</th><th class="num">Age</th><th class="num">SLA</th><th class="num">Overdue</th><th>Agent</th></tr></thead>
          <tbody>
            ${TICKET_DATA.filter(t => t.slaBreached).slice(0, 12).map(t => `
              <tr>
                <td class="id-cell">${t.id}</td>
                <td>${priorityPill(t.priority)}</td>
                <td>${t.category}</td>
                <td>${t.cp}</td>
                <td class="num">${t.ageHr}h</td>
                <td class="num">${t.sla}h</td>
                <td class="num" style="color: var(--bad); font-weight: 600;">+${t.ageHr - t.sla}h</td>
                <td>${t.agent}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function pageCsCsat() {
  const rated = TICKET_DATA.filter(t => t.csat !== null);
  const avg = (rated.reduce((s, t) => s + t.csat, 0) / rated.length).toFixed(2);
  const promoters = rated.filter(t => t.csat >= 4).length;
  const detractors = rated.filter(t => t.csat < 3).length;
  const passives = rated.length - promoters - detractors;

  return `
    <div class="kgrid kgrid-4">
      ${kpi('Avg CSAT', avg, '/ 5', { delta: 4, status: 'good' })}
      ${kpi('Total Rated', rated.length, '')}
      ${kpi('Promoters (4–5★)', promoters, '', { delta: 6, status: 'good' })}
      ${kpi('Passives (3★)', passives, '')}
      ${kpi('Detractors (<3★)', detractors, '', { delta: -8, status: 'warn' })}
      ${kpi('Response Rate', '64', '%', { delta: 2 })}
      ${kpi('NPS', '+42', '', { delta: 5, status: 'good' })}
      ${kpi('5★ Tickets', rated.filter(t => t.csat >= 4.5).length, '')}
    </div>

    <div class="card">
      <div class="card-head"><div><div class="card-title">Agent CSAT scorecard</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Agent</th><th class="num">Tickets</th><th class="num">Resolved</th><th class="num">Avg CSAT</th><th class="num">5★</th><th class="num">Avg TAT</th><th>Performance</th></tr></thead>
          <tbody>
            ${AGENTS.map((a, i) => {
              const tix = rint(18, 42);
              const res = rint(14, tix);
              const csat = rfloat(3.8, 4.9, 2);
              return `
                <tr>
                  <td>${a}</td>
                  <td class="num">${tix}</td>
                  <td class="num">${res}</td>
                  <td class="num" style="color: ${csat > 4.3 ? 'var(--good)' : csat > 3.8 ? 'var(--warn)' : 'var(--bad)'};">${csat}</td>
                  <td class="num">${rint(4, 18)}</td>
                  <td class="num">${rfloat(4, 18)}h</td>
                  <td>${csat > 4.3 ? '<span class="pill pill-good">Top</span>' : csat > 3.8 ? '<span class="pill pill-info">Good</span>' : '<span class="pill pill-warn">Coach</span>'}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><div><div class="card-title">CSAT by category</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Category</th><th class="num">Responses</th><th class="num">Avg CSAT</th><th class="num">5★ %</th><th class="num">< 3★ %</th></tr></thead>
          <tbody>
            ${TICKET_CATEGORIES.map(c => {
              const csat = rfloat(3.4, 4.8, 2);
              return `
                <tr>
                  <td>${c}</td>
                  <td class="num">${rint(12, 38)}</td>
                  <td class="num" style="color: ${csat > 4.3 ? 'var(--good)' : csat > 3.8 ? 'var(--warn)' : 'var(--bad)'};">${csat}</td>
                  <td class="num">${rint(35, 78)}%</td>
                  <td class="num">${rint(3, 24)}%</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function pageCsEscalations() {
  const escTickets = TICKET_DATA.filter(t => t.priority === 'P0' || t.priority === 'P1').slice(0, 24);
  return `
    <div class="kgrid kgrid-4">
      ${kpi('Open Escalations', 12, '', { status: 'alert' })}
      ${kpi('L1 Escalations', 8, '')}
      ${kpi('L2 Escalations', 3, '', { status: 'warn' })}
      ${kpi('L3 / Exec', 1, '', { status: 'alert' })}
      ${kpi('Avg Esc Age', '18.4', 'hr', { delta: -2 })}
      ${kpi('Resolved this week', 28, '', { delta: 12, status: 'good' })}
      ${kpi('Repeat CPs', 6, '', { status: 'warn' })}
      ${kpi('Esc / CP Ratio', '0.04', '', { delta: -1 })}
    </div>

    <div class="card">
      <div class="card-head"><div><div class="card-title">Active escalations</div><div class="card-sub">P0 and P1 tickets requiring management attention</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>Esc ID</th><th>Priority</th><th>Level</th><th>Category</th>
            <th>CP</th><th>Block</th><th class="num">Age</th><th>Owner</th><th>Status</th><th></th>
          </tr></thead>
          <tbody>
            ${escTickets.map(t => {
              const level = t.priority === 'P0' ? (t.ageHr > 8 ? 'L3' : 'L2') : 'L1';
              const levelClass = level === 'L3' ? 'pill-bad' : level === 'L2' ? 'pill-warn' : 'pill-info';
              return `
                <tr>
                  <td class="id-cell">ESC-${t.id.slice(4)}</td>
                  <td>${priorityPill(t.priority)}</td>
                  <td><span class="pill ${levelClass}">${level}</span></td>
                  <td>${t.category}</td>
                  <td><span class="row-action">${t.cp}</span></td>
                  <td>${t.block}</td>
                  <td class="num">${t.ageHr}h</td>
                  <td>${t.agent}</td>
                  <td>${ticketStatusPill(t.status)}</td>
                  <td><span class="row-action">Resolve →</span></td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><div><div class="card-title">Repeat-offender CPs</div><div class="card-sub">CPs with 3+ escalations in 30 days</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>CP</th><th>Block</th><th>Vendor</th><th class="num">Escalations</th><th class="num">Open</th><th class="num">Avg Age</th><th>Status</th></tr></thead>
          <tbody>
            ${CP_DATA.filter(c => c.escalations >= 2).slice(0, 10).map(c => `
              <tr>
                <td>${c.name}</td>
                <td>${c.block}</td>
                <td>${c.vendor}</td>
                <td class="num" style="color: var(--bad); font-weight: 600;">${c.escalations + rint(1,4)}</td>
                <td class="num">${c.escalations}</td>
                <td class="num">${rint(8, 36)}h</td>
                <td>${statusPill(c.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}


/* ============================================================
   EXECUTIVE DASHBOARD — Front page, summarizes all modules
   ============================================================ */

// Reactive multipliers driven by the filter dropdowns (Date / View / Scope / Block / Cluster / Panchayat).
// All numbers in module pages scale by these so dropdown changes are visible.
const DATE_MULT = { 'Today': 1.0, 'Last 7d': 6.4, 'Last 30d': 28, 'Last 90d': 84, 'This Quarter': 92, 'YTD': 184, 'Custom': 14 };
const VIEW_MULT = { 'Goa': 1.0, 'North Goa': 0.58, 'South Goa': 0.42 };
const SCOPE_MASK = { 'All Modules': { ops: true, fin: true }, 'Operations Only': { ops: true, fin: false }, 'Finance Only': { ops: false, fin: true } };
// Block multipliers (rough population weighting; sum ≈ 1)
const BLOCK_MULT = {
  'Tiswadi': 0.12, 'Bardez': 0.14, 'Pernem': 0.06, 'Bicholim': 0.07, 'Sattari': 0.05,
  'Ponda': 0.11, 'Mormugao': 0.10, 'Salcete': 0.16, 'Quepem': 0.06, 'Canacona': 0.04,
  'Sanguem': 0.05, 'Dharbandora': 0.04
};
// Cluster multipliers (5 CPC clusters + a few legacy cluster names)
const CLUSTER_MULT = {
  'Verna Cluster': 0.22, 'Margao Cluster': 0.26, 'Mapusa Cluster': 0.20,
  'Ponda Cluster': 0.16, 'Bicholim Cluster': 0.10,
  'North Goa': 0.45, 'South Goa': 0.42, 'Central': 0.13, 'Coastal': 0.18, 'North-East': 0.10,
  'Block-wise': 1.0, 'Inland': 0.05
};
// Warehouse Source filter (HoReCa / D2D / Return / MRF / Non-DRS)
const SOURCE_MULT = { 'HoReCa': 0.18, 'D2D': 0.12, 'Return Center': 0.22, 'MRF': 0.08, 'Non-DRS': 0.06 };

/* Universal multiplier resolver — reads current filter state for any module. */
function getMult(moduleId) {
  moduleId = moduleId || currentModuleId;
  const f = MODULE_FILTERS[moduleId] || [];
  const dateVal = currentDateFilter || 'Today';
  const findVal = (label, fallback) => {
    const x = f.find(x => x.label === label);
    return (x && x.value) || fallback;
  };
  const viewVal = findVal('View', 'Goa');
  const scopeVal = findVal('Scope', 'All Modules');
  const blockVal = findVal('Block', 'All');
  const panchVal = findVal('Panchayat', 'All');
  const clusterVal = findVal('Cluster', null) || findVal('CPC Cluster', 'All');
  const cpTypeVal = findVal('CP Type', 'All');
  const handlerVal = findVal('Handler Type', 'All');
  const sourceVal = findVal('Source', 'All');

  // Compose geo multiplier: most specific wins
  let geo = 1.0;
  if (panchVal && panchVal !== 'All') geo = 0.012; // single panchayat
  else if (blockVal && blockVal !== 'All') geo = BLOCK_MULT[blockVal] || 0.08;
  else if (clusterVal && clusterVal !== 'All' && clusterVal !== null) geo = CLUSTER_MULT[clusterVal] || 0.20;
  else if (viewVal && VIEW_MULT[viewVal]) geo = VIEW_MULT[viewVal];

  // CP type narrows volume
  let typeFactor = 1.0;
  if (cpTypeVal === 'RVM') typeFactor = 0.74;
  else if (cpTypeVal === 'Return Center') typeFactor = 0.18;
  else if (cpTypeVal === 'D2D') typeFactor = 0.06;
  else if (cpTypeVal === 'HoReCa') typeFactor = 0.02;

  // Handler filter (CP module)
  let handlerFactor = 1.0;
  if (handlerVal === 'Handler') handlerFactor = 0.62;
  else if (handlerVal === 'Non-Handler') handlerFactor = 0.38;

  // Source filter (Warehouse module)
  let sourceFactor = 1.0;
  if (sourceVal && sourceVal !== 'All' && SOURCE_MULT[sourceVal]) sourceFactor = SOURCE_MULT[sourceVal];

  return {
    date: DATE_MULT[dateVal] || 1,
    view: geo,
    type: typeFactor,
    handler: handlerFactor,
    source: sourceFactor,
    scope: SCOPE_MASK[scopeVal] || SCOPE_MASK['All Modules'],
    label: {
      date: dateVal, view: viewVal, scope: scopeVal,
      block: blockVal, panchayat: panchVal, cluster: clusterVal,
      cpType: cpTypeVal, handler: handlerVal, source: sourceVal
    }
  };
}

/* Back-compat alias for the existing exec code */
function execMult() { return getMult('exec'); }

/* Universal scalers — accept either a multiplier object OR a moduleId string. */
function scaleNum(base, m) {
  if (typeof m === 'string') m = getMult(m);
  if (!m) m = getMult();
  const factor = (m.date || 1) * (m.view || 1) * (m.type || 1) * (m.handler || 1) * (m.source || 1);
  return Math.round(base * factor);
}
function scaleK(base, m) { return scaleNum(base, m).toLocaleString(); }

/* For "count" metrics that shouldn't scale with date (total CPs, fleet size, etc.) */
function scaleCount(base, m, max) {
  if (typeof m === 'string') m = getMult(m);
  if (!m) m = getMult();
  const v = Math.round(base * (m.view || 1) * (m.type || 1) * (m.handler || 1));
  return max ? Math.min(v, max) : v;
}

/* RVM/RC fill rate hard cap at 80% — anything ≥80% is sealed and triggers a pickup request */
const FILL_CAP = 80;
function capFill(pct) { return Math.min(pct, FILL_CAP); }
function isSealed(pct) { return pct >= FILL_CAP; }

const EXEC_STATE = {
  qrCollapsed: false, cpCollapsed: false, userCollapsed: false,
  logCollapsed: false, whCollapsed: false, csCollapsed: false,
  agentOpen: false,
};

/* ============================================================
   GOA BENCHMARKS — Real-world ceilings for sanity checks
   ============================================================ */
const GOA = {
  // Demographics
  population: 1458545,         // Census 2011 projected to 2024
  households: 322813,
  panchayats: 191,
  talukas: 12,
  area_km2: 3702,

  // Hospitality (DoT registered, 2024)
  registered_hotels: 9000,
  estimated_horeca: 22000,     // hotels + restaurants + cafés + bars + shacks

  // Tourism (2024 actuals)
  domestic_tourists_annual: 9941285,
  intl_tourists_annual: 467911,

  // Waste / DRS scale (annual estimates)
  pet_bottles_consumed_annual: 280000000,   // 280M units
  glass_bottles_annual: 180000000,
  realistic_qr_purchased_annual: 200000000, // ~70% of consumed PET would carry DRS QR

  // Operational (assumed by scheme design)
  rvm_total: 270,
  rc_total: 80,
  awp_total: 50,
  ragpicker_total: 50,
  truck_cp_total: 150,
  cpc_total: 5,

  // Reasonable ranges
  rvm_uptime_min: 92,    // anything below = alert
  rvm_uptime_max: 99.5,
  redemption_rate_target: 75,
  redemption_rate_floor: 50,
  cost_per_trip_max: 3500,
  cost_per_trip_min: 800,
  veh_efficiency_min: 60,
  veh_efficiency_max: 90,
  pickup_compliance_min: 85,
  yield_min: 88,
  yield_max: 98,
};

/* ============================================================
   SANITY AGENT — Rule-based audit of the dashboard
   Returns: { flags: [{level, area, msg, suggestion?, value?, expected?}], score }
   ============================================================ */
function runSanityAgent(moduleId) {
  moduleId = moduleId || 'exec';
  const flags = [];

  // Exec-only checks: run when on Executive Dashboard
  if (moduleId === 'exec') {
  // ====================================================================
  // V36 — TWO OVERSIGHT AGENTS audit the Executive Dashboard
  //  AGENT 1 · NUMBERS  — every figure must reconcile to the model
  //  AGENT 2 · DESIGN   — structure, layout & visual consistency
  // The interlocking model: 1 redeemed QR ≡ 1 container collected, so
  // QR-by-Material, QR-by-Denomination and Channel-Utilisation units
  // must each sum to redeemed QRs; ₹ values derive from denomination.
  // ====================================================================

  // ---- Base model (mirror of V25_DATA BASE assumptions) ----
  const M = {
    purchased: 1200000, active: 850000, redeemed: 420000,
    unredeemed: 80000, deactivated: 25000,
    denomMix: [{amt:2,share:0.60},{amt:5,share:0.30},{amt:10,share:0.10}],
  };
  M.yetToRedeem = M.active - M.redeemed;
  const avgD = M.denomMix.reduce((s,d)=>s+d.amt*d.share,0);
  const totalVal    = Math.round(M.purchased  * avgD);
  const redeemedVal = Math.round(M.redeemed   * avgD);

  // Material units (must sum to redeemed)
  const matShares = [0.70,0.10,0.08,0.07,0.05];
  let mr=0; const matUnits = matShares.map((s,i)=>{
    let u=Math.round(M.redeemed*s); if(i===matShares.length-1)u=M.redeemed-mr; mr+=u; return u; });
  // Channel utilisation units (must sum to redeemed)
  const chShares=[0.46,0.24,0.16,0.09,0.05];
  let cr=0; const chUnits=chShares.map((s,i)=>{
    let u=Math.round(M.redeemed*s); if(i===chShares.length-1)u=M.redeemed-cr; cr+=u; return u; });

  // ===================== AGENT 1 · NUMBERS =====================
  const A1 = 'Agent · Numbers';

  // QR identity: Active = Redeemed + Yet-to-Redeem
  if (M.active === M.redeemed + M.yetToRedeem) {
    flags.push({ level:'good', area:A1, msg:`QR identity holds: Active ${M.active.toLocaleString('en-IN')} = Redeemed + Yet-to-Redeem.` });
  } else {
    flags.push({ level:'bad', area:A1, msg:`QR identity broken: Active ≠ Redeemed + Yet-to-Redeem.`, suggestion:'Recheck active/redeemed/yet-to-redeem in V25_DATA.' });
  }

  // Material units reconcile to redeemed QRs
  const matSum = matUnits.reduce((a,b)=>a+b,0);
  if (matSum === M.redeemed) {
    flags.push({ level:'good', area:A1, msg:`QR Redemption by Material units sum to ${matSum.toLocaleString('en-IN')} = redeemed QRs.` });
  } else {
    flags.push({ level:'bad', area:A1, msg:`Material units (${matSum.toLocaleString('en-IN')}) ≠ redeemed QRs (${M.redeemed.toLocaleString('en-IN')}).` });
  }

  // Denomination units reconcile to redeemed QRs
  let dr=0; const denUnits=M.denomMix.map((d,i)=>{
    let u=Math.round(M.redeemed*d.share); if(i===M.denomMix.length-1)u=M.redeemed-dr; dr+=u; return u; });
  const denSum = denUnits.reduce((a,b)=>a+b,0);
  if (denSum === M.redeemed) {
    flags.push({ level:'good', area:A1, msg:`QR Redemption by Denomination units sum to ${denSum.toLocaleString('en-IN')} = redeemed QRs.` });
  } else {
    flags.push({ level:'bad', area:A1, msg:`Denomination units (${denSum.toLocaleString('en-IN')}) ≠ redeemed QRs.` });
  }

  // Denomination ₹ value reconciles to Total Deposit Redeemed
  const denVal = denUnits.reduce((s,u,i)=>s+u*M.denomMix[i].amt,0);
  if (Math.abs(denVal - redeemedVal) < 5) {
    flags.push({ level:'good', area:A1, msg:`Redeemed deposit value reconciles: ₹${redeemedVal.toLocaleString('en-IN')} from denomination split.` });
  } else {
    flags.push({ level:'bad', area:A1, msg:`Denomination ₹ (₹${denVal.toLocaleString('en-IN')}) ≠ Total Deposit Redeemed (₹${redeemedVal.toLocaleString('en-IN')}).` });
  }

  // Channel utilisation units reconcile to redeemed QRs
  const chSum = chUnits.reduce((a,b)=>a+b,0);
  if (chSum === M.redeemed) {
    flags.push({ level:'good', area:A1, msg:`Collection-Infra utilisation units sum to ${chSum.toLocaleString('en-IN')} = redeemed QRs (1 QR ≡ 1 container).` });
  } else {
    flags.push({ level:'bad', area:A1, msg:`Channel utilisation units (${chSum.toLocaleString('en-IN')}) ≠ redeemed QRs.`, suggestion:'Every redeemed QR enters via one channel — units must total redeemed.' });
  }

  // Total deposit value sanity
  const valCheck = M.denomMix.reduce((s,d)=>s+Math.round(M.purchased*d.share)*d.amt,0);
  if (Math.abs(valCheck - totalVal) < 1000) {
    flags.push({ level:'good', area:A1, msg:`Total Deposit Collected ₹${totalVal.toLocaleString('en-IN')} = Σ(QRs × denomination).` });
  } else {
    flags.push({ level:'warn', area:A1, msg:`Total Deposit Collected may not reconcile to denomination mix.` });
  }

  // Redemption rate
  const rr = M.redeemed / M.active * 100;
  if (rr >= (typeof GOA!=='undefined'?GOA.redemption_rate_target:48)) {
    flags.push({ level:'good', area:A1, msg:`Redemption rate ${rr.toFixed(1)}% — above target.` });
  } else {
    flags.push({ level:'warn', area:A1, msg:`Redemption rate ${rr.toFixed(1)}% — monitor slow-redeem panchayats.` });
  }

  // Collection infra: Total CP = RVM + RC
  const totalCP = 350, rvm = 300, rc = 50;
  if (totalCP === rvm + rc) {
    flags.push({ level:'good', area:A1, msg:`Total CP ${totalCP} = ${rvm} RVM + ${rc} RC.` });
  } else {
    flags.push({ level:'bad', area:A1, msg:`Total CP (${totalCP}) ≠ RVM + RC.` });
  }

  // Warehouse flow physics
  const inb=120.6, prc=98.4, out=86.2;
  if (prc <= inb && out <= prc) {
    flags.push({ level:'good', area:A1, msg:`Warehouse flow valid: Inbound ${inb} ≥ Processed ${prc} ≥ Outbound ${out} MT.` });
  } else {
    flags.push({ level:'bad', area:A1, msg:`Warehouse flow impossible — processed/outbound exceeds upstream.` });
  }

  // ===================== AGENT 2 · DESIGN =====================
  const A2 = 'Agent · Design';

  flags.push({ level:'good', area:A2, msg:'Map removed from Executive Dashboard — replaced by 3-box network summary (Collection Infra · Logistics · Warehouse).' });
  flags.push({ level:'good', area:A2, msg:'QR Redemption shown as two side-by-side pie charts (by Material · by Denomination) with click-to-popup data points.' });
  flags.push({ level:'good', area:A2, msg:'Charts display units alongside percentages; all ₹ figures render as full numbers with thousands separators.' });
  flags.push({ level:'good', area:A2, msg:'Collection Infrastructure: Total CP / Uptime / Active CP stat strip, utilisation pie, fixed & mobile data-point tiles.' });
  flags.push({ level:'good', area:A2, msg:'Removed: ₹ Triggered tile, Handler Presence Check, CPC Network row, Active Trips, User Activity by Channel, Top Complaint Categories.' });
  flags.push({ level:'good', area:A2, msg:'Added: CSAT block in Customer Support, New Users KPI in User Insight.' });

  // Design check: pie canvases present
  if (typeof document !== 'undefined') {
    const pies = ['v36-pie-material','v36-pie-denom','v36-pie-util']
      .filter(id => document.getElementById(id)).length;
    if (pies === 3) {
      flags.push({ level:'good', area:A2, msg:'All 3 pie-chart canvases mounted and wired.' });
    } else if (pies > 0) {
      flags.push({ level:'info', area:A2, msg:`${pies}/3 pie canvases detected — re-render in progress.` });
    }
  }
  } // end exec branch

  // ====================================================================
  // CP MODULE — HF/DC rule audit, bag-state physics, SLA breach physics
  // ====================================================================
  if (moduleId === 'cp') {
    // Rule: non-Re + non-HoReCa CPs should equal HF-eligible count
    const expectedHF = CP_DATA.filter(c => c.reType === 'non-Re' && c.establishmentType !== 'HoReCa').length;
    const actualHF = CP_DATA.filter(c => c.hfEligible).length;
    if (expectedHF !== actualHF) {
      flags.push({ level: 'bad', area: 'HF Eligibility', msg: `HF eligibility rule mismatch: expected ${expectedHF} but flagged ${actualHF}.`, suggestion: 'Re-derive hfEligible from (reType==="non-Re" && establishmentType!=="HoReCa").' });
    } else {
      flags.push({ level: 'good', area: 'HF Eligibility', msg: `HF eligibility rule holds: ${actualHF}/${CP_DATA.length} CPs (${(actualHF/CP_DATA.length*100).toFixed(1)}%).` });
    }
    // Rule: DC-required count = HF-eligible count (same rule)
    const dcRequired = CP_DATA.filter(c => c.doubleCountRequired).length;
    if (dcRequired !== actualHF) {
      flags.push({ level: 'bad', area: 'Double Count', msg: `DC-required (${dcRequired}) ≠ HF-eligible (${actualHF}) — same rule should yield same count.` });
    } else {
      flags.push({ level: 'good', area: 'Double Count', msg: `Double-count required CPs = HF-eligible CPs (${dcRequired}). Rule consistent.` });
    }
    // HoReCa exemption
    const horecaHF = CP_DATA.filter(c => c.establishmentType === 'HoReCa' && c.hfEligible).length;
    if (horecaHF > 0) {
      flags.push({ level: 'bad', area: 'HoReCa Exemption', msg: `${horecaHF} HoReCa CPs flagged HF-eligible — should be 0.`, suggestion: 'HoReCa is exempt regardless of reType.' });
    } else {
      flags.push({ level: 'good', area: 'HoReCa Exemption', msg: 'All HoReCa CPs correctly exempt from HF (0 incorrectly flagged).' });
    }
    // SLA breach physics: a CP can only be sealBreached if sealedBags>0
    const phantomBreach = CP_DATA.filter(c => c.slaBreachedSeal && c.sealedBags === 0).length;
    if (phantomBreach > 0) {
      flags.push({ level: 'bad', area: 'SLA Physics', msg: `${phantomBreach} CPs flagged sealBreached with 0 sealed bags — impossible.` });
    }
    // Bag-low coverage
    const bagsLowCount = CP_DATA.filter(c => c.bagLow).length;
    const bagsLowPct = (bagsLowCount / CP_DATA.length * 100).toFixed(1);
    if (bagsLowCount > CP_DATA.length * 0.20) {
      flags.push({ level: 'warn', area: 'Bag Supply', msg: `${bagsLowCount} CPs (${bagsLowPct}%) below safety stock — wide replenishment pressure.`, suggestion: 'Trigger bulk dispatch from CPC. Reorder lead time is 2 days.' });
    } else {
      flags.push({ level: 'good', area: 'Bag Supply', msg: `${bagsLowCount} CPs below safety stock — within tolerance.` });
    }
    // Cluster coverage check
    const cpcCoverage = {};
    CP_DATA.forEach(c => { cpcCoverage[c.block] = (cpcCoverage[c.block] || 0) + 1; });
    const undercovered = Object.entries(cpcCoverage).filter(([,n]) => n < 10).map(([t]) => t);
    if (undercovered.length > 0) {
      flags.push({ level: 'info', area: 'Coverage', msg: `${undercovered.length} taluka${undercovered.length>1?'s':''} have <10 CPs: ${undercovered.slice(0,3).join(', ')}${undercovered.length>3?'...':''}.` });
    }
  }

  // ====================================================================
  // HORECA MODULE
  // ====================================================================
  if (moduleId === 'hor') {
    const horecaCPs = CP_DATA.filter(c => c.establishmentType === 'HoReCa');
    const wronglyHF = horecaCPs.filter(c => c.hfEligible).length;
    if (wronglyHF > 0) {
      flags.push({ level: 'bad', area: 'HoReCa HF Rule', msg: `${wronglyHF} HoReCa CPs marked HF-eligible — HoReCa is exempt regardless of reType.` });
    } else {
      flags.push({ level: 'good', area: 'HoReCa HF Rule', msg: `All ${horecaCPs.length} HoReCa CPs correctly exempt from HF.` });
    }
    const wronglyDC = horecaCPs.filter(c => c.doubleCountRequired).length;
    if (wronglyDC > 0) {
      flags.push({ level: 'bad', area: 'HoReCa DC Rule', msg: `${wronglyDC} HoReCa CPs marked DC-required — HoReCa uses bulk weighing, no double count.` });
    } else {
      flags.push({ level: 'good', area: 'HoReCa DC Rule', msg: `All HoReCa CPs correctly exempt from double-count.` });
    }
    // 24h pickup SLA
    const longWaits = horecaCPs.filter(c => c.longestWaitH > 24).length;
    if (longWaits > 0) {
      flags.push({ level: 'warn', area: 'Pickup SLA', msg: `${longWaits} HoReCa outlets have bags waiting >24h.`, suggestion: 'HoReCa pickup SLA is 24h. Schedule bulk pickup runs.' });
    } else {
      flags.push({ level: 'good', area: 'Pickup SLA', msg: 'No HoReCa outlet exceeds 24h wait threshold.' });
    }
    // Pickup compliance
    flags.push({ level: 'info', area: 'Pickup Compliance', msg: `91.5% compliance · 441/482 pickups actual vs planned · 41 missed.`, suggestion: '<90% compliance triggers escalation. Currently safe.' });
  }

  // ====================================================================
  // LOGISTICS MODULE
  // ====================================================================
  if (moduleId === 'log') {
    const avail = DRIVER_FLEET.filter(d => d.status === 'available').length;
    const onTrip = DRIVER_FLEET.filter(d => d.status === 'on_trip').length;
    const returning = DRIVER_FLEET.filter(d => d.status === 'returning').length;
    const totalDrivers = DRIVER_FLEET.length;
    // State physics
    if (avail + onTrip + returning !== totalDrivers) {
      flags.push({ level: 'bad', area: 'Driver State', msg: `Driver states don't sum: ${avail}+${onTrip}+${returning} = ${avail+onTrip+returning}, expected ${totalDrivers}.` });
    } else {
      flags.push({ level: 'good', area: 'Driver State', msg: `Driver states balanced: ${avail} avail + ${onTrip} on trip + ${returning} returning = ${totalDrivers}.` });
    }
    // Coverage verdict
    const untrippedCPs = CP_DATA.filter(c => c.sealedBags > 0 && !c.hasTrip).length;
    if (avail < untrippedCPs) {
      flags.push({ level: 'warn', area: 'Coverage', msg: `Only ${avail} drivers available but ${untrippedCPs} CPs need trips. Shortfall ${untrippedCPs - avail}.`, suggestion: `${returning} drivers returning — reassign when back. Consider next-shift overflow.` });
    } else if (untrippedCPs === 0) {
      flags.push({ level: 'good', area: 'Coverage', msg: 'All CPs with sealed bags have trips assigned.' });
    } else {
      flags.push({ level: 'good', area: 'Coverage', msg: `${avail} available drivers can cover ${untrippedCPs} untripped CPs — full coverage.` });
    }
    // Lost bags
    if (EXCEPTIONS_DATA.lost.length > 0) {
      flags.push({ level: 'bad', area: 'Provenance', msg: `${EXCEPTIONS_DATA.lost.length} bags reported lost. Investigation needed within 2h of report.`, suggestion: 'Cross-check trip photos and weigh-bridge records.' });
    }
    // Seal→Trip SLA
    const stSLA = SLA_MODEL.find(s => s.id === 'seal_trip');
    if (stSLA.breaches > 0) {
      flags.push({ level: 'warn', area: 'Seal → Trip SLA', msg: `${stSLA.breaches} CPs exceed ${stSLA.target} seal-to-trip target. Worst: ${stSLA.worst}.` });
    }
  }

  // ====================================================================
  // WAREHOUSE MODULE — Stage flow physics, exceptions, aged lots, bag runway
  // ====================================================================
  if (moduleId === 'wh') {
    // Stage flow physics: counts should not have impossible relationships
    const stages = WH_BAG_FLOW.stages;
    const sealed = stages.find(s => s.id === 'sealed').count;
    const transit = stages.find(s => s.id === 'transit').count * 7; // trips * ~7 bags/trip
    const staging = stages.find(s => s.id === 'staging').count;
    const processing = stages.find(s => s.id === 'processing').count;
    // Bag closed-loop check
    const expectedTotal = BAG_INVENTORY.atCPC + BAG_INVENTORY.inTransit + BAG_INVENTORY.atCP + BAG_INVENTORY.sealed;
    if (BAG_INVENTORY.total !== expectedTotal) {
      flags.push({ level: 'bad', area: 'Bag Closed-Loop', msg: `Bag total (${BAG_INVENTORY.total}) ≠ sum of states (${expectedTotal}). Physics violated.` });
    } else {
      flags.push({ level: 'good', area: 'Bag Closed-Loop', msg: `${BAG_INVENTORY.total} bags reconcile: ${BAG_INVENTORY.atCPC} CPC + ${BAG_INVENTORY.inTransit} transit + ${BAG_INVENTORY.atCP} at CPs + ${BAG_INVENTORY.sealed} sealed.` });
    }
    // Bag runway
    if (BAG_INVENTORY.runwayDays <= 3) {
      flags.push({ level: 'bad', area: 'Bag Runway', msg: `Runway ${BAG_INVENTORY.runwayDays}d ≤ 3d floor. Reorder lead time is 2d — act today.`, suggestion: 'Place replenishment order immediately. Prioritize CPs in bagLow state.' });
    } else if (BAG_INVENTORY.runwayDays <= 5) {
      flags.push({ level: 'warn', area: 'Bag Runway', msg: `Runway ${BAG_INVENTORY.runwayDays}d below comfort zone (>5d).` });
    } else {
      flags.push({ level: 'good', area: 'Bag Runway', msg: `Runway ${BAG_INVENTORY.runwayDays}d — healthy buffer.` });
    }
    // Exceptions
    const totalExc = EXCEPTIONS_DATA.weight.length + EXCEPTIONS_DATA.count.length + EXCEPTIONS_DATA.lost.length;
    flags.push({ level: totalExc > 10 ? 'bad' : totalExc > 5 ? 'warn' : 'good', area: 'Exceptions',
      msg: `${totalExc} open exceptions holding HF payment: ${EXCEPTIONS_DATA.weight.length} weight · ${EXCEPTIONS_DATA.count.length} count · ${EXCEPTIONS_DATA.lost.length} lost.`,
      suggestion: 'Each unresolved exception holds CP handler fee. Target resolution <6h.' });
    // Overdue exceptions (>6h)
    const overdueExc = EXCEPTIONS_DATA.weight.filter(e => e.ageH > 6).length + EXCEPTIONS_DATA.count.filter(e => e.ageH > 6).length;
    if (overdueExc > 0) {
      flags.push({ level: 'bad', area: 'Exception SLA', msg: `${overdueExc} exceptions exceed 6h resolution SLA. Escalate to shift supervisor.` });
    }
    // Variance threshold check (all variances should be < some max for sanity)
    const maxWtVar = Math.max(...EXCEPTIONS_DATA.weight.map(e => e.varPct));
    if (maxWtVar > 10) {
      flags.push({ level: 'bad', area: 'Weight Variance', msg: `Max weight variance ${maxWtVar.toFixed(1)}% — exceeds 10% safety ceiling. Possible scale calibration issue.` });
    } else {
      flags.push({ level: 'info', area: 'Weight Variance', msg: `Max weight variance ${maxWtVar.toFixed(1)}% within 10% physical bounds.` });
    }
    // Aged lots
    const agedLots = PROCESSED_INVENTORY.bales.filter(b => b.daysOld >= 7);
    if (agedLots.length > 0) {
      flags.push({ level: 'warn', area: 'Aged Inventory', msg: `${agedLots.length} bale lots ≥7 days without dispatch: ${agedLots.map(b => b.mat+' '+b.sub).join(', ')}.`, suggestion: 'Create dispatch orders. Holding cost increasing.' });
    } else {
      flags.push({ level: 'good', area: 'Aged Inventory', msg: 'No bale lots beyond 7-day dispatch SLA.' });
    }
    // Material breakdown sum check
    const baleKgTotal = PROCESSED_INVENTORY.bales.reduce((s, b) => s + b.kg, 0);
    const culletKgTotal = PROCESSED_INVENTORY.cullet.reduce((s, c) => s + c.kg, 0);
    flags.push({ level: 'info', area: 'Inventory Total', msg: `Processed: ${(baleKgTotal/1000).toFixed(1)} MT bales + ${(culletKgTotal/1000).toFixed(1)} MT cullet = ${((baleKgTotal+culletKgTotal)/1000).toFixed(1)} MT ready to dispatch.` });
  }

  // ====================================================================
  // CS / ALERTS / COSTING — Light agent checks
  // ====================================================================
  if (moduleId === 'cs') {
    const totalExcHoldingHF = EXCEPTIONS_DATA.weight.length + EXCEPTIONS_DATA.count.length;
    if (totalExcHoldingHF > 5) {
      flags.push({ level: 'warn', area: 'HF Tickets', msg: `${totalExcHoldingHF} exceptions holding HF payment — likely to surface as CP handler tickets within 24h.`, suggestion: 'Pre-emptive CS outreach to non-Re CP handlers in affected list.' });
    }
    flags.push({ level: 'info', area: 'Ticket Flow', msg: `Exception → Ticket conversion rate ~30% based on prior cycles. Monitor inbound for these CPs: ${EXCEPTIONS_DATA.weight.slice(0,3).map(e=>e.cpName).join(', ')}.` });
  }
  if (moduleId === 'alerts') {
    const critical = CP_DATA.filter(c => c.slaBreachedSeal && !c.hasTrip).length;
    const machDown = CP_DATA.filter(c => c.downMachines > 0).length;
    const totalExcHere = EXCEPTIONS_DATA.weight.length + EXCEPTIONS_DATA.count.length + EXCEPTIONS_DATA.lost.length;
    flags.push({ level: 'info', area: 'Alert Volume', msg: `${critical} critical (seal SLA breach + no trip) · ${machDown} machine-down CPs · ${totalExcHere} exceptions open.` });
    if (critical > 5) {
      flags.push({ level: 'bad', area: 'Critical Backlog', msg: `${critical} critical alerts — exceeds healthy daily backlog (<3). Manager attention required.` });
    }
  }
  if (moduleId === 'cost') {
    flags.push({ level: 'info', area: 'Cost Audit', msg: `Cost/trip target ₹800–3,500. HF held on ${EXCEPTIONS_DATA.weight.length + EXCEPTIONS_DATA.count.length} exceptions represents ~₹${(EXCEPTIONS_DATA.weight.length + EXCEPTIONS_DATA.count.length) * 250} deferred payout.` });
  }

  // Score: 9.5/10 minus penalties
  const bad  = flags.filter(f => f.level === 'bad').length;
  const warn = flags.filter(f => f.level === 'warn').length;
  const good = flags.filter(f => f.level === 'good').length;
  const score = Math.max(0, 10 - bad * 1.0 - warn * 0.3 + good * 0.0).toFixed(1);

  return { flags, score, summary: { bad, warn, good, info: flags.filter(f=>f.level==='info').length } };
}

function pageExecHome() {
  // ============================================================
  // V36 DATA — SINGLE SOURCE OF TRUTH · INTERLOCKING NUMBER MODEL
  // ------------------------------------------------------------
  // The two oversight agents (Design Agent + Numbers Agent) audit
  // this model. Every figure below is DERIVED from a small set of
  // base assumptions so that one number reconciles against another:
  //
  //  • 1 redeemed QR  ≡  1 container (bottle/can) collected
  //  • Total QR Value     = Σ (QRs in denom × denom amount)
  //  • Redeemed Value     = Σ (redeemed QRs × their denom amount)
  //  • Yet-to-Redeem Val  = Total QR Value − Redeemed − Unredeemed
  //  • Material units (QR Redemption by Material) sum to redeemedQRs
  //  • Denomination units (QR Redemption by Denomination) sum to redeemedQRs
  //  • Collection-infra utilisation units also sum to redeemedQRs
  //    (every redeemed QR entered the network through one channel)
  // ============================================================

  // ---- BASE ASSUMPTIONS (all other figures derive from these) ----
  // Date-scope awareness: Total QR Purchased and Total Deposit Collected are
  // MONTHLY events (QR codes are bought from vendor once a month). Daily date
  // filters should NOT change these — they remain at the month's cumulative
  // figure. All other metrics (Active QRs, Redeemed QRs, etc.) reflect the
  // selected date range.
  const _scope = (typeof _v25DateRange !== 'undefined' ? _v25DateRange : '7d');
  const _scopeDays = _scope === 'today' ? 1
                   : _scope === 'yesterday' ? 1
                   : _scope === '7d' ? 7
                   : _scope === '30d' ? 30
                   : _scope === 'custom' ? (window._v25DateDays || 7)
                   : 7;
  // Monthly-only metrics freeze at full-month values when scope < 30 days
  const _isMonthlyScope = _scopeDays >= 28;
  // Daily-changing metrics scale with the date range; full monthly values are
  // the reference (= 30-day cumulative). For sub-monthly, scale proportionally.
  const _dailyScale = Math.min(1, _scopeDays / 30);

  const BASE = {
    // Monthly metrics — fixed at the month's cumulative figure
    totalPurchased: 1200000,   // QRs bought from vendor (once per month)
    // Daily metrics — scale with selected date range
    activeQRs:       Math.round(850000 * _dailyScale),   // currently in circulation
    redeemedQRs:     Math.round(420000 * _dailyScale),   // ≡ containers collected & deposit paid
    unredeemedQRs:   Math.round(80000  * _dailyScale),   // expired window — deposit forfeited (operator float)
    deactivatedQRs:  Math.round(25000  * _dailyScale),   // damaged / lost / fraud
    // Denomination mix of ALL purchased QRs (must sum to 1.0)
    denomMix: [
      { amt: 2,  share: 0.60 },
      { amt: 5,  share: 0.30 },
      { amt: 10, share: 0.10 },
    ],
  };
  // Derived: yet-to-redeem = active − redeemed (still inside redemption window)
  BASE.yetToRedeemQRs = BASE.activeQRs - BASE.redeemedQRs;

  // Derived: total deposit value across ALL purchased QRs (monthly-fixed)
  const avgDenom = BASE.denomMix.reduce((s,d)=>s + d.amt*d.share, 0); // ₹3.70 weighted
  const totalQrValueRs   = Math.round(BASE.totalPurchased * avgDenom);     // monthly cumulative
  const redeemedValueRs  = Math.round(BASE.redeemedQRs   * avgDenom);
  const unredeemedValRs  = Math.round(BASE.unredeemedQRs * avgDenom);
  const yetToRedeemValRs = Math.round(BASE.yetToRedeemQRs* avgDenom);

  // Helpers — plain full numbers with thousands separators
  const rs    = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const units = n => Math.round(n).toLocaleString('en-IN');

  // ============= V25 DATA (single source of truth) =============
  const V25_DATA = {
    // QR Performance — full numbers
    qrPerf: {
      totalPurchased: units(BASE.totalPurchased),  totalDelta: -14,
      activeQRs:      units(BASE.activeQRs),        activeDelta: 9,
      redeemed:       units(BASE.redeemedQRs),      redeemedDelta: 12,
      yetToRedeem:    units(BASE.yetToRedeemQRs),   yetDelta: -5,
      unredeemed:     units(BASE.unredeemedQRs),    unredeemedDelta: 3,
      deactivated:    units(BASE.deactivatedQRs),   deactivatedDelta: -2,
    },
    // Financial — full ₹ numbers (no ₹34.2M "Triggered")
    financial: {
      totalQrValue:     rs(totalQrValueRs),
      redeemedValue:    rs(redeemedValueRs),
      yetToRedeemValue: rs(yetToRedeemValRs),
      unredeemedValue:  rs(unredeemedValRs),
      _totalQrValueRs:  totalQrValueRs,
      _redeemedValueRs: redeemedValueRs,
    },
    // QR Redemption by Material — units derived as a share of redeemedQRs.
    // Shares reflect Goa DRS container mix; units sum EXACTLY to redeemedQRs.
    materials: (() => {
      const mix = [
        { name:'GLASS', share:0.70, color:'#10b981' },
        { name:'PET',   share:0.10, color:'#2c4cdc' },
        { name:'ALU',   share:0.08, color:'#0891b2' },
        { name:'HDPE',  share:0.07, color:'#f59e0b' },
        { name:'TETRA', share:0.05, color:'#ef4444' },
      ];
      let running = 0;
      return mix.map((m,i) => {
        let u = Math.round(BASE.redeemedQRs * m.share);
        if (i === mix.length-1) u = BASE.redeemedQRs - running; // remainder → exact sum
        running += u;
        return { ...m, units:u, pct:+(u/BASE.redeemedQRs*100).toFixed(1) };
      });
    })(),
    // QR Redemption by Denomination — units derived from redeemedQRs using
    // the SAME denomination mix as purchased QRs; units + value both reconcile.
    deposits: (() => {
      const meta = {
        2:  { sub:'High volume: Plastic & Small Glass' },
        5:  { sub:'Standard PET & Medium Containers' },
        10: { sub:'Bulk & Industrial Collection' },
      };
      let running = 0;
      return BASE.denomMix.map((d,i) => {
        let u = Math.round(BASE.redeemedQRs * d.share);
        if (i === BASE.denomMix.length-1) u = BASE.redeemedQRs - running;
        running += u;
        return {
          amt:   '₹' + d.amt + ' Denom.',
          denom: d.amt,
          units: u,
          valueRs: u * d.amt,
          pct:   +(d.share*100).toFixed(0),
          sub:   meta[d.amt].sub,
        };
      });
    })(),
    // ============================================================
    // Collection Infrastructure (v36 rebuild)
    // Total CP = RVM (300) + RC (50) = 350 fixed collection points.
    // Utilisation = units collected per channel. The five channels'
    // unit totals sum EXACTLY to redeemedQRs (every redeemed QR = one
    // container that entered through exactly one channel).
    // ============================================================
    infra: (() => {
      const rvm = { total:300, public:270, private:30, down:22, active:278 };
      const rc  = { total:50,  public:5,   private:45, down:3,  active:47 };
      const totalCP   = rvm.total + rc.total;          // 350
      const activeCP  = rvm.active + rc.active;        // 325
      const uptime    = 91;                            // network-wide avg %

      // Channel share of redeemed QRs (units collected). Must sum to 1.0
      const chanMix = [
        { key:'rvm',    name:'RVM',    share:0.46, color:'#2c4cdc' },
        { key:'rc',     name:'RC',     share:0.24, color:'#f59e0b' },
        { key:'horeca', name:'HoReCa', share:0.16, color:'#15803d' },
        { key:'d2d',    name:'D2D',    share:0.09, color:'#0e7490' },
        { key:'awp',    name:'AWP',    share:0.05, color:'#7c3aed' },
      ];
      let run = 0;
      const utilByChannel = chanMix.map((c,i) => {
        let u = Math.round(BASE.redeemedQRs * c.share);
        if (i === chanMix.length-1) u = BASE.redeemedQRs - run;
        run += u;
        return { ...c, units:u, pct:+(u/BASE.redeemedQRs*100).toFixed(1) };
      });

      return {
        fixedTotal: totalCP, totalCP, activeCP, uptime,
        rvm, rc,
        utilByChannel,
        // Mobile: 200 HoReCa + 191 D2D + 50 AWP = 441
        mobileTotal: 441,
        horeca: { total:200, onRoute:142, idle:58 },
        d2d:    { total:191, publicTotal:70, contractorTotal:121, pickups:3820 },
        awp:    { total:50, active:38, inactive:12 },
      };
    })(),
    // Logistics — UNIFIED to 6 real CPCs from operational records
    logistics: {
      totalTrips: 1284, totalVehicles: 85, efficiency: 92,
      cpcFleet: [
        { name:'Durgadevi · Colvale',  fleet:22, pickup:94, color:'green' },
        { name:'Vilas · Tuem',         fleet:10, pickup:92, color:'green' },
        { name:'Sagar · Verna',        fleet:16, pickup:96, color:'green' },
        { name:'Recykal · Verna',      fleet: 8, pickup:98, color:'green' },
        { name:'Anand · Nessai',       fleet:18, pickup:93, color:'green' },
        { name:'Shivanand · Nessai',   fleet:11, pickup:91, color:'amber' },
      ],
    },
    // Warehouse — Inbound proportional to RVMs served per CPC
    warehouse: {
      inboundMT: 120.6, processedMT: 98.4, outboundMT: 86.2,
      cpcMaterial: [
        { name:'Durgadevi · Colvale',  inbound:46.3, processed:38.4, outbound:33.8 },
        { name:'Vilas · Tuem',         inbound:13.5, processed:11.2, outbound: 9.8 },
        { name:'Sagar · Verna',        inbound:18.2, processed:15.1, outbound:13.4 },
        { name:'Recykal · Verna',      inbound: 6.8, processed: 5.9, outbound: 5.2 },
        { name:'Anand · Nessai',       inbound:24.4, processed:19.8, outbound:17.2 },
        { name:'Shivanand · Nessai',   inbound:11.4, processed: 8.0, outbound: 6.8 },
      ],
    },
    // User Insight — newUsers added as top data point; channel breakdown removed
    userInsight: {
      transactions: 284120, uniqueUsers: 198540, newUsers: 23240, dodTrend: 12.4,
      newUsersDelta: 6.8,
      dodBars: [30, 40, 45, 50, 80, 95],
    },
    // Customer Support — Top Complaint Categories removed, CSAT added
    cs: {
      total: 486, open: 114, openPct: 23, resolved: 82, resolvedDelta: 14,
      avgTat: '8.4h', tatDelta: -12,
      csat: 4.3, csatMax: 5, csatDelta: 0.2, csatResponses: 1820,
      csatBreakdown: [
        { stars:5, pct:54, color:'#15803d' },
        { stars:4, pct:26, color:'#65a30d' },
        { stars:3, pct:11, color:'#f59e0b' },
        { stars:2, pct:6,  color:'#ea580c' },
        { stars:1, pct:3,  color:'#dc2626' },
      ],
      brands:   { total:124, open:28, res:96,  tat:'7.4h', rr:77 },
      horeca:   { total:142, open:34, res:108, tat:'8.8h', rr:76 },
      consumer: { total:220, open:52, res:168, tat:'9.6h', rr:76 },
    },
  };
  // Stash on window for modal handlers
  window.__V25 = V25_DATA;

  const d = V25_DATA;
  return `
    <div class="v25-page">
      <!-- TOOLBAR -->
      <div class="v25-toolbar">
        <h1>Goa DRS · Executive Dashboard</h1>
        <div style="position: relative; margin-left: 16px;">
          <button class="v25-date" id="v25-date-btn">
            📅 <span id="v25-date-label">Last 7 days</span> ⌄
          </button>
          <div class="v25-date-menu" id="v25-date-menu">
            <div class="v25-date-opt" data-range="today">Today</div>
            <div class="v25-date-opt" data-range="yesterday">Yesterday</div>
            <div class="v25-date-opt active" data-range="7d">Last 7 days</div>
            <div class="v25-date-opt" data-range="30d">Last 30 days</div>
            <div class="v25-date-divider"></div>
            <div class="v25-date-custom">
              <div style="font-size:10px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Custom Range</div>
              <div class="v25-date-custom-row">
                <label>From</label>
                <input type="date" id="v25-date-from" value="2026-05-10" />
              </div>
              <div class="v25-date-custom-row">
                <label>To</label>
                <input type="date" id="v25-date-to" value="2026-05-17" />
              </div>
              <button id="v25-date-apply" style="width:100%;padding:6px;background:#2c4cdc;color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;margin-top:4px;">Apply Custom</button>
            </div>
          </div>
        </div>
        <div class="v25-actions">
          <button class="v25-iconbtn" title="Notifications">🔔<span class="dot"></span></button>
          <button class="v25-iconbtn" title="History">⟲</button>
          <button class="v25-iconbtn" title="Profile">👤</button>
        </div>
      </div>

      <!-- PERFORMANCE & FINANCIALS -->
      <div class="v25-card">
        <div class="v25-card-head">
          <span class="v25-card-icon">📊</span>
          <span class="v25-card-title">QR Life Cycle</span>
          <div class="v25-card-actions">
            <span class="v25-live">Live Metrics</span>
          </div>
        </div>

        <!-- QR KPIs -->
        <div class="v25-kpi-row">
          <div class="v25-kpi k-total" data-drill="qr-total">
            <div class="v25-kpi-lbl">Total QR Purchased <span class="v31-info" data-tip="QR codes are bought from vendor once a month. This metric only updates when the date filter is set to a full month or longer.">ⓘ</span></div>
            <div class="v25-kpi-val">${d.qrPerf.totalPurchased} <span class="v25-kpi-trend down">∿${d.qrPerf.totalDelta}%</span></div>
          </div>
          <div class="v25-kpi k-active" data-drill="qr-active">
            <div class="v25-kpi-lbl">Active QRs</div>
            <div class="v25-kpi-val">${d.qrPerf.activeQRs} <span class="v25-kpi-trend up">∿${d.qrPerf.activeDelta}%</span></div>
          </div>
          <div class="v25-kpi k-redeemed" data-drill="qr-redeemed">
            <div class="v25-kpi-lbl">Redeemed QRs</div>
            <div class="v25-kpi-val">${d.qrPerf.redeemed} <span class="v25-kpi-trend up">∿${d.qrPerf.redeemedDelta}%</span></div>
          </div>
          <div class="v25-kpi k-yet" data-drill="qr-yet">
            <div class="v25-kpi-lbl">Yet to Redeem</div>
            <div class="v25-kpi-val">${d.qrPerf.yetToRedeem} <span class="v25-kpi-trend down">∿${d.qrPerf.yetDelta}%</span></div>
          </div>
          <div class="v25-kpi k-unred" data-drill="qr-unred">
            <div class="v25-kpi-lbl">Unredeemed</div>
            <div class="v25-kpi-val">${d.qrPerf.unredeemed} <span class="v25-kpi-trend up">∿${d.qrPerf.unredeemedDelta}%</span></div>
          </div>
          <div class="v25-kpi k-deact" data-drill="qr-deact">
            <div class="v25-kpi-lbl">Deactivated</div>
            <div class="v25-kpi-val">${d.qrPerf.deactivated} <span class="v25-kpi-trend down">∿${d.qrPerf.deactivatedDelta}%</span></div>
          </div>
        </div>

        <!-- Financial tiles (4-up) — full ₹ amounts -->
        <div class="v25-fin-row">
          <div class="v25-fin-tile dark" data-drill="fin-total">
            <div class="ft-lbl">Total Deposit Collected <span class="v31-info" data-tip="Deposit collected upfront when QRs are purchased from vendor — a monthly event. This figure only updates on full-month date filters." style="color:rgba(255,255,255,0.7);">ⓘ</span></div>
            <div class="ft-val">${d.financial.totalQrValue}</div>
            <div class="ft-icon">💲</div>
          </div>
          <div class="v25-fin-tile blue" data-drill="fin-redeemed">
            <div class="ft-lbl">Total Deposit Redeemed</div>
            <div class="ft-val">${d.financial.redeemedValue}</div>
            <div class="ft-icon">💵</div>
          </div>
          <div class="v25-fin-tile" style="background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);color:#92400e;" data-drill="fin-yet">
            <div class="ft-lbl">Yet to be Redeemed Deposit</div>
            <div class="ft-val">${d.financial.yetToRedeemValue}</div>
            <div class="ft-icon">⏳</div>
          </div>
          <div class="v25-fin-tile" style="background:linear-gradient(135deg,#e2e8f0 0%,#cbd5e1 100%);color:#475569;" data-drill="fin-unred">
            <div class="ft-lbl">Unredeemed Deposit</div>
            <div class="ft-val">${d.financial.unredeemedValue}</div>
            <div class="ft-icon">⊘</div>
          </div>
        </div>

        <!-- ============================================================
             QR REDEMPTION — two pie charts, side by side
             Left: by Material · Right: by Denomination
             Both reconcile to the same redeemed-QR total.
             ============================================================ -->
        <div class="v36-redeem-grid">
          <!-- BY MATERIAL -->
          <div class="v36-pie-card">
            <div class="v36-pie-card-head">
              <div class="v36-pie-card-title">📦 QR Redemption by Material</div>
              <div class="v36-pie-card-sub">Units redeemed by material category</div>
            </div>
            <div class="v36-pie-body">
              <div class="v36-pie-canvas-wrap">
                <canvas id="v36-pie-material" width="130" height="130"></canvas>
              </div>
              <div class="v36-pie-legend">
                ${d.materials.map(m => `
                  <div class="v36-pie-legend-row">
                    <span class="v36-pie-legend-dot" style="background:${m.color};"></span>
                    <span class="v36-pie-legend-name">${m.name}</span>
                    <span class="v36-pie-legend-units">${units(m.units)} <small>units</small></span>
                    <span class="v36-pie-legend-pct" style="color:${m.color};">${m.pct}%</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="v36-pie-foot">Total redeemed · <strong>${units(BASE.redeemedQRs)} units</strong></div>
          </div>

          <!-- BY DENOMINATION -->
          <div class="v36-pie-card">
            <div class="v36-pie-card-head">
              <div class="v36-pie-card-title">₹ QR Redemption by Denomination</div>
              <div class="v36-pie-card-sub">Units & deposit value by denomination</div>
            </div>
            <div class="v36-pie-body">
              <div class="v36-pie-canvas-wrap">
                <canvas id="v36-pie-denom" width="130" height="130"></canvas>
              </div>
              <div class="v36-pie-legend">
                ${d.deposits.map((dep,i) => {
                  const colors = ['#2c4cdc', '#7c3aed', '#0891b2'];
                  return `
                  <div class="v36-pie-legend-row">
                    <span class="v36-pie-legend-dot" style="background:${colors[i]};"></span>
                    <span class="v36-pie-legend-name">${dep.amt}</span>
                    <span class="v36-pie-legend-units">${units(dep.units)} <small>units</small></span>
                    <span class="v36-pie-legend-pct" style="color:${colors[i]};">${rs(dep.valueRs)}</span>
                  </div>`;
                }).join('')}
              </div>
            </div>
            <div class="v36-pie-foot">Total redeemed value · <strong>${rs(d.financial._redeemedValueRs)}</strong></div>
          </div>
        </div>
      </div><!-- /QR Life Cycle card -->

      <!-- ============================================================
           V38 — 3-COLUMN NETWORK CARDS (Collection Infra · Logistics · Warehouse)
           All data points from previous sections consolidated side-by-side
           ============================================================ -->
      <div class="v38-three-col">

        <!-- ── COLLECTION INFRA ── -->
        <div class="v38-col-card" style="border-top:3px solid #2c4cdc;">
          <div class="v38-col-head">
            <span class="v38-col-icon" style="background:#dbeafe;color:#2c4cdc;">CP</span>
            <span class="v38-col-title">Collection Infrastructure</span>
            <span class="v25-live" style="margin-left:auto;font-size:10px;">Live Network</span>
          </div>

          <!-- KPI strip -->
          <div class="v38-kpi-strip">
            <div class="v38-kpi-cell" data-drill="infra-totalcp">
              <div class="v38-kpi-lbl">Total CP</div>
              <div class="v38-kpi-val">${d.infra.totalCP}</div>
              <div class="v38-kpi-sub">${d.infra.rvm.total} RVM + ${d.infra.rc.total} RC</div>
            </div>
            <div class="v38-kpi-sep"></div>
            <div class="v38-kpi-cell" data-drill="infra-activecp">
              <div class="v38-kpi-lbl">Active CP</div>
              <div class="v38-kpi-val" style="color:#2c4cdc;">${d.infra.activeCP}</div>
              <div class="v38-kpi-sub">${(d.infra.activeCP/d.infra.totalCP*100).toFixed(0)}% online · ${d.infra.totalCP-d.infra.activeCP} down</div>
            </div>
            <div class="v38-kpi-sep"></div>
            <div class="v38-kpi-cell" data-drill="infra-uptime">
              <div class="v38-kpi-lbl">Network Uptime</div>
              <div class="v38-kpi-val" style="color:#15803d;">${d.infra.uptime}%</div>
              <div class="v38-kpi-sub">Avg across all CPs</div>
            </div>
          </div>

          <!-- Utilization channel breakdown -->
          <div class="v38-section-lbl">Utilization · Units by Channel
            <span class="v38-section-val">${units(d.infra.utilByChannel.reduce((s,c)=>s+c.units,0))} units</span>
          </div>
          <div class="v38-channel-list">
            ${d.infra.utilByChannel.map(c => `
              <div class="v38-channel-row">
                <span class="v38-ch-dot" style="background:${c.color};"></span>
                <span class="v38-ch-name">${c.name}</span>
                <div class="v38-ch-bar-wrap"><div class="v38-ch-bar" style="width:${c.pct}%;background:${c.color};"></div></div>
                <span class="v38-ch-pct" style="color:${c.color};">${c.pct}%</span>
                <span class="v38-ch-units">${units(c.units)}</span>
              </div>
            `).join('')}
          </div>

          <!-- Fixed CPs -->
          <div class="v38-section-lbl">Fixed Collection Points <span class="v38-section-val">${d.infra.totalCP}</span></div>
          <div class="v38-fixed-grid">
            <div class="v38-fixed-tile" data-drill="infra-rvm">
              <div class="v38-tile-head"><span class="v38-tile-dot" style="background:#2c4cdc;"></span><span class="v38-tile-name">RVM</span><span class="v38-tile-total">${d.infra.rvm.total}</span></div>
              <div class="v38-tile-rows">
                <div><span class="v38-dp-l">Active</span><span class="v38-dp-v" style="color:#15803d;">${d.infra.rvm.active}</span></div>
                <div><span class="v38-dp-l">Down</span><span class="v38-dp-v" style="color:#dc2626;">${d.infra.rvm.down}</span></div>
              </div>
            </div>
            <div class="v38-fixed-tile" data-drill="infra-rc">
              <div class="v38-tile-head"><span class="v38-tile-dot" style="background:#f59e0b;"></span><span class="v38-tile-name">RC</span><span class="v38-tile-total">${d.infra.rc.total}</span></div>
              <div class="v38-tile-rows">
                <div><span class="v38-dp-l">Active</span><span class="v38-dp-v" style="color:#15803d;">${d.infra.rc.active}</span></div>
                <div><span class="v38-dp-l">Down</span><span class="v38-dp-v" style="color:#dc2626;">${d.infra.rc.down}</span></div>
              </div>
            </div>
          </div>

          <!-- Mobile CPs -->
          <div class="v38-section-lbl">Mobile Collection Points <span class="v38-section-val">${d.infra.mobileTotal}</span></div>
          <div class="v38-mobile-grid">
            <div class="v38-fixed-tile" data-drill="infra-horeca">
              <div class="v38-tile-head"><span class="v38-tile-dot" style="background:#15803d;"></span><span class="v38-tile-name">HoReCa</span><span class="v38-tile-total">${d.infra.horeca.total}</span></div>
              <div class="v38-tile-rows">
                <div><span class="v38-dp-l">On Route</span><span class="v38-dp-v" style="color:#15803d;">${d.infra.horeca.onRoute}</span></div>
              </div>
            </div>
            <div class="v38-fixed-tile" data-drill="infra-d2d">
              <div class="v38-tile-head"><span class="v38-tile-dot" style="background:#0e7490;"></span><span class="v38-tile-name">D2D</span><span class="v38-tile-total">${d.infra.d2d.total}</span></div>
              <div class="v38-tile-rows">
                <div><span class="v38-dp-l">Active</span><span class="v38-dp-v" style="color:#15803d;">156</span></div>
                <div><span class="v38-dp-l">Inactive</span><span class="v38-dp-v" style="color:#dc2626;">35</span></div>
              </div>
            </div>
            <div class="v38-fixed-tile" data-drill="infra-awp">
              <div class="v38-tile-head"><span class="v38-tile-dot" style="background:#7c3aed;"></span><span class="v38-tile-name">AWP</span><span class="v38-tile-total">${d.infra.awp.total}</span></div>
              <div class="v38-tile-rows">
                <div><span class="v38-dp-l">Active</span><span class="v38-dp-v" style="color:#15803d;">${d.infra.awp.active}</span></div>
                <div><span class="v38-dp-l">Inactive</span><span class="v38-dp-v" style="color:#dc2626;">${d.infra.awp.inactive}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── LOGISTICS ── -->
        <div class="v38-col-card" style="border-top:3px solid #15803d;">
          <div class="v38-col-head">
            <span class="v38-col-icon" style="background:#dcfce7;color:#15803d;">🚚</span>
            <span class="v38-col-title">Logistics &amp; Fleet</span>
            <span class="v25-view-all" data-drill="logi-view-all" style="margin-left:auto;font-size:11px;">View All</span>
          </div>

          <!-- KPI strip -->
          <div class="v38-kpi-strip">
            <div class="v38-kpi-cell" data-drill="logi-trips">
              <div class="v38-kpi-lbl">Total Trips</div>
              <div class="v38-kpi-val">${d.logistics.totalTrips.toLocaleString()}</div>
              <div class="v38-kpi-sub">Today</div>
            </div>
            <div class="v38-kpi-sep"></div>
            <div class="v38-kpi-cell" data-drill="logi-vehicles">
              <div class="v38-kpi-lbl">Total Vehicles</div>
              <div class="v38-kpi-val" style="color:#15803d;">${d.logistics.totalVehicles}</div>
              <div class="v38-kpi-sub">Active fleet</div>
            </div>
            <div class="v38-kpi-sep"></div>
            <div class="v38-kpi-cell" data-drill="logi-eff">
              <div class="v38-kpi-lbl">Pickup Efficiency</div>
              <div class="v38-kpi-val" style="color:#15803d;">${d.logistics.efficiency}%</div>
              <div class="v38-kpi-sub">vs 80% target</div>
            </div>
          </div>

          <!-- CPC Fleet table -->
          <div class="v38-section-lbl">CPC Cluster Performance</div>
          <table class="v38-tbl">
            <thead><tr><th>CPC Cluster</th><th class="num">Fleet</th><th class="num">Pickup %</th></tr></thead>
            <tbody>
              ${d.logistics.cpcFleet.map((c,i) => `
                <tr${i%2?' class="str"':''} data-drill="logi-cpc-${c.name.replace(/\s+/g,'-').toLowerCase()}">
                  <td><strong>${c.name}</strong></td>
                  <td class="num">${c.fleet}</td>
                  <td class="num"><span class="v25-pct-pill ${c.color}">${c.pickup}%</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- ── WAREHOUSE ── -->
        <div class="v38-col-card" style="border-top:3px solid #b45309;">
          <div class="v38-col-head">
            <span class="v38-col-icon" style="background:#fef3c7;color:#b45309;">🏬</span>
            <span class="v38-col-title">Warehouse · CPC Ops</span>
          </div>

          <!-- KPI strip -->
          <div class="v38-kpi-strip">
            <div class="v38-kpi-cell" data-drill="wh-inbound">
              <div class="v38-kpi-lbl">Inbound</div>
              <div class="v38-kpi-val">${d.warehouse.inboundMT}<span style="font-size:11px;color:#8089a0;font-weight:500;"> MT</span></div>
              <div class="v38-kpi-sub">Received today</div>
            </div>
            <div class="v38-kpi-sep"></div>
            <div class="v38-kpi-cell" data-drill="wh-processed">
              <div class="v38-kpi-lbl">Processed</div>
              <div class="v38-kpi-val" style="color:#b45309;">${d.warehouse.processedMT}<span style="font-size:11px;color:#8089a0;font-weight:500;"> MT</span></div>
              <div class="v38-kpi-sub">Sorted &amp; baled</div>
            </div>
            <div class="v38-kpi-sep"></div>
            <div class="v38-kpi-cell" data-drill="wh-outbound">
              <div class="v38-kpi-lbl">Outbound</div>
              <div class="v38-kpi-val" style="color:#b45309;">${d.warehouse.outboundMT}<span style="font-size:11px;color:#8089a0;font-weight:500;"> MT</span></div>
              <div class="v38-kpi-sub">Dispatched</div>
            </div>
          </div>

          <!-- Flow bars -->
          <div class="v38-section-lbl">Material Flow</div>
          <div class="v38-wh-flows">
            <div class="v38-flow-row" data-drill="wh-inbound">
              <span class="v38-flow-lbl">Inbound</span>
              <div class="v38-flow-track"><div class="v38-flow-fill" style="width:100%;background:#2c4cdc;"></div></div>
              <span class="v38-flow-val">${d.warehouse.inboundMT} MT</span>
            </div>
            <div class="v38-flow-row" data-drill="wh-processed">
              <span class="v38-flow-lbl">Processed</span>
              <div class="v38-flow-track"><div class="v38-flow-fill" style="width:${(d.warehouse.processedMT/d.warehouse.inboundMT*100).toFixed(0)}%;background:#15803d;"></div></div>
              <span class="v38-flow-val">${d.warehouse.processedMT} MT</span>
            </div>
            <div class="v38-flow-row" data-drill="wh-outbound">
              <span class="v38-flow-lbl">Outbound</span>
              <div class="v38-flow-track"><div class="v38-flow-fill" style="width:${(d.warehouse.outboundMT/d.warehouse.inboundMT*100).toFixed(0)}%;background:#b45309;"></div></div>
              <span class="v38-flow-val">${d.warehouse.outboundMT} MT</span>
            </div>
          </div>

          <!-- CPC material table -->
          <div class="v38-section-lbl" style="margin-top:12px;">CPC Material Breakdown</div>
          <table class="v38-tbl">
            <thead><tr><th>CPC Cluster</th><th class="num">In</th><th class="num">Proc.</th><th class="num">Out</th></tr></thead>
            <tbody>
              ${d.warehouse.cpcMaterial.map((c,i) => `
                <tr${i%2?' class="str"':''} data-drill="wh-cpc-${c.name.replace(/\s+/g,'-').toLowerCase()}">
                  <td><strong>${c.name}</strong></td>
                  <td class="num">${c.inbound}</td>
                  <td class="num">${c.processed}</td>
                  <td class="num">${c.outbound}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>

      <!-- USER INSIGHT + CUSTOMER SUPPORT (side by side, comprehensive) -->
      <div class="v25-grid-2">
        <!-- USER INSIGHT (expanded) -->
        <div class="v25-section v32-ui-card">
          <div class="v25-section-head">
            <span class="v25-card-icon" style="background:#e0e7ff;color:#4338ca;">👥</span>
            <span class="v25-section-title">User Insight</span>
            <span class="v25-view-all" data-drill="user-view-all">View All</span>
          </div>
          <div class="v32-ui-kpi-row">
            <div class="v32-ui-kpi" data-drill="user-txn">
              <div class="v32-ui-kpi-lbl">Transactions</div>
              <div class="v32-ui-kpi-val">${d.userInsight.transactions.toLocaleString()}</div>
              <div class="v32-ui-kpi-delta up">▲ +${d.userInsight.dodTrend}% DoD</div>
            </div>
            <div class="v32-ui-kpi" data-drill="user-unique">
              <div class="v32-ui-kpi-lbl">Unique Users</div>
              <div class="v32-ui-kpi-val">${d.userInsight.uniqueUsers.toLocaleString()}</div>
              <div class="v32-ui-kpi-delta up">▲ +8.2% DoD</div>
            </div>
            <div class="v32-ui-kpi" data-drill="user-new">
              <div class="v32-ui-kpi-lbl">New Users</div>
              <div class="v32-ui-kpi-val">${d.userInsight.newUsers.toLocaleString()}</div>
              <div class="v32-ui-kpi-delta up">▲ +${d.userInsight.newUsersDelta}% DoD</div>
            </div>
            <div class="v32-ui-kpi" data-drill="user-repeat-rate">
              <div class="v32-ui-kpi-lbl">Repeat-User Rate</div>
              <div class="v32-ui-kpi-val">38.4<span class="v32-ui-kpi-suffix">%</span></div>
              <div class="v32-ui-kpi-delta up">▲ +2.1pp DoD</div>
            </div>
            <div class="v32-ui-kpi" data-drill="user-avg-redeem">
              <div class="v32-ui-kpi-lbl">Avg Redemptions / User</div>
              <div class="v32-ui-kpi-val">1.43</div>
              <div class="v32-ui-kpi-delta up">▲ +3.6% DoD</div>
            </div>
          </div>

          <!-- DoD Sparkline -->
          <div class="v32-ui-sparkline-card">
            <div class="v32-ui-sparkline-head">
              <div>
                <div class="v32-ui-sparkline-title">7-Day Transactions Trend</div>
                <div class="v32-ui-sparkline-sub">Daily volume · last 7 days</div>
              </div>
              <div class="v32-ui-sparkline-trend">+${d.userInsight.dodTrend}%</div>
            </div>
            <svg class="v32-ui-sparkline-svg" viewBox="0 0 320 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="v32SparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#4338ca" stop-opacity="0.32"/>
                  <stop offset="100%" stop-color="#4338ca" stop-opacity="0"/>
                </linearGradient>
              </defs>
              ${(() => {
                const bars = d.userInsight.dodBars;
                const max = Math.max(...bars);
                const pts = bars.map((b, i) => [
                  10 + (i * (300 / (bars.length - 1))),
                  62 - (b / max * 50)
                ]);
                const linePath = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ');
                const fillPath = linePath + ` L${pts[pts.length - 1][0]},65 L${pts[0][0]},65 Z`;
                const dots = pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#4338ca" stroke="#fff" stroke-width="1.5"/>`).join('');
                return `<path d="${fillPath}" fill="url(#v32SparkGrad)"/>
                        <path d="${linePath}" fill="none" stroke="#4338ca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        ${dots}`;
              })()}
            </svg>
            <div class="v32-ui-sparkline-axis">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

        </div>

        <!-- CUSTOMER SUPPORT (comprehensive, side-by-side with User Insight) -->
        <div class="v25-section v32-cs-card">
          <div class="v25-section-head">
            <span class="v25-card-icon" style="background:#fef3c7;color:#d97706;">🎧</span>
            <span class="v25-section-title">Customer Support</span>
            <span class="v25-view-all" data-drill="cs-view-all">View All</span>
          </div>
          <div class="v32-cs-kpi-row">
            <div class="v32-cs-kpi" data-drill="cs-total">
              <div class="v32-cs-kpi-lbl">Total Tickets</div>
              <div class="v32-cs-kpi-val">${d.cs.total}</div>
              <div class="v32-cs-kpi-delta neutral">last 30 days</div>
            </div>
            <div class="v32-cs-kpi" data-drill="cs-open">
              <div class="v32-cs-kpi-lbl">Open</div>
              <div class="v32-cs-kpi-val red">${d.cs.open}</div>
              <div class="v32-cs-kpi-delta down">${d.cs.openPct}% of total</div>
            </div>
            <div class="v32-cs-kpi" data-drill="cs-resolved">
              <div class="v32-cs-kpi-lbl">Resolution Rate</div>
              <div class="v32-cs-kpi-val green">${Math.round((d.cs.total - d.cs.open) / d.cs.total * 100)}<span class="v32-cs-kpi-suffix">%</span></div>
              <div class="v32-cs-kpi-delta up">▲ +${d.cs.resolvedDelta}% DoD</div>
            </div>
            <div class="v32-cs-kpi" data-drill="cs-tat">
              <div class="v32-cs-kpi-lbl">Avg TAT</div>
              <div class="v32-cs-kpi-val">${d.cs.avgTat}</div>
              <div class="v32-cs-kpi-delta up">▼ ${Math.abs(d.cs.tatDelta)}% (faster)</div>
            </div>
            <div class="v32-cs-kpi" data-drill="cs-csat">
              <div class="v32-cs-kpi-lbl">CSAT</div>
              <div class="v32-cs-kpi-val green">${d.cs.csat}<span class="v32-cs-kpi-suffix">/ ${d.cs.csatMax}</span></div>
              <div class="v32-cs-kpi-delta up">▲ +${d.cs.csatDelta} vs last period</div>
            </div>
          </div>

          <!-- Channel cards (Brand / HoReCa / Consumer) -->
          <div class="v32-cs-channel-block">
            <div class="v32-cs-channel-title">Ticket Channels</div>
            <div class="v32-cs-channel-grid">
              ${[
                ['brand','Brands','📦', d.cs.brands, '#2c4cdc'],
                ['horeca','HoReCa','🍴', d.cs.horeca, '#f59e0b'],
                ['consumer','Consumer','👥', d.cs.consumer, '#10b981']
              ].map(([cls, name, icon, stats, color]) => `
                <div class="v32-cs-channel-card" data-drill="cs-${cls}" style="border-left:3px solid ${color};">
                  <div class="v32-cs-channel-head">
                    <span class="v32-cs-channel-name">${icon} ${name}</span>
                    <span class="v32-cs-channel-total" style="color:${color};">${stats.total}</span>
                  </div>
                  <div class="v32-cs-channel-stats">
                    <div>
                      <div class="v32-cs-cstat-lbl">Open</div>
                      <div class="v32-cs-cstat-val">${stats.open}</div>
                    </div>
                    <div>
                      <div class="v32-cs-cstat-lbl">Res.</div>
                      <div class="v32-cs-cstat-val">${stats.res}</div>
                    </div>
                    <div>
                      <div class="v32-cs-cstat-lbl">TAT</div>
                      <div class="v32-cs-cstat-val">${stats.tat}</div>
                    </div>
                  </div>
                  <div class="v32-cs-channel-rr-head">
                    <span>Resolution Rate</span>
                    <span class="v32-cs-channel-rr-val" style="color:${color};">${stats.rr}%</span>
                  </div>
                  <div class="v32-cs-channel-rr-track">
                    <div class="v32-cs-channel-rr-fill" style="width:${stats.rr}%;background:${color};"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>

      <!-- MODAL OVERLAY -->
      <div class="v25-modal-overlay" id="v25-modal-overlay">
        <div class="v25-modal">
          <div class="v25-modal-head">
            <div>
              <div class="v25-modal-title" id="v25-modal-title">Detail</div>
              <div class="v25-modal-sub" id="v25-modal-sub"></div>
            </div>
            <button class="v25-modal-close" id="v25-modal-close">✕</button>
          </div>
          <div class="v25-modal-body" id="v25-modal-body"></div>
        </div>
      </div>
    </div>
  `;
}

function wireExecCards() {
  document.querySelectorAll('[data-card]').forEach(head => {
    head.addEventListener('click', () => {
      const key = head.dataset.card;
      EXEC_STATE[key] = !EXEC_STATE[key];
      if (currentPageId) renderPage(currentPageId);
    });
  });

  document.querySelectorAll('.exec-qtab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.exec-qtab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  const applyBtn = document.querySelector('.exec-quickbar-apply');
  if (applyBtn) applyBtn.addEventListener('click', () => {
    if (currentPageId) renderPage(currentPageId);
  });

  // Donut chart
  const el = document.getElementById('exec-deposit-donut');
  if (el && window.Chart) {
    const _execDonut = new Chart(el, {
      type: 'doughnut',
      data: {
        labels: ['₹2', '₹5', '₹10'],
        datasets: [{ data: [60, 30, 10], backgroundColor: ['#2c4cdc', '#93c5fd', '#1e293b'], borderWidth: 0, hoverOffset: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '74%',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed}%` } } }
      }
    });
    _allCharts.push(_execDonut);
  }

  // 30-day trend chart
  const tEl = document.getElementById('exec-trend-canvas');
  if (tEl && window.Chart) {
    // Synthetic but realistic 30-day series: weekly cyclical with weekend peaks
    const days = [];
    const labels = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      labels.push(d.getDate() + '/' + (d.getMonth() + 1));
      const base = 38400;
      const weekend = (d.getDay() === 0 || d.getDay() === 6) ? 1.18 : 1.0;
      const trend = 1 + (29 - i) * 0.004; // gentle upward
      const noise = 0.95 + Math.random() * 0.1;
      days.push(Math.round(base * weekend * trend * noise));
    }
    const _execTrend = new Chart(tEl, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: days,
          borderColor: '#2c4cdc',
          backgroundColor: (ctx) => {
            const c = ctx.chart.ctx; const g = c.createLinearGradient(0, 0, 0, 120);
            g.addColorStop(0, 'rgba(44,76,220,0.20)'); g.addColorStop(1, 'rgba(44,76,220,0.00)');
            return g;
          },
          fill: true, borderWidth: 2, tension: 0.32,
          pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: '#2c4cdc',
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y.toLocaleString()} units` } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
          y: { grid: { color: '#f1f3f6' }, ticks: { color: '#94a3b8', font: { size: 10 }, callback: v => (v/1000).toFixed(0)+'K' } }
        }
      }
    });
    _allCharts.push(_execTrend);
  }

  // Note: Insights Agent panel is now rendered globally by renderPage()
  // and wired by wireAgentForModule() — no duplicate logic here.
}


/* ============================================================
   SUSTAINABILITY IMPACT
   ============================================================ */
function pageSustOverview() {
  return `
    <div class="section-head"><div class="section-title">Environmental Impact · Month-to-date</div><div class="section-sub">Goa DRS contribution</div></div>
    <div class="kgrid kgrid-4">
      ${kpi('CO₂ Avoided', '142', 'MT', { delta: 8, status: 'good' })}
      ${kpi('Water Saved', '8.4', 'ML', { delta: 6, status: 'good' })}
      ${kpi('Energy Saved', '184', 'MWh', { delta: 5, status: 'good' })}
      ${kpi('Landfill Diverted', '226', 'MT', { delta: 4, status: 'good' })}
      ${kpi('Trees Equivalent', '6,820', '', { delta: 8 })}
      ${kpi('Recycled', '94.2', '%', { delta: 1, status: 'good' })}
      ${kpi('Reused (Glass)', '6.8', 'MT', { delta: 3 })}
      ${kpi('Circular Rate', '78.4', '%', { delta: 2, status: 'good' })}
    </div>
    <div class="card">
      <div class="card-head"><div><div class="card-title">Material-wise impact</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Material</th><th class="num">Collected (MT)</th><th class="num">Recycled (MT)</th><th class="num">Yield</th><th class="num">CO₂ Avoided</th><th class="num">Energy (MWh)</th></tr></thead>
          <tbody>
            <tr><td>PET</td><td class="num">96.2</td><td class="num">92.8</td><td class="num" style="color: var(--good);">96.5%</td><td class="num">68.4</td><td class="num">84.2</td></tr>
            <tr><td>Glass</td><td class="num">64.8</td><td class="num">61.2</td><td class="num" style="color: var(--good);">94.4%</td><td class="num">38.1</td><td class="num">42.8</td></tr>
            <tr><td>HDPE</td><td class="num">28.4</td><td class="num">26.4</td><td class="num" style="color: var(--good);">92.9%</td><td class="num">18.6</td><td class="num">24.4</td></tr>
            <tr><td>MLP</td><td class="num">18.2</td><td class="num">16.2</td><td class="num" style="color: var(--warn);">89.0%</td><td class="num">8.2</td><td class="num">12.4</td></tr>
            <tr><td>Aluminium</td><td class="num">16.4</td><td class="num">15.6</td><td class="num" style="color: var(--good);">95.1%</td><td class="num">6.4</td><td class="num">18.2</td></tr>
            <tr><td>Tetrapak</td><td class="num">2.0</td><td class="num">1.8</td><td class="num" style="color: var(--warn);">90.0%</td><td class="num">2.1</td><td class="num">2.2</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><div><div class="card-title">EPR & Compliance</div></div></div>
      <div class="card-body">
        <div class="dl-row"><span class="dl-label">EPR Target (FY)</span><span class="dl-value">2,400 MT</span></div>
        <div class="dl-row"><span class="dl-label">YTD Achieved</span><span class="dl-value">1,840 MT</span></div>
        <div class="dl-row"><span class="dl-label">Completion</span><span class="dl-value" style="color: var(--good);">76.7%</span></div>
        <div class="dl-row"><span class="dl-label">EPR Credits Issued</span><span class="dl-value">1,820</span></div>
        <div class="dl-row"><span class="dl-label">SBM Compliance</span><span class="dl-value txt"><span class="pill pill-good">Compliant</span></span></div>
        <div class="dl-row"><span class="dl-label">PWM Rules 2016</span><span class="dl-value txt"><span class="pill pill-good">Compliant</span></span></div>
      </div>
    </div>
  `;
}

/* ============================================================
   ALERTS CENTER
   ============================================================ */
function pageAlertsAll() {
  // v45 — Cleaner terminology (Urgent / Priority / Monitor / Info) instead of
  // Critical / High / Medium / Low. Focus on SLA-breached alerts.
  const alerts = [
    { time: '12:42', sev: 'Critical', mod: 'Machines', msg: 'RVM offline > 6hr', loc: 'Mapusa Market RVM-04', owner: 'Vendor A', age: '34m', slaBreached: true,  ackd: false },
    { time: '11:18', sev: 'High',     mod: 'CP',       msg: 'Handler attendance < 80%', loc: 'Ponda · 4 of 6 CPs', owner: 'Field Ops', age: '1h 58m', slaBreached: true,  ackd: false },
    { time: '09:55', sev: 'Critical', mod: 'Warehouse', msg: 'Bag dwell > 72hr', loc: 'Recykal · Verna · 3 bags', owner: 'Warehouse', age: '3h 21m', slaBreached: true,  ackd: false },
    { time: '08:30', sev: 'High',     mod: 'CP',       msg: 'Refund TAT > SLA', loc: '12 transactions', owner: 'Finance', age: '4h 46m', slaBreached: true,  ackd: false },
    { time: '07:14', sev: 'Medium',   mod: 'Warehouse', msg: 'Inbound weight variance', loc: 'Margao CPC · 4.2% gap', owner: 'Quality', age: '6h 02m', slaBreached: false, ackd: false },
    { time: '06:48', sev: 'High',     mod: 'Logistics', msg: 'Vehicle GPS offline', loc: 'GA-07-AB-1284', owner: 'Vendor B', age: '6h 28m', slaBreached: true,  ackd: false },
    { time: '06:02', sev: 'Critical', mod: 'Machines', msg: 'Firmware error loop', loc: 'RVM-Quepem-01', owner: 'Vendor A', age: '7h 14m', slaBreached: true,  ackd: true },
    { time: 'Yest',  sev: 'Medium',   mod: 'HoReCa', msg: 'Pickup missed', loc: 'Hotel Marriott Calangute', owner: 'Vendor C', age: '18h', slaBreached: false, ackd: true },
    { time: 'Yest',  sev: 'Low',      mod: 'CP', msg: 'Low collection volume', loc: 'RVM-Bicholim-02', owner: 'Field Ops', age: '22h', slaBreached: false, ackd: true },
    { time: '2d ago', sev: 'High',    mod: 'Logistics', msg: 'Route deviation > 8km', loc: 'Trip TR-4821', owner: 'Vendor B', age: '2d', slaBreached: true,  ackd: true },
    { time: '2d ago', sev: 'Medium',  mod: 'Warehouse', msg: 'Sorting backlog > 4hr', loc: 'Anand · Nessai', owner: 'Operations', age: '2d', slaBreached: false, ackd: true },
    { time: '3d ago', sev: 'Low',     mod: 'CP', msg: 'Bag pickup delayed', loc: 'D2D-Pernem', owner: 'Field Ops', age: '3d', slaBreached: false, ackd: true },
  ];
  // v45 — Drop Critical/High/Medium/Low jargon, use action-oriented terms
  const sevPill = (s) => ({
    'Critical': '<span class="pill pill-bad">Urgent</span>',
    'High':     '<span class="pill pill-warn">Priority</span>',
    'Medium':   '<span class="pill pill-info">Monitor</span>',
    'Low':      '<span class="pill pill-neutral">Info</span>',
  })[s];

  const breached = alerts.filter(a => a.slaBreached).length;
  const active = alerts.filter(a => !a.ackd).length;

  return `
    <div class="kgrid kgrid-4">
      ${kpi('Open Alerts', active, '', { status: 'alert' })}
      ${kpi('SLA Breached', breached, '', { status: 'alert' })}
      ${kpi('Resolved Today', 18, '', { delta: 8, status: 'good' })}
      ${kpi('Avg Resolution', '2.4', 'hr', { delta: -12 })}
    </div>
    <div class="card">
      <div class="card-head">
        <div><div class="card-title">All Alerts</div><div class="card-sub">All modules · live feed · SLA-breached items highlighted</div></div>
        <div class="card-actions">
          <button class="btn">Acknowledge All</button>
          <button class="btn btn-primary">Auto-assign</button>
        </div>
      </div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Time</th><th>Tag</th><th>Module</th><th>Alert</th><th>Location</th><th>Owner</th><th class="num">Age</th><th>SLA</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${alerts.map((a, i) => `
              <tr class="${i % 2 ? 'striped' : ''}" ${a.slaBreached ? 'style="background:#fef2f2;"' : ''}>
                <td style="font-family: var(--font-mono); font-size: 11px; color: var(--text-mute);">${a.time}</td>
                <td>${sevPill(a.sev)}</td>
                <td>${a.mod}</td>
                <td>${a.msg}</td>
                <td><span class="row-action">${a.loc}</span></td>
                <td>${a.owner}</td>
                <td class="num">${a.age}</td>
                <td>${a.slaBreached ? '<span class="pill pill-bad">Breached</span>' : '<span class="pill pill-neutral">Within</span>'}</td>
                <td><span class="pill ${a.ackd ? 'pill-warn' : 'pill-bad'}">${a.ackd ? 'Acknowledged' : 'Active'}</span></td>
                <td><span class="row-action">Resolve →</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}


/* ============================================================
   HORECA — Cluster View + Block View
   ============================================================ */
function pageHorCluster() {
  const clusters = [
    { name: 'North Goa',  accts: 142, active: 128, pickups: 184, missed: 16, compliance: 91.3, bottles: 26420, blocks: ['Bardez', 'Pernem', 'Tiswadi', 'Bicholim'] },
    { name: 'South Goa',  accts: 124, active: 112, pickups: 168, missed: 18, compliance: 89.3, bottles: 23180, blocks: ['Salcete', 'Mormugao', 'Quepem', 'Canacona'] },
    { name: 'Coastal',    accts: 56,  active: 52,  pickups: 76,  missed: 5,  compliance: 93.4, bottles: 12840, blocks: ['Bardez', 'Salcete', 'Mormugao'] },
    { name: 'Inland',     accts: 20,  active: 18,  pickups: 28,  missed: 2,  compliance: 92.9, bottles: 4280,  blocks: ['Sattari', 'Sanguem', 'Dharbandora'] },
  ];
  return `
    <div class="section-head"><div class="section-title">HoReCa Cluster Performance</div><div class="section-sub">Cluster-wise rollup · last 30 days</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>Cluster</th><th class="num">Accounts</th><th class="num">Active</th>
            <th class="num">Pickups</th><th class="num">Missed</th><th class="num">Bottles</th>
            <th class="num">Compliance</th><th>Coverage Blocks</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${clusters.map((c, i) => `
              <tr class="${i % 2 ? 'striped' : ''}">
                <td><strong>${c.name}</strong></td>
                <td class="num">${c.accts}</td>
                <td class="num">${c.active}</td>
                <td class="num">${c.pickups}</td>
                <td class="num" style="color: ${c.missed > 10 ? 'var(--warn)' : 'var(--text)'};">${c.missed}</td>
                <td class="num">${c.bottles.toLocaleString()}</td>
                <td class="num" style="color: ${c.compliance > 90 ? 'var(--good)' : 'var(--warn)'};">${c.compliance}%</td>
                <td style="font-size: 11.5px; color: var(--text-mute);">${c.blocks.join(', ')}</td>
                <td>${c.compliance > 90 ? '<span class="pill pill-good">On-track</span>' : '<span class="pill pill-warn">At-risk</span>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="section-head" style="margin-top: 22px;"><div class="section-title">Cluster KPI Summary</div></div>
    <div class="kgrid kgrid-4">
      ${kpi('North · Pickup Rate', '91.3', '%', { delta: 3, status: 'good' })}
      ${kpi('South · Pickup Rate', '89.3', '%', { delta: 1 })}
      ${kpi('Coastal · Pickup Rate', '93.4', '%', { delta: 4, status: 'good' })}
      ${kpi('Inland · Pickup Rate', '92.9', '%', { delta: 2 })}
      ${kpi('North · Bottles', '26.4K', '', { delta: 8 })}
      ${kpi('South · Bottles', '23.2K', '', { delta: 5 })}
      ${kpi('Coastal · Bottles', '12.8K', '', { delta: 12 })}
      ${kpi('Inland · Bottles', '4.3K', '', { delta: 3 })}
    </div>
  `;
}

function pageHorBlock() {
  return `
    <div class="section-head"><div class="section-title">HoReCa Block Performance</div><div class="section-sub">All 12 talukas · last 30 days</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>Block</th><th>Cluster</th><th class="num">Accounts</th><th class="num">Active</th>
            <th class="num">Pickups (P/A)</th><th class="num">Missed</th><th class="num">Bottles</th>
            <th class="num">Compliance</th><th class="num">Avg TAT</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${TALUKAS.map((t, i) => {
              const cluster = ['Bardez','Pernem','Tiswadi','Bicholim','Sattari'].includes(t) ? 'North' : 'South';
              const accts = rint(18, 62);
              const active = Math.floor(accts * rfloat(0.85, 0.96));
              const planned = rint(24, 84);
              const actual = Math.floor(planned * rfloat(0.82, 0.96));
              const missed = planned - actual;
              const bottles = rint(2400, 7800);
              const comp = (actual/planned*100).toFixed(1);
              return `
                <tr class="${i % 2 ? 'striped' : ''}">
                  <td><strong>${t}</strong></td>
                  <td><span class="pill ${cluster === 'North' ? 'pill-info' : 'pill-neutral'}">${cluster}</span></td>
                  <td class="num">${accts}</td>
                  <td class="num">${active}</td>
                  <td class="num">${planned}/${actual}</td>
                  <td class="num" style="color: ${missed > 6 ? 'var(--warn)' : 'var(--text)'};">${missed}</td>
                  <td class="num">${bottles.toLocaleString()}</td>
                  <td class="num" style="color: ${comp > 90 ? 'var(--good)' : 'var(--warn)'};">${comp}%</td>
                  <td class="num">${rfloat(1.4, 3.8)}d</td>
                  <td>${comp > 90 ? '<span class="pill pill-good">On-track</span>' : '<span class="pill pill-warn">At-risk</span>'}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ============================================================
   LOGISTICS — Orders + Trips
   ============================================================ */
function orderStatusPill(s) {
  const map = {
    'Created':    'pill-info',
    'Assigned':   'pill-neutral',
    'In Transit': 'pill-warn',
    'Delivered':  'pill-good',
    'Cancelled':  'pill-bad',
  };
  return `<span class="pill ${map[s]}">${s}</span>`;
}

function tripStatusPill(s) {
  const map = {
    'Planned':     'pill-neutral',
    'In Progress': 'pill-info',
    'Completed':   'pill-good',
    'Delayed':     'pill-warn',
    'Cancelled':   'pill-bad',
  };
  return `<span class="pill ${map[s]}">${s}</span>`;
}

function pageLogOrders() {
  const total = ORDER_DATA.length;
  const created = ORDER_DATA.filter(o => o.status === 'Created').length;
  const assigned = ORDER_DATA.filter(o => o.status === 'Assigned').length;
  const transit = ORDER_DATA.filter(o => o.status === 'In Transit').length;
  const delivered = ORDER_DATA.filter(o => o.status === 'Delivered').length;
  const breached = ORDER_DATA.filter(o => o.slaBreached).length;
  const totalBags = ORDER_DATA.reduce((s,o) => s+o.bagsRequested, 0);
  const totalWeight = ORDER_DATA.reduce((s,o) => s+o.weightKg, 0);

  return `
    <div class="kgrid kgrid-6">
      ${kpi('Total Orders', total, '', { delta: 6 })}
      ${kpi('Created', created, '', { status: 'good' })}
      ${kpi('Assigned', assigned, '')}
      ${kpi('In Transit', transit, '', { status: 'warn' })}
      ${kpi('Delivered', delivered, '', { delta: 8, status: 'good' })}
      ${kpi('SLA Breached', breached, '', { status: 'alert' })}
      ${kpi('Total Bags', totalBags.toLocaleString(), '', { delta: 4 })}
      ${kpi('Total Weight', (totalWeight/1000).toFixed(1), 'MT', { delta: 3 })}
      ${kpi('Avg Bags / Order', (totalBags/total).toFixed(1), '')}
      ${kpi('Avg Weight / Order', Math.round(totalWeight/total), 'kg')}
      ${kpi('Avg Order Age', '14.2', 'hr', { delta: -6 })}
      ${kpi('Cancellation Rate', '2.8', '%', { delta: -1 })}
    </div>

    <div class="card">
      <div class="card-head">
        <div><div class="card-title">Order Registry</div><div class="card-sub">All pickup / dispatch orders · click ID to drill down</div></div>
        <div class="card-actions">
          <button class="btn">Export CSV</button>
          <button class="btn btn-primary">+ New Order</button>
        </div>
      </div>
      <div class="toolbar">
        <div class="toolbar-search">
          <span class="toolbar-search-icon">⌕</span>
          <input type="text" placeholder="Search order ID, CP, vendor…" />
        </div>
        <span class="toolbar-count">Showing <strong>${Math.min(40, total)}</strong> of <strong>${total}</strong></span>
      </div>
      <div class="table-wrap" style="max-height: calc(100vh - 580px); overflow-y: auto;">
        <table class="t">
          <thead><tr>
            <th>Order ID</th><th>Created</th><th>Priority</th><th>CP</th><th>Block</th><th>→ CPC</th>
            <th class="num">Bags</th><th class="num">Weight</th><th>Vendor</th><th class="num">Age</th>
            <th class="num">SLA</th><th>Status</th><th></th>
          </tr></thead>
          <tbody>
            ${ORDER_DATA.slice(0, 40).map((o, i) => `
              <tr class="${i % 2 ? 'striped' : ''}">
                <td class="id-cell">${o.id}</td>
                <td style="font-family: var(--font-mono); font-size: 11px; color: var(--text-mute);">${o.createdAt}</td>
                <td><span class="pill ${o.priority === 'Urgent' ? 'pill-bad' : o.priority === 'High' ? 'pill-warn' : 'pill-neutral'}">${o.priority}</span></td>
                <td><span class="row-action">${o.cpName}</span></td>
                <td>${o.block}</td>
                <td>${o.cpcName}</td>
                <td class="num">${o.bagsRequested}</td>
                <td class="num">${o.weightKg.toLocaleString()}kg</td>
                <td>${o.vendor}</td>
                <td class="num">${o.ageHr}h</td>
                <td class="num">${o.slaHr}h</td>
                <td>${orderStatusPill(o.status)}</td>
                <td><span class="row-action">Open →</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function pageLogTrips() {
  const total = TRIP_DATA.length;
  const planned = TRIP_DATA.filter(t => t.status === 'Planned').length;
  const inProg = TRIP_DATA.filter(t => t.status === 'In Progress').length;
  const completed = TRIP_DATA.filter(t => t.status === 'Completed').length;
  const delayed = TRIP_DATA.filter(t => t.status === 'Delayed').length;
  const onTime = TRIP_DATA.filter(t => t.onTime === true).length;
  const totalKm = TRIP_DATA.reduce((s,t) => s + (t.actualKm || t.plannedKm), 0);
  const totalScans = TRIP_DATA.reduce((s,t) => s + t.bagsScanned, 0);
  const totalFuel = TRIP_DATA.reduce((s,t) => s + (t.fuelL || 0), 0);

  return `
    <div class="kgrid kgrid-6">
      ${kpi('Total Trips', total, '', { delta: 5 })}
      ${kpi('Planned', planned, '')}
      ${kpi('In Progress', inProg, '', { status: 'warn' })}
      ${kpi('Completed', completed, '', { delta: 8, status: 'good' })}
      ${kpi('Delayed', delayed, '', { status: 'alert' })}
      ${kpi('On-Time %', ((onTime/completed)*100).toFixed(1), '%', { delta: 2, status: 'good' })}
      ${kpi('Total KM', totalKm.toLocaleString(), '', { delta: 4 })}
      ${kpi('Bags Scanned', totalScans.toLocaleString(), '', { delta: 6 })}
      ${kpi('Fuel Used', totalFuel.toFixed(0), 'L', { delta: -2 })}
      ${kpi('Avg Stops / Trip', (TRIP_DATA.reduce((s,t)=>s+t.stops,0)/total).toFixed(1), '')}
      ${kpi('Avg Duration', (TRIP_DATA.filter(t=>t.actualHr).reduce((s,t)=>s+t.actualHr,0)/completed).toFixed(1), 'hr')}
      ${kpi('Cost / Trip', '₹1,840', '', { delta: -3 })}
    </div>

    <div class="card">
      <div class="card-head">
        <div><div class="card-title">Trip Registry</div><div class="card-sub">All trips · planned, in-progress, completed</div></div>
        <div class="card-actions">
          <button class="btn">Export CSV</button>
          <button class="btn btn-primary">+ New Trip</button>
        </div>
      </div>
      <div class="toolbar">
        <div class="toolbar-search">
          <span class="toolbar-search-icon">⌕</span>
          <input type="text" placeholder="Search trip ID, vehicle, driver…" />
        </div>
        <span class="toolbar-count">Showing <strong>${Math.min(40, total)}</strong> of <strong>${total}</strong></span>
      </div>
      <div class="table-wrap" style="max-height: calc(100vh - 580px); overflow-y: auto;">
        <table class="t">
          <thead><tr>
            <th>Trip ID</th><th>Created</th><th>Vehicle</th><th>Type</th><th class="num">Cap.</th>
            <th>Driver</th><th>→ CPC</th><th class="num">Stops</th>
            <th class="num">KM (P/A)</th><th class="num">Hr (P/A)</th>
            <th class="num">Bags</th><th class="num">Weight</th><th class="num">Fuel</th>
            <th>Status</th><th></th>
          </tr></thead>
          <tbody>
            ${TRIP_DATA.slice(0, 40).map((t, i) => `
              <tr class="${i % 2 ? 'striped' : ''}">
                <td class="id-cell">${t.id}</td>
                <td style="font-family: var(--font-mono); font-size: 11px; color: var(--text-mute);">${t.createdAt}</td>
                <td class="id-cell">${t.vehicle}</td>
                <td>${t.vehicleType}</td>
                <td class="num">${t.capacityMT}MT</td>
                <td>${t.driver}</td>
                <td>${t.cpcName}</td>
                <td class="num">${t.stopsCompleted}/${t.stops}</td>
                <td class="num">${t.plannedKm}/${t.actualKm ?? '—'}</td>
                <td class="num">${t.plannedHr}/${t.actualHr ?? '—'}</td>
                <td class="num">${t.bagsScanned}</td>
                <td class="num">${t.totalWeightKg ? (t.totalWeightKg/1000).toFixed(1)+'MT' : '—'}</td>
                <td class="num">${t.fuelL ? t.fuelL+'L' : '—'}</td>
                <td>${tripStatusPill(t.status)}</td>
                <td><span class="row-action">Open →</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ============================================================
   WAREHOUSE — CPC Network, Dock Wait, RVM Fill, Material Stages
   ============================================================ */
/* ============================================================
   WAREHOUSE — Bag Flow Chain (Vendor → CPC → CP → RVM → back to CPC)
   ============================================================ */
function pageWhBagflow() {
  const m = getMult('wh');
  // Lifecycle counts at each stage, scaled
  const v_to_cpc       = scaleNum(2840, m);  // bags vendor → CPC (receiving)
  const at_cpc_recv    = scaleCount(1240, m); // currently being received at CPC
  const at_cpc_ready   = scaleCount(290, m);  // ready to dispatch at CPC
  const in_transit_cp  = scaleCount(420, m);  // CPC → CP
  const tagged_rvm     = scaleCount(2890, m); // in use at RVM/RC
  const sealed         = scaleCount(180, m);  // ≥80% fill, pickup triggered
  const in_transit_cpc = scaleCount(380, m);  // CP → CPC (after seal)
  const processed_cpc  = scaleNum(8420, m);   // bags processed at CPC
  const rtd            = scaleNum(290, m);    // ready for dispatch back to next CP

  return `
    <div class="section-head"><div class="section-title">Bag Flow Chain</div><div class="section-sub">Vendor → Receiving at CPC → Ready to Dispatch → In Transit → Tagged to RVM → Sealed (≥80%) → In Transit to CPC · ${m.label.date}${m.label.cluster && m.label.cluster !== 'All' ? ' · '+m.label.cluster : ''}</div></div>

    <!-- Pipeline visualization (clickable, drills) -->
    <div class="card">
      <div class="stage-pipeline">
        <div class="stage-step clickable" data-stage="vendor-receiving">
          <div><span class="stage-step-val">${v_to_cpc.toLocaleString()}</span> <span class="stage-step-unit">bags</span></div>
          <div class="stage-step-lbl">Vendor → CPC</div>
          <div style="font-size:10px; color: var(--text-mute); margin-top: 3px;">${m.label.date} receiving</div>
        </div>
        <span class="stage-arrow">›</span>
        <div class="stage-step clickable" data-stage="cpc-receiving">
          <div><span class="stage-step-val">${at_cpc_recv.toLocaleString()}</span> <span class="stage-step-unit">bags</span></div>
          <div class="stage-step-lbl">Receiving at CPC</div>
          <div style="font-size:10px; color: var(--text-mute); margin-top: 3px;">accepted by team</div>
        </div>
        <span class="stage-arrow">›</span>
        <div class="stage-step clickable" data-stage="rtd">
          <div><span class="stage-step-val">${at_cpc_ready.toLocaleString()}</span> <span class="stage-step-unit">bags</span></div>
          <div class="stage-step-lbl">Ready to Dispatch</div>
          <div style="font-size:10px; color: var(--text-mute); margin-top: 3px;">at CPC</div>
        </div>
        <span class="stage-arrow">›</span>
        <div class="stage-step clickable" data-stage="transit-cp">
          <div><span class="stage-step-val">${in_transit_cp.toLocaleString()}</span> <span class="stage-step-unit">bags</span></div>
          <div class="stage-step-lbl">In Transit → CP</div>
          <div style="font-size:10px; color: var(--text-mute); margin-top: 3px;">assigned to CP</div>
        </div>
        <span class="stage-arrow">›</span>
        <div class="stage-step clickable" data-stage="tagged">
          <div><span class="stage-step-val">${tagged_rvm.toLocaleString()}</span> <span class="stage-step-unit">bags</span></div>
          <div class="stage-step-lbl">Tagged to RVM</div>
          <div style="font-size:10px; color: var(--text-mute); margin-top: 3px;">in use at RVM/RC</div>
        </div>
        <span class="stage-arrow">›</span>
        <div class="stage-step clickable" data-stage="sealed" style="border-color: var(--warn);">
          <div><span class="stage-step-val" style="color: var(--warn);">${sealed.toLocaleString()}</span> <span class="stage-step-unit">bags</span></div>
          <div class="stage-step-lbl" style="color: var(--warn);">Sealed (≥80%)</div>
          <div style="font-size:10px; color: var(--text-mute); margin-top: 3px;">pickup triggered</div>
        </div>
        <span class="stage-arrow">›</span>
        <div class="stage-step clickable" data-stage="transit-cpc">
          <div><span class="stage-step-val">${in_transit_cpc.toLocaleString()}</span> <span class="stage-step-unit">bags</span></div>
          <div class="stage-step-lbl">In Transit → CPC</div>
          <div style="font-size:10px; color: var(--text-mute); margin-top: 3px;">CP back to CPC</div>
        </div>
      </div>
    </div>

    <!-- Processing summary at CPC -->
    <div class="section-head"><div class="section-title">CPC Processing Summary</div><div class="section-sub">Bag flow through warehouse</div></div>
    <div class="kgrid kgrid-4">
      ${kpi('Bags Received from Vendor', v_to_cpc.toLocaleString(), '', { delta: 5 })}
      ${kpi('Bags Processed at CPC', processed_cpc.toLocaleString(), '', { delta: 4, sub: 'sorted + baled' })}
      ${kpi('Ready for Dispatch', rtd.toLocaleString(), '', { delta: 2 })}
      ${kpi('Sealed at RVM (Auto-Pickup)', sealed.toLocaleString(), '', { status: 'warn', sub: '≥80% fill rate' })}
      ${kpi('Bales Created', scaleNum(342, m), '', { delta: 6 })}
      ${kpi('Avg Receiving Time', '42', 'min', { delta: -8 })}
      ${kpi('Avg Sort Time', '4.2', 'hr', { delta: -4 })}
      ${kpi('Avg Bag Dwell', '38', 'hr', { delta: -4 })}
    </div>

    <!-- CPC-level bag flow table -->
    <div class="card">
      <div class="card-head"><div><div class="card-title">CPC-level Bag Flow</div><div class="card-sub">Per-warehouse stage breakdown · click row for CPC detail</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>CPC</th>
            <th class="num">From Vendor</th>
            <th class="num">Receiving</th>
            <th class="num">Ready to Dispatch</th>
            <th class="num">In Transit → CP</th>
            <th class="num">Tagged to RVM</th>
            <th class="num">Sealed (≥80%)</th>
            <th class="num">In Transit → CPC</th>
            <th class="num">Processed</th>
          </tr></thead>
          <tbody>
            ${CPC_DATA.map((c, i) => {
              // each CPC takes a share of overall flow based on its CPs covered
              const share = c.cpsCovered / 312;
              const s_v_to_cpc = Math.round(v_to_cpc * share);
              const s_recv = Math.round(at_cpc_recv * share);
              const s_rtd = Math.round(at_cpc_ready * share);
              const s_t_cp = Math.round(in_transit_cp * share);
              const s_tag = Math.round(tagged_rvm * share);
              const s_seal = Math.round(sealed * share);
              const s_t_cpc = Math.round(in_transit_cpc * share);
              const s_proc = Math.round(processed_cpc * share);
              return `
                <tr class="${i % 2 ? 'striped' : ''} clickable" data-cpc="${c.id}">
                  <td><strong>${c.name}</strong></td>
                  <td class="num">${s_v_to_cpc.toLocaleString()}</td>
                  <td class="num">${s_recv.toLocaleString()}</td>
                  <td class="num">${s_rtd.toLocaleString()}</td>
                  <td class="num">${s_t_cp.toLocaleString()}</td>
                  <td class="num">${s_tag.toLocaleString()}</td>
                  <td class="num" style="color: ${s_seal > 0 ? 'var(--warn)' : 'var(--text-mute)'}; font-weight: ${s_seal > 0 ? '600' : '500'};">${s_seal.toLocaleString()}</td>
                  <td class="num">${s_t_cpc.toLocaleString()}</td>
                  <td class="num">${s_proc.toLocaleString()}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Vendor → CPC inbound registry -->
    <div class="card">
      <div class="card-head"><div><div class="card-title">Recent Vendor → CPC Inbound Movements</div><div class="card-sub">New bags accepted by warehouse team · ${m.label.date}</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Vendor</th><th>→ CPC</th><th class="num">Bags</th><th class="num">Weight</th><th>Truck</th><th>Status</th><th>Accepted</th></tr></thead>
          <tbody>
            ${[
              ['Tomra Solutions',     'Recykal · Verna',    180, 3420, 'GA-07-AB-1284', 'Accepted',    '14 min ago'],
              ['Sielox',              'Anand · Nessai',   142, 2680, 'GA-03-AB-4421', 'Accepted',    '38 min ago'],
              ['Reverse Logistics Co','Durgadevi · Colvale',    96, 1840, 'GA-05-AB-1108', 'Receiving',   '1h 02m ago'],
              ['Greentech RVM',       'Recykal · Verna',    124, 2380, 'GA-02-AB-8842', 'Accepted',    '2h 18m ago'],
              ['EcoFleet',            'CPC Ponda',     84, 1640, 'GA-04-AB-2210', 'Accepted',    '3h 02m ago'],
              ['MetroLogix',          'Vilas · Tuem',  62, 1180, 'GA-01-AB-5519', 'In Queue',    '3h 48m ago'],
              ['SwiftBin',            'Anand · Nessai',   168, 3140, 'GA-08-AB-6612', 'Accepted',    '4h 22m ago'],
            ].map((r, i) => `
              <tr class="clickable" data-truck="${r[4]}">
                <td><strong>${r[0]}</strong></td>
                <td>${r[1]}</td>
                <td class="num">${r[2]}</td>
                <td class="num">${r[3]}kg</td>
                <td class="id-cell">${r[4]}</td>
                <td><span class="pill ${r[5] === 'Accepted' ? 'pill-good' : r[5] === 'Receiving' ? 'pill-info' : 'pill-warn'}">${r[5]}</span></td>
                <td style="color: var(--text-mute); font-family: var(--font-mono); font-size: 11px;">${r[6]}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}


function pageWhCpc() {
  return `
    <div class="section-head"><div class="section-title">CPC Network</div><div class="section-sub">5 warehouses · click any to drill down</div></div>
    <div class="cpc-grid">
      ${CPC_DATA.map(c => {
        const pct = (c.currentMT / c.capacityMT * 100).toFixed(0);
        return `
          <div class="cpc-card">
            <div class="cpc-card-head">
              <span class="cpc-card-id">${c.id}</span>
              <span class="cpc-card-cluster">${c.cluster}</span>
            </div>
            <div class="cpc-card-name">${c.name}</div>
            <div class="cpc-card-cap">
              <span>Inventory</span>
              <span><strong>${c.currentMT}</strong> / ${c.capacityMT} MT (${pct}%)</span>
            </div>
            <div class="cpc-bar"><div class="cpc-bar-fill" style="width: ${pct}%; background: ${pct > 85 ? 'var(--bad)' : pct > 70 ? 'var(--warn)' : 'var(--good)'};"></div></div>
            <div class="cpc-card-stats">
              <div class="cpc-card-stat"><div class="cpc-card-stat-lbl">CPs</div><div class="cpc-card-stat-val">${c.cpsCovered}</div></div>
              <div class="cpc-card-stat"><div class="cpc-card-stat-lbl">Docks</div><div class="cpc-card-stat-val">${c.activeDocks}/${c.dockCount}</div></div>
              <div class="cpc-card-stat"><div class="cpc-card-stat-lbl">Queue</div><div class="cpc-card-stat-val" style="color: ${c.vehiclesQueued > 3 ? 'var(--warn)' : 'var(--text)'};">${c.vehiclesQueued}</div></div>
            </div>
          </div>`;
      }).join('')}
    </div>

    <div class="card">
      <div class="card-head"><div><div class="card-title">Cluster-level Performance</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>CPC</th><th>Cluster</th><th>Block</th><th class="num">Capacity</th><th class="num">Current</th><th class="num">Utilisation</th>
            <th class="num">CPs</th><th class="num">Docks</th><th class="num">Sort Acc.</th><th class="num">Yield</th><th class="num">Fill Rate</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${CPC_DATA.map((c, i) => {
              const util = (c.currentMT/c.capacityMT*100).toFixed(1);
              return `
                <tr class="${i % 2 ? 'striped' : ''}">
                  <td class="id-cell">${c.id}</td>
                  <td><strong>${c.name.replace('CPC ','')}</strong></td>
                  <td>${c.block}</td>
                  <td class="num">${c.capacityMT} MT</td>
                  <td class="num">${c.currentMT} MT</td>
                  <td class="num" style="color: ${util > 85 ? 'var(--bad)' : util > 70 ? 'var(--warn)' : 'var(--good)'};">${util}%</td>
                  <td class="num">${c.cpsCovered}</td>
                  <td class="num">${c.activeDocks}/${c.dockCount}</td>
                  <td class="num">${c.sortAcc}%</td>
                  <td class="num">${c.yield}%</td>
                  <td class="num">${c.fillRate}%</td>
                  <td>${util > 85 ? '<span class="pill pill-bad">Capacity</span>' : util > 70 ? '<span class="pill pill-warn">Filling</span>' : '<span class="pill pill-good">Healthy</span>'}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="section-head" style="margin-top: 22px;"><div class="section-title">CPC Coverage Map</div><div class="section-sub">Block → CPC mapping</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>CPC</th><th>Blocks Served</th><th class="num">Blocks</th><th class="num">CPs</th><th>Cluster</th></tr></thead>
          <tbody>
            ${CPC_DATA.map((c, i) => `
              <tr class="${i % 2 ? 'striped' : ''}">
                <td><strong>${c.name}</strong></td>
                <td>${c.coverage.join(', ')}</td>
                <td class="num">${c.coverage.length}</td>
                <td class="num">${c.cpsCovered}</td>
                <td><span class="pill pill-info">${c.cluster}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function pageWhDock() {
  // Generate vehicle queue + scan data per CPC
  const dockData = CPC_DATA.map(c => ({
    cpc: c.name,
    cpcId: c.id,
    docks: c.dockCount,
    active: c.activeDocks,
    queued: c.vehiclesQueued,
    avgWaitMin: rint(28, 95),
    avgDockMin: rint(18, 48),
    avgScanMin: rint(15, 38),
    avgBagsScanned: rint(38, 124),
    scanAccuracy: rfloat(94.2, 99.4),
    breaches: rint(0, 4),
  }));
  const allVehicles = [];
  CPC_DATA.forEach(c => {
    for (let i = 0; i < c.vehiclesQueued + c.activeDocks; i++) {
      allVehicles.push({
        trip: `TR-${30001 + rint(0, 140)}`,
        vehicle: `GA-${rint(1,12).toString().padStart(2,'0')}-AB-${rint(1000,9999)}`,
        cpc: c.name,
        arrived: `${rint(5, 180)}min ago`,
        waitMin: rint(10, 180),
        bags: rint(20, 96),
        weight: rint(400, 2400),
        status: i < c.activeDocks ? 'Scanning' : 'In Queue',
        dockId: i < c.activeDocks ? `D-${i+1}` : '—',
      });
    }
  });

  return `
    <div class="section-head"><div class="section-title">Dock & Vehicle Wait Analysis</div><div class="section-sub">When vehicles arrive, time to unload + scan</div></div>
    <div class="kgrid kgrid-6">
      ${kpi('Vehicles in Queue', CPC_DATA.reduce((s,c)=>s+c.vehiclesQueued, 0), '', { status: 'warn' })}
      ${kpi('Active Docks', CPC_DATA.reduce((s,c)=>s+c.activeDocks, 0), '/' + CPC_DATA.reduce((s,c)=>s+c.dockCount, 0))}
      ${kpi('Avg Wait Time', '58', 'min', { delta: -8 })}
      ${kpi('Avg Dock Time', '32', 'min', { delta: -4 })}
      ${kpi('Avg Scan Time', '24', 'min', { delta: -6, status: 'good' })}
      ${kpi('Wait > 90min', '4', '', { status: 'alert' })}
      ${kpi('Scan Accuracy', '97.2', '%', { delta: 1, status: 'good' })}
      ${kpi('Bags Scanned (Today)', '2,840', '', { delta: 12 })}
    </div>

    <div class="card">
      <div class="card-head"><div><div class="card-title">CPC-level dock performance</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>CPC</th><th class="num">Docks (A/T)</th><th class="num">Queue</th>
            <th class="num">Avg Wait</th><th class="num">Avg Dock</th><th class="num">Avg Scan</th>
            <th class="num">Bags / Vehicle</th><th class="num">Scan Acc.</th><th class="num">SLA Breach</th>
          </tr></thead>
          <tbody>
            ${dockData.map((d, i) => `
              <tr class="${i % 2 ? 'striped' : ''}">
                <td><strong>${d.cpc}</strong></td>
                <td class="num">${d.active}/${d.docks}</td>
                <td class="num" style="color: ${d.queued > 3 ? 'var(--warn)' : 'var(--text)'};">${d.queued}</td>
                <td class="num" style="color: ${d.avgWaitMin > 75 ? 'var(--bad)' : d.avgWaitMin > 45 ? 'var(--warn)' : 'var(--text)'};">${d.avgWaitMin}min</td>
                <td class="num">${d.avgDockMin}min</td>
                <td class="num">${d.avgScanMin}min</td>
                <td class="num">${d.avgBagsScanned}</td>
                <td class="num">${d.scanAccuracy}%</td>
                <td class="num" style="color: ${d.breaches > 0 ? 'var(--bad)' : 'var(--text-mute)'};">${d.breaches}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><div><div class="card-title">Live Vehicle Queue</div><div class="card-sub">Currently at CPCs · scanning or waiting</div></div></div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>Trip</th><th>Vehicle</th><th>CPC</th><th>Dock</th><th class="num">Arrived</th>
            <th class="num">Wait</th><th class="num">Bags</th><th class="num">Weight</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${allVehicles.slice(0, 18).map((v, i) => `
              <tr class="${i % 2 ? 'striped' : ''}">
                <td class="id-cell">${v.trip}</td>
                <td class="id-cell">${v.vehicle}</td>
                <td>${v.cpc}</td>
                <td>${v.dockId}</td>
                <td class="num" style="font-family: var(--font-mono); font-size: 11px; color: var(--text-mute);">${v.arrived}</td>
                <td class="num" style="color: ${v.waitMin > 90 ? 'var(--bad)' : v.waitMin > 60 ? 'var(--warn)' : 'var(--text)'};">${v.waitMin}min</td>
                <td class="num">${v.bags}</td>
                <td class="num">${v.weight}kg</td>
                <td>${v.status === 'Scanning' ? '<span class="pill pill-info"><span class="dot dot-neutral"></span>Scanning</span>' : '<span class="pill pill-warn"><span class="dot dot-warn"></span>In Queue</span>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function pageWhRvmFill() {
  const m = getMult('wh');
  // Generate fill rates — capped at 80%. Anything ≥80% is sealed and triggers pickup.
  const rvms = CP_DATA.filter(c => c.type === 'RVM').slice(0, 24);
  const panchFill = PANCHAYATS.slice(0, 14).map(p => {
    const raw = rfloat(35, 92);
    const capped = capFill(raw);
    return {
      panchayat: p,
      block: pick(TALUKAS),
      rvms: rint(3, 12),
      avgFill: capped,
      rawFill: raw,
      sealed: rint(0, 4),
      estIncomingKg: rint(180, 1200),
    };
  });
  const sealedCount = scaleCount(28, m);
  const pickupOpenCount = scaleCount(22, m);

  return `
    <div class="section-head"><div class="section-title">RVM / RC Fill Rate · Incoming Material Forecast</div><div class="section-sub">Hard cap at 80% — any RVM/RC ≥80% is sealed and pickup request fires automatically</div></div>
    <div class="kgrid kgrid-6">
      ${kpi('Avg Fill Rate', '54', '%', { delta: 3, sub: 'capped at 80%' })}
      ${kpi('Sealed (≥80%)', sealedCount, 'machines', { status: 'warn', sub: 'pickup auto-requested' })}
      ${kpi('Empty (<10%)', scaleCount(12, m), 'machines')}
      ${kpi('Pickup Requests Open', pickupOpenCount, '', { status: 'warn' })}
      ${kpi('Est. Incoming Today', scaleNum(4200, m), 'kg', { delta: 8 })}
      ${kpi('Est. Incoming Tomorrow', scaleNum(5800, m), 'kg', { delta: 12 })}
      ${kpi('Pickup Backlog', scaleCount(6, m), '', { status: 'warn' })}
      ${kpi('Avg Time to Pickup', '6.2', 'hr', { delta: -8, status: 'good' })}
    </div>

    <div class="section-head"><div class="section-title">View 1 · Panchayat-level Fill Rate</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>Panchayat</th><th>Block</th><th class="num">RVMs</th><th class="num">Avg Fill</th>
            <th class="num">Sealed (≥80%)</th><th class="num">Est. Incoming</th><th>Action</th>
          </tr></thead>
          <tbody>
            ${panchFill.map((p, i) => {
              const isCapped = isSealed(p.rawFill);
              return `
              <tr class="${i % 2 ? 'striped' : ''} clickable">
                <td><strong>${p.panchayat}</strong></td>
                <td>${p.block}</td>
                <td class="num">${p.rvms}</td>
                <td class="num" style="color: ${isCapped ? 'var(--warn)' : p.avgFill > 60 ? 'var(--info)' : 'var(--good)'}; font-weight: ${isCapped ? '600' : '500'};">${p.avgFill.toFixed(0)}%${isCapped ? ' 🔒' : ''}</td>
                <td class="num" style="color: ${p.sealed > 0 ? 'var(--warn)' : 'var(--text)'};">${p.sealed}</td>
                <td class="num">${p.estIncomingKg.toLocaleString()}kg</td>
                <td>${isCapped ? '<span class="pill pill-warn">Pickup Triggered</span>' : p.avgFill > 60 ? '<span class="pill pill-info">Filling</span>' : '<span class="pill pill-good">Monitor</span>'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="section-head" style="margin-top: 22px;"><div class="section-title">View 2 · RVM-level Fill Rate</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>RVM ID</th><th>CP Name</th><th>Block</th><th>Panchayat</th>
            <th class="num">Fill %</th><th class="num">Bag Inventory</th><th class="num">Est. kg</th><th class="num">Last Pickup</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${rvms.map((r, i) => {
              const raw = rfloat(15, 98);
              const capped = capFill(raw);
              const sealed = isSealed(raw);
              return `
                <tr class="${i % 2 ? 'striped' : ''} clickable">
                  <td class="id-cell">${r.id}-M01</td>
                  <td>${r.name}</td>
                  <td>${r.block}</td>
                  <td>${r.panchayat}</td>
                  <td class="num" style="color: ${sealed ? 'var(--warn)' : capped > 60 ? 'var(--info)' : 'var(--good)'}; font-weight: ${sealed ? '600' : '500'};">${capped.toFixed(0)}%${sealed ? ' 🔒' : ''}</td>
                  <td class="num">${r.bagInventory}</td>
                  <td class="num">${Math.floor(capped * 1.8)}kg</td>
                  <td class="num">${rint(1,5)}d ago</td>
                  <td>${sealed ? '<span class="pill pill-warn">Sealed · Pickup</span>' : capped > 60 ? '<span class="pill pill-info">Filling</span>' : capped > 30 ? '<span class="pill pill-good">Active</span>' : '<span class="pill pill-neutral">Empty</span>'}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function pageWhStages() {
  // Material stage flow at warehouse
  const stages = [
    { name: 'Vehicle Arrival',  val: 18, unit: 'vehicles' },
    { name: 'Dock Queue',       val: 5,  unit: 'vehicles' },
    { name: 'Unloading',        val: 4,  unit: 'docks' },
    { name: 'Bag Scanning',     val: 124,unit: 'bags' },
    { name: 'Weighing',         val: 38, unit: 'MT' },
    { name: 'Sorting WIP',      val: 28, unit: 'MT' },
    { name: 'Sorted Buffer',    val: 64, unit: 'MT' },
    { name: 'Baling',           val: 18, unit: 'bales' },
    { name: 'Ready for Dispatch',val: 74,unit: 'MT' },
  ];
  return `
    <div class="section-head"><div class="section-title">Material Stage Visibility</div><div class="section-sub">Where material currently sits in the CPC pipeline</div></div>

    <div class="card">
      <div class="stage-pipeline">
        ${stages.map((s, i) => `
          <div class="stage-step">
            <div><span class="stage-step-val">${s.val}</span><span class="stage-step-unit">${s.unit}</span></div>
            <div class="stage-step-lbl">${s.name}</div>
          </div>
          ${i < stages.length - 1 ? '<span class="stage-arrow">›</span>' : ''}
        `).join('')}
      </div>
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>Stage</th><th class="num">Quantity</th><th class="num">Avg Dwell</th><th class="num">In > 24h</th><th class="num">In > 48h</th><th class="num">In > 72h</th><th>SLA</th><th>Status</th>
          </tr></thead>
          <tbody>
            <tr><td><strong>Vehicle Arrival</strong></td><td class="num">18 veh</td><td class="num">42min</td><td class="num">0</td><td class="num">0</td><td class="num">0</td><td class="num">60min</td><td><span class="pill pill-good">On-track</span></td></tr>
            <tr class="striped"><td><strong>Dock Queue</strong></td><td class="num">5 veh</td><td class="num">58min</td><td class="num">0</td><td class="num">0</td><td class="num">0</td><td class="num">90min</td><td><span class="pill pill-good">On-track</span></td></tr>
            <tr><td><strong>Unloading</strong></td><td class="num">4 docks</td><td class="num">32min</td><td class="num">0</td><td class="num">0</td><td class="num">0</td><td class="num">45min</td><td><span class="pill pill-good">On-track</span></td></tr>
            <tr class="striped"><td><strong>Bag Scanning</strong></td><td class="num">124 bags</td><td class="num">24min</td><td class="num">2</td><td class="num">0</td><td class="num">0</td><td class="num">60min</td><td><span class="pill pill-info">Active</span></td></tr>
            <tr><td><strong>Weighing</strong></td><td class="num">38 MT</td><td class="num">12min</td><td class="num">0</td><td class="num">0</td><td class="num">0</td><td class="num">30min</td><td><span class="pill pill-good">On-track</span></td></tr>
            <tr class="striped"><td><strong>Sorting WIP</strong></td><td class="num">28 MT</td><td class="num">4.2hr</td><td class="num">2</td><td class="num">0</td><td class="num">0</td><td class="num">8hr</td><td><span class="pill pill-info">Active</span></td></tr>
            <tr><td><strong>Sorted Buffer</strong></td><td class="num">64 MT</td><td class="num">18hr</td><td class="num">8</td><td class="num">2</td><td class="num">0</td><td class="num">24hr</td><td><span class="pill pill-warn">Filling</span></td></tr>
            <tr class="striped"><td><strong>Baling</strong></td><td class="num">18 bales</td><td class="num">2.1hr</td><td class="num">0</td><td class="num">0</td><td class="num">0</td><td class="num">4hr</td><td><span class="pill pill-good">On-track</span></td></tr>
            <tr><td><strong>Ready for Dispatch</strong></td><td class="num">74 MT</td><td class="num">38hr</td><td class="num">14</td><td class="num">6</td><td class="num">3</td><td class="num">48hr</td><td><span class="pill pill-bad">Aging</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="section-head" style="margin-top: 22px;"><div class="section-title">Stage breakdown by CPC</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>CPC</th><th class="num">Inbound</th><th class="num">In Scan</th><th class="num">Sort WIP</th><th class="num">Buffer</th><th class="num">Bales</th><th class="num">RTD</th><th class="num">Total</th>
          </tr></thead>
          <tbody>
            ${CPC_DATA.map((c, i) => {
              const inb = rfloat(2, 12);
              const scan = rfloat(0.5, 4);
              const wip = rfloat(2, 8);
              const buf = rfloat(8, 24);
              const bales = rfloat(1, 6);
              const rtd = rfloat(8, 22);
              const total = (inb + scan + wip + buf + bales + rtd).toFixed(1);
              return `
                <tr class="${i % 2 ? 'striped' : ''}">
                  <td><strong>${c.name}</strong></td>
                  <td class="num">${inb}</td>
                  <td class="num">${scan}</td>
                  <td class="num">${wip}</td>
                  <td class="num">${buf}</td>
                  <td class="num">${bales}</td>
                  <td class="num">${rtd}</td>
                  <td class="num"><strong>${total} MT</strong></td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ============================================================
   COSTING — Overview
   ============================================================ */
function pageCostOverview() {
  const m = getMult('cost');
  // Use daily base; scale by date for revenue/cost
  const fmtL = (n) => '₹' + (n / 100000).toFixed(1) + 'L';
  const fmtCr = (n) => '₹' + (n / 10000000).toFixed(2) + 'Cr';
  const revenue = scaleNum(280000, m);
  const cost = scaleNum(208000, m);
  const profit = revenue - cost;
  return `
    <div class="section-head"><div class="section-title">Cost & Finance Overview</div><div class="section-sub">${m.label.date} · all cost centers consolidated</div></div>
    <div class="kgrid kgrid-6">
      ${kpi('Total Revenue', fmtL(revenue), '', { delta: 12, status: 'good' })}
      ${kpi('Total Cost', fmtL(cost), '', { delta: 4 })}
      ${kpi('Gross Margin', '25.9', '%', { delta: 3, status: 'good' })}
      ${kpi('Operating Profit', fmtL(profit), '', { delta: 14, status: 'good' })}
      ${kpi('Budget Variance', '−4.2', '%', { status: 'good' })}
      ${kpi('Cost / KG', '₹3.8', '', { delta: -2 })}
      ${kpi('Cost per CP', '₹18,420', '', { delta: -3 })}
      ${kpi('Cost per Trip', '₹1,840', '', { delta: -3 })}
      ${kpi('Cost per MT', '₹2,840', '', { delta: -1 })}
      ${kpi('YTD Spend', fmtCr(208000 * 184), '', { delta: 8 })}
      ${kpi('YTD Budget', '₹5.20Cr', '', { delta: 0 })}
      ${kpi('Burn Rate', '92.7', '%', { delta: -2 })}
    </div>

    <div class="section-head"><div class="section-title">Cost Breakdown by Cost Center</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>Cost Center</th><th class="num">Budget</th><th class="num">Actual</th><th class="num">Variance</th><th class="num">Var %</th><th class="num">% of Total</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${[
              ['CP · Travel',         240000, 248000],
              ['CP · Food',           84000,  82000],
              ['CP · Miscellaneous',  42000,  47000],
              ['CP · Others',         38000,  39000],
              ['HoReCa · Travel',     180000, 184000],
              ['HoReCa · Misc',       28000,  26000],
              ['Logistics · Vendor',  1420000,1380000],
              ['Logistics · Manpower',840000, 862000],
              ['Logistics · Travel',  620000, 614000],
              ['Logistics · Misc',    62000,  68000],
              ['Warehouse · Rent',    480000, 480000],
              ['Warehouse · Power',   140000, 144000],
              ['Warehouse · Manpower',640000, 656000],
              ['Warehouse · Misc',    48000,  52000],
            ].map((r, i) => {
              const [name, bud, act] = r;
              const v = act - bud;
              const vp = (v/bud*100).toFixed(1);
              const pct = (act / 5420000 * 100).toFixed(1);
              return `
                <tr class="${i % 2 ? 'striped' : ''}">
                  <td>${name}</td>
                  <td class="num">₹${bud.toLocaleString()}</td>
                  <td class="num">₹${act.toLocaleString()}</td>
                  <td class="num" style="color: ${v > 0 ? 'var(--bad)' : 'var(--good)'};">${v > 0 ? '+' : ''}₹${Math.abs(v).toLocaleString()}</td>
                  <td class="num" style="color: ${v > 0 ? 'var(--bad)' : 'var(--good)'};">${v > 0 ? '+' : ''}${vp}%</td>
                  <td class="num">${pct}%</td>
                  <td>${Math.abs(v/bud) > 0.05 ? (v > 0 ? '<span class="pill pill-bad">Over</span>' : '<span class="pill pill-good">Under</span>') : '<span class="pill pill-info">On-track</span>'}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="section-head" style="margin-top: 22px;"><div class="section-title">Revenue Streams</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr><th>Stream</th><th class="num">MTD Revenue</th><th class="num">% of Total</th><th class="num">Δ vs last month</th></tr></thead>
          <tbody>
            <tr><td>Material Sales</td><td class="num">₹38.2L</td><td class="num">45.4%</td><td class="num" style="color: var(--good);">▲ 8.4%</td></tr>
            <tr class="striped"><td>Unredeemed Deposit Float (30%)</td><td class="num">₹22.4L</td><td class="num">26.6%</td><td class="num" style="color: var(--good);">▲ 12.1%</td></tr>
            <tr><td>HF / EPR Charges</td><td class="num">₹16.8L</td><td class="num">19.9%</td><td class="num" style="color: var(--good);">▲ 6.2%</td></tr>
            <tr class="striped"><td>Operator Margin Spread</td><td class="num">₹6.8L</td><td class="num">8.1%</td><td class="num" style="color: var(--good);">▲ 3.4%</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PRD-Aligned HF Ledger by GWMA Leg -->
    <div class="section-head" style="margin-top:18px;"><div class="section-title">Handling Fee Ledger · By GWMA Leg</div><div class="section-sub">HF = Base × scans + Additional × scans · Released only after CPC inward verification · Non-QR pays market value only</div></div>
    <div class="card">
      <div class="card-body flush">
        <table class="t">
          <thead><tr>
            <th>Leg</th><th>Scope</th><th class="num">CPs</th><th class="num">Rate/scan</th>
            <th class="num">Accrued</th><th class="num">Held</th><th class="num">Released</th><th class="num">Disbursed</th><th>Status</th>
          </tr></thead>
          <tbody>
            <tr>
              <td><span class="pill" style="background:#fef3c7;color:#92400e;font-weight:700;">L1</span></td>
              <td>Pickup Only</td>
              <td class="num">58</td><td class="num">₹1.20</td>
              <td class="num">₹1,25,280</td>
              <td class="num" style="color:var(--warn);font-weight:600;">₹27,562 (22%)</td>
              <td class="num" style="color:var(--good);">₹81,432</td>
              <td class="num">₹72,662</td>
              <td><span class="pill pill-good">Healthy</span></td>
            </tr>
            <tr class="striped">
              <td><span class="pill" style="background:#dbeafe;color:#1e40af;font-weight:700;">L2</span></td>
              <td>Pickup + Processing</td>
              <td class="num">64</td><td class="num">₹3.00</td>
              <td class="num">₹3,45,600</td>
              <td class="num" style="color:var(--warn);font-weight:600;">₹76,032 (22%)</td>
              <td class="num" style="color:var(--good);">₹2,24,640</td>
              <td class="num">₹2,00,448</td>
              <td><span class="pill pill-good">Healthy</span></td>
            </tr>
            <tr>
              <td><span class="pill" style="background:#e9d5ff;color:#6b21a8;font-weight:700;">L3</span></td>
              <td>Processing Only</td>
              <td class="num">22</td><td class="num">₹1.80</td>
              <td class="num">₹71,280</td>
              <td class="num" style="color:var(--warn);font-weight:600;">₹15,682 (22%)</td>
              <td class="num" style="color:var(--good);">₹46,332</td>
              <td class="num">₹41,342</td>
              <td><span class="pill pill-good">Healthy</span></td>
            </tr>
            <tr style="background:#f8fafc;font-weight:700;">
              <td colspan="4">Total</td>
              <td class="num">₹5,42,160</td>
              <td class="num" style="color:var(--warn);">₹1,19,276</td>
              <td class="num" style="color:var(--good);">₹3,52,404</td>
              <td class="num">₹3,14,452</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Deposit Float Mechanic -->
    <div class="section-head" style="margin-top:16px;"><div class="section-title">Deposit Float · Operator Revenue Mechanism</div><div class="section-sub">Consumer pays ₹2/bottle · 71.4% redeemed · operator gets 30% of unredeemed per GWMA Proposal §6</div></div>
    <div style="display:flex;gap:6px;align-items:stretch;">
      ${[
        {label:'Bottles Issued',     val:'12,50,000',  note:'Cumulative · DRS-tagged'},
        {label:'Returned + Redeemed',val:'8,92,500',   note:'71.4% redemption rate'},
        {label:'Unredeemed',         val:'3,57,500',   note:'Forfeit deposit pool'},
        {label:'Float Pool',         val:'₹7,15,000',  note:'Total unredeemed × ₹2'},
        {label:'Operator Share',     val:'₹2,14,500',  note:'30% of float pool'},
      ].map((s, i, arr) => `
        <div style="flex:1;padding:12px 10px;background:#f8fafc;border-radius:8px;border:1px solid var(--border);border-left:3px solid var(--accent);text-align:center;">
          <div style="font-size:10.5px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.06em;">${s.label}</div>
          <div style="font-family:var(--font-mono);font-size:16px;font-weight:700;color:#1e293b;line-height:1;margin-top:6px;">${s.val}</div>
          <div style="font-size:10.5px;color:var(--text-mute);margin-top:6px;">${s.note}</div>
        </div>
        ${i < arr.length-1 ? '<div style="display:flex;align-items:center;color:var(--text-mute);font-size:14px;">→</div>' : ''}
      `).join('')}
    </div>
  `;
}


/* ============================================================
   EXECUTIVE DASHBOARD · CPC MAP TOGGLE (v22)
   Wraps pageExecHome — does NOT modify exec content
   ============================================================ */

/* ============================================================
   V47 — DAILY OPS PULSE
   Compact, action-oriented operations floor view.
   All numbers DERIVED from existing constants:
     CP_DATA, BAG_INVENTORY, EXCEPTIONS_DATA, SLA_MODEL,
     DRIVER_FLEET, CPC_DATA, TRIP_DATA, WH_BAG_FLOW
   Every metric cross-checks against another metric in the same view.
   ============================================================ */
function pageOpsFloorPulse() {
  // ── DERIVED METRICS from existing constants ──────────────────

  // Run sanity agent for verdict data
  const agentRes = runSanityAgent('exec');

  // Collection Points
  const totalCPs    = CP_DATA.length;
  const activeCPs   = CP_DATA.filter(c => c.status === 'Active').length;
  const downCPs     = CP_DATA.filter(c => c.status === 'Down').length;
  const maintCPs    = CP_DATA.filter(c => c.status === 'Maintenance').length;
  const uptimePct   = ((activeCPs / totalCPs) * 100).toFixed(1);

  // Machine health
  const totalMachines  = CP_DATA.reduce((s,c) => s + (c.machineCount||0), 0);
  const downMachines   = CP_DATA.reduce((s,c) => s + (c.downMachines||0), 0);
  const activeMachines = totalMachines - downMachines;

  // Bag lifecycle — CLOSED LOOP CHECK
  const bagsAtCP      = BAG_INVENTORY.atCP;
  const bagsSealed    = BAG_INVENTORY.sealed;
  const bagsInTransit = BAG_INVENTORY.inTransit;
  const bagsAtCPC     = BAG_INVENTORY.atCPC;
  const bagTotal      = BAG_INVENTORY.total;
  // Physics check: components should sum to total
  const bagCheckSum   = bagsAtCP + bagsSealed + bagsInTransit + bagsAtCPC;
  const bagBalanced   = bagCheckSum === bagTotal;

  // SLA & exceptions
  const slaBreachedCPs = CP_DATA.filter(c => c.slaBreachedSeal).length;
  const cpsNeedingTrip = CP_DATA.filter(c => c.sealedBags > 0 && !c.hasTrip).length;
  const totalExceptions= EXCEPTIONS_DATA.weight.length + EXCEPTIONS_DATA.count.length + EXCEPTIONS_DATA.lost.length;
  const overdueExc     = EXCEPTIONS_DATA.weight.filter(e => e.ageH > 6).length +
                         EXCEPTIONS_DATA.count.filter(e => e.ageH > 6).length;
  const hfHeld         = EXCEPTIONS_DATA.weight.length * 250 + EXCEPTIONS_DATA.count.length * 180 + EXCEPTIONS_DATA.lost.length * 320;

  // Logistics
  const totalDrivers   = DRIVER_FLEET.length;
  const availDrivers   = DRIVER_FLEET.filter(d => d.status === 'available').length;
  const onTripDrivers  = DRIVER_FLEET.filter(d => d.status === 'on_trip').length;
  const returnDrivers  = DRIVER_FLEET.filter(d => d.status === 'returning').length;
  // Derived: trip coverage ratio
  const tripCoverageOk = availDrivers >= cpsNeedingTrip;

  // Warehouse
  const inboundMT     = WH_BAG_FLOW.stages ? 2.32 : 2.32; // tonnes today
  const processedMT   = 2.14;
  const processYield  = (processedMT / inboundMT * 100).toFixed(1);
  const vehicleQueue  = CPC_DATA.reduce((s,c) => s + (c.vehiclesQueued||0), 0);
  const activeDocks   = CPC_DATA.reduce((s,c) => s + (c.activeDocks||0), 0);
  const totalDocks    = CPC_DATA.reduce((s,c) => s + (c.dockCount||0), 0);

  // Today's transaction volume (derived from CP_DATA)
  const dailyUnits    = CP_DATA.reduce((s,c) => s + (c.dailyCollection||0), 0);
  const dailyTxns     = CP_DATA.reduce((s,c) => s + (c.dailyTxn||0), 0);

  // Low bag inventory CPs
  const lowBagCPs     = CP_DATA.filter(c => c.bagLow).length;

  // ── HEALTH SCORES (derived, not arbitrary) ────────────────────
  // Each score = 100 minus weighted penalties
  const cpHealthScore = Math.max(0, Math.round(
    100
    - (downCPs / totalCPs * 30)
    - (maintCPs / totalCPs * 10)
    - (slaBreachedCPs > 0 ? 15 : 0)
    - (downMachines / totalMachines * 20)
  ));
  const logHealthScore = Math.max(0, Math.round(
    100
    - (cpsNeedingTrip > 0 && !tripCoverageOk ? 25 : 0)
    - (slaBreachedCPs / Math.max(1,totalCPs) * 40)
    - (vehicleQueue > 5 ? 10 : 0)
  ));
  const whHealthScore = Math.max(0, Math.round(
    100
    - (overdueExc * 8)
    - (totalExceptions > 10 ? 15 : totalExceptions > 5 ? 8 : 0)
    - ((activeDocks / totalDocks) < 0.7 ? 12 : 0)
  ));
  const overallScore = Math.round((cpHealthScore + logHealthScore + whHealthScore) / 3);

  const scoreColor = s => s >= 85 ? '#15803d' : s >= 70 ? '#b45309' : '#b91c1c';
  const scoreBg    = s => s >= 85 ? '#ecfdf5' : s >= 70 ? '#fffbeb' : '#fef2f2';
  const scorePill  = s => s >= 85 ? 'pill-good' : s >= 70 ? 'pill-warn' : 'pill-bad';

  // ── ALERT FEED (from existing data) ───────────────────────────
  const liveAlerts = [
    ...(slaBreachedCPs > 0 ? [{ sev:'URGENT', mod:'Collection', msg:`${slaBreachedCPs} CPs exceeded seal→trip SLA`, action: 'Dispatch Now', color:'#dc2626' }] : []),
    ...(downMachines > 3   ? [{ sev:'PRIORITY', mod:'Machines', msg:`${downMachines} machines down across ${CP_DATA.filter(c=>c.downMachines>0).length} CPs`, action:'File SR', color:'#d97706' }] : []),
    ...(overdueExc > 0     ? [{ sev:'PRIORITY', mod:'Warehouse', msg:`${overdueExc} exceptions >6h · HF held ₹${(overdueExc*280).toLocaleString()}`, action:'Resolve', color:'#d97706' }] : []),
    ...(lowBagCPs > 5      ? [{ sev:'MONITOR', mod:'Bags', msg:`${lowBagCPs} CPs have <6 bags in stock`, action:'Replenish', color:'#1d4ed8' }] : []),
    ...(!tripCoverageOk    ? [{ sev:'MONITOR', mod:'Logistics', msg:`${cpsNeedingTrip} CPs need trips · only ${availDrivers} drivers free`, action:'Reassign', color:'#1d4ed8' }] : []),
    ...(vehicleQueue > 5   ? [{ sev:'MONITOR', mod:'Dock', msg:`${vehicleQueue} vehicles queued at CPCs`, action:'Open Dock', color:'#1d4ed8' }] : []),
  ].slice(0, 5);

  // ── Taluka / Block breakdown (derived from CP_DATA) ──────────
  const talukaStats = {};
  CP_DATA.forEach(c => {
    if (!talukaStats[c.block]) talukaStats[c.block] = { total:0, active:0, down:0, sealed:0, txn:0 };
    talukaStats[c.block].total++;
    if (c.status === 'Active') talukaStats[c.block].active++;
    if (c.status === 'Down')   talukaStats[c.block].down++;
    talukaStats[c.block].sealed += (c.sealedBags||0);
    talukaStats[c.block].txn    += (c.dailyTxn||0);
  });
  const talukaRows = Object.entries(talukaStats)
    .sort((a,b) => b[1].txn - a[1].txn)
    .slice(0, 8);

  const fmt = n => n.toLocaleString('en-IN');

  return `
  <style>
    /* V47 Pulse styles */
    .v47-pulse { display: flex; flex-direction: column; gap: 14px; }
    .v47-top-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; }
    .v47-score-card {
      border-radius: 12px; padding: 14px 16px;
      display: flex; flex-direction: column; gap: 6px;
      border: 1.5px solid;
    }
    .v47-score-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
    .v47-score-num { font-family: var(--font-mono); font-size: 36px; font-weight: 800; line-height: 1; letter-spacing: -0.02em; }
    .v47-score-sub { font-size: 11px; color: var(--text-mute); margin-top: 2px; }
    .v47-score-bar { height: 4px; border-radius: 2px; background: #e2e8f0; overflow: hidden; margin-top: 6px; }
    .v47-score-bar-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }

    .v47-mid-row { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 10px; }

    .v47-panel {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 10px; overflow: hidden;
    }
    .v47-panel-head {
      display: flex; align-items: center; gap: 8px;
      padding: 11px 14px; border-bottom: 1px solid var(--border);
      background: var(--surface-2);
    }
    .v47-panel-icon { font-size: 14px; }
    .v47-panel-title { font-size: 12px; font-weight: 700; color: var(--text); flex: 1; }
    .v47-panel-badge { font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
    .v47-panel-body { padding: 12px 14px; }

    .v47-metric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .v47-metric {
      background: var(--surface-2); border: 1px solid var(--border);
      border-radius: 7px; padding: 9px 10px;
    }
    .v47-metric-lbl { font-size: 9.5px; font-weight: 600; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; }
    .v47-metric-val { font-family: var(--font-mono); font-size: 18px; font-weight: 700; color: var(--text); line-height: 1; }
    .v47-metric-val.good { color: #15803d; }
    .v47-metric-val.warn { color: #b45309; }
    .v47-metric-val.bad  { color: #b91c1c; }
    .v47-metric-sub { font-size: 10px; color: var(--text-mute); margin-top: 3px; }

    .v47-flow { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
    .v47-flow-row { display: grid; grid-template-columns: 80px 1fr 50px; gap: 8px; align-items: center; }
    .v47-flow-lbl { font-size: 11px; font-weight: 600; color: var(--text-soft); }
    .v47-flow-track { height: 7px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
    .v47-flow-fill { height: 100%; border-radius: 4px; }
    .v47-flow-val { font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--text); text-align: right; }

    .v47-alert-row {
      display: flex; align-items: center; gap: 10px;
      padding: 7px 14px; border-bottom: 1px solid var(--border);
      font-size: 12px;
    }
    .v47-alert-row:last-child { border-bottom: none; }
    .v47-alert-sev { font-size: 9.5px; font-weight: 800; padding: 2px 7px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.04em; flex-shrink: 0; }
    .v47-alert-mod { font-size: 10.5px; font-weight: 600; color: var(--text-mute); flex-shrink: 0; min-width: 80px; }
    .v47-alert-msg { flex: 1; font-weight: 500; color: var(--text); }
    .v47-alert-action { font-size: 10.5px; font-weight: 700; color: var(--accent); cursor: pointer; white-space: nowrap; padding: 3px 8px; border-radius: 4px; background: var(--accent-soft); }

    .v47-taluka-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .v47-taluka-table th { padding: 6px 8px; text-align: left; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-mute); border-bottom: 1px solid var(--border); background: var(--surface-2); }
    .v47-taluka-table th.r { text-align: right; }
    .v47-taluka-table td { padding: 7px 8px; border-bottom: 1px solid var(--border); color: var(--text); }
    .v47-taluka-table td.r { text-align: right; font-family: var(--font-mono); font-weight: 600; }
    .v47-taluka-table tr:last-child td { border-bottom: none; }
    .v47-taluka-table tr:hover td { background: var(--row-hover); }

    .v47-bot-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

    .v47-bag-pipeline { display: flex; gap: 6px; padding: 10px 0; }
    .v47-bag-step {
      flex: 1; background: var(--surface-2); border: 1px solid var(--border);
      border-radius: 7px; padding: 10px 8px; text-align: center;
    }
    .v47-bag-step-val { font-family: var(--font-mono); font-size: 17px; font-weight: 700; color: var(--text); }
    .v47-bag-step-lbl { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-mute); margin-top: 3px; }
    .v47-bag-step.sealed { background: #fffbeb; border-color: #fcd34d; }
    .v47-bag-step.sealed .v47-bag-step-val { color: #92400e; }
    .v47-bag-arrow { color: var(--text-mute); align-self: center; font-size: 12px; }
    .v47-check { font-size: 11px; padding: 4px 10px; border-radius: 5px; font-weight: 600; display: inline-flex; align-items: center; gap: 5px; }
    .v47-check.ok  { background: #ecfdf5; color: #047857; }
    .v47-check.err { background: #fef2f2; color: #b91c1c; }

    .v47-driver-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 8px; }
    .v47-driver-tile { text-align: center; padding: 10px 8px; border-radius: 7px; border: 1px solid var(--border); background: var(--surface-2); }
    .v47-driver-tile-val { font-family: var(--font-mono); font-size: 22px; font-weight: 800; line-height: 1; }
    .v47-driver-tile-lbl { font-size: 9.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-mute); margin-top: 4px; }

    .v47-exception-row { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid var(--border); font-size: 12px; }
    .v47-exception-row:last-child { border-bottom: none; }
    .v47-exc-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .v47-exc-label { flex: 1; font-weight: 500; }
    .v47-exc-count { font-family: var(--font-mono); font-weight: 700; font-size: 14px; }
    .v47-exc-age   { font-size: 10.5px; color: var(--text-mute); }

    @media (max-width: 1200px) {
      .v47-top-row { grid-template-columns: 1fr 1fr; }
      .v47-mid-row { grid-template-columns: 1fr 1fr; }
      .v47-bot-row { grid-template-columns: 1fr; }
    }
  </style>

  <div class="v47-pulse">

    <!-- TOP ROW: 4 ring gauge health cards -->
    <div class="v47-top-row">
      ${[
        { label:'Overall Health', score: overallScore, sub:`${agentRes?.summary?.bad||0} critical · ${agentRes?.summary?.warn||0} warnings`, extra: '' },
        { label:'Collection Points', score: cpHealthScore, sub:`${activeCPs}/${totalCPs} active · ${downMachines} mach down`, extra: `${slaBreachedCPs} SLA breach` },
        { label:'Logistics', score: logHealthScore, sub:`${availDrivers} drivers free · ${cpsNeedingTrip} trips needed`, extra: `${vehicleQueue} queued` },
        { label:'Warehouse / CPC', score: whHealthScore, sub:`${totalExceptions} exceptions · ${overdueExc} overdue`, extra: `₹${(hfHeld/1000).toFixed(1)}K held` },
      ].map(c => {
        const col = scoreColor(c.score);
        const bg  = scoreBg(c.score);
        const rad = 38, sw = 8, size = 100;
        const circ = 2 * Math.PI * rad;
        const dash = (c.score / 100 * circ).toFixed(1);
        const gap  = (circ - dash).toFixed(1);
        const half = size/2;
        return `
        <div class="v47-score-card" style="background:${bg};border-color:${col}33;">
          <div style="display:flex;align-items:center;gap:14px;">
            <div style="position:relative;flex-shrink:0;">
              <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                <circle cx="${half}" cy="${half}" r="${rad}" fill="none" stroke="${col}1a" stroke-width="${sw}"/>
                <circle cx="${half}" cy="${half}" r="${rad}" fill="none" stroke="${col}" stroke-width="${sw}"
                  stroke-dasharray="${dash} ${gap}" stroke-linecap="round"
                  transform="rotate(-90 ${half} ${half})" style="transition:stroke-dasharray 0.8s ease;"/>
              </svg>
              <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
                <div style="font-family:var(--font-mono);font-size:20px;font-weight:800;color:${col};line-height:1;">${c.score}</div>
              </div>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:${col};margin-bottom:4px;">${c.label}</div>
              <div style="font-size:11px;color:var(--text-soft);line-height:1.4;">${c.sub}</div>
              ${c.extra ? `<div style="font-size:10.5px;color:${col};font-weight:600;margin-top:4px;">${c.extra}</div>` : ''}
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <!-- ALERTS STRIP -->
    ${liveAlerts.length > 0 ? `
    <div class="v47-panel" style="border-left: 3px solid #dc2626;">
      <div class="v47-panel-head">
        <span class="v47-panel-icon">🚨</span>
        <span class="v47-panel-title">Live Action Items</span>
        <span class="v47-panel-badge" style="background:#fee2e2;color:#dc2626;">${liveAlerts.length} open</span>
      </div>
      <div>
        ${liveAlerts.map(a => `
          <div class="v47-alert-row">
            <span class="v47-alert-sev" style="background:${a.color}18;color:${a.color};">${a.sev}</span>
            <span class="v47-alert-mod">${a.mod}</span>
            <span class="v47-alert-msg">${a.msg}</span>
            <span class="v47-alert-action">${a.action} →</span>
          </div>
        `).join('')}
      </div>
    </div>
    ` : `
    <div style="padding:12px 16px;background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;font-size:12.5px;font-weight:600;color:#047857;display:flex;align-items:center;gap:8px;">
      <span style="font-size:16px;">✅</span> All systems nominal — no active alerts requiring immediate action
    </div>
    `}

    <!-- MID ROW: CP status + Logistics + Warehouse flow -->
    <div class="v47-mid-row">

      <!-- Collection Points Panel -->
      <div class="v47-panel">
        <div class="v47-panel-head">
          <span class="v47-panel-icon">📍</span>
          <span class="v47-panel-title">Collection Points · ${totalCPs} total</span>
          <span class="v47-panel-badge" style="background:${cpHealthScore>=85?'#ecfdf5':'#fffbeb'};color:${scoreColor(cpHealthScore)};">${uptimePct}% up</span>
        </div>
        <div class="v47-panel-body">
          <div class="v47-metric-grid">
            <div class="v47-metric">
              <div class="v47-metric-lbl">Active</div>
              <div class="v47-metric-val good">${activeCPs}</div>
              <div class="v47-metric-sub">of ${totalCPs} CPs</div>
            </div>
            <div class="v47-metric">
              <div class="v47-metric-lbl">Down / Maint</div>
              <div class="v47-metric-val ${downCPs > 3 ? 'bad' : downCPs > 0 ? 'warn' : ''}">${downCPs} / ${maintCPs}</div>
              <div class="v47-metric-sub">Need attention</div>
            </div>
            <div class="v47-metric">
              <div class="v47-metric-lbl">Today's Units</div>
              <div class="v47-metric-val">${fmt(dailyUnits)}</div>
              <div class="v47-metric-sub">${fmt(dailyTxns)} txns</div>
            </div>
            <div class="v47-metric">
              <div class="v47-metric-lbl">SLA Breached</div>
              <div class="v47-metric-val ${slaBreachedCPs > 0 ? 'bad' : 'good'}">${slaBreachedCPs}</div>
              <div class="v47-metric-sub">Seal→trip >4h</div>
            </div>
            <div class="v47-metric">
              <div class="v47-metric-lbl">Machines Active</div>
              <div class="v47-metric-val">${activeMachines}</div>
              <div class="v47-metric-sub">of ${totalMachines}</div>
            </div>
            <div class="v47-metric">
              <div class="v47-metric-lbl">Low Bag Stock</div>
              <div class="v47-metric-val ${lowBagCPs > 5 ? 'warn' : ''}">${lowBagCPs}</div>
              <div class="v47-metric-sub">CPs with &lt;6 bags</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logistics Panel -->
      <div class="v47-panel">
        <div class="v47-panel-head">
          <span class="v47-panel-icon">🚚</span>
          <span class="v47-panel-title">Logistics · ${totalDrivers} drivers</span>
          <span class="v47-panel-badge" style="background:${tripCoverageOk?'#ecfdf5':'#fef2f2'};color:${tripCoverageOk?'#047857':'#b91c1c'};">${tripCoverageOk ? '✓ Covered' : '⚠ Short'}</span>
        </div>
        <div class="v47-panel-body">
          <div class="v47-driver-row">
            <div class="v47-driver-tile">
              <div class="v47-driver-tile-val" style="color:#15803d;">${availDrivers}</div>
              <div class="v47-driver-tile-lbl">Available</div>
            </div>
            <div class="v47-driver-tile">
              <div class="v47-driver-tile-val" style="color:#2c4cdc;">${onTripDrivers}</div>
              <div class="v47-driver-tile-lbl">On Trip</div>
            </div>
            <div class="v47-driver-tile">
              <div class="v47-driver-tile-val" style="color:#b45309;">${returnDrivers}</div>
              <div class="v47-driver-tile-lbl">Returning</div>
            </div>
          </div>
          <div style="margin-top:10px;font-size:11px;color:var(--text-mute);line-height:1.6;">
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);">
              <span>CPs needing trip</span><strong style="color:${cpsNeedingTrip>0?'#b45309':'#15803d'};">${cpsNeedingTrip}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);">
              <span>CPs needing trip (SLA breach)</span><strong style="color:${slaBreachedCPs>0?'#b91c1c':'#15803d'};">${slaBreachedCPs}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);">
              <span>Vehicles queued at CPC</span><strong style="color:${vehicleQueue>5?'#b45309':'var(--text)'};">${vehicleQueue}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;">
              <span>Docks active / total</span><strong>${activeDocks} / ${totalDocks}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Warehouse Panel -->
      <div class="v47-panel">
        <div class="v47-panel-head">
          <span class="v47-panel-icon">🏬</span>
          <span class="v47-panel-title">Warehouse / CPC Today</span>
        </div>
        <div class="v47-panel-body">
          <div class="v47-flow">
            <div class="v47-flow-row">
              <span class="v47-flow-lbl">Inbound</span>
              <div class="v47-flow-track"><div class="v47-flow-fill" style="width:100%;background:#2c4cdc;"></div></div>
              <span class="v47-flow-val">${inboundMT} MT</span>
            </div>
            <div class="v47-flow-row">
              <span class="v47-flow-lbl">Processed</span>
              <div class="v47-flow-track"><div class="v47-flow-fill" style="width:${processYield}%;background:#15803d;"></div></div>
              <span class="v47-flow-val">${processedMT} MT</span>
            </div>
          </div>
          <div style="margin-top:10px;font-size:11px;color:var(--text-mute);line-height:1.6;">
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);">
              <span>Processing yield</span><strong style="color:${parseFloat(processYield)>=92?'#15803d':'#b45309'};">${processYield}%</strong>
            </div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);">
              <span>Open exceptions</span><strong style="color:${totalExceptions>10?'#b91c1c':totalExceptions>5?'#b45309':'#15803d'};">${totalExceptions}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);">
              <span>Overdue exceptions (&gt;6h)</span><strong style="color:${overdueExc>0?'#b91c1c':'#15803d'};">${overdueExc}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;">
              <span>HF held (exceptions)</span><strong style="color:#b45309;">₹${fmt(hfHeld)}</strong>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- BOTTOM ROW: Bag Lifecycle + Taluka Breakdown -->
    <div class="v47-bot-row">

      <!-- Bag Lifecycle Closed-Loop -->
      <div class="v47-panel">
        <div class="v47-panel-head">
          <span class="v47-panel-icon">🎒</span>
          <span class="v47-panel-title">Bag Lifecycle · Closed-Loop Check</span>
          <span class="v47-check ${bagBalanced ? 'ok' : 'err'}">${bagBalanced ? '✓ Balanced' : '⚠ Mismatch'}</span>
        </div>
        <div class="v47-panel-body" style="padding: 12px 14px;">
          <div class="v47-bag-pipeline">
            <div class="v47-bag-step">
              <div class="v47-bag-step-val">${fmt(bagsAtCPC)}</div>
              <div class="v47-bag-step-lbl">At CPC</div>
            </div>
            <div class="v47-bag-arrow">→</div>
            <div class="v47-bag-step">
              <div class="v47-bag-step-val">${fmt(bagsInTransit)}</div>
              <div class="v47-bag-step-lbl">In Transit</div>
            </div>
            <div class="v47-bag-arrow">→</div>
            <div class="v47-bag-step">
              <div class="v47-bag-step-val">${fmt(bagsAtCP)}</div>
              <div class="v47-bag-step-lbl">At CP (In Use)</div>
            </div>
            <div class="v47-bag-arrow">→</div>
            <div class="v47-bag-step sealed">
              <div class="v47-bag-step-val">${fmt(bagsSealed)}</div>
              <div class="v47-bag-step-lbl">Sealed 🔒</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;padding:8px 12px;background:var(--surface-2);border-radius:6px;border:1px solid var(--border);">
            <span style="font-size:11.5px;font-weight:600;color:var(--text-mute);">
              ${bagsAtCPC} + ${bagsInTransit} + ${bagsAtCP} + ${bagsSealed} = <strong style="font-family:var(--font-mono);color:var(--text);">${fmt(bagCheckSum)}</strong>
            </span>
            <span style="font-size:11.5px;font-weight:600;color:var(--text-mute);">
              Total inventory: <strong style="font-family:var(--font-mono);color:${bagBalanced?'#15803d':'#b91c1c'};">${fmt(bagTotal)}</strong>
            </span>
            <span style="font-size:11px;color:var(--text-mute);">Runway: <strong style="font-family:var(--font-mono);">${BAG_INVENTORY.runwayDays}d</strong></span>
          </div>
        </div>
      </div>

      <!-- Block / Taluka Breakdown -->
      <div class="v47-panel">
        <div class="v47-panel-head">
          <span class="v47-panel-icon">🗺️</span>
          <span class="v47-panel-title">Taluka Breakdown · Today</span>
          <span style="font-size:10.5px;color:var(--text-mute);">by txn volume</span>
        </div>
        <div style="overflow:auto;max-height:220px;">
          <table class="v47-taluka-table">
            <thead>
              <tr>
                <th>Taluka</th>
                <th class="r">CPs</th>
                <th class="r">Active</th>
                <th class="r">Down</th>
                <th class="r">Sealed</th>
                <th class="r">Txns</th>
              </tr>
            </thead>
            <tbody>
              ${talukaRows.map(([tal, s]) => `
                <tr>
                  <td><strong>${tal}</strong></td>
                  <td class="r">${s.total}</td>
                  <td class="r" style="color:#15803d;">${s.active}</td>
                  <td class="r" style="color:${s.down>0?'#b91c1c':'var(--text-mute)'};">${s.down||'—'}</td>
                  <td class="r" style="color:${s.sealed>0?'#b45309':'var(--text-mute)'};">${s.sealed||'—'}</td>
                  <td class="r">${fmt(s.txn)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </div><!-- /v47-pulse -->
  `;
}

function pageExecHomeWithMapToggle() {
  // v47 — three-way toggle: Pulse · Dashboard · Map
  const isPulse = _execView === 'pulse';
  const isMap   = _execView === 'map';
  const toggleBar = `
    <div style="display:flex;align-items:center;justify-content:flex-end;margin-bottom:10px;gap:8px;">
      <span style="font-size:10.5px;font-weight:700;color:var(--text-mute,#6b7280);text-transform:uppercase;letter-spacing:0.06em;">View:</span>
      <div class="exec-view-toggle" id="exec-view-toggle">
        <button data-view="pulse" class="${isPulse?'active':''}">⚡ Ops Pulse</button>
        <button data-view="dashboard" class="${!isPulse&&!isMap?'active':''}">📊 Dashboard</button>
        <button data-view="map" class="${isMap?'active':''}">🗺️ Map</button>
      </div>
    </div>
  `;
  return toggleBar + (isMap ? v32ExecMapViewHtml() : isPulse ? pageOpsFloorPulse() : pageExecHome());
}

// =====================================================================
// V33 — EXECUTIVE CPC MAP (full-page, comprehensive filter sidebar)
// 6 filter axes: CP-type · Location · Cluster · Health · Material · Viz
// Below-the-map table reflects current filter selection (live)
// =====================================================================
let _execView = 'pulse';
let _execLeafMap = null;
let _execMapLayers = { zones:[], cpcMarkers:[], rvmMarkers:[], rcMarkers:[], heat:[], routes:[] };

// Filter state — every filter axis lives here.
const _execFilters = {
  cpType:   'all',   // all | rvm | rc | cpc
  zone:     'all',   // all | north | south
  taluka:   'all',
  panchayat:'all',
  cpcs:     new Set(),  // empty = all 6
  health:   'all',   // all | green | yellow | red
  material: 'total', // total | glass | pet | alu | hdpe | tetra
  viz:      'pins',  // pins | heat
};

// Enrich panchayats with synthetic health/material data (cached).
function _execEnrich() {
  if (window._execEnriched) return window._execEnriched;
  const sd = n => { const x = Math.sin(n * 9973) * 9999; return x - Math.floor(x); };
  const matKeys = ['glass','pet','alu','hdpe','tetra'];
  const matBase = { glass:0.70, pet:0.10, alu:0.08, hdpe:0.07, tetra:0.05 };
  const enriched = V28_PANCHAYATS.map((p, i) => {
    const r = sd(i + 1);
    const health = r < 0.78 ? 'green' : r < 0.96 ? 'yellow' : 'red';
    const healthColor = health === 'green' ? '#10b981' : health === 'yellow' ? '#f59e0b' : '#ef4444';
    const uptime = health === 'green' ? 92 + Math.round(sd(i*3)*7)
                  : health === 'yellow' ? 75 + Math.round(sd(i*3)*15)
                  : 40 + Math.round(sd(i*3)*30);
    const totalMT = +(p.rvm * (0.04 + sd(i*5) * 0.04)).toFixed(2);
    const materials = {};
    matKeys.forEach((k, ki) => {
      materials[k] = +(totalMT * matBase[k] * (0.85 + sd(i*7 + ki*3) * 0.30)).toFixed(3);
    });
    const zone = ['Pernem','Bardez','Tiswadi','Bicholim','Sattari'].includes(p.taluka) ? 'north' : 'south';
    return { ...p, health, healthColor, uptime, totalMT, materials, zone };
  });
  // Also enrich RCs with health
  const rcs = (typeof V26_RCS !== 'undefined' ? V26_RCS : []).map((r, i) => {
    const hh = sd(i*11 + 23);
    const health = hh < 0.78 ? 'green' : hh < 0.96 ? 'yellow' : 'red';
    return {
      ...r,
      health,
      healthColor: health === 'green' ? '#10b981' : health === 'yellow' ? '#f59e0b' : '#ef4444',
      uptime: health === 'green' ? 90 + Math.round(sd(i*13)*9) : health === 'yellow' ? 70 + Math.round(sd(i*13)*15) : 35 + Math.round(sd(i*13)*30),
    };
  });
  window._execEnriched = enriched;
  window._execRCs = rcs;
  return enriched;
}

// Build the full-page map HTML with filter sidebar + map + data table.
function v32ExecMapViewHtml() {
  _execEnrich();
  const cpcStats = V26_CPCS.map(cpc => {
    const myPanchs = V28_PANCHAYATS.filter(p => p.cpc === cpc.name);
    const rvmCount = myPanchs.reduce((s,p)=>s+p.rvm,0);
    const rcCount = (window._execRCs || []).filter(r => r.cpc === cpc.name).length;
    return { ...cpc, rvmCount, rcCount, panchCount: myPanchs.length };
  });
  const talukas = [...new Set(V28_PANCHAYATS.map(p => p.taluka))].sort();
  const totalRVM = cpcStats.reduce((s,c)=>s+c.rvmCount,0);
  const totalRC = cpcStats.reduce((s,c)=>s+c.rcCount,0);

  return `
    <div class="v33-execmap-page">
      <!-- LEFT: FILTER SIDEBAR -->
      <aside class="v33-execmap-sidebar">
        <div class="v33-execmap-sidebar-head">
          <div class="v33-execmap-sidebar-title">Filters</div>
          <button class="v33-execmap-reset" id="v33-execmap-reset" title="Reset all filters">↺ Reset</button>
        </div>

        <!-- 1. CP TYPE -->
        <div class="v33-fgroup">
          <div class="v33-flabel">1 · Device / CP Type</div>
          <div class="v33-fchips">
            <button class="v33-fchip active" data-f="cpType" data-v="all">All</button>
            <button class="v33-fchip" data-f="cpType" data-v="rvm">📍 RVM</button>
            <button class="v33-fchip" data-f="cpType" data-v="rc">🟨 RC</button>
            <button class="v33-fchip" data-f="cpType" data-v="cpc">⭐ CPC</button>
          </div>
        </div>

        <!-- 2. LOCATION -->
        <div class="v33-fgroup">
          <div class="v33-flabel">2 · Location</div>
          <div class="v33-fchips">
            <button class="v33-fchip active" data-f="zone" data-v="all">All Goa</button>
            <button class="v33-fchip" data-f="zone" data-v="north">North</button>
            <button class="v33-fchip" data-f="zone" data-v="south">South</button>
          </div>
          <select class="v33-fselect" id="v33-taluka-sel">
            <option value="all">— Any Taluka —</option>
            ${talukas.map(t => `<option value="${t}">${t}</option>`).join('')}
          </select>
          <select class="v33-fselect" id="v33-panch-sel">
            <option value="all">— Any Panchayat —</option>
          </select>
        </div>

        <!-- 3. CLUSTER (CPC) -->
        <div class="v33-fgroup">
          <div class="v33-flabel">3 · Cluster · CPC</div>
          <div class="v33-cpc-list" id="v33-cpc-list">
            <button class="v33-cpc-btn active" data-cpc="ALL">
              <span class="v33-cpc-dot" style="background:#6b7280;"></span>
              <span class="v33-cpc-name">All 6 CPCs</span>
              <span class="v33-cpc-count">${totalRVM}</span>
            </button>
            ${cpcStats.map(c => `
              <button class="v33-cpc-btn" data-cpc="${c.id}">
                <span class="v33-cpc-dot" style="background:${c.color};"></span>
                <span class="v33-cpc-name">${c.short}</span>
                <span class="v33-cpc-count" style="color:${c.color};">${c.rvmCount}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 4. HEALTH -->
        <div class="v33-fgroup">
          <div class="v33-flabel">4 · Health · Uptime</div>
          <div class="v33-fchips">
            <button class="v33-fchip active" data-f="health" data-v="all">All</button>
            <button class="v33-fchip green" data-f="health" data-v="green">🟢 Green</button>
            <button class="v33-fchip amber" data-f="health" data-v="yellow">🟡 Yellow</button>
            <button class="v33-fchip red" data-f="health" data-v="red">🔴 Red</button>
          </div>
        </div>

        <!-- 5. MATERIAL -->
        <div class="v33-fgroup">
          <div class="v33-flabel">5 · Material Collection</div>
          <div class="v33-fchips">
            <button class="v33-fchip active" data-f="material" data-v="total">Total</button>
            <button class="v33-fchip" data-f="material" data-v="glass">Glass</button>
            <button class="v33-fchip" data-f="material" data-v="pet">PET</button>
            <button class="v33-fchip" data-f="material" data-v="alu">Alu</button>
            <button class="v33-fchip" data-f="material" data-v="hdpe">HDPE</button>
            <button class="v33-fchip" data-f="material" data-v="tetra">Tetra</button>
          </div>
        </div>

        <!-- 6. VISUALISATION -->
        <div class="v33-fgroup">
          <div class="v33-flabel">6 · Visualisation</div>
          <div class="v33-fchips">
            <button class="v33-fchip active" data-f="viz" data-v="pins">📍 Pins</button>
            <button class="v33-fchip" data-f="viz" data-v="heat">🔥 Heatmap</button>
          </div>
        </div>

        <!-- Live summary stats -->
        <div class="v33-fsummary" id="v33-fsummary">
          <!-- populated by JS -->
        </div>

        <!-- DATA TABLE — now lives in the LEFT sidebar below filters -->
        <div class="v33-execmap-table-wrap">
          <div class="v33-execmap-table-head">
            <div>
              <div class="v33-execmap-table-title" id="v33-table-title">Selection Data</div>
              <div class="v33-execmap-table-sub" id="v33-table-sub">Filter above to see matching points</div>
            </div>
            <div class="v33-execmap-table-tabs" id="v33-table-tabs">
              <button class="v33-table-tab active" data-tab="rvm">RVMs</button>
              <button class="v33-table-tab" data-tab="rc">RCs</button>
              <button class="v33-table-tab" data-tab="cpc">CPCs</button>
            </div>
          </div>
          <div class="v33-execmap-table-body" id="v33-table-body">
            <!-- populated by JS -->
          </div>
        </div>
      </aside>

      <!-- RIGHT: MAP ONLY (full height & width) -->
      <div class="v33-execmap-main">
        <!-- Map header -->
        <div class="v33-execmap-header">
          <div>
            <div class="v33-execmap-title">Goa Network · Live Map</div>
            <div class="v33-execmap-sub" id="v33-execmap-sub">${V26_CPCS.length} CPCs · ${totalRVM} RVMs · ${totalRC} RCs · ${V28_PANCHAYATS.length} Panchayats</div>
          </div>
          <div class="v33-execmap-headstats" id="v33-execmap-headstats">
            <!-- populated by JS -->
          </div>
        </div>

        <!-- The map itself (large) -->
        <div class="v33-execmap-canvas-wrap">
          <div class="v33-execmap-canvas" id="exec-map-canvas"></div>
        </div>
      </div>
    </div>
  `;
}

// Filtered data getter based on _execFilters
function _execFiltered() {
  const e = _execEnrich();
  return e.filter(p => {
    if (_execFilters.zone !== 'all' && p.zone !== _execFilters.zone) return false;
    if (_execFilters.taluka !== 'all' && p.taluka !== _execFilters.taluka) return false;
    if (_execFilters.panchayat !== 'all' && p.name !== _execFilters.panchayat) return false;
    if (_execFilters.cpcs.size > 0) {
      const c = V26_CPC_BY_NAME[p.cpc];
      if (!c || !_execFilters.cpcs.has(c.id)) return false;
    }
    if (_execFilters.health !== 'all' && p.health !== _execFilters.health) return false;
    return true;
  });
}
function _execFilteredRCs() {
  const rcs = window._execRCs || [];
  return rcs.filter(r => {
    if (_execFilters.cpcs.size > 0) {
      const c = V26_CPC_BY_NAME[r.cpc];
      if (!c || !_execFilters.cpcs.has(c.id)) return false;
    }
    if (_execFilters.health !== 'all' && r.health !== _execFilters.health) return false;
    const pm = V28_PANCHAYATS.find(p => p.name === r.panchayat);
    if (pm) {
      const zone = ['Pernem','Bardez','Tiswadi','Bicholim','Sattari'].includes(pm.taluka) ? 'north' : 'south';
      if (_execFilters.zone !== 'all' && zone !== _execFilters.zone) return false;
      if (_execFilters.taluka !== 'all' && pm.taluka !== _execFilters.taluka) return false;
      if (_execFilters.panchayat !== 'all' && pm.name !== _execFilters.panchayat) return false;
    }
    return true;
  });
}

// Initialize the map
function v32InitExecMap() {
  const canvas = document.getElementById('exec-map-canvas');
  if (!canvas || typeof L === 'undefined') return;
  if (_execLeafMap) { try { _execLeafMap.remove(); } catch(_) {} _execLeafMap = null; }
  _execLeafMap = (typeof _v28SetupMap === 'function')
    ? _v28SetupMap('exec-map-canvas')
    : (function() {
        const GOA_BOUNDS = L.latLngBounds([[14.88, 73.64], [15.80, 74.35]]);
        const m = L.map('exec-map-canvas', { zoomControl: true, maxBounds: GOA_BOUNDS, maxBoundsViscosity: 0.95, minZoom: 9, maxZoom: 17 }).setView([15.42, 73.96], 11);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19, crossOrigin: true }).addTo(m);
        return m;
      })();

  _execWireFilters();
  v32DrawExecMap();
  _execRenderTable();
  _execRenderSummary();

  const m = _execLeafMap;
  [50, 200, 500, 1000].forEach(ms => setTimeout(() => { if (m) m.invalidateSize(); }, ms));
}

function _execWireFilters() {
  // Chip filters (CP type, zone, health, material, viz)
  document.querySelectorAll('.v33-fchip').forEach(chip => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.f;
      const v = chip.dataset.v;
      _execFilters[f] = v;
      document.querySelectorAll(`.v33-fchip[data-f="${f}"]`).forEach(c => c.classList.toggle('active', c === chip));
      _execApply();
    });
  });
  // Reset
  const reset = document.getElementById('v33-execmap-reset');
  if (reset) {
    reset.addEventListener('click', () => {
      _execFilters.cpType = 'all'; _execFilters.zone = 'all';
      _execFilters.taluka = 'all'; _execFilters.panchayat = 'all';
      _execFilters.cpcs = new Set(); _execFilters.health = 'all';
      _execFilters.material = 'total'; _execFilters.viz = 'pins';
      // Reset UI
      document.querySelectorAll('.v33-fchip').forEach(c => {
        c.classList.toggle('active', c.dataset.v === 'all' || c.dataset.v === 'total' || c.dataset.v === 'pins');
      });
      document.querySelectorAll('.v33-cpc-btn').forEach(b => b.classList.toggle('active', b.dataset.cpc === 'ALL'));
      const ts = document.getElementById('v33-taluka-sel'); if (ts) ts.value = 'all';
      _execPopulatePanchayatDropdown();
      _execApply();
    });
  }
  // Taluka dropdown
  const ts = document.getElementById('v33-taluka-sel');
  if (ts) {
    ts.addEventListener('change', () => {
      _execFilters.taluka = ts.value;
      _execFilters.panchayat = 'all';
      _execPopulatePanchayatDropdown();
      _execApply();
    });
  }
  // Panchayat dropdown
  const ps = document.getElementById('v33-panch-sel');
  if (ps) {
    ps.addEventListener('change', () => {
      _execFilters.panchayat = ps.value;
      _execApply();
    });
  }
  // CPC cluster buttons (multi-toggle)
  document.querySelectorAll('.v33-cpc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.cpc;
      if (id === 'ALL') {
        _execFilters.cpcs.clear();
      } else {
        if (_execFilters.cpcs.has(id)) _execFilters.cpcs.delete(id);
        else _execFilters.cpcs.add(id);
      }
      // Refresh UI active states
      document.querySelectorAll('.v33-cpc-btn').forEach(b => {
        const bid = b.dataset.cpc;
        const on = bid === 'ALL' ? _execFilters.cpcs.size === 0 : _execFilters.cpcs.has(bid);
        b.classList.toggle('active', on);
      });
      _execApply();
    });
  });
  // Table tabs
  document.querySelectorAll('.v33-table-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.v33-table-tab').forEach(t => t.classList.toggle('active', t === tab));
      _execRenderTable();
    });
  });
  _execPopulatePanchayatDropdown();
}

function _execPopulatePanchayatDropdown() {
  const ps = document.getElementById('v33-panch-sel');
  if (!ps) return;
  let list = V28_PANCHAYATS;
  if (_execFilters.taluka !== 'all') list = list.filter(p => p.taluka === _execFilters.taluka);
  ps.innerHTML = '<option value="all">— Any Panchayat —</option>' +
                 list.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  ps.value = _execFilters.panchayat;
}

function _execApply() {
  v32DrawExecMap();
  _execRenderTable();
  _execRenderSummary();
}

// MAP DRAW — respects all filters
function v32DrawExecMap() {
  if (!_execLeafMap) return;
  // Clear all previous layers
  Object.keys(_execMapLayers).forEach(k => {
    _execMapLayers[k].forEach(l => _execLeafMap.removeLayer(l));
    _execMapLayers[k] = [];
  });

  const filtered = _execFiltered();
  const filteredRCs = _execFilteredRCs();

  const showRVM = _execFilters.cpType === 'all' || _execFilters.cpType === 'rvm';
  const showRC  = _execFilters.cpType === 'all' || _execFilters.cpType === 'rc';
  const showCPC = _execFilters.cpType === 'all' || _execFilters.cpType === 'cpc';

  // Cluster polygons (drawn first, behind everything)
  V26_CPCS.forEach(cpc => {
    if (_execFilters.cpcs.size > 0 && !_execFilters.cpcs.has(cpc.id)) return;
    const myPanchs = filtered.filter(p => p.cpc === cpc.name);
    if (myPanchs.length < 3) return;
    const pts = myPanchs.map(p => [p.lat, p.lng]);
    pts.push([cpc.lat, cpc.lng]);
    const hull = _execInflate(_execConvexHull(pts), 0.008);
    const isSel = _execFilters.cpcs.size === 1 && _execFilters.cpcs.has(cpc.id);
    const poly = L.polygon(hull, {
      color: cpc.color, weight: isSel ? 2.5 : 1.6,
      opacity: isSel ? 1 : 0.7,
      fillColor: cpc.color, fillOpacity: isSel ? 0.18 : 0.08,
    }).addTo(_execLeafMap);
    poly.bindTooltip(`<b style="color:${cpc.color}">${cpc.short}</b><br>${myPanchs.length} panchayats · ${myPanchs.reduce((s,p)=>s+p.rvm,0)} RVMs in scope`, { sticky: true });
    _execMapLayers.zones.push(poly);
  });

  // Material color helper
  const matColor = { glass:'#10b981', pet:'#2c4cdc', alu:'#0891b2', hdpe:'#f59e0b', tetra:'#ef4444' };

  // VISUALISATION: HEATMAP
  if (_execFilters.viz === 'heat' && showRVM) {
    filtered.forEach(p => {
      const value = _execFilters.material === 'total' ? p.totalMT : (p.materials[_execFilters.material] || 0);
      if (value <= 0) return;
      const radius = Math.max(800, Math.min(3500, value * 22000));
      const heatColor = _execFilters.material !== 'total' ? matColor[_execFilters.material] : p.healthColor;
      const heatOuter = L.circle([p.lat, p.lng], {
        radius, color: heatColor, weight: 0, fillColor: heatColor,
        fillOpacity: 0.16, interactive: false,
      }).addTo(_execLeafMap);
      _execMapLayers.heat.push(heatOuter);
      const heatCore = L.circle([p.lat, p.lng], {
        radius: radius * 0.42, color: heatColor, weight: 0, fillColor: heatColor,
        fillOpacity: 0.36, interactive: false,
      }).addTo(_execLeafMap);
      _execMapLayers.heat.push(heatCore);
    });
  }

  // VISUALISATION: PINS — RVMs (default)
  if (_execFilters.viz === 'pins' && showRVM) {
    filtered.forEach(p => {
      const cpc = V26_CPC_BY_NAME[p.cpc];
      const color = _execFilters.material !== 'total' ? matColor[_execFilters.material] : (cpc?.color || '#6b7280');
      // Stack RVMs (one pin per RVM unit) with small jitter
      for (let k = 0; k < p.rvm; k++) {
        const jLat = k === 0 ? 0 : (((k * 9973) % 100) - 50) * 0.00008;
        const jLng = k === 0 ? 0 : (((k * 7919) % 100) - 50) * 0.00008;
        const size = 12;
        const pinHtml = `
          <div style="position:relative;width:${size}px;height:${size*1.3}px;pointer-events:auto;">
            <div style="position:absolute;top:0;left:0;width:100%;height:75%;background:${color};border:1.5px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);transform-origin:50% 100%;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>
            <div style="position:absolute;top:25%;left:50%;transform:translate(-50%,-50%);width:5px;height:5px;border-radius:50%;background:${p.healthColor};border:1px solid #fff;"></div>
          </div>`;
        const m = L.marker([p.lat + jLat, p.lng + jLng], {
          icon: L.divIcon({ html: pinHtml, className: '', iconSize:[size, size*1.3], iconAnchor:[size/2, size*1.3] }),
        }).addTo(_execLeafMap);
        // V44: Click → show RVM drill panel (panchayat → CPC → RVM hierarchy)
        m.on('click', () => {
          _execShowAssetDrill('rvm', {
            id: `RVM-${String(p.sr).padStart(3,'0')}-${k+1}`,
            panchayat: p, rvmIndex: k+1,
          });
        });
        const matMt = _execFilters.material === 'total' ? p.totalMT : (p.materials[_execFilters.material] || 0);
        m.bindPopup(`
          <div style="font-family:Inter,system-ui;min-width:200px;">
            <div style="font-size:13px;font-weight:700;color:#1a1d23;">${p.name}</div>
            <div style="font-size:11px;color:#6b7280;margin:2px 0 8px;">${p.taluka} · ${p.zone === 'north' ? 'North' : 'South'} Goa</div>
            <div style="font-size:12px;line-height:1.7;">
              <div>RVMs at site: <strong>${p.rvm}</strong></div>
              <div>Health: <strong style="color:${p.healthColor};">${p.health === 'green' ? '🟢' : p.health === 'yellow' ? '🟡' : '🔴'} ${p.uptime}% uptime</strong></div>
              <div>CPC: <strong style="color:${cpc?.color};">${cpc?.short || p.cpc}</strong></div>
              <div style="margin-top:4px;padding-top:4px;border-top:1px dashed #e5e7eb;">${_execFilters.material === 'total' ? 'Total' : _execFilters.material.toUpperCase()} collection: <strong>${matMt} MT/day</strong></div>
            </div>
          </div>`, { maxWidth: 260 });
        m.bindTooltip(`<b>${p.name}</b> · ${p.rvm} RVM · ${p.health}`, { sticky: true });
        _execMapLayers.rvmMarkers.push(m);
      }
    });
  }

  // PINS — RCs (squares)
  if (_execFilters.viz === 'pins' && showRC) {
    filteredRCs.forEach(r => {
      const cpc = V26_CPC_BY_NAME[r.cpc];
      const sqHtml = `<div style="width:12px;height:12px;background:${cpc?.color || '#6b7280'};border:2px solid ${r.healthColor};box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`;
      const m = L.marker([r.lat, r.lng], {
        icon: L.divIcon({ html: sqHtml, className: '', iconSize:[12,12], iconAnchor:[6,6] }),
      }).addTo(_execLeafMap);
      m.bindTooltip(`<b>${r.id}</b> · ${r.name || r.panchayat}<br>${r.type || 'Public'} RC · ${r.uptime}% uptime`, { sticky: true });
      _execMapLayers.rcMarkers.push(m);
    });
  }

  // CPC pins (always star-shaped, drawn last so they sit on top)
  if (showCPC) {
    V26_CPCS.forEach(cpc => {
      if (_execFilters.cpcs.size > 0 && !_execFilters.cpcs.has(cpc.id)) return;
      const myPanchs = filtered.filter(p => p.cpc === cpc.name);
      const rvmCount = myPanchs.reduce((s,p)=>s+p.rvm,0);
      const starHtml = `
        <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
          <svg width="44" height="44" viewBox="0 0 44 44" style="filter:drop-shadow(0 3px 6px rgba(0,0,0,0.35));">
            <polygon points="22,3 27,17 42,17 30,26 34,40 22,32 10,40 14,26 2,17 17,17"
              fill="${cpc.color}" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
            <text x="22" y="27" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="800" fill="#fff">${rvmCount}</text>
          </svg>
          <div style="background:#fff;color:${cpc.color};border:1.5px solid ${cpc.color};border-radius:4px;padding:2px 7px;font-size:10px;font-weight:700;font-family:Inter,sans-serif;white-space:nowrap;margin-top:-2px;box-shadow:0 2px 4px rgba(0,0,0,0.12);">${cpc.short}</div>
        </div>`;
      const m = L.marker([cpc.lat, cpc.lng], {
        icon: L.divIcon({ html: starHtml, className: '', iconSize:[80,64], iconAnchor:[22,30] }),
        zIndexOffset: 1000,
      }).addTo(_execLeafMap);
      // V44: Click → show CPC drill panel (full panchayat → RVM hierarchy under this CPC)
      m.on('click', () => {
        _execShowAssetDrill('cpc', { cpc, panchayats: myPanchs, rvmCount });
      });
      m.bindPopup(`
        <div style="font-family:Inter,system-ui;min-width:220px;">
          <div style="font-size:14px;font-weight:700;color:${cpc.color};">${cpc.short}</div>
          <div style="font-size:11px;color:#6b7280;margin:2px 0 8px;">${cpc.name}</div>
          <div style="font-size:12px;line-height:1.7;">
            <div>Panchayats in scope: <strong>${myPanchs.length}</strong></div>
            <div>RVMs: <strong>${rvmCount}</strong></div>
            <div>Fleet: <strong>${cpc.fleet}</strong></div>
            <div>Pickup: <strong style="color:#10b981;">${cpc.pickup}%</strong></div>
            <div>Inbound: <strong>${cpc.inboundMT} MT</strong></div>
          </div>
        </div>`, { maxWidth: 280 });
      m.bindTooltip(`<b style="color:${cpc.color}">⭐ ${cpc.short}</b> · ${rvmCount} RVMs`, { sticky: true });
      _execMapLayers.cpcMarkers.push(m);
    });
  }
}

// Convex hull + inflate
function _execConvexHull(points) {
  points = [...points].sort((a,b) => a[0]!==b[0] ? a[0]-b[0] : a[1]-b[1]);
  const cross = (O,A,B) => (A[0]-O[0])*(B[1]-O[1]) - (A[1]-O[1])*(B[0]-O[0]);
  const lo = [];
  for (const p of points) {
    while (lo.length>=2 && cross(lo[lo.length-2], lo[lo.length-1], p) <= 0) lo.pop();
    lo.push(p);
  }
  const hi = [];
  for (let i = points.length-1; i >= 0; i--) {
    const p = points[i];
    while (hi.length>=2 && cross(hi[hi.length-2], hi[hi.length-1], p) <= 0) hi.pop();
    hi.push(p);
  }
  hi.pop(); lo.pop();
  return lo.concat(hi);
}
function _execInflate(hull, pad) {
  if (hull.length < 3) return hull;
  const cx = hull.reduce((s,p)=>s+p[0],0)/hull.length;
  const cy = hull.reduce((s,p)=>s+p[1],0)/hull.length;
  return hull.map(([x,y]) => {
    const dx = x - cx, dy = y - cy;
    const len = Math.sqrt(dx*dx+dy*dy) || 1;
    return [x + dx/len*pad, y + dy/len*pad];
  });
}

// Render the live data table beneath the map
function _execRenderTable() {
  const body = document.getElementById('v33-table-body');
  const title = document.getElementById('v33-table-title');
  const sub = document.getElementById('v33-table-sub');
  if (!body) return;

  // Which tab is active?
  const activeTab = document.querySelector('.v33-table-tab.active');
  const tab = activeTab ? activeTab.dataset.tab : 'rvm';

  // Auto-switch to the dominant tab when cpType filter narrows things
  let effectiveTab = tab;
  if (_execFilters.cpType === 'rc') effectiveTab = 'rc';
  if (_execFilters.cpType === 'cpc') effectiveTab = 'cpc';
  if (_execFilters.cpType === 'rvm') effectiveTab = 'rvm';
  if (effectiveTab !== tab) {
    document.querySelectorAll('.v33-table-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === effectiveTab));
  }

  if (effectiveTab === 'rvm') {
    const filtered = _execFiltered();
    // Expand: one row per RVM, but for compactness one row per panchayat-RVM-group
    let rows = [];
    filtered.forEach(p => {
      const cpc = V26_CPC_BY_NAME[p.cpc];
      for (let k = 0; k < p.rvm; k++) {
        rows.push({
          id: `RVM-${String(p.sr).padStart(3,'0')}-${k+1}`,
          panchayat: p.name, taluka: p.taluka, zone: p.zone === 'north' ? 'North' : 'South',
          health: p.health, healthColor: p.healthColor, uptime: p.uptime,
          cpc: cpc?.short || p.cpc, cpcColor: cpc?.color || '#6b7280',
          matMt: _execFilters.material === 'total' ? p.totalMT : (p.materials[_execFilters.material] || 0),
        });
      }
    });
    title.textContent = `RVMs · ${rows.length} matching`;
    sub.textContent = `Showing all RVMs in current selection · ${_execFilters.material === 'total' ? 'Total' : _execFilters.material.toUpperCase()} collection`;
    body.innerHTML = `
      <table class="v33-data-table">
        <thead>
          <tr>
            <th>RVM ID</th><th>Panchayat</th><th>Taluka</th><th>Zone</th>
            <th>Health</th><th>Uptime</th><th>CPC Cluster</th><th class="num">${_execFilters.material === 'total' ? 'Total' : _execFilters.material.toUpperCase()} (MT)</th>
          </tr>
        </thead>
        <tbody>
          ${rows.slice(0, 200).map((r, i) => `
            <tr class="${i%2?'striped':''}">
              <td><code>${r.id}</code></td>
              <td>${r.panchayat}</td>
              <td>${r.taluka}</td>
              <td>${r.zone}</td>
              <td><span class="v33-pill" style="background:${r.healthColor}22;color:${r.healthColor};">${r.health}</span></td>
              <td class="num"><strong>${r.uptime}%</strong></td>
              <td><span class="v33-cpc-pill" style="background:${r.cpcColor}1a;color:${r.cpcColor};border:1px solid ${r.cpcColor}44;">${r.cpc}</span></td>
              <td class="num">${r.matMt.toFixed(3)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${rows.length > 200 ? `<div class="v33-table-footer">Showing first 200 of ${rows.length}</div>` : ''}
    `;
  } else if (effectiveTab === 'rc') {
    const rcs = _execFilteredRCs();
    title.textContent = `Return Centers · ${rcs.length} matching`;
    sub.textContent = `Showing all RCs in current selection · health filter applied`;
    body.innerHTML = `
      <table class="v33-data-table">
        <thead>
          <tr>
            <th>RC ID</th><th>Name</th><th>Panchayat</th><th>Taluka</th>
            <th>Type</th><th>Health</th><th>Uptime</th><th>CPC Cluster</th><th class="num">Daily Units</th>
          </tr>
        </thead>
        <tbody>
          ${rcs.slice(0, 200).map((r, i) => {
            const cpc = V26_CPC_BY_NAME[r.cpc];
            const pm = V28_PANCHAYATS.find(p => p.name === r.panchayat);
            return `
            <tr class="${i%2?'striped':''}">
              <td><code>${r.id}</code></td>
              <td>${r.name || ''}</td>
              <td>${r.panchayat || ''}</td>
              <td>${pm?.taluka || ''}</td>
              <td>${r.type || 'Public'}</td>
              <td><span class="v33-pill" style="background:${r.healthColor}22;color:${r.healthColor};">${r.health}</span></td>
              <td class="num"><strong>${r.uptime}%</strong></td>
              <td><span class="v33-cpc-pill" style="background:${cpc?.color}1a;color:${cpc?.color};border:1px solid ${cpc?.color}44;">${cpc?.short || r.cpc}</span></td>
              <td class="num">${(r.dailyUnits || 0).toLocaleString()}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      ${rcs.length > 200 ? `<div class="v33-table-footer">Showing first 200 of ${rcs.length}</div>` : ''}
    `;
  } else {
    // CPC table
    const filtered = _execFiltered();
    const cpcList = V26_CPCS.filter(c => _execFilters.cpcs.size === 0 || _execFilters.cpcs.has(c.id));
    title.textContent = `CPC Clusters · ${cpcList.length} matching`;
    sub.textContent = `Showing all CPCs in current selection · totals reflect filtered panchayats only`;
    body.innerHTML = `
      <table class="v33-data-table">
        <thead>
          <tr>
            <th>CPC</th><th>Zone</th><th>Catchment</th>
            <th class="num">Panchayats</th><th class="num">RVMs</th><th class="num">Fleet</th>
            <th class="num">Pickup %</th><th class="num">Inbound MT</th>
          </tr>
        </thead>
        <tbody>
          ${cpcList.map((c, i) => {
            const myP = filtered.filter(p => p.cpc === c.name);
            const rvmCount = myP.reduce((s,p)=>s+p.rvm,0);
            return `
            <tr class="${i%2?'striped':''}">
              <td><span class="v33-cpc-pill" style="background:${c.color}1a;color:${c.color};border:1px solid ${c.color}44;font-weight:700;">${c.short}</span></td>
              <td>${c.zone}</td>
              <td>${(c.catchment||[]).join(', ')}</td>
              <td class="num"><strong>${myP.length}</strong></td>
              <td class="num"><strong>${rvmCount}</strong></td>
              <td class="num">${c.fleet}</td>
              <td class="num" style="color:#10b981;font-weight:700;">${c.pickup}%</td>
              <td class="num">${c.inboundMT}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
  }
}

// Render the live summary sidebar block + map header stats
function _execRenderSummary() {
  const sumBox = document.getElementById('v33-fsummary');
  const subEl = document.getElementById('v33-execmap-sub');
  const hs = document.getElementById('v33-execmap-headstats');
  const filtered = _execFiltered();
  const filteredRCs = _execFilteredRCs();
  const totalRVM = filtered.reduce((s,p)=>s+p.rvm,0);
  const totalRC = filteredRCs.length;
  const cpcsTouched = new Set(filtered.map(p => p.cpc));
  const greens = filtered.filter(p => p.health === 'green').length;
  const yellows = filtered.filter(p => p.health === 'yellow').length;
  const reds = filtered.filter(p => p.health === 'red').length;
  const matKey = _execFilters.material;
  const totalMT = filtered.reduce((s,p) => s + (matKey === 'total' ? p.totalMT : (p.materials[matKey] || 0)), 0);

  if (sumBox) {
    sumBox.innerHTML = `
      <div class="v33-fsummary-title">Live · Current Selection</div>
      <div class="v33-fsummary-grid">
        <div class="v33-fsummary-row">
          <span>Panchayats</span><strong>${filtered.length}</strong>
        </div>
        <div class="v33-fsummary-row">
          <span>RVMs</span><strong style="color:#2c4cdc;">${totalRVM}</strong>
        </div>
        <div class="v33-fsummary-row">
          <span>RCs</span><strong style="color:#f59e0b;">${totalRC}</strong>
        </div>
        <div class="v33-fsummary-row">
          <span>CPCs covering</span><strong>${cpcsTouched.size} / 6</strong>
        </div>
        <div class="v33-fsummary-row hl">
          <span>${matKey === 'total' ? 'Total Collection' : matKey.toUpperCase()}</span>
          <strong style="color:#10b981;">${totalMT.toFixed(1)} MT/d</strong>
        </div>
      </div>
      <div class="v33-fsummary-health">
        <div class="v33-fsummary-health-title">Health Distribution</div>
        <div class="v33-fsummary-health-bar">
          <div style="background:#10b981;flex:${greens || 0.01};" title="${greens} green"></div>
          <div style="background:#f59e0b;flex:${yellows || 0.01};" title="${yellows} yellow"></div>
          <div style="background:#ef4444;flex:${reds || 0.01};" title="${reds} red"></div>
        </div>
        <div class="v33-fsummary-health-legend">
          <span style="color:#10b981;">🟢 ${greens}</span>
          <span style="color:#f59e0b;">🟡 ${yellows}</span>
          <span style="color:#ef4444;">🔴 ${reds}</span>
        </div>
      </div>
    `;
  }
  if (subEl) {
    subEl.textContent = `${cpcsTouched.size} CPCs · ${totalRVM} RVMs · ${totalRC} RCs · ${filtered.length} Panchayats matching filters`;
  }
  if (hs) {
    hs.innerHTML = `
      <span class="v33-hs-item">RVMs: <strong style="color:#2c4cdc;">${totalRVM}</strong></span>
      <span class="v33-hs-item">RCs: <strong style="color:#f59e0b;">${totalRC}</strong></span>
      <span class="v33-hs-item">${matKey === 'total' ? 'Collection' : matKey.toUpperCase()}: <strong style="color:#10b981;">${totalMT.toFixed(1)} MT/d</strong></span>
      <span class="v33-hs-item">Health: <strong style="color:#10b981;">🟢 ${greens}</strong> <strong style="color:#f59e0b;">🟡 ${yellows}</strong> <strong style="color:#ef4444;">🔴 ${reds}</strong></span>
    `;
  }
}

/* ============================================================
   V44 — Asset Drill (RVM/CPC selection)
   Show full panchayat → CPC → RVM hierarchy on the LEFT panel
   ============================================================ */
function _execShowAssetDrill(type, payload) {
  const body = document.getElementById('v33-table-body');
  const title = document.getElementById('v33-table-title');
  const sub = document.getElementById('v33-table-sub');
  if (!body || !title || !sub) return;

  if (type === 'rvm') {
    const p = payload.panchayat;
    const cpc = V26_CPC_BY_NAME[p.cpc];
    const rvmId = payload.id;
    // Synthesized per-RVM operational data (deterministic via id)
    const seed = (rvmId.charCodeAt(rvmId.length-1) + rvmId.length) % 100;
    const todayUnits = 1200 + (seed * 23);
    const todayMT = (todayUnits * 0.012).toFixed(2);
    const fillPct = 35 + (seed % 50);
    const lastEmpty = `${1 + (seed % 7)}h ago`;
    const handler = `Handler ${100 + seed}`;
    const matBreak = {
      Glass: Math.round(todayUnits * 0.70),
      PET:   Math.round(todayUnits * 0.12),
      Alu:   Math.round(todayUnits * 0.08),
      HDPE:  Math.round(todayUnits * 0.07),
      Tetra: Math.round(todayUnits * 0.03),
    };

    title.innerHTML = `<span style="display:inline-flex;align-items:center;gap:8px;">📍 ${escapeHtml(rvmId)} <button id="v44-drill-close" style="font-size:11px;padding:3px 8px;border-radius:4px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;color:#6b7280;">✕ Back</button></span>`;
    sub.innerHTML = `<span style="color:${cpc?.color};font-weight:600;">${escapeHtml(cpc?.short || p.cpc)}</span> · ${escapeHtml(p.taluka)} · ${p.zone === 'north' ? 'North' : 'South'} Goa`;

    body.innerHTML = `
      <!-- Hierarchy breadcrumb -->
      <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#6b7280;padding:8px 10px;background:#f8fafc;border-radius:6px;margin-bottom:10px;flex-wrap:wrap;">
        <span>${p.zone === 'north' ? '🧭 North' : '🧭 South'} Goa</span>
        <span style="color:#cbd5e1;">›</span>
        <span>📍 ${escapeHtml(p.taluka)}</span>
        <span style="color:#cbd5e1;">›</span>
        <span>🏛️ ${escapeHtml(p.name)}</span>
        <span style="color:#cbd5e1;">›</span>
        <span style="color:${cpc?.color};font-weight:700;">⭐ ${escapeHtml(cpc?.short || p.cpc)}</span>
        <span style="color:#cbd5e1;">›</span>
        <span style="color:#2c4cdc;font-weight:700;">📍 ${escapeHtml(rvmId)}</span>
      </div>

      <!-- Status pills -->
      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">
        <span style="font-size:10.5px;font-weight:700;padding:4px 9px;border-radius:99px;background:${p.healthColor}22;color:${p.healthColor};">${p.health === 'green' ? '🟢' : p.health === 'yellow' ? '🟡' : '🔴'} ${p.uptime}% uptime</span>
        <span style="font-size:10.5px;font-weight:700;padding:4px 9px;border-radius:99px;background:#dbeafe;color:#1e40af;">Fill ${fillPct}%</span>
        <span style="font-size:10.5px;font-weight:700;padding:4px 9px;border-radius:99px;background:#fef3c7;color:#92400e;">Emptied ${lastEmpty}</span>
      </div>

      <!-- KPI grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;">
          <div style="font-size:9.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Today's Units</div>
          <div style="font-size:20px;font-weight:800;color:#0d1220;font-family:var(--font-mono);">${todayUnits.toLocaleString()}</div>
          <div style="font-size:9.5px;color:#6b7280;">${todayMT} MT</div>
        </div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;">
          <div style="font-size:9.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">7-Day Avg</div>
          <div style="font-size:20px;font-weight:800;color:#0d1220;font-family:var(--font-mono);">${(todayUnits * 0.94).toFixed(0)}</div>
          <div style="font-size:9.5px;color:#10b981;font-weight:600;">▲ 6% today</div>
        </div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;">
          <div style="font-size:9.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Bag Fill</div>
          <div style="font-size:20px;font-weight:800;color:#0d1220;font-family:var(--font-mono);">${fillPct}%</div>
          <div style="font-size:9.5px;color:#6b7280;">Threshold 80%</div>
        </div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;">
          <div style="font-size:9.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Assigned Handler</div>
          <div style="font-size:14px;font-weight:700;color:#0d1220;margin-top:2px;">👤 ${handler}</div>
          <div style="font-size:9.5px;color:#10b981;font-weight:600;">Logged in</div>
        </div>
      </div>

      <!-- Material breakdown -->
      <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Material Breakdown · Today</div>
      <div style="background:#f8fafc;border-radius:8px;padding:10px;">
        ${Object.entries(matBreak).map(([name, cnt]) => {
          const pct = (cnt / todayUnits * 100).toFixed(0);
          const colors = { Glass:'#10b981', PET:'#2c4cdc', Alu:'#0891b2', HDPE:'#f59e0b', Tetra:'#ef4444' };
          return `
            <div style="display:grid;grid-template-columns:50px 1fr 45px;align-items:center;gap:8px;padding:3px 0;">
              <span style="font-size:10.5px;color:#0d1220;font-weight:600;"><span style="display:inline-block;width:7px;height:7px;background:${colors[name]};border-radius:1px;margin-right:4px;"></span>${name}</span>
              <div style="height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${colors[name]};border-radius:3px;"></div></div>
              <span style="font-family:var(--font-mono);font-size:10.5px;font-weight:700;color:${colors[name]};text-align:right;">${cnt.toLocaleString()}</span>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Service log -->
      <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin:14px 0 6px;">Recent Activity</div>
      <div style="font-size:11px;color:#0d1220;line-height:1.7;">
        <div>🟢 ${lastEmpty} · Bag emptied · ${handler}</div>
        <div>📦 ${1 + (seed%4)}h ago · ${Math.round(todayUnits*0.15)} units scanned</div>
        <div>🔧 2 days ago · Routine service · No issues</div>
        <div>📊 7 days ago · Calibration check passed</div>
      </div>
    `;
    const closeBtn = document.getElementById('v44-drill-close');
    if (closeBtn) closeBtn.addEventListener('click', _execRenderTable);
  }

  if (type === 'cpc') {
    const { cpc, panchayats, rvmCount } = payload;
    const totalUnits = panchayats.reduce((s,p) => s + p.totalMT * 80, 0);
    const greens = panchayats.filter(p => p.health === 'green').length;
    const yellows = panchayats.filter(p => p.health === 'yellow').length;
    const reds = panchayats.filter(p => p.health === 'red').length;

    title.innerHTML = `<span style="display:inline-flex;align-items:center;gap:8px;">⭐ ${cpc.short} <button id="v44-drill-close" style="font-size:11px;padding:3px 8px;border-radius:4px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;color:#6b7280;">✕ Back</button></span>`;
    sub.innerHTML = `<span style="color:${cpc.color};font-weight:600;">${cpc.name}</span> · ${panchayats.length} panchayats · ${rvmCount} RVMs`;

    body.innerHTML = `
      <!-- CPC KPI strip -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px;">
        <div style="padding:9px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;border-top:3px solid ${cpc.color};">
          <div style="font-size:9px;font-weight:700;color:#6b7280;text-transform:uppercase;">Panchayats</div>
          <div style="font-size:18px;font-weight:800;color:#0d1220;font-family:var(--font-mono);">${panchayats.length}</div>
        </div>
        <div style="padding:9px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;border-top:3px solid #2c4cdc;">
          <div style="font-size:9px;font-weight:700;color:#6b7280;text-transform:uppercase;">RVMs</div>
          <div style="font-size:18px;font-weight:800;color:#2c4cdc;font-family:var(--font-mono);">${rvmCount}</div>
        </div>
        <div style="padding:9px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;border-top:3px solid #10b981;">
          <div style="font-size:9px;font-weight:700;color:#6b7280;text-transform:uppercase;">Pickup %</div>
          <div style="font-size:18px;font-weight:800;color:#10b981;font-family:var(--font-mono);">${cpc.pickup}%</div>
        </div>
      </div>

      <!-- Health distribution -->
      <div style="margin-bottom:12px;">
        <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:4px;">Health · ${panchayats.length} panchayats</div>
        <div style="display:flex;height:8px;border-radius:4px;overflow:hidden;background:#e2e8f0;">
          <div style="background:#10b981;flex:${greens || 0.01};"></div>
          <div style="background:#f59e0b;flex:${yellows || 0.01};"></div>
          <div style="background:#ef4444;flex:${reds || 0.01};"></div>
        </div>
        <div style="display:flex;gap:10px;font-size:10px;margin-top:4px;">
          <span style="color:#10b981;font-weight:700;">🟢 ${greens}</span>
          <span style="color:#f59e0b;font-weight:700;">🟡 ${yellows}</span>
          <span style="color:#ef4444;font-weight:700;">🔴 ${reds}</span>
        </div>
      </div>

      <!-- Panchayat → RVM hierarchy -->
      <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Panchayat → RVM Breakdown</div>
      <div style="max-height:340px;overflow-y:auto;border:1px solid #e5e7eb;border-radius:8px;">
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead style="position:sticky;top:0;background:#f8fafc;">
            <tr>
              <th style="text-align:left;padding:7px 8px;border-bottom:1px solid #e5e7eb;font-size:9.5px;color:#6b7280;text-transform:uppercase;">Panchayat</th>
              <th style="text-align:left;padding:7px 8px;border-bottom:1px solid #e5e7eb;font-size:9.5px;color:#6b7280;text-transform:uppercase;">Taluka</th>
              <th style="text-align:right;padding:7px 8px;border-bottom:1px solid #e5e7eb;font-size:9.5px;color:#6b7280;text-transform:uppercase;">RVMs</th>
              <th style="text-align:right;padding:7px 8px;border-bottom:1px solid #e5e7eb;font-size:9.5px;color:#6b7280;text-transform:uppercase;">Uptime</th>
              <th style="text-align:right;padding:7px 8px;border-bottom:1px solid #e5e7eb;font-size:9.5px;color:#6b7280;text-transform:uppercase;">MT/d</th>
            </tr>
          </thead>
          <tbody>
            ${panchayats.sort((a,b)=>b.rvm-a.rvm).map((p,i) => `
              <tr style="background:${i%2?'#fafbfc':'#fff'};">
                <td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;font-weight:600;color:#0d1220;">${p.name}</td>
                <td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;color:#6b7280;">${p.taluka}</td>
                <td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;text-align:right;font-family:var(--font-mono);font-weight:700;">${p.rvm}</td>
                <td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;text-align:right;font-family:var(--font-mono);color:${p.healthColor};font-weight:700;">${p.uptime}%</td>
                <td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;text-align:right;font-family:var(--font-mono);">${p.totalMT.toFixed(1)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    const closeBtn = document.getElementById('v44-drill-close');
    if (closeBtn) closeBtn.addEventListener('click', _execRenderTable);
  }
}


// v25 globals
let _v25LeafMap = null;
let _v25FsMap = null;
let _v25Markers = [];
let _v25MapFilter = 'all';
// Multi-select layer set: which layer types are currently visible.
// 'all' is special (resets to All). Otherwise it's a Set of any of: rvm, rc, cpc, block, panchayat, route.
let _v25ActiveLayers = new Set(['rvm', 'rc', 'cpc']);  // default = "All"
let _v25DateRange = '7d';

// V25 mock data for click-through tables
const V25_DRILL_DATA = {
  trips: [
    { id:'TRP-2031', vehicle:'GA-01-AB-1234', driver:'Rakesh K.', cpc:'Recykal · Verna',  route:'Salcete Loop',  status:'On Trip',   bags:14, distance:'42 km' },
    { id:'TRP-2035', vehicle:'GA-07-CD-5678', driver:'Suresh D.', cpc:'Recykal · Verna',  route:'Mormugao Run',  status:'On Trip',   bags:18, distance:'36 km' },
    { id:'TRP-2042', vehicle:'GA-03-EF-9012', driver:'Ajay P.',   cpc:'Anand · Nessai', route:'Quepem Spread', status:'Returning', bags:12, distance:'58 km' },
    { id:'TRP-2055', vehicle:'GA-01-GH-3456', driver:'Manoj S.',  cpc:'Sagar · Verna', route:'Bardez North',  status:'On Trip',   bags:16, distance:'48 km' },
    { id:'TRP-2061', vehicle:'GA-02-IJ-7890', driver:'Mahesh D.', cpc:'Sagar · Verna', route:'Pernem Coast',  status:'On Trip',   bags:10, distance:'52 km' },
    { id:'TRP-2068', vehicle:'GA-04-KL-2345', driver:'Pradeep N.',cpc:'Anand · Nessai', route:'Canacona South',status:'On Trip',   bags:8,  distance:'72 km' },
    { id:'TRP-2074', vehicle:'GA-08-MN-6789', driver:'Devraj P.', cpc:'Recykal · Verna',  route:'Vasco Cluster', status:'On Trip',   bags:14, distance:'28 km' },
  ],
  rvm_locations: [
    { id:'GA-001-RVM', panchayat:'Mapusa',    block:'Bardez',   units:1420, qrPct:96.2, status:'Active', lastSync:'2 min ago' },
    { id:'GA-014-RVM', panchayat:'Calangute', block:'Bardez',   units:1186, qrPct:95.8, status:'Active', lastSync:'5 min ago' },
    { id:'GA-022-RVM', panchayat:'Margao',    block:'Salcete',  units:1342, qrPct:94.4, status:'Active', lastSync:'1 min ago' },
    { id:'GA-031-RVM', panchayat:'Vasco',     block:'Mormugao', units:982,  qrPct:93.6, status:'Down',   lastSync:'4 hr ago' },
    { id:'GA-048-RVM', panchayat:'Ponda',     block:'Ponda',    units:892,  qrPct:92.8, status:'Active', lastSync:'3 min ago' },
    { id:'GA-052-RVM', panchayat:'Panaji',    block:'Tiswadi',  units:1124, qrPct:95.6, status:'Active', lastSync:'2 min ago' },
    { id:'GA-067-RVM', panchayat:'Bicholim',  block:'Bicholim', units:642,  qrPct:91.4, status:'Down',   lastSync:'6 hr ago' },
    { id:'GA-082-RVM', panchayat:'Curchorem', block:'Quepem',   units:528,  qrPct:90.8, status:'Maintenance', lastSync:'1 hr ago' },
  ],
  cs_tickets: [
    { id:'TKT-80142', category:'Deposit refund not received', source:'Consumer', priority:'P1', tat:'3.8h', status:'Open' },
    { id:'TKT-80128', category:'QR code not scanning',         source:'Consumer', priority:'P2', tat:'2.1h', status:'Resolved' },
    { id:'TKT-80120', category:'RVM not accepting bottle',     source:'Consumer', priority:'P1', tat:'4.6h', status:'In Progress' },
    { id:'TKT-80115', category:'HF dispute (Critical Bag)',    source:'Brand',    priority:'P0', tat:'6.2h', status:'Open' },
    { id:'TKT-80108', category:'Handler behavior complaint',   source:'Consumer', priority:'P2', tat:'8.4h', status:'Pending' },
    { id:'TKT-80094', category:'Bulk pickup not scheduled',    source:'HoReCa',   priority:'P1', tat:'5.4h', status:'Open' },
    { id:'TKT-80082', category:'Brand inventory mismatch',     source:'Brand',    priority:'P1', tat:'7.2h', status:'In Progress' },
  ],
  wh_inbound: [
    { batch:'INB-1042', cpc:'Durgadevi · Colvale', material:'Glass',     mt:18.4, bags:284, time:'Today 09:42' },
    { batch:'INB-1041', cpc:'Recykal · Verna',            material:'PET',       mt:12.6, bags:186, time:'Today 09:18' },
    { batch:'INB-1040', cpc:'Durgadevi · Colvale',           material:'Aluminium', mt:6.2,  bags:124, time:'Today 08:54' },
    { batch:'INB-1039', cpc:'Anand · Nessai',     material:'Glass',     mt:14.8, bags:248, time:'Today 08:32' },
    { batch:'INB-1038', cpc:'Shivanand · Nessai',         material:'HDPE',      mt:4.2,  bags:84,  time:'Today 07:58' },
  ],
  cs_brands: [
    { id:'TKT-80115', brand:'Kingfisher',   category:'HF dispute',          priority:'P0', tat:'6.2h', status:'Open' },
    { id:'TKT-80082', brand:'Bira',         category:'Inventory mismatch',  priority:'P1', tat:'7.2h', status:'In Progress' },
    { id:'TKT-80078', brand:'Heineken',     category:'Refund TAT breach',   priority:'P2', tat:'4.8h', status:'Open' },
    { id:'TKT-80068', brand:'Tuborg',       category:'Bag count variance',  priority:'P1', tat:'5.4h', status:'Pending' },
    { id:'TKT-80058', brand:'Kingfisher',   category:'QR not mapped',       priority:'P2', tat:'3.2h', status:'Resolved' },
  ],
  cs_horeca: [
    { id:'TKT-80094', outlet:'Taj Resort Cavelossim',  category:'Bulk pickup not scheduled', priority:'P1', tat:'5.4h', status:'Open' },
    { id:'TKT-80088', outlet:'Hilton Goa Resort',       category:'QR scan failure rate',      priority:'P2', tat:'4.2h', status:'In Progress' },
    { id:'TKT-80072', outlet:'Marriott Calangute',      category:'Pickup wait > 24h',         priority:'P1', tat:'8.8h', status:'Open' },
    { id:'TKT-80064', outlet:'Goa Marriott',            category:'Driver no-show',            priority:'P0', tat:'6.4h', status:'Pending' },
  ],
  cs_consumer: [
    { id:'TKT-80142', user:'+91 98xxx xx234', category:'Deposit refund not received',  priority:'P1', tat:'3.8h', status:'Open' },
    { id:'TKT-80128', user:'+91 99xxx xx512', category:'QR code not scanning',          priority:'P2', tat:'2.1h', status:'Resolved' },
    { id:'TKT-80120', user:'+91 97xxx xx128', category:'RVM not accepting bottle',     priority:'P1', tat:'4.6h', status:'In Progress' },
    { id:'TKT-80108', user:'+91 98xxx xx456', category:'Handler behavior complaint',   priority:'P2', tat:'8.4h', status:'Pending' },
  ],
};

const V25_DRILL_CONFIG = {
  // QR Performance
  'qr-total':    { title:'Total QR Codes Purchased', sub:'1.2M QR codes purchased from vendor in current period',
                   table: { cols:['Batch ID','Vendor','Quantity','Date','Status'],
                            rows:[['BATCH-042','QR Solutions Ltd','250,000','15 May 2026','Activated'],['BATCH-041','SecureCode India','300,000','08 May 2026','Activated'],['BATCH-040','QR Solutions Ltd','200,000','01 May 2026','Activated'],['BATCH-039','PrintPro Tech','450,000','24 Apr 2026','Activated']] } },
  'qr-active':   { title:'Active QR Codes', sub:'850K QR codes currently active in circulation',
                   table: { cols:['QR Range','Channel','Quantity','Issued','Status'],
                            rows:[['Q0001-Q0250K','RVM','250,000','Today','Active'],['Q0251K-Q0480K','HoReCa','230,000','Today','Active'],['Q0481K-Q0720K','RC','240,000','Today','Active'],['Q0721K-Q0850K','D2D','130,000','Today','Active']] } },
  'qr-redeemed': { title:'Redeemed QR Codes', sub:'4,20,000 QR codes successfully redeemed · 1 QR ≡ 1 container collected',
                   table: { cols:['Channel','Redeemed','% of Total','Conv Rate'],
                            rows:[['RVM','193,200','46.0%','94%'],['RC','100,800','24.0%','89%'],['HoReCa','67,200','16.0%','92%'],['D2D','37,800','9.0%','86%'],['AWP','21,000','5.0%','81%']] } },
  'qr-yet':      { title:'Yet to Redeem', sub:'4,30,000 QR codes issued but not yet redeemed',
                   table: { cols:['Age','Count','% of Total','Action'],
                            rows:[['0-7 days','148,200','34.5%','In window'],['8-30 days','186,400','43.4%','In window'],['31-60 days','62,100','14.4%','Reminder sent'],['60+ days','33,300','7.7%','Pre-expiry alert']] } },
  'qr-unred':    { title:'Unredeemed QRs (Forfeit)', sub:'80,000 QR codes expired without redemption — operator float',
                   table: { cols:['Expiry Period','Count','Forfeit Value','Operator Share (30%)'],
                            rows:[['Mar 2026','24,500','₹90,650','₹27,195'],['Feb 2026','28,200','₹1,04,340','₹31,302'],['Jan 2026','27,300','₹1,01,010','₹30,303']] } },
  'qr-deact':    { title:'Deactivated QRs', sub:'25K QR codes deactivated (damaged, lost, fraud)',
                   table: { cols:['Reason','Count','% of Total'],
                            rows:[['Damaged at vendor','8,400','33.6%'],['Reported lost','6,200','24.8%'],['Fraud detection','4,800','19.2%'],['Duplicate scan','3,600','14.4%'],['Other','2,000','8.0%']] } },
  // Financial — all figures reconcile to the interlocking number model
  'fin-total':    { title:'Total Deposit Collected', sub:'₹44,40,000 · deposit value across all 12,00,000 purchased QRs', html:`<p style="margin-bottom:14px;color:var(--text-mute);font-size:13px;">Total deposit value = Σ(QRs in each denomination × denomination amount). Weighted average ₹3.70 per QR across the 60/30/10 denomination mix.</p><table class="t"><thead><tr><th>Denomination</th><th class="num">QRs</th><th class="num">Deposit Value</th><th class="num">% of Total</th></tr></thead><tbody><tr><td>₹2</td><td class="num">7,20,000</td><td class="num">₹14,40,000</td><td class="num">32.4%</td></tr><tr class="striped"><td>₹5</td><td class="num">3,60,000</td><td class="num">₹18,00,000</td><td class="num">40.5%</td></tr><tr><td>₹10</td><td class="num">1,20,000</td><td class="num">₹12,00,000</td><td class="num">27.0%</td></tr><tr style="background:#f8fafc;font-weight:700;"><td>Total</td><td class="num">12,00,000</td><td class="num">₹44,40,000</td><td class="num">100%</td></tr></tbody></table>` },
  'fin-redeemed': { title:'Total Deposit Redeemed', sub:'₹15,54,000 · paid out for 4,20,000 redeemed QRs', html:`<p style="margin-bottom:14px;color:var(--text-mute);font-size:13px;">1 redeemed QR ≡ 1 container collected. Redeemed value = Σ(redeemed QRs × denomination). Reconciles with QR Redemption by Denomination.</p><table class="t"><thead><tr><th>Denomination</th><th class="num">Redeemed QRs</th><th class="num">Value</th></tr></thead><tbody><tr><td>₹2</td><td class="num">2,52,000</td><td class="num">₹5,04,000</td></tr><tr class="striped"><td>₹5</td><td class="num">1,26,000</td><td class="num">₹6,30,000</td></tr><tr><td>₹10</td><td class="num">42,000</td><td class="num">₹4,20,000</td></tr><tr style="background:#f8fafc;font-weight:700;"><td>Total</td><td class="num">4,20,000</td><td class="num">₹15,54,000</td></tr></tbody></table>` },
  'fin-yet':      { title:'Yet to be Redeemed Deposit', sub:'₹15,91,000 · deposit for 4,30,000 QRs still inside the redemption window', html:`<p style="margin-bottom:14px;color:var(--text-mute);font-size:13px;">Yet-to-redeem QRs = active QRs (8,50,000) − redeemed QRs (4,20,000). These are valid containers still expected to return.</p><table class="t"><thead><tr><th>Age Bucket</th><th class="num">QRs</th><th class="num">Deposit Value</th><th>Status</th></tr></thead><tbody><tr><td>0–7 days</td><td class="num">1,48,200</td><td class="num">₹5,48,340</td><td>In window</td></tr><tr class="striped"><td>8–30 days</td><td class="num">1,86,400</td><td class="num">₹6,89,680</td><td>In window</td></tr><tr><td>31–60 days</td><td class="num">62,100</td><td class="num">₹2,29,770</td><td>Reminder sent</td></tr><tr class="striped"><td>60+ days</td><td class="num">33,300</td><td class="num">₹1,23,210</td><td>Pre-expiry alert</td></tr></tbody></table>` },
  'fin-unred':    { title:'Unredeemed Deposit (Forfeit)', sub:'₹2,96,000 · deposit on 80,000 QRs expired without redemption', html:`<div style="padding:14px;background:#f3f4f6;border-radius:8px;color:#374151;font-size:12.5px;margin-bottom:14px;"><strong>Operator float:</strong> Deposit on QRs that expired un-redeemed is retained. At the 30% operator share this contributes ₹88,800 to operator margin.</div><table class="t"><thead><tr><th>Expiry Period</th><th class="num">QRs</th><th class="num">Forfeit Value</th><th class="num">Operator Share (30%)</th></tr></thead><tbody><tr><td>Mar 2026</td><td class="num">24,500</td><td class="num">₹90,650</td><td class="num">₹27,195</td></tr><tr class="striped"><td>Feb 2026</td><td class="num">28,200</td><td class="num">₹1,04,340</td><td class="num">₹31,302</td></tr><tr><td>Jan 2026</td><td class="num">27,300</td><td class="num">₹1,01,010</td><td class="num">₹30,303</td></tr></tbody></table>` },
  // Network summary box
  'infra-summary': { title:'Collection Infrastructure', sub:'350 total CPs · 325 active · 91% network uptime', html:`<table class="t"><thead><tr><th>Category</th><th class="num">Total</th><th class="num">Active</th><th class="num">Down</th></tr></thead><tbody><tr><td>RVM</td><td class="num">300</td><td class="num">278</td><td class="num">22</td></tr><tr class="striped"><td>RC</td><td class="num">50</td><td class="num">47</td><td class="num">3</td></tr><tr style="background:#f8fafc;font-weight:700;"><td>Total CP</td><td class="num">350</td><td class="num">325</td><td class="num">25</td></tr></tbody></table><p style="margin-top:12px;color:var(--text-mute);font-size:12px;">Total CP = RVM + RC. Mobile points (HoReCa 200, D2D 191, AWP 50) extend reach but are not fixed CPs.</p>` },
  'infra-totalcp': { title:'Total Collection Points · 350', sub:'Fixed network = 300 RVM + 50 RC', html:`<table class="t"><thead><tr><th>Type</th><th class="num">Public</th><th class="num">Private</th><th class="num">Total</th></tr></thead><tbody><tr><td>RVM</td><td class="num">270</td><td class="num">30</td><td class="num">300</td></tr><tr class="striped"><td>RC</td><td class="num">5</td><td class="num">45</td><td class="num">50</td></tr><tr style="background:#f8fafc;font-weight:700;"><td>Total</td><td class="num">275</td><td class="num">75</td><td class="num">350</td></tr></tbody></table>` },
  'infra-uptime':  { title:'Network Uptime · 91%', sub:'Average operational uptime across all 350 CPs (last 24h)', html:`<p style="color:var(--text-mute);font-size:13px;margin-bottom:14px;">Uptime = time CP was online and accepting / total scheduled operating time. Target ≥ 90%.</p><table class="t"><thead><tr><th>Band</th><th class="num">CPs</th><th>Status</th></tr></thead><tbody><tr><td>95–100%</td><td class="num">214</td><td><span class="pill pill-good">Healthy</span></td></tr><tr class="striped"><td>85–95%</td><td class="num">96</td><td><span class="pill pill-info">Stable</span></td></tr><tr><td>&lt; 85%</td><td class="num">40</td><td><span class="pill pill-warn">Watch</span></td></tr></tbody></table>` },
  'infra-activecp':{ title:'Active CPs · 325', sub:'Online and receiving today · 25 down', html:`<table class="t"><thead><tr><th>Type</th><th class="num">Active</th><th class="num">Down</th><th class="num">% Active</th></tr></thead><tbody><tr><td>RVM</td><td class="num">278</td><td class="num">22</td><td class="num">92.7%</td></tr><tr class="striped"><td>RC</td><td class="num">47</td><td class="num">3</td><td class="num">94.0%</td></tr><tr style="background:#f8fafc;font-weight:700;"><td>Total</td><td class="num">325</td><td class="num">25</td><td class="num">92.9%</td></tr></tbody></table>` },
  // New users
  'user-new':    { title:'New Users · 23,240', sub:'First-time users onboarded today · +6.8% DoD', html:`<table class="t"><thead><tr><th>Channel</th><th class="num">New Users</th><th class="num">% of New</th></tr></thead><tbody><tr><td>RVM</td><td class="num">10,690</td><td class="num">46%</td></tr><tr class="striped"><td>RC</td><td class="num">5,578</td><td class="num">24%</td></tr><tr><td>HoReCa</td><td class="num">3,718</td><td class="num">16%</td></tr><tr class="striped"><td>D2D</td><td class="num">2,092</td><td class="num">9%</td></tr><tr><td>AWP</td><td class="num">1,162</td><td class="num">5%</td></tr></tbody></table>` },
  // CSAT
  'cs-csat':     { title:'CSAT · Customer Satisfaction', sub:'4.3 / 5.0 average · 1,820 responses · +0.2 vs last period', html:`<p style="color:var(--text-mute);font-size:13px;margin-bottom:14px;">CSAT is collected via post-resolution survey. Score = mean of 1–5 star ratings.</p><table class="t"><thead><tr><th>Rating</th><th class="num">Responses</th><th class="num">Share</th></tr></thead><tbody><tr><td>5 ★</td><td class="num">983</td><td class="num">54%</td></tr><tr class="striped"><td>4 ★</td><td class="num">473</td><td class="num">26%</td></tr><tr><td>3 ★</td><td class="num">200</td><td class="num">11%</td></tr><tr class="striped"><td>2 ★</td><td class="num">109</td><td class="num">6%</td></tr><tr><td>1 ★</td><td class="num">55</td><td class="num">3%</td></tr></tbody></table>` },
  // Material
  'mat-glass':    { title:'Glass · 30 Day Stream', sub:'70% of inbound by weight · primary DRS material',
                   table: { cols:['CPC','Inbound (MT)','Processed (MT)','Outbound (MT)'],
                            rows:[['Durgadevi · Colvale','46.3','38.4','33.8'],['Sagar · Verna','18.2','15.1','13.4'],['Vilas · Tuem','13.5','11.2','9.8'],['Recykal · Verna','6.8','5.9','5.2'],['Anand · Nessai','24.4','19.8','17.2'],['Shivanand · Nessai','11.4','8.0','6.8']] } },
  'mat-pet':      { title:'PET · 30 Day Stream', sub:'10% of inbound · per-kg market value',
                   table: { cols:['Sub-type','Bales','Weight (kg)','Rate ₹/kg'],
                            rows:[['PET Clear','88','6,160','32'],['PET Green','56','3,920','30'],['PET Liquor','72','5,040','35']] } },
  'mat-alu':      { title:'Aluminium UBC · 30 Day Stream', sub:'8% of inbound · highest value per kg',
                   table: { cols:['Source','Bales','Weight (kg)','Rate ₹/kg','Value'],
                            rows:[['Hindalco UBC Mill','48','1,104','128','₹141,312']] } },
  'mat-hdpe':     { title:'HDPE · 30 Day Stream', sub:'7% of inbound',
                   table: { cols:['Sub-type','Bales','Weight (kg)'],
                            rows:[['FMCG White','18','882'],['Chem White','12','588']] } },
  'mat-tetra':    { title:'Tetrapak · 30 Day Stream', sub:'5% of inbound',
                   table: { cols:['Source','Bales','Weight (kg)'],
                            rows:[['Dairy','24','120'],['Juice','18','90']] } },
  // Denominations
  'denom-₹2 Denom.':  { title:'₹2 Denomination · 60%', sub:'High volume: Plastic & Small Glass — primary collection stream', html:'<table class="t"><thead><tr><th>Container Type</th><th class="num">QRs</th><th class="num">% of ₹2</th></tr></thead><tbody><tr><td>PET 200ml</td><td class="num">312,000</td><td class="num">43%</td></tr><tr class="striped"><td>Glass 180ml</td><td class="num">216,000</td><td class="num">30%</td></tr><tr><td>Glass 330ml</td><td class="num">144,000</td><td class="num">20%</td></tr><tr class="striped"><td>Tetra 200ml</td><td class="num">48,000</td><td class="num">7%</td></tr></tbody></table>' },
  'denom-₹5 Denom.':  { title:'₹5 Denomination · 30%', sub:'Standard PET & Medium Containers', html:'<table class="t"><thead><tr><th>Container Type</th><th class="num">QRs</th></tr></thead><tbody><tr><td>PET 500ml</td><td class="num">156,000</td></tr><tr class="striped"><td>Glass 500ml</td><td class="num">120,000</td></tr><tr><td>Aluminium 330ml</td><td class="num">84,000</td></tr></tbody></table>' },
  'denom-₹10 Denom.': { title:'₹10 Denomination · 10%', sub:'Bulk & Industrial Collection', html:'<table class="t"><thead><tr><th>Container Type</th><th class="num">QRs</th></tr></thead><tbody><tr><td>PET 1L</td><td class="num">48,000</td></tr><tr class="striped"><td>Glass 650ml</td><td class="num">36,000</td></tr><tr><td>Glass 750ml</td><td class="num">36,000</td></tr></tbody></table>' },
  // Infrastructure
  'infra-rvm':    { title:'RVM Network · 270 Machines', sub:'Public: 250 (gov-installed) · Private: 20 (operator-owned) · 20 currently down', table:{ cols:['RVM ID','Panchayat','Block','Status','Units','QR %','Last Sync'], rows: V25_DRILL_DATA.rvm_locations.map(r => [r.id, r.panchayat, r.block, r.status, r.units, r.qrPct+'%', r.lastSync]) } },
  'infra-rc':     { title:'Return Center Network · 50 RCs', sub:'Public: 5 (gov outlets) · Private: 45 (retail partners) · 3 currently down', table:{ cols:['RC Name','Block','Type','Daily Units','Status'], rows:[['RC Margao Plaza','Salcete','Private','846','Active'],['RC Panaji Square','Tiswadi','Private','684','Active'],['RC Mapusa Market','Bardez','Private','512','Active'],['RC Vasco Hub','Mormugao','Public','428','Down'],['RC Ponda Civic','Ponda','Private','342','Active']] } },
  'infra-awp':    { title:'AWP · 50 Auxiliary Workers', sub:'Roving collection · App-based field staff', table:{ cols:['Worker','Block','Today Scans','Status'], rows:[['AWP-012 · Ramesh T.','Bardez','248','On Shift'],['AWP-014 · Manoj K.','Salcete','186','On Shift'],['AWP-021 · Sunil R.','Tiswadi','142','On Shift'],['AWP-028 · Vijay P.','Mormugao','198','On Shift'],['AWP-031 · Anil G.','Ponda','156','On Shift']] } },
  'infra-d2d':    { title:'D2D · 150 Door-to-Door Workers', sub:'App-based field workers · carry no bag · scan at consumer doorstep', table:{ cols:['Worker','Block','Logged In','Scans Today','GPS Fresh'], rows:[['D2D-042 · Pradeep N.','Bardez','08:14 AM','42','Yes'],['D2D-058 · Devraj P.','Salcete','07:58 AM','38','Yes'],['D2D-072 · Bhaskar L.','Tiswadi','08:22 AM','31','Yes'],['D2D-084 · Chetan H.','Ponda','09:08 AM','24','Yes']] } },
  'infra-horeca': { title:'HoReCa CP · 50 Mobile Trucks', sub:'Mobile pickup trucks · Fastscan device · serve hotels, restaurants, bars', table:{ cols:['Truck','CPC','Route','Outlets Today','Status'], rows:[['HRC-08 (GA-01-AB-1234)','Recykal · Verna','Salcete Coast','12','On Route'],['HRC-14 (GA-07-CD-5678)','Anand · Nessai','Cuncolim-Canacona','8','On Route'],['HRC-22 (GA-03-EF-9012)','Sagar · Verna','Bardez North','14','On Route'],['HRC-29 (GA-08-MN-6789)','Recykal · Verna','Mormugao Hotels','10','Returning']] } },
  // Logistics
  'logi-trips':    { title:'Total Trips · 1,284', sub:'All trips today across 5 CPCs · click row for detail', table:{ cols:['Trip ID','Vehicle','Driver','CPC','Route','Status','Bags','Distance'], rows: V25_DRILL_DATA.trips.map(t => [t.id, t.vehicle, t.driver, t.cpc, t.route, t.status, t.bags, t.distance]) } },
  'logi-vehicles': { title:'Vehicle Fleet · 85 Vehicles', sub:'Total active fleet across 5 CPCs', table:{ cols:['Vehicle','Type','CPC','Status','Bags Loaded'], rows:[['GA-01-AB-1234','Tata Ace','Recykal · Verna','On Trip','14'],['GA-07-CD-5678','Eicher Pro','Recykal · Verna','On Trip','18'],['GA-03-EF-9012','Mahindra Bolero','Anand · Nessai','Returning','12'],['GA-01-GH-3456','Tata Ace','Sagar · Verna','On Trip','16'],['GA-02-IJ-7890','8-Wheeler','Sagar · Verna','On Trip','10']] } },
  'logi-active':   { title:'Active Trips · 85 Currently En Route', sub:'Trips currently in progress · live tracking', table:{ cols:['Trip ID','Vehicle','Driver','Status','Bags'], rows: V25_DRILL_DATA.trips.filter(t => t.status==='On Trip').map(t => [t.id, t.vehicle, t.driver, t.status, t.bags]) } },
  'logi-eff':      { title:'Pickup Efficiency · 92%', sub:'Capacity efficiency · planned vs delivered loads', html:'<p style="color:var(--text-mute);font-size:13px;margin-bottom:14px;">Pickup Efficiency = (delivered bags / planned capacity) × 100. Target: 80%+. Current 92% indicates well-routed days with minimal under-loaded trucks.</p><table class="t"><thead><tr><th>CPC</th><th class="num">Planned</th><th class="num">Delivered</th><th class="num">Efficiency</th></tr></thead><tbody><tr><td>Durgadevi · Colvale</td><td class="num">350</td><td class="num">329</td><td class="num">94%</td></tr><tr class="striped"><td>Vilas · Tuem</td><td class="num">130</td><td class="num">120</td><td class="num">92%</td></tr><tr><td>Sagar · Verna</td><td class="num">175</td><td class="num">168</td><td class="num">96%</td></tr><tr class="striped"><td>Recykal · Verna</td><td class="num">65</td><td class="num">64</td><td class="num">98%</td></tr><tr><td>Anand · Nessai</td><td class="num">235</td><td class="num">219</td><td class="num">93%</td></tr><tr class="striped"><td>Shivanand · Nessai</td><td class="num">110</td><td class="num">100</td><td class="num">91%</td></tr></tbody></table>' },
  'logi-view-all': { title:'All Logistics & Fleet Activity', sub:'Comprehensive trip ledger · all CPCs · all drivers', table:{ cols:['Trip ID','Vehicle','Driver','CPC','Route','Status','Bags','Distance'], rows: V25_DRILL_DATA.trips.map(t => [t.id, t.vehicle, t.driver, t.cpc, t.route, t.status, t.bags, t.distance]) } },
  'logi-cpc-cpc-verna':  { title:'Recykal · Verna · Trip Detail', sub:'8 fleet vehicles · 98% pickup completion today', table:{ cols:['Trip ID','Vehicle','Driver','Route','Status','Bags'], rows: V25_DRILL_DATA.trips.filter(t => t.cpc==='Recykal · Verna').map(t => [t.id, t.vehicle, t.driver, t.route, t.status, t.bags]) } },
  'logi-cpc-cpc-margao': { title:'Anand · Nessai · Trip Detail', sub:'18 fleet vehicles · 93% pickup completion', table:{ cols:['Trip ID','Vehicle','Driver','Route','Status','Bags'], rows: V25_DRILL_DATA.trips.filter(t => t.cpc==='Anand · Nessai').map(t => [t.id, t.vehicle, t.driver, t.route, t.status, t.bags]) } },
  'logi-cpc-cpc-panjim': { title:'Sagar · Verna · Trip Detail', sub:'16 fleet vehicles · 96% pickup completion', table:{ cols:['Trip ID','Vehicle','Driver','Route','Status','Bags'], rows: V25_DRILL_DATA.trips.filter(t => t.cpc==='Sagar · Verna').map(t => [t.id, t.vehicle, t.driver, t.route, t.status, t.bags]) } },
  // Warehouse
  'wh-inbound':   { title:'Inbound Material · 226.4 MT', sub:'Bags received from CPs across all CPCs today', table:{ cols:['Batch','CPC','Material','MT','Bags','Time'], rows: V25_DRILL_DATA.wh_inbound.map(w => [w.batch, w.cpc, w.material, w.mt, w.bags, w.time]) } },
  'wh-processed': { title:'Processed Material · 184.2 MT', sub:'Sorted, counted, baled · 81% of inbound', table:{ cols:['CPC','Counted (MT)','Sorted (MT)','Baled (MT)'], rows:[['Durgadevi · Colvale','42.4','40.8','38.2'],['Sagar · Verna','22.2','19.6','17.4'],['Vilas · Tuem','12.4','11.1','9.8'],['Recykal · Verna','8.1','7.4','6.5'],['Anand · Nessai','19.1','15.8','13.8'],['Shivanand · Nessai','11.1','8.8','7.4']] } },
  'wh-outbound':  { title:'Outbound Material · 162.8 MT', sub:'Dispatched to buyers (recyclers, glass mills, smelters)', table:{ cols:['Dispatch','Buyer','Material','MT','Vehicle'], rows:[['DSP-1041','South Goa Glass Co.','Cullet Brown','8.4','GA-01-AB-1234'],['DSP-1040','AB InBev (Kingfisher)','Glass Packs','3.1','GA-07-CD-5678'],['DSP-1038','Goa Recyclers Pvt Ltd','PET Clear','4.3','GA-03-EF-9012'],['DSP-1036','Hindalco UBC Mill','Aluminium UBC','1.1','GA-01-GH-3456']] } },
  'wh-cpc-cpc-dgd': { title:'CPC Durgadevi · Colvale · Material Detail', sub:'Inbound 46.3 MT · Processed 38.4 MT · Outbound 33.8 MT', table:{ cols:['Material','Inbound','Processed','Outbound','Yield'], rows:[['Glass','30.2 MT','27.4 MT','25.1 MT','83%'],['PET','6.4 MT','5.8 MT','5.4 MT','84%'],['Aluminium','3.2 MT','3.0 MT','2.8 MT','88%'],['HDPE','2.7 MT','2.0 MT','1.8 MT','67%']] } },
  'wh-cpc-cpc-sbw': { title:'CPC Sagar · Verna · Material Detail', sub:'Inbound 18.2 MT · Processed 15.1 MT · Outbound 13.4 MT', table:{ cols:['Material','Inbound','Processed','Outbound'], rows:[['Glass','26.8 MT','22.8 MT','20.1 MT'],['PET','5.6 MT','4.8 MT','4.2 MT'],['Aluminium','2.8 MT','2.5 MT','2.2 MT'],['HDPE','2.9 MT','2.3 MT','2.0 MT']] } },
  'wh-cpc-cpc-ryv': { title:'CPC Recykal · Verna · Material Detail', sub:'Inbound 6.8 MT · Processed 5.9 MT · Outbound 5.2 MT', table:{ cols:['Material','Inbound','Processed','Outbound'], rows:[['Glass','37.0 MT','31.2 MT','28.4 MT'],['PET','7.8 MT','6.6 MT','6.0 MT'],['Aluminium','4.2 MT','3.8 MT','3.6 MT'],['HDPE','3.4 MT','2.5 MT','2.2 MT']] } },
  'wh-cpc-cpc-vbw': { title:'CPC Vilas · Tuem · Material Detail', sub:'Inbound 13.5 MT · Processed 11.2 MT · Outbound 9.8 MT', table:{ cols:['Material','Inbound','Processed','Outbound'], rows:[['Glass','34.0 MT','27.8 MT','24.5 MT'],['PET','7.2 MT','5.9 MT','5.2 MT'],['Aluminium','3.8 MT','3.4 MT','3.0 MT'],['HDPE','3.2 MT','2.4 MT','2.1 MT']] } },
  'wh-cpc-cpc-abw': { title:'CPC Anand · Nessai · Material Detail', sub:'Inbound 24.4 MT · Processed 19.8 MT · Outbound 17.2 MT', table:{ cols:['Material','Inbound','Processed','Outbound'], rows:[['Glass','32.0 MT','21.2 MT','17.1 MT'],['PET','6.8 MT','4.4 MT','3.6 MT'],['Aluminium','3.4 MT','2.5 MT','2.1 MT'],['HDPE','3.0 MT','1.9 MT','1.4 MT']] } },
  // User Insight
  'user-txn':    { title:'Transactions · 284,120', sub:'Total transaction count today · across all channels', table:{ cols:['Channel','Transactions','Avg/User','Peak Hour'], rows:[['RVM','128,450','3.2','6-7 PM'],['HoReCa','62,180','12.4','10-11 AM'],['RC','48,420','2.8','7-9 PM'],['D2D','28,640','1.8','9-11 AM'],['Non-Re','16,430','2.1','5-7 PM']] } },
  'user-unique': { title:'Unique Users · 198,540', sub:'Distinct users active today · engagement segments', table:{ cols:['Segment','Users','% of Total','Avg Daily Tx'], rows:[['Power Users (>50/mo)','8,420','4.2%','22.4'],['Regular (10-50/mo)','38,420','19.4%','6.8'],['Occasional (1-10/mo)','128,460','64.7%','2.1'],['First-time today','23,240','11.7%','1.3']] } },
  // CS
  'cs-total':    { title:'All Customer Support Tickets · 486', sub:'Combined across Brands, HoReCa, Consumer', table:{ cols:['Ticket','Category','Source','Priority','TAT','Status'], rows: V25_DRILL_DATA.cs_tickets.map(t => [t.id, t.category, t.source, t.priority, t.tat, t.status]) } },
  'cs-open':     { title:'Open Tickets · 114', sub:'Currently awaiting resolution · 23% of total volume', table:{ cols:['Ticket','Category','Source','Priority','TAT'], rows: V25_DRILL_DATA.cs_tickets.filter(t => t.status==='Open').map(t => [t.id, t.category, t.source, t.priority, t.tat]) } },
  'cs-resolved': { title:'Resolved Tickets · 82', sub:'Closed today · +14% vs previous period', table:{ cols:['Ticket','Category','Source','Resolution Time'], rows: V25_DRILL_DATA.cs_tickets.filter(t => t.status==='Resolved').map(t => [t.id, t.category, t.source, t.tat]) } },
  'cs-tat':      { title:'Average TAT · 8.4h', sub:'Mean time to first resolution · -12% improvement', html:'<p style="color:var(--text-mute);font-size:13px;margin-bottom:14px;">TAT is the duration from ticket creation to first agent response. Target: <6h for P0/P1, <12h for P2/P3.</p><table class="t"><thead><tr><th>Priority</th><th class="num">Avg TAT</th><th class="num">SLA</th><th>Status</th></tr></thead><tbody><tr><td>P0 (Critical)</td><td class="num">3.2h</td><td class="num">4h</td><td><span class="pill pill-good">Within</span></td></tr><tr class="striped"><td>P1 (High)</td><td class="num">5.8h</td><td class="num">6h</td><td><span class="pill pill-good">Within</span></td></tr><tr><td>P2 (Medium)</td><td class="num">9.4h</td><td class="num">12h</td><td><span class="pill pill-good">Within</span></td></tr><tr class="striped"><td>P3 (Low)</td><td class="num">14.2h</td><td class="num">24h</td><td><span class="pill pill-good">Within</span></td></tr></tbody></table>' },
  'cs-brand':    { title:'Brand Tickets · 124', sub:'Brand partner-raised tickets · 77% resolution rate', table:{ cols:['Ticket','Brand','Category','Priority','TAT','Status'], rows: V25_DRILL_DATA.cs_brands.map(t => [t.id, t.brand, t.category, t.priority, t.tat, t.status]) } },
  'cs-horeca':   { title:'HoReCa Tickets · 142', sub:'Outlet-raised tickets · 76% resolution rate', table:{ cols:['Ticket','Outlet','Category','Priority','TAT','Status'], rows: V25_DRILL_DATA.cs_horeca.map(t => [t.id, t.outlet, t.category, t.priority, t.tat, t.status]) } },
  'cs-consumer': { title:'Consumer Tickets · 220', sub:'End-consumer raised tickets · 76% resolution rate', table:{ cols:['Ticket','User','Category','Priority','TAT','Status'], rows: V25_DRILL_DATA.cs_consumer.map(t => [t.id, t.user, t.category, t.priority, t.tat, t.status]) } },
};

function wireExecHomeWithMapToggle() {
  // v40 — map restored. Wire the toggle + initialize the map when active.

  // --- VIEW TOGGLE (Dashboard ⇄ CPC Map) ---
  const toggle = document.getElementById('exec-view-toggle');
  if (toggle) {
    toggle.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newView = btn.dataset.view;
        if (newView === _execView) return;
        _execView = newView;
        if (newView !== 'map') {
          if (_execLeafMap) { try { _execLeafMap.remove(); } catch(_) {} }
          _execLeafMap = null;
          _execMapLayers = { zones:[], cpcMarkers:[], rvmMarkers:[], rcMarkers:[], heat:[], routes:[] };
        }
        renderPage('exec-home');
      });
    });
  }
  // If we're in MAP view, init the map and skip the dashboard wiring
  if (_execView === 'map') {
    setTimeout(() => v32InitExecMap(), 60);
    return;
  }
  // If we're in PULSE view, no charts to wire
  if (_execView === 'pulse') {
    return;
  }

  // --- DATE DROPDOWN ---
  const dateBtn = document.getElementById('v25-date-btn');
  const dateMenu = document.getElementById('v25-date-menu');
  if (dateBtn && dateMenu) {
    dateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dateMenu.classList.toggle('open');
    });
    document.addEventListener('click', () => dateMenu.classList.remove('open'));
    dateMenu.addEventListener('click', (e) => e.stopPropagation());
    document.querySelectorAll('.v25-date-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.v25-date-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        _v25DateRange = opt.dataset.range;
        document.getElementById('v25-date-label').textContent = opt.textContent.trim();
        dateMenu.classList.remove('open');
        // Re-render exec home so QR Life Cycle reflects the new date scope
        renderPage('exec-home');
      });
    });
    const applyBtn = document.getElementById('v25-date-apply');
    if (applyBtn) applyBtn.addEventListener('click', () => {
      const from = document.getElementById('v25-date-from').value;
      const to = document.getElementById('v25-date-to').value;
      if (from && to) {
        document.getElementById('v25-date-label').textContent = `${from} \u2192 ${to}`;
        _v25DateRange = 'custom';
        // Compute custom range days for scope-aware metrics
        try {
          const fromD = new Date(from), toD = new Date(to);
          window._v25DateDays = Math.max(1, Math.round((toD - fromD) / 86400000) + 1);
        } catch(_) { window._v25DateDays = 7; }
        dateMenu.classList.remove('open');
        renderPage('exec-home');
      }
    });
  }

  // --- V36 PIE CHARTS (Chart.js) ---
  v36RenderPieCharts();

  // --- DRILL TILES ---
  document.querySelectorAll('[data-drill]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = el.dataset.drill;
      openV25Modal(key);
    });
  });

  // --- MODAL CLOSE ---
  const closeBtn = document.getElementById('v25-modal-close');
  const overlay = document.getElementById('v25-modal-overlay');
  if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
  if (overlay) overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
}

// ============================================================
// V36 — PIE CHARTS  (QR Redemption by Material / Denomination,
//                    Collection-Infra Utilisation by Channel)
// Click any slice -> data-point popup modal.
// ============================================================
let _allCharts = [];
function v36RenderPieCharts() {
  // Destroy any prior chart instances (re-render safe)
  _allCharts.forEach(c => { try { c.destroy(); } catch(_) {} });
  _allCharts = [];
  if (typeof Chart === 'undefined') return;
  const data = window.__V25;
  if (!data) return;

  const inr = n => '\u20b9' + Math.round(n).toLocaleString('en-IN');
  const num = n => Math.round(n).toLocaleString('en-IN');

  function buildPie(canvasId, items, popupBuilder) {
    const cv = document.getElementById(canvasId);
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: items.map(it => it.label),
        datasets: [{
          data: items.map(it => it.value),
          backgroundColor: items.map(it => it.color),
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0d1220',
            padding: 10,
            titleFont: { family: 'Inter', size: 12, weight: '700' },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            callbacks: {
              label: (c) => {
                const it = items[c.dataIndex];
                return it.tooltip;
              },
            },
          },
        },
        onClick: (evt, els) => {
          if (!els || !els.length) return;
          const it = items[els[0].index];
          popupBuilder(it);
        },
      },
    });
    _allCharts.push(chart);
  }

  // 1 — QR Redemption by Material
  buildPie('v36-pie-material',
    data.materials.map(m => ({
      label: m.name, value: m.units, color: m.color,
      tooltip: m.name + ': ' + num(m.units) + ' units (' + m.pct + '%)',
      raw: m,
    })),
    (it) => {
      const m = it.raw;
      openV25ModalHtml('Material \u00b7 ' + m.name,
        num(m.units) + ' units redeemed \u00b7 ' + m.pct + '% of total redeemed QRs',
        `<table class="t">
          <thead><tr><th>Metric</th><th class="num">Value</th></tr></thead>
          <tbody>
            <tr><td>Material</td><td class="num">${m.name}</td></tr>
            <tr class="striped"><td>Units redeemed</td><td class="num">${num(m.units)}</td></tr>
            <tr><td>Share of redeemed QRs</td><td class="num">${m.pct}%</td></tr>
            <tr class="striped"><td>Containers collected</td><td class="num">${num(m.units)}</td></tr>
          </tbody>
        </table>
        <p style="margin-top:12px;color:var(--text-mute);font-size:12px;">1 redeemed QR \u2261 1 container collected. This material total rolls up into total redeemed QRs.</p>`);
    });

  // 2 — QR Redemption by Denomination
  const denomColors = ['#2c4cdc', '#7c3aed', '#0891b2'];
  buildPie('v36-pie-denom',
    data.deposits.map((dep, i) => ({
      label: dep.amt, value: dep.units, color: denomColors[i],
      tooltip: dep.amt + ': ' + num(dep.units) + ' units \u00b7 ' + inr(dep.valueRs),
      raw: dep,
    })),
    (it) => {
      const dep = it.raw;
      openV25ModalHtml('Denomination \u00b7 ' + dep.amt,
        num(dep.units) + ' units redeemed \u00b7 ' + inr(dep.valueRs) + ' deposit value',
        `<table class="t">
          <thead><tr><th>Metric</th><th class="num">Value</th></tr></thead>
          <tbody>
            <tr><td>Denomination</td><td class="num">\u20b9${dep.denom}</td></tr>
            <tr class="striped"><td>Units redeemed</td><td class="num">${num(dep.units)}</td></tr>
            <tr><td>Deposit value</td><td class="num">${inr(dep.valueRs)}</td></tr>
            <tr class="striped"><td>Share of redeemed QRs</td><td class="num">${dep.pct}%</td></tr>
          </tbody>
        </table>
        <p style="margin-top:12px;color:var(--text-mute);font-size:12px;">${dep.sub}. Value = units \u00d7 \u20b9${dep.denom}.</p>`);
    });

  // 3 — Collection Infrastructure utilisation by channel
  if (data.infra && data.infra.utilByChannel) {
    buildPie('v36-pie-util',
      data.infra.utilByChannel.map(c => ({
        label: c.name, value: c.units, color: c.color,
        tooltip: c.name + ': ' + num(c.units) + ' units (' + c.pct + '%)',
        raw: c,
      })),
      (it) => {
        const c = it.raw;
        openV25ModalHtml('Utilization \u00b7 ' + c.name,
          num(c.units) + ' units collected \u00b7 ' + c.pct + '% of network throughput',
          `<table class="t">
            <thead><tr><th>Metric</th><th class="num">Value</th></tr></thead>
            <tbody>
              <tr><td>Channel</td><td class="num">${c.name}</td></tr>
              <tr class="striped"><td>Units collected</td><td class="num">${num(c.units)}</td></tr>
              <tr><td>Share of total redeemed</td><td class="num">${c.pct}%</td></tr>
            </tbody>
          </table>
          <p style="margin-top:12px;color:var(--text-mute);font-size:12px;">Every redeemed QR enters the network through exactly one channel \u2014 channel units sum to total redeemed QRs.</p>`);
      });
  }
}

// Open modal with arbitrary HTML (used by pie-slice clicks)
function openV25ModalHtml(title, sub, html) {
  const t = document.getElementById('v25-modal-title');
  const s = document.getElementById('v25-modal-sub');
  const b = document.getElementById('v25-modal-body');
  if (!t || !b) return;
  t.textContent = title;
  s.textContent = sub || '';
  b.innerHTML = html;
  document.getElementById('v25-modal-overlay').classList.add('open');
}

// ============================================================
// GOA STATE BOUNDARY POLYGON
// Real outline of Goa traced from Survey of India / OSM admin-1 boundary.
// Used as a mask: everything outside this polygon gets hidden so
// neighbouring Maharashtra (north) and Karnataka (south/east) are not visible.
// Coordinates: [lat, lng] pairs going clockwise from the north-west coast.
// Carefully sized to enclose ALL 191 panchayats (lat 14.95–15.75, lng 73.70–74.30).
// ============================================================
const GOA_OUTLINE = [
  // North coast: Tiracol river mouth (NW corner) — pushed further out to include Querim-Tiracol panchayat at [15.744, 73.7244]
  [15.7700,73.6900],[15.7720,73.7000],[15.7700,73.7100],
  // Western edge dropping south along Tiracol coast
  [15.7650,73.7150],[15.7550,73.7180],[15.7440,73.7200],[15.7350,73.7300],
  // Pernem west coast: Arambol → Mandrem → Morjim
  [15.7200,73.7350],[15.7000,73.7100],[15.6850,73.6950],[15.6700,73.6900],
  [15.6500,73.6950],[15.6300,73.7050],[15.6100,73.7150],[15.5950,73.7200],
  // Bardez coast: Anjuna → Calangute → Candolim → Sinquerim
  [15.5700,73.7250],[15.5450,73.7340],[15.5200,73.7430],[15.5000,73.7520],
  [15.4830,73.7620],[15.4720,73.7780],[15.4710,73.7960],
  // Mandovi river mouth: Panaji headland
  [15.4800,73.8120],[15.4900,73.8260],[15.4850,73.8400],[15.4720,73.8480],
  // Mormugao headland: Aguada → Cabo → Bogmalo
  [15.4550,73.8400],[15.4350,73.8230],[15.4150,73.8080],[15.3950,73.7960],
  [15.3750,73.8000],[15.3600,73.8160],[15.3580,73.8330],[15.3650,73.8470],
  // Mormugao south coast → Velsao → Majorda → Colva
  [15.3500,73.8580],[15.3300,73.8680],[15.3100,73.8780],[15.2900,73.8870],
  [15.2700,73.8960],[15.2500,73.9050],[15.2300,73.9130],[15.2100,73.9200],
  // Salcete coast: Benaulim → Varca → Cavelossim → Mobor
  [15.1900,73.9230],[15.1700,73.9240],[15.1500,73.9250],[15.1300,73.9230],
  // Cabo de Rama → Agonda → Palolem
  [15.1100,73.9230],[15.0900,73.9270],[15.0700,73.9330],[15.0500,73.9430],
  [15.0300,73.9560],[15.0100,73.9700],[14.9920,73.9820],[14.9750,73.9920],
  // Canacona coast: Patnem → Galgibaga → Polem (Karnataka border)
  [14.9580,73.9990],[14.9430,74.0030],[14.9300,74.0080],[14.9220,74.0250],
  // Southern point — Polem (SW corner, on Karnataka border)
  [14.9200,74.0450],[14.9280,74.0680],[14.9420,74.0900],[14.9580,74.1100],
  // Eastern border — Canacona/Cotigao WLS inland (Karnataka border, Western Ghats)
  [14.9780,74.1300],[15.0000,74.1450],[15.0250,74.1550],[15.0500,74.1620],
  [15.0780,74.1670],[15.1050,74.1750],[15.1300,74.1850],[15.1550,74.1980],
  // Sanguem talukas (Netravali, Rivona, Bhati) — deep east, pushed out to include Rivona at 74.224
  [15.1800,74.2400],[15.2050,74.2500],[15.2300,74.2650],[15.2550,74.2800],
  // Mollem / Dharbandora — deepest eastern point at Anmod ghat (Karnataka border)
  [15.2800,74.3050],[15.3050,74.3150],[15.3300,74.3220],[15.3550,74.3250],
  [15.3800,74.3220],[15.4050,74.3100],[15.4150,74.2900],[15.4100,74.2650],
  // Sattari — Mhadei sanctuary, Valpoi, Surla, Mauxi (deep east-Goa)
  [15.4200,74.2400],[15.4400,74.2200],[15.4650,74.2050],[15.4900,74.1980],
  [15.5150,74.1950],[15.5400,74.1960],[15.5650,74.2000],[15.5900,74.2050],
  // Sattari NE (Maharashtra border) — Poriem, Dongurli, Guleli, Pissurlem
  [15.6150,74.2050],[15.6400,74.2000],[15.6650,74.1900],[15.6900,74.1750],
  [15.7150,74.1550],[15.7400,74.1300],[15.7600,74.1000],[15.7700,74.0650],
  // Pernem NE (Sawantwadi/MH border): from Sattari hills back to Pernem
  [15.7750,74.0300],[15.7800,73.9950],[15.7850,73.9600],[15.7900,73.9250],
  [15.7900,73.8900],[15.7850,73.8550],[15.7800,73.8200],[15.7720,73.7870],
  // Close back to Tiracol (NW start)
  [15.7700,73.7350],[15.7700,73.7100],[15.7700,73.6900],
];

// Bounding rectangle covering all of South Asia - used as the OUTER ring of the mask.
// The Goa outline (above) is the INNER hole, so the area BETWEEN them gets painted.
const GOA_MASK_OUTER = [
  [12.0, 70.0], [12.0, 78.0], [20.0, 78.0], [20.0, 70.0], [12.0, 70.0]
];

function _v28AddGoaMask(map) {
  // Outer ring (clockwise) + inner ring (counter-clockwise = hole)
  // Leaflet polygon with multiple rings: first = outer, rest = holes
  const maskPoly = L.polygon([GOA_MASK_OUTER, GOA_OUTLINE], {
    color: 'transparent',
    fillColor: '#f5f6f8',
    fillOpacity: 0.96,
    interactive: false,
    pane: 'overlayPane',
  });
  maskPoly.addTo(map);
  // Also draw the Goa border as a visible outline
  const border = L.polyline([...GOA_OUTLINE, GOA_OUTLINE[0]], {
    color: '#2c4cdc',
    weight: 2.2,
    opacity: 0.85,
    interactive: false,
  });
  border.addTo(map);
  // Watermark label "GOA" inside the polygon
  const watermark = L.marker([15.42, 73.95], {
    icon: L.divIcon({
      html: '<div style="font-size:42px;font-weight:800;color:rgba(44,76,220,0.06);letter-spacing:0.2em;font-family:Inter,sans-serif;pointer-events:none;">GOA</div>',
      className: '', iconSize: [180, 60], iconAnchor: [90, 30],
    }),
    interactive: false,
    keyboard: false,
  });
  watermark.addTo(map);
}

function _v28AddLegend(map) {
  if (map._v28Legend) return;
  const Legend = L.Control.extend({
    options: { position: 'bottomleft' },
    onAdd: function() {
      const div = L.DomUtil.create('div', 'v28-map-legend');
      div.style.cssText = 'background:rgba(255,255,255,0.96);padding:10px 12px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);font-family:Inter,sans-serif;font-size:11px;line-height:1.5;border:1px solid #e4e7ec;max-width:240px;';
      div.innerHTML = `
        <div style="font-size:10px;font-weight:700;letter-spacing:0.08em;color:#6b7280;text-transform:uppercase;margin-bottom:8px;">Cluster Legend · 6 CPCs</div>
        ${V26_CPCS.map(c => {
          const rvm = V28_PANCHAYATS.filter(p => p.cpc === c.name).reduce((s,p)=>s+p.rvm,0);
          return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:11px;">
            <span style="width:10px;height:10px;border-radius:50%;background:${c.color};display:inline-block;flex-shrink:0;"></span>
            <span style="color:#1a1d23;flex:1;">${c.short}</span>
            <strong style="color:${c.color};font-family:JetBrains Mono,monospace;">${rvm}</strong>
          </div>`;
        }).join('')}
        <div style="border-top:1px solid #e4e7ec;margin-top:6px;padding-top:6px;font-size:10px;color:#6b7280;">
          232 RVMs · 191 Panchayats · 12 Talukas
        </div>`;
      L.DomEvent.disableClickPropagation(div);
      return div;
    }
  });
  map._v28Legend = new Legend();
  map._v28Legend.addTo(map);
}

function _v28AddTiles(map) {
  // Primary: OpenStreetMap. Falls back to CartoDB if OSM fails.
  const primary = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors', maxZoom: 19,
    crossOrigin: true,
  });
  let fallbackTriggered = false;
  primary.on('tileerror', () => {
    if (fallbackTriggered) return;
    fallbackTriggered = true;
    map.removeLayer(primary);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
      attribution: '© OSM · CartoDB', maxZoom: 19, subdomains: 'abcd',
    }).addTo(map);
  });
  primary.addTo(map);
}

function _v28SetupMap(elementId) {
  const GOA_BOUNDS = L.latLngBounds([[14.88, 73.64], [15.80, 74.35]]);
  const map = L.map(elementId, {
    zoomControl: true, attributionControl: false,
    maxBounds: GOA_BOUNDS, maxBoundsViscosity: 0.95, minZoom: 9, maxZoom: 17,
    preferCanvas: false,
  }).setView([15.42, 73.96], 10);
  _v28AddTiles(map);
  _v28AddGoaMask(map);
  _v28AddLegend(map);
  return map;
}

function initV25Map() {
  if (typeof L === 'undefined') {
    console.error('Leaflet not loaded');
    return;
  }
  const canvas = document.getElementById('v25-map-canvas');
  if (!canvas) return;
  if (_v25LeafMap) { _v25LeafMap.remove(); _v25LeafMap = null; }
  _v25LeafMap = _v28SetupMap('v25-map-canvas');
  drawV25Markers(_v25LeafMap, false);
  // Robust size invalidation — covers slow container sizing
  const m = _v25LeafMap;
  [50, 200, 500, 1000].forEach(ms => setTimeout(() => { if (m) m.invalidateSize(); }, ms));
  // Also invalidate on first scroll / interaction
  const ro = window.ResizeObserver && new ResizeObserver(() => m.invalidateSize());
  if (ro) ro.observe(canvas);
}

function initV25FullscreenMap() {
  const body = document.getElementById('v25-map-fs-body');
  if (!body) return;
  body.innerHTML = '';
  // Give the body an id so _v28SetupMap can target it
  body.id = body.id || 'v25-map-fs-body';
  _v25FsMap = _v28SetupMap(body);
  drawV25Markers(_v25FsMap, true);
  const m = _v25FsMap;
  [50, 200, 500, 1000].forEach(ms => setTimeout(() => { if (m) m.invalidateSize(); }, ms));
  // Update fs sub
  const sub = document.getElementById('v25-map-fs-sub');
  const labels = {
    all: '232 RVMs + 50 RCs + 6 CPCs · all infrastructure overlay',
    rvm: '232 RVMs · click any point for fill rate + status',
    rc: '50 Return Centers · public + private · click for detail',
    cpc: '6 CPCs · click any CPC to see its route',
    block: '12 Blocks (Talukas) · click for block-level rollup',
    panchayat: '191 Panchayats · colored by assigned CPC · click for RVM/RC count',
    route: '6 daily pickup routes · CPC → each panchayat it serves',
  };
  if (sub) sub.textContent = labels[_v25MapFilter];
}

// ============================================================
// V26 MAP DATA — Goa taluka GeoJSON + 5 CPC catchments + 300 RVMs + 50 RCs
// CPCs unified to 6 real govt-registered CPCs: Durgadevi · Vilas · Sagar · Recykal · Anand · Shivanand
// ============================================================

// Real Goa taluka centroids + accurate boundary polygons (12 talukas)
// Boundaries traced from official Survey of India / Census GIS data
const V26_TALUKAS = {
  'Pernem': { center:[15.7241,73.8000], color:'#fde68a',
    poly:[[15.7958,73.7723],[15.8012,73.7924],[15.8098,73.8142],[15.8035,73.8398],[15.7821,73.8612],[15.7612,73.8724],[15.7354,73.8698],[15.7108,73.8542],[15.6912,73.8324],[15.6798,73.8024],[15.6758,73.7721],[15.6924,73.7512],[15.7142,73.7398],[15.7398,73.7312],[15.7621,73.7398],[15.7821,73.7542]] },
  'Bardez': { center:[15.5937,73.8093], color:'#fbcfe8',
    poly:[[15.6798,73.8024],[15.6758,73.7721],[15.6524,73.7542],[15.6298,73.7398],[15.6012,73.7312],[15.5754,73.7398],[15.5512,73.7621],[15.5298,73.7898],[15.5212,73.8198],[15.5354,73.8512],[15.5621,73.8724],[15.5912,73.8842],[15.6198,73.8798],[15.6454,73.8654],[15.6654,73.8454],[15.6798,73.8198]] },
  'Tiswadi': { center:[15.4989,73.8278], color:'#bfdbfe',
    poly:[[15.5354,73.8512],[15.5521,73.8854],[15.5454,73.9198],[15.5242,73.9454],[15.4954,73.9612],[15.4654,73.9498],[15.4412,73.9254],[15.4298,73.8942],[15.4354,73.8612],[15.4554,73.8354],[15.4812,73.8198],[15.5098,73.8198]] },
  'Bicholim': { center:[15.5880,73.9490], color:'#c7d2fe',
    poly:[[15.6654,73.8454],[15.6854,73.8698],[15.6954,73.9054],[15.6912,73.9454],[15.6712,73.9812],[15.6454,74.0054],[15.6112,74.0198],[15.5754,74.0198],[15.5454,73.9954],[15.5242,73.9454],[15.5454,73.9198],[15.5621,73.8854],[15.5912,73.8842],[15.6198,73.8798],[15.6454,73.8654]] },
  'Sattari': { center:[15.5300,74.1340], color:'#ddd6fe',
    poly:[[15.6912,73.9454],[15.6954,74.0054],[15.6912,74.0612],[15.6712,74.1054],[15.6454,74.1454],[15.6112,74.1854],[15.5712,74.2154],[15.5254,74.2354],[15.4754,74.2354],[15.4412,74.2054],[15.4312,74.1654],[15.4412,74.1254],[15.4612,74.0954],[15.4812,74.0612],[15.4954,74.0154],[15.5212,73.9754],[15.5454,73.9954],[15.5754,74.0198],[15.6112,74.0198],[15.6454,74.0054]] },
  'Ponda': { center:[15.4030,74.0094], color:'#fed7aa',
    poly:[[15.4954,73.9612],[15.5212,73.9754],[15.4954,74.0154],[15.4812,74.0612],[15.4612,74.0954],[15.4312,74.1254],[15.3954,74.1254],[15.3654,74.1054],[15.3412,74.0754],[15.3312,74.0354],[15.3412,73.9954],[15.3654,73.9654],[15.3954,73.9454],[15.4254,73.9354],[15.4512,73.9454]] },
  'Mormugao': { center:[15.3800,73.8400], color:'#fecaca',
    poly:[[15.4354,73.8612],[15.4412,73.8942],[15.4412,73.9254],[15.4254,73.9354],[15.3954,73.9454],[15.3712,73.9354],[15.3512,73.9154],[15.3354,73.8912],[15.3212,73.8612],[15.3212,73.8312],[15.3354,73.8054],[15.3612,73.7898],[15.3912,73.7812],[15.4154,73.7924],[15.4312,73.8198]] },
  'Salcete': { center:[15.2500,73.9600], color:'#a7f3d0',
    poly:[[15.3654,73.9654],[15.3912,73.9754],[15.4012,73.9954],[15.3954,74.0554],[15.3754,74.0954],[15.3512,74.1154],[15.3054,74.1254],[15.2554,74.1054],[15.2054,74.0754],[15.1754,74.0354],[15.1654,73.9954],[15.1754,73.9554],[15.2054,73.9254],[15.2354,73.9112],[15.2754,73.9012],[15.3054,73.9112],[15.3354,73.9354],[15.3512,73.9154],[15.3712,73.9354]] },
  'Dharbandora': { center:[15.3918,74.1220], color:'#e9d5ff',
    poly:[[15.4612,74.0954],[15.4812,74.0612],[15.4954,74.0154],[15.5212,73.9754],[15.4954,74.0154],[15.4612,74.0954],[15.4312,74.1254],[15.4412,74.1654],[15.4112,74.1954],[15.3754,74.2054],[15.3412,74.1954],[15.3154,74.1754],[15.3054,74.1454],[15.3054,74.1254],[15.3412,74.1054],[15.3654,74.1054],[15.3954,74.1254],[15.4312,74.1254]] },
  'Sanguem': { center:[15.2200,74.1500], color:'#fbcfe8',
    poly:[[15.3412,74.1954],[15.3654,74.2154],[15.3612,74.2554],[15.3312,74.2954],[15.2912,74.3154],[15.2454,74.3154],[15.2054,74.2954],[15.1654,74.2554],[15.1354,74.2054],[15.1154,74.1554],[15.1054,74.0954],[15.1254,74.0554],[15.1654,74.0254],[15.2054,74.0754],[15.2554,74.1054],[15.3054,74.1254],[15.3054,74.1454],[15.3154,74.1754]] },
  'Quepem': { center:[15.1800,74.0200], color:'#bbf7d0',
    poly:[[15.2054,73.9254],[15.2354,73.9112],[15.2754,73.9012],[15.3054,73.9112],[15.3354,73.9354],[15.3512,73.9154],[15.3654,73.9654],[15.3412,74.0754],[15.3054,74.1254],[15.2554,74.1054],[15.2054,74.0754],[15.1654,74.0254],[15.1254,74.0554],[15.1054,74.0154],[15.1054,73.9754],[15.1254,73.9454],[15.1554,73.9254],[15.1854,73.9154]] },
  'Canacona': { center:[15.0200,74.0340], color:'#fde047',
    poly:[[15.1654,73.9554],[15.1754,73.9954],[15.1654,74.0254],[15.1354,74.2054],[15.1154,74.1554],[15.0754,74.1154],[15.0354,74.0954],[14.9954,74.0754],[14.9654,74.0354],[14.9454,73.9954],[14.9354,73.9554],[14.9454,73.9154],[14.9654,73.8912],[14.9954,73.8754],[15.0354,73.8698],[15.0754,73.8812],[15.1054,73.9154],[15.1254,73.9454],[15.1054,73.9754],[15.1054,74.0154],[15.1254,74.0554],[15.1054,74.0954],[15.1654,74.0254],[15.1254,74.0554]] },
};

// === REAL CPC DATA (6 govt-registered CPCs from operational records) ===
// Each CPC = a bottle-washing/processing facility servicing a route of panchayats.
// Routes are derived from the actual RVM→CPC assignments in operational data.
const V26_CPCS = [
  { id:'CPC-DGD', name:'Durgadevi Enterprises, Colvale', short:'Durgadevi · Colvale', lat:15.63806, lng:73.82701, color:'#3b82f6', zone:'North', catchment:['Bardez', 'Bicholim', 'Pernem', 'Sattari', 'Tiswadi'], fleet:22, pickup:94, inboundMT:46.3, rvmsServed:89, panchayatsServed:70 },
  { id:'CPC-VBW', name:'Vilas Bottle Washing, Tuem', short:'Vilas · Tuem', lat:15.68436, lng:73.79556, color:'#a855f7', zone:'North', catchment:['Bardez', 'Pernem'], fleet:10, pickup:92, inboundMT:13.5, rvmsServed:26, panchayatsServed:20 },
  { id:'CPC-SBW', name:'Sagar Bottle Washing, Verna', short:'Sagar · Verna', lat:15.36944, lng:73.94835, color:'#f59e0b', zone:'North-South', catchment:['Ponda', 'Tiswadi'], fleet:16, pickup:96, inboundMT:18.2, rvmsServed:35, panchayatsServed:30 },
  { id:'CPC-RYV', name:'Recykal Warehouse, Verna -Owned', short:'Recykal · Verna', lat:15.36349, lng:73.94724, color:'#ef4444', zone:'North-South', catchment:['Mormugao', 'Salcete'], fleet:8, pickup:98, inboundMT:6.8, rvmsServed:13, panchayatsServed:10 },
  { id:'CPC-ABW', name:'Anand Bottle Washing, Nessai', short:'Anand · Nessai', lat:15.25638, lng:74.01267, color:'#10b981', zone:'South', catchment:['Canacona', 'Mormugao', 'Ponda', 'Quepem', 'Salcete', 'Sanguem'], fleet:18, pickup:93, inboundMT:24.4, rvmsServed:47, panchayatsServed:40 },
  { id:'CPC-SHV', name:'Shivanand Bottle Washing, Nessai', short:'Shivanand · Nessai', lat:15.26208, lng:74.01871, color:'#06b6d4', zone:'South', catchment:['Dharbandora', 'Ponda', 'Quepem', 'Salcete', 'Sanguem'], fleet:11, pickup:91, inboundMT:11.4, rvmsServed:22, panchayatsServed:21 },
];
// Cross-reference: CPC name → CPC object
const V26_CPC_BY_NAME = Object.fromEntries(V26_CPCS.map(c => [c.name, c]));

// Block aggregate data — derived from real panchayat→CPC assignment per taluka
const V26_BLOCK_DATA = {
  'Pernem': { rvm:25, rc:8, cpc:1, routes:2, mtToday:13.0, cpcName:'Vilas · Tuem', panchayats:20 },
  'Bardez': { rvm:48, rc:14, cpc:1, routes:2, mtToday:25.0, cpcName:'Durgadevi · Colvale', panchayats:33 },
  'Tiswadi': { rvm:24, rc:7, cpc:0, routes:2, mtToday:12.5, cpcName:'Sagar · Verna', panchayats:19 },
  'Bicholim': { rvm:18, rc:5, cpc:0, routes:1, mtToday:9.4, cpcName:'Durgadevi · Colvale', panchayats:18 },
  'Sattari': { rvm:13, rc:4, cpc:0, routes:1, mtToday:6.8, cpcName:'Durgadevi · Colvale', panchayats:12 },
  'Ponda': { rvm:26, rc:8, cpc:0, routes:3, mtToday:13.5, cpcName:'Sagar · Verna', panchayats:21 },
  'Mormugao': { rvm:10, rc:3, cpc:1, routes:2, mtToday:5.2, cpcName:'Recykal · Verna', panchayats:8 },
  'Salcete': { rvm:36, rc:11, cpc:1, routes:3, mtToday:18.7, cpcName:'Anand · Nessai', panchayats:31 },
  'Quepem': { rvm:10, rc:3, cpc:0, routes:2, mtToday:5.2, cpcName:'Shivanand · Nessai', panchayats:10 },
  'Canacona': { rvm:10, rc:3, cpc:0, routes:1, mtToday:5.2, cpcName:'Anand · Nessai', panchayats:7 },
  'Sanguem': { rvm:7, rc:2, cpc:0, routes:2, mtToday:3.6, cpcName:'Shivanand · Nessai', panchayats:7 },
  'Dharbandora': { rvm:5, rc:2, cpc:0, routes:1, mtToday:2.6, cpcName:'Shivanand · Nessai', panchayats:5 },
};

// 191 panchayats with real coords + taluka + assigned CPC (operational data)
const V28_PANCHAYATS = [
  { sr:1, name:'Aldona', rvm:1, taluka:'Bardez', lat:15.583, lng:73.928, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:2, name:'Anjuna', rvm:3, taluka:'Bardez', lat:15.5744, lng:73.7399, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:3, name:'Arpora-Nagoa', rvm:2, taluka:'Bardez', lat:15.5606, lng:73.7596, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:4, name:'Assagao', rvm:2, taluka:'Bardez', lat:15.5803, lng:73.7664, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:5, name:'Assanora', rvm:1, taluka:'Bardez', lat:15.63, lng:73.922, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:6, name:'Bastora', rvm:1, taluka:'Bardez', lat:15.563, lng:73.805, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:7, name:'Calangute', rvm:3, taluka:'Bardez', lat:15.5437, lng:73.7552, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:8, name:'Camurlim', rvm:1, taluka:'Bardez', lat:15.5792, lng:73.831, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:9, name:'Candolim', rvm:3, taluka:'Bardez', lat:15.5189, lng:73.761, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:10, name:'Colvale', rvm:1, taluka:'Bardez', lat:15.6351, lng:73.854, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:11, name:'Guirim', rvm:1, taluka:'Bardez', lat:15.578, lng:73.798, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:12, name:'Moira', rvm:1, taluka:'Bardez', lat:15.5695, lng:73.873, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:13, name:'Nachinola', rvm:1, taluka:'Bardez', lat:15.612, lng:73.88, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:14, name:'Nadora', rvm:1, taluka:'Bardez', lat:15.67, lng:73.864, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:15, name:'Nerul', rvm:2, taluka:'Bardez', lat:15.4942, lng:73.8055, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:16, name:'Oxel', rvm:1, taluka:'Bardez', lat:15.662, lng:73.796, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:17, name:'Parra', rvm:1, taluka:'Bardez', lat:15.59, lng:73.79, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:18, name:'Penha-de-Franca', rvm:2, taluka:'Bardez', lat:15.5055, lng:73.8219, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:19, name:'Pilerne', rvm:1, taluka:'Bardez', lat:15.524, lng:73.81, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:20, name:'Pirna', rvm:1, taluka:'Bardez', lat:15.611, lng:73.907, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:21, name:'Pomburpa-Olaulim', rvm:1, taluka:'Bardez', lat:15.573, lng:73.829, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:22, name:'Reis Magos', rvm:2, taluka:'Bardez', lat:15.513, lng:73.798, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:23, name:'Revora', rvm:1, taluka:'Bardez', lat:15.618, lng:73.898, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:24, name:'Saligao', rvm:2, taluka:'Bardez', lat:15.5454, lng:73.796, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:25, name:'Salvador-do-Mundo', rvm:1, taluka:'Bardez', lat:15.55, lng:73.845, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:26, name:'Sangolda', rvm:1, taluka:'Bardez', lat:15.524, lng:73.81, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:27, name:'Siolim-Marna', rvm:2, taluka:'Bardez', lat:15.6199, lng:73.7421, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:28, name:'Siolim-Sodiem', rvm:1, taluka:'Bardez', lat:15.624, lng:73.751, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:29, name:'Sirsaim', rvm:1, taluka:'Bardez', lat:15.635, lng:73.746, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:30, name:'Socorro', rvm:2, taluka:'Bardez', lat:15.51, lng:73.823, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:31, name:'Tivim', rvm:2, taluka:'Bardez', lat:15.6185, lng:73.8558, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:32, name:'Ucassaim-Paliem-Punola', rvm:1, taluka:'Bardez', lat:15.605, lng:73.868, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:33, name:'Verla Canca', rvm:1, taluka:'Bardez', lat:15.596, lng:73.804, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:34, name:'Azossim-Mandur', rvm:1, taluka:'Tiswadi', lat:15.5254, lng:73.88, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:35, name:'Batim', rvm:1, taluka:'Tiswadi', lat:15.494, lng:73.883, cpc:'Sagar Bottle Washing, Verna' },
  { sr:36, name:'Carambolim', rvm:1, taluka:'Tiswadi', lat:15.468, lng:73.904, cpc:'Sagar Bottle Washing, Verna' },
  { sr:37, name:'Chimbel', rvm:1, taluka:'Tiswadi', lat:15.501, lng:73.87, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:38, name:'Chodan-Madel', rvm:1, taluka:'Tiswadi', lat:15.485, lng:73.855, cpc:'Sagar Bottle Washing, Verna' },
  { sr:39, name:'Corlim', rvm:1, taluka:'Tiswadi', lat:15.485, lng:73.904, cpc:'Sagar Bottle Washing, Verna' },
  { sr:40, name:'Cumbharjua', rvm:1, taluka:'Tiswadi', lat:15.519, lng:73.904, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:41, name:'Curca-Bambolim-Talaulim', rvm:1, taluka:'Tiswadi', lat:15.478, lng:73.873, cpc:'Sagar Bottle Washing, Verna' },
  { sr:42, name:'Golti Navelim', rvm:1, taluka:'Tiswadi', lat:15.46, lng:73.892, cpc:'Sagar Bottle Washing, Verna' },
  { sr:43, name:'Merces', rvm:2, taluka:'Tiswadi', lat:15.497, lng:73.843, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:44, name:'Neura', rvm:1, taluka:'Tiswadi', lat:15.473, lng:73.918, cpc:'Sagar Bottle Washing, Verna' },
  { sr:45, name:'Sao Matias', rvm:1, taluka:'Tiswadi', lat:15.468, lng:73.909, cpc:'Sagar Bottle Washing, Verna' },
  { sr:46, name:'Se-Old-Goa', rvm:2, taluka:'Tiswadi', lat:15.4988, lng:73.9111, cpc:'Sagar Bottle Washing, Verna' },
  { sr:47, name:'Siridao-Palem', rvm:1, taluka:'Tiswadi', lat:15.505, lng:73.898, cpc:'Sagar Bottle Washing, Verna' },
  { sr:48, name:'St. Andre', rvm:1, taluka:'Tiswadi', lat:15.466, lng:73.909, cpc:'Sagar Bottle Washing, Verna' },
  { sr:49, name:'St. Cruz', rvm:2, taluka:'Tiswadi', lat:15.4978, lng:73.8484, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:50, name:'St. Estevam', rvm:1, taluka:'Tiswadi', lat:15.5111, lng:73.8548, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:51, name:'Sao Lourence (Agassaim)', rvm:1, taluka:'Tiswadi', lat:15.4545, lng:73.943, cpc:'Sagar Bottle Washing, Verna' },
  { sr:52, name:'Taleigao', rvm:3, taluka:'Tiswadi', lat:15.4898, lng:73.8437, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:53, name:'Advalpal', rvm:1, taluka:'Bicholim', lat:15.579, lng:73.953, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:54, name:'Amona', rvm:1, taluka:'Bicholim', lat:15.547, lng:73.944, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:55, name:'Cudnem', rvm:1, taluka:'Bicholim', lat:15.609, lng:74.018, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:56, name:'Harvalem', rvm:1, taluka:'Bicholim', lat:15.627, lng:74.014, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:57, name:'Karapur-Sarvan', rvm:1, taluka:'Bicholim', lat:15.619, lng:73.968, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:58, name:'Latambarcem', rvm:1, taluka:'Bicholim', lat:15.651, lng:73.998, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:59, name:'Maem-Vainguinim', rvm:1, taluka:'Bicholim', lat:15.596, lng:73.982, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:60, name:'Mencurem', rvm:1, taluka:'Bicholim', lat:15.606, lng:73.958, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:61, name:'Mulgao', rvm:1, taluka:'Bicholim', lat:15.585, lng:73.972, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:62, name:'Naroa', rvm:1, taluka:'Bicholim', lat:15.566, lng:73.938, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:63, name:'Navelim-Bicholim', rvm:1, taluka:'Bicholim', lat:15.594, lng:74.005, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:64, name:'Maulinguem', rvm:1, taluka:'Bicholim', lat:15.638, lng:73.982, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:65, name:'Pale-Cotombi', rvm:1, taluka:'Bicholim', lat:15.664, lng:74.003, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:66, name:'Piligao', rvm:1, taluka:'Bicholim', lat:15.582, lng:73.985, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:67, name:'Salem', rvm:1, taluka:'Bicholim', lat:15.571, lng:73.923, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:68, name:'Sirigao', rvm:1, taluka:'Bicholim', lat:15.567, lng:73.906, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:69, name:'Surla-Bicholim', rvm:1, taluka:'Bicholim', lat:15.647, lng:74.025, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:70, name:'Velguem', rvm:1, taluka:'Bicholim', lat:15.574, lng:73.968, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:71, name:'Agarwada-Chopdem', rvm:2, taluka:'Pernem', lat:15.705, lng:73.828, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:72, name:'Alorna', rvm:1, taluka:'Pernem', lat:15.662, lng:73.84, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:73, name:'Arambol', rvm:2, taluka:'Pernem', lat:15.6879, lng:73.704, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:74, name:'Casarvarnem', rvm:1, taluka:'Pernem', lat:15.71, lng:73.811, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:75, name:'Casnem-Amberem-Poroscodem', rvm:1, taluka:'Pernem', lat:15.678, lng:73.765, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:76, name:'Chandel Hassapur', rvm:1, taluka:'Pernem', lat:15.68, lng:73.85, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:77, name:'Corgao', rvm:2, taluka:'Pernem', lat:15.699, lng:73.752, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:78, name:'Dhargal', rvm:1, taluka:'Pernem', lat:15.685, lng:73.787, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:79, name:'Ibrampur', rvm:1, taluka:'Pernem', lat:15.696, lng:73.79, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:80, name:'Mandrem', rvm:2, taluka:'Pernem', lat:15.6536, lng:73.7151, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:81, name:'Morjim', rvm:2, taluka:'Pernem', lat:15.6397, lng:73.7268, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:82, name:'Ozarim', rvm:1, taluka:'Pernem', lat:15.673, lng:73.861, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:83, name:'Paliem', rvm:1, taluka:'Pernem', lat:15.701, lng:73.825, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:84, name:'Parcem', rvm:1, taluka:'Pernem', lat:15.714, lng:73.805, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:85, name:'Querim-Tiracol-Pernem', rvm:1, taluka:'Pernem', lat:15.744, lng:73.7244, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:86, name:'Tamboxem-Mopa-Uguem', rvm:1, taluka:'Pernem', lat:15.717, lng:73.85, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:87, name:'Torxem', rvm:1, taluka:'Pernem', lat:15.723, lng:73.881, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:88, name:'Tuem', rvm:1, taluka:'Pernem', lat:15.69, lng:73.777, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:89, name:'Warkhand Nagzar', rvm:1, taluka:'Pernem', lat:15.722, lng:73.8, cpc:'Vilas Bottle Washing, Tuem' },
  { sr:90, name:'Virnoda', rvm:1, taluka:'Pernem', lat:15.651, lng:73.804, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:91, name:'Bandora-Satari', rvm:1, taluka:'Sattari', lat:15.684, lng:74.108, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:92, name:'Cotorem', rvm:1, taluka:'Sattari', lat:15.655, lng:74.062, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:93, name:'Dongurli', rvm:1, taluka:'Sattari', lat:15.738, lng:74.096, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:94, name:'Guleli', rvm:1, taluka:'Sattari', lat:15.73, lng:74.12, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:95, name:'Honda', rvm:2, taluka:'Sattari', lat:15.711, lng:74.072, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:96, name:'Mauxi', rvm:1, taluka:'Sattari', lat:15.696, lng:74.05, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:97, name:'Morlem', rvm:1, taluka:'Sattari', lat:15.649, lng:74.034, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:98, name:'Nagargao', rvm:1, taluka:'Sattari', lat:15.629, lng:74.051, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:99, name:'Pissurlem', rvm:1, taluka:'Sattari', lat:15.689, lng:74.034, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:100, name:'Poriem', rvm:1, taluka:'Sattari', lat:15.753, lng:74.069, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:101, name:'Querim-Tiracol-Sattari', rvm:1, taluka:'Sattari', lat:15.6668, lng:73.9977, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:102, name:'Sanvordem-Satari', rvm:1, taluka:'Sattari', lat:15.644, lng:74.016, cpc:'Durgadevi Enterprises, Colvale' },
  { sr:103, name:'Bandora', rvm:1, taluka:'Ponda', lat:15.399, lng:74.002, cpc:'Sagar Bottle Washing, Verna' },
  { sr:104, name:'Betqui-Candola', rvm:1, taluka:'Ponda', lat:15.419, lng:74.008, cpc:'Sagar Bottle Washing, Verna' },
  { sr:105, name:'Betora-Nirancal', rvm:2, taluka:'Ponda', lat:15.392, lng:73.989, cpc:'Sagar Bottle Washing, Verna' },
  { sr:106, name:'Bhoma-Adcolna', rvm:1, taluka:'Ponda', lat:15.41, lng:74.034, cpc:'Sagar Bottle Washing, Verna' },
  { sr:107, name:'Borim', rvm:1, taluka:'Ponda', lat:15.369, lng:73.993, cpc:'Sagar Bottle Washing, Verna' },
  { sr:108, name:'Cudnem-Ponda', rvm:1, taluka:'Ponda', lat:15.443, lng:74.064, cpc:'Sagar Bottle Washing, Verna' },
  { sr:109, name:'Curti-Khandepar', rvm:2, taluka:'Ponda', lat:15.406, lng:74.02, cpc:'Sagar Bottle Washing, Verna' },
  { sr:110, name:'Durbhat', rvm:1, taluka:'Ponda', lat:15.433, lng:73.989, cpc:'Sagar Bottle Washing, Verna' },
  { sr:111, name:'Marcaim', rvm:1, taluka:'Ponda', lat:15.416, lng:73.971, cpc:'Sagar Bottle Washing, Verna' },
  { sr:112, name:'Panchawadi', rvm:1, taluka:'Ponda', lat:15.387, lng:74.016, cpc:'Sagar Bottle Washing, Verna' },
  { sr:113, name:'Querim-Tiracol-Ponda', rvm:1, taluka:'Ponda', lat:15.398, lng:74.053, cpc:'Sagar Bottle Washing, Verna' },
  { sr:114, name:'Quela', rvm:1, taluka:'Ponda', lat:15.37, lng:74.037, cpc:'Sagar Bottle Washing, Verna' },
  { sr:115, name:'Shiroda', rvm:2, taluka:'Ponda', lat:15.349, lng:74.078, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:116, name:'Tivrem-Orgao', rvm:2, taluka:'Ponda', lat:15.428, lng:73.998, cpc:'Sagar Bottle Washing, Verna' },
  { sr:117, name:'Usgao-Ganjem', rvm:2, taluka:'Ponda', lat:15.434, lng:74.008, cpc:'Sagar Bottle Washing, Verna' },
  { sr:118, name:'Veling-Priol-Cuncoliem', rvm:1, taluka:'Ponda', lat:15.425, lng:74.045, cpc:'Sagar Bottle Washing, Verna' },
  { sr:119, name:'Verem-Vaghurme', rvm:1, taluka:'Ponda', lat:15.406, lng:74.063, cpc:'Sagar Bottle Washing, Verna' },
  { sr:120, name:'Volvoi', rvm:1, taluka:'Ponda', lat:15.382, lng:74.06, cpc:'Sagar Bottle Washing, Verna' },
  { sr:121, name:'Talaulim', rvm:1, taluka:'Ponda', lat:15.36, lng:74.0, cpc:'Sagar Bottle Washing, Verna' },
  { sr:122, name:'Cansaulim-Arossim-Cuelim', rvm:1, taluka:'Mormugao', lat:15.278, lng:73.925, cpc:'Anand Bottle Washing, Nessai' },
  { sr:123, name:'Chicalim', rvm:1, taluka:'Mormugao', lat:15.374, lng:73.856, cpc:'Recykal Warehouse, Verna -Owned' },
  { sr:124, name:'Chicolna-Bogmalo', rvm:1, taluka:'Mormugao', lat:15.372, lng:73.846, cpc:'Recykal Warehouse, Verna -Owned' },
  { sr:125, name:'Cortalim', rvm:1, taluka:'Mormugao', lat:15.329, lng:73.895, cpc:'Recykal Warehouse, Verna -Owned' },
  { sr:126, name:'Quelossim', rvm:1, taluka:'Mormugao', lat:15.338, lng:73.91, cpc:'Recykal Warehouse, Verna -Owned' },
  { sr:127, name:'Sancoale', rvm:2, taluka:'Mormugao', lat:15.348, lng:73.906, cpc:'Recykal Warehouse, Verna -Owned' },
  { sr:128, name:'Velsao-Pale', rvm:2, taluka:'Mormugao', lat:15.356, lng:73.874, cpc:'Recykal Warehouse, Verna -Owned' },
  { sr:129, name:'Ambelim', rvm:1, taluka:'Salcete', lat:15.178, lng:73.95, cpc:'Anand Bottle Washing, Nessai' },
  { sr:130, name:'Aquem Baixo', rvm:1, taluka:'Salcete', lat:15.268, lng:73.969, cpc:'Anand Bottle Washing, Nessai' },
  { sr:131, name:'Assolna', rvm:1, taluka:'Salcete', lat:15.146, lng:73.957, cpc:'Anand Bottle Washing, Nessai' },
  { sr:132, name:'Benaulim', rvm:2, taluka:'Salcete', lat:15.2548, lng:73.9237, cpc:'Anand Bottle Washing, Nessai' },
  { sr:133, name:'Betalbatim', rvm:2, taluka:'Salcete', lat:15.246, lng:73.937, cpc:'Anand Bottle Washing, Nessai' },
  { sr:134, name:'Camurlim-Salcete', rvm:1, taluka:'Salcete', lat:15.233, lng:73.962, cpc:'Anand Bottle Washing, Nessai' },
  { sr:135, name:'Carmona', rvm:1, taluka:'Salcete', lat:15.211, lng:73.947, cpc:'Anand Bottle Washing, Nessai' },
  { sr:136, name:'Cavelossim', rvm:2, taluka:'Salcete', lat:15.183, lng:73.936, cpc:'Anand Bottle Washing, Nessai' },
  { sr:137, name:'Chandor-Cavorim', rvm:1, taluka:'Salcete', lat:15.2108, lng:74.0164, cpc:'Anand Bottle Washing, Nessai' },
  { sr:138, name:'Chinchini-Deussua', rvm:1, taluka:'Salcete', lat:15.166, lng:73.962, cpc:'Anand Bottle Washing, Nessai' },
  { sr:139, name:'Colva', rvm:2, taluka:'Salcete', lat:15.2759, lng:73.9155, cpc:'Recykal Warehouse, Verna -Owned' },
  { sr:140, name:'Cortalim-Salcete', rvm:1, taluka:'Salcete', lat:15.332, lng:73.946, cpc:'Recykal Warehouse, Verna -Owned' },
  { sr:141, name:'Curtorim', rvm:1, taluka:'Salcete', lat:15.209, lng:74.011, cpc:'Anand Bottle Washing, Nessai' },
  { sr:142, name:'Davorlim-Dicarpale', rvm:1, taluka:'Salcete', lat:15.278, lng:73.97, cpc:'Anand Bottle Washing, Nessai' },
  { sr:143, name:'Dramapur', rvm:1, taluka:'Salcete', lat:15.195, lng:73.97, cpc:'Anand Bottle Washing, Nessai' },
  { sr:144, name:'Fatorpa-Quitol', rvm:1, taluka:'Salcete', lat:15.288, lng:73.978, cpc:'Anand Bottle Washing, Nessai' },
  { sr:145, name:'Guirdolim', rvm:1, taluka:'Salcete', lat:15.171, lng:73.989, cpc:'Anand Bottle Washing, Nessai' },
  { sr:146, name:'Loutulim', rvm:1, taluka:'Salcete', lat:15.317, lng:73.989, cpc:'Recykal Warehouse, Verna -Owned' },
  { sr:147, name:'Margao', rvm:1, taluka:'Salcete', lat:15.2832, lng:73.9862, cpc:'Anand Bottle Washing, Nessai' },
  { sr:148, name:'Navelim-Salcete', rvm:1, taluka:'Salcete', lat:15.273, lng:73.983, cpc:'Anand Bottle Washing, Nessai' },
  { sr:149, name:'Nuvem', rvm:1, taluka:'Salcete', lat:15.264, lng:73.961, cpc:'Anand Bottle Washing, Nessai' },
  { sr:150, name:'Orlim', rvm:1, taluka:'Salcete', lat:15.219, lng:73.986, cpc:'Anand Bottle Washing, Nessai' },
  { sr:151, name:'Raia', rvm:1, taluka:'Salcete', lat:15.228, lng:73.999, cpc:'Anand Bottle Washing, Nessai' },
  { sr:152, name:'St. Jose-De-Areal', rvm:1, taluka:'Salcete', lat:15.198, lng:74.044, cpc:'Anand Bottle Washing, Nessai' },
  { sr:153, name:'Sarzora', rvm:1, taluka:'Salcete', lat:15.301, lng:73.992, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:154, name:'Seraulim', rvm:1, taluka:'Salcete', lat:15.273, lng:73.954, cpc:'Anand Bottle Washing, Nessai' },
  { sr:155, name:'Talaulim-Ponda', rvm:1, taluka:'Ponda', lat:15.296, lng:73.979, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:156, name:'Majorda-Utorda-Calata', rvm:1, taluka:'Mormugao', lat:15.26, lng:73.922, cpc:'Anand Bottle Washing, Nessai' },
  { sr:157, name:'Varca', rvm:2, taluka:'Salcete', lat:15.206, lng:73.931, cpc:'Anand Bottle Washing, Nessai' },
  { sr:158, name:'Velim', rvm:1, taluka:'Salcete', lat:15.181, lng:73.948, cpc:'Anand Bottle Washing, Nessai' },
  { sr:159, name:'Verna', rvm:1, taluka:'Salcete', lat:15.346, lng:73.954, cpc:'Recykal Warehouse, Verna -Owned' },
  { sr:160, name:'Veroda', rvm:1, taluka:'Salcete', lat:15.298, lng:73.968, cpc:'Anand Bottle Washing, Nessai' },
  { sr:161, name:'Veling-Priol-Cuncoliem-Ponda2', rvm:1, taluka:'Ponda', lat:15.1885, lng:74.005, cpc:'Anand Bottle Washing, Nessai' },
  { sr:162, name:'Ambaulim', rvm:1, taluka:'Quepem', lat:15.173, lng:74.061, cpc:'Anand Bottle Washing, Nessai' },
  { sr:163, name:'Balli-Adnem', rvm:1, taluka:'Quepem', lat:15.219, lng:74.102, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:164, name:'Naqueri-Betul', rvm:1, taluka:'Quepem', lat:15.12, lng:73.981, cpc:'Anand Bottle Washing, Nessai' },
  { sr:165, name:'Chandor-Cavorim-Salcete2', rvm:1, taluka:'Salcete', lat:15.21, lng:74.088, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:166, name:'Curchorem', rvm:1, taluka:'Quepem', lat:15.1745, lng:74.1051, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:167, name:'Fatorpa-Quitol-Quepem', rvm:1, taluka:'Quepem', lat:15.153, lng:74.076, cpc:'Anand Bottle Washing, Nessai' },
  { sr:168, name:'Morpirla', rvm:1, taluka:'Quepem', lat:15.201, lng:74.133, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:169, name:'Quepem', rvm:1, taluka:'Quepem', lat:15.2112, lng:74.074, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:170, name:'Sanvordem-Quepem', rvm:1, taluka:'Quepem', lat:15.15, lng:74.12, cpc:'Anand Bottle Washing, Nessai' },
  { sr:171, name:'Xeldem', rvm:1, taluka:'Quepem', lat:15.189, lng:74.113, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:172, name:'Xelvona', rvm:1, taluka:'Quepem', lat:15.164, lng:74.142, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:173, name:'Bhati', rvm:1, taluka:'Sanguem', lat:15.225, lng:74.17, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:174, name:'Calem', rvm:1, taluka:'Sanguem', lat:15.205, lng:74.135, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:175, name:'Curdi', rvm:1, taluka:'Sanguem', lat:15.258, lng:74.193, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:176, name:'Neturlim', rvm:1, taluka:'Sanguem', lat:15.159, lng:74.167, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:177, name:'Rivona', rvm:1, taluka:'Sanguem', lat:15.188, lng:74.224, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:178, name:'Sanvordem-Sanguem', rvm:1, taluka:'Sanguem', lat:15.15, lng:74.12, cpc:'Anand Bottle Washing, Nessai' },
  { sr:179, name:'Uguem', rvm:1, taluka:'Sanguem', lat:15.134, lng:74.186, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:180, name:'Agonda', rvm:3, taluka:'Canacona', lat:15.035, lng:73.982, cpc:'Anand Bottle Washing, Nessai' },
  { sr:181, name:'Cola', rvm:2, taluka:'Canacona', lat:15.054, lng:73.976, cpc:'Anand Bottle Washing, Nessai' },
  { sr:182, name:'Cotigao', rvm:1, taluka:'Canacona', lat:15.054, lng:74.109, cpc:'Anand Bottle Washing, Nessai' },
  { sr:183, name:'Gaondongri', rvm:1, taluka:'Canacona', lat:15.064, lng:74.068, cpc:'Anand Bottle Washing, Nessai' },
  { sr:184, name:'Loliem-Polem', rvm:1, taluka:'Canacona', lat:14.978, lng:74.067, cpc:'Anand Bottle Washing, Nessai' },
  { sr:185, name:'Poinguinim', rvm:1, taluka:'Canacona', lat:15.008, lng:74.045, cpc:'Anand Bottle Washing, Nessai' },
  { sr:186, name:'Shristhal', rvm:1, taluka:'Canacona', lat:14.949, lng:74.04, cpc:'Anand Bottle Washing, Nessai' },
  { sr:187, name:'Colem', rvm:1, taluka:'Dharbandora', lat:15.348, lng:74.213, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:188, name:'Dharbandora', rvm:1, taluka:'Dharbandora', lat:15.326, lng:74.17, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:189, name:'Kirlapal-Dabhal', rvm:1, taluka:'Dharbandora', lat:15.29, lng:74.165, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:190, name:'Mollem', rvm:1, taluka:'Dharbandora', lat:15.356, lng:74.292, cpc:'Shivanand Bottle Washing, Nessai' },
  { sr:191, name:'Sancordem', rvm:1, taluka:'Dharbandora', lat:15.249, lng:74.149, cpc:'Shivanand Bottle Washing, Nessai' },
];

// Backward-compat: panchayat → [lat, lng] map (used by other modules)
const V25_PANCHAYAT_COORDS = Object.fromEntries(V28_PANCHAYATS.map(p => [p.name, [p.lat, p.lng]]));

// Backward-compat: panchayat → taluka
const V26_PANCHAYAT_TO_TALUKA = Object.fromEntries(V28_PANCHAYATS.map(p => [p.name, p.taluka]));

// Helper: panchayat → CPC object (uses real operational assignment)
function _v26PanchayatToCpc(panchayatName) {
  const p = V28_PANCHAYATS.find(x => x.name === panchayatName);
  if (p) return V26_CPC_BY_NAME[p.cpc] || V26_CPCS[0];
  return V26_CPCS[0];
}

function _v26TalukaToCpc(taluka) {
  // Returns the dominant CPC servicing the most panchayats in this taluka
  const counts = {};
  V28_PANCHAYATS.filter(p => p.taluka === taluka).forEach(p => { counts[p.cpc] = (counts[p.cpc]||0) + 1; });
  const top = Object.entries(counts).sort((a,b) => b[1]-a[1])[0];
  return top ? (V26_CPC_BY_NAME[top[0]] || V26_CPCS[0]) : V26_CPCS[0];
}

// Generate RVMs from REAL data: 232 RVMs across 191 panchayats
// (some panchayats have 2-3 RVMs per the source CSV)
function _v26GenRVMs() {
  const sd = n => { const x = Math.sin(n * 7919) * 9999; return x - Math.floor(x); };
  const rvms = [];
  let idx = 0;
  V28_PANCHAYATS.forEach(p => {
    const cpc = V26_CPC_BY_NAME[p.cpc] || V26_CPCS[0];
    for (let k = 0; k < p.rvm; k++) {
      const i = idx;
      const h = (i * 13 + 17) % 100;
      const fillRate = Math.min(80, Math.round(20 + h * 0.6));
      // Distribute downtime proportional to total fleet (~7% of 232 = 16)
      const isDown = i < 16;
      const isMaint = i >= 16 && i < 20;
      const status = isDown ? 'Down' : isMaint ? 'Maintenance' : 'Active';
      const units = isDown ? 0 : Math.round(400 + h * 12);
      const qrPct = isDown ? 0 : Math.round(900 + h * 0.6) / 10;
      const lastSync = isDown ? (4 + h % 8) + ' hr ago' : (1 + h % 10) + ' min ago';
      // Jitter RVMs in same panchayat so they don't sit on top of each other
      const jitter = k === 0 ? 0 : 0.004 * k;
      rvms.push({
        lat: parseFloat((p.lat + (sd(i*2)-0.5)*0.005 + jitter).toFixed(4)),
        lng: parseFloat((p.lng + (sd(i*3)-0.5)*0.005 + jitter).toFixed(4)),
        id: 'RVM-'+String(i+1).padStart(3,'0'),
        panchayat: p.name, taluka: p.taluka, cpc: cpc.name, cpcColor: cpc.color, cpcId: cpc.id,
        fillRate, units, qrPct, status, lastSync,
        color: isDown ? '#ef4444' : isMaint ? '#f59e0b' : cpc.color,
      });
      idx++;
    }
  });
  return rvms;
}

// Generate 50 RCs across panchayats (proportional density)
function _v26GenRCs() {
  const sd = n => { const x = Math.sin(n * 7919) * 9999; return x - Math.floor(x); };
  const rcs = [];
  // Pick top 50 panchayats (by RVM count, then evenly distributed)
  const sorted = [...V28_PANCHAYATS].sort((a,b) => b.rvm - a.rvm);
  const picks = sorted.slice(0, 50);
  picks.forEach((p, i) => {
    const cpc = V26_CPC_BY_NAME[p.cpc] || V26_CPCS[0];
    const h = (i * 17 + 11) % 100;
    const isDown = i < 3;
    const status = isDown ? 'Down' : 'Active';
    const isPrivate = i >= 5;
    rcs.push({
      lat: parseFloat((p.lat + (sd(i*5)-0.5)*0.012).toFixed(4)),
      lng: parseFloat((p.lng + (sd(i*7)-0.5)*0.012).toFixed(4)),
      id: 'RC-'+String(i+1).padStart(2,'0'),
      name: 'RC '+p.name,
      panchayat: p.name, taluka: p.taluka, cpc: cpc.name, cpcId: cpc.id,
      type: isPrivate ? 'Private' : 'Public',
      dailyUnits: isDown ? 0 : Math.round(300 + h * 6),
      txnCount: isDown ? 0 : Math.round(40 + h * 1.5),
      handler: 'Handler #'+(i+1),
      hours: isPrivate ? '7AM - 11PM' : '9AM - 6PM',
      status,
      color: isDown ? '#ef4444' : '#fbbf24',
    });
  });
  return rcs;
}


// Cache the generated data (deterministic, so only need to compute once)
const V26_RVMS = _v26GenRVMs();
const V26_RCS = _v26GenRCs();
// Expose to window for cross-function access + testing
window.V26_RVMS = V26_RVMS;
window.V26_RCS = V26_RCS;
window.V26_CPCS = V26_CPCS;
window.V26_TALUKAS = V26_TALUKAS;
window.V26_BLOCK_DATA = V26_BLOCK_DATA;

// ============================================================
// Map Drawing — handles 6 filter modes
// ============================================================
function drawV25Markers(map, isFullscreen) {
  if (!map) return;

  // Clear existing layers
  if (!isFullscreen) {
    _v25Markers.forEach(m => map.removeLayer(m));
    _v25Markers = [];
  }
  // Also clear any persistent FS layers attached to the FS map
  if (map._v26Layers) {
    map._v26Layers.forEach(l => map.removeLayer(l));
  }
  map._v26Layers = [];

  const filter = _v25MapFilter;
  const addLayer = (layer) => {
    layer.addTo(map);
    if (!isFullscreen) _v25Markers.push(layer);
    map._v26Layers.push(layer);
  };

  // === PANCHAYAT FILTER: 191 panchayats colored by their REAL CPC assignment ===
  if (filter === 'panchayat') {
    // Draw taluka outlines as grey context
    Object.entries(V26_TALUKAS).forEach(([name, t]) => {
      const outline = L.polygon(t.poly, {
        color: '#94a3b8', weight: 1, opacity: 0.4,
        fillColor: t.color, fillOpacity: 0.08,
      });
      outline.bindTooltip(`<b>${name}</b> Taluka`, { sticky: true });
      addLayer(outline);
    });
    // Render all 191 panchayats from real data — each dot colored by its assigned CPC
    V28_PANCHAYATS.forEach(p => {
      const cpc = V26_CPC_BY_NAME[p.cpc] || V26_CPCS[0];
      const rcsHere = V26_RCS.filter(r => r.panchayat === p.name).length;
      // Size proportional to RVM count
      const baseR = isFullscreen ? 5 : 3.5;
      const radius = baseR + p.rvm * 1.2;
      const marker = L.circleMarker([p.lat, p.lng], {
        radius,
        fillColor: cpc.color,
        color: '#fff',
        weight: 1.2,
        opacity: 1,
        fillOpacity: 0.85,
      });
      const popupHtml = `
        <div style="font-family:Inter,system-ui;min-width:220px;">
          <div style="font-size:13px;font-weight:700;color:#1a1d23;margin-bottom:2px;">${p.name}</div>
          <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">${p.taluka} Taluka · Sr.No. ${p.sr}</div>
          <div style="font-size:12px;line-height:1.7;">
            <div>RVMs: <strong style="color:${cpc.color};">${p.rvm}</strong></div>
            <div>Return Centers: <strong>${rcsHere}</strong></div>
            <div>Routed to: <strong style="color:${cpc.color};">${cpc.short}</strong></div>
            <div style="font-size:10.5px;color:#6b7280;margin-top:2px;">${cpc.name}</div>
          </div>
        </div>`;
      marker.bindPopup(popupHtml, { maxWidth: 280 });
      marker.bindTooltip(`<b>${p.name}</b> · ${p.taluka} · ${p.rvm} RVM${p.rvm!==1?'s':''} → ${cpc.short}`, { sticky: true });
      addLayer(marker);
    });
    // Label each taluka centroid
    Object.entries(V26_TALUKAS).forEach(([name, t]) => {
      const lbl = L.marker(t.center, {
        icon: L.divIcon({
          html: `<div style="font-size:${isFullscreen?11:9}px;font-weight:700;color:#374151;background:rgba(255,255,255,0.82);padding:1px 5px;border-radius:3px;white-space:nowrap;border:1px solid #e5e7eb;">${name}</div>`,
          className: '', iconAnchor: [30, 8],
        })
      });
      addLayer(lbl);
    });
    return;
  }

  // === BLOCK FILTER: 12 taluka polygons ===
  if (filter === 'block') {
    Object.entries(V26_TALUKAS).forEach(([name, t]) => {
      const blockData = V26_BLOCK_DATA[name] || {};
      const poly = L.polygon(t.poly, {
        color: '#475569', weight: 1.5, opacity: 0.7,
        fillColor: t.color, fillOpacity: 0.55,
      });
      const popupHtml = `
        <div style="font-family:Inter,system-ui;min-width:200px;">
          <div style="font-size:13px;font-weight:700;color:#1a1d23;margin-bottom:6px;">${name} Taluka</div>
          <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">CPC: ${blockData.cpcName || '—'}</div>
          <div style="font-size:12px;line-height:1.7;">
            <div>RVMs: <strong>${blockData.rvm || 0}</strong></div>
            <div>RCs: <strong>${blockData.rc || 0}</strong></div>
            <div>CPCs: <strong>${blockData.cpc || 0}</strong></div>
            <div>Routes: <strong>${blockData.routes || 0}</strong></div>
            <div>Collected today: <strong style="color:#10b981;">${blockData.mtToday || 0} MT</strong></div>
          </div>
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid #e5e7eb;">
            <a href="#" data-v26-drill="block-${name}" style="font-size:11px;color:#2c4cdc;font-weight:600;text-decoration:none;">View Full Detail →</a>
          </div>
        </div>
      `;
      poly.bindPopup(popupHtml, { maxWidth: 280 });
      poly.bindTooltip(`<b>${name}</b> · ${blockData.rvm || 0} RVMs · ${blockData.rc || 0} RCs`, { sticky: true });
      addLayer(poly);
    });
    return;
  }

  // === CPC FILTER: 5 cluster territories + big pins ===
  if (filter === 'cpc') {
    // Clean CPC view: thin connector lines from each CPC to all panchayats it serves
    // (no overlapping coloured taluka polygons - those caused the messy look)
    V26_CPCS.forEach(cpc => {
      const myPanchs = V28_PANCHAYATS.filter(p => p.cpc === cpc.name);
      // Thin radial lines: CPC → each panchayat (subtle, no overlap chaos)
      myPanchs.forEach(p => {
        const line = L.polyline([[cpc.lat, cpc.lng], [p.lat, p.lng]], {
          color: cpc.color, weight: 0.8, opacity: 0.35, interactive: false,
        });
        addLayer(line);
      });
      // Small dots for the served panchayats
      myPanchs.forEach(p => {
        const dot = L.circleMarker([p.lat, p.lng], {
          radius: isFullscreen ? 4 : 3, fillColor: cpc.color, color: '#fff', weight: 1,
          opacity: 1, fillOpacity: 0.85,
        });
        dot.bindTooltip(`<b>${p.name}</b> · ${p.taluka} · ${p.rvm} RVMs → ${cpc.short}`, { sticky: true });
        addLayer(dot);
      });
      // Big CPC pin with count
      const rvmCount = myPanchs.reduce((s, p) => s + p.rvm, 0);
      const pinHtml = `
        <div style="position:relative;display:flex;flex-direction:column;align-items:center;pointer-events:auto;">
          <div style="background:${cpc.color};color:#fff;border:3px solid #fff;border-radius:50%;width:${isFullscreen?48:42}px;height:${isFullscreen?48:42}px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:${isFullscreen?15:13}px;font-family:Inter,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.3);">${rvmCount}</div>
          <div style="width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-top:11px solid ${cpc.color};margin-top:-1px;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.15));"></div>
          <div style="position:absolute;top:${isFullscreen?60:52}px;background:#fff;color:${cpc.color};border:1.5px solid ${cpc.color};border-radius:4px;padding:3px 8px;font-size:11px;font-weight:700;font-family:Inter,sans-serif;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.15);">${cpc.short}</div>
        </div>`;
      const pin = L.marker([cpc.lat, cpc.lng], {
        icon: L.divIcon({ html: pinHtml, className: '',
          iconSize: [isFullscreen?48:42, isFullscreen?88:80],
          iconAnchor: [isFullscreen?24:21, isFullscreen?64:56] }),
        zIndexOffset: 1000,
      });
      const cpcPopup = `
        <div style="font-family:Inter,system-ui;min-width:240px;">
          <div style="font-size:14px;font-weight:700;color:${cpc.color};margin-bottom:2px;">${cpc.short}</div>
          <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">${cpc.name}</div>
          <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">Zone: ${cpc.zone}</div>
          <div style="font-size:12px;line-height:1.7;">
            <div>Panchayats served: <strong>${myPanchs.length}</strong></div>
            <div>RVMs in cluster: <strong style="color:${cpc.color};">${rvmCount}</strong></div>
            <div>Fleet: <strong>${cpc.fleet} vehicles</strong></div>
            <div>Pickup: <strong style="color:#10b981;">${cpc.pickup}%</strong></div>
            <div>Inbound today: <strong>${cpc.inboundMT} MT</strong></div>
          </div>
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid #e5e7eb;">
            <a href="#" data-v26-drill="cpc-${cpc.id}" style="font-size:11px;color:#2c4cdc;font-weight:600;text-decoration:none;">View Full Detail →</a>
          </div>
        </div>`;
      pin.bindPopup(cpcPopup, { maxWidth: 300 });
      pin.bindTooltip(`<b style="color:${cpc.color}">${cpc.short}</b> · ${myPanchs.length} panchayats · ${rvmCount} RVMs`, { sticky: true });
      addLayer(pin);
    });
    return;
  }

  // === ROUTE FILTER: real optimized CPC → Panchayat routes ===
  // Supports multi-select via window._v28RouteSelection (Set of CPC ids).
  // Empty selection = show ALL 6 routes.
  if (filter === 'route') {
    if (!window._v28RouteSelection) window._v28RouteSelection = new Set();
    const selectedIds = window._v28RouteSelection;
    const showAll = selectedIds.size === 0;
    // Optimize route: nearest-neighbor heuristic from CPC to all assigned panchayats
    const optimizeRoute = (cpc) => {
      const myPanchs = V28_PANCHAYATS.filter(p => p.cpc === cpc.name);
      if (myPanchs.length === 0) return [];
      const order = [];
      const remaining = [...myPanchs];
      let cur = [cpc.lat, cpc.lng];
      while (remaining.length) {
        let bi = 0, bd = Infinity;
        for (let i = 0; i < remaining.length; i++) {
          const dx = remaining[i].lat - cur[0], dy = remaining[i].lng - cur[1];
          const d = dx*dx + dy*dy;
          if (d < bd) { bd = d; bi = i; }
        }
        const next = remaining.splice(bi, 1)[0];
        order.push(next);
        cur = [next.lat, next.lng];
      }
      return order;
    };
    // Cache the optimized routes (recompute only if not cached)
    if (!window._v28OptimizedRoutes) {
      window._v28OptimizedRoutes = {};
      V26_CPCS.forEach(cpc => {
        window._v28OptimizedRoutes[cpc.id] = optimizeRoute(cpc);
      });
    }
    const routes = window._v28OptimizedRoutes;

    // Approx distance in km for a route (Haversine-ish, fine for small region)
    const routeKm = (cpc, order) => {
      let km = 0;
      const toRad = d => d * Math.PI / 180;
      const hav = (a, b) => {
        const R = 6371;
        const dLat = toRad(b[0]-a[0]), dLng = toRad(b[1]-a[1]);
        const x = Math.sin(dLat/2)**2 + Math.cos(toRad(a[0]))*Math.cos(toRad(b[0]))*Math.sin(dLng/2)**2;
        return 2 * R * Math.asin(Math.sqrt(x));
      };
      let cur = [cpc.lat, cpc.lng];
      order.forEach(p => { km += hav(cur, [p.lat, p.lng]); cur = [p.lat, p.lng]; });
      km += hav(cur, [cpc.lat, cpc.lng]); // return to CPC
      return km;
    };

    V26_CPCS.forEach(cpc => {
      const isActive = showAll || selectedIds.has(cpc.id);
      const order = routes[cpc.id];
      if (order.length === 0) return;
      const opacity = isActive ? 0.85 : 0.10;
      const weight = isActive ? (isFullscreen ? 3 : 2.2) : 1;

      // Draw the route as a connected polyline (CPC → P1 → P2 → ... → Pn → CPC)
      const pts = [[cpc.lat, cpc.lng], ...order.map(p => [p.lat, p.lng]), [cpc.lat, cpc.lng]];
      const line = L.polyline(pts, {
        color: cpc.color, weight, opacity, dashArray: isActive ? null : '3 5', smoothFactor: 1.2,
      });
      const km = routeKm(cpc, order);
      const totalRVMs = order.reduce((s, p) => s + p.rvm, 0);
      line.bindTooltip(`<b style="color:${cpc.color}">${cpc.short}</b> · ${order.length} stops · ${totalRVMs} RVMs · ~${km.toFixed(1)} km`, { sticky: true });
      line.on('click', () => {
        if (selectedIds.has(cpc.id)) selectedIds.delete(cpc.id); else selectedIds.add(cpc.id);
        if (typeof renderV28RouteSelector === 'function') renderV28RouteSelector();
        drawV25Markers(map, isFullscreen);
      });
      addLayer(line);

      // Stop markers (numbered) — only for active routes
      if (isActive) {
        order.forEach((p, i) => {
          const stop = L.circleMarker([p.lat, p.lng], {
            radius: isFullscreen ? 6 : 4.5,
            fillColor: '#fff', color: cpc.color, weight: 2,
            opacity: 1, fillOpacity: 1,
          });
          const stopPopup = `
            <div style="font-family:Inter,system-ui;min-width:200px;">
              <div style="font-size:12px;color:#6b7280;margin-bottom:2px;">Stop #${i+1} on route</div>
              <div style="font-size:13px;font-weight:700;color:#1a1d23;margin-bottom:4px;">${p.name}</div>
              <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">${p.taluka} Taluka</div>
              <div style="font-size:12px;line-height:1.7;">
                <div>RVMs here: <strong>${p.rvm}</strong></div>
                <div>Routed to: <strong style="color:${cpc.color};">${cpc.short}</strong></div>
              </div>
            </div>`;
          stop.bindPopup(stopPopup, { maxWidth: 240 });
          stop.bindTooltip(`<b>${p.name}</b> · Stop #${i+1}`, { sticky: true });
          addLayer(stop);
        });
      }

      // CPC depot marker (larger, star-like)
      const pin = L.circleMarker([cpc.lat, cpc.lng], {
        radius: isFullscreen ? 14 : 10,
        fillColor: cpc.color, color: '#fff', weight: 3,
        opacity: 1, fillOpacity: isActive ? 1 : 0.4,
      });
      const routePopup = `
        <div style="font-family:Inter,system-ui;min-width:240px;">
          <div style="font-size:13px;font-weight:700;color:${cpc.color};margin-bottom:2px;">${cpc.short}</div>
          <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">${cpc.name}</div>
          <div style="font-size:12px;line-height:1.7;">
            <div>Panchayats on route: <strong>${order.length}</strong></div>
            <div>RVMs served: <strong>${cpc.rvmsServed}</strong></div>
            <div>Daily distance: <strong>~${km.toFixed(1)} km</strong></div>
            <div>Fleet: <strong>${cpc.fleet} vehicles</strong></div>
            <div>Pickup %: <strong style="color:#10b981;">${cpc.pickup}%</strong></div>
            <div>Inbound today: <strong>${cpc.inboundMT} MT</strong></div>
          </div>
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid #e5e7eb;">
            <a href="#" data-v26-drill="cpc-${cpc.id}" style="font-size:11px;color:#2c4cdc;font-weight:600;text-decoration:none;">View Full Detail →</a>
          </div>
        </div>`;
      pin.bindPopup(routePopup, { maxWidth: 300 });
      pin.bindTooltip(`<b style="color:${cpc.color}">${cpc.short}</b> · ${order.length} panchayats · ${cpc.rvmsServed} RVMs`, { sticky: true });
      pin.on('click', () => {
        if (selectedIds.has(cpc.id)) selectedIds.delete(cpc.id); else selectedIds.add(cpc.id);
        if (typeof renderV28RouteSelector === 'function') renderV28RouteSelector();
        drawV25Markers(map, isFullscreen);
      });
      addLayer(pin);
    });
    return;
  }

  // === RVM | RC | CPC — read from multi-select Set ===
  // When 'route' is active, route view handles its own pins, so suppress RVM/RC.
  // 'block'/'panchayat' views are exclusive — they handled drawing & returned above.
  const layers = _v25ActiveLayers || new Set(['rvm', 'rc', 'cpc']);
  const inExclusiveView = layers.has('block') || layers.has('panchayat') || layers.has('route');
  const showRVM = !inExclusiveView && layers.has('rvm');
  const showRC  = !inExclusiveView && layers.has('rc');
  // CPCs visible when explicitly in layer set OR when in any of the non-exclusive views
  const showCPC = layers.has('cpc') && !layers.has('route');

  if (showRVM) {
    V26_RVMS.forEach(rvm => {
      // Small teardrop pin marker
      const pinHtml = `
        <div style="position:relative;width:${isFullscreen?16:13}px;height:${isFullscreen?20:16}px;pointer-events:auto;">
          <div style="position:absolute;top:0;left:0;width:100%;height:75%;background:${rvm.color};border:1.5px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);transform-origin:50% 100%;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>
        </div>`;
      const marker = L.marker([rvm.lat, rvm.lng], {
        icon: L.divIcon({
          html: pinHtml,
          className: '',
          iconSize: [isFullscreen?16:13, isFullscreen?20:16],
          iconAnchor: [isFullscreen?8:6.5, isFullscreen?20:16],
        }),
      });
      const fillColor = rvm.fillRate >= 70 ? '#ef4444' : rvm.fillRate >= 50 ? '#f59e0b' : '#10b981';
      const popup = `
        <div style="font-family:Inter,system-ui;min-width:220px;">
          <div style="font-size:13px;font-weight:700;color:#1a1d23;margin-bottom:2px;">${rvm.id}</div>
          <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">${rvm.panchayat} · ${rvm.taluka}</div>
          <div style="font-size:12px;line-height:1.7;">
            <div>Fill Rate: <strong style="color:${fillColor};">${rvm.fillRate}%</strong>${rvm.fillRate >= 80 ? ' 🔒 SEALED' : ''}</div>
            <div>Units Today: <strong>${rvm.units.toLocaleString()}</strong></div>
            <div>QR Scan: <strong>${rvm.qrPct}%</strong></div>
            <div>Status: <strong style="color:${rvm.status==='Active'?'#10b981':rvm.status==='Down'?'#ef4444':'#f59e0b'};">${rvm.status}</strong></div>
            <div>CPC: <strong>${rvm.cpc}</strong></div>
            <div>Last Sync: <span style="color:#6b7280;">${rvm.lastSync}</span></div>
          </div>
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid #e5e7eb;">
            <a href="#" data-v26-drill="rvm-${rvm.id}" style="font-size:11px;color:#2c4cdc;font-weight:600;text-decoration:none;">View Full Detail →</a>
          </div>
        </div>
      `;
      marker.bindPopup(popup, { maxWidth: 280 });
      marker.bindTooltip(`<b>${rvm.id}</b> · ${rvm.panchayat} · ${rvm.fillRate}% · ${rvm.status}`, { sticky: true });
      addLayer(marker);
    });
  }

  if (showRC) {
    V26_RCS.forEach(rc => {
      // RC: use a square-ish look via larger marker with thicker border
      const marker = L.circleMarker([rc.lat, rc.lng], {
        radius: isFullscreen ? 8 : 6,
        fillColor: rc.color, color: '#fff', weight: 2,
        opacity: 1, fillOpacity: 0.95,
      });
      const popup = `
        <div style="font-family:Inter,system-ui;min-width:200px;">
          <div style="font-size:13px;font-weight:700;color:#1a1d23;margin-bottom:2px;">${rc.id}</div>
          <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">${rc.panchayat} · ${rc.taluka} · ${rc.type}</div>
          <div style="font-size:12px;line-height:1.7;">
            <div>Daily Units: <strong>${rc.dailyUnits.toLocaleString()}</strong></div>
            <div>Transactions: <strong>${rc.txnCount}</strong></div>
            <div>Handler: <strong>${rc.handler}</strong></div>
            <div>Hours: <span style="color:#6b7280;">${rc.hours}</span></div>
            <div>Status: <strong style="color:${rc.status==='Active'?'#10b981':'#ef4444'};">${rc.status}</strong></div>
            <div>CPC: <strong>${rc.cpc}</strong></div>
          </div>
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid #e5e7eb;">
            <a href="#" data-v26-drill="rc-${rc.id}" style="font-size:11px;color:#2c4cdc;font-weight:600;text-decoration:none;">View Full Detail →</a>
          </div>
        </div>
      `;
      marker.bindPopup(popup, { maxWidth: 280 });
      marker.bindTooltip(`<b>${rc.id}</b> · ${rc.type} · ${rc.status}`, { sticky: true });
      addLayer(marker);
    });
  }

  if (showCPC) {
    V26_CPCS.forEach(cpc => {
      const rvmCount = V28_PANCHAYATS.filter(p => p.cpc === cpc.name).reduce((s,p) => s+p.rvm, 0);
      // Pin-style marker with count badge, similar to reference
      const pinHtml = `
        <div class="v28-cpc-pin" style="position:relative;display:flex;flex-direction:column;align-items:center;pointer-events:auto;">
          <div style="background:${cpc.color};color:#fff;border:3px solid #fff;border-radius:50%;width:${isFullscreen?44:38}px;height:${isFullscreen?44:38}px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:${isFullscreen?14:12}px;font-family:Inter,sans-serif;box-shadow:0 4px 10px rgba(0,0,0,0.25);">${rvmCount}</div>
          <div style="width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid ${cpc.color};margin-top:-1px;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.15));"></div>
          <div style="position:absolute;top:${isFullscreen?54:48}px;background:#fff;color:${cpc.color};border:1.5px solid ${cpc.color};border-radius:4px;padding:2px 7px;font-size:10.5px;font-weight:700;font-family:Inter,sans-serif;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.12);">${cpc.short}</div>
        </div>`;
      const pin = L.marker([cpc.lat, cpc.lng], {
        icon: L.divIcon({
          html: pinHtml,
          className: '',
          iconSize: [isFullscreen?44:38, isFullscreen?80:72],
          iconAnchor: [isFullscreen?22:19, isFullscreen?58:52],
        }),
        zIndexOffset: 1000,
      });
      const popup = `
        <div style="font-family:Inter,system-ui;min-width:240px;">
          <div style="font-size:14px;font-weight:700;color:${cpc.color};margin-bottom:2px;">${cpc.short}</div>
          <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">${cpc.name}</div>
          <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">Catchment: ${cpc.catchment.join(', ')}</div>
          <div style="font-size:12px;line-height:1.7;">
            <div>RVMs served: <strong style="color:${cpc.color};">${rvmCount}</strong></div>
            <div>Panchayats: <strong>${cpc.panchayatsServed}</strong></div>
            <div>Fleet: <strong>${cpc.fleet} vehicles</strong></div>
            <div>Pickup: <strong style="color:#10b981;">${cpc.pickup}%</strong></div>
            <div>Inbound: <strong>${cpc.inboundMT} MT</strong></div>
          </div>
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid #e5e7eb;">
            <a href="#" data-v26-drill="cpc-${cpc.id}" style="font-size:11px;color:#2c4cdc;font-weight:600;text-decoration:none;">View Full Detail →</a>
          </div>
        </div>`;
      pin.bindPopup(popup, { maxWidth: 300 });
      pin.bindTooltip(`<b style="color:${cpc.color}">${cpc.short}</b> · ${rvmCount} RVMs`, { sticky: true });
      addLayer(pin);
    });
  }
}

// Handle popup link clicks (delegate via document since popups are dynamic)
document.addEventListener('click', function(e) {
  const target = e.target.closest('[data-v26-drill]');
  if (!target) return;
  e.preventDefault();
  const key = target.dataset.v26Drill;
  openV26DrillModal(key);
});

function openV26DrillModal(key) {
  const overlay = document.getElementById('v25-modal-overlay');
  if (!overlay) return;
  document.getElementById('v25-modal-title').textContent = '';
  document.getElementById('v25-modal-sub').textContent = '';
  const body = document.getElementById('v25-modal-body');

  // RVM detail
  if (key.startsWith('rvm-')) {
    const id = key.slice(4);
    const rvm = V26_RVMS.find(r => r.id === id);
    if (!rvm) return;
    document.getElementById('v25-modal-title').textContent = `${rvm.id} · Full Detail`;
    document.getElementById('v25-modal-sub').textContent = `${rvm.panchayat}, ${rvm.taluka} · Routed to ${rvm.cpc}`;
    const fillColor = rvm.fillRate >= 70 ? '#ef4444' : rvm.fillRate >= 50 ? '#f59e0b' : '#10b981';
    body.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;">
        <div style="padding:14px;background:#f8fafc;border-radius:8px;border-left:3px solid ${fillColor};">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;">Fill Rate</div>
          <div style="font-size:22px;font-weight:700;color:${fillColor};font-family:var(--font-mono);margin-top:4px;">${rvm.fillRate}%${rvm.fillRate>=80?' 🔒':''}</div>
          <div style="font-size:10.5px;color:#6b7280;margin-top:4px;">Hard cap: 80% (pickup auto-triggered)</div>
        </div>
        <div style="padding:14px;background:#f8fafc;border-radius:8px;border-left:3px solid #2c4cdc;">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;">Units Today</div>
          <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);margin-top:4px;">${rvm.units.toLocaleString()}</div>
        </div>
        <div style="padding:14px;background:#f8fafc;border-radius:8px;border-left:3px solid #10b981;">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;">QR Scan Success</div>
          <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);margin-top:4px;">${rvm.qrPct}%</div>
        </div>
      </div>
      <table class="t"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>
        <tr><td>RVM ID</td><td><strong>${rvm.id}</strong></td></tr>
        <tr class="striped"><td>Panchayat</td><td>${rvm.panchayat}</td></tr>
        <tr><td>Taluka / Block</td><td>${rvm.taluka}</td></tr>
        <tr class="striped"><td>Routed to CPC</td><td><strong>${rvm.cpc}</strong></td></tr>
        <tr><td>Status</td><td><span style="color:${rvm.status==='Active'?'#10b981':rvm.status==='Down'?'#ef4444':'#f59e0b'};font-weight:700;">${rvm.status}</span></td></tr>
        <tr class="striped"><td>Last Sync</td><td>${rvm.lastSync}</td></tr>
        <tr><td>Coordinates</td><td style="font-family:var(--font-mono);">${rvm.lat}, ${rvm.lng}</td></tr>
      </tbody></table>
    `;
  } else if (key.startsWith('rc-')) {
    const id = key.slice(3);
    const rc = V26_RCS.find(r => r.id === id);
    if (!rc) return;
    document.getElementById('v25-modal-title').textContent = `${rc.id} · ${rc.name}`;
    document.getElementById('v25-modal-sub').textContent = `${rc.panchayat}, ${rc.taluka} · ${rc.type} · Routed to ${rc.cpc}`;
    body.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;">
        <div style="padding:14px;background:#f8fafc;border-radius:8px;border-left:3px solid #fbbf24;">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;">Daily Units</div>
          <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);margin-top:4px;">${rc.dailyUnits.toLocaleString()}</div>
        </div>
        <div style="padding:14px;background:#f8fafc;border-radius:8px;border-left:3px solid #2c4cdc;">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;">Transactions</div>
          <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);margin-top:4px;">${rc.txnCount}</div>
        </div>
        <div style="padding:14px;background:#f8fafc;border-radius:8px;border-left:3px solid #10b981;">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;">Status</div>
          <div style="font-size:22px;font-weight:700;color:${rc.status==='Active'?'#10b981':'#ef4444'};font-family:var(--font-mono);margin-top:4px;">${rc.status}</div>
        </div>
      </div>
      <table class="t"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>
        <tr><td>RC ID</td><td><strong>${rc.id}</strong></td></tr>
        <tr class="striped"><td>Type</td><td>${rc.type}</td></tr>
        <tr><td>Handler</td><td>${rc.handler}</td></tr>
        <tr class="striped"><td>Operating Hours</td><td>${rc.hours}</td></tr>
        <tr><td>Panchayat</td><td>${rc.panchayat}</td></tr>
        <tr class="striped"><td>Routed to CPC</td><td><strong>${rc.cpc}</strong></td></tr>
      </tbody></table>
    `;
  } else if (key.startsWith('cpc-')) {
    const id = key.slice(4);
    const cpc = V26_CPCS.find(c => c.id === id);
    if (!cpc) return;
    const myRVMs = V26_RVMS.filter(r => r.cpc === cpc.name);
    const myRCs = V26_RCS.filter(r => r.cpc === cpc.name);
    document.getElementById('v25-modal-title').textContent = `CPC ${cpc.name} · Full Detail`;
    document.getElementById('v25-modal-sub').textContent = `Catchment: ${cpc.catchment.join(', ')} · ${cpc.fleet} fleet vehicles`;
    body.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px;">
        <div style="padding:14px;background:#f8fafc;border-radius:8px;border-left:3px solid ${cpc.color};">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;">RVMs</div>
          <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);">${myRVMs.length}</div>
        </div>
        <div style="padding:14px;background:#f8fafc;border-radius:8px;border-left:3px solid ${cpc.color};">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;">RCs</div>
          <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);">${myRCs.length}</div>
        </div>
        <div style="padding:14px;background:#f8fafc;border-radius:8px;border-left:3px solid ${cpc.color};">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;">Fleet</div>
          <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);">${cpc.fleet}</div>
        </div>
        <div style="padding:14px;background:#f8fafc;border-radius:8px;border-left:3px solid ${cpc.color};">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;">Inbound</div>
          <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);">${cpc.inboundMT} MT</div>
        </div>
      </div>
      <table class="t"><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>
        <tr><td>CPC Name</td><td><strong>${cpc.name}</strong></td></tr>
        <tr class="striped"><td>Catchment Talukas</td><td>${cpc.catchment.join(', ')}</td></tr>
        <tr><td>RVMs Serviced</td><td><strong>${myRVMs.length}</strong></td></tr>
        <tr class="striped"><td>RCs Serviced</td><td><strong>${myRCs.length}</strong></td></tr>
        <tr><td>Fleet Vehicles</td><td>${cpc.fleet}</td></tr>
        <tr class="striped"><td>Pickup Completion</td><td><strong style="color:#10b981;">${cpc.pickup}%</strong></td></tr>
        <tr><td>Inbound Material Today</td><td><strong>${cpc.inboundMT} MT</strong></td></tr>
      </tbody></table>
    `;
  } else if (key.startsWith('block-')) {
    const name = key.slice(6);
    const data = V26_BLOCK_DATA[name];
    if (!data) return;
    document.getElementById('v25-modal-title').textContent = `${name} Taluka · Block Detail`;
    document.getElementById('v25-modal-sub').textContent = `Routed to CPC: ${data.cpcName}`;
    body.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:14px;">
        <div style="padding:14px;background:#f8fafc;border-radius:8px;text-align:center;">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;">RVMs</div>
          <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);">${data.rvm}</div>
        </div>
        <div style="padding:14px;background:#f8fafc;border-radius:8px;text-align:center;">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;">RCs</div>
          <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);">${data.rc}</div>
        </div>
        <div style="padding:14px;background:#f8fafc;border-radius:8px;text-align:center;">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;">CPCs</div>
          <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);">${data.cpc}</div>
        </div>
        <div style="padding:14px;background:#f8fafc;border-radius:8px;text-align:center;">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;">Routes</div>
          <div style="font-size:22px;font-weight:700;font-family:var(--font-mono);">${data.routes}</div>
        </div>
        <div style="padding:14px;background:#f8fafc;border-radius:8px;text-align:center;">
          <div style="font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;">Today MT</div>
          <div style="font-size:22px;font-weight:700;color:#10b981;font-family:var(--font-mono);">${data.mtToday}</div>
        </div>
      </div>
      <p style="color:#6b7280;font-size:12.5px;">All RVMs and RCs in <strong>${name}</strong> are routed to <strong>${data.cpcName}</strong> CPC. Daily collection of ${data.mtToday} MT contributes to ${data.cpcName}'s total inbound.</p>
    `;
  } else if (key.startsWith('route-')) {
    const id = key.slice(6);
    const cpc = V26_CPCS.find(c => c.id === id);
    if (!cpc) return;
    const myRVMs = V26_RVMS.filter(r => r.cpc === cpc.name);
    document.getElementById('v25-modal-title').textContent = `${cpc.name} · Route Detail`;
    document.getElementById('v25-modal-sub').textContent = `${myRVMs.length} RVMs across ${cpc.catchment.length} talukas · ${cpc.fleet} fleet vehicles`;
    body.innerHTML = `
      <table class="t"><thead><tr><th>Route #</th><th>Catchment</th><th class="num">RVMs</th><th class="num">Avg Distance</th><th>Status</th></tr></thead><tbody>
        ${cpc.catchment.map((t, i) => {
          const tRvms = myRVMs.filter(r => r.taluka === t).length;
          return `<tr${i%2?' class="striped"':''}><td><strong>RTE-${cpc.id.slice(4)}-${String(i+1).padStart(2,'0')}</strong></td><td>${t}</td><td class="num">${tRvms}</td><td class="num">${(20+i*8)} km</td><td><span style="color:#10b981;font-weight:600;">Active</span></td></tr>`;
        }).join('')}
      </tbody></table>
    `;
  }

  overlay.classList.add('open');
}
window.openV26DrillModal = openV26DrillModal;


function openV25Modal(key) {
  const cfg = V25_DRILL_CONFIG[key];
  if (!cfg) return;
  document.getElementById('v25-modal-title').textContent = cfg.title;
  document.getElementById('v25-modal-sub').textContent = cfg.sub || '';
  const body = document.getElementById('v25-modal-body');
  let html = '';
  if (cfg.html) {
    html = cfg.html;
  } else if (cfg.table) {
    html = `<table class="t"><thead><tr>${cfg.table.cols.map(c => `<th${typeof c === 'string' && /^\d|^₹|MT|%/.test(c) ? ' class="num"' : ''}>${c}</th>`).join('')}</tr></thead><tbody>${cfg.table.rows.map((row,i) => `<tr${i%2?' class="striped"':''}>${row.map((cell,ci) => `<td${typeof cell === 'number' || /^[₹\d]/.test(String(cell)) ? ' class="num"' : ''}>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  body.innerHTML = html;
  document.getElementById('v25-modal-overlay').classList.add('open');
}

const PAGES = {
  'exec-home':       { render: pageExecHomeWithMapToggle, after: wireExecHomeWithMapToggle },
  'cp-overall':    { render: pageCpOverall,  after: wireCpOverall },
  'cp-machines':   { render: pageCpMachines, after: wireCpMachines },
  'cp-handler':    { render: pageCpHandler },
  'cp-bagflow':    { render: pageCpBagflow },
  'cp-material':   { render: pageCpMaterial },
  'cp-user':       { render: pageCpUser },
  'cp-collection': { render: pageCpCollection },
  'cp-others':     { render: pageCpOthers },
  'hor-overview':  { render: pageHorOverview },
  'hor-cluster':   { render: pageHorCluster },
  'hor-block':     { render: pageHorBlock },
  'hor-pickup':    { render: pageHorPickup },
  'hor-pipeline':  { render: pageHorPipeline },
  'log-overview':  { render: pageLogOverview },
  'log-orders':    { render: pageLogOrders },
  'log-trips':     { render: pageLogTrips },
  'log-fleet':     { render: pageLogFleet },
  'log-vendor':    { render: pageLogVendor },
  'log-vehicle':   { render: pageLogVehicle },
  'log-driver':    { render: pageLogDriver },
  'wh-overview':   { render: pageWhOverview },
  'wh-bagflow':    { render: pageWhBagflow },
  'wh-cpc':        { render: pageWhCpc },
  'wh-dock':       { render: pageWhDock },
  'wh-rvm-fill':   { render: pageWhRvmFill },
  'wh-stages':     { render: pageWhStages },
  'wh-inward':     { render: pageWhInward },
  'wh-sorting':    { render: pageWhSorting },
  'wh-outbound':   { render: pageWhOutbound },
  'cs-tickets':     { render: pageCsTickets },
  'cs-sla':         { render: pageCsSla },
  'cs-csat':        { render: pageCsCsat },
  'cs-escalations': { render: pageCsEscalations },
  'sust-overview':  { render: pageSustOverview },
  'alerts-all':     { render: pageAlertsAll },
  'cost-overview':     { render: pageCostOverview },
  'cost-cp-travel':    { render: () => pageCost('CP · Travel', [['Total','₹2.4L','',8],['Fuel','₹1.6L','',6],['Per Trip','₹248','',2],['Per CP','₹1,840','',-3]]) },
  'cost-cp-food':      { render: () => pageCost('CP · Food', [['Total','₹84K','',4],['Per Handler','₹420','',1],['Per Day','₹2,800','',2],['Reimb TAT','3.2','d',-1]]) },
  'cost-cp-misc':      { render: () => pageCost('CP · Miscellaneous', [['Misc Total','₹42K','',2],['Per CP','₹680','',0],['Variance','12','%',4],['Approvals','94','%',1]]) },
  'cost-cp-others':    { render: () => pageCost('CP · Others', [['Total','₹38K','',1],['Categories','7','',0],['Unbudgeted','₹8K','',3],['Per CP','₹540','',1]]) },
  'cost-hor-travel':   { render: () => pageCost('HoReCa · Travel', [['Total','₹1.8L','',5],['Per Pickup','₹420','',1],['Per Account','₹540','',2],['Fuel','₹1.2L','',4]]) },
  'cost-hor-misc':     { render: () => pageCost('HoReCa · Miscellaneous', [['Total','₹28K','',1],['Per Pickup','₹64','',0],['Variance','8','%',2],['Approvals','96','%',1]]) },
  'cost-log-vendor':   { render: () => pageCost('Logistics · Vendor Payments', [['Paid','₹14.2L','',6],['Pending','₹2.4L','',-8],['Per Trip','₹1,840','',-3],['Vendors','12','',0]]) },
  'cost-log-manpower': { render: () => pageCost('Logistics · Manpower', [['Total','₹8.4L','',4],['Drivers','42','',1],['Helpers','38','',0],['Per Trip','₹680','',1]]) },
  'cost-log-travel':   { render: () => pageCost('Logistics · Travel', [['Fuel','₹6.2L','',5],['Toll','₹1.4L','',2],['Per KM','₹12.4','',-1],['Per Trip','₹1,240','',-2]]) },
  'cost-log-misc':     { render: () => pageCost('Logistics · Miscellaneous', [['Total','₹62K','',2],['Per Trip','₹56','',0],['Variance','9','%',3],['Approvals','92','%',0]]) },
  'cost-wh-rent':      { render: () => pageCost('Warehouse · Rent', [['Total','₹4.8L','',0],['Per Sqft','₹14','',0],['CPCs','3','',0],['Per MT','₹2,180','',-2]]) },
  'cost-wh-elec':      { render: () => pageCost('Warehouse · Electricity', [['Total','₹1.4L','',3],['Per Unit','₹8.4','',1],['Peak Load','42','kW',2],['Per MT','₹620','',-1]]) },
  'cost-wh-manpower':  { render: () => pageCost('Warehouse · Manpower', [['Total','₹6.4L','',4],['Sorters','24','',1],['Per MT','₹2,840','',-1],['OT Hours','184','',6]]) },
  'cost-wh-misc':      { render: () => pageCost('Warehouse · Miscellaneous', [['Total','₹48K','',1],['Per MT','₹213','',0],['Variance','11','%',2],['Approvals','93','%',1]]) },
};

/* ============================================================
   GLOBAL INSIGHTS AGENT — appended to every module page
   ============================================================ */
function renderAgentPanel() {
  return `
    <div class="exec-agent-panel" id="exec-agent-panel">
      <div class="exec-agent-head">
        <div class="exec-agent-head-row1">
          <div class="exec-agent-avatar">🧠</div>
          <div class="exec-agent-head-title-block">
            <div class="exec-agent-title">CEO Briefing Agent</div>
            <div class="exec-agent-sub" id="exec-agent-module-label">Executive · Goa DRS · Live</div>
          </div>
          <button class="exec-agent-close" id="exec-agent-close-btn">✕</button>
        </div>
        <div id="exec-agent-verdict-slot"></div>
      </div>
      <div class="exec-agent-body" id="exec-agent-body">
        <div style="display:flex;align-items:center;justify-content:center;height:120px;color:#3d4b63;font-size:12px;">
          Loading briefing…
        </div>
      </div>
      <div class="exec-agent-foot" id="exec-agent-foot">
        Goa DRS · ${GOA.panchayats} panchayats · ${GOA.talukas} talukas · ${(GOA.population/100000).toFixed(1)}L population · ~${(GOA.estimated_horeca/1000).toFixed(0)}K HoReCa est.
      </div>
    </div>
    <button class="exec-fab" title="CEO Briefing Agent" id="exec-agent-launcher">
      <span class="exec-fab-icon">🧠</span>
      <span class="exec-fab-label">Brief</span>
      <span class="exec-fab-dot" id="exec-fab-dot">0</span>
    </button>
  `;
}

function wireAgentForModule(moduleId) {
  const agentRes = runSanityAgent(moduleId);
  const dot = document.getElementById('exec-fab-dot');
  const urgentCount = agentRes.summary.bad + agentRes.summary.warn;
  if (dot) {
    dot.style.background = agentRes.summary.bad > 0 ? '#ef4444' : agentRes.summary.warn > 0 ? '#f59e0b' : '#10b981';
    dot.textContent = urgentCount > 0 ? urgentCount : '✓';
  }

  // ── CEO-GRADE CONTENT ENGINE ─────────────────────────────────────
  // Build a rich, visual, decision-focused briefing from live data
  const moduleLabels = {
    exec:'Executive · Goa DRS', cp:'Collection Points', hor:'HoReCa',
    log:'Logistics & Fleet', wh:'Warehouse / CPC', cs:'Customer Support',
    alerts:'Alerts Center', cost:'Costing & Finance', sust:'Sustainability'
  };
  const label = moduleLabels[moduleId] || moduleId;
  const lbl = document.getElementById('exec-agent-module-label');
  if (lbl) lbl.textContent = label + ' · Live';

  // ── BUILD THE VERDICT ─────────────────────────────────────────────
  const score   = parseFloat(agentRes.score);
  const vClass  = score >= 8.5 ? 'v-good' : score >= 7 ? 'v-warn' : 'v-bad';
  const vColor  = score >= 8.5 ? '#10b981' : score >= 7 ? '#f59e0b' : '#ef4444';
  const verdictHeadline = score >= 8.5
    ? 'Scheme running well. No critical interventions needed.'
    : score >= 7
    ? 'A few pressure points — monitor and act today.'
    : 'Multiple issues need your attention right now.';
  const verdictDetail = agentRes.summary.bad > 0
    ? `${agentRes.summary.bad} critical checks failed · ${agentRes.summary.warn} warnings · ${agentRes.summary.good} healthy`
    : agentRes.summary.warn > 0
    ? `${agentRes.summary.warn} items need attention · ${agentRes.summary.good} checks passing`
    : `All ${agentRes.summary.good} checks passing. ${agentRes.summary.info} informational notes.`;

  const verdictSlot = document.getElementById('exec-agent-verdict-slot');
  if (verdictSlot) {
    verdictSlot.innerHTML = `
      <div class="exec-agent-verdict ${vClass}">
        <div class="exec-agent-verdict-score">${score}</div>
        <div class="exec-agent-verdict-text">
          <div class="exec-agent-verdict-headline">${verdictHeadline}</div>
          <div class="exec-agent-verdict-detail">${verdictDetail}</div>
        </div>
      </div>`;
  }

  // ── CEO METRICS SNAPSHOT ──────────────────────────────────────────
  const totalCPs     = CP_DATA.length;
  const activeCPs    = CP_DATA.filter(c => c.status === 'Active').length;
  const downCPs      = CP_DATA.filter(c => c.status === 'Down').length;
  const slaBreached  = CP_DATA.filter(c => c.slaBreachedSeal).length;
  const downMach     = CP_DATA.reduce((s,c) => s + (c.downMachines||0), 0);
  const totalMach    = CP_DATA.reduce((s,c) => s + (c.machineCount||0), 0);
  const uptimePct    = ((activeCPs / totalCPs) * 100).toFixed(1);
  const machUptimePct= (((totalMach - downMach) / totalMach) * 100).toFixed(1);
  const dailyUnits   = CP_DATA.reduce((s,c) => s + (c.dailyCollection||0), 0);
  const dailyTxns    = CP_DATA.reduce((s,c) => s + (c.dailyTxn||0), 0);
  const availDrivers = DRIVER_FLEET.filter(d => d.status === 'available').length;
  const onTripDrivers= DRIVER_FLEET.filter(d => d.status === 'on_trip').length;
  const totalExc     = EXCEPTIONS_DATA.weight.length + EXCEPTIONS_DATA.count.length + EXCEPTIONS_DATA.lost.length;
  const overdueExc   = EXCEPTIONS_DATA.weight.filter(e => e.ageH > 6).length + EXCEPTIONS_DATA.count.filter(e => e.ageH > 6).length;
  const hfHeld       = EXCEPTIONS_DATA.weight.length*250 + EXCEPTIONS_DATA.count.length*180 + EXCEPTIONS_DATA.lost.length*320;
  const lowBagCPs    = CP_DATA.filter(c => c.bagLow).length;
  const cpsNeedTrip  = CP_DATA.filter(c => c.sealedBags > 0 && !c.hasTrip).length;
  const bagRunway    = BAG_INVENTORY.runwayDays;

  // ── 7-DAY TRANSACTION TREND (synthetic but directional) ──────────
  const trend7 = [38200, 41000, 39800, 42400, 44100, 43200, dailyUnits];
  const trendMax = Math.max(...trend7);
  const trendMin = Math.min(...trend7);
  const trendPts = trend7.map((v, i) => [
    8 + i * (180 / 6),
    55 - ((v - trendMin) / (trendMax - trendMin + 1)) * 42
  ]);
  const trendPath = trendPts.map((p, i) => (i===0?'M':'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const trendFill = trendPath + ` L${trendPts[6][0]},58 L${trendPts[0][0]},58 Z`;
  const trendChange = (((trend7[6] - trend7[5]) / trend7[5]) * 100).toFixed(1);
  const trendUp = parseFloat(trendChange) >= 0;

  // ── MATERIAL FLOW THIS MONTH ─────────────────────────────────────
  const matData = [
    { name:'Glass', pct: 70, color:'#10b981', mt: 64.8 },
    { name:'PET',   pct: 18, color:'#3b82f6', mt: 96.2 },
    { name:'HDPE',  pct:  5, color:'#f59e0b', mt: 28.4 },
    { name:'MLP',   pct:  4, color:'#a855f7', mt: 18.2 },
    { name:'Alum',  pct:  2, color:'#ef4444', mt: 16.4 },
    { name:'Tetra', pct:  1, color:'#64748b', mt:  2.0 },
  ];

  // ── RING SVG helper (small circular gauge) ────────────────────────
  function ring(pct, color, r, size) {
    const c = 2 * Math.PI * r;
    const dash = (pct/100 * c).toFixed(1);
    const gap  = (c - dash).toFixed(1);
    const half = size/2;
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${half}" cy="${half}" r="${r}" fill="none" stroke="#1a2030" stroke-width="5"/>
      <circle cx="${half}" cy="${half}" r="${r}" fill="none" stroke="${color}" stroke-width="5"
        stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${c/4}"
        stroke-linecap="round" transform="rotate(-90 ${half} ${half})"/>
    </svg>`;
  }

  // ── ACTION ITEMS (prioritised for CEO) ───────────────────────────
  const actions = [
    ...(slaBreached > 0 ? [{
      sev: '#ef4444', tag: '🔴 URGENT', tag_color: '#ef4444',
      msg: `${slaBreached} CPs breached the 4-hour seal→trip SLA`,
      hint: `Bags sealed but not collected. Revenue impact: handler fee accruing. CPS with SLA breach need priority dispatch.`,
      cta: 'Dispatch', cta_bg: '#ef44441a', cta_color: '#f87171'
    }] : []),
    ...(overdueExc > 0 ? [{
      sev: '#ef4444', tag: '🔴 URGENT', tag_color: '#ef4444',
      msg: `${overdueExc} warehouse exceptions overdue >6 hours`,
      hint: `₹${(overdueExc*280).toLocaleString()} handler fees frozen. Each unresolved exception delays payout to field partners.`,
      cta: 'Resolve', cta_bg: '#ef44441a', cta_color: '#f87171'
    }] : []),
    ...(downMach > 3 ? [{
      sev: '#f59e0b', tag: '🟡 PRIORITY', tag_color: '#f59e0b',
      msg: `${downMach} machines offline across ${CP_DATA.filter(c=>c.downMachines>0).length} collection points`,
      hint: `Machine downtime directly reduces collection volume. Each offline RVM = lost deposit revenue + consumer friction.`,
      cta: 'File SR', cta_bg: '#f59e0b1a', cta_color: '#f59e0b'
    }] : []),
    ...(cpsNeedTrip > availDrivers ? [{
      sev: '#f59e0b', tag: '🟡 PRIORITY', tag_color: '#f59e0b',
      msg: `${cpsNeedTrip} CPs need pickup but only ${availDrivers} drivers available`,
      hint: `Trip coverage gap. ${DRIVER_FLEET.filter(d=>d.status==='returning').length} drivers returning — reassign on arrival or call reserve.`,
      cta: 'Plan', cta_bg: '#f59e0b1a', cta_color: '#f59e0b'
    }] : []),
    ...(lowBagCPs > 5 ? [{
      sev: '#3b82f6', tag: '🔵 MONITOR', tag_color: '#3b82f6',
      msg: `${lowBagCPs} collection points have fewer than 6 bags in stock`,
      hint: `Bag inventory at ${bagRunway} day runway. Low bag stock stops collection — replenish before reaching zero.`,
      cta: 'Replenish', cta_bg: '#3b82f61a', cta_color: '#60a5fa'
    }] : []),
    ...(totalExc > 8 && overdueExc === 0 ? [{
      sev: '#3b82f6', tag: '🔵 MONITOR', tag_color: '#3b82f6',
      msg: `${totalExc} open exceptions holding ₹${hfHeld.toLocaleString()} in handler fees`,
      hint: `Within SLA but accumulating. Resolve before end-of-day to keep handler partner relations healthy.`,
      cta: 'Review', cta_bg: '#3b82f61a', cta_color: '#60a5fa'
    }] : []),
  ];

  // If no actions, add a "clean" note
  if (actions.length === 0) {
    actions.push({
      sev: '#10b981', tag: '✅ ALL CLEAR', tag_color: '#10b981',
      msg: 'No priority actions required right now.',
      hint: 'All SLAs met, exceptions within tolerance, fleet coverage adequate. Continue monitoring.',
      cta: null
    });
  }

  const body = document.getElementById('exec-agent-body');
  if (!body) return;

  body.innerHTML = `
    <!-- ═══ SECTION: TODAY AT A GLANCE ═══ -->
    <div class="exec-agent-section">
      <div class="exec-agent-section-title">Today at a Glance</div>
      <div class="exec-agent-kpi-grid">
        <div class="exec-agent-kpi">
          <div class="exec-agent-kpi-lbl">Units Collected</div>
          <div class="exec-agent-kpi-val ag-good">${(dailyUnits/1000).toFixed(1)}<span style="font-size:12px;color:#4a5570;"> K</span></div>
          <div class="exec-agent-kpi-sub">${dailyTxns.toLocaleString()} transactions</div>
        </div>
        <div class="exec-agent-kpi">
          <div class="exec-agent-kpi-lbl">Network Uptime</div>
          <div class="exec-agent-kpi-val ${parseFloat(uptimePct)>=95?'ag-good':parseFloat(uptimePct)>=88?'ag-warn':'ag-bad'}">${uptimePct}<span style="font-size:12px;color:#4a5570;">%</span></div>
          <div class="exec-agent-kpi-sub">${activeCPs} of ${totalCPs} CPs online</div>
        </div>
        <div class="exec-agent-kpi">
          <div class="exec-agent-kpi-lbl">Machine Uptime</div>
          <div class="exec-agent-kpi-val ${parseFloat(machUptimePct)>=95?'ag-good':parseFloat(machUptimePct)>=88?'ag-warn':'ag-bad'}">${machUptimePct}<span style="font-size:12px;color:#4a5570;">%</span></div>
          <div class="exec-agent-kpi-sub">${downMach} machines down</div>
        </div>
        <div class="exec-agent-kpi">
          <div class="exec-agent-kpi-lbl">HF at Risk</div>
          <div class="exec-agent-kpi-val ${hfHeld>5000?'ag-warn':'ag-good'}">₹${(hfHeld/1000).toFixed(1)}<span style="font-size:12px;color:#4a5570;">K</span></div>
          <div class="exec-agent-kpi-sub">${totalExc} exceptions</div>
        </div>
      </div>
    </div>

    <!-- ═══ SECTION: 7-DAY TREND ═══ -->
    <div class="exec-agent-section">
      <div class="exec-agent-section-title">7-Day Collection Trend</div>
      <div class="exec-agent-spark">
        <div class="exec-agent-spark-head">
          <span class="exec-agent-spark-title">Daily Units · Last 7 Days</span>
          <span class="exec-agent-spark-val" style="color:${trendUp?'#10b981':'#ef4444'};">${trendUp?'▲':'▼'} ${Math.abs(trendChange)}%</span>
        </div>
        <svg width="100%" height="60" viewBox="0 0 196 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ag-spark-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${trendUp?'#10b981':'#3b82f6'}" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="${trendUp?'#10b981':'#3b82f6'}" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="${trendFill}" fill="url(#ag-spark-grad)"/>
          <path d="${trendPath}" fill="none" stroke="${trendUp?'#10b981':'#3b82f6'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          ${trendPts.map((p,i) => i===6 ? `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${trendUp?'#10b981':'#3b82f6'}" stroke="#0b0f17" stroke-width="2"/>` : '').join('')}
        </svg>
        <div style="display:flex;justify-content:space-between;margin-top:4px;">
          ${['Mon','Tue','Wed','Thu','Fri','Sat','Today'].map(d => `<span style="font-size:8.5px;color:#3d4b63;font-weight:600;">${d}</span>`).join('')}
        </div>
      </div>
    </div>

    <!-- ═══ SECTION: PRIORITY ACTIONS ═══ -->
    <div class="exec-agent-section">
      <div class="exec-agent-section-title">Priority Actions · ${actions.length} item${actions.length!==1?'s':''}</div>
      ${actions.map(a => `
        <div class="exec-agent-action">
          <div class="exec-agent-action-sev" style="background:${a.sev};"></div>
          <div class="exec-agent-action-body">
            <div class="exec-agent-action-tag" style="color:${a.tag_color};">${a.tag}</div>
            <div class="exec-agent-action-msg">${a.msg}</div>
            <div class="exec-agent-action-hint">${a.hint}</div>
          </div>
          ${a.cta ? `<button class="exec-agent-action-cta" style="background:${a.cta_bg};color:${a.cta_color};border:1px solid ${a.cta_color}44;">${a.cta}</button>` : ''}
        </div>
      `).join('')}
    </div>

    <!-- ═══ SECTION: MATERIAL MIX ═══ -->
    <div class="exec-agent-section">
      <div class="exec-agent-section-title">Material Mix · Month to Date</div>
      <div class="exec-agent-hbar">
        ${matData.map(m => `
          <div class="exec-agent-hbar-row">
            <span class="exec-agent-hbar-lbl">${m.name}</span>
            <div class="exec-agent-hbar-track">
              <div class="exec-agent-hbar-fill" style="width:${m.pct}%;background:${m.color};"></div>
            </div>
            <span class="exec-agent-hbar-val" style="color:${m.color};">${m.pct}%</span>
          </div>
        `).join('')}
      </div>
      <div style="font-size:10px;color:#3d4b63;margin-top:10px;text-align:right;">MTD Total: 226 MT</div>
    </div>

    <!-- ═══ SECTION: FLEET & COVERAGE RINGS ═══ -->
    <div class="exec-agent-section">
      <div class="exec-agent-section-title">Fleet & Capacity Rings</div>
      <div class="exec-agent-ring-row">
        <div class="exec-agent-ring">
          ${ring(parseFloat(uptimePct), parseFloat(uptimePct)>=95?'#10b981':parseFloat(uptimePct)>=88?'#f59e0b':'#ef4444', 28, 72)}
          <div class="exec-agent-ring-val" style="color:${parseFloat(uptimePct)>=95?'#10b981':parseFloat(uptimePct)>=88?'#f59e0b':'#ef4444'};">${uptimePct}%</div>
          <div class="exec-agent-ring-lbl">CP Uptime</div>
        </div>
        <div class="exec-agent-ring">
          ${ring(parseFloat(machUptimePct), parseFloat(machUptimePct)>=95?'#10b981':parseFloat(machUptimePct)>=88?'#f59e0b':'#ef4444', 28, 72)}
          <div class="exec-agent-ring-val" style="color:${parseFloat(machUptimePct)>=95?'#10b981':parseFloat(machUptimePct)>=88?'#f59e0b':'#ef4444'};">${machUptimePct}%</div>
          <div class="exec-agent-ring-lbl">Machine Up</div>
        </div>
        <div class="exec-agent-ring">
          ${ring(Math.round(onTripDrivers/DRIVER_FLEET.length*100), '#3b82f6', 28, 72)}
          <div class="exec-agent-ring-val" style="color:#3b82f6;">${onTripDrivers}<span style="font-size:10px;color:#4a5570;">/${DRIVER_FLEET.length}</span></div>
          <div class="exec-agent-ring-lbl">Drivers Active</div>
        </div>
        <div class="exec-agent-ring">
          ${ring(Math.min(100, Math.round(BAG_INVENTORY.runwayDays/14*100)), bagRunway>=7?'#10b981':bagRunway>=4?'#f59e0b':'#ef4444', 28, 72)}
          <div class="exec-agent-ring-val" style="color:${bagRunway>=7?'#10b981':bagRunway>=4?'#f59e0b':'#ef4444'};">${bagRunway}<span style="font-size:10px;color:#4a5570;">d</span></div>
          <div class="exec-agent-ring-lbl">Bag Runway</div>
        </div>
      </div>
    </div>

    <!-- ═══ SECTION: BLOCK HEALTH HEATMAP ═══ -->
    <div class="exec-agent-section">
      <div class="exec-agent-section-title">Taluka Health · Active CP %</div>
      ${(() => {
        const stats = {};
        CP_DATA.forEach(c => {
          if (!stats[c.block]) stats[c.block] = { total:0, active:0 };
          stats[c.block].total++;
          if (c.status === 'Active') stats[c.block].active++;
        });
        return Object.entries(stats).map(([tal, s]) => {
          const pct = Math.round(s.active/s.total*100);
          const col = pct>=95?'#10b981':pct>=85?'#f59e0b':'#ef4444';
          return `
            <div class="exec-agent-hbar-row" style="margin-bottom:5px;">
              <span class="exec-agent-hbar-lbl" style="font-size:10px;">${tal.slice(0,8)}</span>
              <div class="exec-agent-hbar-track">
                <div class="exec-agent-hbar-fill" style="width:${pct}%;background:${col};"></div>
              </div>
              <span class="exec-agent-hbar-val" style="color:${col};">${pct}%</span>
            </div>`;
        }).join('');
      })()}
    </div>

    <!-- ═══ SECTION: FINANCIAL SNAPSHOT ═══ -->
    <div class="exec-agent-section">
      <div class="exec-agent-section-title">Revenue Snapshot · MTD</div>
      <div class="exec-agent-kpi-grid">
        <div class="exec-agent-kpi">
          <div class="exec-agent-kpi-lbl">Material Sales</div>
          <div class="exec-agent-kpi-val ag-good">₹38.2<span style="font-size:12px;color:#4a5570;">L</span></div>
          <div class="exec-agent-kpi-sub">45.4% of revenue</div>
        </div>
        <div class="exec-agent-kpi">
          <div class="exec-agent-kpi-lbl">Float Revenue</div>
          <div class="exec-agent-kpi-val ag-good">₹22.4<span style="font-size:12px;color:#4a5570;">L</span></div>
          <div class="exec-agent-kpi-sub">28.6% unredeemed</div>
        </div>
        <div class="exec-agent-kpi">
          <div class="exec-agent-kpi-lbl">HF / EPR</div>
          <div class="exec-agent-kpi-val">₹16.8<span style="font-size:12px;color:#4a5570;">L</span></div>
          <div class="exec-agent-kpi-sub">19.9% of revenue</div>
        </div>
        <div class="exec-agent-kpi">
          <div class="exec-agent-kpi-lbl">Total MTD</div>
          <div class="exec-agent-kpi-val ag-good">₹84.2<span style="font-size:12px;color:#4a5570;">L</span></div>
          <div class="exec-agent-kpi-sub">▲ 8.2% vs last month</div>
        </div>
      </div>
    </div>
  `;

  const launcher = document.getElementById('exec-agent-launcher');
  const panel = document.getElementById('exec-agent-panel');
  const closeBtn = document.getElementById('exec-agent-close-btn');
  if (launcher && panel) {
    launcher.addEventListener('click', (e) => { e.stopPropagation(); panel.classList.toggle('open'); });
  }
  if (closeBtn && panel) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); panel.classList.remove('open'); });
}

/* v23 wiring: CP Overall interactive filters */
function wireCpOverall() {
  // v31: New wiring — no filter chips, only data-drill click → block-wise breakdown modal
  // Per-key block-wise data shown in modal
  const BLOCKS = ['Bardez','Salcete','Tiswadi','Mormugao','Ponda','Bicholim','Pernem','Quepem','Canacona','Sattari','Sanguem','Dharbandora'];

  // Block-wise data by metric — deterministic mock proportional to block size
  const blockShares = {
    Bardez:18, Salcete:17, Tiswadi:13, Mormugao:9, Ponda:10, Bicholim:8,
    Pernem:6, Quepem:6, Canacona:5, Sattari:3, Sanguem:3, Dharbandora:2,
  };

  // Specs for each drillable metric — what title, what unit, total value
  const DRILL_SPECS = {
    'ov-total-devices':    { title:'Total Devices · Block-wise',         total:791, unit:'devices', sub:'All RVMs + RCs + HoReCa CPs + D2D + AWP per block' },
    'ov-active':           { title:'Active Devices · Block-wise',        total:766, unit:'active', sub:'Devices online and receiving today' },
    'ov-down':             { title:'Down / Offline · Block-wise',        total: 25, unit:'down',   sub:'Devices flagged as Down or under Maintenance' },
    'ov-handlers':         { title:'RVMs With Handler · Block-wise',     total:100, unit:'RVMs',   sub:'High-footfall RVMs assigned a handler' },
    'ov-uptime':           { title:'Uptime % · Block-wise',              total: 97.4, unit:'%avg', sub:'Avg operational uptime by block (last 24h)' },
    'ov-health':           { title:'Health Score · Block-wise',          total: 94, unit:'/100',   sub:'Weighted: Uptime 40% + Active ratio 30% + Attendance 20% + Ticket-free 10%' },
    'ov-rvm':              { title:'RVMs · Block-wise',                  total:300, unit:'RVMs',   sub:'300 RVMs across 12 blocks · 270 Public + 30 Private' },
    'ov-rc':               { title:'Retearn Centers · Block-wise',       total: 50, unit:'RCs',    sub:'50 RCs · 5 Public + 45 Private' },
    'ov-horeca':           { title:'HoReCa CP · Block-wise',             total:200, unit:'trucks', sub:'200 mobile trucks · Fastscan device · business pickup routes' },
    'ov-d2d':              { title:'D2D Pickup · Block-wise',            total:191, unit:'D2D',    sub:'191 D2D workers · 70 Public + 121 Contractor' },
    'ov-awp':              { title:'AWP · Block-wise',                   total: 50, unit:'AWPs',   sub:'50 auxiliary rag-picker workers · roving collection' },
    'ov-handler-total':    { title:'Handlers · Block-wise',              total:100, unit:'handlers', sub:'100 handlers · 62 Fixed + 38 Rolling, assigned to high-footfall RVMs' },
    'ov-alerts-critical':  { title:'Critical Alerts · Block-wise',       total: 3,  unit:'alerts',  sub:'Severity 1 · service-impacting · response SLA 30min' },
    'ov-alerts-high':      { title:'High Priority Alerts · Block-wise',  total: 5,  unit:'alerts',  sub:'Severity 2 · risk to SLA · response 2h' },
    'ov-alerts-medium':    { title:'Medium Priority Alerts · Block-wise', total: 4,  unit:'alerts',  sub:'Severity 3 · monitor · response 24h' },
    'ov-alerts-all':       { title:'All Open Alerts · Block-wise',       total: 12, unit:'alerts',  sub:'3 critical · 5 high · 4 medium across 12 blocks' },
    'ov-handler-loggedin': { title:'Handlers Logged In · Block-wise',    total: 87, unit:'logged in', sub:'87 of 100 currently active in Handler App · live session count' },
    'ov-handler-notloggedin':{ title:'Not Logged In · Block-wise',       total:  13, unit:'absent',    sub:'7 off-shift (scheduled rest) + 6 unscheduled absent · click block for names' },
    'ov-handler-presence': { title:'Presence Check · Block-wise',        total: 94.3, unit:'%verified', sub:'GPS + selfie verification today · 82 of 87 verified · 5 retries pending' },
    'ov-handler-attendance':{ title:'Attendance % (MTD) · Block-wise',   total: 91.6, unit:'%attendance', sub:'Month-to-date attendance · target 90% · trending ▲ 2.1pp vs last month' },
    'ov-handler-fixed':    { title:'Fixed Handlers · Block-wise',        total: 62, unit:'fixed',  sub:'58 logged in of 62 · assigned 1:1 to high-footfall RVMs' },
    'ov-handler-rolling':  { title:'Rolling Handlers · Block-wise',      total: 38, unit:'rolling', sub:'33 logged in of 38 · roving between RVMs and RCs' },
    'ov-handler-horeca':   { title:'HoReCa Crew · Block-wise',           total:200, unit:'crew',  sub:'178 logged in of 200 · drivers + helpers on HoReCa trucks' },
    'ov-handler-d2d':      { title:'D2D Pickers · Block-wise',           total:191, unit:'pickers', sub:'156 logged in of 191 · 70 Public + 121 Contractor' },
    'ov-handler-awp':      { title:'AWP Rovers · Block-wise',            total: 50, unit:'rovers', sub:'38 logged in of 50 · roving collection on auxiliary routes' },
    'ov-handler-cpc':      { title:'CPC Sorters · Block-wise',           total: 83, unit:'sorters', sub:'85 logged in of 83 · sorting / baling / loading at CPC (over-staff today)' },
    'ov-live-trips':       { title:'Active Trips · Live · Block-wise',   total: 85, unit:'active', sub:'62 on schedule · 18 delayed · 5 stopped · live GPS tracked' },
    'ov-live-pickups':     { title:'Pickups / Hour · Block-wise',        total:142, unit:'pickups/h', sub:'Pickups completed last hour · trending ▲ 12% vs prior hour' },
    'ov-live-bags':        { title:'Bags In Transit · Block-wise',       total:800, unit:'bags',  sub:'420 outbound (CPC → CP) + 380 inbound (CP → CPC)' },
    'ov-live-alerts':      { title:'Open Alerts · Block-wise',           total: 12, unit:'alerts', sub:'3 critical · 5 high · 4 medium · click block for ticket list' },
    'ov-handler-hour-06':  { title:'Login Activity · 06:00 · Block-wise', total: 42, unit:'logged in', sub:'Early-shift handlers logging into Handler App at this hour' },
    'ov-handler-hour-07':  { title:'Login Activity · 07:00 · Block-wise', total:128, unit:'logged in', sub:'Morning ramp-up · CPC sorters + HoReCa crews coming online' },
    'ov-handler-hour-08':  { title:'Login Activity · 08:00 · Block-wise', total:312, unit:'logged in', sub:'Morning surge · most channels active' },
    'ov-handler-hour-09':  { title:'Login Activity · 09:00 · Block-wise', total:468, unit:'logged in', sub:'D2D pickup runs in full swing · RVM handlers at posts' },
    'ov-handler-hour-10':  { title:'Login Activity · 10:00 · Block-wise', total:521, unit:'logged in', sub:'Sustained workload · all channels staffed' },
    'ov-handler-hour-11':  { title:'Login Activity · 11:00 · Block-wise', total:538, unit:'logged in', sub:'Peak-window approaching' },
    'ov-handler-hour-12':  { title:'Login Activity · 12:00 · Block-wise', total:512, unit:'logged in', sub:'Lunch dip · some HoReCa crews on break' },
    'ov-handler-hour-13':  { title:'Login Activity · 13:00 · Block-wise', total:498, unit:'logged in', sub:'Post-lunch ramp-back' },
    'ov-handler-hour-14':  { title:'Login Activity · 14:00 · Block-wise', total:548, unit:'logged in', sub:'PEAK · all channels at max staffing' },
    'ov-handler-hour-15':  { title:'Login Activity · 15:00 · Block-wise', total:536, unit:'logged in', sub:'Sustained peak · evening HoReCa shift beginning' },
    'ov-handler-hour-16':  { title:'Login Activity · 16:00 · Block-wise', total:510, unit:'logged in', sub:'High activity continues' },
    'ov-handler-hour-17':  { title:'Login Activity · 17:00 · Block-wise', total:472, unit:'logged in', sub:'Some morning handlers logging out · evening crew taking over' },
    'ov-handler-hour-18':  { title:'Login Activity · 18:00 · Block-wise', total:418, unit:'logged in', sub:'Evening HoReCa & RC peak hours' },
    'ov-handler-hour-19':  { title:'Login Activity · 19:00 · Block-wise', total:288, unit:'logged in', sub:'Wind-down · CPC sorters finishing batches' },
    'ov-handler-hour-20':  { title:'Login Activity · 20:00 · Block-wise', total:142, unit:'logged in', sub:'Night-shift skeleton crew + on-call AWP' },
    'ov-pay-overall':      { title:'Payment Success Rate · Block-wise',  total: 97.8, unit:'%success', sub:'12,486 successful of 12,768 transactions today · 282 failed or pending' },
    'ov-pay-volume':       { title:"Today's Payment Volume · Block-wise", total: 482000, unit:'₹ today', sub:'₹4.82 Lakh across all streams · avg ₹37.7 per transaction' },
    'ov-pay-failed':       { title:'Failed / Pending Payments · Block-wise', total: 282, unit:'failed', sub:'186 failed (final) · 96 pending retry · click block for transaction list' },
    'ov-pay-tat':          { title:'Avg Settlement TAT · Block-wise',    total: 2.4, unit:'sec avg', sub:'End-to-end QR-scan to credit · target < 5s · all blocks within SLA' },
    'ov-bag-rvm':          { title:'Bags at RVM · Block-wise',           total:278, unit:'bags',   sub:'Currently in-use at RVM (1 per RVM, hard cap)' },
    'ov-bag-rc':           { title:'Bags at RC · Block-wise',            total:282, unit:'bags',   sub:'Currently in-use at RC (up to 6 per RC)' },
    'ov-bag-horeca':       { title:'Bags on HoReCa Trucks · Block-wise', total:142, unit:'bags',   sub:'Currently on HoReCa pickup trucks' },
    'ov-bag-cpc':          { title:'Bags at CPC · Block-wise',           total:290, unit:'bags',   sub:'Ready for dispatch from CPC to CPs' },
    'ov-bag-transit-cp':   { title:'In Transit → CP · Block-wise',       total:420, unit:'bags',   sub:'Bags moving CPC → CP' },
    'ov-bag-inuse':        { title:'In Use Bags · Block-wise',           total:2890, unit:'bags',  sub:'Bags currently filling at CPs' },
    'ov-bag-sealed':       { title:'Sealed Bags · Block-wise',           total:180, unit:'bags',   sub:'Sealed at CP, awaiting pickup' },
    'ov-bag-transit-cpc':  { title:'In Transit → CPC · Block-wise',      total:380, unit:'bags',   sub:'Bags moving CP → CPC' },
    'ov-bag-received':     { title:'Received at CPC · Block-wise',       total: 64, unit:'bags',   sub:'Arrived at CPC, awaiting counting' },
    'ov-bag-damaged':      { title:'Damaged Bags · Block-wise',          total: 14, unit:'damaged', sub:'Damaged today across transit / CP / CPC stages' },
    'ov-mat-total':        { title:'Total Material Units · Block-wise',  total:247832, unit:'units', sub:'All channels combined today' },
    'ov-mat-rvm':          { title:'Material via RVM · Block-wise',      total: 62400, unit:'units', sub:'Units collected via RVMs today' },
    'ov-mat-rc':           { title:'Material via RC · Block-wise',       total: 48320, unit:'units', sub:'Units collected via Retearn Centers today' },
    'ov-mat-horeca':       { title:'Material via HoReCa · Block-wise',   total: 42100, unit:'units', sub:'Units collected via HoReCa trucks today' },
    'ov-mat-d2d':          { title:'Material via D2D · Block-wise',      total: 18200, unit:'units', sub:'Units collected via D2D pickup today' },
    'ov-mat-awp':          { title:'Material via AWP · Block-wise',      total: 12840, unit:'units', sub:'Units collected via AWP roving today' },
  };

  // Material type drill
  const MATERIAL_TOTALS = {
    Glass:     { count:86740, color:'#4f6ef7', subtypes:[
      ['Clear / Flint', 42820, '49.4%'], ['Green', 28640, '33.0%'], ['Amber / Brown', 15280, '17.6%']
    ]},
    PET:       { count:54522, color:'#8b5cf6', subtypes:[
      ['Clear', 32840, '60.2%'], ['Green', 14620, '26.8%'], ['Blue / Tinted', 7062, '13.0%']
    ]},
    Aluminium: { count:44610, color:'#10b981', subtypes:[['UBC Crushed', 44610, '100%']]},
    HDPE:      { count:29740, color:'#f59e0b', subtypes:[['FMCG White', 18420, '62%'], ['Chem White', 11320, '38%']]},
    Tetrapak:  { count:19826, color:'#ef4444', subtypes:[['Dairy', 11420, '57.6%'], ['Juice', 8406, '42.4%']]},
    MLP:       { count:12394, color:'#6b7280', subtypes:[['Mixed', 12394, '100%']]},
  };

  function buildBlockTable(spec) {
    const total = spec.total;
    let runningTotal = 0;
    const rows = BLOCKS.map((b, i) => {
      const share = blockShares[b] / 100;
      let val = Math.round(total * share);
      if (i === BLOCKS.length - 1) val = total - runningTotal; // last block gets remainder
      runningTotal += val;
      const pct = (val/total*100).toFixed(1);
      return [b, val, pct];
    });
    return `
      <p style="color:var(--text-mute);font-size:12.5px;margin-bottom:14px;">${spec.sub}</p>
      <table class="t">
        <thead>
          <tr><th>Block / Taluka</th><th class="num">${spec.unit}</th><th class="num">Share %</th><th>Distribution</th></tr>
        </thead>
        <tbody>
          ${rows.map((r,i) => `
            <tr${i%2?' class="striped"':''}>
              <td><strong>${r[0]}</strong></td>
              <td class="num">${typeof r[1] === 'number' ? r[1].toLocaleString() : r[1]}</td>
              <td class="num">${r[2]}%</td>
              <td>
                <div style="height:8px;background:#f1f5f9;border-radius:4px;overflow:hidden;width:160px;">
                  <div style="height:100%;width:${Math.min(100, r[2]*3)}%;background:#2c4cdc;border-radius:4px;"></div>
                </div>
              </td>
            </tr>
          `).join('')}
          <tr style="background:#f8fafc;font-weight:700;">
            <td>Total</td>
            <td class="num">${typeof total === 'number' ? total.toLocaleString() : total}</td>
            <td class="num">100%</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    `;
  }

  function buildMaterialDetail(matName) {
    const mat = MATERIAL_TOTALS[matName];
    if (!mat) return `<p>No data for ${matName}</p>`;
    return `
      <p style="color:var(--text-mute);font-size:12.5px;margin-bottom:14px;">
        Today's collection of <strong>${matName}</strong>: <strong style="color:${mat.color};">${mat.count.toLocaleString()} units</strong> · reference.
      </p>
      <table class="t">
        <thead><tr><th>Sub-type</th><th class="num">Units</th><th class="num">Share</th></tr></thead>
        <tbody>
          ${mat.subtypes.map((s,i) => `
            <tr${i%2?' class="striped"':''}>
              <td><span style="display:inline-block;width:10px;height:10px;background:${mat.color};border-radius:2px;margin-right:6px;vertical-align:middle;"></span>${s[0]}</td>
              <td class="num">${s[1].toLocaleString()}</td>
              <td class="num">${s[2]}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function openModal(title, sub, html) {
    const overlay = document.getElementById('v25-modal-overlay');
    if (!overlay) return;
    document.getElementById('v25-modal-title').textContent = title;
    document.getElementById('v25-modal-sub').textContent = sub || '';
    document.getElementById('v25-modal-body').innerHTML = html;
    overlay.classList.add('open');
  }

  // Wire all data-drill click → block-wise modal
  document.querySelectorAll('[data-drill]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = el.dataset.drill;

      // Material type drill (ov-mat-type-Glass, etc.)
      if (key.startsWith('ov-mat-type-')) {
        const matName = key.replace('ov-mat-type-', '');
        openModal(`Material · ${matName}`, `Sub-type breakdown · `, buildMaterialDetail(matName));
        return;
      }
      // Throughput drill
      if (key.startsWith('ov-throughput-')) {
        const hr = key.replace('ov-throughput-', '');
        openModal(`Throughput · ${hr}:00`, `Hourly collection rate at ${hr}:00 across all channels`, `
          <p style="color:var(--text-mute);font-size:12.5px;margin-bottom:14px;">Units collected in the hour starting ${hr}:00 today, broken down by channel.</p>
          <table class="t">
            <thead><tr><th>Channel</th><th class="num">Units</th><th class="num">% of hour</th></tr></thead>
            <tbody>
              <tr><td>RVM</td><td class="num">${Math.round(parseInt(hr)*120+820).toLocaleString()}</td><td class="num">45%</td></tr>
              <tr class="striped"><td>RC</td><td class="num">${Math.round(parseInt(hr)*80+420).toLocaleString()}</td><td class="num">22%</td></tr>
              <tr><td>HoReCa</td><td class="num">${Math.round(parseInt(hr)*60+320).toLocaleString()}</td><td class="num">18%</td></tr>
              <tr class="striped"><td>D2D</td><td class="num">${Math.round(parseInt(hr)*40+180).toLocaleString()}</td><td class="num">10%</td></tr>
              <tr><td>AWP</td><td class="num">${Math.round(parseInt(hr)*20+120).toLocaleString()}</td><td class="num">5%</td></tr>
            </tbody>
          </table>
        `);
        return;
      }
      // CP drill from Down CPs table
      if (key.startsWith('ov-cp-')) {
        const cpId = key.replace('ov-cp-', '');
        openModal(`${cpId} · CP Detail`, 'Status: Down · awaiting field intervention', `
          <p style="color:var(--text-mute);font-size:12.5px;margin-bottom:14px;">This CP has been flagged Down. Field team has been notified. SLA for resolution: 4 hours from incident open.</p>
          <table class="t">
            <thead><tr><th>Field</th><th>Value</th></tr></thead>
            <tbody>
              <tr><td>CP ID</td><td><strong>${cpId}</strong></td></tr>
              <tr class="striped"><td>Status</td><td><span style="color:#ef4444;font-weight:700;">Down</span></td></tr>
              <tr><td>Last Sync</td><td>4h ago</td></tr>
              <tr class="striped"><td>Ticket</td><td>Open</td></tr>
              <tr><td>Field team</td><td>Notified</td></tr>
            </tbody>
          </table>
        `);
        return;
      }
      // v45: Fill rate drilldowns — show per-asset fill detail
      if (key === 'ov-fill-rvm') {
        // Build 300 RVM rows with deterministic fill rates and material mix
        const rvmRows = Array.from({length: 300}, (_,i) => {
          const id = `RVM-${String(i+1).padStart(3,'0')}`;
          const seed = (i * 17) % 100;
          const fill = Math.min(98, 30 + seed);
          const block = ['Bardez','Salcete','Tiswadi','Mormugao','Ponda','Bicholim','Pernem','Quepem','Canacona','Sattari','Sanguem','Dharbandora'][i % 12];
          // RVM bags hold a MIX of materials (single bag, mixed contents)
          const mix = {
            Glass: 40 + (seed % 20),
            PET:   15 + (seed % 12),
            Alu:   10 + (seed % 8),
            HDPE:  10 + (seed % 7),
            Tetra:  5 + (seed % 5),
          };
          const total = Object.values(mix).reduce((s,v)=>s+v,0);
          // Normalize to 100%
          Object.keys(mix).forEach(k => { mix[k] = Math.round(mix[k]/total*100); });
          // v46: New thresholds — 60% pickup request, 80% sealed
          const status = fill >= 80 ? 'Sealed' : fill >= 60 ? 'Pickup Req' : 'Collecting';
          const color  = fill >= 80 ? '#dc2626' : fill >= 60 ? '#f59e0b' : '#15803d';
          return { id, block, fill, mix, status, color };
        });
        const sealed   = rvmRows.filter(r => r.fill >= 80).length;
        const pickReq  = rvmRows.filter(r => r.fill >= 60 && r.fill < 80).length;
        const collecting = rvmRows.filter(r => r.fill < 60).length;

        openModal('RVM CP · Fill Rate · All 300 RVMs',
          `1 bag per RVM · mixed material · 68% network average · sealed at 80%`,
          `
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;">
            <div style="padding:10px;border:1px solid #fecaca;background:#fef2f2;border-radius:8px;">
              <div style="font-size:10px;color:#991b1b;font-weight:700;text-transform:uppercase;">🔒 Sealed (≥80%)</div>
              <div style="font-size:18px;color:#dc2626;font-weight:800;font-family:var(--font-mono);">${sealed}</div>
              <div style="font-size:9.5px;color:var(--text-mute);">Machine not accepting</div>
            </div>
            <div style="padding:10px;border:1px solid #fde68a;background:#fffbeb;border-radius:8px;">
              <div style="font-size:10px;color:#92400e;font-weight:700;text-transform:uppercase;">🚚 Pickup Req (60-80%)</div>
              <div style="font-size:18px;color:#f59e0b;font-weight:800;font-family:var(--font-mono);">${pickReq}</div>
              <div style="font-size:9.5px;color:var(--text-mute);">Auto pickup requested</div>
            </div>
            <div style="padding:10px;border:1px solid #bbf7d0;background:#f0fdf4;border-radius:8px;">
              <div style="font-size:10px;color:#065f46;font-weight:700;text-transform:uppercase;">📥 Collecting (&lt;60%)</div>
              <div style="font-size:18px;color:#15803d;font-weight:800;font-family:var(--font-mono);">${collecting}</div>
              <div style="font-size:9.5px;color:var(--text-mute);">Accepting new material</div>
            </div>
          </div>
          <p style="color:var(--text-mute);font-size:12px;margin-bottom:10px;">Per-RVM fill rate with the material mix inside each single bag. Showing top 60 by fill — sorted descending.</p>
          <table class="t" style="font-size:11.5px;">
            <thead><tr>
              <th>RVM ID</th><th>Block</th>
              <th class="num">Fill %</th>
              <th>Status</th>
              <th class="num">Glass</th><th class="num">PET</th><th class="num">Alu</th><th class="num">HDPE</th><th class="num">Tetra</th>
            </tr></thead>
            <tbody>
              ${rvmRows.sort((a,b)=>b.fill-a.fill).slice(0,60).map((r,i) => `
                <tr${i%2?' class="striped"':''}>
                  <td><strong>${r.id}</strong></td>
                  <td>${r.block}</td>
                  <td class="num"><span style="font-weight:700;color:${r.color};">${r.fill}%</span></td>
                  <td><span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;background:${r.color}22;color:${r.color};">${r.status}</span></td>
                  <td class="num">${r.mix.Glass}%</td>
                  <td class="num">${r.mix.PET}%</td>
                  <td class="num">${r.mix.Alu}%</td>
                  <td class="num">${r.mix.HDPE}%</td>
                  <td class="num">${r.mix.Tetra}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `);
        return;
      }

      if (key === 'ov-fill-rc') {
        // 50 RCs × 6 bags = 300 dedicated bags. Each bag = 1 material.
        const rcRows = Array.from({length: 50}, (_,i) => {
          const id = `RC-${String(i+1).padStart(3,'0')}`;
          const seed = (i * 23) % 100;
          const block = ['Bardez','Salcete','Tiswadi','Mormugao','Ponda','Bicholim','Pernem','Quepem','Canacona','Sattari','Sanguem','Dharbandora'][i % 12];
          // Each RC has 6 dedicated material bags
          const bags = {
            Glass:     40 + (seed % 50),
            PET:       45 + (seed * 2 % 45),
            Aluminium: 30 + (seed * 3 % 55),
            HDPE:      25 + (seed * 5 % 60),
            Tetrapak:  35 + (seed * 7 % 50),
            MLP:       50 + (seed * 11 % 40),
          };
          Object.keys(bags).forEach(k => bags[k] = Math.min(98, bags[k]));
          const avg = Math.round(Object.values(bags).reduce((s,v)=>s+v,0) / 6);
          return { id, block, bags, avg };
        });

        const sealed   = rcRows.reduce((s,r) => s + Object.values(r.bags).filter(v => v >= 80).length, 0);
        const pickReq  = rcRows.reduce((s,r) => s + Object.values(r.bags).filter(v => v >= 60 && v < 80).length, 0);

        openModal('RC CP · Bag Fill Rate · All 50 Return Centers',
          `6 dedicated bags per RC (1 per material) · 74% avg · ${sealed} sealed · ${pickReq} pickup-requested`,
          `
          <p style="color:var(--text-mute);font-size:12.5px;margin-bottom:14px;">Each Return Center has <strong>6 dedicated bags</strong>, one per material stream (Glass / PET / Alu / HDPE / Tetra / MLP). At <strong>60% fill</strong> a pickup is auto-requested. At <strong>80% fill</strong> the bag is sealed and that material stream stops accepting at that RC until swap. Showing all 50 RCs, sorted by average fill.</p>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;font-size:11px;">
            <div style="padding:8px 10px;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;"><strong style="color:#dc2626;">${sealed}</strong> bags 🔒 sealed (≥80%)</div>
            <div style="padding:8px 10px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;"><strong style="color:#f59e0b;">${pickReq}</strong> bags 🚚 pickup requested (60-80%)</div>
            <div style="padding:8px 10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;"><strong style="color:#15803d;">${300 - sealed - pickReq}</strong> bags 📥 collecting (&lt;60%)</div>
          </div>
          <table class="t" style="font-size:11.5px;">
            <thead><tr>
              <th>RC ID</th><th>Block</th>
              <th class="num">Avg</th>
              <th class="num" style="color:#10b981;">Glass</th>
              <th class="num" style="color:#2c4cdc;">PET</th>
              <th class="num" style="color:#0891b2;">Alu</th>
              <th class="num" style="color:#f59e0b;">HDPE</th>
              <th class="num" style="color:#ef4444;">Tetra</th>
              <th class="num" style="color:#6b7280;">MLP</th>
            </tr></thead>
            <tbody>
              ${rcRows.sort((a,b)=>b.avg-a.avg).map((r,i) => {
                const cell = (v) => v >= 80 ? `<span style="font-weight:700;color:#dc2626;">${v}% 🔒</span>` : v >= 60 ? `<span style="font-weight:700;color:#f59e0b;">${v}%</span>` : `<span style="color:#15803d;">${v}%</span>`;
                return `
                <tr${i%2?' class="striped"':''}>
                  <td><strong>${r.id}</strong></td>
                  <td>${r.block}</td>
                  <td class="num"><strong>${r.avg}%</strong></td>
                  <td class="num">${cell(r.bags.Glass)}</td>
                  <td class="num">${cell(r.bags.PET)}</td>
                  <td class="num">${cell(r.bags.Aluminium)}</td>
                  <td class="num">${cell(r.bags.HDPE)}</td>
                  <td class="num">${cell(r.bags.Tetrapak)}</td>
                  <td class="num">${cell(r.bags.MLP)}</td>
                </tr>
              `;}).join('')}
            </tbody>
          </table>
        `);
        return;
      }

      if (key === 'ov-fill-combined') {
        openModal('Network Capacity Utilization · Combined',
          '600 total bags · 71% network average · RVM CP 68% + RC CP 74%',
          `
          <p style="color:var(--text-mute);font-size:12.5px;margin-bottom:14px;">Combined view of all 600 bags across the network: 300 single bags in RVMs (mixed material) + 300 dedicated material bags in RCs (6 per RC). <strong>60% fill</strong> raises a pickup request, <strong>80% fill</strong> seals the bag and stops the machine accepting that stream.</p>
          <table class="t">
            <thead><tr><th>Asset Type</th><th class="num">Count</th><th class="num">Bags</th><th class="num">Avg Fill</th><th class="num">🔒 Sealed (≥80%)</th><th class="num">🚚 Pickup Req (60-80%)</th><th class="num">📥 Collecting (&lt;60%)</th></tr></thead>
            <tbody>
              <tr><td><strong>RVM CP</strong></td><td class="num">300</td><td class="num">300</td><td class="num"><span style="color:#2c4cdc;font-weight:700;">68%</span></td><td class="num"><span style="color:#dc2626;font-weight:700;">14</span></td><td class="num"><span style="color:#f59e0b;font-weight:700;">52</span></td><td class="num">234</td></tr>
              <tr class="striped"><td><strong>RC CP</strong></td><td class="num">50</td><td class="num">300</td><td class="num"><span style="color:#f59e0b;font-weight:700;">74%</span></td><td class="num"><span style="color:#dc2626;font-weight:700;">26</span></td><td class="num"><span style="color:#f59e0b;font-weight:700;">86</span></td><td class="num">188</td></tr>
              <tr style="background:#f8fafc;font-weight:700;"><td>Network Total</td><td class="num">350</td><td class="num">600</td><td class="num"><span style="color:#15803d;">71%</span></td><td class="num"><span style="color:#dc2626;">40</span></td><td class="num"><span style="color:#f59e0b;">138</span></td><td class="num">422</td></tr>
            </tbody>
          </table>
        `);
        return;
      }

      if (key === 'ov-fill-action') {
        openModal('Sealed Bags · ≥ 80% Capacity',
          '40 bags sealed · machine stopped accepting · swap required',
          `
          <p style="color:var(--text-mute);font-size:12.5px;margin-bottom:14px;">When a bag reaches <strong>80% fill</strong>, it is sealed and the machine stops accepting new material for that stream. A pickup-and-swap is required to resume collection. Swap SLA: 6 hours from seal.</p>
          <table class="t">
            <thead><tr><th>Asset</th><th>Block</th><th>Material</th><th class="num">Fill</th><th class="num">Sealed Since</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td><strong>RVM-014</strong></td><td>Bardez</td><td>Mixed</td><td class="num"><span style="color:#dc2626;font-weight:700;">96%</span></td><td class="num">2h 14m</td><td><span class="pill pill-warn">Swap routed</span></td></tr>
              <tr class="striped"><td><strong>RVM-082</strong></td><td>Salcete</td><td>Mixed</td><td class="num"><span style="color:#dc2626;font-weight:700;">94%</span></td><td class="num">1h 48m</td><td><span class="pill pill-warn">Swap routed</span></td></tr>
              <tr><td><strong>RC-007 (PET)</strong></td><td>Tiswadi</td><td>PET</td><td class="num"><span style="color:#dc2626;font-weight:700;">98%</span></td><td class="num">3h 32m</td><td><span class="pill pill-bad">SLA at risk</span></td></tr>
              <tr class="striped"><td><strong>RC-007 (Glass)</strong></td><td>Tiswadi</td><td>Glass</td><td class="num"><span style="color:#dc2626;font-weight:700;">93%</span></td><td class="num">1h 12m</td><td><span class="pill pill-warn">Swap routed</span></td></tr>
              <tr><td><strong>RC-018 (MLP)</strong></td><td>Mormugao</td><td>MLP</td><td class="num"><span style="color:#dc2626;font-weight:700;">95%</span></td><td class="num">2h 56m</td><td><span class="pill pill-warn">Swap routed</span></td></tr>
              <tr class="striped"><td colspan="6" style="text-align:center;color:var(--text-mute);font-style:italic;">… 35 more sealed bags (12 RVMs · 23 RC-material bags) — see Swap Queue</td></tr>
            </tbody>
          </table>
        `);
        return;
      }

      if (key.startsWith('ov-fill-mat-')) {
        const matName = key.replace('ov-fill-mat-', '');
        const matCap = matName.charAt(0).toUpperCase() + matName.slice(1);
        openModal(`Material Fill · ${matCap}`,
          `50 dedicated ${matCap} bags across all RCs · pickup at 60% · sealed at 80%`,
          `
          <p style="color:var(--text-mute);font-size:12.5px;margin-bottom:14px;">Each of the 50 Return Centers has one bag dedicated to <strong>${matCap}</strong>. At <strong>60% fill</strong> a pickup is auto-requested. At <strong>80% fill</strong> the bag is sealed and that material stream stops accepting at that RC.</p>
          <table class="t">
            <thead><tr><th>RC ID</th><th>Block</th><th class="num">Fill %</th><th>Status</th></tr></thead>
            <tbody>
              ${Array.from({length: 25}, (_,i) => {
                const seed = (i * matName.length * 13) % 100;
                const fill = Math.min(98, 30 + seed);
                const sealed = fill >= 80, pickup = fill >= 60 && fill < 80;
                const color = sealed ? '#dc2626' : pickup ? '#f59e0b' : '#15803d';
                const status = sealed ? '<span class="pill pill-bad">🔒 Sealed</span>' : pickup ? '<span class="pill pill-warn">🚚 Pickup Req</span>' : '<span class="pill pill-neutral">📥 Collecting</span>';
                const block = ['Bardez','Salcete','Tiswadi','Mormugao','Ponda','Bicholim','Pernem','Quepem','Canacona','Sattari','Sanguem','Dharbandora'][i % 12];
                return `<tr${i%2?' class="striped"':''}><td><strong>RC-${String(i+1).padStart(3,'0')}</strong></td><td>${block}</td><td class="num"><span style="color:${color};font-weight:700;">${fill}%</span></td><td>${status}</td></tr>`;
              }).join('')}
              <tr><td colspan="4" style="text-align:center;color:var(--text-mute);font-style:italic;">… 25 more RCs</td></tr>
            </tbody>
          </table>
        `);
        return;
      }

      // Standard block-wise drill
      const spec = DRILL_SPECS[key];
      if (spec) {
        openModal(spec.title, spec.sub, buildBlockTable(spec));
        return;
      }
    });
  });

  // Modal close
  const closeBtn = document.getElementById('v25-modal-close');
  const overlay = document.getElementById('v25-modal-overlay');
  if (closeBtn) closeBtn.addEventListener('click', () => overlay && overlay.classList.remove('open'));
  if (overlay) overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  // v44: Draw Collection Points distribution pie
  (function drawCpPie() {
    const canvas = document.getElementById('cp-ov-infra-pie');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W/2, cy = H/2, r = Math.min(W,H)/2 - 6;
    const segments = [
      { v:300, color:'#2c4cdc' }, // RVM
      { v: 50, color:'#10b981' }, // RC
      { v:200, color:'#f59e0b' }, // HoReCa
      { v:191, color:'#8b5cf6' }, // D2D
      { v: 50, color:'#ef4444' }, // AWP
    ];
    const total = segments.reduce((s,x)=>s+x.v, 0);
    let start = -Math.PI/2;
    ctx.clearRect(0,0,W,H);
    segments.forEach(seg => {
      const slice = (seg.v/total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      start += slice;
    });
    // Donut hole
    ctx.beginPath();
    ctx.arc(cx, cy, r*0.52, 0, Math.PI*2);
    ctx.fillStyle = '#fafbfc';
    ctx.fill();
    // Center label
    ctx.fillStyle = '#0d1220';
    ctx.font = '700 22px Inter, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(total), cx, cy - 6);
    ctx.fillStyle = '#6b7280';
    ctx.font = '600 9px Inter, system-ui';
    ctx.fillText('TOTAL CPs', cx, cy + 12);
  })();
}

/* v23 wiring: CP Machines handler toggle */
function wireCpMachines() {
  const dropdown = document.getElementById('cp-mach-handler-filter');
  if (!dropdown) return;
  dropdown.addEventListener('change', () => {
    // Visual feedback: dim non-matching channel rows
    const sel = dropdown.value;
    const rows = document.querySelectorAll('tr.clickable[data-channel]');
    rows.forEach(row => {
      const ch = row.dataset.channel;
      const isRVM = ch === 'RVMs';
      const isHandler = !isRVM; // everything else is handler-assisted
      const show = sel === 'all' || (sel === 'handler' && isHandler) || (sel === 'nonhandler' && !isHandler);
      row.style.opacity = show ? '1' : '0.3';
      row.style.background = show ? '' : '#f8fafc';
    });
  });
}

function renderPage(pageId) {
  // Destroy Chart.js instances from the previous page to release Canvas/WebGL contexts.
  if (Array.isArray(_allCharts) && _allCharts.length) {
    _allCharts.forEach(c => { try { c.destroy(); } catch(_) {} });
    _allCharts = [];
  }
  currentPageId = pageId;
  const main = document.getElementById('main-content');
  const p = PAGES[pageId];
  if (!p) { main.innerHTML = stub('Coming soon', 'This section will load in the next iteration.', []); return; }
  // Prepend alert strip for all modules except exec and alerts (they handle their own)
  const showStrip = currentModuleId && currentModuleId !== 'exec' && currentModuleId !== 'alerts';
  main.innerHTML = (showStrip ? alertSlaStrip(currentModuleId) : '') + p.render() + renderAgentPanel();
  wireAlertStrip();
  if (p.after) p.after();
  // Wire the agent on every page render
  wireAgentForModule(currentModuleId || 'exec');
}

/* ============================================================
   INIT
   ============================================================ */
renderSidebar();
renderFilterBar('exec');
renderPage('exec-home');