import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class RoleDto {

    @ApiProperty({
        description : "nome do cargo de jogo",
        example : "Nome1234"
    })
    @IsString({message: "O nome do cargo de jogo deve ser uma string"})
    @IsNotEmpty({message: "O nome do cargo de jogo deve não deve ser vazio"})
    role_Name : string;

}