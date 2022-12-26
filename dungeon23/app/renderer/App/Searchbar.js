import React from "react";
import DB from "./DB.js";
import God from "./God.js";
import Things from "./Things.js";
import GLink from "./Link.js";
import Model from "./Model.js";
import Field from "./Field.js";
import Autocomplete from "react-autocomplete";
// import AutosizeInput from 'react-input-autosize';
import { Redirect } from "react-router";


class Searchbar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: '',
      things: [],
      thingDict: {},
      call:true,
      active:false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.Setup = this.Setup.bind(this);
    God.Searchbar = this;
    // this.GetName = this.GetName.bind(this);
    // this.mounted = false;
  }

  active(){
    return true;//this.props.active != undefined ? this.props.active : this.state.active;
  }

  // componentDidMount(){
  //   this.setup(); 
  // }

  // calculateTarget(thing,type){
  //   let targ = thing;
  //   if (!Array.isArray(type))
  //     type = [type];
  //   for (let t of type)
  //     {
  //       targ = targ[t];
  //       if (!targ){
  //         // console.log("NULL TARG: " + t + " / " + JSON.stringify(thing) + " / " + JSON.stringify(type))
  //         break;
  //       }
  //     }
  //   // console.log("CALC TARG: " + thing + " / " + JSON.stringify(type));
  //   return targ;
  // }
  // CDU: {"Monsters":[{"Title":"Goblin Rogue","Desc":"hidden behind secret passageway","Num":"1","Subject":"encounter"}]
  
  // componentDidUpdate(prevProps, prevState, snapshot){
  //   // console.log("CDU Picker");
  //   // if ((this.props.active && !prevProps.active) || (this.state.active && !prevState.active)){
  //   //   let act = document.getElementById("Active");
  //   //   if (act)
  //   //     act.focus();
  //   // }
  //   let val = this.calculateTarget(this.props.thing,this.props.type);
  //   if (this.state.id != val)
  //     {
  //       this.setState({id:val});
  //     }
  //   // this.mounted = true;
  //   // console.log("X2");
    
  //   if (!this.mounted || this.state.call || prevProps.filters != this.props.filters || prevProps.subject != this.props.subject){
  //     // console.log("ABC");
  //     this.mounted = true;
  //     this.setup();
  //   }
  //   this.mounted = true;
  // }

  Setup(){
    // console.log("BEGINSETUP")
    this.setThings(Model.SearchBar);
  }

  setThings(things){
    this.setState({things: things});
    let dict = {};
    // let found = false;
    for (let t of things)
    {
      // let nam = God.GetName(t);
      dict[t.Name] = t;
      // if (t.ID == this.state.id){
      //   this.setState({value: nam});
      //   found = true;
      // }
    }
    // if (!found){
    //   // console.log("BACKUP TAG: " + this.state.id);
    //   this.setState({value: this.state.id});
    // }
    // console.log("THINGS: "+things.length );
    // console.log("HG: " + JSON.stringify(dict["Human Guard"]));
    this.setState({thingDict: dict});
  }

  // componentWillUnmount(){
  //   this.setState({call:true})
  //   this.mounted = false;
  //   // console.log("X3")
  // }

  handleChange(v){//When you type
    this.setState({value:v});
    // console.log("onChange: " + JSON.stringify(v));
  }

  handleSelect(v,i){//When you pick an option
    // console.log("HAND SEL: " + v + " / " + Model.MainScreen.GetState('hover') + " / " + (v == Model.MainScreen.GetState('hover')));
    // console.log("HS: " + JSON.stringify(v) + " / " + JSON.stringify(i));
    this.setState({value:'', active:false});
    // console.log("onSelect: " + v + " / " + JSON.stringify(v));
    // console.log("DICT: " + JSON.stringify(this.state.thingDict));
    if (this.state.thingDict[v]){
      let thing = this.state.thingDict[v];
      // let hover = Model.MainScreen.GetState('hover')
      // console.log("HAND SEL: " + JSON.stringify(thing) + " / " + JSON.stringify(hover));
      // if (!thing || !hover || thing.ID != hover.ID || thing.Subject != hover.Subject) return;
      // console.log("CHOSE IT: " + JSON.stringify(thing));
      Model.MainScreen.UpdateFocus(Model.Get(thing.Subject,thing.ID));
      
      //Modify records here, I guess
      // let thing = this.props.thing;
      // let newVal = this.state.thingDict[v].ID ? this.state.thingDict[v].ID : v;
      // this.props.thing[this.props.type] = newVal;
    //   DB.UpdateElement(this.props.type,newVal,this.props.thing);
    //   if (this.props.update)
    //     this.props.update(this.props.thing);
    }
  }

  filterRender(i,v){
    if (this.state.value.length < 1) return false;
    let name = i.Name;
    let r = name ? name.toLowerCase().indexOf(v.toString().toLowerCase()) : -1;
    // console.log("FILTER I: " + i.name + " / V: " + v + " / " + r);
    
    return r != -1;
  }

  handleClick(e){
    if (this.props.active == undefined)
      this.setState({active:true})
    console.log("HAND CLICK");
    e.preventDefault();
  }

  

  render(){
    let cl = this.props.class;
    let r = <span/>;
    let link = <span/>;
    let hover = null;
    if (this.active()){
      // console.log("ReNDER: " + this.state.value);
      let style = {
        borderRadius: '2px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '5px',
        // 'padding-left': '5px',
        fontSize: '90%',
        border: 'solid black',
        // background:'green',
        position: 'fixed',
        overflow: 'auto',
        maxHeight: '50%',
        'zIndex': '5',
      }//style={{ ...style, ...this.menuStyle }}
      // renderMenu={(items, value, style)=>{
      //   return <div style={{ ...style, ...this.menuStyle }} children={items}/>
      // }}
      // console.log("AUTOC: " + this.state.value  );
      r = <div className="Searchbar"><Autocomplete getItemValue={(i)=>i.Name} items={this.state.things}
        renderItem={(i, isHighlighted) => {
          let gray = <div className={"PickerID" + (isHighlighted ? " Highlight":"")} >{(isHighlighted && God.Settings.DevMode ? "ID:"+i.ID : i.Subject)}</div>; 
          return (<div key={i.ID + i.Subject} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
            <div onMouseEnter={e=>{Model.MainScreen.SetHover(Model.Get(i.Subject,i.ID))}}
              onMouseLeave={e=>{Model.MainScreen.EndHover(Model.Get(i.Subject,i.ID))}}>{i.Name}{gray}</div>
          </div>)}
        }
        // wrapperStyle={{background:'blue', size: '-1000',display: 'inline-block'}}
        value={""+this.state.value} menuStyle={style}
        onChange={(e) => {this.handleChange(e.target.value);}}
        selectOnBlur={false}
        onMenuVisibilityChange={r=>{if (!r) this.setState({active:false})}}
        onSelect={(val,item,x) => {this.handleSelect(val,item);}}
        shouldItemRender={(i,v)=>this.filterRender(i,v)}
        // inputProps={{onBlur={r=>{}}}}
        renderInput={ function(props) {
            return <input  id = 'Active' className={cl + ' Picker'}  {...props} />
          }
        }

        // wrapperStyle = {{color: 'blue'}}

        // renderMenu={function(items, value, style) {
        //   return <div class={cl + ' Picker'}  style={{ ...style, ...this.menuStyle }} children={items}/>
        // }}
        // menuStyle={cl + ' Picker'}
        // class={cl + ' Picker'} 
      /></div>
    }
    return r;
  }
}

export default Searchbar;