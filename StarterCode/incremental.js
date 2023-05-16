const GameInstance = class {
  constructor() {
    this.narrativeManager = new narrativeManager(this)
    
    this.stages = ["stage1"];
    this.currentStage = "stage1"; 
    this.panels = {
      "stage1": ["panel1", "panel2", "panel3"]
    }
    this.currentPanel = "panel1";

    this.views = 0;
    this.money = 0;
    this.moneyScalingFactor = 2;
    this.articlesWritten = 0;
    this.resource1 = 0;
    this.resource2 = 0;
    this.baseResource2Cost = 1;
    this.recruiters = 0;
    this.baseRecruiterCost = 64;
      
    
      
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
    var income = Math.floor(Math.sqrt(this.views) * incomePercentage);

    if(this.views > 15 && income < 1) income = 1;
  
    // Update the money count and display
    this.money += income;
    this.updateDisplay();
  
    // Display a message in the reports section
    //const reportMessage = `You earned ${income} money from ${this.views} views.`;
    //io.appendIntoElement(reportMessage, "reports");
  }
  
  
  // the following functions are to be called from buttons in the index.html
  gainMoney(){ this.money += 1; this.updateDisplay();}
  gainResource1(){ this.resource1 +=1; this.updateDisplay();}
  gainResource2()
  { 
    const cost = Math.floor(this.baseResource2Cost * Math.pow(this.moneyScalingFactor, this.resource2));

    if(this.money >= cost)
    {
      this.resource2 +=1;
      this.money -= cost;
      const costElement = document.querySelector(".resource2Cost");
      costElement.textContent = Math.floor(this.baseResource2Cost * Math.pow(this.moneyScalingFactor, this.resource2 + 1));
      this.updateDisplay();
    }
    
  }
  gainRecruiter()
  { 
    const cost = Math.floor(this.baseRecruiterCost * Math.pow(this.moneyScalingFactor, this.recruiters));

    if(this.money >= cost)
    {
      this.recruiters +=1;
      this.money -= cost;
      const costElement = document.querySelector(".recruiterCost");
      costElement.textContent = Math.floor(this.baseResource2Cost * Math.pow(this.moneyScalingFactor, this.recruiters + 1));
      this.updateDisplay();
    }
    
  }

  calculateViews() {
    const baseViews = 1; // The base number of views per article
    const articleMultiplier = 2; // The base for the exponential function

    // Define the range of the random multiplier (e.g., 0.8 to 1.2)
    const minMultiplier = 0.95;
    const maxMultiplier = 1.125;
    const randomMultiplier = Math.random() * (maxMultiplier - minMultiplier) + minMultiplier;
  
    // Calculate the total views based on the number of articles
    // Calculate the views based on diminishing returns
    const totalViews = baseViews * Math.sqrt(this.articlesWritten * articleMultiplier) * randomMultiplier;
  
    // Return the total views
    return Math.floor(totalViews);
  }


  writeArticle() {
    // Code to create a new article
    this.resource1 += 1;
    this.articlesWritten += 1;
    // Increment the views count based on the new article
    this.views == this.calculateViews();
  
    // Update the display
    this.updateDisplay();
  }
  
  
  runResource2Work(){
    if(this.articlesWritten > 1)
    {
      this.articlesWritten += this.resource2;
      this.resource1 += this.resource2;
      this.resource2 += this.recruiters;
      this.views = this.calculateViews();
      this.calculateIncome();
      this.updateDisplay();
    }
    newColumn();
  }
  
    
  // this function takes in a panel 
  swichPanels(panel) {
    if (panel === "panel2" && !isChartInitialized) {
      initializeChart();
      isChartInitialized = true;
   }
    io.hideElement(game.currentPanel);
    game.currentPanel = panel;
    io.showElement(game.currentPanel);    
  }
  
  updateDisplay() {
    // Update the display for resource1 and resource2 as before
    io.writeValueIntoClass(Math.floor(this.resource1), "resource1Number");
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
    updateMoney(game.money);
    updateViews(game.views);
}, 500)
  

})

/**
 * Calculates the effective resource count after applying diminishing returns using the given multiplier.
 *
 * @param {number} resourceCount - The current resource count.
 * @param {number} multiplier - The multiplier to apply to the effective resource count.
 * @return {number} The effective resource count after applying diminishing returns and multiplying by the multiplier.
 */

function applyDiminishingReturns(resourceCount, multiplier) {
  const maxResourceCount = 100; // Maximum resource count for full effectiveness
  const diminishingFactor = 0.5; // Diminishing factor (adjust as needed)
  
  if (resourceCount > maxResourceCount) {
    const effectiveCount = maxResourceCount + (resourceCount - maxResourceCount) * diminishingFactor;
    return Math.floor(effectiveCount * multiplier);
  } else {
    return Math.floor(resourceCount * multiplier);
  }
}

/**
 * Calculates the number of views an author's articles will receive based on the number of 
 * articles they have written, the base number of views per article, and a multiplier for 
 * each subsequent article. If the author has written more than 10 articles, the effectiveness 
 * of each subsequent article will be reduced by a factor of 0.75.
 *
 * @param {number} articlesWritten - The total number of articles written by the author
 * @param {number} baseViews - The base number of views per article
 * @param {number} articleMultiplier - The multiplier for each subsequent article
 * @return {number} - The calculated number of views for the author's articles
 */

function calculateDiminishingViews(articlesWritten, baseViews, articleMultiplier) {
  const maxArticles = 100; // Maximum number of articles for full effectiveness
  const diminishingFactor = 0.75; // Diminishing factor (adjust as needed)
  
  if (articlesWritten > maxArticles) {
    const effectiveArticles = maxArticles + (articlesWritten - maxArticles) * diminishingFactor;
    return Math.floor(baseViews * Math.pow(articleMultiplier, effectiveArticles));
  } else {
    return Math.floor(baseViews * Math.pow(articleMultiplier, articlesWritten));
  }
}
