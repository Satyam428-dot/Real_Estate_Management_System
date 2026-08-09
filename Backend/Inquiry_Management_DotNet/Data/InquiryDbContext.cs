using Microsoft.EntityFrameworkCore;
using Inquiry_Management_DotNet.Models;

namespace Inquiry_Management_DotNet.Data
{
    public class InquiryDbContext : DbContext
    {
        public InquiryDbContext(DbContextOptions<InquiryDbContext> options) : base(options) { }

        public DbSet<Inquiry> Inquiries { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
