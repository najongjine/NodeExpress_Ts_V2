const { configSettings } = require('./src/config/settings.ts');

//npm run typeorm migration:generate -- -n myname -o
//npm run typeorm migration:run
//npm run typeorm migration:revert
var dbConfig = {
  type: configSettings.typeOrmDb1.type,
  host: configSettings.typeOrmDb1.host,
  port: configSettings.typeOrmDb1.port,
  username: configSettings.typeOrmDb1.username,
  password: configSettings.typeOrmDb1.password,
  database: configSettings.typeOrmDb1.database,
  entities: [`dist/entity/**/*.js`],
  synchronize: configSettings.typeOrmDb1.synchronize,
  logging: configSettings.typeOrmDb1.logging,
  migrations: ['migration/*.js'], //migration 하고싶은 파일 명
  cli: {
    migrationsDir: 'migration',
  },
};

module.exports = dbConfig;
