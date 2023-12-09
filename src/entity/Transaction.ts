// File: Transaction.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  // ManyToOne,
  // JoinColumn,
} from "typeorm";
// import { User } from "./User";
// import { Diamond } from "./Diamond";

@Entity({ name: "transactions" })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: string;

  // @ManyToOne(() => User, (user) => user.transactions)
  // @JoinColumn({ name: "userId" })
  // user: User;
  @Column()
  email: string;

  @Column()
  diamond: number;
  // @ManyToOne(() => Diamond, (diamond) => diamond.transactions)
  // @JoinColumn({ name: "diamondId" })
  // diamond: Diamond;

  @Column()
  price: number;

  @Column({ nullable: true })
  transactionStatus: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;
}
