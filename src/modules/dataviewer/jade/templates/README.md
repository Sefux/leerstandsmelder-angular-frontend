- WE DO NOT MAKE ANY PRESUMPTIONS ABOUT STYLING
- WE DO ASSUME THAT ALL FIELDS ARE THEORETICALLY EDITABLE,
- WHICH IS WHY WE OFFER THE FORM FIELD RENDER OPTION UNLESS THE KEY-VALUE IS *SYSTEM ONLY* OR NOT A VALID FORM ELEMENT


```
mixin input(%field_type, %field_key, %resource_list, %sys_val)
	%field_type			-> String, required  e.g. 'textarea'
	%field_key          -> String, required  e.g. 'asset.title'
	%resource_list	    -> String, optional  e.g. 'licenses.assets'
	%resource_list	    -> Array, optional  e.g. '["red","blue","green"]'
	%sys_val 			-> Boolean, optional e.g. true (read-only)
```



- all of these mixins expect that asset is defined by angular
- 'asset.editable' is set/checked server side by ACL middleware and triggered by user action in angular or other UI logic
-  sys_val is here to put system info into a form that the user won't be able to edit


FROM LAYOUT:

form methods can be:
```
[post] > create asset
[put] > update asset
[delete] > delete asset
```