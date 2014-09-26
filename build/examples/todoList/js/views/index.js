module.exports = function (application) {
  application.views.register({
    main: require("./main/index")
  });
}