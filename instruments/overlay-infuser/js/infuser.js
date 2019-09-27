( function() {
  var overlay = document.createElement('img');
  var overlayInformation = document.createElement('div');
  var overlayHelp = document.createElement('div');
  var overlayInformationTimeout;
  var overlaySrc;
  var pressedKeys = [];
  var blockedKeys = [ 17, 33, 34, 36, 37, 38, 39, 40, 46 ];
  var keyCodeToCode = {
    '17' : 'ControlLeft',
    '33' : 'PageUp',
    '34' : 'PageDown',
    '36' : 'Home',
    '37' : 'ArrowLeft',
    '38' : 'ArrowUp',
    '39' : 'ArrowRight',
    '40' : 'ArrowDown',
    '46' : 'Delete',
    '188' : 'Comma',
    '190' : 'Period',
    '191' : 'Slash',
    '192' : 'Backquote'
  };
  var controls = [
    {
      check : function() { return (pressedKeys.indexOf('ArrowRight') !== -1) && (pressedKeys.indexOf('ControlLeft') !== -1); },
      result : function() { changeCoordinates ('horizontal', 10); }
    },
    {
      check : function() { return (pressedKeys.indexOf('ArrowRight') !== -1); },
      result : function() { changeCoordinates ('horizontal', 1); }
    },
    {
      check : function() { return (pressedKeys.indexOf('ArrowLeft') !== -1) && (pressedKeys.indexOf('ControlLeft') !== -1); },
      result : function() { changeCoordinates ('horizontal', -10); }
    },
    {
      check : function() { return (pressedKeys.indexOf('ArrowLeft') !== -1); },
      result : function() { changeCoordinates ('horizontal', -1); }
    },
    {
      check : function() { return (pressedKeys.indexOf('ArrowUp') !== -1) && (pressedKeys.indexOf('ControlLeft') !== -1); },
      result : function() { changeCoordinates ('vertical', -10); }
    },
    {
      check : function() { return (pressedKeys.indexOf('ArrowUp') !== -1); },
      result : function() { changeCoordinates ('vertical', -1); }
    },
    {
      check : function() { return (pressedKeys.indexOf('ArrowDown') !== -1) && (pressedKeys.indexOf('ControlLeft') !== -1); },
      result : function() { changeCoordinates ('vertical', 10); }
    },
    {
      check : function() { return (pressedKeys.indexOf('ArrowDown') !== -1); },
      result : function() { changeCoordinates ('vertical', 1); }
    },
    {
      check : function() { return (pressedKeys.indexOf('Comma') !== -1); },
      result : function() { changeOpacity (-1); }
    },
    {
      check : function() { return (pressedKeys.indexOf('Period') !== -1); },
      result : function() { changeOpacity (1); }
    },
    {
      check : function() { return (pressedKeys.indexOf('PageUp') !== -1); },
      result : function() { changeOverlaySrc ('previous'); }
    },
    {
      check : function() { return (pressedKeys.indexOf('PageDown') !== -1); },
      result : function() { changeOverlaySrc ('next'); }
    },
    {
      check : function() { return (pressedKeys.indexOf('Home') !== -1); },
      result : function() { resetCoordinates (); }
    },
    {
      check : function() { return (pressedKeys.indexOf('Backquote') !== -1); },
      result : function() { toggleDisplay(); }
    },
    {
      check : function() { return (pressedKeys.indexOf('Slash') !== -1); },
      result : function() { toggleHelp(); }
    },
    {
      check : function() { return (pressedKeys.indexOf('Delete') !== -1); },
      result : function() { clearLocalStorage(); }
    }
  ];
  var styleList = {
    'overlay' : {
      'position' : 'absolute',
      'z-index' : '9999'
    },
    'overlayInformation' : {
      'display' : 'none',
      'justify-content' : 'center',
      'background-color' : '#eeeeee',
      'border-radius' : '25px',
      'position' : 'fixed',
      'top' : '48%',
      'left' : '50%',
      'margin-left' : '-160px',
      'width' : '320px',
      'fontSize' : '25px',
      'z-index' : '9999'
    },
    'overlayHelp' : {
      'display' : 'none',
      'justify-content' : 'center',
      'background-color' : '#eeeeee',
      'border-radius' : '25px',
      'position' : 'fixed',
      'top' : '20%',
      'left' : '50%',
      'margin-left' : '-275px',
      'width' : '550px',
      'font-size' : '25px',
      'z-index' : '9999',
      'text-align': 'center'
    }
  };

  function styleElements(list) {
    for (var element in list) {
      var stylesToApply = ''
      for (var property in list[element]) {
        stylesToApply = stylesToApply + property + ':' + list[element][property] + ';';
      }
      eval(element).style.cssText = stylesToApply;
    }
  };

  ( function () {
    styleElements (styleList);
    if (localStorage.getItem('overlaydisplay')) {
      overlay.style.display = localStorage.getItem('overlaydisplay');
    } else {
      overlay.style.display = 'block';
    }
    if (localStorage.getItem('overlaynumber')) {
      overlay.src = './overlays/overlay' + (localStorage.getItem('overlaynumber'));
      overlaySrc = localStorage.getItem('overlaynumber');
    } else {
      overlay.src = './overlays/overlay0';
      overlaySrc = 0;
    };
    if (localStorage.getItem('vertical')) {
      overlay.style.top = localStorage.getItem('vertical');
    } else {
      overlay.style.top = '0';
    };
    if (localStorage.getItem('horizontal')) {
      overlay.style.left = localStorage.getItem('horizontal');
    } else {
      overlay.style.left = '0';
    };
    if (localStorage.getItem('opacity')) {
      overlay.style.opacity = localStorage.getItem('opacity');
    } else {
      overlay.style.opacity = '0.5';
    };
    overlay.style.width = '"' + overlay.naturalWidth + 'px' + '"';
    overlay.style.height = '"' + overlay.naturalHeight + 'px' + '"';
    overlayHelp.innerHTML = '<br>Arrows – Move overlay</br><br>Ctrl + arrows – Wide steps</br><br>PageUp/PageDown – Previous/Next overlay</br><br>Comma/Period – Change overlay opacity</br><br>Home – Reset overlay position</br><br>Backquote – Show/Hide overlay</br><br>Delete – Clear local storage</br>';
    document.body.insertBefore(overlay, null);
    document.body.insertBefore(overlayInformation, null);
    document.body.insertBefore(overlayHelp, null);
  }) ();

  function showOverlayInformation() {
    clearTimeout(overlayInformationTimeout);
    overlayInformation.style.display = 'flex';
    overlayInformation.innerHTML = '<br>Horizontal offset: ' + overlay.style.left + '</br><br>Vertical offset: ' + overlay.style.top + '</br><br>Overlay opacity: ' + ((overlay.style.opacity * 100) +'%') + '</br><br>Overlay number: ' + overlaySrc +'</br>';
    overlayInformationTimeout = setTimeout (function () {
      overlayInformation.style.display = 'none';
    }, 1000);
  };

  function changeCoordinates(axis, step) {
    if (axis === 'vertical') {
      overlay.style.top = +overlay.style.top.slice(0, -2) + parseInt(step, 10) + 'px';
      localStorage.setItem('vertical', overlay.style.top);
    } else {
      overlay.style.left = +overlay.style.left.slice(0, -2) + parseInt(step, 10) + 'px';
      localStorage.setItem('horizontal', overlay.style.left);
    }
    showOverlayInformation();
  };

  function resetCoordinates() {
    overlay.style.top = 0;
    overlay.style.left = 0;
    localStorage.setItem('vertical', overlay.style.top);
    localStorage.setItem('horizontal', overlay.style.left);
    showOverlayInformation();
  };

  function changeOpacity(change) {
    overlay.style.opacity = ((overlay.style.opacity * 10) + change) / 10;
    if (overlay.style.opacity < 0) {
      overlay.style.opacity = 0;
    } else if (overlay.style.opacity > 1) {
      overlay.style.opacity = 1;
    }
    localStorage.setItem('opacity', overlay.style.opacity);
    showOverlayInformation();
  };

  function changeOverlaySrc(change) {
    if (change === 'next') {
      overlay.src = './overlays/overlay' + (++overlaySrc);
    } else {
      if (overlaySrc > 0) {
        overlay.src = './overlays/overlay' + (--overlaySrc);
      }
    }
    localStorage.setItem('overlaynumber', overlaySrc);
    showOverlayInformation();
  };

  function toggleDisplay() {
    if (overlay.style.display === 'block') {
      overlay.style.display = 'none';
      localStorage.setItem('overlaydisplay', 'none');
    } else {
      overlay.style.display = 'block';
      localStorage.setItem('overlaydisplay', 'block');
    }
  };

  function toggleHelp() {
    if (overlayHelp.style.display === 'none') {
      overlayHelp.style.display = 'flex';
    } else { overlayHelp.style.display = 'none' }
  };

  function removeKey(unpressedKey) {
    for (var i = 0; i < pressedKeys.length; i++) {
      if (pressedKeys[i] === unpressedKey) {
        pressedKeys.splice(i, 1);
      }
    }
  };

  function addKey(pressedKey) {
    if (pressedKeys.indexOf(pressedKey) === -1) {
      pressedKeys.push(pressedKey);
    }
  };

  function checkControls() {
    for (var i = 0; i < controls.length; i++) {
      if (controls[i].check()) {
        controls[i].result();
        break
      }
    }
  };

  function clearLocalStorage () {
    localStorage.clear();
  };

  document.addEventListener('keydown', function(event) {
    if (blockedKeys.indexOf(event.keyCode) !== -1) {
      event.preventDefault();
    };
    if (event.code) {
      addKey(event.code);
    } else {
      addKey(keyCodeToCode[event.keyCode]);
    }
    checkControls();
  });

  document.addEventListener('keyup', function(event) {
    if (event.code) {
      removeKey(event.code);
    } else {
      removeKey(keyCodeToCode[event.keyCode]);
    }
  });
})();
