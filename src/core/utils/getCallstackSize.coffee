define [], () ->
  () ->
    count = 0
    fn = arguments.callee
    counts = {}
    while (fn = fn.caller) and count < 10000
      fns = String(fn)
      counts[fns] = if counts[fns]? then counts[fns] + 1 else 1
      count++

    console.log "stack"
    console.log Object.keys(counts).length
    biggest = null
    for key of counts
      if not biggest
        biggest = key
        continue


      if counts[key] > counts[biggest]
        key = biggest

    console.log counts[biggest], biggest

    console.log "end stack"
    count