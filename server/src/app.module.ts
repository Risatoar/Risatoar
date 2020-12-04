import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { database } from '@config';
import CommonModule from '@modules/common/common.module';

@Module({
  imports: [
    WinstonModule.forRoot({}),
    TypeOrmModule.forRoot({
      ...database,
    }),
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
