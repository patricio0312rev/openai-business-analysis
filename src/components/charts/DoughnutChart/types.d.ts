import { Data } from "../../../types";
import { BarControllerChartOptions, CoreChartOptions, DatasetChartOptions, ElementChartOptions, PluginChartOptions } from "chart.js";

export type DoughnoutChartProps = {
    data: Data[];
};

export type ChartJSOptions = _DeepPartialObject<CoreChartOptions<"doughnut"> & ElementChartOptions<"doughnut"> & PluginChartOptions<"doughnut"> & DatasetChartOptions<"doughnut"> & BarControllerChartOptions>

