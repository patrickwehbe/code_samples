# Database Scripts

The scripts in this folder will allow us to create the database and collections in arangoDb and add seed data to it.

## db-config.ts

- Contains the logic needed to create the database and collections
- The database name and database connection configs are taken from the Env.ts class (see src)
- The name of the collections (+ specifying if it's an edge collection) can be done in db-config.ts script

## db-seed.ts

- Contains the logic needed to add mock data to the database
- This script can be extended for data migration (from json or other dbs to this particular db)