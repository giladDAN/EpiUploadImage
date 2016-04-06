using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;
using EPiServer.Shell.ObjectEditing;
using EpiUploadImage.Business;
using EPiServer.Web;

namespace EpiUploadImage.Models.Pages
{
    [ContentType(DisplayName = "HomePage", GUID = "c7e3ae61-052b-4384-a4ba-bdc2ce64a374", Description = "")]
    public class HomePage : PageData
    {

        //[CultureSpecific]
        //[Display(
        //    Name = "Main body",
        //    Description = "The main body will be shown in the main content area of the page, using the XHTML-editor you can insert for example text, images and tables.",
        //    GroupName = SystemTabNames.Content,
        //    Order = 1)]
        //public virtual XhtmlString MainBody { get; set; }

      
        [UIHint(UIHint.Image)]
        public virtual ContentReference Image { get; set; }


        [EditorDescriptor(EditorDescriptorType = typeof(ImageUrlEditorDescriptorExtended))]      
        public virtual ContentReference Logotype1 { get; set; }

    }
}