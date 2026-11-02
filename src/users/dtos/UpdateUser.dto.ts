import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator";



export class UpdateUserDto{


    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    @IsOptional()
    password:string;

    @IsOptional()
    @Length(2,150)
    @IsString()
    username:string;
}