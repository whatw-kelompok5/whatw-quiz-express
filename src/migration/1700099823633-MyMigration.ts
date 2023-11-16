import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1700099823633 implements MigrationInterface {
    name = 'MyMigration1700099823633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "avatar" ALTER COLUMN "price" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "avatar" ALTER COLUMN "price" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "avatar" ALTER COLUMN "price" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "avatar" ALTER COLUMN "price" SET NOT NULL`);
    }

}
