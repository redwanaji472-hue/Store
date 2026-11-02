import { IsOptional, IsNumber, IsString, Length, Min } from "class-validator"

export class UpdateProdect{
        @IsString()
       @IsOptional()
       @Length(2,150)
       title?:string
       
        @IsString()
        @IsOptional()
        @Length(2,250)
        description ?: string;
       

       @IsNumber()
       @IsOptional()
       @Min(0)
       price?:number
}