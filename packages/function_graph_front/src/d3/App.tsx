import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { D3Graph } from './D3Graph';
import { AskGraphQuery, isQuery } from '../protocol_messages';
import { generateOptions } from '../graph_renderer';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { GraphChart } from 'echarts/charts';
import { LegendComponent } from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import * as echarts from 'echarts/core';

echarts.use([LegendComponent, GraphChart, SVGRenderer]);

interface vscode {
  postMessage(message: any): void;
}

declare const vscode: vscode;

export function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}


export function App2() {

  const [graph, setGraph] = useState<D3Graph>(new D3Graph());

  useEffect(() => {
    console.log("useEffect");
    console.log("Ask for graph")
    const askGraph: AskGraphQuery = {payloadName: 'ask_graph'};
    vscode.postMessage(askGraph);
    window.addEventListener('message', event => { 
      console.log("Receive graph");
      if(isQuery(event.data) && event.data.payloadName === 'graph_payload') { 
        setGraph(event.data.graph)
      } 
    })
  }, [])


  return (
    <div className="App">
      <header className="App-header">
      <ReactEChartsCore
      echarts={echarts}
        option={generateOptions(graph.nodes, graph.categories, graph.edges)}
        style={{width: window.innerWidth, height: window.innerHeight}}
        showLoading={true}
        // notMerge={true}
        // lazyUpdate={true}
        // theme={"theme_name"}
        // onChartReady={this.onChartReadyCallback}
        // onEvents={EventsDict}
        opts={{renderer: 'svg' }}
        
        onEvents={{"size": (chart: any) => { console.log("foo"); window.addEventListener('resize', chart.resize as any); } }}
      />
      </header>
    </div>
  );
}



