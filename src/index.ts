import * as WebRequest from "web-request";

import * as WebSocket from "ws";

const wss = new WebSocket("wss://api.bitfinex.com/ws");
wss.onmessage = (msg) => console.log(msg.data);
wss.onopen = () => {
  wss.send(JSON.stringify({
    channel: "ticker",
    event: "subscribe",
    pair: "BTCUSD",
  }));
  wss.send(JSON.stringify({
    channel: "ticker",
    event: "subscribe",
    pair: "ETHUSD",
  }));
  wss.send(JSON.stringify({
    channel: "ticker",
    event: "subscribe",
    pair: "LTCUSD",
  }));
};

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
