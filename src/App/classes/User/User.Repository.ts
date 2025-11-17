import { Injectable } from "@nestjs/common";
import { UserModel } from "../../Model/User.Model";
import { InjectModel } from "@nestjs/sequelize";
import { UserDto } from "./dto/User.dto";
import { where } from "sequelize";
import { LoginDto } from "src/auth/dto/login.dto";


@Injectable()
export class UserRepository {
    
    constructor( @InjectModel(UserModel) private readonly model  : typeof UserModel ){}

    async create(dto : UserDto) : Promise<UserModel>{
        const user = await this.model.create(dto);
        user.setDataValue("password", undefined);
        return user;
    }

    async update(dto : UserDto, id : number) : Promise<boolean>{
        
        const [affectedRows] = await this.model.update(dto, {where: {id: id} });
        return affectedRows > 0;
    }
    
    async get(id : number) : Promise<UserModel>{
        return this.model.findByPk(id, {attributes : {exclude: ['password']}});
    }

    async getAll() : Promise<UserModel[]>{
        return this.model.findAll({attributes : {exclude: ['password']}} );
    }

    
    async delete(id : number) : Promise<boolean>{
            
        return (await this.model.destroy({where: {id : id}})) > 0;
    
    }

    async verifyLogin(dto : LoginDto) : Promise<UserModel>{
        return await this.model.findOne({
            where : {
                email : dto.email,
            }
        })
    }

    async verifyAdm (id : number) : Promise<boolean>{
        return ((await this.model.findByPk(id)).roleId) == 1 
    }

    async verifyFirstAdmExistence () {
        
        const admin = await this.model.findOne({ where: { email : "adm@email.com" }});

        if (!admin) {
           
            await this.model.create({
                username: "ADM",
                email : "adm@email.com" ,
                password: "123456",
                roleId: 1,
            });
        
        }
    }

}