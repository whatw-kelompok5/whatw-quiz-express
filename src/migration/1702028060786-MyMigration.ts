import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1702028060786 implements MigrationInterface {
    name = 'MyMigration1702028060786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "diamond" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_ecb328ec92407c3f798356cd05a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "diamond"`);
    }

}
