using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
namespace MuTube
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            //FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Application_Error()
        {
            var context = HttpContext.Current;
            var exception = context.Server.GetLastError();
            if (exception is HttpRequestValidationException)
            {
                var urlHelper = new UrlHelper(HttpContext.Current.Request.RequestContext);
                context.Server.ClearError();    // Here is the new line.
                Response.Clear();
                Response.Redirect(urlHelper.Action("Error", "Home", new { mensaje = "La búsqueda realizada es potencialmente peligrosa" }));
            }
        }

    }
}
