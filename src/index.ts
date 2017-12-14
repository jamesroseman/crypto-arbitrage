import * as chalk from "chalk";
import * as WebRequest from "web-request";
import * as WebSocket from "ws";
import {
  BitfinexExchange,
  BitmexExchange,
  GdaxExchange,
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
  } else if (exchangeName === "GDAX") {
    message += "(" + chalk.green("GDAX") + ")";
  } else if (exchangeName === "BTMX") {
    message += "(" + chalk.blue("BTMX") + ")";
  }
  return(message);
};

// Bitfinex
const bitfinexExchange: BitfinexExchange = new BitfinexExchange(onTickerUpdate("Bitfinex"));
const bitfinexRequest: ExchangeStreamTickerRequest = new ExchangeStreamTickerRequest(
  cryptoCurrencies,
  Currencies.USD,
);
// bitfinexExchange.streamTickerPrices(bitfinexRequest);

// Gdax
const gdaxExchange: GdaxExchange = new GdaxExchange(onTickerUpdate("GDAX"));
const gdaxRequest: ExchangeStreamTickerRequest = new ExchangeStreamTickerRequest(
  cryptoCurrencies,
  Currencies.USD,
);
// gdaxExchange.streamTickerPrices(gdaxRequest);

// BitMEX
const bitmexExchange: BitmexExchange = new BitmexExchange(onTickerUpdate("BTMX"));
const bitmexRequest: ExchangeStreamTickerRequest = new ExchangeStreamTickerRequest(
  cryptoCurrencies,
  Currencies.USD,
);
// bitmexExchange.streamTickerPrices(bitmexRequest);

/* Testing */

// "wss://real.okcoin.com:10440/websocket"
// const bitmexUrl = "wss://www.bitmex.com/realtime";
// const bitmexWss = new WebSocket(bitmexUrl);
// bitmexWss.onmessage = (msg) => console.log(JSON.parse(msg.data));
// bitmexWss.onopen = () => {
//   bitmexWss.send(JSON.stringify({
//     args: ["orderBookL2:ETH", "orderBookL2:LTC", "orderBookL2:XBTUSD"],
//     op: "subscribe",
//   }));
  // bitmexWss.send(JSON.stringify({
  //   event: "addChannel",
  //   channel: "ok_sub_spot_ltc_usd_ticker",
  // }));
// };
