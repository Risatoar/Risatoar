import { Module } from '@nestjs/common';
import CommonService from '@modules/common/common.service';
import CommonController from '@modules/common/common.controller';

@Module({
  imports: [],
  controllers: [CommonController],
  providers: [CommonService],
})
export default class CommonModule {}