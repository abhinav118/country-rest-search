import React, { Component } from 'react';
import phone from './phone.png';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, NavItem, Nav, Grid, Row, Col } from "react-bootstrap";
import Autocomplete from 'react-autocomplete';

const fetch = require('react-native-cancelable-fetch');

class App extends Component {
  constructor(props, context) {
      super(props, context);
      this.state = {
        valueCity:  "",
        valueRestorant: "",
        autocompleteData: [
        ],
        status: "main",
        fetchStatus: false
     };

    this.onChange = this.onChange.bind(this);
    this.onChangeCity = this.onChangeCity.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.getItemValue = this.getItemValue.bind(this);
    this.onSelectCity = this.onSelectCity.bind(this);
    this.getItemValueCity = this.getItemValueCity.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderItemCity = this.renderItemCity.bind(this);
    this.goWidget = this.goWidget.bind(this);
    this.validate = this.validate.bind(this);
  }
  //change restorant data
  onChange(e) {
    if (this.state.fetchStatus) {
      fetch.abort(this);
    }
    this.setState({
      valueRestorant: e.target.value,
      fetchStatus: true,
      autocompleteData: []
    });
    // var json = [];
    // this.state.data.forEach((el, index) => {
    //   if (el.name.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1) {
    //     if (document.querySelector("#city").value.length != 0) {
    //       if (el.country == document.querySelector("#city").value) {
    //         json.push(this.state.data[index]);
    //       }
    //     }
    //     else {
    //       json.push(this.state.data[index]);
    //     }
    //   }
    //   this.setState({
    //     autocompleteData: json
    //    });
    // });

    //gete data from base
    fetch('/api/name?data='+e.target.value+'&city='+document.querySelector("#city").value+'', null, this)
    .then(res => res.json())
    .then(data => {
      this.setState({
        autocompleteData: data,
        fetchStatus: false
      });
      
    })
  }
  //change city data
  onChangeCity(e) {
    if (this.state.fetchStatus) {
      fetch.abort(this);
    }
    this.setState({
      valueCity: e.target.value,
      fetchStatus: true,
      autocompleteData: []
    });
    // var json = [];
    // this.state.data.forEach((el, index) => {
    //   if (el.name.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1) {
    //       json.push(this.state.data[index]);
    //   }
    //   this.setState({
    //     autocompleteData: json
    //    });
    // });

    //get data from base
    fetch('/api/country?data='+e.target.value+'', null, this)
    .then(res => res.json())
    .then(data => {
      this.setState({
        autocompleteData: data
      });
      
    })
  }
  //event on select restorant data
  onSelect (val) {
    this.setState({
        autocompleteData: []
    });

    var mass = this.state.autocompleteData.filter(item => item.restaurant_info.name.includes(val));
    var city;
    if (mass[0].restaurant_info.state && mass[0].restaurant_info.state.length > 0) {
      city = mass[0].restaurant_info.city + ', ' + mass[0].restaurant_info.state;
    }
    else {
      city = mass[0].restaurant_info.city;
    }
    //var s = val.split(' - ');
    this.setState({
      valueCity: city,
      valueRestorant: val
    });

  }
  //event on select city data
  onSelectCity (val) {
    this.setState({
        autocompleteData: []
      });
    this.setState({
      valueCity: val
    });
  }
  validate (e) {
    this.setState({
      autocompleteData: []
    });
  }
  //template to render restorant data
  //{item.restaurant_info.name} - {item.restaurant_info.city}, {item.restaurant_info.state}
  renderItem(item, isHighlighted){
    return (
      <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
        {item.restaurant_info.name}
      </div>   
    ); 
  }
  //template to render city data
  renderItemCity(item, isHighlighted){
    if (item.restaurant_info.state && item.restaurant_info.state.length > 0) {
      return (
        <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
          {item.restaurant_info.city}, {item.restaurant_info.state}
        </div>   
      ); 
    }
    else {
      return (
        <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
          {item.restaurant_info.city}
        </div>   
      );
    }
  }
  //data which entered on input when selected item
  getItemValueCity(item){
      if (item.restaurant_info.state && item.restaurant_info.state.length > 0) {
        return `${item.restaurant_info.city}, ${item.restaurant_info.state}`;
      }
      else {
        return `${item.restaurant_info.city}`;
      }
  }

  //data which entered on input when selected item
  //return `${item.restaurant_info.name} - ${item.restaurant_info.city}, ${item.restaurant_info.state}`;
  getItemValue(item){
    //
      return `${item.restaurant_info.name}`;
  }
  
  //show preloader and after show picture with phone

  goWidget () {
    if (this.state.valueCity != "" && this.state.valueRestorant != "") {
      this.setState({
        status: "preloader"
      });
      setTimeout(() => {
        this.setState({
          status: "widget"
        });
      }, 4000);
    }
    else {
      document.querySelector(".search-div").style.borderColor = "red";
      document.querySelector(".search-div input").style.borderColor = "red";
    }
  }

  render() {
    // var status = this.state.status;
    return (
      <div>
      {this.state.status == "main"
            ?  
      <div className="main">
        <Grid>
          <Row>
            <Col md={8} sm={12}>
              <div className="find-form__content">
                <div className="search-div">
                  <Autocomplete
                        getItemValue={this.getItemValueCity}
                        items={this.state.autocompleteData}
                        renderItem={this.renderItemCity}
                        value={this.state.valueCity}
                        onChange={this.onChangeCity}
                        onSelect={this.onSelectCity}
                        inputProps={{ placeholder: ('CITY'), id : ('city'), onBlur: (this.validate), onFocus: (this.validate)}}
                    />
                    <Autocomplete
                        getItemValue={this.getItemValue}
                        items={this.state.autocompleteData}
                        renderItem={this.renderItem}
                        value={this.state.valueRestorant}
                        onChange={this.onChange}
                        onSelect={this.onSelect}
                        inputProps={{ placeholder: ('FIND YOUR RESTAURANT'), onBlur: (this.validate), onFocus: (this.validate)}}
                    />
                </div>
                <div className="find-form__right"><div className="find-form__button find-form__button-hero" onClick={this.goWidget}><div>See your bot now</div></div></div>
              </div>          
            </Col>  
          </Row>
        </Grid>
      </div>
      : ""
      }
      {this.state.status == "preloader"
            ?
      <div className="preloader">
        <Grid>
          <Row>
            <Col md={12}>
                <div className="circle"></div>
                <div className="circle1"></div>        
            </Col>  
          </Row>
        </Grid>
      </div>
      : ""
      }
      {this.state.status == "widget"
            ?
      <div className="widget">
        <Grid>
          <Row>
            <Col md={12}>
                  <img src={phone}></img>    
            </Col>  
          </Row>
        </Grid>
      </div>
      : ""
      }
      </div>
    );
  }
}

export default App;
