var modal = document.getElementById("myModal");

var btn = document.getElementById("myBtn");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


let lightMode = localStorage.getItem('lightMode'); 

const lightModeToggle = document.querySelector('#light-mode-toggle');

const enableLightMode = () => {
  document.body.classList.add('lightmode');
  localStorage.setItem('lightMode', 'enabled');
}

const disableLightMode = () => {
  document.body.classList.remove('lightmode');
  localStorage.setItem('lightMode', null);
}
 
if (lightMode === 'enabled') {
  enableLightMode();
}

lightModeToggle.addEventListener('click', () => {

  lightMode = localStorage.getItem('lightMode'); 
  
  if (lightMode !== 'enabled') {
    enableLightMode(); 
  } else {  
    disableLightMode(); 
  }
});

let oledMode = localStorage.getItem('oledMode'); 

const oledModeToggle = document.querySelector('#oled-mode-toggle');

const enableOledMode = () => {
  document.body.classList.add('oledmode');
  localStorage.setItem('oledMode', 'enabled');
}

const disableOledMode = () => {
  document.body.classList.remove('oledmode');
  localStorage.setItem('oledMode', null);
}
 
if (oledMode === 'enabled') {
  enableOledMode();
}

oledModeToggle.addEventListener('click', () => {

  oledMode = localStorage.getItem('oledMode'); 
  
  if (oledMode !== 'enabled') {
    enableOledMode(); 
  } else {  
    disableOledMode(); 
  }
});