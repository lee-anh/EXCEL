/**
 * jspsych-canvas-animation-audio
 * Claire Liu
 * ball code adapted from https://medium.com/dev-compendium/creating-a-bouncing-ball-animation-using-javascript-and-canvas-1076a09482e0 
 * mouse tracking code adapted from https://www.kirupa.com/canvas/follow_mouse_cursor.htm
 * plugin for a canvas that supports animation and mouse tracking on the canvas and auditory alerts 
 * 
 */

jsPsych.plugins["canvas-animation-tracking-audio"] = (function () {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('canvas-animation-tracking-audio', 'high_stimulus', 'audio');
  jsPsych.pluginAPI.registerPreload('canvas-animation-tracking-audio', 'low_stimulus', 'audio');



  // variables that can be set from the html file 
  plugin.info = {
    name: "canvas-animation-tracking-audio",
    description: 'This plugin supports canvas animation, mouse tracking, and audio stimuli',
    parameters: {
      // canvas
      canvas_size: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Canvas size',
        default: [500, 500],
        description: 'Array containing the height (first value) and width (second value) of the canvas element.'
      },

      // stimuli
      high_stimulus: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'High stimulus',
        default: undefined,
        description: 'High tone audio to be played'
      },

      low_stimulus: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Low stimulus',
        default: undefined,
        description: 'Low tone audio to be played'

      },

      // keyboard choices 
      choices: {
        type: jsPsych.plugins.parameterType.KEY,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },

      // number of subtrials 
      num_sub_trials: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Number of Sub Trials',
        default: 8,
        description: 'How many of each subtrial to show'
      },

      // ball velocity squared 
      ball_velocity_squared: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Ball velocity squared',
        default: 25,
        description: 'The squared velocity of how fast the ball should move'
      },

      // timing
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 180000,
        description: 'How long the trial should last in milliseconds.'
      },


      stimulus_max_response_time: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus max response time',
        default: 120,
        description: 'The maximum response time after the stimulus is shown before their repsone is counted as a miss, in frames per second.'
      },

      feedback_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Feedback duration',
        default: 30,
        description: 'How long to show the feedback, in frames per second.'
      },

      mouse_sampling_rate: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Mouse sampling rate',
        default: 50,
        description: 'How often (in frames) to sample the mouse and ball locations.'
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
    var velocity_squared = 25;

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


    var context = jsPsych.pluginAPI.audioContext();

    var audio;
    // load audio file
    jsPsych.pluginAPI.getAudioBuffer(trial.high_stimulus)
      .then(function (buffer) {
        if (context !== null) {
          audio = context.createBufferSource();
          audio.buffer = buffer;
          audio.connect(context.destination);
          console.log("used if");
        } else {
          audio = buffer;
          audio.currentTime = 0;
          console.log("used else");

        }

      })
      .catch(function (err) {
        console.error(`Failed to load audio file "${trial.high_stimulus}". Try checking the file path. We recommend using the preload plugin to load audio files.`)
        console.error(err)
      });

    var context2 = jsPsych.pluginAPI.audioContext();

    var audio2;
    // load audio file
    jsPsych.pluginAPI.getAudioBuffer(trial.low_stimulus)
      .then(function (buffer) {
        if (context2 !== null) {
          audio2 = context2.createBufferSource();
          audio2.buffer = buffer;
          audio2.connect(context2.destination);
          console.log("used if 2");
        } else {
          audio2 = buffer;
          audio2.currentTime = 0;
          console.log("used else 2");

        }

      })
      .catch(function (err) {
        console.error(`Failed to load audio file "${trial.low_stimulus}". Try checking the file path. We recommend using the preload plugin to load audio files.`)
        console.error(err)
      });






    // stores the keyboard listener 
    var keyboardListener = {};

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

    // array to keep track of the mouse error  
    var mouse_error = [];

    // nested array to keep track of error for 2 seconds after onset of a stimulus 
    var after_onset = [];
    var sub_after_onset = [];

    // array to keep track of the keys pressed in the experiment 
    var keys_pressed = [];

    // array to keep track of response time 
    var rt = [];

    // array to keep track of response accuracy 
    var accuracy = [];


    // array to keep track of the stimuli shown 
    var stimulus = [];

    // switch to determine whether to show stimulus 
    var is_stimulus = false;

    // boolean to determine if it is time to give feedback 
    var after_response_called = false;

    // boolean to determine what kind of feedback to give given response 
    var is_correct = false;

    // keeps track of the frames to determine how long to run different components 
    var last_marker = 2;


    // timing varaibles to measure response time
    var sub_trial_start_frame = 2;
    var sub_trial_end_frame = 2;

    // keeps track if it is the first frame 
    var counter = 0;

    // switch to determine what to show the participant
    // 0 = delay, show no stimlui 
    // 1 = show stimuli 
    // 2 = hide stimuli and wait for a response 
    var sub_trial_switch = 0;

    // keeps track of what trial number we are on 
    var current_trial_number = 0;



    // timing arrays 
    // in milliseconds 
    var stimulus_start = [];
    var feedback_start = [];
    var delay_start = [];
    // in frames 
    var f_stimulus_start = [];
    var f_feedback_start = [];
    var f_delay_start = [];


    // BE CAREFUL DEPENDING ON HOW MANY SUB STIMULI ARE CHOSEN 
    // is shuffled before each trial 
    // need only 120 seconds of delay
    // need only 15 delay durations -- be careful because will need to signal when the last one is 
    var delay_durations = [10, 7, 6, 14.5, 9, 7, 8, 7.5, 6, 11, 8, 6, 5.5, 9, 5.5];
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
     * Operations after a response (or missed response) to a stimulus 
     * @param {Object} response_info object which includes key pressed and response time? 
     */
    function after_response(response_info) {

      // it is time to give feedback 
      after_response_called = true;

      // record the end frame 
      sub_trial_end_frame = number_of_refreshes;


      // update last_marker with feedback time 
      last_marker = number_of_refreshes + trial.feedback_duration;
      sub_trial_switch = 0; // time for the delay 


      feedback_start.push(Date.now() - start_time);
      f_feedback_start.push(number_of_refreshes);
      // give feedback based on response info 
      if (typeof response_info == 'undefined') {
        //record key pressed 
        keys_pressed.push('null');
        console.log("Sub-trial counter: " + current_trial_number + " Stimulus: " + stimulus[current_trial_number - 1] + ", response: null");

        // calculate and record null reponse time 
        rt.push("null");

      } else {
        // record key pressed 
        keys_pressed.push(response_info.key);
        console.log("Sub-trial counter: " + current_trial_number + " Stimulus: " + stimulus[current_trial_number - 1] + ", response: " + response_info.key);

        // calculate and record response time 
        rt.push(sub_trial_end_frame - sub_trial_start_frame);
      }

      // check for correct response 
      if (typeof response_info == 'undefined') {
        // missed response 
        is_correct = false;
        console.log("Miss");
        accuracy.push("miss");
      } else if (stimulus[current_trial_number - 1] == response_info.key) {
        // correct response
        is_correct = true;
        console.log("Correct!");
        accuracy.push("true")
      } else {
        // incorrect response 
        is_correct = false;
        console.log("Wrong :(");
        accuracy.push("false");
      }

      // kill keyboard listener
      if (typeof keyboardListener != 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

    }



    /**
     * main function that runs the animation 
     */
    function show_visual_stimulus() {

      console.log("show_visual_stimulus called");

      /**
       * runs once at the beginning, loads any data and kickstarts the loop 
       */
      function init() {
        console.log("init audio called")
        console.log("Duration: " + duration);

        // set up stimulus 
        for (let i = 0; i < trial.num_sub_trials; i++) {
          stimulus.push('arrowup'); // "arrowup"
          stimulus.push('arrowdown'); // "arrowdown"
        }

        // shuffle stimulus and delay durations 
        shuffle(stimulus);
        console.log("Stimulus order: " + stimulus);
        shuffle(delay_durations);


        // convert delay durations to fps, assuming 60 fps
        for (let i = 0; i < delay_durations.length; i++) {
          delay_durations[i] = Math.ceil(delay_durations[i] * 60);
        }

        // record the start time 
        start_time = Date.now();
        console.log("start time: " + start_time);

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

        // circular mouse tracker
        // ctx.arc(mouseX, mouseY, 30, 0, 2 * Math.PI, true);
        // ctx.fill();

        // center square 
        ctx.fillStyle = '#cccccc';
        // if it's time to give feedback 
        if (after_response_called == true) {

          // if the feedback is correct, show a green square, else show red 
          if (is_correct == true) {
            ctx.fillStyle = 'green';
          } else {
            ctx.fillStyle = 'red';
          }
        }

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
          console.log("time to end");

          console.log("Loop Duration: " + (current_time - start_time));
          //clear the html display 
          display_element.innerHTML = "";
          ctx = null;

          after_onset.push(sub_after_onset);


          //window.cancelAnimationFrame(update); 

          // write trial data 
          trial_data.mouseX = JSON.stringify(mouse_position_x);
          trial_data.mouseY = JSON.stringify(mouse_position_y);
          trial_data.mouse_length = mouse_position_x.length;
          trial_data.ballX = JSON.stringify(ball_position_x);
          trial_data.ballY = JSON.stringify(ball_position_y);
          trial_data.ball_length = ball_position_x.length;

          for (let i = 0; i < mouse_position_x.length; i++) {
            mouse_error.push(Math.sqrt((mouse_position_x[i] - ball_position_x[i]) ** 2 + (mouse_position_y[i] - ball_position_y[i]) ** 2));
          }
          trial_data.mouse_error = JSON.stringify(mouse_error);
          trial_data.mouse_after_onset = JSON.stringify(after_onset);
          trial_data.mouse_after_onset_length = after_onset.length;

          trial_data.keys_pressed = JSON.stringify(keys_pressed);
          trial_data.accuracy = JSON.stringify(accuracy);
          trial_data.stimuli_onsets_in_ms = JSON.stringify(stimulus_start);
          trial_data.stimuli_onsets_in_frames = JSON.stringify(f_stimulus_start);
          trial_data.response_times = JSON.stringify(rt);
          trial_data.my_time = current_time - start_time;
          trial_data.total_number_of_refreshes = number_of_refreshes - starting_frame;


          // timing data to collect 
          let toPrint = '';
          let toPrintFrames = '';
          console.log("Dual Audio");
          for (let i = 0; i < stimulus_start.length; i++) {
            toPrint += i + 1 + ' ' + stimulus_start[i] + ' ' + feedback_start[i] + ' ' + delay_start[i] + '\n';
            toPrintFrames += i + 1 + ' ' + f_stimulus_start[i] + ' ' + f_feedback_start[i] + ' ' + f_delay_start[i] + '\n';
          }
          console.log("Times in ms");
          console.log(toPrint);
          console.log("Times in frames");
          console.log(toPrintFrames);

          // send trial data 
          jsPsych.finishTrial(trial_data);

          return;

        }

        // queue the next update
        number_of_refreshes = window.requestAnimationFrame(update);

        // record mouse and positions
        if (number_of_refreshes % trial.mouse_sampling_rate == 0) {
          mouse_position_x.push(mouseX);
          mouse_position_y.push(mouseY);
          ball_position_x.push(ball.x);
          ball_position_y.push(ball.y);
          if (sub_after_onset.length < 40) {
            sub_after_onset.push(Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2));
          }
        }


        // EVENT LOGIC 

        // if it's time for the next event 
        if (number_of_refreshes == last_marker) {
          after_response_called = false;
          // if it is the first frame being shown, include the beginning delay 
          if (counter == 0) {
            last_marker = number_of_refreshes + 600; // beginning delay, 10 seconds 
            is_stimulus = false;
            counter++;
            sub_trial_switch = 1;

            //time to show the stimulus 
          } else if (sub_trial_switch == 1 && current_trial_number < trial.num_sub_trials * 2) {
            last_marker = number_of_refreshes + trial.stimulus_max_response_time;
            // push and clear the sub onset array 
            if (current_trial_number > 0) {
              after_onset.push(sub_after_onset);
            }

            sub_after_onset = [];

            sub_trial_start_frame = number_of_refreshes;
            is_stimulus = true;

            stimulus_start.push(current_time - start_time);
            f_stimulus_start.push(number_of_refreshes);


            //play the correct sound 
            if (stimulus[current_trial_number] == 'arrowup') {
              audio.play();

            } else if (stimulus[current_trial_number] == 'arrowdown') {

              audio2.play();

            } else {
              console.log("stimulus was undefined");
            }


            // update variables so the next event is waiting for a response
            is_rt = true;
            sub_trial_switch = 2;
            current_trial_number++;

            // activate keyboard listener 
            keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: after_response,
              valid_responses: trial.choices,
              persist: false,
              allow_held_key: false
            });


            // time to wait for a response 
          } else if (sub_trial_switch == 2) {

            after_response(undefined);


            // time to delay 
          } else if (sub_trial_switch == 0) {

            delay_start.push(current_time - start_time);
            f_delay_start.push(number_of_refreshes);
            
            if (current_trial_number > delay_durations.length) {
              last_marker += 600; // add 10 seconds 
            } else {
              last_marker = number_of_refreshes + delay_durations[current_trial_number - 1];
            }
            is_stimulus = false;

            // ready for next stimulus 
            sub_trial_switch = 1;

          }

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
          ball.y = canvas.height - ball.radius; // moves ball to correct position to prevent multiple refreshes 

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

          ball.y = ball.radius; // moves ball to correct position to prevent multiple refreshes 
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

          ball.x = canvas.width - ball.radius;
        }



        // if ball is going to touch/cross over the center stimulus square
        if ((ball.y - ball.radius <= canvas_center + square_radius && ball.y + ball.radius >= canvas_center - square_radius)
          && (ball.x - ball.radius <= canvas_center + square_radius && ball.x + ball.radius >= canvas_center - square_radius)) {


          // calculate new velocities 
          ball.velY = Math.random() * (Math.sqrt(velocity_squared) - 0.5) + 0.5;
          ball.velX = Math.sqrt(velocity_squared - Math.pow(ball.velY, 2));

          // console.log(ball.velX + ", " + ball.velY);


          // if it hits to top half of the stimulus square, the y velocity should be negative
          if (ball.y + ball.radius <= canvas_center + square_radius * Math.sqrt(2)) {
            // down ways 
            ball.velY *= -1;
          }

          // if it hits the bottom half of the stimulus square, the x velocity should be negative 
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
