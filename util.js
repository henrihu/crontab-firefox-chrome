function setAlarm(target, periodInMinutes, delayInMinutes) {
  browser.alarms.create(target, {
    periodInMinutes,
    delayInMinutes
  });
  console.log(`Set alarm: ${target}, periodInMinutes: ${periodInMinutes}, delayInMinutes: ${delayInMinutes}`);
}

function load() {
  return browser.storage.local.get("uw-bid");
}

function save(res) {
  return browser.storage.local.set(res);
}

function clearAlarms() {
  browser.alarms.clearAll();
  console.log(`Cleared all alarms.`);
}

function redirectUrl(url) {
  window.location.href = url;
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

tasks = [
    {
        "taskUrl": "https://www.upwork.com/jobs/Ruby-Rails-developer_~0103f8c4b31b956148/",
        "jobType": "Hourly",
        "hourlyRateSelector": "input#step-rate",
        "hourlyRate": "25",
        "coverLetter": "Hi, I am a developer.... thanks.",
        "coverLetterSelector": ".fe-proposal-additional-details .cover-letter-area textarea.up-textarea",
        "questionSelector": ".fe-proposal-job-questions.questions-area textarea.up-textarea",
        "answers": [
            "I think it is ShowMojo",
            "asdfasdfasdf",
            "asdfasdf"
        ],
        "submitButtonSelector": "div.fe-job-apply button.up-btn-primary"
    },
    {
        "taskUrl": "https://www.upwork.com/jobs/Technical-Support-Engineer_~0153b0faebc79f1ace/",
        "proposalButtonSelector": ".job-details-sidebar .up-card-section .cta-row .apply button.submit-proposal-button",
        "taskRate": "25",
        "taskRateSelector": "#step-rate",
        "coverLetter": "Hi, I am a developer.... thanks.",
        "coverLetterSelector": ".fe-proposal-additional-details .cover-letter-area textarea.up-textarea",
        "questionSelector": ".fe-proposal-job-questions.questions-area textarea.up-textarea",
        "answers": [
            "I think it is ShowMojo",
            "asdfasdfasdf",
            "asdfasdf"
        ],
        "submitButtonSelector": ".fe-proposal-additional-details footer.up-card-footer .up-btn-primary"
    }
]

function async runTask(res, target) {
  if (target == '[uw-bid] start') {
    console.log("'[uw-bid] start' is run")
    if ( res.currentTask is not null ) {
      onError("new task can't start because currentTask is not null");
      return;
    }

    task = await getTask();
    res.currentTask = task;
    redirectUrl(task.taskUrl);
    setAlarm('[uw-bid] submit-proposal', 0, 0.4);
    setAlarm('[uw-bid] send', 0, 1);
    save(res).catch(onError);

  } else if (target == '[uw-bid] submit-proposal') {
    console.log("'[uw-bid] submit-proposal' is run")
    if ( res.currentTask == null ) {
      onError("propsal can't submit because currentTask is blank");
      return;
    }

    task = res.currentTask;
    fillInputsUW(task);
    submitBidUW(task.connectionCount)

  } else if (target == '[uw-bid] send') {
    console.log("'[uw-bid] send' is run")
  }
}