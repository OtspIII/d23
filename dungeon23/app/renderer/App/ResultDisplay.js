import React from "react";
import Model from "./Model.js";
import God from "./God.js";

class ResultDisplay extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      results:[],
    };
    God.Results = this;
  } 

  AddResult(result){
    let res = this.state.results;
    result.Key = Math.random();
    res.push(result);
    this.setState({results:res});
  }
  
  render() {
    let results = [];
    let first = true;
    for(let n = this.state.results.length - 1;n >= 0 ;n--){
      let res = this.state.results[n];
      let cl = first ? "Result First" : "Result";
      results.push(<div key={"RES"+results.length+"."+res.Key} className={cl}>{res.Text}</div>);
      first = false;
    }
    if(results.length == 0)
      results.push(<div key={"RES"+results.length}>. . .</div>);
    return <div>
      <h1><u>Results</u></h1>
      <br/>
      {results}
    </div>;
  }
}





export default ResultDisplay;