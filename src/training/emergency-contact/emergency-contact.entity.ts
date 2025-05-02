import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/user.entity";

@Entity("emergency_contact")
export class EmergencyContact {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "firstname" })
  firstname: string;

  @Column("text", { name: "lastname" })
  lastname: string;

  @Column("text", { name: "phone" })
  phone: string;

  @Column("text", { name: "additional_information", nullable: true })
  additionalInformation: string | null;

  @ManyToOne(() => User, (user) => user.emergencyContacts, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;
}
