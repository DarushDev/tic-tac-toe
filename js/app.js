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



});