import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserRole } from "src/users/enum/user-role.enum";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole, // ['TEACHER', 'STUDENT']
    default: 'STUDENT',
  })
  role!: UserRole; // 'TEACHER' | 'STUDENT'

  @Column({
    name: 'refresh_token',
    type: 'text', 
    nullable: true,
  })
  refreshToken!: string | null;
}