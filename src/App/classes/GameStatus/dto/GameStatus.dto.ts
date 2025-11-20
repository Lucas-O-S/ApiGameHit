import { IsNotEmpty, IsString } from "class-validator";


export class GameStatusDto {

    @IsString({message: "O nome do Status de jogo deve ser uma string"})
    @IsNotEmpty({message: "O nome do Status de jogo deve não deve ser vazio"})
    name : string;

}