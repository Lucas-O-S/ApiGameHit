import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GameStatusSchema } from "./Schema/GameStatus.Schema";
import { GameStatusDto } from "./dto/GameStatus.dto";
import { ApiResponseInterface } from "src/App/Interface/ApiResponseInterface";
import { GameStatusService } from "./GameStatus.Service";
import { JwtAuthGuard } from "src/App/guards/JwtAuth.Guard";
import { AdmPermissionGuard } from "src/App/guards/AdmPermission.Guard";


@Controller("GameStatus")
@ApiTags("GameStatus")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GameStatusController{

    constructor(private readonly service : GameStatusService) {}

    @Post()
    @UseGuards(AdmPermissionGuard)
    @ApiBody(GameStatusSchema)
    @ApiResponse({status: 201, description: "Status criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async insert(@Body() dto : GameStatusDto): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.insert(dto);
            
            return {
                status: 201,
                message: 'Status criado com sucesso',
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
    @ApiResponse({status: 200, description: "Status criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async update(
        @Body() dto : GameStatusDto,
        @Param("id", ParseIntPipe) id : number,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.update(dto, id);
          
            return {
                status: 200,
                message: 'Status atualizado com sucesso',
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
    @ApiResponse({status: 200, description: "Status criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async getAll(): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.getAll();
            return {
                status: 200,
                message: 'Status buscado com sucesso',
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
    
    
    @Get(":id")
    @ApiResponse({status: 200, description: "Status criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async get(
        @Param("id", ParseIntPipe) id : number,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.get(id);
            return {
                status: 200,
                message: 'Status buscado com sucesso',
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
    @UseGuards(AdmPermissionGuard)
    @ApiResponse({status: 200, description: "Status criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async delete(
        @Param("id", ParseIntPipe) id : number,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.delete(id);
            return {
                status: 200,
                message: 'Status deletado com sucesso',
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