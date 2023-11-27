import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1701066634743 implements MigrationInterface {
    name = 'MyMigration1701066634743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_avatar" ("avatar_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_eb55b641724916df780aa4e0c53" PRIMARY KEY ("avatar_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_48db3734242b6970badc8a75c3" ON "user_avatar" ("avatar_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_90a1254abd9cce470f8cbea3b1" ON "user_avatar" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "user_avatar" ADD CONSTRAINT "FK_48db3734242b6970badc8a75c36" FOREIGN KEY ("avatar_id") REFERENCES "avatar"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_avatar" ADD CONSTRAINT "FK_90a1254abd9cce470f8cbea3b18" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_avatar" DROP CONSTRAINT "FK_90a1254abd9cce470f8cbea3b18"`);
        await queryRunner.query(`ALTER TABLE "user_avatar" DROP CONSTRAINT "FK_48db3734242b6970badc8a75c36"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_90a1254abd9cce470f8cbea3b1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48db3734242b6970badc8a75c3"`);
        await queryRunner.query(`DROP TABLE "user_avatar"`);
    }

}
