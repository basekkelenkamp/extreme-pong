class Powerup {

    private div : HTMLElement
    private gameInstance : Game
    private x : number
    private y : number
    private type : number


    constructor(gameInstance : Game){
        
        this.gameInstance = gameInstance
        this.type = this.gameInstance.statePowerup 
        
        this.div = document.createElement("powerup")
        let game = document.getElementsByTagName("game")[0]
        this.div.addEventListener("click", () => this.activatePowerup())

        game.appendChild(this.div)

        this.x = Math.random() * (window.innerWidth - this.div.clientWidth)
        this.y = Math.random() * (window.innerHeight - this.div.clientHeight)

        this.div.style.transform = `translate(${this.x}px, ${this.y}px)`

        if(this.gameInstance.statePowerup == 1){
            this.div.innerHTML = "+ 10 BALLS"
        }
        if(this.gameInstance.statePowerup == 2){
            this.div.innerHTML = "+ 20 BALLS"
            this.div.style.backgroundColor = "rgb(148, 28, 128)"
        }
    }

    activatePowerup(){
        let game = document.getElementsByTagName("game")[0]


        switch(this.type){
            case 1:
                let p1 = document.createElement("p")
                p1.innerHTML = "Balls multiplied"
                game.appendChild(p1)

                this.gameInstance.score += 5
                this.gameInstance.ballAmountStart += 10
                this.div.parentNode?.removeChild(this.div)
            
            case 2:
                console.log("powerup 2 succesful")
                let p2 = document.createElement("p")
                p2.innerHTML = "Balls multiplied x2"
                game.appendChild(p2)

                this.gameInstance.score += 5
                this.gameInstance.ballAmountStart += 20
                this.div.parentNode?.removeChild(this.div)

        }



    }

}