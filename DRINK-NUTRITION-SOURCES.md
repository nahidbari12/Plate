# Coffee and tea catalog

Checked: November 23, 2026. US menus. This is an offline snapshot, not a live connection to restaurant ordering systems. Store availability and seasonal ingredients may differ.

## What is included

- Homemade: plain coffee, black/green/herbal tea, measured milk/cream/sweetener amounts, selected packaged syrups, and label entry. Household values are explicitly estimates.
- Tim Hortons: size-specific Original Blend, dark roast, Original iced coffee, cold brew, steeped tea, specialty tea, and the milk/cream, sweetener and syrup options attached to each published US item. Half cream and Splenda use the option nutrition, not a generic calorie value or a naive half of the full-portion value.
- Starbucks: published US base-drink nutrition, size options, and the listed milk/creamer, sweetener, syrup/sauce selections for those drinks. Unpublished add-in nutrition requires label entry.
- BIGGBY: published base and selected standard latte/tea recipes, in their published sizes. Ingredient options are based on its official dietary-restrictions guide. Unpublished component nutrition requires label entry; included milk/syrups are not subtracted or replaced by guessing.
- Dunkin’: published hot coffee, iced coffee and cold-brew recipes mapped to the selected standard cream/milk, sugar and caramel/French vanilla/mocha combinations. Complete recipes preserve the guide’s rounding. Unsupported combinations, extra amounts and flavor shots require label entry. A standard amount is not represented as one pump. Unsweetened hot tea uses the guide’s statement of no nutritional significance; iced tea needs label values.
- 7-Eleven: official creamer names and an explicit cup-size entry. Its source does not give dispenser nutrition; base and add-in label values are required. Tea availability is explicitly store-dependent.

## Primary sources

1. Tim Hortons US menu: https://www.timhortons.com/menu
   Public US ordering-menu dataset used by the official application: `https://czqk28jt.api.sanity.io/v2021-10-21/data/query/prod_th_us`.
   The official website's public client configuration identifies the project (`czqk28jt`) and `prod_th` dataset naming; this snapshot uses the **US** dataset, not Canadian nutrition guides.
   Original Blend source records: `item_26721`, `item_26722`, `item_34204`, `item_26724`; dark roast: `item_25788`–`item_25791`; Original iced coffee: `item_25823`–`item_25825`; cold brew: `item_47006`–`item_47008`; specialty/steeped tea: `item_25804`–`item_25811`.
   Nutrition comes from each item’s `nutrition` and its own `options[].options[].nutrition`. Amount labels resolve the `modifierMultiplier` reference; they are not inferred from the record ID. Nonstandard multipliers without a clear half/whole portion are excluded.
2. Starbucks US ordering menu: https://www.starbucks.com/menu
   Published product data: `https://www.starbucks.com/apiproxy/v1/ordering/{productNumber}/{formCode}`.
   Products: `480/hot`, `2123863/iced`, `2121255/iced`, `450/hot`, `457/iced`, `459/iced`, `873068754/hot`.
   Sizes use the returned nutrition, and add-in names/amounts use the returned product options. No unpublished pump or splash calories are invented.
   Customization overview: https://about.starbucks.com/stories/2025/ways-to-customize-your-beverage-at-starbucks/
3. BIGGBY current menu nutrition link: https://biggby.com/nutrition
   Guide at retrieval: https://biggby.com/wp-content/uploads/2026/11/BIGGBY_Website_Nurtition_11.2.26.pdf
   Ingredient choices: https://feedback.biggby.com/support/solutions/articles/66000486558-allergies-and-dietary-restrictions
4. Dunkin’ official nutrition page: https://www.dunkindonuts.com/nutrition/
   PDF linked at retrieval: https://assets.ctfassets.net/ubkcphxhphh0/7rROjtYxvOHQdLBTpamhuC/bbe6e300983a1fb1b5beb76ab4879556/DD_W8_nutrition_guide.pdf
5. 7-Eleven creamer choices: https://www.7-eleven.com/blog/food-and-drink/coffee-creamers-you-can-find-at-7-eleven
   Coffee overview: https://www.7-eleven.com/coffee/our-story
6. Packaged home ingredients: https://www.torani.com/vanilla.html (80 kcal/2 tbsp; scaled to a measured tablespoon), https://www.hersheyland.com/products/hersheys-chocolate-syrup-24-oz-bottle.html (45 kcal/1 tbsp), https://www.splenda.com/product/splenda-sweetener-packets/ (label calorie rounding).
   Household milk/sugar/brewed-drink figures are generic estimates, not restaurant component values. General food-reference resource: https://fdc.nal.usda.gov/

## Important calculation rules

- Tim Hortons Original iced coffee's published base already contains sugar. Selecting Splenda does not remove this. The UI says so and allows replacement base label values with a description; it never guesses the unsweetened base by subtraction.
- Missing values remain unknown. Review is blocked until required missing calories, protein, carbs and fat are supplied. The app never logs a base-only subtotal as a complete drink.
- Vitamins/minerals/caffeine are totaled only when every active component has that nutrient. Unknown caffeine is not zero.
- Published source labels indicate origin, not a guarantee of accuracy. Customized amounts are calculated; actual preparation and label rounding vary.
- Adding a drink still requires the existing review-and-confirm form. Users can choose the meal, adjust nutrition/servings, and save the completed drink to My foods.
- No account, API key, profile or diary data is sent to a restaurant. Catalog selections/calculations run locally.
