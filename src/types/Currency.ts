export enum Currencies {
  USD = "USD",
  XBT = "XBT",
}

export enum CryptoCurrencies {
  Bitcoin = "BTC",
  Ethereum = "ETH",
  Litecoin = "LTC",
}

export const AllCryptoCurrencies: CryptoCurrencies[] = [
  CryptoCurrencies.Bitcoin,
  CryptoCurrencies.Ethereum,
  CryptoCurrencies.Litecoin,
];

export interface ICurrencyPair {
  cryptoCurrency: CryptoCurrencies;
  currency: Currencies;
}
