
using DBHelper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WEAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductionOrdersController : ControllerBase
    {
        private readonly AzadContext _context;

        public ProductionOrdersController(AzadContext context)
        {
            _context = context;
        }

        // GET: api/ProductionOrders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductionOrder>>> GetProductionOrders()
        {
            return await _context.ProductionOrders.ToListAsync();
        }

        // GET: api/ProductionOrders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductionOrder>> GetProductionOrder(int id)
        {
            var order = await _context.ProductionOrders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }
            return order;
        }

        // POST: api/ProductionOrders
        [HttpPost]
        public async Task<ActionResult<ProductionOrder>> PostProductionOrder(ProductionOrder order)
        {
            order.CDate ??= DateTime.Now;
            _context.ProductionOrders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductionOrder), new { id = order.ID }, order);
        }

        // PUT: api/ProductionOrders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductionOrder(int id, ProductionOrder order)
        {
            if (id != order.ID)
            {
                return BadRequest();
            }

            order.UDate = DateTime.Now;
            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductionOrderExists(id))
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

        // DELETE: api/ProductionOrders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductionOrder(int id)
        {
            var order = await _context.ProductionOrders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.ProductionOrders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductionOrderExists(int id)
        {
            return _context.ProductionOrders.Any(e => e.ID == id);
        }
    }

}