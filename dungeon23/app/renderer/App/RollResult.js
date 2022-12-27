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
    for(let read of res.Readout){
      let roll = read.Roll ? read.Roll + ": " : "";
      let rcl = "ResultReadout";
      if(read.Class) rcl += " " + read.Class;
      let depth = Math.min(read.Depth,4);
      rcl += " Depth"+depth;
      readouts.push(<div key={"Read"+readouts.length} className={rcl}>{roll}{read.Text}</div>);
    }

    return (<div className={cl}>{res.Table}
      {readouts}
    </div>);
  }
}





export default RollResult;