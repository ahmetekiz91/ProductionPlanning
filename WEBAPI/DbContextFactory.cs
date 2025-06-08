
using DBHelper;
using Microsoft.EntityFrameworkCore;


public class DbContextFactory
{

    private readonly DbContextOptions<AzadContext> _options;
    private readonly IConfiguration _dbConfigutation;
 
    public DbContextFactory(DbContextOptions<AzadContext> options, IConfiguration dbConfigutation)
    {
        _options = options;
        _dbConfigutation = dbConfigutation;
    }

    public AzadContext CreateDbContext()
    {
        return new AzadContext(_options, _dbConfigutation);
    }
}

