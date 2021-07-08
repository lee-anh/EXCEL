/**
 * jspsych-canvas-animation
 * Claire Liu
 * ball code adapted from https://medium.com/dev-compendium/creating-a-bouncing-ball-animation-using-javascript-and-canvas-1076a09482e0 
 * mouse tracking code adapted from https://www.kirupa.com/canvas/follow_mouse_cursor.htm
 * plugin for a canvas that supports animation and mouse tracking on the canvas
 * 
 */

jsPsych.plugins["canvas-animation-tracking"] = (function () {

  var plugin = {};


  plugin.info = {
    name: "canvas-animation-tracking",
    description: '',
    parameters: {
      //canvas
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
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 180000,
        description: 'How long the trial should last in milliseconds.'
      },

      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: 30,
        description: 'How long the stimulus should be shown in frames per second.'
      },

      //stimlus max response time 
      //feedback_duration
      

      num_sub_trials: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Number of Sub Trials',
        default: 8,
        description: 'How many of each subtrial to show'
      }
    }
  }



  plugin.trial = function (display_element, trial) {

    var trial_data = {};

    var startTime;
    var duration = 180000; // 180 seconds, 3 minutes 
    var currentTime;
    var number_of_refreshes;
    var mousePosition = [];
    var mousePositionY = [];
    var ballPosition = [];
    var ballPositionY = [];
    var keys_pressed = [];
    var rt = [];
    var accuracy = []; 
    var after_response_called = false;

    var keyboardListener = {};

    var stimulus = [];
    var isStimulus = false;
    var lastMarker = 2;
    var is_correct = false;
    var sub_trial_start_frame = 2;
    var sub_trial_end_frame = 2;

    var counter = 0;
    var sub_trial_counter = 0;
    var current_trial_number = 0;
    var is_rt = true;



    //BE CAREFUL DEPENDING ON HOW MANY SUB STIMULI ARE CHOSEN 
    //Adds up to 143 seconds, which should keep the total time under 180 seconds
    var delay_durations = [12, 7, 6, 15, 10, 7, 9, 8, 6, 14, 7, 12, 7, 9, 6, 8]; // maximum 16 trials 

    var new_html = '<div id="jspsych-canvas-keyboard-response-stimulus">' + '<canvas id="jspsych-canvas-stim" height="' + trial.canvas_size[0] + '" width="' + trial.canvas_size[1] + '"></canvas>' + '</div>';



    //initialize the canvas 
    display_element.innerHTML = new_html;

    //canvas elements
    var canvas = document.querySelector("#jspsych-canvas-stim");
    var ctx = canvas.getContext('2d');

    //ball variables

    var ball;
    //starting ball velocity
    var velocitySquared = 25;

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



    //set the initial mouse boptioin and draw the mouse tracker 
    function setMousePosition(e) {
      mouseX = e.clientX - canvasPos.x;
      mouseY = e.clientY - canvasPos.y;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 30, 0, 2 * Math.PI, true);
      ctx.fillStyle = "#FF6A6A";
      ctx.fill();
    }

    //Fisher-Yates Algorithm for shuffling arrays, taken from a stack overflow post
    function shuffle(array) {
      var currentIndex = array.length, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }

      return array;
    }

    function after_response(response_info) {
      after_response_called = true;
      console.log("after response called");
      sub_trial_end_frame = number_of_refreshes;

      //feedback time
      lastMarker = number_of_refreshes + 30; //0.5 second feedback time 
      sub_trial_counter = 0; //time for the delay 

      if (typeof response_info == 'undefined') {
        keys_pressed.push('null');
        console.log("Sub-trial counter: " + current_trial_number + " Stimulus: " + stimulus[current_trial_number - 1] + ", response: null");
        
        //calculate and record null reponse time 
        rt.push("null");

      } else {
        keys_pressed.push(response_info.key);
        console.log("Sub-trial counter: " + current_trial_number + " Stimulus: " + stimulus[current_trial_number - 1] + ", response: " + response_info.key);
        
        //calculate and record response time 
        rt.push(sub_trial_end_frame - sub_trial_start_frame)
      }

    
      //check for correct response 
      if(typeof response_info == 'undefined'){
        is_correct = false;
        console.log("Wrong :(");
        accuracy.push("miss"); 
      } else if (stimulus[current_trial_number - 1] == response_info.key) {
        is_correct = true;
        console.log("Correct!");
        accuracy.push("true")
      } else {
        is_correct = false;
        console.log("Wrong :(");
        accuracy.push("false"); 
      }

      // kill keyboard listeners
      if (typeof keyboardListener != 'undefined') {
        console.log("keyboard listener killed");
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }


    }





    function show_visual_stimulus() {



      console.log("show_visual_stimulus called");

      // runs once at the beginning
      // loads any data and kickstarts the loop
      function init() {

        //set up stimulus 
        for (let i = 0; i < trial.num_sub_trials; i++) {
          stimulus.push('u');
          stimulus.push('d');
        }

        //shuffle stimulus and delay durations 
        shuffle(stimulus);
        console.log("Stimulus order: " + stimulus); 
        shuffle(delay_durations);

        for (let i = 0; i < delay_durations.length; i++) {

          //convert delay durations to fps, assuming 60 fps
          delay_durations[i] = Math.ceil(delay_durations[i] * 60);


        }

        startTime = Date.now();
        console.log("start time: " + startTime);

        canvas.addEventListener("mousemove", setMousePosition, false);
        console.log("init called");

        //generate random x and y components 
        var randomVelocityX = Math.random() * (Math.sqrt(velocitySquared) - 3) + 3; //chose 3 because it is larger than 2.739, which is √30/2
        var randomVelocityY = Math.sqrt(velocitySquared - Math.pow(randomVelocityX, 2));
        //console.log("x: " + randomVelocityX + ", y: " + randomVelocityY);

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
        if (after_response_called == true) {
          if (is_correct == true) {
            ctx.fillStyle = 'green';
          } else {
            ctx.fillStyle = 'red';
          }
        }

        //draw the center square 
        ctx.fillRect(canvas_center - square_radius, canvas_center - square_radius, square_radius * 2, square_radius * 2);


        ctx.fillStyle = 'black';
        if (isStimulus == true) {
          if (stimulus[current_trial_number - 1] == 'u') {
            //draw up arrow 
            ctx.fillRect(Math.ceil(canvas.width / 2 - 5), Math.ceil(canvas.width / 2 - 20), 10, 50);
            //ctx.stroke();

            //up arrow head 
            ctx.beginPath();
            ctx.moveTo(Math.ceil(canvas.width / 2 - 20), Math.ceil(canvas.width / 2 - 10));
            ctx.lineTo(Math.ceil(canvas.width / 2), Math.ceil(canvas.width / 2 - 40));
            ctx.lineTo(Math.ceil(canvas.width / 2 + 20), Math.ceil(canvas.width / 2 - 10));

            ctx.fill();
            // ctx.stroke();
          } else if (stimulus[current_trial_number - 1] == 'd') {

            //draw the down arrow
            ctx.fillStyle = 'black';
            ctx.fillRect(Math.ceil(canvas.width / 2 - 5), Math.ceil(canvas.width / 2 - 40), 10, 50);
            //ctx.stroke();


            //arrow head 
            ctx.beginPath();
            ctx.moveTo(Math.ceil(canvas.width / 2 - 20), Math.ceil(canvas.width / 2));
            ctx.lineTo(Math.ceil(canvas.width / 2), Math.ceil(canvas.width / 2 + 30));
            ctx.lineTo(Math.ceil(canvas.width / 2 + 20), Math.ceil(canvas.width / 2));
            ctx.fill();
            //ctx.stroke();

          }
        }



      }

      //MAIN LOOP 
      function update() {
        currentTime = Date.now();




        //end of trial 
        if (currentTime - startTime > duration) {
          console.log("time to end");
          console.log("Loop Duration: " + (currentTime - startTime));
          display_element.innerHTML = "";

          ctx = null;
          //write trial data 
          trial_data.mouseX = JSON.stringify(mousePosition);
          trial_data.mouseY = JSON.stringify(mousePositionY);
          trial_data.mouse_length = mousePosition.length;
          trial_data.ballX = JSON.stringify(ballPosition);
          trial_data.ballY = JSON.stringify(ballPositionY);
          trial_data.ball_length = ballPosition.length;
          trial_data.keys_pressed = JSON.stringify(keys_pressed);
          trial_data.accuracy = JSON.stringify(accuracy); 
          trial_data.response_times = JSON.stringify(rt);
          trial_data.my_time = currentTime - startTime; 
          

          trial_data.number_of_refreshes = number_of_refreshes;


          //display trial data 
          jsPsych.finishTrial(trial_data);

          return;

        }



        /*
        //timing based on real time is messy 
        //try switching the order
        if((currentTime - startTime) % 200 < 15){
          mousePosition.push(mouseX);
          ballPosition.push(ball.x); 
        }
        */

        //after_response_called = false; 





        //queue the next update
        number_of_refreshes = window.requestAnimationFrame(update);

        //CAREFUL: SHOULD THIS GO BEFORE OR AFTER?
        //timing is based on refresh rate. approx every 200 ms 
        //record mouse position
        if (number_of_refreshes % 12 == 0) {
          mousePosition.push(mouseX);
          mousePositionY.push(mouseY);
          ballPosition.push(ball.x);
          ballPositionY.push(ball.y);
        }


        if (number_of_refreshes == lastMarker) {
          after_response_called = false;
          if (counter == 0) {
            lastMarker = number_of_refreshes + 300; // beginning delay, 5 seconds 
            isStimulus = false;
            counter++;
            sub_trial_counter = 1;


          } else if (sub_trial_counter == 1 && current_trial_number < trial.num_sub_trials * 2) {
            lastMarker = number_of_refreshes + 30; //half a second stimulus
            sub_trial_start_frame = number_of_refreshes;
            isStimulus = true;

            //time to wait for a response 
            is_rt = true;
            sub_trial_counter = 2;
            current_trial_number++;

            //activate keyboard listener 
            keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: after_response,
              valid_responses: ['u', 'd'],
              persist: false,
              allow_held_key: false
            });


          } else if (sub_trial_counter == 2) {
            isStimulus = false; 
            if (is_rt == true) {
              //1.5 second delay 
              lastMarker = number_of_refreshes + 90;
              is_rt = false;
            } else {
              after_response(undefined);
            }


          } else if (sub_trial_counter == 0) {
            lastMarker = number_of_refreshes + delay_durations[current_trial_number - 1];
            isStimulus = false;
            sub_trial_counter = 1; //ready for the next stimulus 

          }

        }


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
          ball.velY = Math.random() * (Math.sqrt(velocitySquared) - 0.5) + 0.5;
          ball.velX = Math.sqrt(velocitySquared - Math.pow(ball.velY, 2));

          //console.log(ball.velX + ", " + ball.velY);


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
