import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: "ep-bold-grass-13341484.ap-southeast-1.aws.neon.tech",
	port: 5432,
	username: "roubilibo",
	password: "NbYgS63ToCBh",
	database: "db_quiz_whatw",
	synchronize: true,
	logging: false,
	entities: ["src/entity/*.ts"],
	migrations: ["src/migration/*.ts"],
	subscribers: [],
	ssl: true,
});
