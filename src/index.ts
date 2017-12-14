import * as chalk from "chalk";
import * as WebRequest from "web-request";
import * as WebSocket from "ws";
import {
  BitfinexExchange,
  BitmexExchange,
  GdaxExchange,
  OKCoinExchange,
} from "./models";
import {
  CryptoCurrencies,
  Currencies,
  ExchangeStreamTickerRequest,
  ITickerUpdate,
} from "./types";

// General configuration

const cryptoCurrencies: CryptoCurrencies[] = [
  CryptoCurrencies.Bitcoin,
  // CryptoCurrencies.Ethereum,
  // CryptoCurrencies.Litecoin,
];

const onTickerUpdate = (exchangeName: string) =>
  (update: ITickerUpdate) => {
    const date: Date = new Date(update.timestamp);
    console.log(date.toLocaleTimeString() + " " + formatTickerUpdate(update, exchangeName));
  };

const formatTickerUpdate = (update: ITickerUpdate, exchangeName: string) => {
  let message: string = "";
  if (update.cryptoCurrency === CryptoCurrencies.Bitcoin) {
    message += chalk.red("BTC: ");
  } else if (update.cryptoCurrency === CryptoCurrencies.Ethereum) {
    message += chalk.yellow("ETH: ");
  } else {
    message += chalk.blue("LTC: ");
  }
  message += update.buyingPrice + " ";
  if (exchangeName === "Bitfinex") {
    message += "(" + chalk.red("BFNX") + ")";
  } else if (exchangeName === "GDAX") {
    message += "(" + chalk.green("GDAX") + ")";
  } else if (exchangeName === "BTMX") {
    message += "(" + chalk.blue("BTMX") + ")";
  } else if (exchangeName === "OKCOIN") {
    message += "(" + chalk.yellow("OKCOIN") + ")";
  }
  return(message);
};

// Bitfinex
const bitfinexExchange: BitfinexExchange = new BitfinexExchange(onTickerUpdate("Bitfinex"));
const bitfinexRequest: ExchangeStreamTickerRequest = new ExchangeStreamTickerRequest(
  cryptoCurrencies,
  Currencies.USD,
);
bitfinexExchange.streamTickerPrices(bitfinexRequest);

// Gdax
const gdaxExchange: GdaxExchange = new GdaxExchange(onTickerUpdate("GDAX"));
const gdaxRequest: ExchangeStreamTickerRequest = new ExchangeStreamTickerRequest(
  cryptoCurrencies,
  Currencies.USD,
);
gdaxExchange.streamTickerPrices(gdaxRequest);

// BitMEX
const bitmexExchange: BitmexExchange = new BitmexExchange(onTickerUpdate("BTMX"));
const bitmexRequest: ExchangeStreamTickerRequest = new ExchangeStreamTickerRequest(
  cryptoCurrencies,
  Currencies.USD,
);
bitmexExchange.streamTickerPrices(bitmexRequest);

// OKCoin
const okCoinExchange: OKCoinExchange = new OKCoinExchange(onTickerUpdate("OKCOIN"));
const okCoinRequest: ExchangeStreamTickerRequest = new ExchangeStreamTickerRequest(
  cryptoCurrencies,
  Currencies.USD,
);
okCoinExchange.streamTickerPrices(okCoinRequest);
