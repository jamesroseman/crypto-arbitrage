import { CryptoCurrencies, Currencies } from "./Currency";
import { IExchangeState } from "./ExchangeState";
import { ITickerUpdate } from "./Ticker";

export interface IStreamTickerRequest {
  onTickerUpdate: (update: ITickerUpdate, state: IExchangeState) => void;
}

export class ExchangeStreamTickerRequest implements IStreamTickerRequest {
  public cryptoCurrencies: CryptoCurrencies[];
  public currency: Currencies;
  public onTickerUpdate: (update: ITickerUpdate, state: IExchangeState) => void;

  constructor(
    cryptoCurrencies: CryptoCurrencies[],
    currency: Currencies,
    onTickerUpdate: (update: ITickerUpdate, state: IExchangeState) => void,
  ) {
    this.cryptoCurrencies = cryptoCurrencies;
    this.currency = currency;
    this.onTickerUpdate = onTickerUpdate;
  }
}
