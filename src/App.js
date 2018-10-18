import React, { Component } from 'react';
import styled from 'styled-components'; 
import repeat from './repeat.svg';
import './App.css';

const Select = styled.select`
  padding: 15px;
  font-size: calc(10px + 1vmin);
  background: #fff;
  display: inline-block;
  border: 1px solid #fff;
`;

const InputText = styled.input.attrs({
  type: 'number'
})`
  width: 100px;
  margin: 0 15px;
  padding: 15px;
  border: none;
  border-bottom: 2px solid #147d88;
  background: none;
  text-align: center;
  font-size: calc(10px + 1vmin);
  outline: none;
`;

const Button = styled.button`
  margin: 0 20px;
  padding: 15px 30px;
  background: #08d208;
  color: yellow;
  border: 2px solid #07c707;
  font-size: calc(10px + 1vmin);
  outline: none;
  vertical-align: bottom;
  text-transform: uppercase;
  font-weight: bold;
  cursor: pointer;
`;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      amount: 1,
      fromCurrency: 'EUR',
      toCurrency: 'USD',
      rate: 0,
      decimals: 2,
      currencies: ['BGN','CAD','BRL','HUF','DKK','JPY','ILS','TRY','RON','GBP','PHP','HRK','NOK','USD','EUR','MXN','AUD','IDR','KRW','HKD','ZAR','ISK','CZK','THB','MYR','NZD','PLN','SEK','RUB','CNY','SGD','CHF','INR']
    }

    this.changeAmount = this.changeAmount.bind(this);
    this.setFromCurrency = this.setFromCurrency.bind(this);
    this.setToCurrency = this.setToCurrency.bind(this);
    this.getRate = this.getRate.bind(this);
    this.switch = this.switch.bind(this);

    setTimeout(function() {
      localStorage.clear();
    }, 3600000);
  }

  componentDidMount() {
    this.getRate();
  }

  changeAmount(e) {
    const { value } = e.target;
    this.setState({ amount: value ? value : 1 });
  }

  setFromCurrency(e) {
    this.setState({ fromCurrency: e.target.value });
  }

  setToCurrency(e) {
    this.setState({ toCurrency: e.target.value });
  }
  
  getRate() {
    const { fromCurrency, toCurrency } = this.state;
    this.setState({ rate: 'Loading...' });

    // CACHE to localStorage
    if(localStorage.getItem(`${this.state.fromCurrency}-${this.state.toCurrency}`) != null) {
      const rate = localStorage.getItem(`${this.state.fromCurrency}-${this.state.toCurrency}`);
      this.setState({ rate: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.state.toCurrency,
        minimumFractionDigits: this.state.decimals,
      }).format(rate * this.state.amount) });
      return;
    }

    fetch(`https://api.exchangeratesapi.io/latest?base=${fromCurrency}&symbols=${toCurrency}`)
    .then(res => res.json())
    .then(json => {
      const rate = json.rates[toCurrency];
      this.setState({ rate: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.state.toCurrency,
        minimumFractionDigits: this.state.decimals,
      }).format(rate * this.state.amount) });
      
      localStorage.setItem(`${this.state.fromCurrency}-${this.state.toCurrency}`, rate);
    });
  }

  switch() {
    const { toCurrency, fromCurrency } = this.state;
    this.setState({ fromCurrency: toCurrency });
    this.setState({ toCurrency: fromCurrency });
  }

  render() {
    return (
      <div className="App">
        <header className="App-title">
          <h1>Palitan</h1>
          <p>Simple currency exchange rate.</p>
        </header>
        <div className="App-header">
          <div>
            <InputText defaultValue={this.state.amount} onChange={this.changeAmount} />
            <Select value={this.state.fromCurrency} onChange={this.setFromCurrency}>
              {
                this.state.currencies.map((cur, i) => <option value={cur} key={i}>{cur}</option>)
              }
            </Select>
            <img src={repeat} alt="" className="repeat" onClick={this.switch} />
            <Select value={this.state.toCurrency} onChange={this.setToCurrency}>
              {
                this.state.currencies.map((cur, i) => <option value={cur} key={i}>{cur}</option>)
              }
            </Select>
            <Button className="equals" onClick={this.getRate}>Convert</Button>
          </div>
          <p className="xchange">{this.state.rate}</p>
        </div>
        <footer>
          <p>&lt;/&gt; with &lt;3 by <a href="https://markanthonyuy.com">markanthonyuy</a></p>
          <p>Powered by <a href="https://facebook.github.io/react/">Reactjs</a> API by <a href="https://exchangeratesapi.io/">Exchange Rates API</a></p>
        </footer>
      </div>
    );
  }
}

export default App;
