import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ApiResponseInterface } from "src/App/Interface/ApiResponseInterface";
import { GameService } from "./Game.Service";
import { GameStatusSchema } from "../GameStatus/Schema/GameStatus.Schema";
import { GameDto } from "./dto/GameDto";
import { GameSchema } from "./Schemas/GameSchema";
import { ImageInterceptorRules } from "src/App/Utils/ImagemFiltters";
import { JwtAuthGuard } from "src/App/guards/JwtAuth.Guard";
import { AdmPermissionGuard } from "src/App/guards/AdmPermission.Guard";


@Controller("Game")
@ApiTags("Game")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GameController{

    constructor(private readonly service : GameService) {}

    @Post()
    @UseGuards(AdmPermissionGuard)
    @ApiBody(GameSchema)
    @ApiConsumes('multipart/form-data')
    @ApiResponse({status: 201, description: "Jogo criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    @UseInterceptors(ImageInterceptorRules("cover"))
    async insert(
        @Body() dto : GameDto,
        @UploadedFile() file: Express.Multer.File
    ): Promise<ApiResponseInterface>{
        try{

            dto.cover = file ? Buffer.from(file.buffer) : undefined;

            const result = await this.service.insert(dto);
            
            return {
                status: 201,
                message: 'Jogo criado com sucesso',
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
    @ApiBody(GameStatusSchema)
    @UseGuards(AdmPermissionGuard)
    @ApiResponse({status: 200, description: "Jogo criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async update(
        @Body() dto : GameDto,
        @Param("id", ParseIntPipe) id : number,
        @UploadedFile() file: Express.Multer.File
    ): Promise<ApiResponseInterface>{
        try{
            dto.cover = file ? Buffer.from(file.buffer) : undefined;

            const result = await this.service.update(dto, id);
          
            return {
                status: 200,
                message: 'Jogo atualizado com sucesso',
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

    @Get("findByName/:name")
    @ApiQuery({ name: 'BuscaImagem', required: false, type: Boolean, description: 'Se falso, não retorna a imagem, padrão é verdadeiro' })
    @ApiResponse({status: 200, description: "Jogo criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async findByName(
        @Param("name") name : string,
        @Query("BuscaImagem", new DefaultValuePipe(true), ParseBoolPipe) getImage : boolean,
        
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.findByName(name, getImage);
            return {
                status: 200,
                message: 'Jogo buscado com sucesso',
                data: result,
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

    @Get("findByGenre/:genreId")
    @ApiQuery({ name: 'BuscaImagem', required: false, type: Boolean, description: 'Se falso, não retorna a imagem, padrão é verdadeiro' })
    @ApiResponse({status: 200, description: "Jogo criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async findByGenre(
        @Param("genreId", ParseIntPipe) genreId : number,
        @Query("BuscaImagem", new DefaultValuePipe(true), ParseBoolPipe) getImage : boolean,
        
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.findByGenre(genreId, getImage);
            return {
                status: 200,
                message: 'Jogo buscado com sucesso',
                data: result,
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
    
    @Get()
    @ApiQuery({ name: 'BuscaImagem', required: false, type: Boolean, description: 'Se falso, não retorna a imagem, padrão é falso' })
    @ApiResponse({status: 200, description: "Jogo criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async getAll(
        @Query("BuscaImagem", new DefaultValuePipe(false), ParseBoolPipe) getImage : boolean,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.getAll(getImage);
            return {
                status: 200,
                message: 'Jogo buscado com sucesso',
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
    @ApiQuery({ name: 'BuscaImagem', required: false, type: Boolean, description: 'Se falso, não retorna a imagem, padrão é verdadeiro' })
    @ApiResponse({status: 200, description: "Jogo criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async get(
        @Param("id", ParseIntPipe) id : number,
        @Query("BuscaImagem", new DefaultValuePipe(true), ParseBoolPipe) getImage : boolean,
        
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.get(id,getImage);
            return {
                status: 200,
                message: 'Jogo buscado com sucesso',
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
    // @UseGuards(AdmPermissionGuard)
    @ApiResponse({status: 200, description: "Jogo criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async delete(
        @Param("id", ParseIntPipe) id : number,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.delete(id);
            return {
                status: 200,
                message: 'Jogo deletado com sucesso',
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