import React, { Component } from 'react';
import phone from './phone.png';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, NavItem, Nav, Grid, Row, Col } from "react-bootstrap";
import Autocomplete from 'react-autocomplete';

class App extends Component {
  constructor(props, context) {
      super(props, context);
      this.state = {
        valueCity:  "",
        valueRestorant: "",
        autocompleteData: [
        ],
        status: "main"
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
  }
  onChange(e) {
    this.setState({
      valueRestorant: e.target.value
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
    fetch('/api/name?data='+e.target.value+'&city='+document.querySelector("#city").value+'')
    .then(res => res.json())
    .then(data => {
      this.setState({
        autocompleteData: data
      });
      
    })
  }

  onChangeCity(e) {
    this.setState({
      valueCity: e.target.value
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
    fetch('/api/country?data='+e.target.value+'')
    .then(res => res.json())
    .then(data => {
      this.setState({
        autocompleteData: data
      });
      
    })
  }

  onSelect (val) {
    this.setState({
        autocompleteData: []
      });
    var s = val.split(' - ');
    this.setState({
      valueCity: s[1],
      valueRestorant: s[0]
    });

  }

  onSelectCity (val) {
    this.setState({
        autocompleteData: []
      });
    this.setState({
      valueCity: val
    });
  }

  renderItem(item, isHighlighted){
    return (
      <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
        {item.name} - {item.country}
      </div>   
    ); 
  }
  renderItemCity(item, isHighlighted){
    return (
      <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
        {item.country}
      </div>   
    ); 
  }

  getItemValueCity(item){
      return `${item.country}`;
  }

  getItemValue(item){
    //
      return `${item.name} - ${item.country}`;
  }
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
                        inputProps={{ placeholder: ('CITY'), id : ('city')}}
                    />
                    <Autocomplete
                        getItemValue={this.getItemValue}
                        items={this.state.autocompleteData}
                        renderItem={this.renderItem}
                        value={this.state.valueRestorant}
                        onChange={this.onChange}
                        onSelect={this.onSelect}
                        inputProps={{ placeholder: ('FIND YOUR RESTAURANT')}}
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
