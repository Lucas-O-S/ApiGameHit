import { Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/RegisterDto";
import { RegisterRepository } from "./Register.Repository";
import { UserService } from "../User/User.Service";
import { GameStatusService } from "../GameStatus/GameStatus.Service";
import { RegisterModel } from "src/App/Model/Register.Model";
import { GameService } from "../Games/Game.Service";
import { GenreService } from "../Genre/Genre.Service";

@Injectable()
export class RegisterService {

    constructor(
        private readonly repository : RegisterRepository,
        private readonly userService : UserService,
        private readonly gameStatusService : GameStatusService,
        private readonly gameService : GameService,
        private readonly genreService : GenreService,

    ){}

    async insert(dto : RegisterDto) : Promise<RegisterModel>{
        
        await this.userService.verifyExist(dto.userId)
        await this.gameStatusService.verifyExist(dto.gameStatusId)
        await this.gameService.verifyExist(dto.gameId)

        return await this.repository.insert(dto);
    }

    async update(dto : RegisterDto, id : number) : Promise<boolean>{

        await this.verifyExist(id);

        await this.userService.verifyExist(dto.userId)
        await this.gameStatusService.verifyExist(dto.gameStatusId)
        await this.gameService.verifyExist(dto.gameId)        


        return await this.repository.update(dto, id);

    }

    async get(id : number, getImage : boolean = true) : Promise<RegisterModel>{
        const result = await this.repository.get(id, getImage);
        
        if(!result)
            throw new Error("Jogo não existe ou encontrado");
        
        return result;
    }

    
    async getAll( getImage : boolean = false) : Promise<RegisterModel[]>{
        return await this.repository.getAll(getImage);
    }
    
    async delete(id : number) : Promise<boolean>{
        
        await this.verifyExist(id);

        return await this.repository.delete(id);
    }

    async findByGameName(userId: number, gameName: string, getImage: boolean = true): Promise<RegisterModel[]> {
        
        await this.userService.verifyExist(userId)


        return await this.repository.findByGameName(userId, gameName, getImage);
    }

    async findByGenre(userId: number, genreId: number, getImage: boolean = true): Promise<RegisterModel[]> {
       
        await this.userService.verifyExist(userId);
        await this.genreService.verifyExist(genreId);

        return await this.repository.findByGenre(userId, genreId, getImage);
    }

    async findByStatus(userId: number, statusId: number, getImage: boolean = true): Promise<RegisterModel[]> {
        
        await this.userService.verifyExist(userId);
        await this.gameStatusService.verifyExist(statusId);
        

        return await this.repository.findByStatus(userId, statusId, getImage);
    }

    async findByUser(userId: number, getImage: boolean = true): Promise<RegisterModel[]> {
        
        await this.userService.verifyExist(userId);

        return await this.repository.findByUser(userId, getImage);
    
    }

    async verifyExist(id : number){
        if(!await this.repository.exists(id))
            throw new Error("Registro não existe ou encontrado");
    }

} 