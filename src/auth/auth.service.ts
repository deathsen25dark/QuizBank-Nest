import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from "@nestjs/common";
import { UserRole } from "src/users/enum/user-role.enum";
import type { Request, Response } from "express";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

interface UserFromRequest {   // do user lấy ra từ token (nhiệm vụ của JwtAccessStrategy và JwtRefreshStrategy)
  id: number;
  role: UserRole;
  refreshToken?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const userByEmail = await this.usersService.findByEmail(dto.email)
    if (userByEmail) {
      throw new ConflictException("Email has been used")
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.usersService.create(dto.email.trim().toLowerCase(), hashedPassword, dto.role);

    return { email: newUser.email, role: newUser.role };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException("Email or password is incorrect");
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new UnauthorizedException("Email or password is incorrect");
    }

    const userFromTokensFake: UserFromRequest = { // tạo một user có dạng như user lấy ra từ request (đều chỉ có id và role)
      id: user.id,
      role: user.role
    }

    await this.createRefreshToken(userFromTokensFake, res);

    return null;
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;

    if (refreshToken) {                   // có tồn tại refreshToken = có thể tìm và đặt nó thành null trong db
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.usersService.clearHashedRefreshToken(hashedRefreshToken);
    }
    res.clearCookie('refresh_token');
    return null;
  }

  async refreshAccessToken(userFromRequest: UserFromRequest, res: Response) {
    const userFromDatabase = await this.usersService.findById(userFromRequest.id);   // userFromTokens (chỉ có id và role) lúc này lấy ra bởi JwtRefreshGuard 

    if (!userFromDatabase || !userFromDatabase.refreshToken || !userFromRequest.refreshToken) {
      // nếu không có user trong database hoặc user trong database không có refreshToken hoặc không có refresh token từ request 
      res.clearCookie('refresh_token');   // xóa refreshToken từ request

      return "refresh denied";
    } else {
      // nếu thỏa mãn, so sánh refreshToken đã hash từ request và refreshToken từ database
      const isMatch = await bcrypt.compare(
        userFromRequest.refreshToken,
        userFromDatabase.refreshToken
      )

      if (!isMatch) {
        res.clearCookie('refresh_token');
        return "refresh denied";
      } else {
        await this.createRefreshToken(userFromRequest, res);

        return {
          id: userFromDatabase.id,
          email: userFromDatabase.email,
          role: userFromDatabase.role,
          accessToken: this.createAccessToken(userFromRequest)
        }
      }
    }
  }

  private createAccessToken(user: UserFromRequest) {
    const payload = {
      sub: user.id,
      role: user.role
    }

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    return accessToken;
  }

  private async createRefreshToken(user: UserFromRequest, res: Response) {
    const payload = {
      sub: user.id,
      role: user.role
    }

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);
  }
}

