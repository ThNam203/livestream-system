math.randomseed(os.time())
local random = math.random

local popular_percentage = 80
local popular_stream_quantity = 10
local stream_total = 200

request = function()
  local is_popular = random(1, 100) <= popular_percentage
  local item = ""

  if is_popular then
    item = "item-" .. random(1, popular_stream_quantity)
  else
    item = "item-" .. random(popular_stream_quantity + 1, popular_stream_quantity + max_total_items)
  end

  return wrk.format(nil, "/path/" .. item .. ".ext")
end


-- the idea is that popular streamers take 80% of the viewers
-- so those files will most likely to be requested than others
-- this simulate more like into real life scenario
