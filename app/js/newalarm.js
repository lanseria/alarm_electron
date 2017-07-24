'use strict';
const ipc = require('electron').ipcRenderer
// Alarm count limit
const alarmlimit = 3;
var now = 1;
// Screct
var screct = "lanseria";
// Alarm sound
var alarmSound = new Audio('./wav/alarm.mp3');
alarmSound.volume = 0.3;
var currentTime = 0;
// elements
var alarmInputs;
var alarmButtons;
var alarmSoundsButtons; 
// Read lacalStore
// saveToLocal(screct, "alarms", null);
var localData = loadFromLocal(screct, "alarms", null);
// prototype
function Adata(){
  alarms: []
}
var alarms = [];
if (localData) {
  var alarms = localData.alarms;
  alarms.forEach(function(val, index){
    if(index === 0){
      alarminit(index);
    }
    else{
      alarmadd(index);
    }
  })
} else {
  localData = new Adata();
  var alarm = {
    alarmInterval: 0,
    alarmTime: new Date(),
    hasalarmSound: true,
    alarmsStatus: false
  }
  alarms.push(alarm);
  alarminit(0)
}
function timepickerinit(){
  $('.timepicker').timepicker({
    'minTime': new Date(),
    'showDuration': true
  })
}
function alarminit(index){
  timepickerinit();
  // Get all controller
  alarmInputs = $('.timepicker');
  alarmButtons = $('.alarm-btn');
  alarmSoundsButtons = $('.alarm-sounds');
  // to controll some one
  // alarmInputs[index];
  // alarmButtons[index];
  // alarmSoundsButtons[index];
  // data from
  // alarms[index].alarmInterval
  alarmButtons[index].disabled = false;
  alarmButtons[index].checked = alarms[index].alarmsStatus;

  var id = alarmInputs[index].id;
  $('#'+id).timepicker('setTime', new Date(alarms[index].alarmTime));

  alarmSoundsButtons[index].checked = alarms[index].hasalarmSound

  if(alarms[index].alarmsStatus){
    turnAlarmOn(index);
  }else{
    turnAlarmOff(index);
  }
  // it must be use jQuery here, otherwise you can't use `changeTime` property
  var alarmInput = $(alarmInputs[index]);
  alarmInput.on('changeTime', function(){
    alarms[index].alarmTime = $(this).timepicker('getTime', new Date());
    saveAlarm(index);
    if (alarms[index].alarmTime) {
      alarmButtons[index].disabled = false;
    } else {
      alarmButtons[index].disabled = true;
    }
  })
  // alarmInputs[index].addEventListener('change', function(){
  //   alarms[index].alarmTime = $(this).timepicker('getTime', new Date());
  //   saveAlarm(index);
  //   if (alarms[index].alarmTime) {
  //     alarmButtons[index].disabled = false;
  //   } else {
  //     alarmButtons[index].disabled = true;
  //   }
  // })
  alarmButtons[index].addEventListener('click', function(){
    if (alarmButtons[index].checked) {
      turnAlarmOn(index);
    }else{
      turnAlarmOff(index);
    }
  })
  alarmSoundsButtons[index].addEventListener('click', function(el){
    var checked = alarmSoundsButtons[index].checked;
    alarms[index].hasalarmSound = checked;
    saveAlarm(index);
    if (alarms[index].alarmsStatus) {
      if(!checked){
        alarmSound.pause();
        currentTime = alarmSound.currentTime;
        alarmSound.currentTime = 0;
      }else{
        alarmSound.currentTime = currentTime;
        alarmSound.play();
      }
    }
  })
}
function turnAlarmOn(index){
  // Prevent setting multiple intervals
  clearInterval(alarms[index].alarmInterval)
  alarms[index].alarmsStatus = true;
  saveAlarm(index);
  alarms[index].alarmInterval = setInterval(function(){
    // console.log(checkTime(index))
    if (checkTime(index)) {
      if(alarms[index].hasalarmSound == true){
        alarmSound.play()
      }
      turnAlarmOver(index);
    }
  }, 1000)

  alarmInputs[index].disabled = true
  alarmButtons[index].checked = true
}
function turnAlarmOff(index){
  clearInterval(alarms[index].alarmInterval);
  alarms[index].alarmsStatus = false;
  saveAlarm(index);
  alarmInputs[index].disabled = false;
  // alarmButtons[i].checked = false
}
function turnAlarmOver(index){
  clearInterval(alarms[index].alarmInterval)
}
function checkTime(index){
  var hour = new Date(alarms[index].alarmTime).getHours(),
      minute = new Date(alarms[index].alarmTime).getMinutes(),
      date,
      currentHours,
      currentMin;
  date = new Date()
  currentHours = date.getHours()
  currentMin = date.getMinutes()
  if(hour == currentHours && minute == currentMin && alarms[index].alarmsStatus){
    return true;
  }else{
    return false;
  }
}
function alarmadd(index){
  if(index==undefined){
    index = now;
    if( now > 3){
      alert('已超过限制，不能再添加');
      return false;
    }else{
      var alarm = {
        alarmInterval: 0,
        alarmTime: new Date(),
        hasalarmSound: true,
        alarmsStatus: false
      }
    alarms.push(alarm);
    }
  }else if(index > 3){
    alert('已超过限制，不能再添加');
    return false;
  }
  now ++;
  var div_main = document.createElement("div");
  div_main.setAttribute("class", "card-panel col offset-s1 s10 hoverable z-depth-2");
  var div_inputfield = document.createElement("div");
  div_inputfield.setAttribute("class", "control input-field");
  var label = document.createElement("label");
  label.setAttribute("for", "alarmtime"+index);
  label.setAttribute("class", "active");
  label.append(index+'time');
  var input = document.createElement("input");
  input.setAttribute("id", "alarmtime"+index);
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
  input.setAttribute("id", "alasoundbtn"+index);
  input.setAttribute("type", "checkbox");
  input.setAttribute("class", "alarm-sounds");
  input.setAttribute("checked", "checked")
  label = document.createElement("label");
  label.setAttribute("for", "alasoundbtn"+index);
  label.append("Sound");
  div_control.append(input);div_control.append(label);
  div_main.append(div_control);
  $('#alarmpanel').append(div_main);
  alarminit(index);
}
function saveAlarm(index){
  // console.log(alarms, localData);
  localData.alarms = alarms;
  saveToLocal(screct, "alarms", localData)
}