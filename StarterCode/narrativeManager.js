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
      io.appendIntoElement("You are considering getting help", "reports");
      io.writeIntoElement ("Newsletter Clicker", "era");
      }
  },
  {
    triggered: false,
    test: function(data){return data.resource2 >= 4}, 
    unlock:function(){io.showElement("showPanel2")},
    report: function(){io.appendIntoElement("You now have access to management features", "reports");}
  },
  {
    triggered: false,
    test: function(data){return data.resource2 >= 5}, 
    unlock:function(){io.showElement("recruitersRow")},
    report: function(){io.appendIntoElement("You now have access to recruiters", "reports");}
  },
  ]
  }
  
  setup(){
    io.hideElement("resource2Row")
    io.hideElement("recruitersRow")
    io.hideElement("showPanel2")
    io.hideElement("showPanel3")
    io.hideElement("panel2")
    io.hideElement("panel3")
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