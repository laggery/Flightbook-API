import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TeamMember } from '../../training/team-member/team-member.entity';
import { TeamMemberRepository } from '../../training/team-member/team-member.repository';

@Injectable()
export class SchoolGuard implements CanActivate {

  constructor(private readonly teamMemberRepository: TeamMemberRepository) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const schoolId = params.id;
    return new Promise<boolean>((resolve, reject) => {
      this.teamMemberRepository.getTeamMembersBySchoolId(schoolId).then((res: TeamMember[]) => {
        const foundMember = res.find((teamMember: TeamMember) => teamMember.user.id === request.user.userId);
        if (foundMember){
          return resolve(true);
        }
        return resolve(false);
      }).catch((error) => {
        return reject(false);
      })
  });
  }
}
