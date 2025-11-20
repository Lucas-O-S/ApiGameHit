import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "src/auth/auth.module";
import { GameController } from "./Game.Controller";
import { GameService } from "./Game.Service";
import { GameRepository } from "./Game.Repository";
import { UserModule } from "../User/User.Module";
import { GameStatusModel } from "src/App/Model/GameStatus.Model";
import { GenreModule } from "../Genre/Genre.Module";
import { GameModel } from "src/App/Model/Game.Model";



@Module({
    imports: [
        SequelizeModule.forFeature([GameModel]),
        forwardRef(()=> AuthModule),
        forwardRef(()=> UserModule),
        forwardRef(()=> GenreModule),
        
        
    ],
    controllers: [GameController],
    providers: [GameService, GameRepository],
    exports: [GameService],
})
export class GameModule {}