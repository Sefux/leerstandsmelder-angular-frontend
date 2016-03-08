FLOW

1. signup
 - user.name
 - user.pass
2. challenge
 - challenge.response
3. → /modules/profile
 - user.email (optional)
 - user.name
 - user.pass
 - ...
 
1. forgot (if email)
 - token 
2. → /modules/profile
 
1. login
 - user.name
 - user.pass
2. → /modules/profile
 - user.email (optional)
 - user.name
 - user.pass
 - ...
 
 
 http://jade-lang.com/reference/attributes/#and-attributes
### Danger
 
Attributes applied using `&attributes` are not automatically escaped. 
You must be sure to sanitize any user inputs to avoid cross-site scripting. 
This is done for you if you are passing in attributes from a mixin call.
 
This means that EVERYTHING passed through a mixin call is sanitized, which may actually be a serious problem.