
export type ConnectionType = 'FGC' | 'Rodalies' | 'Tram' | 'Bus' | 'Montjuïc' | 'Info' | 'Aeropuerto' | 'Regional' | 'AVE' | 'Funicular de Montjuïc';
export type StationType = 'Subterrània' | 'Superfície' | 'Elevada';
export type LinePosition = 'Extrem' | 'Central';

export interface Station {
  id: string;
  name: string;
  lines: string[];
  type: StationType;
  position: LinePosition;
  connections: ConnectionType[];
  // Mapeja cada línia al seu número d'ordre en aquella línia específica
  lineOrders: Record<string, number>; 
}

export enum MatchType {
  CORRECT = 'correct',
  PARTIAL = 'partial',
  WRONG = 'wrong'
}

export interface GuessResult {
  station: Station;
  nameMatch: boolean;
  lineMatch: MatchType;
  positionMatch: MatchType;
  typeMatch: MatchType;
  connectionsMatch: MatchType;
  distanceMatch: number;
  distanceDirection: 'up' | 'down' | 'none';
}

export interface GameStats {
  played: number;
  wins: number;
  streak: number;
  bestStreak: number;
  distribution: number[];
}
