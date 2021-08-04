import { Module } from '@nestjs/common';
import FGService from '@modules/featureGoods/fg.service';
import FGController from '@modules/featureGoods/fg.controller';

@Module({
  imports: [],
  controllers: [FGController],
  providers: [FGService],
})
export default class FGModule {}
