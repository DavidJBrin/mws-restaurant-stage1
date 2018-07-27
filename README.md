# Mobile Web Specialist Certification Course

---
## About the Structure
The concatenated and minimized app is in the /dist directory. Please serve the application from the /dist directory.

> NOTE: If you want to test any of the build scripts, please make sure to install all dev dependencies by running `npm install`.

## Scripts
The following scripts are able to be used:

`gulp` - The default task will build everything except images, launch browser-sync and watch for changes. (in order for browsersync to connect you must select 'bypass for network' in the service worker to bypass the service worker; otherwise service worker will serve up skeleton). 

`gulp preview-dist` - Will start a browser-sync server to previe the dist directory.

`gulp buld` - Will build entire dist directory from scratch, including all images.

`gulp images` - Takes all images from src/img and creates a 560px and a 800px copy of the image along with the appropriate suffix in the dist/img directory.
``

## Change History
### Changes for Phase 2
1. Changed fetch request to fetch from the server.
2. Added indexedDB to save the restaurants by ID that are fetched from the server.
3. Added a catch to populate from indexedDB should the fetch fail.
4. Added a manfiest and other progressive web app suggestions.
6. Restructured the code and folders to now include a dist and src directory.
5. Added gulp to automate image resizing, script minification and other tasks.
6. Added responseive images, 800px images are served for 2xDPI+ otherwise only 560px images are served.
7. Added lazy loading of images.
6. All scripts files are now concatenated and minified.
