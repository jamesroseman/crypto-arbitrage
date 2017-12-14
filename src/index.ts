import * as chalk from "chalk";
import * as WebRequest from "web-request";
import * as WebSocket from "ws";
import {
  BitfinexExchange,
  BitfinexStreamTickerRequest,
  GdaxExchange,
  GdaxStreamTickerRequest,
  OKCoinExchange,
  OKCoinStreamTickerRequest,
} from "./models";
import { CryptoCurrencies, Currencies, ITickerUpdate } from "./types";

// General configuration

const cryptoCurrencies: CryptoCurrencies[] = [
  CryptoCurrencies.Bitcoin,
  CryptoCurrencies.Ethereum,
  CryptoCurrencies.Litecoin,
];

const onTickerUpdate = (exchangeName: string) =>
  (update: ITickerUpdate) =>
    console.log(formatTickerUpdate(update, exchangeName));

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
  } else {
    message += "(" + chalk.green("GDAX") + ")";
  }
  return(message);
};

// Bitfinex
const bitfinexExchange: BitfinexExchange = new BitfinexExchange(onTickerUpdate("Bitfinex"));
const bitfinexRequest: BitfinexStreamTickerRequest = new BitfinexStreamTickerRequest(
  cryptoCurrencies,
  Currencies.USD,
);
bitfinexExchange.streamTickerPrices(bitfinexRequest);

// Gdax
const gdaxExchange: GdaxExchange = new GdaxExchange(onTickerUpdate("GDAX"));
const gdaxRequest: GdaxStreamTickerRequest = new GdaxStreamTickerRequest(
  cryptoCurrencies,
  Currencies.USD,
);
gdaxExchange.streamTickerPrices(gdaxRequest);
