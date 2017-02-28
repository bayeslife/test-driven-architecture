
function runFeature() {
  var $output = $('#output');
  $output.empty();

  var featureSource = document.getElementById("feature").textContent;

  var cucumber = Cucumber(featureSource, mysupport);

  var prettyFormatterOptions = {
    logToFunction: function(data) {

      data = ansi_up.ansi_to_html(data);
      $output.append(data);
      $output.scrollTop($output.prop("scrollHeight"));
    },
    useColors: true
  };
  //var listener = Cucumber.Listener.JsonFormatter();
  var listener = Cucumber.Listener.PrettyFormatter(prettyFormatterOptions);
  cucumber.attachListener(listener);

  $('a[href="#output-tab"]').tab('show');

  try {
    cucumber.start(function() {});
  } catch(err) {
    var errorContainer = $('<div>')
    errorContainer.addClass('error').text(err.stack);
    $output.append(errorContainer);
  };
};

$("#feature").change(function() { $(this).text($(this).val()); });

$(function() {
  $('#run-feature').click(runFeature);
});
