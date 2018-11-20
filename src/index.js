import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
const data = require('./resources.json');

class DataFetch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasResources: false,
      resources: []
    }
  }
  componentWillMount () {
    if (process.env.NODE_ENV === 'development') {
      console.log('DEVELOPMENT MODE :: DATA.JSON')
      this.setState({resources: data})
    } else {
      console.log('PRODUCTION MODA :: FETCH newrsrcs.js')
      return fetch(`https://www.lillooetagricultureandfood.org/wp-content/uploads/js/newrsrcs.js`).then(data => data.json())
      .then(resourceList => {
        console.log('FETCHED SUCCESS :: setting state from newrsrcs.js')
        this.setState({resources: resourceList})
      })
      .catch(error => {
        console.error(error)
        console.log('FETCH ERROR :: setting state via data.json')
        this.setState({resources: data})
      })
    }
  }
  render () {
    return <App resources={this.state.resources} />
  }
}

ReactDOM.render(<DataFetch />, document.getElementById('lafs-frd-root'));
