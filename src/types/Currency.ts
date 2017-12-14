export enum Currencies {
  USD = "USD",
  XBT = "XBT",
}

export enum CryptoCurrencies {
  Bitcoin = "BTC",
  Ethereum = "ETH",
  Litecoin = "LTC",
}

export interface ICurrencyPair {
  cryptoCurrency: CryptoCurrencies;
  currency: Currencies;
}
