
//get a reference to the firestore api
const db = firebase.firestore();

//use these fields to keep the unique field names for both hours and weeks
const hoursFieldIds = ['timeStamp','studentName','numHours','details','ip_address']; 
//const weekFieldIds = ['timeStamp','studentName','details','keep','start','stop','ip_address']; 
const weekFieldIds = ['keep','start','stop']; 

const b_submit=document.querySelector("#b_submit");
const b_getData=document.querySelector("#b_getHoursData");
//const b_week=document.querySelector("#b_subWeek");
//const b_getWeekData=document.querySelector("#b_getWeekData");
const o_hours = document.querySelector("#o_hour");
//const o_week = document.querySelector("#o_week");

/*get the current time value for default*/
const currentDateTime = () => {
  var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOString = new Date(Date.now() - tzoffset)
    .toISOString()
    .slice(0, -1);

  // convert to YYYY-MM-DDTHH:MM
  const datetimeInputString = localISOString.substring(
    0,
    ((localISOString.indexOf("T") | 0) + 6) | 0
  );
  console.log(datetimeInputString);
  return datetimeInputString;
};

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
        document.getElementById('ip_address').textContent = displayAddrs.join(" or perhaps ") || "n/a";  
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
    document.getElementById('ip_address').innerHTML = "<code>ifconfig| grep inet | grep -v inet6 | cut -d\" \" -f2 | tail -n1</code>";  
    document.getElementById('ip_address').nextSibling.textContent = "In Chrome and Firefox your IP should display automatically, by the power of WebRTCskull.";  
} 


const insertHoursIntoDB=()=>
{
  const fields = [];
  for(let i = 0; i < hoursFieldIds.length; i++){
    fields.push(document.querySelector("#"+hoursFieldIds[i]));
  }
    
    db.collection("daily_hours").add({
      timeStamp :fields[0].value,
      studentName: fields[1].value,
      numHours: fields[2].value,
      details:fields[3].value,
      ip_address :fields[4].innerText
    })
    .then(function(docRef) 
    {
      //Everything inside this then block, will only be executed if, the above-code is executed successfully
      alert("Your question was successfully inserted into the database");

      for(let i = 0; i < hoursFieldIds.length; i++){
        fields[i] ="";
      }

      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

};

const insertWeekIntoDB=()=>
{
  const fields = [];
  for(let i = 0; i < weekFieldIds.length; i++){
    fields.push(document.querySelector("#"+weekFieldIds[i]));
  }
    
  db.collection("week").add({
    timeStamp :fields[0].value,
    studentName: fields[1].value,
    details:fields[2].value,
    keep: fields[3].value,
    start:fields[4].value,
    stop: fields[5].value,
    ip_address :fields[6].innerText
  })
  .then(function(docRef) 
  {
    //Everything inside this then block, will only be executed if, the above-code is executed successfully
    alert("Your question was successfully inserted into the database");

    for(let i = 0; i < weekFieldIds.length; i++){
      fields[i] ="";
    }

    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });

};
const showData = function(collection)
{
  const overlayContainer= document.querySelector("#o_"+collection);

 // overlayContainer.style.display="block";

  db.collection(collection)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            console.log(`\n\n\n`);
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    console.log(collection);
};

//event addEventListener
b_submit.addEventListener("click",insertIntoDB(mode));
b_getData.addEventListener("click", showData(mode));

/*b_hours.addEventListener("click",insertIntoDB('hours'));*/
b_getHoursData.addEventListener("click", showData('hours'));
b_week.addEventListener("click",insertIntoDB('week'));
b_getWeekData.addEventListener("click", showData('week'));