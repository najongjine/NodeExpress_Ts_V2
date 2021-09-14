const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class addedPwColumInUser1630913593677 {
    name = 'addedPwColumInUser1630913593677'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`test\`.\`user\` ADD \`password\` varchar(255) NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`test\`.\`user\` DROP COLUMN \`password\``);
    }
}
