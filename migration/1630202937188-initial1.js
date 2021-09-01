const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class initial11630202937188 {
  name = 'initial11630202937188';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE \`test\`.\`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`text\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`test\`.\`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE \`test\`.\`user\``);
    await queryRunner.query(`DROP TABLE \`test\`.\`post\``);
  }
};
