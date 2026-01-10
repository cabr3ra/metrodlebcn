
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
    position TEXT NOT NULL, -- Extrem, Central
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
INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('L1', '#DF2937', '#8D1B24', '#FFFFFF') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('L2', '#993C8C', '#4D1E45', '#FFFFFF') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('L3', '#3AA83E', '#216C24', '#FFFFFF') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('L4', '#FCBE00', '#7F6000', '#1D1D1B') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('L5', '#0177BC', '#003B5F', '#FFFFFF') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('L6', '#7386BC', '#4B567A', '#FFFFFF') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('L7', '#B16612', '#392106', '#FFFFFF') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('L8', '#E579AE', '#994B73', '#FFFFFF') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('L9N', '#F88D00', '#7D4700', '#FFFFFF') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('L9S', '#F88D00', '#7D4700', '#FFFFFF') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('L10N', '#08A0E5', '#063448', '#FFFFFF') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('L10S', '#08A0E5', '#063448', '#FFFFFF') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('L11', '#B4CD56', '#67782A', '#1D1D1B') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.lines (id, primary_color, secondary_color, font_color) VALUES ('L12', '#BBB3D7', '#786E95', '#1D1D1B') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Rodalies') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('FGC') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Info') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Bus') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Tram') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Funicular de Montjuïc') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Regional') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('AVE') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Aeropuerto') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('1', 'Hospital de Bellvitge', 'Subterrània', 'Extrem', '{"L1":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('1', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('2', 'Bellvitge', 'Subterrània', 'Extrem', '{"L1":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('2', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('2', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('3', 'Av. Carrilet', 'Subterrània', 'Extrem', '{"L1":3,"L8":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('3', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('3', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('3', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('4', 'Rambla Just Oliveras', 'Subterrània', 'Extrem', '{"L1":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('4', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('4', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('5', 'Can Serra', 'Subterrània', 'Extrem', '{"L1":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('5', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('6', 'Florida', 'Subterrània', 'Extrem', '{"L1":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('6', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('7', 'Torrassa', 'Subterrània', 'Extrem', '{"L1":7,"L9S":14,"L10S":14}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('7', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('7', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('7', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('8', 'Santa Eulàlia', 'Superfície', 'Extrem', '{"L1":8}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('8', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('9', 'Mercat Nou', 'Superfície', 'Extrem', '{"L1":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('9', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('10', 'Plaça de Sants', 'Subterrània', 'Central', '{"L1":10,"L5":10}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('10', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('10', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('11', 'Hostafrancs', 'Subterrània', 'Central', '{"L1":11}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('11', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('12', 'Espanya', 'Subterrània', 'Central', '{"L1":12,"L3":8,"L8":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('12', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('12', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('12', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('12', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('13', 'Rocafort', 'Subterrània', 'Central', '{"L1":13}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('13', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('14', 'Urgell', 'Subterrània', 'Central', '{"L1":14}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('14', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('15', 'Universitat', 'Subterrània', 'Central', '{"L1":15,"L2":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('15', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('15', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('15', 'Info') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('16', 'Catalunya', 'Subterrània', 'Central', '{"L1":16,"L3":13}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('16', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('16', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('16', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('16', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('17', 'Urquinaona', 'Subterrània', 'Central', '{"L1":17,"L4":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('17', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('17', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('18', 'Arc de Triomf', 'Subterrània', 'Central', '{"L1":18}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('18', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('18', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('18', 'Bus') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('19', 'Marina', 'Subterrània', 'Central', '{"L1":19}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('19', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('19', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('20', 'Glòries', 'Subterrània', 'Central', '{"L1":20}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('20', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('20', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('21', 'El Clot', 'Subterrània', 'Central', '{"L1":21,"L2":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('21', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('21', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('21', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('22', 'Navas', 'Subterrània', 'Extrem', '{"L1":22}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('22', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('23', 'La Sagrera', 'Subterrània', 'Extrem', '{"L1":23,"L4":17,"L5":19,"L9N":11,"L10N":11}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('23', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('23', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('23', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('23', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('23', 'L10N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('23', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('23', 'Info') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('24', 'Fabra i Puig', 'Subterrània', 'Extrem', '{"L1":24}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('24', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('24', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('24', 'Bus') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('25', 'Sant Andreu', 'Subterrània', 'Extrem', '{"L1":25}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('25', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('25', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('26', 'Torras i Bages', 'Subterrània', 'Extrem', '{"L1":26}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('26', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('27', 'Trinitat Vella', 'Subterrània', 'Extrem', '{"L1":27}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('27', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('28', 'Baró de Viver', 'Subterrània', 'Extrem', '{"L1":28}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('28', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('29', 'Santa Coloma', 'Subterrània', 'Extrem', '{"L1":29}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('29', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('30', 'Fondo', 'Subterrània', 'Extrem', '{"L1":30,"L9N":10}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('30', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('30', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('201', 'Paral·lel', 'Subterrània', 'Extrem', '{"L2":1,"L3":10}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('201', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('201', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('201', 'Funicular de Montjuïc') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('202', 'Sant Antoni', 'Subterrània', 'Extrem', '{"L2":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('202', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('204', 'Passeig de Gràcia', 'Subterrània', 'Central', '{"L2":4,"L3":14,"L4":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('204', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('204', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('204', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('204', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('204', 'Regional') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('205', 'Tetuan', 'Subterrània', 'Central', '{"L2":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('205', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('206', 'Monumental', 'Subterrània', 'Central', '{"L2":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('206', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('207', 'Sagrada Família', 'Subterrània', 'Central', '{"L2":7,"L5":16}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('207', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('207', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('208', 'Encants', 'Subterrània', 'Central', '{"L2":8}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('208', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('210', 'Bac de Roda', 'Subterrània', 'Central', '{"L2":10}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('210', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('211', 'Sant Martí', 'Subterrània', 'Central', '{"L2":11}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('211', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('212', 'La Pau', 'Subterrània', 'Extrem', '{"L2":12,"L4":19}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('212', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('212', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('213', 'Verneda', 'Subterrània', 'Extrem', '{"L2":13}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('213', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('214', 'Artigues | Sant Adrià', 'Subterrània', 'Extrem', '{"L2":14}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('214', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('215', 'Sant Roc', 'Subterrània', 'Extrem', '{"L2":15}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('215', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('215', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('216', 'Gorg', 'Subterrània', 'Extrem', '{"L2":16,"L10N":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('216', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('216', 'L10N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('216', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('217', 'Pep Ventura', 'Subterrània', 'Extrem', '{"L2":17}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('217', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('218', 'Badalona Pompeu Fabra', 'Subterrània', 'Extrem', '{"L2":18}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('218', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('301', 'Zona Universitària', 'Subterrània', 'Extrem', '{"L3":1,"L9S":15}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('301', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('301', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('301', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('302', 'Palau Reial', 'Subterrània', 'Extrem', '{"L3":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('302', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('302', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('303', 'Maria Cristina', 'Subterrània', 'Extrem', '{"L3":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('303', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('303', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('304', 'Les Corts', 'Subterrània', 'Extrem', '{"L3":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('304', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('305', 'Plaça del Centre', 'Subterrània', 'Extrem', '{"L3":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('305', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('306', 'Sants Estació', 'Subterrània', 'Extrem', '{"L3":6,"L5":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('306', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('306', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('306', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('306', 'AVE') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('307', 'Tarragona', 'Subterrània', 'Extrem', '{"L3":7}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('307', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('309', 'Poble Sec', 'Subterrània', 'Central', '{"L3":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('309', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('311', 'Drassanes', 'Subterrània', 'Central', '{"L3":11}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('311', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('312', 'Liceu', 'Subterrània', 'Central', '{"L3":12}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('312', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('315', 'Diagonal', 'Subterrània', 'Central', '{"L3":15,"L5":13,"L6":3,"L7":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('315', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('315', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('315', 'L6') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('315', 'L7') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('315', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('316', 'Fontana', 'Subterrània', 'Central', '{"L3":16}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('316', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('317', 'Lesseps', 'Subterrània', 'Central', '{"L3":17}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('317', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('318', 'Vallcarca', 'Subterrània', 'Central', '{"L3":18}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('318', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('319', 'Penitents', 'Subterrània', 'Central', '{"L3":19}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('319', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('320', 'Vall d''Hebron', 'Subterrània', 'Extrem', '{"L3":20,"L5":26}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('320', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('320', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('321', 'Montbau', 'Subterrània', 'Extrem', '{"L3":21}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('321', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('322', 'Mundet', 'Subterrània', 'Extrem', '{"L3":22}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('322', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('323', 'Valldaura', 'Subterrània', 'Extrem', '{"L3":23}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('323', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('324', 'Canyelles', 'Subterrània', 'Extrem', '{"L3":24}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('324', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('325', 'Roquetes', 'Subterrània', 'Extrem', '{"L3":25}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('325', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('326', 'Trinitat Nova', 'Subterrània', 'Extrem', '{"L3":26,"L4":1,"L11":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('326', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('326', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('326', 'L11') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('401', 'Joanic', 'Subterrània', 'Central', '{"L4":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('401', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('402', 'Verdaguer', 'Subterrània', 'Central', '{"L4":3,"L5":15}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('402', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('402', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('405', 'Barceloneta', 'Subterrània', 'Central', '{"L4":7}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('405', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('405', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('406', 'Ciutadella | Vila Olímpica', 'Subterrània', 'Central', '{"L4":8}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('406', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('406', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('410', 'Selva de Mar', 'Subterrània', 'Extrem', '{"L4":12}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('410', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('410', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('411', 'El Maresme | Fòrum', 'Subterrània', 'Extrem', '{"L4":13}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('411', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('411', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('413', 'Besòs', 'Subterrània', 'Extrem', '{"L4":15}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('413', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('413', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('901', 'Aeroport T1', 'Subterrània', 'Extrem', '{"L9S":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('901', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('901', 'Aeropuerto') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('902', 'Aeroport T2', 'Subterrània', 'Extrem', '{"L9S":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('902', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('902', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('902', 'Aeropuerto') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('903', 'Parc Nou', 'Subterrània', 'Extrem', '{"L9S":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('903', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('904', 'Cèntric', 'Subterrània', 'Extrem', '{"L9S":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('904', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('905', 'El Prat Estació', 'Subterrània', 'Extrem', '{"L9S":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('905', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('905', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('906', 'Les Moreres', 'Subterrània', 'Extrem', '{"L9S":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('906', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('907', 'Mercabarna', 'Subterrània', 'Extrem', '{"L9S":7}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('907', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('908', 'Parc Logístic', 'Subterrània', 'Extrem', '{"L9S":8}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('908', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('909', 'Fira', 'Subterrània', 'Extrem', '{"L9S":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('909', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('909', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('910', 'Europa | Fira', 'Subterrània', 'Extrem', '{"L9S":10,"L8":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('910', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('910', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('910', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('911', 'Can Tries | Gornal', 'Subterrània', 'Extrem', '{"L9S":11,"L10S":11}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('911', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('911', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('912', 'Provençana', 'Subterrània', 'Extrem', '{"L10S":12}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('912', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('913', 'Ciutat de la Justícia', 'Subterrània', 'Extrem', '{"L10S":13,"L8":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('913', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('913', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('913', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('914', 'Collblanc', 'Subterrània', 'Extrem', '{"L5":8,"L9S":13,"L10S":15}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('914', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('914', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('914', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('1001', 'ZAL | Riu Vell', 'Superfície', 'Extrem', '{"L10S":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('1001', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('1002', 'Ecoparc', 'Superfície', 'Extrem', '{"L10S":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('1002', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('1003', 'Port Comercial | La Factoria', 'Superfície', 'Extrem', '{"L10S":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('1003', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('1004', 'Zona Franca', 'Superfície', 'Extrem', '{"L10S":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('1004', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('1005', 'Foc', 'Subterrània', 'Extrem', '{"L10S":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('1005', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('1006', 'Foneria', 'Subterrània', 'Extrem', '{"L10S":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('1006', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('951', 'Can Zam', 'Subterrània', 'Extrem', '{"L9N":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('951', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('952', 'Singuerlín', 'Subterrània', 'Extrem', '{"L9N":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('952', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('953', 'Església Major', 'Subterrània', 'Extrem', '{"L9N":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('953', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('954', 'Santa Rosa', 'Subterrània', 'Extrem', '{"L9N":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('954', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('955', 'Bon Pastor', 'Subterrània', 'Central', '{"L9N":6,"L10N":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('955', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('955', 'L10N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('955', 'Bus') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('956', 'Onze de Setembre', 'Subterrània', 'Central', '{"L9N":7,"L10N":7}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('956', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('956', 'L10N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('956', 'Bus') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('957', 'Can Peixauet', 'Subterrània', 'Extrem', '{"L9N":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('957', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('1051', 'La Salut', 'Subterrània', 'Extrem', '{"L10N":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('1051', 'L10N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('1052', 'Llefià', 'Subterrània', 'Extrem', '{"L10N":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('1052', 'L10N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('1053', 'La Sagrera | TAV', 'Subterrània', 'Extrem', '{"L4":18,"L9N":9,"L10N":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('1053', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('1053', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('1053', 'L10N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('1053', 'AVE') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, position, line_orders) VALUES ('1102', 'Torre Baró | Vallbona', 'Subterrània', 'Central', '{"L11":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, position = EXCLUDED.position, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('1102', 'L11') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('1102', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;


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
