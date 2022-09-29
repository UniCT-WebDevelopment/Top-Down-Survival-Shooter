export default class Bullet extends Phaser.Physics.Matter.Sprite{
    constructor(data,damage){
        let {scene,x,y,texture,frame}=data;
        super(scene.matter.world,x,y,texture,frame,{label:"bullet"});
        this.scene.add.existing(this);
        this.damage=damage;
    }
    create(shooter,target){
        var self=this;
        this.setSensor(true);
        this.setScale(0.1);
        if(shooter.turret!=null && shooter.turret!=undefined) this.fire(shooter.turret,target);
        else this.fire(shooter,target);
        if(shooter==this.scene.player) this.moveTo(target.worldX,target.worldY);
        else this.moveTo(target.x,target.y);
        this.on("collide",function(bullet,other){
            if(shooter && shooter!=undefined && shooter.body!=undefined && shooter.body.label.includes("Player") && shooter.body.label!=other.label){   
                console.log("c");                   
                if(other.label.includes("Player")){
                    this.scene.socket.emit("PlayerHit",this.scene.getIdFromColor(other.label),this.damage);
                }
                if(shooter.activeWeapon=="shotgun") var d=80;
                else var d=1;
                delay(d).then(()=>{
                    self.setActive(false).setVisible(false);
                    self.destroy();
                });
            }else if(shooter.turret!=null && other.label!="Turret" && other.gameObject!=null && other.gameObject.index!=shooter.index){              
                if(other.label.includes("Player") && !other.label.includes(shooter.turret.turretColor)){
                    this.scene.socket.emit("PlayerHit",this.scene.getIdFromColor(other.label),this.damage);
                }
                self.setActive(false).setVisible(false);
                self.destroy();
            }
            
        });
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