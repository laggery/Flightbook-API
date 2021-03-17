import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flight } from "../flight/flight.entity";
import { Glider } from "../glider/glider.entity";
import { Place } from "../place/place.entity";

@Index("idx_16606_idx_e12875dfb3b1d92d7d7c5377e2", ["email"], { unique: true })
@Index("idx_16606_email", ["email"], { unique: true })
@Index("idx_16606_idx_846d5513f58dc765ecc299582a", ["emailCanonical"], {
  unique: true,
})
@Index("idx_16606_uniq_8d93d649a0d96fbf", ["emailCanonical"], { unique: true })
@Index("idx_16606_primary", ["id"], { unique: true })
@Index("idx_16606_uniq_8d93d64992fc23a8", ["usernameCanonical"], {
  unique: true,
})
@Index("idx_16606_idx_ed85f2a29d842b9b0dfefaba34", ["usernameCanonical"], {
  unique: true,
})
@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("character varying", { name: "username", length: 255 })
  username: string;

  @Column("character varying", { name: "username_canonical", length: 255 })
  usernameCanonical: string;

  @Column("character varying", { name: "email", length: 255 })
  email: string;

  @Column("character varying", { name: "email_canonical", length: 255 })
  emailCanonical: string;

  @Column("boolean", { name: "enabled" })
  enabled: boolean;

  @Column("character varying", { name: "salt", nullable: true, length: 255 })
  salt: string | null;

  @Column("character varying", { name: "password", length: 255 })
  password: string;

  @Column("timestamp with time zone", { name: "last_login", nullable: true })
  lastLogin: Date | null;

  @Column("boolean", { name: "locked", nullable: true })
  locked: boolean | null;

  @Column("boolean", { name: "expired", nullable: true })
  expired: boolean | null;

  @Column("timestamp with time zone", { name: "expires_at", nullable: true })
  expiresAt: Date | null;

  @Column("character varying", {
    name: "confirmation_token",
    nullable: true,
    length: 255,
  })
  confirmationToken: string | null;

  @Column("timestamp with time zone", {
    name: "password_requested_at",
    nullable: true,
  })
  passwordRequestedAt: Date | null;

  @Column("text", { name: "roles" })
  roles: string;

  @Column("boolean", { name: "credentials_expired", nullable: true })
  credentialsExpired: boolean | null;

  @Column("timestamp with time zone", {
    name: "credentials_expire_at",
    nullable: true,
  })
  credentialsExpireAt: Date | null;

  @Column("character varying", { name: "firstname", length: 30 })
  firstname: string;

  @Column("character varying", { name: "lastname", length: 30 })
  lastname: string;

  @Column("character varying", { name: "token", nullable: true, length: 60 })
  token: string | null;

  @OneToMany(() => Flight, (flight) => flight.user)
  flights: Flight[];

  @OneToMany(() => Glider, (glider) => glider.user)
  gliders: Glider[];

  @OneToMany(() => Place, (place) => place.user)
  places: Place[];
}
