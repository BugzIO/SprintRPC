/* globals ga */

(function(i, s, o, g, r, a, m) {
    i.GoogleAnalyticsObject = r; /*jshint -W030 */
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date(); /* jshint -W030 */
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', window.angularConfig.ga_id, 'auto');
ga('send', 'pageview');