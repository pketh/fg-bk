(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2014 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "# Fogcreek.com Background\n\nThe animated background on [fogcreek.com][fb]\n\nBuilt with HyperWeb :milky_way:\n\n[fb]:www.fogcreek.com\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee": {
      "path": "main.coffee",
      "content": "width = null\nheight = null\n\nlineColor = 'rgba(219,219,219,1)'\ncircleColor = 'rgba(118,154,255,0.9)'\ncircleRadius = 40\nballColor = 'rgba(89,255,218,0.75)'\nballRadius = null\n\ninitialBallPropagationDelay = 10\naddBallPropagationDelay = 500\n\n# multiplier that determines how fast balls propagate and move\nrate = 0.15\n\nupdateWindowSize = ->\n  width = $(window).width()\n  height = $(window).height()\n  return\n\nupdateWindowSize()\n\n$(window).on 'resize', updateWindowSize\n\ninitialPoints = [\n  [width * 0.2, height * 0.25]\n  [width * 0.8, height * 0.4]\n  [width * 0.4, height * 0.7]\n]\n\nTAU = 2 * Math.PI\n\nexpr = (rate) ->\n  Math.log(1-Math.random())/(-rate)\n\nstyle = document.createElement(\"style\") # remove these\nstyle.innerHTML = require \"./style\" #\ndocument.head.appendChild style #\n\npaper = new Raphael(document.body, \"100%\", \"100%\") # insert into \"main-background\" id\n\ndrawPerspective = ->\n  lines = 25\n  [0...3*lines].forEach (n) ->\n    m = width/lines\n    line = paper.path( [\"M\", n * m - width, height, \"L\", width/2, height/2 ] )\n\nmovementFns = [\n  (t) ->\n    [osc(t, 10) * 10, osc(t, 19, TAU/4) * 15]\n  (t) ->\n    [osc(t, 7) * 5, osc(t, 17, TAU/4) * 15]\n  (t) ->\n    [osc(t, 11) * 20, osc(t, 21, TAU/4) * 15]\n]\n\npoints = []\nlines = []\n\nupdateLines = ->\n  lines = points.map (p, i) -> # optimize (to gpu?)\n    if i is 0\n      line(p, points[points.length-1])\n    else\n      line(p, points[i-1])\n\nline = ([x1, y1], [x2, y2]) ->\n  # (y2 - y1)x - (x2 - x1)y = (x1y2 - x2y1)\n\n  dy = y2 - y1\n  dx = x2 - x1\n\n  crossProduct = x1 * y2 - x2 * y1\n\n  y1 = (crossProduct/-dx)\n  y2 = (crossProduct - width * dy)/(-dx)\n\n  [0, y1, width, y2]\n\ndrawLines = ->\n  lines.forEach ([x1, y1, x2, y2]) ->\n    paper.path [\"M\", x1, y1, \"L\", x2, y2]\n    .attr\n      stroke: lineColor\n\ndrawCircles = ->\n  points.forEach ([x, y]) ->\n    paper.circle x, y, circleRadius\n    .attr\n      fill: circleColor\n      stroke: \"none\"\n\nosc = (t, period, phi=0) ->\n  Math.sin TAU * t / period + phi\n\ntracks = []\nPATH_TIME = 10\n\n[0..2].forEach (i) ->\n  track = tracks[i] = []\n\n  addBall = ->\n    track.push\n      t: 0\n      r: Math.random() * 30 + 10\n\n    setTimeout addBall, expr(rate) * addBallPropagationDelay\n  setTimeout addBall, expr(rate) * initialBallPropagationDelay\n\nupdate = (t) ->\n  initialPoints.forEach ([x, y], i) ->\n    [fx, fy] = movementFns[i](t)\n    points[i] = [fx + x, fy + y]\n\n  updateLines()\n\n  tracks.forEach (track) ->\n    track.forEach (ball) ->\n      ball.t += dt\n\n    track = track.filter ({t}) ->\n      t < PATH_TIME\n\ndrawBalls = ->\n  tracks.forEach (track, i) ->\n    track.forEach (ball) ->\n      drawBall ball, i\n\nlerp = (a, b, t) ->\n  a + (b - a) * t\n\npointAt = ([x1, y1, x2, y2], t) ->\n  [lerp(x1, x2, t), lerp(y1, y2, t)]\n\ndrawBall = (ball, i) ->\n  [x, y] = pointAt(lines[i], ball.t/PATH_TIME)\n\n  paper.circle x, y, ball.r\n  .attr\n    fill: ballColor\n    stroke: \"none\"\n\ndraw = ->\n  paper.clear()\n  drawLines()\n  drawCircles()\n  drawBalls()\n\nt = 0\ndt = 1/60\n\nanimate = ->\n  requestAnimationFrame animate\n  update(t)\n  draw()\n  t += dt\n\nrequestAnimationFrame animate\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "remoteDependencies: [\n  \"http://code.jquery.com/jquery-2.1.3.min.js\"\n  \"https://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.2/raphael-min.js\"\n]\n",
      "mode": "100644",
      "type": "blob"
    },
    "style.styl": {
      "path": "style.styl",
      "content": "html\n  height: 100%\n\nbody\n  height: 100%\n  margin: 0\n  overflow: hidden\n",
      "mode": "100644",
      "type": "blob"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var PATH_TIME, TAU, addBallPropagationDelay, animate, ballColor, ballRadius, circleColor, circleRadius, draw, drawBall, drawBalls, drawCircles, drawLines, drawPerspective, dt, expr, height, initialBallPropagationDelay, initialPoints, lerp, line, lineColor, lines, movementFns, osc, paper, pointAt, points, rate, style, t, tracks, update, updateLines, updateWindowSize, width;\n\n  width = null;\n\n  height = null;\n\n  lineColor = 'rgba(219,219,219,1)';\n\n  circleColor = 'rgba(118,154,255,0.9)';\n\n  circleRadius = 40;\n\n  ballColor = 'rgba(89,255,218,0.75)';\n\n  ballRadius = null;\n\n  initialBallPropagationDelay = 10;\n\n  addBallPropagationDelay = 500;\n\n  rate = 0.15;\n\n  updateWindowSize = function() {\n    width = $(window).width();\n    height = $(window).height();\n  };\n\n  updateWindowSize();\n\n  $(window).on('resize', updateWindowSize);\n\n  initialPoints = [[width * 0.2, height * 0.25], [width * 0.8, height * 0.4], [width * 0.4, height * 0.7]];\n\n  TAU = 2 * Math.PI;\n\n  expr = function(rate) {\n    return Math.log(1 - Math.random()) / (-rate);\n  };\n\n  style = document.createElement(\"style\");\n\n  style.innerHTML = require(\"./style\");\n\n  document.head.appendChild(style);\n\n  paper = new Raphael(document.body, \"100%\", \"100%\");\n\n  drawPerspective = function() {\n    var lines, _i, _ref, _results;\n    lines = 25;\n    return (function() {\n      _results = [];\n      for (var _i = 0, _ref = 3 * lines; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }\n      return _results;\n    }).apply(this).forEach(function(n) {\n      var line, m;\n      m = width / lines;\n      return line = paper.path([\"M\", n * m - width, height, \"L\", width / 2, height / 2]);\n    });\n  };\n\n  movementFns = [\n    function(t) {\n      return [osc(t, 10) * 10, osc(t, 19, TAU / 4) * 15];\n    }, function(t) {\n      return [osc(t, 7) * 5, osc(t, 17, TAU / 4) * 15];\n    }, function(t) {\n      return [osc(t, 11) * 20, osc(t, 21, TAU / 4) * 15];\n    }\n  ];\n\n  points = [];\n\n  lines = [];\n\n  updateLines = function() {\n    return lines = points.map(function(p, i) {\n      if (i === 0) {\n        return line(p, points[points.length - 1]);\n      } else {\n        return line(p, points[i - 1]);\n      }\n    });\n  };\n\n  line = function(_arg, _arg1) {\n    var crossProduct, dx, dy, x1, x2, y1, y2;\n    x1 = _arg[0], y1 = _arg[1];\n    x2 = _arg1[0], y2 = _arg1[1];\n    dy = y2 - y1;\n    dx = x2 - x1;\n    crossProduct = x1 * y2 - x2 * y1;\n    y1 = crossProduct / -dx;\n    y2 = (crossProduct - width * dy) / (-dx);\n    return [0, y1, width, y2];\n  };\n\n  drawLines = function() {\n    return lines.forEach(function(_arg) {\n      var x1, x2, y1, y2;\n      x1 = _arg[0], y1 = _arg[1], x2 = _arg[2], y2 = _arg[3];\n      return paper.path([\"M\", x1, y1, \"L\", x2, y2]).attr({\n        stroke: lineColor\n      });\n    });\n  };\n\n  drawCircles = function() {\n    return points.forEach(function(_arg) {\n      var x, y;\n      x = _arg[0], y = _arg[1];\n      return paper.circle(x, y, circleRadius).attr({\n        fill: circleColor,\n        stroke: \"none\"\n      });\n    });\n  };\n\n  osc = function(t, period, phi) {\n    if (phi == null) {\n      phi = 0;\n    }\n    return Math.sin(TAU * t / period + phi);\n  };\n\n  tracks = [];\n\n  PATH_TIME = 10;\n\n  [0, 1, 2].forEach(function(i) {\n    var addBall, track;\n    track = tracks[i] = [];\n    addBall = function() {\n      track.push({\n        t: 0,\n        r: Math.random() * 30 + 10\n      });\n      return setTimeout(addBall, expr(rate) * addBallPropagationDelay);\n    };\n    return setTimeout(addBall, expr(rate) * initialBallPropagationDelay);\n  });\n\n  update = function(t) {\n    initialPoints.forEach(function(_arg, i) {\n      var fx, fy, x, y, _ref;\n      x = _arg[0], y = _arg[1];\n      _ref = movementFns[i](t), fx = _ref[0], fy = _ref[1];\n      return points[i] = [fx + x, fy + y];\n    });\n    updateLines();\n    return tracks.forEach(function(track) {\n      track.forEach(function(ball) {\n        return ball.t += dt;\n      });\n      return track = track.filter(function(_arg) {\n        var t;\n        t = _arg.t;\n        return t < PATH_TIME;\n      });\n    });\n  };\n\n  drawBalls = function() {\n    return tracks.forEach(function(track, i) {\n      return track.forEach(function(ball) {\n        return drawBall(ball, i);\n      });\n    });\n  };\n\n  lerp = function(a, b, t) {\n    return a + (b - a) * t;\n  };\n\n  pointAt = function(_arg, t) {\n    var x1, x2, y1, y2;\n    x1 = _arg[0], y1 = _arg[1], x2 = _arg[2], y2 = _arg[3];\n    return [lerp(x1, x2, t), lerp(y1, y2, t)];\n  };\n\n  drawBall = function(ball, i) {\n    var x, y, _ref;\n    _ref = pointAt(lines[i], ball.t / PATH_TIME), x = _ref[0], y = _ref[1];\n    return paper.circle(x, y, ball.r).attr({\n      fill: ballColor,\n      stroke: \"none\"\n    });\n  };\n\n  draw = function() {\n    paper.clear();\n    drawLines();\n    drawCircles();\n    return drawBalls();\n  };\n\n  t = 0;\n\n  dt = 1 / 60;\n\n  animate = function() {\n    requestAnimationFrame(animate);\n    update(t);\n    draw();\n    return t += dt;\n  };\n\n  requestAnimationFrame(animate);\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"remoteDependencies\":[\"http://code.jquery.com/jquery-2.1.3.min.js\",\"https://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.2/raphael-min.js\"]};",
      "type": "blob"
    },
    "style": {
      "path": "style",
      "content": "module.exports = \"html {\\n  height: 100%;\\n}\\n\\nbody {\\n  height: 100%;\\n  margin: 0;\\n  overflow: hidden;\\n}\";",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://hyperweb.space/?repo=pketh/fogcreek-bk"
  },
  "entryPoint": "main",
  "remoteDependencies": [
    "http://code.jquery.com/jquery-2.1.3.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.2/raphael-min.js"
  ],
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "pketh/fogcreek-bk",
    "homepage": "http://www.fogcreek.com",
    "description": "A simple animated SVG background ",
    "html_url": "https://github.com/pketh/fogcreek-bk",
    "url": "https://api.github.com/repos/pketh/fogcreek-bk",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});