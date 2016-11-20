module.exports = function() {


    var Chance = require('chance'),
        chance = new Chance();


    function BoogleGenerator() {

        // the 16 Boggle dice (1992 version)
        this.BOGGLE_1992 = [
            "LRYTTE", "VTHRWE", "EGHWNE", "SEOTIS",
            "ANAEEG", "IDSYTT", "OATTOW", "MTOICU",
            "AFPKFS", "XLDERI", "HCPOAS", "ENSIEU",
            "YLDEVR", "ZNRNHL", "NMIQHU", "OBBAOJ"
        ];

        // the 16 Boggle dice (1983 version)
        this.BOGGLE_1983 = [
            "AACIOT", "ABILTY", "ABJMOQ", "ACDEMP",
            "ACELRS", "ADENVZ", "AHMORS", "BIFORX",
            "DENOSW", "DKNOTU", "EEFHIY", "EGINTV",
            "EGKLUY", "EHINPS", "ELPSTU", "GILRUW",
        ];

        // the 25 Boggle Master / Boggle Deluxe dice
        this.BOGGLE_MASTER = [
            "AAAFRS", "AAEEEE", "AAFIRS", "ADENNN", "AEEEEM",
            "AEEGMU", "AEGMNN", "AFIRSY", "BJKQXZ", "CCNSTW",
            "CEIILT", "CEILPT", "CEIPST", "DDLNOR", "DHHLOR",
            "DHHNOT", "DHLNOR", "EIIITT", "EMOTTT", "ENSSSU",
            "FIPRSY", "GORRVW", "HIPRRY", "NOOTUW", "OOOTTU"
        ];

        // the 25 Big Boggle dice
        this.BOGGLE_BIG = [
            "AAAFRS", "AAEEEE", "AAFIRS", "ADENNN", "AEEEEM",
            "AEEGMU", "AEGMNN", "AFIRSY", "BJKQXZ", "CCENST",
            "CEIILT", "CEILPT", "CEIPST", "DDHNOT", "DHHLOR",
            "DHLNOR", "DHLNOR", "EIIITT", "EMOTTT", "ENSSSU",
            "FIPRSY", "GORRVW", "IPRRRY", "NOOTUW", "OOOTTU"
        ];


        // letters and frequencies of letters in the English alphabet
        this.ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


        this.FREQUENCIES = [
            0.08167, 0.01492, 0.02782, 0.04253, 0.12703, 0.02228,
            0.02015, 0.06094, 0.06966, 0.00153, 0.00772, 0.04025,
            0.02406, 0.06749, 0.07507, 0.01929, 0.00095, 0.05987,
            0.06327, 0.09056, 0.02758, 0.00978, 0.02360, 0.00150,
            0.01974, 0.00074
        ];


        /**
         * Initializes a random 4-by-4 board, by rolling the Hasbro dice.
         */
        this.BoggleBoard = function() {
            var M = 4;
            var N = 4;
            var board =  [];

            //StdRandom.shuffle(BOGGLE_1992); //<-------------PROBLEM HERE  chance.pick(BOGGLE_1992);

            for (var i = 0; i < M; i++) {
                for (var j = 0; j < N; j++) {

                    //var letters = this.BOGGLE_1992[N * i + j];

                    var letters = chance.pick(this.BOGGLE_1992);

                    //var r = StdRandom.uniform(letters.length()); //<-------PROBLEM HERE

                    chance.integer({
                        min: 0,
                        max: 10
                    })

                    var r = chance.integer({
                        min: 0,
                        max: (letters.length - 1)
                    });


                    board.push(letters.charAt(r));
                }
            }
            
            return board
        }


        /**
         * Initializes a random M-by-N board, according to the frequency
         * of letters in the English language.
         * @param M the number of rows
         * @param N the number of columns
         */
        // this.BoggleBoard = function(M, N) {


        //     for (var i = 0; i < M; i++) {
        //         for (var j = 0; j < N; j++) {
        //             //var r = StdRandom.discrete(this.FREQUENCIES);
        //             //this.board[i][j] = ALPHABET.charAt(r);
        //         }
        //     }
        // }

    }



    return {

        getBoggleBoard: function() {

            //BOC LOGIC TO GENERATE BOGGLE BOARD

            var generator = new BoogleGenerator();


            //EOC LOGIC TO GENERATE BOGGLE BOARD

            return generator.BoggleBoard();

        },


        evaluate: function(booggleBoard, opponent1WordList, opponent2WordList) {


            //BOC LOGIC TO EVALUATE BOGGLE RESULTS

            //EOC LOGIC TO EVALUATE BOGGLE RESULTS



            if (opponent1WordList && opponent2WordList) {



                if (opponent1WordList.length > opponent2WordList.length)
                    return "won";



                if (opponent1WordList.length < opponent2WordList.length)
                    return "lose"


                if (opponent1WordList.length = opponent2WordList.length)
                    return "draw"

            }



        }






    }


}