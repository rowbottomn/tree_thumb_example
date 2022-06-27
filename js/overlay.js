const a_opening = {
  'duration: 1000',
  'transform: height (0)',
  'transform: height(100%)',
}

const a_opening = {
  'duration: 1000',
  'transform: height (100%)',
  'transform: height(0)',
}
//only do these once
document.querySelector('#overlay').addEventListener('click', function(){
  //this.classList.add('hidden');
});
document.querySelector('#overlay-img').addEventListener('click',function(){
    showImages(this, this.images);
  });
document.querySelector('#b_close').addEventListener('click',function(){
    document.querySelector('#overlay').classList.add('hidden');
  });
//class declaration and constructor function 
function Overlay(images){
  //get the reference
  this.overlay = document.querySelector('#overlay');
  
  this.img = document.querySelector('#overlay-img');
  //this.img.id = 'overlay-img';
  this.img.images = images;
  showImages(this.img, this.img.images);//this sets a random item
  this.img.classList.add('tree-img');
  this.overlay.classList.remove('hidden');
  
}