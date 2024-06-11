local simulation = require "latency_simulation"
local backend = {}

backend.simulate_load = function()
	simulation.simulate(simulation.profiles.origin, "origin")
end

return backend
