import React from "react";
import Model from "./Model.js";
import God from "./God.js";
import RollEntry from "./RollEntry.js";

class TableDisplay extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      table:null,
    };
  } 

  TableList(){
    let tables = [];
    tables.push(<h3 key="top">List of Tables</h3>);
    for(let t in Model.TDict)
      tables.push(<div key={"T"+tables.length} className="TableListEntry" onClick={e=>{this.setState({table:t})}}>{t}</div>);
    return tables;
  }

  TableDetails(){
    let table = Model.Get(this.state.table);
    if(!table) return "ERROR";
    let entries = [];
    let w = 0;
    for(let ent of table.Entries){
      // let low = w + 1;
      // w += parseInt(ent.Weight);
      // let range = ""+w;
      // if(w > low) range = low + "-" + range;
      //entries.push(<div key={"E"+entries.length}>{range}: {ent.Text}</div>)
      entries.push(<div key={"E"+entries.length}><RollEntry entry={ent} w={w}/></div>)
      w += parseInt(ent.Weight);
    }
    return (<div>
      <h3>{table.Name}</h3>
      <div className="RollButton" onClick={e=>{Model.RollOnTable(table)}}>Roll</div>
      {entries}
      <br/>
      <div className="BackButton" onClick={e=>{this.setState({table:null})}}>Back</div>
    </div>);
  }
  
  render() {
    let content = null;
    if(!this.state.table) content = this.TableList();
    else content = this.TableDetails();
    
    return (<div><h1><u>Table</u></h1>
    <br/>
    {content}
    </div>);
  }
}





export default TableDisplay;