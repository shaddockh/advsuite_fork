(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultComponentMapper_1 = require("./CustomMappers/DefaultComponentMapper");
var StaticModelComponentMapper_1 = require("./CustomMappers/StaticModelComponentMapper");
var ComponentMapperFactory = (function () {
    function ComponentMapperFactory() {
        this.mappers_ = {};
    }
    ComponentMapperFactory.prototype.registerDefaultComponentMapper = function (mapper) {
        this.mappers_[ComponentMapperFactory.DEFAULT] = mapper;
    };
    ComponentMapperFactory.prototype.registerComponentMapper = function (name, mapper) {
        this.mappers_[name] = mapper;
    };
    ComponentMapperFactory.prototype.getComponentBuilder = function (componentName) {
        return this.mappers_[componentName] || this.mappers_[ComponentMapperFactory.DEFAULT];
    };
    return ComponentMapperFactory;
}());
ComponentMapperFactory.DEFAULT = "___default___";
exports.ComponentMapperFactory = ComponentMapperFactory;
var factory = new ComponentMapperFactory();
factory.registerDefaultComponentMapper(new DefaultComponentMapper_1.default());
factory.registerComponentMapper("StaticModel", new StaticModelComponentMapper_1.default());
factory.registerComponentMapper("AnimatedModel", new StaticModelComponentMapper_1.default());
exports.default = factory;

},{"./CustomMappers/DefaultComponentMapper":3,"./CustomMappers/StaticModelComponentMapper":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = require("../Logger");
var cachedComponentProps = {};
function get(componentName, component) {
    var compPropertyXref = cachedComponentProps[componentName];
    if (!compPropertyXref) {
        compPropertyXref = {};
        var attributes = component.getAttributes();
        for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            try {
                compPropertyXref[attr.name.toLowerCase().replace(/\ /g, "")] = attr;
            }
            catch (e) {
                Logger.logDebug("Cache: could not map attribute " + i + " from component: " + componentName + ".\n " + e);
            }
        }
        cachedComponentProps[componentName] = compPropertyXref;
    }
    return compPropertyXref;
}
exports.get = get;

},{"../Logger":5}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = require("../../Logger");
var Cache = require("./../ComponentPropertyCache");
var DefaultComponentMapper = (function () {
    function DefaultComponentMapper() {
    }
    DefaultComponentMapper.prototype.mapDefaultProperty = function (component, attribute, propertyValue) {
        switch (attribute.type) {
            case Atomic.VariantType.VAR_BOOL: // true or false
            case Atomic.VariantType.VAR_INT: // 0
            case Atomic.VariantType.VAR_FLOAT: // 0.0
            case Atomic.VariantType.VAR_STRING: // "string"
            case Atomic.VariantType.VAR_VECTOR2: // [0,0]
            case Atomic.VariantType.VAR_VECTOR3: // [0,0,0]
            case Atomic.VariantType.VAR_QUATERNION: // [0,0,0]
            case Atomic.VariantType.VAR_COLOR: // [0,0,0,0]
            case Atomic.VariantType.VAR_STRINGVECTOR: // ["a","b"]
            case Atomic.VariantType.VAR_INTVECTOR2: // [1, 2]
            case Atomic.VariantType.VAR_BUFFER:
                // blueprint already has the value in the right format, so let's just set it
                Logger.logDebug("setting attribute: " + attribute.name + " to value: " + propertyValue);
                component.setAttribute(attribute.name, propertyValue);
                break;
            case Atomic.VariantType.VAR_RESOURCEREF:
                if (attribute.resourceTypeName) {
                    Logger.logDebug("VAR_RESOURCEREF: setting attribute: " + attribute.name + " to value: " + propertyValue + ", resource type: " + attribute.resourceTypeName);
                    component.setAttribute(attribute.name, Atomic.cache.getResource(attribute.resourceTypeName, propertyValue));
                }
                break;
            case Atomic.VariantType.VAR_RESOURCEREFLIST:
                if (attribute.resourceTypeName) {
                    Logger.logDebug("VAR_RESOURCEREFLIST: setting attribute: " + attribute.name + ", resource type: " + attribute.resourceTypeName);
                    var resources = propertyValue.split(";");
                    var resourcesToApply = [];
                    for (var i = 0; i < resources.length; i++) {
                        Logger.logDebug("VAR_RESOURCEREFLIST: setting array value: " + i + " to: " + resources[i]);
                        resourcesToApply.push(Atomic.cache.getResource(attribute.resourceTypeName, resources[i], true));
                        // component.setAttribute(attribute.name, Atomic.cache.getResource(attribute.resourceTypeName, resources[i], true), i);
                        // component.setAttribute(attribute.name, resources[i], i);
                    }
                    component.setAttribute(attribute.name, resourcesToApply);
                }
                break;
            case Atomic.VariantType.VAR_PTR:
                throw new Error("Unknown VAR PTR for attribute: " + attribute.name + " on component: " + component.typeName + ", resourceTypeName: " + attribute.resourceTypeName);
            case Atomic.VariantType.VAR_VARIANTVECTOR:
                //throw new Error(`Unknown VAR VARIANTVECTOR for attribute: ${attribute.name} on component: ${component.typeName}, resourceTypeName: ${attribute.resourceTypeName}`)
                Logger.logDebug("Unknown VAR VARIANTVECTOR for attribute: " + attribute.name + " on component: " + component.typeName + ", resourceTypeName: " + attribute.resourceTypeName);
                break;
            default:
                throw new Error("Unknown attribute type: " + attribute.type + " for attribute: " + attribute.name + " on component: " + component.typeName);
        }
    };
    DefaultComponentMapper.prototype.mapComponent = function (component, blueprint, componentName) {
        Logger.logDebug("Mapping " + componentName + " with component mapper: DEFAULT");
        var compPropertyXref = Cache.get(componentName, component);
        for (var prop in blueprint) {
            if (typeof (blueprint[prop]) === "object" && !Array.isArray(blueprint[prop])) {
                continue;
            }
            var attribute = compPropertyXref[prop.toLowerCase()];
            if (!attribute) {
                Logger.logDebug("Property: " + prop + " is not a valid component property...skipping");
                continue;
            }
            this.mapDefaultProperty(component, attribute, blueprint[prop]);
        }
    };
    return DefaultComponentMapper;
}());
exports.default = DefaultComponentMapper;

},{"../../Logger":5,"./../ComponentPropertyCache":2}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultComponentMapper_1 = require("./DefaultComponentMapper");
var Logger = require("../../Logger");
var Cache = require("./../ComponentPropertyCache");
/*
StaticModel: {
    model: "Models/16x16x2_floor.mdl",
    material: "Models/Materials/palette.material"
}
*/
var StaticModelComponentMapper = (function (_super) {
    __extends(StaticModelComponentMapper, _super);
    function StaticModelComponentMapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StaticModelComponentMapper.prototype.mapComponent = function (component, blueprint, componentName) {
        Logger.logDebug("Mapping " + componentName + " with component mapper: StaticModel");
        var staticModel = component;
        // manually mapped properties
        var manual = ["model", "material"];
        // first let's resolve the model
        if (blueprint["model"]) {
            var modelName = blueprint["model"];
            Logger.logDebug("Getting model from asset cache:" + modelName);
            staticModel.model = Atomic.cache.getResource("Model", modelName, true);
        }
        // next let's resolve the materials since it appears that we have to apply the materials specifically
        if (blueprint["material"]) {
            var materials = blueprint["material"].split(";");
            for (var i = 0; i < materials.length; i++) {
                staticModel.setMaterialIndex(i, Atomic.cache.getResource("Material", materials[i], true));
            }
        }
        var compPropertyXref = Cache.get(componentName, component);
        for (var prop in blueprint) {
            if (manual.indexOf(prop) == -1) {
                if (typeof (blueprint[prop]) === "object" && !Array.isArray(blueprint[prop])) {
                    continue;
                }
                var attribute = compPropertyXref[prop.toLowerCase()];
                if (!attribute) {
                    continue;
                }
                this.mapDefaultProperty(component, attribute, blueprint[prop]);
            }
        }
    };
    return StaticModelComponentMapper;
}(DefaultComponentMapper_1.default));
exports.default = StaticModelComponentMapper;

},{"../../Logger":5,"./../ComponentPropertyCache":2,"./DefaultComponentMapper":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEBUG = true;
/**
 * Log debug to the console if debug is enabled
 * @export
 * @param {string} msg
 */
function logDebug(msg) {
    if (DEBUG) {
        console.log(msg);
    }
}
exports.logDebug = logDebug;
/**
 * Turn on or off the debug logging
 * @export
 * @param {boolean} value
 */
function setDebug(value) {
    DEBUG = value;
}
exports.setDebug = setDebug;

},{}],6:[function(require,module,exports){
'use strict';
var debug = false;
/*global Duktape:true */
// Replace the built in modSearch routine with our own, but keep
// a reference to the original one that we will call in case a module
// we don't know about is requested.
Duktape.modSearch = (function (origModSearch, vendorMap) {
    return function (id, require, exports, module) {
        if (vendorMap[id]) {
            var result = vendorMap[id];

            if (debug) {
                console.log('Loading vendor module: ' + id);
            }
            // Let's map the exports from the module to the exports
            for (var exp in result) {
                if (debug) {
                    console.log('mapping export: ' + exp);
                }
                exports[exp] = result[exp];
            }
        } else {
            if (debug) {
                console.log('Loading other module: ' + id);
            }
            return origModSearch(id, require, exports, module);
        }
    };
}(Duktape.modSearch, {
    'atomic-blueprintlib': require('./atomic-blueprintlib.js')
}));

},{"./atomic-blueprintlib.js":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var entity_blueprint_manager_1 = require("entity-blueprint-manager");
var Logger = require("./Logger");
var ComponentMapperFactory_1 = require("./ComponentMapping/ComponentMapperFactory");
var componentCrossref = null;
var RESOURCES_DIR = "Resources";
var PREFABS_DIR = "Prefabs";
var GENERATED_PREFABS_DIR = Atomic.addTrailingSlash(PREFABS_DIR) + "Generated";
/**
 * The internal blueprint catalog that stores the blueprints
 */
exports.catalog = new entity_blueprint_manager_1.BlueprintCatalog({
    ignoreCase: false,
    requireInherits: false
});
/**
 * Builders for the various types of components.  These are in charge of mapping the blueprint properties to
 * the component.  JSComponents are generic, but native components may require specific builders
 *
 * Component builders must adhere to the interface:
 * {
 *    build: function(node, componentBlueprint, componentName, blueprint) {
 *    ...
 *    }
 *  }
 */
var componentBuilders = {
    // Used for mapping the root attributes of a node from a blueprint
    rootNodeComponentBuilder: {
        build: function (node, componentBlueprint, componentName, blueprint) {
            ComponentMapperFactory_1.default.getComponentBuilder("Node").mapComponent(node, blueprint, "Node");
        }
    },
    // used to create and map a native component
    nativeComponentBuilder: {
        build: function (node, componentBlueprint, componentName) {
            Logger.logDebug("Attaching Native Component: " + componentName + " to node.");
            var comp = node.createComponent(componentName);
            ComponentMapperFactory_1.default.getComponentBuilder(componentName).mapComponent(comp, componentBlueprint, componentName);
        }
    },
    // Used to create and map a JSComponent
    jsComponentBuilder: {
        build: function (node, componentBlueprint, componentName) {
            Logger.logDebug("Attaching JSComponent: " + componentName + " to node.");
            var component = resolveJSComponent(componentName);
            var jsComp = node.getJSComponent(component) || node.createJSComponent(component, componentBlueprint);
            ComponentMapperFactory_1.default.getComponentBuilder(componentName).mapComponent(jsComp, componentBlueprint, componentName);
        }
    }
};
/**
 * Utility function that will scan the Components directory for components and build a cross reference so that
 * when the blueprint system tries to attach a component, it knows where the component file is.
 * Note, that this will be cached so that it only builds the cross reference on game startup.
 * @returns object Component cross reference file.
 */
function getComponentXref(componentXrefFn) {
    if (componentXrefFn === void 0) { componentXrefFn = "componentCrossRef.json"; }
    // TODO: look at having a way of registering js components.  There may be a scenario where these components don't live in the Components folder and may be supplied by a library.
    // Cached
    if (componentCrossref) {
        return componentCrossref;
    }
    componentCrossref = {};
    var xrefFile = Atomic.cache.getFile(componentXrefFn);
    try {
        componentCrossref = JSON.parse(xrefFile.readText());
    }
    finally {
        xrefFile.close();
    }
    return componentCrossref;
}
/**
 * Will extend either a blueprint of a sub component of a blueprint.
 *
 * @param orig the original object to extend
 * @param extendwith
 * @return {Object|Array} Returns a brand new object that contains the merged values.  This differs from
 *                  most implementations that actually manipulate the orig object.
 */
function extend(orig, extendwith) {
    var result = {};
    for (var i in orig) {
        if (orig.hasOwnProperty(i)) {
            result[i] = orig[i];
        }
    }
    for (var i in extendwith) {
        if (extendwith.hasOwnProperty(i)) {
            if (typeof extendwith[i] === "object") {
                if (extendwith[i] === null) {
                    result[i] = null;
                }
                else if (Array.isArray(extendwith[i])) {
                    // handle array types
                    result[i] = extendwith[i];
                }
                else {
                    result[i] = extend(result[i], extendwith[i]);
                }
            }
            else {
                result[i] = extendwith[i];
            }
        }
    }
    return result;
}
/**
 * Returns true if the component is a registered JSComponent
 * @param componentName The name of the component to check
 */
function isRegisteredJSComponent(componentName) {
    // walk through the componentCrossref and see if we have any matches.  Assuming that if there
    // are no matches then either it's a native component or a bogus component
    if (resolveJSComponent(componentName)) {
        return true;
    }
    return false;
}
/**
 * Returns the component builder required to construct a component from a blueprint
 * @param componentName the name of the component to retrieve the builder for
 */
function getComponentBuilder(componentName) {
    if (isRegisteredJSComponent(componentName)) {
        return componentBuilders.jsComponentBuilder;
    }
    else {
        return componentBuilders.nativeComponentBuilder;
    }
}
/**
 * Returns the comnponent builder required to map the root node values from a blueprint
 */
function getRootComponentBuilder() {
    return componentBuilders.rootNodeComponentBuilder;
}
/**
 * Resolve the component name to the actual path of the component
 * @param {string} componentName the name of the component.  If the component contains slashes, it will be assumed that the component is referenced by absolute path.  Otherwise, the component will be looked up in componentCrossref.js.json
 * @returns {string} the absolute path to the component
 */
function resolveJSComponent(componentName) {
    getComponentXref();
    var comp;
    if (new RegExp("\\ | \/", "g").test(componentName)) {
        // We have an absolute path to the component.  Let's assume the blueprint writer knows what they are doing and just return it.
        comp = componentName;
    }
    else {
        // We need to look up the component in the component cross-ref.  If it's there, return the full path
        comp = componentCrossref[componentName] || null;
    }
    return comp;
}
/**
 * Returns a blueprint from the library with the specified name.  If the blueprint has
 * an 'inherits' property, it will walk up the inheritance and fill in the values of the blueprint
 * appropriately from it's ancestors
 * @param name the name of the blueprint to retrieve
 */
function getBlueprint(name) {
    return exports.catalog.getBlueprint(name);
}
exports.getBlueprint = getBlueprint;
/**
 * Resets the library to defaults.  Clears the catalog and releases any cached settings
 */
function reset() {
    exports.catalog.clear();
}
exports.reset = reset;
function buildEntity(node, blueprint) {
    var blueprintObj;
    if (typeof (blueprint) === "string") {
        blueprint = getBlueprint(blueprint);
    }
    Logger.logDebug("Building entity: " + blueprint.name);
    var builder;
    // first lets map over the root of the node
    builder = getRootComponentBuilder();
    builder.build(node, null, null, blueprint);
    for (var componentName in blueprint) {
        if (typeof (blueprint[componentName]) === "object" && !Array.isArray(blueprint[componentName])) {
            builder = getComponentBuilder(componentName);
            try {
                builder.build(node, blueprint[componentName], componentName, blueprint);
            }
            catch (e) {
                throw new Error("Could not construct component " + componentName + "  on  " + blueprint.name + ".\n" + e.toString());
            }
        }
    }
    return node;
}
exports.buildEntity = buildEntity;
function createChild(parent, blueprint, forceCreateFromBlueprint) {
    if (typeof (blueprint) === "string") {
        blueprint = getBlueprint(blueprint);
    }
    var node;
    if (blueprint.isPrefab && !forceCreateFromBlueprint) {
        var prefabPath = Atomic.addTrailingSlash(RESOURCES_DIR) + GENERATED_PREFABS_DIR;
        if (blueprint.prefabDir) {
            prefabPath = blueprint.prefabDir;
        }
        Logger.logDebug("Loading " + blueprint.name + " prefab from " + prefabPath);
        node = parent.createChildPrefab(blueprint.name, Atomic.addTrailingSlash(prefabPath) + blueprint.name + ".prefab");
    }
    else {
        Logger.logDebug("Constructing new child " + blueprint.name + ".  ForceCreateFromBlueprint: " + (forceCreateFromBlueprint ? "On" : "Off"));
        node = parent.createChild(blueprint.name);
        buildEntity(node, blueprint);
    }
    return node;
}
exports.createChild = createChild;
function createChildAtPosition(parent, blueprint, spawnPosition) {
    var node = createChild(parent, blueprint);
    if (spawnPosition.length === 2) {
        node.position2D = [spawnPosition[0], spawnPosition[1]];
    }
    else if (spawnPosition.length === 3) {
        node.position = [spawnPosition[0], spawnPosition[1], spawnPosition[2]];
    }
    else {
        throw new Error("Unknown spawnPosition format.  Can not determine if it's 2D or 3D");
    }
    return node;
}
exports.createChildAtPosition = createChildAtPosition;

},{"./ComponentMapping/ComponentMapperFactory":1,"./Logger":5,"entity-blueprint-manager":10}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dictionary_1 = require("./dictionary");
/**
 * Generic blueprint manager.  What this will do is allow you
 * to define a hierarchy of templates that descend from each other.
 * when creating a blueprint, it will walk up the entire tree of the
 * hierarchy and fill in any blank values that are provided at parent levels
 * and give you a fully hydrated blueprint.
 *
 * ie:
 * ``` json
 * blueprints: {
 *  parent: {
 *      inherits: '_base'
 *      ,component1: {
 *          val1: 'value'
 *          ,val2: 'valParent'
 *      }
 *  },
 *  child: {
 *      inherits: 'parent'
 *      ,component1: {
 *          val3: 'val3'
 *          ,val2: 'valChild'  //will override parent!
 *      }
 *  }
 *
 * }
 * ```
 * generateInstanceBlueprint('child') will create:
 *
 * ``` json
 * {
 *   inherits: 'child'
 *   id: 10293
 *   ,component1: {
 *      val1: 'value'
 *      ,val2: 'valChilde'
 *      ,val3: 'val3'
 *  }
 * ```
 */
var BlueprintCatalog = (function () {
    function BlueprintCatalog(opts) {
        if (opts === void 0) { opts = {
            ignoreCase: true,
            requireInherits: true
        }; }
        this.blueprintDictionary = null;
        this.hydratedBlueprints = null;
        this.debugMode = false;
        this.needsReindexing = false;
        this.options = null;
        this.options = opts;
        this.blueprintDictionary = new dictionary_1.Dictionary({
            ignoreCase: opts.ignoreCase
        });
        this.hydratedBlueprints = new dictionary_1.Dictionary({
            ignoreCase: opts.ignoreCase
        });
    }
    /**
     * Clears the blueprints and resets everything
     */
    BlueprintCatalog.prototype.clear = function () {
        this.blueprintDictionary.clear();
        this.hydratedBlueprints.clear();
        this.needsReindexing = false;
    };
    /**
     * loads a single blueprint into the dictionary.  If a callback is provided, it will be called when the blueprint is loaded
     */
    BlueprintCatalog.prototype.loadSingleBlueprint = function (blueprint, blueprintName, progressCallback) {
        blueprint.name = blueprint.name || blueprintName;
        this.needsReindexing = true;
        if (this.options.requireInherits && typeof (blueprint.inherits) === "undefined") {
            throw new Error("Blueprint does not provide an 'inherits' property: " + blueprint.name);
        }
        try {
            this.blueprintDictionary.add(blueprint.name, blueprint);
            if (progressCallback) {
                progressCallback(blueprint.name, true, "Loaded blueprint: " + blueprint.name, blueprint);
            }
        }
        catch (e) {
            if (progressCallback) {
                progressCallback(blueprint.name, false, e.message, blueprint);
            }
        }
    };
    /**
     * loads a block of blueprints into the dictionary.  They need to be in the format
     * ```
     * {
     *   blueprintName: { blueprint details ... }
     *   blueptintName: { blueprint details ... }
     * }
     *```
     * progressCallback can optionally be provided which will be called as each blueprint is loaded.
     * @param block a block of blueprints to load with keys as the name of each blueprint
     * @param progressCallback Callback with the signature  function(blueprintName, loaded (boolean), message, blueprint)
     */
    BlueprintCatalog.prototype.loadBlueprints = function (block, progressCallback) {
        for (var blueprintName in block) {
            if (block.hasOwnProperty(blueprintName)) {
                this.loadSingleBlueprint(block[blueprintName], blueprintName, progressCallback);
            }
        }
    };
    BlueprintCatalog.prototype.extendBlueprint = function (orig, extendwith, inPlaceExtend) {
        var result = inPlaceExtend ? orig : {};
        for (var i in orig) {
            if (orig.hasOwnProperty(i)) {
                result[i] = orig[i];
            }
        }
        for (var i in extendwith) {
            if (extendwith.hasOwnProperty(i)) {
                if (typeof extendwith[i] === "object") {
                    if (extendwith[i] === null) {
                        result[i] = null;
                    }
                    else if (extendwith[i].length) {
                        // handle array types
                        result[i] = extendwith[i];
                    }
                    else {
                        result[i] = this.extendBlueprint(result[i], extendwith[i]);
                    }
                }
                else {
                    result[i] = extendwith[i];
                }
            }
        }
        return result;
    };
    /**
     * will return a blueprint hydrating it with values from it's lineage, optionally extending it with
     * the blueprint provided with 'extendwith'
     *
     * @param name the name of the blueprint to return.  Must already have been loaded into the library.
     * @param extendWith Optionally extend the returned blueprint with this blueprint
     * @return hydrated blueprint
     */
    BlueprintCatalog.prototype.getBlueprint = function (name, extendWith) {
        var result;
        if (!this.hydratedBlueprints.containsKey(name)) {
            if (this.debugMode) {
                console.log("hydrating " + name);
            }
            result = this.blueprintDictionary.get(name);
            if (typeof result.inherits === "undefined" || result.inherits === "_base") {
                this.hydratedBlueprints.add(name, result);
            }
            else {
                try {
                    var hydrated = this.getBlueprint(result.inherits, result);
                    this.hydratedBlueprints.add(name, hydrated);
                    result = hydrated;
                }
                catch (e) {
                    throw new Error("Blueprint: '" + name + "' inherits from undefined blueprint: '" + result.inherits + "'");
                }
            }
        }
        else {
            result = this.hydratedBlueprints.get(name);
        }
        if (extendWith) {
            result = this.extendBlueprint(result, extendWith);
        }
        return result;
    };
    /**
     * returns the original (un-hydrated) version of the blueprint
     *
     * @param name Name of the blueprint to return.  Must already have been loaded into the library
     * @return un-hydrated blueprint
     */
    BlueprintCatalog.prototype.getOriginalBlueprint = function (name) {
        return this.blueprintDictionary.get(name);
    };
    /**
     * returns an array of all blueprint names in the dictionary
     *
     * @return array of all blueprint names
     */
    BlueprintCatalog.prototype.getAllBlueprintNames = function () {
        return this.blueprintDictionary.getAllKeys();
    };
    /**
     * Gets a fully fleshed out blueprint from an instance structure.  The instance will not be cached
     * in the blueprint database
     */
    BlueprintCatalog.prototype.getBlueprintFromInstance = function (instance) {
        if (typeof instance.inherits === "undefined" || instance.inherits === "_base") {
            return instance;
        }
        else {
            return this.getBlueprint(instance.inherits, instance);
        }
    };
    /**
     * returns all blueprints that inherit from the provided base blueprint.  If recurse is true
     * then it will walk down the entire tree, otherwise it will only return direct descendants
     *
     * @return a list of all blueprints that descend from baseBlueprintName
     */
    BlueprintCatalog.prototype.getBlueprintsDescendingFrom = function (baseBlueprintName, recurse) {
        var results = this.blueprintDictionary.find(function (item) {
            if (item.inherits === baseBlueprintName) {
                return true;
            }
        });
        if (recurse && results.length) {
            var newresults = [];
            for (var i = 0; i < results.length; i++) {
                newresults = newresults.concat(this.getBlueprintsDescendingFrom(results[i].name, recurse));
            }
            results = results.concat(newresults);
        }
        return results;
    };
    /**
     * will run through and hydrate all of the blueprints.  This will detect if there are any invalid ones
     * and also speed up queries
     */
    BlueprintCatalog.prototype.hydrateAllBlueprints = function () {
        var _this = this;
        this.getAllBlueprintNames().forEach(function (bp) {
            _this.getBlueprint(bp);
        });
        this.needsReindexing = false;
    };
    /**
     * find a blueprint by providing a filter that will be called for each blueprint.
     * if limit is provided, it will stop iterating once the limit of found blueprints is met.
     *
     * @param filt function to call with each blueprint to determine if it matches
     * @param limit if provided, then limit the results to this amount
     * @return matches
     */
    BlueprintCatalog.prototype.find = function (filt, limit) {
        if (this.needsReindexing) {
            this.hydrateAllBlueprints();
        }
        return this.hydratedBlueprints.find(filt, limit);
    };
    /**
     * @method hasBlueprint
     * @param blueprintName Name of blueprint to check fo
     * @return true if the blueprint exists in the library
     */
    BlueprintCatalog.prototype.hasBlueprint = function (blueprintName) {
        return this.blueprintDictionary.containsKey(blueprintName);
    };
    return BlueprintCatalog;
}());
exports.BlueprintCatalog = BlueprintCatalog;

},{"./dictionary":9}],9:[function(require,module,exports){
/**
 *
 * Created by shaddockh on 9/28/14.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Dictionary class.  Allows for creating a case-insensitive dictionary
 */
var Dictionary = (function () {
    function Dictionary(opts) {
        if (opts === void 0) { opts = {
            ignoreCase: true
        }; }
        this._catalog = {};
        this._keys = [];
        this._ignoreCase = true;
        this._ignoreCase = opts.ignoreCase;
    }
    /**
     * Clears the catalog
     */
    Dictionary.prototype.clear = function () {
        this._catalog = {};
        // Note: according to JSPerf this is the fastest way to clear an array
        var k = this._keys;
        while (k.length > 0) {
            k.pop();
        }
    };
    /**
     * Return true if the dictionary contains the provided key
     */
    Dictionary.prototype.containsKey = function (key) {
        key = this._ignoreCase ? key.toUpperCase() : key;
        return this._catalog.hasOwnProperty(key);
    };
    /**
     * loads a single item into the dictionary with the provided key name.  Will throw an error if there is
     * already an item with this key in the catalog.
     */
    Dictionary.prototype.add = function (key, item) {
        var newkey = this._ignoreCase ? key.toUpperCase() : key;
        if (typeof this._catalog[newkey] !== "undefined") {
            throw new Error("Duplicate item detected: " + key);
        }
        else {
            this._catalog[newkey] = item;
            this._keys.push(key);
        }
    };
    /**
     * loads a block of items into the dictionary.  They need to be in the format
     * ``` json
     * {
     *   key: object,
     *   key: object
     * }
     * ```
     */
    Dictionary.prototype.addItems = function (block) {
        for (var itemName in block) {
            this.add(itemName, block[itemName]);
        }
    };
    ;
    /**
     * returns an item specified by the key provided in the catalog
     */
    Dictionary.prototype.get = function (key) {
        var newkey = this._ignoreCase ? key.toUpperCase() : key;
        if (!this._catalog.hasOwnProperty(newkey)) {
            throw new Error("Item does not exist in catalog: " + key);
        }
        return this._catalog[newkey];
    };
    ;
    /** @deprecated */
    Dictionary.prototype.getItem = function (key) {
        console.error("Deprecated: Dictionary.getItem");
        return this.get(key);
    };
    ;
    /**
     * returns an array of all key names in the catalog
     */
    Dictionary.prototype.getAllKeys = function () {
        return this._keys.slice();
    };
    ;
    /**
     * iterates over the items in the catalog and executes callback for each element
     */
    Dictionary.prototype.forEach = function (callback) {
        var dict = this;
        this._keys.forEach(function (key) {
            callback(dict.get(key), key);
        });
    };
    ;
    /**
     * find an item by providing a filter that will be called for each item.
     * if limit is provided, it will stop iterating once the limit of found items is met.
     * @param filt a filter function that returns true for each element that should match the find
     * @param limit number of elements to limit result to
     * @example
     * ```
     *   const results = dict.find(el => el.active == true);
     * ```
     */
    Dictionary.prototype.find = function (filt, limit) {
        var results = [];
        if (typeof (filt) !== "function") {
            throw new Error(".find must be provided a function to use for filtering");
        }
        limit = limit || -1;
        var item;
        for (var key in this._catalog) {
            item = this._catalog[key];
            if (filt(item)) {
                results.push(item);
            }
        }
        return results;
    };
    ;
    return Dictionary;
}());
exports.Dictionary = Dictionary;

},{}],10:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./dictionary"));
__export(require("./blueprintCatalog"));
__export(require("./mixinCatalog"));

},{"./blueprintCatalog":8,"./dictionary":9,"./mixinCatalog":11}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dictionary_1 = require("./dictionary");
"use strict";
/**
 * mixin catalog
 */
var MixinCatalog = (function () {
    function MixinCatalog() {
        this.mixinDictionary = new dictionary_1.Dictionary({
            ignoreCase: true
        });
    }
    /**
     * Clears the mixin and resets everything
     */
    MixinCatalog.prototype.clear = function () {
        this.mixinDictionary.clear();
    };
    /**
     * loads a single mixin into the dictionary.
     */
    MixinCatalog.prototype.loadSingleMixin = function (mixin, progressCallback) {
        try {
            this.mixinDictionary.add(mixin.name, mixin);
            if (progressCallback) {
                progressCallback(mixin.name, true, "Loaded mixin: " + mixin.name);
            }
        }
        catch (e) {
            if (progressCallback) {
                progressCallback(mixin.name, false, e.message);
            }
        }
    };
    /**
     * loads a block of mixins into the dictionary.  They need to be in the format
     * ``` json
     * {
     *   mixinName: { mixin details ... }
     *   mixinName: { mixin details ... }
     * }
     * ```
     * @param block block of mixins
     * @param progressCallback function to be provided as callback with signature function(mixinName, bool loaded, message)
     */
    MixinCatalog.prototype.loadMixins = function (block, progressCallback) {
        for (var mixinName in block) {
            this.loadSingleMixin(block[mixinName], progressCallback);
        }
    };
    /**
     * will return a component by name
     * @param name name of the mixin to retrieve
     * @returns mixin object
     */
    MixinCatalog.prototype.getMixin = function (name) {
        return this.mixinDictionary.get(name);
    };
    /**
     * will return an array of mixin names
     */
    MixinCatalog.prototype.getAllMixinNames = function () {
        return this.mixinDictionary.getAllKeys();
    };
    /**
     * Return true if the mixin provided exists
     */
    MixinCatalog.prototype.hasMixin = function (mixinName) {
        return this.mixinDictionary.containsKey(mixinName);
    };
    return MixinCatalog;
}());
exports.MixinCatalog = MixinCatalog;
;

},{"./dictionary":9}]},{},[6]);
