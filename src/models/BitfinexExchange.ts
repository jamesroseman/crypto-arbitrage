import {
  BitfinexGetTickerRequest,
} from "../models";
import {
  IExchange,
} from "../types";

export class BitfinexExchange implements IExchange {

  public streamTickerPrices(req: BitfinexGetTickerRequest): void {
    return;
  }
}
