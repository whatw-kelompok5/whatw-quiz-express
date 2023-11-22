import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "avatar" })
export class Avatar {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	image: string;

	@Column({ nullable: true, default: 0 })
	price: number;

	@OneToMany(() => User, (user) => user.avatar)
	users: User[];

	@CreateDateColumn({ type: "timestamp with time zone" })
	created_at: Date;

	@UpdateDateColumn({ type: "timestamp with time zone" })
	updated_at: Date;
}
