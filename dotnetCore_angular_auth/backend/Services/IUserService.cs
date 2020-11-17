using backend.Models.Entities;
using backend.Models.ViewModels;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IUserService
    {
        Task<IdentityResult> CreateUserAsync(RegistrationViewModel model);
        Task<IList<string>> GetUserRolesAsync(AppUser user);
        AppUser GetUserByUserName(string userName);
        Task<bool> CheckLoginCredentialsValidityAsync(LoginViewModel model);
        bool UserNameTaken(string userName);
    }
}
