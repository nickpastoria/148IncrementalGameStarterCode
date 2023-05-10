// This document is a helper full of inventory stage functions!

inventoryItemsSelected = [];

function selectIndex(n){inventoryItemsSelected.push(n);game.updateDisplay();}
function deselectIndex(n){inventoryItemsSelected.splice(n, 1);game.updateDisplay()}
function canProduceAbomination(){return inventoryItemsSelected.length > 4 && game.biomass > 100*inventoryItemsSelected.length;}
function produceAbomination(){
  game.biomass -= 100*inventoryItemsSelected.length;
  let ab = {label:"Abomination", shape: "none", movement: 0, oddness:0, ingredients: [], size:0, state:"none"}
  let heads = 0; let torsos = 0; let limbs = 0;
  ab.size = inventoryItemsSelected.length;
    inventoryItemsSelected.sort(function(a, b) {return a-b})
  for (let i = inventoryItemsSelected.length-1; i>0;i--){
    pick = game.inventory.splice(inventoryItemsSelected[i], 1)[0]
    console.log(pick, i, inventoryItemsSelected)
    if (pick.partType == "head") heads += 1;
    if (pick.partType == "torso") torsos += 1;
    if (pick.partType == "head")  torsos += 1;
    ab.movement += pick.movement_bonus;
    ab.oddness += pick.oddness;
    ab.ingredients.push(pick);
  }
  if (heads + torsos <= 2 && limbs < 5){
    ab.shape="human"
    game.abominationsHuman.push(ab)
  }
  else{
    ab.shape="vague"
    game.abominationsVague.push(ab)
  }
  inventoryItemsSelected = []
  
}


//this can be stored outside the game object, cause it is the same regardless of what save is being played
randomItems = [
    {"label":"skull", "partType": "head", "movement_bonus": 0, "oddness": 10, "tags": ["skinless", "hollow", "yellow", "spooky"]},
    {"label":"pumpkin", "partType": "head", "movement_bonus": 1, "oddness": 7, "tags": ["orange", "vegetable", "squashy"]},
    {"label":"rat", "partType": "head", "movement_bonus": 1, "oddness": 15, "tags": ["squirming", "angry", "bitey"]},
    {"label":"stick", "partType": "limb", "movement_bonus": 4, "oddness": 4, "tags": ["wooden", "hollow", "hard", "broken"]},
    {"label":"sword", "partType": "limb", "movement_bonus": 1, "oddness": 10, "tags": ["steel", "sharp", "metal"]},
    {"label":"bone", "partType": "limb", "movement_bonus": 3, "oddness": 10, "tags": ["skinless", "hollow", "yellow", "spooky"]},
    {"label":"arm", "partType": "limb", "movement_bonus": 8, "oddness": 2, "tags": ["fleshy", "living", "normal"]},
    {"label":"potato sack", "partType": "torso", "movement_bonus": 1, "oddness": 10, "tags": ["jumbling", "heavy", "burlap"]},
    {"label":"cardboard", "partType": "torso", "movement_bonus": 2, "oddness": 7, "tags": ["flimsy", "moist", "brown"]},
    {"label":"ribcage", "partType": "torso", "movement_bonus": 1, "oddness": 19, "tags": ["skinless", "hollow", "yellow", "spooky"]}
    
    ]


generateRandomItem = function(){
  return randomItems[Math.floor(Math.random()*randomItems.length)]
  
}

function setAbominationState(index, state){
  game.abominationsVague[index].state = state;
  game.collectorsProtected = 0;
  game.findersProtected = 0;
  game.abominationsVague.forEach(function(a){
    if (a.state == "ProtectCollectors") game.collectorsProtected += 1
    if (a.state == "ProtectFinders") game.findersProtected += 1
    if (a.state == "GardenCollectors") game.gardenCollectors += 1
    
    
  })
  

  
  game.updateDisplay()
}