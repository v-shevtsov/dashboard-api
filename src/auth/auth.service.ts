import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash, compare } from 'bcryptjs';
import { User } from './user.schema';
import { REVIEW_RESPONSE_MAP } from '../review/review.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto): Promise<User> {
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      email: dto.email,
      passwordHash: await hash(dto.password, salt),
    });
    return newUser.save();
  }

  async findUser(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);
    if (!user) {
      throw new ServiceUnavailableException(REVIEW_RESPONSE_MAP.USER_NOT_FOUND);
    }

    const isCorrectPassword = await compare(password, user.passwordHash);

    if (!isCorrectPassword) {
      throw new ServiceUnavailableException(
        REVIEW_RESPONSE_MAP.INCORRECT_PASSWORD,
      );
    }

    return { email: user.email };
  }

  async login(email: string) {
    return {
      access_token: await this.jwtService.signAsync({ email }),
    };
  }
}
