import { AppDataSource } from "./data-source";
import { Server } from "socket.io";
import SocketServices from "./services/SocketServices";
import AvaRouter from "./routes/Avatars";
import UserRouter from "./routes/Users";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);
    const socket = new SocketServices(io);

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-3mi0pq2O0MesF3jHIStaVVTo",
      clientKey: "SB-Mid-client-2yxSDW9MSfHHPxRd",
    });

    const port = 3000;

    const options = {
      allowedHeaders: ["X-Requested-With", "Content-Type", "Authorization"],
      credentials: true,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: "*",
      preflightContinue: false,
    };

    app.use(express.json());
    app.use(cors(options));

		//! Routes
		app.use("/api", AvaRouter);
		app.use("/api", UserRouter);

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
