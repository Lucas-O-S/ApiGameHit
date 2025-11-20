import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "src/auth/auth.module";
import { GenreController } from "./Genre.Controller";
import { GenreService } from "./Genre.Service";
import { GenreModel } from "src/App/Model/Genre.Model";
import { GenreRepository } from "./Genre.Repository";
import { UserModule } from "../User/User.Module";



@Module({
    imports: [
        SequelizeModule.forFeature([GenreModel]),
        forwardRef(()=> AuthModule),
        forwardRef(()=> UserModule)
        
    ],
    controllers: [GenreController],
    providers: [GenreService, GenreRepository],
    exports: [GenreService],
})
export class GenreModule {}