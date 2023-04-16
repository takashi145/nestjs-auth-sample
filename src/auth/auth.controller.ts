import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guards';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() request: { user: User },
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.createAccessToken(request.user);
    return accessToken;
  }
}
