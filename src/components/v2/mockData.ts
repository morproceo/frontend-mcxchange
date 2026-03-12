// V2 MC Detail Page - All Mock Data
// Zero API connections - purely visual/UI

export interface V2CarrierData {
  mcNumber: string
  dotNumber: string
  legalName: string
  dbaName: string
  location: string
  address: string
  phone: string
  yearsActive: number
  powerUnits: number
  drivers: number
  mcs150Date: string
  registrantDate: string
  trustScore: number
  riskScore: number
  safetyRating: 'satisfactory' | 'conditional' | 'unsatisfactory' | 'not-rated'
  insuranceStatus: 'current' | 'expired' | 'pending'
  listingPrice: number
  description: string
  operatingStatus: 'authorized' | 'not-authorized' | 'pending'
  entityType: string
  cargoTypes: string[]
  amazonRelayScore: string
  highwaySetup: boolean
  sellingWithEmail: boolean
  sellingWithPhone: boolean
  ein: string
  emailDomain: string
  fax: string
  cellphone: string
  primaryContact: string
  secondaryContact: string
  mcs150Mileage: number
  authorityAgeDays: number
  totalRevocations: number
  daysSinceLastRevocation: number | null
  ownedTractors: number
  termLeasedTractors: number
  totalDriversCDL: number
  driversInterstate100mi: number
  driversInterstateBeyond100mi: number
  smartwayFlag: boolean
  carbtruFlag: boolean
  phmsaFlag: boolean
  carrierHealthScore: number
}

export interface V2AuthorityData {
  common: { status: 'active' | 'inactive' | 'revoked'; grantedDate: string; effectiveDate: string }
  contract: { status: 'active' | 'inactive' | 'revoked'; grantedDate: string; effectiveDate: string }
  broker: { status: 'active' | 'inactive' | 'revoked'; grantedDate: string; effectiveDate: string }
}

export interface V2AuthorityEvent {
  date: string
  event: string
  type: 'filed' | 'approved' | 'granted' | 'renewed' | 'warning' | 'revoked'
}

export interface V2BasicScore {
  name: string
  score: number
  threshold: number
  percentile: number
  description: string
}

export interface V2InspectionSummary {
  driverInspections: number
  vehicleInspections: number
  hazmatInspections: number
  driverOOSRate: number
  vehicleOOSRate: number
  hazmatOOSRate: number
  nationalDriverOOSRate: number
  nationalVehicleOOSRate: number
  nationalHazmatOOSRate: number
}

export interface V2CrashData {
  fatal: number
  injury: number
  towaway: number
  total: number
}

export interface V2InsurancePolicy {
  insurer: string
  policyNumber: string
  type: 'BIPD' | 'Cargo' | 'Bond' | 'General'
  coverage: number
  required: number
  status: 'active' | 'expired' | 'pending'
  effectiveDate: string
  expirationDate: string
}

export interface V2RenewalEvent {
  policyType: string
  date: string
  daysUntil: number
  urgency: 'low' | 'medium' | 'high' | 'critical'
}

export interface V2PolicyEvent {
  date: string
  event: string
  type: 'new' | 'renewed' | 'changed' | 'expired' | 'cancelled'
  policyType: string
}

export interface V2TruckData {
  vin: string
  year: number
  make: string
  model: string
  bodyClass: string
  gvwr: string
  inspections: number
  oosCount: number
}

export interface V2TrailerData {
  vin: string
  year: number
  make: string
  model: string
  type: string
  length: string
}

export interface V2VinInspection {
  vin: string
  date: string
  location: string
  type: 'driver' | 'vehicle' | 'both'
  result: 'pass' | 'oos' | 'warning'
  violations: number
}

export interface V2NetworkSignal {
  label: string
  status: 'positive' | 'neutral' | 'negative'
  detail: string
}

export interface V2BenchmarkData {
  metric: string
  carrierValue: number
  industryAvg: number
  unit: string
  lowerIsBetter: boolean
}

export interface V2DocumentItem {
  name: string
  status: 'verified' | 'pending' | 'missing'
  description: string
}

export interface V2InspectionViolation {
  category: string
  group: string
  description: string
  severity: number
  oos: boolean
}

export interface V2InspectionRecord {
  id: string
  date: string
  state: string
  type: string
  level: string
  violations: number
  oosViolations: number
  oos: boolean
  reportNumber: string
  fmcsaId: string
  violationDetails: V2InspectionViolation[]
}

export interface V2CrashRecord {
  id: string
  date: string
  state: string
  severity: string
  fatalities: number
  injuries: number
  hazmatRelease: boolean
  reportNumber: string
}

export interface V2ISSData {
  issScore: number
  riskLevel: 'Low' | 'Moderate' | 'High'
  issStatus: string
  category: string
  recommendation: string
  highRisk: boolean
}

// ===== MOCK DATA =====

export const mockCarrier: V2CarrierData = {
  mcNumber: 'MC-1234567',
  dotNumber: 'DOT-9876543',
  legalName: 'Mountain West Logistics LLC',
  dbaName: 'MW Logistics',
  location: 'Denver, CO',
  address: '4500 Market Street, Denver, CO 80216',
  phone: '(303) 555-0192',
  yearsActive: 8,
  powerUnits: 12,
  drivers: 15,
  mcs150Date: '2024-06-15',
  registrantDate: '2017-03-22',
  trustScore: 87,
  riskScore: 24,
  safetyRating: 'satisfactory',
  insuranceStatus: 'current',
  listingPrice: 45000,
  description: 'Well-established regional carrier with clean safety record and consistent Amazon Relay revenue. Fleet of 12 power units with experienced drivers. Includes all active contracts and customer relationships. Insurance current with excellent claims history. Perfect for an operator looking to expand into the Colorado/Rocky Mountain region.',
  operatingStatus: 'authorized',
  entityType: 'Carrier',
  cargoTypes: ['General Freight', 'Household Goods', 'Metal: sheets, coils, rolls', 'Motor Vehicles', 'Fresh Produce', 'Refrigerated Food'],
  amazonRelayScore: 'A',
  highwaySetup: true,
  sellingWithEmail: true,
  sellingWithPhone: true,
  ein: '84-1234567',
  emailDomain: 'mwlogistics.com',
  fax: '(303) 555-0193',
  cellphone: '(720) 555-0145',
  primaryContact: 'Sarah Mitchell',
  secondaryContact: 'James Rodriguez',
  mcs150Mileage: 1200000,
  authorityAgeDays: 2870,
  totalRevocations: 0,
  daysSinceLastRevocation: null,
  ownedTractors: 8,
  termLeasedTractors: 4,
  totalDriversCDL: 15,
  driversInterstate100mi: 6,
  driversInterstateBeyond100mi: 9,
  smartwayFlag: true,
  carbtruFlag: false,
  phmsaFlag: false,
  carrierHealthScore: 82,
}

export const mockAuthority: V2AuthorityData = {
  common: { status: 'active', grantedDate: '2017-05-10', effectiveDate: '2017-05-10' },
  contract: { status: 'active', grantedDate: '2018-01-15', effectiveDate: '2018-01-15' },
  broker: { status: 'inactive', grantedDate: '', effectiveDate: '' },
}

export const mockAuthorityHistory: V2AuthorityEvent[] = [
  { date: '2017-03-22', event: 'MC Application Filed', type: 'filed' },
  { date: '2017-04-15', event: 'Insurance Filed with FMCSA', type: 'approved' },
  { date: '2017-05-10', event: 'Common Authority Granted', type: 'granted' },
  { date: '2018-01-15', event: 'Contract Authority Granted', type: 'granted' },
  { date: '2020-06-01', event: 'Insurance Renewed - BIPD', type: 'renewed' },
  { date: '2022-06-01', event: 'Insurance Renewed - BIPD', type: 'renewed' },
  { date: '2024-06-01', event: 'Insurance Renewed - BIPD', type: 'renewed' },
  { date: '2024-06-15', event: 'MCS-150 Updated', type: 'renewed' },
]

export const mockBasicScores: V2BasicScore[] = [
  { name: 'Unsafe Driving', score: 32, threshold: 65, percentile: 32, description: 'Speeding, reckless driving, improper lane change' },
  { name: 'Hours-of-Service', score: 45, threshold: 65, percentile: 45, description: 'HOS compliance, logbook violations' },
  { name: 'Driver Fitness', score: 18, threshold: 80, percentile: 18, description: 'Physical qualification, licensing' },
  { name: 'Controlled Substances', score: 0, threshold: 80, percentile: 0, description: 'Drug/alcohol violations' },
  { name: 'Vehicle Maintenance', score: 55, threshold: 80, percentile: 55, description: 'Vehicle condition, maintenance violations' },
  { name: 'HM Compliance', score: 22, threshold: 80, percentile: 22, description: 'Hazardous materials handling' },
  { name: 'Crash Indicator', score: 38, threshold: 65, percentile: 38, description: 'State-reported crash history' },
]

export const mockInspections: V2InspectionSummary = {
  driverInspections: 42,
  vehicleInspections: 56,
  hazmatInspections: 8,
  driverOOSRate: 4.8,
  vehicleOOSRate: 18.2,
  hazmatOOSRate: 0,
  nationalDriverOOSRate: 5.51,
  nationalVehicleOOSRate: 20.72,
  nationalHazmatOOSRate: 4.5,
}

export const mockCrashes: V2CrashData = {
  fatal: 0,
  injury: 1,
  towaway: 2,
  total: 3,
}

export const mockInsurancePolicies: V2InsurancePolicy[] = [
  { insurer: 'Progressive Commercial', policyNumber: 'PC-2024-88712', type: 'BIPD', coverage: 1000000, required: 750000, status: 'active', effectiveDate: '2024-06-01', expirationDate: '2025-06-01' },
  { insurer: 'National Interstate', policyNumber: 'NI-2024-44521', type: 'Cargo', coverage: 250000, required: 100000, status: 'active', effectiveDate: '2024-07-01', expirationDate: '2025-07-01' },
  { insurer: 'Surety One Inc', policyNumber: 'SO-2024-10033', type: 'Bond', coverage: 75000, required: 75000, status: 'active', effectiveDate: '2024-01-01', expirationDate: '2027-01-01' },
]

export const mockRenewalTimeline: V2RenewalEvent[] = [
  { policyType: 'BIPD', date: '2025-06-01', daysUntil: 95, urgency: 'low' },
  { policyType: 'Cargo', date: '2025-07-01', daysUntil: 125, urgency: 'low' },
  { policyType: 'Bond', date: '2027-01-01', daysUntil: 675, urgency: 'low' },
]

export const mockPolicyHistory: V2PolicyEvent[] = [
  { date: '2024-07-01', event: 'Cargo Policy Renewed', type: 'renewed', policyType: 'Cargo' },
  { date: '2024-06-01', event: 'BIPD Policy Renewed', type: 'renewed', policyType: 'BIPD' },
  { date: '2024-01-01', event: 'Bond Renewed (3-year)', type: 'renewed', policyType: 'Bond' },
  { date: '2023-06-01', event: 'BIPD Policy Renewed', type: 'renewed', policyType: 'BIPD' },
  { date: '2023-05-15', event: 'Coverage Increased to $1M', type: 'changed', policyType: 'BIPD' },
  { date: '2022-06-01', event: 'BIPD Policy Renewed', type: 'renewed', policyType: 'BIPD' },
  { date: '2021-06-01', event: 'BIPD Policy Initial', type: 'new', policyType: 'BIPD' },
]

export const mockTrucks: V2TruckData[] = [
  { vin: '1FUJGLD**8L***901', year: 2022, make: 'Freightliner', model: 'Cascadia', bodyClass: 'Truck-Tractor', gvwr: '33,000 lbs', inspections: 6, oosCount: 0 },
  { vin: '1FUJGLD**9L***234', year: 2022, make: 'Freightliner', model: 'Cascadia', bodyClass: 'Truck-Tractor', gvwr: '33,000 lbs', inspections: 5, oosCount: 1 },
  { vin: '3AKJHHD**2K***567', year: 2021, make: 'Freightliner', model: 'Cascadia', bodyClass: 'Truck-Tractor', gvwr: '33,000 lbs', inspections: 8, oosCount: 0 },
  { vin: '1XKYD49**5J***890', year: 2020, make: 'Kenworth', model: 'T680', bodyClass: 'Truck-Tractor', gvwr: '33,000 lbs', inspections: 7, oosCount: 1 },
  { vin: '1XKYD49**6J***123', year: 2020, make: 'Kenworth', model: 'T680', bodyClass: 'Truck-Tractor', gvwr: '33,000 lbs', inspections: 4, oosCount: 0 },
  { vin: '2HSCEAM**0M***456', year: 2019, make: 'International', model: 'LT625', bodyClass: 'Truck-Tractor', gvwr: '33,000 lbs', inspections: 9, oosCount: 2 },
  { vin: '3HSDZTA**8N***789', year: 2021, make: 'International', model: 'LT625', bodyClass: 'Truck-Tractor', gvwr: '33,000 lbs', inspections: 5, oosCount: 0 },
  { vin: '1NPALU0**4N***012', year: 2023, make: 'Peterbilt', model: '579', bodyClass: 'Truck-Tractor', gvwr: '33,000 lbs', inspections: 3, oosCount: 0 },
  { vin: '1NPALU0**5N***345', year: 2023, make: 'Peterbilt', model: '579', bodyClass: 'Truck-Tractor', gvwr: '33,000 lbs', inspections: 2, oosCount: 0 },
  { vin: '5VXHA814**H***678', year: 2018, make: 'Volvo', model: 'VNL 860', bodyClass: 'Truck-Tractor', gvwr: '33,000 lbs', inspections: 11, oosCount: 3 },
  { vin: '5VXHA814**J***901', year: 2019, make: 'Volvo', model: 'VNL 860', bodyClass: 'Truck-Tractor', gvwr: '33,000 lbs', inspections: 8, oosCount: 1 },
  { vin: '1FUJGLD**1M***234', year: 2023, make: 'Freightliner', model: 'Cascadia', bodyClass: 'Truck-Tractor', gvwr: '33,000 lbs', inspections: 2, oosCount: 0 },
]

export const mockTrailers: V2TrailerData[] = [
  { vin: '1JJV532**KL**901', year: 2021, make: 'Wabash', model: 'DuraPlate HD', type: 'Dry Van', length: '53 ft' },
  { vin: '1JJV532**ML**234', year: 2022, make: 'Wabash', model: 'DuraPlate HD', type: 'Dry Van', length: '53 ft' },
  { vin: '1GRAA062**L***567', year: 2020, make: 'Great Dane', model: 'Champion SE', type: 'Dry Van', length: '53 ft' },
  { vin: '1GRAA062**M***890', year: 2021, make: 'Great Dane', model: 'Everest', type: 'Reefer', length: '53 ft' },
  { vin: '1UYVS253**N***123', year: 2022, make: 'Utility', model: '4000D-X', type: 'Reefer', length: '53 ft' },
  { vin: '1UYVS253**P***456', year: 2023, make: 'Utility', model: '4000D-X', type: 'Reefer', length: '53 ft' },
  { vin: '5JWNS533**L***789', year: 2019, make: 'Hyundai', model: 'Translead', type: 'Dry Van', length: '53 ft' },
  { vin: '1HTMSST**3K***012', year: 2020, make: 'Stoughton', model: 'Z-Plate', type: 'Dry Van', length: '53 ft' },
]

export const mockVinInspections: V2VinInspection[] = [
  { vin: '1FUJGLD**8L***901', date: '2024-11-15', location: 'Denver, CO', type: 'vehicle', result: 'pass', violations: 0 },
  { vin: '1FUJGLD**8L***901', date: '2024-08-22', location: 'Cheyenne, WY', type: 'both', result: 'pass', violations: 0 },
  { vin: '1XKYD49**5J***890', date: '2024-10-03', location: 'Salt Lake City, UT', type: 'vehicle', result: 'warning', violations: 1 },
  { vin: '5VXHA814**H***678', date: '2024-09-18', location: 'Denver, CO', type: 'vehicle', result: 'oos', violations: 2 },
  { vin: '2HSCEAM**0M***456', date: '2024-07-25', location: 'Pueblo, CO', type: 'both', result: 'oos', violations: 3 },
  { vin: '3AKJHHD**2K***567', date: '2024-11-01', location: 'Grand Junction, CO', type: 'driver', result: 'pass', violations: 0 },
  { vin: '1NPALU0**4N***012', date: '2024-10-20', location: 'Denver, CO', type: 'vehicle', result: 'pass', violations: 0 },
  { vin: '5VXHA814**J***901', date: '2024-06-15', location: 'Albuquerque, NM', type: 'vehicle', result: 'warning', violations: 1 },
]

export const mockNetworkSignals: V2NetworkSignal[] = [
  { label: 'Stable Insurance History', status: 'positive', detail: 'No coverage gaps in 7+ years' },
  { label: 'Consistent Fleet Size', status: 'positive', detail: 'Fleet maintained 10-14 units for 3+ years' },
  { label: 'Low Driver Turnover', status: 'positive', detail: 'Below-average driver churn signals stability' },
  { label: 'Clean Crash Record', status: 'positive', detail: 'Zero fatal crashes on record' },
  { label: 'Vehicle Age Mix', status: 'neutral', detail: 'Fleet avg year 2021 — within acceptable range' },
  { label: 'Single Region Concentration', status: 'neutral', detail: 'Primarily operates in Mountain West region' },
]

export const mockBenchmarks: V2BenchmarkData[] = [
  { metric: 'OOS Rate (Vehicle)', carrierValue: 18.2, industryAvg: 20.72, unit: '%', lowerIsBetter: true },
  { metric: 'OOS Rate (Driver)', carrierValue: 4.8, industryAvg: 5.51, unit: '%', lowerIsBetter: true },
  { metric: 'Crash Rate (per M miles)', carrierValue: 0.42, industryAvg: 0.68, unit: '', lowerIsBetter: true },
  { metric: 'Coverage Ratio (BIPD)', carrierValue: 133, industryAvg: 100, unit: '%', lowerIsBetter: false },
  { metric: 'Insurance Stability', carrierValue: 98, industryAvg: 82, unit: '%', lowerIsBetter: false },
]

export const mockDocuments: V2DocumentItem[] = [
  { name: 'Operating Authority (MC)', status: 'verified', description: 'FMCSA active MC authority confirmed' },
  { name: 'DOT Registration', status: 'verified', description: 'DOT number active and current' },
  { name: 'Insurance Certificate', status: 'verified', description: 'BIPD, Cargo, and Bond verified' },
  { name: 'Safety Rating', status: 'verified', description: 'Satisfactory rating confirmed' },
  { name: 'MCS-150 Filing', status: 'verified', description: 'Biennial update current' },
  { name: 'UCC Lien Search', status: 'verified', description: 'No active liens found' },
]

export const mockVerificationChecks = [
  { name: 'Carrier 411', status: 'clean' as const, detail: 'No negative reports' },
  { name: 'UCC Lien Search', status: 'clean' as const, detail: 'No active liens' },
  { name: 'SAFER Verified', status: 'clean' as const, detail: 'All data matches' },
  { name: 'Insurance Verified', status: 'clean' as const, detail: 'Active with FMCSA' },
]

// CarrierOk-style operations snapshot data
export interface V2StateInspection {
  state: string
  stateCode: string
  inspections: number
  oosCount: number
  oosRate: number
}

export interface V2OperationsSummary {
  totalInspections: number
  totalOOS: number
  overallOOSRate: number
  inspectionTrend: 'up' | 'down' | 'stable'
  trendPct: number
  topViolations: { category: string; count: number; severity: 'critical' | 'major' | 'minor' }[]
  operatingStates: V2StateInspection[]
  mileageEstimate: string
  inspectionsPer100k: number
  cleanInspectionRate: number
  lastInspectionDate: string
  averageViolationsPerInspection: number
}

export const mockOperations: V2OperationsSummary = {
  totalInspections: 106,
  totalOOS: 8,
  overallOOSRate: 7.5,
  inspectionTrend: 'down',
  trendPct: 12,
  topViolations: [
    { category: 'Lighting / Reflectors', count: 14, severity: 'minor' },
    { category: 'Brake Adjustment', count: 9, severity: 'major' },
    { category: 'Tire Condition', count: 7, severity: 'major' },
    { category: 'Hours of Service', count: 5, severity: 'critical' },
    { category: 'Cargo Securement', count: 3, severity: 'minor' },
  ],
  operatingStates: [
    { state: 'Colorado', stateCode: 'CO', inspections: 38, oosCount: 2, oosRate: 5.3 },
    { state: 'Wyoming', stateCode: 'WY', inspections: 22, oosCount: 1, oosRate: 4.5 },
    { state: 'Utah', stateCode: 'UT', inspections: 18, oosCount: 2, oosRate: 11.1 },
    { state: 'New Mexico', stateCode: 'NM', inspections: 14, oosCount: 1, oosRate: 7.1 },
    { state: 'Nebraska', stateCode: 'NE', inspections: 8, oosCount: 1, oosRate: 12.5 },
    { state: 'Kansas', stateCode: 'KS', inspections: 6, oosCount: 1, oosRate: 16.7 },
  ],
  mileageEstimate: '1.2M miles/yr',
  inspectionsPer100k: 8.8,
  cleanInspectionRate: 72.6,
  lastInspectionDate: '2024-11-15',
  averageViolationsPerInspection: 0.36,
}

// ===== NEW INTERFACES =====

export interface V2ViolationBreakdown {
  unsafeDriving: number
  hoursOfService: number
  vehicleMaintenance: number
  controlledSubstance: number
  driverFitness: number
  hazardousMaterials: number
}

export interface V2SharedEquipment {
  countSharedVins: number
  countSharedPowerUnits: number
  countSharedTrailers: number
  sharedVins: { vin: string; sharedWithDot: string; sharedWithName: string }[]
}

export interface V2AuthorityPending {
  commonPending: boolean
  commonReview: boolean
  contractPending: boolean
  contractReview: boolean
  brokerPending: boolean
  brokerReview: boolean
}

export interface V2BasicAlerts {
  unsafeDrivingAlert: boolean
  hoursOfServiceAlert: boolean
  driverFitnessAlert: boolean
  controlledSubstanceAlert: boolean
  vehicleMaintenanceAlert: boolean
  hazmatAlert: boolean
  crashIndicatorAlert: boolean
  unsafeDrivingOOSAlert: boolean
  hoursOfServiceOOSAlert: boolean
  vehicleMaintenanceOOSAlert: boolean
}

export interface V2ContactHistoryChange {
  date: string
  field: string
  oldValue: string
  newValue: string
  changeType: 'address' | 'phone' | 'name' | 'contact' | 'entity'
}

export interface V2ContactHistory {
  changes: V2ContactHistoryChange[]
}

export interface V2CargoCapabilities {
  generalFreight: boolean
  householdGoods: boolean
  metalSheets: boolean
  motorVehicles: boolean
  drivewayTowaway: boolean
  logsPolesBeams: boolean
  buildingMaterials: boolean
  mobileHomes: boolean
  machineryLargeObjects: boolean
  freshProduce: boolean
  liquids: boolean
  grainFeedHay: boolean
  coalCoke: boolean
  meat: boolean
  garbageRefuse: boolean
  usMailSeparate: boolean
  chemicals: boolean
  commoditiesDryBulk: boolean
  refrigeratedFood: boolean
  beverages: boolean
  paperProducts: boolean
  utilities: boolean
  farmSupplies: boolean
  construction: boolean
  waterWell: boolean
  intermodalContainers: boolean
  oilFieldEquipment: boolean
  livestock: boolean
  grainfeedHay: boolean
  coalCoke2: boolean
  passengers: boolean
}

export interface V2ComplianceFinancials {
  entryAuditCompleted: boolean
  hasFactoring: boolean
  factoringCompany: string
  factoringRate: number
}

export interface V2AvailableDocument {
  name: string
  available: boolean
}

// ===== NEW MOCK DATA =====

export const mockViolationBreakdown: V2ViolationBreakdown = {
  unsafeDriving: 4,
  hoursOfService: 5,
  vehicleMaintenance: 9,
  controlledSubstance: 0,
  driverFitness: 1,
  hazardousMaterials: 0,
}

export const mockSharedEquipment: V2SharedEquipment = {
  countSharedVins: 2,
  countSharedPowerUnits: 1,
  countSharedTrailers: 1,
  sharedVins: [
    { vin: '5VXHA814**H***678', sharedWithDot: 'DOT-3345678', sharedWithName: 'Rocky Mountain Express LLC' },
    { vin: '1JJV532**KL**901', sharedWithDot: 'DOT-7789012', sharedWithName: 'Front Range Hauling Inc' },
  ],
}

export const mockAuthorityPending: V2AuthorityPending = {
  commonPending: false,
  commonReview: false,
  contractPending: false,
  contractReview: false,
  brokerPending: true,
  brokerReview: false,
}

export const mockBasicAlerts: V2BasicAlerts = {
  unsafeDrivingAlert: false,
  hoursOfServiceAlert: true,
  driverFitnessAlert: false,
  controlledSubstanceAlert: false,
  vehicleMaintenanceAlert: true,
  hazmatAlert: false,
  crashIndicatorAlert: false,
  unsafeDrivingOOSAlert: false,
  hoursOfServiceOOSAlert: false,
  vehicleMaintenanceOOSAlert: true,
}

export const mockContactHistory: V2ContactHistory = {
  changes: [
    { date: '2024-09-15', field: 'Phone', oldValue: '(303) 555-0100', newValue: '(303) 555-0192', changeType: 'phone' },
    { date: '2023-06-01', field: 'Address', oldValue: '3200 Blake St, Denver, CO 80205', newValue: '4500 Market Street, Denver, CO 80216', changeType: 'address' },
    { date: '2022-01-10', field: 'Primary Contact', oldValue: 'John Williams', newValue: 'Sarah Mitchell', changeType: 'contact' },
    { date: '2020-03-15', field: 'DBA Name', oldValue: 'Mountain West Trucking', newValue: 'MW Logistics', changeType: 'name' },
  ],
}

export const mockCargoCapabilities: V2CargoCapabilities = {
  generalFreight: true,
  householdGoods: true,
  metalSheets: true,
  motorVehicles: true,
  drivewayTowaway: false,
  logsPolesBeams: false,
  buildingMaterials: true,
  mobileHomes: false,
  machineryLargeObjects: true,
  freshProduce: true,
  liquids: false,
  grainFeedHay: false,
  coalCoke: false,
  meat: true,
  garbageRefuse: false,
  usMailSeparate: false,
  chemicals: false,
  commoditiesDryBulk: false,
  refrigeratedFood: true,
  beverages: true,
  paperProducts: true,
  utilities: false,
  farmSupplies: false,
  construction: true,
  waterWell: false,
  intermodalContainers: true,
  oilFieldEquipment: false,
  livestock: false,
  grainfeedHay: false,
  coalCoke2: false,
  passengers: false,
}

export const mockComplianceFinancials: V2ComplianceFinancials = {
  entryAuditCompleted: true,
  hasFactoring: true,
  factoringCompany: 'OTR Capital',
  factoringRate: 2.5,
}

export const mockAvailableDocuments: V2AvailableDocument[] = [
  { name: 'Articles of Incorporation', available: true },
  { name: 'EIN Letter', available: true },
  { name: 'Driver License (Owner)', available: true },
  { name: 'Certificate of Insurance (COI)', available: true },
  { name: 'Loss Run Report', available: false },
  { name: 'Letter of Release (LOR)', available: false },
]

// ===== CARRIER OK FEATURES — NEW INTERFACES & DATA =====

export interface V2MonitoringAlert {
  id: string
  date: string
  type: 'authority' | 'insurance' | 'violation' | 'oos' | 'crash' | 'contact'
  severity: 'critical' | 'warning' | 'info'
  title: string
  detail: string
  resolved: boolean
}

export interface V2RiskScoreTrend {
  month: string
  trustScore: number
  riskScore: number
}

export interface V2InsuranceGap {
  policyType: string
  gapStart: string
  gapEnd: string | null
  daysGap: number
  status: 'resolved' | 'active'
}

export interface V2ViolationTrend {
  month: string
  violations: number
  oosEvents: number
}

export interface V2RelatedCarrier {
  mcNumber: string
  dotNumber: string
  legalName: string
  sharedField: 'address' | 'phone' | 'ein' | 'contact' | 'vin'
  status: 'active' | 'inactive' | 'revoked'
  powerUnits: number
}

export interface V2CarrierPercentile {
  metric: string
  carrierValue: number
  percentile: number
  category: 'safety' | 'compliance' | 'fleet' | 'financial'
}

export const mockMonitoringAlerts: V2MonitoringAlert[] = [
  { id: 'ma-1', date: '2024-11-20', type: 'violation', severity: 'warning', title: 'New Vehicle Maintenance Violation', detail: 'Brake adjustment violation recorded during inspection in Cheyenne, WY', resolved: false },
  { id: 'ma-2', date: '2024-10-15', type: 'insurance', severity: 'info', title: 'Insurance Policy Renewed', detail: 'BIPD policy renewed with Progressive Commercial — coverage maintained at $1M', resolved: true },
  { id: 'ma-3', date: '2024-09-18', type: 'oos', severity: 'critical', title: 'Vehicle Out of Service', detail: 'VIN 5VXHA814**H***678 placed OOS in Denver, CO — 2 violations', resolved: true },
  { id: 'ma-4', date: '2024-08-01', type: 'authority', severity: 'info', title: 'Broker Authority Application Filed', detail: 'New broker authority application submitted to FMCSA', resolved: false },
  { id: 'ma-5', date: '2024-06-15', type: 'contact', severity: 'info', title: 'MCS-150 Updated', detail: 'Biennial update filed — mileage and driver count updated', resolved: true },
  { id: 'ma-6', date: '2024-05-10', type: 'crash', severity: 'warning', title: 'Towaway Crash Reported', detail: 'Non-injury towaway crash reported on I-70 near Grand Junction, CO', resolved: true },
]

export const mockRiskScoreTrend: V2RiskScoreTrend[] = [
  { month: '2024-01', trustScore: 82, riskScore: 30 },
  { month: '2024-02', trustScore: 83, riskScore: 29 },
  { month: '2024-03', trustScore: 84, riskScore: 27 },
  { month: '2024-04', trustScore: 84, riskScore: 28 },
  { month: '2024-05', trustScore: 82, riskScore: 31 },
  { month: '2024-06', trustScore: 85, riskScore: 26 },
  { month: '2024-07', trustScore: 86, riskScore: 25 },
  { month: '2024-08', trustScore: 85, riskScore: 26 },
  { month: '2024-09', trustScore: 83, riskScore: 29 },
  { month: '2024-10', trustScore: 85, riskScore: 25 },
  { month: '2024-11', trustScore: 86, riskScore: 24 },
  { month: '2024-12', trustScore: 87, riskScore: 24 },
]

export const mockInsuranceGaps: V2InsuranceGap[] = [
  { policyType: 'Cargo', gapStart: '2021-07-01', gapEnd: '2021-07-15', daysGap: 14, status: 'resolved' },
  { policyType: 'Bond', gapStart: '2020-01-05', gapEnd: '2020-01-12', daysGap: 7, status: 'resolved' },
]

export const mockViolationTrend: V2ViolationTrend[] = [
  { month: '2023-01', violations: 2, oosEvents: 0 },
  { month: '2023-02', violations: 1, oosEvents: 0 },
  { month: '2023-03', violations: 3, oosEvents: 1 },
  { month: '2023-04', violations: 0, oosEvents: 0 },
  { month: '2023-05', violations: 2, oosEvents: 0 },
  { month: '2023-06', violations: 1, oosEvents: 0 },
  { month: '2023-07', violations: 4, oosEvents: 1 },
  { month: '2023-08', violations: 2, oosEvents: 0 },
  { month: '2023-09', violations: 1, oosEvents: 0 },
  { month: '2023-10', violations: 3, oosEvents: 1 },
  { month: '2023-11', violations: 0, oosEvents: 0 },
  { month: '2023-12', violations: 2, oosEvents: 0 },
  { month: '2024-01', violations: 1, oosEvents: 0 },
  { month: '2024-02', violations: 2, oosEvents: 0 },
  { month: '2024-03', violations: 0, oosEvents: 0 },
  { month: '2024-04', violations: 3, oosEvents: 1 },
  { month: '2024-05', violations: 1, oosEvents: 0 },
  { month: '2024-06', violations: 2, oosEvents: 0 },
  { month: '2024-07', violations: 1, oosEvents: 0 },
  { month: '2024-08', violations: 4, oosEvents: 2 },
  { month: '2024-09', violations: 2, oosEvents: 1 },
  { month: '2024-10', violations: 1, oosEvents: 0 },
  { month: '2024-11', violations: 2, oosEvents: 0 },
  { month: '2024-12', violations: 0, oosEvents: 0 },
]

export const mockRelatedCarriers: V2RelatedCarrier[] = [
  { mcNumber: 'MC-8876543', dotNumber: 'DOT-3345678', legalName: 'Rocky Mountain Express LLC', sharedField: 'vin', status: 'active', powerUnits: 6 },
  { mcNumber: 'MC-7765432', dotNumber: 'DOT-7789012', legalName: 'Front Range Hauling Inc', sharedField: 'vin', status: 'active', powerUnits: 4 },
  { mcNumber: 'MC-5543210', dotNumber: 'DOT-1122334', legalName: 'MW Transport Services LLC', sharedField: 'address', status: 'inactive', powerUnits: 0 },
]

export const mockCarrierPercentiles: V2CarrierPercentile[] = [
  { metric: 'Safety Rating', carrierValue: 88, percentile: 82, category: 'safety' },
  { metric: 'Insurance Coverage', carrierValue: 95, percentile: 91, category: 'financial' },
  { metric: 'Fleet Condition', carrierValue: 72, percentile: 65, category: 'fleet' },
  { metric: 'Compliance Score', carrierValue: 90, percentile: 85, category: 'compliance' },
  { metric: 'Driver Safety', carrierValue: 85, percentile: 78, category: 'safety' },
  { metric: 'Authority Stability', carrierValue: 98, percentile: 95, category: 'compliance' },
  { metric: 'Claims History', carrierValue: 92, percentile: 88, category: 'financial' },
  { metric: 'Fleet Age Score', carrierValue: 68, percentile: 55, category: 'fleet' },
]

// ISS (Inspection Selection System) data
export const mockISSData: V2ISSData = {
  issScore: 62,
  riskLevel: 'Moderate' as const,
  issStatus: 'Pass',
  category: 'Carrier',
  recommendation: 'Standard',
  highRisk: false,
}

// Individual inspection records with violation details
export const mockInspectionRecords: V2InspectionRecord[] = [
  {
    id: 'INS-001', date: '2024-11-15', state: 'CO', type: 'Vehicle', level: 'Level 1 - Full',
    violations: 0, oosViolations: 0, oos: false,
    reportNumber: 'COCSE003341', fmcsaId: '84440053',
    violationDetails: [],
  },
  {
    id: 'INS-002', date: '2024-10-22', state: 'WY', type: 'Driver', level: 'Level 3 - Driver Only',
    violations: 1, oosViolations: 0, oos: false,
    reportNumber: 'WYFRF000934', fmcsaId: '84312847',
    violationDetails: [
      { category: 'Hours-of-Service', group: 'HOS', description: 'Operating a CMV while ill or fatigued', severity: 5, oos: false },
    ],
  },
  {
    id: 'INS-003', date: '2024-09-08', state: 'UT', type: 'Vehicle', level: 'Level 2 - Walk-Around',
    violations: 2, oosViolations: 1, oos: true,
    reportNumber: 'UT1026012346', fmcsaId: '84189502',
    violationDetails: [
      { category: 'Vehicle Maintenance', group: 'Suspension', description: 'Suspension - Axle positioning part cracked/broken/loose/missing resulting in axl...', severity: 9, oos: true },
      { category: 'Vehicle Maintenance', group: 'Lighting', description: 'Lighting - Headlamp(s) fail to operate on low and high beam.', severity: 6, oos: false },
    ],
  },
  {
    id: 'INS-004', date: '2024-08-14', state: 'CO', type: 'HazMat', level: 'Level 6 - Enhanced',
    violations: 0, oosViolations: 0, oos: false,
    reportNumber: 'COCSE055102', fmcsaId: '84055102',
    violationDetails: [],
  },
  {
    id: 'INS-005', date: '2024-07-03', state: 'NM', type: 'Vehicle', level: 'Level 2 - Walk-Around',
    violations: 1, oosViolations: 0, oos: false,
    reportNumber: 'NM1031829', fmcsaId: '83921045',
    violationDetails: [
      { category: 'Vehicle Maintenance', group: 'Tires', description: 'Tire - Flat and/or audible air leak.', severity: 8, oos: false },
    ],
  },
  {
    id: 'INS-006', date: '2024-05-19', state: 'CO', type: 'Driver', level: 'Level 3 - Driver Only',
    violations: 3, oosViolations: 1, oos: true,
    reportNumber: 'COCSE044712', fmcsaId: '83744712',
    violationDetails: [
      { category: 'Hours-of-Service', group: 'Log', description: 'Driver\'s record of duty status not current.', severity: 7, oos: true },
      { category: 'Hours-of-Service', group: 'HOS', description: 'Driving beyond 11-hour driving limit.', severity: 7, oos: false },
      { category: 'Driver Fitness', group: 'License', description: 'Operating a CMV without proper endorsement.', severity: 4, oos: false },
    ],
  },
]

// Individual crash records
export const mockCrashRecords: V2CrashRecord[] = [
  { id: 'CRA-001', date: '2024-06-12', state: 'WY', severity: 'Towaway', fatalities: 0, injuries: 0, hazmatRelease: false, reportNumber: 'WY2024-CR-0284' },
  { id: 'CRA-002', date: '2023-11-30', state: 'CO', severity: 'Injury', fatalities: 0, injuries: 1, hazmatRelease: false, reportNumber: 'CO2023-CR-1847' },
  { id: 'CRA-003', date: '2023-03-15', state: 'UT', severity: 'Towaway', fatalities: 0, injuries: 0, hazmatRelease: false, reportNumber: 'UT2023-CR-0592' },
]

// Helper: get status color config
export type StatusLevel = 'excellent' | 'good' | 'fair' | 'warning' | 'danger'

export function getStatusLevel(type: string, value: number | string): StatusLevel {
  switch (type) {
    case 'trust':
      if (typeof value === 'number') {
        if (value >= 80) return 'excellent'
        if (value >= 60) return 'good'
        if (value >= 40) return 'fair'
        if (value >= 20) return 'warning'
        return 'danger'
      }
      return 'fair'
    case 'risk':
      if (typeof value === 'number') {
        if (value <= 29) return 'excellent'
        if (value <= 49) return 'good'
        if (value <= 69) return 'fair'
        if (value <= 84) return 'warning'
        return 'danger'
      }
      return 'fair'
    case 'safety':
      if (value === 'satisfactory') return 'excellent'
      if (value === 'conditional') return 'fair'
      if (value === 'unsatisfactory') return 'danger'
      return 'fair'
    case 'insurance':
      if (value === 'current') return 'excellent'
      if (value === 'pending') return 'warning'
      return 'danger'
    case 'authority':
      if (value === 'authorized' || value === 'active') return 'excellent'
      if (value === 'pending' || value === 'inactive') return 'warning'
      return 'danger'
    case 'basic':
      if (typeof value === 'number') {
        if (value <= 25) return 'excellent'
        if (value <= 40) return 'good'
        if (value <= 60) return 'fair'
        if (value <= 75) return 'warning'
        return 'danger'
      }
      return 'fair'
    default:
      return 'fair'
  }
}

export const statusColors: Record<StatusLevel, { bg: string; text: string; border: string; fill: string; ring: string }> = {
  excellent: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', fill: '#10b981', ring: 'ring-emerald-500' },
  good: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', fill: '#22c55e', ring: 'ring-green-500' },
  fair: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', fill: '#eab308', ring: 'ring-yellow-500' },
  warning: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', fill: '#f97316', ring: 'ring-orange-500' },
  danger: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', fill: '#ef4444', ring: 'ring-red-500' },
}
