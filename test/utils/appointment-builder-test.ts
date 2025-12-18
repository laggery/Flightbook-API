import { School } from "../../src/training/school/school.entity";
import { Appointment } from "../../src/training/appointment/appointment.entity";
import { State } from "../../src/training/appointment/state";
import { User } from "../../src/user/domain/user.entity";
import { AppointmentType } from "../../src/training/appointment/appointment-type.entity";

export class AppointmentBuilderTest {
  private appointment: Appointment;

  constructor(school: School, instructor: User) {
    this.appointment = new Appointment();
    // Set defaults
    this.appointment.scheduling = new Date("2025-11-24T12:00:00");
    this.appointment.meetingPoint = "meeting point";
    this.appointment.maxPeople = 1;
    this.appointment.description = "description";
    this.appointment.state = State.CONFIRMED;
    this.appointment.takeOffCoordinatorText = "takeoff coordinator";
    this.appointment.school = school;
    this.appointment.instructor = instructor;
  }

  setScheduling(scheduling: Date): this {
    this.appointment.scheduling = scheduling;
    return this;
  }

  setDeadline(deadline: Date): this {
    this.appointment.deadline = deadline;
    return this;
  }

  setMeetingPoint(meetingPoint: string): this {
    this.appointment.meetingPoint = meetingPoint;
    return this;
  }

  setMaxPeople(maxPeople: number): this {
    this.appointment.maxPeople = maxPeople;
    return this;
  }

  setDescription(description: string): this {
    this.appointment.description = description;
    return this;
  }

  setState(state: State): this {
    this.appointment.state = state;
    return this;
  }

  setAppointmentType(appointmentType: AppointmentType): this {
    this.appointment.type = appointmentType;
    return this;
  }

  build(): Appointment {
    return this.appointment;
  }
}