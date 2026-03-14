import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { Request, Response } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { UserRole } from '../users/enum/user-role.enum';
import { SuccessMessage } from 'src/common/interceptors/success-message.decorator';

interface RequestContainUser extends Request {
  user: {
    id: number;
    role: UserRole;
    refreshToken?: string;
  }
}
// sau khi JwtAccessToken đã áp dụng, xuất hiện thuộc tính .user trong Request, tuy nhiên TS không biết điều này, phải tạo interface extends Request tương ứng 

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @SuccessMessage('Register successfully')
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @Post('login')
  @SuccessMessage('Login successfully')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(dto, res);
  }

  @Post('logout')
  @SuccessMessage('Logout successfully')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.logout(req, res);
  }

  @Post('refresh')
  @SuccessMessage('Refresh successfully')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Req() req: RequestContainUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refreshAccessToken(req.user, res);
  }
}