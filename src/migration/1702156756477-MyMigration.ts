import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1702156756477 implements MigrationInterface {
    name = 'MyMigration1702156756477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "orderId" character varying NOT NULL, "email" character varying NOT NULL, "diamond" integer NOT NULL, "price" integer NOT NULL, "transactionStatus" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions"`);
    }

}
