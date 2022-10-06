import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Student } from 'src/training/student/student.entity';
import { StudentService } from 'src/training/student/student.service';
import { TeamMember } from 'src/training/team-member/team-member.entity';
import { TeamMemberService } from 'src/training/team-member/team-member.service';

@Injectable()
export class StudentGuard implements CanActivate {

  constructor(
    private readonly teamMemberService: TeamMemberService,
    private readonly studentService: StudentService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const studentId = params.id;

    const promiseList = [];
    return new Promise<boolean>((resolve, reject) => {
      this.teamMemberService.getTeamMembersByUserId(request.user.userId).then((res: TeamMember[]) => {
        res.forEach((teamMember: TeamMember) => {
          promiseList.push(this.studentService.getStudentsBySchoolId(teamMember.school.id));
        });


        Promise.all(promiseList).then((studentsBySchool: any) => {
          let findPermission = false;
          studentsBySchool.forEach(element => {
            element.forEach((student: Student) => {
              if (student.user.id == studentId) {
                findPermission = true;
              }
            })
          });

          return resolve(findPermission);
        })
      }).catch((error) => {
        return reject(false);
      })
  });
}
}
