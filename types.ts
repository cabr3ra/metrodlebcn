
export type ConnectionType = 'FGC' | 'Rodalies' | 'Tram' | 'Tramblau' | 'Bus' | 'Info' | 'Renfe' | 'AVE' | 'Funicular' | 'Port' | 'Aeroport';
export type StationType = 'Subterrània' | 'Superfície';
export type LinePosition = 'Extrem' | 'Central';

export interface Station {
  id: string;
  name: string;
  lines: string[];
  type: StationType;
  positions: Record<string, LinePosition>;
  connections: ConnectionType[];
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
  displayedPosition: string;
}

export interface LineStyle {
  primary: string;
  secondary: string;
  font: string;
}

export interface GameStats {
  played: number;
  wins: number;
  streak: number;
  bestStreak: number;
  distribution: number[];
}
