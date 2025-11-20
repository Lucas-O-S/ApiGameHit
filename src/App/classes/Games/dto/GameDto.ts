import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, Min, MinLength } from "class-validator";

export class GameDto {

    @ApiProperty({
        description : "nome do Jogo",
        example : "Nome1234"
    })
    @IsNotEmpty({message: "Nome não pode ser vazio"})
    @IsString({message: "Deve ser uma string o nome"})
    name: string;

    @ApiProperty({
        description : "nome do User",
        example : "Email@email"
    })
    @IsNotEmpty({message: "Data de Lançamento não pode ser vazio"})
    @IsString({message: "Deve ser uma string a Data de Lançamento"})
    @IsDateString({},{message: "formato de data de lançamento invalida"})
    firstReleaseDate: string;

    @ApiProperty({
        description: 'Capa do jogo',
        type: 'string',
        format: 'binary'
    })
    @IsOptional()
    cover?: Buffer;

    @ApiProperty({
        description : "id do genero do jogo",
        example : "1"
    })
    @IsNotEmpty({message: "genero de jogo não pode ser vazio"})
    @IsInt({ message: "Id de genero de jogo não é valido não é válida" })
    @Type(() => Number) 
    genreId: number;

}
