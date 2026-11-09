import { MigrationInterface, QueryRunner } from 'typeorm';

// Supabase exposes `public` over PostgREST; RLS with no policies blocks that
// while the API role (BYPASSRLS) is unaffected.
export class EnableRowLevelSecurity1794221056191 implements MigrationInterface {
  name = 'EnableRowLevelSecurity1794221056191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE t text;
      BEGIN
        FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
          EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
        END LOOP;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE t text;
      BEGIN
        FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
          EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', t);
        END LOOP;
      END $$;
    `);
  }
}
