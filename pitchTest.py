#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
This experiment was created using PsychoPy3 Experiment Builder (v2021.1.4),
    on Thu Jun  3 13:57:17 2021
If you publish work using this script the most relevant publication is:

    Peirce J, Gray JR, Simpson S, MacAskill M, Höchenberger R, Sogo H, Kastman E, Lindeløv JK. (2019) 
        PsychoPy2: Experiments in behavior made easy Behav Res 51: 195. 
        https://doi.org/10.3758/s13428-018-01193-y

"""

from __future__ import absolute_import, division

from psychopy import locale_setup
from psychopy import prefs
from psychopy import sound, gui, visual, core, data, event, logging, clock, colors
from psychopy.constants import (NOT_STARTED, STARTED, PLAYING, PAUSED,
                                STOPPED, FINISHED, PRESSED, RELEASED, FOREVER)

import numpy as np  # whole numpy lib is available, prepend 'np.'
from numpy import (sin, cos, tan, log, log10, pi, average,
                   sqrt, std, deg2rad, rad2deg, linspace, asarray)
from numpy.random import random, randint, normal, shuffle, choice as randchoice
import os  # handy system and path functions
import sys  # to get file system encoding

from psychopy.hardware import keyboard



# Ensure that relative paths start from the same directory as this script
_thisDir = os.path.dirname(os.path.abspath(__file__))
os.chdir(_thisDir)

# Store info about the experiment session
psychopyVersion = '2021.1.4'
expName = 'pitchTest'  # from the Builder filename that created this script
expInfo = {'participant': '', 'session': '001'}
dlg = gui.DlgFromDict(dictionary=expInfo, sortKeys=False, title=expName)
if dlg.OK == False:
    core.quit()  # user pressed cancel
expInfo['date'] = data.getDateStr()  # add a simple timestamp
expInfo['expName'] = expName
expInfo['psychopyVersion'] = psychopyVersion

# Data file name stem = absolute path + name; later add .psyexp, .csv, .log, etc
filename = _thisDir + os.sep + u'data/%s_%s_%s' % (expInfo['participant'], expName, expInfo['date'])

# An ExperimentHandler isn't essential but helps with data saving
thisExp = data.ExperimentHandler(name=expName, version='',
    extraInfo=expInfo, runtimeInfo=None,
    originPath='/Users/claireliu/Desktop/EXCEL/pitchTest.py',
    savePickle=True, saveWideText=True,
    dataFileName=filename)
# save a log file for detail verbose info
logFile = logging.LogFile(filename+'.log', level=logging.DEBUG)
logging.console.setLevel(logging.WARNING)  # this outputs to the screen, not a file

endExpNow = False  # flag for 'escape' or other condition => quit the exp
frameTolerance = 0.001  # how close to onset before 'same' frame

# Start Code - component code to be run after the window creation

# Setup the Window
win = visual.Window(
    size=[1680, 1050], fullscr=True, screen=0, 
    winType='pyglet', allowGUI=False, allowStencil=False,
    monitor='testMonitor', color=[0,0,0], colorSpace='rgb',
    blendMode='avg', useFBO=True, 
    units='height')
# store frame rate of monitor if we can measure it
expInfo['frameRate'] = win.getActualFrameRate()
if expInfo['frameRate'] != None:
    frameDur = 1.0 / round(expInfo['frameRate'])
else:
    frameDur = 1.0 / 60.0  # could not measure, so guess

# create a default keyboard (e.g. to check for escape)
defaultKeyboard = keyboard.Keyboard()

# Initialize components for Routine "instr"
instrClock = core.Clock()
instructions = visual.TextStim(win=win, name='instructions',
    text='Press up arrow when you see up arrow image\nPress down arrow when you see down arrow image\n\nPress any key to continue',
    font='Open Sans',
    pos=(0, 0), height=0.1, wrapWidth=None, ori=0.0, 
    color='white', colorSpace='rgb', opacity=None, 
    languageStyle='LTR',
    depth=0.0);
key_resp = keyboard.Keyboard()

# Initialize components for Routine "visual_2"
visual_2Clock = core.Clock()
center_vis = visual.Rect(
    win=win, name='center_vis',units='pix', 
    width=(75, 75)[0], height=(75, 75)[1],
    ori=0.0, pos=(0, 0),
    lineWidth=1.0,     colorSpace='rgb',  lineColor='white', fillColor='white',
    opacity=None, depth=0.0, interpolate=True)
arrow_image = visual.ImageStim(
    win=win,
    name='arrow_image', units='pix', 
    image='sin', mask=None,
    ori=0.0, pos=(0, 0), size=(75, 75),
    color=[1,1,1], colorSpace='rgb', opacity=None,
    flipHoriz=False, flipVert=False,
    texRes=128.0, interpolate=True, depth=-1.0)
resp_vis = keyboard.Keyboard()
feedback_vis = visual.Rect(
    win=win, name='feedback_vis',units='pix', 
    width=(75, 75)[0], height=(75, 75)[1],
    ori=1.0, pos=(0, 0),
    lineWidth=1.0,     colorSpace='rgb',  lineColor='white', fillColor='white',
    opacity=None, depth=-3.0, interpolate=True)
"""
feedback_vis = visual.Rect(
    win=win, name='feedback_vis',units='pix', 
    width=(75, 75)[0], height=(75, 75)[1],
    ori=1.0, pos=(0, 0),
    lineWidth=1.0,     colorSpace='rgb',  lineColor='white', fillColor='white',
    opacity=None, depth=-3.0, interpolate=True)
"""

# Initialize components for Routine "instr_audio"
instr_audioClock = core.Clock()
audio_instructions = visual.TextStim(win=win, name='audio_instructions',
    text='Press up arrow when you hear high pitch\nPress down arrow when you hear low pitch\n\nPress any key to continue',
    font='Open Sans',
    pos=(0, 0), height=0.1, wrapWidth=None, ori=0.0, 
    color='white', colorSpace='rgb', opacity=None, 
    languageStyle='LTR',
    depth=0.0);
key_resp_instructions = keyboard.Keyboard()

# Initialize components for Routine "audio"
audioClock = core.Clock()
sound_aud = sound.Sound('A', secs=0.5, stereo=True, hamming=True,
    name='sound_aud')
sound_aud.setVolume(1.0)
resp_aud = keyboard.Keyboard()
center_aud = visual.Rect(
    win=win, name='center_aud',
    width=(0.15, 0.15)[0], height=(0.15, 0.15)[1],
    ori=0.0, pos=(0, 0),
    lineWidth=1.0,     colorSpace='rgb',  lineColor='white', fillColor='white',
    opacity=None, depth=-2.0, interpolate=True)
feedback_aud = visual.Rect(
    win=win, name='feedback_aud',units='pix', 
    width=(75, 75)[0], height=(75, 75)[1],
    ori=0.0, pos=(0, 0),
    lineWidth=1.0,     colorSpace='rgb',  lineColor='white', fillColor='white',
    opacity=None, depth=-3.0, interpolate=True)

# Initialize components for Routine "thanks"
thanksClock = core.Clock()
thanksMessage = visual.TextStim(win=win, name='thanksMessage',
    text='Thanks for participating!',
    font='Open Sans',
    pos=(0, 0), height=0.1, wrapWidth=None, ori=0.0, 
    color='white', colorSpace='rgb', opacity=None, 
    languageStyle='LTR',
    depth=0.0);

# Create some handy timers
globalClock = core.Clock()  # to track the time since experiment started
routineTimer = core.CountdownTimer()  # to track time remaining of each (non-slip) routine 

# ------Prepare to start Routine "instr"-------
continueRoutine = True
# update component parameters for each repeat
key_resp.keys = []
key_resp.rt = []
_key_resp_allKeys = []
# keep track of which components have finished
instrComponents = [instructions, key_resp]
for thisComponent in instrComponents:
    thisComponent.tStart = None
    thisComponent.tStop = None
    thisComponent.tStartRefresh = None
    thisComponent.tStopRefresh = None
    if hasattr(thisComponent, 'status'):
        thisComponent.status = NOT_STARTED
# reset timers
t = 0
_timeToFirstFrame = win.getFutureFlipTime(clock="now")
instrClock.reset(-_timeToFirstFrame)  # t0 is time of first possible flip
frameN = -1

# -------Run Routine "instr"-------
while continueRoutine:
    # get current time
    t = instrClock.getTime()
    tThisFlip = win.getFutureFlipTime(clock=instrClock)
    tThisFlipGlobal = win.getFutureFlipTime(clock=None)
    frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
    # update/draw components on each frame
    
    # *instructions* updates
    if instructions.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
        # keep track of start time/frame for later
        instructions.frameNStart = frameN  # exact frame index
        instructions.tStart = t  # local t and not account for scr refresh
        instructions.tStartRefresh = tThisFlipGlobal  # on global time
        win.timeOnFlip(instructions, 'tStartRefresh')  # time at next scr refresh
        instructions.setAutoDraw(True)
    
    # *key_resp* updates
    waitOnFlip = False
    if key_resp.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
        # keep track of start time/frame for later
        key_resp.frameNStart = frameN  # exact frame index
        key_resp.tStart = t  # local t and not account for scr refresh
        key_resp.tStartRefresh = tThisFlipGlobal  # on global time
        win.timeOnFlip(key_resp, 'tStartRefresh')  # time at next scr refresh
        key_resp.status = STARTED
        # keyboard checking is just starting
        waitOnFlip = True
        win.callOnFlip(key_resp.clock.reset)  # t=0 on next screen flip
        win.callOnFlip(key_resp.clearEvents, eventType='keyboard')  # clear events on next screen flip
    if key_resp.status == STARTED and not waitOnFlip:
        theseKeys = key_resp.getKeys(keyList=None, waitRelease=False)
        _key_resp_allKeys.extend(theseKeys)
        if len(_key_resp_allKeys):
            key_resp.keys = _key_resp_allKeys[-1].name  # just the last key pressed
            key_resp.rt = _key_resp_allKeys[-1].rt
            # a response ends the routine
            continueRoutine = False
    
    # check for quit (typically the Esc key)
    if endExpNow or defaultKeyboard.getKeys(keyList=["escape"]):
        core.quit()
    
    # check if all components have finished
    if not continueRoutine:  # a component has requested a forced-end of Routine
        break
    continueRoutine = False  # will revert to True if at least one component still running
    for thisComponent in instrComponents:
        if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
            continueRoutine = True
            break  # at least one component has not yet finished
    
    # refresh the screen
    if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
        win.flip()

# -------Ending Routine "instr"-------
for thisComponent in instrComponents:
    if hasattr(thisComponent, "setAutoDraw"):
        thisComponent.setAutoDraw(False)
thisExp.addData('instructions.started', instructions.tStartRefresh)
thisExp.addData('instructions.stopped', instructions.tStopRefresh)
# the Routine "instr" was not non-slip safe, so reset the non-slip timer
routineTimer.reset()

# set up handler to look after randomisation of conditions etc
visualLoop = data.TrialHandler(nReps=8.0, method='fullRandom', 
    extraInfo=expInfo, originPath=-1,
    trialList=data.importConditions('visualStim.xlsx'),
    seed=None, name='visualLoop')
thisExp.addLoop(visualLoop)  # add the loop to the experiment
thisVisualLoop = visualLoop.trialList[0]  # so we can initialise stimuli with some values
# abbreviate parameter names if possible (e.g. rgb = thisVisualLoop.rgb)
if thisVisualLoop != None:
    for paramName in thisVisualLoop:
        exec('{} = thisVisualLoop[paramName]'.format(paramName))

for thisVisualLoop in visualLoop:
    currentLoop = visualLoop
    # abbreviate parameter names if possible (e.g. rgb = thisVisualLoop.rgb)
    if thisVisualLoop != None:
        for paramName in thisVisualLoop:
            exec('{} = thisVisualLoop[paramName]'.format(paramName))
    
    # ------Prepare to start Routine "visual_2"-------
    continueRoutine = True
    # update component parameters for each repeat
    arrow_image.setImage(condition)
    resp_vis.keys = []
    resp_vis.rt = []
    _resp_vis_allKeys = []
    feedback_vis.setFillColor('green')
    feedback_vis.setOri(0.0)
    feedback_vis.setLineColor('green')
    
    """
    feedback_vis.setFillColor('green')
    feedback_vis.setOri(0.0)
    feedback_vis.setLineColor('green')
    """
    #trial timing
    image_delay = randint(6, 15)
    print(image_delay)
    
    # keep track of which components have finished
    visual_2Components = [center_vis, arrow_image, resp_vis, feedback_vis]
    for thisComponent in visual_2Components:
        thisComponent.tStart = None
        thisComponent.tStop = None
        thisComponent.tStartRefresh = None
        thisComponent.tStopRefresh = None
        if hasattr(thisComponent, 'status'):
            thisComponent.status = NOT_STARTED
    # reset timers
    t = 0
    _timeToFirstFrame = win.getFutureFlipTime(clock="now")
    visual_2Clock.reset(-_timeToFirstFrame)  # t0 is time of first possible flip
    frameN = -1
    
    # -------Run Routine "visual_2"-------
    while continueRoutine:
        # get current time
        t = visual_2Clock.getTime()
        tThisFlip = win.getFutureFlipTime(clock=visual_2Clock)
        tThisFlipGlobal = win.getFutureFlipTime(clock=None)
        frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
        # update/draw components on each frame
        
        # *center_vis* updates
        if center_vis.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            center_vis.frameNStart = frameN  # exact frame index
            center_vis.tStart = t  # local t and not account for scr refresh
            center_vis.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(center_vis, 'tStartRefresh')  # time at next scr refresh
            center_vis.setAutoDraw(True)
        
        # *arrow_image* updates
        if arrow_image.status == NOT_STARTED and tThisFlip >= image_delay-frameTolerance:
            # keep track of start time/frame for later
            arrow_image.frameNStart = frameN  # exact frame index
            arrow_image.tStart = t  # local t and not account for scr refresh
            arrow_image.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(arrow_image, 'tStartRefresh')  # time at next scr refresh
            arrow_image.setAutoDraw(True)
        if arrow_image.status == STARTED:
            # is it time to stop? (based on global clock, using actual start)
            if tThisFlipGlobal > arrow_image.tStartRefresh + 0.5-frameTolerance:
                # keep track of stop time/frame for later
                arrow_image.tStop = t  # not accounting for scr refresh
                arrow_image.frameNStop = frameN  # exact frame index
                win.timeOnFlip(arrow_image, 'tStopRefresh')  # time at next scr refresh
                arrow_image.setAutoDraw(False)
        
        # *resp_vis* updates
        waitOnFlip = False
        if resp_vis.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            resp_vis.frameNStart = frameN  # exact frame index
            resp_vis.tStart = t  # local t and not account for scr refresh
            resp_vis.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(resp_vis, 'tStartRefresh')  # time at next scr refresh
            resp_vis.status = STARTED
            # keyboard checking is just starting
            waitOnFlip = True
            win.callOnFlip(resp_vis.clock.reset)  # t=0 on next screen flip
            win.callOnFlip(resp_vis.clearEvents, eventType='keyboard')  # clear events on next screen flip
        if resp_vis.status == STARTED and not waitOnFlip:
            theseKeys = resp_vis.getKeys(keyList=['up', 'down'], waitRelease=False)
            _resp_vis_allKeys.extend(theseKeys)
            if len(_resp_vis_allKeys):
                resp_vis.keys = _resp_vis_allKeys[-1].name  # just the last key pressed
                resp_vis.rt = _resp_vis_allKeys[-1].rt
                # was this correct?
                if (resp_vis.keys == str(correctAns)) or (resp_vis.keys == correctAns):
                    resp_vis.corr = 1
                else:
                    resp_vis.corr = 0
                # a response ends the routine
                continueRoutine = False
        
        # *feedback_vis* updates
        if feedback_vis.status == NOT_STARTED and resp_vis.status == STARTED:
            if  resp_vis.corr == 1 : # if correct ans given, then feedbackSquare is green 
                feedback_vis.setFillColor('green')
                feedback_vis.setLineColor('green')
            elif resp_vis.corr == 0: # else if correct ans not given, then feedbackSquare is red
                feedback_vis.setFillColor('red')
                feedback_vis.setLineColor('red') 

            # keep track of start time/frame for later
            feedback_vis.frameNStart = frameN  # exact frame index
            feedback_vis.tStart = t  # local t and not account for scr refresh
            feedback_vis.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(feedback_vis, 'tStartRefresh')  # time at next scr refresh
            feedback_vis.setAutoDraw(True)
        if feedback_vis.status == STARTED:
            # is it time to stop? (based on global clock, using actual start)
            if tThisFlipGlobal > feedback_vis.tStartRefresh + 0.5-frameTolerance:
                # keep track of stop time/frame for later
                feedback_vis.tStop = t  # not accounting for scr refresh
                feedback_vis.frameNStop = frameN  # exact frame index
                win.timeOnFlip(feedback_vis, 'tStopRefresh')  # time at next scr refresh
                feedback_vis.setAutoDraw(False)
        """
        # *feedback_vis* updates
        if feedback_vis.status == NOT_STARTED and resp_vis.status == STARTED:
            if  resp_vis.corr == 1 : # if correct ans given, then feedbackSquare is green 
                feedback_vis.setFillColor('green')
                feedback_vis.setLineColor('green')
            elif resp_vis.corr == 0: # else if correct ans not given, then feedbackSquare is red
                feedback_vis.setFillColor('red')
                feedback_vis.setLineColor('red') 
            # keep track of start time/frame for later
                feedback_vis.frameNStart = frameN  # exact frame index
                feedback_vis.tStart = t  # local t and not account for scr refresh
                feedback_vis.tStartRefresh = tThisFlipGlobal  # on global time
                win.timeOnFlip(feedback_vis, 'tStartRefresh')  # time at next scr refresh
                feedback_vis.setAutoDraw(True)
        if feedback_vis.status == STARTED:
                # is it time to stop? (based on global clock, using actual start)
                if tThisFlipGlobal > feedback_vis.tStartRefresh + 0.5-frameTolerance:
                    # keep track of stop time/frame for later
                    feedback_vis.tStop = t  # not accounting for scr refresh
                    feedback_vis.frameNStop = frameN  # exact frame index
                    win.timeOnFlip(feedback_vis, 'tStopRefresh')  # time at next scr refresh
                    feedback_vis.setAutoDraw(False)
        """
        
        
        # check for quit (typically the Esc key)
        if endExpNow or defaultKeyboard.getKeys(keyList=["escape"]):
            core.quit()
        
        # check if all components have finished
        if not continueRoutine:  # a component has requested a forced-end of Routine
            break
        continueRoutine = False  # will revert to True if at least one component still running
        for thisComponent in visual_2Components:
            if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                continueRoutine = True
                break  # at least one component has not yet finished
        
        # refresh the screen
        if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
            win.flip()
    
    # -------Ending Routine "visual_2"-------
    for thisComponent in visual_2Components:
        if hasattr(thisComponent, "setAutoDraw"):
            thisComponent.setAutoDraw(False)
    visualLoop.addData('center_vis.started', center_vis.tStartRefresh)
    visualLoop.addData('center_vis.stopped', center_vis.tStopRefresh)
    visualLoop.addData('arrow_image.started', arrow_image.tStartRefresh)
    visualLoop.addData('arrow_image.stopped', arrow_image.tStopRefresh)
    # check responses
    if resp_vis.keys in ['', [], None]:  # No response was made
        resp_vis.keys = None
        # was no response the correct answer?!
        if str(correctAns).lower() == 'none':
           resp_vis.corr = 1;  # correct non-response
        else:
           resp_vis.corr = 0;  # failed to respond (incorrectly)
    # store data for visualLoop (TrialHandler)
    visualLoop.addData('resp_vis.keys',resp_vis.keys)
    visualLoop.addData('resp_vis.corr', resp_vis.corr)
    if resp_vis.keys != None:  # we had a response
        visualLoop.addData('resp_vis.rt', resp_vis.rt)
    visualLoop.addData('resp_vis.started', resp_vis.tStartRefresh)
    visualLoop.addData('resp_vis.stopped', resp_vis.tStopRefresh)
    visualLoop.addData('feedback_vis.started', feedback_vis.tStartRefresh)
    visualLoop.addData('feedback_vis.stopped', feedback_vis.tStopRefresh)
    """
    visualLoop.addData('feedback_vis.started', feedback_vis.tStartRefresh)
    visualLoop.addData('feedback_vis.stopped', feedback_vis.tStopRefresh)
    """
    # the Routine "visual_2" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset()
    thisExp.nextEntry()
    
# completed 8.0 repeats of 'visualLoop'

# get names of stimulus parameters
if visualLoop.trialList in ([], [None], None):
    params = []
else:
    params = visualLoop.trialList[0].keys()
# save data for this loop
visualLoop.saveAsExcel(filename + '.xlsx', sheetName='visualLoop',
    stimOut=params,
    dataOut=['n','all_mean','all_std', 'all_raw'])

# ------Prepare to start Routine "instr_audio"-------
continueRoutine = True
# update component parameters for each repeat
key_resp_instructions.keys = []
key_resp_instructions.rt = []
_key_resp_instructions_allKeys = []
# keep track of which components have finished
instr_audioComponents = [audio_instructions, key_resp_instructions]
for thisComponent in instr_audioComponents:
    thisComponent.tStart = None
    thisComponent.tStop = None
    thisComponent.tStartRefresh = None
    thisComponent.tStopRefresh = None
    if hasattr(thisComponent, 'status'):
        thisComponent.status = NOT_STARTED
# reset timers
t = 0
_timeToFirstFrame = win.getFutureFlipTime(clock="now")
instr_audioClock.reset(-_timeToFirstFrame)  # t0 is time of first possible flip
frameN = -1

# -------Run Routine "instr_audio"-------
while continueRoutine:
    # get current time
    t = instr_audioClock.getTime()
    tThisFlip = win.getFutureFlipTime(clock=instr_audioClock)
    tThisFlipGlobal = win.getFutureFlipTime(clock=None)
    frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
    # update/draw components on each frame
    
    # *audio_instructions* updates
    if audio_instructions.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
        # keep track of start time/frame for later
        audio_instructions.frameNStart = frameN  # exact frame index
        audio_instructions.tStart = t  # local t and not account for scr refresh
        audio_instructions.tStartRefresh = tThisFlipGlobal  # on global time
        win.timeOnFlip(audio_instructions, 'tStartRefresh')  # time at next scr refresh
        audio_instructions.setAutoDraw(True)
    
    # *key_resp_instructions* updates
    waitOnFlip = False
    if key_resp_instructions.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
        # keep track of start time/frame for later
        key_resp_instructions.frameNStart = frameN  # exact frame index
        key_resp_instructions.tStart = t  # local t and not account for scr refresh
        key_resp_instructions.tStartRefresh = tThisFlipGlobal  # on global time
        win.timeOnFlip(key_resp_instructions, 'tStartRefresh')  # time at next scr refresh
        key_resp_instructions.status = STARTED
        # keyboard checking is just starting
        waitOnFlip = True
        win.callOnFlip(key_resp_instructions.clock.reset)  # t=0 on next screen flip
        win.callOnFlip(key_resp_instructions.clearEvents, eventType='keyboard')  # clear events on next screen flip
    if key_resp_instructions.status == STARTED and not waitOnFlip:
        theseKeys = key_resp_instructions.getKeys(keyList=None, waitRelease=False)
        _key_resp_instructions_allKeys.extend(theseKeys)
        if len(_key_resp_instructions_allKeys):
            key_resp_instructions.keys = _key_resp_instructions_allKeys[-1].name  # just the last key pressed
            key_resp_instructions.rt = _key_resp_instructions_allKeys[-1].rt
            # a response ends the routine
            continueRoutine = False
    
    # check for quit (typically the Esc key)
    if endExpNow or defaultKeyboard.getKeys(keyList=["escape"]):
        core.quit()
    
    # check if all components have finished
    if not continueRoutine:  # a component has requested a forced-end of Routine
        break
    continueRoutine = False  # will revert to True if at least one component still running
    for thisComponent in instr_audioComponents:
        if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
            continueRoutine = True
            break  # at least one component has not yet finished
    
    # refresh the screen
    if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
        win.flip()

# -------Ending Routine "instr_audio"-------
for thisComponent in instr_audioComponents:
    if hasattr(thisComponent, "setAutoDraw"):
        thisComponent.setAutoDraw(False)
thisExp.addData('audio_instructions.started', audio_instructions.tStartRefresh)
thisExp.addData('audio_instructions.stopped', audio_instructions.tStopRefresh)
# the Routine "instr_audio" was not non-slip safe, so reset the non-slip timer
routineTimer.reset()

# set up handler to look after randomisation of conditions etc
audioLoop = data.TrialHandler(nReps=8.0, method='fullRandom', 
    extraInfo=expInfo, originPath=-1,
    trialList=data.importConditions('../../../../Users/claireliu/Desktop/EXCEL/pitches.xlsx'),
    seed=None, name='audioLoop')
thisExp.addLoop(audioLoop)  # add the loop to the experiment
thisAudioLoop = audioLoop.trialList[0]  # so we can initialise stimuli with some values
# abbreviate parameter names if possible (e.g. rgb = thisAudioLoop.rgb)
if thisAudioLoop != None:
    for paramName in thisAudioLoop:
        exec('{} = thisAudioLoop[paramName]'.format(paramName))

for thisAudioLoop in audioLoop:
    currentLoop = audioLoop
    # abbreviate parameter names if possible (e.g. rgb = thisAudioLoop.rgb)
    if thisAudioLoop != None:
        for paramName in thisAudioLoop:
            exec('{} = thisAudioLoop[paramName]'.format(paramName))
    
    # ------Prepare to start Routine "audio"-------
    continueRoutine = True
    # update component parameters for each repeat
    sound_aud.setSound(pitch, secs=0.5, hamming=True)
    sound_aud.setVolume(1.0, log=False)
    resp_aud.keys = []
    resp_aud.rt = []
    _resp_aud_allKeys = []
    aud_delay = randint(6, 15)
    print(aud_delay)
    # keep track of which components have finished
    audioComponents = [sound_aud, resp_aud, center_aud, feedback_aud]
    for thisComponent in audioComponents:
        thisComponent.tStart = None
        thisComponent.tStop = None
        thisComponent.tStartRefresh = None
        thisComponent.tStopRefresh = None
        if hasattr(thisComponent, 'status'):
            thisComponent.status = NOT_STARTED
    # reset timers
    t = 0
    _timeToFirstFrame = win.getFutureFlipTime(clock="now")
    audioClock.reset(-_timeToFirstFrame)  # t0 is time of first possible flip
    frameN = -1
    
    # -------Run Routine "audio"-------
    while continueRoutine:
        # get current time
        t = audioClock.getTime()
        tThisFlip = win.getFutureFlipTime(clock=audioClock)
        tThisFlipGlobal = win.getFutureFlipTime(clock=None)
        frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
        # update/draw components on each frame
        # start/stop sound_aud
        if sound_aud.status == NOT_STARTED and t >= aud_delay-frameTolerance:
            # keep track of start time/frame for later
            sound_aud.frameNStart = frameN  # exact frame index
            sound_aud.tStart = t  # local t and not account for scr refresh
            sound_aud.tStartRefresh = tThisFlipGlobal  # on global time
            sound_aud.play()  # start the sound (it finishes automatically)
        if sound_aud.status == STARTED:
            # is it time to stop? (based on global clock, using actual start)
            if tThisFlipGlobal > sound_aud.tStartRefresh + 0.5-frameTolerance:
                # keep track of stop time/frame for later
                sound_aud.tStop = t  # not accounting for scr refresh
                sound_aud.frameNStop = frameN  # exact frame index
                win.timeOnFlip(sound_aud, 'tStopRefresh')  # time at next scr refresh
                sound_aud.stop()
        
        # *resp_aud* updates
        waitOnFlip = False
        if resp_aud.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            resp_aud.frameNStart = frameN  # exact frame index
            resp_aud.tStart = t  # local t and not account for scr refresh
            resp_aud.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(resp_aud, 'tStartRefresh')  # time at next scr refresh
            resp_aud.status = STARTED
            # keyboard checking is just starting
            waitOnFlip = True
            win.callOnFlip(resp_aud.clock.reset)  # t=0 on next screen flip
            win.callOnFlip(resp_aud.clearEvents, eventType='keyboard')  # clear events on next screen flip
        if resp_aud.status == STARTED and not waitOnFlip:
            theseKeys = resp_aud.getKeys(keyList=['up', 'down'], waitRelease=False)
            _resp_aud_allKeys.extend(theseKeys)
            if len(_resp_aud_allKeys):
                resp_aud.keys = _resp_aud_allKeys[-1].name  # just the last key pressed
                resp_aud.rt = _resp_aud_allKeys[-1].rt
                # was this correct?
                if (resp_aud.keys == str(correctAns)) or (resp_aud.keys == correctAns):
                    resp_aud.corr = 1
                else:
                    resp_aud.corr = 0
                # a response ends the routine
                continueRoutine = False
        
        # *center_aud* updates
        if center_aud.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            center_aud.frameNStart = frameN  # exact frame index
            center_aud.tStart = t  # local t and not account for scr refresh
            center_aud.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(center_aud, 'tStartRefresh')  # time at next scr refresh
            center_aud.setAutoDraw(True)
        
        # *feedback_aud* updates
        if feedback_aud.status == NOT_STARTED and resp_aud.status == STARTED:
            if  resp_aud.corr == 1 : # if correct ans given, then feedbackSquare is green 
                feedback_aud.setFillColor('green')
                feedback_aud.setLineColor('green')
            elif resp_aud.corr == 0: # else if correct ans not given, then feedbackSquare is red
                feedback_aud.setFillColor('red')
                feedback_aud.setLineColor('red') 

            # keep track of start time/frame for later
            feedback_aud.frameNStart = frameN  # exact frame index
            feedback_aud.tStart = t  # local t and not account for scr refresh
            feedback_aud.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(feedback_aud, 'tStartRefresh')  # time at next scr refresh
            feedback_aud.setAutoDraw(True)
        if feedback_aud.status == STARTED:
            # is it time to stop? (based on global clock, using actual start)
            if tThisFlipGlobal > feedback_aud.tStartRefresh + 0.5-frameTolerance:
                # keep track of stop time/frame for later
                feedback_aud.tStop = t  # not accounting for scr refresh
                feedback_aud.frameNStop = frameN  # exact frame index
                win.timeOnFlip(feedback_aud, 'tStopRefresh')  # time at next scr refresh
                feedback_aud.setAutoDraw(False)
        
        # check for quit (typically the Esc key)
        if endExpNow or defaultKeyboard.getKeys(keyList=["escape"]):
            core.quit()
        
        # check if all components have finished
        if not continueRoutine:  # a component has requested a forced-end of Routine
            break
        continueRoutine = False  # will revert to True if at least one component still running
        for thisComponent in audioComponents:
            if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                continueRoutine = True
                break  # at least one component has not yet finished
        
        # refresh the screen
        if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
            win.flip()
    
    # -------Ending Routine "audio"-------
    for thisComponent in audioComponents:
        if hasattr(thisComponent, "setAutoDraw"):
            thisComponent.setAutoDraw(False)
    sound_aud.stop()  # ensure sound has stopped at end of routine
    audioLoop.addData('sound_aud.started', sound_aud.tStart)
    audioLoop.addData('sound_aud.stopped', sound_aud.tStop)
    # check responses
    if resp_aud.keys in ['', [], None]:  # No response was made
        resp_aud.keys = None
        # was no response the correct answer?!
        if str(correctAns).lower() == 'none':
           resp_aud.corr = 1;  # correct non-response
        else:
           resp_aud.corr = 0;  # failed to respond (incorrectly)
    # store data for audioLoop (TrialHandler)
    audioLoop.addData('resp_aud.keys',resp_aud.keys)
    audioLoop.addData('resp_aud.corr', resp_aud.corr)
    if resp_aud.keys != None:  # we had a response
        audioLoop.addData('resp_aud.rt', resp_aud.rt)
    audioLoop.addData('resp_aud.started', resp_aud.tStartRefresh)
    audioLoop.addData('resp_aud.stopped', resp_aud.tStopRefresh)
    audioLoop.addData('center_aud.started', center_aud.tStartRefresh)
    audioLoop.addData('center_aud.stopped', center_aud.tStopRefresh)
    audioLoop.addData('feedback_aud.started', feedback_aud.tStartRefresh)
    audioLoop.addData('feedback_aud.stopped', feedback_aud.tStopRefresh)
    # the Routine "audio" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset()
    thisExp.nextEntry()
    
# completed 8.0 repeats of 'audioLoop'

# get names of stimulus parameters
if audioLoop.trialList in ([], [None], None):
    params = []
else:
    params = audioLoop.trialList[0].keys()
# save data for this loop
audioLoop.saveAsExcel(filename + '.xlsx', sheetName='audioLoop',
    stimOut=params,
    dataOut=['n','all_mean','all_std', 'all_raw'])

# ------Prepare to start Routine "thanks"-------
continueRoutine = True
routineTimer.add(2.000000)
# update component parameters for each repeat
# keep track of which components have finished
thanksComponents = [thanksMessage]
for thisComponent in thanksComponents:
    thisComponent.tStart = None
    thisComponent.tStop = None
    thisComponent.tStartRefresh = None
    thisComponent.tStopRefresh = None
    if hasattr(thisComponent, 'status'):
        thisComponent.status = NOT_STARTED
# reset timers
t = 0
_timeToFirstFrame = win.getFutureFlipTime(clock="now")
thanksClock.reset(-_timeToFirstFrame)  # t0 is time of first possible flip
frameN = -1

# -------Run Routine "thanks"-------
while continueRoutine and routineTimer.getTime() > 0:
    # get current time
    t = thanksClock.getTime()
    tThisFlip = win.getFutureFlipTime(clock=thanksClock)
    tThisFlipGlobal = win.getFutureFlipTime(clock=None)
    frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
    # update/draw components on each frame
    
    # *thanksMessage* updates
    if thanksMessage.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
        # keep track of start time/frame for later
        thanksMessage.frameNStart = frameN  # exact frame index
        thanksMessage.tStart = t  # local t and not account for scr refresh
        thanksMessage.tStartRefresh = tThisFlipGlobal  # on global time
        win.timeOnFlip(thanksMessage, 'tStartRefresh')  # time at next scr refresh
        thanksMessage.setAutoDraw(True)
    if thanksMessage.status == STARTED:
        # is it time to stop? (based on global clock, using actual start)
        if tThisFlipGlobal > thanksMessage.tStartRefresh + 2.0-frameTolerance:
            # keep track of stop time/frame for later
            thanksMessage.tStop = t  # not accounting for scr refresh
            thanksMessage.frameNStop = frameN  # exact frame index
            win.timeOnFlip(thanksMessage, 'tStopRefresh')  # time at next scr refresh
            thanksMessage.setAutoDraw(False)
    
    # check for quit (typically the Esc key)
    if endExpNow or defaultKeyboard.getKeys(keyList=["escape"]):
        core.quit()
    
    # check if all components have finished
    if not continueRoutine:  # a component has requested a forced-end of Routine
        break
    continueRoutine = False  # will revert to True if at least one component still running
    for thisComponent in thanksComponents:
        if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
            continueRoutine = True
            break  # at least one component has not yet finished
    
    # refresh the screen
    if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
        win.flip()

# -------Ending Routine "thanks"-------
for thisComponent in thanksComponents:
    if hasattr(thisComponent, "setAutoDraw"):
        thisComponent.setAutoDraw(False)
thisExp.addData('thanksMessage.started', thanksMessage.tStartRefresh)
thisExp.addData('thanksMessage.stopped', thanksMessage.tStopRefresh)

# Flip one final time so any remaining win.callOnFlip() 
# and win.timeOnFlip() tasks get executed before quitting
win.flip()

# these shouldn't be strictly necessary (should auto-save)
thisExp.saveAsWideText(filename+'.csv', delim='comma')
thisExp.saveAsPickle(filename)
logging.flush()
# make sure everything is closed down
thisExp.abort()  # or data files will save again on exit
win.close()
core.quit()
