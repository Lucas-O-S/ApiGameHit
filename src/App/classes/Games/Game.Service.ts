import { GameRepository } from "./Game.Repository";
import { Injectable } from "@nestjs/common";
import { GameDto } from "./dto/GameDto";
import { GameModel } from "src/App/Model/Game.Model";
import { GenreService } from "../Genre/Genre.Service";

@Injectable()
export class GameService {

    constructor(
        private readonly repository : GameRepository,
        private readonly genreService : GenreService
    ){}

    async insert(dto : GameDto) : Promise<GameModel>{
        
        await this.verifyGenre(dto.genreId);

        return await this.repository.insert(dto);
    }

    async update(dto : GameDto, id : number) : Promise<boolean>{

        await this.verifyExist(id);
        
        await this.verifyGenre(dto.genreId);


        return await this.repository.update(dto, id);

    }

    async get(id : number, getImage : boolean = true) : Promise<GameModel>{
        const result = await this.repository.get(id, getImage);
        
        if(!result)
            throw new Error("Jogo não existe ou encontrado");
        
        return result;
    }

    
    async getAll( getImage : boolean = false) : Promise<GameModel[]>{
        return await this.repository.getAll(getImage);
    }
    
    async delete(id : number) : Promise<boolean>{
        
        await this.verifyExist(id);

        return await this.repository.delete(id);
    }

    async findByName(name : string, getImage : boolean = true) : Promise<GameModel[]>{
        return await this.repository.findByName(name,getImage)
    }

    async findByGenre(genreId : number, getImage : boolean = true) : Promise<GameModel[]>{
        return await this.repository.findByGenre(genreId,getImage)
    }


    private async verifyGenre(genreId : number){
        if(!(await this.genreService.get(genreId)))
            throw new Error("Genero de jogo não existe ou não foi encontrado")
    }

    async verifyExist(id : number){
        if(!await this.repository.exists(id))
            throw new Error("Jogo não existe ou encontrado");
    }

} 