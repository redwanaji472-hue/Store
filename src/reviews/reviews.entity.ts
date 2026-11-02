import { Column,
       CreateDateColumn,
       Entity,
       ManyToOne,
       PrimaryGeneratedColumn,
       UpdateDateColumn
 } from "typeorm";
import { CURRENT_TIMESTAMP } from "../utils/constant";
import { User } from "../users/user.entity";
import { Product } from "../products/product.entity";





@Entity({name:"reviews"})
export class Review{
    @PrimaryGeneratedColumn()
       id:number;
    @Column()
       rating:number;
    @Column()
       comment:string;
    @CreateDateColumn({type : 'timestamp' , default : () => CURRENT_TIMESTAMP})
       createdAt : Date;
    @UpdateDateColumn({type : 'timestamp' , default : () => CURRENT_TIMESTAMP, onUpdate : CURRENT_TIMESTAMP})
        updatedAt : Date;
 
    @ManyToOne(()=>User, (user)=>user.review,{onDelete : 'CASCADE'})
    user:User;
    @ManyToOne(()=>Product, (prodect)=>prodect.review,{onDelete : 'CASCADE'})
    prodect:Product;
}