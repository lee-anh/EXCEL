/**
 * jspsych-canvas-animation-visual
 * Claire Liu
 * 
 * plugin for a canvas that supports animation and visual alerts
 * 
 */

jsPsych.plugins["canvas-animation-visual"] = (function () {

  var plugin = {};


  // variables that can be set from the html file 
  plugin.info = {
    name: "canvas-animation-visual",
    description: 'This plugin supports canvas animation and visual stimuli',
    parameters: {
      // canvas
      canvas_size: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Canvas size',
        default: [500, 500],
        description: 'Array containing the height (first value) and width (second value) of the canvas element.'
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


      // timing
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
        description: 'How long the stimulus should be shown, in frames per second.'
      },

      stimulus_max_response_time: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus max response time',
        default: 90,
        description: 'The maximum response time after the stimulus is shown before their repsone is counted as a miss, in frames per second.'
      },

      feedback_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Feedback duration',
        default: 30,
        description: 'How long to show the feedback, in frames per second.'
      },



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



    // stimulus square calculations, assuming that canvas is a square 
    var canvas_center = canvas.width / 2;
    var square_radius = canvas.width / 8;



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

    // boolean to signal when the response time is maxxed 
    var is_rt = true;



    // BE CAREFUL DEPENDING ON HOW MANY SUB STIMULI ARE CHOSEN 
    // Adds up to 133 seconds, which should keep the total time under 180 seconds
    // is shuffled before each trial 
    var delay_durations = [11, 7, 6, 15, 10, 7, 8, 8, 6, 12, 7, 6, 7, 9, 6, 8]; //  maximum 16 trials 



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
      is_stimulus = false;
      sub_trial_switch = 0; // time for the delay 


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
        console.log("init visual was called ")


        // set up stimulus 
        for (let i = 0; i < trial.num_sub_trials; i++) {
          stimulus.push(trial.choices[0]); // "ArrowUp"
          stimulus.push(trial.choices[1]); // "ArrowDown"
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


        // center square 
        ctx.fillStyle = 'gray';
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


        // show the stimulus if it is time to
        ctx.fillStyle = 'black';
        if (is_stimulus == true) {
          if (stimulus[current_trial_number - 1] == "arrowup") {
            // draw up arrow 
            ctx.fillRect(Math.ceil(canvas.width / 2 - 5), Math.ceil(canvas.width / 2 - 20), 10, 50);

            // arrow head 
            ctx.beginPath();
            ctx.moveTo(Math.ceil(canvas.width / 2 - 20), Math.ceil(canvas.width / 2 - 10));
            ctx.lineTo(Math.ceil(canvas.width / 2), Math.ceil(canvas.width / 2 - 40));
            ctx.lineTo(Math.ceil(canvas.width / 2 + 20), Math.ceil(canvas.width / 2 - 10));
            ctx.fill();

          } else if (stimulus[current_trial_number - 1] == 'arrowdown') {
            // draw the down arrow
            ctx.fillStyle = 'black';
            ctx.fillRect(Math.ceil(canvas.width / 2 - 5), Math.ceil(canvas.width / 2 - 40), 10, 50);
            // arrow head 
            ctx.beginPath();
            ctx.moveTo(Math.ceil(canvas.width / 2 - 20), Math.ceil(canvas.width / 2));
            ctx.lineTo(Math.ceil(canvas.width / 2), Math.ceil(canvas.width / 2 + 30));
            ctx.lineTo(Math.ceil(canvas.width / 2 + 20), Math.ceil(canvas.width / 2));
            ctx.fill();

          }
        }



      }


      /**
       * Main helper function, includes time control for events 
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

          //window.cancelAnimationFrame(update); 

          // write trial data 
          trial_data.keys_pressed = JSON.stringify(keys_pressed);
          trial_data.accuracy = JSON.stringify(accuracy);
          trial_data.response_times = JSON.stringify(rt);
          trial_data.my_time = current_time - start_time;
          trial_data.total_number_of_refreshes = number_of_refreshes - starting_frame;


          // display trial data 
          jsPsych.finishTrial(trial_data);

          return;

        }

        // queue the next update
        number_of_refreshes = window.requestAnimationFrame(update);




        // EVENT LOGIC 

        // if it's time for the next event 
        if (number_of_refreshes == last_marker) {
          after_response_called = false;
          // if it is the first frame being shown, include hte begninning delay 
          if (counter == 0) {
            last_marker = number_of_refreshes + 300; // beginning delay, 5 seconds 
            is_stimulus = false;
            counter++;
            sub_trial_switch = 1;

            //time to show the stimulus 
          } else if (sub_trial_switch == 1 && current_trial_number < trial.num_sub_trials * 2) {
            last_marker = number_of_refreshes + trial.stimulus_duration;
            sub_trial_start_frame = number_of_refreshes;
            is_stimulus = true;
            console.log("got to time to show the stimulus ")

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
            is_stimulus = false;

            // determine if it is still within the response time or rt is maxxed 
            if (is_rt == true) {
              last_marker = number_of_refreshes + trial.stimulus_max_response_time;
              is_rt = false;
            } else {
              // call after_response if the response time is maxxed 
              after_response(undefined);
            }


            // time to delay 
          } else if (sub_trial_switch == 0) {
            last_marker = number_of_refreshes + delay_durations[current_trial_number - 1];
            //is_stimulus = false;

            // ready for next stimulus 
            sub_trial_switch = 1;

          }

        }


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
