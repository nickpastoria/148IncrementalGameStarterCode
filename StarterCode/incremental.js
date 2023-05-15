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

    this.views = 0;
    this.money = 0;
    this.articlesWritten = 0;
    this.resource1 = 0;
    this.resource2 = 0;
      
    
      
    this.collectorsProtected = 0;
    this.findersProtected = 0;
    this.gardenCollectors = 0;
    
  }
  
  
  calculateIncome() {
    // Define the range of the random percentage (e.g., 0.5% to 2%)
    const minPercentage = 0.005;
    const maxPercentage = 0.02;
  
    // Calculate the income based on the current number of views
    const incomePercentage = Math.random() * (maxPercentage - minPercentage) + minPercentage;
    const income = Math.floor(this.views * incomePercentage);
  
    // Update the money count and display
    this.money += income;
    this.updateDisplay();
  
    // Display a message in the reports section
    const reportMessage = `You earned ${income} money from ${this.views} views.`;
    io.appendIntoElement(reportMessage, "reports");
  }
  
  
  // the following functions are to be called from buttons in the index.html
  gainMoney(){ this.money += 1; this.updateDisplay();}
  gainResource1(){ this.resource1 +=1; this.updateDisplay();}
  gainResource2(){ this.resource2 +=2; this.money -= 5; this.updateDisplay();}

  calculateViews() {
    const baseViews = 10; // The base number of views per article
    const articleMultiplier = 1.5; // The multiplier for each article
  
    // Calculate the total views based on the number of articles
    const totalViews = baseViews * Math.pow(articleMultiplier, this.articlesWritten);
  
    // Return the total views
    return Math.floor(totalViews);
  }

  writeArticle() {
    // Code to create a new article
    this.resource1 += 1;
    // Increment the views count based on the new article
    this.views += this.calculateViews();
  
    // Call the calculateIncome() function to determine the money earned
    this.calculateIncome();
  
    // Update the display
    this.updateDisplay();
  }
  
  
  runResource2Work(){
      this.resource1 += this.resource2;
      
  }
  
    
  // this function takes in a panel 
  swichPanels(panel) {
    game.currentPanel = panel;
    io.showPanel(game);    
  }
  
  updateDisplay() {
    // Update the display for resource1 and resource2 as before
    io.writeValueIntoClass(this.resource1, "resource1Number");
    io.writeValueIntoClass(this.resource2, "resource2Number");
  
    // Update the display for money and views
    io.writeValueIntoClass(this.money, "moneyNumber");
    io.writeValueIntoClass(this.views, "viewsNumber");
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
