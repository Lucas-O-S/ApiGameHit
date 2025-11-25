import { InjectModel } from "@nestjs/sequelize";
import { Exclude } from "class-transformer";
import { GenreModel } from "src/App/Model/Genre.Model";
import { Op, where } from "sequelize";
import { RegisterModel } from "src/App/Model/Register.Model";
import { RegisterDto } from "./dto/RegisterDto";
import { GameModel } from "src/App/Model/Game.Model";
import { GameStatusModel } from "src/App/Model/GameStatus.Model";
import { UserModel } from "src/App/Model/User.Model";


export class RegisterRepository {

    constructor(
        @InjectModel(RegisterModel) private readonly model  : typeof RegisterModel
    ){}

    async insert(dto : RegisterDto) : Promise<RegisterModel>{
        const result = await this.model.create(dto);
        return result
    } 

    async update(dto : RegisterDto, id : number) : Promise<boolean>{
        const [affectedRows] = await this.model.update(dto, {where: {id : id}});
        return affectedRows > 0;
    }

    async get(id : number, getImage : boolean = true) : Promise<RegisterModel>{
        return await this.model.findByPk(id,
            {
                attributes: this.getImageAttribute(getImage),
                include : [{
                        model : GameModel,
                        attributes : this.getImageAttribute(getImage),
                        include : [{
                            model : GenreModel
                        }],
                    },
                    {
                        model : GameStatusModel
                    }
                ]
            }
        )
    }

    async getAll(getImage : boolean = false) : Promise<RegisterModel[]>{
        return await this.model.findAll(
            {
                attributes: this.getImageAttribute(getImage),
                include : [{
                    model : GameModel,
                    attributes : this.getImageAttribute(getImage),
                    include : [{
                        model : GenreModel
                    }],
                },
                {
                    model : GameStatusModel
                }]
            }
        )
    }

    async delete(id : number) : Promise<boolean>{
        return (await this.model.destroy({where: {id : id}})) > 0;
    }

    async exists(id : number) : Promise<Boolean>{
        return (await this.model.findByPk(id)) != null;

    }


    async findByGameName(userId : number, gameName : string, getImage : boolean = true) : Promise<RegisterModel[]>{

        return await this.model.findAll({
            attributes: this.getImageAttribute(getImage),
            include : [{
                model : GameModel,
                attributes : this.getImageAttribute(getImage),
                include : [{
                    model : GenreModel
                }],
                where : {
                    name : { [Op.like] : `%${gameName}%`}
                }
            },
            {
                model : GameStatusModel
            }],
            where : {userId}

        })

    }

    async findByGenre(userId : number, genreId : number, getImage : boolean = true) : Promise<RegisterModel[]>{

        return await this.model.findAll({
            attributes: this.getImageAttribute(getImage),
            include : [{
                model : GameModel,
                attributes : this.getImageAttribute(getImage),
                include : [{
                    model : GenreModel
                }],
                where : {
                    genreId : genreId
                }
            },
            {
                model : GameStatusModel
            }],
            where : {userId}

        })

    }

    async findByStatus(userId : number,statusId : number, getImage : boolean = true) : Promise<RegisterModel[]>{

        return await this.model.findAll({
            attributes: this.getImageAttribute(getImage),
            include : [{
                model : GameModel,
                attributes : this.getImageAttribute(getImage),
                include : [{
                    model : GenreModel
                }],
            },
            {
                model : GameStatusModel,
                where : {
                    id : statusId
                }
            }],
            where : {userId}

        })

    }

    async findByUser(userId : number, getImage : boolean = true) : Promise<RegisterModel[]>{
        return await this.model.findAll({
            attributes: this.getImageAttribute(getImage),
            include : [{
                model : GameModel,
                attributes : this.getImageAttribute(getImage),
                include : [{
                    model : GenreModel
                }],
            },
            {
                model : GameStatusModel,
            }],
            where : {userId}
            
        })

    }

    private getImageAttribute(getImage: boolean) {
        return getImage
            ? undefined              
            : { exclude: ["cover"] }
    }


}