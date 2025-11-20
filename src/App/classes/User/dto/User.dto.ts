import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Min, MinLength } from "class-validator";

export class UserDto {

    @ApiProperty({
        description : "nome do usuario",
        example : "Nome1234"
    })
    @IsNotEmpty({message: "Nome não pode ser vazio"})
    @IsString({message: "Deve ser uma string o usuario"})
    username: string;

    @ApiProperty({
        description : "Email do usuario",
        example : "Email@email"
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
    @IsStrongPassword({
        minLength: 2,
        minUppercase: 0,
        minLowercase: 0,
        minNumbers: 0,
        minSymbols: 0,    
    }, {message : "deve ter no minimo 2 caracteres a senha"})
    password: string;


    @ApiProperty({
        description: 'Imagem do produto',
        type: 'string',
        format: 'binary'
    })
    @IsOptional()
    userImage?: Buffer;

    @ApiProperty({
        description: "ID do papel (role) do administrador",
        example: 1
    })
    @IsInt({ message: "roleId deve ser um número inteiro" })
    @Type(() => Number)
    roleId: number = 2;

}
