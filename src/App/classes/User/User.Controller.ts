import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./User.Service";
import { UserDto } from "./dto/User.dto";
import { ApiResponseInterface } from "../../Interface/ApiResponseInterface";
import { FileInterceptor} from "@nestjs/platform-express";
import { UserSchema } from "./Schemas/UserSchema";
import { JwtAuthGuard } from "src/App/guards/JwtAuth.Guard";
import { UserIdguard } from "src/App/guards/UserId.Guard";
import { ImageInterceptorRules } from "src/App/Utils/ImagemFiltters";
import { AdmPermissionGuard } from "src/App/guards/AdmPermission.Guard";

@Controller("User")
@ApiTags("User")
export class UserController {

    constructor(private readonly service: UserService) {}

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody(UserSchema)
    @ApiResponse({status: 201, description: "usuario criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    @UseInterceptors(ImageInterceptorRules("userImage"))
    async create(
        @Body() dto: UserDto,
        @UploadedFile() file: Express.Multer.File
    ) : Promise<ApiResponseInterface> {
        try{
            
            dto.userImage = file ? Buffer.from(file.buffer) : undefined;
            
            const result = await this.service.create(dto);

            return {
                status: 201,
                message: 'usuario criado com sucesso',
                dataUnit: result,
            } ;
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao registrar usuario.',
                error: error.message || error,
            }

        }
    }

    @Put(":id")
    @ApiConsumes('multipart/form-data')
    @ApiBody(UserSchema)
    @UseGuards(JwtAuthGuard, UserIdguard)
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: "usuario atualizado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    @UseInterceptors(ImageInterceptorRules("userImage"))
    async update(
        @Param("id", ParseIntPipe) id : number,
        @Body() dto: UserDto,
        @UploadedFile() file: Express.Multer.File
    ) : Promise<ApiResponseInterface> {
        try{

            dto.userImage = file ? Buffer.from(file.buffer) : undefined;

            const result = await this.service.update(dto, id);

            return {
                status: 200,
                message: 'usuario atualizado com sucesso.',
                dataUnit: result,
            } ;
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao registrar User.',
                error: error.message || error,
            }

        }
    }

    @Patch("changeRole/:id/:roleId")
    @UseGuards(JwtAuthGuard, AdmPermissionGuard)
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: "usuario atualizado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    @UseInterceptors(ImageInterceptorRules("userImage"))
    async changeRole(
        @Param("id") id: number,
        @Param("roleId") roleId: number
    ) : Promise<ApiResponseInterface> {
        try{

            const result = await this.service.changeRole(id,roleId);

            return {
                status: 200,
                message: 'usuario atualizado com sucesso.',
                dataUnit: result,
            } ;
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao registrar User.',
                error: error.message || error,
            }

        }
    }

    @Get(":id/")
    @ApiQuery({ name: 'BuscaImagem', required: false, type: Boolean, description: 'Se falso, não retorna a imagem, padrão é verdadeiro' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: "usuario criado com sucesso"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async get(
        @Param("id", ParseIntPipe) id : number,
        @Query("BuscaImagem", new DefaultValuePipe(true), ParseBoolPipe) getImage : boolean,
    ) : Promise<ApiResponseInterface>{
        try{

            const result = await this.service.get(id, getImage);

            return {
                status: 200,
                message: 'Busca realizada com sucesso.',
                dataUnit: result,
            } ;
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao buscar User.',
                error: error.message || error,
            }

        }
    }

    @Get()
    @ApiQuery({ name: 'BuscaImagem', required: false, type: Boolean, description: 'Se falso, não retorna a imagem, padrão é falso' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: "Busca Concluida."})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async getAll(
        @Query("BuscaImagem", new DefaultValuePipe(false), ParseBoolPipe) getImage : boolean,
    ) : Promise<ApiResponseInterface> {
        try{

            const result = await this.service.getAll(getImage);

            return {
                status: 200,
                message: 'Busca Concluida.',
                data: result,
            } ;
        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao buscar User.',
                error: error.message || error,
            }

        }
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard,UserIdguard)
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: "Deleção Concluida"})
    @ApiResponse({status: 500, description: "Erro na requisição"})
    async delete(
        @Param("id", ParseIntPipe) id : number
    ) : Promise<ApiResponseInterface>{

        try{

            const result = await this.service.delete(id);

            return {
                status: 200,
                message: 'usuario deletado com sucesso',
                dataUnit: result
            }

        }
        catch(error){
            return{
                status: 500,
                message: 'Erro ao deletar User.',
                error: error.message || error,
            }

        }


    }
}