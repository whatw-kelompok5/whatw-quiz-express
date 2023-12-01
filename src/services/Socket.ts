import * as express from "express";
import * as http from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

interface UserData {
	// Define the structure of user data
	// Adjust the structure based on your actual data
	username: string;
	// Add other properties as needed
}

interface Player extends UserData {
	socketId: string;
	answers?: Record<string, any>; // Adjust the type based on the actual data structure
}

interface Room {
	id: string;
	player: string[];
}

const player: Record<string, Player> = {};
let players: Player[] = [];
let rooms: Room[] = [];
const maxplayerPerRoom = 2;

// Function to decrement the countdown in each room
function startCountdown(roomId: string) {
	let countdownValue = 60;

	const countdownInterval = setInterval(() => {
		if (countdownValue > 0) {
			io.to(roomId).emit("countdown", countdownValue);
			countdownValue -= 1;
		} else {
			clearInterval(countdownInterval);
		}
	}, 1000);
}

io.on("connection", (socket: Socket) => {
	let joinedRoom = false;

	socket.on("userData", (userData: UserData) => {
		players.push({ ...userData, socketId: socket.id });
		player[socket.id] = { ...userData, socketId: socket.id };
		console.log("Player yang baru masuk:", userData);
		console.log("Semua players", players);

		io.to(socket.id).emit("userData", player[socket.id]);
		io.emit("usersData", Object.values(player));
		io.emit("playersData", players);
	});

	socket.on("answers", (data: Record<string, any>) => {
		const currentPlayer = players.find((p) => p.socketId === socket.id);
		if (currentPlayer) {
			currentPlayer.answers = { ...currentPlayer.answers, ...data };
			console.log("Received answers:", JSON.stringify(currentPlayer));
			// Do something with the received answers here
		}
	});

	rooms.some((room) => {
		if (room.player.length < maxplayerPerRoom) {
			socket.join(room.id);
			room.player.push(socket.id);
			joinedRoom = true;
			io.to(room.id).emit("playerJoined", room.player.length);

			if (room.player.length === 1) {
				startCountdown(room.id);
			}
			return true;
		}
		return false;
	});

	if (!joinedRoom) {
		const newRoom: Room = {
			id: `room${rooms.length + 1}`,
			player: [socket.id],
		};
		socket.join(newRoom.id);
		rooms.push(newRoom);

		io.to(newRoom.id).emit("playerJoined", {
			count: 1,
			player: player[socket.id],
		});

		startCountdown(newRoom.id);
	}

	socket.on("disconnect", () => {
		console.log("A user disconnected");
		delete player[socket.id];
		players = players.filter((p) => p.socketId !== socket.id);

		io.emit("usersData", Object.values(player));
		rooms = rooms.map((room) => {
			if (room.player.includes(socket.id)) {
				room.player = room.player.filter((playerId) => playerId !== socket.id);
				io.to(room.id).emit("playerJoined", room.player.length);
				return room;
			}
			return room;
		});
	});
});

server.listen(5000, () => {
	console.log("Server is running on port 5000");
});
