import Bullet from "./Bullet.js";
import MainScene from "./MainScene.js";
import HUD from "./HUD.js";

export default class Player extends Phaser.Physics.Matter.Sprite{

    constructor(data){
        let {scene,x,y,texture,frame}=data;
        super(scene.matter.world,x,y,texture,frame,{label:"Player",circleRadius:80});
        this.scene.add.existing(this);
        this.activeWeapon="handgun";
        this.shootRatio=2.5;
        this.canShoot=this.shootRatio;
        this.shootButton=false;
        this.damage=2;
        this.maxHealth=20;
        this.ammo=12;
        this.max_ammo=12;
        this.actualHealth=this.maxHealth;
        this.handgun_ammo=12;
        this.rifle_ammo=30;
        this.shotgun_ammo=5;        
        this.ironOres=0;
        this.oreObj=null;
        this.canMine=true;
        this.mined=false;
        this.mining=false;
        this.shooting=false;
        this.reloading=false;
        this.bullet=false;
        this.degree=0;
    }
    static preload(scene){        
        scene.load.atlas("handgun_idle","assets/Player/Handgun/handgun_idle.png","assets/Player/Handgun/handgun_idle_atlas.json");
        scene.load.animation("handgun_idle","assets/Player/Handgun/handgun_idle_anim.json");
        scene.load.atlas("handgun_move","assets/Player/Handgun/handgun_move.png","assets/Player/Handgun/handgun_move_atlas.json");
        scene.load.animation("handgun_move","assets/Player/Handgun/handgun_move_anim.json");
        scene.load.atlas("handgun_shoot","assets/Player/Handgun/handgun_shoot.png","assets/Player/Handgun/handgun_shoot_atlas.json");
        scene.load.animation("handgun_shoot","assets/Player/Handgun/handgun_shoot_anim.json");
        scene.load.atlas("handgun_reload","assets/Player/Handgun/handgun_reload.png","assets/Player/Handgun/handgun_reload_atlas.json");
        scene.load.animation("handgun_reload","assets/Player/Handgun/handgun_reload_anim.json");
        
        scene.load.atlas("rifle_idle","assets/Player/Rifle/rifle_idle.png","assets/Player/Rifle/rifle_idle_atlas.json");
        scene.load.animation("rifle_idle","assets/Player/Rifle/rifle_idle_anim.json");
        scene.load.atlas("rifle_move","assets/Player/Rifle/rifle_move.png","assets/Player/Rifle/rifle_move_atlas.json");
        scene.load.animation("rifle_move","assets/Player/Rifle/rifle_move_anim.json");
        scene.load.atlas("rifle_shoot","assets/Player/Rifle/rifle_shoot.png","assets/Player/Rifle/rifle_shoot_atlas.json");
        scene.load.animation("rifle_shoot","assets/Player/Rifle/rifle_shoot_anim.json");
        scene.load.atlas("rifle_reload","assets/Player/Rifle/rifle_reload.png","assets/Player/Rifle/rifle_reload_atlas.json");
        scene.load.animation("rifle_reload","assets/Player/Rifle/rifle_reload_anim.json");
        
        scene.load.atlas("shotgun_idle","assets/Player/Shotgun/shotgun_idle.png","assets/Player/Shotgun/shotgun_idle_atlas.json");
        scene.load.animation("shotgun_idle","assets/Player/Shotgun/shotgun_idle_anim.json");
        scene.load.atlas("shotgun_move","assets/Player/Shotgun/shotgun_move.png","assets/Player/Shotgun/shotgun_move_atlas.json");
        scene.load.animation("shotgun_move","assets/Player/Shotgun/shotgun_move_anim.json");
        scene.load.atlas("shotgun_shoot","assets/Player/Shotgun/shotgun_shoot.png","assets/Player/Shotgun/shotgun_shoot_atlas.json");
        scene.load.animation("shotgun_shoot","assets/Player/Shotgun/shotgun_shoot_anim.json");
        scene.load.atlas("shotgun_reload","assets/Player/Shotgun/shotgun_reload.png","assets/Player/Shotgun/shotgun_reload_atlas.json");
        scene.load.animation("shotgun_reload","assets/Player/Shotgun/shotgun_reload_anim.json");

        scene.load.atlas("bullet","assets/Player/bullet.png","assets/Player/bullet_atlas.json");
        scene.load.atlas("shotgun_bullet","assets/Player/shotgun_bullet.png","assets/Player/shotgun_bullet_atlas.json");
        scene.load.atlas("player_mining","assets/Player/player_mining.png","assets/Player/player_mining_atlas.json");
        scene.load.animation("player_mining","assets/Player/player_mining_anim.json");     
    }
    get velocity(){
        return this.body.velocity;
    }
    create(scene){
        this.setActive(true).setVisible(true);
        this.inputKeys=scene.input.keyboard.addKeys({
            up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D,
            reload:Phaser.Input.Keyboard.KeyCodes.R,
            interact:Phaser.Input.Keyboard.KeyCodes.E,
            handgun:Phaser.Input.Keyboard.KeyCodes.ONE,
            rifle:Phaser.Input.Keyboard.KeyCodes.TWO,
            shotgun:Phaser.Input.Keyboard.KeyCodes.THREE
        });        
        this.playerHUD=new HUD();
        this.playerHUD.create(scene,scene.cameras.main);
        var self=this;        
        scene.input.on("pointermove",function(pointer){
            if(!self.mining) self.angle=Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(self.x, self.y, pointer.worldX, pointer.worldY));   
            self.degree=self.angle;         
        });
        scene.input.on("pointerdown",(pointer)=>{
            if(pointer.leftButtonDown()){
                this.shootButton=true;          
            } 
        }); 
        scene.input.on("pointerup",()=>{
            this.shootButton=false;
        });
        this.on("collide",(player,other)=>{
            if(other.label=="Heal"){
                this.actualHealth+=5;
                if(this.actualHealth>this.maxHealth){
                    this.actualHealth=this.maxHealth;
                }
                other.gameObject.setActive(false).setVisible(false);
                other.gameObject.destroy();
                this.playerHUD.UpdateHealth(this.actualHealth,this.maxHealth);
            }
        });               
        this.setFixedRotation();
        this.setScale(0.3);
    }
    update(scene){        
        this.playerHUD.update(scene,scene.cameras.main);
        if(!this.mining)var speed=3.5;
        if(this.angle!=this.degree){
            this.angle=this.degree;
        }
        if(this.canShoot<this.shootRatio) this.canShoot+=0.1; 
        let playerVelocity=new Phaser.Math.Vector2();
        if(this.inputKeys.left.isDown){
            playerVelocity.x=-1;
        }else if(this.inputKeys.right.isDown){
            playerVelocity.x=1;
        }
        if(this.inputKeys.up.isDown){
            playerVelocity.y=-1;
        }else if(this.inputKeys.down.isDown){
            playerVelocity.y=1;
        }

        if(this.inputKeys.handgun.isDown && this.activeWeapon!="handgun"){
            this.activeWeapon="handgun";
            this.shootRatio=2.5;
            this.canShoot=0;
            this.ammo=this.handgun_ammo;
            this.max_ammo=12;
            this.damage=2;
            this.playerHUD.bulletShot(this.ammo,this.max_ammo);
            this.playerHUD.weaponDisplay(this.activeWeapon);
        }
        if(this.inputKeys.rifle.isDown && this.activeWeapon!="rifle"){
            this.activeWeapon="rifle";
            this.shootRatio=0.2;
            this.canShoot=0;
            this.ammo=this.rifle_ammo;
            this.max_ammo=30;
            this.damage=1.5;
            this.playerHUD.bulletShot(this.ammo,this.max_ammo);
            this.playerHUD.weaponDisplay(this.activeWeapon);
        }
        if(this.inputKeys.shotgun.isDown && this.activeWeapon!="shotgun"){
            this.activeWeapon="shotgun";
            this.shootRatio=4;
            this.canShoot=2;
            this.ammo=this.shotgun_ammo;
            this.max_ammo=5;
            this.damage=3.5;
            this.playerHUD.bulletShot(this.ammo,this.max_ammo)
            this.playerHUD.weaponDisplay(this.activeWeapon);
        }
        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x,playerVelocity.y);
        if((Math.abs(this.velocity.x)>0.1 || Math.abs(this.velocity.y)>0.1) && !this.shooting && !this.reloading && !this.mining){
            this.anims.play(this.activeWeapon+"_move",true);
        }else if(!this.shooting && !this.reloading && !this.mining){
            this.anims.play(this.activeWeapon+"_idle",true);
        }
        if(this.inputKeys.reload.isDown){
            this.reloading=true;
            this.anims.play(this.activeWeapon+"_reload");            
            if(this.activeWeapon=="handgun") this.ammo=this.handgun_ammo=this.max_ammo;
            else if(this.activeWeapon=="rifle") this.ammo=this.rifle_ammo=this.max_ammo;
            else if(this.activeWeapon=="shotgun") this.ammo=this.shotgun_ammo=this.max_ammo;
            this.on("animationcomplete",()=>{
                this.reloading=false;
                this.playerHUD.bulletShot(this.ammo,this.max_ammo)
            });
        }
        if(this.shootButton){
            if(!this.reloading && !this.mining && this.ammo>0) this.shoot();
        }  
        if(this.canMine && this.inputKeys.interact.isDown){
            var raycaster=this.scene.raycasterPlugin.createRaycaster();
            var ray=raycaster.createRay({
                origin:{
                    x:this.x,
                    y:this.y
                },
                detectionRange:20
            });
            raycaster.mapGameObjects(scene.getOres());//dipende dalla scena che li crea
            raycaster.mapGameObjects(scene.getTurretBases());   
            ray.setAngleDeg(this.angle);
            let intersecion=ray.cast();
            let hitObject=intersecion.object;
            var isOre=false;
            var isTurretBase=false;
            for(let i=0;i<scene.getOres().length;i++){
                if(hitObject==scene.getOres()[i]){
                    isOre=true;
                    break;
                }
            }
            if(!isOre){
                for(let i=0;i<scene.getTurretBases().length;i++){
                    if(hitObject==scene.getTurretBases()[i]){
                        isTurretBase=true;
                        break;
                    }
                }
            }
            if(isOre && this.inRange(hitObject,100) && !this.mining){
                this.anims.play("player_mining",true);
                speed=0;
                this.angle=0;
                this.mining=true;
                this.oreObj=hitObject;
                hitObject.progressBar(this.scene);
                var i=1;
                this.on("animationrepeat",()=>{
                    if(this.canMine){
                        hitObject.increaseProgressBar(i);
                        i++;
                    }
                });
                this.on("animationcomplete",()=>{
                    if(this.mining){
                        hitObject.increaseProgressBar(i);
                        i=0;           
                        this.anims.play(this.activeWeapon+"_idle",true);
                        this.canMine=false;
                        this.mined=true;
                    }                      
                });
            }
            if(isTurretBase && this.inRange(hitObject,100)){
                hitObject.createTurret();
            }
        }
        if(this.mined){
            this.mined=false;
            this.ironOres++;
            this.playerHUD.oreCollected(scene);
            if(this.oreObj!=null){
                this.oreObj.removeProgBar(50);
                this.oreObj=null;
            }
        }
        if(this.mining && this.inputKeys.interact.isUp){
            this.mining=false;
            this.canMine=true;
            if(this.oreObj!=null){
                this.oreObj.removeProgBar(0);
                this.oreObj=null;
            }
        }
        if(this.defeatText!=null){           
            if(this.defeatText.x!=this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2 || this.defeatText.y!=this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2){
                this.defeatText.x=this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
                this.defeatText.y=this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2;
            }
        }     
    }
    isAlive(){
        return this.actualHealth>0;
    }
    shoot(){
        if(this.canShoot>=this.shootRatio){
            this.anims.play(this.activeWeapon+"_shoot",true);
            this.canShoot=0;
            this.shooting=true;
            this.bullet=true;
            this.on("animationstart",()=>{ 
                if(this.bullet && this.shooting){
                    this.bullet=false;
                    if(this.activeWeapon=="handgun") this.ammo=--this.handgun_ammo;
                    else if(this.activeWeapon=="rifle") this.ammo=--this.rifle_ammo;
                    else if(this.activeWeapon=="shotgun") this.ammo=--this.shotgun_ammo;                      
                    if(this.activeWeapon!="shotgun")var bulletShot=new Bullet({scene:this.scene,x:this.getBottomRight().x,y:this.getBottomRight().y,texture:"bullet",frame:"bullet"},this.damage);
                    else {
                        var bulletShot=new Bullet({scene:this.scene,x:this.getCenter().x,y:this.getCenter().y,texture:"shotgun_bullet",frame:""},this.damage);
                        delay(80).then(()=>bulletShot.destroy());
                    }
                    bulletShot.create(this,this.scene.input.mousePointer);                                  
                    this.playerHUD.bulletShot(this.ammo,this.max_ammo);
                } 
            });
            this.on("animationcomplete",()=>{
                if(this.shooting){
                    this.anims.play(this.activeWeapon+"_idle",true);
                    this.shooting=false;
                    this.bullet=false;
                }
            });           
        } 
    }
    getHit(damage){
        this.actualHealth-=damage;
        this.playerHUD.UpdateHealth(this.actualHealth,this.maxHealth);
        if(this.actualHealth<=0){
            this.defeatScreen();
            this.setActive(false).setVisible(false);
            this.body.destroy();
        }
    }
    getIronOres(){
        return this.ironOres;
    }
    buildTurret(ironUsed,scene){
        this.ironOres-=ironUsed;
        this.playerHUD.oreCollected(scene);
    }
    getCurrentAmmo(){
        return this.ammo;
    }
    getMaxAmmo(){
        return this.max_ammo;
    }
    getCurrentHealth(){
        if(this.actualHealth<0) this.actualHealth=0;
        return this.actualHealth;
    }
    getMaxHealth(){
        return this.maxHealth;
    }
    defeatScreen(){   
        this.defeatText=this.scene.add.text(this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2,this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2,"YOU LOSE",{font:"100px Arial",fill:"red",stroke:"black",strokeThickness:2}).setOrigin(0.5);
    }
    inRange(obj,range){
        return Phaser.Math.Distance.BetweenPoints(obj, this)<range;
    }
}
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


