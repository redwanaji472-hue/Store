import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ProductModule } from './products/product.Module';
import { ReviewModule } from './reviews/review.module';
import { UserModule } from './users/user.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import {ConfigModule, ConfigService} from '@nestjs/config'
import { Review } from './reviews/reviews.entity';
import { User } from './users/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'secound_project',
    }),
    ProductModule ,
    ReviewModule,
    UserModule,
    TypeOrmModule.forRootAsync({
     inject:[ConfigService],
     useFactory:(config:ConfigService)=>{
      return{
        type: 'postgres',
        host: 'localhost',
        port: config.get<number>("DB_PORT"),
        username: config.get<string>("DB_USERNAME"),
        password: config.get<string>("DB_PASSWORD"),
       database: config.get<string>("DB_NAME"),
        synchronize: process.env.NODE_ENV!=='production',
       entities: [Product,Review,User],
      }
     }
    }),
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:`.env.${process.env.NODE_ENV}`
    })

  ],
  providers:[{
    provide:APP_INTERCEPTOR,
    useClass:ClassSerializerInterceptor
  }]

})
export class AppModule {}


/**
 * 
 *  
 */