import { GenreModel } from "src/App/Model/Genre.Model";
import { GenreDto } from "./dto/Genre.dto";
import { InjectModel } from "@nestjs/sequelize";


export class GenreRepository {

    constructor(
        @InjectModel(GenreModel) private readonly model  : typeof GenreModel
    ){}

    async insert(dto : GenreDto) : Promise<GenreModel>{
        return await this.model.create(dto);
    }

    async update(dto : GenreDto, id : number) : Promise<boolean>{
        const [affectedRows] = await this.model.update(dto, {where: {id : id}});

        return affectedRows > 0;
    }

    async get(id : number) : Promise<GenreModel>{
        return await this.model.findByPk(id);

    }

    async getAll() : Promise<GenreModel[]>{
        return await this.model.findAll();
    }

    async delete(id : number) : Promise<boolean>{
        return (await this.model.destroy({where: {id : id}})) > 0;
    }

    async exists(id : number) : Promise<Boolean>{
        return (await this.model.findByPk(id)) != null;

    }
}