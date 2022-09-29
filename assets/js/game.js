import MainSceneMult from "./MainSceneMult.js";
import MainMenu from "./MainMenu.js";
import MainScene from "./MainScene.js";
import PauseMenu from "./PauseMenu.js";
import PauseMenuMult from "./PauseMenuMult.js";
import WaitingRoom from "./WaitingRoom.js";
const config={
    parent:"gameContainer",
    type:Phaser.AUTO,
    scene:[MainMenu,MainScene,WaitingRoom,MainSceneMult,PauseMenu,PauseMenuMult],     
    scale:{
        mode:Phaser.Scale.ScaleManager.FIT,//RESIZE AND FLEX BODY FULL SCREEN, FIT ABSOLUTE POSITIONING
        autoCenter:Phaser.Scale.CENTER_BOTH,
        width:1200,
        height:800,
    },
    physics:{
        default:"matter",
        matter:{
            debug:true,
            gravity:{y:0},
        },
        arcade:{
            gravity:{y:0}
        }
    },
    plugins:{
        scene:[
            {
                plugin: PhaserMatterCollisionPlugin.default,
                key: "matterCollision",
                mapping: "matterCollision"
            },
            {
                key: 'PhaserRaycaster',
                plugin: PhaserRaycaster,
                mapping: 'raycasterPlugin'
            }
        ]
    }    
}
const game=new Phaser.Game(config);

