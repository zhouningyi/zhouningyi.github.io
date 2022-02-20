const fs = require('fs');
const path = require('path');
// const chalk = require('chalk');
const OSS = require('ali-oss');
const _ = require('lodash');
async function loadAndUpload(){
}


function getOss(){
  return new OSS({
    accessKeyId: 'myTnDvU3STvukolo',
    accessKeySecret: 'Y66ZXL0fmRu1UMDh9fAB5UOF34yk6D',
    bucket: 'yeshou',
    region: 'oss-cn-hangzhou'
  });
}

const ppt_config = [];
function savePPTConfig(){
  const pth = path.join(__dirname, './../src/ppt_config.json');
  const content = JSON.stringify(_.sortBy(ppt_config, p => p.name), null, 2);
  fs.writeFileSync( pth, content,'utf8');
}



const store = getOss();
async function uploadFile(name, content) {
  return new Promise((resolve, reject) => {
    store.put(name, new Buffer(content)).then((val) => {
      const url = `http://yeshou.oss-cn-hangzhou.aliyuncs.com/${name}`;
      console.log(`${name} | ${url}  ✅`);
      ppt_config.push({name, url});
      resolve(val);
    }).catch((err) => {
      console.log(err, 'err...');
      console.log(console.log(`${name}  ❌`));
      // process.exit();
      reject(err);
    });
  });
}


async function main(){
  const JPG_PATH = path.join(__dirname, './binquant');
  const files = fs.readdirSync(JPG_PATH).filter(name => name.indexOf('.jpeg') !== -1);
  const tasks = [];
  for (const file of files){
    const full_path = path.join(JPG_PATH, file);
    const file_content = fs.readFileSync(full_path);
    tasks.push(uploadFile(file, file_content));
  }
  await Promise.all(tasks);
  savePPTConfig();
}

main();


setTimeout(() => {}, 10000000);