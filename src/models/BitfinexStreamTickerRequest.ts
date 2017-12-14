import {
  CryptoCurrencies,
  Currencies,
  ExchangeRequestType,
  IStreamTickerRequest,
  ITickerUpdate,
} from "../types";

export class BitfinexStreamTickerRequest implements IStreamTickerRequest {
  public cryptoCurrencies: CryptoCurrencies[];
  public currency: Currencies;
  public requestType: ExchangeRequestType;

  constructor(cryptoCurrencies: CryptoCurrencies[], currency: Currencies) {
    this.cryptoCurrencies = cryptoCurrencies;
    this.currency = currency;
    this.requestType = ExchangeRequestType.GetTickerPrice;
  }

  // TODO(jroseman): get this to do something
  public onPriceUpdate(update: ITickerUpdate) {
    console.log("Currency: ", update.cryptoCurrency);
    console.log("Price: $", update.price);
    return;
  }
}
