There are a few parts we need to keep in mind when writing an application for the front-end:

1. data-binding - code that binds MODEL data with VIEW data, and updates the view whenever the model changes
2. models - representations for data that can be bound to
3. collections - collections of models that can be bound to
4. routing - URI routing 
  - some views need to be maintained while routing, such as a navigation bar - it shouldn't load each time
5. model locator - a singleton (yuck) that has most models. This can be accessed throughout the application
6. business logic - interfaces the model locator


Problems:

1. How do we maintain view states while navigating with a router?


Libraries to consider:

RULES:

1. Views CANNOT have business logic associated with them. They need to be stored in "commands", or "controllers", which does all the necessary logic.
2. Business delegates must be generalized such that they can use RPC, or REST. By default, an RPC-like interface will be used for the front-end code since it's a bit more javascript-y. 
3. controllers tie together the views & view templates


