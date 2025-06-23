"use client";

import React from "react";
import {
  ChartComponent,
  ColumnSeries,
  SplineAreaSeries,
  Category,
  DataLabel,
  Tooltip,
  Inject,
  SeriesCollectionDirective,
  SeriesDirective,
} from "@syncfusion/ej2-react-charts";

interface Props {
  data: { day: string; count: number }[];
  id: string;
  title: string;
}

const ChartClient: React.FC<Props> = ({ data, id, title }) => {
  return (
    <>
      <ChartComponent
        id={id}
        primaryXAxis={{ valueType: "Category", title: "Day" }}
        primaryYAxis={{
          minimum: 0,
          maximum: 10,
          interval: 2,
          title: "Count",
        }}
        title={title}
        tooltip={{ enable: true }}
      >
        <Inject
          services={[
            ColumnSeries,
            SplineAreaSeries,
            Category,
            DataLabel,
            Tooltip,
          ]}
        />
        <SeriesCollectionDirective>
          <SeriesDirective
            dataSource={data}
            xName="day"
            yName="count"
            type="Column"
            name="Column"
            columnWidth={0.3}
            cornerRadius={{ topLeft: 10, topRight: 10 }}
          />
          <SeriesDirective
            dataSource={data}
            xName="day"
            yName="count"
            type="SplineArea"
            name="Wave"
            fill="rgba(71, 132, 238, 0.3)"
            border={{ width: 2, color: "#4784EE" }}
          />
        </SeriesCollectionDirective>
      </ChartComponent>
    </>
  );
};

export default ChartClient;
