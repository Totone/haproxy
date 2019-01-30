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
      timeoutId: '',
      offsetTime: 10000,
      valuesMaxLength: 10,
      proxy: 'https://cors-anywhere.herokuapp.com/',
    };

    this.handleValues = this.handleValues.bind(this);
    this.mapChartValues = this.mapChartValues.bind(this);
    this.switchMode = this.switchMode.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  componentDidMount() {
    this.updateChart();
  }

  /**
   * Add the next value in the array and resize it if exceeds the max length
   * @param newValue: the last value to add to the array
   * @param maxLength: max length of the array 
   */ 
  handleValues(newValue, maxLength = this.state.valuesMaxLength) {
    const newArray = this.state.values;
    newArray.push(newValue)
    while (newArray.length > maxLength) {
      newArray.shift(); 
    }
    this.setState({values: newArray});
  }

  /**
   * Make the request to get the new value
   * @param offsetTime: time between each request (in ms)
   */
  updateChart(offsetTime = this.state.offsetTime) {
    // call itself every 10 secs
    this.setState({timeoutId: setTimeout(this.updateChart, offsetTime)});

    axios.get(`${this.state.proxy}http://demo.haproxy.org/;csv`)
    .then( response => {
      this.handleValues(this.getNextValue(response.data));
      // equivalent: 
      // const csv = response.data;
      // const newValue = this.getNextValue(csv);
      // this.handleValues(newValue);
    })
    .catch(error => {
      console.log(error);
      this.handleValues('Connexion error');
    })

    // random number to emulate the request
    // this.handleValues(parseInt(Math.random()*500+25));
  }
  
  /**
   * Return the expected value from the csv returned by the request 
   * @param csv: Response received when request is done
   */
  getNextValue(csv) {
    let attr = [];
    let tab = [];

    let row = 0;
    for (let line of csv.split('\n')) {
      let column = 1;

      if (row === 0) {
        for (let value of line.split(',')) {
          attr[column++] = (
            value === "# pxname" 
            ? "pxname" 
            : value
          ); 
        }
      } else {
        tab[row] = {};
        for (let value of line.split(',')) {
          tab[row][attr[column++]] = value;
        }
      }
      row++;  
    }

    for (let row in tab) {
      if (tab[row]['svname'] === 'FRONTEND')
        return (tab[row]['stot']);
    }
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
