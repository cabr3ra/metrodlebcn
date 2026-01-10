
import { Station } from '../types';
import { STATIONS } from '../constants';

// Generador de números pseudo-aleatoris (Mulberry32)
function createRandom(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Barreja determinista Fisher-Yates
function shuffledList(list: Station[], seed: number): Station[] {
  const result = [...list];
  const random = createRandom(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Època de referència fixada al 1 de Gener de 2026
const EPOCH = new Date('2026-01-01T00:00:00Z').getTime();
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface DailySelection {
  date: string;
  station: Station;
  dayNumber: number;
}

export function getStationForDate(targetDate: Date): DailySelection {
  // Normalitzem a UTC a mitjanit
  const utcDate = Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate());
  
  // Càlcul de dies transcorreguts (pot ser negatiu si és abans del 2026)
  const daysSinceEpoch = Math.floor((utcDate - EPOCH) / MS_PER_DAY);
  
  const cycleLength = STATIONS.length;
  
  // Càlcul del cicle i de l'índex dins del cicle (manejant nombres negatius)
  const cycleNumber = Math.floor(daysSinceEpoch / cycleLength);
  const indexInCycle = ((daysSinceEpoch % cycleLength) + cycleLength) % cycleLength;
  
  // La llavor del cicle (12345 és una constant base)
  const cycleSeed = 12345 + cycleNumber;
  const currentCycleStations = shuffledList(STATIONS, cycleSeed);
  
  const selectedStation = currentCycleStations[indexInCycle];
  
  return {
    date: new Date(utcDate).toISOString().split('T')[0],
    station: selectedStation,
    // El dia 1 de gener de 2026 serà el Dia #1
    dayNumber: daysSinceEpoch + 1
  };
}

/**
 * Genera el calendari des d'avui fins al 31/12/2026.
 */
export function generateScheduleUntil2026(): DailySelection[] {
  const schedule: DailySelection[] = [];
  const start = new Date(); 
  const end = new Date('2026-12-31T23:59:59Z');
  
  let current = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  
  while (current <= end) {
    schedule.push(getStationForDate(new Date(current)));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  
  return schedule;
}
