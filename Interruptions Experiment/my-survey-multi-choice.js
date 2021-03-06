/**
 * jspsych-survey-multi-choice
 * a jspsych plugin for multiple choice survey questions
 *
 * Claire Liu (adapted from Shane Martin) 
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['my-survey-multi-choice'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'my-survey-multi-choice',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'The strings that will be associated with a group of options.'
          },
          options: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Options',
            array: true,
            default: undefined,
            description: 'Displays options for an individual question.'
          },
          fill_in_option: {
            type: jsPsych.plugins.parameterType.STRING, 
            pretty_name: 'Fill-in Option', 
            default: undefined, 
            description: 'Other/Fill in your own answer paired with a radio button.'
          }, 
          required: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Required',
            default: false,
            description: 'Subject will be required to pick an option for each question.'
          },
          horizontal: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Horizontal',
            default: false,
            description: 'If true, then questions are centered and options are displayed horizontally.'
          },
          name: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Question Name',
            default: '',
            description: 'Controls the name of data values associated with this question'
          }
        }
      },
      randomize_question_order: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Randomize Question Order',
        default: false,
        description: 'If true, the order of the questions will be randomized'
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'Label of the button.'
      },
      autocomplete: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow autocomplete',
        default: false,
        description: "Setting this to true will enable browser auto-complete or auto-fill for the form."
      }
    }
  }
  plugin.trial = function(display_element, trial) {
    var plugin_id_name = "jspsych-survey-multi-choice";

    var html = "";

    // inject CSS for trial
    html += '<style id="jspsych-survey-multi-choice-css">';
    html += ".jspsych-survey-multi-choice-question { margin-top: 2em; margin-bottom: 2em; text-align: left; }"+
      ".jspsych-survey-multi-choice-text span.required {color: darkred;}"+
      ".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-text {  text-align: center;}"+
      ".jspsych-survey-multi-choice-option { line-height: 2; }"+
      ".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-option {  display: inline-block;  margin-left: 1em;  margin-right: 1em;  vertical-align: top;}"+
      "label.jspsych-survey-multi-choice-text input[type='radio'] {margin-right: 1em;}";
    html += '</style>';

    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-survey-multi-choice-preamble" class="jspsych-survey-multi-choice-preamble">'+trial.preamble+'</div>';
    }

    // form element
    if ( trial.autocomplete ) {
    	html += '<form id="jspsych-survey-multi-choice-form">';
    } else {
    	html += '<form id="jspsych-survey-multi-choice-form" autocomplete="off">';
    }
    // generate question order. this is randomized here as opposed to randomizing the order of trial.questions
    // so that the data are always associated with the same question regardless of order
    var question_order = [];
    for(var i=0; i<trial.questions.length; i++){
      question_order.push(i);
    }
    if(trial.randomize_question_order){
      question_order = jsPsych.randomization.shuffle(question_order);
    }
    
    // add multiple-choice questions
    for (var i = 0; i < trial.questions.length; i++) {
      
      // get question based on question_order
      var question = trial.questions[question_order[i]];
      var question_id = question_order[i];
      
      // create question container
      var question_classes = ['jspsych-survey-multi-choice-question'];
      if (question.horizontal) {
        question_classes.push('jspsych-survey-multi-choice-horizontal');
      }

      html += '<div id="jspsych-survey-multi-choice-'+question_id+'" class="'+question_classes.join(' ')+'"  data-name="'+question.name+'">';

      // add question text
      html += '<p class="jspsych-survey-multi-choice-text survey-multi-choice">' + question.prompt 
      if(question.required){
        html += "<span class='required'>*</span>";
      }
      html += '</p>';

      // create option radio buttons
      for (var j = 0; j < question.options.length; j++) {
        // add label and question text
        var option_id_name = "jspsych-survey-multi-choice-option-"+question_id+"-"+j;
        var input_name = 'jspsych-survey-multi-choice-response-'+question_id;
        var input_id = 'jspsych-survey-multi-choice-response-'+question_id+'-'+j;

        var required_attr = question.required ? 'required' : '';

        // add radio button container
        html += '<div id="'+option_id_name+'" class="jspsych-survey-multi-choice-option">';
        html += '<label class="jspsych-survey-multi-choice-text" for="'+input_id+'">';
        html += '<input type="radio" name="'+input_name+'" id="'+input_id+'" value="'+question.options[j]+'" '+required_attr+'></input>';
        html += question.options[j]+'</label>';
        html += '</div>';
      }

      // add fill in box 
      //if(question.fill_in_option !== null){
        html += '<div id="'+"jspsych-survey-multi-choice-option-"+question_id+"-"+question.options.length+'" class="jspsych-survey-multi-choice-option">'
        html +=  '<label class="jspsych-survey-multi-choice-text" for="'+'jspsych-survey-multi-choice-response-'+question_id+'-'+question.options.length+'">';
        html += '<input type="radio" name="'+'jspsych-survey-multi-choice-response-'+question_id+'" id="'+'jspsych-survey-multi-choice-response-'+question_id+'-'+question.options.length+'" value="'+question.fill_in_option+'" '+'></input>';
        html += question.fill_in_option + '</label>';
        html += '<input type="text" id = "txtInput" class = "jspsych-survey-multi-choice-text">' +'</input>';
        html += '</div'; 
      //}
      

      html += '</div>';
  
    }

    
    

    /*
    var question_data_element = {}; 
    var input_element = document.querySelector('#jspsych-survey-multi-choice-option-0').querySelector('input'); 
    var val_element = input_element.value; 
    var name = 1; 
    var object_element = {}; 
    object_element[name] = val_element; 
    Object.assign(question_data_element, object_element); 
    */
  
    
    // add submit button
    html += '<div></div>';
    html += '<input type="submit" id="'+plugin_id_name+'-next" class="'+plugin_id_name+' jspsych-btn"' + (trial.button_label ? ' value="'+trial.button_label + '"': '') + '></input>';
    html += '</form>';
  

    // render
    display_element.innerHTML = html;

    document.querySelector('form').addEventListener('submit', function(event) {
      event.preventDefault();
      // measure response time
      var endTime = performance.now();
      var response_time = endTime - startTime;
      var other_response = document.getElementById("other"); 
      if(other_response !== null){
        console.log(other_response.value); 
      }
      // create object to hold responses
      var question_data = {};
      for(var i=0; i<trial.questions.length; i++){
        var match = display_element.querySelector('#jspsych-survey-multi-choice-'+i);
        var id = "Q" + i;
        if(match.querySelector("input[type=radio]:checked") !== null){
          var val = match.querySelector("input[type=radio]:checked").value;
        } else {
          var val = "";
        }
        var obje = {};
        var name = id;
        if(match.attributes['data-name'].value !== ''){
          name = match.attributes['data-name'].value;
        }
        obje[name] = val;
        Object.assign(question_data, obje);
      }

      var gender_value = document.getElementById("txtInput"); 
      var valval = gender_value.value; 
      // save data
      var trial_data = {
        rt: response_time,
        response: question_data,
        question_order: question_order, 
        other_option: valval
      };
      

      // next trial
      jsPsych.finishTrial(trial_data);
    });

    var startTime = performance.now();
  };

  return plugin;
})();
