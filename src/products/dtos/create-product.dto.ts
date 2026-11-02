import { IsNotEmpty, IsNumber, IsString, Length, Min } from "class-validator"

export class CreateProdect{

    @IsString()
    @IsNotEmpty()
    @Length(2,150)
    title:string 

    @IsString()
    @IsNotEmpty()
    @Length(2,250)
    description : string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price:number
}