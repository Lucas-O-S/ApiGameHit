import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GenreSchema } from "./Schema/Genre.Schema";
import { GenreDto } from "./dto/Gender.dto";
import { ApiResponseInterface } from "src/App/Interface/ApiResponseInterface";
import { GenreService } from "./Genre.Service";


@Controller("Genre")
@ApiTags("Genre")
export class GenreController{

    constructor(private readonly service : GenreService) {}

    @Post()
    @ApiBody(GenreSchema)
    @ApiResponse({status: 201, description: "Genero criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async insert(@Body() dto : GenreDto): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.insert(dto);
            
            return {
                status: 201,
                message: 'Genero criado com sucesso',
                dataUnit: result,
            } ;
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao registrar.',
                error: error.message || error,
            }

        }
    }

    @Put(":id")
    @ApiBody(GenreSchema)
    @ApiResponse({status: 200, description: "Genero criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async update(
        @Body() dto : GenreDto,
        @Param("id", ParseIntPipe) id : number,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.update(dto, id);
          
            return {
                status: 200,
                message: 'Genero atualizado com sucesso',
                dataUnit: result,
            } ;
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao atualizar.',
                error: error.message || error,
            }

        }
    }
    
    @Get()
    @ApiResponse({status: 200, description: "Genero criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async getAll(): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.getAll();
            return {
                status: 200,
                message: 'Generos buscado com sucesso',
                dataUnit: result,
            } ;
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao buscar.',
                error: error.message || error,
            }

        }
    }
    
    
    @Get(":id")
    @ApiResponse({status: 200, description: "Genero criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async get(
        @Param("id", ParseIntPipe) id : number,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.get(id);
            return {
                status: 200,
                message: 'Genero buscado com sucesso',
                dataUnit: result,
            } ;
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao buscar.',
                error: error.message || error,
            }

        }
    }

    @Delete(":id")
    @ApiResponse({status: 200, description: "Genero criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async delete(
        @Param("id", ParseIntPipe) id : number,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.delete(id);
            return {
                status: 200,
                message: 'Genero deletado com sucesso',
                dataUnit: result,
            } ;
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao deletar.',
                error: error.message || error,
            }

        }
    }
    

}