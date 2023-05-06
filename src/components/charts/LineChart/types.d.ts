import { Data } from "../../../types";
import { CoreChartOptions, DatasetChartOptions, ElementChartOptions, LineControllerChartOptions, PluginChartOptions } from "chart.js";

export type LineChartProps = {
    data: Data[];
};

export type ChartJSOptions = _DeepPartialObject<CoreChartOptions<"line"> & ElementChartOptions<"line"> & PluginChartOptions<"line"> & DatasetChartOptions<"line"> & LineControllerChartOptions>

