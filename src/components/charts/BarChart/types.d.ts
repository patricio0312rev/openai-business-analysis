import { Data } from "../../../types";
import { BarControllerChartOptions, CoreChartOptions, DatasetChartOptions, ElementChartOptions, PluginChartOptions } from "chart.js";

export type BarChartProps = {
    data: Data[];
};

export type ChartJSOptions = _DeepPartialObject<CoreChartOptions<"bar"> & ElementChartOptions<"bar"> & PluginChartOptions<"bar"> & DatasetChartOptions<"bar"> & BarControllerChartOptions>

