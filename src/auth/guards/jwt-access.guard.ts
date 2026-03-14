import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt') {}
// Chức năng: đặt JwtAuthGuard cho tiện gọi ở Controller, thay vì gọi AuthGuard ('jwt')