import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import CommonModule from '@modules/common/common.module';
import FGModule from '@modules/featureGoods/fg.module';

@Module({
  imports: [WinstonModule.forRoot({}), CommonModule, FGModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
