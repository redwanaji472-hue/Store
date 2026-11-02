import { BadRequestException, Inject, Injectable,NotFoundException,Header } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { RegisterDto } from "./dtos/register.dto";

import { LoginDto } from "./dtos/login.dto";
import {JWTPayloadType ,accessToken } from '../utils/types';
import { UpdateUserDto } from "./dtos/UpdateUser.dto";
import { UserTye } from "../utils/enum";
import { AuthService } from "./auth.service";
@Injectable()
export class UserService {

       constructor(  
        @InjectRepository(User)
        private readonly UserRepostry:Repository <User>,
        private readonly authService : AuthService
    ) {}
      /**
       * Create new User
       * @param RegisterDto -  data from crating new user
       * @returns Jwt (access token)
       */
    public async registerUser(registerDto:RegisterDto):Promise<accessToken>{ 
            return this.authService.registerUser(registerDto)
    }


    /**
     * Log In User
     * @param loginDto - data from  log in to user account
     * @returns Jwt (access token)
     */
    public async loginUser(loginDto:LoginDto):Promise<accessToken>{
        return this.authService.loginUser(loginDto)

    }

/**
 * Get current user (logged in user)
 * @param id id of the logged in user
 * @returns the user from the database
 */
    public async GetCurrentUser(id : number):Promise<User>{ 
        
        const user = await this.UserRepostry.findOne({where:{id}});
        if(!user) throw new NotFoundException('User is not Found');
        return user;
    }

    /**
     * retrieve all users from the database
     * @returns collaction of all users in the database
     */
    public async getAll() : Promise<{users: User[]}>{
        const users = await this.UserRepostry.find();
        return {users};
    }
    /**
     * 
     * @param id id of the logged in user
     * @param UpdateUser the data of input user
     * @returns new data of user
     */
    public async update(id:number,UpdateUser:UpdateUserDto){
        const {username,password} = UpdateUser;

        const user = await this.UserRepostry.findOne({where:{id}})
        if(!user)return false;
        user.username  = username ?? user?.username
        if(password){
             user.password =await this.authService.hashPassword(password);
        }

        return this.UserRepostry.save(user)

    }
    

    public async delete(userId:number,jwtpalod:JWTPayloadType){
        const user = await this.GetCurrentUser(userId)
        if(user.id === jwtpalod.id || jwtpalod.userType === UserTye.ADMIN){
            await this.UserRepostry.remove(user)
            return {message :
                "user has been delete"
            }

        }
        throw new BadRequestException("you not allowed ")
    }



}


