import God from "./God.js";
import React from 'react';
import fs from 'fs';
import { table } from "console";

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
        // if(entries[2] ) console.log("."+entries[2]+"." + entries[2].length);
        let line = {
          Weight: entries[0] && entries[0] != "" ? entries[0] : 1,
          Text: entries[1],
          Info: entries[2] && entries[2].length > 1 ? JSON.parse(entries[2]) : null,
        };
        if(line.Text || line.Info)
          table.Entries.push(line);
      }
      // console.log(table);
      Model.TDict[table.Name] = table;
    }
    // console.log(tables);
  },
  SplitLine(line){
    let r = [];
    let inQuotes = false;
    let json = false;
    let substr = "";
    for(let n = 0;n < line.length;n++){
      if(line[n] == "{") {
        substr += line[n];
        json = true;
      }
      else if(line[n] == "}") {
        substr += line[n];
        json = false;
      }
      else if(line[n] == "\"" && !json) {
        if(inQuotes){
          inQuotes = false;
        }
        else
          inQuotes = true;
        console.log(n + " / " + line);
      }
      else if(line[n] == "," && !inQuotes && !json){
        r.push(substr);
        substr = "";
      }
      else
        substr += line[n];
    }
    r.push(substr);
    return r;
  },
  Get(tag){
    
    if (!this.TDict[tag] )
      return null;
    return this.TDict[tag];
  },
  RollOnTable(table){
    if(!table || !table.Entries || table.Entries.length == 0) return;
    let result = {Table:table.Name,Readout:[], ID:Math.random()};
    let picked = Model.PickRandom(table);
    let depth = 0;
    Model.HandleEntry(picked,result,table,depth);
    God.Results.AddResult(result);
  },
  GetWeight(entry){
    let w = parseInt(entry.Weight) ? parseInt(entry.Weight) : 1;
    return w;
  },
  PickRandom(table){
    let totalW = 0;
    for(let ent of table.Entries) totalW += Model.GetWeight(ent);
    let roll = Math.random() * totalW;
    let rollTxt = Math.ceil(roll);
    for(let ent of table.Entries){
      roll -= Model.GetWeight(ent);
      if(roll <= 0) return {Entry:ent,Roll:rollTxt};
    }
    console.log("FAILED TO PICK FROM TABLE: " + table.Name);
  },
  HandleEntry(picked,result,table,depth){
    depth++;
    if(depth > 99) return;
    let ent = picked.Entry;
    result.Readout.push({Text:ent.Text,Roll:picked.Roll,Depth:depth});
    let info = ent.Info;
    if(info){
      if(info.RollOn){
        let nextTable = Model.Get(info.RollOn.Table);
        if(!nextTable) nextTable = table;
        let rolls = info.RollOn.Amount ? info.RollOn.Amount : 1;
        for(let n = 0;n < rolls;n++){
          let nPicked = Model.PickRandom(nextTable);
          Model.HandleEntry(nPicked,result,nextTable,depth);
        } 
      }
      // console.log("INFO: " + ent.Info);
      // result.Readout.push({Text:JSON.stringify(ent.Info)});
    }
  }
}

export default Model;