import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
	ManyToMany,
	OneToMany,
} from "typeorm";
import { Avatar } from "./Avatar";

@Entity({ name: "users" })
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	fullname: string;

	@Column()
	email: string;

	@ManyToOne(() => Avatar, (avatar) => avatar.users, {
		onDelete: "SET NULL",
		onUpdate: "SET NULL",
		nullable: true,
	})
	@JoinColumn({ name: "avatarId" })
	avatar: Avatar;

	// @OneToMany(() => Transaction, (transaction) => transaction.user) // Tambahkan relasi One-to-Many
	// transactions: Transaction[]; // Tambahkan properti untuk menyimpan transaksi

	@ManyToMany(() => Avatar, (avatar) => avatar.avatar_owners)
	avatars_owned: Avatar[];

	@Column({ nullable: true, default: 0 })
	diamond: number;

	@CreateDateColumn({ type: "timestamp with time zone" })
	created_at: Date;

	@UpdateDateColumn({ type: "timestamp with time zone" })
	updated_at: Date;
}
