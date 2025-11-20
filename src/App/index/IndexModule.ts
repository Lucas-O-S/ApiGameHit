import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "../classes/User/User.Module";
import { PreStartModule } from "src/config/PreStart.module";
import { GenreModule } from "../classes/Genre/Genre.Module";
import { GameStatusModule } from "../classes/GameStatus/GameStatus.Module";
import { GameModule } from "../classes/Games/Game.Module";



export const AllModules = [
    PreStartModule,
    AuthModule,
    UserModule,
    GenreModule,
    GameStatusModule,
    GameModule,
]