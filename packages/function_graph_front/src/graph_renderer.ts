import * as echarts from 'echarts/core';
import { LegendComponent, LegendComponentOption } from 'echarts/components';
import { GraphChart, GraphSeriesOption } from 'echarts/charts';
import { SVGRenderer } from 'echarts/renderers';
import { D3Graph, GraphCategory, GraphLink, GraphNode } from './D3Graph';

// echarts.use([LegendComponent, GraphChart, SVGRenderer]);

type EChartsOption = echarts.ComposeOption<
  LegendComponentOption | GraphSeriesOption
>;


// var chartDom = document.getElementById('main')!;
// var myChart = echarts.init(chartDom);


// export function displayLoader() {
//     myChart.showLoading();
// }

// export function renderGraph(data: D3Graph) {
//     const option = generateOptions(data.nodes, data.categories, data.edges);
//     myChart.setOption(option);
//     myChart.hideLoading();
//     window.addEventListener('resize', myChart.resize as any);
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