import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/enum/user-role.enum';

export const ROLES_KEY = 'rolesKey';

export const Roles = (...roles: UserRole[]) => {
  return SetMetadata(ROLES_KEY, roles);
}
// decorator phải trả về một function, nếu không có lệnh return, decorator này sẽ trả ra void và không dùng được ở controller
  