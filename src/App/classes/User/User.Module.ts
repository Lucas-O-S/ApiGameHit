import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserController } from "./User.Controller";
import { UserService } from "./User.Service";
import { UserRepository } from "./User.Repository";
import { UserModel } from "../../Model/User.Model";
import { AuthModule } from "src/auth/auth.module";



@Module({
    imports: [
        SequelizeModule.forFeature([UserModel]),
        forwardRef(()=> AuthModule)
        
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService],
})
export class UserModule {}