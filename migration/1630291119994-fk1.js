const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class fk11630291119994 {
    name = 'fk11630291119994'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`test\`.\`post\` ADD \`test\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`test\`.\`post\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`test\`.\`post\` ADD CONSTRAINT \`FK_5c1cf55c308037b5aca1038a131\` FOREIGN KEY (\`userId\`) REFERENCES \`test\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`test\`.\`post\` DROP FOREIGN KEY \`FK_5c1cf55c308037b5aca1038a131\``);
        await queryRunner.query(`ALTER TABLE \`test\`.\`post\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`test\`.\`post\` DROP COLUMN \`test\``);
    }
}
