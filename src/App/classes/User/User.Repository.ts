import { Injectable } from "@nestjs/common";
import { UserModel } from "../../Model/User.Model";
import { InjectModel } from "@nestjs/sequelize";
import { UserDto } from "./dto/User.dto";
import { Op, where } from "sequelize";
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
    
    async get(id : number, getImage = true) : Promise<UserModel>{
        return (getImage) ? 
            await this.model.findByPk(id, {attributes : {exclude: ['password']}}) :
            await this.model.findByPk(id, {attributes : {exclude: ['password', "userImage"]}});


    }

    async getAll(getImage = false) : Promise<UserModel[]>{
        return (getImage) ? 
         this.model.findAll({attributes : {exclude: ['password']}} ) :
        await this.model.findAll({attributes : {exclude: ['password', "userImage"]}});


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


    async verifyRepeatedEmail(dto : UserDto, id = null) : Promise<boolean>{

        if (id){
            if(await this.model.findOne({where : {
                email :dto.email,
                id: { [Op.not]: id }
            }}))
            return true;
        }
        else{
            if(await this.model.findOne({where : {
                email :dto.email
            }}))
            return true;
        }
                
        return false;
    }

    async exists (id) : Promise<boolean>{
        return (await this.model.findByPk(id)) != null;
    }

    async changeRole(id: number, roleId : number) : Promise<boolean> {
        const [affectedRows] = await this.model.update(
            {roleId : roleId},
            {where : {id : id}}
        )
        return affectedRows > 0;

    }

}