import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JWTPayloadType } from "../../utils/types";
import { CURRENT_USER_KEY } from "../../utils/constant";




@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private readonly jwtService:JwtService,
        private readonly configService:ConfigService

    ){}

    async canActivate(context: ExecutionContext)  {
        const request = context.switchToHttp().getRequest();
        const [type,token] = request.headers.authorization?.split(' ')??[];
        if(type === 'Bearer' && token){
            try{
                const payload :JWTPayloadType = await this.jwtService.verifyAsync(token,
                {
                    secret:this.configService.get<string>('JWT_SECRET')
                }
            );
                request[CURRENT_USER_KEY] = payload
            }catch(err){
                return false;
            }
        }else{
            return false;
        }
        return true; 
    }

}