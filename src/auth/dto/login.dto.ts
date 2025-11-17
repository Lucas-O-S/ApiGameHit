import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Min, MinLength } from "class-validator";

export class LoginDto {

    @ApiProperty({
        description : "nome do User",
        example : "Nome1234"
    })
    @IsNotEmpty({message: "Email não pode ser vazio"})
    @IsString({message: "Deve ser uma string o Email"})
    @IsEmail({},{message : "Email invalido"})
    email: string;


    @ApiProperty({
        description : "senha do User",
        example : "123456789"
    })
    @IsNotEmpty({message: "Senha não pode ser vazio"})
    @IsString({message: "Deve a senha ser uma string"})
    password: string;

}
