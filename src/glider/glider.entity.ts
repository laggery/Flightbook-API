import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user/user.entity";
import { Flight } from "../flight/flight.entity";

@Index("idx_16593_primary", ["id"], { unique: true })
@Index("idx_16593_user_id", ["userId"], {})
@Entity("glider")
export class Glider {
  @PrimaryGeneratedColumn()
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("integer", { name: "user_id" })
  userId: number;

  @Column("date", { name: "buy_date", nullable: true })
  buyDate: string | null;

  @Column("character varying", { name: "brand", length: 30 })
  brand: string;

  @Column("character varying", { name: "name", length: 30 })
  name: string;

  @Column("boolean", { name: "tandem", default: () => "false" })
  tandem: boolean;

  @Column({ select: false, nullable: true, insert: false, readonly: true })
  nbFlights: number;

  @Column({ select: false, nullable: true, insert: false, readonly: true })
  time: number | null;

  @OneToMany(() => Flight, (flight) => flight.glider)
  flights: Flight[];

  @ManyToOne(() => User, (user) => user.gliders, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}

