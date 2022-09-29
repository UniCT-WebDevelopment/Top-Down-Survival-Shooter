export default class MainMenu extends Phaser.Scene{
    constructor(){
        super({key:"MainMenu"});
    }
    preload(){
        this.load.image("menuImage","/assets/Tiles/menuImage.jpg");
    }
    create(){
        this.menuImage=this.add.image(this.cameras.main.displayWidth/2,this.cameras.main.displayHeight/2,"menuImage");
        this.menuImage.setDisplaySize(this.cameras.main.displayWidth,this.cameras.main.displayHeight);
        this.title=this.add.text(this.cameras.main.displayWidth/2-410,5,"PROGETTO WEB",{font:"100px Arial",fill:"orange",stroke:"black",strokeThickness:5});

        this.singleplayerButton=this.add.rectangle(this.cameras.main.displayWidth/2,this.cameras.main.displayHeight/2-100,500,100,0xffffff,"0.2");
        this.singleplayerText=this.add.text(this.singleplayerButton.getCenter().x-140,this.singleplayerButton.getCenter().y-30,"Singleplayer",{font:"50px Arial",fill:"white",stroke:"black",strokeThickness:5});
        
        this.multiplayerButton=this.add.rectangle(this.cameras.main.displayWidth/2,this.cameras.main.displayHeight/2+100,500,100,0xffffff,"0.2");
        this.multiplayerText=this.add.text(this.multiplayerButton.getCenter().x-140,this.multiplayerButton.getCenter().y-30,"Multiplayer VS",{font:"50px Arial",fill:"white",stroke:"black",strokeThickness:5});
    
        this.singleplayerButton.setInteractive();
        this.multiplayerButton.setInteractive();

        this.singleplayerButton.on("pointerdown",()=>{            
            this.game.scene.run("MainScene");
            this.game.scene.stop("MainMenu");
        });
        this.singleplayerButton.on("pointerover",()=>{            
            this.singleplayerButton.setFillStyle(0xE1D9D1,0.5);
        });
        this.singleplayerButton.on("pointerout",()=>{
            this.singleplayerButton.setFillStyle(0xffffff,0.2);
        });

        this.multiplayerButton.on("pointerdown",()=>{  
            this.game.scene.start("WaitingRoom");                    
            this.game.scene.stop("MainMenu");
        });
        this.multiplayerButton.on("pointerover",()=>{            
            this.multiplayerButton.setFillStyle(0xE1D9D1,0.5);
        });
        this.multiplayerButton.on("pointerout",()=>{
            this.multiplayerButton.setFillStyle(0xffffff,0.2);
        });
    }
    update(){
        if(this.menuImage.x!=this.cameras.main.displayWidth/2 ||this.menuImage.y!=this.cameras.main.displayHeight/2){
            this.menuImage.x=this.cameras.main.displayWidth/2;
            this.menuImage.y=this.cameras.main.displayHeight/2;
            this.menuImage.setDisplaySize(this.cameras.main.displayWidth,this.cameras.main.displayHeight);
        }
        if(this.title.x!=this.cameras.main.displayWidth/2-410){
            this.title.x=this.cameras.main.displayWidth/2-410;
        }
        
        if(this.singleplayerButton.x!=this.cameras.main.displayWidth/2 || this.singleplayerButton.y!=this.cameras.main.displayHeight/2-100){
            this.singleplayerButton.x=this.cameras.main.displayWidth/2;
            this.singleplayerButton.y=this.cameras.main.displayHeight/2-100;
        }
        if(this.multiplayerButton.x!=this.cameras.main.displayWidth/2 || this.multiplayerButton.y!=this.cameras.main.displayHeight/2+100){
            this.multiplayerButton.x=this.cameras.main.displayWidth/2;
            this.multiplayerButton.y=this.cameras.main.displayHeight/2+100;
        }
        if(this.singleplayerText.x!=this.singleplayerButton.getCenter().x-140 ||this.singleplayerText.y!=this.singleplayerButton.getCenter().y-30){
            this.singleplayerText.x=this.singleplayerButton.getCenter().x-140;
            this.singleplayerText.y=this.singleplayerButton.getCenter().y-30;
        }
        if(this.multiplayerText.x!=this.multiplayerButton.getCenter().x-140 ||this.multiplayerText.y!=this.multiplayerButton.getCenter().y-30){
            this.multiplayerText.x=this.multiplayerButton.getCenter().x-140;
            this.multiplayerText.y=this.multiplayerButton.getCenter().y-30;
        }
    }
}