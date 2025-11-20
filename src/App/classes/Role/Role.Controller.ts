import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ApiResponseInterface } from "src/App/Interface/ApiResponseInterface";
import { JwtAuthGuard } from "src/App/guards/JwtAuth.Guard";
import { AdmPermissionGuard } from "src/App/guards/AdmPermission.Guard";
import { RoleSchema } from "./Schema/Role.Schema";
import { RoleDto } from "./dto/Role.dto";
import { RoleService } from "./Role.Service";


@Controller("Role")
@ApiTags("Role")
@UseGuards(JwtAuthGuard, AdmPermissionGuard)
@ApiBearerAuth()
export class RoleController{

    constructor(private readonly service : RoleService) {}

    @Post()
    @ApiBody(RoleSchema)
    @ApiResponse({status: 201, description: "Cargo criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async insert(@Body() dto : RoleDto): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.insert(dto);
            
            return {
                status: 201,
                message: 'Cargo criado com sucesso',
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
    @ApiBody(RoleSchema)
    @ApiResponse({status: 200, description: "Cargo atualizado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async update(
        @Body() dto : RoleDto,
        @Param("id", ParseIntPipe) id : number,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.update(dto, id);
          
            return {
                status: 200,
                message: 'Cargo atualizado com sucesso',
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
    @ApiResponse({status: 200, description: "Cargo buscado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async getAll(): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.getAll();
            return {
                status: 200,
                message: 'Cargo buscado com sucesso',
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
    @ApiResponse({status: 200, description: "Cargo buscado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async get(
        @Param("id", ParseIntPipe) id : number,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.get(id);
            return {
                status: 200,
                message: 'Cargo buscado com sucesso',
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
    @ApiResponse({status: 200, description: "Cargo deletado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async delete(
        @Param("id", ParseIntPipe) id : number,
    ): Promise<ApiResponseInterface>{
        try{
            const result = await this.service.delete(id);
            return {
                status: 200,
                message: 'Cargo deletado com sucesso',
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