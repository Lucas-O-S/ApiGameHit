import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from 'src/App/Model/User.Model';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/App/classes/User/User.Service';

@Injectable()
export class PreStartService {
  constructor(
    private readonly UserService : UserService,
  ) {}

  async createAdm() {
    await this.UserService.verifyFirstAdmExistence()
  }
}
