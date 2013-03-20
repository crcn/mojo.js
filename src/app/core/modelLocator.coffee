define ["../../core/models/locator", "../../core/collections/concrete"], (modelLocator, Collection) ->
  
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
        name: label
      }
    ))

  modelLocator