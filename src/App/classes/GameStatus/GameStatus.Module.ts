import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "src/auth/auth.module";
import { GameStatusController } from "./GameStatus.Controller";
import { GameStatusService } from "./GameStatus.Service";
import { GenreModel } from "src/App/Model/Genre.Model";
import { GameStatusRepository } from "./GameStatus.Repository";
import { UserModule } from "../User/User.Module";
import { GameStatusModel } from "src/App/Model/GameStatus.Model";



@Module({
    imports: [
        SequelizeModule.forFeature([GameStatusModel]),
        forwardRef(()=> AuthModule),
        forwardRef(()=> UserModule)
        
        
    ],
    controllers: [GameStatusController],
    providers: [GameStatusService, GameStatusRepository],
    exports: [GameStatusService],
})
export class GameStatusModule {}