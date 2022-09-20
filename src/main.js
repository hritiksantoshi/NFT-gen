const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const { rarity } = require("./config.js");
const store = require("../controller/index");
let edition;
let occurence = {};
const format = {width:0,height:0};
var canvas = createCanvas(format.width,format.height);
var ctx = canvas.getContext("2d");

function Canvas(width,height){
  format.width = width;
  format.height = height;
   canvas = createCanvas(format.width,format.height);
   ctx = canvas.getContext("2d");
}



if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

const buildDir = `${process.env.PWD}/build`;
const metDataFile = '_metadata.json';
const layersDir = `${process.env.PWD}/layers`;

let metadata = [];
let attributes = [];
let hash = [];
let decodedHash = [];
const Exists = new Map();


const addRarity = (_str,total) => {
  let itemRarity;
  let name = _str.slice(0,-4);
if(name.includes('#')){
  itemRarity = Math.round((name.split('#')[1]/100)*edition);
}
else{
  itemRarity = edition/total;
}

  return itemRarity;
};

const cleanName = _str => {
  let name = _str.slice(0, -4).replace('#','');
  return name;
};

const getElements = (path,total) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index + 1,
        name: cleanName(i),
        fileName: i,
        rarity: addRarity(i,total),
      };
    });
};

const layersSetup = layersOrder => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    location: `${layersDir}/${layerObj.name}/`,
    elements: getElements(`${layersDir}/${layerObj.name}/`,layerObj.number),
    position: { x: 0, y: 0 },
    size: { width: format.width, height: format.height },
    number: layerObj.number
  }));

  return layers;
};

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(`${buildDir}/json`);
  fs.mkdirSync(`${buildDir}/images`);
};

const saveLayer = (_canvas, _edition) => {
  fs.writeFileSync(`${buildDir}/images/${_edition}.png`, _canvas.toBuffer("image/png"));
};

const addMetadata = _edition => {
  let dateTime = Date.now();
  let tempMetadata = {
    hash: hash.join(""),
    decodedHash: decodedHash,
    edition: _edition,
    date: dateTime,
    attributes: attributes,
  };
  metadata.push(tempMetadata);
  attributes = [];
  hash = [];
  decodedHash = [];
};

const saveMetaData = (_editionCount) => {
  let data = metadata.find((meta) => meta.edition == _editionCount);
  fs.writeFileSync(
    `${buildDir}/json/${_editionCount}.json`,
    JSON.stringify(data, null, 2)
  );
};

const addAttributes = (_element, _layer) => {
  let tempAttr = {
    id: _element.id,
    layer: _layer.name,
    name: _element.name,
    rarity: _element.rarity,
  };
  attributes.push(tempAttr);
  hash.push(_layer.id);
  hash.push(_element.id);
  decodedHash.push({ [_layer.id]: _element.id });
};

const drawLayer = async (_layer, _edition) => {
  let draw = true;
  do{
  const rand = Math.random();
  let element =
    _layer.elements[Math.floor(rand * _layer.number)] ? _layer.elements[Math.floor(rand * _layer.number)] : null;
   
  if (element) {
    let eOurs = occurence[_layer.name].filter((val) => val == element.id).length;
     
    if(eOurs <= element.rarity && element.rarity != 0){
      console.log(eOurs,"=>",element.rarity);
      occurence[_layer.name].push(element.id);
    addAttributes(element, _layer);
    const image = await loadImage(`${_layer.location}${element.fileName}`);

    ctx.drawImage(
      image,
      _layer.position.x,
      _layer.position.y,
      _layer.size.width,
      _layer.size.height
    );
    saveLayer(canvas, _edition);
     draw = false;
    }
  }
}while(draw);
};

const createFiles = async (layersOrder,Edition) => {
  edition = Edition;
  layersOrder.forEach(({name}) =>{
    occurence[name] =[];
  })
  const layers = layersSetup(layersOrder);

  let numDupes = 0;
 for (let i = 1; i <= edition; i++) {
   await layers.forEach(async (layer) => {
     await drawLayer(layer, i);
   });

   let key = hash.toString();
   if (Exists.has(key)) {
     console.log(
       `Duplicate creation for edition ${i}. Same as edition ${Exists.get(
         key
       )}`
     );
     numDupes++;
     if (numDupes > edition) break; //prevents infinite loop if no more unique items can be created
     i--;
   } else {
     Exists.set(key, i);
     addMetadata(i);
     saveMetaData(i);
     console.log("Creating edition " + i);
   }
 }
};

const createMetaData = () => {
  fs.stat(`${buildDir}/json/${metDataFile}`, (err) => {
    if(err == null || err.code === 'ENOENT') {
      fs.writeFileSync(`${buildDir}/json/${metDataFile}`, JSON.stringify(metadata, null, 2));
    } else {
        console.log('Oh no, error: ', err.code);
    }
  });
};

module.exports = { buildSetup, createFiles, createMetaData,Canvas };
