// socketService.ts
import { Server, Socket } from "socket.io";

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

class SocketServices {
	private io: Server;
	private players: Player[] = [];
	private rooms: Room[] = [];
	private maxplayerPerRoom = 2;

	constructor(io: Server) {
		this.io = io;
		this.setupSocketEvents();
	}

	private startCountdown(roomId: string) {
		let countdownValue = 60;

		const countdownInterval = setInterval(() => {
			if (countdownValue > 0) {
				this.io.to(roomId).emit("countdown", countdownValue);
				countdownValue -= 1;
			} else {
				clearInterval(countdownInterval);
			}
		}, 1000);
	}

	private setupSocketEvents() {
		this.io.on("connection", (socket: Socket) => {
			let joinedRoom = false;

			socket.on("userData", (userData: UserData) => {
				this.players.push({ ...userData, socketId: socket.id });
				console.log("Player yang baru masuk:", userData);
				console.log("Semua players", this.players);

				this.io.to(socket.id).emit(
					"userData",
					this.players.find((p) => p.socketId === socket.id)
				);
				this.io.emit("usersData", this.players);
				this.io.emit("playersData", this.players);
			});

			socket.on("answers", (data: Record<string, any>) => {
				const currentPlayer = this.players.find(
					(p) => p.socketId === socket.id
				);
				if (currentPlayer) {
					currentPlayer.answers = { ...currentPlayer.answers, ...data };
					console.log("Received answers:", JSON.stringify(currentPlayer));
					// Do something with the received answers here
				}
			});

			this.rooms.some((room) => {
				if (room.player.length < this.maxplayerPerRoom) {
					socket.join(room.id);
					room.player.push(socket.id);
					joinedRoom = true;
					this.io.to(room.id).emit("playerJoined", room.player.length);

					if (room.player.length === 1) {
						this.startCountdown(room.id);
					}
					return true;
				}
				return false;
			});

			if (!joinedRoom) {
				const newRoom: Room = {
					id: `room${this.rooms.length + 1}`,
					player: [socket.id],
				};
				socket.join(newRoom.id);
				this.rooms.push(newRoom);

				this.io.to(newRoom.id).emit("playerJoined", {
					count: 1,
					player: this.players.find((p) => p.socketId === socket.id),
				});

				this.startCountdown(newRoom.id);
			}

			socket.on("disconnect", () => {
				console.log("A user disconnected");
				this.players = this.players.filter((p) => p.socketId !== socket.id);

				this.io.emit("usersData", this.players);
				this.rooms = this.rooms.map((room) => {
					if (room.player.includes(socket.id)) {
						room.player = room.player.filter(
							(playerId) => playerId !== socket.id
						);
						this.io.to(room.id).emit("playerJoined", room.player.length);
						return room;
					}
					return room;
				});
			});
		});
	}
}

export default SocketServices;
