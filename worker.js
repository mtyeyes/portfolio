onmessage = (script) => {
  const scriptReadyForInsertion = prepareScriptForDemonstration(script.data);
  postMessage(scriptReadyForInsertion);
};

const prepareScriptForDemonstration = (script) => {
  const minifyScript = (str) => {
    const regexForComments = /\/\/.+/g;
    const regexForNewlinesAndWhitespaces = /\n|\s/g;
    return str.replace(regexForComments, '').replace(regexForNewlinesAndWhitespaces, '');
  }
  const replaceHtmlReservedSymbols = (str) => {
    const regexForReservedSymbols = /&|<|>/g;
    const replaceSymbols = (match) => {
      switch (match) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
      };
    };
    return str.replace(regexForReservedSymbols, replaceSymbols);
  };
  const highlightMethods = (str) => {
    const regexForMethods = /\.{1}[a-zA-Z]+/g;
    const isQuerySelectorParameter = (offset, string) => {
      return string[(offset -1)] === '\'';
    };
    const isFileExtension = (match) => {
      fileExtensions = ['html', 'css', 'js', 'json', 'jpg', 'svg', 'ico'];
      let result = false;
      fileExtensions.forEach(extension => {
        if(`.${extension}` === match) {result = true};
      });
      return result;
    };
    const encaseMethodsInSpan = (match, offset, string) => {
      if(isQuerySelectorParameter(offset, string)) {return match};
      if(isFileExtension(match)) {return match};
      return `<span class="code-as-background--highlight">${match}</span>`;
    };
    return str.replace(regexForMethods, encaseMethodsInSpan);
  };

  const minifiedScript = minifyScript(script);
  const htmlNeutralCode = replaceHtmlReservedSymbols(minifiedScript);
  return highlightMethods(htmlNeutralCode);
};