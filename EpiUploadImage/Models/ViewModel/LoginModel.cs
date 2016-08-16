using EpiUploadImage.Models.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EpiUploadImage.Models.ViewModel
{
    

    public class LoginModel 
    {
        public LoginFormPostbackData LoginPostbackData { get; set; } = new LoginFormPostbackData();
        public LoginModel(LoginPage currentPage)            
        {
        }
        public string Message { get; set; }
        public LoginPage CurrentPage { get; set; }
    }

    public class LoginFormPostbackData
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }
        public string ReturnUrl { get; set; }
    }
}