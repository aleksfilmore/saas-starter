-- Shim file due to drizzle-kit expecting a filename with double .sql extension.
-- Actual migration content mirrors single-extension file.
DO $$ BEGIN END $$; -- no-op; original migration already applied or content resides in .sql file.
