import { Module,forwardRef } from "@nestjs/common";
import { ReviewController } from "./reviews.controller";
import { ReviewService } from "./review.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./reviews.entity";
import { ProductModule } from "../products/product.Module";
import { UserModule } from "../users/user.module";
import { JwtModule } from "@nestjs/jwt";



@Module({
    controllers : [ReviewController],
    providers : [ReviewService],
    imports : [TypeOrmModule.forFeature([Review]),ProductModule,UserModule,JwtModule]
})
export class ReviewModule{}