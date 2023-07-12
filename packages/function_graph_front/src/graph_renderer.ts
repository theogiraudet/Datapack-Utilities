import * as echarts from 'echarts/core';
import { LegendComponentOption } from 'echarts/components';
import { GraphSeriesOption } from 'echarts/charts';
import { GraphCategory, GraphLink, GraphNode } from './d3/D3Graph';

// echarts.use([LegendComponent, GraphChart, SVGRenderer]);

type EChartsOption = echarts.ComposeOption<
  LegendComponentOption | GraphSeriesOption
>;
//   }
  
  export function generateOptions(nodes: GraphNode[], categories: GraphCategory[], links: GraphLink[]): EChartsOption {
      return {
        // legend: {
        //   data: ['HTMLElement', 'WebGL', 'SVG', 'CSS', 'Other']
        // },
        series: [
          {
            type: 'graph',
            layout: 'force',
            animation: false,
            label: {
              position: 'right',
              formatter: '{b}'
            },
            draggable: false,
            data: (nodes as any).map(function (node: GraphNode, idx: number) {
              node.id = idx + "";
              return node;
            }),
            categories: categories,
            force: {
              edgeLength: 2,
              repulsion: 60,
              gravity: 0.2
            },
            edges: links
          }
        ]
      };
  }