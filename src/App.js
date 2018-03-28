import React, { Component } from 'react';
import { Button, Label, Input, Jumbotron } from 'reactstrap';
import {Bag, Item} from './knapsack-annealling'


class InputSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      max_weight: 0,
      temperature: 0,
      cooling_factor: 0,
      dataset: [],
      bestSet: [],
      bestValue: null
    }
  }

  acceptanceProbability = (freespace, newfreespace, temperature) => {
    if (newfreespace < freespace)
      return 1.0;

    return Math.exp((freespace - newfreespace) / temperature);
  }

  onClick = () => {
    var dataset = this.state.dataset;
    
    var bag = new Bag(this.state.max_weight, dataset);
    var best = bag.currentSolution;
    var temperature = this.state.temperature;

    while(temperature > 0){
      var freespaceLeft = bag.calculateRemainingSpace(bag.currentSolution);

      var modifiedSolution = bag.modifySelection();

      var newfreespaceleft = bag.calculateRemainingSpace(modifiedSolution);

      if(this.acceptanceProbability(freespaceLeft, newfreespaceleft, temperature) >= Math.random()){
          bag.currentSolution = modifiedSolution;
      }

      if(bag.getValueForList(bag.currentSolution) > bag.getValueForList(best)){
          best = bag.currentSolution;
      }
      temperature -= this.state.cooling_factor;
    }

    let bestSolution = bag.printSolution(best);
    let bestSet = [];

    bestSolution.itemSet.map(item => {
      bestSet.push(
        <a style={{marginRight: '6%'}}> [ Weight: {item.getItem().weight} , Value: {item.getItem().value} ] </a>,
      );
    });

    this.setState({
      bestSet: bestSet,
      bestValue: <h3> Best Value: { bestSolution.bestValue }</h3>
    });

  }

  onChange = (type, e) => {
    let max = e.target.value
    let dataset = []

    if (type === "max_weight")
      this.setState({max_weight: max});
    if (type === "temperature")
      this.setState({temperature: max});
    if (type === "cooling_factor")
      this.setState({cooling_factor: max});
    if(type === "input_file") {
      let file = e.target.files[0];

      if (file){
        let reader = new FileReader();
        
        reader.onload = (e) => {
          var contents = e.target.result;

          dataset = contents.split('\n').map(set => set.split(',').map(y => y = parseInt(y)));

          this.setState({dataset: dataset});
        }

        reader.readAsText(file);
      }
    }

    
  }


  render() {
    return (
      <div>
        <div className="row">
          <div className="col">
            <Label for="max_weight">Max Weight</Label>
            <Input 
              type="number" 
              name="file" 
              id="max_weight" 
              value={this.state.max_weight}
              onChange={this.onChange.bind(this, "max_weight")}
            />
          </div>
          <br />

          <div className="col">
            <Label for="temperature">Temperature</Label>
            <Input 
              type="number" 
              name="file" 
              id="temperature" 
              value={this.state.temperature}
              onChange={this.onChange.bind(this, "temperature")}
            />
          </div>
          <br />

          <div className="col">
            <Label for="cooling_factor">Cooling Factor</Label>
            <Input 
              type="number" 
              name="file" 
              id="cooling_factor" 
              value={this.state.cooling_factor}
              onChange={this.onChange.bind(this, "cooling_factor")}
            />
          </div>
          <br />

          <div className="col">
            <Label for="File">Knapsack Items</Label>
            <Input 
              type="file" 
              name="file" 
              id="File" 
              onChange={this.onChange.bind(this, "input_file")}
            />
          </div>
        </div>
        <br />
        <Button 
          color="primary" 
          size="lg" 
          block
          onClick={this.onClick.bind(this)}
        >
        Calculate
        </Button>{' '}

        <br />

        <div>
          {
            (this.state.bestValue === null) ? 
              ''
              :
              [
                this.state.bestValue,
                this.state.bestSet 
              ]
          }
        </div> 
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="container">
        <Jumbotron>
          <h1 className="display-9 text-center">Knapsack with Simulated Annealing Problem</h1>
        </Jumbotron>
        <InputSection />
      </div>
    );
  }
}

export default App;
