
-- CLEANUP: Drop tables if they exist to start fresh and avoid conflicts
DROP TABLE IF EXISTS public.daily_schedule CASCADE;
DROP TABLE IF EXISTS public.daily_route_schedule CASCADE;
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


-- 6. User Stats (Per user and game)
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    game_id TEXT NOT NULL, -- 'metrodle' o 'ruta'
    games_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    last_played_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, game_id)
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own stats" ON public.user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 7. Game Sessions (History of plays & stored state)
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    game_id TEXT NOT NULL, -- 'metrodle' o 'ruta'
    date DATE NOT NULL,
    station_id TEXT REFERENCES public.stations(id), -- Para Metrodle
    guesses JSONB DEFAULT '[]'::jsonb, -- Estaciones intentadas
    won BOOLEAN DEFAULT FALSE,
    completed BOOLEAN DEFAULT FALSE,
    errors INTEGER DEFAULT 0, -- Para el juego de Ruta
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, date, game_id)
);

ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own sessions" ON public.game_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.game_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.game_sessions FOR UPDATE USING (auth.uid() = user_id);


-- 8. Daily Schedule (Metrodle)
CREATE TABLE IF NOT EXISTS public.daily_schedule (
    date DATE PRIMARY KEY,
    station_id TEXT REFERENCES public.stations(id) NOT NULL
);

ALTER TABLE public.daily_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on daily_schedule" ON public.daily_schedule FOR SELECT USING (true);


-- 8b. Daily Route Schedule (Ruta) - NUEVA TABLA
CREATE TABLE IF NOT EXISTS public.daily_route_schedule (
    date DATE PRIMARY KEY,
    origin_id TEXT REFERENCES public.stations(id) NOT NULL,
    destination_id TEXT REFERENCES public.stations(id) NOT NULL
);

ALTER TABLE public.daily_route_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on daily_route_schedule" ON public.daily_route_schedule FOR SELECT USING (true);


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
INSERT INTO public.connections (id) VALUES ('FGC') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Rodalies') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Info') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Bus') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Tram') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Funicular') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Renfe') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('AVE') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Port') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Tramblau') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.connections (id) VALUES ('Aeroport') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('1', 'Hospital de Bellvitge', 'Subterrània', '{"L1":"Extrem"}', '{"L1":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('1', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('2', 'Bellvitge', 'Subterrània', '{"L1":"Extrem"}', '{"L1":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('2', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('3', 'Av. Carrilet', 'Subterrània', '{"L1":"Extrem","L8":"Central"}', '{"L1":3,"L8":7}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('3', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('3', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('3', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('4', 'Rbla. Just Oliveras', 'Subterrània', '{"L1":"Extrem"}', '{"L1":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('4', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('4', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('5', 'Can Serra', 'Subterrània', '{"L1":"Extrem"}', '{"L1":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('5', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('6', 'Florida', 'Subterrània', '{"L1":"Extrem"}', '{"L1":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('6', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('7', 'Torrassa', 'Subterrània', '{"L1":"Extrem","L9S":"Extrem","L10S":"Extrem"}', '{"L1":7,"L9S":13,"L10S":10}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('7', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('7', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('7', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('8', 'Santa Eulàlia', 'Superfície', '{"L1":"Extrem"}', '{"L1":8}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('8', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('9', 'Mercat Nou', 'Superfície', '{"L1":"Extrem"}', '{"L1":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('9', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('10', 'Plaça de Sants', 'Subterrània', '{"L1":"Central","L5":"Central"}', '{"L1":10,"L5":10}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('10', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('10', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('11', 'Hostafrancs', 'Subterrània', '{"L1":"Central"}', '{"L1":11}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('11', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('12', 'Espanya', 'Subterrània', '{"L1":"Central","L3":"Central","L8":"Extrem"}', '{"L1":12,"L3":8,"L8":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('12', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('12', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('12', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('12', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('13', 'Rocafort', 'Subterrània', '{"L1":"Central"}', '{"L1":13}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('13', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('14', 'Urgell', 'Subterrània', '{"L1":"Central"}', '{"L1":14}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('14', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('15', 'Universitat', 'Subterrània', '{"L1":"Central","L2":"Extrem"}', '{"L1":15,"L2":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('15', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('15', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('15', 'Info') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('16', 'Catalunya', 'Subterrània', '{"L1":"Central","L3":"Central","L6":"Extrem","L7":"Extrem"}', '{"L1":16,"L3":13,"L6":1,"L7":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('16', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('16', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('16', 'L6') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('16', 'L7') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('16', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('16', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('17', 'Urquinaona', 'Subterrània', '{"L1":"Central","L4":"Central"}', '{"L1":17,"L4":12}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('17', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('17', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('18', 'Arc de Triomf', 'Subterrània', '{"L1":"Central"}', '{"L1":18}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('18', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('18', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('18', 'Bus') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('19', 'Marina', 'Subterrània', '{"L1":"Central"}', '{"L1":19}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('19', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('19', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('20', 'Glòries', 'Subterrània', '{"L1":"Central"}', '{"L1":20}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('20', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('20', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('21', 'Clot', 'Subterrània', '{"L1":"Central","L2":"Central"}', '{"L1":21,"L2":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('21', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('21', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('21', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('22', 'Navas', 'Subterrània', '{"L1":"Extrem"}', '{"L1":22}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('22', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('23', 'La Sagrera', 'Subterrània', '{"L1":"Extrem","L5":"Central","L9N":"Extrem","L10N":"Extrem"}', '{"L1":23,"L5":19,"L9N":1,"L10N":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('23', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('23', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('23', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('23', 'L10N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('23', 'Info') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('23', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('24', 'Fabra i Puig', 'Subterrània', '{"L1":"Extrem"}', '{"L1":24}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('24', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('24', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('24', 'Bus') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('25', 'Sant Andreu', 'Subterrània', '{"L1":"Extrem"}', '{"L1":25}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('25', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('25', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('26', 'Torras i Bages', 'Subterrània', '{"L1":"Extrem"}', '{"L1":26}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('26', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('27', 'Trinitat Vella', 'Subterrània', '{"L1":"Extrem"}', '{"L1":27}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('27', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('28', 'Baró de Viver', 'Subterrània', '{"L1":"Extrem"}', '{"L1":28}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('28', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('29', 'Santa Coloma', 'Subterrània', '{"L1":"Extrem"}', '{"L1":29}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('29', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('30', 'Fondo', 'Subterrània', '{"L1":"Extrem","L9N":"Central"}', '{"L1":30,"L9N":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('30', 'L1') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('30', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('31', 'Paral·lel', 'Subterrània', '{"L2":"Extrem","L3":"Central"}', '{"L2":1,"L3":10}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('31', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('31', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('31', 'Funicular') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('32', 'Sant Antoni', 'Subterrània', '{"L2":"Extrem"}', '{"L2":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('32', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('34', 'Passeig de Gràcia', 'Subterrània', '{"L2":"Extrem","L3":"Central","L4":"Central"}', '{"L2":4,"L3":14,"L4":13}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('34', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('34', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('34', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('34', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('34', 'Renfe') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('35', 'Tetuan', 'Subterrània', '{"L2":"Extrem"}', '{"L2":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('35', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('36', 'Monumental', 'Subterrània', '{"L2":"Central"}', '{"L2":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('36', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('36', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('37', 'Sagrada Família', 'Subterrània', '{"L2":"Central","L5":"Central"}', '{"L2":7,"L5":16}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('37', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('37', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('38', 'Encants', 'Subterrània', '{"L2":"Central"}', '{"L2":8}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('38', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('40', 'Bac de Roda', 'Subterrània', '{"L2":"Central"}', '{"L2":10}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('40', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('41', 'Sant Martí', 'Subterrània', '{"L2":"Central"}', '{"L2":11}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('41', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('42', 'La Pau', 'Subterrània', '{"L2":"Central","L4":"Extrem"}', '{"L2":12,"L4":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('42', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('42', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('43', 'Verneda', 'Subterrània', '{"L2":"Central"}', '{"L2":13}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('43', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('44', 'Artigues | Sant Adrià', 'Subterrània', '{"L2":"Extrem"}', '{"L2":14}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('44', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('45', 'Sant Roc', 'Subterrània', '{"L2":"Extrem"}', '{"L2":15}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('45', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('45', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('46', 'Gorg', 'Subterrània', '{"L2":"Extrem","L10N":"Extrem"}', '{"L2":16,"L10N":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('46', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('46', 'L10N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('46', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('47', 'Pep Ventura', 'Subterrània', '{"L2":"Extrem"}', '{"L2":17}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('47', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('48', 'Badalona Pompeu Fabra', 'Subterrània', '{"L2":"Extrem"}', '{"L2":18}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('48', 'L2') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('49', 'Zona Universitària', 'Subterrània', '{"L3":"Extrem","L9S":"Extrem"}', '{"L3":1,"L9S":15}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('49', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('49', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('49', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('50', 'Palau Reial', 'Subterrània', '{"L3":"Extrem"}', '{"L3":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('50', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('50', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('51', 'Maria Cristina', 'Subterrània', '{"L3":"Extrem"}', '{"L3":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('51', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('51', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('52', 'Les Corts', 'Subterrània', '{"L3":"Extrem"}', '{"L3":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('52', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('53', 'Plaça del Centre', 'Subterrània', '{"L3":"Extrem"}', '{"L3":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('53', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('54', 'Sants Estació', 'Subterrània', '{"L3":"Extrem","L5":"Central"}', '{"L3":6,"L5":11}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('54', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('54', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('54', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('54', 'Renfe') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('54', 'AVE') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('54', 'Bus') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('55', 'Tarragona', 'Subterrània', '{"L3":"Extrem"}', '{"L3":7}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('55', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('56', 'Poble Sec', 'Subterrània', '{"L3":"Central"}', '{"L3":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('56', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('57', 'Drassanes', 'Subterrània', '{"L3":"Central"}', '{"L3":11}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('57', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('57', 'Port') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('58', 'Liceu', 'Subterrània', '{"L3":"Central"}', '{"L3":12}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('58', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('59', 'Diagonal', 'Subterrània', '{"L3":"Central","L5":"Central","L6":"Extrem","L7":"Extrem"}', '{"L3":15,"L5":14,"L6":2,"L7":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('59', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('59', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('59', 'L6') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('59', 'L7') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('59', 'Info') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('59', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('60', 'Fontana', 'Subterrània', '{"L3":"Central"}', '{"L3":16}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('60', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('61', 'Lesseps', 'Subterrània', '{"L3":"Central"}', '{"L3":17}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('61', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('62', 'Vallcarca', 'Subterrània', '{"L3":"Central"}', '{"L3":18}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('62', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('63', 'Penitents', 'Subterrània', '{"L3":"Central"}', '{"L3":19}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('63', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('64', 'Vall d''Hebron', 'Subterrània', '{"L3":"Extrem","L5":"Extrem"}', '{"L3":20,"L5":27}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('64', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('64', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('65', 'Montbau', 'Subterrània', '{"L3":"Extrem"}', '{"L3":21}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('65', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('66', 'Mundet', 'Subterrània', '{"L3":"Extrem"}', '{"L3":22}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('66', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('67', 'Valldaura', 'Subterrània', '{"L3":"Extrem"}', '{"L3":23}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('67', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('68', 'Canyelles', 'Subterrània', '{"L3":"Extrem"}', '{"L3":24}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('68', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('69', 'Roquetes', 'Subterrània', '{"L3":"Extrem"}', '{"L3":25}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('69', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('70', 'Trinitat Nova', 'Subterrània', '{"L3":"Extrem","L4":"Extrem","L11":"Extrem"}', '{"L3":26,"L4":24,"L11":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('70', 'L3') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('70', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('70', 'L11') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('71', 'Besòs', 'Subterrània', '{"L4":"Extrem"}', '{"L4":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('71', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('71', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('72', 'Besòs Mar', 'Subterrània', '{"L4":"Extrem"}', '{"L4":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('72', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('73', 'El Maresme | Fòrum', 'Subterrània', '{"L4":"Extrem"}', '{"L4":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('73', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('73', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('74', 'Selva de Mar', 'Subterrània', '{"L4":"Extrem"}', '{"L4":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('74', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('74', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('75', 'Poblenou', 'Subterrània', '{"L4":"Extrem"}', '{"L4":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('75', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('76', 'Llacuna', 'Subterrània', '{"L4":"Central"}', '{"L4":7}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('76', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('77', 'Bogatell', 'Subterrània', '{"L4":"Central"}', '{"L4":8}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('77', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('78', 'Ciutadella | Vila Olímpica', 'Subterrània', '{"L4":"Central"}', '{"L4":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('78', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('78', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('79', 'Barceloneta', 'Subterrània', '{"L4":"Central"}', '{"L4":10}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('79', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('79', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('79', 'Renfe') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('80', 'Jaume I', 'Subterrània', '{"L4":"Central"}', '{"L4":11}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('80', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('81', 'Girona', 'Subterrània', '{"L4":"Central"}', '{"L4":14}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('81', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('82', 'Verdaguer', 'Subterrània', '{"L4":"Central","L5":"Central"}', '{"L4":15,"L5":15}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('82', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('82', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('83', 'Joanic', 'Subterrània', '{"L4":"Central"}', '{"L4":16}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('83', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('84', 'Alfons X', 'Subterrània', '{"L4":"Extrem"}', '{"L4":17}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('84', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('85', 'Guinardó | Hospital Sant Pau', 'Subterrània', '{"L4":"Extrem"}', '{"L4":18}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('85', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('86', 'Maragall', 'Subterrània', '{"L4":"Extrem","L5":"Extrem"}', '{"L4":19,"L5":21}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('86', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('86', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('87', 'Llucmajor', 'Subterrània', '{"L4":"Extrem"}', '{"L4":22}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('87', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('88', 'Via Júlia', 'Subterrània', '{"L4":"Extrem"}', '{"L4":23}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('88', 'L4') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('89', 'Cornellà Centre', 'Subterrània', '{"L5":"Extrem"}', '{"L5":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('89', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('89', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('89', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('90', 'Gavarra', 'Subterrània', '{"L5":"Extrem"}', '{"L5":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('90', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('91', 'Sant Ildefons', 'Subterrània', '{"L5":"Extrem"}', '{"L5":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('91', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('92', 'Can Boixeres', 'Subterrània', '{"L5":"Extrem"}', '{"L5":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('92', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('93', 'Can Vidalet', 'Subterrània', '{"L5":"Extrem"}', '{"L5":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('93', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('94', 'Pubilla Cases', 'Subterrània', '{"L5":"Extrem"}', '{"L5":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('94', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('95', 'Ernest Lluch', 'Subterrània', '{"L5":"Extrem"}', '{"L5":7}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('95', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('95', 'Tram') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('96', 'Collblanc', 'Subterrània', '{"L5":"Central","L9S":"Extrem","L10S":"Extrem"}', '{"L5":8,"L9S":14,"L10S":11}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('96', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('97', 'Badal', 'Subterrània', '{"L5":"Central"}', '{"L5":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('97', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('98', 'Entença', 'Subterrània', '{"L5":"Central"}', '{"L5":12}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('98', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('99', 'Hospital Clínic', 'Subterrània', '{"L5":"Central"}', '{"L5":13}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('99', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('100', 'Sant Pau | Dos de Maig', 'Subterrània', '{"L5":"Central"}', '{"L5":17}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('100', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('101', 'Camp de l''Arpa', 'Subterrània', '{"L5":"Central"}', '{"L5":18}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('101', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('102', 'Congrés', 'Subterrània', '{"L5":"Central"}', '{"L5":20}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('102', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('103', 'Virrei Amat', 'Subterrània', '{"L5":"Extrem"}', '{"L5":22}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('103', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('104', 'Vilapiscina', 'Subterrània', '{"L5":"Extrem"}', '{"L5":23}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('104', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('105', 'Horta', 'Subterrània', '{"L5":"Extrem"}', '{"L5":24}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('105', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('106', 'El Carmel', 'Subterrània', '{"L5":"Extrem"}', '{"L5":25}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('106', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('107', 'El Coll | La Teixonera', 'Subterrània', '{"L5":"Extrem"}', '{"L5":26}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('107', 'L5') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('108', 'Gràcia', 'Subterrània', '{"L6":"Central","L7":"Central"}', '{"L6":3,"L7":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('108', 'L6') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('108', 'L7') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('108', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('109', 'Sant Gervasi', 'Subterrània', '{"L6":"Central"}', '{"L6":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('109', 'L6') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('109', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('110', 'Muntaner', 'Subterrània', '{"L6":"Central"}', '{"L6":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('110', 'L6') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('110', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('111', 'La Bonanova', 'Subterrània', '{"L6":"Central"}', '{"L6":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('111', 'L6') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('111', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('112', 'Les Tres Torres', 'Subterrània', '{"L6":"Extrem"}', '{"L6":7}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('112', 'L6') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('112', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('113', 'Sarrià', 'Subterrània', '{"L6":"Extrem","L12":"Extrem"}', '{"L6":8,"L12":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('113', 'L6') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('113', 'L12') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('113', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('114', 'Pl. Molina', 'Subterrània', '{"L7":"Central"}', '{"L7":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('114', 'L7') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('115', 'Pàdua', 'Subterrània', '{"L7":"Central"}', '{"L7":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('115', 'L7') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('116', 'El Putxet', 'Subterrània', '{"L7":"Extrem"}', '{"L7":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('116', 'L7') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('117', 'Av. Tibidabo', 'Subterrània', '{"L7":"Extrem"}', '{"L7":7}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('117', 'L7') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('117', 'Tramblau') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('118', 'Magòria-La Campana', 'Subterrània', '{"L8":"Extrem"}', '{"L8":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('118', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('118', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('119', 'Ildefons Cerdà', 'Subterrània', '{"L8":"Extrem","L10S":"Central"}', '{"L8":3,"L10S":7}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('119', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('119', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('119', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('120', 'Europa | Fira', 'Subterrània', '{"L8":"Central","L9S":"Central"}', '{"L8":4,"L9S":11}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('120', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('120', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('120', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('121', 'Gornal', 'Subterrània', '{"L8":"Central"}', '{"L8":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('121', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('121', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('121', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('122', 'Sant Josep', 'Subterrània', '{"L8":"Central"}', '{"L8":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('122', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('122', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('123', 'Almeda', 'Subterrània', '{"L8":"Central"}', '{"L8":8}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('123', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('123', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('124', 'Cornellà Riera', 'Subterrània', '{"L8":"Extrem"}', '{"L8":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('124', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('124', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('125', 'Sant Boi', 'Subterrània', '{"L8":"Extrem"}', '{"L8":10}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('125', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('125', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('126', 'Molí Nou | Ciutat Cooperativa', 'Subterrània', '{"L8":"Extrem"}', '{"L8":11}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('126', 'L8') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('126', 'FGC') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('127', 'Aeroport T1', 'Subterrània', '{"L9S":"Extrem"}', '{"L9S":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('127', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('127', 'Aeroport') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('128', 'Aeroport T2', 'Subterrània', '{"L9S":"Extrem"}', '{"L9S":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('128', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('128', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('128', 'Aeroport') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('129', 'Mas Blau', 'Subterrània', '{"L9S":"Extrem"}', '{"L9S":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('129', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('130', 'Parc Nou', 'Subterrània', '{"L9S":"Extrem"}', '{"L9S":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('130', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('131', 'Cèntric', 'Subterrània', '{"L9S":"Central"}', '{"L9S":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('131', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('132', 'El Prat Estació', 'Subterrània', '{"L9S":"Central"}', '{"L9S":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('132', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('132', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('133', 'Les Moreres', 'Subterrània', '{"L9S":"Central"}', '{"L9S":7}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('133', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('134', 'Mercabarna', 'Subterrània', '{"L9S":"Central"}', '{"L9S":8}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('134', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('134', 'Parc Logístic', 'Subterrània', '{"L9S":"Central"}', '{"L9S":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('134', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('135', 'Fira', 'Subterrània', '{"L9S":"Central"}', '{"L9S":10}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('135', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('137', 'Can Tries | Gornal', 'Subterrània', '{"L9S":"Extrem","L10S":"Extrem"}', '{"L9S":12,"L10S":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('137', 'L9S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('137', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('138', 'ZAL | Riu Vell', 'Superfície', '{"L10S":"Extrem"}', '{"L10S":1}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('138', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('139', 'Ecoparc', 'Superfície', '{"L10S":"Extrem"}', '{"L10S":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('139', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('140', 'Port Comercial | La Factoria', 'Superfície', '{"L10S":"Extrem"}', '{"L10S":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('140', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('141', 'Zona Franca', 'Superfície', '{"L10S":"Central"}', '{"L10S":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('141', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('142', 'Foc', 'Subterrània', '{"L10S":"Central"}', '{"L10S":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('142', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('143', 'Foneria', 'Subterrània', '{"L10S":"Central"}', '{"L10S":6}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('143', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('144', 'Provençana', 'Subterrània', '{"L10S":"Central"}', '{"L10S":8}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('144', 'L10S') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('145', 'Onze de Setembre', 'Subterrània', '{"L9N":"Extrem","L10N":"Extrem"}', '{"L9N":2,"L10N":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('145', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('145', 'L10N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('146', 'Bon Pastor', 'Subterrània', '{"L9N":"Extrem","L10N":"Central"}', '{"L9N":3,"L10N":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('146', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('146', 'L10N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('147', 'Can Peixauet', 'Subterrània', '{"L9N":"Central"}', '{"L9N":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('147', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('148', 'Santa Rosa', 'Subterrània', '{"L9N":"Central"}', '{"L9N":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('148', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('149', 'Església Major', 'Subterrània', '{"L9N":"Extrem"}', '{"L9N":7}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('149', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('150', 'Singuerlín', 'Subterrània', '{"L9N":"Extrem"}', '{"L9N":8}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('150', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('151', 'Can Zam', 'Subterrània', '{"L9N":"Extrem"}', '{"L9N":9}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('151', 'L9N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('152', 'Llefià', 'Subterrània', '{"L10N":"Central"}', '{"L10N":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('152', 'L10N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('153', 'La Salut', 'Subterrània', '{"L10N":"Extrem"}', '{"L10N":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('153', 'L10N') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('154', 'Casa de l''Aigua', 'Subterrània', '{"L11":"Central"}', '{"L11":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('154', 'L11') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('155', 'Torre Baró | Vallbona', 'Subterrània', '{"L11":"Central"}', '{"L11":3}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('155', 'L11') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.station_connections (station_id, connection_id) VALUES ('155', 'Rodalies') ON CONFLICT (station_id, connection_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('156', 'Ciutat Meridiana', 'Subterrània', '{"L11":"Central"}', '{"L11":4}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('156', 'L11') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('157', 'Can Cuiàs', 'Subterrània', '{"L11":"Extrem"}', '{"L11":5}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('157', 'L11') ON CONFLICT (station_id, line_id) DO NOTHING;
INSERT INTO public.stations (id, name, type, positions, line_orders) VALUES ('158', 'Reina Elisenda', 'Subterrània', '{"L12":"Extrem"}', '{"L12":2}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, positions = EXCLUDED.positions, line_orders = EXCLUDED.line_orders;
INSERT INTO public.station_lines (station_id, line_id) VALUES ('158', 'L12') ON CONFLICT (station_id, line_id) DO NOTHING;


-- 9. RPC Functions

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

-- Para Ruta (NUEVA FUNCIÓN)
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

-- 10. GENERACIÓN AUTOMÁTICA DE CALENDARIOS
-- NOTA: Si solo quieres CAMBIAR las estaciones y rutas diarias (desde el "DO $$" hasta el "END $$;")

DO $$
DECLARE
    start_date DATE := '2026-02-22';
    end_date DATE := '2026-12-30';
    current_iter_date DATE;
    station_ids TEXT[];
    s_id TEXT;
    
    -- Para rutas
    s1_id TEXT;
    s2_id TEXT;
    s1_lines TEXT[];
    s2_lines TEXT[];
    valid_route BOOLEAN;
BEGIN
    -- A. Generar calendario de Metrodle (Estación única)
    BEGIN
        SELECT array_agg(id) INTO station_ids FROM public.stations;
        current_iter_date := start_date;
        
        WHILE current_iter_date <= end_date LOOP
             FOR s_id IN (SELECT id FROM public.stations ORDER BY random()) LOOP
                 IF current_iter_date > end_date THEN EXIT; END IF;
                 INSERT INTO public.daily_schedule (date, station_id) VALUES (current_iter_date, s_id) ON CONFLICT DO NOTHING;
                 current_iter_date := current_iter_date + 1;
             END LOOP;
        END LOOP;
    END;

    -- B. Generar calendario de Ruta (Origen/Destino con transbordo)
    BEGIN
        current_iter_date := start_date;
        
        WHILE current_iter_date <= end_date LOOP
            valid_route := FALSE;
            
            -- Intentar encontrar una ruta válida (mínimo 1 transbordo)
            WHILE NOT valid_route LOOP
                SELECT id INTO s1_id FROM public.stations ORDER BY random() LIMIT 1;
                SELECT id INTO s2_id FROM public.stations WHERE id <> s1_id ORDER BY random() LIMIT 1;
                
                -- Verificar que no compartan ninguna línea
                SELECT array_agg(line_id) INTO s1_lines FROM public.station_lines WHERE station_id = s1_id;
                SELECT array_agg(line_id) INTO s2_lines FROM public.station_lines WHERE station_id = s2_id;
                
                IF NOT (s1_lines && s2_lines) THEN
                    valid_route := TRUE;
                END IF;
            END LOOP;

            INSERT INTO public.daily_route_schedule (date, origin_id, destination_id) 
            VALUES (current_iter_date, s1_id, s2_id) ON CONFLICT DO NOTHING;
            
            current_iter_date := current_iter_date + 1;
        END LOOP;
    END;
END $$;
