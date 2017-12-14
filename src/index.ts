import * as WebRequest from "web-request";

import * as WebSocket from "ws";

import { BitfinexExchange, BitfinexStreamTickerRequest } from "./models";
import { CryptoCurrencies, Currencies, ITickerUpdate } from "./types";

const bitfinexExchange: BitfinexExchange = new BitfinexExchange(
  (update: ITickerUpdate) => {
    console.log("- - - BITFINEX - - -");
    console.log(update.cryptoCurrency);
    console.log("Selling at: " + update.sellingPrice);
    console.log("Buying at: " + update.buyingPrice);
    console.log("Spread at: " + (update.buyingPrice - update.sellingPrice));
  },
);

const request: BitfinexStreamTickerRequest = new BitfinexStreamTickerRequest(
  [CryptoCurrencies.Bitcoin, CryptoCurrencies.Ethereum, CryptoCurrencies.Litecoin],
  Currencies.USD,
);
bitfinexExchange.streamTickerPrices(request);

// const wss = new WebSocket("wss://api.bitfinex.com/ws");
// wss.onmessage = (msg) => console.log(msg.data);
// wss.onopen = () => {
//   wss.send(JSON.stringify({
//     channel: "ticker",
//     event: "subscribe",
//     pair: "BTCUSD",
//   }));
//   wss.send(JSON.stringify({
//     channel: "ticker",
//     event: "subscribe",
//     pair: "ETHUSD",
//   }));
//   wss.send(JSON.stringify({
//     channel: "ticker",
//     event: "subscribe",
//     pair: "LTCUSD",
//   }));
// };

// const gdaxWss = new WebSocket("wss://ws-feed.gdax.com");
// gdaxWss.onmessage = (msg) => console.log(msg.data);
// gdaxWss.onopen = () => {
//   gdaxWss.send(JSON.stringify({
//     channels: [
//         {
//             name: "ticker",
//             product_ids: [
//                 "BTC-USD",
//                 "ETH-USD",
//                 "LTC-USD",
//             ],
//         },
//     ],
//     product_ids: [
//         "BTC-USD",
//         "ETH-USD",
//         "LTC-USD",
//     ],
//     type: "subscribe",
//   }));
// };
