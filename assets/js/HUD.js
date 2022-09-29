export default class HUD{
    constructor(){
        this.lastWeapon="handgun";
    }
    static preload(scene){        
        scene.load.image("handgun","/assets/Player/handgun.png");
        scene.load.image("rifle","/assets/Player/rifle.png");
        scene.load.image("shotgun","/assets/Player/shotgun.png");
    }
    create(scene,camera){
        this.HUDElements(scene,camera);
    }
    update(scene,camera){
        if(camera.height-80!=this.bulletText.y){
            this.bulletText.y=camera.height-80;
        }
        if(camera.height-40!=this.healthText.y){
            this.healthText.y=camera.height-40;
        }
        if(camera.height-120!=this.oreText.y){
            this.oreText.y=camera.height-120;
        }
        if(this.handgunDisplay.x!=camera.displayWidth-220 || this.handgunDisplay.y!=camera.displayHeight-80 ){
            this.handgunDisplay.x=camera.displayWidth-220;
            this.handgunImage.x=this.handgunDisplay.x;
            this.handgunDisplay.y=camera.displayHeight-60;
            this.handgunImage.y=this.handgunDisplay.y;
            this.rifleDisplay.x=camera.displayWidth-140;
            this.rifleImage.x=this.rifleDisplay.x;
            this.rifleDisplay.y=camera.displayHeight-60;
            this.rifleImage.y=this.rifleDisplay.y;
            this.shotgunDisplay.x=camera.displayWidth-60;
            this.shotgunImage.x=this.shotgunDisplay.x;
            this.shotgunDisplay.y=camera.displayHeight-60;
            this.shotgunImage.y=this.shotgunDisplay.y;
        }
    }
    HUDElements(scene,camera){
        this.healthText=scene.add.text(5,camera.height-40, 'Health: '+20+"/"+20,{font:"30px Arial",fill:"white",stroke:"red",strokeThickness:5});
        this.healthText.scrollFactorX=0;
        this.healthText.scrollFactorY=0;

        this.bulletText=scene.add.text(5,camera.height-80, 'Ammo: '+12+"/"+12,{font:"30px Arial",fill:"white",stroke:"black",strokeThickness:5});
        this.bulletText.scrollFactorX=0;
        this.bulletText.scrollFactorY=0;

        this.oreText=scene.add.text(5,camera.height-120, 'Iron: '+0,{font:"30px Arial",fill:"white",stroke:"gray",strokeThickness:5});
        this.oreText.scrollFactorX=0;
        this.oreText.scrollFactorY=0;        

        this.handgunDisplay=scene.add.rectangle(camera.displayWidth-220,camera.displayHeight-60,80,80,"black","0.5");
        this.handgunDisplay.scrollFactorX=0;
        this.handgunDisplay.scrollFactorY=0;
        this.handgunDisplay.setStrokeStyle(2,0x000000);

        this.handgunImage=scene.add.image(this.handgunDisplay.x,this.handgunDisplay.y,"handgun");
        this.handgunImage.scrollFactorX=0;
        this.handgunImage.scrollFactorY=0;
        this.handgunImage.displayWidth=50;
        this.handgunImage.displayHeight=40;

        this.rifleDisplay=scene.add.rectangle(camera.displayWidth-140,camera.displayHeight-60,80,80,"black","0.5");
        this.rifleDisplay.scrollFactorX=0;
        this.rifleDisplay.scrollFactorY=0;
        this.rifleDisplay.setStrokeStyle(2,0x000000);

        this.rifleImage=scene.add.image(this.rifleDisplay.x,this.rifleDisplay.y,"rifle");
        this.rifleImage.scrollFactorX=0;
        this.rifleImage.scrollFactorY=0;
        this.rifleImage.displayWidth=70;
        this. rifleImage.displayHeight=50;

        this.shotgunDisplay=scene.add.rectangle(camera.displayWidth-60,camera.displayHeight-60,80,80,"black","0.5");
        this.shotgunDisplay.scrollFactorX=0;
        this.shotgunDisplay.scrollFactorY=0;
        this.shotgunDisplay.setStrokeStyle(2,0x000000);

        this.shotgunImage=scene.add.image(this.shotgunDisplay.x,this.shotgunDisplay.y,"shotgun");
        this.shotgunImage.scrollFactorX=0;
        this.shotgunImage.scrollFactorY=0;
        this.shotgunImage.displayWidth=70;
        this.shotgunImage.displayHeight=50;

        
        this.weaponDisplay("handgun");
    }
    weaponDisplay(weaponInUse){
        if(this.lastWeapon=="handgun"){
            this.handgunDisplay.setFillStyle(0x000000,"0.5");
        }else if(this.lastWeapon=="rifle"){
            this.rifleDisplay.setFillStyle(0x000000,"0.5");
        }else if(this.lastWeapon=="shotgun"){
            this.shotgunDisplay.setFillStyle(0x000000,"0.5");
        }
        if(weaponInUse=="handgun"){
            this.handgunDisplay.setFillStyle(0xEBECFD,"0.8");
            this.lastWeapon="handgun";
        }else if(weaponInUse=="rifle"){
            this.rifleDisplay.setFillStyle(0xEBECFD,"0.8");
            this.lastWeapon="rifle";
        }else if(weaponInUse=="shotgun"){
            this.shotgunDisplay.setFillStyle(0xEBECFD,"0.8");
            this.lastWeapon="shotgun";
        }
    }
    bulletShot(ammo,max_ammo){
        this.bulletText.setText('Ammo: '+ammo+"/"+max_ammo);
    }
    UpdateHealth(actHlth,maxHealth){
        this.healthText.setText('Health: '+actHlth+"/"+maxHealth);
    }
    oreCollected(scene){
        this.oreText.setText('Iron: '+scene.player.getIronOres());
    }
}
