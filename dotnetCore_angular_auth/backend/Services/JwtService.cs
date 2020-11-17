using backend.Models.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace backend.Services
{
    public class JwtService: IJwtService
    {
        private readonly IConfiguration _configuration;
    
        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
    
        public string GenerateJwtToken(AppUser user, IList<string> userRoles, int validityDurationInHours)
        {
            var userRoleClaims = new List<Claim>();
            userRoles.ToList().ForEach(role => userRoleClaims.Add(new Claim(ClaimTypes.Role, role)));
    
            DateTime jwtDate = DateTime.Now;
            var jwt = new JwtSecurityToken(
                audience: _configuration["Jwt:Issuer"],
                issuer: _configuration["Jwt:Audiance"],
                claims: new List<Claim> { new Claim(ClaimTypes.Name, user.UserName) }.Concat(userRoleClaims),
                notBefore: jwtDate,
                expires: jwtDate.AddHours(validityDurationInHours),
                signingCredentials: new SigningCredentials(
                    key: new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"])),
                    algorithm: SecurityAlgorithms.HmacSha256
                )
            );
    
            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }
    }
}
