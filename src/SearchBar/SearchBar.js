import React from 'react';
import './SearchBar.css';
import SearchInput from '../SearchInput/SearchInput';
import FilterPrintType from '../FilterPrintType/FilterPrintType'
import FilterBookType from '../FilterBookType/FilterBookType';


export default class SearchBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      q: '',
      printType: '', 
      filter: '', 
    }
  }

  setQuery(q) {
    this.setState({
      q
    })
  }

  setPrintType(printType) {
    this.setState({
      printType
    })
  }

  setBookType(filter) {
    this.setState({
      filter
    })
  }

  formatQueryParams(params) {
    // remove object properties if empty (ergo, default parameters)
    if (params['filter'] === '') {
      delete params['filter']
    } 
    if (params['printType'] === '') {
      delete params['printType']
    }

    const queryItems = Object.keys(params).map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    });
    return queryItems.join('&');
  }

  fetchBooks(event) {
    event.preventDefault();
    const baseURL = 'https://www.googleapis.com/books/v1/volumes';
    const apiKey = 'AIzaSyD6IbRcJ0zp3djxNlqR2Egsi9loLFW_rpk'; 
    const params = {
      q: this.state.q,
      printType: this.state.printType,
      filter: this.state.filter,
      key: apiKey, // may pass within headers fetch options param later...
    };

    const queryString = this.formatQueryParams(params);
    const url = baseURL + '?' + queryString;
    console.log(url);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Problem with search. Please try again.')
        } 
        return response.json();
      })
      .then(data => {
        this.props.handleData(data);
      })
      .catch(err => {
        this.props.handleError(err.message)
      })
  }

  render() {
    console.log(this.state);
    return (
      <div className="SearchBar">
        <header>
          <h1>Google Book Search</h1>
        </header>
        
        <SearchInput 
          handleSubmit={event => this.fetchBooks(event)}
          handleQuery={query => this.setQuery(query)}
        />

        <div className="filters">
          <FilterPrintType 
            handlePrintType={type => this.setPrintType(type)}
          />
          <FilterBookType 
            handleBookType={type => this.setBookType(type)}
          />
        </div>
        
      </div>
    );
  }
}