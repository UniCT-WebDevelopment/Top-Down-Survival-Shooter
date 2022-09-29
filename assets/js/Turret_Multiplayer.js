import Bullet from "./Bullet_Multiplayer.js";
export default class Turret extends Phaser.Physics.Matter.Sprite{
    constructor(data,tb,playerColor,socket){
        let {scene,x,y,texture,frame}=data;
        super(scene.matter.world,x,y,texture,frame,{label:"Turret",isStatic:true});
        this.scene.add.existing(this);
        this.setScale(1);
        this.turretColor=playerColor;
        console.log(this.turretColor)
        if(this.turretColor=="Red") this.angle=-90;
        else if(this.turretColor=="Green") this.angle=0;
        else if(this.turretColor=="Yellow") this.angle=90;
        else if(this.turretColor=="Blue") this.angle=-180;
        this.tb=tb;
        this.target=null;
        this.possibleTargets=[this.scene.redPlayer,this.scene.greenPlayer,this.scene.yellowPlayer,this.scene.bluePlayer];
        this.shooting=false;
        this.socket=socket;
    }

    static preload(scene){
        scene.load.atlas("turret_idle","/assets/Turret/turret_idle.png","/assets/Turret/turret_idle_atlas.json");
        scene.load.animation("turret_idle","/assets/Turret/turret_idle_anim.json");
        scene.load.atlas("turret_fire","/assets/Turret/turret_fire.png","/assets/Turret/turret_fire_atlas.json");
        scene.load.animation("turret_fire","/assets/Turret/turret_fire_anim.json");
    }
    create(){
        this.socket.on("updateTargets",(playerToRemove)=>{
            var color=this.scene.getColorFromSocketId(playerToRemove);
            if(color=="Red") {
                if(this.target==this.scene.redPlayer){
                    this.scene.turretTarget[this.tb.index]=null;
                    this.target=null;
                    this.anims.play("turret_idle",true);
                    this.socket.emit("TurretStoppedShooting",this.tb.index,this.angle); 
                }
                this.possibleTargets[0]=null;
            }
            else if(color=="Green"){
                if(this.target==this.scene.greenPlayer){
                    this.scene.turretTarget[this.tb.index]=null;
                    this.target=null;
                    this.anims.play("turret_idle",true);
                    this.socket.emit("TurretStoppedShooting",this.tb.index,this.angle); 
                }
                this.possibleTargets[1]=null;
            }
                
            else if(color=="Yellow"){
                if(this.target==this.scene.yellowPlayer){
                    this.scene.turretTarget[this.tb.index]=null;
                    this.target=null;
                    this.anims.play("turret_idle",true);
                    this.socket.emit("TurretStoppedShooting",this.tb.index,this.angle); 
                }
                this.possibleTargets[2]=null;
            }                
            else if(color=="Blue"){    
                if(this.target==this.scene.bluePlayer){
                    this.scene.turretTarget[this.tb.index]=null;
                    this.target=null;
                    this.anims.play("turret_idle",true);
                    this.socket.emit("TurretStoppedShooting",this.tb.index,this.angle);                     
                }
                this.possibleTargets[3]=null;
            }
            console.log(this.possibleTargets);
        });
    }
    update(){
        if(this.target==null){           
            this.setTarget();
        }
        else if(this.target!=null && this.target.body!=undefined){
            this.anims.play("turret_fire",true);
            this.angle=Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y));
            this.socket.emit("TurretAngle",this.tb.index,this.angle);
            this.shooting=true;            
            this.on("animationcomplete",()=>{
                if(this.shooting){
                    if(this.target!=null && this.target.body!=undefined){
                        this.socket.emit("TurretShooting",this.tb.index,this.target.body.label);
                        var bulletShot=new Bullet({scene:this.scene,x:this.getCenter().x,y:this.getCenter().y,texture:"bullet",frame:"bullet"},1);
                        bulletShot.create(this.tb,this.target);
                    }
                    this.shooting=false;                    
                }
            });
        }        
        if(this.target!=null && this.target.body!=undefined && !(this.inRange(this.target,attackRange))){
            this.anims.play("turret_idle",true);
            this.target=null;
            this.shooting=false;
            this.socket.emit("TurretStoppedShooting",this.tb.index,this.angle);
        }else if(this.target!=null && this.target.body==undefined){
            this.anims.play("turret_idle",true);
            this.socket.emit("TurretStoppedShooting",this.tb.index,this.angle);
            this.target=null;
        }
    }
    setTarget(){
        for(let i=0;i<this.possibleTargets.length;i++){
            if(this.possibleTargets[i]!=undefined && this.possibleTargets[i]!=null && this.inRange(this.possibleTargets[i],attackRange)){
                this.target=this.possibleTargets[i];
                break;
            }
        }
    }
    inRange(obj,range){
        return Phaser.Math.Distance.BetweenPoints(obj, this)<range;
    }
}
var attackRange=450;