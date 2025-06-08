
using DBHelper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WEAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductionLinesController : ControllerBase
    {
        private readonly AzadContext _context;

        public ProductionLinesController(AzadContext context)
        {
            _context = context;
        }

        // GET: api/ProductionLines
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductionLines>>> GetProductionLines()
        {
            return await _context.ProductionLines.ToListAsync();
        }

        // GET: api/ProductionLines/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductionLines>> GetProductionLine(int id)
        {
            var line = await _context.ProductionLines.FindAsync(id);

            if (line == null)
            {
                return NotFound();
            }

            return line;
        }

        // POST: api/ProductionLines
        [HttpPost]
        public async Task<ActionResult<ProductionLines>> PostProductionLine(ProductionLines line)
        {
            line.CDate ??= DateTime.Now;
            _context.ProductionLines.Add(line);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductionLine), new { id = line.ID }, line);
        }

        // PUT: api/ProductionLines/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductionLine(int id, ProductionLines line)
        {
            if (id != line.ID)
            {
                return BadRequest();
            }

            line.UDate = DateTime.Now;
            _context.Entry(line).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductionLineExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // DELETE: api/ProductionLines/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductionLine(int id)
        {
            var line = await _context.ProductionLines.FindAsync(id);
            if (line == null)
            {
                return NotFound();
            }

            _context.ProductionLines.Remove(line);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductionLineExists(int id)
        {
            return _context.ProductionLines.Any(e => e.ID == id);
        }
    }


}