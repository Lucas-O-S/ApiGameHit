import { forwardRef, Module, OnApplicationBootstrap } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PreStartService } from './PreStart.service';
import { UserModel } from 'src/App/Model/User.Model';
import { UserModule } from 'src/App/classes/User/User.Module';

@Module({
  imports: [
    forwardRef(()=> UserModule)
  ],
  providers: [PreStartService],
})
export class PreStartModule implements OnApplicationBootstrap {
  constructor(private seedService: PreStartService) {}

  async onApplicationBootstrap() {
    await this.seedService.createAdm();
  }
}
