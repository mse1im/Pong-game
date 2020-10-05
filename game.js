(function () {
    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        },
        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 450,
            borderRadius: 50,
            background: '#C6A62F'
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        stick1: {
            left: 0,
            top: 150
        },
        stick2:{
            right: 0,
            top: 150
        },
        score: {
            width: 40,
            height: 40,
            position: 'absolute',
            top: 10,
            left: 400,
            borderRadius: 5,
            background: '#C6A62F',
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: '40px',
            fontSize: '18px',
            fontWeight: 'bold'
        },
        score2: {
            width: 40,
            height: 40,
            position: 'absolute',
            top: 10,
            left: 460,
            borderRadius: 5,
            background: '#C6A62F',
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: '40px',
            fontSize: '18px',
            fontWeight: 'bold'
        },
        gameover: {
            position: 'absolute',
            width: 900,
            height: 600,
            background: '#555555',
            zIndex: '99'
        },
        gameoverlabel: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '27px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#FFFFFF'
        },
        gameoverbutton: {
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#777777',
            fontSize: '27px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#FFFFFF',
            borderRadius: 5,
            padding: '5px 10px'
        }

    };
    var CONSTS = {
    	gameSpeed: 20,
        score1: 0,
        score2: 0,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0,
        gameover: false,
    };

    function start() {
        var oldGame = localStorage.getItem('old_consts');
        if(oldGame){
            CONSTS = JSON.parse(oldGame);
        }
        draw();
        setEvents();
        roll();
        loop();
    }

    function draw() {
        $('<div/>', {id: 'pong-game'}).css(CSS.arena).appendTo('body');
        $('<div/>', {id: 'pong-line'}).css(CSS.line).appendTo('#pong-game');
        $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', {id: 'score1'}).css(CSS.score).text(CONSTS.score1).appendTo('#pong-game');
        $('<div/>', {id: 'score2'}).css(CSS.score2).text(CONSTS.score2).appendTo('#pong-game');

        $('<div/>', {id: 'stick-1'}).css($.extend(CSS.stick1, CSS.stick))        
        .appendTo('#pong-game');
        $('<div/>', {id: 'stick-2'}).css($.extend(CSS.stick2, CSS.stick))        
        .appendTo('#pong-game');

         $('<div/>', {id: 'gameover'}).css(CSS.gameover).appendTo('#pong-game');
         $('<div/>', {id: 'gameoverlabel'}).css(CSS.gameoverlabel).text('').appendTo('#gameover');
        $('<div/>', {id: 'gameoverbutton'}).css(CSS.gameoverbutton).text('click for play again').appendTo('#gameover');
        
        $('#gameoverbutton').on('click', function (e) {
            CONSTS.score1=0;
            CONSTS.score2=0;
            CONSTS.gameover=false;
            loop();         
        });


    }

    function gameover(){
        if(CONSTS.gameover == true){
            $('#gameover').css({opacity: 1});
        }else{
            $('#gameover').css({opacity: 0});
        }
        var winner = 'PLAYER LEFT';
        if(CONSTS.score2 >= 5){
            winner = 'PLAYER RIGHT'
        }

        $('#gameoverlabel').text(winner+ ' WINNER!');
        clearInterval(window.pongLoop);
    }

    function setEvents() {

        $(document).on('keydown', function (e) {
            if (e.keyCode == 87) {
                CONSTS.stick1Speed = -10;
            }

            if(e.keyCode == 38){
                CONSTS.stick2Speed = -10;
            }
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode == 87) {
                CONSTS.stick1Speed = 0;
            }
             if(e.keyCode == 38){
                CONSTS.stick2Speed = 0;
            }
        });
        $(document).on('keydown', function (e) {
            if (e.keyCode == 83) {
                CONSTS.stick1Speed = +10;
            }
            if(e.keyCode == 40){
                CONSTS.stick2Speed = +10;
            }
        });

        $(document).on('keyup', function (e) {
            if (e.keyCode == 83) {
                CONSTS.stick1Speed = 0;
            }
            if(e.keyCode == 40){
                CONSTS.stick2Speed = 0;
            }
        });

        $(document).on('keyup', function (e) { // save the game on localstorage;
            if (e.keyCode == 80) {
                alert("GAME SAVED");
                localStorage.setItem('old_consts', JSON.stringify(CONSTS));
            }
            
        });

    }

    function loop() {
        window.pongLoop = setInterval(function () {

            if(CONSTS.gameover == true){
                $('#gameover').css({opacity: 1});
            }else{
                $('#gameover').css({opacity: 0});
            }

            if(CONSTS.score1>= 5 || CONSTS.score2 >=5){
                CONSTS.gameover = true;
                gameover();
                return;
            }
            if(CONSTS.stick1Speed < 0 ){ // stick going to up
                if(CSS.stick1.top + CONSTS.stick1Speed > 0 ){
                    CSS.stick1.top += CONSTS.stick1Speed;
                }else{
                    CSS.stick1.top = 0;
                }
                
            }else if (CONSTS.stick1Speed > 0 ){ // stick going to down
                var stickHeight = CSS.stick1.height;
                var posY = CSS.stick1.top + stickHeight;
                if(posY + CONSTS.stick1Speed < CSS.arena.height){
                    CSS.stick1.top += CONSTS.stick1Speed;
                }else{
                    CSS.stick1.top += CSS.arena.height-posY ;
                }
            }
          
            $('#stick-1').css('top', CSS.stick1.top);


            if(CONSTS.stick2Speed < 0 ){ // stick going to up
                if(CSS.stick2.top + CONSTS.stick2Speed > 0 ){
                    CSS.stick2.top += CONSTS.stick2Speed;
                }else{
                    CSS.stick2.top = 0;
                }
                
            }else if (CONSTS.stick2Speed > 0 ){ // stick going to down
                var stickHeight = CSS.stick2.height;
                var posY = CSS.stick2.top + stickHeight;
                if(posY + CONSTS.stick2Speed < CSS.arena.height){
                    CSS.stick2.top += CONSTS.stick2Speed;
                }else{
                    CSS.stick2.top += CSS.arena.height-posY ;
                }
            }

            $('#score1').text(CONSTS.score1);
            $('#score2').text(CONSTS.score2);
          
            $('#stick-2').css('top', CSS.stick2.top);

            CSS.ball.top += CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed;

            if (CSS.ball.top <= 0 ||
                CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
            }

            //CONSTS.ballLeftSpeed = -15;

            $('#pong-ball').css({top: CSS.ball.top,left: CSS.ball.left});

            if (CSS.ball.left <= CSS.stick.width) {
            	CSS.ball.top > CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1) || roll("l");
                
            }

            if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.stick.width) {
                CSS.ball.top > CSS.stick2.top && CSS.ball.top < CSS.stick2.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1) || roll("r");
            }
        }, CONSTS.gameSpeed);
    }

    function roll(direction) {
        if(direction=='r'){
            CONSTS.score1 = CONSTS.score1+1;
        }else if(direction == 'l'){
            CONSTS.score2 = CONSTS.score2+1;
        }
        CSS.ball.top = 293.5;
        CSS.ball.left = 443.5;
        console.log(CONSTS);


        var side = -1;

        if (Math.random() < 0.5) {
            side = 1;
        }

        CONSTS.ballTopSpeed = Math.random() * -2 - 3;
        CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
    }

    start();
})();