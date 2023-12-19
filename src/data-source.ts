import "reflect-metadata";
import { DataSource } from "typeorm";
import Env from "./utils/Env/Env";
export const AppDataSource = new DataSource({
	type: "postgres",
	host: Env.DB_HOST,
	port: Env.DB_PORT,
	username: Env.DB_USER,
	password: Env.DB_PASSWORD,
	database: Env.DB_NAME,
	synchronize: true,
	logging: false,
	entities: ["src/entity/*.ts"],
	migrations: ["src/migration/*.ts"],
	subscribers: [],
	ssl: true,
});
