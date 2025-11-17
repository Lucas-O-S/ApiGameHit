import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto/User.dto";
import { UserRepository } from "./User.Repository";
import { UserModel } from "src/App/Model/User.Model";
import { LoginDto } from "src/auth/dto/login.dto";


@Injectable()
export class UserService {

    constructor( private readonly repository : UserRepository ){}

    async create(model : UserDto) : Promise<UserModel>{


        return await this.repository.create(model);
        
    }

    async update(model : UserDto, id : number) : Promise<boolean>{
        

        return await this.repository.update(model, id);
        
    }

    async get(id : number) : Promise<UserModel>{
        
        
        const user = await this.repository.get(id);

        if (!user) throw new Error("User não encontrado");

        return user

    }
    async getAll() : Promise<UserModel[]>{
        

        return await this.repository.getAll();
        
    }

    async delete(id : number) : Promise<Boolean>{
        
        if (!(await this.repository.get(id))) throw new Error("Não existe este registro no banco");
        
        return await this.repository.delete(id);
    }

    async verifyLogin(dto : LoginDto) : Promise<UserModel>{
        
        const user = await this.repository.verifyLogin(dto);
        
        if (!user) throw new Error("Erro, User não encontrado");
        
        return user;
    }

    async verifyAdm (id : number) : Promise<boolean>{
        return await this.repository.verifyAdm(id)
    }

    async verifyFirstAdmExistence () {
        await this.repository.verifyFirstAdmExistence();
    }



}