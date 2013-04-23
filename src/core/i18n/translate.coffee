###
templates.use(i 8n)
###


define ["./loader!"], (translator) -> 
  (text) -> 
    translator.t text
