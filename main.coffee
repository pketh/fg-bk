width = null
height = null

updateWindowSize = ->
  width = $(window).width()
  height = $(window).height()
  return

updateWindowSize()

$(window).on 'resize', updateWindowSize

TAU = 2 * Math.PI

expr = (rate) ->
  Math.log(1-Math.random())/(-rate)

style = document.createElement("style") # remove these
style.innerHTML = require "./style" #
document.head.appendChild style #

paper = new Raphael(document.body, "100%", "100%") # insert into "main-background" id

lineColor = 'rgba(219,219,219,1)'
circleColor = 'rgba(118,154,255,0.9)'
ballColor = 'rgba(89,255,218,0.75)'

drawPerspective = ->
  lines = 25
  [0...3*lines].forEach (n) ->
    m = width/lines
    line = paper.path( ["M", n * m - width, height, "L", width/2, height/2 ] )

initialPoints = [
  [width * 0.2, height * 0.25]
  [width * 0.8, height * 0.4]
  [width * 0.4, height * 0.8]
]

movementFns = [
  (t) ->
    [osc(t, 10) * 10, osc(t, 19, TAU/4) * 15]
  (t) ->
    [osc(t, 7) * 5, osc(t, 17, TAU/4) * 15]
  (t) ->
    [osc(t, 11) * 20, osc(t, 21, TAU/4) * 15]
]

points = []
lines = []

updateLines = ->
  lines = points.map (p, i) -> # optimize (to gpu?)
    if i is 0
      line(p, points[points.length-1])
    else
      line(p, points[i-1])

line = ([x1, y1], [x2, y2]) ->
  # (y2 - y1)x - (x2 - x1)y = (x1y2 - x2y1)

  dy = y2 - y1
  dx = x2 - x1

  crossProduct = x1 * y2 - x2 * y1

  y1 = (crossProduct/-dx)
  y2 = (crossProduct - width * dy)/(-dx)

  [0, y1, width, y2]

drawLines = ->
  lines.forEach ([x1, y1, x2, y2]) ->
    paper.path ["M", x1, y1, "L", x2, y2]
    .attr
      stroke: lineColor

drawCircles = ->
  points.forEach ([x, y]) ->
    paper.circle x, y, 50
    .attr
      fill: circleColor
      stroke: "none"

osc = (t, period, phi=0) ->
  Math.sin TAU * t / period + phi

tracks = []
PATH_TIME = 10

[0..2].forEach (i) ->
  track = tracks[i] = []
  rate = 0.12

  addBall = ->
    track.push
      t: 0
      r: Math.random() * 30 + 10

    setTimeout addBall, expr(rate) * 1000
  setTimeout addBall, expr(rate) * 1000

update = (t) ->
  initialPoints.forEach ([x, y], i) ->
    [fx, fy] = movementFns[i](t)
    points[i] = [fx + x, fy + y]

  updateLines()

  tracks.forEach (track) ->
    track.forEach (ball) ->
      ball.t += dt

    track = track.filter ({t}) ->
      t < PATH_TIME

drawBalls = ->
  tracks.forEach (track, i) ->
    track.forEach (ball) ->
      drawBall ball, i

lerp = (a, b, t) ->
  a + (b - a) * t

pointAt = ([x1, y1, x2, y2], t) ->
  [lerp(x1, x2, t), lerp(y1, y2, t)]

drawBall = (ball, i) ->
  [x, y] = pointAt(lines[i], ball.t/PATH_TIME)

  paper.circle x, y, ball.r
  .attr
    fill: ballColor
    stroke: "none"

draw = ->
  paper.clear()
  drawLines()
  drawCircles()
  drawBalls()

t = 0
dt = 1/60

animate = ->
  requestAnimationFrame animate
  update(t)
  draw()
  t += dt

requestAnimationFrame animate
