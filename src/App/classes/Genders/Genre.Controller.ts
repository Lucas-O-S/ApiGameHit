import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


@Controller("Genre")
@ApiTags("Genre")
export class GenreController{


    @Post()
    async insert(){
        
    }
    

}