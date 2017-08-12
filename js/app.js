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

    function isThreeInARow(arr) {
        var counter;
        for (var i=0; i<winSituations.length; i++) {

            counter = [];
            for (var j=0; j<winSituations[i].length; j++) {
                if (arr.indexOf(winSituations[i][j]) !== -1) {
                    counter.push(winSituations[i][j]);
                }
            }

            if(counter.length === 3){ //if three in a row
                highlightThreeRows(counter);//highlight the three rows
                counter = [];//reset the array that holds the three rows
                $(".button").removeClass("button-hover");//remove the hover effect from all buttons
                return true;
            }

        }
        return false;
    }

    function rotateButton(button){
        button.rotate({
            angle: 0,
            animateTo:360,
            easing: $.easing.easeInOutElastic
        });
    }

    function highlightThreeRows(arr){
        for(var i=0; i<arr.length; i++){
            $("#btn"+arr[i]).css("background-color","#fff");
        }
    }

    function repeatTheGame() {
        $(".button").addClass("button-hover");
        $(".button").children().fadeOut(500).promise().then(function() {
            $(".button").empty();
            $(".button").css("background-color","#252525");

            circleArray = [];
            crossArray = [];
            mainText.empty();

            if(isCircleTurn){
                mainText.append('<span class="turn">It&apos;s </span><i class="fa fa-circle-o fa-2x" aria-hidden="true" id="player-turn"></i><span class="turn"> turn!</span>');
            } else {
                mainText.append('<span class="turn">It&apos;s </span><i class="fa fa-times fa-2x" aria-hidden="true" id="player-turn"></i><span class="turn"> turn!</span>');
            }

            attachClickEvents();
            if($("#computer").is(":checked")) {
                playWithComputer();
            }
        });

    }

    var humanArray = [];
    var computerArray = [];
    var corners = [1,3,7,9];
    var center = 5;
    var edges = [2,4,6,8];
    var oppositeCorners = [[1,9],[3,7]];

    function playWithComputer() {
        var clickCounter = 0;

        $(".button").click(function(){
            console.log("clicked");
            clickCounter++;
            if(playerSymbol === "cross"){
                computerArray = circleArray;
                humanArray = crossArray;
                isComputerTurn = isCircleTurn;
            } else {
                computerArray = crossArray;
                humanArray = circleArray;
                isComputerTurn = !isCircleTurn;
            }

            if(clickCounter < 9){
                if(isComputerTurn){
                    if(clickCounter === 1){
                        if($("#btn"+center).children().length === 0){
                            $("#btn5").trigger("click");
                        } else {
                            $("#btn" + corners[Math.floor(Math.random()*corners.length)]).trigger("click");
                        };
                    } else {

                        if(!isTwoInARow(computerArray)){ //check if you have 2 in a row to make it 3.
                            if(!isTwoInARow(humanArray)){ //check if opponent has 2 in a row, to block it.
                                if(!areOppositeCornersBlocked(humanArray)){//prevent fork if two corners are blocked
                                    if(!makeAThreat(computerArray)){//Make a threat by checking if there are two empty rows
                                        makeARandomSelection();
                                        console.log("last click:"+clickCounter);
                                    }
                                }
                            }
                        }
                    }
                }

            }


        });

        if (isComputerTurn) {
            var possibleMoves = [1,3,7,9,5];
            $("#btn" + possibleMoves[Math.floor(Math.random() * 5)]).trigger("click");
        }

    }

    function isAnyCornerFree(arr) {

    }

    function makeARandomSelection(){
        var emptyButtons = [];
        for(var i=1; i<=9; i++){
            if($("#btn"+i).is(":empty")){
                emptyButtons.push(i);
            }
        }

        if(emptyButtons.length>0){
            $("#btn" + emptyButtons[Math.floor(Math.random() * emptyButtons.length)]).trigger("click");
        }

    }

    function makeAThreat(arr){
        for (var i=0; i<winSituations.length; i++) {
            var tempArr = winSituations[i].slice(0);
            for (var j=0; j<winSituations[i].length; j++) {
                var index = arr.indexOf(winSituations[i][j]);
                if (index > -1) {
                    tempArr.splice(j, 1);
                }
            }

            if (tempArr.length === 2) {
                if($("#btn" + tempArr[0]).is(":empty") && $("#btn" + tempArr[1]).is(":empty")){
                    $("#btn" + tempArr[Math.floor(Math.random() * 2)]).trigger("click");
                    return true;
                }
            }

        }

        return false;
    }

    function areOppositeCornersBlocked(arr){
        for(var i=0; i<oppositeCorners.length; i++){
            var counter = 0;
            for(var j=0; j<oppositeCorners[i].length; j++){
                if(arr.indexOf(oppositeCorners[i][j]) !== -1){
                    counter++;
                }
            }

            if(counter === 2){
                var button;
                for(var k=0; k<edges.length; k++){
                    button = $("#btn"+edges[k]);
                    if(button.is(":empty")){
                        button.trigger("click");
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function isTwoInARow(arr){
        loop1:
            for(var i=0; i<winSituations.length; i++){

                var tempArray = [];
                for(var j=0; j<winSituations[i].length; j++){
                    if(arr.indexOf(winSituations[i][j]) !== -1){
                        tempArray.push(winSituations[i][j]);
                    }
                }

                if(tempArray.length === 2){
                    var button;
                    for(var k=0; k<winSituations[i].length; k++){
                        if(tempArray.indexOf(winSituations[i][k]) === -1){
                            button = $("#btn"+winSituations[i][k]);
                            if(button.is(':empty')){
                                button.trigger("click");
                                return true;;
                            }
                        }
                    }
                }
            }

        return false;

    }

    function appendASymbol(tag, symbol){
        var temp = $(symbol).hide();
        tag.append(temp);
        temp.show('fast');
    }

    function showPlayerTurn(mark){
        if(mark === circle){
            $("#player-turn").css({"padding":"0 !important"}).slideUp("normal",function(){//toggle with a sliding animation
                $(this).toggleClass("fa-circle-o fa-times").slideDown("normal");
            });
        } else {
            $("#player-turn").css({"padding":"0 !important"}).slideUp("normal",function(){//toggle with a sliding animation
                $(this).toggleClass("fa-circle-o fa-times").slideDown("normal");
            });
        }
    }

    function changeMainText(text){
        mainText.empty();
        mainText.append(text);
    }

});