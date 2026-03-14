import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy) {  // Nest tự hiểu là PassportStrategy(Strategy, 'jwt')
  // Strategy sẽ chạy khi có @UseGuards(JwtAccessGuard) hoặc @UseGuards(AuthGuard('jwt'))
  constructor() {
    console.log('jwt access strategy khởi tạo')
    super({
      // Cấu hình: "Tôi sẽ tìm access token ở đâu?", giải mã token bằng chữ ký, nếu hợp lệ, tìm ra payload (có chứa thông tin user, do cấu hình trong logic ở usersService) và ném cho validate
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET!,
    });
  } // nếu không hợp lệ, trả 401

  // Hàm này CHỈ chạy khi Token đã hợp lệ về mặt chữ ký
  async validate(payload: any) {
    console.log('access strategy đang chạy', payload)
    // payload là dữ liệu đã giải mã từ Token
    // Những gì bạn return ở đây sẽ xuất hiện trong req.user, trường .user là mặc định do Nest đặt
    return {
      id: payload.sub,
      role: payload.role,     // chỉ lấy ra id và role, không lấy password
    };
  }
}