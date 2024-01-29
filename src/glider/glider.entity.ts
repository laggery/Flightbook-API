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
@Index("idx_16396_primary", ["id"], { unique: true })
@Index("idx_16396_user_id", ["userId"], {})
@Index("idx_16593_user_id", ["userId"], {})
@Entity("glider")
export class Glider {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
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

  @Column("integer", { name: "nbFlights", nullable: true })
  nbFlights: number | null;

  @Column("integer", { name: "time", nullable: true })
  time: number | null;

  @Column("boolean", { name: "archived", default: () => "false" })
  archived: boolean;

  @Column("character varying", {
    name: "note",
    nullable: true,
    length: 2000,
  })
  note: string | null;

  @OneToMany(() => Flight, (flight) => flight.glider)
  flights: Flight[];

  @ManyToOne(() => User, (user) => user.gliders, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
