import { CryptoCurrencies, Currencies } from "./Currency";
import { Exchange } from "./Exchange";
import { ExchangeState } from "./ExchangeState";
import { IStreamTickerRequest } from "./ExchangeStreamTickerRequest";
import { ITickerUpdate } from "./TickerUpdate";

export interface IMarket {
  streamTickerPrices(req: IStreamTickerRequest): void;
}

export class Market implements IMarket {
  private exchanges: Exchange[] = [];

  constructor(
    exchanges: Exchange[],
    onTickerUpdate: (update: ITickerUpdate, state: ExchangeState) => void,
  ) {
    this.exchanges = exchanges;
    this.exchanges.forEach((e: Exchange) => {
      const currentOnTickerUpdate = e.getOnTickerUpdate();
    })
  }
}
