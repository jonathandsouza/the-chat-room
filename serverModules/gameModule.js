module.exports = function() {

    'use strict';

    var gameLogic = require('./gameLogic')();


    function Challenge() {

        this.challengeID = 0;
        this.challenger = '';
        this.challenged = '';


        this.challengerWordList = [];
        this.challengerResultSubmitted = false;


        this.challengedWordList = [];
        this.chllengedResultSubmitted = false;


        this.challengerWordListPre = [];
        this.challengerResultSubmittedPre = false;


        this.challengedWordListPre = [];
        this.chllengedResultSubmittedPre = false;




        this.gameData = {

            boggleBoard: []

        }

    }

    function gameManager() {

        this.challengeID = 0;
        this.challenges = [];
        this.createChallenge = function (challenger, challenged) {

            console.log('createChallenge BOC');


            console.log('createChallenge BOC');


            var newChallenge = new Challenge();

            if (challenger && challenged) {
                newChallenge.challengeID = (++this.challengeID);
                newChallenge.challenger = challenger;
                newChallenge.challenged = challenged;
                newChallenge.gameData.boggleBoard = gameLogic.getBoggleBoard();

                this.challenges.push(newChallenge);

            }

            console.log('CREATE CHALLENGE RESULT ::::')
            console.log(newChallenge);

            return newChallenge;

        }

        this.getChallengeByChallengID = function (challengeID) {

            if (challengeID && this.challengeID >= challengeID && this.challenges && this.challenges.length > 0) {

                var result;

                this.challenges.forEach(function (element) {

                    if (element && element.challengeID && challengeID == element.challengeID) {

                        result = element;

                    }
                });

                return result;



            }

        }

    this.removeDuplicateWordsFromWordList = function(challenge)
        {
            if(challenge && challenge.challengedWordListPre && challenge.challengerWordListPre && challenge.challengedWordListPre.length>0 && challenge.challengerWordListPre.length>0 ){
                
                var remWords =[];
                
                
                
                
                
                 for(var i =0 ;i< challenge.challengerWordListPre.length; i++)
                  { 
                      var index = challenge.challengedWordListPre.indexOf(challenge.challengerWordListPre[i]);
                    
                    if(index >=0)
                      {
                          remWords.push(challenge.challengerWordListPre[i]);
                          challenge.challengedWordListPre.splice(index,1);
                          
                      }
                    
                  }
                
                 
                    for(var j=0 ;j< remWords.length; j++)
                              challenge.challengerWordListPre.splice(challenge.challengerWordListPre.indexOf(remWords[j]),1);
               
                
               
                
            }
            
        }

        this.evaluateChallenge = function(challenge) {

 
            if (challenge) {


                if (challenge.challengerWordList.length > challenge.challengedWordList.length) {
 

                    return challenge.challenger;

                }

                if (challenge.challengerWordList.length < challenge.challengedWordList.length) {

                    return challenge.challenged;

                }
 


                if (challenge.challengerWordList.length == challenge.challengedWordList.length) {


                    return "DRAW";

                }

            }


        }


    }




    return new gameManager();

}