export default class WaitingRoom extends Phaser.Scene{
    constructor(){
        super({key:"WaitingRoom"});
    }
    create(){
        this.socket=io();
        this.socket.on("getNumOfPlayers",(numOfPlayersConnected)=>{
            if(this.playersConnected==null)this.playersConnected=this.add.text(this.cameras.main.displayWidth/2-135,this.cameras.main.displayHeight/2-30,"Players: "+numOfPlayersConnected+"/4",{font:"50px Arial",fill:"white",stroke:"black",strokeThickness:5});
            else this.playersConnected.setText("Players: "+numOfPlayersConnected+"/4");
        });
        this.socket.on("fullRoom",(players)=>{
            delay(500).then(()=>{
                this.game.scene.start("MainSceneMult",{socket:this.socket,playersId:players});
                this.scene.sleep();
            });
        });        
    }
}
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}