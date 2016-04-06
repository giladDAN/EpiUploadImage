/*
 This is a widget copied from epi that open text box that open other modal window
 that select content.
*/


define([
// Dojo
    "dojo/_base/declare",
    "dojo/Deferred",
    "dojo/_base/lang",

    "dojo/when",

// EPi Framework
    "epi",
    "epi/Url",

// EPi CMS
    "epi-cms/core/ContentReference",
    "epi-cms/core/PermanentLinkHelper",      
    // now instead of Orignal Content Selector i copied and create a new one
    //"epi-cms/widget/ContentSelector"
    //IMPORTANT LEAVE / in names here and . in name of widget
    "extended/editors/ContentSelector_extended"
   
], function (
// Dojo
    declare,
    Deferred,
    lang,

    when,

// EPi Framework
    epi,
    Url,

// EPi CMS
    ContentReference,
    PermanentLinkHelper,
    ContentSelector) {

    return declare("extended.editors.mediaselect_extended", [ContentSelector], {
        // tags:
        //      internal

        // _contentData: Object
        //      Content data which is related to the url value.
        _contentData: null,

        // Flag to indicate whether the value has been initialized or not.
        // _setValue will not trigger onChange if this property evaluated to false
        _isValueInitilized: false,

        _setValueAndFireOnChange: function (value) {
            //summary:
            //    Sets the value and trigger onChange only if the value has been initialized and not the same value.
            // tags:
            //    private

            var isModified;
            if (this._valueChangedPromise) {
                this._valueChangedPromise.cancel("");
                this._valueChangedPromise = null;
            }

            if (!value) {

                this._updateDisplayNode(null);
                isModified = this.value !== value;
                this.value = value;
                this._contentData = null;

                if (isModified && this._isValueInitilized) {
                    this.onChange(value);
                }

                this._started && this.validate();
                this._isValueInitilized = true;

                return;
            }

            when(this._getContentByPermanentLink(value), lang.hitch(this, function (content) {
                this._updateDisplayNode(content);

                // We need to recreate the internal format before saving the data.
                
                //  var urlFormatValue = content.permanentLink; OC
                var urlFormatValue = content.contentLink;
                this._started && this.validate();

                //this is for string , let change to content 
                if (this.value) {
                    isModified = !epi.areEqual(this.value.contentLink, urlFormatValue.contentLink);
                } else { isModified = true;}

                this.value = urlFormatValue;

                if (this._isValueInitilized && isModified) {
                    this.onChange(urlFormatValue);
                }

                this._isValueInitilized = true;

            }));
        },

        _convertValueToContentReference: function (value) {
            // summary:
            //      Creates a ContentReference from the internal value.
            // tags:
            //      private

            if (this._contentData) {
                return new ContentReference(this._contentData.contentLink);
            }

            return null;
        },

        _getContentByPermanentLink: function (/*String*/value) {
            // summary:
            //      Get content which is related to the permanent link value.
            // tags:
            //      private

            if (epi.areEqual(this.value, value) && this._contentData) {
                return this._contentData;
            }

            this._valueChangedPromise = new Deferred();
            when(PermanentLinkHelper.getContent(value, { "allLanguages": true }), lang.hitch(this, function (content) {
                this._contentData = content;
                if (this._valueChangedPromise) {
                    this._valueChangedPromise.resolve(content);
                }
            }));

            return this._valueChangedPromise.promise;
        }
    });
});