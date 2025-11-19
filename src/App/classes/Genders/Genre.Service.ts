import { GenreModel } from "src/App/Model/Genre.Model";
import { GenreDto } from "./dto/Gender.dto";
import { GenreRepository } from "./Genre.Repository";


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
        return await this.repository.get(id);
    }

    
    async getAll() : Promise<GenreModel[]>{
        return await this.repository.getAll();
    }
    
    async delete(id : number) : Promise<boolean>{
        if(!await this.repository.exists(id))
            throw new Error("Genero de jogo não existe ou encontrado");

        return await this.repository.delete(id);
    }

}