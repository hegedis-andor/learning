using backend.Models.Entities;
using backend.Models.ViewModels;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<AppUser> _userManager;
        public UserService(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<IdentityResult> CreateUserAsync(RegistrationViewModel model)
        {
            var user = new AppUser { UserName = model.UserName, Email = model.Email, FirstName = model.FirstName, LastName = model.LastName };
            var identityResult = await _userManager.CreateAsync(user, model.Password);
            if (identityResult.Succeeded)
                await _userManager.AddToRoleAsync(user, "User");

            return identityResult;
        }

        public async Task<IList<string>> GetUserRolesAsync(AppUser user)
        {
            return await _userManager.GetRolesAsync(user); 
        }

        public AppUser GetUserByUserName(string userName)
        {
            return _userManager.Users.FirstOrDefault(user => user.UserName == userName);
        }

        public async Task<bool> CheckLoginCredentialsValidityAsync(LoginViewModel model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null)
                return false;

            return await _userManager.CheckPasswordAsync(user, model.Password);
        }

        public bool UserNameTaken(string userName)
        {
            return _userManager.Users.Any(user => user.UserName == userName);
        }
    }
}
