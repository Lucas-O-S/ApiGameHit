import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "src/auth/auth.module";
import { RegisterService } from "./Register.Service";
import { UserModule } from "../User/User.Module";
import { GenreModule } from "../Genre/Genre.Module";
import { RegisterController } from "./Register.Controller";
import { RegisterRepository } from "./Register.Repository";
import { GameModule } from "../Games/Game.Module";
import { RegisterModel } from "src/App/Model/Register.Model";
import { GameStatusModule } from "../GameStatus/GameStatus.Module";
import { RegisterUserPermissionGuard } from "src/App/guards/RegisterUserPermission.Guard";



@Module({
    imports: [
        SequelizeModule.forFeature([RegisterModel]),
        forwardRef(()=> AuthModule),
        forwardRef(()=> UserModule),
        forwardRef(()=> GenreModule),
        forwardRef(()=> GameModule),
        forwardRef(()=> GameStatusModule),
        
    ],
    controllers: [RegisterController],
    providers: [RegisterService, RegisterRepository, RegisterUserPermissionGuard],
    exports: [RegisterService],
})
export class RegisterModule {}