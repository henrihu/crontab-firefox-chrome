function onLoad(res) {
  document.querySelector("#crontab").value = res.crontab || "";
}

function onSave() {
  document.querySelector("#status").value = "Saved.";
}

function reLoad() {
  load().then(cronTab);
}

function onError(error) {
  console.log(error);
  document.querySelector("#status").value = error;
  reLoad();
}

document.addEventListener("DOMContentLoaded", () => {
  load().then(onLoad).catch(onError);
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const res = {"crontab": document.querySelector("#crontab").value};
  cronTab(res).then(save).then(onSave).catch(onError);
});