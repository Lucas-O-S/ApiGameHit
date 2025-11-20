import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, Max, Min, MinLength } from "class-validator";

export class RegisterDto {

    @ApiProperty({
        description : "nome do Jogo",
        example : "Nome1234"
    })
    @IsString({message: "Deve ser uma string o Analise"})
    review: string;

    @ApiProperty({
        description : "Data de Finalização",
        example : "1000-01-02"
    })
    @IsString({message: "Deve ser uma string a Data de Finalização"})
    @IsDateString({},{message: "formato de Data de Finalização invalida"})
    completedDate: string;

    @ApiProperty({
        description : "Data de Inicio",
        example : "1000-01-01"
    })
    @IsString({message: "Deve ser uma string a Data de Inicio"})
    @IsDateString({},{message: "formato de Data de Inicio invalida"})
    startedDate: string;

    @ApiProperty({
        description : "id do genero do jogo",
        example : "1"
    })
    @IsInt({message: "Nota Pessoal deve ser um numero inteiro"})
    @Type(() => Number) 
    @Min(0, {message: "Nota Pessoal deve ser no minimo zero"})
    @Max(10, {message: "Nota Pessoal deve ser no maximo 10"})
    personalRating: number;

    @ApiProperty({
        description: "ID do papel (role) do administrador",
        example: 1
    })
    @IsNotEmpty({ message: "id de usuario é obrigatório" })
    @IsInt({ message: "id de usuario deve ser um número inteiro" })
    @Type(() => Number)
    userId: number;
 
    @IsNotEmpty({ message: "id de Jogo é obrigatório" })
    @IsInt({ message: "id de Jogo deve ser um número inteiro" })
    @Type(() => Number)
    gameId: number;
 
    @IsNotEmpty({ message: "id de Status de Jogo é obrigatório" })
    @IsInt({ message: "id de Status de Jogo deve ser um número inteiro" })
    @Type(() => Number)
    gameStatusId: number;


}
