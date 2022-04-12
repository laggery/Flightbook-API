import { Exclude, Expose } from "class-transformer";
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

@Exclude()
@Index("idx_16406_primary", ["id"], { unique: true })
@Index("idx_16603_primary", ["id"], { unique: true })
@Index("idx_16603_user_id", ["userId"], {})
@Index("idx_16406_user_id", ["userId"], {})
@Entity("place", { schema: "public" })
export class Place {
  @Expose()
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user_id" })
  userId: number;

  @Expose()
  @Column("character varying", { name: "name" })
  name: string;

  @Expose()
  @Column("integer", { name: "altitude", nullable: true })
  altitude: number | null;

  @Expose()
  @Column("character varying", { name: "country", nullable: true })
  country: string | null;

  @OneToMany(() => Flight, (flight) => flight.start)
  start: Flight[];

  @OneToMany(() => Flight, (flight) => flight.landing)
  landing: Flight[];

  @ManyToOne(() => User, (user) => user.places, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
