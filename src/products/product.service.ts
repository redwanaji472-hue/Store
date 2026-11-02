import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { CreateProdect } from "./dtos/create-product.dto"
import { UpdateProdect } from "./dtos/Update-prodect.dto"
import { DeepPartial, Repository,Like, Between } from "typeorm"
import { Product } from "./product.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { UserService } from "../users/user.service"


@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly  productRepository :Repository<Product>,
        private readonly userService : UserService
    ){}
  
      /**
       *   Create new Prodect
       * @param dto the data in user 
       * @param userId check the user is Admin 
       * @returns the new produt
       */
  public async CreateProdect(dto:CreateProdect , userId : number){
    const user = await this.userService.GetCurrentUser(userId)        
     if (!user) throw new NotFoundException('User not found');
    const newPeoduct = this.productRepository.create({
        ...dto,
        title: dto.title.toLowerCase(),
        user 
    } as DeepPartial<Product>)
    return this.productRepository.save(newPeoduct)
        } 
    /**
     *    Get All Prodect
     * @returns  the colection of prodect
     */
        public getAll(title?:string , minPrice?:string, maxPrice?:string) {
           const flliter = {
            ...(title ? {title : Like(`%${title}%`)} : {}),
            ...(minPrice && maxPrice ? {price : Between(parseInt(minPrice ?? '0'),parseInt(maxPrice ?? '99999999999'))} : {})
           }
            return this.productRepository.find({where : flliter})
        }
       /**
        *  get singel prodect
        * @param id the id in prodct
        * @returns one prodect
        */
        public async getOneBy( id:number){
            const product = await this.productRepository.findOne({where: {id}})
            if(!product){
                throw new NotFoundException('Prodect is not Found')
                 
            }
                
            return product
    
        }


       /**
        *   Update Prodect
        * @param id the id in prodect
        * @param dto the data of update prodect
        * @returns updated the prodect
        */
        public async UpdateProdect ( id :number ,  dto:UpdateProdect){
            const prodect = await this.getOneBy(id)
            prodect.title = dto.title ?? prodect.title
            prodect.description = dto.description ?? prodect.description
            prodect.price = dto.price ?? prodect.price
            await this.productRepository.save(prodect)
            return {product: prodect, message : 'Update secsassfly'}
        }
    
         /**
       * Delete One Product By Id
       */
        public async DeleteProdect ( id :number ){
            const prodect =await this.getOneBy(id)
            await this.productRepository.remove(prodect)
            return {message : 'Delete secsassfly'}
        }

}