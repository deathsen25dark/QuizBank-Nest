import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
// Chức năng: đặt JwtRefreshGuard cho tiện gọi ở Controller, thay vì gọi AuthGuard('jwt-refresh')