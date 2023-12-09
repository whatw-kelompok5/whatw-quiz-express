import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity({ name: "diamons" })
export class Diamond {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	quantity: number;

	@Column()
	price: number;

	// @OneToMany(() => Transaction, (transaction) => transaction.diamond)
  // transactions: Transaction[];
}
