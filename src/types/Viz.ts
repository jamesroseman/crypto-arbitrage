export interface ILineGraphOptions {
  style: {
    line: string,
  };
}

export interface ILineGraphData {
  title: string;
  x: string[];
  y: number[];
  style: ILineGraphOptions;
}
