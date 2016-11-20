module.exports = function(io) {
    'use strict';

    //        io.on('connection', function (socket) {
    //    
    //            console.log('a user connected');
    //    
    //            socket.on('chat message', function (msg) {
    //                console.log('to: ' + msg.to);
    //                console.log('message: ' + msg.message);
    //                //            io.emit('chat message', msg);
    //                //sockets[0].emit('chat message', msg.message);
    //    
    //                console.log(sockets[msg.to]);
    //    
    //                io.sockets.connected[sockets[msg.to]].emit('chat message', msg.message);
    //    
    //            });
    //    
    //            socket.on('disconnect', function () {
    //                console.log('user disconnected');
    //            });
    //    
    //            socket.on('add user', function (data) {
    //    
    //                console.log('user added :' + data.username)
    //    
    //                users.push(data.username);
    //                sockets[data.username] = socket.id;
    //    
    //                console.log(socket.id);
    //    
    //                io.emit('user joined', users);
    //            });
    //    
    //        });


    function socketManager() {

        this.socketInfo = [];
        this.activeSocktes = 0;

        this.getUserNameBySocketId = function(socketId) {

            var result;

            this.socketInfo.forEach(function(el) {

                if (el.socketId == socketId) {
                    result = el;
                }
            });

            return result;

        };

        this.getSocketIDByUserName = function(userName) {

            var result;

 
            this.socketInfo.forEach(function(el) {
 

                if (el.username == userName)
                    result = el;
            });


            return result;
        };


        this.storeSocketInfo = function(data) {

            if (data && data.username && data.socketId) {

                this.socketInfo.push({
                    username: data.username,
                    socketId: data.socketId
                });
            }

        };

        this.removeSocket = function(data) {

            if (data.username) {

                this.socketInfo = this.socketInfo
                    .filter(function(el) {
                        return el.username !== data.username;
                    });

            }

            if (data.socketId) {

                this.socketInfo = this.socketInfo
                    .filter(function(el) {
                        return el.socketId !== data.socketId;
                    });

            }

        };

        this.getUserList = function() {

            var tmpUsr = [];

            this.socketInfo.forEach(function(el) {

                if (el.username) {

                    tmpUsr.push(el.username);

                }

            });


            return tmpUsr;
        };

        this.userExists = function(username) {

            var result = false;

            this.socketInfo.forEach(function(el) {

                if (el.username == username) {
                    result = true;
                }

            });
            return result;
        };


    }


    var objSocketManager = new socketManager();
    var gameManager = require('./gameModule')();


    io.on('connection', function(socket) {

        //BOC USER MANAGER LOGIC
        console.log('user connected on socket: ' + socket.id);

        socket.on('disconnect', function() {

            console.log('user disconnected from socket :' + socket.id);

            var userSocketInfo = objSocketManager.getUserNameBySocketId(socket.id);

            if (userSocketInfo && userSocketInfo.username) {


                objSocketManager.removeSocket({
                    username: userSocketInfo.username
                });

                io.emit('user left', {
                    username: userSocketInfo.username
                });
            }

        });

        socket.on('identify', function(data) {

            if (data && data.username && socket.id) {




                if (objSocketManager.userExists(data.username)) {

                    var response = {
                        authentication: false
                    }

                    socket.emit('identified', response);

                }
                else {
                    objSocketManager.storeSocketInfo({
                        username: data.username,
                        socketId: socket.id
                    });


                    console.log(objSocketManager.socketInfo);

                    socket.broadcast.emit('user joined', {
                        username: data.username
                    });



                    var response = {
                        authentication: true
                    }

                    console.log('socketID')
                    console.log(socket.id)
                    socket.emit('identified', response);

                }
            }

        });

        socket.on('get active user list', function(data) {

            var response = {
                activeUserList: objSocketManager.getUserList()
            };

            socket.emit('active user list', response);
        });

        //EOC USER MANAGER LOGIC


        //BOC GAME LOGIC

        socket.on('challenge', function(data) {

            if (data && data.challenger && data.challenged) {


                var userSocketInfo = objSocketManager.getSocketIDByUserName(data.challenged)

                if (userSocketInfo && userSocketInfo.socketId) {

                    var challenge = gameManager.createChallenge(data.challenger, data.challenged)

                    if (challenge && challenge.challengeID && challenge.gameData) {
                        var response = {

                            challengeID: challenge.challengeID,
                            challenger: data.challenger


                        }

                        io.to(userSocketInfo.socketId).emit('challenged', response);
                    }
                }

            }



        });

        socket.on('challenge response', function(data) {

            if (data && data.challengeID) {

                    var challenge = gameManager.getChallengeByChallengID(data.challengeID);

                    var userSocketInfoChallenger = objSocketManager.getSocketIDByUserName(challenge.challenger);
                    var userSocketInfoChallenged = objSocketManager.getSocketIDByUserName(challenge.challenged);

                    if (challenge && userSocketInfoChallenger && userSocketInfoChallenged) {
 

                        var response = {

                            challengeID: challenge.challengeID,
                            challengeAccepted: data.challengeAccepted,
                            gameData: (data.challengeAccepted == true ? challenge.gameData : {})

                        }


                        io.to(userSocketInfoChallenger.socketId).emit('challenge response', response);

                        if (data.challengeAccepted)
                            io.to(userSocketInfoChallenged.socketId).emit('challenge response', response);


                    }

                }

        });



         socket.on("evaluate challenge", function (data) {



            if (data.challengeID && data.username && data.wordList) {



                var challenge = gameManager.getChallengeByChallengID(data.challengeID);


                if (challenge) {


                    if (challenge.challenger == data.username) {



                        challenge.challengedWordList = data.wordList;
                        challenge.chllengedResultSubmitted = true;


                    } else {

                        challenge.challengerWordList = data.wordList;
                        challenge.challengerResultSubmitted = true;

                    }


                    if (challenge.challengerResultSubmitted == true && challenge.chllengedResultSubmitted == true) {


                        var challengerSocketInfo = objSocketManager.getSocketIDByUserName(challenge.challenger);
                        var challengedSocketInfo = objSocketManager.getSocketIDByUserName(challenge.challenged);


                        var gameResult = gameManager.evaluateChallenge(challenge);


                        var challengerResponse = {

                            challengeID: challenge.challengeID,
                            status: gameResult == "DRAW" ? "DRAW" : (challenge.challenger == gameResult ? "WON" : "LOSE"),
                            score: 0

                        }


                        var challengedResponse = {

                            challengeID: challenge.challengeID,
                            status: gameResult == "DRAW" ? "DRAW" : (challenge.challenged == gameResult ? "WON" : "LOSE"),
                            score: 0

                        }


                        io.to(challengerSocketInfo.socketId).emit("challenge result", challengerResponse);

                        io.to(challengedSocketInfo.socketId).emit("challenge result", challengedResponse);


                    }


                }
            }

        })




        //BOC PRE SWAP EVENT

        socket.on("swap word list", function(data) {

            if (data && data.challengeID && data.username && data.wordList) {

                var challenge = gameManager.getChallengeByChallengID(data.challengeID);


                if (challenge) {


                    if (challenge.challenger == data.username) {

                        challenge.challengerWordListPre = data.wordList;
                        challenge.challengerResultSubmittedPre = true;


                    }
                    else {

                        challenge.challengedWordListPre = data.wordList;
                        challenge.chllengedResultSubmittedPre = true;

                    }


                    if (challenge.challengerResultSubmittedPre == true && challenge.chllengedResultSubmittedPre == true) {


                        var challengerSocketInfo = objSocketManager.getSocketIDByUserName(challenge.challenger);
                        var challengedSocketInfo = objSocketManager.getSocketIDByUserName(challenge.challenged);

                        
                        gameManager.removeDuplicateWordsFromWordList(challenge);


                        var challengerResponse = {

                            challengeID: challenge.challengeID,
                            wordList: challenge.challengedWordListPre
                        }


                        var challengedResponse = {

                            challengeID: challenge.challengeID,
                            wordList: challenge.challengerWordListPre
                        }


                        io.to(challengerSocketInfo.socketId).emit("swap word list", challengerResponse);

                        io.to(challengedSocketInfo.socketId).emit("swap word list", challengedResponse);

                    }



                }
            }




        })


        //EOC PRE SWAP EVENT




        //EOC GAME LOGIC

    });
}