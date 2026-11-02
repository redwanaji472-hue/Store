import { Module } from "@nestjs/common";
import { ProductController } from "./prodect.controller";
import { ProductService } from "./product.service";
import { Product } from "./product.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../users/user.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product]),UserModule,JwtModule],
  exports:[ProductService]
})
export class ProductModule{}