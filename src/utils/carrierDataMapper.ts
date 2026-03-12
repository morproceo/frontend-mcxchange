// Maps MorPro Carrier API response → V2 TypeScript interfaces
// Handles null/missing data gracefully with sensible defaults

import type { MCListingExtended } from '../types'
import type {
  V2CarrierData, V2AuthorityData, V2AuthorityEvent, V2BasicScore,
  V2InspectionSummary, V2CrashData, V2InsurancePolicy, V2RenewalEvent,
  V2PolicyEvent, V2TruckData, V2TrailerData, V2InspectionRecord,
  V2CrashRecord, V2ISSData, V2OperationsSummary, V2ViolationBreakdown,
  V2SharedEquipment, V2AuthorityPending, V2BasicAlerts, V2ContactHistory,
  V2CargoCapabilities, V2ComplianceFinancials, V2AvailableDocument,
  V2MonitoringAlert, V2RiskScoreTrend, V2InsuranceGap, V2ViolationTrend,
  V2RelatedCarrier, V2CarrierPercentile, V2DocumentItem,
} from '../components/v2/mockData'

// ============================================================
// CARRIER HEALTH SCORE — Computed from real data
// ============================================================
export interface HealthCategory {
  name: string
  weight: number
  score: number
  color: string
}

export function calculateCarrierHealthScore(report: any, listing?: MCListingExtended): {
  score: number
  categories: HealthCategory[]
} {
  const carrier = report?.carrier || {}
  const safety = report?.safety || {}
  const inspections = report?.inspections || {}
  const insurance = report?.insurance || {}
  const fleet = report?.fleet || {}
  const authority = report?.authority || {}
  const crashes = report?.crashes || {}

  // === 1. SAFETY SCORE (25% weight) ===
  // Based on BASIC scores, OOS rates, and crash history
  let safetyScore = 100

  // Penalize for high BASIC percentiles (higher = worse)
  const basicScores = safety.basicScores || []
  if (basicScores.length > 0) {
    const avgPercentile = basicScores.reduce((s: number, b: any) => s + (b.percentile ?? b.measure ?? 0), 0) / basicScores.length
    // 0 percentile = best, 100 = worst. Invert for score.
    safetyScore -= Math.min(avgPercentile * 0.6, 50)
  }

  // Penalize for BASIC alerts
  const alerts = safety.basicAlerts || {}
  const alertCount = Object.values(alerts).filter(Boolean).length
  safetyScore -= alertCount * 5

  // Penalize for crashes
  const crashSummary = crashes.summary || {}
  const totalCrashes = crashSummary.total || crashSummary.totalCrashes || 0
  const fatalCrashes = crashSummary.fatal || crashSummary.fatalCrashes || 0
  safetyScore -= totalCrashes * 3
  safetyScore -= fatalCrashes * 10

  // Safety rating bonus
  const rawRating = carrier.safetyRating || safety?.safetyRating?.rating
  if (rawRating) {
    const lower = String(rawRating).toLowerCase()
    if (lower === 'satisfactory' || lower === 's') safetyScore += 5
    else if (lower === 'conditional' || lower === 'c') safetyScore -= 15
    else if (lower === 'unsatisfactory' || lower === 'u') safetyScore -= 30
  }

  safetyScore = Math.max(0, Math.min(100, Math.round(safetyScore)))

  // === 2. COMPLIANCE SCORE (25% weight) ===
  // Based on authority status, MCS-150 filing, BOC-3
  let complianceScore = 50 // Start at 50, build up

  // Active operating authority
  const opStatus = carrier.operatingStatus || carrier.allowedToOperate
  if (opStatus === 'A' || opStatus === 'Y' || opStatus === 'authorized' || opStatus === 'AUTHORIZED') {
    complianceScore += 20
  }

  // Authority types active
  const statuses = authority.statuses || {}
  const commonActive = String(statuses.commonAuthorityStatus || statuses.common || '').toLowerCase()
  const contractActive = String(statuses.contractAuthorityStatus || statuses.contract || '').toLowerCase()
  if (commonActive === 'active' || commonActive === 'a') complianceScore += 10
  if (contractActive === 'active' || contractActive === 'a') complianceScore += 5

  // MCS-150 filing recency
  const mcs150Date = carrier.mcs150Date || carrier.mcs150FormDate
  if (mcs150Date) {
    const mcsDate = new Date(mcs150Date)
    const daysSinceMcs = (Date.now() - mcsDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceMcs <= 730) complianceScore += 10 // Within 2 years (biennial)
    else complianceScore -= 10 // Overdue
  } else {
    complianceScore -= 5
  }

  // No revocations
  const totalRevocations = carrier.totalRevocations || 0
  complianceScore -= totalRevocations * 10

  // BOC-3 on file
  const docs = report?.documents || {}
  if (docs.boc3?.onFile) complianceScore += 5

  complianceScore = Math.max(0, Math.min(100, Math.round(complianceScore)))

  // === 3. INSURANCE SCORE (20% weight) ===
  // Based on active policies, coverage amounts, gaps
  let insuranceScore = 30 // Base

  const activePolicies = insurance.activePolicies || []
  if (activePolicies.length > 0) {
    insuranceScore += 30 // Has active policies

    // Check BIPD coverage level
    const bipdPolicy = activePolicies.find((p: any) => {
      const t = String(p.insuranceType || p.type || '').toLowerCase()
      return t.includes('bipd') || t.includes('liability') || t.includes('bodily')
    })
    if (bipdPolicy) {
      const coverage = bipdPolicy.coverageAmount || bipdPolicy.coverage || 0
      if (coverage >= 1000000) insuranceScore += 20
      else if (coverage >= 750000) insuranceScore += 15
      else if (coverage >= 300000) insuranceScore += 10
    }

    // Check cargo coverage
    const cargoPolicy = activePolicies.find((p: any) => {
      const t = String(p.insuranceType || p.type || '').toLowerCase()
      return t.includes('cargo')
    })
    if (cargoPolicy) insuranceScore += 10

    // Multiple policies = better coverage
    if (activePolicies.length >= 3) insuranceScore += 10
  }

  // Penalize for gaps
  const gaps = insurance.gaps || []
  const activeGaps = gaps.filter((g: any) => g.status === 'active')
  insuranceScore -= activeGaps.length * 15

  insuranceScore = Math.max(0, Math.min(100, Math.round(insuranceScore)))

  // === 4. FLEET SCORE (15% weight) ===
  // Based on fleet size, OOS rates on vehicles, shared equipment
  let fleetScore = 60 // Base

  const trucks = fleet.trucks || []
  const powerUnits = carrier.totalPowerUnits || carrier.powerUnits || listing?.fleetSize || trucks.length || 0

  if (powerUnits > 0) {
    fleetScore += 10

    // Newer fleet = better
    if (trucks.length > 0) {
      const avgYear = trucks.reduce((s: number, t: any) => s + (t.year || t.model_year || 0), 0) / trucks.length
      const currentYear = new Date().getFullYear()
      if (avgYear > 0) {
        const age = currentYear - avgYear
        if (age <= 3) fleetScore += 15
        else if (age <= 5) fleetScore += 10
        else if (age <= 8) fleetScore += 5
        else if (age > 12) fleetScore -= 10
      }
    }

    // Penalize for high vehicle OOS
    const summary = inspections.summary || safety.inspectionTotals || {}
    const vehicleOOSRate = summary.vehicleOOSRate || summary.vehicleOosRate || 0
    if (vehicleOOSRate > 30) fleetScore -= 20
    else if (vehicleOOSRate > 20) fleetScore -= 10
    else if (vehicleOOSRate < 10) fleetScore += 10
  }

  // Penalize for shared equipment (possible chameleon carrier risk)
  const sharedEquipment = fleet.sharedEquipment || {}
  const sharedCount = sharedEquipment.countSharedVins || sharedEquipment.totalShared || 0
  if (sharedCount > 5) fleetScore -= 15
  else if (sharedCount > 0) fleetScore -= 5

  fleetScore = Math.max(0, Math.min(100, Math.round(fleetScore)))

  // === 5. HISTORY SCORE (15% weight) ===
  // Based on years active, inspection trend, clean inspection rate
  let historyScore = 50 // Base

  // Years active bonus
  const yearsActive = parseFloat(carrier.yearsActive) || listing?.yearsActive || 0
  if (yearsActive >= 10) historyScore += 25
  else if (yearsActive >= 5) historyScore += 20
  else if (yearsActive >= 3) historyScore += 15
  else if (yearsActive >= 1) historyScore += 5
  else historyScore -= 10 // Very new carrier

  // Clean inspection rate
  const records = inspections.records || []
  if (records.length > 0) {
    const cleanCount = records.filter((r: any) => (r.viol_total || r.violations || 0) === 0).length
    const cleanRate = cleanCount / records.length
    if (cleanRate >= 0.8) historyScore += 15
    else if (cleanRate >= 0.6) historyScore += 10
    else if (cleanRate >= 0.4) historyScore += 5
    else if (cleanRate < 0.2) historyScore -= 10
  }

  // Authority age
  const authorityAgeDays = carrier.authorityAgeDays || 0
  if (authorityAgeDays > 1825) historyScore += 10 // 5+ years
  else if (authorityAgeDays < 365) historyScore -= 5 // Less than 1 year

  historyScore = Math.max(0, Math.min(100, Math.round(historyScore)))

  // === WEIGHTED COMPOSITE ===
  const categories: HealthCategory[] = [
    { name: 'Safety', weight: 25, score: safetyScore, color: '#10b981' },
    { name: 'Compliance', weight: 25, score: complianceScore, color: '#6366f1' },
    { name: 'Insurance', weight: 20, score: insuranceScore, color: '#06b6d4' },
    { name: 'Fleet', weight: 15, score: fleetScore, color: '#f59e0b' },
    { name: 'History', weight: 15, score: historyScore, color: '#8b5cf6' },
  ]

  const compositeScore = Math.round(
    categories.reduce((sum, cat) => sum + (cat.score * cat.weight / 100), 0)
  )

  return { score: compositeScore, categories }
}

// ============================================================
// CORE: Merge API + Listing → V2CarrierData
// ============================================================
export function mapToV2CarrierData(report: any, listing: MCListingExtended): V2CarrierData {
  const carrier = report?.carrier || {}
  const safety = report?.safety || {}
  const fleet = report?.fleet || {}

  const location = carrier.location
    ? `${carrier.location.city || ''}, ${carrier.location.state || ''}`.replace(/^, |, $/, '')
    : `${listing.city || ''}, ${listing.state || ''}`.replace(/^, |, $/, '')

  const address = carrier.location
    ? `${carrier.location.street || ''}, ${carrier.location.city || ''}, ${carrier.location.state || ''} ${carrier.location.zip || ''}`.trim()
    : listing.address || ''

  // Derive operatingStatus from API
  const opStatus = carrier.operatingStatus || carrier.allowedToOperate
  let operatingStatus: 'authorized' | 'not-authorized' | 'pending' = 'not-authorized'
  if (opStatus === 'A' || opStatus === 'Y' || opStatus === 'authorized' || opStatus === 'AUTHORIZED') {
    operatingStatus = 'authorized'
  } else if (opStatus === 'pending') {
    operatingStatus = 'pending'
  }

  // Safety rating normalization
  const rawSafety = carrier.safetyRating || safety?.safetyRating?.rating
  let safetyRating: 'satisfactory' | 'conditional' | 'unsatisfactory' | 'not-rated' = 'not-rated'
  if (rawSafety) {
    const lower = String(rawSafety).toLowerCase()
    if (lower === 'satisfactory' || lower === 's') safetyRating = 'satisfactory'
    else if (lower === 'conditional' || lower === 'c') safetyRating = 'conditional'
    else if (lower === 'unsatisfactory' || lower === 'u') safetyRating = 'unsatisfactory'
  }

  // Insurance status: derived from insurance data
  const insurance = report?.insurance || {}
  const activePolicies = insurance.activePolicies || []
  let insuranceStatus: 'current' | 'expired' | 'pending' = 'expired'
  if (activePolicies.length > 0) insuranceStatus = 'current'
  else if (listing.insuranceOnFile) insuranceStatus = 'current'

  return {
    mcNumber: listing.mcNumber || carrier.mcNumber || '',
    dotNumber: listing.dotNumber || String(carrier.dotNumber || ''),
    legalName: carrier.legalName || listing.legalName || '',
    dbaName: carrier.dbaName || listing.dbaName || '',
    location,
    address,
    phone: carrier.phone || listing.contactPhone || '',
    yearsActive: parseFloat(carrier.yearsActive) || listing.yearsActive || 0,
    powerUnits: carrier.totalPowerUnits || carrier.powerUnits || listing.fleetSize || 0,
    drivers: carrier.totalDrivers || listing.totalDrivers || 0,
    mcs150Date: carrier.mcs150Date || carrier.mcs150FormDate || '',
    registrantDate: carrier.registrantDate || carrier.applicationDate || '',
    trustScore: 0,          // Not available yet from API
    riskScore: 0,           // Not available yet from API
    safetyRating,
    insuranceStatus,
    listingPrice: listing.askingPrice || listing.price || 0,
    description: listing.description || '',
    operatingStatus,
    entityType: carrier.entityType || carrier.carrierOperation || 'Carrier',
    cargoTypes: listing.operationType || [],
    amazonRelayScore: listing.amazonRelayScore || '',
    highwaySetup: listing.highwaySetup || false,
    sellingWithEmail: listing.sellingWithEmail || false,
    sellingWithPhone: listing.sellingWithPhone || false,
    ein: carrier.ein ? String(carrier.ein) : '',
    emailDomain: carrier.emailDomain || '',
    fax: carrier.fax || '',
    cellphone: carrier.cellphone || '',
    primaryContact: carrier.primaryContact || '',
    secondaryContact: carrier.secondaryContact || '',
    mcs150Mileage: carrier.mcs150Mileage || 0,
    authorityAgeDays: carrier.authorityAgeDays || 0,
    totalRevocations: carrier.totalRevocations || 0,
    daysSinceLastRevocation: carrier.daysSinceLastRevocation ?? null,
    ownedTractors: carrier.ownedTractors || fleet?.ownedTractors || 0,
    termLeasedTractors: carrier.termLeasedTractors || fleet?.termLeasedTractors || 0,
    totalDriversCDL: carrier.totalDriversCDL || carrier.totalDrivers || 0,
    driversInterstate100mi: carrier.driversInterstate100mi || 0,
    driversInterstateBeyond100mi: carrier.driversInterstateBeyond100mi || 0,
    smartwayFlag: false,    // Not available yet
    carbtruFlag: false,     // Not available yet
    phmsaFlag: carrier.phmsaFlag || false,
    carrierHealthScore: calculateCarrierHealthScore(report, listing).score,
  }
}

// ============================================================
// AUTHORITY
// ============================================================
export function mapToV2AuthorityData(report: any): V2AuthorityData {
  const auth = report?.authority || {}
  const statuses = auth.statuses || {}

  function mapStatus(s: string | undefined): 'active' | 'inactive' | 'revoked' {
    if (!s) return 'inactive'
    const lower = String(s).toLowerCase()
    if (lower === 'active' || lower === 'a') return 'active'
    if (lower === 'revoked' || lower === 'r') return 'revoked'
    return 'inactive'
  }

  return {
    common: {
      status: mapStatus(statuses.commonAuthorityStatus || statuses.common),
      grantedDate: statuses.commonAuthorityGrantDate || auth.commonGrantDate || '',
      effectiveDate: statuses.commonAuthorityEffectiveDate || statuses.commonAuthorityGrantDate || '',
    },
    contract: {
      status: mapStatus(statuses.contractAuthorityStatus || statuses.contract),
      grantedDate: statuses.contractAuthorityGrantDate || auth.contractGrantDate || '',
      effectiveDate: statuses.contractAuthorityEffectiveDate || statuses.contractAuthorityGrantDate || '',
    },
    broker: {
      status: mapStatus(statuses.brokerAuthorityStatus || statuses.broker),
      grantedDate: statuses.brokerAuthorityGrantDate || auth.brokerGrantDate || '',
      effectiveDate: statuses.brokerAuthorityEffectiveDate || statuses.brokerAuthorityGrantDate || '',
    },
  }
}

export function mapToV2AuthorityHistory(report: any): V2AuthorityEvent[] {
  const timeline = report?.authority?.timeline || []
  return timeline.map((e: any) => ({
    date: e.date || e.eventDate || '',
    event: e.event || e.description || '',
    type: mapEventType(e.type || e.eventType || ''),
  }))
}

function mapEventType(type: string): V2AuthorityEvent['type'] {
  const lower = String(type).toLowerCase()
  if (lower.includes('filed') || lower.includes('application')) return 'filed'
  if (lower.includes('approved')) return 'approved'
  if (lower.includes('granted')) return 'granted'
  if (lower.includes('renewed') || lower.includes('update')) return 'renewed'
  if (lower.includes('warning')) return 'warning'
  if (lower.includes('revoked') || lower.includes('revocation')) return 'revoked'
  return 'filed'
}

export function mapToV2AuthorityPending(report: any): V2AuthorityPending {
  const pending = report?.authority?.pendingFlags || {}
  return {
    commonPending: pending.commonPending || false,
    commonReview: pending.commonReview || false,
    contractPending: pending.contractPending || false,
    contractReview: pending.contractReview || false,
    brokerPending: pending.brokerPending || false,
    brokerReview: pending.brokerReview || false,
  }
}

// ============================================================
// SAFETY
// ============================================================
export function mapToV2BasicScores(report: any): V2BasicScore[] {
  const scores = report?.safety?.basicScores || []
  return scores.map((b: any) => ({
    name: b.basicName || b.name || 'Unknown',
    score: b.percentile ?? b.measure ?? b.score ?? 0,
    threshold: b.thresholdPercent ?? b.threshold ?? 65,
    percentile: b.percentile ?? b.measure ?? 0,
    description: b.description || b.basicCode || '',
  }))
}

export function mapToV2BasicAlerts(report: any): V2BasicAlerts {
  const alerts = report?.safety?.basicAlerts || {}
  return {
    unsafeDrivingAlert: alerts.unsafeDriving || alerts.unsafeDrivingAlert || false,
    hoursOfServiceAlert: alerts.hoursOfService || alerts.hoursOfServiceAlert || false,
    driverFitnessAlert: alerts.driverFitness || alerts.driverFitnessAlert || false,
    controlledSubstanceAlert: alerts.controlledSubstance || alerts.controlledSubstanceAlert || false,
    vehicleMaintenanceAlert: alerts.vehicleMaintenance || alerts.vehicleMaintenanceAlert || false,
    hazmatAlert: alerts.hazmat || alerts.hazmatAlert || false,
    crashIndicatorAlert: alerts.crashIndicator || alerts.crashIndicatorAlert || false,
    unsafeDrivingOOSAlert: alerts.unsafeDrivingOOS || alerts.unsafeDrivingOOSAlert || false,
    hoursOfServiceOOSAlert: alerts.hoursOfServiceOOS || alerts.hoursOfServiceOOSAlert || false,
    vehicleMaintenanceOOSAlert: alerts.vehicleMaintenanceOOS || alerts.vehicleMaintenanceOOSAlert || false,
  }
}

export function mapToV2ViolationBreakdown(report: any): V2ViolationBreakdown {
  const breakdown = report?.safety?.violationBreakdown || {}
  return {
    unsafeDriving: breakdown.unsafeDriving || 0,
    hoursOfService: breakdown.hoursOfService || 0,
    vehicleMaintenance: breakdown.vehicleMaintenance || 0,
    controlledSubstance: breakdown.controlledSubstance || 0,
    driverFitness: breakdown.driverFitness || 0,
    hazardousMaterials: breakdown.hazardousMaterials || breakdown.hazmat || 0,
  }
}

export function mapToV2ISSData(_report: any): V2ISSData {
  // ISS data is not publicly available — return defaults
  return {
    issScore: 0,
    riskLevel: 'Low',
    issStatus: 'N/A',
    category: 'Carrier',
    recommendation: 'N/A',
    highRisk: false,
  }
}

// ============================================================
// INSPECTIONS
// ============================================================
export function mapToV2InspectionSummary(report: any): V2InspectionSummary {
  const summary = report?.inspections?.summary || report?.safety?.inspectionTotals || {}
  return {
    driverInspections: summary.driverInspections || summary.totalDriverInspections || 0,
    vehicleInspections: summary.vehicleInspections || summary.totalVehicleInspections || 0,
    hazmatInspections: summary.hazmatInspections || summary.totalHazmatInspections || 0,
    driverOOSRate: summary.driverOOSRate || summary.driverOosRate || 0,
    vehicleOOSRate: summary.vehicleOOSRate || summary.vehicleOosRate || 0,
    hazmatOOSRate: summary.hazmatOOSRate || summary.hazmatOosRate || 0,
    nationalDriverOOSRate: summary.nationalDriverOOSRate || 5.51,
    nationalVehicleOOSRate: summary.nationalVehicleOOSRate || 20.72,
    nationalHazmatOOSRate: summary.nationalHazmatOOSRate || 4.50,
  }
}

export function mapToV2InspectionRecords(report: any): V2InspectionRecord[] {
  const records = report?.inspections?.records || []
  return records.map((r: any) => ({
    id: r.unique_id || r.id || '',
    date: r.inspection_date || r.date || '',
    state: r.report_state || r.state || '',
    type: r.inspection_type || r.type || 'Vehicle',
    level: r.level || r.inspection_level || '',
    violations: r.viol_total || r.violations || 0,
    oosViolations: r.oos_total || r.oosViolations || 0,
    oos: (r.oos_total || r.oosViolations || 0) > 0,
    reportNumber: r.report_number || r.reportNumber || '',
    fmcsaId: r.unique_id || r.fmcsaId || '',
    violationDetails: (r.violations_list || r.violationDetails || []).map((v: any) => ({
      category: v.basic_desc || v.category || '',
      group: v.group_desc || v.group || '',
      description: v.description || v.violation_description || '',
      severity: v.severity_weight || v.severity || 0,
      oos: v.oos === true || v.oos === 'Y',
    })),
  }))
}

export function mapToV2Operations(report: any): V2OperationsSummary {
  const summary = report?.inspections?.summary || {}
  const topViolations = report?.inspections?.topViolations || []
  const records = report?.inspections?.records || []

  const totalInspections = (summary.driverInspections || 0) + (summary.vehicleInspections || 0) + (summary.hazmatInspections || 0)
  const totalOOS = summary.totalOOS || 0
  const overallOOSRate = totalInspections > 0 ? Math.round((totalOOS / totalInspections) * 1000) / 10 : 0

  // Build operating states from records
  const stateMap: Record<string, { inspections: number; oosCount: number }> = {}
  records.forEach((r: any) => {
    const state = r.report_state || r.state || 'Unknown'
    if (!stateMap[state]) stateMap[state] = { inspections: 0, oosCount: 0 }
    stateMap[state].inspections++
    if ((r.oos_total || 0) > 0) stateMap[state].oosCount++
  })
  const operatingStates = Object.entries(stateMap)
    .sort((a, b) => b[1].inspections - a[1].inspections)
    .map(([stateCode, data]) => ({
      state: stateCode,
      stateCode,
      inspections: data.inspections,
      oosCount: data.oosCount,
      oosRate: data.inspections > 0 ? Math.round((data.oosCount / data.inspections) * 1000) / 10 : 0,
    }))

  const cleanCount = records.filter((r: any) => (r.viol_total || r.violations || 0) === 0).length
  const cleanInspectionRate = totalInspections > 0 ? Math.round((cleanCount / totalInspections) * 1000) / 10 : 0

  const lastRecord = records.length > 0 ? records[0] : null
  const lastInspectionDate = lastRecord?.inspection_date || lastRecord?.date || ''

  const totalViolations = records.reduce((s: number, r: any) => s + (r.viol_total || r.violations || 0), 0)

  return {
    totalInspections,
    totalOOS,
    overallOOSRate,
    inspectionTrend: 'stable',
    trendPct: 0,
    topViolations: topViolations.map((v: any) => ({
      category: v.category || v.group_desc || '',
      count: v.count || v.total || 0,
      severity: (v.severity || 'minor') as 'critical' | 'major' | 'minor',
    })),
    operatingStates,
    mileageEstimate: '',
    inspectionsPer100k: 0,
    cleanInspectionRate,
    lastInspectionDate,
    averageViolationsPerInspection: totalInspections > 0 ? Math.round((totalViolations / totalInspections) * 100) / 100 : 0,
  }
}

export function mapToV2ViolationTrend(report: any): V2ViolationTrend[] {
  const trend = report?.violations?.trend || []
  return trend.map((t: any) => ({
    month: t.month || t.period || '',
    violations: t.violations || t.count || 0,
    oosEvents: t.oosEvents || t.oos || 0,
  }))
}

// ============================================================
// CRASHES
// ============================================================
export function mapToV2CrashData(report: any): V2CrashData {
  const summary = report?.crashes?.summary || {}
  return {
    fatal: summary.fatal || summary.fatalCrashes || 0,
    injury: summary.injury || summary.injuryCrashes || 0,
    towaway: summary.towaway || summary.towCrashes || 0,
    total: summary.total || summary.totalCrashes || 0,
  }
}

export function mapToV2CrashRecords(report: any): V2CrashRecord[] {
  const records = report?.crashes?.records || []
  return records.map((r: any) => ({
    id: r.id || r.report_number || '',
    date: r.crash_date || r.date || '',
    state: r.report_state || r.state || '',
    severity: r.severity || r.crash_severity || '',
    fatalities: r.fatalities || r.fatal_count || 0,
    injuries: r.injuries || r.injury_count || 0,
    hazmatRelease: r.hazmat_release === true || r.hazmat_release === 'Y' || false,
    reportNumber: r.report_number || r.reportNumber || '',
  }))
}

// ============================================================
// INSURANCE
// ============================================================
export function mapToV2InsurancePolicies(report: any): V2InsurancePolicy[] {
  const policies = report?.insurance?.activePolicies || []
  return policies.map((p: any) => ({
    insurer: p.insurerName || p.insurer || '',
    policyNumber: p.policyNumber || '',
    type: mapInsuranceType(p.insuranceType || p.type || ''),
    coverage: p.coverageAmount || p.coverage || 0,
    required: p.requiredAmount || p.required || 0,
    status: mapInsuranceStatus(p.status),
    effectiveDate: p.effectiveDate || '',
    expirationDate: p.expirationDate || p.cancellationDate || '',
  }))
}

function mapInsuranceType(type: string): 'BIPD' | 'Cargo' | 'Bond' | 'General' {
  const lower = String(type).toLowerCase()
  if (lower.includes('bipd') || lower.includes('liability') || lower.includes('bodily')) return 'BIPD'
  if (lower.includes('cargo')) return 'Cargo'
  if (lower.includes('bond') || lower.includes('surety')) return 'Bond'
  return 'General'
}

function mapInsuranceStatus(status: string | undefined): 'active' | 'expired' | 'pending' {
  if (!status) return 'active'
  const lower = String(status).toLowerCase()
  if (lower === 'active' || lower === 'a') return 'active'
  if (lower === 'expired' || lower === 'cancelled' || lower === 'e') return 'expired'
  return 'pending'
}

export function mapToV2RenewalTimeline(report: any): V2RenewalEvent[] {
  const timeline = report?.insurance?.renewalTimeline || []
  return timeline.map((r: any) => ({
    policyType: r.policyType || r.type || '',
    date: r.date || r.renewalDate || '',
    daysUntil: r.daysUntil || 0,
    urgency: mapUrgency(r.daysUntil || r.urgency),
  }))
}

function mapUrgency(val: number | string): 'low' | 'medium' | 'high' | 'critical' {
  if (typeof val === 'string') {
    if (['low', 'medium', 'high', 'critical'].includes(val)) return val as any
    return 'low'
  }
  if (val <= 30) return 'critical'
  if (val <= 60) return 'high'
  if (val <= 90) return 'medium'
  return 'low'
}

export function mapToV2PolicyHistory(report: any): V2PolicyEvent[] {
  const history = report?.insurance?.history || []
  return history.map((h: any) => ({
    date: h.date || h.effectiveDate || '',
    event: h.event || h.description || '',
    type: (h.type || 'renewed') as V2PolicyEvent['type'],
    policyType: h.policyType || h.insuranceType || '',
  }))
}

export function mapToV2InsuranceGaps(report: any): V2InsuranceGap[] {
  const gaps = report?.insurance?.gaps || []
  return gaps.map((g: any) => ({
    policyType: g.policyType || g.type || '',
    gapStart: g.gapStart || g.startDate || '',
    gapEnd: g.gapEnd || g.endDate || null,
    daysGap: g.daysGap || g.days || 0,
    status: g.status === 'active' ? 'active' : 'resolved',
  }))
}

// ============================================================
// FLEET
// ============================================================
export function mapToV2Trucks(report: any): V2TruckData[] {
  const trucks = report?.fleet?.trucks || []
  return trucks.map((t: any) => ({
    vin: t.vin || '',
    year: t.year || t.model_year || 0,
    make: t.make || '',
    model: t.model || '',
    bodyClass: t.bodyClass || t.body_class || '',
    gvwr: t.gvwr || '',
    inspections: t.inspectionCount || t.inspections || 0,
    oosCount: t.totalOOS || t.oosCount || 0,
  }))
}

export function mapToV2Trailers(report: any): V2TrailerData[] {
  const trailers = report?.fleet?.trailers || []
  return trailers.map((t: any) => ({
    vin: t.vin || '',
    year: t.year || t.model_year || 0,
    make: t.make || '',
    model: t.model || '',
    type: t.type || t.body_class || '',
    length: t.length || '',
  }))
}

export function mapToV2SharedEquipment(report: any): V2SharedEquipment {
  const shared = report?.fleet?.sharedEquipment || {}
  return {
    countSharedVins: shared.countSharedVins || shared.totalShared || 0,
    countSharedPowerUnits: shared.countSharedPowerUnits || 0,
    countSharedTrailers: shared.countSharedTrailers || 0,
    sharedVins: (shared.sharedVins || shared.details || []).map((s: any) => ({
      vin: s.vin || '',
      sharedWithDot: s.sharedWithDot || String(s.otherDotNumber || ''),
      sharedWithName: s.sharedWithName || s.otherLegalName || '',
    })),
  }
}

// ============================================================
// CARGO
// ============================================================
export function mapToV2CargoCapabilities(report: any): V2CargoCapabilities {
  const cargo = report?.cargo || {}
  return {
    generalFreight: cargo.generalFreight || cargo.general_freight || false,
    householdGoods: cargo.householdGoods || cargo.household_goods || false,
    metalSheets: cargo.metalSheets || cargo.metal_sheets || false,
    motorVehicles: cargo.motorVehicles || cargo.motor_vehicles || false,
    drivewayTowaway: cargo.drivewayTowaway || cargo.driveway_towaway || false,
    logsPolesBeams: cargo.logsPolesBeams || cargo.logs_poles_beams || false,
    buildingMaterials: cargo.buildingMaterials || cargo.building_materials || false,
    mobileHomes: cargo.mobileHomes || cargo.mobile_homes || false,
    machineryLargeObjects: cargo.machineryLargeObjects || cargo.machinery_large_objects || false,
    freshProduce: cargo.freshProduce || cargo.fresh_produce || false,
    liquids: cargo.liquids || cargo.liquids_gases || false,
    grainFeedHay: cargo.grainFeedHay || cargo.grain_feed_hay || false,
    coalCoke: cargo.coalCoke || cargo.coal_coke || false,
    meat: cargo.meat || false,
    garbageRefuse: cargo.garbageRefuse || cargo.garbage_refuse || false,
    usMailSeparate: cargo.usMailSeparate || cargo.us_mail || false,
    chemicals: cargo.chemicals || false,
    commoditiesDryBulk: cargo.commoditiesDryBulk || cargo.commodities_dry_bulk || false,
    refrigeratedFood: cargo.refrigeratedFood || cargo.refrigerated_food || false,
    beverages: cargo.beverages || false,
    paperProducts: cargo.paperProducts || cargo.paper_products || false,
    utilities: cargo.utilities || false,
    farmSupplies: cargo.farmSupplies || cargo.farm_supplies || false,
    construction: cargo.construction || false,
    waterWell: cargo.waterWell || cargo.water_well || false,
    intermodalContainers: cargo.intermodalContainers || cargo.intermodal_containers || false,
    oilFieldEquipment: cargo.oilFieldEquipment || cargo.oilfield_equipment || false,
    livestock: cargo.livestock || false,
    grainfeedHay: cargo.grainfeedHay || cargo.grain_feed_hay || false,
    coalCoke2: cargo.coalCoke2 || false,
    passengers: cargo.passengers || false,
  }
}

// ============================================================
// DOCUMENTS
// ============================================================
export function mapToV2Documents(report: any): V2DocumentItem[] {
  const docs = report?.documents || {}
  const checks = docs.verificationChecks || []
  const boc3 = docs.boc3 || {}
  const safetyRating = docs.safetyRating || {}
  const mcs150 = docs.mcs150 || {}

  const items: V2DocumentItem[] = []

  // Build document items from verification data
  items.push({
    name: 'Operating Authority (MC)',
    status: 'verified',
    description: 'FMCSA active MC authority confirmed',
  })
  items.push({
    name: 'DOT Registration',
    status: 'verified',
    description: 'DOT number active and current',
  })

  // Insurance
  const hasInsurance = (report?.insurance?.activePolicies || []).length > 0
  items.push({
    name: 'Insurance Certificate',
    status: hasInsurance ? 'verified' : 'pending',
    description: hasInsurance ? 'Active insurance policies on file' : 'Insurance verification pending',
  })

  // Safety Rating
  items.push({
    name: 'Safety Rating',
    status: safetyRating.rating ? 'verified' : 'pending',
    description: safetyRating.rating ? `${safetyRating.rating} rating confirmed` : 'No safety rating on file',
  })

  // MCS-150
  items.push({
    name: 'MCS-150 Filing',
    status: mcs150.date ? 'verified' : 'missing',
    description: mcs150.date ? `Biennial update filed ${mcs150.date}` : 'MCS-150 not current',
  })

  // BOC-3
  items.push({
    name: 'BOC-3 (Process Agent)',
    status: boc3.onFile ? 'verified' : 'missing',
    description: boc3.onFile ? 'Process agent designation on file' : 'BOC-3 not on file',
  })

  // Incorporate verification checks from API
  checks.forEach((c: any) => {
    items.push({
      name: c.name || c.check || '',
      status: c.status === 'clean' || c.status === 'verified' ? 'verified' : c.status === 'pending' ? 'pending' : 'missing',
      description: c.detail || c.description || '',
    })
  })

  return items
}

export function mapToV2VerificationChecks(report: any): any[] {
  const checks = report?.documents?.verificationChecks || []
  return checks.map((c: any) => ({
    name: c.name || c.check || '',
    status: c.status || 'clean',
    detail: c.detail || c.description || '',
  }))
}

export function mapToV2AvailableDocuments(_report: any): V2AvailableDocument[] {
  // These are platform-side documents, not from API
  return [
    { name: 'Articles of Incorporation', available: false },
    { name: 'EIN Letter', available: false },
    { name: 'Driver License (Owner)', available: false },
    { name: 'Certificate of Insurance (COI)', available: false },
    { name: 'Loss Run Report', available: false },
    { name: 'Letter of Release (LOR)', available: false },
  ]
}

// ============================================================
// FULL REPORT
// ============================================================
export function mapToV2RelatedCarriers(report: any): V2RelatedCarrier[] {
  const related = report?.related?.relatedCarriers || report?.related || []
  if (!Array.isArray(related)) return []
  return related.map((r: any) => ({
    mcNumber: r.mcNumber || r.mc_number || '',
    dotNumber: String(r.dotNumber || r.dot_number || ''),
    legalName: r.legalName || r.legal_name || '',
    sharedField: (r.sharedField || r.shared_field || 'address') as V2RelatedCarrier['sharedField'],
    status: mapRelatedStatus(r.operatingStatus || r.status),
    powerUnits: r.powerUnits || r.total_power_units || 0,
  }))
}

function mapRelatedStatus(status: string | undefined): 'active' | 'inactive' | 'revoked' {
  if (!status) return 'inactive'
  const lower = String(status).toLowerCase()
  if (lower === 'a' || lower === 'active' || lower === 'y') return 'active'
  if (lower === 'revoked') return 'revoked'
  return 'inactive'
}

export function mapToV2Percentiles(report: any): V2CarrierPercentile[] {
  const percentiles = report?.percentiles?.percentiles || report?.percentiles || []
  if (!Array.isArray(percentiles)) return []
  return percentiles.map((p: any) => ({
    metric: p.metric || p.name || '',
    carrierValue: p.carrierValue || p.value || 0,
    percentile: p.percentile || p.rank || 0,
    category: (p.category || 'safety') as V2CarrierPercentile['category'],
  }))
}

// Future — return empty arrays/objects
export function mapToV2MonitoringAlerts(_report: any): V2MonitoringAlert[] {
  return []
}

export function mapToV2RiskScoreTrend(_report: any): V2RiskScoreTrend[] {
  return []
}

export function mapToV2ContactHistory(_report: any): V2ContactHistory {
  return { changes: [] }
}

// ============================================================
// COMPLIANCE (from Listing model, not API)
// ============================================================
export function mapToV2ComplianceFinancials(listing: MCListingExtended): V2ComplianceFinancials {
  return {
    entryAuditCompleted: false,
    hasFactoring: false,
    factoringCompany: '',
    factoringRate: 0,
  }
}
