import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class GenreDto {

    @ApiProperty({
        description : "nome do genero de jogo",
        example : "Nome1234"
    })
    @IsString({message: "O nome do gênero de jogo deve ser uma string"})
    @IsNotEmpty({message: "O nome do gênero de jogo deve não deve ser vazio"})
    name : string;

}