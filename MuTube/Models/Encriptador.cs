using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MuTube.Models
{
    public static class Encriptador
    {


        static decimal V (int I, int B, decimal P) {
            return I * B * P;
        }

        static bool D (int I, int B)
        {
            return I < B;
        }

        static bool E (int I, int B)
        {
            return I == B;
        }

        static bool G(int I, int B)
        {
            return I < B;
        }

        static bool Z(int I, int B)
        {
            return I < B;
        }

        static decimal B3 (decimal I, decimal B)
        {
            return I * B;
        }

        static decimal v3(int I, decimal B)
        {
            return I * B;
        }

        static decimal R3(decimal I, decimal B)
        {
            return I * B;
        }

        static bool I3(char I, Dictionary<char, int> B)
        {
            return B.ContainsKey(I);
        }

        static int C(int I, int B)
        {
            return I % B;
        }
        static int O(int I, int B)
        {
            return I % B;
        }
        static int K(int I, int B)
        {
            return I - B;
        }

        static int fn(List<string> I, string B)
        {
            for (var R = 0; R < I.Count ; R++)
            {
                if (I[R] == B)
                {
                    return R;
                }
            }
            return -1;
        }

        public static decimal Sig (string h)
        {
            var x3 = new List<char>{ 'a', 'c', 'e', 'i', 'h', 'm', 'l', 'o', 'n', 's', 't', '.' };
            var G3 = new List<int> { 6, 7, 1, 0, 10, 3, 7, 8, 11, 4, 7, 9, 10, 8, 0, 5, 2};
            var M = new List<char> { 'a', 'c', 'b', 'e', 'd', 'g', 'm', '-', 's', 'o', '.', 'p', '3', 'r', 'u', 't', 'v', 'y', 'n'};
            var X = new List<List<int>>
            {
                new List<int> {17, 9, 14, 15, 14, 2, 3, 7, 6, 11, 12, 10, 9, 13, 5},
                new List<int> {11, 6, 4, 1, 9, 18, 16, 10, 0, 11, 11, 8, 11, 9, 15, 10, 1, 9, 6}
            };

            var A = new Dictionary<char, int>{
                { 'a', 870 },
                {    'b', 906},
                {    'c', 167},
                {    'd', 119},
                {    'e', 130},
                 {   'f', 899},
                 {   'g' ,248},
                {    'h', 123},
                {    'i', 627},
                {    'j' ,706},
                {    'k', 694},
                {    'l', 421},
                {    'm', 214},
                {    'n', 561},
                {    'o', 819},
                {    'p', 925},
                {    'q', 857},
                {    'r', 539},
                {    's', 898},
                {    't', 866},
                {    'u', 433},
                {    'v', 299},
                {    'w', 137},
                 {   'x', 285},
                {    'y', 613},
                {    'z', 635},
                {    '_', 638},
                {    '&', 639},
                {    '-', 880},
                {    '/', 687},
                {    '=', 721}
                };
            var r3 = new List<string> { "0", "1", "2", "3","4", "5", "6", "7", "8", "9" };


            decimal F = 1.51214M;
            decimal N = 3219;
            var lista = new List<decimal>();
             for (var Y = 0; Y < h.Length ; Y++)
            {
                lista.Add(N);
                var Q = h.Substring(Y, 1).ToLower();
                if (fn(r3, Q) > -1)
                {
                    N = N + (V(fn(r3, Q), 121, F));
                }
                else {
                    if (I3(Q.First(), A))
                    {
                        N = N + (A[Q.First()] * F);
                    }
                }
                N = N * 0.1M;
            }

            N = Math.Round(R3(N, 1000));
            return N;
        }


    }
}