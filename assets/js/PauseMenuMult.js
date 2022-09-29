export default class PauseMenuMult extends Phaser.Scene{
    constructor(){
        super({key:"PauseMenuMult"});
    }
    init(data){
        this.socket=data.socket;
    }
    create(){
        this.cameras.main.setBackgroundColor("rgba(0,0,0,0.2)");
        this.resumeButton=this.add.rectangle(this.cameras.main.displayWidth/2,this.cameras.main.displayHeight/2,300,50,"black","0.8");
        this.resumeButton.scrollFactorX=0;
        this.resumeButton.scrollFactorY=0;
        this.resumeButton.setStrokeStyle(2,0x808080,2);
        this.resumeText=this.add.text(this.resumeButton.getCenter().x-65,this.resumeButton.getCenter().y-17,"RESUME",{font:"30px Arial",fill:"lightgray",stroke:"gray",strokeThickness:2})
        
        this.backToMenu=this.add.rectangle(this.cameras.main.displayWidth/2,this.cameras.main.displayHeight/2+this.resumeButton.height+25,300,50,"black","0.8");
        this.backToMenu.scrollFactorX=0;
        this.backToMenu.scrollFactorY=0;
        this.backToMenu.setStrokeStyle(2,0x808080);
        this.backToMenuText=this.add.text(this.backToMenu.getCenter().x-115,this.backToMenu.getCenter().y-17,"BACK TO MENU",{font:"30px Arial",fill:"lightgray",stroke:"gray",strokeThickness:2});
        this.resumeButton.setInteractive();
        this.backToMenu.setInteractive();

        this.resumeButton.on("pointerdown",()=>{   
            this.game.scene.stop("PauseMenuMult");
        });
        this.resumeButton.on("pointerover",()=>{            
            this.resumeButton.setFillStyle(0x262626,0.9);
        });
        this.resumeButton.on("pointerout",()=>{
            this.resumeButton.setFillStyle(0x000000,0.8);
        });

        this.backToMenu.on("pointerdown",()=>{          
            this.game.scene.run("MainMenu");
            this.socket.disconnect();  
            this.game.scene.stop("MainSceneMult");
            this.game.scene.stop("PauseMenuMult");
        });
        this.backToMenu.on("pointerover",()=>{            
            this.backToMenu.setFillStyle(0x262626,0.9);
        });
        this.backToMenu.on("pointerout",()=>{
            this.backToMenu.setFillStyle(0x000000,0.8);
        });

        this.input.keyboard.on("keydown-ESC",()=>{
            this.game.scene.stop("PauseMenuMult");
        });
    }
}