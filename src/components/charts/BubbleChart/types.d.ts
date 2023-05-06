import { Data } from "../../../types";
import { BubbleController, CoreChartOptions, DatasetChartOptions, ElementChartOptions, PluginChartOptions } from "chart.js";

export type BubbleChartProps = {
    data: Data[];
};

export type ChartJSOptions = _DeepPartialObject<CoreChartOptions<"bubble"> & ElementChartOptions<"bubble"> & PluginChartOptions<"bubble"> & DatasetChartOptions<"bubble"> & BubbleController>

