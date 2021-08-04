import { Injectable } from '@nestjs/common';
import {
  THIRD_ETF_TYPE_MAP,
  THIRD_FETCH_URL,
  THIRD_HQ_TYPE_MAP,
} from '@src/constants/fg';
import dayjs = require('dayjs');
import { isQueryMatchCache, thirdPost } from '@src/utils/fg';
const isBetween = require('dayjs/plugin/isBetween');

dayjs.extend(isBetween);

interface ThirdDataOption {
  type: FGTypes;
  action: 'etf' | 'hq' | 'close';
}

interface DealMockOption {
  type: FGTypes;
  action: 'base';
  startTime: string;
  endTime: string;
  timeRangeType: '1' | '1D';
  gain: number;
}

@Injectable()
export default class FGService {
  etfCache: StateCache = [];

  /** 获取三方数据 */
  public getThirdData({ type, action }: ThirdDataOption) {
    switch (action) {
      case 'etf':
        return this.getEtfInventory(type);
      case 'hq':
        return this.getRealTimeData(type);
      case 'close':
        return this.getClosingPrice(type);
      default:
        return {};
    }
  }

  /** 模拟下单 */
  public onDealMock({
    type,
    action,
    startTime,
    endTime,
    timeRangeType,
    gain = 10,
  }: DealMockOption) {
    switch (action) {
      case 'base':
        return this.mockOpenPriceDeal({
          type,
          startTime,
          endTime,
          timeRangeType,
        });
      default:
        return {};
    }
  }

  /** 获取 etf 持仓数据 */
  private async getEtfInventory(type: FGTypes) {
    const etfType = THIRD_ETF_TYPE_MAP[type];

    const body = {
      'last_etf[type]': etfType,
      'last_etf[fdate]': dayjs()
        .startOf('day')
        .valueOf()
        .toString()
        .substr(0, 10),
      'last_etf[sdate]': dayjs()
        .startOf('day')
        .subtract(7, 'day')
        .valueOf()
        .toString()
        .substr(0, 10),
    };

    const matchCache = isQueryMatchCache(body, this.etfCache);

    if (matchCache) {
      return matchCache;
    }

    const resp = await thirdPost(THIRD_FETCH_URL.etf, body);

    this.etfCache.push({
      query: body,
      data: resp,
    });

    return resp?.last_etf || [];
  }

  /** 获取行情数据 */
  private async getRealTimeData(type: FGTypes) {
    const hqType = THIRD_HQ_TYPE_MAP[type];

    const body = {
      interval: 1,
      code: hqType,
    };

    const resp = await thirdPost(THIRD_FETCH_URL.hq, body);

    // return (resp?.list as any[])[resp?.list?.length - 1]?.close;
    return resp?.list || [];
  }

  /** 获取当天收盘价 */
  private async getClosingPrice(type: FGTypes) {
    const data = await this.getRealTimeData(type);

    return {
      price: data[data?.length - 1]?.close,
      time: data[data?.length - 1]?.TS,
    };
  }

  /** 模拟开盘价上下法推算最优三条方案 */
  private async mockOpenPriceDeal({
    type = 'ag',
    startTime = dayjs().subtract(100, 'days').format('YYYY-MM-DD'),
    endTime = dayjs().format('YYYY-MM-DD'),
    timeRangeType = '1D',
  }: {
    type: FGTypes;
    startTime: string;
    endTime: string;
    timeRangeType: string;
  }) {
    const hqType = THIRD_HQ_TYPE_MAP[type];

    const body = {
      interval: timeRangeType,
      code: hqType,
    };

    const resp = await thirdPost(THIRD_FETCH_URL.hq, body);

    const dayDiff = dayjs(endTime).diff(startTime, 'day');

    const data = [];

    for (let rate = 1; rate <= 5; rate += 0.5) {
      for (let i = 10; i <= 100; i += 1) {
        const inRangeData = (resp?.list as any[])?.filter(({ T }) =>
          (dayjs(Number(`${T}000`)) as any).isBetween(
            dayjs(startTime),
            dayjs(endTime),
          ),
        );

        const earnRange = inRangeData.filter(
          ({ open, high, low }) => open + i <= high && open - i >= low,
        );

        const earns = inRangeData.reduce((prev, acc) => {
          const lowEarn = acc.open - i < acc.low ? -(i * rate) : i;
          const highEarn = acc.open + i > acc.high ? -(i * rate) : i;
          return prev + lowEarn + highEarn - 8;
        }, 0);

        const earnRate = earnRange.length / inRangeData.length;

        if (earnRate > 0.7 && earns > 0) {
          data.push({
            totalDays: inRangeData.length,
            earnDays: earnRange.length,
            earnRate: earnRange.length / inRangeData.length,
            zsRate: rate,
            gain: i,
            earns,
            timeRange: `${startTime} - ${endTime}`,
          });
        }
      }
    }

    const avgEarns =
      data.reduce((prev, acc) => acc.earns + prev, 0) / data.length;

    return data
      .filter(({ earns }) => earns > avgEarns)
      .sort((a, b) => b.earns - a.earns)
      .slice(0, 3);
  }
}
