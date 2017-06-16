jQuery( document ).ready(function($) {

    var map;
// To keep our code clean and modular, all custom functionality will be contained inside a single object literal called "multiFilter".
var multiFilter = {

  // Declare any variables we will need as properties of the object

  $filterGroups: null,
  $filterUi: null,
  $reset: null,
  groups: [],
  outputArray: [],
  outputString: '',

  // The "init" method will run on document ready and cache any jQuery objects we will need.

  init: function(){
    var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "checkboxFilter" object so that we can share methods and properties between all parts of the object.

    self.$filterUi = $('#filterContainer');
    self.$filterGroups = $('.filter-group');
    self.$reset = $('#Reset');
    self.$container = $('#program-cards');

    self.$filterGroups.each(function(){
      self.groups.push({
        $inputs: $(this).find('input'),
        active: [],
          tracker: false
      });
    });

    self.bindHandlers();
  },

  // The "bindHandlers" method will listen for whenever a form value changes.

  bindHandlers: function(){
    var self = this,
        typingDelay = 300,
        typingTimeout = -1,
        resetTimer = function() {
          clearTimeout(typingTimeout);

          typingTimeout = setTimeout(function() {
            self.parseFilters();
          }, typingDelay);
        };

    self.$filterGroups
      .filter('.checkers')
      .on('change', function() {
         self.parseFilters();
      });

    self.$filterGroups
      .filter('.search')
      .on('keyup change', resetTimer);

    self.$reset.on('click', function(e){
      e.preventDefault();
      self.$filterUi[0].reset();
      self.$filterUi.find('input[type="text"]').val('');
      self.parseFilters();
    });
  },

  // The parseFilters method checks which filters are active in each group:

  parseFilters: function(){
    var self = this;

    // loop through each filter group and add active filters to arrays

    for(var i = 0, group; group = self.groups[i]; i++){
      group.active = []; // reset arrays
      group.$inputs.each(function(){
        var searchTerm = '',
               $input = $(this),
            minimumLength = 3;

        if ($input.is(':checked')) {
          group.active.push(this.value);
        }

        if ($input.is('[type="text"]') && this.value.length >= minimumLength) {
          searchTerm = this.value
            .trim()
            .toLowerCase()
            .replace(' ', '-');

          group.active[0] = '[class*="' + searchTerm + '"]';
        }
      });
       group.active.length && (group.tracker = 0);
    }

    self.concatenate();
  },

  // The "concatenate" method will crawl through each group, concatenating filters as desired:

  concatenate: function(){
    var self = this,
        cache = '',
        crawled = false,
        checkTrackers = function(){
        var done = 0;

        for(var i = 0, group; group = self.groups[i]; i++){
          (group.tracker === false) && done++;
        }

        return (done < self.groups.length);
      },
      crawl = function(){
        for(var i = 0, group; group = self.groups[i]; i++){
          group.active[group.tracker] && (cache += group.active[group.tracker]);

          if(i === self.groups.length - 1){
            self.outputArray.push(cache);
            cache = '';
            updateTrackers();
          }
        }
      },
      updateTrackers = function(){
        for(var i = self.groups.length - 1; i > -1; i--){
          var group = self.groups[i];

          if(group.active[group.tracker + 1]){
            group.tracker++;
            break;
          } else if(i > 0){
            group.tracker && (group.tracker = 0);
          } else {
            crawled = true;
          }
        }
      };

    self.outputArray = []; // reset output array

     do{
        crawl();
     }
     while(!crawled && checkTrackers());

    self.outputString = self.outputArray.join();

    // If the output string is empty, show all rather than none:

    !self.outputString.length && (self.outputString = 'all');

    //console.log(self.outputString);

    // ^ we can check the console here to take a look at the filter string that is produced

    // Send the output string to MixItUp via the 'filter' method:

     if(self.$container.mixItUp('isLoaded')){
      self.$container.mixItUp('filter', self.outputString);
     }
  }
};
// END MIXITUP MULTIFILTERS

var mapStyles = [
      {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#cecdcc"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#FFBB00"
              },
              {
                  "saturation": 43.400000000000006
              },
              {
                  "lightness": 37.599999999999994
              },
              {
                  "gamma": 1
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#00FF6A"
              },
              {
                  "saturation": -1.0989010989011234
              },
              {
                  "lightness": 11.200000000000017
              },
              {
                  "gamma": 1
              }
          ]
      },
      {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi.park",
          "elementType": "labels",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#FFC200"
              },
              {
                  "saturation": -61.8
              },
              {
                  "lightness": 45.599999999999994
              },
              {
                  "gamma": 1
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "labels",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#FF0300"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 51.19999999999999
              },
              {
                  "gamma": 1
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#FF0300"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 52
              },
              {
                  "gamma": 1
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#0078FF"
              },
              {
                  "saturation": -13.200000000000003
              },
              {
                  "lightness": 2.4000000000000057
              },
              {
                  "gamma": 1
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#b1cef5"
              }
          ]
      }
  ];

var searchClose = document.getElementById('searchModalClose'),
   listingInterface = document.getElementById('listingInterface'),
   altSearchClose1 = document.getElementById('landingBrowsePrograms'),
   searchModal = document.getElementById('searchModal'),
   modalNonFilter = document.getElementById('modalNonFilter'),
   nonFilterContent = document.getElementById('nonFilterContent'),
   modalFilterContent = document.getElementById('modalFilterContent'),
   filterContainer = document.getElementById('filterContainer'),
   selectionView = document.getElementById('selectionView'),
   detailPane = document.getElementById('detailPane'),
   detailNavTop = document.getElementById('detailNavTop'),
   backButton = document.getElementById('backButton'),
   detailNavBottom = document.getElementById('detailNavBottom'),
   detailPaneContent = document.getElementById('detailPaneContent'),
   cancelFilters = document.getElementById('cancelFilters'),
   applyFilters = document.getElementById('applyFilters'),
   filterBottomNav = document.getElementById('filterBottomNav'),
   filterSelects = document.getElementsByClassName('custom-select'), 
   listingTab = document.getElementById('listing-tab'),
   mapTab = document.getElementById('map-tab'),
   mapListingButton = document.getElementById('map-listing-button'),
   menuButton =  document.getElementById('menuButton'),
   mainNav = document.getElementById('menu-main_nav'),
   filterView = new TimelineMax(),
   landingView = new TimelineMax(),
   detailView = new TimelineMax(),
   mapView = new TimelineMax();

//Langing view close animation
landingView.paused(true)
   .add("open")
   .to(searchModal, 0.75, {css:{top:"-100%", autoAlpha:0}, ease: Elastic.easeIn.config(1, 1)}, "open")
   .to(listingInterface, 0.75, {css:{left:"0"}, ease: Power3.easeInOut, delay:0.4}, "open")
   .to(mapListingButton, 1, {css:{autoAlpha:1}}, "open")
   .add("closed");

//Landing view close function
var landingViewClose = function(){
 
    
   var mainMap = document.getElementById('map');
   landingView.play();

   mainMap.className += ' listing-view';

   //google.maps.event.trigger(map, 'resize');
 
};

//Map view animation
mapView.paused(true)
   .add("open")
   .to(listingInterface, 0.75, {css:{left:"-100%"}, ease: Power3.easeInOut}, "open")
   // .to(mapTab, 0.75, {css:{right:'100%'}}, "open")
   // .to(listingTab, 0.75, {css:{left:'0'}}, "open")
   .to(mapListingButton, 0.1, {className:"+=open"}, "open")
   .add("closed");

//Map view open function
var mapViewOpen = function(event){
   event.preventDefault();
   mapView.play();
}

var mapViewClose = function(event){
   event.preventDefault();
   mapView.reverse();
}

//Play landing view close
searchClose.addEventListener("click", landingViewClose);

altSearchClose1.addEventListener("click", landingViewClose);

mapTab.addEventListener("click", mapViewOpen);

listingTab.addEventListener("click", mapViewClose);

//Filter view
var filterTriggers = document.getElementsByClassName('dropdown-trigger');
var active = '';

//Filter view transition definition
filterView.paused(true)
   .add("closed")
   .to(nonFilterContent, 0.2, {css:{autoAlpha:0}}, "closed")
   .to(selectionView, 0.2, {css:{overflow:"hidden"}}, "closed")
   .to(mapTab, 0.2, {css:{autoAlpha:0}}, "closed")
   .to(filterContainer, 0.2, {css:{autoAlpha:1}}, "open")
   .to(filterBottomNav, 0.2, {css:{autoAlpha:1}}, "open")
   .to('.block-interior', 0.1, {className:'+=filter-view'}, "open")
   .add("open");

var openFilters = function(event){
   active = event.target;
   //Reset filter trigger functions
   for (var i = 0; i < filterTriggers.length; i++) {
      filterTriggers[i].className = 'dropdown-trigger';
      filterTriggers[i].onclick = openFilters;
      filterContainer.className = 'filters';
   }
   //Choose which filters to open
   filterContainer.className += (' ' + active.id);
   //Switch from listing to filter view
   filterView.play();
   //Highlight active filter category
   active.className = "dropdown-trigger active-filter";
   //Allow active to close filters
   active.onclick = closeFilters;
};

var closeFilters = function(event){
   //Remove category highlight & filter container contents
   active.className = "dropdown-trigger ";
   //Reset filter container classes
   filterContainer.className = "filters";
   //Reveal listing view
   filterView.reverse();
   //Revert onclick
   event.target.onclick = openFilters;
};

for (var i = 0; i < filterTriggers.length; i++) {
   filterTriggers[i].onclick = openFilters;
};

applyFilters.addEventListener("click", closeFilters);
cancelFilters.addEventListener("click", closeFilters);
 




//Filter Dropdowns
for (var i = 0; i < filterSelects.length; i++) {
   filterSelects[i].addEventListener('click', function(event){
      this.classList.toggle("open");
   });
}

//Detail View
detailView.paused(true)
   .add("closed")
   .to(selectionView, 0.2, {css:{autoAlpha:0}}, "closed")
   .to(detailPane, 0.2, {css:{autoAlpha:1}}, "closed")
   .to(detailNavTop, 0.2, {css:{autoAlpha:1, left:"0"}}, "open")
   .to(detailPaneContent, 0.2, {css:{autoAlpha:1, left:"0"}}, "open")
   .add("open");

var programBlocks = document.getElementsByClassName('indiv-block');
var openDetails = function(){
   //event.preventDefault();
   detailView.play();
   selectionView.className += 'detail-view';
};

var closeDetails = function(){
   detailView.reverse();
   selectionView.className = '';
}

// for (var i = 0; i < programBlocks.length; i++) {
//    programBlocks[i].onclick = openDetails;
// }
backButton.onclick = closeDetails;
 
 


//Mobile Nav Open and Close
menuButton.addEventListener("click", function(){
   mainNav.classList.toggle("open");
 
});


// ======================= END FRONT END INTERACTIONS ==================================================



// ======================= DATA FUNCTIONS  =============================================================

var markers = [];
var icons = [];
var activeSize = new google.maps.Size(60, 67.68);
var inactiveSize = new google.maps.Size(40, 45.3);
 
//Create All Map Markers for Hospitals
function createMarker(hospital){

    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(hospital.latitude, hospital.longitude),
        name: hospital.name,
        id: hospital.id,
        topic: hospital.sdh_slug,
        icon: icons[hospital.sdh_slug].inactive
      //add custom marker based on topic here (need to add topic to json)

    });
 


    //Click event here to open panel and get content by ID
    google.maps.event.addListener(marker, 'click', function(){
        landingViewClose();
        //reset detail panel html here
        $('#detailPaneContent').html('');
 
        setActiveMarker(marker.id);
 
        //create Panel content and show it.
        createDetailPanel('', marker.id);
        mapView.reverse();

    });

    // Fired when the map becomes idle after panning or zooming. HOLD ON THIS
   // google.maps.event.addListener(map, 'idle', function() {
   //     showVisibleMarkers();
   // });
 
   markers.push(marker);

}


function setActiveMarker(marker_id){
    for (var i = 0; i < markers.length; i++) {
 
        if(markers[i].id == marker_id){
            markers[i].setIcon(icons[markers[i].topic].active);
        }
        else{
            markers[i].setIcon(icons[markers[i].topic].inactive);
        }
    }
}



//Create Initial HTML for Program Cards
function createProgramCard(program){

   //Get values of hospital taxonomies for filtering cards
   var hospital_taxs = "";
   var program_taxs = "";

   //combine all hospital taxonomies
   hospital_taxs += hospitals[program.hosp_id].bed_size_slug + " ";
   hospital_taxs += hospitals[program.hosp_id].percent_govt_payer_slug + " ";
   hospital_taxs += hospitals[program.hosp_id].ownership_slug + " ";
   hospital_taxs += hospitals[program.hosp_id].teaching_status_slug + " ";
   hospital_taxs += hospitals[program.hosp_id].region_slug + " ";
   hospital_taxs += hospitals[program.hosp_id].pop_size_slug + " ";
   hospital_taxs += hospitals[program.hosp_id].percent_below_fpl_slug + " ";
   hospital_taxs += hospitals[program.hosp_id].percent_uninsured_slug + " ";



   program_taxs += program.active_slug + " ";
   program_taxs += program.partners_slug + " ";
   program_taxs += program.sdh_slug + " ";
   program_taxs += program.target_pop_slug + " ";
   program_taxs += program.program_setting_slug + " ";

 

   // var sdh_arry = program.sdh_slug.split(" ");
   // var sdh_img = sdh_arry[0];

   //print out single card html with all filterable taxonomies
   var cardHTML = "";
   cardHTML =  '<a href="#"><li data-hospid="hosp-'+ program.hosp_id +'" id="program-'+ program.id +'" class="mix indiv-block program-card ' + program_taxs + ' ' + hospital_taxs + '">';
   cardHTML += '<div class="block-interior">';
   cardHTML +=   '<div class="category"><p>'+ program.primary_sdh +'</p>';
   cardHTML +=      '<img class="category-icon" src="'+$dir+'/img/icons/'+ program.primary_sdh_slug +'.svg"  >';
   cardHTML +=   '</div>';
   cardHTML +=   '<h2>'+ program.name +'</h2>';
   cardHTML +=   '<p class="hospital">'+hospitals[program.hosp_id].name +'</p>';
   cardHTML +=   '<p class="location">'+hospitals[program.hosp_id].city +'</p>';
   cardHTML += '</div>';
   cardHTML += '</li></a>';


   $('#program-cards').append(cardHTML);

}




//Function to show/hide markers that fires as a callback after filtering is complete
function UpdateMarkers(){

   //this will show the active filters strings
   var activeString = GetActiveString();
    
 

   $('#filter-string p').html(activeString);
   //var state = $('#program-cards').mixItUp('getState'); 

   //$('#results-count').html(state.totalShow);
   $('#results-count').html($('#program-cards li:visible').length);
   if($('#program-cards li:visible').length == 0){
        $('.nothing-found').show();
   }
   else{
        $('.nothing-found').hide();
   }

   //loop through markers (hospitals)
   for (var i = 0; i < markers.length; i++) {

      var marker = markers[i];
      var marker_id = markers[i].id;

      //get program cards with hospital id
        var programCard = $('li[data-hospid="hosp-'+marker_id+'"]');

      //check if there is a card visible(not filtered)
        if(programCard.is(':visible')) {
         marker.setVisible(true);
      }
        else{
            marker.setVisible(false); //hide marker if no visible cards with hospital id

        }
    }
}



//Generates HTML to load into Program View Panel, then calls function to show panel
function createDetailPanel(single_program_id, single_hospital_id){
   var prog_ids = [];
   var single = false;
   var hospital = hospitals[single_hospital_id];

   if(single_program_id){
      prog_ids.push(single_program_id);
      single = true;
   }
   else{
      prog_ids = hospital.program_ids;
   }
 
   
   //set panel hospital title
   $('#hospital_title').html(hospital.name + " | " + hospital.city);

   var panel_HTML = '';

   for(var x = 0; x < prog_ids.length; x++){
      var program = programs[prog_ids[x]];

      panel_HTML += '<div class="indiv-detail-block">';
      panel_HTML +=     '<div class="category"><p>' + program.primary_sdh + '</p><img class="category-icon" src="'+$dir+'/img/icons/'+ program.primary_sdh_slug +'.svg"  ></div>';
      panel_HTML +=     '<h1>' + program.name + '</h1>';
      panel_HTML +=     '<div id="expand-'+program.id+'-panel"class="collapsable-content">';
      panel_HTML +=        '<div class="row program-info-row"><h4>PROGRAM DETAILS</h4>';
      panel_HTML +=           '<div class="columns-10">';
      panel_HTML +=              '<p><span class="detail-title">Social Determinants :</span> '+ program.sdh +'</p>';
      panel_HTML +=              '<p><span class="detail-title">Target Population:</span> '+ program.target_pop +'</p>';
      panel_HTML +=              '<p><span class="detail-title">Program Setting:</span> '+ program.program_setting +'</p>';
      panel_HTML +=              '<p><span class="detail-title">Partners:</span> '+ program.partners +'</p>';
      panel_HTML +=              '<p><span class="detail-title">Active Program:</span> '+ program.active +'</p>';
      panel_HTML +=           '</div>';
      panel_HTML +=        '</div>';
      panel_HTML +=        '<div class="row program-info-row"><h4>HOSPITAL DETAILS</h4>';
      panel_HTML +=           '<div class="columns-10">';
      panel_HTML +=              '<p><span class="detail-title">Ownership:</span> '+ hospital.ownership +'</p>';
      panel_HTML +=              '<p><span class="detail-title">Population Size:</span> '+ hospital.pop_size   +'</p>';
      panel_HTML +=              '<p><span class="detail-title">Number of Beds:</span> '+ hospital.bed_size +'</p>';
      panel_HTML +=              '<p><span class="detail-title">Teaching Hospital:</span> '+ hospital.teaching_status +'</p>';
      panel_HTML +=              '<p><span class="detail-title">% Government Payer:</span> '+ hospital.percent_govt_payer +'</p>';
      panel_HTML +=              '<p><span class="detail-title">% Below FPL:</span> '+ hospital.percent_below_fpl +'</p>';
      panel_HTML +=              '<p><span class="detail-title">% Uninsured:</span> '+ hospital.percent_uninsured +'</p>';
      panel_HTML +=              '<p><span class="detail-title">Region:</span> '+ hospital.region +'</p>';
      panel_HTML +=           '</div>';
      panel_HTML +=        '</div>';
      panel_HTML +=        '<div class="program-info-row">' + program.description + '</div>';
      panel_HTML +=     '</div>';
      panel_HTML +=     '<div class="detail-nav detail-nav-bottom">';
      panel_HTML +=             '<div class="detail-nav-border">';
      panel_HTML +=                 '<a class="contact-button" id="expand-'+program.id+'-btn" href="mailto: ksusman@essentialhospitals.org, '+program.contact_email+'?Subject=Population Health Program Inquiry">Contact a Representative »</a>';
      panel_HTML +=                 '<div class="navigation-button collapse" id="expand-'+program.id+'" >';
      panel_HTML +=                      '<a class="button-text">EXPAND</a><svg  class="button-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 12"><defs><style>.cls-1 { fill: #0d97d4; } </style></defs><title>uparrow</title><path class="cls-1" d="M25,12,13.06,0,0,12H4.28l8.78-7.92L21.17,12Z"/></svg>';
      panel_HTML +=                 '</div>';
      panel_HTML +=            '</div>';
      panel_HTML +=     '</div>';
      panel_HTML += '</div>';
   }
 

 

   $('#detailPaneContent').html(panel_HTML);


   var panel_id = '#expand-' + prog_ids[0] + '-panel';
   var btn_id = '#expand-' + prog_ids[0];
   if(x == 1){
        $(panel_id).show();
        $(btn_id).hide();
   }else{
        $('.contact-button').css('opacity','0');
   }

   openDetails();


}

 
//Pans Map to center on hospitla marker - called after a program click.
function centerMapOnHospital(hosp_id){
   var lat = hospitals[hosp_id].latitude;
   var lng = hospitals[hosp_id].longitude;

   var center = new google.maps.LatLng(lat, lng);

   map.panTo(center);
   //map.setZoom(7);

}


function loadMarkers(){
   //create markers from hospital data json
   for (var hospital_id in hospitals){
      createMarker(hospitals[hospital_id]);
   }
}

//create icon object with SDH icons.
function createIcons(){
    for (var hospital_id in hospitals){
        var sdh = hospitals[hospital_id].sdh_slug;
        var active={};
        var inactive={};
        var iconObj ={};

        active.url = $dir + "/img/markers/" + sdh + "-active.png"; 
        active.scaledSize= activeSize;
        inactive.url = $dir+ "/img/markers/" + sdh + ".png"; 
        inactive.scaledSize= inactiveSize;

        iconObj.active = active;
        iconObj.inactive = inactive;

        icons[sdh] = iconObj;
       
   }
   
}




function loadPrograms() {
   //create programs from program data json
   for (var program_id in programs){

      createProgramCard(programs[program_id]);
   }
}


function resetFilters() {
 
   //clear all input fields
   $('#filterContainer input:checked').removeAttr('checked');

   //clear search box here
   $("input#program-search").val('');
   ProgramTextSearch('');


   //reset filters to show all
   $('#program-cards').mixItUp('filter','all');

   $('#filter-string p').html("Showing All Programs");


}


//Update active filters and display
function GetActiveString(){
    var active = [];
    $('#filterContainer input:checked').each(function() {
        var val = $(this).attr('data-valname');
        active.push(val);
    });
    var filtered = '';
    filtered = active.join(", ");


    if(filtered == ''){
        filtered = 'Showing All Programs';
    }
 
    return filtered;

}

 



function initMap() {
 
   var mapOptions = {
      zoom: 5,
      center: new google.maps.LatLng(40.5345952,-96.1902162),
      styles: mapStyles,
      animation: google.maps.Animation.DROP,
      streetViewControl: false,
 
   }

   

   map_document = document.getElementById('map');
   map = new google.maps.Map(map_document,mapOptions);

   var initialModalClose = map.addListener('click', function(){
      landingViewClose();
      google.maps.event.removeListener(initialModalClose);
   });



   createIcons();
   loadMarkers();
   loadPrograms();

   multiFilter.init();

   // Instantiate MixItUp
   $('#program-cards').mixItUp({
       controls: {
         enable: false // we won't be needing these
       },
       animation: {
         effects: 'fade',
         easing: 'ease',
         queueLimit: 3,
         duration: 200
       },
       callbacks: {
         onMixEnd: UpdateMarkers //Show or hide markers afer filtering Cards
       }
   });

}









//========================  GET DATA AND LOAD UP MAP    ====================================================

var programs;
var hospitals;

var prog_file = $dir + "/helpers/programs.json";
var hosp_file = $dir + "/helpers/hospitals.json";

var activeSize = new google.maps.Size(60, 67.68);
var inactiveSize = new google.maps.Size(40, 45.3);

$.getJSON(prog_file, function(data) {

    programs = data;

    $.getJSON(hosp_file, function(hosp_data) {

      hospitals = hosp_data;
      initMap(); //Everything is loaded - build map!

    });

});

//Handler for click on programs
$('#program-cards').on( "click", "li" , function(){

   //get ids from li element
   var prog_id = $(this).attr('id');
   var hosp_id = $(this).attr('data-hospid');
   prog_id = prog_id.substring(8, prog_id.length);
   hosp_id = hosp_id.substring(5, hosp_id.length);

   createDetailPanel(prog_id, hosp_id);
   setActiveMarker(hosp_id);
   centerMapOnHospital(hosp_id);


});

$('a#filterClear').on( "click" , resetFilters);
//$('#backButton').on( "click" , setActiveMarker(0));

$('#menuButton').click(function(){
  $('#menu-main_nav').toggleClass('open');
});



//Live Search Program Panel
$("input#program-search, input#landing-search").keyup(function(){
    // Retrieve the input field text and reset the count to zero
    var filter = $(this).val();
    ProgramTextSearch(filter);

});


function ProgramTextSearch(filter){
    $("input#program-search").val(filter);
    $('#filter-string p').html("Search Results: "+filter);
    // Loop through grid items
    $("#program-cards a").each(function(){

        // If the list item does not contain the text phrase fade it out
        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
            $(this).fadeOut(200, UpdateMarkers);


        // Show the list item if the phrase matches and increase the count by 1
        } else {
            $(this).fadeIn(200, UpdateMarkers);
        }
    });

}


//collpasable content
$('#detailPaneContent').on('click', '.navigation-button', function() {
 
    var id = $(this).attr('id');
    id = "#" + id;

    var panel_id = id + "-panel";
    var svg = id + " svg";
    var contact_btn = id + "-btn";
 
 
    $(panel_id).slideToggle(500, function () {
        //execute this after slideToggle is done
        //change text of header based on visibility of content div
        var visible =  $(panel_id).is(":visible");

        if(visible){
 
            $(contact_btn).css('opacity','1');
            $(id).children('.button-text').text("COLLAPSE");
            $(svg).css('transform','rotate(0deg)');

        }
        else{
            $(contact_btn ).css('opacity','0');
            $(id).children('.button-text').text("EXPAND");
            $(svg).css('transform','rotate(180deg)');
        }
 
    });
    return false;
});   
  


$('#landing-form').submit(function( event ) {
    event.preventDefault();
    landingViewClose()
}); 

$('.dropdown-trigger span').click(function( event ) {
    //event.preventDefault();
});


 



}); //END MAIN JQUERY READY
