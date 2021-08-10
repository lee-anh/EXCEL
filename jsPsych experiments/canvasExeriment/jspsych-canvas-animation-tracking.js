/**
 * jspsych-canvas-animation-tracking
 * Claire Liu
 * ball code adapted from https://medium.com/dev-compendium/creating-a-bouncing-ball-animation-using-javascript-and-canvas-1076a09482e0 
 * mouse tracking code adapted from https://www.kirupa.com/canvas/follow_mouse_cursor.htm
 * plugin for a canvas that supports animation and mouse tracking on the canvas
 * 
 */

jsPsych.plugins["canvas-animation-tracking"] = (function () {

  var plugin = {};


  // variables that can be set from the html file 
  plugin.info = {
    name: "canvas-animation-tracking",
    description: 'This plugin supports canvas animation and mouse tracking',
    parameters: {
      // canvas
      canvas_size: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Canvas size',
        default: [500, 500],
        description: 'Array containing the height (first value) and width (second value) of the canvas element.'
      },

      
      // ball velocity squared 
      ball_velocity_squared: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Ball velocity squared',
        default: 15,
        description: 'The squared velocity of how fast the ball should move'
      },

      // timing
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 180000,
        description: 'How long the trial should last in milliseconds.'
      },


      mouse_sampling_rate: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Mouse sampling rate',
        default: 50,
        description: 'How often to sample the mouse and ball locations, in frames per second'
      }


    }
  }



  plugin.trial = function (display_element, trial) {

    // VARIABLES   

    // stores the trial data to display at the end 
    var trial_data = {};


    // intitalize the canvas
    var new_html = '<div id="jspsych-canvas-keyboard-response-stimulus">' + '<canvas id="jspsych-canvas-stim" height="' + trial.canvas_size[0] + '" width="' + trial.canvas_size[1] + '"></canvas>' + '</div>';
    display_element.innerHTML = new_html;


    // canvas elements
    var canvas = document.querySelector("#jspsych-canvas-stim");
    var ctx = canvas.getContext('2d');

    // ball variables
    var ball;
    var velocity_squared = trial.ball_velocity_squared;
    var previousX = 30; 
    var previousY = 30; 

    // mouse variables 
    var canvas_pos = getPosition(canvas);
    var mouseX = 0;
    var mouseY = 0;

    // stimulus square calculations, assuming that canvas is a square 
    var canvas_center = canvas.width / 2;
    var square_radius = canvas.width / 8;

    // deal with the page getting resized or scrolled
    window.addEventListener("scroll", updatePosition, false);
    window.addEventListener("resize", updatePosition, false);

    // start time, recorded once at the beginning of the trial
    var start_time;

    // current time is updated throughout the experiment to determine when to end the experiment 
    var current_time;

    // how long the trial should last in milliseconds
    var duration = trial.trial_duration;

    // starting frame 
    var starting_frame;

    // how many times the animation has been refreshed, updated throughout trail 
    var number_of_refreshes;

    // arrays to keep track of mouse positions 
    var mouse_position_x = [];
    var mouse_position_y = [];


    // arrays to keep track of ball positions
    var ball_position_x = [];
    var ball_position_y = [];

 

    /**
     * updates the position of the mouse
     * @author kirpua <https://www.kirupa.com/canvas/follow_mouse_cursor.htm>
     */
    function updatePosition() {
      canvas_pos = getPosition(canvas);


    }

    /**
     * Helper function to get an element's exact position
     * @author kirpua <https://www.kirupa.com/canvas/follow_mouse_cursor.htm>
     * @param {HTMLCanvasElement} el the canvas to track on 
     */
    function getPosition(el) {

      var xPos = 0;
      var yPos = 0;


      while (el) {
        if (el.tagName == "BODY") {
          //  deal with browser quirks with body/window/document and page scroll
          var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
          var yScroll = el.scrollTop || document.documentElement.scrollTop;

          xPos += (el.offsetLeft - xScroll + el.clientLeft);
          yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
          //  for all other non-BODY elements
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



    /**
     * set the initial mouse position and draw the mouse tracker
     * @author kirpua <https://www.kirupa.com/canvas/follow_mouse_cursor.htm>
     * @param {EventListenerObject} e the mouse object 
     */
    function setMousePosition(e) {
      mouseX = e.clientX - canvas_pos.x;
      mouseY = e.clientY - canvas_pos.y;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 30, 0, 2 * Math.PI, true);
      ctx.fillStyle = "#FF6A6A";
      ctx.fill();
    }



    /**
     * Fisher-Yates Algorithm for shuffling arrays
     * @author community wiki <https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array>
     * @param {array} array array to shuffle 
     * @returns {array} shuffled array 
     */
    function shuffle(array) {
      var currentIndex = array.length, randomIndex;

      // While there remain elements to shuffle
      while (0 !== currentIndex) {

        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }

      return array;
    }



    /**
     * main function that runs the animation 
     */
    function show_visual_stimulus() {


      /**
       * runs once at the beginning, loads any data and kickstarts the loop 
       */
      function init() {
        

        // record the start time 
        start_time = Date.now();

        //start the mouse event listener 
        canvas.addEventListener("mousemove", setMousePosition, false);


        // generate random x and y components for the ball 
        var randomVelocityX = Math.random() * (Math.sqrt(velocity_squared) - 3) + 3; // chose 3 because it is larger than 2.739, which is √30/2
        var randomVelocityY = Math.sqrt(velocity_squared - Math.pow(randomVelocityX, 2));
        // console.log("x: " + randomVelocityX + ", y: " + randomVelocityY);

        // starting objects for the ball 
        ball = {
          bounce: 1, //  energy lost on bounce (0%), for bounce choose between 0 and 1
          radius: 30,
          x: 30,
          y: 30,
          velX: (randomVelocityX),
          velY: (randomVelocityY)
        }

        // begin update loop
        last_marker = window.requestAnimationFrame(update) + 1;
        starting_frame = last_marker;
      }



      /**
       * Draws elements to the canvas 
       */
      function draw() {

        // clear the canvas
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
        // mouse tracker shows red, but if it is in contact with the ball, then it shows as green. 
        ctx.fillStyle = "red";
        var err_allowed = ball.radius * 2;
        if (mouseX - ball.x <= err_allowed && mouseX - ball.x >= -err_allowed && mouseY - ball.y <= err_allowed && mouseY - ball.y >= -err_allowed) {
          ctx.fillStyle = "green";
        }

        // rectangular mouse tracker
        ctx.fillRect(mouseX - 30, mouseY - 30, 60, 60);


        // center square 
        ctx.fillStyle = '#cccccc';
        
        // draw the center square 
        ctx.fillRect(canvas_center - square_radius, canvas_center - square_radius, square_radius * 2, square_radius * 2);



      }


      /**
       * Main helper function, includes time control for events and ball/border calculations 
       * @authors Claire Liu and Code Draken <https://medium.com/dev-compendium/creating-a-bouncing-ball-animation-using-javascript-and-canvas-1076a09482e0>
       * @returns trial data when it is time to end the trial 
       */
      function update() {
        // record the current time 
        current_time = Date.now();


        // check for end of trial 
        if (current_time - start_time > duration) {
          //clear the html display 
          display_element.innerHTML = "";
          ctx = null;

          //window.cancelAnimationFrame(update); 

          // write trial data 
          
         // calculate error
         let mouse_string = ''; 
         for (let i = 0; i < mouse_position_x.length; i++) {
           mouse_string += Math.sqrt((mouse_position_x[i] - ball_position_x[i]) ** 2 + (mouse_position_y[i] - ball_position_y[i]) ** 2) + ' ';
         }
          trial_data.my_time = current_time - start_time;
          trial_data.total_number_of_refreshes = number_of_refreshes - starting_frame;
          trial_data.mouse_error = mouse_string;


          // display trial data 
          jsPsych.finishTrial(trial_data);

          return;

        }

        // queue the next update
        number_of_refreshes = window.requestAnimationFrame(update);

        // record mouse and positions
        if (number_of_refreshes % trial.mouse_sampling_rate == 0) {
          mouse_position_x.push(mouseX);
          mouse_position_y.push(mouseY);
          ball_position_x.push(Math.round(ball.x));
          ball_position_y.push(Math.round(ball.y));
        }


        // BOUNDARY LOGIC 
        // bottom bound / top of stimulus box 
        if (ball.y + ball.radius >= canvas.height) {

          // new X velocity
          ball.velX = Math.random() * (Math.sqrt(velocity_squared) - 3) + 3;
          if (Math.random() < 0.5) {
            ball.velX *= -1;
          }

          // must have a negative Y velocity
          ball.velY = -(Math.sqrt(velocity_squared - Math.pow(ball.velX, 2)));
          ball.y = canvas.height - ball.radius; // moves ball to correct position to prevent unnecessary bounces

        }

        // top bound / bottom of sitmulus box
        if ((ball.y - ball.radius <= 0)) {
          // new X velocity
          ball.velX = Math.random() * (Math.sqrt(velocity_squared) - 3) + 3;
          if (Math.random() < 0.5) {
            ball.velX *= -1;
          }
          // must have a postive Y velocity
          ball.velY = Math.sqrt(velocity_squared - Math.pow(ball.velX, 2));

          ball.y = ball.radius; // moves ball to correct position to prevent weird bouncing
        }

        // left bound / right of stimulus box 
        if (ball.x - ball.radius <= 0) {
          // new Y velocity 

          ball.velY = Math.random() * (Math.sqrt(velocity_squared) - 3) + 3;
          if (Math.random() < 0.5) {
            ball.velY *= -1;
          }
          // must have a positve X velocity
          ball.velX = Math.sqrt(velocity_squared - Math.pow(ball.velY, 2));

          ball.x = ball.radius;
        }

        // right bound / left of stimulus box 
        if (ball.x + ball.radius >= canvas.width) {


          // new Y velocity
          ball.velY = Math.random() * (Math.sqrt(velocity_squared) - 3) + 3;
          if (Math.random() < 0.5) {
            ball.velY *= -1;
          }

          // must have a negative X velocity
          ball.velX = -(Math.sqrt(velocity_squared - Math.pow(ball.velY, 2)));

          ball.x = canvas.width - ball.radius; // moves ball to correct position to prevent unnecessary bounces
        }


        // if ball is going to touch/cross over the center stimulus square
        if ((ball.y - ball.radius <= canvas_center + square_radius && ball.y + ball.radius >= canvas_center - square_radius)
          && (ball.x - ball.radius <= canvas_center + square_radius && ball.x + ball.radius >= canvas_center - square_radius)) {


          // calculate new velocities 
          // Math.random() * (max - min) + min
          ball.velY = Math.random() * (Math.sqrt(velocity_squared) - 0.5) + 0.5;
          ball.velX = Math.sqrt(velocity_squared - Math.pow(ball.velY, 2)); // Use pythogorean's thm √velocity^2 - y^2



          if(previousY <= canvas_center - square_radius){
            //top boundary
            ball.velY *= -1; 
            if(Math.random() < 0.5){
              ball.velX *= -1;
            }

            ball.y = canvas_center - square_radius - ball.radius; // moves ball to correct position to prevent unnecessary bounces

            //console.log("top")
          } else if(previousY >= canvas_center + square_radius){
            //bottom boundary
            if(Math.random() < 0.5){
              ball.velX *= -1;
            }

            ball.y = canvas_center + square_radius + ball.radius; // moves ball to correct position to prevent unnecessary bounces

          } else if(previousX <= canvas_center - square_radius){
            // box left boundary
            ball.velX *= -1; 
            if(Math.random() < 0.5){
              ball.velY *= -1; 
            }

            ball.x = canvas_center - square_radius - ball.radius; // moves ball to correct position to prevent unnecessary bounces


          } else if(previousX >= canvas_center + square_radius){
            // box right boundary
            if(Math.random() < 0.5){
              ball.velY *= -1; 
            }
            
            ball.x = canvas_center + square_radius + ball.radius; // moves ball to correct position to prevent unnecessary bounces


          }
        



        }



        // reset insignificant amounts to 0
        if (ball.velX < 0.01 && ball.velX > -0.01) {
          ball.velX = 0;
        }
        if (ball.velY < 0.01 && ball.velY > -0.01) {
          ball.velY = 0;
        }

        // update ball position
        ball.x += ball.velX;
        ball.y += ball.velY;

        // update previously stored 
        previousX = ball.x;
        previousY = ball.y;

        // draw after logic/calculations
        draw()
      }

      // start the code once the page has loaded
      init();

    }

    // call show_visual_stimlus to start the trial 
    show_visual_stimulus();

  };

  return plugin;
})();
