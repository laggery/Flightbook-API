import { Enrollment } from "../../enrollment/enrollment.entity";
import { Student } from "../../student/student.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TeamMember } from "../../team-member/team-member.entity";
import {Appointment} from "../../appointment/appointment.entity";
import { AppointmentType } from "../../appointment/appointment-type.entity";
import { TandemPilot } from "../../tandem-pilot/tandem-pilot.entity";
import { SchoolConfig } from "./school-config";
import { SchoolException } from "../exception/school.exception";

@Entity("school")
export class School {
  @PrimaryGeneratedColumn()
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 255, unique: true })
  name: string;

  @Column("character varying", { name: "address1", length: 255 })
  address1: string;

  @Column("character varying", { name: "address2", length: 255, nullable: true })
  address2: string;

  @Column("character varying", { name: "plz", length: 255 })
  plz: string;

  @Column("character varying", { name: "city", length: 255 })
  city: string;

  @Column("character varying", { name: "phone", length: 255 })
  phone: string;

  @Column("character varying", { name: "email", length: 255 })
  email: string;

  @Column("character varying", { name: "language", length: 2 })
  language: string;

  // @Column(() => SchoolConfiguration, { prefix: false })
  // configuration: SchoolConfiguration;

  @Column("jsonb", { nullable: true, name: "config" })
  configuration: SchoolConfig | null;

  @OneToMany(() => TeamMember, (teamMember) => teamMember.school, { cascade: ['insert', 'update'] })
  teamMembers: TeamMember[];

  @OneToMany(() => Student, (student) => student.school, { cascade: ['insert', 'update'] })
  students: Student[];
  
  @OneToMany(() => TandemPilot, (tandemPilot) => tandemPilot.school, { cascade: ['insert', 'update'] })
  tandemPilots: TandemPilot[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.school, { cascade: ['insert', 'update'] })
  enrollments: Enrollment[];

  @OneToMany(() => Appointment, (appointment) => appointment.school, { cascade: ['insert', 'update'] })
  appointments: Appointment[];

  @OneToMany(() => AppointmentType, (appointmentType) => appointmentType.school, { cascade: ['insert', 'update'] })
  appointmentTypes: AppointmentType[];

  mergeConfiguration(update: SchoolConfig): void {
    if (!this.configuration) {
      this.configuration = new SchoolConfig();
    }

    if (update.schoolModule) {
      this.configuration.schoolModule = {
        ...this.configuration.schoolModule,
        ...update.schoolModule
      };
    }

    if (update.tandemModule) {
      // Merge tandemModule with special handling for flightConfig
      const mergedTandemModule = {
        ...this.configuration.tandemModule,
        ...update.tandemModule
      };

      // Handle flightConfig with immutability rules
      if (update.tandemModule.flightConfig) {
        const existingFields = this.configuration.tandemModule?.flightConfig?.customFields || [];
        const updatedFields = update.tandemModule.flightConfig.customFields || [];

        // Validate immutability: key and type cannot change
        for (const updatedField of updatedFields) {
          const existingField = existingFields.find(f => f.key === updatedField.key);
          if (existingField) {
            // Field exists - validate immutability
            if (existingField.type !== updatedField.type) {
              SchoolException.customFieldTypeImmutableException(updatedField.key);
            }
            // Note: key is used for matching, so it can't change by definition
          }
        }

        // Check for duplicate keys in the update
        const keys = updatedFields.map(f => f.key);
        const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
        if (duplicates.length > 0) {
          SchoolException.customFieldDuplicateKeysException(duplicates);
        }

        mergedTandemModule.flightConfig = update.tandemModule.flightConfig;
      } else if (this.configuration.tandemModule?.flightConfig) {
        // Preserve existing flightConfig if not provided in update
        mergedTandemModule.flightConfig = this.configuration.tandemModule.flightConfig;
      }

      this.configuration.tandemModule = mergedTandemModule;
    }
  }
}
