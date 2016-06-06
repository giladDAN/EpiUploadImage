define([
// Dojo
"dojo/_base/array",
"dojo/_base/declare",
"dojo/_base/lang",
"dojo/dom-geometry",
"dojo/when",

// Dijit
"dijit/layout/_LayoutWidget",
//OC: injected content pane
"dijit/layout/ContentPane",
// EPi
"epi",
"epi/shell/TypeDescriptorManager",

"epi-cms/ApplicationSettings",
"epi-cms/widget/ContentTree",
"epi-cms/widget/ContextualContentForestStoreModel",
"epi-cms/widget/SearchBox",

// EPi Framework
"epi/shell/widget/_ActionProviderWidget",
"epi/dependency",

// Resources
"epi/i18n!epi/cms/nls/episerver.cms.widget.contentselectordialog",

//additional
 //"extended/editors/ContentSelector_extended",
 "extended/editors/ContentSelectorDialog_extended2",
//"epi-cms/widget/ContentSelectorDialog",
"epi/shell/widget/dialog/Dialog",
"epi-cms/widget/viewmodel/MultipleFileUploadViewModel",
"epi-cms/widget/MultipleFileUpload"


],

function (
// Dojo
array,
declare,
lang,
domGeometry,
when,

// Dijit
_LayoutWidget,
 //OC: inject the pane
 ContentPane,

// EPi
epi,
TypeDescriptorManager,

ApplicationSettings,
ContentTree,
ContextualContentForestStoreModel,
SearchBox,

// EPi Framework
_ActionProviderWidget,
dependency,

// Resources
localization,

//adtional
ContentSelectorDialog,
Dialog,
MultipleFileUploadViewModel,
MultipleFileUpload

) {
    //" epi-cms/widget/ContentSelectorDialog "
    return declare("extended.editors.ContentSelectorDialog_extended", [_LayoutWidget, _ActionProviderWidget], {
        // summary:
        //    Content selector widget.
        //
        // description:
        //    Used for editing PropertyPage properties in fly-out editor.
        //
        // tags:
        //    internal xproduct

        // _contentRef: [private] epi.cms.core.ContentReference
        //    Reference to the currently selected content.
        _contentRef: null,

        // res: [private] Object
        //    Resource bundle.
        res: localization,

        baseClass: "epi-content-selector-dialog",

        // roots: [public] Array
        //    A list of references to the root contents.
        roots: null,

        // typeIdentifiers: [public] Array | String
        //    Type identifiers to filter.
        typeIdentifiers: null,

        showButtons: true,

        model: null,

        // allowedTypes: String[]
        //      An array of types that should be selectable
        allowedTypes: null,

        // restrictedTypes: String[]
        //      An array of types that not should be selectable
        restrictedTypes: null,

        // canSelectOwnerContent: [private] Boolean
        //    Indicates whether select current owner content button should be available.
        canSelectOwnerContent: true,

        // multiRootsMode: [public] Boolean
        //      Indicate that multiple roots enabled in the tree or not
        multiRootsMode: false,

        _typesToDisplay: null,

        // showAllLanguages: Boolean
        //      Flags to indicate that the content tree should show all content in multiple languages or not.
        showAllLanguages: false,

        // selectedContentType: String
        //      The content type which is selected. (used when restore content for instance)
        selectedContentType: null,

        // showSearchBox: Boolean
        //      If true - a search field is displayed that allows user to find content
        showSearchBox: true,

        // searchArea: String
        //      Search area for the search box.
        searchArea: null,

        _searchBox: null,

        ppp : null,

        buildRendering: function () {
            this.inherited(arguments);

            var typeIdentifiers = this._getTypesToDisplay(),
                model = this.model,
                roots = this.roots || (model && model.roots);

            this.preventContextualContentFor = this.preventContextualContentFor || this._getSettingFromContentType();
            if (!model || this.showContextualContent) {
                model = new ContextualContentForestStoreModel({
                    roots: roots,
                    typeIdentifiers: typeIdentifiers,
                    notSupportContextualContents: this.preventContextualContentFor,
                    showAllLanguages: this.showAllLanguages
                });
            }

            /* this section will add a div to select content */

            //now add something new 
            this.tmpDiv = new ContentPane({
                region: "top",
                content: '<strong>Add New Media Item</strong> <span class="dijit dijitReset dijitInline dijitButton Salt" ><span class="dijitReset dijitInline dijitButtonNode" ><span class="dijitReset dijitStretch dijitButtonContents" data-dojo-attach-point="titleNode,focusNode" aria-disabled="false" ><span class="dijitReset dijitInline dijitIcon dijitNoIcon" data-dojo-attach-point="iconNode"></span><span class="dijitReset dijitToggleButtonIconChar">●</span><span class="dijitReset dijitInline dijitButtonText" >+</span></span></span><input type="submit" value="" class="dijitOffScreen" tabindex="-1" ></span><hr/>'
            });
            this.addChild(this.tmpDiv);

            this.connect(this.tmpDiv, "onClick", "_onDivClick");

            /* end of div */

            model.set("view", "contentselector");

            if (this.showSearchBox && this.searchArea) {
                this._searchBox = new SearchBox({
                    innerSearchBoxClass: "epi-search--full-width",
                    triggerContextChange: false,
                    parameters: {
                        allowedTypes: this.allowedTypes,
                        restrictedTypes: this.restrictedTypes
                    },
                    onItemAction: lang.hitch(this, function (item) {
                        if (item && item.metadata && this._checkAcceptance(item.metadata.typeIdentifier)) {
                            this.set("value", item.metadata.id);
                        }
                    })
                });
                this._searchBox.set("area", this.searchArea);
                this._searchBox.set("searchRoots", this.roots);

                var searchBox = this._searchBox;
                model.getRoots(true).then(function (roots) {
                    searchBox.set("searchRoots", roots.join(","));
                });

                this.addChild(this._searchBox);
            }

            //    var OnlyImages = ["episerver.core.icontentimage",
            //        "episerver.core.contentfolder"] 
            // "episerver.core.icontentdata"];
            //   var imagearr = ["episerver.core.icontentimage"]

            this.tree = new ContentTree({
                roots: roots,
                //typeIdentifiers: typeIdentifiers, // OC
                typeIdentifiers: typeIdentifiers,
                allowManipulation: false,
                model: model,
                //allowedTypes: lang.clone(this.allowedTypes),  //OC
                allowedTypes: lang.clone(this.allowedTypes),
                restrictedTypes: lang.clone(this.restrictedTypes),
                disableRestrictedTypes: true,
                expandExtraNodeItems: ApplicationSettings.startPage // Set extra node items to expand when the given tree loaded
            });
            this.addChild(this.tree);

            this.connect(this.tree, "onClick", "_onTreeNodeClick");

          
        },

        _internalSetContent: function (value) {
            console.log('set value in contentselector')
            that.set('value', value);
            that.onChange(that.get('value'));

            console.log('in render of contetn selector');

            that.ppp(value);
        },

        layout: function () {
            this.inherited(arguments);

            var treeHeight = this._contentBox.h;

            //Subtract the height of the searchBox if it is created
            if (this._searchBox) {
                treeHeight -= domGeometry.getMarginBox(this._searchBox.domNode).h;
            }

            //Get the margin box for the tree and change the height
            var treeMarginBox = domGeometry.getMarginBox(this.tree.domNode);
            treeMarginBox.h = treeHeight;

            domGeometry.setMarginBox(this.tree.domNode, treeMarginBox);
        },

        _getSettingFromContentType: function () {
            // summary:
            //      Get preventContextualContentFor settings form selected content type
            // tags:
            //      private

            if (!this.selectedContentType) {
                return null;
            }
            var contentRepositoryDescriptors = this.contentRepositoryDescriptors || dependency.resolve("epi.cms.contentRepositoryDescriptors");

            var repositoryDescriptor,
                matchType = function (type) {
                    return TypeDescriptorManager.isBaseTypeIdentifier(this.selectedContentType, type);
                };
            for (var index in contentRepositoryDescriptors) {
                var descriptor = contentRepositoryDescriptors[index];
                if (array.some(descriptor.containedTypes, matchType, this)) {
                    repositoryDescriptor = descriptor;
                    break;
                }
            }

            return repositoryDescriptor.preventContextualContentFor;
        },
        _onDialogExecute: function (a) {
            console.log('_onDialogExecute');
            console.log(b);
        },
        _onDialogHide: function (a) {
            console.log('_onDialogHide');
            console.log(a);
        },
        _onDivClick: function (content) {

            console.log('here after pressing div');
            that = this;
            this.contentSelectorDialog = new ContentSelectorDialog({
                canSelectOwnerContent: true,
                showButtons: true,
                //roots: this.roots,
               // allowedTypes: ["episerver.core.icontentdata"],
               // showAllLanguages: true,
                ggg: 'ssss',
                openWindow : this._internalSetContent
            });

            this.dialog = new Dialog({
                title: "Select a folder",
                dialogClass: "epi-dialog-portrait",
                content: this.contentSelectorDialog,
                autofocus: true,
                defaultActionsVisible: false,
                closeIconVisible: true
            });
            var self = this.dialog;
            this.dialog.definitionConsumer.add({
                name: "close",
                label: "CLOSE!",
                action: function (aaa) {
                    //uploader.close();
                    console.log(' this.dialog.definitionConsumer action close ');
                    //close the dialog we opened
                    self.hide();
                }
            });


            this.connect(this.dialog, "onExecute", "_onDialogExecute");
            this.connect(this.dialog, 'onHide', '_onDialogHide');

            // this.isShowingChildDialog = true;
            this.dialog.resize({ w: 700 });
            this.dialog.show();               
        },

        _getTypesToDisplay: function () {
            if (!this._typesToDisplay) {

                var typesToDisplay = [];
                this._getContainerTypesRecursive(this.allowedTypes, typesToDisplay);
                this._typesToDisplay = typesToDisplay;
            }

            return this._typesToDisplay;
        },

        _getContainerTypesRecursive: function (types, results, checkedTypes) {
            if (!checkedTypes) {
                checkedTypes = [];
            }

            array.forEach(types, lang.hitch(this, function (type) {
                // To avoid infinite recursion, check if this type is already processed
                if (array.indexOf(checkedTypes, type) === -1) {
                    // Mark as checked
                    checkedTypes.push(type);

                    // Add the type itself if it isn't added already
                    if (array.indexOf(results, type) === -1) {
                        results.push(type);
                    }

                    // If there are any container types, process them as well
                    var containerTypesForType = TypeDescriptorManager.getValue(type, "containerTypes");

                    if (containerTypesForType) {
                        this._getContainerTypesRecursive(containerTypesForType, results, checkedTypes);
                    }
                }
            }));
        },

        _setValueAttr: function (value) {
            //summary:
            //    Value's setter.
            //
            // value: String
            //    Value to be set.
            //
            // tags:
            //    protected

            //construct ContentReference object
            if (value) {
                this._contentRef = value;
                var contentLinkToSelect = this._contentRef === '-' ? null : this._contentRef;

                if (this.multiRootsMode) {
                    // We need to wait until tree load top level children and then fire onLoad() event
                    when(this.tree.onLoadDeferred, lang.hitch(this, function () {
                        this.tree.selectContent(contentLinkToSelect, true);
                    }));
                } else {
                    if (!epi.isEmpty(contentLinkToSelect)) {
                        this.tree.selectContent(contentLinkToSelect, true);
                    }
                }
            } else {
                this._contentRef = null;
                this._clearSelectedContent();
            }
        },

        _getValueAttr: function () {
            //summary:
            //    Value's getter
            // tags:
            //    protected

            this.inherited(arguments);

            if (this._contentRef) {
                return this._contentRef.toString();
            } else {
                return '';
            }
        },

        _setAllowedTypesAttr: function (value) {
            this._typesToDisplay = null;
            this._set("allowedTypes", value);
        },

        _clearSelectedContent: function () {
            // summary:
            //      Clear selected node(s) in tree
            // tags:
            //      private

            this.tree.set("selectedNodes", []);
            this.tree.set("selectedItems", []);
        },

        getActions: function () {
            // summary:
            //      Overridden from _ActionProvider to get the select current owner content action added to the containing widget
            //
            // returns:
            //      An array containing a select page action definition, if it is not a shared block

            return this.canSelectOwnerContent ? [
                {
                    name: "selectpage",
                    label: localization.currentpage,
                    settings: { type: "submit" },
                    action: lang.hitch(this, function () {
                        this._setValueOwnerContent();
                    })
                }
            ]
            : [];
        },

        _onTreeNodeClick: function (content) {
            // summary:
            //    Handle the inner tree's content change event.
            //
            // content: Object
            //    The content object.
            //
            // tags:
            //    private

            var value = content.contentLink;

            if (!this._checkAcceptance(content.typeIdentifier)) {
                this.tree.lastFocused.setSelected(false);
                value = null;
            }

            this.set('value', value);
            this.onChange(this.get('value'));
        },

        _checkAcceptance: function (typeIdentifier) {
            // summary:
            //    Compares a type against arrays of allowed and restricted types
            //
            // typeIdentifier: String
            //    The type to check if it's accepted to use
            //
            // tags:
            //    protected

            var acceptedTypes = TypeDescriptorManager.getValidAcceptedTypes([typeIdentifier], this.allowedTypes, this.restrictedTypes);

            return !!acceptedTypes.length;

        },

        _setValueOwnerContent: function () {
            this.set('value', '-');
        },

        onChange: function (contentLink) {
            // summary:
            //    Fired when value is changed.
            //
            // contentLink:
            //    The content link
            // tags:
            //    public, callback
        },

        focus: function () {
            this.tree.focus();
        }

    });

});