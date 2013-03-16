define ["./base"], (BaseDecorator) ->
  
  class BindingsDecorator extends BaseViewDecorator

  BindingsDecorator.test = (view) ->
    return view.has("bindings")

  BindingsDecorator