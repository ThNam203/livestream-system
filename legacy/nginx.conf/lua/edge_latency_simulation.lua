local simulation = require "latency_simulation"
local edge = {}

edge.simulate_load = function()
  simulation.simulate(simulation.profiles.edge, "edge")
end

return edge
