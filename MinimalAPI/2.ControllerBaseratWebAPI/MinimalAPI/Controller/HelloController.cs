using Microsoft.AspNetCore.Mvc;


namespace MinimalAPI.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class HelloController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Hej från Controller API!");
        }

        [HttpGet("{name}")]
        public IActionResult GetName(string name)
        {
            return Ok($"Hej {name}, från Controller API!");
        }

    }
}
