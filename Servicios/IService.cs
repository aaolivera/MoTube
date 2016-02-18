using System.IO;
using System.ServiceModel;
using Dominio;

namespace Servicios
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IService" in both code and config file together.
    [ServiceContract]
    public interface IService
    {
        [OperationContract]
        Resultado Buscar(string filtro, string pageId, bool? siguiente = null);
        [OperationContract]
        Archivo Descargar(string videoId);
        string ObtenerNombrePorId(string id);
    }
}
