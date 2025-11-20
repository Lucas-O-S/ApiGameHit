import { InjectModel } from "@nestjs/sequelize";
import { GameDto } from "./dto/GameDto";
import { GameModel } from "src/App/Model/Game.Model";
import { Exclude } from "class-transformer";
import { GenreModel } from "src/App/Model/Genre.Model";
import { Op } from "sequelize";


export class GameRepository {

    constructor(
        @InjectModel(GameModel) private readonly model  : typeof GameModel
    ){}

    async insert(dto : GameDto) : Promise<GameModel>{
        const result = await this.model.create(dto);
        result.cover = undefined
        return result
    } 

    async update(dto : GameDto, id : number) : Promise<boolean>{
        const [affectedRows] = await this.model.update(dto, {where: {id : id}});

        return affectedRows > 0;
    }

    async get(id : number, getImage : boolean = true) : Promise<GameModel>{
        return await this.model.findByPk(id,
            {
                attributes: this.getImageAttribute(getImage),
                include : [{model : GenreModel}]
            }
        )
    }

    async getAll(getImage : boolean = false) : Promise<GameModel[]>{
        return await this.model.findAll(
            {
                attributes: this.getImageAttribute(getImage),
                include : [{model : GenreModel}]
            }
        )
    }

    async delete(id : number) : Promise<boolean>{
        return (await this.model.destroy({where: {id : id}})) > 0;
    }

    async exists(id : number) : Promise<Boolean>{
        return (await this.model.findByPk(id)) != null;

    }


    async findByName(name : string, getImage : boolean = true) : Promise<GameModel[]>{

        return await this.model.findAll({
            attributes: this.getImageAttribute(getImage),
            where : {
                name : {[Op.like] : `%${name}%`}
            },
            include : [{model : GenreModel}]
        })

    }

    
    async findByGenre(genreId : number, getImage : boolean = true) : Promise<GameModel[]>{

        return await this.model.findAll({
            attributes: this.getImageAttribute(getImage),
            include : [{
                model : GenreModel,
                where : {
                    id : genreId
                }
            }]
        })

    }

    private getImageAttribute(getImage: boolean) {
        return getImage
            ? undefined              
            : { exclude: ["cover"] }
    }


}