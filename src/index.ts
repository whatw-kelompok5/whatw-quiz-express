import { AppDataSource } from "./data-source";
import * as express from "express";
import * as cors from "cors";
import AvaRouter from "./routes/Avatars";

AppDataSource.initialize()
	.then(async () => {
		const app = express();
		const port = 3000;

		const options: cors.CorsOptions = {
			allowedHeaders: [, "X-Requested-With", "Content-Type", "Authorization"],
			credentials: true,
			methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
			origin: "*",
			preflightContinue: false,
		};

		app.use(express.json());
		app.use(cors(options));
		app.use("/api", AvaRouter);

		app.listen(port, () => `Server running on port ${port}`);
	})
	.catch((error) => console.log(error));
