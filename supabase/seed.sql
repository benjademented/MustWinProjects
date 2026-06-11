-- ============================================================
-- SCHNEIDER KAM — Datos iniciales
--
-- ANTES DE EJECUTAR:
-- 1. Ve a Supabase > Authentication > Users
-- 2. Copia el UUID de tu usuario (columna "UID")
-- 3. Reemplaza TODOS los '04646d44-7a04-471d-a397-76bf2ef044f4' por ese UUID
-- 4. Pega este script completo en SQL Editor y ejecuta
-- ============================================================

DO $$
DECLARE
  v_user_id   UUID := '04646d44-7a04-471d-a397-76bf2ef044f4';

  -- IDs de proyectos
  p_acciona   UUID := uuid_generate_v4();
  p_crcc      UUID := uuid_generate_v4();
  p_ohl       UUID := uuid_generate_v4();
  p_crs       UUID := uuid_generate_v4();

  -- IDs de hospitales
  h_la_serena      UUID := uuid_generate_v4();
  h_coquimbo       UUID := uuid_generate_v4();
  h_illapel        UUID := uuid_generate_v4();
  h_coronel        UUID := uuid_generate_v4();
  h_lota           UUID := uuid_generate_v4();
  h_nacimiento     UUID := uuid_generate_v4();
  h_santa_barbara  UUID := uuid_generate_v4();
  h_puerto_varas   UUID := uuid_generate_v4();
  h_los_lagos      UUID := uuid_generate_v4();
  h_la_union       UUID := uuid_generate_v4();

BEGIN

-- ---- PROYECTOS ----
INSERT INTO projects (id, user_id, constructora, red, color, orden) VALUES
  (p_acciona, v_user_id, 'Acciona',  NULL,                    '#00B2A9', 1),
  (p_crcc,    v_user_id, 'CRCC',     NULL,                    '#3D9BE9', 2),
  (p_ohl,     v_user_id, 'OHL',      'Red del Biobío',        '#F5A623', 3),
  (p_crs,     v_user_id, 'CRS',      'Red Los Ríos / Los Lagos', '#8B5CF6', 4);

-- ---- HOSPITALES ----
INSERT INTO hospitals (id, project_id, nombre, orden) VALUES
  (h_la_serena,     p_acciona, 'Hospital La Serena',      1),
  (h_coquimbo,      p_crcc,    'Hospital Coquimbo',       1),
  (h_illapel,       p_crcc,    'Hospital Illapel',        2),
  (h_coronel,       p_ohl,     'Hospital Coronel',        1),
  (h_lota,          p_ohl,     'Hospital Lota',           2),
  (h_nacimiento,    p_ohl,     'Hospital Nacimiento',     3),
  (h_santa_barbara, p_ohl,     'Hospital Santa Bárbara',  4),
  (h_puerto_varas,  p_crs,     'Hospital Puerto Varas',   1),
  (h_los_lagos,     p_crs,     'Hospital Los Lagos',      2),
  (h_la_union,      p_crs,     'Hospital La Unión',       3);

-- ---- OFFERS (uno por hospital, etapa inicial Prospecto) ----
INSERT INTO offers (hospital_id, etapa) VALUES
  (h_la_serena,     'Prospecto'),
  (h_coquimbo,      'Prospecto'),
  (h_illapel,       'Prospecto'),
  (h_coronel,       'Prospecto'),
  (h_lota,          'Prospecto'),
  (h_nacimiento,    'Prospecto'),
  (h_santa_barbara, 'Prospecto'),
  (h_puerto_varas,  'Prospecto'),
  (h_los_lagos,     'Prospecto'),
  (h_la_union,      'Prospecto');

END $$;
