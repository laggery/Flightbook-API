import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { User } from "../user/user.entity";
import { Flight } from "../flight/flight.entity";
import { Exclude, Expose } from "class-transformer";

@Exclude()
@Entity("place", { schema: "flight" })
@Index("user_id", ["user",])
export class Place {

    @Expose()
    @PrimaryGeneratedColumn({
        type: "int",
        name: "id"
    })
    id: number;

    @Expose()
    @ManyToOne(type => User, user => user.places, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'user_id' })
    user: User | null;

    @Expose()
    @Column("varchar", {
        nullable: false,
        length: 40,
        name: "name"
    })
    name: string;

    @Expose()
    @Column("int", {
        nullable: true,
        name: "altitude"
    })
    altitude: number | null;

    @OneToMany(type => Flight, flight => flight.start, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    flights: Flight[];

    @OneToMany(type => Flight, flight => flight.landing, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    flights2: Flight[];
}
