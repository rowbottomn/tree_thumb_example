//var storage = firebase.storage();
  //var pathReference = storage.ref(basePath);
  
var tempImages = [];
var test = document.querySelector('.img-holder');
var testThumb = new Thumb(test, 'whiteoak', 'buds', 0,0);
function Thumb(parent, tree, part, w, h){
  this.pathReference = storage.ref(basePath).child(tree).child(part);
  
  this.img = document.createElement('img');
  this.img.classList.add('tree-img');
  this.img.id = parent.id+'-thumb';
  parent.appendChild(this.img);
  console.log('img.id: '+ this.img.id);
  this.img.images = [];
  this.overlay = {};
  this.pathReference.listAll()
  .then((res) => {
    imageArray = [];
    
    res.items.forEach((itemRef) => {
      // All the items under listRef.
      console.log(itemRef);
      imageArray.push(itemRef.fullPath);
      
    });
    return imageArray;
  }).then((imgs)=>{
      const thumb = document.querySelector('#'+this.img.id);  
    thumb.images = imgs;
      showImage(this.img, imgs[0]);
    
      
    this.img.addEventListener('click', function(){
      this.overlay = new Overlay(this.images);
    });
    console.log('imgs length :'+imgs.length);
  }).catch((error) => {
    console.log("list error"+error.message);
  });
  
}

function showThumb(el,link){
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