using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Inquiry_Management_DotNet.Data;
using Inquiry_Management_DotNet.DTOs;
using Inquiry_Management_DotNet.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace Inquiry_Management_DotNet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InquiriesController : ControllerBase
    {
        private readonly InquiryDbContext _context;

        public InquiriesController(InquiryDbContext context)
        {
            _context = context;
        }

        // 1. Create Inquiry (POST /api/inquiries)
        [HttpPost]
        public async Task<ActionResult<InquiryResponseDto>> CreateInquiry([FromBody] CreateInquiryDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest(new { message = "Message is required" });
            }

            // Resolve BuyerId: prefer from DTO (sent by frontend), then JWT claim, then fallback
            long buyerId = 1;
            if (dto.BuyerId.HasValue && dto.BuyerId.Value > 0)
            {
                buyerId = dto.BuyerId.Value;
            }
            else
            {
                var claimId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
                if (!string.IsNullOrEmpty(claimId) && long.TryParse(claimId, out var jwtId))
                    buyerId = jwtId;
            }

            var inquiry = new Inquiry
            {
                BuyerId = buyerId,
                PropertyId = dto.PropertyId > 0 ? dto.PropertyId : 1,
                OwnerId = (dto.OwnerId.HasValue && dto.OwnerId.Value > 0) ? dto.OwnerId.Value : 2,
                FullName = !string.IsNullOrWhiteSpace(dto.FullName) ? dto.FullName : "Anonymous",
                Email = !string.IsNullOrWhiteSpace(dto.Email) ? dto.Email : "noreply@email.com",
                Phone = !string.IsNullOrWhiteSpace(dto.Phone) ? dto.Phone : "N/A",
                Subject = !string.IsNullOrWhiteSpace(dto.Subject) ? dto.Subject : "Property Inquiry",
                Message = dto.Message,
                EmailSent = false,
                CreatedOn = DateTime.UtcNow,
                Status = "Awaiting Response"
            };

            _context.Inquiries.Add(inquiry);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInquiryById), new { id = inquiry.InquiryId }, MapToDto(inquiry));
        }

        // 2. Get Sent Inquiries for Buyer (GET /api/inquiries/buyer)
        [HttpGet("buyer")]
        public async Task<ActionResult<IEnumerable<InquiryResponseDto>>> GetBuyerInquiries()
        {
            var inquiries = await _context.Inquiries
                .OrderByDescending(i => i.InquiryId)
                .ToListAsync();

            return Ok(inquiries.Select(MapToDto));
        }

        // 3. Get Incoming Inquiries for Owner (GET /api/inquiries/owner?ownerId=X)
        [HttpGet("owner")]
        public async Task<ActionResult<IEnumerable<InquiryResponseDto>>> GetOwnerInquiries([FromQuery] long? ownerId)
        {
            if (!ownerId.HasValue || ownerId.Value <= 0)
            {
                return BadRequest(new { message = "ownerId query parameter is required to fetch owner inquiries" });
            }

            var inquiries = await _context.Inquiries
                .Where(i => i.OwnerId == ownerId.Value)
                .OrderByDescending(i => i.InquiryId)
                .ToListAsync();

            return Ok(inquiries.Select(MapToDto));
        }

        // 4. Get Single Inquiry by ID (GET /api/inquiries/{id})
        [HttpGet("{id}")]
        public async Task<ActionResult<InquiryResponseDto>> GetInquiryById(long id)
        {
            var inquiry = await _context.Inquiries.FindAsync(id);
            if (inquiry == null)
            {
                return NotFound(new { message = $"Inquiry with ID {id} not found" });
            }

            return Ok(MapToDto(inquiry));
        }

        // 5. Owner Reply to Inquiry (PUT /api/inquiries/{id}/reply)
        [HttpPut("{id}/reply")]
        public async Task<ActionResult<InquiryResponseDto>> ReplyInquiry(long id, [FromBody] ReplyInquiryDto dto)
        {
            var inquiry = await _context.Inquiries.FindAsync(id);
            if (inquiry == null)
            {
                return NotFound(new { message = $"Inquiry with ID {id} not found" });
            }

            inquiry.ReplyMessage = dto.ReplyMessage;
            inquiry.Status = "Replied";

            await _context.SaveChangesAsync();

            return Ok(MapToDto(inquiry));
        }

        // 6. Update Status (PUT /api/inquiries/{id}/status)
        [HttpPut("{id}/status")]
        public async Task<ActionResult<InquiryResponseDto>> UpdateStatus(long id, [FromBody] UpdateStatusDto dto)
        {
            var inquiry = await _context.Inquiries.FindAsync(id);
            if (inquiry == null)
            {
                return NotFound(new { message = $"Inquiry with ID {id} not found" });
            }

            inquiry.Status = dto.Status;

            await _context.SaveChangesAsync();

            return Ok(MapToDto(inquiry));
        }

        // 7. Delete Inquiry (DELETE /api/inquiries/{id})
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInquiry(long id)
        {
            var inquiry = await _context.Inquiries.FindAsync(id);
            if (inquiry == null)
            {
                return NotFound(new { message = $"Inquiry with ID {id} not found" });
            }

            _context.Inquiries.Remove(inquiry);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static InquiryResponseDto MapToDto(Inquiry i)
        {
            return new InquiryResponseDto
            {
                InquiryId = i.InquiryId,
                BuyerId = i.BuyerId,
                PropertyId = i.PropertyId,
                OwnerId = i.OwnerId,
                FullName = !string.IsNullOrWhiteSpace(i.FullName) ? i.FullName : "Abhishek Dhoran",
                Email = !string.IsNullOrWhiteSpace(i.Email) ? i.Email : "abhishek.dhoran@gmail.com",
                Phone = !string.IsNullOrWhiteSpace(i.Phone) ? i.Phone : "7747926022",
                PropertyTitle = !string.IsNullOrWhiteSpace(i.PropertyTitle) ? i.PropertyTitle : "Property",
                PropertyLocation = !string.IsNullOrWhiteSpace(i.PropertyLocation) ? i.PropertyLocation : "Location N/A",
                PropertyPrice = !string.IsNullOrWhiteSpace(i.PropertyPrice) ? i.PropertyPrice : "N/A",
                PropertyImage = !string.IsNullOrWhiteSpace(i.PropertyImage) ? i.PropertyImage : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
                Subject = i.Subject,
                Message = i.Message,
                ReplyMessage = i.ReplyMessage,
                Status = !string.IsNullOrWhiteSpace(i.Status) ? i.Status : "Awaiting Response",
                CreatedOn = i.CreatedOn ?? DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow
            };
        }
    }
}
