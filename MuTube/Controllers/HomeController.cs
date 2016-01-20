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

        //public ActionResult Descargar(string videoId)
        //{
        //    var ms = _servicio.Descargar(videoId);
        //    var fileStream = new MemoryStream(ms.Stream.ToArray());
        //    fileStream.Seek(0, SeekOrigin.Begin);
        //    return File(fileStream, "application/octet-stream", ms.Nombre);
        //}

        public JsonResult Descargar(string videoId)
        {
            //videoId = "C1VOf-PCXBE";
            string resultado;
            try
            {
                if (videoId == PushItem(videoId))
                {
                    resultado = ItemInfo(videoId);
                    dynamic resultadoObj = JObject.Parse(resultado.Remove(0, 7).Replace(";", ""));
                    var url = $"/get?video_id=" + videoId + "&ts_create=" + resultadoObj.ts_create + "&r=" + resultadoObj.r + "&h2=" + resultadoObj.h2;
                    var code = Encriptador.Sig(url);
                    url = "http://www.youtube-mp3.org" + url + "&s=" + code;

                    return Json(new { Url = url, request = requestString }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                var a = 1;
            }
            return Json(false, JsonRequestBehavior.AllowGet);
        }

        public string PushItem(string videoId)
        {
            var url = $"/a/pushItem/?item=https://www.youtube.com/watch?v=" + videoId + "&el=na&bf=false&r=" + GetTime();
            url = "http://www.youtube-mp3.org" + url + "&s=" + Encriptador.Sig(url);

            using (WebClient wc = new WebClient())
            {
                return wc.DownloadString(url);
            }
        }

        public string requestString;
        public string ItemInfo(string videoId)
        {
            var url = $"/a/itemInfo/?video_id=" + videoId + "&ac=www&t=grp&r=" + GetTime();
            url = "http://www.youtube-mp3.org" + url + "&s=" + Encriptador.Sig(url);

            //using (WebClient wc = new WebClient())
            //{
            //    return wc.DownloadString(url);
            //}
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            string test = string.Empty;
            
                        
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                Stream dataStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(dataStream);
                test = reader.ReadToEnd();
                reader.Close();
                dataStream.Close();
            }
            return test;
        }

        private long GetTime()
        {
            long retval = 0;
            var st = new DateTime(1970, 1, 1);
            TimeSpan t = (DateTime.Now.ToUniversalTime() - st);
            retval = (long)(t.TotalMilliseconds + 0.5);
            return retval;
        }
    }
}