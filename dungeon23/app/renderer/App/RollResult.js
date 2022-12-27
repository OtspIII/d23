import React from "react";
import Model from "./Model.js";
import God from "./God.js";

class RollResult extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      
    };
  } 
  
  render() {
    let cl = this.props.first ? "Result First" : "Result";
    let res = this.props.result;
    let readouts = [];
    for(let read of res.Readout)
      readouts.push(<div key={"Read"+readouts.length}>{read}</div>);

    return (<div className={cl}>{res.Table}
      {readouts}
    </div>);
  }
}





export default RollResult;