# VIEW CONSTRUCTION KIT

1. Describe JADE in JSON
2. Describe LESS in JSON
3. Integrate JADE MIXINS with JSON
3. Use `gulp` to create JADE & LESS
4. Use normal `gulp` pipeline to build static resources

sample-view.json
```
{
    "include" : "_mixin_form",
    "include" : "_mixin_buttons",
    "include" : "_mixin_media",
    "include" : "_mixin_rating",
    "div" : {
        "class" : "asset-basic",
        "less" : {
            "width":"200px",
            "margin":"20px",
        }
        "form" : {
            "jade" : "action='asset-basic', method='put'",
            "less" : {
                "background":"grey",
                "color":"white"
            },
            "+input" : "'text','asset.title', 'asset.i18n_key', null, null",

        }
    }
}
```