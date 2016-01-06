/**
 * Created with JetBrains PhpStorm.
 * User: alexeybelozerov
 * Date: 3/21/13
 * Time: 12:40 AM
 * To change this template use File | Settings | File Templates.
 */

var Converter = {

    //LEGACY_VERSION_NUM: "1.22",

    /**
     * Apply converter needed to current data storage
     */
    apply: function() {
        try
        {
            if(this._isConversionRequired())
            {
                console.log("PP Data conversion started from version '" + this._getCurrentDataVersion()
                    + "' to version '" + this._getCurrentExtensionVersion() + "'");
                trackEvent("system", "convert_version", null, this._getCurrentExtensionVersion());
                this._convert();
                console.log("PP Data conversion finished");
            }
        }
        catch(e)
        {
            console.log("Converter failed: " + e.toString());
            if (ExtOptions.debugMode == true)
                throw e;
        }
    },

    _isConversionRequired: function() {
        return this._getCurrentExtensionVersion() != this._getCurrentDataVersion();
    },

    _getCurrentExtensionVersion: function() {
        return ExtOptions.version;
    },

    _getCurrentDataVersion: function() {
        /*var instanceId = localStorage["perfectpixel"];
        var instanceData = localStorage["perfectpixel-" + instanceId];
        if(!instanceId && !instanceData)
            return this.LEGACY_VERSION_NUM;
        else
            return $.parseJSON(instanceData).version;*/
        var PerfectPixel = new PerfectPixelModel({ id: 1 });
        PerfectPixel.fetch();
        return PerfectPixel.get("version");
    },

    _convert: function() {
        var currentDataVersion = this._getCurrentDataVersion();
        var targetDataVersion = this._getCurrentExtensionVersion();

        if(currentDataVersion == this.LEGACY_VERSION_NUM)
            VersionConverter_FromLegacy.convert(currentDataVersion, targetDataVersion);
        else if(currentDataVersion >= 1.50
            || currentDataVersion == 0) // sometimes this type of incorrect data occure
            VersionConverter_SimpleVersionUpdater.convert(currentDataVersion, targetDataVersion);
    }

};
