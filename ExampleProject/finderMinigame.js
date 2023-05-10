// this is where code specific to the finder minigame goes
// operats on the assumptional there is a global game object
function runFinderMinigame(){
    var canvas = document.getElementById("finderMinigame");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#00AAFF";
      game.findersList.forEach(function (f){
      f.x += (f.dirX);
      f.y += (f.dirY);
      f.x = ( f.x +500 )%500
      f.y = ( f.y +500 )%500
      context.fillRect(f.x-10, f.y-10, 20, 20);
      
      if (Math.random() > 0.95){
        f.dirX=Math.floor(Math.random()*3-2)
      }
      if (Math.random() > 0.95){
        f.dirY=Math.floor(Math.random()*3-2)
      }
            
      })
      
      // random spawn trash to find
    if (Math.random() > .90){
      game.randomStuff.push({x:Math.floor(Math.random()*500), y:Math.floor(Math.random()*500), dirX:0, dirY:0, dead: true })
    }
    context.fillStyle = "#FFAA00";     
      game.randomStuff.forEach(function (s){
        context.fillRect(s.x-5, s.y-5, 10, 10);
      })
     
    let toBeRemoved = []
    for (let f = game.findersList.length-1; f >= 0; f--){
      let finder = game.findersList[f]
      for (let s = game.randomStuff.length-1; s >= 0; s--){
        let stuff = game.randomStuff[s]
        //console.log(distance(finder, stuff))
        if (distance(finder, stuff) < 20){
          toBeRemoved.push(s)
          game.collectRandomStuff()
        }
      }
    }
        
    for (let r = toBeRemoved.length; r--; r>=0){
     game.randomStuff.splice(toBeRemoved[r], 1)
    } 
}

  finderCommand = function(mouseClick){
      let clickX = mouseClick.offsetX;
      let clickY = mouseClick.offsetY;
      game.findersList.forEach(function (f){
        if (f.x < clickX) f.dirX = +2;
        if (f.x > clickX) f.dirX = -2;
        if (f.y > clickY) f.dirY = -2;
        if (f.y < clickY) f.dirY = +2;
      })
  }