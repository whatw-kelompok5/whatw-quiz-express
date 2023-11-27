import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
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

	@ManyToMany(() => User, (user) => user.avatars_owned, { cascade: true })
	@JoinTable({
		name: "user_avatar",
		joinColumn: { name: "avatar_id", referencedColumnName: "id" },
		inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
	})
	avatar_owners: User[];

	@CreateDateColumn({ type: "timestamp with time zone" })
	created_at: Date;

	@UpdateDateColumn({ type: "timestamp with time zone" })
	updated_at: Date;
}
