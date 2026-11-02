import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./reviews.entity";
import { Repository } from "typeorm";
import { ProductService } from "../products/product.service";
import { UserService } from "../users/user.service";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { UpdateReviewDto } from "./dtos/update-review.dto";
import { JWTPayloadType } from "../utils/types";
import { UserTye } from "../utils/enum";




@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review) 
        private readonly reviewRepository :Repository<Review>,
        private readonly protectedService : ProductService,
        private readonly userService  : UserService
       ) {}
  


       /**
        *     Create new review
        * @param prodectId id from prodect
        * @param userId id from User of Creadted
        * @param dto the valdtion of data before save to data base
        * @returns save review to database
        */
       public async CreateReview(prodectId:number,userId:number,dto:CreateReviewDto){
        const prodect = await this.protectedService.getOneBy(prodectId);
        const user = await this.userService.GetCurrentUser(userId);
        const review  = await this.reviewRepository.create({...dto,user,prodect});
        const result = await this.reviewRepository.save(review)
        return this.toReviewRespons(review)
       }




       /**
        *   Get All Review
        * @param numberpage number of Current page
        * @param reviewPerPage data  pre page
        * @returns Collection of review with pagination
        */

       public async GetAll(numberpage:number,reviewPerPage:number){
       const review = await this.reviewRepository.find({ 
        skip:reviewPerPage * (numberpage - 1) , 
        take:reviewPerPage ,
        relations: { prodect: true ,user: true}
        ,order: { createdAt: 'DESC' }
    
    });
        return review.map((review)=>this.toReviewRespons(review))
 } 



       /**
        * Get All Review By Prodect
        * @param productId id with prodect
        * @returns collection of review with prodectId
        */
       public async GetAllReviewByProdect(productId : number){
        const review = await this.reviewRepository.find({
            where : {prodect :{id:productId} }
            ,relations:{prodect:true},
            order: { createdAt: 'DESC' },
        })
        return review.map((review)=>this.toReviewRespons(review))
       }



        /**
         * Get All Review By User
         * @param userId id with user
         * @returns collection of review with userId
         */

      public async GetAllReviewByUser(userId: number) {
         const review= await this.reviewRepository.find({
            where: { user: { id: userId } },
            relations: { prodect: true },
            order: { createdAt: 'DESC' },
            
    });
      return review.map((review)=>this.toReviewRespons(review))
}




    /**
     * Get Single Review
     * @param id id of the review
     * @returns the review with the given id
     */

    public async GetSingleReview (id : number){
        const review =await this.findRewiewOrFail(id)
        return this.toReviewRespons(review)
    }



    /**
     * Update Review
     * @param id id of the review
     * @param dto update data
     * @param user current user
     * @returns the updated review
     */


    public async UpdateReview(id:number,dto:UpdateReviewDto,user:JWTPayloadType){
        const review = await this.findRewiewOrFail(id)
         await this.assertOwnerOrAdmin(review,user)

        review.rating = dto.rating ?? review.rating
        review.comment = dto.comment ?? review.comment
        await this.reviewRepository.save( review)
        return {review : this.toReviewRespons(review ), message : 'Update secsassfly'}
    }




    /**
     * Delete Review
     * @param id id of the review
     * @param user current user
     * @returns the message of delete review
     */
    public async DeleteReview(id : number,user :JWTPayloadType){
        const review = await this.findRewiewOrFail(id)
        await this.assertOwnerOrAdmin(review,user)
        await this.reviewRepository.remove(review)
        return {message : 'Delete Review Secsassfly'}
    }


    /**
     * Find Review or throw not found exception
     * @param id id of the review
     * @returns the review with the given id
     */

    private async findRewiewOrFail(id :number){
         const review= await this.reviewRepository.findOne
         ({
            where: { id },
            relations: {user: true, prodect: true },
            
    });
     if(!review)throw new NotFoundException('Review is not Found')
    return review
           
    }


    /**
     * Convert Review to Review Response
     * @param review the review entity
     * @returns the review response
     */
    private toReviewRespons(review:Review){
        return{
                id: review.id,
                rating : review.rating,
                comment : review.comment,
                createdAt :review.createdAt,
                updatedAt :review.updatedAt,
                prodectId: review.prodect?.id,
                userId : review.user?.id
        }
    }



    /**
     * Assert that the user is the owner of the review or an admin
     * @param review the review entity
     * @param user the current user
     */
    private async assertOwnerOrAdmin(review:Review,user:JWTPayloadType){
        const isOwner = review.user?.id === user.id;
        const isAdmin = user.userType === UserTye.ADMIN;
        if(!isOwner && !isAdmin){
            throw new ForbiddenException('You can only modify your own review');
        }
    }
}
