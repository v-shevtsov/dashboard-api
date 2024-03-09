import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AUTH_RESPONSE_MAP } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const existedUser = await this.authService.findUser(dto.email);
    if (existedUser) {
      throw new BadRequestException(AUTH_RESPONSE_MAP.USER_ALREADY_EXISTS);
    }

    return this.authService.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user.email);
  }
}
