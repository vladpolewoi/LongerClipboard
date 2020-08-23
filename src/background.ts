browser.runtime.onInstalled.addListener(() => {
  const saveHandler = (text: string) => {
    const input = prompt('What to save?', text);

    browser.storage.sync.get('data')
      .then((result) => {
        const newData = result.data ? [...result.data, input] : [input];

        browser.storage.sync.set({ data: newData });
      });
  };

  // hotkey trigger
  browser.commands.onCommand.addListener((command) => {
    if (command === 'save_handler') {
      browser.tabs.executeScript({
        code: 'window.getSelection().toString();',
      })
        .then((result) => {
          if (result && typeof result[0] === 'string') {
            saveHandler(result[0]);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });

  // add menu option
  browser.contextMenus.create({
    id: 'saveBtn',
    title: 'Save to google sheets',
    contexts: ['selection'],
  });
  browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'saveBtn' && info.selectionText) {
      saveHandler(info.selectionText);
    }
  });
});
