import { GameStatusModel } from "src/App/Model/GameStatus.Model";
import { Injectable } from "@nestjs/common";
import { RoleRepository } from "./Role.Repository";
import { RoleDto } from "./dto/Role.dto";
import { RoleModel } from "src/App/Model/Role.Model";

@Injectable()
export class RoleService {

    constructor(
        private readonly repository : RoleRepository
    ){}

    async insert(dto : RoleDto) : Promise<RoleModel>{

        return await this.repository.insert(dto);
    }

    async update(dto : RoleDto, id : number) : Promise<boolean>{
        await this.verifyExist(id);
        
        return await this.repository.update(dto, id);

    }

    async get(id : number) : Promise<RoleModel>{
        const result = await this.repository.get(id);
        
        if(!result)
            throw new Error("Cargo não existe ou encontrado");
        
        return result;
    }

    
    async getAll() : Promise<RoleModel[]>{
        return await this.repository.getAll();
    }
    
    async delete(id : number) : Promise<boolean>{
        await this.verifyExist(id);


        return await this.repository.delete(id);
    }

    async verifyExist(id : number) {
        if(!await this.repository.exists(id))
            throw new Error("Cargo não existe ou encontrado");
    }


} 