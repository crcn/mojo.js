### Forms

```coffeescript
class CreateClassForm extends Form

  ###
   Used for validation, as well as creating the model which is used for submitting to the
   server.
  ###

  schema: ClassSchema

  ###
   The element used to trigger submit. This is disabled until validation is complete.
  ###

  submitButtonElement: "#next"

  ###
   The input elements for this form
  ###

  children: {
    ".select-grade": SelectGradeView,
    ".input-name": InputClassNameView
  }


  ### 
   Called after submission. This is where the form interacts with the business backend - Note that
   after "submit", the form creates a model out of the schema. Ideally, the business logic is stored within the model, and 
   NOT within the view.
  ###

  _submit: (next) -> this.get("model").save next

```