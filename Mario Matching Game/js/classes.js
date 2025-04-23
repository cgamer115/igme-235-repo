class Opponent{
    constructor(playerScore){
        this.playerScore = playerScore;
    }

    randomEvent()
    {
        let randNum = Math.floor(Math.random() * 3) + 1;
        if (randNum == 1)
        {
            this.giveLife();
        }
        else if (randNum == 2)
        {
            this.addPityScore();
        }
        else
        {
            this.multiplyScore();
        }
    }

    addScore()
    {
        this.playerScore.value += 100;
    }

    multiplyScore()
    {
        let randNum = Math.floor(Math.random() * 3) + 1;
        if (randNum == 1)
        {
            this.playerScore *= 2;
        }
        else if (randNum == 2)
        {
            this.playerScore *= 3;
        }
        else
        {
            this.playerScore *= 4;
        }
    }
}