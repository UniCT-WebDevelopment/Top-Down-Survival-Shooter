import Player from "./Player_Multiplayer.js";
import HUD from "./HUD.js";
import IronOre from "./Iron_Ore.js";
import TurretBase from "./TurretBase_Multiplayer.js";
import Turret from "./Turret_Multiplayer.js";
import Bullet from "./Bullet_Multiplayer.js";
export default class MainSceneMult extends Phaser.Scene{
    constructor(){
        super({
            key:"MainSceneMult",
            physics:{
                arcade:{
                    gravity:{y:0}
                },
                matter:{
                    gravity:{y:0}
                }
            }
        });
        this.TurretBases=[];
        this.Ores=[];
        this.players=new Array();        
        this.redPlayer=undefined;
        this.greenPlayer=undefined;
        this.yellowPlayer=undefined; 
        this.bluePlayer=undefined;
        this.playerTargets=new Array(4);
        this.playerCanShoot=new Array(4);
        this.playerWeapon=new Array(4);
        this.turretShooting=new Array(8);
        this.turretTarget=new Array(8);
        for(let i=0;i<8;i++){
            this.turretShooting[i]=false;
        }  
        for(let i=0;i<4;i++){
            this.playerCanShoot[i]=false;
        } 
    }
    init(data){
        this.socket=data.socket;
        this.playersId=data.playersId;
        this.assignColors=["Red","Green","Yellow","Blue"];
    }
    preload(){
        this.load.image("tiles","/assets/Tiles/DesertTilemap16x16_extruded.png");
        this.load.image("tiles2","/assets/Tiles/DesertTilemapBlankBackground_extruded.png");
        this.load.tilemapTiledJSON("mapMult","assets/Tiles/Mappa Multiplayer.json");
        Player.preload(this);
        HUD.preload(this);
        IronOre.preload(this);
        TurretBase.preload(this);
        Turret.preload(this);
    }
    create(){               
        this.TurretBases=[];
        this.Ores=[]; 
        this.createMap();
        this.playerColor=this.assignColors[this.playersId.indexOf(this.socket.id)];
        console.log(this.playerColor);
        if(this.playerColor=="Red")this.player=new Player({scene:this,x:1200,y:2250,texture:"handgun_idle",frame:"survivor-idle_handgun_0"},this.socket,"RedPlayer");
        else if(this.playerColor=="Green")this.player=new Player({scene:this,x:120,y:1200,texture:"handgun_idle",frame:"survivor-idle_handgun_0"},this.socket,"GreenPlayer");
        else if(this.playerColor=="Yellow")this.player=new Player({scene:this,x:1200,y:120,texture:"handgun_idle",frame:"survivor-idle_handgun_0"},this.socket,"YellowPlayer");
        else if(this.playerColor=="Blue")this.player=new Player({scene:this,x:2250,y:1200,texture:"handgun_idle",frame:"survivor-idle_handgun_0"},this.socket,"BluePlayer");
        this.player.create(this);  
        this.cameras.main.setBounds(0,0,this.map.widthInPixels*3,this.map.heightInPixels*3);
        this.cameras.main.zoom=1;
        this.cameras.main.startFollow(this.player);
        
        this.inputKeys=this.input.keyboard.addKeys({
            pause:Phaser.Input.Keyboard.KeyCodes.ESC
        });
        
        this.socket.on("playerNotMoving",(id)=>{
            var playerNotMoving=this.assignColors[this.playersId.indexOf(id)];
            if(playerNotMoving=="Red"){
                if(this.redPlayer && this.redPlayer!=undefined && !this.redPlayerReloading && !this.redPlayerShooting && !this.redPlayerMining)this.redPlayer.anims.play(this.redPlayerActiveWeapon+"_idle",true);
            }
            else if(playerNotMoving=="Green"){
                if(this.greenPlayer && this.greenPlayer!=undefined && !this.greenPlayerReloading && !this.greenPlayerShooting && !this.greenPlayerMining)this.greenPlayer.anims.play(this.greenPlayerActiveWeapon+"_idle",true);
            }
            else if(playerNotMoving=="Yellow"){
                if(this.yellowPlayer && this.yellowPlayer!=undefined && !this.yellowPlayerReloading && !this.yellowPlayerShooting && !this.yellowPlayerMining)this.yellowPlayer.anims.play(this.yellowPlayerActiveWeapon+"_idle",true);
            }
            else if(playerNotMoving=="Blue"){
                if(this.bluePlayer && this.bluePlayer!=undefined && !this.bluePlayerReloading && !this.bluePlayerShooting && !this.bluePlayerMining)this.bluePlayer.anims.play(this.bluePlayerActiveWeapon+"_idle",true);
            }
        });
        this.socket.on("updatePos",(newPosition,id)=>{
            var playerMoved=this.assignColors[this.playersId.indexOf(id)];
            if(playerMoved=="Red"){
                if(this.redPlayer &&!this.redPlayerReloading && !this.redPlayerShooting && !this.redPlayerMining)this.redPlayer.anims.play(this.redPlayerActiveWeapon+"_move",true);
                this.redPlayer.setPosition(newPosition.x,newPosition.y);
            }
            else if(playerMoved=="Green"){
                if(this.greenPlayer && !this.greenPlayerReloading && !this.greenPlayerShooting && !this.greenPlayerMining)this.greenPlayer.anims.play(this.greenPlayerActiveWeapon+"_move",true);
                this.greenPlayer.setPosition(newPosition.x,newPosition.y);
            }
            else if(playerMoved=="Yellow"){
                if(this.yellowPlayer && !this.yellowPlayerReloading && !this.yellowPlayerShooting && !this.yellowPlayerMining)this.yellowPlayer.anims.play(this.yellowPlayerActiveWeapon+"_move",true);
                this.yellowPlayer.setPosition(newPosition.x,newPosition.y);
            }
            else if(playerMoved=="Blue"){
                if(this.bluePlayer && !this.bluePlayerReloading && !this.bluePlayerShooting && !this.bluePlayerMining)this.bluePlayer.anims.play(this.bluePlayerActiveWeapon+"_move",true);
                this.bluePlayer.setPosition(newPosition.x,newPosition.y);
            }
        });
        this.socket.on("updateAngle",(newAngle,id)=>{
            var playerAngle=this.assignColors[this.playersId.indexOf(id)];
            if(playerAngle=="Red" && this.redPlayer)this.redPlayer.angle=newAngle;
            else if(playerAngle=="Green" && this.greenPlayer)this.greenPlayer.angle=newAngle;
            else if(playerAngle=="Yellow" && this.yellowPlayer)this.yellowPlayer.angle=newAngle;
            else if(playerAngle=="Blue" && this.bluePlayer)this.bluePlayer.angle=newAngle;
        });
        this.socket.on("playerIsReloading",(id)=>{
            var playerReloading=this.assignColors[this.playersId.indexOf(id)];
            if(playerReloading=="Red" && this.redPlayer){
                this.redPlayerReloading=true;
                this.redPlayer.anims.play(this.redPlayerActiveWeapon+"_reload",true);
                this.redPlayer.on("animationcomplete",()=>{
                    this.redPlayerReloading=false;
                    this.redPlayer.anims.play(this.redPlayerActiveWeapon+"_idle",true);
                });
            }
            else if(playerReloading=="Green" && this.greenPlayer){
                this.greenPlayerReloading=true;
                this.greenPlayer.anims.play(this.greenPlayerActiveWeapon+"_reload",true);
                this.greenPlayer.on("animationcomplete",()=>{
                    this.greenPlayerReloading=false;
                    this.greenPlayer.anims.play(this.greenPlayerActiveWeapon+"_idle",true);
                });
            }
            else if(playerReloading=="Yellow" && this.yellowPlayer){
                this.yellowPlayerReloading=true;
                this.yellowPlayer.anims.play(this.yellowPlayerActiveWeapon+"_reload",true);
                this.yellowPlayer.on("animationcomplete",()=>{
                    this.yellowPlayerReloading=false;
                    this.yellowPlayer.anims.play(this.yellowPlayerActiveWeapon+"_idle",true);
                });
            }
            else if(playerReloading=="Blue" && this.bluePlayer){
                this.bluePlayerReloading=true;
                this.bluePlayer.anims.play(this.bluePlayerActiveWeapon+"_reload",true);
                this.bluePlayer.on("animationcomplete",()=>{
                    this.bluePlayerReloading=false;
                    this.bluePlayer.anims.play(this.bluePlayerActiveWeapon+"_idle",true);
                });
            }
        });
        this.socket.on("playerIsMining",(id)=>{
            var playerMining=this.assignColors[this.playersId.indexOf(id)];
            if(playerMining=="Red" && this.redPlayer){
                this.redPlayerMining=true;
                this.redPlayer.anims.play("player_mining",true);
                this.redPlayer.on("animationcomplete",()=>{
                    this.redPlayerMining=false;
                    this.redPlayer.anims.play(this.redPlayerActiveWeapon+"_idle",true);
                });
            }
            else if(playerMining=="Green" && this.greenPlayer){
                this.greenPlayerMining=true;
                this.greenPlayer.anims.play("player_mining",true);
                this.greenPlayer.on("animationcomplete",()=>{
                    this.greenPlayerMining=false;
                    this.greenPlayer.anims.play(this.greenPlayerActiveWeapon+"_idle",true);
                });
            }
            else if(playerMining=="Yellow" && this.yellowPlayer){
                this.yellowPlayerMining=true;
                this.yellowPlayer.anims.play("player_mining",true);
                this.yellowPlayer.on("animationcomplete",()=>{
                    this.yellowPlayerMining=false;                    
                    this.yellowPlayer.anims.play(this.yellowPlayerActiveWeapon+"_idle",true);
                });
            }
            else if(playerMining=="Blue" && this.bluePlayer){
                this.bluePlayerMining=true;
                this.bluePlayer.anims.play("player_mining",true);
                this.bluePlayer.on("animationcomplete",()=>{
                    this.bluePlayerMining=false;                    
                    this.bluePlayer.anims.play(this.bluePlayerActiveWeapon+"_idle",true);
                });
            }
        });
        this.socket.on("playerStoppedMining",(id)=>{
            var playerMining=this.assignColors[this.playersId.indexOf(id)];
            if(playerMining=="Red" && this.redPlayer){
                this.redPlayerMining=false;
                this.redPlayer.anims.play(this.redPlayerActiveWeapon+"_idle",true);
            }
            else if(playerMining=="Green" && this.greenPlayer){                
                this.greenPlayerMining=false;
                this.greenPlayer.anims.play(this.greenPlayerActiveWeapon+"_idle",true);
            }
            else if(playerMining=="Yellow" && this.yellowPlayer){
                this.yellowPlayerMining=false;                    
                this.yellowPlayer.anims.play(this.yellowPlayerActiveWeapon+"_idle",true);
            }
            else if(playerMining=="Blue" && this.bluePlayer){
                this.bluePlayerMining=false;                    
                this.bluePlayer.anims.play(this.bluePlayerActiveWeapon+"_idle",true);
            }
        });
        this.socket.on("updateWeapon",(newWeapon,id)=>{
            var playerWeaponChange=this.assignColors[this.playersId.indexOf(id)];
            if(playerWeaponChange=="Red" && this.redPlayer){
                this.redPlayerActiveWeapon=newWeapon;
                this.redPlayer.anims.play(this.redPlayerActiveWeapon+"_idle",true);
            }
            else if(playerWeaponChange=="Green" && this.greenPlayer){
                this.greenPlayerActiveWeapon=newWeapon;
                this.greenPlayer.anims.play(this.greenPlayerActiveWeapon+"_idle",true);
            }
            else if(playerWeaponChange=="Yellow" && this.yellowPlayer){
                this.yellowPlayerActiveWeapon=newWeapon;
                this.yellowPlayer.anims.play(this.yellowPlayerActiveWeapon+"_idle",true);
            }
            else if(playerWeaponChange=="Blue" && this.bluePlayer){
                this.bluePlayerActiveWeapon=newWeapon;
                this.bluePlayer.anims.play(this.bluePlayerActiveWeapon+"_idle",true);
            }
        });
        this.socket.on("updatePlayerShooting",(id,target)=>{
            var color=this.assignColors[this.playersId.indexOf(id)];
            var playerShooting;
            var i;
            if(color=="Red" && this.redPlayer){
                playerShooting=this.redPlayer;
                this.playerWeapon[0]=this.redPlayerActiveWeapon;
                i=0;
            }
            else if(color=="Green" && this.greenPlayer){
                playerShooting=this.greenPlayer;
                this.playerWeapon[1]=this.greenPlayerActiveWeapon;
                i=1;
            }
            else if(color=="Yellow" && this.yellowPlayer){
                playerShooting=this.yellowPlayer;
                this.playerWeapon[2]=this.yellowPlayerActiveWeapon;
                i=2;
            }
            else if(color=="Blue" && this.bluePlayer){
                playerShooting=this.bluePlayer;
                this.playerWeapon[3]=this.bluePlayerActiveWeapon;
                i=3;
            }
            this.playerCanShoot[i]=true;
            this.playerTargets[i]=target;
            playerShooting.anims.play(this.playerWeapon[i]+"_shoot",true);
            playerShooting.on("animationstart",()=>{
                if(this.playerCanShoot[i]){
                    if(i==0 && this.redPlayer) this.redPlayerShooting=true;
                    else if(i==1 && this.greenPlayer) this.greenPlayerShooting=true;
                    else if(i==2 && this.yellowPlayer) this.yellowPlayerShooting=true;
                    else if(i==3 && this.bluePlayer) this.bluePlayerShooting=true;
                    if(this.playerWeapon[i]=="handgun") var bulletShot=new Bullet({scene:this,x:playerShooting.getBottomRight().x,y:playerShooting.getBottomRight().y,texture:"bullet",frame:"bullet"},0);
                    else if(this.playerWeapon[i]=="rifle") var bulletShot=new Bullet({scene:this,x:playerShooting.getBottomRight().x,y:playerShooting.getBottomRight().y,texture:"bullet",frame:"bullet"},0);
                    else if(this.playerWeapon[i]=="shotgun"){
                        var bulletShot=new Bullet({scene:this,x:playerShooting.getCenter().x,y:playerShooting.getCenter().y,texture:"shotgun_bullet",frame:""},0);
                        delay(80).then(()=>bulletShot.destroy());
                    }
                    bulletShot.create(playerShooting,this.playerTargets[i]);
                    this.playerCanShoot[i]=false;
                }
            });
            playerShooting.on("animationcomplete",()=>{
                if(i==0 && this.redPlayer) this.redPlayerShooting=false;
                else if(i==1 && this.greenPlayer) this.greenPlayerShooting=false;
                else if(i==2 && this.yellowPlayer) this.yellowPlayerShooting=false;
                else if(i==3 && this.bluePlayer) this.bluePlayerShooting=false;
            });
        });
        this.socket.on("DamageTaken",(damage)=>{
            if(this.player!=null && this.player!=undefined)this.player.getHit(damage);
        });
        this.socket.on("eliminatePlayer",(id)=>{
            var playerToRemove=this.assignColors[this.playersId.indexOf(id)];
            if(playerToRemove=="Red" && this.redPlayer){
                this.redPlayer.setActive(false).setVisible(false);
                this.redPlayer.body.destroy();
                this.redPlayer.destroy();
                this.redPlayer=null;
                this.players[0]=null;
            }
            else if(playerToRemove=="Green" && this.greenPlayer){
                this.greenPlayer.setActive(false).setVisible(false);
                this.greenPlayer.body.destroy();
                this.greenPlayer.destroy();
                this.greenPlayer=null;
                this.players[1]=null;
            }
            else if(playerToRemove=="Yellow" && this.yellowPlayer){
                this.yellowPlayer.setActive(false).setVisible(false);
                this.yellowPlayer.body.destroy();
                this.yellowPlayer.destroy();
                this.yellowPlayer=null;
                this.players[2]=null;
            }
            else if(playerToRemove=="Blue" && this.bluePlayer){
                this.bluePlayer.setActive(false).setVisible(false);
                this.bluePlayer.body.destroy();
                this.bluePlayer.destroy();
                this.bluePlayer=null;
                this.players[3]=null;
            }
            if(this.player!=null && this.player!=undefined){
                var playerStillAlive=1;
                for(let i=0;i<4;i++){
                    if(this.playerColor!="Red" && this.redPlayer!=null) playerStillAlive++;
                    if(this.playerColor!="Green" && this.greenPlayer!=null) playerStillAlive++;
                    if(this.playerColor!="Yellow" && this.yellowPlayer!=null) playerStillAlive++;
                    if(this.playerColor!="Blue" && this.bluePlayer!=null) playerStillAlive++;
                }
                if(playerStillAlive==1){
                    this.player.victoryScreen();
                    delay(3000).then(()=>{
                        this.game.scene.start("MainMenu");
                        this.game.scene.stop("MainSceneMult");
                    });
                }
            }
        });
        this.socket.on("updateTurrets",(turretBaseUsed)=>{
            var tbUsed=this.TurretBases[turretBaseUsed];
            tbUsed.turret=new Phaser.Physics.Matter.Sprite(this.matter.world,tbUsed.x, tbUsed.y, "turret_idle","machinegun_still",{label:"Turret",isStatic:true});
            this.add.existing(tbUsed.turret);            
            if(tbUsed.baseColor=="Red" && this.redPlayer) tbUsed.turret.angle=-90;
            else if(tbUsed.baseColor=="Green" && this.greenPlayer) tbUsed.turret.angle=0;
            else if(tbUsed.baseColor=="Yellow" && this.yellowPlayer) tbUsed.turret.angle=90;
            else if(tbUsed.baseColor=="Blue" && this.bluePlayer) tbUsed.turret.angle=-180;
        });
        this.socket.on("updateTurretAngle",(turretBaseUsed,newAngle)=>{
            var tbUsed=this.TurretBases[turretBaseUsed];
            if(tbUsed.turret!=null)tbUsed.turret.angle=newAngle;
        }); 
        this.socket.on("updateTurretShooting",(turretBaseUsed,target)=>{
            var tbUsed=this.TurretBases[turretBaseUsed];
            if(tbUsed.turret!=null){
                tbUsed.turret.anims.play("turret_fire",true);
                this.turretShooting[turretBaseUsed]=true;            
                var shootingTarget;
                this.turretTarget[turretBaseUsed]=target;   
                tbUsed.turret.on("animationcomplete",()=>{
                    if(this.turretShooting[turretBaseUsed] && this.turretTarget[turretBaseUsed]!=null){                 
                        if(this.playerColor!="Red" && this.turretTarget[turretBaseUsed]=="RedPlayer" && this.redPlayer) shootingTarget=this.redPlayer;
                        else if(this.playerColor!="Green" && this.turretTarget[turretBaseUsed]=="GreenPlayer" && this.greenPlayer) shootingTarget=this.greenPlayer;
                        else if(this.playerColor!="Yellow" && this.turretTarget[turretBaseUsed]=="YellowPlayer" && this.yellowPlayer) shootingTarget=this.yellowPlayer;
                        else if(this.playerColor!="Blue" && this.turretTarget[turretBaseUsed]=="BluePlayer" && this.bluePlayer) shootingTarget=this.bluePlayer;
                        else if(this.turretTarget[turretBaseUsed]==this.playerColor+"Player" && this.player!=null && this.player!=undefined) shootingTarget=this.player;                              
                        console.log(this.turretTarget[turretBaseUsed]+" "+shootingTarget.body.label);
                        var bulletShot=new Bullet({scene:this,x:tbUsed.getCenter().x,y:tbUsed.getCenter().y,texture:"bullet",frame:"bullet"},0);
                        if(shootingTarget!=undefined) bulletShot.create(tbUsed,shootingTarget);  
                    }
                    this.turretShooting[turretBaseUsed]=false;
                });
            }
        });
        this.socket.on("updateTurretStoppedShooting",(turretBaseUsed,angleOfTurret)=>{
            var tbUsed=this.TurretBases[turretBaseUsed];
            if(tbUsed.turret!=null){
                tbUsed.turret.anims.play("turret_idle",true);
                this.turretShooting[turretBaseUsed]=false;
                this.turretTarget[turretBaseUsed]=null;
                tbUsed.turret.angle=angleOfTurret;
            }
        });
        this.socket.on("eliminateTurrets",(id)=>{
            var color=this.assignColors[this.playersId.indexOf(id)];
            console.log(color);
            for(let i=0;i<8;i++){
                if(this.TurretBases[i].baseColor==color && this.TurretBases[i].turret!=undefined && this.TurretBases[i].turret!=null){
                    this.TurretBases[i].turret.setActive(false).setVisible(false);
                    this.TurretBases[i].turret.destroy();
                    this.TurretBases[i].turret=null;
                }
            }
        });     
        this.spawnOtherPlayers(this.playersId);
    }
    update(){
        if(this.player!=null && this.player!=undefined)this.player.update(this);
        for(let i=0;i<this.players.length;i++){
            if(this.players[i]!=null) this.players[i].update(this);
        }
        for(let i=0;i<this.TurretBases.length;i++){
            if(this.TurretBases[i]!=null) this.TurretBases[i].update();
        }
        if(this.inputKeys.pause.isDown){
            this.game.scene.start("PauseMenuMult",{socket:this.socket});
        }
    }

    
    createMap(){        
        this.map=this.make.tilemap({key:"mapMult"});
        const tileset= this.map.addTilesetImage("DesertTilemap16x16","tiles",16,16,1,2);
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

        this.Ores.push(new IronOre({scene:this,x:1120,y:1160,texture:"iron_ore",frame:"ironore"}));//left
        this.Ores.push(new IronOre({scene:this,x:1120,y:1230,texture:"iron_ore",frame:"ironore"}));
        this.Ores.push(new IronOre({scene:this,x:1180,y:1110,texture:"iron_ore",frame:"ironore"}));//top
        this.Ores.push(new IronOre({scene:this,x:1250,y:1110,texture:"iron_ore",frame:"ironore"}));
        this.Ores.push(new IronOre({scene:this,x:1180,y:1280,texture:"iron_ore",frame:"ironore"}));//bottom
        this.Ores.push(new IronOre({scene:this,x:1250,y:1280,texture:"iron_ore",frame:"ironore"}));
        this.Ores.push(new IronOre({scene:this,x:1300,y:1160,texture:"iron_ore",frame:"ironore"}));//right
        this.Ores.push(new IronOre({scene:this,x:1300,y:1230,texture:"iron_ore",frame:"ironore"}));

        this.TurretBases.push(new TurretBase({scene:this,x:1055,y:2075,texture:"turret_base",frame:"turretbase"},"Red",0,this.socket));//bottom
        this.TurretBases.push(new TurretBase({scene:this,x:1345,y:2075,texture:"turret_base",frame:"turretbase"},"Red",1,this.socket));
        this.TurretBases.push(new TurretBase({scene:this,x:330,y:1060,texture:"turret_base",frame:"turretbase"},"Green",2,this.socket));//left
        this.TurretBases.push(new TurretBase({scene:this,x:330,y:1340,texture:"turret_base",frame:"turretbase"},"Green",3,this.socket));
        this.TurretBases[2].angle=90;
        this.TurretBases[3].angle=90;
        this.TurretBases.push(new TurretBase({scene:this,x:1055,y:330,texture:"turret_base",frame:"turretbase"},"Yellow",4,this.socket));//top
        this.TurretBases.push(new TurretBase({scene:this,x:1345,y:330,texture:"turret_base",frame:"turretbase"},"Yellow",5,this.socket));
        this.TurretBases[4].angle=180;
        this.TurretBases[5].angle=180;
        this.TurretBases.push(new TurretBase({scene:this,x:2070,y:1060,texture:"turret_base",frame:"turretbase"},"Blue",6,this.socket));//right
        this.TurretBases.push(new TurretBase({scene:this,x:2070,y:1340,texture:"turret_base",frame:"turretbase"},"Blue",7,this.socket));
        this.TurretBases[6].angle=-90;
        this.TurretBases[7].angle=-90;
        
    }
    spawnOtherPlayers(others){
        for(let i=0;i<others.length;i++){
            if(others[i]==this.socket.id) continue;
            if(this.assignColors[i]=="Red"){
                this.redPlayer=new Phaser.Physics.Matter.Sprite(this.matter.world,1200, 2250, 'handgun_idle',"survivor-idle_handgun_0",{label:"RedPlayer"}).setScale(0.3);
                this.redPlayer.anims.play("handgun_idle",true);
                this.add.existing(this.redPlayer);
                this.redPlayerActiveWeapon="handgun";
                this.redPlayer.setStatic(true);
                this.redPlayerShooting=false;
                this.redPlayerReloading=false;
                this.redPlayerMining=false;
            }
            else if(this.assignColors[i]=="Green"){
                this.greenPlayer=new Phaser.Physics.Matter.Sprite(this.matter.world,120, 1200, 'handgun_idle',"survivor-idle_handgun_0",{label:"GreenPlayer"}).setScale(0.3);
                this.greenPlayer.anims.play("handgun_idle",true);
                this.add.existing(this.greenPlayer);
                this.greenPlayer.setStatic(true);
                this.greenPlayerActiveWeapon="handgun";
                this.greenPlayerShooting=false;
                this.greenPlayerReloading=false;
                this.greenPlayerMining=false;
            }
            else if(this.assignColors[i]=="Yellow"){
                this.yellowPlayer=new Phaser.Physics.Matter.Sprite(this.matter.world,1200, 120, 'handgun_idle',"survivor-idle_handgun_0",{label:"YellowPlayer"}).setScale(0.3);
                this.yellowPlayer.anims.play("handgun_idle",true);
                this.add.existing(this.yellowPlayer);
                this.yellowPlayer.setStatic(true);
                this.yellowPlayerActiveWeapon="handgun";
                this.yellowPlayerShooting=false;
                this.yellowPlayerReloading=false;
                this.yellowPlayerMining=false;
            }
            else if(this.assignColors[i]=="Blue"){
                this.bluePlayer=new Phaser.Physics.Matter.Sprite(this.matter.world,2250, 1200, 'handgun_idle',"survivor-idle_handgun_0",{label:"BluePlayer"}).setScale(0.3);
                this.add.existing(this.bluePlayer);
                this.bluePlayer.anims.play("handgun_idle",true);
                this.bluePlayer.setStatic(true);
                this.bluePlayerActiveWeapon="handgun";
                this.bluePlayerShooting=false;
                this.bluePlayerReloading=false;
                this.bluePlayerMining=false;
            }
        }
    }
    getOres(){
        return this.Ores;
    }
    getTurretBases(){
        return this.TurretBases;
    }
    getColorFromSocketId(id){
        var playerOfInterest=this.playersId.indexOf(id);
        return this.assignColors[playerOfInterest];
    }
    removeTurrets(){
        for(let i=0;i<8;i++){
            if(this.TurretBases[i].baseColor==this.playerColor && this.TurretBases[i].turret!=undefined && this.TurretBases[i].turret!=null){
                this.TurretBases[i].turret.setActive(false).setVisible(false);
                this.TurretBases[i].turret.destroy();
                this.TurretBases[i].turret=null;
            }
        }
    }
    getIdFromColor(color){
        if(color.includes("Red")) return this.playersId[this.assignColors.indexOf("Red")];
        else if(color.includes("Green")) return this.playersId[this.assignColors.indexOf("Green")];
        else if(color.includes("Yellow")) return this.playersId[this.assignColors.indexOf("Yellow")];
        else if(color.includes("Blue")) return this.playersId[this.assignColors.indexOf("Blue")];
    }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
