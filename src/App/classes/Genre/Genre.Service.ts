import { GenreModel } from "src/App/Model/Genre.Model";
import { GenreDto } from "./dto/Genre.dto";
import { GenreRepository } from "./Genre.Repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GenreService {

    constructor(
        private readonly repository : GenreRepository
    ){}

    async insert(dto : GenreDto) : Promise<GenreModel>{

        return await this.repository.insert(dto);
    }

    async update(dto : GenreDto, id : number) : Promise<boolean>{
        if(!await this.repository.exists(id))
            throw new Error("Genero de jogo não existe ou encontrado");
        
        return await this.repository.update(dto, id);

    }

    async get(id : number) : Promise<GenreModel>{
        const result = await this.repository.get(id);
        
        if(!result)
            throw new Error("Genero de jogo não existe ou encontrado");
        
        return result;
    }

    
    async getAll() : Promise<GenreModel[]>{
        return await this.repository.getAll();
    }
    
    async delete(id : number) : Promise<boolean>{
        if(!await this.repository.exists(id))
            throw new Error("Genero de jogo não existe ou encontrado");

        return await this.repository.delete(id);
    }

    async verifyExist(id : number){
        if(!await this.repository.exists(id))
            throw new Error("Genero de Jogo não existe ou encontrado");
    }

} 