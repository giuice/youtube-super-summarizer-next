import SchemaSetup from '../infra/neon/SchemaSetup';
import MigrationUtility from '../infra/neon/MigrationUtility';

async function runMigration() {
  try {
    // First, set up the schema
    console.log('Setting up Neon PostgreSQL schema...');
    await SchemaSetup.createTables();
    
    // Then run the data migration
    console.log('\nStarting data migration...');
    const migrationResult = await MigrationUtility.migrateAll({
      batchSize: 50,
      logProgress: true,
      validateData: true
    });
    
    console.log('\nMigration completed successfully!');
    console.log('Summary:', JSON.stringify(migrationResult, null, 2));
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();