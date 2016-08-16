using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using EPiServer;
using EPiServer.Core;
using EPiServer.Framework.DataAnnotations;
using EPiServer.Web.Mvc;
using EpiUploadImage.Models.Pages;
using EpiUploadImage.Models.ViewModel;
using System.Web.Security;
using System.Web.Http;

namespace EpiUploadImage.Controllers
{
    public class LoginPageController : PageController<LoginPage>
    {
        public ActionResult Index(LoginPage currentPage, [FromUri]string ReturnUrl)
        {
            var model = new LoginModel(currentPage);
            model.LoginPostbackData.ReturnUrl = ReturnUrl;
            return View(model);
        }
        [System.Web.Mvc.HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Post(LoginPage currentPage, [FromBody] LoginFormPostbackData LoginPostbackData)
        {
            var model = new LoginModel(currentPage);
            var isValid = Membership.Provider.ValidateUser(LoginPostbackData.Username, LoginPostbackData.Password);
            if (isValid)
            {
                var redirectUrl = GetRedirectUrl(LoginPostbackData.ReturnUrl);
                FormsAuthentication.SetAuthCookie(LoginPostbackData.Username, LoginPostbackData.RememberMe);
                return Redirect(redirectUrl); //Important to redirect after login to be sure cookies etc are set.
            }
            model.Message = "Wrong credentials, try again";
            return View("Index", model);
        }
        /// <summary>
        /// You can extend this to set redirect url to some property you set on login page in edit if you like
        /// Might also depend on role of user...
        /// </summary>
        public string GetRedirectUrl(string returnUrl)
        {
            if (!string.IsNullOrEmpty(returnUrl))
            {
                return returnUrl;
            }
            return FormsAuthentication.DefaultUrl;
        }
    }
}