local simulations = {}
local random = math.random
local sleep = ngx.sleep

math.randomseed(ngx.time() + ngx.worker.pid())

-- simulate real world latency using percentiles map
-- for example, with percentile 50% (p50) it will return 1ms to 500ms latency
-- and so on
-- in this simulation we use p50, p90, p95, p99

simulation.simulate = function(percentiles)
  local current_percentage = random(1, 100)
  local min_wait_ms = 1
  local max_wait_ms = 1000

  for _, percentile in pairs(percentiles) do
    if current_percentage <= percentile.p then
      min_wait_ms = percentile.min
      max_wait_ms = percentile.max
      break
    end
  end

  local sleep_seconds = random(min_wait_ms, max_wait_ms) * 0.001
  ngx.header["X-Latency"] = "simulated=" .. sleep_seconds .. "s, min=" .. min_wait_ms .. ", max=" .. max_wait_ms .. ", profile=" .. (ngx.var.arg_profile or "empty")

  sleep(sleep_seconds)
end

-- config for percentiles map

simulations.profiles = {
  edge={
    {p=50, min=10, max=20,}, {p=90, min=21, max=50,}, {p=95, min=51, max=150,}, {p=99, min=151, max=500,},
  },
  backend={
    {p=50, min=100, max=400,}, {p=90, min=401, max=500,}, {p=95, min=501, max=1500,}, {p=99, min=1501, max=3000,},
  },
}

return simulation
