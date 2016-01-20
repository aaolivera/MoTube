using System.Collections.Generic;

namespace Dominio
{
    public class Resultado
    {
        public Resultado()
        {
            Temas = new List<Tema>();
        }
        public List<Tema> Temas { get; set; }
        public string Siguiente { get; set; }
        public string Anterior { get; set; }
        public string Filtro { get; set; }
        public int Pagina { get; set; }
        public int CantidadDePaginas { get; set; }
    }
}