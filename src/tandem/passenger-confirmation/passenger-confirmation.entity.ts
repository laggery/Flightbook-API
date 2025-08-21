import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../user/domain/user.entity";

@Entity("passenger_confirmation")
export class PassengerConfirmation {

    @PrimaryGeneratedColumn()
    @Column("integer", { primary: true, name: "id" })
    id: number;

    @Column("text", { nullable: false })
    firstname: string;

    @Column("text", { nullable: false })
    lastname: string;

    @Column("text", { nullable: false })
    email: string;

    @Column("text", { nullable: false })
    phone: string;

    @Column("text", { nullable: false })
    place: string;

    @Column("date", { nullable: false })
    date: Date;

    @Column("text", { nullable: false })
    signature: string;

    @Column("text", { nullable: false, name: "signature_mime_type" })
    signatureMimeType: string; // "image/svg+xml"

    @Column("jsonb", { nullable: false })
    validation: {
        fullyUnderstoodInstructions: boolean;
        undertakePilotInstructions: boolean;
        noHealthProblems: boolean;
        understandRisks: boolean;
    };

    @Column("boolean", { name: "can_use_data", default: () => "false" })
    canUseData: boolean;

    @Column("timestamp", {
        name: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    timestamp: Date;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
    user: User;
}
