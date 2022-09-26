function show(url) {
  browser.tabs.create({
    "url": url
  });
}

function onError(error) {
  console.log(error);
}

browser.alarms.onAlarm.addListener((alarm) => {
  const target = alarm.name;
  show(target);
  load().then((res) => cronTab(res, target)).catch(onError);
});

load().then(cronTab).catch(onError);