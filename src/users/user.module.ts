
import { Module,forwardRef } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ReviewModule } from "../reviews/review.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtModule, JwtSignOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";



@Module({
    
    imports : [TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
        inject:[ConfigService],
        useFactory:(configService:ConfigService)=>{
            return {
                global:true,
                secret:configService.get<string>('JWT_SECRET'),
                signOptions:{
                    expiresIn:configService.get<JwtSignOptions["expiresIn"]>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')
                }
            }
        }
    })
],
    controllers : [UserController],
    providers : [UserService,AuthService],
    exports : [UserService],

})
export class UserModule {}