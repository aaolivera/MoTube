using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml;
using Dominio;
using Dominio.Helpers;
using Google.Apis.Services;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using YoutubeExtractor;

namespace Servicios
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service" in both code and config file together.
    public class Service : IService
    {
        private readonly YouTubeService _youtube;

        public Service()
        {
            _youtube = new YouTubeService(new BaseClientService.Initializer
            {
                ApplicationName = "mutube-1090",
                ApiKey = "AIzaSyBeU5QR5N0qOphQkp816JUDOqLpmxIMqSU",
            });
        }

        public Resultado Buscar(string filtro, string pageId, bool? siguiente = null)
        {
            var listRequest = _youtube.Search.List("snippet");
            
            listRequest.Q = filtro;
            listRequest.MaxResults = 20;
            listRequest.Type = "video";
            listRequest.PageToken = pageId;
            listRequest.VideoDuration = SearchResource.ListRequest.VideoDurationEnum.Medium;
            var resp = listRequest.Execute();

            var resultado = GenerarResultado(resp);
            resultado.Filtro = filtro;
            resultado.Pagina = siguiente == true ? 1 : siguiente == null ? 0 : -1;
            resultado.CantidadDePaginas = (resp.PageInfo.TotalResults??0)/(resp.PageInfo.ResultsPerPage ??1);
            return resultado;
        }

        public Archivo Descargar(string videoId)
        {
            // Our test youtube link
            //string link = "https://www.youtube.com/watch?v=r0ypUaCDrLI";

            /*
             * Get the available video formats.
             * We'll work with them in the video and audio download examples.
             */
            IEnumerable<VideoInfo> videoInfos = DownloadUrlResolver.GetDownloadUrls($"https://www.youtube.com/watch?v={videoId}");
            /*
            * We want the first extractable video with the highest audio quality.
            */
            VideoInfo video = videoInfos
                .Where(info => info.CanExtractAudio)
                .OrderByDescending(info => info.AudioBitrate)
                .First();

            /*
             * If the video has a decrypted signature, decipher it
             */
            if (video.RequiresDecryption)
            {
                DownloadUrlResolver.DecryptDownloadUrl(video);
            }

            /*
             * Create the audio downloader.
             * The first argument is the video where the audio should be extracted from.
             * The second argument is the path to save the audio file.
             */
            var tempFileName = Path.GetTempFileName();
            var audioDownloader = new AudioDownloader(video, tempFileName);

            // Register the progress events. We treat the download progress as 85% of the progress and the extraction progress only as 15% of the progress,
            // because the download will take much longer than the audio extraction.
            //audioDownloader.DownloadProgressChanged += (sender, args) => Console.WriteLine(args.ProgressPercentage * 0.85);
            //audioDownloader.AudioExtractionProgressChanged += (sender, args) => Console.WriteLine(85 + args.ProgressPercentage * 0.15);

            /*
             * Execute the audio downloader.
             * For GUI applications note, that this method runs synchronously.
             */
            audioDownloader.Execute();

            using (MemoryStream ms = new MemoryStream())
            using (FileStream file = new FileStream(tempFileName, FileMode.Open, FileAccess.Read))
            {
                byte[] bytes = new byte[file.Length];
                file.Read(bytes, 0, (int)file.Length);
                ms.Write(bytes, 0, (int)file.Length);
                return new Archivo { Stream = ms, Nombre = video.Title.RemoveInvalidChars() + video.AudioExtension };
            }
        }

        private Resultado GenerarResultado(SearchListResponse resp)
        {
            var resultado = new Resultado();
            var listvRequest = _youtube.Videos.List("contentDetails");
            listvRequest.Id = string.Join(",", resp.Items.Select(x => x.Id.VideoId));
            //listvRequest.MaxResults = 20;
            var resp2 = listvRequest.Execute();

            foreach (var result in resp.Items)
            {
                var content = resp2.Items.FirstOrDefault(x => x.Id == result.Id.VideoId);
                resultado.Temas.Add(item: new Tema
                {
                    Nombre = result.Snippet.Title.Truncate(90),
                    //Autor = result.Snippet.Description.Truncate(60),
                    Id = result.Id.VideoId,
                    Duracion = content != null ? XmlConvert.ToTimeSpan(content.ContentDetails.Duration) : new TimeSpan()
                });
            }
            resultado.Siguiente = resp.NextPageToken;
            resultado.Anterior = resp.PrevPageToken;
            return resultado;
        }
    }
}
