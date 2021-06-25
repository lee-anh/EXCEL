/**
 * jspsych-canvas-multi-keyboard-response
 * Claire Liu
 * 
 * plugin for a canvas that supports multiple stimuli
 *  and getting a keyboard response
 * 
 */

jsPsych.plugins["canvas-multi-keyboard-response"] = (function () {

  var plugin = {};

  plugin.info = {
    name: "canvas-multi-keyboard-response",
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

      num_sub_trials: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Number of Subtrials",
        default: 0,
        description: 'Number of subtrials to run'
      },

      //maybe in the future can try to put these in an array
      sub_trial_type1: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: "Subtrial Type 1",
        default: undefined,
        description: "First kind of the subtrial functions to run"
      },

      sub_trial_type2: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: "Subtrial Type 2",
        default: undefined,
        description: "Second kind of the subtrial functions to run"
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

      sub_trial_stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Sub-trial stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },


      sub_trial_trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Sub-trial trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },

      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_sub_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends sub-trial',
        default: true,
        description: 'If true, sub-trial will end when subject makes a response.'
      }
    }
  }

  plugin.trial = function (display_element, trial) {
    var new_html = '<div id="jspsych-canvas-keyboard-response-stimulus">' + '<canvas id="jspsych-canvas-stim" height="' + trial.canvas_size[0] + '" width="' + trial.canvas_size[1] + '"></canvas>' + '</div>';

    var trial_data = {}; //data object for the trial
    var target_key = [];
    var keys_pressed = [];
    var accuracy = [];
    var rt = []; //empty array for collecting response times
    var btwn_delay = [];
    var current_trial_number = 0; //current trial number
    var after_response_called = false; 

 


    //draw the center square
    display_element.innerHTML = new_html;
    let c = document.getElementById("jspsych-canvas-stim")
    trial.main_stimulus(c)

    //variable for storing the correct response to the sub_trial
    var correct_response;

    //function for showing stimulus and collecting the response 
    function show_visual_stimulus() {
      after_response_called = false; 
      console.log("show_visual_stimulus was called");

      //randomly determine whether to show the up arrow or down arrow 
      //record the correct response accordingly 
      var random_num = Math.floor(Math.random() * 100);
      if (random_num % 2 == 0) {
        trial.sub_trial_type1(c);
        correct_response = 'u';
      } else {
        trial.sub_trial_type2(c);
        correct_response = 'd';
      }
      //collect the response
      //for some reason the if statement is causing things to crash 
      //if(trial.choices != jsPsych.NO_KEYS){
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.choices],
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });

          // hide stimulus if stimulus_duration is set
    if (trial.sub_trial_stimulus_duration != null) {

      jsPsych.pluginAPI.setTimeout(function () {
        //draw a white square to hide the stimulus 
        var ctx = c.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.fillRect(200, 200, 100, 100);
        ctx.stroke();
        console.log("stimulus hidden");
      }, trial.sub_trial_stimulus_duration);
    }


    //if the 2 seconds response time has been exceeded, give feedback
    if (trial.sub_trial_trial_duration != null) {

      jsPsych.pluginAPI.setTimeout(function () {
        console.log("trial duration reached");
        //if after_response has not been called yet 
        if(!after_response_called){
          after_response(undefined);
        }
        

      }, trial.sub_trial_trial_duration);
    }

    }


    // a function for handling a keyboard response 
    function after_response(response_info) {
      after_response_called = true; 
      console.log("after response was called");
      if (typeof response_info == 'undefined') {
        rt.push("null");
      } else {
        rt.push(response_info.rt);
      }



      current_trial_number++;
      console.log(current_trial_number); 

      if (current_trial_number > trial.num_sub_trials) {
        end_trial();
      } else {

        target_key.push(correct_response);
        if (typeof response_info == 'undefined') {
          console.log("missed");
          //missed 
          keys_pressed.push("null");
          accuracy.push("null");

          //draw red square 
          var ctx = c.getContext('2d');
          ctx.beginPath();
          ctx.fillStyle = 'red';
          ctx.fillRect(200, 200, 100, 100);
          ctx.stroke();

        } else if (response_info.key == correct_response) {
          //feedback: green square
          console.log("correct");
          keys_pressed.push(response_info.key);
          accuracy.push("true");
          var ctx = c.getContext('2d');
          ctx.beginPath();
          ctx.fillStyle = 'green';
          ctx.fillRect(200, 200, 100, 100);
          ctx.stroke();

        } else {
          //feedback: red square 
          console.log("wrong");
          keys_pressed.push(response_info.key);
          accuracy.push("false");


          //draw red square 
          var ctx = c.getContext('2d');
          ctx.beginPath();
          ctx.fillStyle = 'red';
          ctx.fillRect(200, 200, 100, 100);
          ctx.stroke();

        }


        //delay for 2 seconds, then continue with the experiment 
        //!!COULD BE PROBLEMATIC WHEN IT COMES TO DUAL TASK!!
        jsPsych.pluginAPI.setTimeout(between_sub_trial_delay, 2000);
      }
    }

    function between_sub_trial_delay() {

      //white box 
      var ctx = c.getContext('2d');
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.fillRect(200, 200, 100, 100);
      ctx.stroke();
      var delay = Math.floor(Math.random() * (15000 - 6000 + 1000) + 6000);
      //console.log(delay); 
      btwn_delay.push(delay);

      
      if(current_trial_number <= trial.num_sub_trials){
        jsPsych.pluginAPI.setTimeout(show_visual_stimulus, delay);
      }
      

    }



    // create a function to handle ending the trial
    function end_trial() {
      console.log("end_trial was called")
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener != 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }


      //gather the data to store for the trial 
      trial_data.target_keys = JSON.stringify(target_key);
      trial_data.keys_pressed = JSON.stringify(keys_pressed);
      trial_data.accuracy = JSON.stringify(accuracy);
      trial_data.rt = JSON.stringify(rt);
      trial_data.delay = JSON.stringify(btwn_delay);

      //html displayis cleared 
      display_element.innerHTML = "";

      //more on to the next trial 
      jsPsych.finishTrial(trial_data)
    }


 
    //initiate the routine 
      show_visual_stimulus();
  



  };

  return plugin;
})();
