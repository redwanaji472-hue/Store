import { Body, Controller , Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AuthRoleGuard } from "../users/guard/authRole.guard";
import { Roles } from "../users/decorators/auth-role.decorator";
import { UserTye } from "../utils/enum";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { CurrentUser } from "../users/decorators/current-user.decorator";
import { JWTPayloadType } from "../utils/types";
import { ReviewService } from "./review.service";
import { UpdateReviewDto } from "./dtos/update-review.dto";



@Controller('/api/reviews')
export class ReviewController{
   constructor (
      private readonly reviewService :ReviewService
 

){}
      // ~/api/reviews/:prodectId
    @Post(':prodectId')
    @UseGuards(AuthRoleGuard)
    @Roles(UserTye.ADMIN,UserTye.NORMAL_USER)
    public  CreateReview(
      @Param('prodectId',ParseIntPipe) productId : number,
      @Body() createReviewDto :CreateReviewDto,
      @CurrentUser() palody :JWTPayloadType
    ) {
      console.log(2)
       return this.reviewService.CreateReview(productId,palody.id,createReviewDto)
    }

     // ~/api/reviews/
    @Get()
    @UseGuards(AuthRoleGuard)
    @Roles(UserTye.ADMIN,UserTye.NORMAL_USER)
    public GetAllRewiew(@Query('numberpage',ParseIntPipe) numberpage : number
      ,@Query('reviewPerPage',ParseIntPipe) reviewPerPage : number){
      return this.reviewService.GetAll(numberpage,reviewPerPage)
    }
    
    @Get('/CurrentUser')
    @UseGuards(AuthRoleGuard)
    @Roles(UserTye.ADMIN,UserTye.NORMAL_USER)
    public GetAllReviewByUser(@CurrentUser() palody :JWTPayloadType
    ){
      console.log(palody.id)
      return this.reviewService.GetAllReviewByUser(palody.id)
    }
    
     @Get('/prodect/:prodectId')
    @UseGuards(AuthRoleGuard)
    @Roles(UserTye.ADMIN,UserTye.NORMAL_USER)
    public GetAllReviewByProdect(@Param('prodectId' ,ParseIntPipe) prodectId : number){
      return this.reviewService.GetAllReviewByProdect(prodectId)
    }
    @Get('/:id')
    @UseGuards(AuthRoleGuard)
    @Roles(UserTye.ADMIN,UserTye.NORMAL_USER)
    public GetReviewBy(@Param('id',ParseIntPipe) id :number){
      return this.reviewService.GetSingleReview(id)
    }

    @Put('/:id')
    @UseGuards(AuthRoleGuard)
    @Roles(UserTye.ADMIN,UserTye.NORMAL_USER)
    public UpdateReview(
      @Param('id',ParseIntPipe) id :number,
      @Body() dto :UpdateReviewDto,
      @CurrentUser() user :JWTPayloadType
    ){
      return this.reviewService.UpdateReview(id,dto,user)
    }

    @Delete('/:id')
    @UseGuards(AuthRoleGuard)
    @Roles(UserTye.ADMIN,UserTye.NORMAL_USER)
    public DeleteReview(
      @Param('id',ParseIntPipe) id :number, @CurrentUser() user :JWTPayloadType
    ){
      return this.reviewService.DeleteReview(id,user)
    }
}