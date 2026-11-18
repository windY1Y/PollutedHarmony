let preferences,image;
export function bindPreferences(getPreferences,getPreferencesSync,removePreferencesFromCache,removePreferencesFromCacheSync){preferences={getPreferences,getPreferencesSync,removePreferencesFromCache,removePreferencesFromCacheSync};}
export function bindImage(createImageSource,createPixelMap,createPixelMapSync){image={createImageSource,createPixelMap,createPixelMapSync};}
export function getPreferencesModule(){if(!preferences)throw new Error('UNRESOLVED_BINDING:sendablePreferences_bridge');return preferences;}
export function getImageModule(){if(!image)throw new Error('UNRESOLVED_BINDING:sendableImage_bridge');return image;}
