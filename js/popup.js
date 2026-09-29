const $ = id => document.getElementById(id);
  const status = $('status');
  const button = $('save');
  const getValue = name => $(name).value;

  let autoSaveTimer = null;

  async function save(config) {
      await chrome.storage.local.set(config);
      chrome.runtime.sendMessage({ type: 'CONFIG_SAVED' });
  }

  async function load() {
      return await chrome.storage.local.get();
  }

  async function save_manual() {
      var config_text = $('textarea').value;
      try {
          var config = await load();
          if (config_text) {
              config.json = JSON.parse(config_text);
          } else {
              config_text = await getDefaultConfig();
              config.json = JSON.parse(config_text);
          }
          config.text = config_text;
          await save(config);
      } catch (e) {
          status.textContent = 'Invalid JSON syntax';
          return;
      }
      status.textContent = 'Config Saved';
      setTimeout(() => status.textContent = '', 2000);
  }

  button.onclick = save_manual;

  async function autoSave() {
      var config_text = $('textarea').value;
      var config = await load();
      config.text = config_text;
      await save(config);
  }

  function startAutoSave() {
      if (autoSaveTimer !== null) return;
      autoSaveTimer = setInterval(autoSave, 1000);
  }

  function stopAutoSave() {
      if (autoSaveTimer !== null) {
          clearInterval(autoSaveTimer);
          autoSaveTimer = null;
      }
  }

  document.addEventListener('DOMContentLoaded', async () => {
      var item = await chrome.storage.local.get();
      $('textarea').value = item.text || '';
      startAutoSave();
  });

  window.addEventListener('unload', () => {
      stopAutoSave();
      save_manual();
  });

  async function getDefaultConfig() {
      const fileUrl = chrome.runtime.getURL('js/default_key.json');
      const response = await fetch(fileUrl);
      return await response.text();
  }
