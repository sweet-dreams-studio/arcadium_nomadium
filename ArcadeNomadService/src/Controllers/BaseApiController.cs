using Microsoft.AspNetCore.Mvc;

namespace ArcadeNomadAPI.Controllers
{
    public class BaseApiController : Controller
    {
        protected static int SecureLimit(int? limit)
        {
            const int defaultLimit = 30;
            const int maxLimit = 100;
            return limit.HasValue
                ? limit.Value > 0 && limit.Value <= maxLimit 
                    ? limit.Value 
                    : defaultLimit
                : defaultLimit;
        }

        protected void SetTotalCount(int totalCount)
        {
            const string totalCountHeaderName = "X-Total-Count";
            Response.Headers.Add(totalCountHeaderName, totalCount.ToString());
        }
    }
}