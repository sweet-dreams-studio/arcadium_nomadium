using System.ComponentModel.DataAnnotations;

namespace ArcadeNomadAPI.Models
{
    public class Game
    {
        [Key]
        public string Id { get; set; }

        public int RatingsCount { get; set; }
        
        public int TotalRating { get; set; }
    }
}