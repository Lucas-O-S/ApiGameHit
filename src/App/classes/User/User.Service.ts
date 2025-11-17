import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto/User.dto";
import { UserRepository } from "./User.Repository";
import { UserModel } from "src/App/Model/User.Model";
import { LoginDto } from "src/auth/dto/login.dto";


@Injectable()
export class UserService {

    constructor( private readonly repository : UserRepository ){}

    async create(dto : UserDto) : Promise<UserModel>{
        this.repository.verifyRepeatedEmail(dto);

        return await this.repository.create(dto);
        
    }

    async update(dto : UserDto, id : number) : Promise<boolean>{
        
        this.repository.verifyRepeatedEmail(dto, id);

        if (this.repository.exists(id)) throw new Error("Não existe este registro no banco");

        return await this.repository.update(dto, id);
        
    }

    async get(id : number, getImage = true) : Promise<UserModel>{
        
        
        const user = await this.repository.get(id, getImage);

        if (!user) throw new Error("Usuario não encontrado");

        return user

    }
    async getAll(getImage = false) : Promise<UserModel[]>{
        

        return await this.repository.getAll(getImage);
        
    }

    async delete(id : number) : Promise<Boolean>{
        
        if (this.repository.exists(id)) throw new Error("Não existe este registro no banco");
        
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