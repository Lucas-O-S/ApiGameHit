import { IsNotEmpty, IsString } from "class-validator";


export class GenreDto {

    @IsString({message: "O nome do gênero de jogo deve ser uma string"})
    @IsNotEmpty({message: "O nome do gênero de jogo deve não deve ser vazio"})
    name : string;

}