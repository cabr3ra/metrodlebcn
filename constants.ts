
import { Station } from './types';

export interface LineStyle {
  primary: string;
  secondary: string;
  font: string;
}

export const LINE_STYLES: Record<string, LineStyle> = {
  L1: { primary: '#DF2937', secondary: '#8D1B24', font: '#FFFFFF' },
  L2: { primary: '#993C8C', secondary: '#4D1E45', font: '#FFFFFF' },
  L3: { primary: '#3AA83E', secondary: '#216C24', font: '#FFFFFF' },
  L4: { primary: '#FCBE00', secondary: '#7F6000', font: '#1D1D1B' },
  L5: { primary: '#0177BC', secondary: '#003B5F', font: '#FFFFFF' },
  L6: { primary: '#7386BC', secondary: '#4B567A', font: '#FFFFFF' },
  L7: { primary: '#B16612', secondary: '#392106', font: '#FFFFFF' },
  L8: { primary: '#E579AE', secondary: '#994B73', font: '#FFFFFF' },
  L9N: { primary: '#F88D00', secondary: '#7D4700', font: '#FFFFFF' },
  L9S: { primary: '#F88D00', secondary: '#7D4700', font: '#FFFFFF' },
  L10N: { primary: '#08A0E5', secondary: '#063448', font: '#FFFFFF' },
  L10S: { primary: '#08A0E5', secondary: '#063448', font: '#FFFFFF' },
  L11: { primary: '#B4CD56', secondary: '#67782A', font: '#1D1D1B' },
  L12: { primary: '#BBB3D7', secondary: '#786E95', font: '#1D1D1B' }
};

export const STATIONS: Station[] = [
  // --- LÍNIA L1 ---
  { id: '1', name: 'Hospital de Bellvitge', lines: ['L1'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L1: 1 } },
  { id: '2', name: 'Bellvitge', lines: ['L1'], type: 'Subterrània', position: 'Extrem', connections: ['Rodalies'], lineOrders: { L1: 2 } },
  { id: '3', name: 'Av. Carrilet', lines: ['L1', 'L8'], type: 'Subterrània', position: 'Extrem', connections: ['FGC'], lineOrders: { L1: 3, L8: 3 } },
  { id: '4', name: 'Rambla Just Oliveras', lines: ['L1'], type: 'Subterrània', position: 'Extrem', connections: ['Rodalies'], lineOrders: { L1: 4 } },
  { id: '5', name: 'Can Serra', lines: ['L1'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L1: 5 } },
  { id: '6', name: 'Florida', lines: ['L1'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L1: 6 } },
  { id: '7', name: 'Torrassa', lines: ['L1', 'L9S', 'L10S'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L1: 7, L9S: 14, L10S: 14 } },
  { id: '8', name: 'Santa Eulàlia', lines: ['L1'], type: 'Superfície', position: 'Extrem', connections: [], lineOrders: { L1: 8 } },
  { id: '9', name: 'Mercat Nou', lines: ['L1'], type: 'Superfície', position: 'Extrem', connections: [], lineOrders: { L1: 9 } },
  { id: '10', name: 'Plaça de Sants', lines: ['L1', 'L5'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L1: 10, L5: 10 } },
  { id: '11', name: 'Hostafrancs', lines: ['L1'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L1: 11 } },
  { id: '12', name: 'Espanya', lines: ['L1', 'L3', 'L8'], type: 'Subterrània', position: 'Central', connections: ['FGC'], lineOrders: { L1: 12, L3: 8, L8: 1 } },
  { id: '13', name: 'Rocafort', lines: ['L1'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L1: 13 } },
  { id: '14', name: 'Urgell', lines: ['L1'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L1: 14 } },
  { id: '15', name: 'Universitat', lines: ['L1', 'L2'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L1: 15, L2: 3 } },
  { id: '16', name: 'Catalunya', lines: ['L1', 'L3'], type: 'Subterrània', position: 'Central', connections: ['FGC', 'Rodalies'], lineOrders: { L1: 16, L3: 13 } },
  { id: '17', name: 'Urquinaona', lines: ['L1', 'L4'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L1: 17, L4: 5 } },
  { id: '18', name: 'Arc de Triomf', lines: ['L1'], type: 'Subterrània', position: 'Central', connections: ['Rodalies'], lineOrders: { L1: 18 } },
  { id: '19', name: 'Marina', lines: ['L1'], type: 'Subterrània', position: 'Central', connections: ['Tram'], lineOrders: { L1: 19 } },
  { id: '20', name: 'Glòries', lines: ['L1'], type: 'Subterrània', position: 'Central', connections: ['Tram'], lineOrders: { L1: 20 } },
  { id: '21', name: 'El Clot', lines: ['L1', 'L2'], type: 'Subterrània', position: 'Central', connections: ['Rodalies'], lineOrders: { L1: 21, L2: 9 } },
  { id: '22', name: 'Navas', lines: ['L1'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L1: 22 } },
  { id: '23', name: 'La Sagrera', lines: ['L1', 'L4', 'L5', 'L9N', 'L10N'], type: 'Subterrània', position: 'Extrem', connections: ['Rodalies'], lineOrders: { L1: 23, L4: 17, L5: 19, L9N: 11, L10N: 11 } },
  { id: '24', name: 'Fabra i Puig', lines: ['L1'], type: 'Subterrània', position: 'Extrem', connections: ['Rodalies', 'Bus'], lineOrders: { L1: 24 } },
  { id: '25', name: 'Sant Andreu', lines: ['L1'], type: 'Subterrània', position: 'Extrem', connections: ['Rodalies'], lineOrders: { L1: 25 } },
  { id: '26', name: 'Torras i Bages', lines: ['L1'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L1: 26 } },
  { id: '27', name: 'Trinitat Vella', lines: ['L1'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L1: 27 } },
  { id: '28', name: 'Baró de Viver', lines: ['L1'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L1: 28 } },
  { id: '29', name: 'Santa Coloma', lines: ['L1'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L1: 29 } },
  { id: '30', name: 'Fondo', lines: ['L1', 'L9N'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L1: 30, L9N: 10 } },

  // --- L2 ---
  { id: '201', name: 'Paral·lel', lines: ['L2', 'L3'], type: 'Subterrània', position: 'Extrem', connections: ['Funicular de Montjuïc'], lineOrders: { L2: 1, L3: 10 } },
  { id: '202', name: 'Sant Antoni', lines: ['L2'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L2: 2 } },
  { id: '204', name: 'Passeig de Gràcia', lines: ['L2', 'L3', 'L4'], type: 'Subterrània', position: 'Central', connections: ['Rodalies', 'Regional'], lineOrders: { L2: 4, L3: 14, L4: 4 } },
  { id: '205', name: 'Tetuan', lines: ['L2'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L2: 5 } },
  { id: '206', name: 'Monumental', lines: ['L2'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L2: 6 } },
  { id: '207', name: 'Sagrada Família', lines: ['L2', 'L5'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L2: 7, L5: 16 } },
  { id: '208', name: 'Encants', lines: ['L2'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L2: 8 } },
  { id: '210', name: 'Bac de Roda', lines: ['L2'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L2: 10 } },
  { id: '211', name: 'Sant Martí', lines: ['L2'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L2: 11 } },
  { id: '212', name: 'La Pau', lines: ['L2', 'L4'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L2: 12, L4: 19 } },
  { id: '213', name: 'Verneda', lines: ['L2'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L2: 13 } },
  { id: '214', name: 'Artigues | Sant Adrià', lines: ['L2'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L2: 14 } },
  { id: '215', name: 'Sant Roc', lines: ['L2'], type: 'Subterrània', position: 'Extrem', connections: ['Tram'], lineOrders: { L2: 15 } },
  { id: '216', name: 'Gorg', lines: ['L2', 'L10N'], type: 'Subterrània', position: 'Extrem', connections: ['Tram'], lineOrders: { L2: 16, L10N: 1 } },
  { id: '217', name: 'Pep Ventura', lines: ['L2'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L2: 17 } },
  { id: '218', name: 'Badalona Pompeu Fabra', lines: ['L2'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L2: 18 } },

  // --- L3 ---
  { id: '301', name: 'Zona Universitària', lines: ['L3', 'L9S'], type: 'Subterrània', position: 'Extrem', connections: ['Tram'], lineOrders: { L3: 1, L9S: 15 } },
  { id: '302', name: 'Palau Reial', lines: ['L3'], type: 'Subterrània', position: 'Extrem', connections: ['Tram'], lineOrders: { L3: 2 } },
  { id: '303', name: 'Maria Cristina', lines: ['L3'], type: 'Subterrània', position: 'Extrem', connections: ['Tram'], lineOrders: { L3: 3 } },
  { id: '304', name: 'Les Corts', lines: ['L3'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L3: 4 } },
  { id: '305', name: 'Plaça del Centre', lines: ['L3'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L3: 5 } },
  { id: '306', name: 'Sants Estació', lines: ['L3', 'L5'], type: 'Subterrània', position: 'Extrem', connections: ['Rodalies', 'AVE'], lineOrders: { L3: 6, L5: 9 } },
  { id: '307', name: 'Tarragona', lines: ['L3'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L3: 7 } },
  { id: '309', name: 'Poble Sec', lines: ['L3'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L3: 9 } },
  { id: '311', name: 'Drassanes', lines: ['L3'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L3: 11 } },
  { id: '312', name: 'Liceu', lines: ['L3'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L3: 12 } },
  { id: '315', name: 'Diagonal', lines: ['L3', 'L5', 'L6', 'L7'], type: 'Subterrània', position: 'Central', connections: ['FGC'], lineOrders: { L3: 15, L5: 13, L6: 3, L7: 3 } },
  { id: '316', name: 'Fontana', lines: ['L3'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L3: 16 } },
  { id: '317', name: 'Lesseps', lines: ['L3'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L3: 17 } },
  { id: '318', name: 'Vallcarca', lines: ['L3'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L3: 18 } },
  { id: '319', name: 'Penitents', lines: ['L3'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L3: 19 } },
  { id: '320', name: 'Vall d\'Hebron', lines: ['L3', 'L5'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L3: 20, L5: 26 } },
  { id: '321', name: 'Montbau', lines: ['L3'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L3: 21 } },
  { id: '322', name: 'Mundet', lines: ['L3'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L3: 22 } },
  { id: '323', name: 'Valldaura', lines: ['L3'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L3: 23 } },
  { id: '324', name: 'Canyelles', lines: ['L3'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L3: 24 } },
  { id: '325', name: 'Roquetes', lines: ['L3'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L3: 25 } },
  { id: '326', name: 'Trinitat Nova', lines: ['L3', 'L4', 'L11'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L3: 26, L4: 1, L11: 1 } },

  // --- L4 ---
  { id: '401', name: 'Joanic', lines: ['L4'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L4: 2 } },
  { id: '402', name: 'Verdaguer', lines: ['L4', 'L5'], type: 'Subterrània', position: 'Central', connections: [], lineOrders: { L4: 3, L5: 15 } },
  { id: '405', name: 'Barceloneta', lines: ['L4'], type: 'Subterrània', position: 'Central', connections: ['Rodalies'], lineOrders: { L4: 7 } },
  { id: '406', name: 'Ciutadella | Vila Olímpica', lines: ['L4'], type: 'Subterrània', position: 'Central', connections: ['Tram'], lineOrders: { L4: 8 } },
  { id: '410', name: 'Selva de Mar', lines: ['L4'], type: 'Subterrània', position: 'Extrem', connections: ['Tram'], lineOrders: { L4: 12 } },
  { id: '411', name: 'El Maresme | Fòrum', lines: ['L4'], type: 'Subterrània', position: 'Extrem', connections: ['Tram'], lineOrders: { L4: 13 } },
  { id: '413', name: 'Besòs', lines: ['L4'], type: 'Subterrània', position: 'Extrem', connections: ['Tram'], lineOrders: { L4: 15 } },

  // --- L9 SUD ---
  { id: '901', name: 'Aeroport T1', lines: ['L9S'], type: 'Subterrània', position: 'Extrem', connections: ['Aeropuerto'], lineOrders: { L9S: 1 } },
  { id: '902', name: 'Aeroport T2', lines: ['L9S'], type: 'Subterrània', position: 'Extrem', connections: ['Rodalies', 'Aeropuerto'], lineOrders: { L9S: 2 } },
  { id: '903', name: 'Parc Nou', lines: ['L9S'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L9S: 3 } },
  { id: '904', name: 'Cèntric', lines: ['L9S'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L9S: 4 } },
  { id: '905', name: 'El Prat Estació', lines: ['L9S'], type: 'Subterrània', position: 'Extrem', connections: ['Rodalies'], lineOrders: { L9S: 5 } },
  { id: '906', name: 'Les Moreres', lines: ['L9S'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L9S: 6 } },
  { id: '907', name: 'Mercabarna', lines: ['L9S'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L9S: 7 } },
  { id: '908', name: 'Parc Logístic', lines: ['L9S'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L9S: 8 } },
  { id: '909', name: 'Fira', lines: ['L9S'], type: 'Subterrània', position: 'Extrem', connections: ['Tram'], lineOrders: { L9S: 9 } },
  { id: '910', name: 'Europa | Fira', lines: ['L9S', 'L8'], type: 'Subterrània', position: 'Extrem', connections: ['FGC'], lineOrders: { L9S: 10, L8: 5 } },
  { id: '911', name: 'Can Tries | Gornal', lines: ['L9S', 'L10S'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L9S: 11, L10S: 11 } },
  { id: '912', name: 'Provençana', lines: ['L10S'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L10S: 12 } },
  { id: '913', name: 'Ciutat de la Justícia', lines: ['L10S', 'L8'], type: 'Subterrània', position: 'Extrem', connections: ['FGC'], lineOrders: { L10S: 13, L8: 4 } },
  { id: '914', name: 'Collblanc', lines: ['L5', 'L9S', 'L10S'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L5: 8, L9S: 13, L10S: 15 } },

  // --- L10 SUD ---
  { id: '1001', name: 'ZAL | Riu Vell', lines: ['L10S'], type: 'Superfície', position: 'Extrem', connections: [], lineOrders: { L10S: 1 } },
  { id: '1002', name: 'Ecoparc', lines: ['L10S'], type: 'Superfície', position: 'Extrem', connections: [], lineOrders: { L10S: 2 } },
  { id: '1003', name: 'Port Comercial | La Factoria', lines: ['L10S'], type: 'Superfície', position: 'Extrem', connections: [], lineOrders: { L10S: 3 } },
  { id: '1004', name: 'Zona Franca', lines: ['L10S'], type: 'Superfície', position: 'Extrem', connections: [], lineOrders: { L10S: 4 } },
  { id: '1005', name: 'Foc', lines: ['L10S'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L10S: 5 } },
  { id: '1006', name: 'Foneria', lines: ['L10S'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L10S: 6 } },

  // --- L9 NORD ---
  { id: '951', name: 'Can Zam', lines: ['L9N'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L9N: 1 } },
  { id: '952', name: 'Singuerlín', lines: ['L9N'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L9N: 2 } },
  { id: '953', name: 'Església Major', lines: ['L9N'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L9N: 3 } },
  { id: '954', name: 'Santa Rosa', lines: ['L9N'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L9N: 4 } },
  { id: '955', name: 'Bon Pastor', lines: ['L9N', 'L10N'], type: 'Subterrània', position: 'Central', connections: ['Bus'], lineOrders: { L9N: 6, L10N: 6 } },
  { id: '956', name: 'Onze de Setembre', lines: ['L9N', 'L10N'], type: 'Subterrània', position: 'Central', connections: ['Bus'], lineOrders: { L9N: 7, L10N: 7 } },
  { id: '957', name: 'Can Peixauet', lines: ['L9N'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L9N: 5 } },

  // --- L10 NORD / L11 ---
  { id: '1051', name: 'La Salut', lines: ['L10N'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L10N: 2 } },
  { id: '1052', name: 'Llefià', lines: ['L10N'], type: 'Subterrània', position: 'Extrem', connections: [], lineOrders: { L10N: 3 } },
  { id: '1053', name: 'La Sagrera | TAV', lines: ['L4', 'L9N', 'L10N'], type: 'Subterrània', position: 'Extrem', connections: ['AVE'], lineOrders: { L4: 18, L9N: 9, L10N: 9 } },
  { id: '1102', name: 'Torre Baró | Vallbona', lines: ['L11'], type: 'Subterrània', position: 'Central', connections: ['Rodalies'], lineOrders: { L11: 3 } }
];
