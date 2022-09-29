export default class Bullet extends Phaser.Physics.Matter.Sprite{
    constructor(data,heal){
        let {scene,x,y,texture}=data;
        super(scene.matter.world,x,y,texture,"",{label:"Heal",isSensor:true});
        this.scene.add.existing(this);
        this.heal=heal;
        this.setScale(0.06);
    }
}