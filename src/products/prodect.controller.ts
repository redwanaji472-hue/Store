
import { Body, Controller, Get, Param, Post,NotFoundException, Put, Delete, ParseIntPipe } from "@nestjs/common";
import { CreateProdect } from "./dtos/create-product.dto";
import { UpdateProdect } from "./dtos/Update-prodect.dto";
import { ProductService } from "./product.service";
import { Roles } from "../users/decorators/auth-role.decorator"; 
import { UseGuards,Query } from "@nestjs/common";
import { JWTPayloadType } from "../utils/types";
import { AuthRoleGuard } from "../users/guard/authRole.guard";
import { UserTye } from "../utils/enum";
import { CurrentUser } from "../users/decorators/current-user.decorator";
import { title } from "process";
import { Max } from "class-validator";
@Controller('/api/products')
export class ProductController {
   

   constructor(private readonly productService :ProductService){}

    @Post()
    @UseGuards(AuthRoleGuard)
    @Roles(UserTye.ADMIN)
    CreateNewProdect(@Body() body:CreateProdect , @CurrentUser() paylody : JWTPayloadType){
       return this.productService.CreateProdect(body,paylody.id)
    }
     // ~//api/products  
    @Get()
    public getAllProducts(
      @Query('title') title :string ,
      @Query('minPrice') minPrice : string,
      @Query('maxPrice') maxPrice : string
   ) {
       return this.productService.getAll(title,minPrice,maxPrice)
    } 

    @Get(':id')
    public getSingleProdect(@Param('id',ParseIntPipe) id:number){
        return this.productService.getOneBy(id)
    }

    @Put(':id')
     @UseGuards(AuthRoleGuard)
    @Roles(UserTye.ADMIN)
    public UpdateProdect (@Param('id',ParseIntPipe) id :number , @Body() body:UpdateProdect){
      return this.productService.UpdateProdect(id,body)
    }

     @Delete(':id')
     @UseGuards(AuthRoleGuard)
     @Roles(UserTye.ADMIN)
    public DeleteProdect (@Param('id',ParseIntPipe) id :number ){
       return this.productService.DeleteProdect(id)
    }
}