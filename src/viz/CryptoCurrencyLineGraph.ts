import * as blessed from "blessed";
import * as contrib from "blessed-contrib";
import * as io from "socket.io";
import {
  CryptoCurrencies,
  ILineGraphData,
  ILineGraphOptions,
  IMarket,
  IMarketPrice,
  IMarketState,
} from "../types";

// TODO: add non-exclusive isSellingPrice to display both sell and buys!
export interface ICryptoCurrencyLineGraphOptions {
  // Is this graph displaying ask price?
  isAskPrice: boolean;
  // Is this graph displaying bid price?
  isBidPrice: boolean;
  options: {
    [exchangeName: string]: ILineGraphOptions;
  };
}

// A line graph where each line represents a different exchange
export class CryptoCurrencyLineGraph {
  private cryptoCurrency: CryptoCurrencies;
  private exchangeNames: string[];
  private marketState: IMarketState;
  private defaultOptions: ILineGraphOptions;
  private maxHistoryLength: number;

  constructor(
    cryptoCurrency: CryptoCurrencies,
    exchangeNames: string[],
    market: IMarket,
    maxHistoryLength: number = 10,
  ) {
    this.cryptoCurrency = cryptoCurrency;
    this.exchangeNames = exchangeNames;
    this.marketState = market.state;
    this.defaultOptions = this.createOptionsFromColor("yellow");
    this.maxHistoryLength = maxHistoryLength;
  }

  public createOptionsFromColor = (color: string) => {
    return {
      line: color,
      style: {
        line: color,
      },
    } as ILineGraphOptions;
  }

  public getLineGraphData = (graphOptions: ICryptoCurrencyLineGraphOptions) => {
    // Get the timestamp labels
    const prices: IMarketPrice[] = this.marketState[this.cryptoCurrency].prices;
    const timestamps: number[] = this.marketState[this.cryptoCurrency].timestamps;
    const timestampLabels: string[] = timestamps.map(this.getLabelFromTimestamp);
    // De-dupe prices and timestamps
    for (let i = 1; i < timestampLabels.length ; i++) {
      if (timestampLabels[i] === timestampLabels[i - 1]) {
        prices.splice(i, i);
        timestamps.splice(i, i);
        timestampLabels.splice(i, i);
      }
    }
    // Trim prices and timestamps, to keep under max
    if (timestamps.length > this.maxHistoryLength) {
      prices.splice(0, prices.length - this.maxHistoryLength);
      timestamps.splice(0, timestamps.length - this.maxHistoryLength);
      timestampLabels.splice(0, timestampLabels.length - this.maxHistoryLength);
    }
    const graphData: ILineGraphData[] = [];
    this.exchangeNames.forEach((exchangeName) => {
      // Set graphOptions
      let options: ILineGraphOptions = this.defaultOptions;
      if (graphOptions.options.hasOwnProperty(exchangeName)) {
        options = graphOptions.options[exchangeName];
      }
      if (graphOptions.isAskPrice) {
        graphData.push({
          style: options,
          title: exchangeName + " (B)",
          x: timestampLabels,
          y: this.getDatapointsFromExchange(exchangeName, true, prices),
        } as ILineGraphData);
      }
      if (graphOptions.isBidPrice) {
        graphData.push({
          style: options,
          title: exchangeName + " (S)",
          x: timestampLabels,
          y: this.getDatapointsFromExchange(exchangeName, false, prices),
        } as ILineGraphData);
      }
    });
    return graphData;
  }

  private getDatapointsFromExchange = (
    exchangeName: string,
    isAskPrice: boolean,
    prices: IMarketPrice[],
  ) =>
    prices.map((price: IMarketPrice) => {
      if (price.exchangePrices.hasOwnProperty(exchangeName)) {
        if (isAskPrice) {
          return price.exchangePrices[exchangeName].askPrice;
        } else {
          return price.exchangePrices[exchangeName].bidPrice;
        }
      } else {
        return 0;
      }
    })

  private getLabelFromTimestamp = (ts: number) => {
    const date: Date = new Date(ts);
    const minutes: number = date.getMinutes();
    const seconds: number = date.getSeconds();
    return minutes + ":" + seconds;
  }
}
