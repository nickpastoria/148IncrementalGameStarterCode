const GameInstance = class {
  constructor() {
    this.narrativeManager = new narrativeManager()
    
    this.stages = ["stage1", "stage2", "stage3"];
    this.currentStage = "stage1"; 
    this.panels = {
      "stage1": ["scavenge", "inventory", "above"],
      "stage2": ["human"],
      "stage3": []
    }
    this.currentPanel = "scavenge";

    // a tracker for the finder mini-game
    this.finderMinigameRunning = false;
    this.findersList = []
    this.randomStuff = []
    
    // a tracker for a non-numeric resource {"label", "part type", "movement_bonus", "oddness", "tags", "equipped"}
    this.inventory = []
    
    // tracks what abominations have been produced and are active
    this.abominationsHuman = [];
    this.abominationsVague = [];

    this.rats = 0;
    this.pennies = 0;
    this.collectors = 0;
    this.finders = 0
    this.bodies = 0;
    this.biomass = 0;
    this.humanShaped = this.abominationsHuman
    this.vagueShaped = this.abominationsVague
    this.collectedItems = this.inventory.length
      
    
      
    this.collectorsProtected = 0;
    this.findersProtected = 0;
    this.gardenCollectors = 0;
    
  }
  
  

  
  // the following functions are to be called from buttons in the index.html
  collectBiomass(){
    this.biomass += 1;
    this.updateDisplay()
    }
  spawnCollector(){
    if (this.biomass > 10){
      this.biomass -= 10;
      this.collectors += 1;
      this.updateDisplay()}
    }  
  spawnFinder(){
    if (this.biomass > 50){ 
      this.biomass -= 50;
      this.finders += 1;
      this.findersList.push({x:Math.floor(Math.random()*500), y:Math.floor(Math.random()*500), dirX:Math.floor(Math.random()*3-2), dirY:Math.floor(Math.random()*3-2) })
      this.updateDisplay()
      } 
    }
    removeCollector(x=1){
      this.collectors -= x;
      if (this.collectors < 0) this.collectors = 0;
      this.updateDisplay()
    }  
  removeFinder(x=1){
      this.finders -= x;
      if (this.finders < 0) this.finders = 0;
      for (let i = 0; i< x; i++) {this.findersList.pop()}
      
      this.updateDisplay()
       
    }
  
  collectorsRun(){
      //game.biomass += Math.ceil(game.collectors * (1.1 + (0.2*this.gardenCollectors)))
      //demo
      game.biomass += Math.ceil(game.collectors * (5.1 + (0.2*this.gardenCollectors)))
  }
  
    
  // function for reducing biomass as a result of consumption 
  biomassUpkeep(){
      game.biomass -= (game.collectors*1 + game.finders*10 + game.bodies*100)
  }
  
  ratAttack(){ 
    
    if (Math.random() > 0.98 && game.rats && game.collectors){
      
    let rats = Math.ceil(Math.random()*this.rats) - game.collectorsProtected;
      if( rats > 0) {
        game.collectors -=1*this.rats;
        io.appendIntoElement("Rats have been found eating food collectors.", "finderReports");
        if (game.collectorsProtected) {io.appendIntoElement("Our guardian abominations only protected a few collectors.", "finderReports")}
      }
      else io.appendIntoElement("Our abominations protected our collectors from rats!", "finderReports");
    } 
  if (Math.random() > 0.98 && game.rats && game.finder) {
    let rats = Math.ceil(Math.random()*this.rats) - game.finderProtected;
    if ( !game.findersProtected) {
      game.removeFinders(rats);
      io.appendIntoElement("Rats have been found eating item finders.", "finderReports"); 
      if (game.collectorsProtected) {io.appendIntoElement("Our guardian abominations only protected a few finders.", "finderReports")}
    }
      else io.appendIntoElement("Our abominations protected our object finders from rats!", "finderReports");
  }
    
    
  }
  
  
  // the following are utility functions for items and inventory
  collectRandomStuff(){
    if (Math.random() > 0.05) {
      this.pennies += 1;
    }
    else {
      //need an item generator
      let item = generateRandomItem()
      this.inventory.push(item)
      io.appendIntoElement("Found a " + item.label +  "!", "finderReports");
    }
  }
  
  
    
  // this function takes in a panel 
  swichPanels(panel) {
    game.currentPanel = panel;
    io.showPanel(game);    
  }
  
  updateDisplay(){
    this.humanShaped = this.abominationsHuman.length
    this.vagueShaped = this.abominationsVague.length
    this.bodies = this.humanShaped + this.vagueShaped;
    this.collectedItems = this.inventory.length
    
    io.writeValueIntoClass(this.biomass, "biomassNumber")
    io.writeValueIntoClass(this.finders, "finderNumber")
    io.writeValueIntoClass(this.collectors, "collectorNumber")
    io.writeValueIntoClass(this.pennies, "penniesNumber")
    io.writeValueIntoClass(this.bodies, "bodiesNumber")
    
    io.renderListIntoElement("inventorySelect", game.inventory, inventoryItemsSelected, "selectIndex", "deselectIndex");
    
    io.renderListIntoElementUI("abominationJobs", this.abominationsVague, [{code: "ProtectCollectors", display: "Protect Collectors"}, {code: "ProtectFinders", display:"Protect Finders"}, {code: "GardenCollectors", display:"Garden Collectors"}], "setAbominationState")
    
    
    
    if (canProduceAbomination())
      io.enableButton("makeAbominationButton")
    else
      io.disableButton("makeAbominationButton")
  }
  
};


quickstart = false

// this function forom JQuery waits until the web page is fully loaded before triggering the start of the game
$( document ).ready(function() {
  game = new GameInstance();
  game.narrativeManager.setup();
  
  io.showStage(game); 
  game.updateDisplay()
  startRecording(game);
  
  if (quickstart) {
    game.biomass = 10000
    game.collectors = 500;
    for (let i = 0; i < 200; i++)
      game.collectRandomStuff();
  }
  
  
  // Run the Loop
  gameTimer = setInterval(function(){
    game.collectorsRun()
    game.biomassUpkeep();
    
    
      if (game.biomass < -100) {
        game.currentStage = "stage3";
        io.showStage(game);
      }

    game.ratAttack();
    game.narrativeManager.assess()
    game.updateDisplay()
}, 500)
  // finder minigame Loops
  

})

//
    //  Game.randomStuff.push({x:Math.floor(Math.random()*500), y:Math.floor(Math.random()*500), dirX:Math.floor(Math.random()*3-2), dirY:Math.floor(Math.random()*3-2) }})
