var nofactor = require("../"),
expect = require("expect.js"),
sinon  = require("sinon");

describe("string dom", function() {
  sd = nofactor.string;

  it("can create a text node", function() {
    expect(sd.createTextNode("hello").toString()).to.be("hello");
  });

  it("doesn't encode a text node", function() {
    expect(sd.createTextNode("hello <world").toString()).to.be("hello <world");
  });

  it("can create an element", function() {
    expect(sd.createElement("div").toString()).to.be("<div></div>");
  });


  it("can add a comment node", function() {
    var comment = sd.createComment("hello");
    expect(comment.toString()).to.be("<!--hello-->");
  });

  it("can create an element with attributes", function() {
    var element = sd.createElement("div");
    element.setAttribute("hello", "world");
    expect(element.toString()).to.be("<div hello=\"world\"></div>");
  });

  it("can remove attributes", function() {
    var element = sd.createElement("div");
    element.setAttribute("hello", "world");
    expect(element.toString()).to.be("<div hello=\"world\"></div>");
    element.setAttribute("hello", undefined);
    expect(element.toString()).to.be("<div></div>");
    element.setAttribute("hello", "b");
    expect(element.toString()).to.be("<div hello=\"b\"></div>");
    element.removeAttribute("hello");
    expect(element.toString()).to.be("<div></div>");

  })

  it("doesn't encode attribute values", function() {
    var element = sd.createElement("div");
    element.setAttribute("href", "http://");
    element.setAttribute("abc", "<;");
    expect(element.toString()).to.be("<div href=\"http://\" abc=\"<;\"></div>");
  });

  it("can create a fragment", function() {
    var frag = sd.createFragment();
    frag.appendChild(sd.createElement("div"));
    frag.appendChild(sd.createTextNode("abc"));
    expect(frag.toString()).to.be("<div></div>abc");
  });

  it("can add children to an element", function() {
    var element = sd.createElement("div");
    var text = sd.createTextNode("hello");
    element.appendChild(text);
    expect(element.toString()).to.be("<div>hello</div>");
  });

  it("can properly add a document fragment to an element", function() {
    var element = sd.createElement("div"),
    tn, tn2;
    var frag = sd.createFragment([tn = sd.createTextNode("hello"), tn2 = sd.createTextNode("world")]);
    element.appendChild(frag);
    expect(element.toString()).to.be("<div>helloworld</div>");
    expect(tn.parentNode).to.be(element);
    expect(tn.nextSibling).to.be(tn2);
  });

  it("can properly prepend a fragment", function() {
    var element = sd.createElement("div"),
    tn, tn2, tn3;


    element.appendChild(tn3 = sd.createTextNode("!!!"));

    var frag = sd.createFragment([tn = sd.createTextNode("hello"), tn2 = sd.createTextNode("world")]);
    element.insertBefore(frag, tn3);
    expect(element.toString()).to.be("<div>helloworld!!!</div>");
    expect(tn.parentNode).to.be(element);
    expect(tn.nextSibling).to.be(tn2);
  });

  it("can add style attributes", function() {
    var element = sd.createElement("div");
    element.style.setProperty("visible", false);

    expect(String(element)).to.be('<div style="visible:false;"></div>');
    element.style.setProperty("visible", true);
    expect(String(element)).to.be('<div style="visible:true;"></div>');
    element.style.setProperty("background-color", "#FF6600");
    expect(String(element)).to.be('<div style="visible:true;background-color:#FF6600;"></div>');
  });


  it("can add multiple styles", function () {
    var element = sd.createElement("div");
    element.setAttribute("style", "position: absolute; top: 0; right: 0; border: 0;");
    expect(element.toString()).to.be('<div style="position:absolute;top:0;right:0;border:0;"></div>');
  });

  it("removes a style if it's blank", function() {
    var element = sd.createElement("div");
    element.style.setProperty("visible", false);

    expect(String(element)).to.be('<div style="visible:false;"></div>');
    element.style.setProperty("visible", "");
    expect(String(element)).to.be('<div style=""></div>');

  })

  it("can manually set the style attribute", function() {
    var element = sd.createElement("div");
    element.setAttribute("style", "visible:false; background-color:red;");
    expect(element.style.visible).to.be("false");
    expect(element.style["background-color"]).to.be("red");

  });

  // DOM compliant
  it("lowercases an attribute name", function() {
    var element = sd.createElement("div");
    element.setAttribute("onClick", "false");
    expect(String(element)).to.be("<div onclick=\"false\"></div>");
  })



  it("has the proper siblings", function() {

    var element = sd.createElement("div"),
    tn = sd.createTextNode("hello"),
    tn2 = sd.createTextNode("hello2"),
    tn3 = sd.createTextNode("hello3");

    element.appendChild(tn);
    element.appendChild(tn2);
    element.appendChild(tn3);

    function testThree() {
      expect(tn.nextSibling).to.be(tn2);
      expect(tn2.nextSibling).to.be(tn3);
      expect(tn3.nextSibling).to.be(undefined);
      expect(tn3.previousSibling).to.be(tn2);
      expect(tn2.previousSibling).to.be(tn);
      expect(tn.previousSibling).to.be(undefined);
    }

    testThree();

    element.removeChild(tn2);
    expect(element.toString()).to.be("<div>hellohello3</div>")

    expect(tn.nextSibling).to.be(tn3);
    expect(tn3.nextSibling).to.be(undefined);
    expect(tn3.previousSibling).to.be(tn);
    expect(tn.previousSibling).to.be(undefined);

    element.insertBefore(tn2, tn3);

    testThree();
    expect(element.toString()).to.be("<div>hellohello2hello3</div>")


    element.removeChild(tn);
    expect(tn2.previousSibling).to.be(undefined);

    element.insertBefore(tn3, tn2);
    expect(tn2.previousSibling).to.be(tn3);

  });

  
  it("has the proper node attribute info", function() {
    var node = sd.createElement("div");
    node.setAttribute("id", "test");
    expect(node.attributes.length).to.be(1);
    node.setAttribute("id", "test2");
    expect(node.attributes.length).to.be(1);
    expect(node.getAttribute("id")).to.be("test2");
  });


  it("properly maintains the order of nodes that exist when calling insertBefore", function () {
    var node = sd.createElement("div");
    for (var i = 10; i--;) node.appendChild(sd.createTextNode(i));
    var end = sd.createTextNode("end");
    node.appendChild(end);
    var childNodes = node.childNodes.concat();
    for (var i = 10; i--;) node.insertBefore(childNodes[i], end);
    expect(node.toString()).to.be("<div>0123456789end</div>");
  }); 

  it("ignores insertBefore if the node is itself", function () {
    var node = sd.createElement("div");
    var child = sd.createTextNode("ab");
    node.appendChild(child);
    expect(node.toString()).to.be("<div>ab</div>");
    node.insertBefore(child, child);
    expect(node.toString()).to.be("<div>ab</div>");
  });

  it("ignores if the appended / prepended node is itself", function () {
    var node = sd.createElement("div");
    var child = sd.createTextNode("ab");
    node.appendChild(child);
    expect(node.toString()).to.be("<div>ab</div>");
    node.appendChild(node);
    expect(node.toString()).to.be("<div>ab</div>");
    node.prependChild(node);
    expect(node.toString()).to.be("<div>ab</div>");
  });


  it("sets the child parent / siblings to undefined if removed from an element", function () {
    var node = sd.createElement("div");
    child = sd.createTextNode("ab");
    var prec = sd.createTextNode("pre");
    var posc = sd.createTextNode("pos");
    node.appendChild(prec);
    node.appendChild(child);
    node.appendChild(posc);
    expect(child.parentNode).to.be(node);
    node.removeChild(child);
    expect(child.parentNode).to.be(void 0);
    expect(child.nextSibling).to.be(void 0);
    expect(child.previousSibling).to.be(void 0);
  });


  it("triggers a change when an element is appended, insertedBefore, insertedAfter, or removed", function () {
    var node = sd.createElement("div"),
    cd       = sd.createTextNode("ab"),
    cd2      = sd.createTextNode("ab2");
    node.appendChild(cd2);

    var stub = sinon.stub(node, "_triggerChange");

    node.appendChild(cd);

    expect(stub.callCount).to.be(1);
    node.removeChild(cd);
    expect(stub.callCount).to.be(2);
    node.prependChild(cd);
    expect(stub.callCount).to.be(3);
    node.removeChild(cd);
    node.insertBefore(cd, cd2);
    expect(stub.callCount).to.be(5);

  });

  it("bubbles up trigger changes", function () {
    var node = sd.createElement("div"),
    cd       = sd.createElement("div");

    node.appendChild(cd);
    node.toString();
    expect(node._innerHTML).to.be("<div><div></div></div>")
    cd._triggerChange();
    expect(node._innerHTML).to.be(void 0);
  });


});