
// events.js

var eventObj;
var getEventObj;
var ii;
var eventObj;
var title;
var desc;
var eNum = 0;
var imgArray = [];

var app_key = "&app_key=hM4NZjM8RPGkXH6B";
            
var queryParms = "&page_size=10&page_number=1&location=Cleveland&sort_order=popularity&image_sizes=blackborder500";
            
var queryURL = "http://api.eventful.com/json/events/search?";
var proxy = 'https://cors-anywhere.herokuapp.com/';
            
// Creates AJAX call for the specific topic button being clicked
var d = new Date();
var n = d.getMonth();
var months = ['January','February','March','April',
                  'May','June','July','August',
                  'September','October','November','December'];
var now = new Date();

spinner = $('.loader');

iso = d.toISOString().split("T");
fd = iso[0].split("-"); 
nextyy = fd[0];
intyy = parseInt(nextyy);

if (fd[1] == 12){nextmm="01"; nextyy = intyy+1 } else {nextmm=fd[1];nextyy= fd[0] }

dateRange = fd[0] + fd[1] + fd[2] + "00-" + nextyy + nextmm + fd[2] + "00";
console.log("dataRange= " + dateRange);

queryParms += "&date=" + dateRange;

spinner.show();
                              
$.ajax({
url: proxy + queryURL + queryParms + app_key,
method: "GET"
}).then(function(response) {
           
    var myObj = JSON.parse(response);

    eventObj = myObj;
                        
    for (i=0 ; i < eventObj.events.event.length ; i++ ) {
        ii=i;
                        
    var oArgs = {
        app_key:"hM4NZjM8RPGkXH6B",
        id: eventObj.events.event[ii].id,
        page_size: 25 ,
        };

EVDB.API.call("/events/get", oArgs, function(oData) {

getEventObj = oData;

console.log("*************  Start of event info  ************");
console.log("title= " + getEventObj.title);
console.log("desc= " + getEventObj.description);
console.log("length of image array= " + getEventObj.images.image.length);

spinner.hide();

if (Array.isArray(getEventObj.images.image) != false) {
//   console.log("images= " + JSON.stringify(getEventObj));
  var res = getEventObj.images.image[0].url.replace("small", "large");
}
else {
  var res = getEventObj.images.image.small.url.replace("small", "large");
  console.log("non array image= "+ res);

}

$("#event-heading-" + eNum).text(getEventObj.title);

if ( getEventObj.description != null ){
    $("#event-" + eNum).text(getEventObj.description);
    
} else
{
    $("#event-" + eNum).text("No Description Available");

}
$("#where-" + eNum).text("Where:");
$("#where0" + eNum).append(getEventObj.venue_name);
$("#where1" + eNum).append(getEventObj.address);
$("#where2" + eNum).append(getEventObj.city + "', " + getEventObj.region);

var dt = getEventObj.start_time.split(" ");

$("#when-" + eNum).text("When:");
$("#when0" + eNum).append(dt[0]);
$("#when1" + eNum).append(toStandardTime(dt[1]));

$("#event-img-" + eNum).attr("src", res);

eNum += 1;
      });
    }
});

function toStandardTime(militaryTime) {
    militaryTime = militaryTime.split(':');
    return (militaryTime[0].charAt(0) == 1 && militaryTime[0].charAt(1) > 2) ? (militaryTime[0] - 12) + ':' + militaryTime[1] + ':' + militaryTime[2] + ' P.M.' : militaryTime.join(':') + ' A.M.'
}
