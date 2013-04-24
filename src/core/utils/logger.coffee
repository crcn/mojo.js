define () ->
    
  logger = {}
  for key in ["log", "warn", "error"] then do (key)  =>
    logger[key] = () ->
      args = Array.prototype.slice.call arguments
      args[0] = "dojo-bootstrap: #{args[0]}"
      console[key].apply console, args

