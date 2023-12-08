import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "diamons" })
export class Diamond {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	quantity: number;

	@Column()
	price: number;
}
