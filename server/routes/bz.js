module.exports = function (bugzilla) {
  return {
    bugs: function (req, res, next) {
      var url = 'https://bugzilla.redhat.com/jsonrpc.cgi?method=Bug.search';
      url += "&params=" + encodeURIComponent(JSON.stringify([req.query]));

      console.log(url);

      require("request")({
          uri: url,
          method: 'GET',
          body: null,
          headers: { 'Content-type': 'application/json' }
        },
        function (error, response, body) {
          if (error) return next(error);
          body = JSON.parse(body);

          // If due to wrong params the result is null &
          // The error will be !null & error.message explains
          if (body.error) return res.status(404).send(body);

          var bugs = body.result.bugs
            , output = bugs.map(function(bug) {

            // Check real name
            if (!bug.assigned_to) {
              bug.assigned_to = "N/A";
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
        }
      );
    },
    flags: function (req, res, next) { /*
      bugzilla.searchBugs({
        'f1': 'requestees.login_name',
        'v1': req.query.user,
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
        }); */

        // Should return `flags`, but there's some sort of fail
        // with bugzillaEmail localStorage thingy in ng-controller
        return res.send([]);
      // });
    }
  };
};
