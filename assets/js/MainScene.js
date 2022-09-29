import Enemy from "./Enemy.js";
import EnemySpawner from "./EnemySpawner.js";
import HUD from "./HUD.js";
import IronOre from "./Iron_Ore.js";
import Player from "./Player.js";
import Turret from "./Turret.js";
import TurretBase from "./TurretBase.js";
export default class MainScene extends Phaser.Scene{
    constructor(){
        super({
            key:"MainScene",
            physics:{
                arcade:{
                    debugg:true,
                    gravity:{y:0}
                },
                matter:{
                    gravity:{y:0}
                }
            }
        });
        
        this.Spawnable=[];
        this.TurretBases=[];
        this.Ores=[];
    }
    preload(){
        this.load.image("tiles","/assets/Tiles/DesertTilemap16x16_extruded.png");
        this.load.image("tiles2","/assets/Tiles/DesertTilemapBlankBackground_extruded.png");
        this.load.tilemapTiledJSON("map","assets/Tiles/Mappa SinglePlayer.json");
        Player.preload(this);
        Enemy.preload(this);
        IronOre.preload(this);
        TurretBase.preload(this);
        Turret.preload(this);
        HUD.preload(this);
    }

    create(){
        this.createMap();
        this.player=new Player({scene:this,x:1300,y:1850,texture:"handgun_idle",frame:"survivor-idle_handgun_0"});
        this.player.create(this);  
        this.cameras.main.setBounds(0,0,this.map.widthInPixels*3,this.map.heightInPixels*3);
        this.cameras.main.zoom=1;
        this.cameras.main.startFollow(this.player);
        this.enemySpawner=new EnemySpawner(this);
        this.enemySpawner.create(this);
        this.inputKeys=this.input.keyboard.addKeys({
            pause:Phaser.Input.Keyboard.KeyCodes.ESC
        });
        nextWaveText=this.add.text(this.cameras.main.displayWidth/2-100,5, 'Next Wave in: '+this.enemySpawner.secondsRemaining,{font:"30px Arial",fill:"black",stroke:"gray",strokeThickness:5});
        nextWaveText.scrollFactorX=0;
        nextWaveText.scrollFactorY=0;

        currentWaveText=this.add.text(5,5, 'Wave: '+ 1+'/'+5,{font:"30px Arial",fill:"black",stroke:"gray",strokeThickness:5});
        currentWaveText.scrollFactorX=0;
        currentWaveText.scrollFactorY=0;
    }


    update(){
        if(this.player.isAlive()) this.player.update(this);
        this.enemySpawner.update();
        for(let i=0;i<this.TurretBases.length;i++){
            this.TurretBases[i].update();
        }        
        if(this.cameras.main.displayWidth/2-100!=nextWaveText.x){
            nextWaveText.x=this.cameras.main.displayWidth/2-100;
        }        
        if(this.inputKeys.pause.isDown){
            this.game.scene.run("PauseMenu");
            this.game.scene.pause("MainScene");
        }
    }
    
    createMap(){        
        this.map=this.make.tilemap({key:"map"});
        const tileset= this.map.addTilesetImage("DesertTilemap","tiles",16,16,1,2);
        const tileset2=this.map.addTilesetImage("DesertTilemapBlankBackground","tiles2",16,16,1,2);   
        const layer1=this.map.createLayer("Floor",tileset);
        layer1.setScale(3);
        const layer2=this.map.createLayer("Decorations",[tileset,tileset2]);
        layer2.setScale(3);
        layer1.setCollisionByProperty({Collides:true});
        layer2.setCollisionByProperty({Collides:true});
        this.matter.world.convertTilemapLayer(layer1);
        this.matter.world.convertTilemapLayer(layer2);
        this.matter.world.setBounds(0,0,this.map.widthInPixels*3,this.map.heightInPixels*3);
        var oreY=650;
        for(let i=0;i<4;i++){
            this.Ores.push(new IronOre({scene:this,x:2420,y:oreY,texture:"iron_ore",frame:"ironore"}));
            oreY+=60;
        }
        this.TurretBases.push(new TurretBase({scene:this,x:770,y:1725,texture:"turret_base",frame:"turretbase"}));
        this.TurretBases.push(new TurretBase({scene:this,x:910,y:1635,texture:"turret_base",frame:"turretbase"}));
        this.TurretBases.push(new TurretBase({scene:this,x:1055,y:1635,texture:"turret_base",frame:"turretbase"}));
        this.TurretBases.push(new TurretBase({scene:this,x:1535,y:1635,texture:"turret_base",frame:"turretbase"}));
        this.TurretBases.push(new TurretBase({scene:this,x:1680,y:1635,texture:"turret_base",frame:"turretbase"}));
        this.TurretBases.push(new TurretBase({scene:this,x:1825,y:1725,texture:"turret_base",frame:"turretbase"}));
        var self=this;
        layer1.forEachTile(function(tile){
            if(tile.properties.Spawnable==true){
                self.Spawnable.push(tile);
            }
        });
    }
    
    static updateWaveTimer(enmSpwn){
        if(enmSpwn.secondsRemaining>=0)nextWaveText.setText('Next Wave in: '+enmSpwn.secondsRemaining);
        else nextWaveText.setText("");
    }
    static updateWave(enmSpwn){
        currentWaveText.setText('Wave: '+ enmSpwn.getCurrentWave()+'/'+enmSpwn.getMaxWaves());
    }
    getOres(){
        return this.Ores;
    }
    getTurretBases(){
        return this.TurretBases;
    }
    getSpawnable(){
        return this.Spawnable;
    }

    
}
var nextWaveText;
var currentWaveText;
