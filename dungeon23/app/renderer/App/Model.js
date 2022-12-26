import God from "./God.js";
import React from 'react';
import fs from 'fs';

var Model = {
  Path: `${__dirname}\\modules\\`.replace('renderer\\App', 'renderer').replace('\\app.asar', ''),
  TDict : {},
  Init: async ()=>{
    let tables = fs.readdirSync(Model.Path);
    for(let t of tables){
      // console.log(t + "   " + Model.Path + t + " / " + t.substring(t.length-4));
      if (t.substring(t.length-4) != ".csv") continue;
      let txt = fs.readFileSync(Model.Path + t).toString();
      let lines = txt.split("\n");
      let table = {Name:"",Entries:[],TotalWeight:0};
      if(lines.length == 0) continue;
      for(let n =0;n < lines.length;n++){
        let entries = Model.SplitLine(lines[n]);
        if(n == 0){
          table.Name = entries[0];
          while(Model.TDict[table.Name]) {
            console.log("REDUNDANT NAME: " + table.Name + " / " + t);
            table.Name += "*";
          }
          n++;
          continue;
        }
        let line = {
          Weight: entries[0] ? entries[0] : 1,
          Text: entries[1],
          Info: entries[2],
        };
        if(line.Text || line.Info)
          table.Entries.push(line);
      }
      console.log(table);
      Model.TDict[table.Name] = table;
    }
    // console.log(tables);
  },
  SplitLine(line){
    let r = [];
    let inQuotes = false;
    let substr = "";
    for(let n = 0;n < line.length;n++){
      if(line[n] == "\"") {
        if(inQuotes){
          inQuotes = false;
        }
        else
          inQuotes = true;
        console.log(n + " / " + line);
      }
      else if(line[n] == "," && !inQuotes){
        r.push(substr);
        substr = "";
      }
      else
        substr += line[n];
    }
    r.push(substr);
    return r;
  },
  SetThing(thing,force) {
    if (!thing){
      return false;
    }
    
    return true;
  },
  Get(tag){
    
    if (!this.TDict[tag] )
      return null;
    return this.TDict[tag];
  },
  RollOnTable(table){
    if(!table || !table.Entries || table.Entries.length == 0) return;
    let totalW = 0;
    for(let ent of table.Entries) totalW += Model.GetWeight(ent);
    let roll = Math.random() * totalW;
    for(let ent of table.Entries){
      roll -= Model.GetWeight(ent);
      if(roll <= 0) {
        God.Results.AddResult(ent);
        return;
      }
    }
    God.Results.AddResult("ERROR ERROR");
  },
  GetWeight(entry){
    let w = parseInt(entry.Weight) ? parseInt(entry.Weight) : 1;
    return w;
  }
}

export default Model;