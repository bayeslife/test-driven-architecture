import handlebars = require('handlebars');



export const helpers = {

  echo: function(val: any) {
    console.log(val);
 },

  documentationDescription: function(val: string,content: string) {
   if(val=='Description')
      return content;
  return "";
  },

  documentationEffort: function(val: string,content: string) {
    if(val=='Effort'){
      return content.trim();
    }
   return "";
 },

  documentationHistory: function(val: string,content: string) {
    if(val=='History')
       return content;
   return "";
  },

  json: function(text: string,id: string,options: any){
     var j =  JSON.parse(text);
     j.id = id;
     return options.fn(j);
  },
  addId: function(context: any,id: string,options: any){
      context.id=id;
      return options.fn(context);
  },

  parseCsv: function(csv: string,options: any){
      for(var v  of csv){
        return options.fn(v);
      }
  },

  toLowerCase: function(text: string) {
    return text.toLowerCase();
  },
  toUpperCase: function(text: string) {
    return text.toUpperCase();
  },
  asJson: function(j: any) {
    return JSON.stringify(j);
  }
};
