import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TeamMember } from 'src/team-member/team-member.entity';
import { TeamMemberService } from 'src/team-member/team-member.service';

@Injectable()
export class SchoolGuard implements CanActivate {

  constructor(private readonly teamMemberService: TeamMemberService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const schoolId = params.id;
    return new Promise<boolean>((resolve, reject) => {
      this.teamMemberService.getTeamMembersBySchoolId(schoolId).then((res: TeamMember[]) => {
        res.find((teamMember: TeamMember) => {
          if (teamMember.user.id === request.user.userId) {
            return resolve(true)
          } else {
            return resolve(false);
          }
        })
      }).catch((error) => {
        return reject(false);
      })
  });
  }
}
