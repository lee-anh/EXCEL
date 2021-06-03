#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
This experiment was created using PsychoPy3 Experiment Builder (v2021.1.4),
    on Thu Jun  3 09:16:33 2021
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
    text='Press up arrow when you hear high pitch\nPress down arrow when you hear low pitch\n\nPress any key to continue',
    font='Open Sans',
    pos=(0, 0), height=0.1, wrapWidth=None, ori=0.0, 
    color='white', colorSpace='rgb', opacity=None, 
    languageStyle='LTR',
    depth=0.0);
key_resp = keyboard.Keyboard()

# Initialize components for Routine "visual_2"
visual_2Clock = core.Clock()
centerSquare = visual.Rect(
    win=win, name='centerSquare',
    width=(0.15, 0.15)[0], height=(0.15, 0.15)[1],
    ori=0.0, pos=(0, 0),
    lineWidth=1.0,     colorSpace='rgb',  lineColor='white', fillColor='white',
    opacity=None, depth=0.0, interpolate=True)
arrowImage = visual.ImageStim(
    win=win,
    name='arrowImage', 
    image='sin', mask=None,
    ori=0.0, pos=(0, 0), size=(0.15, 0.15),
    color=[1,1,1], colorSpace='rgb', opacity=None,
    flipHoriz=False, flipVert=False,
    texRes=128.0, interpolate=True, depth=-1.0)
key_resp_2 = keyboard.Keyboard()
feedbackSquare = visual.Rect(
    win=win, name='feedbackSquare',
    width=(0.15, 0.15)[0], height=(0.15, 0.15)[1],
    ori=1.0, pos=(0, 0),
    lineWidth=1.0,     colorSpace='rgb',  lineColor='white', fillColor='white',
    opacity=None, depth=-3.0, interpolate=True)

# Initialize components for Routine "audio"
audioClock = core.Clock()
sound_1 = sound.Sound('A', secs=0.5, stereo=True, hamming=True,
    name='sound_1')
sound_1.setVolume(1.0)
response = keyboard.Keyboard()
square = visual.Rect(
    win=win, name='square',
    width=(0.15, 0.15)[0], height=(0.15, 0.15)[1],
    ori=0.0, pos=(0, 0),
    lineWidth=1.0,     colorSpace='rgb',  lineColor='white', fillColor='white',
    opacity=None, depth=-2.0, interpolate=True)

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
# check responses
if key_resp.keys in ['', [], None]:  # No response was made
    key_resp.keys = None
thisExp.addData('key_resp.keys',key_resp.keys)
if key_resp.keys != None:  # we had a response
    thisExp.addData('key_resp.rt', key_resp.rt)
thisExp.addData('key_resp.started', key_resp.tStartRefresh)
thisExp.addData('key_resp.stopped', key_resp.tStopRefresh)
thisExp.nextEntry()
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
    arrowImage.setImage(condition)
    key_resp_2.keys = []
    key_resp_2.rt = []
    _key_resp_2_allKeys = []
    feedbackSquare.setFillColor('yellow')
    feedbackSquare.setOri(0.0)
    feedbackSquare.setLineColor('yellow')
    # keep track of which components have finished
    visual_2Components = [centerSquare, arrowImage, key_resp_2, feedbackSquare]
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
        
        # *centerSquare* updates
        if centerSquare.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            centerSquare.frameNStart = frameN  # exact frame index
            centerSquare.tStart = t  # local t and not account for scr refresh
            centerSquare.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(centerSquare, 'tStartRefresh')  # time at next scr refresh
            centerSquare.setAutoDraw(True)
        
        # *arrowImage* updates
        if arrowImage.status == NOT_STARTED and tThisFlip >= randint(6, 15)-frameTolerance:
            # keep track of start time/frame for later
            arrowImage.frameNStart = frameN  # exact frame index
            arrowImage.tStart = t  # local t and not account for scr refresh
            arrowImage.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(arrowImage, 'tStartRefresh')  # time at next scr refresh
            arrowImage.setAutoDraw(True)
        if arrowImage.status == STARTED:
            # is it time to stop? (based on global clock, using actual start)
            if tThisFlipGlobal > arrowImage.tStartRefresh + 0.5-frameTolerance:
                # keep track of stop time/frame for later
                arrowImage.tStop = t  # not accounting for scr refresh
                arrowImage.frameNStop = frameN  # exact frame index
                win.timeOnFlip(arrowImage, 'tStopRefresh')  # time at next scr refresh
                arrowImage.setAutoDraw(False)
        
        # *key_resp_2* updates
        waitOnFlip = False
        if key_resp_2.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            key_resp_2.frameNStart = frameN  # exact frame index
            key_resp_2.tStart = t  # local t and not account for scr refresh
            key_resp_2.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(key_resp_2, 'tStartRefresh')  # time at next scr refresh
            key_resp_2.status = STARTED
            # keyboard checking is just starting
            waitOnFlip = True
            win.callOnFlip(key_resp_2.clock.reset)  # t=0 on next screen flip
            win.callOnFlip(key_resp_2.clearEvents, eventType='keyboard')  # clear events on next screen flip
        #last_key_resp = -1;
        if key_resp_2.status == STARTED and not waitOnFlip:
            theseKeys = key_resp_2.getKeys(keyList=['up', 'down'], waitRelease=False)
            _key_resp_2_allKeys.extend(theseKeys)
            if len(_key_resp_2_allKeys):
                key_resp_2.keys = _key_resp_2_allKeys[-1].name  # just the last key pressed
                key_resp_2.rt = _key_resp_2_allKeys[-1].rt
                # was this correct?
                if (key_resp_2.keys == str(correctAns)) or (key_resp_2.keys == correctAns):
                    key_resp_2.corr = 1
                    #last_key_resp = key_resp_2.corr
                else:
                    key_resp_2.corr = 0
                    #last_key_resp = key_resp_2.corr
                # a response ends the routine
                continueRoutine = False
        
        # *feedbackSquare* updates
        if feedbackSquare.status == NOT_STARTED and key_resp_2.status == STARTED:
            # set the correct colors
            if  key_resp_2.corr ==1 : # if correct ans given, then feedbackSquare is green 
                feedbackSquare.setFillColor('green')
                feedbackSquare.setLineColor('green')
            elif key_resp_2.corr == 0: # else if correct ans not given, then feedbackSquare is red
                feedbackSquare.setFillColor('red')
                feedbackSquare.setLineColor('red')
            
            # keep track of start time/frame for later
            feedbackSquare.frameNStart = frameN  # exact frame index
            feedbackSquare.tStart = t  # local t and not account for scr refresh
            feedbackSquare.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(feedbackSquare, 'tStartRefresh')  # time at next scr refresh
            feedbackSquare.setAutoDraw(True)
            
        if feedbackSquare.status == STARTED:
            # is it time to stop? (based on global clock, using actual start)
            if tThisFlipGlobal > feedbackSquare.tStartRefresh + 0.5-frameTolerance:
                # keep track of stop time/frame for later
                feedbackSquare.tStop = t  # not accounting for scr refresh
                feedbackSquare.frameNStop = frameN  # exact frame index
                win.timeOnFlip(feedbackSquare, 'tStopRefresh')  # time at next scr refresh
                feedbackSquare.setAutoDraw(False)
        
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
    visualLoop.addData('centerSquare.started', centerSquare.tStartRefresh)
    visualLoop.addData('centerSquare.stopped', centerSquare.tStopRefresh)
    visualLoop.addData('arrowImage.started', arrowImage.tStartRefresh)
    visualLoop.addData('arrowImage.stopped', arrowImage.tStopRefresh)
    # check responses
    if key_resp_2.keys in ['', [], None]:  # No response was made
        key_resp_2.keys = None
        # was no response the correct answer?!
        if str(correctAns).lower() == 'none':
           key_resp_2.corr = 1;  # correct non-response
        else:
           key_resp_2.corr = 0;  # failed to respond (incorrectly)
    # store data for visualLoop (TrialHandler)
    visualLoop.addData('key_resp_2.keys',key_resp_2.keys)
    visualLoop.addData('key_resp_2.corr', key_resp_2.corr)
    if key_resp_2.keys != None:  # we had a response
        visualLoop.addData('key_resp_2.rt', key_resp_2.rt)
        
    visualLoop.addData('key_resp_2.started', key_resp_2.tStartRefresh)
    visualLoop.addData('key_resp_2.stopped', key_resp_2.tStopRefresh)
    visualLoop.addData('feedbackSquare.started', feedbackSquare.tStartRefresh)
    visualLoop.addData('feedbackSquare.stopped', feedbackSquare.tStopRefresh)
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
    sound_1.setSound(pitch, secs=0.5, hamming=True)
    sound_1.setVolume(1.0, log=False)
    response.keys = []
    response.rt = []
    _response_allKeys = []
    # keep track of which components have finished
    audioComponents = [sound_1, response, square]
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
        # start/stop sound_1
        if sound_1.status == NOT_STARTED and t >= randint(3, 7.5)-frameTolerance:
            # keep track of start time/frame for later
            sound_1.frameNStart = frameN  # exact frame index
            sound_1.tStart = t  # local t and not account for scr refresh
            sound_1.tStartRefresh = tThisFlipGlobal  # on global time
            sound_1.play()  # start the sound (it finishes automatically)
        if sound_1.status == STARTED:
            # is it time to stop? (based on global clock, using actual start)
            if tThisFlipGlobal > sound_1.tStartRefresh + 0.5-frameTolerance:
                # keep track of stop time/frame for later
                sound_1.tStop = t  # not accounting for scr refresh
                sound_1.frameNStop = frameN  # exact frame index
                win.timeOnFlip(sound_1, 'tStopRefresh')  # time at next scr refresh
                sound_1.stop()
        
        # *response* updates
        waitOnFlip = False
        if response.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            response.frameNStart = frameN  # exact frame index
            response.tStart = t  # local t and not account for scr refresh
            response.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(response, 'tStartRefresh')  # time at next scr refresh
            response.status = STARTED
            # keyboard checking is just starting
            waitOnFlip = True
            win.callOnFlip(response.clock.reset)  # t=0 on next screen flip
            win.callOnFlip(response.clearEvents, eventType='keyboard')  # clear events on next screen flip
        if response.status == STARTED and not waitOnFlip:
            theseKeys = response.getKeys(keyList=['up', 'down'], waitRelease=False)
            _response_allKeys.extend(theseKeys)
            if len(_response_allKeys):
                response.keys = _response_allKeys[-1].name  # just the last key pressed
                response.rt = _response_allKeys[-1].rt
                # was this correct?
                if (response.keys == str(correctAns)) or (response.keys == correctAns):
                    response.corr = 1
                else:
                    response.corr = 0
                # a response ends the routine
                continueRoutine = False
        
        # *square* updates
        if square.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            square.frameNStart = frameN  # exact frame index
            square.tStart = t  # local t and not account for scr refresh
            square.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(square, 'tStartRefresh')  # time at next scr refresh
            square.setAutoDraw(True)
        
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
    sound_1.stop()  # ensure sound has stopped at end of routine
    audioLoop.addData('sound_1.started', sound_1.tStart)
    audioLoop.addData('sound_1.stopped', sound_1.tStop)
    # check responses
    if response.keys in ['', [], None]:  # No response was made
        response.keys = None
        # was no response the correct answer?!
        if str(correctAns).lower() == 'none':
           response.corr = 1;  # correct non-response
        else:
           response.corr = 0;  # failed to respond (incorrectly)
    # store data for audioLoop (TrialHandler)
    audioLoop.addData('response.keys',response.keys)
    audioLoop.addData('response.corr', response.corr)
    if response.keys != None:  # we had a response
        audioLoop.addData('response.rt', response.rt)
    audioLoop.addData('response.started', response.tStartRefresh)
    audioLoop.addData('response.stopped', response.tStopRefresh)
    audioLoop.addData('square.started', square.tStartRefresh)
    audioLoop.addData('square.stopped', square.tStopRefresh)
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
