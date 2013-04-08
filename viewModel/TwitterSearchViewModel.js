/*globals $, application, ko, localStorage, searchResultsViewModel, TwitterSearchService, TweetViewModel */

function TwitterSearchViewModel() {
  /// <summary>
  /// A view model for searching twitter for a given term
  /// </summary>

  var that = this,
      twitterSearchService = new TwitterSearchService();

  // --- properties

  this.template = "twitterSearchView";
  this.isSearching = ko.observable(false);
  this.userMessage = ko.observable();
  this.searchTerm = ko.observable("#knockoutjs");
  this.recentSearches = ko.observableArray();

  // --- private functions

  function saveState() {
    /// <summary>
    /// Saves the view model state to local storage
    /// </summary>
    localStorage.setItem("state", that.recentSearches().toString());
  }

  function addSearchTermToRecentSearches() {
    /// <summary>
    /// Adds the current search term to the search history
    /// </summary>

    // check whether we already have this item in our recent searches list
    var matches = $.grep(that.recentSearches(), function (recentSearchTerm) {
      return recentSearchTerm === that.searchTerm();
    });

    // if there is no match, add this term
    if (matches.length === 0) {

      // add the new item
      that.recentSearches.unshift(that.searchTerm());

      // limit to 5 recent search terms
      while (that.recentSearches().length > 5) {
        that.recentSearches.pop();
      }

      saveState();
    }
  }

  // --- public functions

  this.search = function () {
    /// <summary>
    /// Searches twitter for the current search term.
    /// </summary>

    if ($.trim(this.searchTerm()) === "") {
      return;
    }

    this.userMessage("");
    this.isSearching(true);

    twitterSearchService.searchForKeyword(that.searchTerm(), 1, function (tweets) {
      if (tweets.length > 0) {
        // store this search
        addSearchTermToRecentSearches();

        // navigate to the results view model
        searchResultsViewModel.init(that.searchTerm(), tweets);
        $.mobile.changePage("#" + searchResultsViewModel.template);
      } else {
        that.userMessage("There were no matches for the given search term");
      }

      that.isSearching(false);
    });

  };

  this.loadState = function () {
    /// <summary>
    /// Loads the persisted view model state from local storage
    /// </summary>

    var state = localStorage.getItem("state");
    if (typeof (state) === 'string') {
      $.each(state.split(","), function (index, item) {
        if (item.trim() !== "") {
          that.recentSearches.push(item);
        }
      });
    }
  };


  this.recentSearchClicked = function (item) {
    /// <summary>
    /// Handles clicks on recent search terms.
    /// </summary>
    var selectedSearchTerm = item;
    that.searchTerm(selectedSearchTerm);
    that.search();
  };

  
}
