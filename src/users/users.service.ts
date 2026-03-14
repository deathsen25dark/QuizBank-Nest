import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { UserRole } from "src/users/enum/user-role.enum";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number){
    return await this.usersRepository.findOne({
      where: { id: id }
    })
  }

  async create(email: string, hashedPassword: string, role: UserRole): Promise<User> {
    const user = this.usersRepository.create({     // tạo instance của User trước rồi mới save vào database
      email: email,
      password: hashedPassword,
      role: role
    });
    
    return await this.usersRepository.save(user);
  }

  async updateRefreshToken(id: number, hashedRefreshToken: string) {
    const user = await this.usersRepository.preload({
      id: id,
      refreshToken: hashedRefreshToken
    })
    
    if (!user) {
      throw new NotFoundException("User not found for updating refresh token");
    }

    return await this.usersRepository.save(user);
  }

  async clearHashedRefreshToken(hashedRefreshToken: string){
    const user = await this.usersRepository.findOne({
      where: { refreshToken: hashedRefreshToken}
    })
    if (user){
      user.refreshToken = null;
      await this.usersRepository.save(user);
    }
  }
}