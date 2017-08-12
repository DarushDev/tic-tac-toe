$(document).ready(function(){
    var winSituations = [[1,2,3],
        [4,5,6],
        [7,8,9],
        [1,4,7],
        [2,5,8],
        [3,6,9],
        [1,5,9],
        [3,5,7]];
    var circle = '<i class="fa fa-circle-o fa-4x" aria-hidden="true"></i>';
    var cross = '<i class="fa fa-times fa-4x" aria-hidden="true"></i>';
    var circleScore = 0;
    var crossScore = 0;
    var score = $("#score");
    var mainText = $("#turn-main");
    var isCircleTurn = true;
    var won = false;
    var circleArray = [];
    var crossArray = [];
    var repeatButton = $("#repeat");
    var resetButton = $("#reset");
    var playButton = $("#play-button");
    var firstScreen = $("#first-screen-wrapper");
    var playScreen = $("#play-screen");
    var playerSymbol = "";
    var isComputerTurn = false;

    $("#computer").click(function(){
        $("#first-screen h3").eq(1).stop().css('opacity', '0').text("Choose your mark:").animate({
            opacity: 1
        }, 1000);
    });

    $("#human").click(function(){
        $("#first-screen h3").eq(1).stop().css('opacity', '0').text("Who plays first?").animate({
            opacity: 1
        }, 1000);
    });

    $("#bottom-wrapper i").eq(0).click(function(){
        $(this).addClass("selected").removeClass("button-hover");
        $("#bottom-wrapper i").eq(1).addClass("button-hover").removeClass("selected");
    });

    $("#bottom-wrapper i").eq(1).click(function(){
        $(this).addClass("selected").removeClass("button-hover");
        $("#bottom-wrapper i").eq(0).addClass("button-hover").removeClass("selected");
    });

    playButton.click(function(){
        $(".button").empty();//clear the screen
        firstScreen.fadeOut(500).promise().then(function(){//fade out the player chooser screen
            playScreen.fadeIn(500);//fade in the playing screen
            if($("#bottom-wrapper i").eq(1).hasClass("selected")){//if cross is selected in the first screen
                isCircleTurn = false;
                playerSymbol = "cross";
                $("#player-turn").addClass("fa-times").removeClass("fa-circle-o");
            } else { //if circle is selected in the first screen
                isCircleTurn = true;
                playerSymbol = "circle";
                $("#player-turn").addClass("fa-circle-o").removeClass("fa-times");
            }

            attachClickEvents();

            if( $("#computer").is(":checked") ) {
                playWithComputer();
            }

        });
    });

    repeatButton.click(function(){
        rotateButton($(this));
        repeatTheGame();
    });

    resetButton.click(function(){
        rotateButton($(this));
        circleScore = 0;
        crossScore = 0;
        score.text(circleScore + " - " + crossScore);//update score board
        playScreen.fadeOut(500).promise().then(function(){
            firstScreen.fadeIn(500);
        });
        repeatTheGame();
    });

    function attachClickEvents(){
        var movesCounter = 0;
        for(var i=1; i<=9; i++){

            $("#btn"+i).off("click").one("click",function(){
                movesCounter++;
                if(isCircleTurn) {//Circle's turn
                    appendASymbol($(this), circle);
                    showPlayerTurn();
                    circleArray.push(parseInt($(this).attr("value")));
                    isCircleTurn = false;

                    if(isThreeInARow(circleArray)){//if won the game
                        changeMainText('<i class="fa fa-circle-o fa-2x" aria-hidden="true" id="player-turn"></i><span class="turn"> wins</span>');
                        $(".button").off(); //disable click listener
                        circleScore++; //increase circle score
                        score.text(circleScore + " - " + crossScore); //update score board
                    } else if(movesCounter >= 9){
                        changeMainText('<span class="turn">It&apos;s a draw</span>');
                        $(".button").off();//disbale click listener
                    }

                } else {//Cross's turn

                    appendASymbol($(this), cross);
                    showPlayerTurn();
                    crossArray.push(parseInt($(this).attr("value")));
                    isCircleTurn = true;

                    if(isThreeInARow(crossArray)){//If won the game
                        changeMainText('<i class="fa fa-times fa-2x" aria-hidden="true" id="player-turn"></i><span class="turn"> wins</span>');
                        $(".button").off(); //disable further clicks
                        crossScore++;// increse cross score
                        score.text(circleScore + " - " + crossScore);//update score board
                    } else if(movesCounter >= 9){
                        changeMainText('<span class="turn">It&apos;s a draw</span>');
                        $(".button").off();
                    }

                }

            });

        }

    }



});