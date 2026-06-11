-- ============================================================
-- SCHNEIDER KAM — Configuración de Storage
--
-- Ejecutar DESPUÉS de crear el bucket "documentos" en
-- Supabase > Storage > New bucket  (nombre: documentos, Private)
-- ============================================================

-- Política: cada usuario sube archivos solo a su propia carpeta
CREATE POLICY "storage_upload_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documentos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política: cada usuario lee sus propios archivos
CREATE POLICY "storage_read_own"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documentos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política: cada usuario elimina sus propios archivos
CREATE POLICY "storage_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documentos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
