import Turret from "./Turret.js";

export default class TurretBase extends Phaser.Physics.Matter.Sprite{
    constructor(data){
        let {scene,x,y,texture}=data;
        super(scene.matter.world,x,y,texture,"",{label:"TurretBase",isStatic:true});
        this.scene.add.existing(this);
        this.setScale(2.5);
        this.occupied=false;
        this.IronNeededToBuild=5;
    }

    static preload(scene){
        scene.load.image("turret_base","/assets/Tiles/TurretBase.png","/assets/Tiles/turretbase_atlas.json");
    }

    createTurret(){
        if(!this.occupied && this.scene.player.getIronOres()>= this.IronNeededToBuild){
            this.occupied=true;
            this.turret=new Turret({scene:this.scene,x:this.x,y:this.y,texture:"turret_idle",frame:"machinegun_still"},this);
            this.scene.player.buildTurret( this.IronNeededToBuild,this.scene);
        }else if(!this.occupied && this.scene.player.getIronOres()< this.IronNeededToBuild){
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
        }
    }
    update(){
        if(this.occupied){
            this.turret.update();
        }
    }
}
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}