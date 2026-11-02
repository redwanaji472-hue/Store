import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dtos/login.dto";
import { accessToken, JWTPayloadType } from "../utils/types";
import { RegisterDto } from "./dtos/register.dto";
 import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService{
    constructor (
        @InjectRepository(User)
        private readonly UserRepostry : Repository<User>,
        private readonly jwtSerivce:JwtService,
    ){}
     /**
           * Create new User
           * @param RegisterDto -  data from crating new user
           * @returns Jwt (access token)
           */
        public async registerUser(registerDto:RegisterDto):Promise<accessToken>{ 
            const {email,password,username}= registerDto;
            const User = await this.UserRepostry.findOne({where:{email}})
            if(User){
                throw new BadRequestException("user alrady exist")
            }
          
           const  hashPasswod =await this.hashPassword(password)
    
           let newUser = await this.UserRepostry.create({
            email,
            username,
            password:hashPasswod
           })
           newUser = await this.UserRepostry.save(newUser)
           const access_token = await this.GenerateJWT({id:newUser.id,userType:newUser.userType})
           return {access_token};
        }
    
    
        /**
         * Log In User
         * @param loginDto - data from  log in to user account
         * @returns Jwt (access token)
         */
        public async loginUser(loginDto:LoginDto):Promise<accessToken>{
            const {email , password}=loginDto;
            const user = await this.UserRepostry.findOne({where:{email}})
            if(!user)throw new BadRequestException("invaled email or password")
            
            const isPassWordMatch = await bcrypt.compare(password,user.password)
            if(!isPassWordMatch)throw new BadRequestException("invaled email or password")
            const access_token = await this.GenerateJWT({id:user.id,userType:user.userType})
           return {access_token};
    
        }
        /**
         * hashpassword for user 
         * @param password 
         * @returns hashPassword
         */
        public async hashPassword(password:string){
            const salt =await bcrypt.genSalt(10);
            const hashpasswod =await bcrypt.hash(password,salt);
            return hashpasswod;
        }

    private GenerateJWT(payload : JWTPayloadType):Promise<string>{
        return this.jwtSerivce.signAsync(payload)
   }
 
}