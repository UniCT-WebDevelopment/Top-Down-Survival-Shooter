import Bullet from "./Bullet.js";
export default class Turret extends Phaser.Physics.Matter.Sprite{
    constructor(data,tb){
        let {scene,x,y,texture,frame}=data;
        super(scene.matter.world,x,y,texture,frame,{label:"Turret",isStatic:true});
        this.scene.add.existing(this);
        this.setScale(1);
        this.angle=-90;
        this.tb=tb;
        this.target=null;
        this.shooting=false;
    }

    static preload(scene){
        scene.load.atlas("turret_idle","/assets/Turret/turret_idle.png","/assets/Turret/turret_idle_atlas.json");
        scene.load.animation("turret_idle","/assets/Turret/turret_idle_anim.json");
        scene.load.atlas("turret_fire","/assets/Turret/turret_fire.png","/assets/Turret/turret_fire_atlas.json");
        scene.load.animation("turret_fire","/assets/Turret/turret_fire_anim.json");
    }
    update(){
        if(this.target!=null && !(this.inRange(this.target,attackRange)) || this.target!=null && !this.target.isAlive()){
            this.anims.play("turret_idle",true);
            possibleTargets[possibleTargets.indexOf(this.target)]=null;
            this.target=null;
            this.shooting=false;
        }
        if(this.target==null){            
            this.setTarget();
        }
        else if(this.target!=null){
            this.anims.play("turret_fire",true);
            this.angle=Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y));
            this.shooting=true;
            this.on("animationcomplete",()=>{
                if(this.shooting){
                    if(this.target!=null){
                        var bulletShot=new Bullet({scene:this.scene,x:this.getCenter().x,y:this.getCenter().y,texture:"bullet",frame:"bullet"},1);
                        bulletShot.create(this,this.target);
                    }
                    this.shooting=false;                    
                }
            });
        }
    }
    setTarget(){
        for(let i=0;i<possibleTargets.length;i++){
            if(possibleTargets[i]!=null && this.inRange(possibleTargets[i],attackRange)){
                this.target=possibleTargets[i];
                break;
            }
        }
    }
    inRange(obj,range){
        return Phaser.Math.Distance.BetweenPoints(obj, this)<range;
    }
    static getEnemiesSpawned(enemies){
        possibleTargets=enemies;
    }
}
var possibleTargets=[];
var attackRange=550;