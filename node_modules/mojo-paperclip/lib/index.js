var protoclass = require("protoclass"),
paperclip      = require("paperclip");

var decorator = {

  /**
   */

  multi: false,

  /**
   */

  priority: "render",

  /**
   */

  getOptions: function (view) {
    return view.__isView;
  },

  /**
   */

  decorate: function (view, options) {

    var listening, rendered, content, template;
    view._define("paper");
    view.on("render", render);
    view.on("remove", remove);
    view.on("change:paper", onPaperChange);
    view.on("change:visible", onVisibiltyChange);
    if (view.paper) onPaperChange(view.paper);

    var paper;

    function render () {


      if (view.paper !== paper) { 
        if (content) content.dispose();
        rendered = false;
        paper    = view.paper;
        template =  paperclip.template(paper, view.application);
      }

      if (rendered || !template) return;

      rendered = true;

      if (content) {
        content.bind(view);
      } else {
        view.section.paper = content = template.bind(view, view.section);
      }

    }

    function remove (hard) {
      if (!content) return;
      content.unbind();
      rendered = false;
    }

    function onVisibiltyChange (v) {
      if(v) {
        render();
      } else {
        remove();
      }
    }

    function onPaperChange (paper) {
      if (rendered && view.visible) {
        render();
      }
    }
  }
}


module.exports = function (app) {
  if (app.views.__paperclip) return;
  app.use(paperclip);
  app.views.__paperclip = true;
  app.views.decorator(decorator);
}

