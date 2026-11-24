# Chipotle and QDOBA meal picker

US ingredient catalog checked November 23, 2026. Web only; Android is unchanged.

## Sources

### Chipotle

- Official nutrition calculator: https://www.chipotle.com/nutrition-calculator
- Official US ingredient metadata used by that site's public ordering application: `https://services.chipotle.com/menu-metadata/v1/menu-metadata/nutrition?channel=web&region=US`.
- Public restaurant-menu records for ingredient names and bowl eligibility: `https://services.chipotle.com/menuinnovation/v1/restaurants/3601/onlinemenu/compressed?channelId=web&includeUnavailableItems=true`.
- Official US printed guide: https://www.chipotle.com/content/dam/chipotle/menu/nutrition/US-Nutrition-Facts-Paper-Menu-3-2025.pdf

The catalog includes chicken, steak, carnitas, beef barbacoa, sofritas and limited-time smoked brisket; white/brown rice; black/pinto beans; fajita vegetables and romaine; four salsas; guacamole, queso blanco, sour cream, cheese and honey vinaigrette; chips and large chips. Ingredients use the current metadata's portion and nutrition. Vinaigrette uses the published printed-guide row. A restaurant's availability can differ.

Protein records are single servings from the Bowl variants, not the website's incomplete “Extra” or “Half” protein records. Those extra/half metadata records contain calorie-only placeholders and are deliberately excluded. Double/triple protein uses 2 or 3 times the full published protein serving.

The burrito tortilla uses the verified 320-kcal burrito-size tortilla record (`CMG-4025`) and printed guide. The `CMG-5501` metadata record is not used: its returned portion/image and 250-kcal values do not identify the verified burrito-size tortilla consistently.

Metadata fields for calcium, iron and vitamins are percentages on an unspecified reference basis. They are not converted into milligrams or micrograms. Only reported sodium, saturated fat and fiber amounts are imported into the corresponding daily-nutrient fields.

### QDOBA

- Official nutrition page: https://www.qdoba.com/nutrition-allergens
- Nutrition PDF linked by that page at retrieval: https://assets.ctfassets.net/0tc4847zqy12/bQFJBCmsAk4ww4qzdfAOm/43aa302d523214dcd4e395ec2207d81a/Nutrition_11.3.26__2_.pdf

The catalog imports the guide's adult “Ingredients for Entrées” rows, excludes its Canadian vinaigrette, and adds the separately listed limited-time chicken tinga and tortilla soup ingredients. It includes the guide's local/plant-based/breakfast proteins, rice and beans, vegetables, salsas, dairy toppings, dressings and extras. Select-location and limited-time notes are retained. Separate listed sizes, such as 2 oz and 4 oz guacamole or queso, remain distinct rows with their own published values; rounding is not forced to be linear across those rows.

The 12.5-inch flour tortilla is the initial wrap option; the published 10-inch tortilla can also be selected. Smaller taco tortillas and crunchy shells are optional extras, not automatically counted as the burrito wrapper.

## Calculation and behavior

- Search Chipotle or QDOBA in Add food or Food library, then tap the result. Qudoba/Quodoba search spellings also match QDOBA.
- Choose Bowl or Wrap / burrito. Bowls add no automatic tortilla. Wraps add exactly the selected tortilla count, independently of filling servings.
- Each ingredient offers None, 1, 2 or 3 published servings. Multiple proteins and both rice/bean types can be entered if that is what was eaten. Ingredient portion weights and per-serving calories/protein are visible.
- Totals are the sum of selected ingredient values multiplied by the chosen serving count. Restaurant hand-served portions vary; these are calculated totals based on published servings, not a measurement of the served meal.
- A veggie order is assembled by leaving meat unselected and choosing vegetables, beans, plant protein and/or guacamole explicitly. No free guacamole or other toppings are silently added or counted twice.
- Only nutrients reported for every selected item are summed into the optional daily nutrient fields. Unknown nutrients remain missing.
- The existing review form still requires confirmation before adding to a meal. Users can edit the name, portions or nutrition and save the completed meal to My foods.
- Ingredient details are retained in the source text. Long serving descriptions are shortened to meet existing backup limits while preserving the full ingredient breakdown in the source.
- No credentials or restaurant API calls are shipped with the app. The catalog and calculations run locally; external links open the official source pages.

## Validation

`tests/restaurant-meals.cjs` exercises the actual search, picker and review handlers with Linkedom, including double/triple servings, tortilla inclusion/removal, QDOBA tortilla sizes, shop changes, saved foods, backups, invalid inputs and large orders. With Node and Linkedom installed, run `node tests/restaurant-meals.cjs` from this repository. Browser and real-device tests are separate from these DOM checks.
