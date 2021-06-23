/**
 * jspsych-canvas-animation
 * Claire Liu, ball code adapted from https://medium.com/dev-compendium/creating-a-bouncing-ball-animation-using-javascript-and-canvas-1076a09482e0 
 * 
 * plugin for a canvas that supports animation on the canvas
 * 
 */

jsPsych.plugins["canvas-animation"] = (function () {

  var plugin = {};


  plugin.info = {
    name: "canvas-animation",
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
    var new_html = '<div id="jspsych-canvas-keyboard-response-stimulus">' + '<canvas id="jspsych-canvas-stim" height="' + trial.canvas_size[0] + '" width="' + trial.canvas_size[1] + '"></canvas>' + '</div>';


    //draw the center square
    display_element.innerHTML = new_html;
    let canvas = document.getElementById("jspsych-canvas-stim");

    //ball variables
    let ctx, gravity, ball, friction;
    

    canvas.width = 800
    canvas.height = 800


    function show_visual_stimulus() {


      console.log("show_visual_stimulus called");




     // runs once at the beginning
     // loads any data and kickstarts the loop
     function init() {
       console.log("init called");
       // *load data here*
       // our canvas variables
       ctx = canvas.getContext('2d');


       //canvas.addEventListener("mousemove", setMousePosition, false);

       // set the canvas size

       // world/scene settings
       gravity = 0
       friction = 1

       // starting objects
       ball = {
         bounce: 1, // energy lost on bounce (25%)
         radius: 30,
         x: canvas.width / 2,
         y: canvas.height / 2,

         velX: 5, //(Math.random() * 15 + 5) * (Math.floor(Math.random() * 2) || -1),
         velY: 6//(Math.random() * 15 + 5) * (Math.floor(Math.random() * 2) || -1)
       }

       // begin update loop
       window.requestAnimationFrame(update)
     }

     // draws stuff to the screen
     // allows us to separate calculations and drawing
     function draw() {
       //console.log("draw called")
       // clear the canvas and redraw everything
       
       ctx.clearRect(0, 0, canvas.width, canvas.height)
    
      // draw the ball (only object in this scene)
      ctx.beginPath()
      ctx.fillStyle = 'black'
      ctx.arc(
        ball.x, ball.y,
        ball.radius,
        0, Math.PI * 2
      )
      ctx.fill()
    }

    
    // the main piece of the loop
    // runs everything
    function update() {
      console.log("update called")
      // queue the next update
      window.requestAnimationFrame(update)

      // logic goes here

      // bottom bound / floor
      if (ball.y + ball.radius >= canvas.height) {
        ball.velY *= -ball.bounce
        ball.y = canvas.height - ball.radius
        ball.velX *= friction
      }
      // top bound / ceiling
      if (ball.y - ball.radius <= 0) {
        ball.velY *= -ball.bounce
        ball.y = ball.radius
        ball.velX *= friction
      }

      // left bound
      if (ball.x - ball.radius <= 0) {
        ball.velX *= -ball.bounce
        ball.x = ball.radius
      }
      // right bound
      if (ball.x + ball.radius >= canvas.width) {
        ball.velX *= -ball.bounce
        ball.x = canvas.width - ball.radius
      }

      // reset insignificant amounts to 0
      if (ball.velX < 0.01 && ball.velX > -0.01) {
        ball.velX = 0
      }
      if (ball.velY < 0.01 && ball.velY > -0.01) {
        ball.velY = 0
      }

      // add gravity
      ball.velY += gravity

      // update ball position
      ball.x += ball.velX
      ball.y += ball.velY

      // draw after logic/calculations
      draw()
    }

    // start our code once the page has loaded
    init();
    //document.addEventListener('DOMContentLoaded', init)
     
    }





    show_visual_stimulus();



    // end trial
    //jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
