define ["./views/helloWorld"], (HelloWorldView) ->
  new HelloWorldView({ name: "craig" }).attach($("body"))