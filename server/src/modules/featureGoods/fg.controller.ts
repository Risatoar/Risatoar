import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import FGService from '@modules/featureGoods/fg.service';
import { Observable, from, of, interval, concat, take } from 'rxjs';

@Controller('fg')
export default class FGController {
  constructor(private readonly fgService: FGService) {}

  @Get('/third')
  getThirdData(@Query() query): string {
    console.log(`params`, query);
    return this.fgService.getThirdData(query) as any;
  }

  @Post('/data')
  getFGData() {}

  @Post('/mock')
  onMock(@Body() body) {
    return this.fgService.onDealMock(body);
  }

  @Get('/test')
  test() {
    // const observer = new Observable((ob) => ob.next(33));
    // observer.subscribe((x) => console.log(x, 'sss'));
    // from([1, 2, 3]).subscribe((x) => console.log(x, 'xxx'));
    // const a = of(1, 2, 3);
    // const b = of('a', 'b', 'c');
    // const intervalO = interval(500);
    // concat(a, b, intervalO).subscribe((x) => console.log(x, 'xx'));
    const fromObserver = from(
      Array(10)
        .fill(1)
        .map((__, i) => i),
    ).pipe(take(5));
    fromObserver.subscribe((x) => console.log(x, 'xxx'));
  }
}
