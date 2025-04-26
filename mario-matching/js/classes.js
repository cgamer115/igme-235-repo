class Opponent{
    constructor(playerScore){
        this.playerScore = playerScore;
    }

    randomEvent()
    {
        let randNum = Math.floor(Math.random() * 3) + 1;
        if (randNum == 1)
        {
            this.subtractScore();
        }
        else if (randNum == 2)
        {
            this.addScore();
        }
        else
        {
            this.multiplyScore();
        }
    }

    subtractScore()
    {
        this.playerScore.value -= 100;
        console.log("Subtracted");
    }

    addScore()
    {
        this.playerScore.value += 100;
        console.log("Added");
    }

    multiplyScore()
    {
        let randNum = Math.floor(Math.random() * 3) + 1;
        if (randNum == 1)
        {
            this.playerScore.value *= 2;
            console.log("Multiplied 2")
        }
        else if (randNum == 2)
        {
            this.playerScore.value *= 3;
            console.log("Multiplied 3")
        }
        else
        {
            this.playerScore.value *= 4;
            console.log("Multiplied 4")
        }
    }
}