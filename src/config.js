const fs = require("fs");
const layersOrder = [];

function layers(name,number){
    const layer = {name,number}
    layersOrder.push(layer);
    console.log(layersOrder);
} 


  
const format = {
    width: 230,
    height: 230
};

const rarity = [
    { key: "", val: "original" },
    { key: "_r", val: "rare" },
    { key: "_sr", val: "super rare" },
];

const defaultEdition = 5;

module.exports = { layersOrder, format, rarity, defaultEdition,layers};