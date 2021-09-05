const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class subpostAdded1630835763674 {
    name = 'subpostAdded1630835763674'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`test\`.\`sub_post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`test\` varchar(255) NULL, \`postId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`test\`.\`sub_post\` ADD CONSTRAINT \`FK_ff49677c83162eaa544f4194091\` FOREIGN KEY (\`postId\`) REFERENCES \`test\`.\`post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`test\`.\`sub_post\` DROP FOREIGN KEY \`FK_ff49677c83162eaa544f4194091\``);
        await queryRunner.query(`DROP TABLE \`test\`.\`sub_post\``);
    }
}
