
//get a reference to the firestore api
const db = firebase.firestore();

//use these fields to keep the unique field names for both hours and weeks
const hoursFieldIds = ['timeStamp','studentName','numHours','ipAddress','details']; 
const weekFieldIds = ['keep','start','stop']; 

const fields = [];
const fieldDivs = [];

for(let i = 0; i < hoursFieldIds.length; i++){
  fields.push(document.querySelector("#"+hoursFieldIds[i]));
  fieldDivs.push(document.querySelector("#d_"+hoursFieldIds[i]));
}
//const weekFieldIds = ['timeStamp','studentName','details','keep','start','stop','ip_address']; 

for(let i = 0; i < weekFieldIds.length; i++){
  fields.push(document.querySelector("#"+weekFieldIds[i]));
  fieldDivs.push(document.querySelector("#d_"+weekFieldIds[i]));
}

const b_submit=document.querySelector("#b_submit");
b_submit.addEventListener("click",insertIntoDB);
const b_getData=document.querySelector("#b_getData");
b_getData.addEventListener("click", showData);

const overlay = document.querySelector("#overlay");
//const o_week = document.querySelector("#o_week");

const timeStamp = document.getElementById('timeStamp').value = currentDateTime();

/*
This handles getting the ipaddress.  
TO DO ==> convert to ipv4
*/
var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;  
if (RTCPeerConnection)(function() {  
    var rtc = new RTCPeerConnection({  
        iceServers: []  
    });  
    if (1 || window.mozRTCPeerConnection) {  
        rtc.createDataChannel('', {  
            reliable: false  
        });  
    };  
    rtc.onicecandidate = function(evt) {  
        if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);  
    };  
    rtc.createOffer(function(offerDesc) {  
        grepSDP(offerDesc.sdp);  
        rtc.setLocalDescription(offerDesc);  
    }, function(e) {  
        console.warn("offer failed", e);  
    });  
    var addrs = Object.create(null);  
    addrs["0.0.0.0"] = false;  
  
    function updateDisplay(newAddr) {  
        if (newAddr in addrs) return;  
        else addrs[newAddr] = true;  
        var displayAddrs = Object.keys(addrs).filter(function(k) {  
            return addrs[k];  
        });  
        document.getElementById('ipAddress').textContent = displayAddrs.join(" or perhaps ") || "n/a";  
    }  
  
    function grepSDP(sdp) {  
        var hosts = [];  
        sdp.split('\r\n').forEach(function(line) {  
            if (~line.indexOf("a=candidate")) {  
                var parts = line.split(' '),  
                    addr = parts[4],  
                    type = parts[7];  
                if (type === 'host') updateDisplay(addr);  
            } else if (~line.indexOf("c=")) {  
                var parts = line.split(' '),  
                    addr = parts[2];  
                updateDisplay(addr);  
            }  
        });  
    }  
})();  
else {  
    document.getElementById('ipAddress').innerHTML = "<code>ifconfig| grep inet | grep -v inet6 | cut -d\" \" -f2 | tail -n1</code>";  
    document.getElementById('ipAddress').nextSibling.textContent = "In Chrome and Firefox your IP should display automatically, by the power of WebRTCskull.";  
} 


function insertIntoDB()
{
  let mode = document.querySelector('input[name="mode"]:checked').value;
  //['timeStamp','studentName','numHours','ip_address','details'];
  if (mode === 'hours'){
      db.collection(mode).add({
        timeEntered: currentDateTime(),
        studentName: fields[1].value,
        ipAddress : fields[3].innerText,
        timeStamp :fields[0].value,
        numHours: fields[2].value,
        details:fields[4].value,
      })
      .then(function(docRef) 
      {
        //Everything inside this then block, will only be executed if, the above-code is executed successfully       
          console.log("Document written with ID: ", docRef.id);
          alert("You successfully submitted your hours.");
        //notice the alert is blocking
        document.location.reload(false);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });  
    }
    else if (mode === 'week'){
        db.collection(mode).add({
        timeEntered: currentDateTime(),
        studentName: fields[1].value,
        ipAddress :fields[3].innerText,
        timeStamp :fields[0].value,
        keep: fields[5].value,
        start: fields[6].value,
        stop: fields[7].value,
      })
      .then(function(docRef) 
      {
        //Everything inside this then block, will only be executed if, the above-code is executed successfully
        console.log("Document written with ID: ", docRef.id);
        
         alert("You successfully submitted your weekly reflection.");  
       
        document.location.reload(false);
        //notice the alert is blocking

      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });  
    }
    
}

function showData()
{
  let mode = document.querySelector('input[name="mode"]:checked').value;
  overlay.innerHTML = "<h1 class = 'overlay-title'>Coop Logging</h1>";
  overlay.classList.remove('hidden');
  const tableEl = document.createElement('table');
  overlay.appendChild(tableEl);
  //const overlayContainer= document.querySelector("#overlay");

 // overlayContainer.style.display="block";
  //db.collection("cities").where("capital", "==", true)
  db.collection(mode).where("studentName", "==",fields[1].value)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
          const rowEl = document.createElement('tr');
          rowEl.classList.add('table-row');
          tableEl.appendChild(rowEl);
          if (mode == 'hours'){
            createTd(rowEl, doc.data().studentName);
            createTd(rowEl, doc.data().timeEntered);
            createTd(rowEl, doc.data().details);
            createTd(rowEl, doc.data().numHours);  
          }
          else{
            createTd(rowEl, doc.data().studentName);
            createTd(rowEl, doc.data().timeEntered);
            createTd(rowEl, doc.data().keep);
            createTd(rowEl, doc.data().start);  
            createTd(rowEl, doc.data().stop);  
          }
          
          //doc.data().forEach((value)=>console.log(value));
          console.log(doc.id, " => ", doc.data());
          console.log(`\n\n\n`);
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
   
};

/*get the current time value for default*/
function currentDateTime() {
  var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOString = new Date(Date.now() - tzoffset)
    .toISOString()
    .slice(0, -1);

  // convert to YYYY-MM-DDTHH:MM
  const datetimeInputString = localISOString.substring(
    0,
    ((localISOString.indexOf("T") | 0) + 6) | 0
  );
 // console.log(datetimeInputString);
  return datetimeInputString;
};

//event addEventListener

function createTd(el, val){
  const td = document.createElement('td');
  td.classList.add('table-detail');
  td.innerHTML = "<span >"+val+"</span>";
  el.appendChild(td);
}

overlay.addEventListener('click', ()=>{
  //overlay.classList.add('hidden');
  overlay.classList.add('hidden');
});

/*b_hours.addEventListener("click",insertIntoDB('hours'));*/
//b_getHoursData.addEventListener("click", showData('hours'));
//b_week.addEventListener("click",insertIntoDB('week'));
//b_getWeekData.addEventListener("click", showData('week'));