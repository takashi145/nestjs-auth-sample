import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import * as bcypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './types/jwtPayload.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUser(email);

    if (user && (await bcypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User): Promise<{ accessToken: string }> {
    const payload: JwtPayload = { email: user.email, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async createAccessToken(user: User): Promise<{ accessToken: string }> {
    const payload: JwtPayload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '300s',
    });

    return {
      accessToken: accessToken,
    };
  }
}
