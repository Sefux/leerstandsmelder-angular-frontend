This is a collection of mixins that are constructors using angular-material, but could be switched out for other frameworks.

- They take the "TEXT" and try to translate if possible.
- If there is an action (on buttons), they use ng-click
- form inputs switch on "field_type"


## REGISTRY ##

`_mixin_layout.jade`
- mixin layout(layout, align, fill)
- mixin content(layout, align)

EXAMPLES
- +layout('column','center center',true)
- +content('column','start center')



`_mixin_style.jade`
- mixin headline(text)

EXAMPLES
- +headline("Login")


`_mixin_buttons.jade`
- mixin button(TEXT, _ng_click, _class, icon, _ng_if, _sys)
- mixin button_notranslate(TEXT, _ng_click, _class, icon, _ng_if, _sys)
- mixin button_fab(TEXT, _ng_click, _class, icon, _ng_if)
- mixin lockswitch(TEXT, model, _ng_click, icon, _ng_disabled)


`_mixin_form.jade`
- mixin input(field_type, field_key, resource_list, sys_val, no_label)
    - field_type == 'file'
    - field_type == 'fileimage'
    - field_type == 'slider'
    - field_type == 'textarea'
    - field_type == 'checkbox'
    - field_type == 'select'
    - field_type == 'radio'
    - field_type == 'chip'
    - field_type == 'autocomplete'
    - field_type == *


`_mixin_media.jade`
- mixin media(field_type, width, height, clickaction)
    - field_type == 'image'
    - field_type == 'video'
    - field_type == 'audio'
- mixin player(type) // NEEDS REFACTORING!!!!!!


`_mixin_rating.jade`
- mixin star
- mixin stars
- mixin ratingCount
- mixin ratingValue
- mixin userViews


