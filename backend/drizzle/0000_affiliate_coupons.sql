-- Manual SQL migration for affiliate_coupons table
CREATE TABLE IF NOT EXISTS affiliate_coupons (
  code text PRIMARY KEY,
  times_used integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Optional trigger to auto-update updated_at on updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'set_updated_at_timestamp' AND n.nspname = 'public'
  ) THEN
    CREATE FUNCTION set_updated_at_timestamp() RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_affiliate_coupons_updated_at'
  ) THEN
    CREATE TRIGGER set_affiliate_coupons_updated_at
    BEFORE UPDATE ON affiliate_coupons
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at_timestamp();
  END IF;
END $$;
