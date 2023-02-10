import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Subscription } from '../subscription/subscription.entity';
import { Appointment } from './appointment.entity';
import { State } from './state';

@Injectable()
export class AppointmentRepository {

    constructor(
        @InjectRepository(Appointment)
        private readonly appointmentRepository: Repository<Appointment>
    ) { }

    async saveAppointment(appointment: Appointment): Promise<Appointment | undefined> {
        return await this.appointmentRepository.save(appointment);
    }

    async getAppointmentById(id: number): Promise<Appointment> {
        let appointment = await this.appointmentRepository.findOneOrFail({
            relations: {
                subscriptions:{
                    user: true
                },
                instructor: true,
                school: true,
                type: true
            },
            where: {
                id: id
            }
        });
        appointment.subscriptions = this.orderSubscriptionByTimestampAsc(appointment.subscriptions);
        return appointment;
    }

    async getAppointmentsBySchoolId(schoolId: number, query: any): Promise<[Appointment[], number]> {
        const options: any = {
            relations: {
                subscriptions:{
                    user: true
                },
                instructor: true,
                takeOffCoordinator: true,
                type: true
            },
            where: {
                school: {
                    id: schoolId
                }
            },
            order: {
                scheduling: 'DESC'
            }
        };

        if (query && query.limit) {
            if (Number.isNaN(Number(query.limit))) {
                throw new BadRequestException("limit is not a number");
            }
            options.take = query.limit;
        }

        if (query && query.offset) {
            if (Number.isNaN(Number(query.offset))) {
                throw new BadRequestException("offset is not a number");
            }
            options.skip = query.offset;
        }

        if (query && query.from && query.to) {
            options.where.scheduling = Between(`${query.from}`, `${query.to} 23:59:00.000000`);
        } else if (query && query.from) {
            options.where.scheduling = MoreThanOrEqual(query.from);
        } else if (query && query.to) {
            options.where.scheduling = LessThanOrEqual(query.to);
        }

        const state = State[query?.state];
        if (query && query.state && state) {
            options.where.state = state;
        }

        let entityNumber: [Appointment[], number] = await this.appointmentRepository.findAndCount(options);
        entityNumber[0].forEach((appointment: Appointment) => {
            appointment.subscriptions = this.orderSubscriptionByTimestampAsc(appointment.subscriptions);
        })

        return entityNumber;
    }

    // @TODO Can be removed after migrate to typeorm 0.3.x and added order by for sub objects
    private orderSubscriptionByTimestampAsc(subscriptions: Subscription[]): Subscription[] {
        return subscriptions.sort((a: Subscription, b: Subscription) => a.timestamp.getTime() - b.timestamp.getTime());
    }
}
