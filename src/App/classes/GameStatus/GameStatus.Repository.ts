import { GenreModel } from "src/App/Model/Genre.Model";
import { GameStatusDto } from "./dto/GameStatus.dto";
import { InjectModel } from "@nestjs/sequelize";
import { GameStatusModel } from "src/App/Model/GameStatus.Model";


export class GameStatusRepository {

    constructor(
        @InjectModel(GameStatusModel) private readonly model  : typeof GameStatusModel
    ){}

    async insert(dto : GameStatusDto) : Promise<GameStatusModel>{
        return await this.model.create(dto);
    }

    async update(dto : GameStatusDto, id : number) : Promise<boolean>{
        const [affectedRows] = await this.model.update(dto, {where: {id : id}});

        return affectedRows > 0;
    }

    async get(id : number) : Promise<GameStatusModel>{
        return await this.model.findByPk(id);

    }

    async getAll() : Promise<GameStatusModel[]>{
        return await this.model.findAll();
    }

    async delete(id : number) : Promise<boolean>{
        return (await this.model.destroy({where: {id : id}})) > 0;
    }

    async exists(id : number) : Promise<Boolean>{
        return (await this.model.findByPk(id)) != null;

    }
}