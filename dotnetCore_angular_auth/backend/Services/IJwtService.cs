using backend.Models.Entities;
using System.Collections.Generic;

namespace backend.Services
{
    public interface IJwtService
    {
        string GenerateJwtToken(AppUser user, IList<string> userRoles, int validityDurationInHours);
    }
}
