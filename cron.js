/**
 * cron.js
 * @version 0.1
 * @author Oktasoft
 * @license MIT
 * @param {string} command - 'minute(0-59) hour(0-23) week(0-6) target'
 * @param {function} action - function(next,target){myFunc()}
 * @description Calculate next date & Execute action
 */

var cron = (function() {

  var range = [[0,59],[0,23],[0,6]]; // minute[min, max], hour[min, max], week[min, max]

  var aliases = {sun:0,mon:1,tue:2,wed:3,thu:4,fri:5,sat:6};

  function cron(command, action) {

    if (!command || !action) return;

    var split = command.trim().split(/\s+/);

    var target_i = range.length;

    if (split.length <= target_i) throw new Error('Argument is missing in: ' + command);

    var target = split[target_i];

    split.length = target_i;

    var field = getField(split);

    var next = getNext(new Date(), field);

    action(next, target);
  }

  function getField(split) {

    var field = [{},{},{}]; // minute_field, hour_field, week_field

    var length = split.length;

    for (var i = 0; i < length; i++) {

      split[i] = split[i].replace(/[a-z]+/i, function(alias) {

        alias = alias.toLowerCase();

        if (alias in aliases) return aliases[alias];

        throw new Error('Unknown alias: ' + alias);
      });

      field[i] = parseField(i, split[i]);
    }

    return field;

    function parseField(i, str) {

      var res = [];

      var low = range[i][0];
      var high = range[i][1];
      var size = high - low + 1;

      var extended = extendField(str);

      var split = extended.split(',');

      for (var j = low; j <= high; j++) {

        res[j] = false;
      }

      for (var n of split) {

        n = parseInt(n);

        if (isNaN(n)) continue;

        if (low <= n && n <= high) {

          res[n] = true;
        }
      }

      return res;

      function extendField(str) {

        var verify = /([^0-9\/\-*,])|(\*\d+)|(\d+\*)|(\-\-)|(\/\/)|(\-\/)|(\/\-)|(\-\*)|(\/\*)/;

        if (str.match(verify)) throw new Error('Illegal argument: ' + str);

        var pattern = /(?:(?:(?:(\d+)(?:-(\d+))?)|\*+)(?:\/(\d+))?)(?:,|$)/g;

        if (!str.match(pattern)) throw new Error('Invalid argument: ' + str);

        return str.replace(pattern, function($0, lower, upper, step) {

          var res = '';

          if (!lower) {

            lower = low;
            upper = high;

          } else {

            lower = Math.max(low, ((~~lower - low) % size) + low);
            upper = upper ? Math.min(high, ((~~upper - low) % size) + low) : lower;
          }

          step = ~~step || 1;

          if (lower > upper) {

            for (var i = lower; i <= (size + upper); i += step) {

              res += ((i - low) % size + low) + ',';
            }

          } else {

            for (var i = lower; i <= upper; i += step) {

              res += i + ',';
            }
          }

          return res;
        });
      }
    }
  }

  function getNext(date, field) {

    date.setMinutes(date.getMinutes() + 1, 0, 0); // next minute (add 1-60000 ms)

    var now = new Date();

    var ptr = 2; // date

    while (ptr >= 0) {

      switch (ptr) {

        case 2:
        ptr += setNextDate();
        break;

        case 1:
        ptr += setNextHour();
        break;

        case 0:
        ptr += setNextMinute();
        break;
      }
    }

    return date;

    function setNextDate() {

      var r = range[2];
      var f = field[2];

      var diff = date.getTime() - now.getTime();
      var start = r[0];
      var end = r[1] + 1;
      
      for (var i = start; i <= end; i++) {

        var week = (i + date.getDay()) % end;
        
        if (f[week]) {

          date.setDate(date.getDate() + i);

          diff = date.getTime() - now.getTime();
          if (diff < 0) continue;
          
          return -1;
        }
      }

      throw new Error('Week not found.');
    }

    function setNextHour() {

      var r = range[1];
      var f = field[1];

      var diff = date.getTime() - now.getTime();
      var start = (diff >= 60000) ? r[0] : date.getHours();
      var end = r[1];

      for (var i = start; i <= end; i++) {

        if (f[i]) {
          
          date.setHours(i);

          diff = date.getTime() - now.getTime();
          if (diff < 0) continue;

          return -1;
        }
      }

      for (var i = r[0]; i <= r[1]; i++) {

        if (f[i]) {
          
          date.setHours(i);

          return 1;
        }
      }

      throw new Error('Hour not found.');
    }

    function setNextMinute() {

      var r = range[0];
      var f = field[0];

      var diff = date.getTime() - now.getTime();
      var start = (diff >= 60000) ? r[0] : date.getMinutes();
      var end = r[1];

      for (var i = start; i <= end; i++) {

        if (f[i]) {
          
          date.setMinutes(i);

          diff = date.getTime() - now.getTime();
          if (diff < 0) continue;

          return -1;
        }
      }

      for (var i = r[0]; i <= r[1]; i++) {

        if (f[i]) {
          
          date.setMinutes(i);

          return 1;
        }
      }

      throw new Error('Minute not found.');
    }
  }

  return cron;
})();