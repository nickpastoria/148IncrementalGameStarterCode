const GameInstance = class {
  constructor() {
    this.narrativeManager = new narrativeManager(this)
    
    this.stages = ["stage1", "stage2", "stage3"];
    this.currentStage = "stage1"; 
    this.panels = {
      "stage1": ["panel1", "panel2", "panel3"],
      "stage2": ["panel2-1"],
      "stage3": ["panel3-1"]
    }
    this.currentPanel = "panel1";



    this.resource1 = 0;
    this.resource2 = 0;
      
    
      
    this.collectorsProtected = 0;
    this.findersProtected = 0;
    this.gardenCollectors = 0;
    
  }
  
  

  
  // the following functions are to be called from buttons in the index.html
  gainResource1(){ this.resource1 +=1; this.updateDisplay();}
  gainResource2(){ this.resource2 +=2; this.resource1 -=5;this.updateDisplay();}
  
  runResource2Work(){
      this.resource1 += this.resource2;
  }
  
    
  // this function takes in a panel 
  swichPanels(panel) {
    game.currentPanel = panel;
    io.showPanel(game);    
  }
  
  updateDisplay(){
    io.writeValueIntoClass(this.resource1, "resource1Number")
    io.writeValueIntoClass(this.resource2, "resource2Number")
  }
  
};


// this function forom JQuery waits until the web page is fully loaded before triggering the start of the game
$( document ).ready(function() {
  game = new GameInstance();
  game.narrativeManager.setup();
  
  io.showStage(game); 
  game.updateDisplay()

  startRecording(game);

  // Run the Loop
  gameTimer = setInterval(function(){
    game.runResource2Work();
    game.narrativeManager.assess()
    game.updateDisplay()
}, 500)
  

})
