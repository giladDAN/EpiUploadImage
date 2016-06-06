using EPiServer.Cms.Shell.UI.ObjectEditing.EditorDescriptors;
using EPiServer.Shell.ObjectEditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EpiUploadImage.Business
{

    /// <summary>
    /// 
    /// 
    /// need to add to module.config
    /// location of new files
    /// need to add   <clientResources debug="true" /> to the framework section in web config
    /// http://world.episerver.com/blogs/Ben-McKernan/Dates/2014/8/Uncompressed-JavaScript-for-EPiServer-76/
    /// 
    /// //ClientResources directory and scripts
    /// </summary>
    public class ImageUrlEditorDescriptorExtended : ImageUrlEditorDescriptor
    {
        public ImageUrlEditorDescriptorExtended()
        {
           
        }
        public override void ModifyMetadata(ExtendedMetadata metadata, 
            IEnumerable<Attribute> attributes)
        {
            // this set the location of the file i want to work on
            //extended need to be in modules.config
            //editors is the folder where the script appear
            //need to set the name of the id of the class to this name with period.
            ClientEditingClass = "extended/editors/mediaselect_extended";

            base.ModifyMetadata(metadata, attributes);
        }
    }
}