
import fs from 'fs';
import path from 'path';

// Manually defining the data based on constants.ts to avoid parsing complexity
const LINE_STYLES = {
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

const STATIONS = [
    { id: '1', name: 'Hospital de Bellvitge', lines: ['L1'], type: 'Subterrània', position: { L1: 'Extrem' }, connections: [], lineOrders: { L1: 1 } },
    { id: '2', name: 'Bellvitge', lines: ['L1'], type: 'Subterrània', position: { L1: 'Extrem' }, connections: [], lineOrders: { L1: 2 } },
    { id: '3', name: 'Av. Carrilet', lines: ['L1', 'L8'], type: 'Subterrània', position: { L1: 'Extrem', L8: 'Central' }, connections: ['FGC'], lineOrders: { L1: 3, L8: 7 } },
    { id: '4', name: 'Rbla. Just Oliveras', lines: ['L1'], type: 'Subterrània', position: { L1: 'Extrem' }, connections: ['Rodalies'], lineOrders: { L1: 4 } },
    { id: '5', name: 'Can Serra', lines: ['L1'], type: 'Subterrània', position: { L1: 'Extrem' }, connections: [], lineOrders: { L1: 5 } },
    { id: '6', name: 'Florida', lines: ['L1'], type: 'Subterrània', position: { L1: 'Extrem' }, connections: [], lineOrders: { L1: 6 } },
    { id: '7', name: 'Torrassa', lines: ['L1', 'L9S', 'L10S'], type: 'Subterrània', position: { L1: 'Extrem', L9S: 'Extrem', L10S: 'Extrem' }, connections: [], lineOrders: { L1: 7, L9S: 13, L10S: 10 } },
    { id: '8', name: 'Santa Eulàlia', lines: ['L1'], type: 'Superfície', position: { L1: 'Extrem' }, connections: [], lineOrders: { L1: 8 } },
    { id: '9', name: 'Mercat Nou', lines: ['L1'], type: 'Superfície', position: { L1: 'Extrem' }, connections: [], lineOrders: { L1: 9 } },
    { id: '10', name: 'Plaça de Sants', lines: ['L1', 'L5'], type: 'Subterrània', position: { L1: 'Central', L5: 'Central' }, connections: [], lineOrders: { L1: 10, L5: 10 } },
    { id: '11', name: 'Hostafrancs', lines: ['L1'], type: 'Subterrània', position: { L1: 'Central' }, connections: [], lineOrders: { L1: 11 } },
    { id: '12', name: 'Espanya', lines: ['L1', 'L3', 'L8'], type: 'Subterrània', position: { L1: 'Central', L3: 'Central', L8: 'Extrem' }, connections: ['FGC'], lineOrders: { L1: 12, L3: 8, L8: 1 } },
    { id: '13', name: 'Rocafort', lines: ['L1'], type: 'Subterrània', position: { L1: 'Central' }, connections: [], lineOrders: { L1: 13 } },
    { id: '14', name: 'Urgell', lines: ['L1'], type: 'Subterrània', position: { L1: 'Central' }, connections: [], lineOrders: { L1: 14 } },
    { id: '15', name: 'Universitat', lines: ['L1', 'L2'], type: 'Subterrània', position: { L1: 'Central', L2: 'Extrem' }, connections: ['Info'], lineOrders: { L1: 15, L2: 3 } },
    { id: '16', name: 'Catalunya', lines: ['L1', 'L3', 'L6', 'L7'], type: 'Subterrània', position: { L1: 'Central', L3: 'Central', L6: 'Extrem', L7: 'Extrem' }, connections: ['FGC', 'Rodalies'], lineOrders: { L1: 16, L3: 13, L6: 1, L7: 1 } },
    { id: '17', name: 'Urquinaona', lines: ['L1', 'L4'], type: 'Subterrània', position: { L1: 'Central', L4: 'Central' }, connections: [], lineOrders: { L1: 17, L4: 12 } },
    { id: '18', name: 'Arc de Triomf', lines: ['L1'], type: 'Subterrània', position: { L1: 'Central' }, connections: ['Rodalies', 'Bus'], lineOrders: { L1: 18 } },
    { id: '19', name: 'Marina', lines: ['L1'], type: 'Subterrània', position: { L1: 'Central' }, connections: ['Tram'], lineOrders: { L1: 19 } },
    { id: '20', name: 'Glòries', lines: ['L1'], type: 'Subterrània', position: { L1: 'Central' }, connections: ['Tram'], lineOrders: { L1: 20 } },
    { id: '21', name: 'Clot', lines: ['L1', 'L2'], type: 'Subterrània', position: { L1: 'Central', L2: 'Central' }, connections: ['Rodalies'], lineOrders: { L1: 21, L2: 9 } },
    { id: '22', name: 'Navas', lines: ['L1'], type: 'Subterrània', position: { L1: 'Extrem' }, connections: [], lineOrders: { L1: 22 } },
    { id: '23', name: 'La Sagrera', lines: ['L1', 'L5', 'L9N', 'L10N'], type: 'Subterrània', position: { L1: 'Extrem', L5: 'Central', L9N: 'Extrem', L10N: 'Extrem' }, connections: ['Info', 'Rodalies'], lineOrders: { L1: 23, L5: 19, L9N: 1, L10N: 1 } },
    { id: '24', name: 'Fabra i Puig', lines: ['L1'], type: 'Subterrània', position: { L1: 'Extrem' }, connections: ['Rodalies', 'Bus'], lineOrders: { L1: 24 } },
    { id: '25', name: 'Sant Andreu', lines: ['L1'], type: 'Subterrània', position: { L1: 'Extrem' }, connections: ['Rodalies'], lineOrders: { L1: 25 } },
    { id: '26', name: 'Torras i Bages', lines: ['L1'], type: 'Subterrània', position: { L1: 'Extrem' }, connections: [], lineOrders: { L1: 26 } },
    { id: '27', name: 'Trinitat Vella', lines: ['L1'], type: 'Subterrània', position: { L1: 'Extrem' }, connections: [], lineOrders: { L1: 27 } },
    { id: '28', name: 'Baró de Viver', lines: ['L1'], type: 'Subterrània', position: { L1: 'Extrem' }, connections: [], lineOrders: { L1: 28 } },
    { id: '29', name: 'Santa Coloma', lines: ['L1'], type: 'Subterrània', position: { L1: 'Extrem' }, connections: [], lineOrders: { L1: 29 } },
    { id: '30', name: 'Fondo', lines: ['L1', 'L9N'], type: 'Subterrània', position: { L1: 'Extrem', L9N: 'Central' }, connections: [], lineOrders: { L1: 30, L9N: 6 } },

    { id: '31', name: 'Paral·lel', lines: ['L2', 'L3'], type: 'Subterrània', position: { L2: 'Extrem', L3: 'Central' }, connections: ['Funicular'], lineOrders: { L2: 1, L3: 10 } },
    { id: '32', name: 'Sant Antoni', lines: ['L2'], type: 'Subterrània', position: { L2: 'Extrem' }, connections: [], lineOrders: { L2: 2 } },
    { id: '34', name: 'Passeig de Gràcia', lines: ['L2', 'L3', 'L4'], type: 'Subterrània', position: { L2: 'Extrem', L3: 'Central', L4: 'Central' }, connections: ['Rodalies', 'Renfe'], lineOrders: { L2: 4, L3: 14, L4: 13 } },
    { id: '35', name: 'Tetuan', lines: ['L2'], type: 'Subterrània', position: { L2: 'Extrem' }, connections: [], lineOrders: { L2: 5 } },
    { id: '36', name: 'Monumental', lines: ['L2'], type: 'Subterrània', position: { L2: 'Central' }, connections: ['Tram'], lineOrders: { L2: 6 } },
    { id: '37', name: 'Sagrada Família', lines: ['L2', 'L5'], type: 'Subterrània', position: { L2: 'Central', L5: 'Central' }, connections: [], lineOrders: { L2: 7, L5: 16 } },
    { id: '38', name: 'Encants', lines: ['L2'], type: 'Subterrània', position: { L2: 'Central' }, connections: [], lineOrders: { L2: 8 } },
    { id: '40', name: 'Bac de Roda', lines: ['L2'], type: 'Subterrània', position: { L2: 'Central' }, connections: [], lineOrders: { L2: 10 } },
    { id: '41', name: 'Sant Martí', lines: ['L2'], type: 'Subterrània', position: { L2: 'Central' }, connections: [], lineOrders: { L2: 11 } },
    { id: '42', name: 'La Pau', lines: ['L2', 'L4'], type: 'Subterrània', position: { L2: 'Central', L4: 'Extrem' }, connections: [], lineOrders: { L2: 12, L4: 1 } },
    { id: '43', name: 'Verneda', lines: ['L2'], type: 'Subterrània', position: { L2: 'Central' }, connections: [], lineOrders: { L2: 13 } },
    { id: '44', name: 'Artigues | Sant Adrià', lines: ['L2'], type: 'Subterrània', position: { L2: 'Extrem' }, connections: [], lineOrders: { L2: 14 } },
    { id: '45', name: 'Sant Roc', lines: ['L2'], type: 'Subterrània', position: { L2: 'Extrem' }, connections: ['Tram'], lineOrders: { L2: 15 } },
    { id: '46', name: 'Gorg', lines: ['L2', 'L10N'], type: 'Subterrània', position: { L2: 'Extrem', L10N: 'Extrem' }, connections: ['Tram'], lineOrders: { L2: 16, L10N: 6 } },
    { id: '47', name: 'Pep Ventura', lines: ['L2'], type: 'Subterrània', position: { L2: 'Extrem' }, connections: [], lineOrders: { L2: 17 } },
    { id: '48', name: 'Badalona Pompeu Fabra', lines: ['L2'], type: 'Subterrània', position: { L2: 'Extrem' }, connections: [], lineOrders: { L2: 18 } },

    { id: '49', name: 'Zona Universitària', lines: ['L3', 'L9S'], type: 'Subterrània', position: { L3: 'Extrem', L9S: 'Extrem' }, connections: ['Tram'], lineOrders: { L3: 1, L9S: 15 } },
    { id: '50', name: 'Palau Reial', lines: ['L3'], type: 'Subterrània', position: { L3: 'Extrem' }, connections: ['Tram'], lineOrders: { L3: 2 } },
    { id: '51', name: 'Maria Cristina', lines: ['L3'], type: 'Subterrània', position: { L3: 'Extrem' }, connections: ['Tram'], lineOrders: { L3: 3 } },
    { id: '52', name: 'Les Corts', lines: ['L3'], type: 'Subterrània', position: { L3: 'Extrem' }, connections: [], lineOrders: { L3: 4 } },
    { id: '53', name: 'Plaça del Centre', lines: ['L3'], type: 'Subterrània', position: { L3: 'Extrem' }, connections: [], lineOrders: { L3: 5 } },
    { id: '54', name: 'Sants Estació', lines: ['L3', 'L5'], type: 'Subterrània', position: { L3: 'Extrem', L5: 'Central' }, connections: ['Rodalies', 'Renfe', 'AVE', 'Bus'], lineOrders: { L3: 6, L5: 11 } },
    { id: '55', name: 'Tarragona', lines: ['L3'], type: 'Subterrània', position: { L3: 'Extrem' }, connections: [], lineOrders: { L3: 7 } },
    { id: '56', name: 'Poble Sec', lines: ['L3'], type: 'Subterrània', position: { L3: 'Central' }, connections: [], lineOrders: { L3: 9 } },
    { id: '57', name: 'Drassanes', lines: ['L3'], type: 'Subterrània', position: { L3: 'Central' }, connections: ['Port'], lineOrders: { L3: 11 } },
    { id: '58', name: 'Liceu', lines: ['L3'], type: 'Subterrània', position: { L3: 'Central' }, connections: [], lineOrders: { L3: 12 } },
    { id: '59', name: 'Diagonal', lines: ['L3', 'L5', 'L6', 'L7'], type: 'Subterrània', position: { L3: 'Central', L5: 'Central', L6: 'Extrem', L7: 'Extrem' }, connections: ['Info', 'FGC'], lineOrders: { L3: 15, L5: 14, L6: 2, L7: 2 } },
    { id: '60', name: 'Fontana', lines: ['L3'], type: 'Subterrània', position: { L3: 'Central' }, connections: [], lineOrders: { L3: 16 } },
    { id: '61', name: 'Lesseps', lines: ['L3'], type: 'Subterrània', position: { L3: 'Central' }, connections: [], lineOrders: { L3: 17 } },
    { id: '62', name: 'Vallcarca', lines: ['L3'], type: 'Subterrània', position: { L3: 'Central' }, connections: [], lineOrders: { L3: 18 } },
    { id: '63', name: 'Penitents', lines: ['L3'], type: 'Subterrània', position: { L3: 'Central' }, connections: [], lineOrders: { L3: 19 } },
    { id: '64', name: 'Vall d\'Hebron', lines: ['L3', 'L5'], type: 'Subterrània', position: { L3: 'Extrem', L5: 'Extrem' }, connections: [], lineOrders: { L3: 20, L5: 27 } },
    { id: '65', name: 'Montbau', lines: ['L3'], type: 'Subterrània', position: { L3: 'Extrem' }, connections: [], lineOrders: { L3: 21 } },
    { id: '66', name: 'Mundet', lines: ['L3'], type: 'Subterrània', position: { L3: 'Extrem' }, connections: [], lineOrders: { L3: 22 } },
    { id: '67', name: 'Valldaura', lines: ['L3'], type: 'Subterrània', position: { L3: 'Extrem' }, connections: [], lineOrders: { L3: 23 } },
    { id: '68', name: 'Canyelles', lines: ['L3'], type: 'Subterrània', position: { L3: 'Extrem' }, connections: [], lineOrders: { L3: 24 } },
    { id: '69', name: 'Roquetes', lines: ['L3'], type: 'Subterrània', position: { L3: 'Extrem' }, connections: [], lineOrders: { L3: 25 } },
    { id: '70', name: 'Trinitat Nova', lines: ['L3', 'L4', 'L11'], type: 'Subterrània', position: { L3: 'Extrem', L4: 'Extrem', L11: 'Extrem' }, connections: [], lineOrders: { L3: 26, L4: 24, L11: 1 } },

    { id: '71', name: 'Besòs', lines: ['L4'], type: 'Subterrània', position: { L4: 'Extrem' }, connections: ['Tram'], lineOrders: { L4: 2 } },
    { id: '72', name: 'Besòs Mar', lines: ['L4'], type: 'Subterrània', position: { L4: 'Extrem' }, connections: [], lineOrders: { L4: 3 } },
    { id: '73', name: 'El Maresme | Fòrum', lines: ['L4'], type: 'Subterrània', position: { L4: 'Extrem' }, connections: ['Tram'], lineOrders: { L4: 4 } },
    { id: '74', name: 'Selva de Mar', lines: ['L4'], type: 'Subterrània', position: { L4: 'Extrem' }, connections: ['Tram'], lineOrders: { L4: 5 } },
    { id: '75', name: 'Poblenou', lines: ['L4'], type: 'Subterrània', position: { L4: 'Extrem' }, connections: [], lineOrders: { L4: 6 } },
    { id: '76', name: 'Llacuna', lines: ['L4'], type: 'Subterrània', position: { L4: 'Central' }, connections: [], lineOrders: { L4: 7 } },
    { id: '77', name: 'Bogatell', lines: ['L4'], type: 'Subterrània', position: { L4: 'Central' }, connections: [], lineOrders: { L4: 8 } },
    { id: '78', name: 'Ciutadella | Vila Olímpica', lines: ['L4'], type: 'Subterrània', position: { L4: 'Central' }, connections: ['Tram'], lineOrders: { L4: 9 } },
    { id: '79', name: 'Barceloneta', lines: ['L4'], type: 'Subterrània', position: { L4: 'Central' }, connections: ['Rodalies', 'Renfe'], lineOrders: { L4: 10 } },
    { id: '80', name: 'Jaume I', lines: ['L4'], type: 'Subterrània', position: { L4: 'Central' }, connections: [], lineOrders: { L4: 11 } },
    { id: '81', name: 'Girona', lines: ['L4'], type: 'Subterrània', position: { L4: 'Central' }, connections: [], lineOrders: { L4: 14 } },
    { id: '82', name: 'Verdaguer', lines: ['L4', 'L5'], type: 'Subterrània', position: { L4: 'Central', L5: 'Central' }, connections: [], lineOrders: { L4: 15, L5: 15 } },
    { id: '83', name: 'Joanic', lines: ['L4'], type: 'Subterrània', position: { L4: 'Central' }, connections: [], lineOrders: { L4: 16 } },
    { id: '84', name: 'Alfons X', lines: ['L4'], type: 'Subterrània', position: { L4: 'Extrem' }, connections: [], lineOrders: { L4: 17 } },
    { id: '85', name: 'Guinardó | Hospital Sant Pau', lines: ['L4'], type: 'Subterrània', position: { L4: 'Extrem' }, connections: [], lineOrders: { L4: 18 } },
    { id: '86', name: 'Maragall', lines: ['L4', 'L5'], type: 'Subterrània', position: { L4: 'Extrem', L5: 'Extrem' }, connections: [], lineOrders: { L4: 19, L5: 21 } },
    { id: '87', name: 'Llucmajor', lines: ['L4'], type: 'Subterrània', position: { L4: 'Extrem' }, connections: [], lineOrders: { L4: 22 } },
    { id: '88', name: 'Via Júlia', lines: ['L4'], type: 'Subterrània', position: { L4: 'Extrem' }, connections: [], lineOrders: { L4: 23 } },

    { id: '89', name: 'Cornellà Centre', lines: ['L5'], type: 'Subterrània', position: { L5: 'Extrem' }, connections: ['Tram', 'Rodalies'], lineOrders: { L5: 1 } },
    { id: '90', name: 'Gavarra', lines: ['L5'], type: 'Subterrània', position: { L5: 'Extrem' }, connections: [], lineOrders: { L5: 2 } },
    { id: '91', name: 'Sant Ildefons', lines: ['L5'], type: 'Subterrània', position: { L5: 'Extrem' }, connections: [], lineOrders: { L5: 3 } },
    { id: '92', name: 'Can Boixeres', lines: ['L5'], type: 'Subterrània', position: { L5: 'Extrem' }, connections: [], lineOrders: { L5: 4 } },
    { id: '93', name: 'Can Vidalet', lines: ['L5'], type: 'Subterrània', position: { L5: 'Extrem' }, connections: [], lineOrders: { L5: 5 } },
    { id: '94', name: 'Pubilla Cases', lines: ['L5'], type: 'Subterrània', position: { L5: 'Extrem' }, connections: [], lineOrders: { L5: 6 } },
    { id: '95', name: 'Ernest Lluch', lines: ['L5'], type: 'Subterrània', position: { L5: 'Extrem' }, connections: ['Tram'], lineOrders: { L5: 7 } },
    { id: '96', name: 'Collblanc', lines: ['L5'], type: 'Subterrània', position: { L5: 'Central', L9S: 'Extrem', L10S: 'Extrem' }, connections: [], lineOrders: { L5: 8, L9S: 14, L10S: 11 } },
    { id: '97', name: 'Badal', lines: ['L5'], type: 'Subterrània', position: { L5: 'Central' }, connections: [], lineOrders: { L5: 9 } },
    { id: '98', name: 'Entença', lines: ['L5'], type: 'Subterrània', position: { L5: 'Central' }, connections: [], lineOrders: { L5: 12 } },
    { id: '99', name: 'Hospital Clínic', lines: ['L5'], type: 'Subterrània', position: { L5: 'Central' }, connections: [], lineOrders: { L5: 13 } },
    { id: '100', name: 'Sant Pau | Dos de Maig', lines: ['L5'], type: 'Subterrània', position: { L5: 'Central' }, connections: [], lineOrders: { L5: 17 } },
    { id: '101', name: 'Camp de l\'Arpa', lines: ['L5'], type: 'Subterrània', position: { L5: 'Central' }, connections: [], lineOrders: { L5: 18 } },
    { id: '102', name: 'Congrés', lines: ['L5'], type: 'Subterrània', position: { L5: 'Central' }, connections: [], lineOrders: { L5: 20 } },
    { id: '103', name: 'Virrei Amat', lines: ['L5'], type: 'Subterrània', position: { L5: 'Extrem' }, connections: [], lineOrders: { L5: 22 } },
    { id: '104', name: 'Vilapiscina', lines: ['L5'], type: 'Subterrània', position: { L5: 'Extrem' }, connections: [], lineOrders: { L5: 23 } },
    { id: '105', name: 'Horta', lines: ['L5'], type: 'Subterrània', position: { L5: 'Extrem' }, connections: [], lineOrders: { L5: 24 } },
    { id: '106', name: 'El Carmel', lines: ['L5'], type: 'Subterrània', position: { L5: 'Extrem' }, connections: [], lineOrders: { L5: 25 } },
    { id: '107', name: 'El Coll | La Teixonera', lines: ['L5'], type: 'Subterrània', position: { L5: 'Extrem' }, connections: [], lineOrders: { L5: 26 } },

    { id: '108', name: 'Gràcia', lines: ['L6', 'L7'], type: 'Subterrània', position: { L6: 'Central', L7: 'Central' }, connections: ['FGC'], lineOrders: { L6: 3, L7: 3 } },
    { id: '109', name: 'Sant Gervasi', lines: ['L6'], type: 'Subterrània', position: { L6: 'Central' }, connections: ['FGC'], lineOrders: { L6: 4 } },
    { id: '110', name: 'Muntaner', lines: ['L6'], type: 'Subterrània', position: { L6: 'Central' }, connections: ['FGC'], lineOrders: { L6: 5 } },
    { id: '111', name: 'La Bonanova', lines: ['L6'], type: 'Subterrània', position: { L6: 'Central' }, connections: ['FGC'], lineOrders: { L6: 6 } },
    { id: '112', name: 'Les Tres Torres', lines: ['L6'], type: 'Subterrània', position: { L6: 'Extrem' }, connections: ['FGC'], lineOrders: { L6: 7 } },
    { id: '113', name: 'Sarrià', lines: ['L6', 'L12'], type: 'Subterrània', position: { L6: 'Extrem', L12: 'Extrem' }, connections: ['FGC'], lineOrders: { L6: 8, L12: 1 } },

    { id: '114', name: 'Pl. Molina', lines: ['L7'], type: 'Subterrània', position: { L7: 'Central' }, connections: [], lineOrders: { L7: 4 } },
    { id: '115', name: 'Pàdua', lines: ['L7'], type: 'Subterrània', position: { L7: 'Central' }, connections: [], lineOrders: { L7: 5 } },
    { id: '116', name: 'El Putxet', lines: ['L7'], type: 'Subterrània', position: { L7: 'Extrem' }, connections: [], lineOrders: { L7: 6 } },
    { id: '117', name: 'Av. Tibidabo', lines: ['L7'], type: 'Subterrània', position: { L7: 'Extrem' }, connections: ['Tramblau'], lineOrders: { L7: 7 } },

    { id: '118', name: 'Magòria-La Campana', lines: ['L8'], type: 'Subterrània', position: { L8: 'Extrem' }, connections: ['FGC'], lineOrders: { L8: 2 } },
    { id: '119', name: 'Ildefons Cerdà', lines: ['L8', 'L10S'], type: 'Subterrània', position: { L8: 'Extrem', L10S: 'Central' }, connections: ['FGC'], lineOrders: { L8: 3, L10S: 7 } }, // Ciutat de la Justícia
    { id: '120', name: 'Europa | Fira', lines: ['L8', 'L9S'], type: 'Subterrània', position: { L8: 'Central', L9S: 'Central' }, connections: ['FGC'], lineOrders: { L8: 4, L9S: 11 } },
    { id: '121', name: 'Gornal', lines: ['L8'], type: 'Subterrània', position: { L8: 'Central' }, connections: ['FGC', 'Rodalies'], lineOrders: { L8: 5 } },
    { id: '122', name: 'Sant Josep', lines: ['L8'], type: 'Subterrània', position: { L8: 'Central' }, connections: ['FGC'], lineOrders: { L8: 6 } },
    { id: '123', name: 'Almeda', lines: ['L8'], type: 'Subterrània', position: { L8: 'Central' }, connections: ['FGC'], lineOrders: { L8: 8 } },
    { id: '124', name: 'Cornellà Riera', lines: ['L8'], type: 'Subterrània', position: { L8: 'Extrem' }, connections: ['FGC'], lineOrders: { L8: 9 } },
    { id: '125', name: 'Sant Boi', lines: ['L8'], type: 'Subterrània', position: { L8: 'Extrem' }, connections: ['FGC'], lineOrders: { L8: 10 } },
    { id: '126', name: 'Molí Nou | Ciutat Cooperativa', lines: ['L8'], type: 'Subterrània', position: { L8: 'Extrem' }, connections: ['FGC'], lineOrders: { L8: 11 } },

    { id: '127', name: 'Aeroport T1', lines: ['L9S'], type: 'Subterrània', position: { L9S: 'Extrem' }, connections: ['Aeroport'], lineOrders: { L9S: 1 } },
    { id: '128', name: 'Aeroport T2', lines: ['L9S'], type: 'Subterrània', position: { L9S: 'Extrem' }, connections: ['Rodalies', 'Aeroport'], lineOrders: { L9S: 2 } },
    { id: '129', name: 'Mas Blau', lines: ['L9S'], type: 'Subterrània', position: { L9S: 'Extrem' }, connections: [], lineOrders: { L9S: 3 } },
    { id: '130', name: 'Parc Nou', lines: ['L9S'], type: 'Subterrània', position: { L9S: 'Extrem' }, connections: [], lineOrders: { L9S: 4 } },
    { id: '131', name: 'Cèntric', lines: ['L9S'], type: 'Subterrània', position: { L9S: 'Central' }, connections: [], lineOrders: { L9S: 5 } },
    { id: '132', name: 'El Prat Estació', lines: ['L9S'], type: 'Subterrània', position: { L9S: 'Central' }, connections: ['Rodalies'], lineOrders: { L9S: 6 } },
    { id: '133', name: 'Les Moreres', lines: ['L9S'], type: 'Subterrània', position: { L9S: 'Central' }, connections: [], lineOrders: { L9S: 7 } },
    { id: '134', name: 'Mercabarna', lines: ['L9S'], type: 'Subterrània', position: { L9S: 'Central' }, connections: [], lineOrders: { L9S: 8 } },
    { id: '134', name: 'Parc Logístic', lines: ['L9S'], type: 'Subterrània', position: { L9S: 'Central' }, connections: [], lineOrders: { L9S: 9 } },
    { id: '135', name: 'Fira', lines: ['L9S'], type: 'Subterrània', position: { L9S: 'Central' }, connections: [], lineOrders: { L9S: 10 } },
    { id: '137', name: 'Can Tries | Gornal', lines: ['L9S', 'L10S'], type: 'Subterrània', position: { L9S: 'Extrem', L10S: 'Extrem' }, connections: [], lineOrders: { L9S: 12, L10S: 9 } },


    { id: '138', name: 'ZAL | Riu Vell', lines: ['L10S'], type: 'Superfície', position: { L10S: 'Extrem' }, connections: [], lineOrders: { L10S: 1 } },
    { id: '139', name: 'Ecoparc', lines: ['L10S'], type: 'Superfície', position: { L10S: 'Extrem' }, connections: [], lineOrders: { L10S: 2 } },
    { id: '140', name: 'Port Comercial | La Factoria', lines: ['L10S'], type: 'Superfície', position: { L10S: 'Extrem' }, connections: [], lineOrders: { L10S: 3 } },
    { id: '141', name: 'Zona Franca', lines: ['L10S'], type: 'Superfície', position: { L10S: 'Central' }, connections: [], lineOrders: { L10S: 4 } },
    { id: '142', name: 'Foc', lines: ['L10S'], type: 'Subterrània', position: { L10S: 'Central' }, connections: [], lineOrders: { L10S: 5 } },
    { id: '143', name: 'Foneria', lines: ['L10S'], type: 'Subterrània', position: { L10S: 'Central' }, connections: [], lineOrders: { L10S: 6 } },
    { id: '144', name: 'Provençana', lines: ['L10S'], type: 'Subterrània', position: { L10S: 'Central' }, connections: [], lineOrders: { L10S: 8 } },

    { id: '145', name: 'Onze de Setembre', lines: ['L9N', 'L10N'], type: 'Subterrània', position: { L9N: 'Extrem', L10N: 'Extrem' }, connections: [], lineOrders: { L9N: 2, L10N: 2 } },
    { id: '146', name: 'Bon Pastor', lines: ['L9N', 'L10N'], type: 'Subterrània', position: { L9N: 'Extrem', L10N: 'Central' }, connections: [], lineOrders: { L9N: 3, L10N: 3 } },
    { id: '147', name: 'Can Peixauet', lines: ['L9N'], type: 'Subterrània', position: { L9N: 'Central' }, connections: [], lineOrders: { L9N: 4 } },
    { id: '148', name: 'Santa Rosa', lines: ['L9N'], type: 'Subterrània', position: { L9N: 'Central' }, connections: [], lineOrders: { L9N: 5 } },
    { id: '149', name: 'Església Major', lines: ['L9N'], type: 'Subterrània', position: { L9N: 'Extrem' }, connections: [], lineOrders: { L9N: 7 } },
    { id: '150', name: 'Singuerlín', lines: ['L9N'], type: 'Subterrània', position: { L9N: 'Extrem' }, connections: [], lineOrders: { L9N: 8 } },
    { id: '151', name: 'Can Zam', lines: ['L9N'], type: 'Subterrània', position: { L9N: 'Extrem' }, connections: [], lineOrders: { L9N: 9 } },

    { id: '152', name: 'Llefià', lines: ['L10N'], type: 'Subterrània', position: { L10N: 'Central' }, connections: [], lineOrders: { L10N: 4 } },
    { id: '153', name: 'La Salut', lines: ['L10N'], type: 'Subterrània', position: { L10N: 'Extrem' }, connections: [], lineOrders: { L10N: 5 } },

    { id: '154', name: 'Casa de l\'Aigua', lines: ['L11'], type: 'Subterrània', position: { L11: 'Central' }, connections: [], lineOrders: { L11: 2 } },
    { id: '155', name: 'Torre Baró | Vallbona', lines: ['L11'], type: 'Subterrània', position: { L11: 'Central' }, connections: ['Rodalies'], lineOrders: { L11: 3 } },
    { id: '156', name: 'Ciutat Meridiana', lines: ['L11'], type: 'Subterrània', position: { L11: 'Central' }, connections: [], lineOrders: { L11: 4 } },
    { id: '157', name: 'Can Cuiàs', lines: ['L11'], type: 'Subterrània', position: { L11: 'Extrem' }, connections: [], lineOrders: { L11: 5 } },

    { id: '158', name: 'Reina Elisenda', lines: ['L12'], type: 'Subterrània', position: { L12: 'Extrem' }, connections: [], lineOrders: { L12: 2 } },
];

let sql = `
-- CLEANUP: Drop tables if they exist to start fresh and avoid conflicts
DROP TABLE IF EXISTS public.daily_schedule CASCADE;
DROP TABLE IF EXISTS public.game_sessions CASCADE;
DROP TABLE IF EXISTS public.user_stats CASCADE;
DROP TABLE IF EXISTS public.station_connections CASCADE;
DROP TABLE IF EXISTS public.connections CASCADE;
DROP TABLE IF EXISTS public.station_lines CASCADE;
DROP TABLE IF EXISTS public.stations CASCADE;
DROP TABLE IF EXISTS public.lines CASCADE;

-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- 1. Lines Table
CREATE TABLE IF NOT EXISTS public.lines (
    id TEXT PRIMARY KEY,
    primary_color TEXT NOT NULL,
    secondary_color TEXT NOT NULL,
    font_color TEXT NOT NULL
);

ALTER TABLE public.lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on lines" ON public.lines FOR SELECT USING (true);


-- 2. Stations Table
CREATE TABLE IF NOT EXISTS public.stations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- Subterrània, Superfície, Elevada
    positions JSONB NOT NULL DEFAULT '{}'::jsonb, -- Extrem, Central
    line_orders JSONB NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on stations" ON public.stations FOR SELECT USING (true);


-- 3. Station Lines (One station can be in multiple lines)
CREATE TABLE IF NOT EXISTS public.station_lines (
    station_id TEXT REFERENCES public.stations(id) ON DELETE CASCADE,
    line_id TEXT REFERENCES public.lines(id) ON DELETE CASCADE,
    PRIMARY KEY (station_id, line_id)
);

ALTER TABLE public.station_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on station_lines" ON public.station_lines FOR SELECT USING (true);


-- 4. Connections (Types of connections like Bus, Tram, etc.)
CREATE TABLE IF NOT EXISTS public.connections (
    id TEXT PRIMARY KEY
);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on connections" ON public.connections FOR SELECT USING (true);


-- 5. Station Connections
CREATE TABLE IF NOT EXISTS public.station_connections (
    station_id TEXT REFERENCES public.stations(id) ON DELETE CASCADE,
    connection_id TEXT REFERENCES public.connections(id) ON DELETE CASCADE,
    PRIMARY KEY (station_id, connection_id)
);

ALTER TABLE public.station_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on station_connections" ON public.station_connections FOR SELECT USING (true);


-- 6. User Stats (Per user)
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    games_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    last_played_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own stats" ON public.user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 7. Game Sessions (History of plays & stored state)
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    station_id TEXT REFERENCES public.stations(id), -- The target station for that day
    guesses JSONB DEFAULT '[]'::jsonb, -- Array of station IDs guessed so far
    won BOOLEAN DEFAULT FALSE,
    completed BOOLEAN DEFAULT FALSE, -- True if user won or gave up/exhausted attempts
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, date)
);

ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own sessions" ON public.game_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.game_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.game_sessions FOR UPDATE USING (auth.uid() = user_id);


-- 8. Daily Schedule (Deterministic random order)
-- We'll use a table to store the shuffled order of stations for the year(s).
CREATE TABLE IF NOT EXISTS public.daily_schedule (
    date DATE PRIMARY KEY,
    station_id TEXT REFERENCES public.stations(id) NOT NULL
);

ALTER TABLE public.daily_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on daily_schedule" ON public.daily_schedule FOR SELECT USING (true);


-- SEED DATA
-- Lines
`;

for (const [id, style] of Object.entries(LINE_STYLES)) {
    sql += `INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('${id}', '${style.primary}', '${style.secondary}', '${style.font}') ON CONFLICT (id) DO NOTHING;\n`;
}

// Connections (Extract unique connections)
const allConnections = new Set();
STATIONS.forEach(s => s.connections.forEach(c => allConnections.add(c)));
allConnections.forEach(c => {
    sql += `INSERT INTO public.connections (id) VALUES ('${c}') ON CONFLICT (id) DO NOTHING;\n`;
});

// Stations & Relations
STATIONS.forEach(s => {
    // Station
    const lineOrdersJson = JSON.stringify(s.lineOrders);
    const positionsJson = JSON.stringify(s.position);
    // Prepare string for SQL
    const safeName = s.name.replace(/'/g, "''");
    sql += `INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('${s.id}', '${safeName}', '${s.type}', '${positionsJson}', '${lineOrdersJson}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;\n`;

    // Station Lines
    s.lines.forEach(l => {
        sql += `INSERT INTO public.station_lines (station_id, line_id) VALUES ('${s.id}', '${l}') ON CONFLICT (station_id, line_id) DO NOTHING;\n`;
    });

    // Station Connections
    s.connections.forEach(c => {
        sql += `INSERT INTO public.station_connections (station_id, connection_id) VALUES ('${s.id}', '${c}') ON CONFLICT (station_id, connection_id) DO NOTHING;\n`;
    });
});

// GENERATE DAILY SCHEDULE FOR 2026-2027
// Only restart if table is empty to avoid overwriting current day if already running
sql += `

-- 9. RPC Function to get today's station ID based on BCN time
CREATE OR REPLACE FUNCTION public.get_daily_station_id()
RETURNS TABLE (
  date DATE,
  station_id TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ds.date,
    ds.station_id
  FROM public.daily_schedule ds
  WHERE ds.date = (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Madrid')::date;
END;
$$;

DO $$
DECLARE
    start_date DATE := '2026-01-01';
    end_date DATE := '2030-12-31';
    current_iter_date DATE;
    station_ids TEXT[];
    shuffled_ids TEXT[];
    s_id TEXT;
    i INT;
    days_count INT;
BEGIN
    -- Check if we have data already
    IF NOT EXISTS (SELECT 1 FROM public.daily_schedule WHERE date = start_date) THEN
        SELECT array_agg(id) INTO station_ids FROM public.stations;

        -- We need to fill until end_date
        current_iter_date := start_date;
        
        WHILE current_iter_date <= end_date LOOP
             -- Shuffle stations
             SELECT array_agg(x) INTO shuffled_ids FROM (SELECT unnest(station_ids) x ORDER BY random()) t;
             
             FOREACH s_id IN ARRAY shuffled_ids LOOP
                 IF current_iter_date > end_date THEN
                     EXIT;
                 END IF;
                 
                 INSERT INTO public.daily_schedule (date, station_id) VALUES (current_iter_date, s_id) ON CONFLICT DO NOTHING;
                 current_iter_date := current_iter_date + 1;
             END LOOP;
        END LOOP;
    END IF;
END $$;
`;


import { writeFileSync } from 'fs';
import { join } from 'path';

const outputPath = join(process.cwd(), 'supabase', 'schema.sql');
writeFileSync(outputPath, sql, 'utf8');
console.log(`Schema generated successfully at: ${outputPath}`);

