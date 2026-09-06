export interface TelemetryEquipment {
  id: string
  type: "Excavator" | "Dumper" | "Drill Rig" | "Sump Pump" | "Grader"
  model: string
  operator: string
  status: "Operational" | "Degraded" | "Critical Service" | "Standby"
  metricName: string
  metricValue: string
  alert?: string
}

export interface WeatherTelemetry {
  rainfallMmPerHour: number
  rainfallLast3HoursMm: number
  forecastNext4Hours: string
  pitSumpCapacityPercent: number
  activeSumpPumps: number
  totalSumpPumps: number
  inundationRiskLevel: "Low" | "Medium" | "High" | "Critical"
  floodedBenches: string[]
}

export interface HaulRoadTelemetry {
  roadName: string
  rollingResistancePercent: number // Normal ~2.5%
  mudDepthCm: number
  speedLimitKmh: number
  averageSpeedKmh: number
  cycleTimeDelayMinutes: number
  status: "Normal" | "Degraded" | "Blocked"
}

export interface BlastingTelemetry {
  blastZone: string
  rockMassRating: number // RMR (0-100)
  rockHardnessMpa: number // UCS in MPa
  formation: string
  plannedBlastTime: string
  actualStatus: "Scheduled" | "Delayed - Weather" | "Completed" | "Pending Secondary Breaking"
  fragmentationYieldPercent: number // Target >85%
  delayMinutes: number
}

export interface HourlyShiftOutput {
  hour: string
  targetTons: number
  projectedTons: number
  actualTons?: number
}

export interface PrescriptiveAction {
  id: string
  title: string
  category: "Fleet Dispatch" | "Drill & Blast" | "Geotechnical & Drainage" | "Plant Feed"
  priority: "Urgent" | "High" | "Medium"
  triggerCondition: string
  rootCause: string
  prescriptiveAction: string
  projectedRecoveryTons: number
  cycleTimeBenefitMinutes: number
  targetBenches: string[]
  assignedFleet: string[]
  applied: boolean
}

export interface MineOperationsData {
  mineName: string
  slug: string
  district: string
  concessionAreaKm2: number
  avgMnGradePercent: number
  extractionType: "Mechanized Open Pit" | "Underground & Open Cast" | "Deep Open Pit"
  activeShift: "Shift A (Morning)" | "Shift B (Evening)" | "Shift C (Night)"
  dailyTargetTons: number
  projectedOutputTons: number
  shortfallProbabilityPercent: number
  riskLevel: "Low" | "Moderate" | "High" | "Critical"
  primaryBottleneck: string
  weather: WeatherTelemetry
  haulRoads: HaulRoadTelemetry[]
  equipment: TelemetryEquipment[]
  blasting: BlastingTelemetry
  hourlyOutputs: HourlyShiftOutput[]
  prescriptiveActions: PrescriptiveAction[]
}

export const MINES_DATA: Record<string, MineOperationsData> = {
  balaghat: {
    mineName: "Balaghat Central Mine",
    slug: "balaghat",
    district: "Balaghat, Madhya Pradesh",
    concessionAreaKm2: 385,
    avgMnGradePercent: 44.5,
    extractionType: "Mechanized Open Pit",
    activeShift: "Shift B (Evening)",
    dailyTargetTons: 4200,
    projectedOutputTons: 3360,
    shortfallProbabilityPercent: 88,
    riskLevel: "Critical",
    primaryBottleneck: "Heavy pit floor inundation & West Haul Ramp rolling resistance spike",
    weather: {
      rainfallMmPerHour: 34,
      rainfallLast3HoursMm: 52,
      forecastNext4Hours: "Thunderstorms continuing (25-40mm expected)",
      pitSumpCapacityPercent: 86,
      activeSumpPumps: 3,
      totalSumpPumps: 4,
      inundationRiskLevel: "Critical",
      floodedBenches: ["Bench 3 South", "Bench 4 Main Pit Floor"],
    },
    haulRoads: [
      {
        roadName: "West Pit Main Incline",
        rollingResistancePercent: 6.8,
        mudDepthCm: 14,
        speedLimitKmh: 35,
        averageSpeedKmh: 14,
        cycleTimeDelayMinutes: 7.6,
        status: "Degraded",
      },
      {
        roadName: "North Ridge Bypass (Gravel)",
        rollingResistancePercent: 3.1,
        mudDepthCm: 2,
        speedLimitKmh: 40,
        averageSpeedKmh: 36,
        cycleTimeDelayMinutes: 0.8,
        status: "Normal",
      },
      {
        roadName: "Crusher Run-1 Arterial",
        rollingResistancePercent: 2.8,
        mudDepthCm: 1,
        speedLimitKmh: 45,
        averageSpeedKmh: 42,
        cycleTimeDelayMinutes: 0.2,
        status: "Normal",
      },
    ],
    equipment: [
      {
        id: "EX-204",
        type: "Excavator",
        model: "Komatsu PC1250-8",
        operator: "R. Sharma",
        status: "Degraded",
        metricName: "Hydraulic Pump Temp",
        metricValue: "108°C",
        alert: "Warning: Thermal limit exceeded (+14°C above baseline)",
      },
      {
        id: "EX-201",
        type: "Excavator",
        model: "CAT 390F",
        operator: "A. Verma",
        status: "Operational",
        metricName: "Load Rate",
        metricValue: "480 T/hr",
      },
      {
        id: "DT-112",
        type: "Dumper",
        model: "CAT 777E (100T)",
        operator: "K. Patel",
        status: "Degraded",
        metricName: "Traction Slip Rate",
        metricValue: "24%",
        alert: "Excessive tire spinning on West Incline",
      },
      {
        id: "DT-118",
        type: "Dumper",
        model: "BEML BH100",
        operator: "S. Yadav",
        status: "Operational",
        metricName: "Payload Status",
        metricValue: "96.4 T",
      },
      {
        id: "PUMP-02",
        type: "Sump Pump",
        model: "Kirloskar High-Head 150kW",
        operator: "Auto-Telemetry",
        status: "Critical Service",
        metricName: "Discharge Volume",
        metricValue: "320 m³/hr",
        alert: "Impeller cavitation detected at Sump #2",
      },
    ],
    blasting: {
      blastZone: "Bench 4 East Gondite Face",
      rockMassRating: 78,
      rockHardnessMpa: 145,
      formation: "Mansar Gondite (Ultra-Hard Chert-Spessartine)",
      plannedBlastTime: "14:30 IST",
      actualStatus: "Delayed - Weather",
      fragmentationYieldPercent: 68,
      delayMinutes: 120,
    },
    hourlyOutputs: [
      { hour: "08:00", targetTons: 525, projectedTons: 520, actualTons: 510 },
      { hour: "09:00", targetTons: 525, projectedTons: 510, actualTons: 495 },
      { hour: "10:00", targetTons: 525, projectedTons: 480, actualTons: 460 },
      { hour: "11:00", targetTons: 525, projectedTons: 420, actualTons: 390 },
      { hour: "12:00", targetTons: 525, projectedTons: 380 },
      { hour: "13:00", targetTons: 525, projectedTons: 350 },
      { hour: "14:00", targetTons: 525, projectedTons: 340 },
      { hour: "15:00", targetTons: 525, projectedTons: 350 },
    ],
    prescriptiveActions: [
      {
        id: "action-reroute-west",
        title: "Dynamic Hauler Fleet Re-routing to North Ridge Bypass",
        category: "Fleet Dispatch",
        priority: "Urgent",
        triggerCondition: "West Pit Ramp rolling resistance 6.8% with 14cm mud depth (+7.6 min delay/trip)",
        rootCause: "Water runoff accumulation from Bench 2 ditch overflow saturating unpaved incline",
        prescriptiveAction:
          "Re-route 8 active 100T dumpers from West Ramp to North Ridge Gravel Bypass. Dispatch motor grader GR-04 and water pump tanker to scrape and de-silt West Ramp.",
        projectedRecoveryTons: 380,
        cycleTimeBenefitMinutes: 4.6,
        targetBenches: ["North Ridge Bypass", "West Incline Ramp"],
        assignedFleet: ["DT-112", "DT-114", "DT-115", "GR-04"],
        applied: false,
      },
      {
        id: "action-blast-hardness",
        title: "Adaptive Blast Pattern Revision for High-Hardness Gondite",
        category: "Drill & Blast",
        priority: "High",
        triggerCondition: "Rock hardness measured at 145 MPa; fragmentation yield currently 68% (boulders >60cm)",
        rootCause: "Mansar Gondite rock density causing oversize boulder generation and primary crusher choke",
        prescriptiveAction:
          "Contract drill burden from 3.8m to 3.2m; reduce hole spacing from 4.5m to 3.9m; increase bottom-load emulsion density by 14% on Bench 4 pattern.",
        projectedRecoveryTons: 240,
        cycleTimeBenefitMinutes: 2.8,
        targetBenches: ["Bench 4 East"],
        assignedFleet: ["Drill-Rig DR-02", "Emulsion Truck ET-01"],
        applied: false,
      },
      {
        id: "action-shift-dry-benches",
        title: "Reassign Excavation Fleet to Free-Draining Ridge Bench 6",
        category: "Geotechnical & Drainage",
        priority: "High",
        triggerCondition: "Bench 3 South pit floor flooded with 38cm standing water; loader EX-204 thermal warning",
        rootCause: "Surface sump pump #2 cavitation reducing water evacuation rate",
        prescriptiveAction:
          "Temporarily idle flooded Bench 3 South face; mobilize primary loading crew to Upper Ridge Bench 6 (+340m RL, dry quartzite contact). Switch Pump #2 to backup intake.",
        projectedRecoveryTons: 220,
        cycleTimeBenefitMinutes: 3.2,
        targetBenches: ["Bench 6 Ridge", "Bench 3 South Sump"],
        assignedFleet: ["EX-204", "PUMP-02", "PUMP-03 (Backup)"],
        applied: false,
      },
    ],
  },

  tirodi: {
    mineName: "Tirodi Main Mine",
    slug: "tirodi",
    district: "Balaghat / Seoni Border",
    concessionAreaKm2: 290,
    avgMnGradePercent: 49.2,
    extractionType: "Underground & Open Cast",
    activeShift: "Shift A (Morning)",
    dailyTargetTons: 3600,
    projectedOutputTons: 2980,
    shortfallProbabilityPercent: 74,
    riskLevel: "High",
    primaryBottleneck: "Primary Gyratory Crusher feed blockage & Shovel EX-102 hydraulic maintenance halt",
    weather: {
      rainfallMmPerHour: 12,
      rainfallLast3HoursMm: 18,
      forecastNext4Hours: "Light overcast; intermittent drizzle",
      pitSumpCapacityPercent: 48,
      activeSumpPumps: 2,
      totalSumpPumps: 3,
      inundationRiskLevel: "Medium",
      floodedBenches: ["Lower Decline Sump"],
    },
    haulRoads: [
      {
        roadName: "Tirodi Deep Pit Spiral",
        rollingResistancePercent: 4.2,
        mudDepthCm: 5,
        speedLimitKmh: 30,
        averageSpeedKmh: 22,
        cycleTimeDelayMinutes: 3.4,
        status: "Normal",
      },
      {
        roadName: "East Crusher Access",
        rollingResistancePercent: 5.4,
        mudDepthCm: 9,
        speedLimitKmh: 35,
        averageSpeedKmh: 18,
        cycleTimeDelayMinutes: 4.8,
        status: "Degraded",
      },
    ],
    equipment: [
      {
        id: "EX-102",
        type: "Excavator",
        model: "Tata Hitachi EX1200",
        operator: "M. Khan",
        status: "Critical Service",
        metricName: "Hydraulic Pressure",
        metricValue: "185 bar (Normal 320)",
        alert: "Main valve seal failure; operating at 55% speed",
      },
      {
        id: "DT-084",
        type: "Dumper",
        model: "Komatsu HD785-7",
        operator: "P. Baghel",
        status: "Operational",
        metricName: "Cycle Time",
        metricValue: "16.4 min",
      },
      {
        id: "CRUSH-01",
        type: "Dumper",
        model: "Metso Superior MK-III",
        operator: "Control Room",
        status: "Degraded",
        metricName: "Feed Bin Level",
        metricValue: "98% (Choked)",
        alert: "Boulder bridging over 1.2m feed grizzly",
      },
    ],
    blasting: {
      blastZone: "Tirodi Main High-Grade Lens",
      rockMassRating: 82,
      rockHardnessMpa: 160,
      formation: "Mansar Gondite with Braunite lenses",
      plannedBlastTime: "11:00 IST",
      actualStatus: "Pending Secondary Breaking",
      fragmentationYieldPercent: 62,
      delayMinutes: 75,
    },
    hourlyOutputs: [
      { hour: "06:00", targetTons: 450, projectedTons: 450, actualTons: 440 },
      { hour: "07:00", targetTons: 450, projectedTons: 430, actualTons: 410 },
      { hour: "08:00", targetTons: 450, projectedTons: 380, actualTons: 360 },
      { hour: "09:00", targetTons: 450, projectedTons: 340 },
      { hour: "10:00", targetTons: 450, projectedTons: 330 },
      { hour: "11:00", targetTons: 450, projectedTons: 340 },
      { hour: "12:00", targetTons: 450, projectedTons: 360 },
      { hour: "13:00", targetTons: 450, projectedTons: 380 },
    ],
    prescriptiveActions: [
      {
        id: "action-tirodi-crusher",
        title: "Deploy Hydraulic Rockbreaker & Clear Primary Crusher Grizzly",
        category: "Plant Feed",
        priority: "Urgent",
        triggerCondition: "Gyratory feed bin bridged by 1.4m braunite boulder; crusher throttled to 40%",
        rootCause: "Coarse fragmentation from wide blast spacing on southern Gondite contact",
        prescriptiveAction:
          "Dispatch mobile rockbreaker RB-01 to primary crusher intake; re-direct 5 loaded dumpers to Secondary Stockpile Surge Bin-2.",
        projectedRecoveryTons: 290,
        cycleTimeBenefitMinutes: 5.2,
        targetBenches: ["Primary Crusher Bin", "Stockpile Yard 2"],
        assignedFleet: ["RB-01", "DT-084", "DT-086"],
        applied: false,
      },
      {
        id: "action-tirodi-excavator",
        title: "Hot-Swap Excavator EX-102 with Standby Front Face Loader FL-04",
        category: "Fleet Dispatch",
        priority: "High",
        triggerCondition: "EX-102 hydraulic pressure loss (185 bar); loading time degraded from 2.4 min to 5.8 min",
        rootCause: "Worn hydraulic distribution manifold seal",
        prescriptiveAction:
          "Transfer pit operator M. Khan to Standby CAT 988K Front Loader FL-04; park EX-102 at Field Bay 3 for 45-min seal replacement.",
        projectedRecoveryTons: 210,
        cycleTimeBenefitMinutes: 3.4,
        targetBenches: ["Bench 2 High-Grade Pit"],
        assignedFleet: ["FL-04", "Maintenance Service Van 2"],
        applied: false,
      },
      {
        id: "action-tirodi-blasting",
        title: "Alter Non-Electric Blast Delay Timing for Better Fragmentation",
        category: "Drill & Blast",
        priority: "Medium",
        triggerCondition: "Secondary breaking required for 38% of blasted ore blocks",
        rootCause: "Insufficient inter-hole delay causing shockwave interference in dense braunite",
        prescriptiveAction:
          "Increase inter-hole delay timing from 17ms to 25ms and row delay from 42ms to 65ms using electronic detonators for next shift blast.",
        projectedRecoveryTons: 120,
        cycleTimeBenefitMinutes: 1.8,
        targetBenches: ["Bench 4 Deep Core"],
        assignedFleet: ["DR-04", "Blasting Crew Alpha"],
        applied: false,
      },
    ],
  },

  ukwa: {
    mineName: "Ukwa Underground & Open Cast Mine",
    slug: "ukwa",
    district: "Ukwa Ridge, Balaghat",
    concessionAreaKm2: 320,
    avgMnGradePercent: 47.8,
    extractionType: "Deep Open Pit",
    activeShift: "Shift B (Evening)",
    dailyTargetTons: 3800,
    projectedOutputTons: 3150,
    shortfallProbabilityPercent: 78,
    riskLevel: "High",
    primaryBottleneck: "Decline conveyor spillage & heavy haul truck congestion at Stockpile 1",
    weather: {
      rainfallMmPerHour: 22,
      rainfallLast3HoursMm: 34,
      forecastNext4Hours: "Moderate rain bands moving east",
      pitSumpCapacityPercent: 64,
      activeSumpPumps: 3,
      totalSumpPumps: 3,
      inundationRiskLevel: "High",
      floodedBenches: ["Incline 2 Drainage Trench"],
    },
    haulRoads: [
      {
        roadName: "Ukwa Main Valley Haul Road",
        rollingResistancePercent: 5.2,
        mudDepthCm: 8,
        speedLimitKmh: 40,
        averageSpeedKmh: 24,
        cycleTimeDelayMinutes: 4.2,
        status: "Degraded",
      },
      {
        roadName: "Ridge East Overpass",
        rollingResistancePercent: 2.9,
        mudDepthCm: 1,
        speedLimitKmh: 45,
        averageSpeedKmh: 41,
        cycleTimeDelayMinutes: 0.4,
        status: "Normal",
      },
    ],
    equipment: [
      {
        id: "CONV-03",
        type: "Excavator",
        model: "Continental Overland Conveyor 1200mm",
        operator: "Plant Automation",
        status: "Degraded",
        metricName: "Belt Alignment",
        metricValue: "+42mm Dev.",
        alert: "Belt drift switch tripped at Transfer Tower 2",
      },
      {
        id: "DT-042",
        type: "Dumper",
        model: "BEML BH60M",
        operator: "D. Meshram",
        status: "Operational",
        metricName: "Fuel Burn",
        metricValue: "42 L/hr",
      },
    ],
    blasting: {
      blastZone: "Ukwa Central High-Purity Seam",
      rockMassRating: 72,
      rockHardnessMpa: 130,
      formation: "Sausar Metasedimentary Horizon",
      plannedBlastTime: "16:00 IST",
      actualStatus: "Scheduled",
      fragmentationYieldPercent: 81,
      delayMinutes: 20,
    },
    hourlyOutputs: [
      { hour: "14:00", targetTons: 475, projectedTons: 475, actualTons: 460 },
      { hour: "15:00", targetTons: 475, projectedTons: 440, actualTons: 420 },
      { hour: "16:00", targetTons: 475, projectedTons: 390 },
      { hour: "17:00", targetTons: 475, projectedTons: 360 },
      { hour: "18:00", targetTons: 475, projectedTons: 360 },
      { hour: "19:00", targetTons: 475, projectedTons: 370 },
      { hour: "20:00", targetTons: 475, projectedTons: 380 },
      { hour: "21:00", targetTons: 475, projectedTons: 390 },
    ],
    prescriptiveActions: [
      {
        id: "action-ukwa-conveyor",
        title: "Re-align Transfer Chute 2 & Dispatch Surge Dumpers to Bypass Conveyor",
        category: "Fleet Dispatch",
        priority: "Urgent",
        triggerCondition: "Conveyor 3 belt drift sensor tripped; transfer rate dropped by 320 T/hr",
        rootCause: "Wet fines accumulation adhering to tail pulley scraper",
        prescriptiveAction:
          "Activate mechanical belt scraper high-pressure wash; divert 6 BH60M haulers to road haulage route via Ridge East Overpass directly to Railway Siding.",
        projectedRecoveryTons: 340,
        cycleTimeBenefitMinutes: 4.8,
        targetBenches: ["Transfer Tower 2", "Ridge Overpass"],
        assignedFleet: ["DT-042", "DT-044", "DT-045", "Wash Tanker WT-01"],
        applied: false,
      },
      {
        id: "action-ukwa-drainage",
        title: "Ditch Re-trenching & Sump Bypass Activation on Valley Incline",
        category: "Geotechnical & Drainage",
        priority: "High",
        triggerCondition: "Valley Haul Road mud depth 8cm with cycle delay of +4.2 minutes",
        rootCause: "Incline 2 drainage trench overflow spilling mud onto haul path",
        prescriptiveAction:
          "Deploy Backhoe Loader BHL-02 to cut emergency relief ditch into Western Retention Basin; spread 80 tonnes of crushed ballast on critical traction curve.",
        projectedRecoveryTons: 190,
        cycleTimeBenefitMinutes: 2.6,
        targetBenches: ["Valley Road Curve 4"],
        assignedFleet: ["BHL-02", "Tipper T-12"],
        applied: false,
      },
      {
        id: "action-ukwa-blend",
        title: "Adjust Stockpile Blend Ratio to Counter Moisture Saturation",
        category: "Plant Feed",
        priority: "Medium",
        triggerCondition: "Feed moisture content rising to 11.4% (Threshold: 8.5%)",
        rootCause: "Monsoon precipitation saturating open stock pile 1",
        prescriptiveAction:
          "Blend 65% dry covered stock with 35% pit run ore to keep cyclone moisture within ferro-alloy specifications.",
        projectedRecoveryTons: 120,
        cycleTimeBenefitMinutes: 1.2,
        targetBenches: ["Stockpile Shed A"],
        assignedFleet: ["Front Loader FL-01"],
        applied: false,
      },
    ],
  },

  kandri: {
    mineName: "Kandri Mine",
    slug: "kandri",
    district: "Ramtek / Balaghat Belt",
    concessionAreaKm2: 245,
    avgMnGradePercent: 41.2,
    extractionType: "Mechanized Open Pit",
    activeShift: "Shift A (Morning)",
    dailyTargetTons: 2800,
    projectedOutputTons: 2520,
    shortfallProbabilityPercent: 58,
    riskLevel: "Moderate",
    primaryBottleneck: "Excavator EX-04 bucket tooth failure & Drill rig DR-01 air compressor fault",
    weather: {
      rainfallMmPerHour: 6,
      rainfallLast3HoursMm: 10,
      forecastNext4Hours: "Scattered cloud; clearing by afternoon",
      pitSumpCapacityPercent: 32,
      activeSumpPumps: 2,
      totalSumpPumps: 2,
      inundationRiskLevel: "Low",
      floodedBenches: [],
    },
    haulRoads: [
      {
        roadName: "Kandri South Spiral",
        rollingResistancePercent: 3.2,
        mudDepthCm: 2,
        speedLimitKmh: 35,
        averageSpeedKmh: 31,
        cycleTimeDelayMinutes: 0.8,
        status: "Normal",
      },
    ],
    equipment: [
      {
        id: "EX-04",
        type: "Excavator",
        model: "CAT 374D",
        operator: "V. Gaikwad",
        status: "Degraded",
        metricName: "Digging Cycle Time",
        metricValue: "38s (Normal 26s)",
        alert: "2 bucket teeth missing; penetration speed reduced",
      },
    ],
    blasting: {
      blastZone: "Kandri South Fold Axis",
      rockMassRating: 75,
      rockHardnessMpa: 110,
      formation: "Bichua Crystalline Dolomitic Manganese",
      plannedBlastTime: "12:30 IST",
      actualStatus: "Scheduled",
      fragmentationYieldPercent: 84,
      delayMinutes: 10,
    },
    hourlyOutputs: [
      { hour: "06:00", targetTons: 350, projectedTons: 350, actualTons: 345 },
      { hour: "07:00", targetTons: 350, projectedTons: 330, actualTons: 320 },
      { hour: "08:00", targetTons: 350, projectedTons: 310, actualTons: 300 },
      { hour: "09:00", targetTons: 350, projectedTons: 310 },
      { hour: "10:00", targetTons: 350, projectedTons: 310 },
      { hour: "11:00", targetTons: 350, projectedTons: 310 },
      { hour: "12:00", targetTons: 350, projectedTons: 310 },
      { hour: "13:00", targetTons: 350, projectedTons: 320 },
    ],
    prescriptiveActions: [
      {
        id: "action-kandri-teeth",
        title: "Express Bucket Tooth Replacement on Shovel EX-04",
        category: "Fleet Dispatch",
        priority: "High",
        triggerCondition: "Digging cycle time increased by 46% due to blunt ground engaging tools",
        rootCause: "Abrasive quartz veins in dolomitic manganese formation",
        prescriptiveAction:
          "Dispatch Field Quick-Service Mobile Rig to fit new heavy-duty penetration tips during operator lunch break (11:30-12:00).",
        projectedRecoveryTons: 180,
        cycleTimeBenefitMinutes: 2.4,
        targetBenches: ["Bench 2 South"],
        assignedFleet: ["EX-04", "Mobile Workshop Unit 1"],
        applied: false,
      },
      {
        id: "action-kandri-drill",
        title: "Switch Blast Hole Pattern to Alternate Pneumatic Rig DR-03",
        category: "Drill & Blast",
        priority: "Medium",
        triggerCondition: "Drill rig DR-01 compressor pressure dropping below 8 bar",
        rootCause: "Air filter blockage from dry dust drift",
        prescriptiveAction:
          "Transfer drilling operator to auxiliary Atlas Copco FlexiROC rig DR-03 to complete remaining 14 blast holes on schedule.",
        projectedRecoveryTons: 100,
        cycleTimeBenefitMinutes: 1.2,
        targetBenches: ["Bench 3 Drill Pattern"],
        assignedFleet: ["DR-03"],
        applied: false,
      },
    ],
  },

  malanjkhand: {
    mineName: "Malanjkhand Approach & Mining Sector",
    slug: "malanjkhand",
    district: "Balaghat Northeast Belt",
    concessionAreaKm2: 360,
    avgMnGradePercent: 38.6,
    extractionType: "Mechanized Open Pit",
    activeShift: "Shift B (Evening)",
    dailyTargetTons: 3400,
    projectedOutputTons: 2820,
    shortfallProbabilityPercent: 82,
    riskLevel: "Critical",
    primaryBottleneck: "Primary Haul Road washout & Lightning hazard warning halting pit operations",
    weather: {
      rainfallMmPerHour: 42,
      rainfallLast3HoursMm: 68,
      forecastNext4Hours: "Severe squall & lightning alert active",
      pitSumpCapacityPercent: 91,
      activeSumpPumps: 4,
      totalSumpPumps: 4,
      inundationRiskLevel: "Critical",
      floodedBenches: ["Bench 1 North", "Bench 2 Core Ramp"],
    },
    haulRoads: [
      {
        roadName: "Malanjkhand Main Incline",
        rollingResistancePercent: 7.4,
        mudDepthCm: 18,
        speedLimitKmh: 30,
        averageSpeedKmh: 11,
        cycleTimeDelayMinutes: 9.2,
        status: "Blocked",
      },
      {
        roadName: "East Hill Ridge Track",
        rollingResistancePercent: 3.4,
        mudDepthCm: 3,
        speedLimitKmh: 35,
        averageSpeedKmh: 30,
        cycleTimeDelayMinutes: 1.2,
        status: "Normal",
      },
    ],
    equipment: [
      {
        id: "EX-301",
        type: "Excavator",
        model: "Komatsu PC2000-8",
        operator: "S. Dwivedi",
        status: "Standby",
        metricName: "Lightning Safety Lockout",
        metricValue: "Active",
        alert: "Field crew sheltered due to lightning detector warning",
      },
    ],
    blasting: {
      blastZone: "Malanjkhand North Extension",
      rockMassRating: 70,
      rockHardnessMpa: 125,
      formation: "Granitoid Metasomatic Manganese Horizon",
      plannedBlastTime: "15:00 IST",
      actualStatus: "Delayed - Weather",
      fragmentationYieldPercent: 72,
      delayMinutes: 90,
    },
    hourlyOutputs: [
      { hour: "14:00", targetTons: 425, projectedTons: 425, actualTons: 400 },
      { hour: "15:00", targetTons: 425, projectedTons: 380, actualTons: 330 },
      { hour: "16:00", targetTons: 425, projectedTons: 310 },
      { hour: "17:00", targetTons: 425, projectedTons: 290 },
      { hour: "18:00", targetTons: 425, projectedTons: 340 },
      { hour: "19:00", targetTons: 425, projectedTons: 350 },
      { hour: "20:00", targetTons: 425, projectedTons: 360 },
      { hour: "21:00", targetTons: 425, projectedTons: 370 },
    ],
    prescriptiveActions: [
      {
        id: "action-malanjkhand-reroute",
        title: "Activate East Hill Ridge Bypass & Ballast Incline Ramp",
        category: "Fleet Dispatch",
        priority: "Urgent",
        triggerCondition: "Main Incline road blocked by 18cm fluid mud and ditch breach",
        rootCause: "Flash runoff from Eastern escarpment overwhelms unlined ditch",
        prescriptiveAction:
          "Re-route 10 active haulers through East Hill Ridge Track; mobilize 2 wheel loaders to dump crushed ballast on incline apron.",
        projectedRecoveryTons: 360,
        cycleTimeBenefitMinutes: 5.6,
        targetBenches: ["East Hill Track", "Main Incline"],
        assignedFleet: ["WL-01", "WL-02", "DT-301-310"],
        applied: false,
      },
      {
        id: "action-malanjkhand-pumps",
        title: "Commission Auxiliary Diesel Drainage Skid at Sump 1",
        category: "Geotechnical & Drainage",
        priority: "Urgent",
        triggerCondition: "Sump capacity reaching 91%; overflow threatening lower bench electrical substation",
        rootCause: "Inflow exceeding 540 m³/hr under severe rainfall",
        prescriptiveAction:
          "Fire up auxiliary Cummins 450kW diesel trailer pump DP-01 to add 400 m³/hr discharge capacity through high-density polyethylene pipeline.",
        projectedRecoveryTons: 220,
        cycleTimeBenefitMinutes: 2.2,
        targetBenches: ["Pit Sump 1", "Substation 2"],
        assignedFleet: ["DP-01 Skid"],
        applied: false,
      },
    ],
  },
}

export function getMineOperationsData(slug: string): MineOperationsData {
  const normalized = slug.toLowerCase().trim()
  return MINES_DATA[normalized] || MINES_DATA["balaghat"]
}

export const AVAILABLE_MINES = [
  { slug: "balaghat", name: "Balaghat Central Mine", district: "Balaghat" },
  { slug: "tirodi", name: "Tirodi Main Mine", district: "Tirodi / Seoni" },
  { slug: "ukwa", name: "Ukwa Deep Mine", district: "Ukwa Ridge" },
  { slug: "kandri", name: "Kandri Mine", district: "Ramtek / Kandri" },
  { slug: "malanjkhand", name: "Malanjkhand Mining Sector", district: "Malanjkhand" },
]
