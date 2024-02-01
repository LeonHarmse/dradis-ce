document.addEventListener('turbolinks:load', function() {
  var $infiniteScrollContainer = $('[data-behavior="infinite-scroll-container"]');
  var loading = false;

  if ($infiniteScrollContainer.length) {
    var $viewContent = $('[data-behavior="view-content"]');

    $viewContent.on('scroll', function() {
      var canLoadMore = $infiniteScrollContainer.data('canLoadMore');
      var scrollHeight = $viewContent[0].scrollHeight;
      var scrollTop = $viewContent.scrollTop();
      var viewHeight = $viewContent.height();

      // 64px is the sum of margin bottom and padding bottom of the content-container class
      if (canLoadMore && !loading && viewHeight + scrollTop >= (scrollHeight - 64)) {
        var page = $infiniteScrollContainer.data('page') + 1;
        var url = $infiniteScrollContainer.data('url');
        loading = true;
        $('[data-behavior="activities-spinner"]').show();

        $.ajax({
          url: url,
          data: { page: page },
          success: function(data) {
            loading = false;
            $('[data-behavior="activities-spinner"]').hide();
          }
        })
      }
    });
  }

  $('[data-behavior~=activity-filters] select').change(function () {
    $(this).closest('form').submit();
  });

  $('[data-behavior~=activity-filters] input[type="date"]').change(function () {
    const dateValue = $(this).val();
    const periodStart = $('[data-behavior~=since]').attr('min');
    if (dateValue !== '' && !isNaN(Date.parse(dateValue))) {
      if (Date.parse(dateValue) >= Date.parse(periodStart)) {
        $(this).closest('form').submit();
      }
    }
  });
});
