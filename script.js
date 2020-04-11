//Functions and values used in multiple "modules"
//-----------------------------------------------

const common = {
  createNewElement: function (tagName, classesArr, attributeNameValuePairs, text) {
    const newElement = document.createElement(tagName);
    if (classesArr) {
      classesArr.forEach(className => newElement.classList.add(className))
    };
    if (attributeNameValuePairs) {
      Object.entries(attributeNameValuePairs).forEach(([attributeName, value]) => {
        newElement.setAttribute(attributeName, value);
      })
    };
    if (text) {
      newElement.textContent = text
    };
    return newElement;
  },
  getValueOfProperty: function (element, propertyName) {
    return window.getComputedStyle(element).getPropertyValue(propertyName);
  },
  mergeArraysAndRemoveRepeats: function (arrayOfArrays) {
    let mergedArray = [];
    arrayOfArrays.forEach(arr => mergedArray = mergedArray.concat(arr));
    const uniqueValues = new Set(mergedArray);
    return uniqueValues;
  },
  displayRefreshFrequency: 7, // 7ms ~ 144hz
  newElementInsertedInDomEvent: new CustomEvent ('elementinserted', {bubbles: true}),
  Throttle: class {
    constructor(functionName, functionParametersArr, interval, functionContext) {
      this.functionToCall = functionName;
      this.functionParametersArr = functionParametersArr;
      this.interval = interval;
      this.context = functionContext || this;
    };
    invokeFunction() {
      this.functionToCall.apply(this.context, this.functionParametersArr);
    };
    execute(functionParametersArr) {
      this.functionParametersArr = functionParametersArr;
      if (!this.isThrottled) {
        this.invokeFunction();
        this.throttle();
      } else {
        this.isEventFiredWhileThrottled = true;
      };
    };
    throttle() {
      this.isThrottled = true;
      this.timer = setTimeout(this.unthrottle.bind(this), this.interval);
    };
    unthrottle() {
      this.isThrottled = false;
      if (this.isEventFiredWhileThrottled) {
        this.isEventFiredWhileThrottled = false;
        this.execute(this.functionParametersArr);
      };
    };
  }
};

//Creating the projects cards and setting up the filter in preferences menu
//-------------------------------------------------------------------------

(async function() {
  const fetchJson = await fetch('resources/projects.json');
  const projectsData = await fetchJson.json();

  const cards = [];
  let skillsList;
  let refreshProjectsListTimeout;
  const browsers = (function() {
    let allSupportedBrowsers = [];
    Object.keys(projectsData).forEach(project => allSupportedBrowsers.push(projectsData[project]['supportedBrowsers']));
    return common.mergeArraysAndRemoveRepeats(allSupportedBrowsers);
  })();

  class ProjectCard {
    constructor(obj) {
      this.link = this.createLink(obj);
      if ('HTMLPortalElement' in window) {
        this.thumbnail = this.createPortal(obj);
      } else {
        this.thumbnail = common.createNewElement('img', ['project__thumbnail', 'project__thumbnail--img'], {'src': `resources/${obj['title']}.jpg`, 'alt': `${obj['title']} thumbnail`});
      }
      this.skills = obj['skills'];
      this.suportedBrowsers = function() {
        const list = common.createNewElement('ul', ['project__browser-support-list']);
        browsers.forEach( browser => {
          const listItem = common.createNewElement('li', ['project__browser-support', `project__browser-support--${browser}`]);
          const svgIcon = createSvgUseElement(`#icon-browser-${browser}`);
          listItem.append(svgIcon);
          if (!obj['supportedBrowsers'].includes(browser)) {listItem.classList.add('project__browser-support--not-supported')}
          list.append(listItem);
        });
        return list;
      };
      this.description = common.createNewElement('p', ['project__description'], {'data-lang-ru': obj['description'], 'data-lang-en': obj['data-lang-en']}, obj['description']);
      this.descriptionWrapper = common.createNewElement('div', ['project__description-wrapper']);
      this.cardContainer = common.createNewElement('li', ['project__card']);
      this.descriptionWrapper.append(this.description);
      this.cardContainer.append(this.thumbnail);
      this.cardContainer.append(this.link);
      this.cardContainer.append(this.suportedBrowsers());
      this.cardContainer.append(this.descriptionWrapper);
    };
    createLink(obj) {
      const link = common.createNewElement('a', ['project__link', 'mouse-stalker-hoverable'], {'href': obj['link'], 'target': '_blank', 'aria-label': obj['title']});
      const linkCaption = common.createNewElement('span', ['project__link-caption', 'visually-hidden'], '', obj['title']);
      const arrowIcon = createSvgUseElement('#icon-link', ['project__link-svg']);
      link.append(linkCaption);
      link.append(arrowIcon);
      return link;
    };
    createPortal(obj) {
      const portal = common.createNewElement('portal', ['project__thumbnail', 'project__thumbnail--portal'], {'src': obj['link']});
      const context = this;
      this.link.addEventListener('click', function(event) {
        event.preventDefault();
        context.travelThroughPortal(event);
      });
      return portal;
    };
    travelThroughPortal() {
      const portalContainer = event.currentTarget.parentElement;
      const portal = this.thumbnail;
      let portalDimensions = portal.getBoundingClientRect();
      let animationValues = {
        '--x-offset': `${portalDimensions.left}px`,
        '--y-offset': `${portalDimensions.top}px`
      };
      for (let [propertyName, value] of Object.entries(animationValues)) {
        portalContainer.style.setProperty(propertyName, value)
      }
      portalContainer.classList.add('project__card--portal-transition');
      portal.addEventListener('transitionend', function (event) {
        portal.activate();
      });
    };
  };

  class SkillsItem {
    constructor(technology) {
      this.checkbox = common.createNewElement('input', ['skills__skill-checkbox', 'visually-hidden'], {'type': 'checkbox', 'name': `${technology}`, 'id': technology, 'checked': 'true'});
      this.label = common.createNewElement('label', ['skills__skill-label', 'mouse-stalker-hoverable'], {'for': technology, 'data-stalker-radius': '10px', 'data-stalker-animation-duration': '500'}, technology);
      this.container = common.createNewElement('li', ['skills__skill-container']);
      this.container.append(this.checkbox);
      this.container.append(this.label);
    }
  };

  const createSvgUseElement = (svgIconName, classesArr) => {
    const svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svgUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svgUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', svgIconName);
    if(classesArr) {classesArr.forEach(className => svgContainer.classList.add(className))};
    svgContainer.append(svgUse);
    return svgContainer
  }

  const createAndFillProjectsList = (source) => {
    const projectsList = common.createNewElement('ul', ['portfolio__projects-list']);
    for (let project in source) {
      const projectCard = new ProjectCard(projectsData[project]);
      cards.push(projectCard);
      projectsList.append(projectCard['cardContainer']);
    }
    return projectsList
  };

  const fillUsedTechnologiesSelectors = (source, projectsList) => {
    skillsList = common.createNewElement('ul', ['skills__list']);
    let skills = [];
    for (let obj in source) {
      skills.push(source[obj]['skills']);
    };
    skills = common.mergeArraysAndRemoveRepeats(skills);
    skills.forEach(str => {
      const newItem = new SkillsItem(str)
      skillsList.append(newItem['container']);
      newItem['checkbox'].addEventListener('change', function(event) {
        clearTimeout(refreshProjectsListTimeout);
        projectsList.classList.add('portfolio__projects-list--updating');
        refreshProjectsListTimeout = setTimeout(function() {
          refreshProjectsList(projectsList);
        }, 1200);
      });
    });
    document.querySelector('.preferences__skills').append(skillsList);
    skillsList.dispatchEvent(common.newElementInsertedInDomEvent);
  };

  const getSelectedSkills = () => {
    const selectedCheckboxes = skillsList.querySelectorAll('.skills__skill-checkbox:checked');
    let selectedSkills = [];
    selectedCheckboxes.forEach(element => selectedSkills.push(element.id));
    return selectedSkills;
  };

  const refreshProjectsList = (projectsList) => {
    const selectedSkills = getSelectedSkills();
    cards.forEach(card => {
      let containsSelectedSkills = card['skills'].some(skill => selectedSkills.includes(skill));
      (containsSelectedSkills) ? card['cardContainer'].classList.remove('project__card--hide'): card['cardContainer'].classList.add('project__card--hide');
    });
    clearTimeout(refreshProjectsListTimeout);
    projectsList.classList.remove('portfolio__projects-list--updating');
  };

  (function() {
    const filledList = createAndFillProjectsList(projectsData);
    fillUsedTechnologiesSelectors(projectsData, filledList);
    document.querySelector('.portfolio__loader').remove();
    document.querySelector('.portfolio').prepend(filledList);
    filledList.dispatchEvent(common.newElementInsertedInDomEvent);
    document.querySelector('.preferences__btn').addEventListener('click', function (event) {
      refreshProjectsList(filledList);
    })
  })();
})();

// Theme switch
//-------------

(function() {
  const themeSwitcher = document.querySelector('.site-preferences__checkbox--theme-switch');
  const mapThemesStyles = {
    ' light': {
      '--theme': ' light',
      '--background-color': '#f4f7f6',
      '--background-darker-color': '#dbdfe4',
      '--border-color': '#c8cdd7',
      '--font-color': '#202160',
      '--main-color': '#df6c4f',
      '--error': '#df4f4f',
    },
    ' dark': {
      '--theme': ' dark',
      '--background-color': '#282C34',
      '--background-darker-color': '#21252B',
      '--border-color': '#1D1F23',
      '--font-color': '#ABB2BF',
      '--main-color': '#D19A66',
      '--error': '#e06c75',
    }
  };

  const setTheme = (theme) => {
    for (let [propertyName, value] of Object.entries(mapThemesStyles[theme])) {
      document.documentElement.style.setProperty(propertyName, value);
    };
    localStorage.setItem('theme', theme);
  };

  themeSwitcher.addEventListener('change', function (event) {
    (themeSwitcher.checked) ? setTheme(' dark') : setTheme(' light');
  });

  if (localStorage.getItem('theme')) {
    setTheme(localStorage.getItem('theme'));
  };

  if (common.getValueOfProperty(document.documentElement, '--theme') === ' dark') {
    themeSwitcher.checked = true;
  };
})();

// Mouse stalker (circle under mouse pointer)
//-------------------------------------------

(function() {
  const mouseStalker = {
    stalker: common.createNewElement('div', ['mouse-stalker']),
    isSticked: false,
    create: function () {
      const hoverableElements = document.querySelectorAll('.mouse-stalker-hoverable');
      document.body.append(mouseStalker.stalker);
      mouseStalker.adjust(event);
      mouseStalker.throttledAdjust = new common.Throttle(mouseStalker.adjust, [event], common.displayRefreshFrequency, mouseStalker);
      document.addEventListener('mousemove', function (event) {
        mouseStalker.throttledAdjust.execute([event]);
      });
      hoverableElements.forEach(element => {
        mouseStalker.addListenersToHoverTarget(element);
      });
      document.addEventListener('elementinserted', function (event) {
        const hoverableElements = event.target.querySelectorAll('.mouse-stalker-hoverable');
        hoverableElements.forEach(element => {
          mouseStalker.addListenersToHoverTarget(element);
        })
      });
      document.removeEventListener('mousemove', mouseStalker.create);
    },
    setPosition: function (xPos, yPos) {
      this.stalker.style.setProperty('transform', `translate(${xPos}px,${yPos}px)`);
    },
    adjust: function (event) {
      if (this.isSticked) {
        const dimensions = this.hoverTarget.getClientRects()[0];
        yPos = dimensions['y'] - dimensions['height'] * 0.1;
        xPos = dimensions['x'] - dimensions['width'] * 0.1;
      } else {
        yPos = event.clientY - (this.stalker.offsetHeight * 0.5);
        xPos = event.clientX - (this.stalker.offsetWidth * 0.5);
      }
      this.setPosition(xPos, yPos);
    },
    stickToElement: function (element) {
      this.isSticked = true;
      if(element.dataset.stalkerTargetInside) {
        this.hoverTarget = element.querySelector(`.${element.dataset.stalkerTargetInside}`);
      } else {
        this.hoverTarget = element;
      };
      if(element.dataset.stalkerRadius) {this.stalker.style.setProperty('border-radius', element.dataset.stalkerRadius)};
      if(element.dataset.stalkerAnimationDuration) {this.adjustAfterTransition(this.hoverTarget, element.dataset.stalkerAnimationDuration)} else {this.updateStalkerDimensions()};
    },
    unstick: function (event) {
      this.isSticked = false;
      this.stalker.style.width = null;
      this.stalker.style.height = null;
      this.timerIfTargetMoving = null;
      this.stalker.style.removeProperty('border-radius');
    },
    adjustAfterTransition: function(element, speed) {
      const context = this;
      let i = speed / common.displayRefreshFrequency;
      const followStickedElement = () => {
        if (context.hoverTarget === element && context.isSticked === true && i > 0) {
          context.updateStalkerDimensions();
          context.adjust();
          i--;
          setTimeout(followStickedElement, common.displayRefreshFrequency);
        };
      }
      setTimeout(followStickedElement, common.displayRefreshFrequency);
    },
    updateStalkerDimensions: function() {
      const dimensions = this.hoverTarget.getClientRects()[0];
      const stalkerWidth = dimensions['width'] * 1.2;
      const stalkerHeight = dimensions['height'] * 1.2;
      this.setDimensions(stalkerWidth, stalkerHeight);
    },
    setDimensions: function (stalkerWidth, stalkerHeight) {
      this.stalker.style.width = `${stalkerWidth}px`;
      this.stalker.style.height = `${stalkerHeight}px`;
    },
    addListenersToHoverTarget: function (element) {
      element.addEventListener('mouseenter', function (event) {
        mouseStalker.stickToElement(event.currentTarget);
      });
      element.addEventListener('mouseleave', function (event) {
        mouseStalker.unstick();
      });
    }
  };

  if(!('ontouchstart' in window)) {document.addEventListener('mousemove', mouseStalker.create)};
})();

// Adjust btns position on mouse move to stay on the same axis with mouse
//-----------------------------------------------------------------------

(async function() {
  const btnsStickToMouse = {
    topBtn: document.querySelector('.about-me__btn'),
    sideBtn: document.querySelector('.preferences__btn'),
    getDimensions: function() {
      this.btnsSideLength = common.getValueOfProperty(this.topBtn, 'width').replace('px', '');
      this.topBtnOffset = (document.documentElement.clientWidth - this.btnsSideLength) / 2;
      this.sideBtnOffset = (document.documentElement.clientHeight - this.btnsSideLength) / 2;
    },
    setPosition: function (element, cursorPosition, axis) {
      this.allowedPositionRangeX = [0, document.documentElement.clientWidth - this.btnsSideLength];
      this.allowedPositionRangeY = [this.btnsSideLength * 1.2, document.documentElement.clientHeight - this.btnsSideLength];
      let rangeMin, rangeMax, offset;
      if (axis === 'X') {
        offset = this.topBtnOffset;
        [rangeMin, rangeMax] = [this.allowedPositionRangeX[0] - offset, this.allowedPositionRangeX[1] - offset];
      } else {
        offset = this.sideBtnOffset;
        [rangeMin, rangeMax] = [this.allowedPositionRangeY[0] - offset, this.allowedPositionRangeY[1] - offset];
      };
      let position = cursorPosition - this.btnsSideLength * 0.5 - offset;
      if (position < rangeMin) {
        position = rangeMin;
      } else if (position > rangeMax) {
        position = rangeMax;
      };
      element.style.setProperty('--adjusted-position', `translate${axis}(${position}px)`)
    },
    adjustBtns: function (event) {
      this.setPosition(this.topBtn, event.clientX, 'X');
      this.setPosition(this.sideBtn, event.clientY, 'Y');
    },
  };

  if(!('ontouchstart' in window)) {
    const throttledBtnsStickToMouse = new common.Throttle(btnsStickToMouse.adjustBtns, [event], common.displayRefreshFrequency, btnsStickToMouse);
    btnsStickToMouse.getDimensions();

    window.addEventListener('resize', function (event) {
      btnsStickToMouse.getDimensions();
    });

    document.addEventListener('mousemove', function (event) {
      throttledBtnsStickToMouse.execute([event]);
    });
  }
})();

//Show/hide modal containers
//--------------------------

(function() {
  const modalElements = document.querySelectorAll('.modal');
  modalElements.forEach(element => {
    const btn = element.querySelector('.modal__toggle');

    btn.addEventListener('click', function() {
      element.classList.toggle('modal--show');
      btn.classList.toggle('modal__toggle--toggled');
    })
  });
})();

//Show foldable description on hover/focus
//----------------------------------------

(function() {
  class UnfoldableDescriptonsList {
    constructor(nodeList) {
      this.currentUnfoldedDescription = null;
      nodeList.forEach(element => new UnfoldableDescription(element, this));
    };
    maintainOneDescriptionUnfolded(hoveredElement) {
      if (this.currentUnfoldedDescription !== hoveredElement && this.currentUnfoldedDescription !== null) {this.hidePreviouslyUnfoldedDescription()};
      if (this.currentUnfoldedDescription !== hoveredElement) {this.currentUnfoldedDescription = hoveredElement};
    };
    hidePreviouslyUnfoldedDescription() {
      this.currentUnfoldedDescription.hideText(this.currentUnfoldedDescription);
    };
  };

  class UnfoldableDescription {
    constructor(element, list) {
      this.container = element;
      this.fullText = element.dataset.unfoldContent;
      this.foldableTextContainer = common.createNewElement('span', ['contacts__unfoldableText']);
      this.animationSpeed = common.getValueOfProperty(element, 'transition-duration').replace('s', '') * 1000;
      this.paintingSpeed = Math.floor(this.animationSpeed / this.fullText.length);
      this.container.querySelector('.contacts__link').append(this.foldableTextContainer);
      this.list = list;
      this.addEventListeners(this);
    };
    showText(context) {
      context.list.maintainOneDescriptionUnfolded(context);
      clearTimeout(context.textIsPainting);
      if (context.foldableTextContainer.textContent.length < context.fullText.length && window.innerWidth > 1100) {
        context.textIsPainting = setTimeout(function() {
          context.foldableTextContainer.textContent = context.foldableTextContainer.textContent + context.fullText[context.foldableTextContainer.textContent.length];
          context.showText(context);
        }, context.paintingSpeed);
      };
    };
    hideText(context) {
      clearTimeout(context.textIsPainting);
      if (context.foldableTextContainer.textContent.length !== 0) {
        context.textIsPainting = setTimeout(function() {
          context.foldableTextContainer.textContent = context.foldableTextContainer.textContent.slice(0, -1);
          context.hideText(context);
        }, (context.paintingSpeed * 0.7));
      };
    };
    addEventListeners(context) {
      context.container.addEventListener('mouseenter', function(event) {
        context.showText(context);
      });
      context.container.addEventListener('focusin', function(event) {
        context.showText(context);
      });
      context.container.addEventListener('mouseleave', function(event) {
        if(context.container.querySelector('a') !== document.activeElement) {
          context.hideText(context);
        };
      });
      context.container.addEventListener('focusout', function(event) {
        context.hideText(context);
      });
      window.addEventListener('resize', function(event) {
        if(window.innerWidth < 1100 && context.foldableTextContainer.textContent.length !== 0) {context.hideText(context)};
      });
    }
  };

  new UnfoldableDescriptonsList(document.querySelectorAll('.contacts__contact'));

})();

//Change language
//---------------

(function() {
let multilanguageContainers = document.querySelectorAll('[data-lang-ru]');
const changeLanguageCheckbox = document.querySelector('.site-preferences__checkbox--language-change');
const title = {
  'Ru': 'Портфолио',
  'En': 'Portfolio'
};
const changeLanguage = (language) => {
  multilanguageContainers.forEach(element => element.textContent = element.dataset[(`lang${language}`)]);
  document.title = title[language];
  updateCheckbox(language);
  document.documentElement.setAttribute('lang', language.toLowerCase());
  localStorage.setItem('language', language);
};
const applyLanguageToNewElements = (event) => {
  const newMultilanguageContainers = event.target.querySelectorAll('[data-lang-ru]');
  if (newMultilanguageContainers) {
    newMultilanguageContainers.forEach(element => element.textContent = element.dataset[(`lang${localStorage.getItem('language')}`)]);
    multilanguageContainers = [...multilanguageContainers, ...newMultilanguageContainers];
  }
};
const updateCheckbox = (language) => {
  (language === 'En') ? changeLanguageCheckbox.checked = true : changeLanguageCheckbox.checked = false;
}


if (localStorage.getItem('language')) {
  changeLanguage(localStorage.getItem('language'));
} else if (navigator.languages.includes('ru')) {
  changeLanguage('Ru');
} else {
  changeLanguage('En');
};

changeLanguageCheckbox.addEventListener('change', function (event) {
  (changeLanguageCheckbox.checked) ? changeLanguage('En') : changeLanguage('Ru');
});

document.addEventListener('elementinserted', function (event) {
  applyLanguageToNewElements(event);
});
})();

//Safari z-index bug workaround
//-----------------------------

document.addEventListener('elementinserted', function (event) {
  if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
    document.addEventListener('elementinserted', function (event) {
      const cards = event.target.querySelectorAll('.project__card');
      if(cards) {
        cards.forEach(card => {
          card.style.transform = 'none';
          card.style.boxShadow = '0 0 10px 10px var(--border-color)';
        });
      };
    });
  };
});