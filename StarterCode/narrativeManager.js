// this object is to keep track of narrative beats and unlocks

// each "beat" has a test function, a function which unlocks elements, and a report function

const narrativeManager = class {
  constructor(parentObject) {
  this.data = parentObject;
    console.log(parentObject, this.data)
    
  this.beats = [
  {
    triggered: false,
    test: function(data){return data.resource1 >= 10}, 
    unlock:function(){io.showElement("resource2Row")}, 
    report: function(){
      io.appendIntoElement("You have progressed far enough to discover R2", "reports");
      io.writeIntoElement ("Newsletter Clicker", "era");
      }
  },
  {
    triggered: false,
    test: function(data){return data.resource2 >= 10}, 
    unlock:function(){io.showElement("showPanel2")},  
    report: function(){io.appendIntoElement("You unlocked a new dimension of management", "reports");}
  },
  ]
  }
  
  setup(){
    io.hideElement("resource2Row")
    io.hideElement("recruitersRow")
    io.hideElement("moneyChart")
    io.hideElement("showPanel2")
    io.hideElement("showPanel3")
  }


// goes through all narrative events, checks if they activate, runs activation code, and runs code that delivers a message about the story event
  assess(){
    for (let b = 0; b < this.beats.length; b++){
      let beat = this.beats[b]
      if (!beat.triggered){
        if (beat.test(this.data)){
          beat.triggered = true;
          beat.unlock();
          beat.report();
        }
      }
    }
  }

}