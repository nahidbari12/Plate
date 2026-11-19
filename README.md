# Plate for iPhone — GitHub Pages

Static personal calorie and macro tracker, version 1.3.1. Includes 50 curated US favorites, 20 Mediterranean dishes, profiles, household recipes, barcode serving review, and optional Gemini photo estimates. Starter nutrition values are editable estimates.

## Enable hosting
Settings → Pages → Deploy from a branch → main → /(root) → Save. No Node server or build is needed.

Open the URL GitHub displays in Safari and use Share → Add to Home Screen. The app is a web app, not a native App Store package.

## Move your diary
Export a backup from the old app before moving. The GitHub Pages address has separate browser storage. Import your backup in Settings on the new address. Do not delete the old app until the import is verified.

## Privacy and external services
Diary and profile save locally. Repository code is public; diary data and API keys are not part of this repository. Gemini key stays in memory for the open session. Selected photos and notes go directly to Google; Google limits and charges may apply. Barcode requests go to Open Food Facts. Google Fonts may be fetched for typography.

## Attribution
Barcode nutrition: Open Food Facts, ODbL, https://world.openfoodfacts.org. Scanner: ZXing JS 0.21.3, Apache-2.0. Fonts: Google Fonts DM Sans and Manrope.


## Indian restaurant foods (v1.4.0)
20 curated common dishes found at US Indian restaurants, including butter chicken, chicken tikka masala, chicken 65, tandoori chicken, chicken tikka, chicken biryani, lamb rogan josh, chicken vindaloo, saag paneer, paneer tikka masala, chana masala, dal makhani, dal tadka, aloo gobi, vegetable samosa, naan, garlic naan, cheese naan, restaurant basmati rice, and mango lassi. This is not a statistically ranked top-20 list. Values are editable generic recipe estimates, not verified restaurant labels. Existing diary entries are unchanged.


## Fitness coach and Everyday foods (v1.5.0)
Profiles now support adult age (18–120) and an explicit lose-fat / build-muscle / maintenance goal. Legacy profiles remain valid; edit them to add these fields before using the coach. Ask coach is available on My diary and My journey. Activate your personal Gemini API key in Settings. A required sharing checkbox authorizes the question, current conversation, age/height/weight/goal and configured targets; separate optional controls attach seven days of food totals and a manual-workout summary where available. Context preview is available before sending. No automatically attached names/usernames, food or workout notes, food names, photos, or imported Health Connect records. Requests go directly to Google, which may use unpaid API content under its terms. Conversations stay in session memory and are excluded from backups.

The coach is instructed to answer adult fitness and nutrition questions only and refuse unrelated topics. Model adherence is best-effort, not a guaranteed content firewall. AI answers can be wrong; no medical diagnosis or automatic changes to diary, workouts or targets. No real Google API call has been tested with a user key during development; tests use mocked responses.

Everyday now includes 50 curated common US staples including apples, bananas, granola, oats, fruits, vegetables, grains, proteins and snacks, with editable generic nutrition estimates. Prior US favorites and restaurant lists remain.

Privacy policies: [Web](privacy.html), [Android](android-privacy.html). Android publisher: host/link the updated Android policy in Play Console and review Data Safety/App access descriptions before releasing the AI coach update. Optional coaching now sends approved profile and fitness summaries to Google, unlike photo-only analysis. This is an adult general wellness app.

## Camera controls
Live barcode scanning requests a rear camera with high-resolution preferences. Camera capabilities determine whether hardware zoom and continuous-focus controls appear; browser and hardware support vary, particularly on iPhone. A phone-camera photo option decodes barcode images locally with ZXing, giving users access to native camera controls when the operating system offers them. Barcode photos are not attached to Gemini. Camera tracks stop when scanning closes or succeeds. Manual entry remains available. No physical-device camera tests were possible during this build.
