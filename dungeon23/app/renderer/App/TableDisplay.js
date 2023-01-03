import React from "react";
import Model from "./Model.js";
import God from "./God.js";
import RollEntry from "./RollEntry.js";
import Searchbar from "./Searchbar.js";

class TableDisplay extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      table:null,
    };
    God.TableDisplay = this;
    this.SetTable = this.SetTable.bind(this);
  } 

  TableList(){
    let tables = [];
    tables.push(<h3 key="top">List of Tables</h3>);
    for(let t of Model.Names){
      // let table = Model.TDict[t];
      tables.push(<div key={"T"+tables.length} className="TableListEntry" onClick={e=>{this.SetTable(t)}}>{t}</div>);
    }
    return tables;
  }

  SetTable(table){
    this.setState({table:table});
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
    <Searchbar/>
    <br/>
    {content}
    </div>);
  }
}





export default TableDisplay;