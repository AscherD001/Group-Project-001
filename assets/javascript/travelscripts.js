$("#city-input").keyup(function(event){
    if(event.keyCode == 13){
        $("#search").click();
    }
});
function w3_open() {
  document.getElementById("main").style.marginRignt = "25%";
  document.getElementById("mySidebar").style.width = "25%";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("openNav").style.display = 'none';
}
function w3_close() {
  document.getElementById("main").style.marginRight = "0%";
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("openNav").style.display = "inline-block";
}


$( "#search" ).click(function() {
   $( "#landingpage" ).fadeOut(2000, function(){
      $("#main").fadeTo(2000, 1);
   });
});



// var citylist =["Louisville,KY"];
// function citySuggest() {
//     // Declare variables
//     var input, filter;
//     input = document.getElementById('city-input');
//     filter = input.value.toUpperCase();

//     // Loop through all list items, and hide those who don't match the search query
//     for (i = 0; i < citylist.length; i++) {;
//         if (i > -1) {
//             citylist[i].style.display = "";
//         } else {
//             li[i].style.display = "Please choose another city.";
//         }
//     }
// }

//---->different---> $('city-input').cityAutocomplete();

