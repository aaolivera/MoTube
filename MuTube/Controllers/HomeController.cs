using System.Collections.Generic;
using System.IO;
using System.Web.Mvc;
using Dominio;
using MuTube.Helpers;
using Servicios;
using MuTube.Models;
using System;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Net.NetworkInformation;

namespace MuTube.Controllers
{
    public class HomeController : Controller
    {
        private readonly IService _servicio;

        public HomeController(IService servicio)
        {
            _servicio = servicio;
        }

        public ActionResult Index()
        {
            return View();
        }

        [AjaxOnly]
        [ActionName("Index")]
        public ActionResult Listar(string filtro, string paginaId = "", bool? direccion = null, int pagina = 1)
        {
            try
            {
                var resultado = _servicio.Buscar(filtro, paginaId, direccion);
                resultado.Pagina += pagina;

                if (resultado.Temas.Count == 0) throw new Exception("La Búsqueda no generó resultados!");
                return View("Listar", resultado);
            }
            catch (Exception e)
            {
                ViewBag.Error = e.Message;
            }
            return View("Error");
        }

        public ActionResult Error (string mensaje)
        {
            ViewBag.Error = mensaje;
            return View("Error");
        }

        public JsonResult ObtenerNombrePorId(string id)
        {
            try
            {
                return Json(new { nombre = _servicio.ObtenerNombrePorId(id) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { error = e.Message }, JsonRequestBehavior.AllowGet);
            }            
        }

    }
}