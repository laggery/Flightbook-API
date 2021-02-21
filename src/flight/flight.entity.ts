import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Glider } from '../glider/glider.entity';
import { Place } from "../place/place.entity";
import { User } from "../user/user.entity";

@Index("idx_16586_glider_id", ["gliderId"], {})
@Index("idx_16586_primary", ["id"], { unique: true })
@Index("idx_16586_landing_id", ["landingId"], {})
@Index("idx_16586_start_id", ["startId"], {})
@Index("idx_16586_user_id", ["userId"], {})
@Entity("flight")
export class Flight {
  @PrimaryGeneratedColumn()
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("integer", { name: "glider_id" })
  gliderId: number;

  @Column("integer", { name: "start_id", nullable: true })
  startId: number | null;

  @Column("integer", { name: "landing_id", nullable: true })
  landingId: number | null;

  @Column("integer", { name: "user_id" })
  userId: number;

  @Column("date", { name: "date", nullable: true })
  date: string | null;

  @Column("time without time zone", { name: "time", nullable: true })
  time: string | null;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 2000,
  })
  description: string | null;

  @Column("double precision", { name: "price", nullable: true })
  price: number | null;

  @Column("integer", { name: "km", nullable: true })
  km: number | null;

  @Column("timestamp with time zone", {
    name: "timestamp",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  timestamp: Date | null;

  @ManyToOne(() => Glider, (glider) => glider.flights, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "glider_id", referencedColumnName: "id" }])
  glider: Glider;

  @ManyToOne(() => Place, (place) => place.flights, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "landing_id", referencedColumnName: "id" }])
  landing: Place;

  @ManyToOne(() => Place, (place) => place.flights2, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "start_id", referencedColumnName: "id" }])
  start: Place;

  @ManyToOne(() => User, (user) => user.flights, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
