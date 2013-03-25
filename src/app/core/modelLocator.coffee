define ["../../core/models/locator", "../../core/collections/index"], (modelLocator, Collection) ->
  
  modelLocator.set

    ###
    ###

    grades: new Collection([
      "Pre-school",
      "Kindergarten",
      "1st Grade",
      "2nd Grade",
      "3rd Grade",
      "4th Grade",
      "5th Grade",
      "6th Grade",
      "7th Grade",
      "8th Grade",
      "9th Grade",
      "10th Grade",
      "11th Grade",
      "12th Grade",
      "Other"
    ].map((label) ->
      {
        _id: label,
        name: label
      }
    ))

  setTimeout (() ->
    console.log "PUSH"
    modelLocator.get("grades").pop()
    modelLocator.get("grades").push { name: "fdsfsfsfds", _id: "5396" }
  ), 1000
  modelLocator