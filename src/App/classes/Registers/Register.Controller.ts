import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ApiResponseInterface } from "src/App/Interface/ApiResponseInterface";
import { RegisterService } from "./Register.Service";
import { RegisterSchema } from "./Schemas/RegisterSchema";
import { RegisterDto } from "./dto/RegisterDto";
import { JwtAuthGuard } from "src/App/guards/JwtAuth.Guard";
import { RegisterUserPermissionGuard } from "src/App/guards/RegisterUserPermission.Guard";

@Controller("Register")
@ApiTags("Register")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RegisterController{

    constructor(private readonly service : RegisterService) {}

    @Post()
    @ApiBody(RegisterSchema)
    @ApiResponse({status: 201, description: "Registro criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async insert(
        @Body() dto : RegisterDto
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.insert(dto);
            return {
                status: 201,
                message: 'Registro criado com sucesso',
                dataUnit: result,
            };
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
    @ApiBody(RegisterSchema)
    @UseGuards(RegisterUserPermissionGuard)
    @ApiResponse({status: 200, description: "Registro atualizado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async update(
        @Body() dto : RegisterDto,
        @Param("id", ParseIntPipe) id : number,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.update(dto, id);
            return {
                status: 200,
                message: 'Registro atualizado com sucesso',
                dataUnit: result,
            };
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao atualizar.',
                error: error.message || error,
            }
        }
    }

    @Get("findByName/:userId/:gameName")
    @ApiQuery({ name: 'BuscaImagem', required: false, type: Boolean, description: 'Se falso, não retorna a imagem, padrão é falso' })
    @ApiResponse({status: 200})
    @ApiResponse({status: 500})
    async findByName(
        @Param("userId", ParseIntPipe) userId : number,
        @Param("gameName") gameName : string,
        @Query("BuscaImagem", new DefaultValuePipe(false), ParseBoolPipe) getImage : boolean,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.findByGameName(userId, gameName, getImage);
            return {
                status: 200,
                message: 'Registros buscados com sucesso',
                data: result,
            };
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao buscar.',
                error: error.message || error,
            }
        }
    }

    @Get("findByGenre/:userId/:genreId")
    @ApiQuery({ name: 'BuscaImagem', required: false, type: Boolean, description: 'Se falso, não retorna a imagem, padrão é falso' })
    @ApiResponse({status: 200})
    @ApiResponse({status: 500})
    async findByGenre(
        @Param("userId", ParseIntPipe) userId : number,
        @Param("genreId", ParseIntPipe) genreId : number,
        @Query("BuscaImagem", new DefaultValuePipe(false), ParseBoolPipe) getImage : boolean,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.findByGenre(userId, genreId, getImage);
            return {
                status: 200,
                message: 'Registros buscados com sucesso',
                data: result,
            };
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao buscar.',
                error: error.message || error,
            }
        }
    }

    @Get("findByStatus/:userId/:statusId")
    @ApiQuery({ name: 'BuscaImagem', required: false, type: Boolean, description: 'Se falso, não retorna a imagem, padrão é falso' })
    @ApiResponse({status: 200})
    @ApiResponse({status: 500})
    async findByStatus(
        @Param("userId", ParseIntPipe) userId : number,
        @Param("statusId", ParseIntPipe) statusId : number,
        @Query("BuscaImagem", new DefaultValuePipe(false), ParseBoolPipe) getImage : boolean,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.findByStatus(userId, statusId, getImage);
            return {
                status: 200,
                message: 'Registros buscados com sucesso',
                data: result,
            };
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao buscar.',
                error: error.message || error,
            }
        }
    }

    @Get("findByUser/:userId")
    @ApiQuery({ name: 'BuscaImagem', required: false, type: Boolean, description: 'Se falso, não retorna a imagem, padrão é falso' })
    @ApiResponse({status: 200})
    @ApiResponse({status: 500})
    async findByUser(
        @Param("userId", ParseIntPipe) userId : number,
        @Query("BuscaImagem", new DefaultValuePipe(false), ParseBoolPipe) getImage : boolean,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.findByUser(userId, getImage);
            return {
                status: 200,
                message: 'Registros buscados com sucesso',
                data: result,
            };
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao buscar.',
                error: error.message || error,
            }
        }
    }

    @Get()
    @ApiQuery({ name: 'BuscaImagem', required: false, type: Boolean, description: 'Se falso, não retorna a imagem, padrão é falso' })
    @ApiResponse({status: 200})
    @ApiResponse({status: 500})
    async getAll(
        @Query("BuscaImagem", new DefaultValuePipe(false), ParseBoolPipe) getImage : boolean,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.getAll(getImage);
            return {
                status: 200,
                message: 'Registros buscados com sucesso',
                dataUnit: result,
            };
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
    @ApiQuery({ name: 'BuscaImagem', required: false, type: Boolean, description: 'Se falso, não retorna a imagem, padrão é Verdaeiro' })
    @ApiResponse({status: 200})
    @ApiResponse({status: 500})
    async get(
        @Param("id", ParseIntPipe) id : number,
        @Query("BuscaImagem", new DefaultValuePipe(true), ParseBoolPipe) getImage : boolean,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.get(id, getImage);
            return {
                status: 200,
                message: 'Registro buscado com sucesso',
                dataUnit: result,
            };
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
    @UseGuards(RegisterUserPermissionGuard)
    @ApiResponse({status: 200})
    @ApiResponse({status: 500})
    async delete(
        @Param("id", ParseIntPipe) id : number,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.delete(id);
            return {
                status: 200,
                message: 'Registro deletado com sucesso',
                dataUnit: result,
            };
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
