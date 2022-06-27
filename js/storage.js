// Create a reference with an initial file path and name
const tb_tree = document.querySelector('#tb_tree');
const tb_part = document.querySelector('#tb_part');

//add event listeners for the enter key
tb_tree.addEventListener('keyup',(e)=>{
  if (e.keyCode === 13){
    tree = tb_tree.value!=''?tb_tree.value.replace(/ /g,''):'americanelm';
    getTextValue();  
  }
});

tb_part.addEventListener('keyup',(e)=>{
  if (e.keyCode === 13){
    part = tb_part.value!=''?tb_part.value.replace(/ /g,''):'leaves';
    getTextValue();  
  }
});

function getTextValue(){
  
    pathReference = storage.ref(basePath).child(tree).child(part);
    console.log(pathReference);
    console.log('we got an enter key press!'+pathReference);
    getImages();    
  
}

var basePath = 'tree_pics';
var tree = 'americanelm';
var part = 'leaves';
var storage = firebase.storage();
var pathReference = storage.ref(basePath);
pathReference = storage.ref(basePath).child(tree).child(part);
console.log(pathReference);


const img = document.querySelector(".form-holder");
let imageArray = [];

//getImages();
function getImages(){

// Find all the prefixes and items.
pathReference.listAll()
  .then((res) => {
    imageArray = [];
    
    res.items.forEach((itemRef) => {
      // All the items under listRef.
      console.log(itemRef);
      imageArray.push(itemRef.fullPath);
      
    });
    return imageArray;
  }).then((imgs)=>{
      
      showImage(img, imgs[0]); 
    
  }).catch((error) => {
    console.log("list error"+error.message);
  });
}
/*
function showImage(el,link){
  var storageRef = firebase.storage().ref();
  storageRef.child(link)
    .getDownloadURL().then(function(url) {
      let first = {};
        if (el.hasChildNodes()) {
         first = el.children[0];
          //first.removeEventListener('click',null);

        }
      else{
        first = document.createElement('img');
        first.classList.add('tree-img');
        el.appendChild(first);
      }
        
        first.src = url;    
        
        
        first.addEventListener('click', ()=>{ 
          showImage(el, imageArray[imageArray.length * Math.random() | 0]);
        });
         }).catch(function(error) {
            console.log(error.message);
         });
}
*/
function showImage(el,link){
  var storageRef = firebase.storage().ref();
  storageRef.child(link)
    .getDownloadURL().then(function(url) {        
        el.src = url;    
         }).catch(function(error) {
            console.log(error.message);
         });
}


function showImages(el,links){
  const link = links[links.length * Math.random() | 0];
  var storageRef = firebase.storage().ref();
  storageRef.child(link)
    .getDownloadURL().then(function(url) {        
        el.src = url;    
         }).catch(function(error) {
            console.log(error.message);
         });
}