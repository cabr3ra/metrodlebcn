import { Station, LineStyle } from '../types';

/**
 * Maps the raw database response from Supabase to our frontend Station type.
 * This ensures consistency across different hooks that fetch station data.
 */
export function mapDbStation(dbStation: any): Station {
    if (!dbStation) throw new Error('Cannot map null or undefined station data');

    return {
        id: dbStation.id,
        name: dbStation.name,
        type: dbStation.type,
        positions: dbStation.positions || {},
        lineOrders: dbStation.line_orders || {},
        lines: dbStation.station_lines?.map((sl: any) => sl.line_id) || [],
        connections: dbStation.station_connections?.map((sc: any) => sc.connection_id) || []
    };
}

/**
 * Maps raw database lines to a Record of LineStyles.
 */
export function mapDbLines(dbLines: any[]): Record<string, LineStyle> {
    return dbLines.reduce((acc, line) => {
        acc[line.id] = {
            primary: line.primary_color,
            secondary: line.secondary_color,
            font: line.font_color
        };
        return acc;
    }, {} as Record<string, LineStyle>);
}

/**
 * Common select query for stations to ensure all required joins are included.
 */
export const STATION_SELECT_QUERY = `
    id,
    name,
    type,
    positions,
    line_orders,
    station_lines ( line_id ),
    station_connections ( connection_id )
`;

/**
 * Query for the lines table.
 */
export const LINE_SELECT_QUERY = `
    id,
    primary_color,
    secondary_color,
    font_color
`;
