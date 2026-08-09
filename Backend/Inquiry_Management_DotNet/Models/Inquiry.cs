using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inquiry_Management_DotNet.Models
{
    [Table("contact_owner_inquiries")]
    public class Inquiry
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long InquiryId { get; set; }

        [Column("buyer_id")]
        public long BuyerId { get; set; }

        [Column("property_id")]
        public long PropertyId { get; set; }

        [Column("owner_id")]
        public long? OwnerId { get; set; }

        [Column("full_name")]
        public string? FullName { get; set; }

        [Column("email")]
        public string? Email { get; set; }

        [Column("phone")]
        public string? Phone { get; set; }

        [Column("subject")]
        public string Subject { get; set; } = string.Empty;

        [Column("message")]
        public string Message { get; set; } = string.Empty;

        [Column("email_sent")]
        public bool? EmailSent { get; set; }

        [Column("created_on")]
        public DateTime? CreatedOn { get; set; } = DateTime.UtcNow;

        [Column("reply_message")]
        public string? ReplyMessage { get; set; }

        [Column("status")]
        public string Status { get; set; } = "Awaiting Response";

        [NotMapped]
        public string PropertyTitle { get; set; } = "Property";

        [NotMapped]
        public string PropertyLocation { get; set; } = "Location N/A";

        [NotMapped]
        public string PropertyPrice { get; set; } = "Price N/A";

        [NotMapped]
        public string PropertyImage { get; set; } = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80";
    }
}
