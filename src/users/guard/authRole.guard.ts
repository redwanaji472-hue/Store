import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JWTPayloadType } from "../../utils/types";
import { CURRENT_USER_KEY } from "../../utils/constant";
import { Reflector } from "@nestjs/core";
import { UserService } from "../user.service";
import { UserTye } from "../../utils/enum";




@Injectable()
export class AuthRoleGuard implements CanActivate{
    constructor(
        private readonly jwtService:JwtService,
        private readonly configService:ConfigService,
        private readonly reflector : Reflector,
        private readonly userService:UserService

    ){}

    async canActivate(context: ExecutionContext)  {

        const roles:UserTye[] =this.reflector.getAllAndOverride("roles",
            [context.getHandler(),context.getClass()]) 
            if(!roles || roles.length===0)return false



        const request = context.switchToHttp().getRequest();
        const [type,token] = request.headers.authorization?.split(' ')??[];
        if(type === 'Bearer' && token){
            try{
                const payload :JWTPayloadType = await this.jwtService.verifyAsync(token,
                {
                    secret:this.configService.get<string>('JWT_SECRET')
                }
            );
            const user  = await this.userService.GetCurrentUser(payload.id)

            if(!user)return false
            
            if(roles.includes(user.userType)){
                request[CURRENT_USER_KEY] = payload
                return true;
            }
            
            
            }catch(err){
                return false;
            }
        }else{
            return false;
        }
        return false; 
    }

}