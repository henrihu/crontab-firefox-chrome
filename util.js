function load() {
  return browser.storage.local.get("crontab");
}

function save(res) {
  return browser.storage.local.set(res);
}

function setAlarm(next, target) {
  const name = target;
  const time = next.getTime();
  browser.alarms.create(name, {
    "when": time
  });
  console.log(`Set alarm: ${target}, next: ${next}`);
}

function clearAlarms() {
  browser.alarms.clearAll();
  console.log(`Cleared all alarms.`);
}

function getLines(crontab, target) {
  const lines = crontab.split(/[\r\n]+/);
  if (target) {
    const target_i = 3; // 0:minute, 1:hour, 2:week, 3:target
    for (const line of lines) {
      const split = line.trim().split(/\s+/);
      if (split.length > target_i) {
        if (split[target_i] == target) {
          return [line];
        }
      }
    }
    return; // target not found
  }
  return lines;
}

function cronTab(res, target) {
  return new Promise((resolve, reject) => {
    if (!target) clearAlarms();
    const lines = getLines(res.crontab, target);
    if (lines) {
      for (const line of lines) {
        cron(line, setAlarm); // import cron.js
      }
      resolve(res);
    } else {
      reject();
    }
  });
}