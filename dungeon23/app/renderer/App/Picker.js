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


class Picker extends React.Component {
  constructor(props){
    super(props);
    let tid = this.calculateTarget(this.props.thing,this.props.type);
    this.state = {
      value: '',
      things: [],
      thingDict: {},
      call:true,
      id:tid,
      active:false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleClick = this.handleClick.bind(this);
    // this.GetName = this.GetName.bind(this);
    this.mounted = false;
  }

  active(){
    return this.props.active != undefined ? this.props.active : this.state.active;
  }

  componentDidMount(){
    this.setup();
  }

  calculateTarget(thing,type){
    let targ = thing;
    if (!Array.isArray(type))
      type = [type];
    for (let t of type)
      {
        targ = targ[t];
        if (!targ){
          // return "none";
          // console.log("NULL TARG: " + t + " / " + JSON.stringify(thing) + " / " + JSON.stringify(type))
          break;
        }
      }
    // console.log("CALC TARG: " + thing + " / " + JSON.stringify(type));
    return targ;
  }
  // CDU: {"Monsters":[{"Title":"Goblin Rogue","Desc":"hidden behind secret passageway","Num":"1","Subject":"encounter"}]
  
  componentDidUpdate(prevProps, prevState, snapshot){
    // console.log("CDU Picker");
    // if ((this.props.active && !prevProps.active) || (this.state.active && !prevState.active)){
    //   let act = document.getElementById("Active");
    //   if (act)
    //     act.focus();
    // }
    let val = this.calculateTarget(this.props.thing,this.props.type);
    if (this.state.id != val)
      {
        this.setState({id:val});
      }
    // this.mounted = true;
    // console.log("X2");
    
    if (!this.mounted || this.state.call || prevProps.filters != this.props.filters || prevProps.subject != this.props.subject){
      // console.log("ABC");
      this.mounted = true;
      this.setup();
    }
    this.mounted = true;
  }

  setup(){
    this.setState({call:false});
    if (this.props.options){
      this.setThings(this.props.options);
      return;
    }
    
    // let filters = {'subject':this.props.subject};
    // for(let f in this.props.filters)
    // {
    //   filters[f] = this.props.filters[f];
    // }
    // console.log("DEF: " + JSON.stringify(filters));
    //DB.CallDB('getall',filters,r=>{ 
    if(!this.props.subject || !Things[this.props.subject]){
      console.log("NOT VALID SUBJECT: " + this.props.subject);
      this.setThings([]);
      return;
    }
    DB.GetAll(this.props.subject,this.props.filters,r=>{
      // console.log("GET ALL: " + r.length)
      if (this.mounted) {
        if (Things[this.props.subject].TableSort)
          r = Things[this.props.subject].TableSort(r);
        else
          r = r.sort((a,b) => (a.Tag > b.Tag) ? 1 : -1)
        // console.log("XYZ");
        this.setThings(r);

    }})
  }

  setThings(things){
    let stateID = this.state.id;
    if(stateID && stateID.ID) stateID = stateID.ID;
    // console.log("P Set Things: " + things.length);
    let thingstemp = [{Tag:undefined}];
    for (let t of things)
    {
      if (typeof t == 'string')
        thingstemp.push({Tag:t});
      else
        {
          thingstemp.push(t);
          Model.SetThing(t);
        }
    }
    things = thingstemp;
    this.setState({things: things});
    let dict = {};
    let found = false;
    for (let t of things)
    {
      let nam = God.GetName(t);
      dict[nam] = t;
      if (t.ID == stateID){
        this.setState({value: nam});
        found = true;
      }
    }
    if (!found){
      // console.log("BACKUP TAG: " + stateID);
      this.setState({value: stateID});
    }
    this.setState({thingDict: dict});
  }

  componentWillUnmount(){
    this.setState({call:true})
    this.mounted = false;
    // console.log("X3")
  }

  handleChange(v){//When you type
    if(v && v.ID) v = v.ID;
    this.setState({value:v});
    // console.log("onChange: " + v);
  }

  handleSelect(v){//When you pick an option
    if(v && v.ID) v = v.ID;
    this.setState({value:v, active:false});
    // console.log("onSelect: " + v + " / " + JSON.stringify(v));
    // console.log("DICT: " + JSON.stringify(this.state.thingDict));
    if (this.state.thingDict[v]){
      // console.log("CHOSE IT: " + JSON.stringify(this.state.thingDict[v]));
      //Modify records here, I guess
      // let thing = this.props.thing;
      let newVal = this.state.thingDict[v].ID ? this.state.thingDict[v].ID : v;
      if(this.props.fullLink) {
        console.log("LINK: " + newVal)
        newVal = {Subject:this.props.subject, ID:newVal};
      }
      // console.log("A: " + this.state.thingDict[v].ID + " / " + JSON.stringify(newVal));
      // console.log("B: " + JSON.stringify(v));
      this.props.thing[this.props.type] = newVal;
      DB.UpdateElement(this.props.type,newVal,this.props.thing);
      if (this.props.update)
        this.props.update(this.props.thing);
    }
  }

  filterRender(i,v){
    let name = God.GetName(i);
    let r = name ? name.toLowerCase().indexOf(v.toString().toLowerCase()) : -1;
    // console.log("FILTER I: " + i.name + " / V: " + v + " / " + r);
    
    return r != -1;
  }

  handleClick(e){
    if (this.props.active == undefined)
      this.setState({active:true})
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
      r = <Autocomplete getItemValue={(i)=>God.GetName(i)} items={this.state.things}
        renderItem={(i, isHighlighted) =>
          <div key={i.ID + i.Tag} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
            {God.GetName(i)}
          </div>
        }
        // wrapperStyle={{background:'blue', size: '-1000',display: 'inline-block'}}
        value={""+this.state.value} menuStyle={style}
        onChange={(e) => {this.handleChange(e.target.value);}}
        selectOnBlur={true}
        onMenuVisibilityChange={r=>{if (!r) this.setState({active:false})}}
        onSelect={(val) => {this.handleSelect(val);}}
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
      />
    }
    else {//If not active.....
      let v = this.state.value;
      hover = this.state.thingDict[v] && this.state.thingDict[v].ID ? this.state.thingDict[v].ID : v;//Model.Get(this.props.subject,this.state.value);
      let txt = this.props.display ? God.ModDisplay(v,this.props.display,this.props.thing) : v;
      if(!txt || txt == "") txt = "...";
      // console.log("Picker: " + this.state.value + " / " + this.props.subject + " / " + JSON.stringify(hover))
      r = <span className={cl + ' Picker'} onContextMenu={r=>{this.handleClick(r)}}>{txt}</span>;
      if(this.props.subject){
        link = <GLink thing={hover} subject={this.props.subject} text='&#11111;' style="Icon"/>;
        // console.log("VAL: " + this.state.value + " / " + JSON.stringify(hover))
      }
    }
    if (this.props.title)
      return <Field title={this.props.title} bod={r} width={this.props.width} button={link} hover={hover} click={e=>this.handleClick(e)}/>;
      // return God.MakeField(this.props.title,r,this.props.width,e => {},link);;
    if (hover)
      return <span onMouseEnter={e=>Model.MainScreen.SetHover(hover)} onMouseLeave={e=>Model.MainScreen.EndHover(hover)}>{r}{link}</span>;
    return r;
  }
}

export default Picker;