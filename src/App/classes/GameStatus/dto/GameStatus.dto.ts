import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class GameStatusDto {

    @ApiProperty({
        description : "nome do status de jogo",
        example : "Nome1234"
    })
    @IsString({message: "O nome do Status de jogo deve ser uma string"})
    @IsNotEmpty({message: "O nome do Status de jogo deve não deve ser vazio"})
    name : string;

}