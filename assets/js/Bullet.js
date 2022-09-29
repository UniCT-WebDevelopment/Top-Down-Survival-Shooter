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
        this.fire(shooter,target);
        if(shooter==this.scene.player) this.moveTo(target.worldX,target.worldY);
        else this.moveTo(target.x,target.y);
        this.on("collide",function(bullet,other){
            if(shooter.body.label=="Player" && other.label!="Player"){                      
                if(other.gameObject!=null && other.label=="Enemy"){
                    other.gameObject.getHit(self.damage);      
                    if(shooter.activeWeapon=="shotgun" && other.gameObject!=null){
                        other.gameObject.speed=-40;
                        delay(100).then(()=>{
                            if(other.gameObject!=null)other.gameObject.speed=25;
                        });
                    }
                }
                if(shooter.activeWeapon=="shotgun") var d=80;
                else var d=20;
                delay(d).then(()=>{
                    self.setActive(false).setVisible(false);
                    self.destroy();
                });
            }else if(shooter.body.label=="Turret" && other.label!="Turret" && other.label!="TurretBase" && other.label!="Player"){
                if(other.gameObject!=null && other.label=="Enemy"){
                    other.gameObject.getHit(self.damage);
                }
                self.setActive(false).setVisible(false);
                self.destroy();
            }
            
        });
    }
    moveTo(x, y, speed, maxTime){
        if (speed === undefined) { speed = 30; }
        if (maxTime === undefined) { maxTime = 0; }
    
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