var RODCAST = RODCAST || {};

  /*!
  * The API has been updated to return the values with the same key names as the regular Repository API
  * More information and documentation: http://develop.github.com/
  */
  RODCAST.getGithubRepository = (function() {
    $.RODCAST = $.RODCAST || {};

    $.extend($.RODCAST, {
      getData: function() {
        var rows = [];
        
        $.getJSON("https://api.github.com/users/rodcast/repos?sort=updated&callback=?", function(response) {
          if (response && response.data && response.data.length) {
            var fork, name, description, url, pushed_at, date, datetime;

            $.each(response.data, function(index, repository) {
              fork = repository.fork;

              if (!fork) {
                name = repository.name;
                description = repository.description;
                url = repository.html_url;
                pushed_at = repository.pushed_at;
                date = new Date(pushed_at);
                datetime = [date.getFullYear(), ("0" + (date.getMonth() + 1)).slice(-2), ("0" + date.getDate()).slice(-2)].join("-");
                rows.push('<li class="repos-item"><time class="repos-time" datetime="' + datetime + '" pubdate="pubdate">' + pushed_at + '</time>' +
                          '<span class="repos-title"><a title="' + name + '" href="' + url + '" class="repos-url" rel="external">' + name + '</a></span>' +
                          '<span class="repos-description">' + description + '</span></li>');
              }
            });
            
            $(".repos-list").empty().append(rows.join(''));
          }
        });
      },

      initialize: function() {
        this.getData();
      }
    });
  
    $(function () {
      $.RODCAST.initialize();
    });
})(jQuery, undefined);