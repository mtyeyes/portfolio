// Download by click
//----------------------------------------

document.querySelector('.download__btn').addEventListener('click', function(event) {
  window.open('/overlay-infuser.zip');
});

// script to clipboard
//----------------------------------------

let toClipboardBtn = document.querySelector('.copy-script__btn')

btnToggleState = (state, phrase) => {
  toClipboardBtn.classList.remove('copy-script__btn--working');
  toClipboardBtn.classList.add(state);
  document.querySelector('.copy-script__instructions').textContent = phrase;
  setTimeout(function(){
    toClipboardBtn.classList.remove(state);
    toClipboardBtn.disabled = false;
    document.querySelector('.copy-script__instructions').textContent = 'Use this button to copy script to the clipboard'
  }, 1500);
};

getScript = () => {
  fetch('js/infuser.js')
  .then(
    function(response) {
      if (response.status !== 200) {
        btnToggleState('copy-script__btn--fail', 'Something went wrong');
        return;
      }
      response.text().then(function(data) {
        textToClipboard(data);
        btnToggleState('copy-script__btn--success', 'Script successfully copied to your clipboard');
      });
    }
  )
  .catch(function() {
    btnToggleState('copy-script__btn--fail', 'Something went wrong');
  });
}

textToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

scriptToClipboard = () => {
  toClipboardBtn.disabled = true;
  toClipboardBtn.classList.add('copy-script__btn--working');
  getScript();
}

toClipboardBtn.addEventListener ('click', function(event) {
  scriptToClipboard()
});

// theme switch
//----------------------------------------

let themesStyles = {
  light : {
    '--theme': ' light',
    '--background-color': '#ffffff',
    '--background-dark-color': '#F5F5F5',
    '--border-color': '#EAEAEA',
    '--font-color': '#2E2F3E',
    '--main-color': '#007DB5',
    '--accent-color': '#E95420',
    '--icon-switch' : '0'
  },
  dark : {
    '--theme': ' dark',
    '--background-color': '#282C34',
    '--background-dark-color': '#21252B',
    '--border-color': '#1D1F23',
    '--font-color': '#ABB2BF',
    '--main-color': '#D19A66',
    '--accent-color': '#98C379',
    '--icon-switch' : '100%'
  }
};

setTheme = (theme) => {
  let styles = document.documentElement.style;
  if (theme === ' light') {
    let stylesToApply = Object.keys(themesStyles.light);
    for (let i = 0; i < stylesToApply.length; i++) {
      styles.setProperty(stylesToApply[i], themesStyles.light[stylesToApply[i]]);
    }
    localStorage.setItem('theme', ' light');
  } else {
    let stylesToApply = Object.keys(themesStyles.dark);
    for (let i = 0; i < stylesToApply.length; i++) {
      styles.setProperty(stylesToApply[i], themesStyles.dark[stylesToApply[i]]);
    }
    localStorage.setItem('theme', ' dark');
  };
};

changeTheme = () => {
  if (localStorage.getItem('theme')) {
    currentTheme = localStorage.getItem('theme');
  } else {
    currentTheme = getComputedStyle(document.documentElement).getPropertyValue('--theme');
  };
  (currentTheme === ' light') ? setTheme(' dark') : setTheme(' light');
};

document.querySelector('.settings__theme-btn').addEventListener ('click', function(event){
  changeTheme();
});

if (localStorage.getItem('theme')) { setTheme(localStorage.getItem('theme')) };

// show/hide instructions text
//----------------------------------------

let instructionToggleBtn = document.querySelector ('.instruction__toggle-btn');
let instructions = document.querySelector('.instruction__container');

instructionToggleBtn.addEventListener ('click', function(event) {
  instructions.classList.toggle('instruction__container--show');
  instructionToggleBtn.classList.toggle('instruction__toggle-btn--clicked');
});