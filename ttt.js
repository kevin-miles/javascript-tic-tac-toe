var	
	gameCpuSymbol="O",
	gameCpuScore = 0,
	gamePlayerSymbol="X",
	gamePlayerScore = 0,
	gameState = [[],[],[]],
	gameResetScores = function(){
		console.log("reached reset scores!");
		gameCpuScore = 0;
		gamePlayerScore = 0;
	},
	boardIsTaken = function (x, y) {
        if (gameState[x][y]) {
            return true;
        } else {
            return false;
        }
    },
	boardTake = function (x, y, symbol) {
        if (boardIsTaken(x, y)) {
            return false;
        } else {
            gameState[x][y] = symbol;
			return true;
		}
    },
	symbolsSet = function(symbol){
		if(symbol === "X"){ gamePlayerSymbol = "X"; gameCpuSymbol = "O";}
		else if(symbol === "O"){ gamePlayerSymbol = "O"; gameCpuSymbol = "X";}
		else { return false; }
	},
	boardDisable = function(){
		boardLoopPieces(function(that, x, y){
			that.off();
		});
	},
	boardEnable = function(){
		gameSetListeners();
	},
	boardClear = function(that){
		boardLoopPieces(function(that, x, y){
			that.text("");
		});
	},
	gameReset = function(){
		gameState = [[],[],[]];
		$("#win_horizontal_line_0").fadeOut(400);
		$("#win_horizontal_line_1").fadeOut(400);
		$("#win_horizontal_line_2").fadeOut(400);
		$("#win_vertical_line_0").fadeOut(400);
		$("#win_vertical_line_1").fadeOut(400);
		$("#win_vertical_line_2").fadeOut(400);
		$("#win_slant_line_reg").fadeOut(400);
		$("#win_slant_line_anti").fadeOut(400);
		boardClear();
		boardEnable();
		
	},
	boardLoopPieces = function(func){
		$(".row").each(function (x) {
            $("> .piece", this).each(function (y) {
					func($(this), x, y);
                });
        });
	},
	gameIsWin = function(x, y, symbol){
		var i, win;

        //check horizontal
        for (i = 0; i < 3; i++) {
            if (gameState[x][i] === symbol && win !== false) {
                win = true;
            } else {
                win = false;
            }
        }

        if (win === true) {
            return "h";
        } else {
            win = null;
        }

        if (win !== true) {
            //check vertical
            for (i = 0; i < 3; i++) {
                if (gameState[i][y] === symbol && win !== false) {
                    win = true;
                } else {
                    win = false;
                }
            }
            if (win === true) {
                return "v";
            } else {
                win = null;
            }
        }

        if (win !== true) {
            //check slant
            for (i = 0; i < 3; i++) {
                if (gameState[i][i] === symbol && win !== false) {
                    win = true;
                } else {
                    win = false;
                }
            }
            if (win === true) {
                return "s";
            } else {
                win = null;
            }
        }
        if (win !== true) {
            //check anti-slant
            for (i = 0, g = 2; i < 3 && g > -1; i++, g--) {
                if (gameState[i][g] === symbol && win !== false) {
                    win = true;
                } else {
                    win = false;
                }
            }
            if (win === true) {
                return "a";
            } else {
				return false;
			}
        }

	},
	gameIsDraw = function(){
        var i, g;
        for (i = 0; i < 3; i++) {
            for (g = 0; g < 3; g++) {
                if (gameState[i][g] === undefined || gameState[i][g] === null) {
                    return false;
                }
            }
        }
        return true;
	},
	gameDisplayWin = function(x, y, type){
		//type expects 'h' for horizontal, 'v' for vertical, 's' for slant, 'a' for anti-slant
        switch (type) {
            case 'h':
                switch (x) {
                    case 0:
                        $("#win_horizontal_line_0").fadeIn(800);
                        break;
                    case 1:
                        $("#win_horizontal_line_1").fadeIn(800);
                        break;
                    case 2:
                        $("#win_horizontal_line_2").fadeIn(800);
                        break;
                }
                break;
            case 'v':
                switch (y) {
                    case 0:
                        $("#win_vertical_line_0").fadeIn(800);
                        break;
                    case 1:
                        $("#win_vertical_line_1").fadeIn(800);
                        break;
                    case 2:
                        $("#win_vertical_line_2").fadeIn(800);
                        break;
                }
                break;
            case "s":
                $("#win_slant_line_reg").fadeIn(800);
                break;
            case "a":
                $("#win_slant_line_anti").fadeIn(800);
                break;
        }
	},
	boardSet = function(){
		boardLoopPieces(function(that, x, y){
			that.text(gameState[x][y]);
		});
	},
	gameDisplayScore = function(){
		$("#score_player").text(gamePlayerScore);
		$("#score_cpu").text(gameCpuScore);
	},
	gameMoveCpuEasy = function(){
		var randX,
			randY,
			found;

        while (!found) {
            randX = Math.floor(Math.random() * 3);
            randY = Math.floor(Math.random() * 3);
            if (boardIsTaken(randX, randY)) {
                found = false;
            } else {
                found = true;
			}
        }

        return [randX, randY];
	},
		gameMoveCpuHard = function(){
		var randX,
			randY,
			found;

        while (!found) {
            randX = Math.floor(Math.random() * 3);
            randY = Math.floor(Math.random() * 3);
            if (boardIsTaken(randX, randY)) {
                found = false;
            } else {
                found = true;
			}
        }

        return [randX, randY];
	},
	gameMoveCpu = function(){
		var nextPosition,
			x,
			y,
			winType;
		
		nextPosition = gameMoveCpuEasy();
		if(nextPosition){
			x = nextPosition[0]; 
			y = nextPosition[1];
			boardTake(x, y, gameCpuSymbol);
		}
		
		winType = gameIsWin(x, y, gameCpuSymbol);
			
		if(winType) {
			gameDisplayWin(x, y, winType);
			gameCpuScore++;
			boardDisable();
			//show win?
		} else if(gameIsDraw())	{
			alert("DRAW!");
		}
		gameDisplayScore();
		boardSet();
	},
	gameMovePlayerSet = function(x,y){
		var response;

		response = boardTake(x, y, gamePlayerSymbol);
				
		if(!response){ 
			alert("This position is taken."); 
		} else {
			winType = gameIsWin(x, y, gamePlayerSymbol);
				
			if(winType) { 
				gameDisplayWin(x, y, winType);
				boardDisable();
				gamePlayerScore++;
				//show win?
			} else if(gameIsDraw())	{
					alert("DRAW!");
			} else {
				console.log("Moving CPU player");
				gameMoveCpu();
			}
			gameDisplayScore();
			boardSet();
		}
	},
	gameSetListeners = function(){
		boardLoopPieces(function(that, x, y){
			that.on("click", function(){
				gameMovePlayerSet(x,y);
			});
		})
	};
	
	$(document).ready(function(){
		gameSetListeners();
		$("#reset_game").on("click", function(){
			gameReset();
		});
		$("#reset_score").on("click", function(){
			gameResetScores();
			gameDisplayScore();
		});
	});