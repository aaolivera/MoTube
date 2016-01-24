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
            var resultado = _servicio.Buscar(filtro, paginaId, direccion);
            resultado.Pagina += pagina;
            return View("Listar", resultado);
        }

    }
}