export default class IronOre extends Phaser.Physics.Matter.Sprite{
    constructor(data){
        let {scene,x,y,texture}=data;
        super(scene.matter.world,x,y,texture,"",{label:"IronOre",isStatic:true});
        this.scene.add.existing(this);
        this.setScale(3);
    }
    progressBar(scene){
        this.bar=new Phaser.GameObjects.Graphics(scene);
        this.value=0;
        this.draw();
        scene.add.existing(this.bar);
    }
    increaseProgressBar(i){
        this.value=16*i;
        if(this.value>48){
            this.value=48;
        }
        this.draw();
    }
    draw(){
        this.bar.clear();
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x-25,this.y,50,16);
        this.bar.fillStyle(0xffff00);
        this.bar.fillRect(this.x-23,this.y+2,this.value,12);
    }
    removeProgBar(d){
        console.log(d);        
        delay(d).then(() =>{
            console.log("removed");
            this.bar.setActive(false).setVisible(false);
        });
    }
    static preload(scene){
        scene.load.image("iron_ore","/assets/Tiles/IronOre.png","/assets/Tiles/iron_ore_atlas.json");
    }
}
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
 