export enum Currencies {
  USD = "USD",
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
