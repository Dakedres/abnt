
# ABNT
[ASAR](//github.com/electron/asar)-based Bundles for [Windows93](//windows93.net) (Ninety-Three)

ABNT was created to solve one major problem with making programs for the funni web OS: bundling. By leveraging Electron's ASAR, ABNT allows random-access app bundles that store data directly in binary. No unpacking zip files into specific directories, or absolutely disgusting data URIs all over the place. It even supports relative paths ;3

The current API is primitive, but essentially has all that's needed. ES6 and CJS module support are coming in the near future, but for now development is going to focus on documenting what of the API is already present, and getting a CLI app and a more stable build of the bundle opener out.

If you would like to start playing with it now, you can put it into your `/boot` directory, and install the ASAR npm app to pack your bundles. It will check for a file in the root directory of your bundle named `bundle.config.json`, it should have one property `"entry"` pointing to the relative path of the JS file to load at bundle start. The API's global is `$bundle`, and some documentation already exists in the `src/ScriptAPI.js` script.