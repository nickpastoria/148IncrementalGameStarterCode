// this object is to keep track of narrative beats and unlocks

// each "beat" has a test function, a function which unlocks elements, and a report function

const narrativeManager = class {
  constructor() {
  this.beats = [
  {
    triggered: false,
    test: function(){return game.biomass >= 10}, 
    unlock:function(){io.showElement("collectorRow")}, 
    report: function(){
      io.appendIntoElement("With enough biomass sieved from the sludge, you can now spawn collector maws, to do some of that work for you", "finderReports");
      io.writeIntoElement ("Bold Mold", "era");
      }
  },
  {
    triggered: false,
    test: function(){return game.collectors >= 100}, 
    unlock:function(){game.rats + 1;},  
    report: function(){io.appendIntoElement("Weird furry creatures have begun nibbling on the outside of your influence. . .", "finderReports");}
  },
  {
    triggered: false,
    test: function(){return game.collectors >= 100}, 
    unlock:function(){
      io.showElement("finderRow");
      io.showElement("finderMinigame");
      game.finderMinigame = setInterval(runFinderMinigame, 100)
    }, 
    report: function(){io.appendIntoElement("To grow, you must explore. You've figured out how to separate small parts of your body to go out and find new things. But explorers must be fed... Don't forget to feed them. . . .", "finderReports");
      io.writeIntoElement ("Small Colony", "era");}
  },
  {
    triggered: false,
    test: function(){return game.pennies >= 1}, 
    unlock:function(){io.showElement("penniesRow")}, 
    report: function(){io.appendIntoElement("You have begun collecting weird metal discs.", "finderReports")
      io.writeIntoElement ("Penny Pincher", "era");;}
  },
  {
    triggered: false,
    test: function(){return game.inventory.length >= 1}, 
    unlock:function(){io.showElement("showInventory")}, 
    report: function(){io.appendIntoElement("You are finding wonderous and new things. You find a space in the dark to store them for now. . .", "finderReports");}
  },
  {
    triggered: false,
    test: function(){return game.inventory.length >=5}, 
    unlock:function(){io.showElement("makeAbomination")}, 
    report: function(){io.appendIntoElement("Hey, you're collecting a lot of stuff there. Why don't you put it together. . . in a thing. . . ", "finderReports")
      io.writeIntoElement  ("Grand Collector", "era");;}
  },
  {
    triggered: false,
    test: function(){return game.abominationsVague.length >= 1}, 
    unlock:function(){io.showElement("abominationTasks"); io.showElement("abominationRow")},  
    report: function(){io.appendIntoElement("Wow. That actually worked. . . I wonder if you can make something that can pass as one of the weirdos upstairs. . . ", "finderReports")
      io.writeIntoElement ("Mother of Beasts", "era");;}
  },
  {
    triggered: false,
    test: function(){return game.abominationsVague >= 2}, 
    unlock:function(){game.rats + 10;},  
    report: function(){io.appendIntoElement("The rats. . . are they getting BOLDER?!", "finderReports");}
  },
  {
    triggered: false,
    test: function(){
      return game.abominationsHuman.length >= 1}, 
    unlock:function(){io.showElement("showAbove")}, 
    report: function(){io.appendIntoElement("Finally, after much experimentation, you have created a being that approximates the ones above. . .", "finderReports")
      io.writeIntoElement ("Goddess Deciever", "era");;}
  },
  ]
  }
  
  setup(){
    io.hideElement("collectorRow")
    io.hideElement("finderRow")
    io.hideElement("abominationRow")
    io.hideElement("finderMinigame")
    io.hideElement("penniesRow")
    io.hideElement("showInventory")
    io.hideElement("showAbove")
    
    
    io.hideElement("makeAbomination")
    io.hideElement("abominationTasks")
  }

  assess(){
    for (let b = 0; b < this.beats.length; b++){
      let beat = this.beats[b]
      if (!beat.triggered){
        if (beat.test()){
          beat.triggered = true;
          beat.unlock();
          beat.report();
        }
      }
    }
  }

}