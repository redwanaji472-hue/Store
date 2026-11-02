import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import {UserTye} from  '../utils/enum'
import { Product } from "../products/product.entity";
import { Review } from "../reviews/reviews.entity";
import { CURRENT_TIMESTAMP } from "../utils/constant";
import { Exclude } from "class-transformer";


@Entity({name:"users"})
export class User{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type:'varchar',length:150,nullable:true})
    username:string;
    @Column({type:'varchar',length:250,unique:true})
    email:string;
    @Column()
    @Exclude()
    password:string;
    @Column({default:UserTye.NORMAL_USER})
    userType:UserTye;
    @Column({default :false})
    isAccountVerified:boolean;
      @CreateDateColumn({type : 'timestamp' , default : () => CURRENT_TIMESTAMP})
    createdAt : Date;
    @UpdateDateColumn({type : 'timestamp' , default : () => CURRENT_TIMESTAMP, onUpdate : CURRENT_TIMESTAMP})
     updatedAt : Date;
    @OneToMany(()=>Product,(product)=>product.user)
    product:Product[]

    @OneToMany(()=>Review,(review)=>review.user)
    review:Review[]
}