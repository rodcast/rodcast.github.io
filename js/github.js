(function($) {
  "use strict";
  
  /*!
  * Return a new string with the string/number padded left using [ch] of [num] length
  * @version 1.0.0
  * @date June 30, 2010
  * @package jquery-sparkle {@link http://www.balupton/projects/jquery-sparkle}
  * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
  * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
  * @license GNU Affero General Public License version 3 {@link http://www.gnu.org/licenses/agpl-3.0.html}
  */
  Number.prototype.padLeft = String.prototype.padLeft = String.prototype.padLeft || function(ch, num) {
    var val = String(this),
        re = new RegExp('.{' + num + '}$'),
        pad = '';

    if (!ch && ch !== 0) {
      ch = ' ';
    }

    do {
      pad += ch;
    } while (pad.length < num);

    return re.exec(pad + val)[0];
  };

  /*!
  * The API has been updated to return the values with the same key names as the regular Repository API
  * More information and documentation: http://develop.github.com/
  */
  $.getJSON("https://api.github.com/users/rodcast/repos?sort=updated&callback=?", function(response) {
    if (response && response.data && response.data.length) {
      var fork, name, description, url, pushed_at, date, datetime,
          rows = [];

      $.each(response.data, function(i, repository) {
        fork = repository.fork;

        if (!fork) {
          name = repository.name;
          description = repository.description;
          url = repository.html_url;
          pushed_at = repository.pushed_at;
          date = new Date(pushed_at);
          datetime = [date.getFullYear(), (date.getMonth() + 1).padLeft(0, 2), date.getDate().padLeft(0, 2)].join("-");

          rows.push('<li><time datetime="' + datetime + '" pubdate="pubdate">' + pushed_at + '</time>' +
                    '<strong><a title="' + name + '" href="' + url + '" target="_blank" rel="external">' + name + '</a></strong>' +
                    '<div class="description">' + description + '</div></li>');
        }
      });

      $("#repo-listing").empty().append(rows.join(""));
    }
  });
}(jQuery, undefined));