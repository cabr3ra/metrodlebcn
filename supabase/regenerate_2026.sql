
-- REGENERATION SCRIPT FOR METRODLE BCN
-- Targets: daily_schedule (Metrodle) and daily_route_schedule (Ruta)
-- Period: 2026-02-21 to 2026-12-30

DO $$
DECLARE
    target_start_date DATE := '2026-02-21';
    target_end_date DATE := '2026-12-30';
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
    -- 1. Limpiar el rango solicitado
    DELETE FROM public.daily_schedule WHERE date >= target_start_date AND date <= target_end_date;
    DELETE FROM public.daily_route_schedule WHERE date >= target_start_date AND date <= target_end_date;

    -- 2. Generar calendario de Metrodle (Estación aleatoria diaria)
    -- Obtenemos IDs de estaciones y las vamos asignando en ciclos aleatorios
    SELECT array_agg(id) INTO station_ids FROM public.stations;
    current_iter_date := target_start_date;
    
    WHILE current_iter_date <= target_end_date LOOP
         -- Barajamos las estaciones para cada ciclo
         FOR s_id IN (SELECT id FROM public.stations ORDER BY random()) LOOP
             IF current_iter_date > target_end_date THEN EXIT; END IF;
             
             INSERT INTO public.daily_schedule (date, station_id) 
             VALUES (current_iter_date, s_id) 
             ON CONFLICT (date) DO UPDATE SET station_id = EXCLUDED.station_id;
             
             current_iter_date := current_iter_date + 1;
         END LOOP;
    END LOOP;

    -- 3. Generar calendario de Ruta (Origen/Destino que requieren transbordo)
    current_iter_date := target_start_date;
    
    WHILE current_iter_date <= target_end_date LOOP
        valid_route := FALSE;
        
        -- Intentamos encontrar una combinación válida (Que NO compartan línea directa)
        WHILE NOT valid_route LOOP
            SELECT id INTO s1_id FROM public.stations ORDER BY random() LIMIT 1;
            SELECT id INTO s2_id FROM public.stations WHERE id <> s1_id ORDER BY random() LIMIT 1;
            
            -- Verificamos si comparten alguna línea
            SELECT array_agg(line_id) INTO s1_lines FROM public.station_lines WHERE station_id = s1_id;
            SELECT array_agg(line_id) INTO s2_lines FROM public.station_lines WHERE station_id = s2_id;
            
            -- Si el operador && (traslape de arrays) es falso, la ruta requiere transbordo
            IF NOT (s1_lines && s2_lines) THEN
                valid_route := TRUE;
            END IF;
        END LOOP;

        INSERT INTO public.daily_route_schedule (date, origin_id, destination_id) 
        VALUES (current_iter_date, s1_id, s2_id) 
        ON CONFLICT (date) DO UPDATE SET origin_id = EXCLUDED.origin_id, destination_id = EXCLUDED.destination_id;
        
        current_iter_date := current_iter_date + 1;
    END LOOP;
    
    RAISE NOTICE 'Calendarios regenerados con éxito desde % hasta %', target_start_date, target_end_date;
END $$;
