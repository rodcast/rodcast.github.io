(function(a){
/*!
  * Return a new string with the string/number padded left using [ch] of [num] length
  * @version 1.0.0
  * @date June 30, 2010
  * @package jquery-sparkle {@link http://www.balupton/projects/jquery-sparkle}
  * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
  * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
  * @license GNU Affero General Public License version 3 {@link http://www.gnu.org/licenses/agpl-3.0.html}
  */
;Number.prototype.padLeft=String.prototype.padLeft=String.prototype.padLeft||function(d,b){var f=String(this),c=new RegExp(".{"+b+"}$"),e="";if(!d&&d!==0){d=" "}do{e+=d}while(e.length<b);return c.exec(e+f)[0]};
/*!
  * The API has been updated to return the values with the same key names as the regular Repository API
  * More information and documentation: http://develop.github.com/
  */
;a.getJSON("https://api.github.com/users/rodcast/repos?sort=updated&callback=?",function(f){if(f&&f.data&&f.data.length){var d,b,i,c,h,e,g,j=[];a.each(f.data,function(k,l){d=l.fork;if(!d){b=l.name;i=l.description;c=l.html_url;h=l.pushed_at;e=new Date(h);g=[e.getFullYear(),(e.getMonth()+1).padLeft(0,2),e.getDate().padLeft(0,2)].join("-");j.push('<li class="repos-item"><time class="repos-time" datetime="'+g+'" pubdate="pubdate">'+h+'</time><span class="repos-title"><a title="'+b+'" href="'+c+'" class="repos-url" rel="external">'+b+'</a></span><span class="repos-description">'+i+"</span></li>")}});a(".repos-list").empty().append(j.join(""))}})}(jQuery,undefined));