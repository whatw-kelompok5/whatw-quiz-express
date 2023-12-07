import { AppDataSource } from "./data-source";
import { Server } from "socket.io";
import SocketServices from "./services/SocketServices";
import AvaRouter from "./routes/Avatars";
import UserRouter from "./routes/Users";
import express = require("express");
import http = require("http");
import cors = require("cors");
import midtransClient = require("midtrans-client");

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

    app.use("/api", AvaRouter);
    app.use("/api", UserRouter);

    // New route for Midtrans transaction
    app.post("/api/midtrans/transaction", async (req, res) => {
      const { id, price, quantity, email, fullname } = req.body;

      const parameter = {
        transaction_details: {
          order_id: `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          gross_amount: price,
          quantity: quantity,
        },
        customer_details: {
          fullname: fullname,
          email: email,
        },
      };

      try {
        const payment = await snap.createTransaction(parameter);
        const payment_url = payment.redirect_url;
        const token = payment.token;
        const orderId = parameter.transaction_details.order_id; 
        console.log(payment);

        return res.status(200).json({
          code: 200,
          message: "Success",
          data: {
            message: "Transaction success",
            payment_url: payment_url,
            token: token,
            orderId: orderId,
          },
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    });

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
