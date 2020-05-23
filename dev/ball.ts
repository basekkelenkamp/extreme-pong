class Ball {
    
    private div : HTMLElement
    private gameInstance : Game
    private x : number
    private y : number

    private _xspeed : number = 2
    private _yspeed : number = 2
    private maxSpeed : number = 20
    
    public get xspeed() : number {return this._xspeed;} 
    public set xspeed(xspeed : number) {this._xspeed = xspeed;}    
    public get yspeed() : number {return this._yspeed;} 
    public set yspeed(yspeed : number) {this._yspeed = yspeed;}
    
    
    constructor(gameInstance : Game) {

        this.gameInstance = gameInstance

        this.div = document.createElement("ball")
        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this.div)
        
        
        this.x = Math.random() * (window.innerWidth - this.div.clientWidth)
        this.y = Math.random() * (window.innerHeight - this.div.clientHeight)
        
    }
    
    public getRectangle() {
        return this.div.getBoundingClientRect()
    }
    
    
    public update() : void {
        this.x += this.xspeed
        this.y += this.yspeed
        
        let rightWall = window.innerWidth - this.div.clientWidth
        let bottomWall = window.innerHeight - this.div.clientHeight
        
        
        if(this.x > rightWall){
            this.xspeed *= -1
            this.gameInstance.score ++
            document.getElementsByTagName("score")[0].innerHTML = `Score: ${this.gameInstance.score}`
        }        
        if(this.y > bottomWall || this.y < 0){
            this.yspeed *= -1
        }
        if (this.xspeed > this.maxSpeed) {
            this.xspeed = this.maxSpeed
        }
        

        if(this.x < 0){
            console.log("removing ball from array")
            let index = this.gameInstance.balls.indexOf(this)
            this.gameInstance.balls.splice(index,1)
            this.gameInstance.score --
            document.getElementsByTagName("score")[0].innerHTML = `Score: ${this.gameInstance.score}`
            this.div.parentNode?.removeChild(this.div)

        }
                
        this.div.style.transform = `translate(${this.x}px, ${this.y}px)`
        
    }


}