using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.Framework.DataAnnotations;

namespace EpiUploadImage.Models.Media
{
    [ContentType(DisplayName = "DefaultMedia", GUID = "5debb020-d36b-43b5-b233-0f5474ed2e02", Description = "")]
    [MediaDescriptor(ExtensionString = "pdf,doc,docx,png,jpg,jpeg,gif")]
    public class DefaultMedia : MediaData
    {
       
                [CultureSpecific]
                [Editable(true)]
                [Display(
                    Name = "Description",
                    Description = "Descri1ption field's description",
                    GroupName = SystemTabNames.Content,
                    Order = 1)]
                public virtual string Description { get; set; }
         
    }
}