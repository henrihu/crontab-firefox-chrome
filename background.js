function show(url) {
  browser.tabs.create({
    "url": url
  });
}

function onError(error) {
  console.log(error);
}

browser.alarms.onAlarm.addListener(async (alarm) => {
  const target = alarm.name;
  load().then((res) => runTask(res, target)).catch(onError);
});

setAlarm('[uw-bid] start');