const ipc = require('electron').ipcRenderer

const trayBtn = document.getElementById('put-in-tray')

const reloadBtn = document.getElementById('reload')
let trayOn = false
reloadBtn.addEventListener('click', function(){
  ipc.send('reload')
})
const clearBtn = document.getElementById('clearlist')
clearBtn.addEventListener('click', function(){
  saveToLocal(screct, "alarms", null);
  ipc.send('reload')
})
trayBtn.addEventListener('click', function (event) {
  if (trayOn) {
    trayOn = false
    document.getElementById('tray-countdown').innerHTML = 'access_alarm'
    ipc.send('remove-tray')
  } else {
    trayOn = true
    document.getElementById('tray-countdown').innerHTML = 'cancel'
    ipc.send('put-in-tray')
  }
})
// Tray removed from context menu on icon
ipc.on('tray-removed', function () {
  ipc.send('remove-tray')
  trayOn = false
  document.getElementById('tray-countdown').innerHTML = 'access_alarm'
})