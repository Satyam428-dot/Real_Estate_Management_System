using System;

namespace Inquiry_Management_DotNet.DTOs
{
    public class CreateInquiryDto
    {
        public long? BuyerId { get; set; }
        public long PropertyId { get; set; }
        public long? OwnerId { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? PropertyTitle { get; set; }
        public string? PropertyLocation { get; set; }
        public string? PropertyPrice { get; set; }
        public string? PropertyImage { get; set; }
    }

    public class ReplyInquiryDto
    {
        public string ReplyMessage { get; set; } = string.Empty;
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }

    public class InquiryResponseDto
    {
        public long InquiryId { get; set; }
        public string InquiryCode => $"ENQ-{InquiryId.ToString().PadLeft(6, '0')}";
        public long BuyerId { get; set; }
        public long PropertyId { get; set; }
        public long? OwnerId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string PropertyTitle { get; set; } = string.Empty;
        public string PropertyLocation { get; set; } = string.Empty;
        public string PropertyPrice { get; set; } = string.Empty;
        public string PropertyImage { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? ReplyMessage { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedOn { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
