pragma circom 2.1.7;

include "../node_modules/circomlib/circuits/comparators.circom";

template Array() {
    signal input ans[5];
    signal input ques[5];
    signal inter[5][5];
    var exist[5];
    component GreaterOrNot[4];

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            inter[i][j] <-- ques[i] == ans[j] ? 1 : 0;
            inter[i][j]*(1-inter[i][j]) === 0;
            exist[i] += inter[i][j]; 
        }
        exist[i]  === 1;
    }

    for(var i = 1; i < 5; i++){
        GreaterOrNot[i - 1] = GreaterThan(3);
        GreaterOrNot[i - 1].in[0] <== ans[i];
        GreaterOrNot[i - 1].in[1] <== ans[i -1];
        GreaterOrNot[i - 1].out === 1;
    }
}

component main{public[ques]} = Array();