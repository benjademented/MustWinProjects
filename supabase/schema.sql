-- ============================================================
-- SCHNEIDER KAM — Schema completo
-- Pegar en: Supabase > SQL Editor > New query > Run
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- TABLAS
-- ------------------------------------------------------------

CREATE TABLE projects (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  constructora TEXT NOT NULL,
  red        TEXT,
  color      TEXT NOT NULL DEFAULT '#00B2A9',
  orden      INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hospitals (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  nombre     TEXT NOT NULL,
  orden      INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE offers (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id      UUID REFERENCES hospitals(id) ON DELETE CASCADE NOT NULL UNIQUE,
  etapa            TEXT DEFAULT 'Prospecto',
  fecha_licitacion TEXT,
  fecha_entrega    TEXT,
  notas            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE package_tracking (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id     UUID REFERENCES hospitals(id) ON DELETE CASCADE NOT NULL,
  paquete         TEXT NOT NULL,
  via_cotizacion  TEXT,
  n_sr            TEXT,
  n_quote         TEXT,
  estado          TEXT DEFAULT 'Por solicitar',
  fecha_solicitud TEXT,
  fecha_recepcion TEXT,
  monto           BIGINT,
  datos_tecnicos  JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hospital_id, paquete)
);

CREATE TABLE package_files (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_tracking_id  UUID REFERENCES package_tracking(id) ON DELETE CASCADE NOT NULL,
  nombre_archivo       TEXT NOT NULL,
  tipo                 TEXT,
  ruta_storage         TEXT NOT NULL,
  fecha_subida         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE package_minutas (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_tracking_id  UUID REFERENCES package_tracking(id) ON DELETE CASCADE NOT NULL,
  fecha                DATE DEFAULT CURRENT_DATE,
  texto                TEXT NOT NULL,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE minutas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fecha         DATE DEFAULT CURRENT_DATE,
  resumen       TEXT,
  transcripcion TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pendientes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE NOT NULL,
  texto       TEXT NOT NULL,
  completado  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------

ALTER TABLE projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals       ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_files   ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_minutas ENABLE ROW LEVEL SECURITY;
ALTER TABLE minutas         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pendientes      ENABLE ROW LEVEL SECURITY;

-- projects: acceso completo solo al dueño
CREATE POLICY "projects_owner" ON projects
  FOR ALL USING (user_id = auth.uid());

-- hospitals: acceso a través del proyecto del usuario
CREATE POLICY "hospitals_owner" ON hospitals
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- offers: a través de hospitals
CREATE POLICY "offers_owner" ON offers
  FOR ALL USING (
    hospital_id IN (
      SELECT h.id FROM hospitals h
      JOIN projects p ON h.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- package_tracking: a través de hospitals
CREATE POLICY "package_tracking_owner" ON package_tracking
  FOR ALL USING (
    hospital_id IN (
      SELECT h.id FROM hospitals h
      JOIN projects p ON h.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- package_files: a través de package_tracking
CREATE POLICY "package_files_owner" ON package_files
  FOR ALL USING (
    package_tracking_id IN (
      SELECT pt.id FROM package_tracking pt
      JOIN hospitals h ON pt.hospital_id = h.id
      JOIN projects p ON h.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- package_minutas: a través de package_tracking
CREATE POLICY "package_minutas_owner" ON package_minutas
  FOR ALL USING (
    package_tracking_id IN (
      SELECT pt.id FROM package_tracking pt
      JOIN hospitals h ON pt.hospital_id = h.id
      JOIN projects p ON h.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- minutas: acceso del propio usuario
CREATE POLICY "minutas_owner" ON minutas
  FOR ALL USING (user_id = auth.uid());

-- pendientes: a través de hospitals
CREATE POLICY "pendientes_owner" ON pendientes
  FOR ALL USING (
    hospital_id IN (
      SELECT h.id FROM hospitals h
      JOIN projects p ON h.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );
