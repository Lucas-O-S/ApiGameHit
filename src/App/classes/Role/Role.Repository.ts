import { GenreModel } from "src/App/Model/Genre.Model";
import { InjectModel } from "@nestjs/sequelize";
import { RoleModel } from "src/App/Model/Role.Model";
import { RoleDto } from "./dto/Role.dto";


export class RoleRepository {

    constructor(
        @InjectModel(RoleModel) private readonly model  : typeof RoleModel
    ){}

    async insert(dto : RoleDto) : Promise<RoleModel>{
        return await this.model.create(dto);
    }

    async update(dto : RoleDto, id : number) : Promise<boolean>{
        const [affectedRows] = await this.model.update(dto, {where: {id : id}});

        return affectedRows > 0;
    }

    async get(id : number) : Promise<RoleModel>{
        return await this.model.findByPk(id);

    }

    async getAll() : Promise<RoleModel[]>{
        return await this.model.findAll();
    }

    async delete(id : number) : Promise<boolean>{
        return (await this.model.destroy({where: {id : id}})) > 0;
    }

    async exists(id : number) : Promise<Boolean>{
        return (await this.model.findByPk(id)) != null;

    }
}