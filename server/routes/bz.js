module.exports = function (bugzilla) {
  return {
    bugsrpc: function (req, res, next) {
      var url = 'https://bugzilla.mozilla.org/jsonrpc.cgi?method=Bug.search&' +
                'params=%5B{%22summary%22:%22MozillaIndia.org%22,%20%22limit%22:%221%22}%5D';

      require("request")({
          uri: url,
          method: 'GET',
          body: null,
          headers: { 'Content-type': 'application/json' }
        },
        function (error, response, body) {
          if (error) return next(error);
          body = JSON.parse(body);
          res.send(body.result);
        }
      );
    },
    bugs: function (req, res, next) {
      bugzilla.searchBugs(req.query, function(err, bugs) {
        if (err) {
          return next(err);
        }
        var output = bugs.map(function(bug) {

          // Check real name
          if (!bug.assigned_to_detail.real_name) {
            bug.assigned_to_detail.real_name = bug.assigned_to_detail.email.split('@')[0];
          }
          // Check if bugs which it depends on are resolved
          if (!bug.resolution && bug.depends_on.length) {
            bug.depends_on.forEach(function(blockerId) {
              bugs.forEach(function(item) {
                if (item.id === blockerId && !item.resolution) {
                  bug.blocked = true;
                }
              })
            });
          }
          return bug;
        });
        res.send(output);
      });
    },
    flags: function (req, res, next) {
      bugzilla.searchBugs({
        'f1': 'requestees.login_name',
        'v1': "debloper@gmail.com",
        'o1': 'substring',
        'query_format': 'advanced'
      }, function (err, bugs) {
        if (err) {
          return next(err);
        }
        var flags = [];
        bugs.forEach(function (bug) {
          // Reviews don't show up for some reason...
          if (!bug.flags.length) {
            bug.flags.push({
              creation_date: bug.last_change_time,
              requestee: req.query.user,
              setter: 'REVIEW',
              status: '?'
            });
          }
          bug.flags.forEach(function (flag) {
            flag.bug = JSON.parse(JSON.stringify(bug));
            flags.push(flag);
          })
        });
        return res.send(flags);
      });
    }
  };
};



