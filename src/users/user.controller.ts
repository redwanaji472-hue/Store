import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards,Req, Put, Delete, Param, ParseIntPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guard/auth.guard";
import { CURRENT_USER_KEY } from "../utils/constant";
import { JWTPayloadType } from "../utils/types";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Roles } from "./decorators/auth-role.decorator";
import { UserTye } from "../utils/enum";
import { AuthRoleGuard } from "./guard/authRole.guard";
import { UpdateUserDto } from "./dtos/UpdateUser.dto";


@Controller('/api/users')
export class UserController {
  constructor(
   private readonly UserService:UserService
  ) {}
    @Post("/auth/register")
    public register(@Body() body:RegisterDto){
        return this.UserService.registerUser(body)
    }
    @Post("/auth/login") // status 200 ❌
    @HttpCode(HttpStatus.OK)// status 200 ✔
    public Login(@Body() body:LoginDto){
        return this.UserService.loginUser(body)
    }

    @Get('current-user')
    @UseGuards(AuthGuard)
    public GetCurrentUser(@CurrentUser() payload:JWTPayloadType){
        return this.UserService.GetCurrentUser(payload.id);
    }
    // ~/api/users
    @Get()
    @Roles(UserTye.ADMIN)
    @UseGuards(AuthRoleGuard)
    public GetAllUsers(){
        return this.UserService.getAll();
    }
    @Put()
    @Roles(UserTye.ADMIN,UserTye.NORMAL_USER)
    @UseGuards(AuthRoleGuard)
    public UpdateUser(@CurrentUser() payload:JWTPayloadType , @Body() body:UpdateUserDto){
        return this.UserService.update(payload.id,body)
    }

     @Delete(':id')
    @Roles(UserTye.ADMIN,UserTye.NORMAL_USER)
    @UseGuards(AuthRoleGuard)
    public DeleteUser(@Param('id',ParseIntPipe)id:number ,@CurrentUser() payload:JWTPayloadType ){
        return this.UserService.delete(id,payload)
    }
}