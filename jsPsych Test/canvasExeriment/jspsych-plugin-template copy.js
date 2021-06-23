/**
 * jspsych-canvas-multi-keyboard-response
 * Claire Liu
 * 
 * plugin for a canvas that supports multiple stimuli
 *  and getting a keyboard response
 * 
 */

jsPsych.plugins["canvas-multi-keyboard-response"] = (function() {

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



  plugin.trial = function(display_element, trial) {
   

    var rt = []; //empty array for collecting response times
    var current_trial_number = 0; 
    //canvas
    var new_html = '<div id="jspsych-canvas-keyboard-response-stimulus">' + '<canvas id="jspsych-canvas-stim" height="' + trial.canvas_size[0] + '" width="' + trial.canvas_size[1] + '"></canvas>' + '</div>';
    
    display_element.innerHTML = new_html;
    let c = document.getElementById("jspsych-canvas-stim")
    trial.stimulus(c)



    

    
    
    

    // store response
    var response = {
      rt: null,
      key: null
    };

    // data saving
    var trial_data = {
      parameter_name: 'parameter value'
    };


    // end trial
    jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
