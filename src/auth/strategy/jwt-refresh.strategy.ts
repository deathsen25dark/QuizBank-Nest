import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {  
  // Strategy sẽ chạy khi có @UseGuards(JwtRefreshGuard) hoặc @UseGuards(AuthGuard('jwt-refresh'))
  constructor() {
    super({
      // Cấu hình: "Tôi sẽ tìm refresh token ở đâu?", giải mã token bằng chữ ký, nếu hợp lệ, tìm ra payload và ném cho validate
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies.refresh_token,
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET!,
      passReqToCallback: true
    });
  }

  // Hàm này CHỈ chạy khi Token đã hợp lệ về mặt chữ ký
  async validate(req: Request, payload: any) {    // payload là dữ liệu đã giải mã từ Token, req được pass từ constructor super
    return {
      id: payload.sub,
      role: payload.role,     
      refreshToken: req.cookies.refresh_token
    };                                             // Những gì return ở đây sẽ xuất hiện trong req.user, mặc định bởi Nest
  }
}