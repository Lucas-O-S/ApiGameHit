import { GameStatusModel } from "src/App/Model/GameStatus.Model";
import { GameStatusDto } from "./dto/GameStatus.dto";
import { GameStatusRepository } from "./GameStatus.Repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GameStatusService {

    constructor(
        private readonly repository : GameStatusRepository
    ){}

    async insert(dto : GameStatusDto) : Promise<GameStatusModel>{

        return await this.repository.insert(dto);
    }

    async update(dto : GameStatusDto, id : number) : Promise<boolean>{
        if(!await this.repository.exists(id))
            throw new Error("Genero de jogo não existe ou encontrado");
        
        return await this.repository.update(dto, id);

    }

    async get(id : number) : Promise<GameStatusModel>{
        const result = await this.repository.get(id);
        
        if(!result)
            throw new Error("Genero de jogo não existe ou encontrado");
        
        return result;
    }

    
    async getAll() : Promise<GameStatusModel[]>{
        return await this.repository.getAll();
    }
    
    async delete(id : number) : Promise<boolean>{
        if(!await this.repository.exists(id))
            throw new Error("Genero de jogo não existe ou encontrado");

        return await this.repository.delete(id);
    }

} 