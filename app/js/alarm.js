'use strict';
// Alarm count limit
const alarmlimit = 3;
var now = 1;
var screct = "lanseria";
// Alarm sound
var alarmSound = new Audio('./wav/alarm.mp3');
var localData = loadFromLocal(screct, "alarms", null);

function timepickerInit(){
  $('.timepicker').timepicker({
    'minTime': new Date(),
    'showDuration': true
  })
}
function alarminit(){
  alarmSound.volume = 0.3;

  var alarmIntervals = [],      // Our setInterval variable for controlling the loop.
      alarmTimes = [],          // The time the alarm is set to.
      alarmSounds = [],
      alarmsStatuses = []
  var alarmInputs = $('.timepicker');
  var alarmButtons = $('.alarm-btn');
  var alarmSoundsButtons = $('.alarm-sounds');

  alarmIntervals.push(0);
  alarmTimes.push(new Date());
  alarmSounds.push(true);
  alarmsStatuses.push(false);

  // saveToLocal(screct, "alarms", localData)

  localData = loadFromLocal(screct, "alarms", null);

  console.log(localData);

  if(localData){
    alarmIntervals = localData.alarmIntervals
    alarmTimes = localData.alarmTimes
    alarmSounds = localData.alarmSounds
    alarmsStatuses = localData.alarmsStatuses

    alarmIntervals.forEach(function(index, item){
      if(index === 0){
        
      }else{
        add_alarm(index);
      }
    })
    
    alarmButtons.each(function() {
      $(this).prop("disabled", false)
    }, this);
    alarmInputs.each(function(index, i){
      var thisid = $(this).attr("id");
      var alarmTime = new Date(alarmTimes[index])
      $('#'+thisid).timepicker('setTime', alarmTime)
    }, this)
    alarmSoundsButtons.each(function(index, i){
      $(this).prop('checked', alarmSounds[index])
    }, this)
    alarmsStatuses.forEach(function(item, i){
      if(item){
        turnAlarmOn(i);
      }else{
        turnAlarmOff(i);
      }
    }, this)
  }else{
    localData = {
      alarmIntervals: alarmIntervals,
      alarmTimes: alarmTimes,
      alarmSounds: alarmSounds,
      alarmsStatuses: alarmsStatuses
    }
    saveToLocal(screct, "alarms", localData)
  }
  alarmInputs.each(function(index, item){
    $(this).on('change', function(){
      alarmTimes[index] = $(this).timepicker('getTime', new Date())
      if (alarmTimes[index]) {
        alarmButtons[index].disabled = false
        localData.alarmTimes[index] = alarmTimes[index]
        saveToLocal(screct, "alarms", localData)
      }
      else{
        alarmButtons[index].disabled = true
        localData.alarmTimes[index] = null
        saveToLocal(screct, "alarms", localData)
      }
    })
  }, this)
  alarmButtons.each(function(index, item){
    item.checked = localData.alarmsStatuses[index]
    $(this).on('click', function(e){
      if($(this).prop('checked')){
        turnAlarmOn(index)
      }
      else{
        turnAlarmOff(index)
      }
    })
  })
  alarmSoundsButtons.each(function(index, item){
    var that = this;
    var currentTime = 0;
    $(this).on("click", function(e){
      localData.alarmSounds[index] = that.checked;
      saveToLocal(screct, "alarms", localData)
      if(localData.alarmsStatuses[index]){
        if(!that.checked){
          alarmSound.pause();
          currentTime = alarmSound.currentTime;
          alarmSound.currentTime = 0;
        }else{
          alarmSound.currentTime = currentTime;
          alarmSound.play();
        }
      }
    })
  }, this)

  function turnAlarmOn(i){
    // Prevent setting multiple intervals
    clearInterval(alarmIntervals[i])
    localData.alarmsStatuses[i] = true;
    saveToLocal(screct, "alarms", localData)
    alarmIntervals[i] = setInterval(function(){
      if (checkTime(i)) {
        if(alarmSounds[i] == true){
          alarmSound.play()
        }
        turnAlarmOver(i);
      }
    }, 1000)

    alarmInputs[i].disabled = true
    alarmButtons[i].checked = true
  }
  function turnAlarmOff(i){
    clearInterval(alarmIntervals[i])
    localData.alarmsStatuses[i] = false
    saveToLocal(screct, "alarms", localData)
    alarmInputs[i].disabled = false
    // alarmButtons[i].checked = false
  }
  function turnAlarmOver(i){
    clearInterval(alarmIntervals[i])
  }
  function checkTime(i){
    var hour = new Date(alarmTimes[i]).getHours(),
      minute = new Date(alarmTimes[i]).getMinutes(),
      date,
      currentHours,
      currentMin;
    date = new Date()
    currentHours = date.getHours()
    currentMin = date.getMinutes()
    if(hour == currentHours && minute == currentMin && alarmsStatuses[i]){
      return true;
    }else{
      return false;
    }
  }
  timepickerInit();
}

function add_alarm(){
  if(now>=alarmlimit){
    alert("已达上限");
    return false;
  }
  var div_main = document.createElement("div");
  div_main.setAttribute("class", "card-panel col offset-s1 s10 hoverable z-depth-2");
  var div_inputfield = document.createElement("div");
  div_inputfield.setAttribute("class", "control input-field");
  var label = document.createElement("label");
  label.setAttribute("for", "alarmtime"+now);
  label.append(now+'time');
  var input = document.createElement("input");
  input.setAttribute("id", "alarmtime"+now);
  input.setAttribute("type", "text");
  input.setAttribute("class", "timepicker");
  div_inputfield.append(label);div_inputfield.append(input);
  div_main.append(div_inputfield);
  var divswitch = document.createElement("div");
  divswitch.setAttribute("class", "control switch");
  label = document.createElement("label");
  label.append("Off");
  input = document.createElement("input");
  input.setAttribute("type","checkbox");
  input.setAttribute("class", "alarm-btn");
  label.append(input);
  var span = document.createElement("span");
  span.setAttribute("class", "lever");
  label.append(span);
  label.append("On");
  divswitch.append(label);
  div_main.append(divswitch);
  var div_control = document.createElement("div");
  div_control.setAttribute("class", "control");
  input = document.createElement("input");
  input.setAttribute("id", "alasoundbtn"+now);
  input.setAttribute("type", "checkbox");
  input.setAttribute("class", "alarm-sounds");
  input.setAttribute("checked", "checked")
  label = document.createElement("label");
  label.setAttribute("for", "alasoundbtn"+now);
  label.append("Sound");
  div_control.append(input);div_control.append(label);
  div_main.append(div_control);
  $('#alarmpanel').append(div_main);
  alarminit();
  timepickerInit();
  now ++;
  console.log(localData);
}
alarminit();