import React, { Component } from 'react';
import axios from 'axios';

import Chart from './components/chart/chart';
import ValuesArray from './components/valuesArray/valuesArray';

import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
      count: 0,
      timeoutId: '',
    };

    this.updateChart = this.updateChart.bind(this);
    this.resizeValues = this.resizeValues.bind(this);
    this.mapChartValues = this.mapChartValues.bind(this);
    this.switchMode = this.switchMode.bind(this);
  }

  componentDidMount() {
    this.updateChart();
  }

  /**
   * Resize the array if it exceeds the max length
   * @param maxLength: max length of the array 
   */ 
  resizeValues(maxLength = 10) {
    const newArray = this.state.values;
    let changed = false;
    while (newArray.length > maxLength) {
      newArray.shift(); 
      changed = true;
    }
    if (changed)
      this.setState({values: newArray});
  }

  /**
   * Make the request to get the new value
   * @param offsetTime: time between each request (in ms)
   */
  updateChart(offsetTime = 3000) {
    const {values} = this.state;

    // call itself every 10 secs
    this.setState({timeoutId: setTimeout(this.updateChart, offsetTime)});

    // axios.get('http://demo.haproxy.org/;csv')
    // .then( response => {
    // })
    // .catch(error => {
    //   console.log(error)
    // })

    // random number to emulate the request
    values.push(parseInt(Math.random()*500+25));
    this.setState({values: values});
    this.resizeValues();
  }
  
  /**
   * Map getted values into the chart
   * @param values: array containing the values to map to the chart
   */
  mapChartValues (values = this.state.values) {
    const array = [];

    values.forEach((value, index) => {
      const item = {x: index, y: value}
      array.push(item);
    });
    return array;
  }

  /**
   * Switch mode between work and pause when click on the button
   * @param e: event (e.target to get button)
   */
  switchMode(e) {
    const button = e.target;
    if (button.className === 'App-chart-button-play') {
      button.className = 'App-chart-button-pause';
      button.innerHTML = 'Paused';
      clearTimeout(this.state.timeoutId);
    } else {
      this.setState({timeoutId: setTimeout(this.updateChart, 0)});
      button.className = 'App-chart-button-play';
      button.innerHTML = 'Working';
    }
  }

  render() {
    const {values} = this.state;
    const data = [{
      color: "steelblue",
      points: this.mapChartValues(),
    }];
    return (
      <article className="App">
        <h1>HaProxy</h1>
        <section className="App-responsive">
          <section className="App-chart">
            <Chart data={data}/>
            <div style={{marginTop:2+'em'}}>
              <button 
                onClick={this.switchMode}
                className="App-chart-button-play"
              >
                Click to pause
              </button>
            </div>
          </section>  
          <ValuesArray data={values}/>
        </section>
      </article>
    );
  }
}

export default App;
