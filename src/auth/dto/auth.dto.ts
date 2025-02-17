import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"
export class AuthDto{

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    password:string

    @IsOptional()
    @IsString()
    name:string

}