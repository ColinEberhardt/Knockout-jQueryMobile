/*globals $, TweetViewModel */

function TwitterSearchService() {
  /// <summary>
  /// A service that provide a very simple twitter search function, returing a simplified
  /// version of the response provided by the Twitter APIs
  /// </summary>

  var baseUrl = "http://search.twitter.com/search.json?q=";

  this.searchForKeyword = function (searchString, pageNumber, callback) {

    var url = baseUrl + encodeURIComponent(searchString) + "&amp;page=" + pageNumber;
    $.ajax({
      dataType: "jsonp",
      url: url,
      success: function (response) {

        // create an array to hold the results
        var tweetViewModels = [];

        // add the new items
        $.each(response.results, function (index, item) {
          tweetViewModels.push({
            author: item.from_user,
            time: item.created_at,
            text: item.text,
            thumbnail: item.profile_image_url
          });
        });

        callback(tweetViewModels);
      }
    });
  };
}