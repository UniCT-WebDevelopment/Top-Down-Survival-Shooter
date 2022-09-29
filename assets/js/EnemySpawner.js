import MainScene from "./MainScene.js";
import Enemy from "./Enemy.js";
import Turret from "./Turret.js";
export default class EnemySpawner{
    constructor(scene){
        this.scene=scene;
        this.maxWaves=5;
        this.currentWave=1;
        this.currentWaveEnemies=0;
        this.waveStart=false;
        this.spawned=false;
        this.victory=false;
        this.secondsRemaining=30;
        this.enemiesKilled=0;        
        this.numberOfEnemiesText=null;
        this.victoryText=null;
    }
    create(scene){
        this.timerEvent=this.scene.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });
        this.spawnableSpots=this.scene.getSpawnable();
        console.log(scene);
    }
    update(){
        if(!this.victory){
            if(this.currentWave==this.maxWaves && this.enemiesCountKilled()){
                this.spawned=false;
                this.victory=true;
                this.currentWaveEnemiesNumber();
                this.victoryScreen();
            }
            if(this.waveStart){          
                this.spawnEnemies();
            }
            if(this.spawned){
                for(let i=0;i<this.enemiesSpawned.length;i++)if(this.enemiesSpawned[i]!=null)this.enemiesSpawned[i].update(this);
                this.currentWaveEnemiesNumber();
                if(this.enemiesCountKilled()){
                    this.enemiesKilled=0;
                    this.currentWave++;
                    MainScene.updateWave(this);
                    this.secondsRemaining=30;
                    MainScene.updateWaveTimer(this);
                    this.timerEvent.paused=false;
                    this.spawned=false;
                    this.enemiesSpawned=[];
                    Turret.getEnemiesSpawned(this.enemiesSpawned);
                    this.numberOfEnemiesText.setText("");
                }
            }
              
        }
        if(this.victoryText!=null){           
            if(this.victoryText.x!=this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2 || this.victoryText.y!=this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2){
                this.victoryText.x=this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
                this.victoryText.y=this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2;
            }
        }
        if(this.numberOfEnemiesText!=null){           
            if(this.numberOfEnemiesText.x!=this.scene.cameras.main.displayWidth-290){
                this.numberOfEnemiesText.x=this.scene.cameras.main.displayWidth-290;
            }
        }
    }
    spawnEnemies(){
        this.currentWaveEnemies=10*this.currentWave;
        this.enemiesSpawned=new Array(this.currentWaveEnemies);
        var droppers=new Array(this.currentWave);
        for(let i=0;i<droppers.length;i++){
            droppers[i]=Phaser.Math.Between(0,this.currentWaveEnemies-1);
            for(let j=0;j<i;j++){
                while(droppers[j]==droppers[i]){
                    droppers[j]=Phaser.Math.Between(0,this.currentWaveEnemies-1);
                }
            }
        }
        for(let i=0;i<this.enemiesSpawned.length;i++){
            var spawn=Phaser.Math.Between(0,this.spawnableSpots.length-1)
            var spawnX=this.spawnableSpots[spawn].pixelX*3;
            var spawnY=this.spawnableSpots[spawn].pixelY*3;
            this.enemiesSpawned[i]=new Enemy({scene:this.scene,x:spawnX,y:spawnY,texture:"enemy_idle",frame:"skeleton-idle_0"},1,this.scene.player);
            this.enemiesSpawned[i].create();          
        }
        for(let i=0;i<droppers.length;i++){
            this.enemiesSpawned[droppers[i]].drop=true;
        }
        this.currentWaveEnemiesNumber();  
        Turret.getEnemiesSpawned(this.enemiesSpawned);
        this.waveStart=false;
        this.spawned=true;
    }
    enemiesCountKilled(){
        return this.enemiesKilled==this.currentWaveEnemies;
    }
    getEnemiesAlive(){
        return this.currentWaveEnemies-this.enemiesKilled;
    }
    getMaxWaves(){
        return this.maxWaves;
    }
    getCurrentWave(){
        return this.currentWave;
    }
    currentWaveEnemiesNumber(){
        if(this.numberOfEnemiesText==null){
            this.numberOfEnemiesText=this.scene.add.text(this.scene.cameras.main.displayWidth-290,5,"Enemies Alive: "+this.getEnemiesAlive()+"/"+this.currentWaveEnemies,{font:"30px Arial",fill:"white",stroke:"black",strokeThickness:1});
            this.numberOfEnemiesText.scrollFactorX=0;
            this.numberOfEnemiesText.scrollFactorY=0;
        }else this.numberOfEnemiesText.setText("Enemies Alive: "+this.getEnemiesAlive()+"/"+this.currentWaveEnemies);
    }    
    victoryScreen(){
        this.victoryText=this.scene.add.text(this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2,this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2,"YOU WIN",{font:"100px Arial",fill:"white",stroke:"black",strokeThickness:2}).setOrigin(0.5);
        this.scene.game.scene.pause("MainScene");
    }
}
function onEvent(){
    if(this.secondsRemaining>=0){
        this.secondsRemaining-=1;
        MainScene.updateWaveTimer(this);
        if(this.secondsRemaining<0) {
            this.waveStart=true;
            this.timerEvent.paused=true;
        }
    }
}
