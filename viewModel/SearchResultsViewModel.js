/*globals $, ko, TwitterSearchService, tweetViewModel*/

function SearchResultsViewModel() {
  /// <summary>
  /// A view model that renders the results of a twitter search.
  /// </summary>

  var that = this,
      twitterSearchService = new TwitterSearchService();

  // --- properties

  this.template = "searchResultsView";
  this.tweets = ko.observableArray();
  this.isSearching = ko.observable(false);
  this.pageNumber = ko.observable(1);
  this.searchString = "";

  // --- public functions

  this.init = function (searchText, tweetViewModels) {
    this.tweets(tweetViewModels);
    this.pageNumber = ko.observable(1);
    this.searchString = searchText;
  };

  this.loadMore = function () {
    this.pageNumber(this.pageNumber() + 1);
    this.isSearching(true);

    twitterSearchService.searchForKeyword(this.searchString, this.pageNumber(), function (tweets) {
      that.isSearching(false);
      
      // push all of the received tweets into our list in one atomic action
      if (tweets.length > 0) {
        var temp = ko.utils.unwrapObservable(that.tweets);
        $.each(tweets, function (index, tweet) {
          temp.push(tweet);
        });
        that.tweets(temp);
      }
    });
  };

  this.tweetClicked = function (tweet) {
    // navigate to the tweet
    tweetViewModel.init(tweet);
    $.mobile.changePage("#" + tweetViewModel.template);
  };

}