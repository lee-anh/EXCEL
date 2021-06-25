/**
 * jspsych-canvas-animation
 * Claire Liu
 * ball code adapted from https://medium.com/dev-compendium/creating-a-bouncing-ball-animation-using-javascript-and-canvas-1076a09482e0 
 * mouse tracking code adapted from https://www.kirupa.com/canvas/follow_mouse_cursor.htm
 * plugin for a canvas that supports animation on the canvas
 * 
 */

jsPsych.plugins["canvas-animation-tracking"] = (function () {

  var plugin = {};


  plugin.info = {
    name: "canvas-animation-tracking",
    description: '',
    parameters: {
      //canvas
      main_stimulus: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Main Stimulus',
        default: undefined,
        description: 'The drawing function to apply to the canvas. Should take the canvas object as argument.'
      },

      canvas_size: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Canvas size',
        default: [500, 500],
        description: 'Array containing the height (first value) and width (second value) of the canvas element.'
      },

      //keyboard choices 
      choices: {
        type: jsPsych.plugins.parameterType.KEY,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },

      //timing
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },

      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      }
    }
  }



  plugin.trial = function (display_element, trial) {

    var trial_data = {};

    var startTime;
    var duration = 10000; // 10 seconds.
    var currentTime;
    var number_of_refreshes; 
    var mousePosition = [];
    var ballPosition = [];
    

    var stimulus 
    var new_html = '<div id="jspsych-canvas-keyboard-response-stimulus">' + '<canvas id="jspsych-canvas-stim" height="' + trial.canvas_size[0] + '" width="' + trial.canvas_size[1] + '"></canvas>' + '</div>';
    //var new_html = '<canvas id="jspsych-canvas-stim" height="' + trial.canvas_size[0] + '" width="' + trial.canvas_size[1] + '"></canvas>';


    //initialize the canvas 
    display_element.innerHTML = new_html;

    //canvas elements
    var canvas = document.querySelector("#jspsych-canvas-stim");
    var ctx = canvas.getContext('2d');

    //ball variables
    //var gravity; 
    var ball;
    //starting ball velocity
    var velocitySquared = 25;
    //var friction; 


    //mouse variables 
    var canvasPos = getPosition(canvas);
    var mouseX = 0;
    var mouseY = 0;

    ///stimulus square calculations, assuming that canvas is a square 
    var canvas_center = canvas.width / 2;
    var square_radius = canvas.width / 8;



    // deal with the page getting resized or scrolled
    window.addEventListener("scroll", updatePosition, false);
    window.addEventListener("resize", updatePosition, false);

    function updatePosition() {
      canvasPos = getPosition(canvas);
    }

    // Helper function to get an element's exact position
    function getPosition(el) {
      var xPos = 0;
      var yPos = 0;

      while (el) {
        if (el.tagName == "BODY") {
          // deal with browser quirks with body/window/document and page scroll
          var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
          var yScroll = el.scrollTop || document.documentElement.scrollTop;

          xPos += (el.offsetLeft - xScroll + el.clientLeft);
          yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
          // for all other non-BODY elements
          xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
          yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
      }
      return {
        x: xPos,
        y: yPos
      };
    }



    function setMousePosition(e) {
      mouseX = e.clientX - canvasPos.x;
      mouseY = e.clientY - canvasPos.y;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 30, 0, 2 * Math.PI, true);
      ctx.fillStyle = "#FF6A6A";
      ctx.fill();
    }


    function show_visual_stimulus() {



      console.log("show_visual_stimulus called");

      // runs once at the beginning
      // loads any data and kickstarts the loop
      function init() {
        startTime = Date.now();
        console.log("start time: " + startTime);

        canvas.addEventListener("mousemove", setMousePosition, false);
        console.log("init called");

        //generate random x and y components 
        var randomVelocityX = Math.random() * (Math.sqrt(velocitySquared) - 3) + 3; //chose 3 because it is larger than 2.739, which is √30/2
        var randomVelocityY = Math.sqrt(velocitySquared - Math.pow(randomVelocityX, 2));
        console.log("x: " + randomVelocityX + ", y: " + randomVelocityY);

        // starting objects
        ball = {
          bounce: 1, // energy lost on bounce (0%), for bounce choose between 0 and 1
          radius: 30,
          x: 30,
          y: 30,
          velX: (randomVelocityX), //||-1), //not sure what the -1 is there for
          velY: (randomVelocityY) //||-1) 
        }

        // begin update loop
        window.requestAnimationFrame(update)
      }


      //draws elements to the canvas 
      function draw() {

        //clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);



        // draw the ball (only object in this scene)
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(
          ball.x, ball.y,
          ball.radius,
          0, Math.PI * 2
        )
        ctx.fill();


        // mouse tracker
        //ctx.beginPath();

        //mouse tracker shows red, but if it is in contact with the ball, then it shows as green. 
        ctx.fillStyle = "red";
        var err_allowed = ball.radius * 2;
        if (mouseX - ball.x <= err_allowed && mouseX - ball.x >= -err_allowed && mouseY - ball.y <= err_allowed && mouseY - ball.y >= -err_allowed) {
          ctx.fillStyle = "green";
        }

        //rectangular mouse tracker
        ctx.fillRect(mouseX - 30, mouseY - 30, 60, 60);

        //circular mouse tracker
        //ctx.arc(mouseX, mouseY, 30, 0, 2 * Math.PI, true);
        //ctx.fill();

        ctx.fillStyle = 'gray';

        /*
        currentTime = Date.now();
        if (currentTime - startTime > duration) {
          console.log("time to end");
          ctx.fillStyle = 'blue';
          //html display is cleared 
          //display_element.innerHTML = "";
          

          //more on to the next trial 
         // jsPsych.finishTrial(trial_data)
        }
        */


        //ctx.fillStyle = 'gray';
        ctx.fillRect(canvas_center - square_radius, canvas_center - square_radius, square_radius * 2, square_radius * 2);




      }

      //MAIN LOOP 
      function update() {
        currentTime = Date.now();



        if (currentTime - startTime > duration) {
          console.log("time to end");
          console.log("Loop Duration: "  + (currentTime - startTime));
          display_element.innerHTML = "";

          ctx = null; 
          trial_data.mouse = JSON.stringify(mousePosition);
          trial_data.mouse_length = mousePosition.length;
          trial_data.ball = JSON.stringify(ballPosition);
          trial_data.ball_length = ballPosition.length;

          trial_data.number_of_refreshes = number_of_refreshes;
          
          jsPsych.finishTrial(trial_data); 

          return;
         
         
        }
        
     

        /*
        //timing based on real time 
        //try switching the order
        if((currentTime - startTime) % 200 < 15){
          mousePosition.push(mouseX);
          ballPosition.push(ball.x); 
        }
        */
        

        //CAREFUL: SHOULD THIS GO BEFORE OR AFTER?
        //timing is based on refresh rate. approx every 200 ms 
        if(number_of_refreshes % 12 == 0){
          mousePosition.push(mouseX);
          ballPosition.push(ball.x); 
        }
        


        //queue the next update
        number_of_refreshes =  window.requestAnimationFrame(update);

        
        

        //BOUNDARY LOGIC 
        //bottom bound / top of stimulus box 
        if (ball.y + ball.radius >= canvas.height) {

          //new X velocity
          ball.velX = Math.random() * (Math.sqrt(velocitySquared) - 3) + 3;
          if (Math.random() < 0.5) {
            ball.velX *= -1;
          }

          //must have a negative Y velocity
          ball.velY = -(Math.sqrt(velocitySquared - Math.pow(ball.velX, 2)));
          ball.y = canvas.height - ball.radius; //moves ball to correct position to prevent multiple refreshes 

        }

        //top bound / bottom of sitmulus box
        if ((ball.y - ball.radius <= 0)) {
          //new X velocity
          ball.velX = Math.random() * (Math.sqrt(velocitySquared) - 3) + 3;
          if (Math.random() < 0.5) {
            ball.velX *= -1;
          }
          //must have a postive Y velocity
          ball.velY = Math.sqrt(velocitySquared - Math.pow(ball.velX, 2));


          ball.y = ball.radius; //moves ball to correct position to prevent multiple refreshes 
        }

        //left bound / right of stimulus box 
        if (ball.x - ball.radius <= 0) {
          //new Y velocity 

          ball.velY = Math.random() * (Math.sqrt(velocitySquared) - 3) + 3;
          if (Math.random() < 0.5) {
            ball.velY *= -1;
          }
          //must have a positve X velocity
          ball.velX = Math.sqrt(velocitySquared - Math.pow(ball.velY, 2));

          ball.x = ball.radius;
        }

        //right bound / left of stimulus box 
        if (ball.x + ball.radius >= canvas.width) {


          //new Y velocity
          ball.velY = Math.random() * (Math.sqrt(velocitySquared) - 3) + 3;
          if (Math.random() < 0.5) {
            ball.velY *= -1;
          }

          //must have a negative X velocity
          ball.velX = -(Math.sqrt(velocitySquared - Math.pow(ball.velY, 2)));

          ball.x = canvas.width - ball.radius;
        }






        //if ball is going to touch/cross over the stimulus square
        if ((ball.y - ball.radius <= canvas_center + square_radius && ball.y + ball.radius >= canvas_center - square_radius)
          && (ball.x - ball.radius <= canvas_center + square_radius && ball.x + ball.radius >= canvas_center - square_radius)) {
          //console.log("PING")



          //calculate new velocities 
          ball.velY = Math.random() * (Math.sqrt(velocitySquared) - 3) + 3;
          ball.velX = Math.sqrt(velocitySquared - Math.pow(ball.velY, 2));



          //if it hits to top half of the stimulus square, the y velocity should be negative
          if (ball.y + ball.radius <= canvas_center + square_radius * Math.sqrt(2)) {
            //down ways 
            ball.velY *= -1;
          }

          //if it hits the bottom half of the stimulus square, the x velocity should be negative 
          if (ball.x + ball.radius <= canvas_center + square_radius * Math.sqrt(2)) {
            ball.velX *= -1;
          }


        }

        // reset insignificant amounts to 0
        if (ball.velX < 0.01 && ball.velX > -0.01) {
          ball.velX = 0;
        }
        if (ball.velY < 0.01 && ball.velY > -0.01) {
          ball.velY = 0;
        }

        // add gravity
        //ball.velY += gravity;

        // update ball position
        ball.x += ball.velX;
        ball.y += ball.velY;

        //update previously stored 
        previousX = ball.x;
        previousY = ball.y;

        // draw after logic/calculations
        draw()
      }

      // start our code once the page has loaded
      init();

    }

    show_visual_stimulus();



    // end trial
    //jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
