var hasher = process.browser ? require("hasher") : void 0;

module.exports = function (router) {


  function onHashChange (newHash) {

    // make sure any hash stuff isn't included
    router.redirect(String(newHash || window.location.pathname).replace(/^#?!?\/?(.*)/,"/$1"), function (err) {

      if (err && err.code === "404") {
        router.redirect("404");
      }

      var url = router.get("location.url");

      if (url) {
        window.location.hash = "!" + url;
      }
    });
  }

  router.bind("location.url", function (url) {
    window.location.hash = "!" + url
  });

  hasher.changed.add(onHashChange);
  hasher.initialized.add(onHashChange);

  router.once("init", function () {
    hasher.init();
  })
}
