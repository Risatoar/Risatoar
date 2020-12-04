import { Controller } from '@nestjs/common';
import CommonService from '@modules/common/common.service';

@Controller('/')
export default class CommonController {
  constructor(private readonly commonService: CommonService) {}
}
