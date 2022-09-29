import EnemySpawner from "./EnemySpawner.js";
import Heal from "./Heal.js";
export default class Enemy extends Phaser.Physics.Matter.Sprite{
    constructor(data,attack,target){
        let {scene,x,y,texture,frame}=data;
        super(scene.matter.world,x,y,texture,frame,{label:"Enemy",circleRadius:70});        
        var Bodies = Phaser.Physics.Matter.Matter.Bodies;
        /*var enemyBody=Bodies.circle(x,y,35,{label:"Enemy"})
        var compoundBody = Phaser.Physics.Matter.Matter.Body.create({
            parts: [enemyBody]
        });
        this.setExistingBody(compoundBody);*/
        this.scene.add.existing(this);
        this.attack=attack;
        this.target=target;
        this.maxHealth=10;
        this.actualHealth=this.maxHealth;
        this.damage=2;
        this.attacked=false;
        this.attacking=false;
        this.alive=true;
        this.speed=25;
        this.drop=false;
        this.enmSpwn=null;
    }

    static preload(scene){
        scene.load.atlas("enemy_idle","assets/Enemy/enemy_idle.png","assets/Enemy/enemy_idle_atlas.json");
        scene.load.animation("enemy_idle","assets/Enemy/enemy_idle_anim.json");
        scene.load.atlas("enemy_move","assets/Enemy/enemy_move.png","assets/Enemy/enemy_move_atlas.json");
        scene.load.animation("enemy_move","assets/Enemy/enemy_move_anim.json");
        scene.load.atlas("enemy_attack","assets/Enemy/enemy_attack.png","assets/Enemy/enemy_attack_atlas.json");
        scene.load.animation("enemy_attack","assets//Enemy/enemy_attack_anim.json");
        scene.load.atlas("heal","assets//Enemy/heal.png","assets//Enemy/heal_atlas.json")
    }
    create(){
        this.setScale(0.3);
        this.setFixedRotation();
        this.setFrictionAir(0.9);
    }
    update(enmSpwn){
        if(this.alive && this.target.isAlive()){
            if(this.enmSpwn==null) this.enmSpwn=enmSpwn;
            if(!this.attacking){
                this.anims.play("enemy_move",true);
            }
            this.moveTo(this.target.x,this.target.y,this.speed);
            this.angle=Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x,this.y,this.target.x, this.target.y));
            if(this.inRange(100)){
                if(!this.attacking){
                    this.attacked=true;
                    this.attacking=true;
                    this.speed=0;
                    this.moveTo(this.target.x,this.target.y,this.speed);
                    this.anims.play("enemy_attack",true);
                }
                this.on("animationcomplete",()=>{
                    this.attacking=false;                    
                    this.speed=25;
                    this.moveTo(this.target.x,this.target.y,this.speed);
                    if(this.attacked && this.inRange(150)){
                        this.target.getHit(2);
                        this.attacked=false;
                    }
                });
            }            
            if((Math.abs(this.body.velocity.x)>0.1 || Math.abs(this.body.velocity.y)>0.1) && !this.attacking){
                this.anims.play("enemy_move",true);
            }else if(!this.attacking && !this.attacked){
                this.anims.play("enemy_idle",true);
            }
        }else if(this.alive){
            this.anims.play("enemy_idle",true);
        }
    }
    willDrop(drop){
        this.drop=drop;
    }
    getHit(damage){
        this.actualHealth-=damage;
        if(this.actualHealth<=0){
            this.alive=false;
            this.enmSpwn.enemiesKilled++;
            if(this.drop) new Heal({scene:this.scene,x:this.x,y:this.y,texture:"heal"},5);
            this.setActive(false).setVisible(false);            
            this.body.destroy();
        }
    }
    inRange(range){
        return Phaser.Math.Distance.BetweenPoints(this.target, this)<range;
    }
    moveTo(x, y, speed){
        var angle = Math.atan2(y - this.y, x - this.x);
        let objVel=new Phaser.Math.Vector2(); 
        objVel.setToPolar(angle, speed);
        this.setVelocity(objVel.x,objVel.y);
        return angle;
    }
    isAlive(){
        return this.alive;
    }
}
