
const fs = require('fs');
const path = require('path');

const constantsPath = path.join(__dirname, '..', 'constants.ts');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');



function extractObject(content, variableName) {
    // Remove imports and types that might break eval
    const cleanContent = content.replace(/import\s+[\s\S]*?;/g, '');
    const regex = new RegExp(`export const ${variableName}(?:: [^=]+)? = ([\\s\\S]*?);\\r?\\n`, 'm');
    const match = cleanContent.match(regex);
    if (!match) throw new Error(`Could not find ${variableName} in constants.ts`);

    // Add dummy types for eval context
    const Station = {};
    return eval(`(${match[1]})`);
}

const STATIONS = extractObject(constantsContent, 'STATIONS');
const LINE_STYLES = extractObject(constantsContent, 'LINE_STYLES');

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


// 6. RPC Functions
sql += `
-- Para Metrodle
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

-- Para Ruta
CREATE OR REPLACE FUNCTION public.get_daily_route()
RETURNS TABLE (
  date DATE,
  origin_id TEXT,
  destination_id TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dr.date,
    dr.origin_id,
    dr.destination_id
  FROM public.daily_route_schedule dr
  WHERE dr.date = (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Madrid')::date;
END;
$$;
`;

// 7. CALENDAR GENERATION
sql += `
-- 8. Daily Schedule Tables
CREATE TABLE IF NOT EXISTS public.daily_schedule (
    date DATE PRIMARY KEY,
    station_id TEXT REFERENCES public.stations(id) NOT NULL
);
ALTER TABLE public.daily_schedule ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on daily_schedule') THEN
    CREATE POLICY "Allow public read access on daily_schedule" ON public.daily_schedule FOR SELECT USING (true);
END IF; END $$;

CREATE TABLE IF NOT EXISTS public.daily_route_schedule (
    date DATE PRIMARY KEY,
    origin_id TEXT REFERENCES public.stations(id) NOT NULL,
    destination_id TEXT REFERENCES public.stations(id) NOT NULL
);
ALTER TABLE public.daily_route_schedule ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on daily_route_schedule') THEN
    CREATE POLICY "Allow public read access on daily_route_schedule" ON public.daily_route_schedule FOR SELECT USING (true);
END IF; END $$;

-- 9. Automatically Generate Calendars (Today to End of Year)
DO $$
DECLARE
    start_date DATE := '2026-02-22'; -- Start from today
    end_date DATE := '2026-12-30';   -- End of year
    current_iter_date DATE;
    s_id TEXT;
    s1_id TEXT; s2_id TEXT;
    s1_lines TEXT[]; s2_lines TEXT[];
    valid_route BOOLEAN;
BEGIN
    -- Clear current schedules in range
    DELETE FROM public.daily_schedule WHERE date >= start_date AND date <= end_date;
    DELETE FROM public.daily_route_schedule WHERE date >= start_date AND date <= end_date;

    -- Generate Metrodle Schedule
    current_iter_date := start_date;
    WHILE current_iter_date <= end_date LOOP
         FOR s_id IN (SELECT id FROM public.stations ORDER BY random()) LOOP
             IF current_iter_date > end_date THEN EXIT; END IF;
             INSERT INTO public.daily_schedule (date, station_id) VALUES (current_iter_date, s_id) ON CONFLICT (date) DO UPDATE SET station_id = EXCLUDED.station_id;
             current_iter_date := current_iter_date + 1;
         END LOOP;
    END LOOP;

    -- Generate Route Schedule
    current_iter_date := start_date;
    WHILE current_iter_date <= end_date LOOP
        valid_route := FALSE;
        WHILE NOT valid_route LOOP
            SELECT id INTO s1_id FROM public.stations ORDER BY random() LIMIT 1;
            SELECT id INTO s2_id FROM public.stations WHERE id <> s1_id ORDER BY random() LIMIT 1;
            SELECT array_agg(line_id) INTO s1_lines FROM public.station_lines WHERE station_id = s1_id;
            SELECT array_agg(line_id) INTO s2_lines FROM public.station_lines WHERE station_id = s2_id;
            IF NOT (s1_lines && s2_lines) THEN valid_route := TRUE; END IF;
        END LOOP;
        INSERT INTO public.daily_route_schedule (date, origin_id, destination_id) VALUES (current_iter_date, s1_id, s2_id) ON CONFLICT (date) DO UPDATE SET origin_id = EXCLUDED.origin_id, destination_id = EXCLUDED.destination_id;
        current_iter_date := current_iter_date + 1;
    END LOOP;
END $$;
`;

const outputPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log('Schema SYNCED from constants.ts to schema.sql with updated generation dates.');
