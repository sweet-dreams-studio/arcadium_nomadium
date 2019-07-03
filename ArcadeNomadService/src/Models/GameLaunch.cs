using System;
using System.ComponentModel.DataAnnotations;

namespace ArcadeNomadAPI.Models
{
    public class GameLaunch
    {
        [Key]
        public int Id { get; set; }
        
        public int ArcadeId { get; set; }
        
        public Game Game { get; set; }
        
        public DateTime DateTime { get; set; }
    }
}