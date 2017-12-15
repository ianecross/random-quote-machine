
$( document ).ready( function() {



var $winW = $(window).width(),
    $winH = $(window).height(),
    $lineColors = [],
    $numLines = 3,
    // Bootstrap breakpoints
    $xsScreen = 576,
    $sScreen = 768,
    $mScreen = 992,
    $lScreen = 1200;

/*** SOCIAL SHARE POPUP WINDOW ***/

function windowPopup(url, width, height) {
  // Calculate the position of the popup so
  // it’s centered on the screen.
  var left = (screen.width / 2) - (width / 2),
      top = (screen.height / 2) - (height / 2);

  window.open(
    url,
    "",
    "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
  );
}
// map array to x, y coords
var bezierLine = d3.line()
              .x(function(d) { return d[0]; })
              .y(function(d) { return d[1]; })
              .curve(d3.curveBasis); // smooth line

function resetMachine() {      
      $brainIndex = 0;
      $colorIndex = 0;
      $lineColors = [];
      clearInterval($brainFlashInter);
      $("#linesContainer svg").find("path").remove();
      $("#brainContainer svg").find(".path").remove();
      $svgBrain.select("path#outer").style("fill", "#EAE3D5");
      $("#author").text("").removeClass("blockquote-footer");
      $("#quote").text("");
}

/******* BRAIN ANIMATION ******/
var $svgBrain = d3.select("#brain");

var $brainFlashInter;

function brainFlash() {
  
  var $index = 0;
  var t = d3.transition()
      .duration(750)
      .ease(d3.easeLinear);
  
  $brainFlashInter = setInterval(function() {       
    
    $svgBrain.select("path#outer").transition(t).style("fill", $lineColors[$index]);
    if ( $index == $lineColors.length-1 ) { $index = 0; } else { $index++; }
  }, 500);
} 

var $brainStepInterval;
var $brainIndex = 0;
var $colorIndex = 0;
var $arrBrain = ["M207.507,198.802h-68.105c0,0-16.396,0.302-16.763-16.237c-0.358-16.162,16.163-16.162,16.163-16.162h72c0,0,13.253-3.847,13.6-17.399c0.393-15.371-16.2-15.8-16.2-15.8H157.75h-2.25", "M211.023,166.002h53.178c0,0,16.199-1,16.199-16.387V147.5", "M266.75,166.002H317c0,0,16-2.252,16-16.387c0-13.115-12.419-15.983-12.419-15.983", "M335.867,148.5c0,0,16.133,0,16.133-17.5c0-14.75-16.133-14.75-16.133-14.75", "M147.432,146.5c0,0-16.432,0-16.432-15.75c0-16.875,16.432-17,16.432-17H159h9.5h6", "M194.602,80.75h-21.084c0,0-16.768,1-16.768,16c0,14.627,14.25,17,14.25,17h40.023h10.227", "M252,139.25h1.691h53.059c0,0,14.349-1.773,15.25-17.25c0.621-10.661-11.25-15.5-11.25-15.5", "M205,97.569c0,0,0.5,16.181,14.5,16.181c18.813,0,75.25,0,75.25,0s15.75,0,15.75-16.5c0-15.25-15-16.5-15-16.5h-52", "M223,94.75c0,0,18,0,18-17.25c0-16.043-16.205-16.043-16.205-16.043H223"];

function animateBrain( $totDur ) { // totDur so brain and text anima finish together

      var $indivDur =  Math.round( $totDur / $arrBrain.length );

      $svgBrain.append('path')
        .attr( "d", $arrBrain[$brainIndex] ) 
        .attr( "class", "path")
        .attr( "stroke", $lineColors[$colorIndex] )
        .attr( "stroke-width", 9 )
        .attr("fill", "none")
        .transition()
        .duration( $indivDur )
        .attrTween("stroke-dasharray", function() {
        var len = this.getTotalLength();
        return function(t) { return ( d3.interpolateString( "0," + len, len + ",0" ))( t ) };
      });  

      $brainIndex++;
      $colorIndex++;

      if ( $colorIndex == 3 ) { $colorIndex = 0; } //iterate thru line color array and repeat when end is reached
      if ( $brainIndex == $arrBrain.length ) {
        
          clearInterval($brainStepInterval);
          //brainFlash();
   
      } else {
          clearInterval($brainStepInterval);
        
          $brainStepInterval = setInterval(function() {       
            animateBrain($totDur);
          }, $indivDur );
        }   
        
}

//animateBrain( 2000 );

/************* LINE GENERATOR **************/

if( $winW < 768 ) {
  
}
var $linesContainer = $("#linesContainer"),
    $linesContainerH = $linesContainer.height(),
    $linesContainerW = $linesContainer.width(),
    $startY = $linesContainer.position().top + $linesContainer.outerHeight(true),
    $startX = $linesContainerW / 2,
    //var $startY = $winH - 100;
    $lineW = 20, 
    $wavyOffset = 1;
    if ( $mScreen > $winW ) { $wavyOffset = 4; } // to keep line straight bat root
// gens random hex color
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// populate 2d array with x, y coords. Random gen X coords to create vertical wavy line 
function createLine(width, height){ // width = no. x,y ( height ) pairs to draw line.

  var result = [];    
  var $numFrom = 0;
  var $numTo = 10;
  var $incrementX = 15;
  var $incrementY =  $startY / width;


  for (var i = 0 ; i < width; i++) {
    result[i] = [];

    for (var j = 0; j < height; j++) {


      if ( j == 0) { //x

        if ( i > $wavyOffset ) { // make line wavy
          
          if ( $mScreen > $winW ) {
            
            $numFrom = 0;
            $numTo = 100; 
            
            if ( Math.floor(Math.random() * 2 ) == 0 ) {
              result[i][j] = $startX + Math.floor((Math.random() *($numTo)) + ($numFrom));
            } else {
              result[i][j] = $startX + ( 
                -1 * 
                ( 
                  Math.floor((Math.random() *($numTo)) + ($numFrom))
                ) 
              );
            } // end if
            
          } else { // if winW > 992
            
            if ( Math.floor(Math.random() * 2 ) == 0 || i == width - 1 ) {
              result[i][j] = $startX + Math.floor((Math.random() *($numTo += $incrementX)) + ($numFrom += $incrementX));
            } else {
              result[i][j] = $startX + ( 
                -1 * 
                ( 
                  Math.floor((Math.random() *($numTo += $incrementX)) + ($numFrom += $incrementX))
                ) 
              );
            }  // end if                      
          } // end if
        } else { // keep line straight
         
          result[i][j] = $startX;
        }      
        
      } else {
        if ( i != 0 ) { 
          result[i][j] = result[i-1][j] - $incrementY;
        } else {
          result[i][j] = $startY;
        }       
      } // if
    } // for
  }
  return result;
}

// create svg
var $svgLines = d3.select("#linesContainer")
              .append("svg")
              .attr("width", $linesContainerW)
              .attr("height", $linesContainerH);

// create line path animation based on passed coords
function createLines() {

  // Create a new line 9 sets of x, y coordinates at $startPoints
  for ( var i=0; i < $numLines; i++ ) {
    
    //console.log("startx["+i+"]="+$startX);
    
    var $outlinePosX = -10; // outline coords
    var $dur = Math.floor(Math.random() * 4000) + 2000;
    var $line = createLine( 9, 2 );
    $lineColors.push( getRandomColor() );
    
    $svgLines.append('path')
    //.attr("d", bezierLine([[0, 40], [25, 70], [50, 100], [100, 50], [150, 20], [200, 130], [300, 120]]))
      .attr( "d", bezierLine( $line ) ) 
      .attr( "stroke", $lineColors[i] )
      .attr( "stroke-width", $lineW )
      .attr("fill", "none")
      .transition()
      .duration( $dur )
      .attrTween("stroke-dasharray", function() {
      var len = this.getTotalLength();
      return function(t) { return ( d3.interpolateString( "0," + len, len + ",0" ))( t ) };
    });

    // update x coordinates for both outlines
    for ( var x=0; x < 2;x++ ) {

      var $outline = $line.map( function( width ) {
        return width.map( function( height, index ) { 
          if ( index == 0) {
            return height + $outlinePosX; 
          }
          return height; 
        } );
      } );

      $svgLines.append('path')
      //.attr("d", bezierLine([[0, 40], [25, 70], [50, 100], [100, 50], [150, 20], [200, 130], [300, 120]]))
        .attr("d", bezierLine( $outline )) 
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .transition()
        .duration( 100 )
        .attrTween("stroke-dasharray", function() {
        var len = this.getTotalLength();
        return function(t) { return (d3.interpolateString("0," + len, len + ",0"))(t) };
      });
      $outlinePosX = 10;
    } // for    
  } // for
} // func


/************* QUOTE GENERATOR **************/

//http://forismatic.com
var currentQuote = -1;
var quoteBank = new Array;

// RETRIEVE & DISPLAY API RESPONSE //

function handleData(data, isNew) {
  
    $("#newQuote img").addClass("spin");
   

    resetMachine();
    createLines();
  
    var quoteText = data.quoteText.trim(),
        quoteAuthor = data.quoteAuthor.trim(),
        quoteUrl = data.quoteLink.trim(),
        shareUrl = "https://codepen.io/ianxdev3/full/QOYrRV/",
        shareTitle = "Random Quote Generator",
        shareText = quoteText + " " + quoteAuthor,
        
        tweetUrl = "https://twitter.com/intent/tweet?url=" + shareUrl + "&text=" + shareText + "&hashtags=FreeCodeCamp, RandomQuoteGenerator" + "&via=ianxdeveloper",    
        facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=" + quoteUrl,       
        linkedinUrl = "http://www.linkedin.com/shareArticle?mini=true&url=" + shareUrl + "&title=" + shareTitle + "&summary=" + shareText + "&source=" + quoteUrl;
    //wikiUrl = 'https://en.wikipedia.org/wiki/' + data.quoteAuthor.trim().replace(/\s/g, '_');
    var arrQuote = quoteText.split('');

    var sentence = '\" ';
    var index = 0;
    
    var t1 = setTimeout( function() { // wait for lines to complete
      var intervalId = setInterval(function() {
        //console.log(index++);
        /**/
        sentence += arrQuote[index];
        $('#quote').text(sentence + " \"");
        index++;

        if (index == arrQuote.length) {
          $("#author").html( quoteAuthor ).addClass("blockquote-footer");
          clearInterval(intervalId);
          $("#newQuote img").removeClass("spin");
          brainFlash();
        }

      }, 50);  

     animateBrain( arrQuote.length * 50 ); // pass total length of text anima
    }, 4000);

    //$("#quote").html( "\""+quoteText+"\"" );
    //$("#author").html( quoteAuthor );
    $("#linkedin").attr( "href", linkedinUrl );
    $("#facebook").attr( "href", facebookUrl );
    $("#twitter").attr( "href", tweetUrl );
  
    if ( isNew ) { 
     
      if ( quoteBank.length-1 === currentQuote ) {
          quoteBank.push( { "quoteText": quoteText, "quoteAuthor": quoteAuthor, "quoteLink": quoteUrl } );
          currentQuote++;
      } else {
          quoteBank.splice(currentQuote, 0, { "quoteText": quoteText, "quoteAuthor": quoteAuthor, "quoteLink": quoteUrl } );
      }
    }
}

function handleErr(jqxhr, textStatus, err) {
  alert("Request Failed: " + textStatus + ", " + err);
  alert('Error: ' + err.status + ' (' + err.statusText + '). ' + 'Please try again later.');
}

function fetchNewQuote() {
    $.ajax({
      url: "https://api.forismatic.com/api/1.0/",
      jsonp: "jsonp",
      dataType: "jsonp",
      data: {
        method: "getQuote",
        lang: "en",
        format: "jsonp"
      }
    })
    .done(function(data) {
    
      handleData(data, true);
      //resetMachine();
      //createLines();
    })
    .fail(handleErr);
}

fetchNewQuote(); // INI QUOTE


/************** CONTROLS ***************/

$("#newQuote").click(function() { // NEW QUOTE
  fetchNewQuote();
});

$("#prevQuote").click(function() {
  if ( currentQuote > 0 ) {
    currentQuote--;
    handleData(quoteBank[currentQuote], false);
    console.log("prev="+quoteBank[currentQuote].quoteText);
  }
});

$("#nextQuote").click(function() {
  if ( currentQuote < quoteBank.length-1 ) {
    currentQuote++;
    handleData(quoteBank[currentQuote], false);
  }
});

$(".js-social-share").on("click", function(e) {
  e.preventDefault();
  
  if ( currentQuote !== -1 ) {
    windowPopup($(this).attr("href"), 500, 300);
  }
});

});