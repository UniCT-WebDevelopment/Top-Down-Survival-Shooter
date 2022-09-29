import Turret from "./Turret_Multiplayer.js";

export default class TurretBase extends Phaser.Physics.Matter.Sprite{
    constructor(data,playerColor,index,socket){
        let {scene,x,y,texture}=data;
        super(scene.matter.world,x,y,texture,"",{label:"TurretBase",isStatic:true});
        this.scene.add.existing(this);
        this.setScale(2.5);
        this.occupied=false;
        this.baseColor=playerColor;
        this.IronNeededToBuild=5;
        this.index=index;
        this.socket=socket;
    }

    static preload(scene){
        scene.load.image("turret_base","/assets/Tiles/TurretBase.png","/assets/Tiles/turretbase_atlas.json");
    }

    createTurret(){
        if(!this.occupied && this.scene.playerColor==this.baseColor && this.scene.player.getIronOres()>= this.IronNeededToBuild){
            this.occupied=true;
            this.turret=new Turret({scene:this.scene,x:this.x,y:this.y,texture:"turret_idle",frame:"machinegun_still"},this,this.baseColor,this.socket);
            this.turret.create();
            this.scene.player.buildTurret(this.IronNeededToBuild,this.scene,this.index);
        }else if(!this.occupied && this.scene.playerColor==this.baseColor && this.scene.player.getIronOres()< this.IronNeededToBuild){
            var turret_text=this.scene.add.text(this.getLeftCenter().x-this.displayWidth/1.5,this.getCenter().y,"You need "+ this.IronNeededToBuild+" Iron to build a Turret",{font:"15px Arial",fill:"black",stroke:"white",strokeThickness:2});
            if(this.angle==-180) {
                turret_text.x=this.getRightCenter().x-this.displayWidth/1.5;
            }else if(this.angle==90){
                turret_text.x=this.getBottomCenter().x-this.displayWidth/1.5;
            }else if(this.angle==-90){
                turret_text.x=this.getTopCenter().x-this.displayWidth/1.5;
            }
            delay(1500).then(() =>{
                turret_text.destroy();
            });
        }else if(!this.occupied && this.scene.playerColor!=this.baseColor){
            var wrong_base=this.scene.add.text(this.getLeftCenter().x-this.displayWidth/1.5,this.getCenter().y,"You can't build a turret here",{fill:"black",stroke:"white",strokeThickness:2});
            if(this.angle==-180) {
                wrong_base.x=this.getRightCenter().x-this.displayWidth/1.5;
            }else if(this.angle==90){
                wrong_base.x=this.getBottomCenter().x-this.displayWidth/1.5;
            }else if(this.angle==-90){
                wrong_base.x=this.getTopCenter().x-this.displayWidth/1.5;
            }
            delay(1500).then(() =>{
                wrong_base.destroy();
            }); 
        }
    }
    update(){
        if(this.occupied && this.turret!=null && this.turret!=undefined){
            this.turret.update();
        }
    }
    moveTo(x, y, speed){
        if (speed === undefined) { speed = 30; }
    
        var angle = Math.atan2(y - this.y, x - this.x);
        let objVel=new Phaser.Math.Vector2(); 
        objVel.setToPolar(angle, speed);
        this.setVelocity(objVel.x,objVel.y);
        return angle;
    }
    fire(shooter, target)
    {
        var direction = Math.atan( (target.x-this.x) / (target.y-this.y));
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(direction);
            this.ySpeed = this.speed*Math.cos(direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(direction);
            this.ySpeed = -this.speed*Math.cos(direction);
        }
    
        this.rotation = shooter.rotation;
    }
}
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}