import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "src/auth/auth.module";
import { RoleController } from "./Role.Controller";
import { RoleService } from "./Role.Service";
import { GenreModel } from "src/App/Model/Genre.Model";
import { RoleRepository } from "./Role.Repository";
import { UserModule } from "../User/User.Module";
import { RoleModel } from "src/App/Model/Role.Model";



@Module({
    imports: [
        SequelizeModule.forFeature([RoleModel]),
        forwardRef(()=> AuthModule),
        forwardRef(()=> UserModule)
        
        
    ],
    controllers: [RoleController],
    providers: [RoleService, RoleRepository],
    exports: [RoleService],
})
export class RoleModule {}