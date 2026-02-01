
const fs = require('fs');
const path = require('path');

const constantsPath = path.join(__dirname, '..', 'constants.ts');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');

const stationsMatch = constantsContent.match(/export const STATIONS: Station\[] = (\[[\s\S]*?\]);/);
const lineStylesMatch = constantsContent.match(/export const LINE_STYLES: Record<string, LineStyle> = ({[\s\S]*?});/);

if (!stationsMatch || !lineStylesMatch) {
    console.error('Could not parse constants.ts');
    process.exit(1);
}

function parseAsJson(str) {
    return JSON.parse(str
        .replace(/(\w+):/g, '"$1":')
        .replace(/'/g, '"')
        .replace(/,\s*([}\]])/g, '$1')
    );
}

const STATIONS = parseAsJson(stationsMatch[1]);
const LINE_STYLES = parseAsJson(lineStylesMatch[1]);

let sql = `
-- 1. Lines Table
CREATE TABLE IF NOT EXISTS public.lines (
    id TEXT PRIMARY KEY,
    primary_color TEXT NOT NULL,
    secondary_color TEXT NOT NULL,
    font_color TEXT NOT NULL
);
ALTER TABLE public.lines ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on lines') THEN
    CREATE POLICY "Allow public read access on lines" ON public.lines FOR SELECT USING (true);
END IF; END $$;

-- 2. Stations Table
CREATE TABLE IF NOT EXISTS public.stations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    positions JSONB NOT NULL DEFAULT '{}'::jsonb,
    line_orders JSONB NOT NULL DEFAULT '{}'::jsonb
);
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on stations') THEN
    CREATE POLICY "Allow public read access on stations" ON public.stations FOR SELECT USING (true);
END IF; END $$;

-- 3. Station Lines
CREATE TABLE IF NOT EXISTS public.station_lines (
    station_id TEXT REFERENCES public.stations(id) ON DELETE CASCADE,
    line_id TEXT REFERENCES public.lines(id) ON DELETE CASCADE,
    PRIMARY KEY (station_id, line_id)
);
ALTER TABLE public.station_lines ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on station_lines') THEN
    CREATE POLICY "Allow public read access on station_lines" ON public.station_lines FOR SELECT USING (true);
END IF; END $$;

-- 4. Connections
CREATE TABLE IF NOT EXISTS public.connections ( id TEXT PRIMARY KEY );
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on connections') THEN
    CREATE POLICY "Allow public read access on connections" ON public.connections FOR SELECT USING (true);
END IF; END $$;

-- 5. Station Connections
CREATE TABLE IF NOT EXISTS public.station_connections (
    station_id TEXT REFERENCES public.stations(id) ON DELETE CASCADE,
    connection_id TEXT REFERENCES public.connections(id) ON DELETE CASCADE,
    PRIMARY KEY (station_id, connection_id)
);
ALTER TABLE public.station_connections ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on station_connections') THEN
    CREATE POLICY "Allow public read access on station_connections" ON public.station_connections FOR SELECT USING (true);
END IF; END $$;

-- SEED DATA
`;

const esc = (str) => str.replace(/'/g, "''");

for (const [id, style] of Object.entries(LINE_STYLES)) {
    sql += `INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('${id}', '${style.primary}', '${style.secondary}', '${style.font}') ON CONFLICT (id) DO UPDATE SET primary_color = EXCLUDED.primary_color, secondary_color = EXCLUDED.secondary_color, font_color = EXCLUDED.font_color;\n`;
}

const allConnections = new Set();
STATIONS.forEach(s => s.connections.forEach(c => allConnections.add(c)));
allConnections.forEach(c => {
    sql += `INSERT INTO public.connections (id) VALUES ('${c}') ON CONFLICT (id) DO NOTHING;\n`;
});

STATIONS.forEach(s => {
    const lineOrdersJson = JSON.stringify(s.lineOrders);
    const positionsJson = JSON.stringify(s.positions);
    sql += `INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('${s.id}', '${esc(s.name)}', '${s.type}', '${positionsJson}', '${lineOrdersJson}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;\n`;

    s.lines.forEach(l => {
        sql += `INSERT INTO public.station_lines (station_id, line_id) VALUES ('${s.id}', '${l}') ON CONFLICT (station_id, line_id) DO NOTHING;\n`;
    });

    s.connections.forEach(c => {
        sql += `INSERT INTO public.station_connections (station_id, connection_id) VALUES ('${s.id}', '${c}') ON CONFLICT (station_id, connection_id) DO NOTHING;\n`;
    });
});

const outputPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log('Schema SYNCED from constants.ts to schema.sql');
