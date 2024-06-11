local simulation = require "latency_simulation"
local edge = {}

edge.simulate_load = function()
  simulation.simulate(simulations.profiles.edge)
end

return edge
