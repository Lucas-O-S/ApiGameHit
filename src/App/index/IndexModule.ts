import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "../classes/User/User.Module";
import { PreStartModule } from "src/config/PreStart.module";
import { GenreModule } from "../classes/Genders/Genre.Module";



export const AllModules = [
    PreStartModule,
    AuthModule,
    UserModule,
    GenreModule
]