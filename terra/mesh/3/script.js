! function e(t, i, r) {
    function n(a, s) { if (!i[a]) { if (!t[a]) { var h = "function" == typeof require && require; if (!s && h) return h(a, !0); if (o) return o(a, !0); var l = new Error("Cannot find module '" + a + "'"); throw l.code = "MODULE_NOT_FOUND", l } var c = i[a] = { exports: {} };
            t[a][0].call(c.exports, function(e) { var i = t[a][1][e]; return n(i ? i : e) }, c, c.exports, e, t, i, r) } return i[a].exports } for (var o = "function" == typeof require && require, a = 0; a < r.length; a++) n(r[a]); return n }({
    1: [function(e, t, i) { "use strict";
        t.exports.Composer = e("./src/Composer"), t.exports.CopyPass = e("./src/passes/copy/CopyPass"), t.exports.BlendMode = { Normal: 1, Dissolve: 2, Darken: 3, Multiply: 4, ColorBurn: 5, LinearBurn: 6, DarkerColor: 7, Lighten: 8, Screen: 9, ColorDodge: 10, LinearDodge: 11, LighterColor: 12, Overlay: 13, SoftLight: 14, HardLight: 15, VividLight: 16, LinearLight: 17, PinLight: 18, HardMix: 19, Difference: 20, Exclusion: 21, Substract: 22, Divide: 23 } }, { "./src/Composer": 2, "./src/passes/copy/CopyPass": 10 }],
    2: [function(e, t, i) { "use strict";

        function r(e, t) { var i = e.getPixelRatio();
            this.width = Math.floor(e.context.canvas.width / i) || 1, this.height = Math.floor(e.context.canvas.height / i) || 1, this.output = null, this.input = null, this.read = null, this.write = null, this.settings = t || {}, this.useRGBA = this.settings.useRGBA || !1, this.renderer = e, this.copyPass = new o(this.settings), this.defaultMaterial = new n.MeshBasicMaterial({ color: 65280, wireframe: !1 }), this.scene = new n.Scene, this.quad = new n.Mesh(new n.PlaneBufferGeometry(1, 1), this.defaultMaterial), this.scene.add(this.quad), this.camera = new n.OrthographicCamera(1, 1, 1, 1, -1e4, 1e4), this.front = new n.WebGLRenderTarget(1, 1, { minFilter: void 0 !== this.settings.minFilter ? this.settings.minFilter : n.LinearFilter, magFilter: void 0 !== this.settings.magFilter ? this.settings.magFilter : n.LinearFilter, wrapS: void 0 !== this.settings.wrapS ? this.settings.wrapS : n.ClampToEdgeWrapping, wrapT: void 0 !== this.settings.wrapT ? this.settings.wrapT : n.ClampToEdgeWrapping, format: this.useRGBA ? n.RGBAFormat : n.RGBFormat, type: void 0 !== this.settings.type ? this.settings.type : n.UnsignedByteType, stencilBuffer: void 0 !== this.settings.stencilBuffer ? this.settings.stencilBuffer : !0 }), this.back = this.front.clone(), this.startTime = Date.now(), this.passes = {}, this.setSize(this.width, this.height) } var n = e("three"),
            o = e("./passes/copy/CopyPass"),
            a = e("./Stack"),
            s = e("./Pass");
        t.exports = r, r.prototype.swapBuffers = function() { this.output = this.write, this.input = this.read; var e = this.write;
            this.write = this.read, this.read = e }, r.prototype.render = function(e, t, i, r) { i && this.swapBuffers(), this.renderer.render(e, t, r ? r : this.write, !0), r || this.swapBuffers() }, r.prototype.toScreen = function() { this.quad.material = this.copyPass.shader, this.quad.material.uniforms.tInput.value = this.read, this.quad.material.uniforms.resolution.value.set(this.width, this.height), this.renderer.render(this.scene, this.camera) }, r.prototype.toTexture = function(e) { this.quad.material = this.copyPass.shader, this.quad.material.uniforms.tInput.value = this.read, this.renderer.render(this.scene, this.camera, e, !1) }, r.prototype.pass = function(e) { if (e instanceof a) this.passStack(e);
            else { if (e instanceof n.ShaderMaterial && (this.quad.material = e), e instanceof s) return void e.run(this);
                e.isSim || (this.quad.material.uniforms.tInput.value = this.read), this.quad.material.uniforms.resolution.value.set(this.width, this.height), this.quad.material.uniforms.time.value = .001 * (Date.now() - this.startTime), this.renderer.render(this.scene, this.camera, this.write, !1), this.swapBuffers() } }, r.prototype.passStack = function(e) { e.getPasses().forEach(function(e) { this.pass(e) }.bind(this)) }, r.prototype.reset = function() { this.read = this.front, this.write = this.back, this.output = this.write, this.input = this.read }, r.prototype.setSource = function(e) { this.quad.material = this.copyPass.shader, this.quad.material.uniforms.tInput.value = e, this.renderer.render(this.scene, this.camera, this.write, !0), this.swapBuffers() }, r.prototype.setSize = function(e, t) { this.width = e, this.height = t, this.camera.projectionMatrix.makeOrthographic(e / -2, e / 2, t / 2, t / -2, this.camera.near, this.camera.far), this.quad.scale.set(e, t, 1); var i = this.front.clone();
            i.width = e, i.height = t, this.quad.material instanceof s && (this.quad.material.uniforms.tInput.value = i), this.front = i, i = this.back.clone(), i.width = e, i.height = t, this.back = i } }, { "./Pass": 3, "./Stack": 4, "./passes/copy/CopyPass": 10, three: 36 }],
    3: [function(e, t, i) { "use strict";

        function r() { this.shader = null, this.loaded = null, this.params = {}, this.isSim = !1 } var n = e("three"),
            o = e("./utils/processShader");
        t.exports = r, r.prototype.setShader = function(e, t) { this.shader = o(e, t) }, r.prototype.run = function(e) { e.pass(this.shader) }, r.prototype.getOfflineTexture = function(e, t, i) { return new n.WebGLRenderTarget(e, t, { minFilter: n.LinearFilter, magFilter: n.LinearFilter, format: i ? n.RGBAFormat : n.RGBFormat }) } }, { "./utils/processShader": 13, three: 36 }],
    4: [function(e, t, i) { "use strict";

        function r(e) { this.passItems = [], this.shadersPool = e, this.passes = [] } t.exports = r, r.prototype.addPass = function(e, t, i, r) { var n = 0,
                o = { shaderName: e, enabled: t || !1 }; return this.passItems.push(o), n = this.passItems.length, this.updatePasses(), r ? this.movePassToIndex(this.passItems[n], r) : n - 1 }, r.prototype.removePass = function(e) { this.passItems.splice(e, 1), this.updatePasses() }, r.prototype.enablePass = function(e) { this.passItems[e].enabled = !0, this.updatePasses() }, r.prototype.disablePass = function(e) { this.passItems[e].enabled = !1, this.updatePasses() }, r.prototype.isPassEnabled = function(e) { return this.passItems[e].enabled }, r.prototype.movePassToIndex = function(e, t) { return this.passItems.splice(t, 0, this.passItems.splice(e, 1)[0]), this.updatePasses(), t }, r.prototype.reverse = function() { this.passItems.reverse(), this.updatePasses() }, r.prototype.updatePasses = function() { this.passes = this.shadersPool.getPasses(this.passItems), this.passItems.forEach(function(e, t) { void 0 === e.params && (e.params = JSON.parse(JSON.stringify(this.passes[t].params))) }.bind(this)) }, r.prototype.getPasses = function() { return this.passes } }, {}],
    5: [function(e, t, i) { "use strict";

        function r(e) { o.call(this), e = e || {}, this.setShader(a, s), this.params.mode = e.mode || 1, this.params.opacity = e.opacity || 1, this.params.tInput2 = e.tInput2 || null, this.params.resolution2 = e.resolution2 || new n.Vector2, this.params.sizeMode = e.sizeMode || 1, this.params.aspectRatio = e.aspectRatio || 1, this.params.aspectRatio2 = e.aspectRatio2 || 1 } var n = e("three"),
            o = e("../../Pass"),
            a = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n}",
            s = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\nuniform sampler2D tInput2;\nuniform vec2 resolution;\nuniform vec2 resolution2;\nuniform float aspectRatio;\nuniform float aspectRatio2;\nuniform int mode;\nuniform int sizeMode;\nuniform float opacity;\n\nvec2 vUv2;\n\nfloat applyOverlayToChannel( float base, float blend ) {\n\n  return (base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)));\n\n}\n\nfloat applySoftLightToChannel( float base, float blend ) {\n\n  return ((blend < 0.5) ? (2.0 * base * blend + base * base * (1.0 - 2.0 * blend)) : (sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend)));\n\n}\n\nfloat applyColorBurnToChannel( float base, float blend ) {\n\n  return ((blend == 0.0) ? blend : max((1.0 - ((1.0 - base) / blend)), 0.0));\n\n}\n\nfloat applyColorDodgeToChannel( float base, float blend ) {\n\n  return ((blend == 1.0) ? blend : min(base / (1.0 - blend), 1.0));\n\n}\n\nfloat applyLinearBurnToChannel( float base, float blend ) {\n\n  return max(base + blend - 1., 0.0 );\n\n}\n\nfloat applyLinearDodgeToChannel( float base, float blend ) {\n\n  return min( base + blend, 1. );\n\n}\n\nfloat applyLinearLightToChannel( float base, float blend ) {\n\n  return ( blend < .5 ) ? applyLinearBurnToChannel( base, 2. * blend ) : applyLinearDodgeToChannel( base, 2. * ( blend - .5 ) );\n\n}\n\nvoid main() {\n\n  vUv2 = vUv;\n  \n  if( sizeMode == 1 ) {\n    \n    if( aspectRatio2 > aspectRatio ) {\n      vUv2.x = vUv.x * aspectRatio / aspectRatio2;\n      vUv2.x += .5 * ( 1. - aspectRatio / aspectRatio2 ); \n      vUv2.y = vUv.y;\n    }\n\n    if( aspectRatio2 < aspectRatio ) {\n      vUv2.x = vUv.x;\n      vUv2.y = vUv.y * aspectRatio2 / aspectRatio;\n      vUv2.y += .5 * ( 1. - aspectRatio2 / aspectRatio );\n    }\n\n  }\n\n  vec4 base = texture2D( tInput, vUv );\n  vec4 blend = texture2D( tInput2, vUv2 );\n\n  if( mode == 1 ) { // normal\n\n    gl_FragColor = base;\n    gl_FragColor.a *= opacity;\n    return;\n\n  }\n\n  if( mode == 2 ) { // dissolve\n\n  }\n\n  if( mode == 3 ) { // darken\n\n    gl_FragColor = min( base, blend );\n    return;\n\n  }\n\n  if( mode == 4 ) { // multiply\n\n    gl_FragColor = base * blend;\n    return;\n\n  }\n\n  if( mode == 5 ) { // color burn\n\n    gl_FragColor = vec4(\n      applyColorBurnToChannel( base.r, blend.r ),\n      applyColorBurnToChannel( base.g, blend.g ),\n      applyColorBurnToChannel( base.b, blend.b ),\n      applyColorBurnToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 6 ) { // linear burn\n\n    gl_FragColor = max(base + blend - 1.0, 0.0);\n    return;\n\n  }\n\n  if( mode == 7 ) { // darker color\n\n  }\n\n  if( mode == 8 ) { // lighten\n\n    gl_FragColor = max( base, blend );\n    return;\n\n  }\n\n  if( mode == 9 ) { // screen\n\n    gl_FragColor = (1.0 - ((1.0 - base) * (1.0 - blend)));\n    gl_FragColor = gl_FragColor * opacity + base * ( 1. - opacity );\n    return;\n\n  }\n\n  if( mode == 10 ) { // color dodge\n\n    gl_FragColor = vec4(\n      applyColorDodgeToChannel( base.r, blend.r ),\n      applyColorDodgeToChannel( base.g, blend.g ),\n      applyColorDodgeToChannel( base.b, blend.b ),\n      applyColorDodgeToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 11 ) { // linear dodge\n\n    gl_FragColor = min(base + blend, 1.0);\n    return;\n\n  }\n\n  if( mode == 12 ) { // lighter color\n\n  }\n\n  if( mode == 13 ) { // overlay\n\n    gl_FragColor = gl_FragColor = vec4( \n      applyOverlayToChannel( base.r, blend.r ),\n      applyOverlayToChannel( base.g, blend.g ),\n      applyOverlayToChannel( base.b, blend.b ),\n      applyOverlayToChannel( base.a, blend.a )\n    );\n    gl_FragColor = gl_FragColor * opacity + base * ( 1. - opacity );\n  \n    return;\n\n  }\n\n  if( mode == 14 ) { // soft light\n\n    gl_FragColor = vec4( \n      applySoftLightToChannel( base.r, blend.r ),\n      applySoftLightToChannel( base.g, blend.g ),\n      applySoftLightToChannel( base.b, blend.b ),\n      applySoftLightToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 15 ) { // hard light\n\n    gl_FragColor = vec4( \n      applyOverlayToChannel( base.r, blend.r ),\n      applyOverlayToChannel( base.g, blend.g ),\n      applyOverlayToChannel( base.b, blend.b ),\n      applyOverlayToChannel( base.a, blend.a )\n    );\n    gl_FragColor = gl_FragColor * opacity + base * ( 1. - opacity );\n    return;\n\n  }\n\n  if( mode == 16 ) { // vivid light\n\n  }\n\n  if( mode == 17 ) { // linear light\n\n    gl_FragColor = vec4( \n      applyLinearLightToChannel( base.r, blend.r ),\n      applyLinearLightToChannel( base.g, blend.g ),\n      applyLinearLightToChannel( base.b, blend.b ),\n      applyLinearLightToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 18 ) { // pin light\n\n  }\n\n  if( mode == 19 ) { // hard mix\n\n  }\n\n  if( mode == 20 ) { // difference\n\n    gl_FragColor = abs( base - blend );\n    gl_FragColor.a = base.a + blend.b;\n    return;\n\n  }\n\n  if( mode == 21 ) { // exclusion\n\n    gl_FragColor = base + blend - 2. * base * blend;\n    \n  }\n\n  if( mode == 22 ) { // substract\n\n  }\n\n  if( mode == 23 ) { // divide\n\n  }\n\n  gl_FragColor = vec4( 1., 0., 1., 1. );\n\n}";
        t.exports = r, r.prototype = Object.create(o.prototype), r.prototype.constructor = r, r.prototype.run = function(e) { this.shader.uniforms.mode.value = this.params.mode, this.shader.uniforms.opacity.value = this.params.opacity, this.shader.uniforms.tInput2.value = this.params.tInput2, this.shader.uniforms.sizeMode.value = this.params.sizeMode, this.shader.uniforms.aspectRatio.value = this.params.aspectRatio, this.shader.uniforms.aspectRatio2.value = this.params.aspectRatio2, e.pass(this.shader) } }, { "../../Pass": 3, three: 36 }],
    6: [function(e, t, i) { "use strict";

        function r(e) { o.call(this), e = e || {}, this.composer = null, this.tmpTexture = this.getOfflineTexture(e.width, e.height, !0), this.blurPass = new h(2), this.blendPass = new l, this.zoomBlur = new c, this.brightnessContrastPass = new u, this.width = e.width || 512, this.height = e.height || 512, this.params.blurAmount = e.blurAmount || 2, this.params.applyZoomBlur = e.applyZoomBlur || !1, this.params.zoomBlurStrength = e.zoomBlurStrength || .2, this.params.useTexture = e.useTexture || !1, this.params.zoomBlurCenter = e.zoomBlurCenter || new n.Vector2(.5, .5), this.params.blendMode = e.blendMode || s.Screen, this.params.glowTexture = null } var n = e("three"),
            o = e("../../Pass"),
            a = e("../../Composer"),
            s = e("../../..").BlendMode,
            h = e("../box-blur/FullBoxBlurPass"),
            l = e("../blend/BlendPass"),
            c = e("../zoom-blur/ZoomBlurPass"),
            u = e("../brightness-contrast/BrightnessContrastPass");
        t.exports = r, r.prototype = Object.create(o.prototype), r.prototype.constructor = r, r.prototype.run = function(e) { this.composer || (this.composer = new a(e.renderer, { useRGBA: !0 }), this.composer.setSize(this.width, this.height)), this.composer.reset(), this.params.useTexture === !0 ? this.composer.setSource(this.params.glowTexture) : this.composer.setSource(e.output), this.blurPass.params.amount = this.params.blurAmount, this.composer.pass(this.blurPass), this.params.applyZoomBlur && (this.zoomBlur.params.center.set(.5, .5), this.zoomBlur.params.strength = this.params.zoomBlurStrength, this.composer.pass(this.zoomBlur)), this.params.useTexture === !0 && (this.blendPass.params.mode = s.Screen, this.blendPass.params.tInput = this.params.glowTexture, e.pass(this.blendPass)), this.blendPass.params.mode = this.params.blendMode, this.blendPass.params.tInput2 = this.composer.output, e.pass(this.blendPass) } }, { "../../..": 1, "../../Composer": 2, "../../Pass": 3, "../blend/BlendPass": 5, "../box-blur/FullBoxBlurPass": 8, "../brightness-contrast/BrightnessContrastPass": 9, "../zoom-blur/ZoomBlurPass": 12, three: 36 }],
    7: [function(e, t, i) { "use strict";

        function r(e, t) { o.call(this), this.setShader(a, s), this.params.delta = new n.Vector2(e || 0, t || 0) } var n = e("three"),
            o = e("../../Pass"),
            a = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n}",
            s = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\nuniform vec2 delta;\nuniform vec2 resolution;\n\nvoid main() {\n\n  vec4 sum = vec4( 0. );\n  vec2 inc = delta / resolution;\n\n  sum += texture2D( tInput, ( vUv - inc * 4. ) ) * 0.051;\n  sum += texture2D( tInput, ( vUv - inc * 3. ) ) * 0.0918;\n  sum += texture2D( tInput, ( vUv - inc * 2. ) ) * 0.12245;\n  sum += texture2D( tInput, ( vUv - inc * 1. ) ) * 0.1531;\n  sum += texture2D( tInput, ( vUv + inc * 0. ) ) * 0.1633;\n  sum += texture2D( tInput, ( vUv + inc * 1. ) ) * 0.1531;\n  sum += texture2D( tInput, ( vUv + inc * 2. ) ) * 0.12245;\n  sum += texture2D( tInput, ( vUv + inc * 3. ) ) * 0.0918;\n  sum += texture2D( tInput, ( vUv + inc * 4. ) ) * 0.051;\n\n  gl_FragColor = sum;\n\n}";
        t.exports = r, r.prototype = Object.create(o.prototype), r.prototype.constructor = r, r.prototype.run = function(e) { this.shader.uniforms.delta.value.copy(this.params.delta), e.pass(this.shader) } }, { "../../Pass": 3, three: 36 }],
    8: [function(e, t, i) { "use strict";

        function r(e) { n.call(this), e = e || 2, this.boxPass = new o(e, e), this.params.amount = e } var n = e("../../Pass"),
            o = e("./BoxBlurPass");
        t.exports = r, r.prototype = Object.create(n.prototype), r.prototype.constructor = r, r.prototype.run = function(e) { var t = this.params.amount;
            this.boxPass.params.delta.set(t, 0), e.pass(this.boxPass), this.boxPass.params.delta.set(0, t), e.pass(this.boxPass) } }, { "../../Pass": 3, "./BoxBlurPass": 7 }],
    9: [function(e, t, i) { "use strict";

        function r(e, t) { n.call(this), this.setShader(o, a), this.params.brightness = e || 1, this.params.contrast = t || 1 } var n = e("../../Pass"),
            o = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n}",
            a = "#define GLSLIFY 1\nuniform float brightness;\nuniform float contrast;\nuniform sampler2D tInput;\n\nvarying vec2 vUv;\n\nvoid main() {\n\n  vec3 color = texture2D(tInput, vUv).rgb;\n  vec3 colorContrasted = (color) * contrast;\n  vec3 bright = colorContrasted + vec3(brightness,brightness,brightness);\n  gl_FragColor.rgb = bright;\n  gl_FragColor.a = 1.;\n\n}";
        t.exports = r, r.prototype = Object.create(n.prototype), r.prototype.constructor = r, r.prototype.run = function(e) { this.shader.uniforms.brightness.value = this.params.brightness, this.shader.uniforms.contrast.value = this.params.contrast, e.pass(this.shader) } }, { "../../Pass": 3 }],
    10: [function(e, t, i) { "use strict";

        function r() { n.call(this), this.setShader(o, a) } var n = e("../../Pass"),
            o = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n}",
            a = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\n\nvoid main() {\n  gl_FragColor = texture2D( tInput, vUv );\n\n}";
        t.exports = r, r.prototype = Object.create(n.prototype), r.prototype.constructor = r }, { "../../Pass": 3 }],
    11: [function(e, t, i) { "use strict";

        function r(e) { o.call(this), this.setShader(a, s), this.params.xReverse = !1, this.params.yReverse = !1, this.params.xMirror = !1, this.params.yMirror = !1, this.params.mirrorCenter = new n.Vector2(.5, .5), this.params.angle = 0 } var n = e("three"),
            o = e("../../Pass"),
            a = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n}",
            s = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\nuniform float xReverse;\nuniform float yReverse;\nuniform float xMirror;\nuniform float yMirror;\nuniform float angle;\nuniform vec2 mirrorCenter;\nvec2 nvUv;\n\nvoid main() {\n\n    nvUv = vUv;\n\n    if (xReverse == 1.) {\n\n        nvUv.x = (1.0 - vUv.x );\n\n        if(xMirror == 1.) {\n\n            if(vUv.x < 0.5) {\n                nvUv.x = 1.0 - (nvUv.x) - (0.5 - mirrorCenter.x ) ;\n            }\n            else {\n                nvUv.x = nvUv.x - (0.5 - mirrorCenter.x);\n            }\n        }\n    }\n\n    else if(xMirror == 1.) {\n\n        if(vUv.x < 0.5) {\n            nvUv.x = 1.0 - (nvUv.x) - (0.5 - mirrorCenter.x ) ;\n        }\n        else {\n            nvUv.x = nvUv.x - (0.5 - mirrorCenter.x);\n        }\n    }\n\n    if (yReverse == 1.) {\n\n        nvUv.y = (1.0 - vUv.y );\n\n        if(yMirror == 1.) {\n            if(vUv.y < 0.5) {\n                nvUv.y = 1.0 - (nvUv.y) - (0.5 - mirrorCenter.y ) ;\n            }\n            else {\n                nvUv.y = nvUv.y - (0.5 - mirrorCenter.y);\n            }\n        }\n    }\n\n    else if(yMirror == 1.) {\n\n        if(vUv.y < 0.5) {\n            nvUv.y = 1.0 - (nvUv.y) - (0.5 - mirrorCenter.y ) ;\n        }\n        else {\n            nvUv.y = nvUv.y - (0.5 - mirrorCenter.y);\n        }\n    }\n\n\n    float sin_factor = sin(angle);\n    float cos_factor = cos(angle);\n    vec2 origin = vec2(0.5 ,0.5);\n    \n    vec2 temp = (nvUv - origin);\n\n    temp = temp * mat2(cos_factor, sin_factor, -sin_factor, cos_factor);\n\n    nvUv = (temp + origin);\n\n	gl_FragColor = texture2D( tInput, nvUv );\n	gl_FragColor.rgb = gl_FragColor.rgb;\n}";
        t.exports = r, r.prototype = Object.create(o.prototype), r.prototype.constructor = r, r.prototype.run = function(e) { this.shader.uniforms.xReverse.value = this.params.xReverse, this.shader.uniforms.yReverse.value = this.params.yReverse, this.shader.uniforms.xMirror.value = this.params.xMirror, this.shader.uniforms.yMirror.value = this.params.yMirror, this.shader.uniforms.mirrorCenter.value = this.params.mirrorCenter, this.shader.uniforms.angle.value = this.params.angle, e.pass(this.shader) } }, { "../../Pass": 3, three: 36 }],
    12: [function(e, t, i) { "use strict";

        function r(e) { o.call(this), e = e || {}, this.setShader(a, s), this.params.center = new n.Vector2(e.centerX || .5, e.centerY || .5), this.params.strength = e.strength || .1 } var n = e("three"),
            o = e("../../Pass"),
            a = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n}",
            s = "#define GLSLIFY 1\nuniform sampler2D tInput;\nuniform vec2 center;\nuniform float strength;\nuniform vec2 resolution;\nvarying vec2 vUv;\n\nfloat random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}\n\nvoid main(){\n  vec4 color=vec4(0.0);\n  float total=0.0;\n  vec2 toCenter=center-vUv*resolution;\n  float offset=random(vec3(12.9898,78.233,151.7182),0.0);\n  for(float t=0.0;t<=40.0;t++){\n    float percent=(t+offset)/40.0;\n    float weight=4.0*(percent-percent*percent);\n    vec4 sample=texture2D(tInput,vUv+toCenter*percent*strength/resolution);\n    sample.rgb*=sample.a;\n    color+=sample*weight;\n    total+=weight;\n  }\n  gl_FragColor=color/total;\n  gl_FragColor.rgb/=gl_FragColor.a+0.00001;\n}";
        t.exports = r, r.prototype = Object.create(o.prototype), r.prototype.constructor = r, r.prototype.run = function(e) { this.shader.uniforms.center.value.set(e.width * this.params.center.x, e.height * this.params.center.y), this.shader.uniforms.strength.value = this.params.strength, e.pass(this.shader) } }, { "../../Pass": 3, three: 36 }],
    13: [function(e, t, i) { "use strict"; var r = e("three");
        t.exports = function(e, t) { for (var i, n, o, a, s = /uniform\s+([^\s]+)\s+([^\s]+)\s*;/gi, h = /uniform\s+([^\s]+)\s+([^\s]+)\s*\[\s*(\w+)\s*\]*\s*;/gi, l = { sampler2D: { type: "t", value: function() { return new r.Texture } }, samplerCube: { type: "t", value: function() {} }, bool: { type: "b", value: function() { return 0 } }, "int": { type: "i", value: function() { return 0 } }, "float": { type: "f", value: function() { return 0 } }, vec2: { type: "v2", value: function() { return new r.Vector2 } }, vec3: { type: "v3", value: function() { return new r.Vector3 } }, vec4: { type: "v4", value: function() { return new r.Vector4 } }, bvec2: { type: "v2", value: function() { return new r.Vector2 } }, bvec3: { type: "v3", value: function() { return new r.Vector3 } }, bvec4: { type: "v4", value: function() { return new r.Vector4 } }, ivec2: { type: "v2", value: function() { return new r.Vector2 } }, ivec3: { type: "v3", value: function() { return new r.Vector3 } }, ivec4: { type: "v4", value: function() { return new r.Vector4 } }, mat2: { type: "v2", value: function() { return new r.Matrix2 } }, mat3: { type: "v3", value: function() { return new r.Matrix3 } }, mat4: { type: "v4", value: function() { return new r.Matrix4 } } }, c = { "float": { type: "fv", value: function() { return [] } }, vec3: { type: "v3v", value: function() { return [] } } }, u = { resolution: { type: "v2", value: new r.Vector2(1, 1), "default": !0 }, time: { type: "f", value: Date.now(), "default": !0 }, tInput: { type: "t", value: new r.Texture, "default": !0 } }; null !== (i = s.exec(t));) i.index === s.lastIndex && s.lastIndex++, n = i[1], o = i[2], u[o] = { type: l[n].type, value: l[n].value() }; for (; null !== (i = h.exec(t));) i.index === s.lastIndex && s.lastIndex++, n = i[1], o = i[2], a = i[3], u[o] = { type: c[n].type, value: c[n].value() }; var d = new r.ShaderMaterial({ uniforms: u, vertexShader: e, fragmentShader: t, shading: r.FlatShading, depthWrite: !1, depthTest: !1, transparent: !0 }); return d } }, { three: 36 }],
    14: [function(e, t, i) { t.exports = e("./vendor/dat.gui"), t.exports.color = e("./vendor/dat.color") }, { "./vendor/dat.color": 15, "./vendor/dat.gui": 16 }],
    15: [function(e, t, i) { var r = t.exports = r || {};
        r.color = r.color || {}, r.utils = r.utils || {}, r.utils.common = function() { var e = Array.prototype.forEach,
                t = Array.prototype.slice; return { BREAK: {}, extend: function(e) { return this.each(t.call(arguments, 1), function(t) { for (var i in t) this.isUndefined(t[i]) || (e[i] = t[i]) }, this), e }, defaults: function(e) { return this.each(t.call(arguments, 1), function(t) { for (var i in t) this.isUndefined(e[i]) && (e[i] = t[i]) }, this), e }, compose: function() { var e = t.call(arguments); return function() { for (var i = t.call(arguments), r = e.length - 1; r >= 0; r--) i = [e[r].apply(this, i)]; return i[0] } }, each: function(t, i, r) { if (e && t.forEach === e) t.forEach(i, r);
                    else if (t.length === t.length + 0) { for (var n = 0, o = t.length; o > n; n++)
                            if (n in t && i.call(r, t[n], n) === this.BREAK) return } else
                        for (var n in t)
                            if (i.call(r, t[n], n) === this.BREAK) return }, defer: function(e) { setTimeout(e, 0) }, toArray: function(e) { return e.toArray ? e.toArray() : t.call(e) }, isUndefined: function(e) { return void 0 === e }, isNull: function(e) { return null === e }, isNaN: function(e) { return e !== e }, isArray: Array.isArray || function(e) { return e.constructor === Array }, isObject: function(e) { return e === Object(e) }, isNumber: function(e) { return e === e + 0 }, isString: function(e) { return e === e + "" }, isBoolean: function(e) { return e === !1 || e === !0 }, isFunction: function(e) { return "[object Function]" === Object.prototype.toString.call(e) } } }(), r.color.toString = function(e) { return function(t) { if (1 == t.a || e.isUndefined(t.a)) { for (var i = t.hex.toString(16); i.length < 6;) i = "0" + i; return "#" + i } return "rgba(" + Math.round(t.r) + "," + Math.round(t.g) + "," + Math.round(t.b) + "," + t.a + ")" } }(r.utils.common), r.Color = r.color.Color = function(e, t, i, r) {
            function n(e, t, i) { Object.defineProperty(e, t, { get: function() { return "RGB" === this.__state.space ? this.__state[t] : (a(this, t, i), this.__state[t]) }, set: function(e) { "RGB" !== this.__state.space && (a(this, t, i), this.__state.space = "RGB"), this.__state[t] = e } }) }

            function o(e, t) { Object.defineProperty(e, t, { get: function() { return "HSV" === this.__state.space ? this.__state[t] : (s(this), this.__state[t]) }, set: function(e) { "HSV" !== this.__state.space && (s(this), this.__state.space = "HSV"), this.__state[t] = e } }) }

            function a(e, i, n) { if ("HEX" === e.__state.space) e.__state[i] = t.component_from_hex(e.__state.hex, n);
                else { if ("HSV" !== e.__state.space) throw "Corrupted color state";
                    r.extend(e.__state, t.hsv_to_rgb(e.__state.h, e.__state.s, e.__state.v)) } }

            function s(e) { var i = t.rgb_to_hsv(e.r, e.g, e.b);
                r.extend(e.__state, { s: i.s, v: i.v }), r.isNaN(i.h) ? r.isUndefined(e.__state.h) && (e.__state.h = 0) : e.__state.h = i.h } var h = function() { if (this.__state = e.apply(this, arguments), this.__state === !1) throw "Failed to interpret color arguments";
                this.__state.a = this.__state.a || 1 }; return h.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"], r.extend(h.prototype, { toString: function() { return i(this) }, toOriginal: function() { return this.__state.conversion.write(this) } }), n(h.prototype, "r", 2), n(h.prototype, "g", 1), n(h.prototype, "b", 0), o(h.prototype, "h"), o(h.prototype, "s"), o(h.prototype, "v"), Object.defineProperty(h.prototype, "a", { get: function() { return this.__state.a }, set: function(e) { this.__state.a = e } }), Object.defineProperty(h.prototype, "hex", { get: function() { return "HEX" !== !this.__state.space && (this.__state.hex = t.rgb_to_hex(this.r, this.g, this.b)), this.__state.hex }, set: function(e) { this.__state.space = "HEX", this.__state.hex = e } }), h }(r.color.interpret = function(e, t) { var i, r, n = function() { r = !1; var e = arguments.length > 1 ? t.toArray(arguments) : arguments[0]; return t.each(o, function(n) { return n.litmus(e) ? (t.each(n.conversions, function(n, o) { return i = n.read(e), r === !1 && i !== !1 ? (r = i, i.conversionName = o, i.conversion = n, t.BREAK) : void 0 }), t.BREAK) : void 0 }), r },
                o = [{ litmus: t.isString, conversions: { THREE_CHAR_HEX: { read: function(e) { var t = e.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i); return null === t ? !1 : { space: "HEX", hex: parseInt("0x" + t[1].toString() + t[1].toString() + t[2].toString() + t[2].toString() + t[3].toString() + t[3].toString()) } }, write: e }, SIX_CHAR_HEX: { read: function(e) { var t = e.match(/^#([A-F0-9]{6})$/i); return null === t ? !1 : { space: "HEX", hex: parseInt("0x" + t[1].toString()) } }, write: e }, CSS_RGB: { read: function(e) { var t = e.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/); return null === t ? !1 : { space: "RGB", r: parseFloat(t[1]), g: parseFloat(t[2]), b: parseFloat(t[3]) } }, write: e }, CSS_RGBA: { read: function(e) { var t = e.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/); return null === t ? !1 : { space: "RGB", r: parseFloat(t[1]), g: parseFloat(t[2]), b: parseFloat(t[3]), a: parseFloat(t[4]) } }, write: e } } }, { litmus: t.isNumber, conversions: { HEX: { read: function(e) { return { space: "HEX", hex: e, conversionName: "HEX" } }, write: function(e) { return e.hex } } } }, { litmus: t.isArray, conversions: { RGB_ARRAY: { read: function(e) { return 3 != e.length ? !1 : { space: "RGB", r: e[0], g: e[1], b: e[2] } }, write: function(e) { return [e.r, e.g, e.b] } }, RGBA_ARRAY: { read: function(e) { return 4 != e.length ? !1 : { space: "RGB", r: e[0], g: e[1], b: e[2], a: e[3] } }, write: function(e) { return [e.r, e.g, e.b, e.a] } } } }, { litmus: t.isObject, conversions: { RGBA_OBJ: { read: function(e) { return t.isNumber(e.r) && t.isNumber(e.g) && t.isNumber(e.b) && t.isNumber(e.a) ? { space: "RGB", r: e.r, g: e.g, b: e.b, a: e.a } : !1 }, write: function(e) { return { r: e.r, g: e.g, b: e.b, a: e.a } } }, RGB_OBJ: { read: function(e) { return t.isNumber(e.r) && t.isNumber(e.g) && t.isNumber(e.b) ? { space: "RGB", r: e.r, g: e.g, b: e.b } : !1 }, write: function(e) { return { r: e.r, g: e.g, b: e.b } } }, HSVA_OBJ: { read: function(e) { return t.isNumber(e.h) && t.isNumber(e.s) && t.isNumber(e.v) && t.isNumber(e.a) ? { space: "HSV", h: e.h, s: e.s, v: e.v, a: e.a } : !1 }, write: function(e) { return { h: e.h, s: e.s, v: e.v, a: e.a } } }, HSV_OBJ: { read: function(e) { return t.isNumber(e.h) && t.isNumber(e.s) && t.isNumber(e.v) ? { space: "HSV", h: e.h, s: e.s, v: e.v } : !1 }, write: function(e) { return { h: e.h, s: e.s, v: e.v } } } } }]; return n }(r.color.toString, r.utils.common), r.color.math = function() { var e; return { hsv_to_rgb: function(e, t, i) { var r = Math.floor(e / 60) % 6,
                        n = e / 60 - Math.floor(e / 60),
                        o = i * (1 - t),
                        a = i * (1 - n * t),
                        s = i * (1 - (1 - n) * t),
                        h = [
                            [i, s, o],
                            [a, i, o],
                            [o, i, s],
                            [o, a, i],
                            [s, o, i],
                            [i, o, a]
                        ][r]; return { r: 255 * h[0], g: 255 * h[1], b: 255 * h[2] } }, rgb_to_hsv: function(e, t, i) { var r, n, o = Math.min(e, t, i),
                        a = Math.max(e, t, i),
                        s = a - o; return 0 == a ? { h: NaN, s: 0, v: 0 } : (n = s / a, r = e == a ? (t - i) / s : t == a ? 2 + (i - e) / s : 4 + (e - t) / s, r /= 6, 0 > r && (r += 1), { h: 360 * r, s: n, v: a / 255 }) }, rgb_to_hex: function(e, t, i) { var r = this.hex_with_component(0, 2, e); return r = this.hex_with_component(r, 1, t), r = this.hex_with_component(r, 0, i) }, component_from_hex: function(e, t) { return e >> 8 * t & 255 }, hex_with_component: function(t, i, r) { return r << (e = 8 * i) | t & ~(255 << e) } } }(), r.color.toString, r.utils.common) }, {}],
    16: [function(e, t, i) {
        var r = t.exports = r || {};
        r.gui = r.gui || {}, r.utils = r.utils || {}, r.controllers = r.controllers || {}, r.dom = r.dom || {}, r.color = r.color || {}, r.utils.css = function() { return { load: function(e, t) { t = t || document; var i = t.createElement("link");
                        i.type = "text/css", i.rel = "stylesheet", i.href = e, t.getElementsByTagName("head")[0].appendChild(i) }, inject: function(e, t) { t = t || document; var i = document.createElement("style");
                        i.type = "text/css", i.innerHTML = e, t.getElementsByTagName("head")[0].appendChild(i) } } }(), r.utils.common = function() { var e = Array.prototype.forEach,
                    t = Array.prototype.slice; return { BREAK: {}, extend: function(e) { return this.each(t.call(arguments, 1), function(t) { for (var i in t) this.isUndefined(t[i]) || (e[i] = t[i]) }, this), e }, defaults: function(e) { return this.each(t.call(arguments, 1), function(t) { for (var i in t) this.isUndefined(e[i]) && (e[i] = t[i]) }, this), e }, compose: function() { var e = t.call(arguments); return function() { for (var i = t.call(arguments), r = e.length - 1; r >= 0; r--) i = [e[r].apply(this, i)]; return i[0] } }, each: function(t, i, r) { if (e && t.forEach === e) t.forEach(i, r);
                        else if (t.length === t.length + 0) { for (var n = 0, o = t.length; o > n; n++)
                                if (n in t && i.call(r, t[n], n) === this.BREAK) return } else
                            for (var n in t)
                                if (i.call(r, t[n], n) === this.BREAK) return }, defer: function(e) { setTimeout(e, 0) }, toArray: function(e) { return e.toArray ? e.toArray() : t.call(e) }, isUndefined: function(e) { return void 0 === e }, isNull: function(e) { return null === e }, isNaN: function(e) { return e !== e }, isArray: Array.isArray || function(e) { return e.constructor === Array }, isObject: function(e) { return e === Object(e) }, isNumber: function(e) { return e === e + 0 }, isString: function(e) { return e === e + "" }, isBoolean: function(e) { return e === !1 || e === !0 }, isFunction: function(e) { return "[object Function]" === Object.prototype.toString.call(e) } } }(), r.controllers.Controller = function(e) { var t = function(e, t) { this.initialValue = e[t], this.domElement = document.createElement("div"), this.object = e, this.property = t, this.__onChange = void 0, this.__onFinishChange = void 0 }; return e.extend(t.prototype, { onChange: function(e) { return this.__onChange = e, this }, onFinishChange: function(e) { return this.__onFinishChange = e, this }, setValue: function(e) { return this.object[this.property] = e, this.__onChange && this.__onChange.call(this, e), this.updateDisplay(), this }, getValue: function() { return this.object[this.property] }, updateDisplay: function() { return this }, isModified: function() { return this.initialValue !== this.getValue() } }), t }(r.utils.common),
            r.dom.dom = function(e) {
                function t(t) { if ("0" === t || e.isUndefined(t)) return 0; var i = t.match(n); return e.isNull(i) ? 0 : parseFloat(i[1]) } var i = { HTMLEvents: ["change"], MouseEvents: ["click", "mousemove", "mousedown", "mouseup", "mouseover"], KeyboardEvents: ["keydown"] },
                    r = {};
                e.each(i, function(t, i) { e.each(t, function(e) { r[e] = i }) }); var n = /(\d+(\.\d+)?)px/,
                    o = { makeSelectable: function(e, t) { void 0 !== e && void 0 !== e.style && (e.onselectstart = t ? function() { return !1 } : function() {}, e.style.MozUserSelect = t ? "auto" : "none", e.style.KhtmlUserSelect = t ? "auto" : "none", e.unselectable = t ? "on" : "off") }, makeFullscreen: function(t, i, r) { e.isUndefined(i) && (i = !0), e.isUndefined(r) && (r = !0), t.style.position = "absolute", i && (t.style.left = 0, t.style.right = 0), r && (t.style.top = 0, t.style.bottom = 0) }, fakeEvent: function(t, i, n, o) { n = n || {}; var a = r[i]; if (!a) throw new Error("Event type " + i + " not supported."); var s = document.createEvent(a); switch (a) {
                                case "MouseEvents":
                                    var h = n.x || n.clientX || 0,
                                        l = n.y || n.clientY || 0;
                                    s.initMouseEvent(i, n.bubbles || !1, n.cancelable || !0, window, n.clickCount || 1, 0, 0, h, l, !1, !1, !1, !1, 0, null); break;
                                case "KeyboardEvents":
                                    var c = s.initKeyboardEvent || s.initKeyEvent;
                                    e.defaults(n, { cancelable: !0, ctrlKey: !1, altKey: !1, shiftKey: !1, metaKey: !1, keyCode: void 0, charCode: void 0 }), c(i, n.bubbles || !1, n.cancelable, window, n.ctrlKey, n.altKey, n.shiftKey, n.metaKey, n.keyCode, n.charCode); break;
                                default:
                                    s.initEvent(i, n.bubbles || !1, n.cancelable || !0) } e.defaults(s, o), t.dispatchEvent(s) }, bind: function(e, t, i, r) { return r = r || !1, e.addEventListener ? e.addEventListener(t, i, r) : e.attachEvent && e.attachEvent("on" + t, i), o }, unbind: function(e, t, i, r) { return r = r || !1, e.removeEventListener ? e.removeEventListener(t, i, r) : e.detachEvent && e.detachEvent("on" + t, i), o }, addClass: function(e, t) { if (void 0 === e.className) e.className = t;
                            else if (e.className !== t) { var i = e.className.split(/ +/); - 1 == i.indexOf(t) && (i.push(t), e.className = i.join(" ").replace(/^\s+/, "").replace(/\s+$/, "")) } return o }, removeClass: function(e, t) { if (t)
                                if (void 0 === e.className);
                                else if (e.className === t) e.removeAttribute("class");
                            else { var i = e.className.split(/ +/),
                                    r = i.indexOf(t); - 1 != r && (i.splice(r, 1), e.className = i.join(" ")) } else e.className = void 0; return o }, hasClass: function(e, t) { return new RegExp("(?:^|\\s+)" + t + "(?:\\s+|$)").test(e.className) || !1 }, getWidth: function(e) { var i = getComputedStyle(e); return t(i["border-left-width"]) + t(i["border-right-width"]) + t(i["padding-left"]) + t(i["padding-right"]) + t(i.width) }, getHeight: function(e) { var i = getComputedStyle(e); return t(i["border-top-width"]) + t(i["border-bottom-width"]) + t(i["padding-top"]) + t(i["padding-bottom"]) + t(i.height) }, getOffset: function(e) { var t = { left: 0, top: 0 }; if (e.offsetParent)
                                do t.left += e.offsetLeft, t.top += e.offsetTop; while (e = e.offsetParent); return t }, isActive: function(e) { return e === document.activeElement && (e.type || e.href) } }; return o }(r.utils.common), r.controllers.OptionController = function(e, t, i) { var r = function(e, n, o) { r.superclass.call(this, e, n); var a = this; if (this.__select = document.createElement("select"), i.isArray(o)) { var s = {};
                        i.each(o, function(e) { s[e] = e }), o = s } i.each(o, function(e, t) { var i = document.createElement("option");
                        i.innerHTML = t, i.setAttribute("value", e), a.__select.appendChild(i) }), this.updateDisplay(), t.bind(this.__select, "change", function() { var e = this.options[this.selectedIndex].value;
                        a.setValue(e) }), this.domElement.appendChild(this.__select) }; return r.superclass = e, i.extend(r.prototype, e.prototype, { setValue: function(e) { var t = r.superclass.prototype.setValue.call(this, e); return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), t }, updateDisplay: function() { return this.__select.value = this.getValue(), r.superclass.prototype.updateDisplay.call(this) } }), r }(r.controllers.Controller, r.dom.dom, r.utils.common), r.controllers.NumberController = function(e, t) {
                function i(e) { return e = e.toString(), e.indexOf(".") > -1 ? e.length - e.indexOf(".") - 1 : 0 } var r = function(e, n, o) { r.superclass.call(this, e, n), o = o || {}, this.__min = o.min, this.__max = o.max, this.__step = o.step, t.isUndefined(this.__step) ? 0 == this.initialValue ? this.__impliedStep = 1 : this.__impliedStep = Math.pow(10, Math.floor(Math.log(this.initialValue) / Math.LN10)) / 10 : this.__impliedStep = this.__step, this.__precision = i(this.__impliedStep) }; return r.superclass = e, t.extend(r.prototype, e.prototype, { setValue: function(e) { return void 0 !== this.__min && e < this.__min ? e = this.__min : void 0 !== this.__max && e > this.__max && (e = this.__max), void 0 !== this.__step && e % this.__step != 0 && (e = Math.round(e / this.__step) * this.__step), r.superclass.prototype.setValue.call(this, e) }, min: function(e) { return this.__min = e, this }, max: function(e) { return this.__max = e, this }, step: function(e) { return this.__step = e, this } }), r }(r.controllers.Controller, r.utils.common), r.controllers.NumberControllerBox = function(e, t, i) {
                function r(e, t) { var i = Math.pow(10, t); return Math.round(e * i) / i } var n = function(e, r, o) {
                    function a() { var e = parseFloat(d.__input.value);
                        i.isNaN(e) || d.setValue(e) }

                    function s() { a(), d.__onFinishChange && d.__onFinishChange.call(d, d.getValue()) }

                    function h(e) { t.bind(window, "mousemove", l), t.bind(window, "mouseup", c), u = e.clientY }

                    function l(e) { var t = u - e.clientY;
                        d.setValue(d.getValue() + t * d.__impliedStep), u = e.clientY }

                    function c() { t.unbind(window, "mousemove", l), t.unbind(window, "mouseup", c) } this.__truncationSuspended = !1, n.superclass.call(this, e, r, o); var u, d = this;
                    this.__input = document.createElement("input"), this.__input.setAttribute("type", "text"), t.bind(this.__input, "change", a), t.bind(this.__input, "blur", s), t.bind(this.__input, "mousedown", h), t.bind(this.__input, "keydown", function(e) { 13 === e.keyCode && (d.__truncationSuspended = !0, this.blur(), d.__truncationSuspended = !1) }), this.updateDisplay(), this.domElement.appendChild(this.__input) }; return n.superclass = e, i.extend(n.prototype, e.prototype, { updateDisplay: function() { return this.__input.value = this.__truncationSuspended ? this.getValue() : r(this.getValue(), this.__precision), n.superclass.prototype.updateDisplay.call(this) } }), n }(r.controllers.NumberController, r.dom.dom, r.utils.common), r.controllers.NumberControllerSlider = function(e, t, i, r, n) {
                function o(e, t, i, r, n) { return r + (n - r) * ((e - t) / (i - t)) } var a = function(e, i, r, n, s) {
                    function h(e) { t.bind(window, "mousemove", l), t.bind(window, "mouseup", c), l(e) }

                    function l(e) { e.preventDefault(); var i = t.getOffset(u.__background),
                            r = t.getWidth(u.__background); return u.setValue(o(e.clientX, i.left, i.left + r, u.__min, u.__max)), !1 }

                    function c() { t.unbind(window, "mousemove", l), t.unbind(window, "mouseup", c), u.__onFinishChange && u.__onFinishChange.call(u, u.getValue()) } a.superclass.call(this, e, i, { min: r, max: n, step: s }); var u = this;
                    this.__background = document.createElement("div"), this.__foreground = document.createElement("div"), t.bind(this.__background, "mousedown", h), t.addClass(this.__background, "slider"), t.addClass(this.__foreground, "slider-fg"), this.updateDisplay(), this.__background.appendChild(this.__foreground), this.domElement.appendChild(this.__background) }; return a.superclass = e, a.useDefaultStyles = function() { i.inject(n) }, r.extend(a.prototype, e.prototype, { updateDisplay: function() { var e = (this.getValue() - this.__min) / (this.__max - this.__min); return this.__foreground.style.width = 100 * e + "%", a.superclass.prototype.updateDisplay.call(this) } }), a }(r.controllers.NumberController, r.dom.dom, r.utils.css, r.utils.common, ".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}"), r.controllers.FunctionController = function(e, t, i) { var r = function(e, i, n) { r.superclass.call(this, e, i); var o = this;
                    this.__button = document.createElement("div"), this.__button.innerHTML = void 0 === n ? "Fire" : n, t.bind(this.__button, "click", function(e) { return e.preventDefault(), o.fire(), !1 }), t.addClass(this.__button, "button"), this.domElement.appendChild(this.__button) }; return r.superclass = e, i.extend(r.prototype, e.prototype, { fire: function() { this.__onChange && this.__onChange.call(this), this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.getValue().call(this.object) } }), r }(r.controllers.Controller, r.dom.dom, r.utils.common), r.controllers.BooleanController = function(e, t, i) { var r = function(e, i) {
                    function n() { o.setValue(!o.__prev) } r.superclass.call(this, e, i); var o = this;
                    this.__prev = this.getValue(), this.__checkbox = document.createElement("input"), this.__checkbox.setAttribute("type", "checkbox"), t.bind(this.__checkbox, "change", n, !1), this.domElement.appendChild(this.__checkbox), this.updateDisplay() }; return r.superclass = e, i.extend(r.prototype, e.prototype, { setValue: function(e) { var t = r.superclass.prototype.setValue.call(this, e); return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.__prev = this.getValue(), t }, updateDisplay: function() { return this.getValue() === !0 ? (this.__checkbox.setAttribute("checked", "checked"), this.__checkbox.checked = !0) : this.__checkbox.checked = !1, r.superclass.prototype.updateDisplay.call(this) } }), r }(r.controllers.Controller, r.dom.dom, r.utils.common), r.color.toString = function(e) { return function(t) { if (1 == t.a || e.isUndefined(t.a)) { for (var i = t.hex.toString(16); i.length < 6;) i = "0" + i; return "#" + i } return "rgba(" + Math.round(t.r) + "," + Math.round(t.g) + "," + Math.round(t.b) + "," + t.a + ")" } }(r.utils.common), r.color.interpret = function(e, t) { var i, r, n = function() { r = !1; var e = arguments.length > 1 ? t.toArray(arguments) : arguments[0]; return t.each(o, function(n) { return n.litmus(e) ? (t.each(n.conversions, function(n, o) { return i = n.read(e), r === !1 && i !== !1 ? (r = i, i.conversionName = o, i.conversion = n, t.BREAK) : void 0 }), t.BREAK) : void 0 }), r },
                    o = [{ litmus: t.isString, conversions: { THREE_CHAR_HEX: { read: function(e) { var t = e.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i); return null === t ? !1 : { space: "HEX", hex: parseInt("0x" + t[1].toString() + t[1].toString() + t[2].toString() + t[2].toString() + t[3].toString() + t[3].toString()) } }, write: e }, SIX_CHAR_HEX: { read: function(e) { var t = e.match(/^#([A-F0-9]{6})$/i); return null === t ? !1 : { space: "HEX", hex: parseInt("0x" + t[1].toString()) } }, write: e }, CSS_RGB: { read: function(e) { var t = e.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/); return null === t ? !1 : { space: "RGB", r: parseFloat(t[1]), g: parseFloat(t[2]), b: parseFloat(t[3]) } }, write: e }, CSS_RGBA: { read: function(e) { var t = e.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/); return null === t ? !1 : { space: "RGB", r: parseFloat(t[1]), g: parseFloat(t[2]), b: parseFloat(t[3]), a: parseFloat(t[4]) } }, write: e } } }, { litmus: t.isNumber, conversions: { HEX: { read: function(e) { return { space: "HEX", hex: e, conversionName: "HEX" } }, write: function(e) { return e.hex } } } }, { litmus: t.isArray, conversions: { RGB_ARRAY: { read: function(e) { return 3 != e.length ? !1 : { space: "RGB", r: e[0], g: e[1], b: e[2] } }, write: function(e) { return [e.r, e.g, e.b] } }, RGBA_ARRAY: { read: function(e) { return 4 != e.length ? !1 : { space: "RGB", r: e[0], g: e[1], b: e[2], a: e[3] } }, write: function(e) { return [e.r, e.g, e.b, e.a] } } } }, { litmus: t.isObject, conversions: { RGBA_OBJ: { read: function(e) { return t.isNumber(e.r) && t.isNumber(e.g) && t.isNumber(e.b) && t.isNumber(e.a) ? { space: "RGB", r: e.r, g: e.g, b: e.b, a: e.a } : !1 }, write: function(e) { return { r: e.r, g: e.g, b: e.b, a: e.a } } }, RGB_OBJ: { read: function(e) { return t.isNumber(e.r) && t.isNumber(e.g) && t.isNumber(e.b) ? { space: "RGB", r: e.r, g: e.g, b: e.b } : !1 }, write: function(e) { return { r: e.r, g: e.g, b: e.b } } }, HSVA_OBJ: { read: function(e) { return t.isNumber(e.h) && t.isNumber(e.s) && t.isNumber(e.v) && t.isNumber(e.a) ? { space: "HSV", h: e.h, s: e.s, v: e.v, a: e.a } : !1 }, write: function(e) { return { h: e.h, s: e.s, v: e.v, a: e.a } } }, HSV_OBJ: { read: function(e) { return t.isNumber(e.h) && t.isNumber(e.s) && t.isNumber(e.v) ? { space: "HSV", h: e.h, s: e.s, v: e.v } : !1 }, write: function(e) { return { h: e.h, s: e.s, v: e.v } } } } }]; return n }(r.color.toString, r.utils.common), r.GUI = r.gui.GUI = function(e, t, i, r, n, o, a, s, h, l, c, u, d, p, f) {
                function m(e, t, i, o) { if (void 0 === t[i]) throw new Error("Object " + t + ' has no property "' + i + '"'); var a; if (o.color) a = new c(t, i);
                    else { var s = [t, i].concat(o.factoryArgs);
                        a = r.apply(e, s) } o.before instanceof n && (o.before = o.before.__li), y(e, a), p.addClass(a.domElement, "c"); var h = document.createElement("span");
                    p.addClass(h, "property-name"), h.innerHTML = a.property; var l = document.createElement("div");
                    l.appendChild(h), l.appendChild(a.domElement); var u = g(e, l, o.before); return p.addClass(u, z.CLASS_CONTROLLER_ROW), p.addClass(u, typeof a.getValue()), v(e, u, a), e.__controllers.push(a), a }

                function g(e, t, i) { var r = document.createElement("li"); return t && r.appendChild(t), i ? e.__ul.insertBefore(r, params.before) : e.__ul.appendChild(r), e.onResize(), r }

                function v(e, t, i) { if (i.__li = t, i.__gui = e, f.extend(i, { options: function(t) { return arguments.length > 1 ? (i.remove(), m(e, i.object, i.property, { before: i.__li.nextElementSibling, factoryArgs: [f.toArray(arguments)] })) : f.isArray(t) || f.isObject(t) ? (i.remove(), m(e, i.object, i.property, { before: i.__li.nextElementSibling, factoryArgs: [t] })) : void 0 }, name: function(e) { return i.__li.firstElementChild.firstElementChild.innerHTML = e, i }, listen: function() { return i.__gui.listen(i), i }, remove: function() { return i.__gui.remove(i), i } }), i instanceof h) { var r = new s(i.object, i.property, { min: i.__min, max: i.__max, step: i.__step });
                        f.each(["updateDisplay", "onChange", "onFinishChange"], function(e) { var t = i[e],
                                n = r[e];
                            i[e] = r[e] = function() { var e = Array.prototype.slice.call(arguments); return t.apply(i, e), n.apply(r, e) } }), p.addClass(t, "has-slider"), i.domElement.insertBefore(r.domElement, i.domElement.firstElementChild) } else if (i instanceof s) { var n = function(t) { return f.isNumber(i.__min) && f.isNumber(i.__max) ? (i.remove(), m(e, i.object, i.property, { before: i.__li.nextElementSibling, factoryArgs: [i.__min, i.__max, i.__step] })) : t };
                        i.min = f.compose(n, i.min), i.max = f.compose(n, i.max) } else i instanceof o ? (p.bind(t, "click", function() { p.fakeEvent(i.__checkbox, "click") }), p.bind(i.__checkbox, "click", function(e) { e.stopPropagation() })) : i instanceof a ? (p.bind(t, "click", function() { p.fakeEvent(i.__button, "click") }), p.bind(t, "mouseover", function() { p.addClass(i.__button, "hover") }), p.bind(t, "mouseout", function() { p.removeClass(i.__button, "hover") })) : i instanceof c && (p.addClass(t, "color"), i.updateDisplay = f.compose(function(e) { return t.style.borderLeftColor = i.__color.toString(), e }, i.updateDisplay), i.updateDisplay());
                    i.setValue = f.compose(function(t) { return e.getRoot().__preset_select && i.isModified() && C(e.getRoot(), !0), t }, i.setValue) }

                function y(e, t) { var i = e.getRoot(),
                        r = i.__rememberedObjects.indexOf(t.object); if (-1 != r) { var n = i.__rememberedObjectIndecesToControllers[r]; if (void 0 === n && (n = {}, i.__rememberedObjectIndecesToControllers[r] = n), n[t.property] = t, i.load && i.load.remembered) { var o, a = i.load.remembered; if (a[e.preset]) o = a[e.preset];
                            else { if (!a[k]) return;
                                o = a[k] } if (o[r] && void 0 !== o[r][t.property]) { var s = o[r][t.property];
                                t.initialValue = s, t.setValue(s) } } } }

                function _(e, t) { return document.location.href + "." + t }

                function x(e) {
                    function t() { l.style.display = e.useLocalStorage ? "block" : "none" } var i = e.__save_row = document.createElement("li");
                    p.addClass(e.domElement, "has-save"), e.__ul.insertBefore(i, e.__ul.firstChild), p.addClass(i, "save-row"); var r = document.createElement("span");
                    r.innerHTML = "&nbsp;", p.addClass(r, "button gears"); var n = document.createElement("span");
                    n.innerHTML = "Save", p.addClass(n, "button"), p.addClass(n, "save"); var o = document.createElement("span");
                    o.innerHTML = "New", p.addClass(o, "button"), p.addClass(o, "save-as"); var a = document.createElement("span");
                    a.innerHTML = "Revert", p.addClass(a, "button"), p.addClass(a, "revert"); var s = e.__preset_select = document.createElement("select"); if (e.load && e.load.remembered ? f.each(e.load.remembered, function(t, i) { M(e, i, i == e.preset) }) : M(e, k, !1), p.bind(s, "change", function() { for (var t = 0; t < e.__preset_select.length; t++) e.__preset_select[t].innerHTML = e.__preset_select[t].value;
                            e.preset = this.value }), i.appendChild(s), i.appendChild(r), i.appendChild(n), i.appendChild(o), i.appendChild(a), O) { var h = document.getElementById("dg-save-locally"),
                            l = document.getElementById("dg-local-explain");
                        h.style.display = "block"; var c = document.getElementById("dg-local-storage"); "true" === localStorage.getItem(_(e, "isLocal")) && c.setAttribute("checked", "checked"), t(), p.bind(c, "change", function() { e.useLocalStorage = !e.useLocalStorage, t() }) } var u = document.getElementById("dg-new-constructor");
                    p.bind(u, "keydown", function(e) {!e.metaKey || 67 !== e.which && 67 != e.keyCode || E.hide() }), p.bind(r, "click", function() { u.innerHTML = JSON.stringify(e.getSaveObject(), void 0, 2), E.show(), u.focus(), u.select() }), p.bind(n, "click", function() { e.save() }), p.bind(o, "click", function() { var t = prompt("Enter a new preset name.");
                        t && e.saveAs(t) }), p.bind(a, "click", function() { e.revert() }) }

                function b(e) {
                    function t(t) { return t.preventDefault(), n = t.clientX, p.addClass(e.__closeButton, z.CLASS_DRAG), p.bind(window, "mousemove", i), p.bind(window, "mouseup", r), !1 }

                    function i(t) { return t.preventDefault(), e.width += n - t.clientX, e.onResize(), n = t.clientX, !1 }

                    function r() { p.removeClass(e.__closeButton, z.CLASS_DRAG), p.unbind(window, "mousemove", i), p.unbind(window, "mouseup", r) } e.__resize_handle = document.createElement("div"), f.extend(e.__resize_handle.style, { width: "6px", marginLeft: "-3px", height: "200px", cursor: "ew-resize", position: "absolute" }); var n;
                    p.bind(e.__resize_handle, "mousedown", t), p.bind(e.__closeButton, "mousedown", t), e.domElement.insertBefore(e.__resize_handle, e.domElement.firstElementChild) }

                function w(e, t) { e.domElement.style.width = t + "px", e.__save_row && e.autoPlace && (e.__save_row.style.width = t + "px"), e.__closeButton && (e.__closeButton.style.width = t + "px") }

                function T(e, t) { var i = {}; return f.each(e.__rememberedObjects, function(r, n) { var o = {},
                            a = e.__rememberedObjectIndecesToControllers[n];
                        f.each(a, function(e, i) { o[i] = t ? e.initialValue : e.getValue() }), i[n] = o }), i }

                function M(e, t, i) { var r = document.createElement("option");
                    r.innerHTML = t, r.value = t, e.__preset_select.appendChild(r), i && (e.__preset_select.selectedIndex = e.__preset_select.length - 1) }

                function S(e) { for (var t = 0; t < e.__preset_select.length; t++) e.__preset_select[t].value == e.preset && (e.__preset_select.selectedIndex = t) }

                function C(e, t) { var i = e.__preset_select[e.__preset_select.selectedIndex];
                    t ? i.innerHTML = i.value + "*" : i.innerHTML = i.value }

                function A(e) { 0 != e.length && u(function() { A(e) }), f.each(e, function(e) { e.updateDisplay() }) } e.inject(i); var E, P, L = "dg",
                    R = 72,
                    F = 20,
                    k = "Default",
                    O = function() { try { return "localStorage" in window && null !== window.localStorage } catch (e) { return !1 } }(),
                    D = !0,
                    B = !1,
                    U = [],
                    z = function(e) {
                        function t() { localStorage.setItem(_(r, "gui"), JSON.stringify(r.getSaveObject())) }

                        function i() { var e = r.getRoot();
                            e.width += 1, f.defer(function() { e.width -= 1 }) } var r = this;
                        this.domElement = document.createElement("div"), this.__ul = document.createElement("ul"), this.domElement.appendChild(this.__ul), p.addClass(this.domElement, L), this.__folders = {}, this.__controllers = [], this.__rememberedObjects = [], this.__rememberedObjectIndecesToControllers = [], this.__listening = [], e = e || {}, e = f.defaults(e, { autoPlace: !0, width: z.DEFAULT_WIDTH }), e = f.defaults(e, { resizable: e.autoPlace, hideable: e.autoPlace }), f.isUndefined(e.load) ? e.load = { preset: k } : e.preset && (e.load.preset = e.preset), f.isUndefined(e.parent) && e.hideable && U.push(this), e.resizable = f.isUndefined(e.parent) && e.resizable, e.autoPlace && f.isUndefined(e.scrollable) && (e.scrollable = !0); var n = O && "true" === localStorage.getItem(_(this, "isLocal")); if (Object.defineProperties(this, { parent: { get: function() { return e.parent } }, scrollable: { get: function() { return e.scrollable } }, autoPlace: { get: function() { return e.autoPlace } }, preset: { get: function() { return r.parent ? r.getRoot().preset : e.load.preset }, set: function(t) { r.parent ? r.getRoot().preset = t : e.load.preset = t, S(this), r.revert() } }, width: { get: function() { return e.width }, set: function(t) { e.width = t, w(r, t) } }, name: { get: function() { return e.name }, set: function(t) { e.name = t, a && (a.innerHTML = e.name) } }, closed: { get: function() { return e.closed }, set: function(t) { e.closed = t, e.closed ? p.addClass(r.__ul, z.CLASS_CLOSED) : p.removeClass(r.__ul, z.CLASS_CLOSED), this.onResize(), r.__closeButton && (r.__closeButton.innerHTML = t ? z.TEXT_OPEN : z.TEXT_CLOSED) } }, load: { get: function() { return e.load } }, useLocalStorage: { get: function() { return n }, set: function(e) { O && (n = e, e ? p.bind(window, "unload", t) : p.unbind(window, "unload", t), localStorage.setItem(_(r, "isLocal"), e)) } } }), f.isUndefined(e.parent)) { if (e.closed = !1, p.addClass(this.domElement, z.CLASS_MAIN), p.makeSelectable(this.domElement, !1), O && n) { r.useLocalStorage = !0; var o = localStorage.getItem(_(this, "gui"));
                                o && (e.load = JSON.parse(o)) } this.__closeButton = document.createElement("div"), this.__closeButton.innerHTML = z.TEXT_CLOSED, p.addClass(this.__closeButton, z.CLASS_CLOSE_BUTTON), this.domElement.appendChild(this.__closeButton), p.bind(this.__closeButton, "click", function() { r.closed = !r.closed }) } else { void 0 === e.closed && (e.closed = !0); var a = document.createTextNode(e.name);
                            p.addClass(a, "controller-name"); var s = g(r, a),
                                h = function(e) { return e.preventDefault(), r.closed = !r.closed, !1 };
                            p.addClass(this.__ul, z.CLASS_CLOSED), p.addClass(s, "title"), p.bind(s, "click", h), e.closed || (this.closed = !1) } e.autoPlace && (f.isUndefined(e.parent) && (D && (P = document.createElement("div"), p.addClass(P, L), p.addClass(P, z.CLASS_AUTO_PLACE_CONTAINER), document.body.appendChild(P), D = !1), P.appendChild(this.domElement), p.addClass(this.domElement, z.CLASS_AUTO_PLACE)), this.parent || w(r, e.width)), p.bind(window, "resize", function() { r.onResize() }), p.bind(this.__ul, "webkitTransitionEnd", function() { r.onResize() }), p.bind(this.__ul, "transitionend", function() { r.onResize() }), p.bind(this.__ul, "oTransitionEnd", function() { r.onResize() }), this.onResize(), e.resizable && b(this);
                        r.getRoot();
                        e.parent || i() }; return z.toggleHide = function() { B = !B, f.each(U, function(e) { e.domElement.style.zIndex = B ? -999 : 999, e.domElement.style.opacity = B ? 0 : 1 }) }, z.CLASS_AUTO_PLACE = "a", z.CLASS_AUTO_PLACE_CONTAINER = "ac", z.CLASS_MAIN = "main", z.CLASS_CONTROLLER_ROW = "cr", z.CLASS_TOO_TALL = "taller-than-window", z.CLASS_CLOSED = "closed", z.CLASS_CLOSE_BUTTON = "close-button", z.CLASS_DRAG = "drag", z.DEFAULT_WIDTH = 245, z.TEXT_CLOSED = "Close Controls", z.TEXT_OPEN = "Open Controls", p.bind(window, "keydown", function(e) { "text" === document.activeElement.type || e.which !== R && e.keyCode != R || z.toggleHide() }, !1), f.extend(z.prototype, { add: function(e, t) { return m(this, e, t, { factoryArgs: Array.prototype.slice.call(arguments, 2) }) }, addColor: function(e, t) { return m(this, e, t, { color: !0 }) }, remove: function(e) { this.__ul.removeChild(e.__li), this.__controllers.slice(this.__controllers.indexOf(e), 1); var t = this;
                        f.defer(function() { t.onResize() }) }, destroy: function() { this.autoPlace && P.removeChild(this.domElement) }, addFolder: function(e) { if (void 0 !== this.__folders[e]) throw new Error('You already have a folder in this GUI by the name "' + e + '"'); var t = { name: e, parent: this };
                        t.autoPlace = this.autoPlace, this.load && this.load.folders && this.load.folders[e] && (t.closed = this.load.folders[e].closed, t.load = this.load.folders[e]); var i = new z(t);
                        this.__folders[e] = i; var r = g(this, i.domElement); return p.addClass(r, "folder"), i }, open: function() { this.closed = !1 }, close: function() { this.closed = !0 }, onResize: function() { var e = this.getRoot(); if (e.scrollable) { var t = p.getOffset(e.__ul).top,
                                i = 0;
                            f.each(e.__ul.childNodes, function(t) { e.autoPlace && t === e.__save_row || (i += p.getHeight(t)) }), window.innerHeight - t - F < i ? (p.addClass(e.domElement, z.CLASS_TOO_TALL), e.__ul.style.height = window.innerHeight - t - F + "px") : (p.removeClass(e.domElement, z.CLASS_TOO_TALL), e.__ul.style.height = "auto") } e.__resize_handle && f.defer(function() { e.__resize_handle.style.height = e.__ul.offsetHeight + "px" }), e.__closeButton && (e.__closeButton.style.width = e.width + "px") }, remember: function() { if (f.isUndefined(E) && (E = new d, E.domElement.innerHTML = t), this.parent) throw new Error("You can only call remember on a top level GUI."); var e = this;
                        f.each(Array.prototype.slice.call(arguments), function(t) { 0 == e.__rememberedObjects.length && x(e), -1 == e.__rememberedObjects.indexOf(t) && e.__rememberedObjects.push(t) }), this.autoPlace && w(this, this.width) }, getRoot: function() { for (var e = this; e.parent;) e = e.parent; return e }, getSaveObject: function() { var e = this.load; return e.closed = this.closed, this.__rememberedObjects.length > 0 && (e.preset = this.preset, e.remembered || (e.remembered = {}), e.remembered[this.preset] = T(this)), e.folders = {}, f.each(this.__folders, function(t, i) { e.folders[i] = t.getSaveObject() }), e }, save: function() { this.load.remembered || (this.load.remembered = {}), this.load.remembered[this.preset] = T(this), C(this, !1) }, saveAs: function(e) { this.load.remembered || (this.load.remembered = {}, this.load.remembered[k] = T(this, !0)), this.load.remembered[e] = T(this), this.preset = e, M(this, e, !0) }, revert: function(e) { f.each(this.__controllers, function(t) { this.getRoot().load.remembered ? y(e || this.getRoot(), t) : t.setValue(t.initialValue) }, this), f.each(this.__folders, function(e) { e.revert(e) }), e || C(this.getRoot(), !1) }, listen: function(e) { var t = 0 == this.__listening.length;
                        this.__listening.push(e), t && A(this.__listening) } }), z }(r.utils.css, '<div id="dg-save" class="dg dialogue">\n\n  Here\'s the new load parameter for your <code>GUI</code>\'s constructor:\n\n  <textarea id="dg-new-constructor"></textarea>\n\n  <div id="dg-save-locally">\n\n    <input id="dg-local-storage" type="checkbox"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id="dg-local-explain">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>\'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>', ".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n", r.controllers.factory = function(e, t, i, r, n, o, a) { return function(s, h) { var l = s[h]; return a.isArray(arguments[2]) || a.isObject(arguments[2]) ? new e(s, h, arguments[2]) : a.isNumber(l) ? a.isNumber(arguments[2]) && a.isNumber(arguments[3]) ? new i(s, h, arguments[2], arguments[3]) : new t(s, h, { min: arguments[2], max: arguments[3] }) : a.isString(l) ? new r(s, h) : a.isFunction(l) ? new n(s, h, "") : a.isBoolean(l) ? new o(s, h) : void 0 } }(r.controllers.OptionController, r.controllers.NumberControllerBox, r.controllers.NumberControllerSlider, r.controllers.StringController = function(e, t, i) {
                var r = function(e, i) {
                    function n() { a.setValue(a.__input.value) }

                    function o() { a.__onFinishChange && a.__onFinishChange.call(a, a.getValue()) } r.superclass.call(this, e, i); var a = this;
                    this.__input = document.createElement("input"), this.__input.setAttribute("type", "text"), t.bind(this.__input, "keyup", n), t.bind(this.__input, "change", n), t.bind(this.__input, "blur", o), t.bind(this.__input, "keydown", function(e) { 13 === e.keyCode && this.blur() }), this.updateDisplay(), this.domElement.appendChild(this.__input) };
                return r.superclass = e, i.extend(r.prototype, e.prototype, {
                    updateDisplay: function() {
                        return t.isActive(this.__input) || (this.__input.value = this.getValue()),
                            r.superclass.prototype.updateDisplay.call(this)
                    }
                }), r
            }(r.controllers.Controller, r.dom.dom, r.utils.common), r.controllers.FunctionController, r.controllers.BooleanController, r.utils.common), r.controllers.Controller, r.controllers.BooleanController, r.controllers.FunctionController, r.controllers.NumberControllerBox, r.controllers.NumberControllerSlider, r.controllers.OptionController, r.controllers.ColorController = function(e, t, i, r, n) {
                function o(e, t, i, r) { e.style.background = "", n.each(h, function(n) { e.style.cssText += "background: " + n + "linear-gradient(" + t + ", " + i + " 0%, " + r + " 100%); " }) }

                function a(e) { e.style.background = "", e.style.cssText += "background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);", e.style.cssText += "background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", e.style.cssText += "background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", e.style.cssText += "background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", e.style.cssText += "background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);" } var s = function(e, h) {
                    function l(e) { p(e), t.bind(window, "mousemove", p), t.bind(window, "mouseup", c) }

                    function c() { t.unbind(window, "mousemove", p), t.unbind(window, "mouseup", c) }

                    function u() { var e = r(this.value);
                        e !== !1 ? (m.__color.__state = e, m.setValue(m.__color.toOriginal())) : this.value = m.__color.toString() }

                    function d() { t.unbind(window, "mousemove", f), t.unbind(window, "mouseup", d) }

                    function p(e) { e.preventDefault(); var i = t.getWidth(m.__saturation_field),
                            r = t.getOffset(m.__saturation_field),
                            n = (e.clientX - r.left + document.body.scrollLeft) / i,
                            o = 1 - (e.clientY - r.top + document.body.scrollTop) / i; return o > 1 ? o = 1 : 0 > o && (o = 0), n > 1 ? n = 1 : 0 > n && (n = 0), m.__color.v = o, m.__color.s = n, m.setValue(m.__color.toOriginal()), !1 }

                    function f(e) { e.preventDefault(); var i = t.getHeight(m.__hue_field),
                            r = t.getOffset(m.__hue_field),
                            n = 1 - (e.clientY - r.top + document.body.scrollTop) / i; return n > 1 ? n = 1 : 0 > n && (n = 0), m.__color.h = 360 * n, m.setValue(m.__color.toOriginal()), !1 } s.superclass.call(this, e, h), this.__color = new i(this.getValue()), this.__temp = new i(0); var m = this;
                    this.domElement = document.createElement("div"), t.makeSelectable(this.domElement, !1), this.__selector = document.createElement("div"), this.__selector.className = "selector", this.__saturation_field = document.createElement("div"), this.__saturation_field.className = "saturation-field", this.__field_knob = document.createElement("div"), this.__field_knob.className = "field-knob", this.__field_knob_border = "2px solid ", this.__hue_knob = document.createElement("div"), this.__hue_knob.className = "hue-knob", this.__hue_field = document.createElement("div"), this.__hue_field.className = "hue-field", this.__input = document.createElement("input"), this.__input.type = "text", this.__input_textShadow = "0 1px 1px ", t.bind(this.__input, "keydown", function(e) { 13 === e.keyCode && u.call(this) }), t.bind(this.__input, "blur", u), t.bind(this.__selector, "mousedown", function(e) { t.addClass(this, "drag").bind(window, "mouseup", function(e) { t.removeClass(m.__selector, "drag") }) }); var g = document.createElement("div");
                    n.extend(this.__selector.style, { width: "122px", height: "102px", padding: "3px", backgroundColor: "#222", boxShadow: "0px 1px 3px rgba(0,0,0,0.3)" }), n.extend(this.__field_knob.style, { position: "absolute", width: "12px", height: "12px", border: this.__field_knob_border + (this.__color.v < .5 ? "#fff" : "#000"), boxShadow: "0px 1px 3px rgba(0,0,0,0.5)", borderRadius: "12px", zIndex: 1 }), n.extend(this.__hue_knob.style, { position: "absolute", width: "15px", height: "2px", borderRight: "4px solid #fff", zIndex: 1 }), n.extend(this.__saturation_field.style, { width: "100px", height: "100px", border: "1px solid #555", marginRight: "3px", display: "inline-block", cursor: "pointer" }), n.extend(g.style, { width: "100%", height: "100%", background: "none" }), o(g, "top", "rgba(0,0,0,0)", "#000"), n.extend(this.__hue_field.style, { width: "15px", height: "100px", display: "inline-block", border: "1px solid #555", cursor: "ns-resize" }), a(this.__hue_field), n.extend(this.__input.style, { outline: "none", textAlign: "center", color: "#fff", border: 0, fontWeight: "bold", textShadow: this.__input_textShadow + "rgba(0,0,0,0.7)" }), t.bind(this.__saturation_field, "mousedown", l), t.bind(this.__field_knob, "mousedown", l), t.bind(this.__hue_field, "mousedown", function(e) { f(e), t.bind(window, "mousemove", f), t.bind(window, "mouseup", d) }), this.__saturation_field.appendChild(g), this.__selector.appendChild(this.__field_knob), this.__selector.appendChild(this.__saturation_field), this.__selector.appendChild(this.__hue_field), this.__hue_field.appendChild(this.__hue_knob), this.domElement.appendChild(this.__input), this.domElement.appendChild(this.__selector), this.updateDisplay() };
                s.superclass = e, n.extend(s.prototype, e.prototype, { updateDisplay: function() { var e = r(this.getValue()); if (e !== !1) { var t = !1;
                            n.each(i.COMPONENTS, function(i) { return n.isUndefined(e[i]) || n.isUndefined(this.__color.__state[i]) || e[i] === this.__color.__state[i] ? void 0 : (t = !0, {}) }, this), t && n.extend(this.__color.__state, e) } n.extend(this.__temp.__state, this.__color.__state), this.__temp.a = 1; var a = this.__color.v < .5 || this.__color.s > .5 ? 255 : 0,
                            s = 255 - a;
                        n.extend(this.__field_knob.style, { marginLeft: 100 * this.__color.s - 7 + "px", marginTop: 100 * (1 - this.__color.v) - 7 + "px", backgroundColor: this.__temp.toString(), border: this.__field_knob_border + "rgb(" + a + "," + a + "," + a + ")" }), this.__hue_knob.style.marginTop = 100 * (1 - this.__color.h / 360) + "px", this.__temp.s = 1, this.__temp.v = 1, o(this.__saturation_field, "left", "#fff", this.__temp.toString()), n.extend(this.__input.style, { backgroundColor: this.__input.value = this.__color.toString(), color: "rgb(" + a + "," + a + "," + a + ")", textShadow: this.__input_textShadow + "rgba(" + s + "," + s + "," + s + ",.7)" }) } }); var h = ["-moz-", "-o-", "-webkit-", "-ms-", ""]; return s }(r.controllers.Controller, r.dom.dom, r.color.Color = function(e, t, i, r) {
                function n(e, t, i) { Object.defineProperty(e, t, { get: function() { return "RGB" === this.__state.space ? this.__state[t] : (a(this, t, i), this.__state[t]) }, set: function(e) { "RGB" !== this.__state.space && (a(this, t, i), this.__state.space = "RGB"), this.__state[t] = e } }) }

                function o(e, t) { Object.defineProperty(e, t, { get: function() { return "HSV" === this.__state.space ? this.__state[t] : (s(this), this.__state[t]) }, set: function(e) { "HSV" !== this.__state.space && (s(this), this.__state.space = "HSV"), this.__state[t] = e } }) }

                function a(e, i, n) { if ("HEX" === e.__state.space) e.__state[i] = t.component_from_hex(e.__state.hex, n);
                    else { if ("HSV" !== e.__state.space) throw "Corrupted color state";
                        r.extend(e.__state, t.hsv_to_rgb(e.__state.h, e.__state.s, e.__state.v)) } }

                function s(e) { var i = t.rgb_to_hsv(e.r, e.g, e.b);
                    r.extend(e.__state, { s: i.s, v: i.v }), r.isNaN(i.h) ? r.isUndefined(e.__state.h) && (e.__state.h = 0) : e.__state.h = i.h } var h = function() { if (this.__state = e.apply(this, arguments), this.__state === !1) throw "Failed to interpret color arguments";
                    this.__state.a = this.__state.a || 1 }; return h.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"], r.extend(h.prototype, { toString: function() { return i(this) }, toOriginal: function() { return this.__state.conversion.write(this) } }), n(h.prototype, "r", 2), n(h.prototype, "g", 1), n(h.prototype, "b", 0), o(h.prototype, "h"), o(h.prototype, "s"), o(h.prototype, "v"), Object.defineProperty(h.prototype, "a", { get: function() { return this.__state.a }, set: function(e) { this.__state.a = e } }), Object.defineProperty(h.prototype, "hex", { get: function() { return "HEX" !== !this.__state.space && (this.__state.hex = t.rgb_to_hex(this.r, this.g, this.b)), this.__state.hex }, set: function(e) { this.__state.space = "HEX", this.__state.hex = e } }), h }(r.color.interpret, r.color.math = function() { var e; return { hsv_to_rgb: function(e, t, i) { var r = Math.floor(e / 60) % 6,
                            n = e / 60 - Math.floor(e / 60),
                            o = i * (1 - t),
                            a = i * (1 - n * t),
                            s = i * (1 - (1 - n) * t),
                            h = [
                                [i, s, o],
                                [a, i, o],
                                [o, i, s],
                                [o, a, i],
                                [s, o, i],
                                [i, o, a]
                            ][r]; return { r: 255 * h[0], g: 255 * h[1], b: 255 * h[2] } }, rgb_to_hsv: function(e, t, i) { var r, n, o = Math.min(e, t, i),
                            a = Math.max(e, t, i),
                            s = a - o; return 0 == a ? { h: NaN, s: 0, v: 0 } : (n = s / a, r = e == a ? (t - i) / s : t == a ? 2 + (i - e) / s : 4 + (e - t) / s, r /= 6, 0 > r && (r += 1), { h: 360 * r, s: n, v: a / 255 }) }, rgb_to_hex: function(e, t, i) { var r = this.hex_with_component(0, 2, e); return r = this.hex_with_component(r, 1, t), r = this.hex_with_component(r, 0, i) }, component_from_hex: function(e, t) { return e >> 8 * t & 255 }, hex_with_component: function(t, i, r) { return r << (e = 8 * i) | t & ~(255 << e) } } }(), r.color.toString, r.utils.common), r.color.interpret, r.utils.common), r.utils.requestAnimationFrame = function() { return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e, t) { window.setTimeout(e, 1e3 / 60) } }(), r.dom.CenteredDiv = function(e, t) { var i = function() { this.backgroundElement = document.createElement("div"), t.extend(this.backgroundElement.style, { backgroundColor: "rgba(0,0,0,0.8)", top: 0, left: 0, display: "none", zIndex: "1000", opacity: 0, WebkitTransition: "opacity 0.2s linear" }), e.makeFullscreen(this.backgroundElement), this.backgroundElement.style.position = "fixed", this.domElement = document.createElement("div"), t.extend(this.domElement.style, { position: "fixed", display: "none", zIndex: "1001", opacity: 0, WebkitTransition: "-webkit-transform 0.2s ease-out, opacity 0.2s linear" }), document.body.appendChild(this.backgroundElement), document.body.appendChild(this.domElement); var i = this;
                    e.bind(this.backgroundElement, "click", function() { i.hide() }) }; return i.prototype.show = function() { var e = this;
                    this.backgroundElement.style.display = "block", this.domElement.style.display = "block", this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)", this.layout(), t.defer(function() { e.backgroundElement.style.opacity = 1, e.domElement.style.opacity = 1, e.domElement.style.webkitTransform = "scale(1)" }) }, i.prototype.hide = function() { var t = this,
                        i = function() { t.domElement.style.display = "none", t.backgroundElement.style.display = "none", e.unbind(t.domElement, "webkitTransitionEnd", i), e.unbind(t.domElement, "transitionend", i), e.unbind(t.domElement, "oTransitionEnd", i) };
                    e.bind(this.domElement, "webkitTransitionEnd", i), e.bind(this.domElement, "transitionend", i), e.bind(this.domElement, "oTransitionEnd", i), this.backgroundElement.style.opacity = 0, this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)" }, i.prototype.layout = function() { this.domElement.style.left = window.innerWidth / 2 - e.getWidth(this.domElement) / 2 + "px", this.domElement.style.top = window.innerHeight / 2 - e.getHeight(this.domElement) / 2 + "px" }, i }(r.dom.dom, r.utils.common), r.dom.dom, r.utils.common)
    }, {}],
    17: [function(e, t, i) {! function(e, i) { "undefined" != typeof t ? t.exports = i() : "function" == typeof define && "object" == typeof define.amd ? define(i) : this[e] = i() }("domready", function() { var e, t = [],
                i = document,
                r = i.documentElement.doScroll,
                n = "DOMContentLoaded",
                o = (r ? /^loaded|^c/ : /^loaded|^i|^c/).test(i.readyState); return o || i.addEventListener(n, e = function() { for (i.removeEventListener(n, e), o = 1; e = t.shift();) e() }),
                function(e) { o ? setTimeout(e, 0) : t.push(e) } }) }, {}],
    18: [function(e, t, i) { "use strict"; var r, n, o, a, s, h, l, c = e("d"),
            u = e("es5-ext/object/valid-callable"),
            d = Function.prototype.apply,
            p = Function.prototype.call,
            f = Object.create,
            m = Object.defineProperty,
            g = Object.defineProperties,
            v = Object.prototype.hasOwnProperty,
            y = { configurable: !0, enumerable: !1, writable: !0 };
        r = function(e, t) { var i; return u(t), v.call(this, "__ee__") ? i = this.__ee__ : (i = y.value = f(null), m(this, "__ee__", y), y.value = null), i[e] ? "object" == typeof i[e] ? i[e].push(t) : i[e] = [i[e], t] : i[e] = t, this }, n = function(e, t) { var i, n; return u(t), n = this, r.call(this, e, i = function() { o.call(n, e, i), d.call(t, this, arguments) }), i.__eeOnceListener__ = t, this }, o = function(e, t) { var i, r, n, o; if (u(t), !v.call(this, "__ee__")) return this; if (i = this.__ee__, !i[e]) return this; if (r = i[e], "object" == typeof r)
                for (o = 0; n = r[o]; ++o)(n === t || n.__eeOnceListener__ === t) && (2 === r.length ? i[e] = r[o ? 0 : 1] : r.splice(o, 1));
            else(r === t || r.__eeOnceListener__ === t) && delete i[e]; return this }, a = function(e) { var t, i, r, n, o; if (v.call(this, "__ee__") && (n = this.__ee__[e]))
                if ("object" == typeof n) { for (i = arguments.length, o = new Array(i - 1), t = 1; i > t; ++t) o[t - 1] = arguments[t]; for (n = n.slice(), t = 0; r = n[t]; ++t) d.call(r, this, o) } else switch (arguments.length) {
                    case 1:
                        p.call(n, this); break;
                    case 2:
                        p.call(n, this, arguments[1]); break;
                    case 3:
                        p.call(n, this, arguments[1], arguments[2]); break;
                    default:
                        for (i = arguments.length, o = new Array(i - 1), t = 1; i > t; ++t) o[t - 1] = arguments[t];
                        d.call(n, this, o) } }, s = { on: r, once: n, off: o, emit: a }, h = { on: c(r), once: c(n), off: c(o), emit: c(a) }, l = g({}, h), t.exports = i = function(e) { return null == e ? f(l) : g(Object(e), h) }, i.methods = s }, { d: 19, "es5-ext/object/valid-callable": 28 }],
    19: [function(e, t, i) { "use strict"; var r, n = e("es5-ext/object/assign"),
            o = e("es5-ext/object/normalize-options"),
            a = e("es5-ext/object/is-callable"),
            s = e("es5-ext/string/#/contains");
        r = t.exports = function(e, t) { var i, r, a, h, l; return arguments.length < 2 || "string" != typeof e ? (h = t, t = e, e = null) : h = arguments[2], null == e ? (i = a = !0, r = !1) : (i = s.call(e, "c"), r = s.call(e, "e"), a = s.call(e, "w")), l = { value: t, configurable: i, enumerable: r, writable: a }, h ? n(o(h), l) : l }, r.gs = function(e, t, i) { var r, h, l, c; return "string" != typeof e ? (l = i, i = t, t = e, e = null) : l = arguments[3], null == t ? t = void 0 : a(t) ? null == i ? i = void 0 : a(i) || (l = i, i = void 0) : (l = t, t = i = void 0), null == e ? (r = !0, h = !1) : (r = s.call(e, "c"), h = s.call(e, "e")), c = { get: t, set: i, configurable: r, enumerable: h }, l ? n(o(l), c) : c } }, { "es5-ext/object/assign": 20, "es5-ext/object/is-callable": 23, "es5-ext/object/normalize-options": 27, "es5-ext/string/#/contains": 30 }],
    20: [function(e, t, i) { "use strict";
        t.exports = e("./is-implemented")() ? Object.assign : e("./shim") }, { "./is-implemented": 21, "./shim": 22 }],
    21: [function(e, t, i) { "use strict";
        t.exports = function() { var e, t = Object.assign; return "function" != typeof t ? !1 : (e = { foo: "raz" }, t(e, { bar: "dwa" }, { trzy: "trzy" }), e.foo + e.bar + e.trzy === "razdwatrzy") } }, {}],
    22: [function(e, t, i) { "use strict"; var r = e("../keys"),
            n = e("../valid-value"),
            o = Math.max;
        t.exports = function(e, t) { var i, a, s, h = o(arguments.length, 2); for (e = Object(n(e)), s = function(r) { try { e[r] = t[r] } catch (n) { i || (i = n) } }, a = 1; h > a; ++a) t = arguments[a], r(t).forEach(s); if (void 0 !== i) throw i; return e } }, { "../keys": 24, "../valid-value": 29 }],
    23: [function(e, t, i) { "use strict";
        t.exports = function(e) { return "function" == typeof e } }, {}],
    24: [function(e, t, i) { "use strict";
        t.exports = e("./is-implemented")() ? Object.keys : e("./shim") }, { "./is-implemented": 25, "./shim": 26 }],
    25: [function(e, t, i) { "use strict";
        t.exports = function() { try { return Object.keys("primitive"), !0 } catch (e) { return !1 } } }, {}],
    26: [function(e, t, i) { "use strict"; var r = Object.keys;
        t.exports = function(e) { return r(null == e ? e : Object(e)) } }, {}],
    27: [function(e, t, i) { "use strict"; var r = Array.prototype.forEach,
            n = Object.create,
            o = function(e, t) { var i; for (i in e) t[i] = e[i] };
        t.exports = function(e) { var t = n(null); return r.call(arguments, function(e) { null != e && o(Object(e), t) }), t } }, {}],
    28: [function(e, t, i) { "use strict";
        t.exports = function(e) { if ("function" != typeof e) throw new TypeError(e + " is not a function"); return e } }, {}],
    29: [function(e, t, i) { "use strict";
        t.exports = function(e) { if (null == e) throw new TypeError("Cannot use null or undefined"); return e } }, {}],
    30: [function(e, t, i) { "use strict";
        t.exports = e("./is-implemented")() ? String.prototype.contains : e("./shim") }, { "./is-implemented": 31, "./shim": 32 }],
    31: [function(e, t, i) { "use strict"; var r = "razdwatrzy";
        t.exports = function() { return "function" != typeof r.contains ? !1 : r.contains("dwa") === !0 && r.contains("foo") === !1 } }, {}],
    32: [function(e, t, i) { "use strict"; var r = String.prototype.indexOf;
        t.exports = function(e) { return r.call(this, e, arguments[1]) > -1 } }, {}],
    33: [function(e, t, i) {
        (function(e) {
            var i = "undefined" != typeof t && t.exports && "undefined" != typeof e ? e : this || window;
            (i._gsQueue || (i._gsQueue = [])).push(function() {
                    "use strict";
                    i._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(e, t, i) { var r = function(e) { var t, i = [],
                                        r = e.length; for (t = 0; t !== r; i.push(e[t++])); return i },
                                n = function(e, t, i) { var r, n, o = e.cycle; for (r in o) n = o[r], e[r] = "function" == typeof n ? n.call(t[i], i) : n[i % n.length];
                                    delete e.cycle },
                                o = function(e, t, r) { i.call(this, e, t, r), this._cycle = 0, this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._dirty = !0, this.render = o.prototype.render },
                                a = 1e-10,
                                s = i._internals,
                                h = s.isSelector,
                                l = s.isArray,
                                c = o.prototype = i.to({}, .1, {}),
                                u = [];
                            o.version = "1.18.0", c.constructor = o, c.kill()._gc = !1, o.killTweensOf = o.killDelayedCallsTo = i.killTweensOf, o.getTweensOf = i.getTweensOf, o.lagSmoothing = i.lagSmoothing, o.ticker = i.ticker, o.render = i.render, c.invalidate = function() { return this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(!0), i.prototype.invalidate.call(this) }, c.updateTo = function(e, t) { var r, n = this.ratio,
                                    o = this.vars.immediateRender || e.immediateRender;
                                t && this._startTime < this._timeline._time && (this._startTime = this._timeline._time, this._uncache(!1), this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay)); for (r in e) this.vars[r] = e[r]; if (this._initted || o)
                                    if (t) this._initted = !1, o && this.render(0, !0, !0);
                                    else if (this._gc && this._enabled(!0, !1), this._notifyPluginsOfEnabled && this._firstPT && i._onPluginEvent("_onDisable", this), this._time / this._duration > .998) { var a = this._time;
                                    this.render(0, !0, !1), this._initted = !1, this.render(a, !0, !1) } else if (this._time > 0 || o) { this._initted = !1, this._init(); for (var s, h = 1 / (1 - n), l = this._firstPT; l;) s = l.s + l.c, l.c *= h, l.s = s - l.c, l = l._next } return this }, c.render = function(e, t, i) { this._initted || 0 === this._duration && this.vars.repeat && this.invalidate(); var r, n, o, h, l, c, u, d, p = this._dirty ? this.totalDuration() : this._totalDuration,
                                    f = this._time,
                                    m = this._totalTime,
                                    g = this._cycle,
                                    v = this._duration,
                                    y = this._rawPrevTime; if (e >= p ? (this._totalTime = p, this._cycle = this._repeat, this._yoyo && 0 !== (1 & this._cycle) ? (this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = v, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1), this._reversed || (r = !0, n = "onComplete", i = i || this._timeline.autoRemoveChildren), 0 === v && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (e = 0), (0 === e || 0 > y || y === a) && y !== e && (i = !0, y > a && (n = "onReverseComplete")), this._rawPrevTime = d = !t || e || y === e ? e : a)) : 1e-7 > e ? (this._totalTime = this._time = this._cycle = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== m || 0 === v && y > 0) && (n = "onReverseComplete", r = this._reversed), 0 > e && (this._active = !1, 0 === v && (this._initted || !this.vars.lazy || i) && (y >= 0 && (i = !0), this._rawPrevTime = d = !t || e || y === e ? e : a)), this._initted || (i = !0)) : (this._totalTime = this._time = e, 0 !== this._repeat && (h = v + this._repeatDelay, this._cycle = this._totalTime / h >> 0, 0 !== this._cycle && this._cycle === this._totalTime / h && this._cycle--, this._time = this._totalTime - this._cycle * h, this._yoyo && 0 !== (1 & this._cycle) && (this._time = v - this._time), this._time > v ? this._time = v : this._time < 0 && (this._time = 0)), this._easeType ? (l = this._time / v, c = this._easeType, u = this._easePower, (1 === c || 3 === c && l >= .5) && (l = 1 - l), 3 === c && (l *= 2), 1 === u ? l *= l : 2 === u ? l *= l * l : 3 === u ? l *= l * l * l : 4 === u && (l *= l * l * l * l), 1 === c ? this.ratio = 1 - l : 2 === c ? this.ratio = l : this._time / v < .5 ? this.ratio = l / 2 : this.ratio = 1 - l / 2) : this.ratio = this._ease.getRatio(this._time / v)), f === this._time && !i && g === this._cycle) return void(m !== this._totalTime && this._onUpdate && (t || this._callback("onUpdate"))); if (!this._initted) { if (this._init(), !this._initted || this._gc) return; if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = f, this._totalTime = m, this._rawPrevTime = y, this._cycle = g, s.lazyTweens.push(this), void(this._lazy = [e, t]);
                                    this._time && !r ? this.ratio = this._ease.getRatio(this._time / v) : r && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1)) } for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== f && e >= 0 && (this._active = !0), 0 === m && (2 === this._initted && e > 0 && this._init(), this._startAt && (e >= 0 ? this._startAt.render(e, t, i) : n || (n = "_dummyGS")), this.vars.onStart && (0 !== this._totalTime || 0 === v) && (t || this._callback("onStart"))), o = this._firstPT; o;) o.f ? o.t[o.p](o.c * this.ratio + o.s) : o.t[o.p] = o.c * this.ratio + o.s, o = o._next;
                                this._onUpdate && (0 > e && this._startAt && this._startTime && this._startAt.render(e, t, i), t || (this._totalTime !== m || r) && this._callback("onUpdate")), this._cycle !== g && (t || this._gc || this.vars.onRepeat && this._callback("onRepeat")), n && (!this._gc || i) && (0 > e && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(e, t, i), r && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !t && this.vars[n] && this._callback(n), 0 === v && this._rawPrevTime === a && d !== a && (this._rawPrevTime = 0)) }, o.to = function(e, t, i) { return new o(e, t, i) }, o.from = function(e, t, i) { return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new o(e, t, i) }, o.fromTo = function(e, t, i, r) { return r.startAt = i, r.immediateRender = 0 != r.immediateRender && 0 != i.immediateRender, new o(e, t, r) }, o.staggerTo = o.allTo = function(e, t, a, s, c, d, p) { s = s || 0; var f, m, g, v, y = a.delay || 0,
                                    _ = [],
                                    x = function() { a.onComplete && a.onComplete.apply(a.onCompleteScope || this, arguments), c.apply(p || a.callbackScope || this, d || u) },
                                    b = a.cycle,
                                    w = a.startAt && a.startAt.cycle; for (l(e) || ("string" == typeof e && (e = i.selector(e) || e), h(e) && (e = r(e))), e = e || [], 0 > s && (e = r(e), e.reverse(), s *= -1), f = e.length - 1, g = 0; f >= g; g++) { m = {}; for (v in a) m[v] = a[v]; if (b && n(m, e, g), w) { w = m.startAt = {}; for (v in a.startAt) w[v] = a.startAt[v];
                                        n(m.startAt, e, g) } m.delay = y, g === f && c && (m.onComplete = x), _[g] = new o(e[g], t, m), y += s } return _ }, o.staggerFrom = o.allFrom = function(e, t, i, r, n, a, s) { return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, o.staggerTo(e, t, i, r, n, a, s) }, o.staggerFromTo = o.allFromTo = function(e, t, i, r, n, a, s, h) { return r.startAt = i, r.immediateRender = 0 != r.immediateRender && 0 != i.immediateRender, o.staggerTo(e, t, r, n, a, s, h) }, o.delayedCall = function(e, t, i, r, n) { return new o(t, 0, { delay: e, onComplete: t, onCompleteParams: i, callbackScope: r, onReverseComplete: t, onReverseCompleteParams: i, immediateRender: !1, useFrames: n, overwrite: 0 }) }, o.set = function(e, t) { return new o(e, 0, t) }, o.isTweening = function(e) { return i.getTweensOf(e, !0).length > 0 }; var d = function(e, t) { for (var r = [], n = 0, o = e._first; o;) o instanceof i ? r[n++] = o : (t && (r[n++] = o), r = r.concat(d(o, t)), n = r.length), o = o._next; return r },
                                p = o.getAllTweens = function(t) { return d(e._rootTimeline, t).concat(d(e._rootFramesTimeline, t)) };
                            o.killAll = function(e, i, r, n) { null == i && (i = !0), null == r && (r = !0); var o, a, s, h = p(0 != n),
                                    l = h.length,
                                    c = i && r && n; for (s = 0; l > s; s++) a = h[s], (c || a instanceof t || (o = a.target === a.vars.onComplete) && r || i && !o) && (e ? a.totalTime(a._reversed ? 0 : a.totalDuration()) : a._enabled(!1, !1)) }, o.killChildTweensOf = function(e, t) { if (null != e) { var n, a, c, u, d, p = s.tweenLookup; if ("string" == typeof e && (e = i.selector(e) || e), h(e) && (e = r(e)), l(e))
                                        for (u = e.length; --u > -1;) o.killChildTweensOf(e[u], t);
                                    else { n = []; for (c in p)
                                            for (a = p[c].target.parentNode; a;) a === e && (n = n.concat(p[c].tweens)), a = a.parentNode; for (d = n.length, u = 0; d > u; u++) t && n[u].totalTime(n[u].totalDuration()), n[u]._enabled(!1, !1) } } }; var f = function(e, i, r, n) { i = i !== !1, r = r !== !1, n = n !== !1; for (var o, a, s = p(n), h = i && r && n, l = s.length; --l > -1;) a = s[l], (h || a instanceof t || (o = a.target === a.vars.onComplete) && r || i && !o) && a.paused(e) }; return o.pauseAll = function(e, t, i) { f(!0, e, t, i) }, o.resumeAll = function(e, t, i) { f(!1, e, t, i) }, o.globalTimeScale = function(t) { var r = e._rootTimeline,
                                    n = i.ticker.time; return arguments.length ? (t = t || a, r._startTime = n - (n - r._startTime) * r._timeScale / t, r = e._rootFramesTimeline, n = i.ticker.frame, r._startTime = n - (n - r._startTime) * r._timeScale / t, r._timeScale = e._rootTimeline._timeScale = t, t) : r._timeScale }, c.progress = function(e) { return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - e : e) + this._cycle * (this._duration + this._repeatDelay), !1) : this._time / this.duration() }, c.totalProgress = function(e) { return arguments.length ? this.totalTime(this.totalDuration() * e, !1) : this._totalTime / this.totalDuration() }, c.time = function(e, t) { return arguments.length ? (this._dirty && this.totalDuration(), e > this._duration && (e = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? e = this._duration - e + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (e += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(e, t)) : this._time }, c.duration = function(t) { return arguments.length ? e.prototype.duration.call(this, t) : this._duration }, c.totalDuration = function(e) { return arguments.length ? -1 === this._repeat ? this : this.duration((e - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat, this._dirty = !1), this._totalDuration) }, c.repeat = function(e) { return arguments.length ? (this._repeat = e, this._uncache(!0)) : this._repeat }, c.repeatDelay = function(e) { return arguments.length ? (this._repeatDelay = e, this._uncache(!0)) : this._repeatDelay }, c.yoyo = function(e) { return arguments.length ? (this._yoyo = e, this) : this._yoyo }, o }, !0), i._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(e, t, r) {
                            var n = function(e) { t.call(this, e), this._labels = {}, this.autoRemoveChildren = this.vars.autoRemoveChildren === !0, this.smoothChildTiming = this.vars.smoothChildTiming === !0, this._sortChildren = !0, this._onUpdate = this.vars.onUpdate; var i, r, n = this.vars; for (r in n) i = n[r], l(i) && -1 !== i.join("").indexOf("{self}") && (n[r] = this._swapSelfInParams(i));
                                    l(n.tweens) && this.add(n.tweens, 0, n.align, n.stagger) },
                                o = 1e-10,
                                a = r._internals,
                                s = n._internals = {},
                                h = a.isSelector,
                                l = a.isArray,
                                c = a.lazyTweens,
                                u = a.lazyRender,
                                d = i._gsDefine.globals,
                                p = function(e) { var t, i = {}; for (t in e) i[t] = e[t]; return i },
                                f = function(e, t, i) { var r, n, o = e.cycle; for (r in o) n = o[r], e[r] = "function" == typeof n ? n.call(t[i], i) : n[i % n.length];
                                    delete e.cycle },
                                m = s.pauseCallback = function() {},
                                g = function(e) { var t, i = [],
                                        r = e.length; for (t = 0; t !== r; i.push(e[t++])); return i },
                                v = n.prototype = new t;
                            return n.version = "1.18.0", v.constructor = n, v.kill()._gc = v._forcingPlayhead = v._hasPause = !1, v.to = function(e, t, i, n) { var o = i.repeat && d.TweenMax || r; return t ? this.add(new o(e, t, i), n) : this.set(e, i, n) }, v.from = function(e, t, i, n) { return this.add((i.repeat && d.TweenMax || r).from(e, t, i), n) }, v.fromTo = function(e, t, i, n, o) { var a = n.repeat && d.TweenMax || r; return t ? this.add(a.fromTo(e, t, i, n), o) : this.set(e, n, o) }, v.staggerTo = function(e, t, i, o, a, s, l, c) { var u, d, m = new n({ onComplete: s, onCompleteParams: l, callbackScope: c, smoothChildTiming: this.smoothChildTiming }),
                                    v = i.cycle; for ("string" == typeof e && (e = r.selector(e) || e), e = e || [], h(e) && (e = g(e)), o = o || 0, 0 > o && (e = g(e), e.reverse(), o *= -1), d = 0; d < e.length; d++) u = p(i), u.startAt && (u.startAt = p(u.startAt), u.startAt.cycle && f(u.startAt, e, d)), v && f(u, e, d), m.to(e[d], t, u, d * o); return this.add(m, a) }, v.staggerFrom = function(e, t, i, r, n, o, a, s) { return i.immediateRender = 0 != i.immediateRender, i.runBackwards = !0, this.staggerTo(e, t, i, r, n, o, a, s) }, v.staggerFromTo = function(e, t, i, r, n, o, a, s, h) { return r.startAt = i, r.immediateRender = 0 != r.immediateRender && 0 != i.immediateRender, this.staggerTo(e, t, r, n, o, a, s, h) }, v.call = function(e, t, i, n) { return this.add(r.delayedCall(0, e, t, i), n) }, v.set = function(e, t, i) { return i = this._parseTimeOrLabel(i, 0, !0), null == t.immediateRender && (t.immediateRender = i === this._time && !this._paused), this.add(new r(e, 0, t), i) }, n.exportRoot = function(e, t) { e = e || {}, null == e.smoothChildTiming && (e.smoothChildTiming = !0); var i, o, a = new n(e),
                                    s = a._timeline; for (null == t && (t = !0), s._remove(a, !0), a._startTime = 0, a._rawPrevTime = a._time = a._totalTime = s._time, i = s._first; i;) o = i._next, t && i instanceof r && i.target === i.vars.onComplete || a.add(i, i._startTime - i._delay), i = o; return s.add(a, 0), a }, v.add = function(i, o, a, s) { var h, c, u, d, p, f; if ("number" != typeof o && (o = this._parseTimeOrLabel(o, 0, !0, i)), !(i instanceof e)) { if (i instanceof Array || i && i.push && l(i)) { for (a = a || "normal", s = s || 0, h = o, c = i.length, u = 0; c > u; u++) l(d = i[u]) && (d = new n({ tweens: d })), this.add(d, h), "string" != typeof d && "function" != typeof d && ("sequence" === a ? h = d._startTime + d.totalDuration() / d._timeScale : "start" === a && (d._startTime -= d.delay())), h += s; return this._uncache(!0) } if ("string" == typeof i) return this.addLabel(i, o); if ("function" != typeof i) throw "Cannot add " + i + " into the timeline; it is not a tween, timeline, function, or string.";
                                    i = r.delayedCall(0, i) } if (t.prototype.add.call(this, i, o), (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration())
                                    for (p = this, f = p.rawTime() > i._startTime; p._timeline;) f && p._timeline.smoothChildTiming ? p.totalTime(p._totalTime, !0) : p._gc && p._enabled(!0, !1), p = p._timeline; return this }, v.remove = function(t) { if (t instanceof e) { this._remove(t, !1); var i = t._timeline = t.vars.useFrames ? e._rootFramesTimeline : e._rootTimeline; return t._startTime = (t._paused ? t._pauseTime : i._time) - (t._reversed ? t.totalDuration() - t._totalTime : t._totalTime) / t._timeScale, this } if (t instanceof Array || t && t.push && l(t)) { for (var r = t.length; --r > -1;) this.remove(t[r]); return this } return "string" == typeof t ? this.removeLabel(t) : this.kill(null, t) }, v._remove = function(e, i) { t.prototype._remove.call(this, e, i); var r = this._last; return r ? this._time > r._startTime + r._totalDuration / r._timeScale && (this._time = this.duration(), this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0, this }, v.append = function(e, t) { return this.add(e, this._parseTimeOrLabel(null, t, !0, e)) }, v.insert = v.insertMultiple = function(e, t, i, r) { return this.add(e, t || 0, i, r) }, v.appendMultiple = function(e, t, i, r) { return this.add(e, this._parseTimeOrLabel(null, t, !0, e), i, r) }, v.addLabel = function(e, t) { return this._labels[e] = this._parseTimeOrLabel(t), this }, v.addPause = function(e, t, i, n) { var o = r.delayedCall(0, m, i, n || this); return o.vars.onComplete = o.vars.onReverseComplete = t, o.data = "isPause", this._hasPause = !0, this.add(o, e) }, v.removeLabel = function(e) { return delete this._labels[e], this }, v.getLabelTime = function(e) { return null != this._labels[e] ? this._labels[e] : -1 }, v._parseTimeOrLabel = function(t, i, r, n) { var o; if (n instanceof e && n.timeline === this) this.remove(n);
                                else if (n && (n instanceof Array || n.push && l(n)))
                                    for (o = n.length; --o > -1;) n[o] instanceof e && n[o].timeline === this && this.remove(n[o]); if ("string" == typeof i) return this._parseTimeOrLabel(i, r && "number" == typeof t && null == this._labels[i] ? t - this.duration() : 0, r); if (i = i || 0, "string" != typeof t || !isNaN(t) && null == this._labels[t]) null == t && (t = this.duration());
                                else { if (o = t.indexOf("="), -1 === o) return null == this._labels[t] ? r ? this._labels[t] = this.duration() + i : i : this._labels[t] + i;
                                    i = parseInt(t.charAt(o - 1) + "1", 10) * Number(t.substr(o + 1)), t = o > 1 ? this._parseTimeOrLabel(t.substr(0, o - 1), 0, r) : this.duration() } return Number(t) + i }, v.seek = function(e, t) { return this.totalTime("number" == typeof e ? e : this._parseTimeOrLabel(e), t !== !1) }, v.stop = function() { return this.paused(!0) }, v.gotoAndPlay = function(e, t) { return this.play(e, t) }, v.gotoAndStop = function(e, t) { return this.pause(e, t) }, v.render = function(e, t, i) {
                                this._gc && this._enabled(!0, !1);
                                var r, n, a, s, h, l, d = this._dirty ? this.totalDuration() : this._totalDuration,
                                    p = this._time,
                                    f = this._startTime,
                                    m = this._timeScale,
                                    g = this._paused;
                                if (e >= d) this._totalTime = this._time = d, this._reversed || this._hasPausedChild() || (n = !0, s = "onComplete", h = !!this._timeline.autoRemoveChildren, 0 === this._duration && (0 === e || this._rawPrevTime < 0 || this._rawPrevTime === o) && this._rawPrevTime !== e && this._first && (h = !0, this._rawPrevTime > o && (s = "onReverseComplete"))), this._rawPrevTime = this._duration || !t || e || this._rawPrevTime === e ? e : o, e = d + 1e-4;
                                else if (1e-7 > e)
                                    if (this._totalTime = this._time = 0, (0 !== p || 0 === this._duration && this._rawPrevTime !== o && (this._rawPrevTime > 0 || 0 > e && this._rawPrevTime >= 0)) && (s = "onReverseComplete", n = this._reversed), 0 > e) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (h = n = !0, s = "onReverseComplete") : this._rawPrevTime >= 0 && this._first && (h = !0), this._rawPrevTime = e;
                                    else { if (this._rawPrevTime = this._duration || !t || e || this._rawPrevTime === e ? e : o, 0 === e && n)
                                            for (r = this._first; r && 0 === r._startTime;) r._duration || (n = !1), r = r._next;
                                        e = 0, this._initted || (h = !0) }
                                else { if (this._hasPause && !this._forcingPlayhead && !t) { if (e >= p)
                                            for (r = this._first; r && r._startTime <= e && !l;) r._duration || "isPause" !== r.data || r.ratio || 0 === r._startTime && 0 === this._rawPrevTime || (l = r), r = r._next;
                                        else
                                            for (r = this._last; r && r._startTime >= e && !l;) r._duration || "isPause" === r.data && r._rawPrevTime > 0 && (l = r), r = r._prev;
                                        l && (this._time = e = l._startTime, this._totalTime = e + this._cycle * (this._totalDuration + this._repeatDelay)) } this._totalTime = this._time = this._rawPrevTime = e }
                                if (this._time !== p && this._first || i || h || l) {
                                    if (this._initted || (this._initted = !0), this._active || !this._paused && this._time !== p && e > 0 && (this._active = !0),
                                        0 === p && this.vars.onStart && 0 !== this._time && (t || this._callback("onStart")), this._time >= p)
                                        for (r = this._first; r && (a = r._next, !this._paused || g);)(r._active || r._startTime <= this._time && !r._paused && !r._gc) && (l === r && this.pause(), r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (e - r._startTime) * r._timeScale, t, i) : r.render((e - r._startTime) * r._timeScale, t, i)), r = a;
                                    else
                                        for (r = this._last; r && (a = r._prev, !this._paused || g);) { if (r._active || r._startTime <= p && !r._paused && !r._gc) { if (l === r) { for (l = r._prev; l && l.endTime() > this._time;) l.render(l._reversed ? l.totalDuration() - (e - l._startTime) * l._timeScale : (e - l._startTime) * l._timeScale, t, i), l = l._prev;
                                                    l = null, this.pause() } r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (e - r._startTime) * r._timeScale, t, i) : r.render((e - r._startTime) * r._timeScale, t, i) } r = a } this._onUpdate && (t || (c.length && u(), this._callback("onUpdate"))), s && (this._gc || (f === this._startTime || m !== this._timeScale) && (0 === this._time || d >= this.totalDuration()) && (n && (c.length && u(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !t && this.vars[s] && this._callback(s)))
                                }
                            }, v._hasPausedChild = function() { for (var e = this._first; e;) { if (e._paused || e instanceof n && e._hasPausedChild()) return !0;
                                    e = e._next } return !1 }, v.getChildren = function(e, t, i, n) { n = n || -9999999999; for (var o = [], a = this._first, s = 0; a;) a._startTime < n || (a instanceof r ? t !== !1 && (o[s++] = a) : (i !== !1 && (o[s++] = a), e !== !1 && (o = o.concat(a.getChildren(!0, t, i)), s = o.length))), a = a._next; return o }, v.getTweensOf = function(e, t) { var i, n, o = this._gc,
                                    a = [],
                                    s = 0; for (o && this._enabled(!0, !0), i = r.getTweensOf(e), n = i.length; --n > -1;)(i[n].timeline === this || t && this._contains(i[n])) && (a[s++] = i[n]); return o && this._enabled(!1, !0), a }, v.recent = function() { return this._recent }, v._contains = function(e) { for (var t = e.timeline; t;) { if (t === this) return !0;
                                    t = t.timeline } return !1 }, v.shiftChildren = function(e, t, i) { i = i || 0; for (var r, n = this._first, o = this._labels; n;) n._startTime >= i && (n._startTime += e), n = n._next; if (t)
                                    for (r in o) o[r] >= i && (o[r] += e); return this._uncache(!0) }, v._kill = function(e, t) { if (!e && !t) return this._enabled(!1, !1); for (var i = t ? this.getTweensOf(t) : this.getChildren(!0, !0, !1), r = i.length, n = !1; --r > -1;) i[r]._kill(e, t) && (n = !0); return n }, v.clear = function(e) { var t = this.getChildren(!1, !0, !0),
                                    i = t.length; for (this._time = this._totalTime = 0; --i > -1;) t[i]._enabled(!1, !1); return e !== !1 && (this._labels = {}), this._uncache(!0) }, v.invalidate = function() { for (var t = this._first; t;) t.invalidate(), t = t._next; return e.prototype.invalidate.call(this) }, v._enabled = function(e, i) { if (e === this._gc)
                                    for (var r = this._first; r;) r._enabled(e, !0), r = r._next; return t.prototype._enabled.call(this, e, i) }, v.totalTime = function(t, i, r) { this._forcingPlayhead = !0; var n = e.prototype.totalTime.apply(this, arguments); return this._forcingPlayhead = !1, n }, v.duration = function(e) { return arguments.length ? (0 !== this.duration() && 0 !== e && this.timeScale(this._duration / e), this) : (this._dirty && this.totalDuration(), this._duration) }, v.totalDuration = function(e) { if (!arguments.length) { if (this._dirty) { for (var t, i, r = 0, n = this._last, o = 999999999999; n;) t = n._prev, n._dirty && n.totalDuration(), n._startTime > o && this._sortChildren && !n._paused ? this.add(n, n._startTime - n._delay) : o = n._startTime, n._startTime < 0 && !n._paused && (r -= n._startTime, this._timeline.smoothChildTiming && (this._startTime += n._startTime / this._timeScale), this.shiftChildren(-n._startTime, !1, -9999999999), o = 0), i = n._startTime + n._totalDuration / n._timeScale, i > r && (r = i), n = t;
                                        this._duration = this._totalDuration = r, this._dirty = !1 } return this._totalDuration } return 0 !== this.totalDuration() && 0 !== e && this.timeScale(this._totalDuration / e), this }, v.paused = function(t) { if (!t)
                                    for (var i = this._first, r = this._time; i;) i._startTime === r && "isPause" === i.data && (i._rawPrevTime = 0), i = i._next; return e.prototype.paused.apply(this, arguments) }, v.usesFrames = function() { for (var t = this._timeline; t._timeline;) t = t._timeline; return t === e._rootFramesTimeline }, v.rawTime = function() { return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale }, n
                        }, !0), i._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function(e, t, i) { var r = function(t) { e.call(this, t), this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._cycle = 0, this._yoyo = this.vars.yoyo === !0, this._dirty = !0 },
                                n = 1e-10,
                                o = t._internals,
                                a = o.lazyTweens,
                                s = o.lazyRender,
                                h = new i(null, null, 1, 0),
                                l = r.prototype = new e; return l.constructor = r, l.kill()._gc = !1, r.version = "1.18.0", l.invalidate = function() { return this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(!0), e.prototype.invalidate.call(this) }, l.addCallback = function(e, i, r, n) { return this.add(t.delayedCall(0, e, r, n), i) }, l.removeCallback = function(e, t) { if (e)
                                    if (null == t) this._kill(null, e);
                                    else
                                        for (var i = this.getTweensOf(e, !1), r = i.length, n = this._parseTimeOrLabel(t); --r > -1;) i[r]._startTime === n && i[r]._enabled(!1, !1); return this }, l.removePause = function(t) { return this.removeCallback(e._internals.pauseCallback, t) }, l.tweenTo = function(e, i) { i = i || {}; var r, n, o, a = { ease: h, useFrames: this.usesFrames(), immediateRender: !1 }; for (n in i) a[n] = i[n]; return a.time = this._parseTimeOrLabel(e), r = Math.abs(Number(a.time) - this._time) / this._timeScale || .001, o = new t(this, r, a), a.onStart = function() { o.target.paused(!0), o.vars.time !== o.target.time() && r === o.duration() && o.duration(Math.abs(o.vars.time - o.target.time()) / o.target._timeScale), i.onStart && o._callback("onStart") }, o }, l.tweenFromTo = function(e, t, i) { i = i || {}, e = this._parseTimeOrLabel(e), i.startAt = { onComplete: this.seek, onCompleteParams: [e], callbackScope: this }, i.immediateRender = i.immediateRender !== !1; var r = this.tweenTo(t, i); return r.duration(Math.abs(r.vars.time - e) / this._timeScale || .001) }, l.render = function(e, t, i) { this._gc && this._enabled(!0, !1); var r, o, h, l, c, u, d, p = this._dirty ? this.totalDuration() : this._totalDuration,
                                    f = this._duration,
                                    m = this._time,
                                    g = this._totalTime,
                                    v = this._startTime,
                                    y = this._timeScale,
                                    _ = this._rawPrevTime,
                                    x = this._paused,
                                    b = this._cycle; if (e >= p) this._locked || (this._totalTime = p, this._cycle = this._repeat), this._reversed || this._hasPausedChild() || (o = !0, l = "onComplete", c = !!this._timeline.autoRemoveChildren, 0 === this._duration && (0 === e || 0 > _ || _ === n) && _ !== e && this._first && (c = !0, _ > n && (l = "onReverseComplete"))), this._rawPrevTime = this._duration || !t || e || this._rawPrevTime === e ? e : n, this._yoyo && 0 !== (1 & this._cycle) ? this._time = e = 0 : (this._time = f, e = f + 1e-4);
                                else if (1e-7 > e)
                                    if (this._locked || (this._totalTime = this._cycle = 0), this._time = 0, (0 !== m || 0 === f && _ !== n && (_ > 0 || 0 > e && _ >= 0) && !this._locked) && (l = "onReverseComplete", o = this._reversed), 0 > e) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (c = o = !0, l = "onReverseComplete") : _ >= 0 && this._first && (c = !0), this._rawPrevTime = e;
                                    else { if (this._rawPrevTime = f || !t || e || this._rawPrevTime === e ? e : n, 0 === e && o)
                                            for (r = this._first; r && 0 === r._startTime;) r._duration || (o = !1), r = r._next;
                                        e = 0, this._initted || (c = !0) } else if (0 === f && 0 > _ && (c = !0), this._time = this._rawPrevTime = e, this._locked || (this._totalTime = e, 0 !== this._repeat && (u = f + this._repeatDelay, this._cycle = this._totalTime / u >> 0, 0 !== this._cycle && this._cycle === this._totalTime / u && this._cycle--, this._time = this._totalTime - this._cycle * u, this._yoyo && 0 !== (1 & this._cycle) && (this._time = f - this._time), this._time > f ? (this._time = f, e = f + 1e-4) : this._time < 0 ? this._time = e = 0 : e = this._time)), this._hasPause && !this._forcingPlayhead && !t) { if (e = this._time, e >= m)
                                        for (r = this._first; r && r._startTime <= e && !d;) r._duration || "isPause" !== r.data || r.ratio || 0 === r._startTime && 0 === this._rawPrevTime || (d = r), r = r._next;
                                    else
                                        for (r = this._last; r && r._startTime >= e && !d;) r._duration || "isPause" === r.data && r._rawPrevTime > 0 && (d = r), r = r._prev;
                                    d && (this._time = e = d._startTime, this._totalTime = e + this._cycle * (this._totalDuration + this._repeatDelay)) } if (this._cycle !== b && !this._locked) { var w = this._yoyo && 0 !== (1 & b),
                                        T = w === (this._yoyo && 0 !== (1 & this._cycle)),
                                        M = this._totalTime,
                                        S = this._cycle,
                                        C = this._rawPrevTime,
                                        A = this._time; if (this._totalTime = b * f, this._cycle < b ? w = !w : this._totalTime += f, this._time = m, this._rawPrevTime = 0 === f ? _ - 1e-4 : _, this._cycle = b, this._locked = !0, m = w ? 0 : f, this.render(m, t, 0 === f), t || this._gc || this.vars.onRepeat && this._callback("onRepeat"), T && (m = w ? f + 1e-4 : -1e-4, this.render(m, !0, !1)), this._locked = !1, this._paused && !x) return;
                                    this._time = A, this._totalTime = M, this._cycle = S, this._rawPrevTime = C } if (!(this._time !== m && this._first || i || c || d)) return void(g !== this._totalTime && this._onUpdate && (t || this._callback("onUpdate"))); if (this._initted || (this._initted = !0), this._active || !this._paused && this._totalTime !== g && e > 0 && (this._active = !0), 0 === g && this.vars.onStart && 0 !== this._totalTime && (t || this._callback("onStart")), this._time >= m)
                                    for (r = this._first; r && (h = r._next, !this._paused || x);)(r._active || r._startTime <= this._time && !r._paused && !r._gc) && (d === r && this.pause(), r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (e - r._startTime) * r._timeScale, t, i) : r.render((e - r._startTime) * r._timeScale, t, i)), r = h;
                                else
                                    for (r = this._last; r && (h = r._prev, !this._paused || x);) { if (r._active || r._startTime <= m && !r._paused && !r._gc) { if (d === r) { for (d = r._prev; d && d.endTime() > this._time;) d.render(d._reversed ? d.totalDuration() - (e - d._startTime) * d._timeScale : (e - d._startTime) * d._timeScale, t, i), d = d._prev;
                                                d = null, this.pause() } r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (e - r._startTime) * r._timeScale, t, i) : r.render((e - r._startTime) * r._timeScale, t, i) } r = h } this._onUpdate && (t || (a.length && s(), this._callback("onUpdate"))), l && (this._locked || this._gc || (v === this._startTime || y !== this._timeScale) && (0 === this._time || p >= this.totalDuration()) && (o && (a.length && s(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !t && this.vars[l] && this._callback(l))) }, l.getActive = function(e, t, i) { null == e && (e = !0), null == t && (t = !0), null == i && (i = !1); var r, n, o = [],
                                    a = this.getChildren(e, t, i),
                                    s = 0,
                                    h = a.length; for (r = 0; h > r; r++) n = a[r], n.isActive() && (o[s++] = n); return o }, l.getLabelAfter = function(e) { e || 0 !== e && (e = this._time); var t, i = this.getLabelsArray(),
                                    r = i.length; for (t = 0; r > t; t++)
                                    if (i[t].time > e) return i[t].name; return null }, l.getLabelBefore = function(e) { null == e && (e = this._time); for (var t = this.getLabelsArray(), i = t.length; --i > -1;)
                                    if (t[i].time < e) return t[i].name; return null }, l.getLabelsArray = function() { var e, t = [],
                                    i = 0; for (e in this._labels) t[i++] = { time: this._labels[e], name: e }; return t.sort(function(e, t) { return e.time - t.time }), t }, l.progress = function(e, t) { return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - e : e) + this._cycle * (this._duration + this._repeatDelay), t) : this._time / this.duration() }, l.totalProgress = function(e, t) { return arguments.length ? this.totalTime(this.totalDuration() * e, t) : this._totalTime / this.totalDuration() }, l.totalDuration = function(t) { return arguments.length ? -1 === this._repeat ? this : this.duration((t - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (e.prototype.totalDuration.call(this), this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), this._totalDuration) }, l.time = function(e, t) { return arguments.length ? (this._dirty && this.totalDuration(), e > this._duration && (e = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? e = this._duration - e + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (e += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(e, t)) : this._time }, l.repeat = function(e) { return arguments.length ? (this._repeat = e, this._uncache(!0)) : this._repeat }, l.repeatDelay = function(e) { return arguments.length ? (this._repeatDelay = e, this._uncache(!0)) : this._repeatDelay }, l.yoyo = function(e) { return arguments.length ? (this._yoyo = e, this) : this._yoyo }, l.currentLabel = function(e) { return arguments.length ? this.seek(e, !0) : this.getLabelBefore(this._time + 1e-8) }, r }, !0),
                        function() { var e = 180 / Math.PI,
                                t = [],
                                r = [],
                                n = [],
                                o = {},
                                a = i._gsDefine.globals,
                                s = function(e, t, i, r) { this.a = e, this.b = t, this.c = i, this.d = r, this.da = r - e, this.ca = i - e, this.ba = t - e },
                                h = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",
                                l = function(e, t, i, r) { var n = { a: e },
                                        o = {},
                                        a = {},
                                        s = { c: r },
                                        h = (e + t) / 2,
                                        l = (t + i) / 2,
                                        c = (i + r) / 2,
                                        u = (h + l) / 2,
                                        d = (l + c) / 2,
                                        p = (d - u) / 8; return n.b = h + (e - h) / 4, o.b = u + p, n.c = o.a = (n.b + o.b) / 2, o.c = a.a = (u + d) / 2, a.b = d - p, s.b = c + (r - c) / 4, a.c = s.a = (a.b + s.b) / 2, [n, o, a, s] },
                                c = function(e, i, o, a, s) { var h, c, u, d, p, f, m, g, v, y, _, x, b, w = e.length - 1,
                                        T = 0,
                                        M = e[0].a; for (h = 0; w > h; h++) p = e[T], c = p.a, u = p.d, d = e[T + 1].d, s ? (_ = t[h], x = r[h], b = (x + _) * i * .25 / (a ? .5 : n[h] || .5), f = u - (u - c) * (a ? .5 * i : 0 !== _ ? b / _ : 0), m = u + (d - u) * (a ? .5 * i : 0 !== x ? b / x : 0), g = u - (f + ((m - f) * (3 * _ / (_ + x) + .5) / 4 || 0))) : (f = u - (u - c) * i * .5, m = u + (d - u) * i * .5, g = u - (f + m) / 2), f += g, m += g, p.c = v = f, 0 !== h ? p.b = M : p.b = M = p.a + .6 * (p.c - p.a), p.da = u - c, p.ca = v - c, p.ba = M - c, o ? (y = l(c, M, v, u), e.splice(T, 1, y[0], y[1], y[2], y[3]), T += 4) : T++, M = m;
                                    p = e[T], p.b = M, p.c = M + .4 * (p.d - M), p.da = p.d - p.a, p.ca = p.c - p.a, p.ba = M - p.a, o && (y = l(p.a, M, p.c, p.d), e.splice(T, 1, y[0], y[1], y[2], y[3])) },
                                u = function(e, i, n, o) { var a, h, l, c, u, d, p = []; if (o)
                                        for (e = [o].concat(e), h = e.length; --h > -1;) "string" == typeof(d = e[h][i]) && "=" === d.charAt(1) && (e[h][i] = o[i] + Number(d.charAt(0) + d.substr(2))); if (a = e.length - 2, 0 > a) return p[0] = new s(e[0][i], 0, 0, e[-1 > a ? 0 : 1][i]), p; for (h = 0; a > h; h++) l = e[h][i], c = e[h + 1][i], p[h] = new s(l, 0, 0, c), n && (u = e[h + 2][i], t[h] = (t[h] || 0) + (c - l) * (c - l), r[h] = (r[h] || 0) + (u - c) * (u - c)); return p[h] = new s(e[h][i], 0, 0, e[h + 1][i]), p },
                                d = function(e, i, a, s, l, d) { var p, f, m, g, v, y, _, x, b = {},
                                        w = [],
                                        T = d || e[0];
                                    l = "string" == typeof l ? "," + l + "," : h, null == i && (i = 1); for (f in e[0]) w.push(f); if (e.length > 1) { for (x = e[e.length - 1], _ = !0, p = w.length; --p > -1;)
                                            if (f = w[p], Math.abs(T[f] - x[f]) > .05) { _ = !1; break } _ && (e = e.concat(), d && e.unshift(d), e.push(e[1]), d = e[e.length - 3]) } for (t.length = r.length = n.length = 0, p = w.length; --p > -1;) f = w[p], o[f] = -1 !== l.indexOf("," + f + ","), b[f] = u(e, f, o[f], d); for (p = t.length; --p > -1;) t[p] = Math.sqrt(t[p]), r[p] = Math.sqrt(r[p]); if (!s) { for (p = w.length; --p > -1;)
                                            if (o[f])
                                                for (m = b[w[p]], y = m.length - 1, g = 0; y > g; g++) v = m[g + 1].da / r[g] + m[g].da / t[g], n[g] = (n[g] || 0) + v * v; for (p = n.length; --p > -1;) n[p] = Math.sqrt(n[p]) } for (p = w.length, g = a ? 4 : 1; --p > -1;) f = w[p], m = b[f], c(m, i, a, s, o[f]), _ && (m.splice(0, g), m.splice(m.length - g, g)); return b },
                                p = function(e, t, i) { t = t || "soft"; var r, n, o, a, h, l, c, u, d, p, f, m = {},
                                        g = "cubic" === t ? 3 : 2,
                                        v = "soft" === t,
                                        y = []; if (v && i && (e = [i].concat(e)), null == e || e.length < g + 1) throw "invalid Bezier data"; for (d in e[0]) y.push(d); for (l = y.length; --l > -1;) { for (d = y[l], m[d] = h = [], p = 0, u = e.length, c = 0; u > c; c++) r = null == i ? e[c][d] : "string" == typeof(f = e[c][d]) && "=" === f.charAt(1) ? i[d] + Number(f.charAt(0) + f.substr(2)) : Number(f), v && c > 1 && u - 1 > c && (h[p++] = (r + h[p - 2]) / 2), h[p++] = r; for (u = p - g + 1, p = 0, c = 0; u > c; c += g) r = h[c], n = h[c + 1], o = h[c + 2], a = 2 === g ? 0 : h[c + 3], h[p++] = f = 3 === g ? new s(r, n, o, a) : new s(r, (2 * n + r) / 3, (2 * n + o) / 3, o);
                                        h.length = p } return m },
                                f = function(e, t, i) { for (var r, n, o, a, s, h, l, c, u, d, p, f = 1 / i, m = e.length; --m > -1;)
                                        for (d = e[m], o = d.a, a = d.d - o, s = d.c - o, h = d.b - o, r = n = 0, c = 1; i >= c; c++) l = f * c, u = 1 - l, r = n - (n = (l * l * a + 3 * u * (l * s + u * h)) * l), p = m * i + c - 1, t[p] = (t[p] || 0) + r * r },
                                m = function(e, t) { t = t >> 0 || 6; var i, r, n, o, a = [],
                                        s = [],
                                        h = 0,
                                        l = 0,
                                        c = t - 1,
                                        u = [],
                                        d = []; for (i in e) f(e[i], a, t); for (n = a.length, r = 0; n > r; r++) h += Math.sqrt(a[r]), o = r % t, d[o] = h, o === c && (l += h, o = r / t >> 0, u[o] = d, s[o] = l, h = 0, d = []); return { length: l, lengths: s, segments: u } },
                                g = i._gsDefine.plugin({ propName: "bezier", priority: -1, version: "1.3.4", API: 2, global: !0, init: function(e, t, i) { this._target = e, t instanceof Array && (t = { values: t }), this._func = {}, this._round = {}, this._props = [], this._timeRes = null == t.timeResolution ? 6 : parseInt(t.timeResolution, 10); var r, n, o, a, s, h = t.values || [],
                                            l = {},
                                            c = h[0],
                                            u = t.autoRotate || i.vars.orientToBezier;
                                        this._autoRotate = u ? u instanceof Array ? u : [
                                            ["x", "y", "rotation", u === !0 ? 0 : Number(u) || 0]
                                        ] : null; for (r in c) this._props.push(r); for (o = this._props.length; --o > -1;) r = this._props[o], this._overwriteProps.push(r), n = this._func[r] = "function" == typeof e[r], l[r] = n ? e[r.indexOf("set") || "function" != typeof e["get" + r.substr(3)] ? r : "get" + r.substr(3)]() : parseFloat(e[r]), s || l[r] !== h[0][r] && (s = l); if (this._beziers = "cubic" !== t.type && "quadratic" !== t.type && "soft" !== t.type ? d(h, isNaN(t.curviness) ? 1 : t.curviness, !1, "thruBasic" === t.type, t.correlate, s) : p(h, t.type, l), this._segCount = this._beziers[r].length, this._timeRes) { var f = m(this._beziers, this._timeRes);
                                            this._length = f.length, this._lengths = f.lengths, this._segments = f.segments, this._l1 = this._li = this._s1 = this._si = 0, this._l2 = this._lengths[0], this._curSeg = this._segments[0], this._s2 = this._curSeg[0], this._prec = 1 / this._curSeg.length } if (u = this._autoRotate)
                                            for (this._initialRotations = [], u[0] instanceof Array || (this._autoRotate = u = [u]), o = u.length; --o > -1;) { for (a = 0; 3 > a; a++) r = u[o][a], this._func[r] = "function" == typeof e[r] ? e[r.indexOf("set") || "function" != typeof e["get" + r.substr(3)] ? r : "get" + r.substr(3)] : !1;
                                                r = u[o][2], this._initialRotations[o] = this._func[r] ? this._func[r].call(this._target) : this._target[r] }
                                        return this._startRatio = i.vars.runBackwards ? 1 : 0, !0 }, set: function(t) { var i, r, n, o, a, s, h, l, c, u, d = this._segCount,
                                            p = this._func,
                                            f = this._target,
                                            m = t !== this._startRatio; if (this._timeRes) { if (c = this._lengths, u = this._curSeg, t *= this._length, n = this._li, t > this._l2 && d - 1 > n) { for (l = d - 1; l > n && (this._l2 = c[++n]) <= t;);
                                                this._l1 = c[n - 1], this._li = n, this._curSeg = u = this._segments[n], this._s2 = u[this._s1 = this._si = 0] } else if (t < this._l1 && n > 0) { for (; n > 0 && (this._l1 = c[--n]) >= t;);
                                                0 === n && t < this._l1 ? this._l1 = 0 : n++, this._l2 = c[n], this._li = n, this._curSeg = u = this._segments[n], this._s1 = u[(this._si = u.length - 1) - 1] || 0, this._s2 = u[this._si] } if (i = n, t -= this._l1, n = this._si, t > this._s2 && n < u.length - 1) { for (l = u.length - 1; l > n && (this._s2 = u[++n]) <= t;);
                                                this._s1 = u[n - 1], this._si = n } else if (t < this._s1 && n > 0) { for (; n > 0 && (this._s1 = u[--n]) >= t;);
                                                0 === n && t < this._s1 ? this._s1 = 0 : n++, this._s2 = u[n], this._si = n } s = (n + (t - this._s1) / (this._s2 - this._s1)) * this._prec } else i = 0 > t ? 0 : t >= 1 ? d - 1 : d * t >> 0, s = (t - i * (1 / d)) * d; for (r = 1 - s, n = this._props.length; --n > -1;) o = this._props[n], a = this._beziers[o][i], h = (s * s * a.da + 3 * r * (s * a.ca + r * a.ba)) * s + a.a, this._round[o] && (h = Math.round(h)), p[o] ? f[o](h) : f[o] = h; if (this._autoRotate) { var g, v, y, _, x, b, w, T = this._autoRotate; for (n = T.length; --n > -1;) o = T[n][2], b = T[n][3] || 0, w = T[n][4] === !0 ? 1 : e, a = this._beziers[T[n][0]], g = this._beziers[T[n][1]], a && g && (a = a[i], g = g[i], v = a.a + (a.b - a.a) * s, _ = a.b + (a.c - a.b) * s, v += (_ - v) * s, _ += (a.c + (a.d - a.c) * s - _) * s, y = g.a + (g.b - g.a) * s, x = g.b + (g.c - g.b) * s, y += (x - y) * s, x += (g.c + (g.d - g.c) * s - x) * s, h = m ? Math.atan2(x - y, _ - v) * w + b : this._initialRotations[n], p[o] ? f[o](h) : f[o] = h) } } }),
                                v = g.prototype;
                            g.bezierThrough = d, g.cubicToQuadratic = l, g._autoCSS = !0, g.quadraticToCubic = function(e, t, i) { return new s(e, (2 * t + e) / 3, (2 * t + i) / 3, i) }, g._cssRegister = function() { var e = a.CSSPlugin; if (e) { var t = e._internals,
                                        i = t._parseToProxy,
                                        r = t._setPluginRatio,
                                        n = t.CSSPropTween;
                                    t._registerComplexSpecialProp("bezier", { parser: function(e, t, o, a, s, h) { t instanceof Array && (t = { values: t }), h = new g; var l, c, u, d = t.values,
                                                p = d.length - 1,
                                                f = [],
                                                m = {}; if (0 > p) return s; for (l = 0; p >= l; l++) u = i(e, d[l], a, s, h, p !== l), f[l] = u.end; for (c in t) m[c] = t[c]; return m.values = f, s = new n(e, "bezier", 0, 0, u.pt, 2), s.data = u, s.plugin = h, s.setRatio = r, 0 === m.autoRotate && (m.autoRotate = !0), !m.autoRotate || m.autoRotate instanceof Array || (l = m.autoRotate === !0 ? 0 : Number(m.autoRotate), m.autoRotate = null != u.end.left ? [
                                                ["left", "top", "rotation", l, !1]
                                            ] : null != u.end.x ? [
                                                ["x", "y", "rotation", l, !1]
                                            ] : !1), m.autoRotate && (a._transform || a._enableTransforms(!1), u.autoRotate = a._target._gsTransform), h._onInitTween(u.proxy, m, a._tween), s } }) } }, v._roundProps = function(e, t) { for (var i = this._overwriteProps, r = i.length; --r > -1;)(e[i[r]] || e.bezier || e.bezierThrough) && (this._round[i[r]] = t) }, v._kill = function(e) { var t, i, r = this._props; for (t in this._beziers)
                                    if (t in e)
                                        for (delete this._beziers[t], delete this._func[t], i = r.length; --i > -1;) r[i] === t && r.splice(i, 1); return this._super._kill.call(this, e) } }(), i._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function(e, t) {
                            var r, n, o, a, s = function() { e.call(this, "css"), this._overwriteProps.length = 0, this.setRatio = s.prototype.setRatio },
                                h = i._gsDefine.globals,
                                l = {},
                                c = s.prototype = new e("css");
                            c.constructor = s, s.version = "1.18.0", s.API = 2, s.defaultTransformPerspective = 0, s.defaultSkewType = "compensated", s.defaultSmoothOrigin = !0, c = "px", s.suffixMap = { top: c, right: c, bottom: c, left: c, width: c, height: c, fontSize: c, padding: c, margin: c, perspective: c, lineHeight: "" };
                            var u, d, p, f, m, g, v = /(?:\d|\-\d|\.\d|\-\.\d)+/g,
                                y = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
                                _ = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
                                x = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
                                b = /(?:\d|\-|\+|=|#|\.)*/g,
                                w = /opacity *= *([^)]*)/i,
                                T = /opacity:([^;]*)/i,
                                M = /alpha\(opacity *=.+?\)/i,
                                S = /^(rgb|hsl)/,
                                C = /([A-Z])/g,
                                A = /-([a-z])/gi,
                                E = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
                                P = function(e, t) { return t.toUpperCase() },
                                L = /(?:Left|Right|Width)/i,
                                R = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
                                F = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
                                k = /,(?=[^\)]*(?:\(|$))/gi,
                                O = Math.PI / 180,
                                D = 180 / Math.PI,
                                B = {},
                                U = document,
                                z = function(e) { return U.createElementNS ? U.createElementNS("http://www.w3.org/1999/xhtml", e) : U.createElement(e) },
                                N = z("div"),
                                V = z("img"),
                                I = s._internals = { _specialProps: l },
                                G = navigator.userAgent,
                                H = function() { var e = G.indexOf("Android"),
                                        t = z("a"); return p = -1 !== G.indexOf("Safari") && -1 === G.indexOf("Chrome") && (-1 === e || Number(G.substr(e + 8, 1)) > 3), m = p && Number(G.substr(G.indexOf("Version/") + 8, 1)) < 6, f = -1 !== G.indexOf("Firefox"), (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(G) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(G)) && (g = parseFloat(RegExp.$1)), t ? (t.style.cssText = "top:1px;opacity:.55;", /^0.55/.test(t.style.opacity)) : !1 }(),
                                j = function(e) { return w.test("string" == typeof e ? e : (e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1 },
                                W = function(e) { window.console && console.log(e) },
                                X = "",
                                Y = "",
                                q = function(e, t) { t = t || N; var i, r, n = t.style; if (void 0 !== n[e]) return e; for (e = e.charAt(0).toUpperCase() + e.substr(1), i = ["O", "Moz", "ms", "Ms", "Webkit"], r = 5; --r > -1 && void 0 === n[i[r] + e];); return r >= 0 ? (Y = 3 === r ? "ms" : i[r], X = "-" + Y.toLowerCase() + "-", Y + e) : null },
                                K = U.defaultView ? U.defaultView.getComputedStyle : function() {},
                                Z = s.getStyle = function(e, t, i, r, n) { var o; return H || "opacity" !== t ? (!r && e.style[t] ? o = e.style[t] : (i = i || K(e)) ? o = i[t] || i.getPropertyValue(t) || i.getPropertyValue(t.replace(C, "-$1").toLowerCase()) : e.currentStyle && (o = e.currentStyle[t]), null == n || o && "none" !== o && "auto" !== o && "auto auto" !== o ? o : n) : j(e) },
                                Q = I.convertToPixels = function(e, i, r, n, o) { if ("px" === n || !n) return r; if ("auto" === n || !r) return 0; var a, h, l, c = L.test(i),
                                        u = e,
                                        d = N.style,
                                        p = 0 > r; if (p && (r = -r), "%" === n && -1 !== i.indexOf("border")) a = r / 100 * (c ? e.clientWidth : e.clientHeight);
                                    else { if (d.cssText = "border:0 solid red;position:" + Z(e, "position") + ";line-height:0;", "%" !== n && u.appendChild && "v" !== n.charAt(0) && "rem" !== n) d[c ? "borderLeftWidth" : "borderTopWidth"] = r + n;
                                        else { if (u = e.parentNode || U.body, h = u._gsCache, l = t.ticker.frame, h && c && h.time === l) return h.width * r / 100;
                                            d[c ? "width" : "height"] = r + n } u.appendChild(N), a = parseFloat(N[c ? "offsetWidth" : "offsetHeight"]), u.removeChild(N), c && "%" === n && s.cacheWidths !== !1 && (h = u._gsCache = u._gsCache || {}, h.time = l, h.width = a / r * 100), 0 !== a || o || (a = Q(e, i, r, n, !0)) } return p ? -a : a },
                                J = I.calculateOffset = function(e, t, i) { if ("absolute" !== Z(e, "position", i)) return 0; var r = "left" === t ? "Left" : "Top",
                                        n = Z(e, "margin" + r, i); return e["offset" + r] - (Q(e, t, parseFloat(n), n.replace(b, "")) || 0) },
                                $ = function(e, t) { var i, r, n, o = {}; if (t = t || K(e, null))
                                        if (i = t.length)
                                            for (; --i > -1;) n = t[i], (-1 === n.indexOf("-transform") || Ce === n) && (o[n.replace(A, P)] = t.getPropertyValue(n));
                                        else
                                            for (i in t)(-1 === i.indexOf("Transform") || Se === i) && (o[i] = t[i]);
                                    else if (t = e.currentStyle || e.style)
                                        for (i in t) "string" == typeof i && void 0 === o[i] && (o[i.replace(A, P)] = t[i]); return H || (o.opacity = j(e)), r = ze(e, t, !1), o.rotation = r.rotation, o.skewX = r.skewX, o.scaleX = r.scaleX, o.scaleY = r.scaleY, o.x = r.x, o.y = r.y, Ee && (o.z = r.z, o.rotationX = r.rotationX, o.rotationY = r.rotationY, o.scaleZ = r.scaleZ), o.filters && delete o.filters, o },
                                ee = function(e, t, i, r, n) { var o, a, s, h = {},
                                        l = e.style; for (a in i) "cssText" !== a && "length" !== a && isNaN(a) && (t[a] !== (o = i[a]) || n && n[a]) && -1 === a.indexOf("Origin") && ("number" == typeof o || "string" == typeof o) && (h[a] = "auto" !== o || "left" !== a && "top" !== a ? "" !== o && "auto" !== o && "none" !== o || "string" != typeof t[a] || "" === t[a].replace(x, "") ? o : 0 : J(e, a), void 0 !== l[a] && (s = new me(l, a, l[a], s))); if (r)
                                        for (a in r) "className" !== a && (h[a] = r[a]); return { difs: h, firstMPT: s } },
                                te = { width: ["Left", "Right"], height: ["Top", "Bottom"] },
                                ie = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
                                re = function(e, t, i) { var r = parseFloat("width" === t ? e.offsetWidth : e.offsetHeight),
                                        n = te[t],
                                        o = n.length; for (i = i || K(e, null); --o > -1;) r -= parseFloat(Z(e, "padding" + n[o], i, !0)) || 0, r -= parseFloat(Z(e, "border" + n[o] + "Width", i, !0)) || 0; return r },
                                ne = function(e, t) { if ("contain" === e || "auto" === e || "auto auto" === e) return e + " ";
                                    (null == e || "" === e) && (e = "0 0"); var i = e.split(" "),
                                        r = -1 !== e.indexOf("left") ? "0%" : -1 !== e.indexOf("right") ? "100%" : i[0],
                                        n = -1 !== e.indexOf("top") ? "0%" : -1 !== e.indexOf("bottom") ? "100%" : i[1]; return null == n ? n = "center" === r ? "50%" : "0" : "center" === n && (n = "50%"), ("center" === r || isNaN(parseFloat(r)) && -1 === (r + "").indexOf("=")) && (r = "50%"), e = r + " " + n + (i.length > 2 ? " " + i[2] : ""), t && (t.oxp = -1 !== r.indexOf("%"), t.oyp = -1 !== n.indexOf("%"), t.oxr = "=" === r.charAt(1), t.oyr = "=" === n.charAt(1), t.ox = parseFloat(r.replace(x, "")), t.oy = parseFloat(n.replace(x, "")), t.v = e), t || e },
                                oe = function(e, t) { return "string" == typeof e && "=" === e.charAt(1) ? parseInt(e.charAt(0) + "1", 10) * parseFloat(e.substr(2)) : parseFloat(e) - parseFloat(t) },
                                ae = function(e, t) { return null == e ? t : "string" == typeof e && "=" === e.charAt(1) ? parseInt(e.charAt(0) + "1", 10) * parseFloat(e.substr(2)) + t : parseFloat(e) },
                                se = function(e, t, i, r) { var n, o, a, s, h, l = 1e-6; return null == e ? s = t : "number" == typeof e ? s = e : (n = 360, o = e.split("_"), h = "=" === e.charAt(1), a = (h ? parseInt(e.charAt(0) + "1", 10) * parseFloat(o[0].substr(2)) : parseFloat(o[0])) * (-1 === e.indexOf("rad") ? 1 : D) - (h ? 0 : t), o.length && (r && (r[i] = t + a), -1 !== e.indexOf("short") && (a %= n, a !== a % (n / 2) && (a = 0 > a ? a + n : a - n)), -1 !== e.indexOf("_cw") && 0 > a ? a = (a + 9999999999 * n) % n - (a / n | 0) * n : -1 !== e.indexOf("ccw") && a > 0 && (a = (a - 9999999999 * n) % n - (a / n | 0) * n)), s = t + a), l > s && s > -l && (s = 0), s },
                                he = { aqua: [0, 255, 255], lime: [0, 255, 0], silver: [192, 192, 192], black: [0, 0, 0], maroon: [128, 0, 0], teal: [0, 128, 128], blue: [0, 0, 255], navy: [0, 0, 128], white: [255, 255, 255], fuchsia: [255, 0, 255], olive: [128, 128, 0], yellow: [255, 255, 0], orange: [255, 165, 0], gray: [128, 128, 128], purple: [128, 0, 128], green: [0, 128, 0], red: [255, 0, 0], pink: [255, 192, 203], cyan: [0, 255, 255], transparent: [255, 255, 255, 0] },
                                le = function(e, t, i) { return e = 0 > e ? e + 1 : e > 1 ? e - 1 : e, 255 * (1 > 6 * e ? t + (i - t) * e * 6 : .5 > e ? i : 2 > 3 * e ? t + (i - t) * (2 / 3 - e) * 6 : t) + .5 | 0 },
                                ce = s.parseColor = function(e, t) { var i, r, n, o, a, s, h, l, c, u, d; if (e)
                                        if ("number" == typeof e) i = [e >> 16, e >> 8 & 255, 255 & e];
                                        else { if ("," === e.charAt(e.length - 1) && (e = e.substr(0, e.length - 1)), he[e]) i = he[e];
                                            else if ("#" === e.charAt(0)) 4 === e.length && (r = e.charAt(1), n = e.charAt(2), o = e.charAt(3), e = "#" + r + r + n + n + o + o), e = parseInt(e.substr(1), 16), i = [e >> 16, e >> 8 & 255, 255 & e];
                                            else if ("hsl" === e.substr(0, 3))
                                                if (i = d = e.match(v), t) { if (-1 !== e.indexOf("=")) return e.match(y) } else a = Number(i[0]) % 360 / 360, s = Number(i[1]) / 100, h = Number(i[2]) / 100, n = .5 >= h ? h * (s + 1) : h + s - h * s, r = 2 * h - n, i.length > 3 && (i[3] = Number(e[3])), i[0] = le(a + 1 / 3, r, n), i[1] = le(a, r, n), i[2] = le(a - 1 / 3, r, n);
                                            else i = e.match(v) || he.transparent;
                                            i[0] = Number(i[0]), i[1] = Number(i[1]), i[2] = Number(i[2]), i.length > 3 && (i[3] = Number(i[3])) } else i = he.black; return t && !d && (r = i[0] / 255, n = i[1] / 255, o = i[2] / 255, l = Math.max(r, n, o), c = Math.min(r, n, o), h = (l + c) / 2, l === c ? a = s = 0 : (u = l - c, s = h > .5 ? u / (2 - l - c) : u / (l + c), a = l === r ? (n - o) / u + (o > n ? 6 : 0) : l === n ? (o - r) / u + 2 : (r - n) / u + 4, a *= 60), i[0] = a + .5 | 0, i[1] = 100 * s + .5 | 0, i[2] = 100 * h + .5 | 0), i },
                                ue = function(e, t) { var i, r, n, o = e.match(de) || [],
                                        a = 0,
                                        s = o.length ? "" : e; for (i = 0; i < o.length; i++) r = o[i], n = e.substr(a, e.indexOf(r, a) - a), a += n.length + r.length, r = ce(r, t), 3 === r.length && r.push(1), s += n + (t ? "hsla(" + r[0] + "," + r[1] + "%," + r[2] + "%," + r[3] : "rgba(" + r.join(",")) + ")"; return s },
                                de = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";
                            for (c in he) de += "|" + c + "\\b";
                            de = new RegExp(de + ")", "gi"), s.colorStringFilter = function(e) { var t, i = e[0] + e[1];
                                de.lastIndex = 0, de.test(i) && (t = -1 !== i.indexOf("hsl(") || -1 !== i.indexOf("hsla("), e[0] = ue(e[0], t), e[1] = ue(e[1], t)) }, t.defaultStringFilter || (t.defaultStringFilter = s.colorStringFilter);
                            var pe = function(e, t, i, r) { if (null == e) return function(e) { return e }; var n, o = t ? (e.match(de) || [""])[0] : "",
                                        a = e.split(o).join("").match(_) || [],
                                        s = e.substr(0, e.indexOf(a[0])),
                                        h = ")" === e.charAt(e.length - 1) ? ")" : "",
                                        l = -1 !== e.indexOf(" ") ? " " : ",",
                                        c = a.length,
                                        u = c > 0 ? a[0].replace(v, "") : ""; return c ? n = t ? function(e) { var t, d, p, f; if ("number" == typeof e) e += u;
                                        else if (r && k.test(e)) { for (f = e.replace(k, "|").split("|"), p = 0; p < f.length; p++) f[p] = n(f[p]); return f.join(",") } if (t = (e.match(de) || [o])[0], d = e.split(t).join("").match(_) || [], p = d.length, c > p--)
                                            for (; ++p < c;) d[p] = i ? d[(p - 1) / 2 | 0] : a[p]; return s + d.join(l) + l + t + h + (-1 !== e.indexOf("inset") ? " inset" : "") } : function(e) { var t, o, d; if ("number" == typeof e) e += u;
                                        else if (r && k.test(e)) { for (o = e.replace(k, "|").split("|"), d = 0; d < o.length; d++) o[d] = n(o[d]); return o.join(",") } if (t = e.match(_) || [], d = t.length, c > d--)
                                            for (; ++d < c;) t[d] = i ? t[(d - 1) / 2 | 0] : a[d]; return s + t.join(l) + h } : function(e) { return e } },
                                fe = function(e) { return e = e.split(","),
                                        function(t, i, r, n, o, a, s) { var h, l = (i + "").split(" "); for (s = {}, h = 0; 4 > h; h++) s[e[h]] = l[h] = l[h] || l[(h - 1) / 2 >> 0]; return n.parse(t, s, o, a) } },
                                me = (I._setPluginRatio = function(e) { this.plugin.setRatio(e); for (var t, i, r, n, o = this.data, a = o.proxy, s = o.firstMPT, h = 1e-6; s;) t = a[s.v], s.r ? t = Math.round(t) : h > t && t > -h && (t = 0), s.t[s.p] = t, s = s._next; if (o.autoRotate && (o.autoRotate.rotation = a.rotation), 1 === e)
                                        for (s = o.firstMPT; s;) { if (i = s.t, i.type) { if (1 === i.type) { for (n = i.xs0 + i.s + i.xs1, r = 1; r < i.l; r++) n += i["xn" + r] + i["xs" + (r + 1)];
                                                    i.e = n } } else i.e = i.s + i.xs0;
                                            s = s._next } }, function(e, t, i, r, n) { this.t = e, this.p = t, this.v = i, this.r = n, r && (r._prev = this, this._next = r) }),
                                ge = (I._parseToProxy = function(e, t, i, r, n, o) { var a, s, h, l, c, u = r,
                                        d = {},
                                        p = {},
                                        f = i._transform,
                                        m = B; for (i._transform = null, B = t, r = c = i.parse(e, t, r, n), B = m, o && (i._transform = f, u && (u._prev = null, u._prev && (u._prev._next = null))); r && r !== u;) { if (r.type <= 1 && (s = r.p, p[s] = r.s + r.c, d[s] = r.s, o || (l = new me(r, "s", s, l, r.r), r.c = 0), 1 === r.type))
                                            for (a = r.l; --a > 0;) h = "xn" + a, s = r.p + "_" + h, p[s] = r.data[h], d[s] = r[h], o || (l = new me(r, h, s, l, r.rxp[h]));
                                        r = r._next } return { proxy: d, end: p, firstMPT: l, pt: c } }, I.CSSPropTween = function(e, t, i, n, o, s, h, l, c, u, d) { this.t = e, this.p = t, this.s = i, this.c = n, this.n = h || t, e instanceof ge || a.push(this.n), this.r = l, this.type = s || 0, c && (this.pr = c, r = !0), this.b = void 0 === u ? i : u, this.e = void 0 === d ? i + n : d, o && (this._next = o, o._prev = this) }),
                                ve = function(e, t, i, r, n, o) { var a = new ge(e, t, i, r - i, n, -1, o); return a.b = i, a.e = a.xs0 = r, a },
                                ye = s.parseComplex = function(e, t, i, r, n, o, a, s, h, l) { i = i || o || "", a = new ge(e, t, 0, 0, a, l ? 2 : 1, null, !1, s, i, r), r += ""; var c, d, p, f, m, g, _, x, b, w, T, M, S, C = i.split(", ").join(",").split(" "),
                                        A = r.split(", ").join(",").split(" "),
                                        E = C.length,
                                        P = u !== !1; for ((-1 !== r.indexOf(",") || -1 !== i.indexOf(",")) && (C = C.join(" ").replace(k, ", ").split(" "), A = A.join(" ").replace(k, ", ").split(" "), E = C.length), E !== A.length && (C = (o || "").split(" "), E = C.length), a.plugin = h, a.setRatio = l, de.lastIndex = 0, c = 0; E > c; c++)
                                        if (f = C[c], m = A[c], x = parseFloat(f), x || 0 === x) a.appendXtra("", x, oe(m, x), m.replace(y, ""), P && -1 !== m.indexOf("px"), !0);
                                        else if (n && de.test(f)) M = "," === m.charAt(m.length - 1) ? ")," : ")", S = -1 !== m.indexOf("hsl") && H, f = ce(f, S), m = ce(m, S), b = f.length + m.length > 6, b && !H && 0 === m[3] ? (a["xs" + a.l] += a.l ? " transparent" : "transparent", a.e = a.e.split(A[c]).join("transparent")) : (H || (b = !1), S ? a.appendXtra(b ? "hsla(" : "hsl(", f[0], oe(m[0], f[0]), ",", !1, !0).appendXtra("", f[1], oe(m[1], f[1]), "%,", !1).appendXtra("", f[2], oe(m[2], f[2]), b ? "%," : "%" + M, !1) : a.appendXtra(b ? "rgba(" : "rgb(", f[0], m[0] - f[0], ",", !0, !0).appendXtra("", f[1], m[1] - f[1], ",", !0).appendXtra("", f[2], m[2] - f[2], b ? "," : M, !0), b && (f = f.length < 4 ? 1 : f[3], a.appendXtra("", f, (m.length < 4 ? 1 : m[3]) - f, M, !1))), de.lastIndex = 0;
                                    else if (g = f.match(v)) { if (_ = m.match(y), !_ || _.length !== g.length) return a; for (p = 0, d = 0; d < g.length; d++) T = g[d], w = f.indexOf(T, p), a.appendXtra(f.substr(p, w - p), Number(T), oe(_[d], T), "", P && "px" === f.substr(w + T.length, 2), 0 === d), p = w + T.length;
                                        a["xs" + a.l] += f.substr(p) } else a["xs" + a.l] += a.l ? " " + f : f; if (-1 !== r.indexOf("=") && a.data) { for (M = a.xs0 + a.data.s, c = 1; c < a.l; c++) M += a["xs" + c] + a.data["xn" + c];
                                        a.e = M + a["xs" + c] } return a.l || (a.type = -1, a.xs0 = a.e), a.xfirst || a },
                                _e = 9;
                            for (c = ge.prototype, c.l = c.pr = 0; --_e > 0;) c["xn" + _e] = 0, c["xs" + _e] = "";
                            c.xs0 = "", c._next = c._prev = c.xfirst = c.data = c.plugin = c.setRatio = c.rxp = null, c.appendXtra = function(e, t, i, r, n, o) {
                                var a = this,
                                    s = a.l;
                                return a["xs" + s] += o && s ? " " + e : e || "", i || 0 === s || a.plugin ? (a.l++, a.type = a.setRatio ? 2 : 1, a["xs" + a.l] = r || "", s > 0 ? (a.data["xn" + s] = t + i, a.rxp["xn" + s] = n, a["xn" + s] = t, a.plugin || (a.xfirst = new ge(a, "xn" + s, t, i, a.xfirst || a, 0, a.n, n, a.pr), a.xfirst.xs0 = 0), a) : (a.data = { s: t + i }, a.rxp = {}, a.s = t, a.c = i,
                                    a.r = n, a)) : (a["xs" + s] += t + (r || ""), a)
                            };
                            var xe = function(e, t) { t = t || {}, this.p = t.prefix ? q(e) || e : e, l[e] = l[this.p] = this, this.format = t.formatter || pe(t.defaultValue, t.color, t.collapsible, t.multi), t.parser && (this.parse = t.parser), this.clrs = t.color, this.multi = t.multi, this.keyword = t.keyword, this.dflt = t.defaultValue, this.pr = t.priority || 0 },
                                be = I._registerComplexSpecialProp = function(e, t, i) { "object" != typeof t && (t = { parser: i }); var r, n, o = e.split(","),
                                        a = t.defaultValue; for (i = i || [a], r = 0; r < o.length; r++) t.prefix = 0 === r && t.prefix, t.defaultValue = i[r] || a, n = new xe(o[r], t) },
                                we = function(e) { if (!l[e]) { var t = e.charAt(0).toUpperCase() + e.substr(1) + "Plugin";
                                        be(e, { parser: function(e, i, r, n, o, a, s) { var c = h.com.greensock.plugins[t]; return c ? (c._cssRegister(), l[r].parse(e, i, r, n, o, a, s)) : (W("Error: " + t + " js file not loaded."), o) } }) } };
                            c = xe.prototype, c.parseComplex = function(e, t, i, r, n, o) { var a, s, h, l, c, u, d = this.keyword; if (this.multi && (k.test(i) || k.test(t) ? (s = t.replace(k, "|").split("|"), h = i.replace(k, "|").split("|")) : d && (s = [t], h = [i])), h) { for (l = h.length > s.length ? h.length : s.length, a = 0; l > a; a++) t = s[a] = s[a] || this.dflt, i = h[a] = h[a] || this.dflt, d && (c = t.indexOf(d), u = i.indexOf(d), c !== u && (-1 === u ? s[a] = s[a].split(d).join("") : -1 === c && (s[a] += " " + d)));
                                    t = s.join(", "), i = h.join(", ") } return ye(e, this.p, t, i, this.clrs, this.dflt, r, this.pr, n, o) }, c.parse = function(e, t, i, r, n, a, s) { return this.parseComplex(e.style, this.format(Z(e, this.p, o, !1, this.dflt)), this.format(t), n, a) }, s.registerSpecialProp = function(e, t, i) { be(e, { parser: function(e, r, n, o, a, s, h) { var l = new ge(e, n, 0, 0, a, 2, n, !1, i); return l.plugin = s, l.setRatio = t(e, r, o._tween, n), l }, priority: i }) }, s.useSVGTransformAttr = p || f;
                            var Te, Me = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),
                                Se = q("transform"),
                                Ce = X + "transform",
                                Ae = q("transformOrigin"),
                                Ee = null !== q("perspective"),
                                Pe = I.Transform = function() { this.perspective = parseFloat(s.defaultTransformPerspective) || 0, this.force3D = s.defaultForce3D !== !1 && Ee ? s.defaultForce3D || "auto" : !1 },
                                Le = window.SVGElement,
                                Re = function(e, t, i) { var r, n = U.createElementNS("http://www.w3.org/2000/svg", e),
                                        o = /([a-z])([A-Z])/g; for (r in i) n.setAttributeNS(null, r.replace(o, "$1-$2").toLowerCase(), i[r]); return t.appendChild(n), n },
                                Fe = U.documentElement,
                                ke = function() { var e, t, i, r = g || /Android/i.test(G) && !window.chrome; return U.createElementNS && !r && (e = Re("svg", Fe), t = Re("rect", e, { width: 100, height: 50, x: 100 }), i = t.getBoundingClientRect().width, t.style[Ae] = "50% 50%", t.style[Se] = "scaleX(0.5)", r = i === t.getBoundingClientRect().width && !(f && Ee), Fe.removeChild(e)), r }(),
                                Oe = function(e, t, i, r, n) { var o, a, h, l, c, u, d, p, f, m, g, v, y, _, x = e._gsTransform,
                                        b = Ue(e, !0);
                                    x && (y = x.xOrigin, _ = x.yOrigin), (!r || (o = r.split(" ")).length < 2) && (d = e.getBBox(), t = ne(t).split(" "), o = [(-1 !== t[0].indexOf("%") ? parseFloat(t[0]) / 100 * d.width : parseFloat(t[0])) + d.x, (-1 !== t[1].indexOf("%") ? parseFloat(t[1]) / 100 * d.height : parseFloat(t[1])) + d.y]), i.xOrigin = l = parseFloat(o[0]), i.yOrigin = c = parseFloat(o[1]), r && b !== Be && (u = b[0], d = b[1], p = b[2], f = b[3], m = b[4], g = b[5], v = u * f - d * p, a = l * (f / v) + c * (-p / v) + (p * g - f * m) / v, h = l * (-d / v) + c * (u / v) - (u * g - d * m) / v, l = i.xOrigin = o[0] = a, c = i.yOrigin = o[1] = h), x && (n || n !== !1 && s.defaultSmoothOrigin !== !1 ? (a = l - y, h = c - _, x.xOffset += a * b[0] + h * b[2] - a, x.yOffset += a * b[1] + h * b[3] - h) : x.xOffset = x.yOffset = 0), e.setAttribute("data-svg-origin", o.join(" ")) },
                                De = function(e) { return !!(Le && "function" == typeof e.getBBox && e.getCTM && (!e.parentNode || e.parentNode.getBBox && e.parentNode.getCTM)) },
                                Be = [1, 0, 0, 1, 0, 0],
                                Ue = function(e, t) { var i, r, n, o, a, s = e._gsTransform || new Pe,
                                        h = 1e5; if (Se ? r = Z(e, Ce, null, !0) : e.currentStyle && (r = e.currentStyle.filter.match(R), r = r && 4 === r.length ? [r[0].substr(4), Number(r[2].substr(4)), Number(r[1].substr(4)), r[3].substr(4), s.x || 0, s.y || 0].join(",") : ""), i = !r || "none" === r || "matrix(1, 0, 0, 1, 0, 0)" === r, (s.svg || e.getBBox && De(e)) && (i && -1 !== (e.style[Se] + "").indexOf("matrix") && (r = e.style[Se], i = 0), n = e.getAttribute("transform"), i && n && (-1 !== n.indexOf("matrix") ? (r = n, i = 0) : -1 !== n.indexOf("translate") && (r = "matrix(1,0,0,1," + n.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") + ")", i = 0))), i) return Be; for (n = (r || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [], _e = n.length; --_e > -1;) o = Number(n[_e]), n[_e] = (a = o - (o |= 0)) ? (a * h + (0 > a ? -.5 : .5) | 0) / h + o : o; return t && n.length > 6 ? [n[0], n[1], n[4], n[5], n[12], n[13]] : n },
                                ze = I.getTransform = function(e, i, r, n) { if (e._gsTransform && r && !n) return e._gsTransform; var a, h, l, c, u, d, p = r ? e._gsTransform || new Pe : new Pe,
                                        f = p.scaleX < 0,
                                        m = 2e-5,
                                        g = 1e5,
                                        v = Ee ? parseFloat(Z(e, Ae, i, !1, "0 0 0").split(" ")[2]) || p.zOrigin || 0 : 0,
                                        y = parseFloat(s.defaultTransformPerspective) || 0; if (p.svg = !(!e.getBBox || !De(e)), p.svg && (Oe(e, Z(e, Ae, o, !1, "50% 50%") + "", p, e.getAttribute("data-svg-origin")), Te = s.useSVGTransformAttr || ke), a = Ue(e), a !== Be) { if (16 === a.length) { var _, x, b, w, T, M = a[0],
                                                S = a[1],
                                                C = a[2],
                                                A = a[3],
                                                E = a[4],
                                                P = a[5],
                                                L = a[6],
                                                R = a[7],
                                                F = a[8],
                                                k = a[9],
                                                O = a[10],
                                                B = a[12],
                                                U = a[13],
                                                z = a[14],
                                                N = a[11],
                                                V = Math.atan2(L, O);
                                            p.zOrigin && (z = -p.zOrigin, B = F * z - a[12], U = k * z - a[13], z = O * z + p.zOrigin - a[14]), p.rotationX = V * D, V && (w = Math.cos(-V), T = Math.sin(-V), _ = E * w + F * T, x = P * w + k * T, b = L * w + O * T, F = E * -T + F * w, k = P * -T + k * w, O = L * -T + O * w, N = R * -T + N * w, E = _, P = x, L = b), V = Math.atan2(F, O), p.rotationY = V * D, V && (w = Math.cos(-V), T = Math.sin(-V), _ = M * w - F * T, x = S * w - k * T, b = C * w - O * T, k = S * T + k * w, O = C * T + O * w, N = A * T + N * w, M = _, S = x, C = b), V = Math.atan2(S, M), p.rotation = V * D, V && (w = Math.cos(-V), T = Math.sin(-V), M = M * w + E * T, x = S * w + P * T, P = S * -T + P * w, L = C * -T + L * w, S = x), p.rotationX && Math.abs(p.rotationX) + Math.abs(p.rotation) > 359.9 && (p.rotationX = p.rotation = 0, p.rotationY += 180), p.scaleX = (Math.sqrt(M * M + S * S) * g + .5 | 0) / g, p.scaleY = (Math.sqrt(P * P + k * k) * g + .5 | 0) / g, p.scaleZ = (Math.sqrt(L * L + O * O) * g + .5 | 0) / g, p.skewX = 0, p.perspective = N ? 1 / (0 > N ? -N : N) : 0, p.x = B, p.y = U, p.z = z, p.svg && (p.x -= p.xOrigin - (p.xOrigin * M - p.yOrigin * E), p.y -= p.yOrigin - (p.yOrigin * S - p.xOrigin * P)) } else if ((!Ee || n || !a.length || p.x !== a[4] || p.y !== a[5] || !p.rotationX && !p.rotationY) && (void 0 === p.x || "none" !== Z(e, "display", i))) { var I = a.length >= 6,
                                                G = I ? a[0] : 1,
                                                H = a[1] || 0,
                                                j = a[2] || 0,
                                                W = I ? a[3] : 1;
                                            p.x = a[4] || 0, p.y = a[5] || 0, l = Math.sqrt(G * G + H * H), c = Math.sqrt(W * W + j * j), u = G || H ? Math.atan2(H, G) * D : p.rotation || 0, d = j || W ? Math.atan2(j, W) * D + u : p.skewX || 0, Math.abs(d) > 90 && Math.abs(d) < 270 && (f ? (l *= -1, d += 0 >= u ? 180 : -180, u += 0 >= u ? 180 : -180) : (c *= -1, d += 0 >= d ? 180 : -180)), p.scaleX = l, p.scaleY = c, p.rotation = u, p.skewX = d, Ee && (p.rotationX = p.rotationY = p.z = 0, p.perspective = y, p.scaleZ = 1), p.svg && (p.x -= p.xOrigin - (p.xOrigin * G + p.yOrigin * j), p.y -= p.yOrigin - (p.xOrigin * H + p.yOrigin * W)) } p.zOrigin = v; for (h in p) p[h] < m && p[h] > -m && (p[h] = 0) } return r && (e._gsTransform = p, p.svg && (Te && e.style[Se] ? t.delayedCall(.001, function() { Ge(e.style, Se) }) : !Te && e.getAttribute("transform") && t.delayedCall(.001, function() { e.removeAttribute("transform") }))), p },
                                Ne = function(e) { var t, i, r = this.data,
                                        n = -r.rotation * O,
                                        o = n + r.skewX * O,
                                        a = 1e5,
                                        s = (Math.cos(n) * r.scaleX * a | 0) / a,
                                        h = (Math.sin(n) * r.scaleX * a | 0) / a,
                                        l = (Math.sin(o) * -r.scaleY * a | 0) / a,
                                        c = (Math.cos(o) * r.scaleY * a | 0) / a,
                                        u = this.t.style,
                                        d = this.t.currentStyle; if (d) { i = h, h = -l, l = -i, t = d.filter, u.filter = ""; var p, f, m = this.t.offsetWidth,
                                            v = this.t.offsetHeight,
                                            y = "absolute" !== d.position,
                                            _ = "progid:DXImageTransform.Microsoft.Matrix(M11=" + s + ", M12=" + h + ", M21=" + l + ", M22=" + c,
                                            x = r.x + m * r.xPercent / 100,
                                            T = r.y + v * r.yPercent / 100; if (null != r.ox && (p = (r.oxp ? m * r.ox * .01 : r.ox) - m / 2, f = (r.oyp ? v * r.oy * .01 : r.oy) - v / 2, x += p - (p * s + f * h), T += f - (p * l + f * c)), y ? (p = m / 2, f = v / 2, _ += ", Dx=" + (p - (p * s + f * h) + x) + ", Dy=" + (f - (p * l + f * c) + T) + ")") : _ += ", sizingMethod='auto expand')", -1 !== t.indexOf("DXImageTransform.Microsoft.Matrix(") ? u.filter = t.replace(F, _) : u.filter = _ + " " + t, (0 === e || 1 === e) && 1 === s && 0 === h && 0 === l && 1 === c && (y && -1 === _.indexOf("Dx=0, Dy=0") || w.test(t) && 100 !== parseFloat(RegExp.$1) || -1 === t.indexOf(t.indexOf("Alpha")) && u.removeAttribute("filter")), !y) { var M, S, C, A = 8 > g ? 1 : -1; for (p = r.ieOffsetX || 0, f = r.ieOffsetY || 0, r.ieOffsetX = Math.round((m - ((0 > s ? -s : s) * m + (0 > h ? -h : h) * v)) / 2 + x), r.ieOffsetY = Math.round((v - ((0 > c ? -c : c) * v + (0 > l ? -l : l) * m)) / 2 + T), _e = 0; 4 > _e; _e++) S = ie[_e], M = d[S], i = -1 !== M.indexOf("px") ? parseFloat(M) : Q(this.t, S, parseFloat(M), M.replace(b, "")) || 0, C = i !== r[S] ? 2 > _e ? -r.ieOffsetX : -r.ieOffsetY : 2 > _e ? p - r.ieOffsetX : f - r.ieOffsetY, u[S] = (r[S] = Math.round(i - C * (0 === _e || 2 === _e ? 1 : A))) + "px" } } },
                                Ve = I.set3DTransformRatio = I.setTransformRatio = function(e) { var t, i, r, n, o, a, s, h, l, c, u, d, p, m, g, v, y, _, x, b, w, T, M, S = this.data,
                                        C = this.t.style,
                                        A = S.rotation,
                                        E = S.rotationX,
                                        P = S.rotationY,
                                        L = S.scaleX,
                                        R = S.scaleY,
                                        F = S.scaleZ,
                                        k = S.x,
                                        D = S.y,
                                        B = S.z,
                                        U = S.svg,
                                        z = S.perspective,
                                        N = S.force3D; if (((1 === e || 0 === e) && "auto" === N && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime) || !N) && !B && !z && !P && !E || Te && U || !Ee) return void(A || S.skewX || U ? (A *= O, T = S.skewX * O, M = 1e5, t = Math.cos(A) * L, n = Math.sin(A) * L, i = Math.sin(A - T) * -R, o = Math.cos(A - T) * R, T && "simple" === S.skewType && (y = Math.tan(T), y = Math.sqrt(1 + y * y), i *= y, o *= y, S.skewY && (t *= y, n *= y)), U && (k += S.xOrigin - (S.xOrigin * t + S.yOrigin * i) + S.xOffset, D += S.yOrigin - (S.xOrigin * n + S.yOrigin * o) + S.yOffset, Te && (S.xPercent || S.yPercent) && (m = this.t.getBBox(), k += .01 * S.xPercent * m.width, D += .01 * S.yPercent * m.height), m = 1e-6, m > k && k > -m && (k = 0), m > D && D > -m && (D = 0)), x = (t * M | 0) / M + "," + (n * M | 0) / M + "," + (i * M | 0) / M + "," + (o * M | 0) / M + "," + k + "," + D + ")", U && Te ? this.t.setAttribute("transform", "matrix(" + x) : C[Se] = (S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) matrix(" : "matrix(") + x) : C[Se] = (S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) matrix(" : "matrix(") + L + ",0,0," + R + "," + k + "," + D + ")"); if (f && (m = 1e-4, m > L && L > -m && (L = F = 2e-5), m > R && R > -m && (R = F = 2e-5), !z || S.z || S.rotationX || S.rotationY || (z = 0)), A || S.skewX) A *= O, g = t = Math.cos(A), v = n = Math.sin(A), S.skewX && (A -= S.skewX * O, g = Math.cos(A), v = Math.sin(A), "simple" === S.skewType && (y = Math.tan(S.skewX * O), y = Math.sqrt(1 + y * y), g *= y, v *= y, S.skewY && (t *= y, n *= y))), i = -v, o = g;
                                    else { if (!(P || E || 1 !== F || z || U)) return void(C[Se] = (S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) translate3d(" : "translate3d(") + k + "px," + D + "px," + B + "px)" + (1 !== L || 1 !== R ? " scale(" + L + "," + R + ")" : ""));
                                        t = o = 1, i = n = 0 } l = 1, r = a = s = h = c = u = 0, d = z ? -1 / z : 0, p = S.zOrigin, m = 1e-6, b = ",", w = "0", A = P * O, A && (g = Math.cos(A), v = Math.sin(A), s = -v, c = d * -v, r = t * v, a = n * v, l = g, d *= g, t *= g, n *= g), A = E * O, A && (g = Math.cos(A), v = Math.sin(A), y = i * g + r * v, _ = o * g + a * v, h = l * v, u = d * v, r = i * -v + r * g, a = o * -v + a * g, l *= g, d *= g, i = y, o = _), 1 !== F && (r *= F, a *= F, l *= F, d *= F), 1 !== R && (i *= R, o *= R, h *= R, u *= R), 1 !== L && (t *= L, n *= L, s *= L, c *= L), (p || U) && (p && (k += r * -p, D += a * -p, B += l * -p + p), U && (k += S.xOrigin - (S.xOrigin * t + S.yOrigin * i) + S.xOffset, D += S.yOrigin - (S.xOrigin * n + S.yOrigin * o) + S.yOffset), m > k && k > -m && (k = w), m > D && D > -m && (D = w), m > B && B > -m && (B = 0)), x = S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) matrix3d(" : "matrix3d(", x += (m > t && t > -m ? w : t) + b + (m > n && n > -m ? w : n) + b + (m > s && s > -m ? w : s), x += b + (m > c && c > -m ? w : c) + b + (m > i && i > -m ? w : i) + b + (m > o && o > -m ? w : o), E || P ? (x += b + (m > h && h > -m ? w : h) + b + (m > u && u > -m ? w : u) + b + (m > r && r > -m ? w : r), x += b + (m > a && a > -m ? w : a) + b + (m > l && l > -m ? w : l) + b + (m > d && d > -m ? w : d) + b) : x += ",0,0,0,0,1,0,", x += k + b + D + b + B + b + (z ? 1 + -B / z : 1) + ")", C[Se] = x };
                            c = Pe.prototype, c.x = c.y = c.z = c.skewX = c.skewY = c.rotation = c.rotationX = c.rotationY = c.zOrigin = c.xPercent = c.yPercent = c.xOffset = c.yOffset = 0, c.scaleX = c.scaleY = c.scaleZ = 1, be("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", { parser: function(e, t, i, r, n, a, h) { if (r._lastParsedTransform === h) return n;
                                    r._lastParsedTransform = h; var l, c, u, d, p, f, m, g, v, y, _ = e._gsTransform,
                                        x = e.style,
                                        b = 1e-6,
                                        w = Me.length,
                                        T = h,
                                        M = {},
                                        S = "transformOrigin"; if (h.display ? (d = Z(e, "display"), x.display = "block", l = ze(e, o, !0, h.parseTransform), x.display = d) : l = ze(e, o, !0, h.parseTransform), r._transform = l, "string" == typeof T.transform && Se) d = N.style, d[Se] = T.transform, d.display = "block", d.position = "absolute", U.body.appendChild(N), c = ze(N, null, !1), U.body.removeChild(N), c.perspective || (c.perspective = l.perspective), null != T.xPercent && (c.xPercent = ae(T.xPercent, l.xPercent)), null != T.yPercent && (c.yPercent = ae(T.yPercent, l.yPercent));
                                    else if ("object" == typeof T) { if (c = { scaleX: ae(null != T.scaleX ? T.scaleX : T.scale, l.scaleX), scaleY: ae(null != T.scaleY ? T.scaleY : T.scale, l.scaleY), scaleZ: ae(T.scaleZ, l.scaleZ), x: ae(T.x, l.x), y: ae(T.y, l.y), z: ae(T.z, l.z), xPercent: ae(T.xPercent, l.xPercent), yPercent: ae(T.yPercent, l.yPercent), perspective: ae(T.transformPerspective, l.perspective) }, g = T.directionalRotation, null != g)
                                            if ("object" == typeof g)
                                                for (d in g) T[d] = g[d];
                                            else T.rotation = g; "string" == typeof T.x && -1 !== T.x.indexOf("%") && (c.x = 0, c.xPercent = ae(T.x, l.xPercent)), "string" == typeof T.y && -1 !== T.y.indexOf("%") && (c.y = 0, c.yPercent = ae(T.y, l.yPercent)), c.rotation = se("rotation" in T ? T.rotation : "shortRotation" in T ? T.shortRotation + "_short" : "rotationZ" in T ? T.rotationZ : l.rotation, l.rotation, "rotation", M), Ee && (c.rotationX = se("rotationX" in T ? T.rotationX : "shortRotationX" in T ? T.shortRotationX + "_short" : l.rotationX || 0, l.rotationX, "rotationX", M), c.rotationY = se("rotationY" in T ? T.rotationY : "shortRotationY" in T ? T.shortRotationY + "_short" : l.rotationY || 0, l.rotationY, "rotationY", M)), c.skewX = null == T.skewX ? l.skewX : se(T.skewX, l.skewX), c.skewY = null == T.skewY ? l.skewY : se(T.skewY, l.skewY), (u = c.skewY - l.skewY) && (c.skewX += u, c.rotation += u) } for (Ee && null != T.force3D && (l.force3D = T.force3D, m = !0), l.skewType = T.skewType || l.skewType || s.defaultSkewType, f = l.force3D || l.z || l.rotationX || l.rotationY || c.z || c.rotationX || c.rotationY || c.perspective, f || null == T.scale || (c.scaleZ = 1); --w > -1;) i = Me[w], p = c[i] - l[i], (p > b || -b > p || null != T[i] || null != B[i]) && (m = !0, n = new ge(l, i, l[i], p, n), i in M && (n.e = M[i]), n.xs0 = 0, n.plugin = a, r._overwriteProps.push(n.n)); return p = T.transformOrigin, l.svg && (p || T.svgOrigin) && (v = l.xOffset, y = l.yOffset, Oe(e, ne(p), c, T.svgOrigin, T.smoothOrigin), n = ve(l, "xOrigin", (_ ? l : c).xOrigin, c.xOrigin, n, S), n = ve(l, "yOrigin", (_ ? l : c).yOrigin, c.yOrigin, n, S), (v !== l.xOffset || y !== l.yOffset) && (n = ve(l, "xOffset", _ ? v : l.xOffset, l.xOffset, n, S), n = ve(l, "yOffset", _ ? y : l.yOffset, l.yOffset, n, S)), p = Te ? null : "0px 0px"), (p || Ee && f && l.zOrigin) && (Se ? (m = !0, i = Ae, p = (p || Z(e, i, o, !1, "50% 50%")) + "", n = new ge(x, i, 0, 0, n, -1, S), n.b = x[i], n.plugin = a, Ee ? (d = l.zOrigin, p = p.split(" "), l.zOrigin = (p.length > 2 && (0 === d || "0px" !== p[2]) ? parseFloat(p[2]) : d) || 0, n.xs0 = n.e = p[0] + " " + (p[1] || "50%") + " 0px", n = new ge(l, "zOrigin", 0, 0, n, -1, n.n), n.b = d, n.xs0 = n.e = l.zOrigin) : n.xs0 = n.e = p) : ne(p + "", l)), m && (r._transformType = l.svg && Te || !f && 3 !== this._transformType ? 2 : 3), n }, prefix: !0 }), be("boxShadow", { defaultValue: "0px 0px 0px 0px #999", prefix: !0, color: !0, multi: !0, keyword: "inset" }), be("borderRadius", { defaultValue: "0px", parser: function(e, t, i, r, a, s) { t = this.format(t); var h, l, c, u, d, p, f, m, g, v, y, _, x, b, w, T, M = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                                        S = e.style; for (g = parseFloat(e.offsetWidth), v = parseFloat(e.offsetHeight), h = t.split(" "), l = 0; l < M.length; l++) this.p.indexOf("border") && (M[l] = q(M[l])), d = u = Z(e, M[l], o, !1, "0px"), -1 !== d.indexOf(" ") && (u = d.split(" "), d = u[0], u = u[1]), p = c = h[l], f = parseFloat(d), _ = d.substr((f + "").length), x = "=" === p.charAt(1), x ? (m = parseInt(p.charAt(0) + "1", 10), p = p.substr(2), m *= parseFloat(p), y = p.substr((m + "").length - (0 > m ? 1 : 0)) || "") : (m = parseFloat(p), y = p.substr((m + "").length)), "" === y && (y = n[i] || _), y !== _ && (b = Q(e, "borderLeft", f, _), w = Q(e, "borderTop", f, _), "%" === y ? (d = b / g * 100 + "%", u = w / v * 100 + "%") : "em" === y ? (T = Q(e, "borderLeft", 1, "em"), d = b / T + "em", u = w / T + "em") : (d = b + "px", u = w + "px"), x && (p = parseFloat(d) + m + y, c = parseFloat(u) + m + y)), a = ye(S, M[l], d + " " + u, p + " " + c, !1, "0px", a); return a }, prefix: !0, formatter: pe("0px 0px 0px 0px", !1, !0) }), be("backgroundPosition", { defaultValue: "0 0", parser: function(e, t, i, r, n, a) { var s, h, l, c, u, d, p = "background-position",
                                        f = o || K(e, null),
                                        m = this.format((f ? g ? f.getPropertyValue(p + "-x") + " " + f.getPropertyValue(p + "-y") : f.getPropertyValue(p) : e.currentStyle.backgroundPositionX + " " + e.currentStyle.backgroundPositionY) || "0 0"),
                                        v = this.format(t); if (-1 !== m.indexOf("%") != (-1 !== v.indexOf("%")) && (d = Z(e, "backgroundImage").replace(E, ""), d && "none" !== d)) { for (s = m.split(" "), h = v.split(" "), V.setAttribute("src", d), l = 2; --l > -1;) m = s[l], c = -1 !== m.indexOf("%"), c !== (-1 !== h[l].indexOf("%")) && (u = 0 === l ? e.offsetWidth - V.width : e.offsetHeight - V.height, s[l] = c ? parseFloat(m) / 100 * u + "px" : parseFloat(m) / u * 100 + "%");
                                        m = s.join(" ") } return this.parseComplex(e.style, m, v, n, a) }, formatter: ne }), be("backgroundSize", { defaultValue: "0 0", formatter: ne }), be("perspective", { defaultValue: "0px", prefix: !0 }), be("perspectiveOrigin", { defaultValue: "50% 50%", prefix: !0 }), be("transformStyle", { prefix: !0 }), be("backfaceVisibility", { prefix: !0 }), be("userSelect", { prefix: !0 }), be("margin", { parser: fe("marginTop,marginRight,marginBottom,marginLeft") }), be("padding", { parser: fe("paddingTop,paddingRight,paddingBottom,paddingLeft") }), be("clip", { defaultValue: "rect(0px,0px,0px,0px)", parser: function(e, t, i, r, n, a) { var s, h, l; return 9 > g ? (h = e.currentStyle, l = 8 > g ? " " : ",", s = "rect(" + h.clipTop + l + h.clipRight + l + h.clipBottom + l + h.clipLeft + ")", t = this.format(t).split(",").join(l)) : (s = this.format(Z(e, this.p, o, !1, this.dflt)), t = this.format(t)), this.parseComplex(e.style, s, t, n, a) } }), be("textShadow", { defaultValue: "0px 0px 0px #999", color: !0, multi: !0 }), be("autoRound,strictUnits", { parser: function(e, t, i, r, n) { return n } }), be("border", { defaultValue: "0px solid #000", parser: function(e, t, i, r, n, a) { return this.parseComplex(e.style, this.format(Z(e, "borderTopWidth", o, !1, "0px") + " " + Z(e, "borderTopStyle", o, !1, "solid") + " " + Z(e, "borderTopColor", o, !1, "#000")), this.format(t), n, a) }, color: !0, formatter: function(e) { var t = e.split(" "); return t[0] + " " + (t[1] || "solid") + " " + (e.match(de) || ["#000"])[0] } }), be("borderWidth", { parser: fe("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth") }), be("float,cssFloat,styleFloat", { parser: function(e, t, i, r, n, o) { var a = e.style,
                                        s = "cssFloat" in a ? "cssFloat" : "styleFloat"; return new ge(a, s, 0, 0, n, -1, i, !1, 0, a[s], t) } });
                            var Ie = function(e) { var t, i = this.t,
                                    r = i.filter || Z(this.data, "filter") || "",
                                    n = this.s + this.c * e | 0;
                                100 === n && (-1 === r.indexOf("atrix(") && -1 === r.indexOf("radient(") && -1 === r.indexOf("oader(") ? (i.removeAttribute("filter"), t = !Z(this.data, "filter")) : (i.filter = r.replace(M, ""), t = !0)), t || (this.xn1 && (i.filter = r = r || "alpha(opacity=" + n + ")"), -1 === r.indexOf("pacity") ? 0 === n && this.xn1 || (i.filter = r + " alpha(opacity=" + n + ")") : i.filter = r.replace(w, "opacity=" + n)) };
                            be("opacity,alpha,autoAlpha", { defaultValue: "1", parser: function(e, t, i, r, n, a) { var s = parseFloat(Z(e, "opacity", o, !1, "1")),
                                        h = e.style,
                                        l = "autoAlpha" === i; return "string" == typeof t && "=" === t.charAt(1) && (t = ("-" === t.charAt(0) ? -1 : 1) * parseFloat(t.substr(2)) + s), l && 1 === s && "hidden" === Z(e, "visibility", o) && 0 !== t && (s = 0), H ? n = new ge(h, "opacity", s, t - s, n) : (n = new ge(h, "opacity", 100 * s, 100 * (t - s), n), n.xn1 = l ? 1 : 0, h.zoom = 1, n.type = 2, n.b = "alpha(opacity=" + n.s + ")", n.e = "alpha(opacity=" + (n.s + n.c) + ")", n.data = e, n.plugin = a, n.setRatio = Ie), l && (n = new ge(h, "visibility", 0, 0, n, -1, null, !1, 0, 0 !== s ? "inherit" : "hidden", 0 === t ? "hidden" : "inherit"), n.xs0 = "inherit", r._overwriteProps.push(n.n), r._overwriteProps.push(i)), n } });
                            var Ge = function(e, t) { t && (e.removeProperty ? (("ms" === t.substr(0, 2) || "webkit" === t.substr(0, 6)) && (t = "-" + t), e.removeProperty(t.replace(C, "-$1").toLowerCase())) : e.removeAttribute(t)) },
                                He = function(e) { if (this.t._gsClassPT = this, 1 === e || 0 === e) { this.t.setAttribute("class", 0 === e ? this.b : this.e); for (var t = this.data, i = this.t.style; t;) t.v ? i[t.p] = t.v : Ge(i, t.p), t = t._next;
                                        1 === e && this.t._gsClassPT === this && (this.t._gsClassPT = null) } else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e) };
                            be("className", { parser: function(e, t, i, n, a, s, h) { var l, c, u, d, p, f = e.getAttribute("class") || "",
                                        m = e.style.cssText; if (a = n._classNamePT = new ge(e, i, 0, 0, a, 2), a.setRatio = He, a.pr = -11, r = !0, a.b = f, c = $(e, o), u = e._gsClassPT) { for (d = {}, p = u.data; p;) d[p.p] = 1, p = p._next;
                                        u.setRatio(1) } return e._gsClassPT = a, a.e = "=" !== t.charAt(1) ? t : f.replace(new RegExp("\\s*\\b" + t.substr(2) + "\\b"), "") + ("+" === t.charAt(0) ? " " + t.substr(2) : ""), e.setAttribute("class", a.e), l = ee(e, c, $(e), h, d), e.setAttribute("class", f), a.data = l.firstMPT, e.style.cssText = m, a = a.xfirst = n.parse(e, l.difs, a, s) } });
                            var je = function(e) { if ((1 === e || 0 === e) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) { var t, i, r, n, o, a = this.t.style,
                                        s = l.transform.parse; if ("all" === this.e) a.cssText = "", n = !0;
                                    else
                                        for (t = this.e.split(" ").join("").split(","), r = t.length; --r > -1;) i = t[r], l[i] && (l[i].parse === s ? n = !0 : i = "transformOrigin" === i ? Ae : l[i].p), Ge(a, i);
                                    n && (Ge(a, Se), o = this.t._gsTransform, o && (o.svg && this.t.removeAttribute("data-svg-origin"), delete this.t._gsTransform)) } };
                            for (be("clearProps", { parser: function(e, t, i, n, o) { return o = new ge(e, i, 0, 0, o, 2), o.setRatio = je, o.e = t, o.pr = -10, o.data = n._tween, r = !0, o } }), c = "bezier,throwProps,physicsProps,physics2D".split(","), _e = c.length; _e--;) we(c[_e]);
                            c = s.prototype, c._firstPT = c._lastParsedTransform = c._transform = null, c._onInitTween = function(e, t, i) { if (!e.nodeType) return !1;
                                this._target = e, this._tween = i, this._vars = t, u = t.autoRound, r = !1, n = t.suffixMap || s.suffixMap, o = K(e, ""), a = this._overwriteProps; var h, c, f, g, v, y, _, x, b, w = e.style; if (d && "" === w.zIndex && (h = Z(e, "zIndex", o), ("auto" === h || "" === h) && this._addLazySet(w, "zIndex", 0)), "string" == typeof t && (g = w.cssText, h = $(e, o), w.cssText = g + ";" + t, h = ee(e, h, $(e)).difs, !H && T.test(t) && (h.opacity = parseFloat(RegExp.$1)), t = h, w.cssText = g), t.className ? this._firstPT = c = l.className.parse(e, t.className, "className", this, null, null, t) : this._firstPT = c = this.parse(e, t, null), this._transformType) { for (b = 3 === this._transformType, Se ? p && (d = !0, "" === w.zIndex && (_ = Z(e, "zIndex", o), ("auto" === _ || "" === _) && this._addLazySet(w, "zIndex", 0)), m && this._addLazySet(w, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (b ? "visible" : "hidden"))) : w.zoom = 1, f = c; f && f._next;) f = f._next;
                                    x = new ge(e, "transform", 0, 0, null, 2), this._linkCSSP(x, null, f), x.setRatio = Se ? Ve : Ne, x.data = this._transform || ze(e, o, !0), x.tween = i, x.pr = -1, a.pop() } if (r) { for (; c;) { for (y = c._next, f = g; f && f.pr > c.pr;) f = f._next;
                                        (c._prev = f ? f._prev : v) ? c._prev._next = c: g = c, (c._next = f) ? f._prev = c : v = c, c = y } this._firstPT = g } return !0 }, c.parse = function(e, t, i, r) { var a, s, h, c, d, p, f, m, g, v, y = e.style; for (a in t) p = t[a], s = l[a], s ? i = s.parse(e, p, a, this, i, r, t) : (d = Z(e, a, o) + "", g = "string" == typeof p, "color" === a || "fill" === a || "stroke" === a || -1 !== a.indexOf("Color") || g && S.test(p) ? (g || (p = ce(p), p = (p.length > 3 ? "rgba(" : "rgb(") + p.join(",") + ")"), i = ye(y, a, d, p, !0, "transparent", i, 0, r)) : !g || -1 === p.indexOf(" ") && -1 === p.indexOf(",") ? (h = parseFloat(d), f = h || 0 === h ? d.substr((h + "").length) : "", ("" === d || "auto" === d) && ("width" === a || "height" === a ? (h = re(e, a, o), f = "px") : "left" === a || "top" === a ? (h = J(e, a, o), f = "px") : (h = "opacity" !== a ? 0 : 1, f = "")), v = g && "=" === p.charAt(1), v ? (c = parseInt(p.charAt(0) + "1", 10), p = p.substr(2), c *= parseFloat(p), m = p.replace(b, "")) : (c = parseFloat(p), m = g ? p.replace(b, "") : ""), "" === m && (m = a in n ? n[a] : f), p = c || 0 === c ? (v ? c + h : c) + m : t[a], f !== m && "" !== m && (c || 0 === c) && h && (h = Q(e, a, h, f), "%" === m ? (h /= Q(e, a, 100, "%") / 100, t.strictUnits !== !0 && (d = h + "%")) : "em" === m || "rem" === m ? h /= Q(e, a, 1, m) : "px" !== m && (c = Q(e, a, c, m), m = "px"), v && (c || 0 === c) && (p = c + h + m)), v && (c += h), !h && 0 !== h || !c && 0 !== c ? void 0 !== y[a] && (p || p + "" != "NaN" && null != p) ? (i = new ge(y, a, c || h || 0, 0, i, -1, a, !1, 0, d, p), i.xs0 = "none" !== p || "display" !== a && -1 === a.indexOf("Style") ? p : d) : W("invalid " + a + " tween value: " + t[a]) : (i = new ge(y, a, h, c - h, i, 0, a, u !== !1 && ("px" === m || "zIndex" === a), 0, d, p), i.xs0 = m)) : i = ye(y, a, d, p, !0, null, i, 0, r)), r && i && !i.plugin && (i.plugin = r); return i }, c.setRatio = function(e) { var t, i, r, n = this._firstPT,
                                    o = 1e-6; if (1 !== e || this._tween._time !== this._tween._duration && 0 !== this._tween._time)
                                    if (e || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6)
                                        for (; n;) { if (t = n.c * e + n.s, n.r ? t = Math.round(t) : o > t && t > -o && (t = 0), n.type)
                                                if (1 === n.type)
                                                    if (r = n.l, 2 === r) n.t[n.p] = n.xs0 + t + n.xs1 + n.xn1 + n.xs2;
                                                    else if (3 === r) n.t[n.p] = n.xs0 + t + n.xs1 + n.xn1 + n.xs2 + n.xn2 + n.xs3;
                                            else if (4 === r) n.t[n.p] = n.xs0 + t + n.xs1 + n.xn1 + n.xs2 + n.xn2 + n.xs3 + n.xn3 + n.xs4;
                                            else if (5 === r) n.t[n.p] = n.xs0 + t + n.xs1 + n.xn1 + n.xs2 + n.xn2 + n.xs3 + n.xn3 + n.xs4 + n.xn4 + n.xs5;
                                            else { for (i = n.xs0 + t + n.xs1, r = 1; r < n.l; r++) i += n["xn" + r] + n["xs" + (r + 1)];
                                                n.t[n.p] = i } else -1 === n.type ? n.t[n.p] = n.xs0 : n.setRatio && n.setRatio(e);
                                            else n.t[n.p] = t + n.xs0;
                                            n = n._next } else
                                            for (; n;) 2 !== n.type ? n.t[n.p] = n.b : n.setRatio(e), n = n._next;
                                    else
                                        for (; n;) { if (2 !== n.type)
                                                if (n.r && -1 !== n.type)
                                                    if (t = Math.round(n.s + n.c), n.type) { if (1 === n.type) { for (r = n.l, i = n.xs0 + t + n.xs1, r = 1; r < n.l; r++) i += n["xn" + r] + n["xs" + (r + 1)];
                                                            n.t[n.p] = i } } else n.t[n.p] = t + n.xs0;
                                            else n.t[n.p] = n.e;
                                            else n.setRatio(e);
                                            n = n._next } }, c._enableTransforms = function(e) { this._transform = this._transform || ze(this._target, o, !0), this._transformType = this._transform.svg && Te || !e && 3 !== this._transformType ? 2 : 3 };
                            var We = function(e) { this.t[this.p] = this.e, this.data._linkCSSP(this, this._next, null, !0) };
                            c._addLazySet = function(e, t, i) { var r = this._firstPT = new ge(e, t, 0, 0, this._firstPT, 2);
                                r.e = i, r.setRatio = We, r.data = this }, c._linkCSSP = function(e, t, i, r) { return e && (t && (t._prev = e), e._next && (e._next._prev = e._prev), e._prev ? e._prev._next = e._next : this._firstPT === e && (this._firstPT = e._next, r = !0), i ? i._next = e : r || null !== this._firstPT || (this._firstPT = e), e._next = t, e._prev = i), e }, c._kill = function(t) { var i, r, n, o = t; if (t.autoAlpha || t.alpha) { o = {}; for (r in t) o[r] = t[r];
                                    o.opacity = 1, o.autoAlpha && (o.visibility = 1) } return t.className && (i = this._classNamePT) && (n = i.xfirst, n && n._prev ? this._linkCSSP(n._prev, i._next, n._prev._prev) : n === this._firstPT && (this._firstPT = i._next), i._next && this._linkCSSP(i._next, i._next._next, n._prev), this._classNamePT = null), e.prototype._kill.call(this, o) };
                            var Xe = function(e, t, i) { var r, n, o, a; if (e.slice)
                                    for (n = e.length; --n > -1;) Xe(e[n], t, i);
                                else
                                    for (r = e.childNodes, n = r.length; --n > -1;) o = r[n], a = o.type, o.style && (t.push($(o)), i && i.push(o)), 1 !== a && 9 !== a && 11 !== a || !o.childNodes.length || Xe(o, t, i) };
                            return s.cascadeTo = function(e, i, r) { var n, o, a, s, h = t.to(e, i, r),
                                    l = [h],
                                    c = [],
                                    u = [],
                                    d = [],
                                    p = t._internals.reservedProps; for (e = h._targets || h.target, Xe(e, c, d), h.render(i, !0, !0), Xe(e, u), h.render(0, !0, !0), h._enabled(!0), n = d.length; --n > -1;)
                                    if (o = ee(d[n], c[n], u[n]), o.firstMPT) { o = o.difs; for (a in r) p[a] && (o[a] = r[a]);
                                        s = {}; for (a in o) s[a] = c[n][a];
                                        l.push(t.fromTo(d[n], i, s, o)) } return l }, e.activate([s]), s
                        }, !0),
                        function() { var e = i._gsDefine.plugin({ propName: "roundProps", version: "1.5", priority: -1, API: 2, init: function(e, t, i) { return this._tween = i, !0 } }),
                                t = function(e) { for (; e;) e.f || e.blob || (e.r = 1), e = e._next },
                                r = e.prototype;
                            r._onInitAllProps = function() { for (var e, i, r, n = this._tween, o = n.vars.roundProps.join ? n.vars.roundProps : n.vars.roundProps.split(","), a = o.length, s = {}, h = n._propLookup.roundProps; --a > -1;) s[o[a]] = 1; for (a = o.length; --a > -1;)
                                    for (e = o[a], i = n._firstPT; i;) r = i._next, i.pg ? i.t._roundProps(s, !0) : i.n === e && (2 === i.f && i.t ? t(i.t._firstPT) : (this._add(i.t, e, i.s, i.c), r && (r._prev = i._prev), i._prev ? i._prev._next = r : n._firstPT === i && (n._firstPT = r), i._next = i._prev = null, n._propLookup[e] = h)), i = r; return !1 }, r._add = function(e, t, i, r) { this._addTween(e, t, i, i + r, t, !0), this._overwriteProps.push(t) } }(),
                        function() { i._gsDefine.plugin({ propName: "attr", API: 2, version: "0.5.0", init: function(e, t, i) { var r; if ("function" != typeof e.setAttribute) return !1; for (r in t) this._addTween(e, "setAttribute", e.getAttribute(r) + "", t[r] + "", r, !1, r), this._overwriteProps.push(r); return !0 } }) }(), i._gsDefine.plugin({ propName: "directionalRotation", version: "0.2.1", API: 2, init: function(e, t, i) { "object" != typeof t && (t = { rotation: t }), this.finals = {}; var r, n, o, a, s, h, l = t.useRadians === !0 ? 2 * Math.PI : 360,
                                    c = 1e-6; for (r in t) "useRadians" !== r && (h = (t[r] + "").split("_"), n = h[0], o = parseFloat("function" != typeof e[r] ? e[r] : e[r.indexOf("set") || "function" != typeof e["get" + r.substr(3)] ? r : "get" + r.substr(3)]()), a = this.finals[r] = "string" == typeof n && "=" === n.charAt(1) ? o + parseInt(n.charAt(0) + "1", 10) * Number(n.substr(2)) : Number(n) || 0, s = a - o, h.length && (n = h.join("_"), -1 !== n.indexOf("short") && (s %= l, s !== s % (l / 2) && (s = 0 > s ? s + l : s - l)), -1 !== n.indexOf("_cw") && 0 > s ? s = (s + 9999999999 * l) % l - (s / l | 0) * l : -1 !== n.indexOf("ccw") && s > 0 && (s = (s - 9999999999 * l) % l - (s / l | 0) * l)), (s > c || -c > s) && (this._addTween(e, r, o, o + s, r), this._overwriteProps.push(r))); return !0 }, set: function(e) { var t; if (1 !== e) this._super.setRatio.call(this, e);
                                else
                                    for (t = this._firstPT; t;) t.f ? t.t[t.p](this.finals[t.p]) : t.t[t.p] = this.finals[t.p], t = t._next } })._autoCSS = !0, i._gsDefine("easing.Back", ["easing.Ease"], function(e) {
                            var t, r, n, o = i.GreenSockGlobals || i,
                                a = o.com.greensock,
                                s = 2 * Math.PI,
                                h = Math.PI / 2,
                                l = a._class,
                                c = function(t, i) { var r = l("easing." + t, function() {}, !0),
                                        n = r.prototype = new e; return n.constructor = r, n.getRatio = i, r },
                                u = e.register || function() {},
                                d = function(e, t, i, r, n) { var o = l("easing." + e, { easeOut: new t, easeIn: new i, easeInOut: new r }, !0); return u(o, e), o },
                                p = function(e, t, i) { this.t = e, this.v = t, i && (this.next = i, i.prev = this, this.c = i.v - t, this.gap = i.t - e) },
                                f = function(t, i) { var r = l("easing." + t, function(e) { this._p1 = e || 0 === e ? e : 1.70158, this._p2 = 1.525 * this._p1 }, !0),
                                        n = r.prototype = new e; return n.constructor = r, n.getRatio = i, n.config = function(e) { return new r(e) }, r },
                                m = d("Back", f("BackOut", function(e) { return (e -= 1) * e * ((this._p1 + 1) * e + this._p1) + 1 }), f("BackIn", function(e) { return e * e * ((this._p1 + 1) * e - this._p1) }), f("BackInOut", function(e) { return (e *= 2) < 1 ? .5 * e * e * ((this._p2 + 1) * e - this._p2) : .5 * ((e -= 2) * e * ((this._p2 + 1) * e + this._p2) + 2) })),
                                g = l("easing.SlowMo", function(e, t, i) { t = t || 0 === t ? t : .7, null == e ? e = .7 : e > 1 && (e = 1), this._p = 1 !== e ? t : 0, this._p1 = (1 - e) / 2, this._p2 = e, this._p3 = this._p1 + this._p2, this._calcEnd = i === !0 }, !0),
                                v = g.prototype = new e;
                            return v.constructor = g, v.getRatio = function(e) { var t = e + (.5 - e) * this._p; return e < this._p1 ? this._calcEnd ? 1 - (e = 1 - e / this._p1) * e : t - (e = 1 - e / this._p1) * e * e * e * t : e > this._p3 ? this._calcEnd ? 1 - (e = (e - this._p3) / this._p1) * e : t + (e - t) * (e = (e - this._p3) / this._p1) * e * e * e : this._calcEnd ? 1 : t }, g.ease = new g(.7, .7), v.config = g.config = function(e, t, i) { return new g(e, t, i) }, t = l("easing.SteppedEase", function(e) { e = e || 1, this._p1 = 1 / e, this._p2 = e + 1 }, !0), v = t.prototype = new e, v.constructor = t, v.getRatio = function(e) { return 0 > e ? e = 0 : e >= 1 && (e = .999999999), (this._p2 * e >> 0) * this._p1 }, v.config = t.config = function(e) { return new t(e) }, r = l("easing.RoughEase", function(t) { t = t || {}; for (var i, r, n, o, a, s, h = t.taper || "none", l = [], c = 0, u = 0 | (t.points || 20), d = u, f = t.randomize !== !1, m = t.clamp === !0, g = t.template instanceof e ? t.template : null, v = "number" == typeof t.strength ? .4 * t.strength : .4; --d > -1;) i = f ? Math.random() : 1 / u * d, r = g ? g.getRatio(i) : i, "none" === h ? n = v : "out" === h ? (o = 1 - i, n = o * o * v) : "in" === h ? n = i * i * v : .5 > i ? (o = 2 * i, n = o * o * .5 * v) : (o = 2 * (1 - i), n = o * o * .5 * v), f ? r += Math.random() * n - .5 * n : d % 2 ? r += .5 * n : r -= .5 * n, m && (r > 1 ? r = 1 : 0 > r && (r = 0)), l[c++] = { x: i, y: r }; for (l.sort(function(e, t) { return e.x - t.x }), s = new p(1, 1, null), d = u; --d > -1;) a = l[d], s = new p(a.x, a.y, s);
                                    this._prev = new p(0, 0, 0 !== s.t ? s : s.next) }, !0), v = r.prototype = new e, v.constructor = r, v.getRatio = function(e) { var t = this._prev; if (e > t.t) { for (; t.next && e >= t.t;) t = t.next;
                                        t = t.prev } else
                                        for (; t.prev && e <= t.t;) t = t.prev; return this._prev = t, t.v + (e - t.t) / t.gap * t.c }, v.config = function(e) { return new r(e) }, r.ease = new r, d("Bounce", c("BounceOut", function(e) { return 1 / 2.75 > e ? 7.5625 * e * e : 2 / 2.75 > e ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : 2.5 / 2.75 > e ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375 }), c("BounceIn", function(e) { return (e = 1 - e) < 1 / 2.75 ? 1 - 7.5625 * e * e : 2 / 2.75 > e ? 1 - (7.5625 * (e -= 1.5 / 2.75) * e + .75) : 2.5 / 2.75 > e ? 1 - (7.5625 * (e -= 2.25 / 2.75) * e + .9375) : 1 - (7.5625 * (e -= 2.625 / 2.75) * e + .984375) }), c("BounceInOut", function(e) { var t = .5 > e; return e = t ? 1 - 2 * e : 2 * e - 1, e = 1 / 2.75 > e ? 7.5625 * e * e : 2 / 2.75 > e ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : 2.5 / 2.75 > e ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375, t ? .5 * (1 - e) : .5 * e + .5 })), d("Circ", c("CircOut", function(e) { return Math.sqrt(1 - (e -= 1) * e) }), c("CircIn", function(e) { return -(Math.sqrt(1 - e * e) - 1) }), c("CircInOut", function(e) { return (e *= 2) < 1 ? -.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1) })), n = function(t, i, r) { var n = l("easing." + t, function(e, t) { this._p1 = e >= 1 ? e : 1, this._p2 = (t || r) / (1 > e ? e : 1), this._p3 = this._p2 / s * (Math.asin(1 / this._p1) || 0), this._p2 = s / this._p2 }, !0),
                                        o = n.prototype = new e; return o.constructor = n, o.getRatio = i, o.config = function(e, t) { return new n(e, t) }, n }, d("Elastic", n("ElasticOut", function(e) { return this._p1 * Math.pow(2, -10 * e) * Math.sin((e - this._p3) * this._p2) + 1 }, .3), n("ElasticIn", function(e) { return -(this._p1 * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - this._p3) * this._p2)) }, .3), n("ElasticInOut", function(e) { return (e *= 2) < 1 ? -.5 * (this._p1 * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 * (e -= 1)) * Math.sin((e - this._p3) * this._p2) * .5 + 1 }, .45)), d("Expo", c("ExpoOut", function(e) { return 1 - Math.pow(2, -10 * e) }), c("ExpoIn", function(e) { return Math.pow(2, 10 * (e - 1)) - .001 }), c("ExpoInOut", function(e) { return (e *= 2) < 1 ? .5 * Math.pow(2, 10 * (e - 1)) : .5 * (2 - Math.pow(2, -10 * (e - 1))) })), d("Sine", c("SineOut", function(e) { return Math.sin(e * h) }), c("SineIn", function(e) { return -Math.cos(e * h) + 1 }), c("SineInOut", function(e) { return -.5 * (Math.cos(Math.PI * e) - 1) })), l("easing.EaseLookup", { find: function(t) { return e.map[t] } }, !0), u(o.SlowMo, "SlowMo", "ease,"), u(r, "RoughEase", "ease,"), u(t, "SteppedEase", "ease,"),
                                m
                        }, !0)
                }), i._gsDefine && i._gsQueue.pop()(),
                function(e, i) { "use strict"; var r = e.GreenSockGlobals = e.GreenSockGlobals || e; if (!r.TweenLite) { var n, o, a, s, h, l = function(e) { var t, i = e.split("."),
                                    n = r; for (t = 0; t < i.length; t++) n[i[t]] = n = n[i[t]] || {}; return n },
                            c = l("com.greensock"),
                            u = 1e-10,
                            d = function(e) { var t, i = [],
                                    r = e.length; for (t = 0; t !== r; i.push(e[t++])); return i },
                            p = function() {},
                            f = function() { var e = Object.prototype.toString,
                                    t = e.call([]); return function(i) { return null != i && (i instanceof Array || "object" == typeof i && !!i.push && e.call(i) === t) } }(),
                            m = {},
                            g = function(n, o, a, s) { this.sc = m[n] ? m[n].sc : [], m[n] = this, this.gsClass = null, this.func = a; var h = [];
                                this.check = function(c) { for (var u, d, p, f, v, y = o.length, _ = y; --y > -1;)(u = m[o[y]] || new g(o[y], [])).gsClass ? (h[y] = u.gsClass, _--) : c && u.sc.push(this); if (0 === _ && a)
                                        for (d = ("com.greensock." + n).split("."), p = d.pop(), f = l(d.join("."))[p] = this.gsClass = a.apply(a, h), s && (r[p] = f, v = "undefined" != typeof t && t.exports, !v && "function" == typeof define && define.amd ? define((e.GreenSockAMDPath ? e.GreenSockAMDPath + "/" : "") + n.split(".").pop(), [], function() { return f }) : n === i && v && (t.exports = f)), y = 0; y < this.sc.length; y++) this.sc[y].check() }, this.check(!0) },
                            v = e._gsDefine = function(e, t, i, r) { return new g(e, t, i, r) },
                            y = c._class = function(e, t, i) { return t = t || function() {}, v(e, [], function() { return t }, i), t };
                        v.globals = r; var _ = [0, 0, 1, 1],
                            x = [],
                            b = y("easing.Ease", function(e, t, i, r) { this._func = e, this._type = i || 0, this._power = r || 0, this._params = t ? _.concat(t) : _ }, !0),
                            w = b.map = {},
                            T = b.register = function(e, t, i, r) { for (var n, o, a, s, h = t.split(","), l = h.length, u = (i || "easeIn,easeOut,easeInOut").split(","); --l > -1;)
                                    for (o = h[l], n = r ? y("easing." + o, null, !0) : c.easing[o] || {}, a = u.length; --a > -1;) s = u[a], w[o + "." + s] = w[s + o] = n[s] = e.getRatio ? e : e[s] || new e }; for (a = b.prototype, a._calcEnd = !1, a.getRatio = function(e) { if (this._func) return this._params[0] = e, this._func.apply(null, this._params); var t = this._type,
                                    i = this._power,
                                    r = 1 === t ? 1 - e : 2 === t ? e : .5 > e ? 2 * e : 2 * (1 - e); return 1 === i ? r *= r : 2 === i ? r *= r * r : 3 === i ? r *= r * r * r : 4 === i && (r *= r * r * r * r), 1 === t ? 1 - r : 2 === t ? r : .5 > e ? r / 2 : 1 - r / 2 }, n = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], o = n.length; --o > -1;) a = n[o] + ",Power" + o, T(new b(null, null, 1, o), a, "easeOut", !0), T(new b(null, null, 2, o), a, "easeIn" + (0 === o ? ",easeNone" : "")), T(new b(null, null, 3, o), a, "easeInOut");
                        w.linear = c.easing.Linear.easeIn, w.swing = c.easing.Quad.easeInOut; var M = y("events.EventDispatcher", function(e) { this._listeners = {}, this._eventTarget = e || this });
                        a = M.prototype, a.addEventListener = function(e, t, i, r, n) { n = n || 0; var o, a, l = this._listeners[e],
                                c = 0; for (null == l && (this._listeners[e] = l = []), a = l.length; --a > -1;) o = l[a], o.c === t && o.s === i ? l.splice(a, 1) : 0 === c && o.pr < n && (c = a + 1);
                            l.splice(c, 0, { c: t, s: i, up: r, pr: n }), this !== s || h || s.wake() }, a.removeEventListener = function(e, t) { var i, r = this._listeners[e]; if (r)
                                for (i = r.length; --i > -1;)
                                    if (r[i].c === t) return void r.splice(i, 1) }, a.dispatchEvent = function(e) { var t, i, r, n = this._listeners[e]; if (n)
                                for (t = n.length, i = this._eventTarget; --t > -1;) r = n[t], r && (r.up ? r.c.call(r.s || i, { type: e, target: i }) : r.c.call(r.s || i)) }; var S = e.requestAnimationFrame,
                            C = e.cancelAnimationFrame,
                            A = Date.now || function() { return (new Date).getTime() },
                            E = A(); for (n = ["ms", "moz", "webkit", "o"], o = n.length; --o > -1 && !S;) S = e[n[o] + "RequestAnimationFrame"], C = e[n[o] + "CancelAnimationFrame"] || e[n[o] + "CancelRequestAnimationFrame"];
                        y("Ticker", function(e, t) { var i, r, n, o, a, l = this,
                                c = A(),
                                d = t !== !1 && S,
                                f = 500,
                                m = 33,
                                g = "tick",
                                v = function(e) { var t, s, h = A() - E;
                                    h > f && (c += h - m), E += h, l.time = (E - c) / 1e3, t = l.time - a, (!i || t > 0 || e === !0) && (l.frame++, a += t + (t >= o ? .004 : o - t), s = !0), e !== !0 && (n = r(v)), s && l.dispatchEvent(g) };
                            M.call(l), l.time = l.frame = 0, l.tick = function() { v(!0) }, l.lagSmoothing = function(e, t) { f = e || 1 / u, m = Math.min(t, f, 0) }, l.sleep = function() { null != n && (d && C ? C(n) : clearTimeout(n), r = p, n = null, l === s && (h = !1)) }, l.wake = function() { null !== n ? l.sleep() : l.frame > 10 && (E = A() - f + 5), r = 0 === i ? p : d && S ? S : function(e) { return setTimeout(e, 1e3 * (a - l.time) + 1 | 0) }, l === s && (h = !0), v(2) }, l.fps = function(e) { return arguments.length ? (i = e, o = 1 / (i || 60), a = this.time + o, void l.wake()) : i }, l.useRAF = function(e) { return arguments.length ? (l.sleep(), d = e, void l.fps(i)) : d }, l.fps(e), setTimeout(function() { d && l.frame < 5 && l.useRAF(!1) }, 1500) }), a = c.Ticker.prototype = new c.events.EventDispatcher, a.constructor = c.Ticker; var P = y("core.Animation", function(e, t) { if (this.vars = t = t || {}, this._duration = this._totalDuration = e || 0, this._delay = Number(t.delay) || 0, this._timeScale = 1, this._active = t.immediateRender === !0, this.data = t.data, this._reversed = t.reversed === !0, q) { h || s.wake(); var i = this.vars.useFrames ? Y : q;
                                i.add(this, i._time), this.vars.paused && this.paused(!0) } });
                        s = P.ticker = new c.Ticker, a = P.prototype, a._dirty = a._gc = a._initted = a._paused = !1, a._totalTime = a._time = 0, a._rawPrevTime = -1, a._next = a._last = a._onUpdate = a._timeline = a.timeline = null, a._paused = !1; var L = function() { h && A() - E > 2e3 && s.wake(), setTimeout(L, 2e3) };
                        L(), a.play = function(e, t) { return null != e && this.seek(e, t), this.reversed(!1).paused(!1) }, a.pause = function(e, t) { return null != e && this.seek(e, t), this.paused(!0) }, a.resume = function(e, t) { return null != e && this.seek(e, t), this.paused(!1) }, a.seek = function(e, t) { return this.totalTime(Number(e), t !== !1) }, a.restart = function(e, t) { return this.reversed(!1).paused(!1).totalTime(e ? -this._delay : 0, t !== !1, !0) }, a.reverse = function(e, t) { return null != e && this.seek(e || this.totalDuration(), t), this.reversed(!0).paused(!1) }, a.render = function(e, t, i) {}, a.invalidate = function() { return this._time = this._totalTime = 0, this._initted = this._gc = !1, this._rawPrevTime = -1, (this._gc || !this.timeline) && this._enabled(!0), this }, a.isActive = function() { var e, t = this._timeline,
                                i = this._startTime; return !t || !this._gc && !this._paused && t.isActive() && (e = t.rawTime()) >= i && e < i + this.totalDuration() / this._timeScale }, a._enabled = function(e, t) { return h || s.wake(), this._gc = !e, this._active = this.isActive(), t !== !0 && (e && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !e && this.timeline && this._timeline._remove(this, !0)), !1 }, a._kill = function(e, t) { return this._enabled(!1, !1) }, a.kill = function(e, t) { return this._kill(e, t), this }, a._uncache = function(e) { for (var t = e ? this : this.timeline; t;) t._dirty = !0, t = t.timeline; return this }, a._swapSelfInParams = function(e) { for (var t = e.length, i = e.concat(); --t > -1;) "{self}" === e[t] && (i[t] = this); return i }, a._callback = function(e) { var t = this.vars;
                            t[e].apply(t[e + "Scope"] || t.callbackScope || this, t[e + "Params"] || x) }, a.eventCallback = function(e, t, i, r) { if ("on" === (e || "").substr(0, 2)) { var n = this.vars; if (1 === arguments.length) return n[e];
                                null == t ? delete n[e] : (n[e] = t, n[e + "Params"] = f(i) && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i, n[e + "Scope"] = r), "onUpdate" === e && (this._onUpdate = t) } return this }, a.delay = function(e) { return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + e - this._delay), this._delay = e, this) : this._delay }, a.duration = function(e) { return arguments.length ? (this._duration = this._totalDuration = e, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== e && this.totalTime(this._totalTime * (e / this._duration), !0), this) : (this._dirty = !1, this._duration) }, a.totalDuration = function(e) { return this._dirty = !1, arguments.length ? this.duration(e) : this._totalDuration }, a.time = function(e, t) { return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(e > this._duration ? this._duration : e, t)) : this._time }, a.totalTime = function(e, t, i) { if (h || s.wake(), !arguments.length) return this._totalTime; if (this._timeline) { if (0 > e && !i && (e += this.totalDuration()), this._timeline.smoothChildTiming) { this._dirty && this.totalDuration(); var r = this._totalDuration,
                                        n = this._timeline; if (e > r && !i && (e = r), this._startTime = (this._paused ? this._pauseTime : n._time) - (this._reversed ? r - e : e) / this._timeScale, n._dirty || this._uncache(!1), n._timeline)
                                        for (; n._timeline;) n._timeline._time !== (n._startTime + n._totalTime) / n._timeScale && n.totalTime(n._totalTime, !0), n = n._timeline } this._gc && this._enabled(!0, !1), (this._totalTime !== e || 0 === this._duration) && (D.length && Z(), this.render(e, t, !1), D.length && Z()) } return this }, a.progress = a.totalProgress = function(e, t) { var i = this.duration(); return arguments.length ? this.totalTime(i * e, t) : i ? this._time / i : this.ratio }, a.startTime = function(e) { return arguments.length ? (e !== this._startTime && (this._startTime = e, this.timeline && this.timeline._sortChildren && this.timeline.add(this, e - this._delay)), this) : this._startTime }, a.endTime = function(e) { return this._startTime + (0 != e ? this.totalDuration() : this.duration()) / this._timeScale }, a.timeScale = function(e) { if (!arguments.length) return this._timeScale; if (e = e || u, this._timeline && this._timeline.smoothChildTiming) { var t = this._pauseTime,
                                    i = t || 0 === t ? t : this._timeline.totalTime();
                                this._startTime = i - (i - this._startTime) * this._timeScale / e } return this._timeScale = e, this._uncache(!1) }, a.reversed = function(e) { return arguments.length ? (e != this._reversed && (this._reversed = e, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed }, a.paused = function(e) { if (!arguments.length) return this._paused; var t, i, r = this._timeline; return e != this._paused && r && (h || e || s.wake(), t = r.rawTime(), i = t - this._pauseTime, !e && r.smoothChildTiming && (this._startTime += i, this._uncache(!1)), this._pauseTime = e ? t : null, this._paused = e, this._active = this.isActive(), !e && 0 !== i && this._initted && this.duration() && (t = r.smoothChildTiming ? this._totalTime : (t - this._startTime) / this._timeScale, this.render(t, t === this._totalTime, !0))), this._gc && !e && this._enabled(!0, !1), this }; var R = y("core.SimpleTimeline", function(e) { P.call(this, 0, e), this.autoRemoveChildren = this.smoothChildTiming = !0 });
                        a = R.prototype = new P, a.constructor = R, a.kill()._gc = !1, a._first = a._last = a._recent = null, a._sortChildren = !1, a.add = a.insert = function(e, t, i, r) { var n, o; if (e._startTime = Number(t || 0) + e._delay, e._paused && this !== e._timeline && (e._pauseTime = e._startTime + (this.rawTime() - e._startTime) / e._timeScale), e.timeline && e.timeline._remove(e, !0), e.timeline = e._timeline = this, e._gc && e._enabled(!0, !0), n = this._last, this._sortChildren)
                                for (o = e._startTime; n && n._startTime > o;) n = n._prev; return n ? (e._next = n._next, n._next = e) : (e._next = this._first, this._first = e), e._next ? e._next._prev = e : this._last = e, e._prev = n, this._recent = e, this._timeline && this._uncache(!0), this }, a._remove = function(e, t) { return e.timeline === this && (t || e._enabled(!1, !0), e._prev ? e._prev._next = e._next : this._first === e && (this._first = e._next), e._next ? e._next._prev = e._prev : this._last === e && (this._last = e._prev), e._next = e._prev = e.timeline = null, e === this._recent && (this._recent = this._last), this._timeline && this._uncache(!0)), this }, a.render = function(e, t, i) { var r, n = this._first; for (this._totalTime = this._time = this._rawPrevTime = e; n;) r = n._next, (n._active || e >= n._startTime && !n._paused) && (n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (e - n._startTime) * n._timeScale, t, i) : n.render((e - n._startTime) * n._timeScale, t, i)), n = r }, a.rawTime = function() { return h || s.wake(), this._totalTime }; var F = y("TweenLite", function(t, i, r) { if (P.call(this, i, r), this.render = F.prototype.render, null == t) throw "Cannot tween a null target.";
                                this.target = t = "string" != typeof t ? t : F.selector(t) || t; var n, o, a, s = t.jquery || t.length && t !== e && t[0] && (t[0] === e || t[0].nodeType && t[0].style && !t.nodeType),
                                    h = this.vars.overwrite; if (this._overwrite = h = null == h ? X[F.defaultOverwrite] : "number" == typeof h ? h >> 0 : X[h], (s || t instanceof Array || t.push && f(t)) && "number" != typeof t[0])
                                    for (this._targets = a = d(t), this._propLookup = [], this._siblings = [], n = 0; n < a.length; n++) o = a[n], o ? "string" != typeof o ? o.length && o !== e && o[0] && (o[0] === e || o[0].nodeType && o[0].style && !o.nodeType) ? (a.splice(n--, 1), this._targets = a = a.concat(d(o))) : (this._siblings[n] = Q(o, this, !1), 1 === h && this._siblings[n].length > 1 && $(o, this, null, 1, this._siblings[n])) : (o = a[n--] = F.selector(o), "string" == typeof o && a.splice(n + 1, 1)) : a.splice(n--, 1);
                                else this._propLookup = {}, this._siblings = Q(t, this, !1), 1 === h && this._siblings.length > 1 && $(t, this, null, 1, this._siblings);
                                (this.vars.immediateRender || 0 === i && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -u, this.render(-this._delay)) }, !0),
                            k = function(t) { return t && t.length && t !== e && t[0] && (t[0] === e || t[0].nodeType && t[0].style && !t.nodeType) },
                            O = function(e, t) { var i, r = {}; for (i in e) W[i] || i in t && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!G[i] || G[i] && G[i]._autoCSS) || (r[i] = e[i], delete e[i]);
                                e.css = r };
                        a = F.prototype = new P, a.constructor = F, a.kill()._gc = !1, a.ratio = 0, a._firstPT = a._targets = a._overwrittenProps = a._startAt = null, a._notifyPluginsOfEnabled = a._lazy = !1, F.version = "1.18.0", F.defaultEase = a._ease = new b(null, null, 1, 1), F.defaultOverwrite = "auto", F.ticker = s, F.autoSleep = 120, F.lagSmoothing = function(e, t) { s.lagSmoothing(e, t) }, F.selector = e.$ || e.jQuery || function(t) { var i = e.$ || e.jQuery; return i ? (F.selector = i, i(t)) : "undefined" == typeof document ? t : document.querySelectorAll ? document.querySelectorAll(t) : document.getElementById("#" === t.charAt(0) ? t.substr(1) : t) }; var D = [],
                            B = {},
                            U = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
                            z = function(e) { for (var t, i = this._firstPT, r = 1e-6; i;) t = i.blob ? e ? this.join("") : this.start : i.c * e + i.s, i.r ? t = Math.round(t) : r > t && t > -r && (t = 0), i.f ? i.fp ? i.t[i.p](i.fp, t) : i.t[i.p](t) : i.t[i.p] = t, i = i._next },
                            N = function(e, t, i, r) { var n, o, a, s, h, l, c, u = [e, t],
                                    d = 0,
                                    p = "",
                                    f = 0; for (u.start = e, i && (i(u), e = u[0], t = u[1]), u.length = 0, n = e.match(U) || [], o = t.match(U) || [], r && (r._next = null, r.blob = 1, u._firstPT = r), h = o.length, s = 0; h > s; s++) c = o[s], l = t.substr(d, t.indexOf(c, d) - d), p += l || !s ? l : ",", d += l.length, f ? f = (f + 1) % 5 : "rgba(" === l.substr(-5) && (f = 1), c === n[s] || n.length <= s ? p += c : (p && (u.push(p), p = ""), a = parseFloat(n[s]), u.push(a), u._firstPT = { _next: u._firstPT, t: u, p: u.length - 1, s: a, c: ("=" === c.charAt(1) ? parseInt(c.charAt(0) + "1", 10) * parseFloat(c.substr(2)) : parseFloat(c) - a) || 0, f: 0, r: f && 4 > f }), d += c.length; return p += t.substr(d), p && u.push(p), u.setRatio = z, u },
                            V = function(e, t, i, r, n, o, a, s) { var h, l, c = "get" === i ? e[t] : i,
                                    u = typeof e[t],
                                    d = "string" == typeof r && "=" === r.charAt(1),
                                    p = { t: e, p: t, s: c, f: "function" === u, pg: 0, n: n || t, r: o, pr: 0, c: d ? parseInt(r.charAt(0) + "1", 10) * parseFloat(r.substr(2)) : parseFloat(r) - c || 0 }; return "number" !== u && ("function" === u && "get" === i && (l = t.indexOf("set") || "function" != typeof e["get" + t.substr(3)] ? t : "get" + t.substr(3), p.s = c = a ? e[l](a) : e[l]()), "string" == typeof c && (a || isNaN(c)) ? (p.fp = a, h = N(c, r, s || F.defaultStringFilter, p), p = { t: h, p: "setRatio", s: 0, c: 1, f: 2, pg: 0, n: n || t, pr: 0 }) : d || (p.c = parseFloat(r) - parseFloat(c) || 0)), p.c ? ((p._next = this._firstPT) && (p._next._prev = p), this._firstPT = p, p) : void 0 },
                            I = F._internals = { isArray: f, isSelector: k, lazyTweens: D, blobDif: N },
                            G = F._plugins = {},
                            H = I.tweenLookup = {},
                            j = 0,
                            W = I.reservedProps = { ease: 1, delay: 1, overwrite: 1, onComplete: 1, onCompleteParams: 1, onCompleteScope: 1, useFrames: 1, runBackwards: 1, startAt: 1, onUpdate: 1, onUpdateParams: 1, onUpdateScope: 1, onStart: 1, onStartParams: 1, onStartScope: 1, onReverseComplete: 1, onReverseCompleteParams: 1, onReverseCompleteScope: 1, onRepeat: 1, onRepeatParams: 1, onRepeatScope: 1, easeParams: 1, yoyo: 1, immediateRender: 1, repeat: 1, repeatDelay: 1, data: 1, paused: 1, reversed: 1, autoCSS: 1, lazy: 1, onOverwrite: 1, callbackScope: 1, stringFilter: 1 },
                            X = { none: 0, all: 1, auto: 2, concurrent: 3, allOnStart: 4, preexisting: 5, "true": 1, "false": 0 },
                            Y = P._rootFramesTimeline = new R,
                            q = P._rootTimeline = new R,
                            K = 30,
                            Z = I.lazyRender = function() { var e, t = D.length; for (B = {}; --t > -1;) e = D[t], e && e._lazy !== !1 && (e.render(e._lazy[0], e._lazy[1], !0), e._lazy = !1);
                                D.length = 0 };
                        q._startTime = s.time, Y._startTime = s.frame, q._active = Y._active = !0, setTimeout(Z, 1), P._updateRoot = F.render = function() { var e, t, i; if (D.length && Z(), q.render((s.time - q._startTime) * q._timeScale, !1, !1), Y.render((s.frame - Y._startTime) * Y._timeScale, !1, !1), D.length && Z(), s.frame >= K) { K = s.frame + (parseInt(F.autoSleep, 10) || 120); for (i in H) { for (t = H[i].tweens, e = t.length; --e > -1;) t[e]._gc && t.splice(e, 1);
                                    0 === t.length && delete H[i] } if (i = q._first, (!i || i._paused) && F.autoSleep && !Y._first && 1 === s._listeners.tick.length) { for (; i && i._paused;) i = i._next;
                                    i || s.sleep() } } }, s.addEventListener("tick", P._updateRoot); var Q = function(e, t, i) { var r, n, o = e._gsTweenID; if (H[o || (e._gsTweenID = o = "t" + j++)] || (H[o] = { target: e, tweens: [] }), t && (r = H[o].tweens, r[n = r.length] = t, i))
                                    for (; --n > -1;) r[n] === t && r.splice(n, 1); return H[o].tweens },
                            J = function(e, t, i, r) { var n, o, a = e.vars.onOverwrite; return a && (n = a(e, t, i, r)), a = F.onOverwrite, a && (o = a(e, t, i, r)), n !== !1 && o !== !1 },
                            $ = function(e, t, i, r, n) { var o, a, s, h; if (1 === r || r >= 4) { for (h = n.length, o = 0; h > o; o++)
                                        if ((s = n[o]) !== t) s._gc || s._kill(null, e, t) && (a = !0);
                                        else if (5 === r) break; return a } var l, c = t._startTime + u,
                                    d = [],
                                    p = 0,
                                    f = 0 === t._duration; for (o = n.length; --o > -1;)(s = n[o]) === t || s._gc || s._paused || (s._timeline !== t._timeline ? (l = l || ee(t, 0, f), 0 === ee(s, l, f) && (d[p++] = s)) : s._startTime <= c && s._startTime + s.totalDuration() / s._timeScale > c && ((f || !s._initted) && c - s._startTime <= 2e-10 || (d[p++] = s))); for (o = p; --o > -1;)
                                    if (s = d[o], 2 === r && s._kill(i, e, t) && (a = !0), 2 !== r || !s._firstPT && s._initted) { if (2 !== r && !J(s, t)) continue;
                                        s._enabled(!1, !1) && (a = !0) } return a },
                            ee = function(e, t, i) { for (var r = e._timeline, n = r._timeScale, o = e._startTime; r._timeline;) { if (o += r._startTime, n *= r._timeScale, r._paused) return -100;
                                    r = r._timeline } return o /= n, o > t ? o - t : i && o === t || !e._initted && 2 * u > o - t ? u : (o += e.totalDuration() / e._timeScale / n) > t + u ? 0 : o - t - u };
                        a._init = function() { var e, t, i, r, n, o = this.vars,
                                a = this._overwrittenProps,
                                s = this._duration,
                                h = !!o.immediateRender,
                                l = o.ease; if (o.startAt) { this._startAt && (this._startAt.render(-1, !0), this._startAt.kill()), n = {}; for (r in o.startAt) n[r] = o.startAt[r]; if (n.overwrite = !1, n.immediateRender = !0, n.lazy = h && o.lazy !== !1, n.startAt = n.delay = null, this._startAt = F.to(this.target, 0, n), h)
                                    if (this._time > 0) this._startAt = null;
                                    else if (0 !== s) return } else if (o.runBackwards && 0 !== s)
                                if (this._startAt) this._startAt.render(-1, !0), this._startAt.kill(), this._startAt = null;
                                else { 0 !== this._time && (h = !1), i = {}; for (r in o) W[r] && "autoCSS" !== r || (i[r] = o[r]); if (i.overwrite = 0, i.data = "isFromStart", i.lazy = h && o.lazy !== !1, i.immediateRender = h, this._startAt = F.to(this.target, 0, i), h) { if (0 === this._time) return } else this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null) } if (this._ease = l = l ? l instanceof b ? l : "function" == typeof l ? new b(l, o.easeParams) : w[l] || F.defaultEase : F.defaultEase, o.easeParams instanceof Array && l.config && (this._ease = l.config.apply(l, o.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)
                                for (e = this._targets.length; --e > -1;) this._initProps(this._targets[e], this._propLookup[e] = {}, this._siblings[e], a ? a[e] : null) && (t = !0);
                            else t = this._initProps(this.target, this._propLookup, this._siblings, a); if (t && F._onPluginEvent("_onInitAllProps", this), a && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), o.runBackwards)
                                for (i = this._firstPT; i;) i.s += i.c, i.c = -i.c, i = i._next;
                            this._onUpdate = o.onUpdate, this._initted = !0 }, a._initProps = function(t, i, r, n) { var o, a, s, h, l, c; if (null == t) return !1;
                            B[t._gsTweenID] && Z(), this.vars.css || t.style && t !== e && t.nodeType && G.css && this.vars.autoCSS !== !1 && O(this.vars, t); for (o in this.vars)
                                if (c = this.vars[o], W[o]) c && (c instanceof Array || c.push && f(c)) && -1 !== c.join("").indexOf("{self}") && (this.vars[o] = c = this._swapSelfInParams(c, this));
                                else if (G[o] && (h = new G[o])._onInitTween(t, this.vars[o], this)) { for (this._firstPT = l = { _next: this._firstPT, t: h, p: "setRatio", s: 0, c: 1, f: 1, n: o, pg: 1, pr: h._priority }, a = h._overwriteProps.length; --a > -1;) i[h._overwriteProps[a]] = this._firstPT;
                                (h._priority || h._onInitAllProps) && (s = !0), (h._onDisable || h._onEnable) && (this._notifyPluginsOfEnabled = !0), l._next && (l._next._prev = l) } else i[o] = V.call(this, t, o, "get", c, o, 0, null, this.vars.stringFilter); return n && this._kill(n, t) ? this._initProps(t, i, r, n) : this._overwrite > 1 && this._firstPT && r.length > 1 && $(t, this, i, this._overwrite, r) ? (this._kill(i, t), this._initProps(t, i, r, n)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (B[t._gsTweenID] = !0), s) }, a.render = function(e, t, i) { var r, n, o, a, s = this._time,
                                h = this._duration,
                                l = this._rawPrevTime; if (e >= h) this._totalTime = this._time = h, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (r = !0, n = "onComplete", i = i || this._timeline.autoRemoveChildren), 0 === h && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (e = 0), (0 === e || 0 > l || l === u && "isPause" !== this.data) && l !== e && (i = !0, l > u && (n = "onReverseComplete")), this._rawPrevTime = a = !t || e || l === e ? e : u);
                            else if (1e-7 > e) this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== s || 0 === h && l > 0) && (n = "onReverseComplete", r = this._reversed), 0 > e && (this._active = !1, 0 === h && (this._initted || !this.vars.lazy || i) && (l >= 0 && (l !== u || "isPause" !== this.data) && (i = !0), this._rawPrevTime = a = !t || e || l === e ? e : u)), this._initted || (i = !0);
                            else if (this._totalTime = this._time = e, this._easeType) { var c = e / h,
                                    d = this._easeType,
                                    p = this._easePower;
                                (1 === d || 3 === d && c >= .5) && (c = 1 - c), 3 === d && (c *= 2), 1 === p ? c *= c : 2 === p ? c *= c * c : 3 === p ? c *= c * c * c : 4 === p && (c *= c * c * c * c), 1 === d ? this.ratio = 1 - c : 2 === d ? this.ratio = c : .5 > e / h ? this.ratio = c / 2 : this.ratio = 1 - c / 2 } else this.ratio = this._ease.getRatio(e / h); if (this._time !== s || i) { if (!this._initted) { if (this._init(), !this._initted || this._gc) return; if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = this._totalTime = s, this._rawPrevTime = l, D.push(this), void(this._lazy = [e, t]);
                                    this._time && !r ? this.ratio = this._ease.getRatio(this._time / h) : r && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1)) } for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== s && e >= 0 && (this._active = !0), 0 === s && (this._startAt && (e >= 0 ? this._startAt.render(e, t, i) : n || (n = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === h) && (t || this._callback("onStart"))), o = this._firstPT; o;) o.f ? o.t[o.p](o.c * this.ratio + o.s) : o.t[o.p] = o.c * this.ratio + o.s, o = o._next;
                                this._onUpdate && (0 > e && this._startAt && e !== -1e-4 && this._startAt.render(e, t, i), t || (this._time !== s || r) && this._callback("onUpdate")), n && (!this._gc || i) && (0 > e && this._startAt && !this._onUpdate && e !== -1e-4 && this._startAt.render(e, t, i), r && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !t && this.vars[n] && this._callback(n), 0 === h && this._rawPrevTime === u && a !== u && (this._rawPrevTime = 0)) } }, a._kill = function(e, t, i) { if ("all" === e && (e = null), null == e && (null == t || t === this.target)) return this._lazy = !1, this._enabled(!1, !1);
                            t = "string" != typeof t ? t || this._targets || this.target : F.selector(t) || t; var r, n, o, a, s, h, l, c, u, d = i && this._time && i._startTime === this._startTime && this._timeline === i._timeline; if ((f(t) || k(t)) && "number" != typeof t[0])
                                for (r = t.length; --r > -1;) this._kill(e, t[r], i) && (h = !0);
                            else { if (this._targets) { for (r = this._targets.length; --r > -1;)
                                        if (t === this._targets[r]) { s = this._propLookup[r] || {}, this._overwrittenProps = this._overwrittenProps || [], n = this._overwrittenProps[r] = e ? this._overwrittenProps[r] || {} : "all"; break } } else { if (t !== this.target) return !1;
                                    s = this._propLookup, n = this._overwrittenProps = e ? this._overwrittenProps || {} : "all" } if (s) { if (l = e || s, c = e !== n && "all" !== n && e !== s && ("object" != typeof e || !e._tempKill), i && (F.onOverwrite || this.vars.onOverwrite)) { for (o in l) s[o] && (u || (u = []), u.push(o)); if ((u || !e) && !J(this, i, t, u)) return !1 } for (o in l)(a = s[o]) && (d && (a.f ? a.t[a.p](a.s) : a.t[a.p] = a.s, h = !0), a.pg && a.t._kill(l) && (h = !0), a.pg && 0 !== a.t._overwriteProps.length || (a._prev ? a._prev._next = a._next : a === this._firstPT && (this._firstPT = a._next), a._next && (a._next._prev = a._prev), a._next = a._prev = null), delete s[o]), c && (n[o] = 1);!this._firstPT && this._initted && this._enabled(!1, !1) } } return h }, a.invalidate = function() { return this._notifyPluginsOfEnabled && F._onPluginEvent("_onDisable", this), this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null, this._notifyPluginsOfEnabled = this._active = this._lazy = !1, this._propLookup = this._targets ? {} : [], P.prototype.invalidate.call(this), this.vars.immediateRender && (this._time = -u, this.render(-this._delay)), this }, a._enabled = function(e, t) { if (h || s.wake(), e && this._gc) { var i, r = this._targets; if (r)
                                    for (i = r.length; --i > -1;) this._siblings[i] = Q(r[i], this, !0);
                                else this._siblings = Q(this.target, this, !0) } return P.prototype._enabled.call(this, e, t), this._notifyPluginsOfEnabled && this._firstPT ? F._onPluginEvent(e ? "_onEnable" : "_onDisable", this) : !1 }, F.to = function(e, t, i) { return new F(e, t, i) }, F.from = function(e, t, i) { return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new F(e, t, i) }, F.fromTo = function(e, t, i, r) { return r.startAt = i, r.immediateRender = 0 != r.immediateRender && 0 != i.immediateRender, new F(e, t, r) }, F.delayedCall = function(e, t, i, r, n) { return new F(t, 0, { delay: e, onComplete: t, onCompleteParams: i, callbackScope: r, onReverseComplete: t, onReverseCompleteParams: i, immediateRender: !1, lazy: !1, useFrames: n, overwrite: 0 }) }, F.set = function(e, t) { return new F(e, 0, t) }, F.getTweensOf = function(e, t) { if (null == e) return [];
                            e = "string" != typeof e ? e : F.selector(e) || e; var i, r, n, o; if ((f(e) || k(e)) && "number" != typeof e[0]) { for (i = e.length, r = []; --i > -1;) r = r.concat(F.getTweensOf(e[i], t)); for (i = r.length; --i > -1;)
                                    for (o = r[i], n = i; --n > -1;) o === r[n] && r.splice(i, 1) } else
                                for (r = Q(e).concat(), i = r.length; --i > -1;)(r[i]._gc || t && !r[i].isActive()) && r.splice(i, 1); return r }, F.killTweensOf = F.killDelayedCallsTo = function(e, t, i) { "object" == typeof t && (i = t, t = !1); for (var r = F.getTweensOf(e, t), n = r.length; --n > -1;) r[n]._kill(i, e) }; var te = y("plugins.TweenPlugin", function(e, t) { this._overwriteProps = (e || "").split(","), this._propName = this._overwriteProps[0], this._priority = t || 0, this._super = te.prototype }, !0); if (a = te.prototype, te.version = "1.18.0", te.API = 2, a._firstPT = null, a._addTween = V, a.setRatio = z, a._kill = function(e) { var t, i = this._overwriteProps,
                                    r = this._firstPT; if (null != e[this._propName]) this._overwriteProps = [];
                                else
                                    for (t = i.length; --t > -1;) null != e[i[t]] && i.splice(t, 1); for (; r;) null != e[r.n] && (r._next && (r._next._prev = r._prev), r._prev ? (r._prev._next = r._next, r._prev = null) : this._firstPT === r && (this._firstPT = r._next)), r = r._next; return !1 }, a._roundProps = function(e, t) { for (var i = this._firstPT; i;)(e[this._propName] || null != i.n && e[i.n.split(this._propName + "_").join("")]) && (i.r = t), i = i._next }, F._onPluginEvent = function(e, t) { var i, r, n, o, a, s = t._firstPT; if ("_onInitAllProps" === e) { for (; s;) { for (a = s._next, r = n; r && r.pr > s.pr;) r = r._next;
                                        (s._prev = r ? r._prev : o) ? s._prev._next = s: n = s, (s._next = r) ? r._prev = s : o = s, s = a } s = t._firstPT = n } for (; s;) s.pg && "function" == typeof s.t[e] && s.t[e]() && (i = !0), s = s._next; return i }, te.activate = function(e) { for (var t = e.length; --t > -1;) e[t].API === te.API && (G[(new e[t])._propName] = e[t]); return !0 }, v.plugin = function(e) { if (!(e && e.propName && e.init && e.API)) throw "illegal plugin definition."; var t, i = e.propName,
                                    r = e.priority || 0,
                                    n = e.overwriteProps,
                                    o = { init: "_onInitTween", set: "setRatio", kill: "_kill", round: "_roundProps", initAll: "_onInitAllProps" },
                                    a = y("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function() { te.call(this, i, r), this._overwriteProps = n || [] }, e.global === !0),
                                    s = a.prototype = new te(i);
                                s.constructor = a, a.API = e.API; for (t in o) "function" == typeof e[t] && (s[o[t]] = e[t]); return a.version = e.version, te.activate([a]), a }, n = e._gsQueue) { for (o = 0; o < n.length; o++) n[o](); for (a in m) m[a].func || e.console.log("GSAP encountered missing dependency: com.greensock." + a) } h = !1 } }("undefined" != typeof t && t.exports && "undefined" != typeof e ? e : this || window, "TweenMax")
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    34: [function(e, t, i) {
        (function() { var e;
            e = "undefined" != typeof i && null !== i ? i : this, e.Lethargy = function() {
                function e(e, t, i) { this.stability = null != e ? Math.abs(e) : 8, this.sensitivity = null != t ? 1 + Math.abs(t) : 100, this.tolerance = null != i ? 1 + Math.abs(i) : 1.1, this.lastUpDeltas = function() { var e, t, i; for (i = [], e = 1, t = 2 * this.stability; t >= 1 ? t >= e : e >= t; t >= 1 ? e++ : e--) i.push(null); return i }.call(this), this.lastDownDeltas = function() { var e, t, i; for (i = [], e = 1, t = 2 * this.stability; t >= 1 ? t >= e : e >= t; t >= 1 ? e++ : e--) i.push(null); return i }.call(this), this.deltasTimestamp = function() { var e, t, i; for (i = [], e = 1, t = 2 * this.stability; t >= 1 ? t >= e : e >= t; t >= 1 ? e++ : e--) i.push(null); return i }.call(this) } return e.prototype.check = function(e) { var t; return null != e.originalEvent.wheelDelta ? t = e.originalEvent.wheelDelta : null != e.originalEvent.deltaY ? t = -40 * e.originalEvent.deltaY : (null != e.originalEvent.detail || 0 === e.originalEvent.detail) && (t = -40 * e.originalEvent.detail), this.deltasTimestamp.push(Date.now()), this.deltasTimestamp.shift(), t > 0 ? (this.lastUpDeltas.push(t), this.lastUpDeltas.shift(), this.isInertia(1)) : (this.lastDownDeltas.push(t), this.lastDownDeltas.shift(), this.isInertia(-1)) }, e.prototype.isInertia = function(e) { var t, i, r, n, o, a, s; return t = -1 === e ? this.lastDownDeltas : this.lastUpDeltas, null === t[0] ? e : this.deltasTimestamp[2 * this.stability - 2] + 150 > Date.now() && t[0] === t[2 * this.stability - 1] ? !1 : (r = t.slice(0, this.stability), i = t.slice(this.stability, 2 * this.stability), s = r.reduce(function(e, t) { return e + t }), o = i.reduce(function(e, t) { return e + t }), a = s / r.length, n = o / i.length, Math.abs(a) < Math.abs(n * this.tolerance) && this.sensitivity < Math.abs(n) ? e : !1) }, e.prototype.showLastUpDeltas = function() { return this.lastUpDeltas }, e.prototype.showLastDownDeltas = function() { return this.lastDownDeltas }, e }() }).call(this) }, {}],
    35: [function(e, t, i) {
        t.exports = function(e) {
            function t(t, r) {
                function n() { return 2 * Math.PI / 60 / 60 * g.autoRotateSpeed }

                function o() { return Math.pow(.95, g.zoomSpeed) }

                function a(e) { if (g.enabled !== !1) { if (e.preventDefault(), e.button === g.mouseButtons.ORBIT) { if (g.noRotate === !0) return;
                            B = D.ROTATE, y.set(e.clientX, e.clientY) } else if (e.button === g.mouseButtons.ZOOM) { if (g.noZoom === !0) return;
                            B = D.DOLLY, C.set(e.clientX, e.clientY) } else if (e.button === g.mouseButtons.PAN) { if (g.noPan === !0) return;
                            B = D.PAN, b.set(e.clientX, e.clientY) } B !== D.NONE && (document.addEventListener("mousemove", s, !1), document.addEventListener("mouseup", h, !1), g.dispatchEvent(V)) } }

                function s(e) { if (g.enabled !== !1) { e.preventDefault(); var t = g.domElement === document ? g.domElement.body : g.domElement; if (B === D.ROTATE) { if (g.noRotate === !0) return;
                            _.set(e.clientX, e.clientY), x.subVectors(_, y), g.rotateLeft(2 * Math.PI * x.x / t.clientWidth * g.rotateSpeed), g.rotateUp(2 * Math.PI * x.y / t.clientHeight * g.rotateSpeed), y.copy(_) } else if (B === D.DOLLY) { if (g.noZoom === !0) return;
                            A.set(e.clientX, e.clientY), E.subVectors(A, C), E.y > 0 ? g.dollyIn() : E.y < 0 && g.dollyOut(), C.copy(A) } else if (B === D.PAN) { if (g.noPan === !0) return;
                            w.set(e.clientX, e.clientY), T.subVectors(w, b), g.pan(T.x, T.y), b.copy(w) } B !== D.NONE && g.update() } }

                function h() { g.enabled !== !1 && (document.removeEventListener("mousemove", s, !1), document.removeEventListener("mouseup", h, !1), g.dispatchEvent(I), B = D.NONE) }

                function l(e) { if (g.enabled !== !1 && g.noZoom !== !0 && B === D.NONE) { e.preventDefault(), e.stopPropagation(); var t = 0;
                        void 0 !== e.wheelDelta ? t = e.wheelDelta : void 0 !== e.detail && (t = -e.detail), t > 0 ? g.dollyOut() : 0 > t && g.dollyIn(), g.update(), g.dispatchEvent(V), g.dispatchEvent(I) } }

                function c(e) { if (g.enabled !== !1 && g.noKeys !== !0 && g.noPan !== !0) switch (e.keyCode) {
                        case g.keys.UP:
                            g.pan(0, g.keyPanSpeed), g.update(); break;
                        case g.keys.BOTTOM:
                            g.pan(0, -g.keyPanSpeed), g.update(); break;
                        case g.keys.LEFT:
                            g.pan(g.keyPanSpeed, 0), g.update(); break;
                        case g.keys.RIGHT:
                            g.pan(-g.keyPanSpeed, 0), g.update() } }

                function u(e) { if (g.enabled !== !1) { switch (e.touches.length) {
                            case 1:
                                if (g.noRotate === !0) return;
                                B = D.TOUCH_ROTATE, y.set(e.touches[0].pageX, e.touches[0].pageY); break;
                            case 2:
                                if (g.noZoom === !0) return;
                                B = D.TOUCH_DOLLY; var t = e.touches[0].pageX - e.touches[1].pageX,
                                    i = e.touches[0].pageY - e.touches[1].pageY,
                                    r = Math.sqrt(t * t + i * i);
                                C.set(0, r); break;
                            case 3:
                                if (g.noPan === !0) return;
                                B = D.TOUCH_PAN, b.set(e.touches[0].pageX, e.touches[0].pageY); break;
                            default:
                                B = D.NONE } B !== D.NONE && g.dispatchEvent(V) } }

                function d(e) { if (g.enabled !== !1) { e.preventDefault(), e.stopPropagation(); var t = g.domElement === document ? g.domElement.body : g.domElement; switch (e.touches.length) {
                            case 1:
                                if (g.noRotate === !0) return; if (B !== D.TOUCH_ROTATE) return;
                                _.set(e.touches[0].pageX, e.touches[0].pageY), x.subVectors(_, y), g.rotateLeft(2 * Math.PI * x.x / t.clientWidth * g.rotateSpeed), g.rotateUp(2 * Math.PI * x.y / t.clientHeight * g.rotateSpeed), y.copy(_), g.update(); break;
                            case 2:
                                if (g.noZoom === !0) return; if (B !== D.TOUCH_DOLLY) return; var i = e.touches[0].pageX - e.touches[1].pageX,
                                    r = e.touches[0].pageY - e.touches[1].pageY,
                                    n = Math.sqrt(i * i + r * r);
                                A.set(0, n), E.subVectors(A, C), E.y > 0 ? g.dollyOut() : E.y < 0 && g.dollyIn(), C.copy(A), g.update(); break;
                            case 3:
                                if (g.noPan === !0) return; if (B !== D.TOUCH_PAN) return;
                                w.set(e.touches[0].pageX, e.touches[0].pageY), T.subVectors(w, b), g.pan(T.x, T.y), b.copy(w), g.update(); break;
                            default:
                                B = D.NONE } } }

                function p() { g.enabled !== !1 && (g.dispatchEvent(I), B = D.NONE) } this.object = t, this.domElement = void 0 !== r ? r : document, this.enabled = !0, this.target = new e.Vector3, this.center = this.target, this.noZoom = !1, this.zoomSpeed = 1,
                    this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.noRotate = !1, this.rotateSpeed = 1, this.noPan = !1, this.keyPanSpeed = 7, this.autoRotate = !1, this.autoRotateSpeed = 2, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -(1 / 0), this.maxAzimuthAngle = 1 / 0, this.noKeys = !1, this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 }, this.mouseButtons = { ORBIT: i.LEFT, ZOOM: i.MIDDLE, PAN: i.RIGHT };
                var f, m, g = this,
                    v = 1e-6,
                    y = new e.Vector2,
                    _ = new e.Vector2,
                    x = new e.Vector2,
                    b = new e.Vector2,
                    w = new e.Vector2,
                    T = new e.Vector2,
                    M = new e.Vector3,
                    S = new e.Vector3,
                    C = new e.Vector2,
                    A = new e.Vector2,
                    E = new e.Vector2,
                    P = 0,
                    L = 0,
                    R = 1,
                    F = new e.Vector3,
                    k = new e.Vector3,
                    O = new e.Quaternion,
                    D = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 },
                    B = D.NONE;
                this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom;
                var U = (new e.Quaternion).setFromUnitVectors(t.up, new e.Vector3(0, 1, 0)),
                    z = U.clone().inverse(),
                    N = { type: "change" },
                    V = { type: "start" },
                    I = { type: "end" };
                this.rotateLeft = function(e) { void 0 === e && (e = n()), L -= e }, this.rotateUp = function(e) { void 0 === e && (e = n()), P -= e }, this.panLeft = function(e) { var t = this.object.matrix.elements;
                    M.set(t[0], t[1], t[2]), M.multiplyScalar(-e), F.add(M) }, this.panUp = function(e) { var t = this.object.matrix.elements;
                    M.set(t[4], t[5], t[6]), M.multiplyScalar(e), F.add(M) }, this.pan = function(t, i) { var r = g.domElement === document ? g.domElement.body : g.domElement; if (g.object instanceof e.PerspectiveCamera) { var n = g.object.position,
                            o = n.clone().sub(g.target),
                            a = o.length();
                        a *= Math.tan(g.object.fov / 2 * Math.PI / 180), g.panLeft(2 * t * a / r.clientHeight), g.panUp(2 * i * a / r.clientHeight) } else g.object instanceof e.OrthographicCamera ? (g.panLeft(t * (g.object.right - g.object.left) / r.clientWidth), g.panUp(i * (g.object.top - g.object.bottom) / r.clientHeight)) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.") }, this.dollyIn = function(t) { void 0 === t && (t = o()), g.object instanceof e.PerspectiveCamera ? R /= t : g.object instanceof e.OrthographicCamera ? (g.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom * t)), g.object.updateProjectionMatrix(), g.dispatchEvent(N)) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.") }, this.dollyOut = function(t) { void 0 === t && (t = o()), g.object instanceof e.PerspectiveCamera ? R *= t : g.object instanceof e.OrthographicCamera ? (g.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / t)), g.object.updateProjectionMatrix(), g.dispatchEvent(N)) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.") }, this.update = function() { var e = this.object.position;
                    S.copy(e).sub(this.target), S.applyQuaternion(U), f = Math.atan2(S.x, S.z), m = Math.atan2(Math.sqrt(S.x * S.x + S.z * S.z), S.y), this.autoRotate && B === D.NONE && this.rotateLeft(n()), f += L, m += P, f = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, f)), m = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, m)), m = Math.max(v, Math.min(Math.PI - v, m)); var t = S.length() * R;
                    t = Math.max(this.minDistance, Math.min(this.maxDistance, t)), this.target.add(F), S.x = t * Math.sin(m) * Math.sin(f), S.y = t * Math.cos(m), S.z = t * Math.sin(m) * Math.cos(f), S.applyQuaternion(z), e.copy(this.target).add(S), this.object.lookAt(this.target), L = 0, P = 0, R = 1, F.set(0, 0, 0), (k.distanceToSquared(this.object.position) > v || 8 * (1 - O.dot(this.object.quaternion)) > v) && (this.dispatchEvent(N), k.copy(this.object.position), O.copy(this.object.quaternion)) }, this.reset = function() { B = D.NONE, this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(N), this.update() }, this.getPolarAngle = function() { return m }, this.getAzimuthalAngle = function() { return f }, this.domElement.addEventListener("contextmenu", function(e) { e.preventDefault() }, !1), this.domElement.addEventListener("mousedown", a, !1), this.domElement.addEventListener("mousewheel", l, !1), this.domElement.addEventListener("DOMMouseScroll", l, !1), this.domElement.addEventListener("touchstart", u, !1), this.domElement.addEventListener("touchend", p, !1), this.domElement.addEventListener("touchmove", d, !1), window.addEventListener("keydown", c, !1), this.update()
            }
            var i = e.MOUSE;
            return i || (i = { LEFT: 0, MIDDLE: 1, RIGHT: 2 }), t.prototype = Object.create(e.EventDispatcher.prototype), t.prototype.constructor = t, t
        }
    }, {}],
    36: [function(e, t, i) {
        var r = r || {},
            n = { REVISION: "71" };
        "object" == typeof t && (t.exports = n), void 0 === Math.sign && (Math.sign = function(e) { return 0 > e ? -1 : e > 0 ? 1 : +e }), n.log = function() { console.log.apply(console, arguments) }, n.warn = function() { console.warn.apply(console, arguments) }, n.error = function() { console.error.apply(console, arguments) }, n.MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2 }, n.CullFaceNone = 0, n.CullFaceBack = 1, n.CullFaceFront = 2, n.CullFaceFrontBack = 3, n.FrontFaceDirectionCW = 0, n.FrontFaceDirectionCCW = 1, n.BasicShadowMap = 0, n.PCFShadowMap = 1, n.PCFSoftShadowMap = 2, n.FrontSide = 0, n.BackSide = 1, n.DoubleSide = 2, n.NoShading = 0, n.FlatShading = 1, n.SmoothShading = 2, n.NoColors = 0, n.FaceColors = 1, n.VertexColors = 2, n.NoBlending = 0, n.NormalBlending = 1, n.AdditiveBlending = 2, n.SubtractiveBlending = 3, n.MultiplyBlending = 4, n.CustomBlending = 5, n.AddEquation = 100, n.SubtractEquation = 101, n.ReverseSubtractEquation = 102, n.MinEquation = 103, n.MaxEquation = 104, n.ZeroFactor = 200, n.OneFactor = 201, n.SrcColorFactor = 202, n.OneMinusSrcColorFactor = 203, n.SrcAlphaFactor = 204, n.OneMinusSrcAlphaFactor = 205, n.DstAlphaFactor = 206, n.OneMinusDstAlphaFactor = 207, n.DstColorFactor = 208, n.OneMinusDstColorFactor = 209, n.SrcAlphaSaturateFactor = 210, n.MultiplyOperation = 0, n.MixOperation = 1, n.AddOperation = 2, n.UVMapping = 300, n.CubeReflectionMapping = 301, n.CubeRefractionMapping = 302, n.EquirectangularReflectionMapping = 303, n.EquirectangularRefractionMapping = 304, n.SphericalReflectionMapping = 305, n.RepeatWrapping = 1e3, n.ClampToEdgeWrapping = 1001, n.MirroredRepeatWrapping = 1002, n.NearestFilter = 1003, n.NearestMipMapNearestFilter = 1004, n.NearestMipMapLinearFilter = 1005, n.LinearFilter = 1006, n.LinearMipMapNearestFilter = 1007, n.LinearMipMapLinearFilter = 1008, n.UnsignedByteType = 1009, n.ByteType = 1010, n.ShortType = 1011, n.UnsignedShortType = 1012, n.IntType = 1013, n.UnsignedIntType = 1014, n.FloatType = 1015, n.HalfFloatType = 1025, n.UnsignedShort4444Type = 1016, n.UnsignedShort5551Type = 1017, n.UnsignedShort565Type = 1018, n.AlphaFormat = 1019, n.RGBFormat = 1020, n.RGBAFormat = 1021, n.LuminanceFormat = 1022, n.LuminanceAlphaFormat = 1023, n.RGBEFormat = n.RGBAFormat, n.RGB_S3TC_DXT1_Format = 2001, n.RGBA_S3TC_DXT1_Format = 2002, n.RGBA_S3TC_DXT3_Format = 2003, n.RGBA_S3TC_DXT5_Format = 2004, n.RGB_PVRTC_4BPPV1_Format = 2100, n.RGB_PVRTC_2BPPV1_Format = 2101, n.RGBA_PVRTC_4BPPV1_Format = 2102, n.RGBA_PVRTC_2BPPV1_Format = 2103, n.Projector = function() { n.error("THREE.Projector has been moved to /examples/js/renderers/Projector.js."), this.projectVector = function(e, t) { n.warn("THREE.Projector: .projectVector() is now vector.project()."), e.project(t) }, this.unprojectVector = function(e, t) { n.warn("THREE.Projector: .unprojectVector() is now vector.unproject()."), e.unproject(t) }, this.pickingRay = function(e, t) { n.error("THREE.Projector: .pickingRay() is now raycaster.setFromCamera().") } }, n.CanvasRenderer = function() { n.error("THREE.CanvasRenderer has been moved to /examples/js/renderers/CanvasRenderer.js"), this.domElement = document.createElement("canvas"), this.clear = function() {}, this.render = function() {}, this.setClearColor = function() {}, this.setSize = function() {} }, n.Color = function(e) { return 3 === arguments.length ? this.setRGB(arguments[0], arguments[1], arguments[2]) : this.set(e) }, n.Color.prototype = { constructor: n.Color, r: 1, g: 1, b: 1, set: function(e) { return e instanceof n.Color ? this.copy(e) : "number" == typeof e ? this.setHex(e) : "string" == typeof e && this.setStyle(e), this }, setHex: function(e) { return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (255 & e) / 255, this }, setRGB: function(e, t, i) { return this.r = e, this.g = t, this.b = i, this }, setHSL: function(e, t, i) { if (0 === t) this.r = this.g = this.b = i;
                    else { var r = function(e, t, i) { return 0 > i && (i += 1), i > 1 && (i -= 1), 1 / 6 > i ? e + 6 * (t - e) * i : .5 > i ? t : 2 / 3 > i ? e + 6 * (t - e) * (2 / 3 - i) : e },
                            n = .5 >= i ? i * (1 + t) : i + t - i * t,
                            o = 2 * i - n;
                        this.r = r(o, n, e + 1 / 3), this.g = r(o, n, e), this.b = r(o, n, e - 1 / 3) } return this }, setStyle: function(e) { if (/^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.test(e)) { var t = /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.exec(e); return this.r = Math.min(255, parseInt(t[1], 10)) / 255, this.g = Math.min(255, parseInt(t[2], 10)) / 255, this.b = Math.min(255, parseInt(t[3], 10)) / 255, this } if (/^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.test(e)) { var t = /^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.exec(e); return this.r = Math.min(100, parseInt(t[1], 10)) / 100, this.g = Math.min(100, parseInt(t[2], 10)) / 100, this.b = Math.min(100, parseInt(t[3], 10)) / 100, this } if (/^\#([0-9a-f]{6})$/i.test(e)) { var t = /^\#([0-9a-f]{6})$/i.exec(e); return this.setHex(parseInt(t[1], 16)), this } if (/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test(e)) { var t = /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(e); return this.setHex(parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3], 16)), this } return /^(\w+)$/i.test(e) ? (this.setHex(n.ColorKeywords[e]), this) : void 0 }, copy: function(e) { return this.r = e.r, this.g = e.g, this.b = e.b, this }, copyGammaToLinear: function(e, t) { return void 0 === t && (t = 2), this.r = Math.pow(e.r, t), this.g = Math.pow(e.g, t), this.b = Math.pow(e.b, t), this }, copyLinearToGamma: function(e, t) { void 0 === t && (t = 2); var i = t > 0 ? 1 / t : 1; return this.r = Math.pow(e.r, i), this.g = Math.pow(e.g, i), this.b = Math.pow(e.b, i), this }, convertGammaToLinear: function() { var e = this.r,
                        t = this.g,
                        i = this.b; return this.r = e * e, this.g = t * t, this.b = i * i, this }, convertLinearToGamma: function() { return this.r = Math.sqrt(this.r), this.g = Math.sqrt(this.g), this.b = Math.sqrt(this.b), this }, getHex: function() { return 255 * this.r << 16 ^ 255 * this.g << 8 ^ 255 * this.b << 0 }, getHexString: function() { return ("000000" + this.getHex().toString(16)).slice(-6) }, getHSL: function(e) { var t, i, r = e || { h: 0, s: 0, l: 0 },
                        n = this.r,
                        o = this.g,
                        a = this.b,
                        s = Math.max(n, o, a),
                        h = Math.min(n, o, a),
                        l = (h + s) / 2; if (h === s) t = 0, i = 0;
                    else { var c = s - h; switch (i = .5 >= l ? c / (s + h) : c / (2 - s - h), s) {
                            case n:
                                t = (o - a) / c + (a > o ? 6 : 0); break;
                            case o:
                                t = (a - n) / c + 2; break;
                            case a:
                                t = (n - o) / c + 4 } t /= 6 } return r.h = t, r.s = i, r.l = l, r }, getStyle: function() { return "rgb(" + (255 * this.r | 0) + "," + (255 * this.g | 0) + "," + (255 * this.b | 0) + ")" }, offsetHSL: function(e, t, i) { var r = this.getHSL(); return r.h += e, r.s += t, r.l += i, this.setHSL(r.h, r.s, r.l), this }, add: function(e) { return this.r += e.r, this.g += e.g, this.b += e.b, this }, addColors: function(e, t) { return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this }, addScalar: function(e) { return this.r += e, this.g += e, this.b += e, this }, multiply: function(e) { return this.r *= e.r, this.g *= e.g, this.b *= e.b, this }, multiplyScalar: function(e) { return this.r *= e, this.g *= e, this.b *= e, this }, lerp: function(e, t) { return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this }, equals: function(e) { return e.r === this.r && e.g === this.g && e.b === this.b }, fromArray: function(e) { return this.r = e[0], this.g = e[1], this.b = e[2], this }, toArray: function(e, t) { return void 0 === e && (e = []), void 0 === t && (t = 0), e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e }, clone: function() { return (new n.Color).setRGB(this.r, this.g, this.b) } }, n.ColorKeywords = { aliceblue: 15792383, antiquewhite: 16444375, aqua: 65535, aquamarine: 8388564, azure: 15794175, beige: 16119260, bisque: 16770244, black: 0, blanchedalmond: 16772045, blue: 255, blueviolet: 9055202, brown: 10824234, burlywood: 14596231, cadetblue: 6266528, chartreuse: 8388352, chocolate: 13789470, coral: 16744272, cornflowerblue: 6591981, cornsilk: 16775388, crimson: 14423100, cyan: 65535, darkblue: 139, darkcyan: 35723, darkgoldenrod: 12092939, darkgray: 11119017, darkgreen: 25600, darkgrey: 11119017, darkkhaki: 12433259, darkmagenta: 9109643, darkolivegreen: 5597999, darkorange: 16747520, darkorchid: 10040012, darkred: 9109504, darksalmon: 15308410, darkseagreen: 9419919, darkslateblue: 4734347, darkslategray: 3100495, darkslategrey: 3100495, darkturquoise: 52945, darkviolet: 9699539, deeppink: 16716947, deepskyblue: 49151, dimgray: 6908265, dimgrey: 6908265, dodgerblue: 2003199, firebrick: 11674146, floralwhite: 16775920, forestgreen: 2263842, fuchsia: 16711935, gainsboro: 14474460, ghostwhite: 16316671, gold: 16766720, goldenrod: 14329120, gray: 8421504, green: 32768, greenyellow: 11403055, grey: 8421504, honeydew: 15794160, hotpink: 16738740, indianred: 13458524, indigo: 4915330, ivory: 16777200, khaki: 15787660, lavender: 15132410, lavenderblush: 16773365, lawngreen: 8190976, lemonchiffon: 16775885, lightblue: 11393254, lightcoral: 15761536, lightcyan: 14745599, lightgoldenrodyellow: 16448210, lightgray: 13882323, lightgreen: 9498256, lightgrey: 13882323, lightpink: 16758465, lightsalmon: 16752762, lightseagreen: 2142890, lightskyblue: 8900346, lightslategray: 7833753, lightslategrey: 7833753, lightsteelblue: 11584734, lightyellow: 16777184, lime: 65280, limegreen: 3329330, linen: 16445670, magenta: 16711935, maroon: 8388608, mediumaquamarine: 6737322, mediumblue: 205, mediumorchid: 12211667, mediumpurple: 9662683, mediumseagreen: 3978097, mediumslateblue: 8087790, mediumspringgreen: 64154, mediumturquoise: 4772300, mediumvioletred: 13047173, midnightblue: 1644912, mintcream: 16121850, mistyrose: 16770273, moccasin: 16770229, navajowhite: 16768685, navy: 128, oldlace: 16643558, olive: 8421376, olivedrab: 7048739, orange: 16753920, orangered: 16729344, orchid: 14315734, palegoldenrod: 15657130, palegreen: 10025880, paleturquoise: 11529966, palevioletred: 14381203, papayawhip: 16773077, peachpuff: 16767673, peru: 13468991, pink: 16761035, plum: 14524637, powderblue: 11591910, purple: 8388736, red: 16711680, rosybrown: 12357519, royalblue: 4286945, saddlebrown: 9127187, salmon: 16416882, sandybrown: 16032864, seagreen: 3050327, seashell: 16774638, sienna: 10506797, silver: 12632256, skyblue: 8900331, slateblue: 6970061, slategray: 7372944, slategrey: 7372944, snow: 16775930, springgreen: 65407, steelblue: 4620980, tan: 13808780, teal: 32896, thistle: 14204888, tomato: 16737095, turquoise: 4251856, violet: 15631086, wheat: 16113331, white: 16777215, whitesmoke: 16119285, yellow: 16776960, yellowgreen: 10145074 }, n.Quaternion = function(e, t, i, r) { this._x = e || 0, this._y = t || 0, this._z = i || 0, this._w = void 0 !== r ? r : 1 }, n.Quaternion.prototype = { constructor: n.Quaternion, _x: 0, _y: 0, _z: 0, _w: 0, get x() { return this._x }, set x(e) { this._x = e, this.onChangeCallback() }, get y() { return this._y }, set y(e) { this._y = e, this.onChangeCallback() }, get z() { return this._z }, set z(e) { this._z = e, this.onChangeCallback() }, get w() { return this._w }, set w(e) { this._w = e, this.onChangeCallback() }, set: function(e, t, i, r) { return this._x = e, this._y = t, this._z = i, this._w = r, this.onChangeCallback(), this }, copy: function(e) { return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this.onChangeCallback(), this }, setFromEuler: function(e, t) { if (e instanceof n.Euler == !1) throw new Error("THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order."); var i = Math.cos(e._x / 2),
                        r = Math.cos(e._y / 2),
                        o = Math.cos(e._z / 2),
                        a = Math.sin(e._x / 2),
                        s = Math.sin(e._y / 2),
                        h = Math.sin(e._z / 2); return "XYZ" === e.order ? (this._x = a * r * o + i * s * h, this._y = i * s * o - a * r * h, this._z = i * r * h + a * s * o, this._w = i * r * o - a * s * h) : "YXZ" === e.order ? (this._x = a * r * o + i * s * h, this._y = i * s * o - a * r * h, this._z = i * r * h - a * s * o, this._w = i * r * o + a * s * h) : "ZXY" === e.order ? (this._x = a * r * o - i * s * h, this._y = i * s * o + a * r * h, this._z = i * r * h + a * s * o, this._w = i * r * o - a * s * h) : "ZYX" === e.order ? (this._x = a * r * o - i * s * h, this._y = i * s * o + a * r * h, this._z = i * r * h - a * s * o, this._w = i * r * o + a * s * h) : "YZX" === e.order ? (this._x = a * r * o + i * s * h, this._y = i * s * o + a * r * h, this._z = i * r * h - a * s * o, this._w = i * r * o - a * s * h) : "XZY" === e.order && (this._x = a * r * o - i * s * h, this._y = i * s * o - a * r * h, this._z = i * r * h + a * s * o, this._w = i * r * o + a * s * h), t !== !1 && this.onChangeCallback(), this }, setFromAxisAngle: function(e, t) { var i = t / 2,
                        r = Math.sin(i); return this._x = e.x * r, this._y = e.y * r, this._z = e.z * r, this._w = Math.cos(i), this.onChangeCallback(), this }, setFromRotationMatrix: function(e) { var t, i = e.elements,
                        r = i[0],
                        n = i[4],
                        o = i[8],
                        a = i[1],
                        s = i[5],
                        h = i[9],
                        l = i[2],
                        c = i[6],
                        u = i[10],
                        d = r + s + u; return d > 0 ? (t = .5 / Math.sqrt(d + 1), this._w = .25 / t, this._x = (c - h) * t, this._y = (o - l) * t, this._z = (a - n) * t) : r > s && r > u ? (t = 2 * Math.sqrt(1 + r - s - u), this._w = (c - h) / t, this._x = .25 * t, this._y = (n + a) / t, this._z = (o + l) / t) : s > u ? (t = 2 * Math.sqrt(1 + s - r - u), this._w = (o - l) / t, this._x = (n + a) / t, this._y = .25 * t, this._z = (h + c) / t) : (t = 2 * Math.sqrt(1 + u - r - s), this._w = (a - n) / t, this._x = (o + l) / t, this._y = (h + c) / t, this._z = .25 * t), this.onChangeCallback(), this }, setFromUnitVectors: function() { var e, t, i = 1e-6; return function(r, o) { return void 0 === e && (e = new n.Vector3), t = r.dot(o) + 1, i > t ? (t = 0, Math.abs(r.x) > Math.abs(r.z) ? e.set(-r.y, r.x, 0) : e.set(0, -r.z, r.y)) : e.crossVectors(r, o), this._x = e.x, this._y = e.y, this._z = e.z, this._w = t, this.normalize(), this } }(), inverse: function() { return this.conjugate().normalize(), this }, conjugate: function() { return this._x *= -1, this._y *= -1, this._z *= -1, this.onChangeCallback(), this }, dot: function(e) { return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w }, lengthSq: function() { return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w }, length: function() { return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w) }, normalize: function() { var e = this.length(); return 0 === e ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x = this._x * e, this._y = this._y * e, this._z = this._z * e, this._w = this._w * e), this.onChangeCallback(), this }, multiply: function(e, t) { return void 0 !== t ? (n.warn("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."), this.multiplyQuaternions(e, t)) : this.multiplyQuaternions(this, e) }, multiplyQuaternions: function(e, t) { var i = e._x,
                        r = e._y,
                        n = e._z,
                        o = e._w,
                        a = t._x,
                        s = t._y,
                        h = t._z,
                        l = t._w; return this._x = i * l + o * a + r * h - n * s, this._y = r * l + o * s + n * a - i * h, this._z = n * l + o * h + i * s - r * a, this._w = o * l - i * a - r * s - n * h, this.onChangeCallback(), this }, multiplyVector3: function(e) { return n.warn("THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead."), e.applyQuaternion(this) }, slerp: function(e, t) { if (0 === t) return this; if (1 === t) return this.copy(e); var i = this._x,
                        r = this._y,
                        n = this._z,
                        o = this._w,
                        a = o * e._w + i * e._x + r * e._y + n * e._z; if (0 > a ? (this._w = -e._w, this._x = -e._x, this._y = -e._y, this._z = -e._z, a = -a) : this.copy(e), a >= 1) return this._w = o, this._x = i, this._y = r, this._z = n, this; var s = Math.acos(a),
                        h = Math.sqrt(1 - a * a); if (Math.abs(h) < .001) return this._w = .5 * (o + this._w), this._x = .5 * (i + this._x), this._y = .5 * (r + this._y), this._z = .5 * (n + this._z), this; var l = Math.sin((1 - t) * s) / h,
                        c = Math.sin(t * s) / h; return this._w = o * l + this._w * c, this._x = i * l + this._x * c, this._y = r * l + this._y * c, this._z = n * l + this._z * c, this.onChangeCallback(), this }, equals: function(e) { return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w }, fromArray: function(e, t) { return void 0 === t && (t = 0), this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this.onChangeCallback(), this }, toArray: function(e, t) { return void 0 === e && (e = []), void 0 === t && (t = 0), e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e }, onChange: function(e) { return this.onChangeCallback = e, this }, onChangeCallback: function() {}, clone: function() { return new n.Quaternion(this._x, this._y, this._z, this._w) } }, n.Quaternion.slerp = function(e, t, i, r) { return i.copy(e).slerp(t, r) }, n.Vector2 = function(e, t) { this.x = e || 0, this.y = t || 0 }, n.Vector2.prototype = { constructor: n.Vector2, set: function(e, t) { return this.x = e, this.y = t, this }, setX: function(e) { return this.x = e, this }, setY: function(e) { return this.y = e, this }, setComponent: function(e, t) { switch (e) {
                        case 0:
                            this.x = t; break;
                        case 1:
                            this.y = t; break;
                        default:
                            throw new Error("index is out of range: " + e) } }, getComponent: function(e) { switch (e) {
                        case 0:
                            return this.x;
                        case 1:
                            return this.y;
                        default:
                            throw new Error("index is out of range: " + e) } }, copy: function(e) { return this.x = e.x, this.y = e.y, this }, add: function(e, t) { return void 0 !== t ? (n.warn("THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."), this.addVectors(e, t)) : (this.x += e.x, this.y += e.y, this) }, addScalar: function(e) { return this.x += e, this.y += e, this }, addVectors: function(e, t) { return this.x = e.x + t.x, this.y = e.y + t.y, this }, sub: function(e, t) { return void 0 !== t ? (n.warn("THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), this.subVectors(e, t)) : (this.x -= e.x, this.y -= e.y, this) }, subScalar: function(e) { return this.x -= e, this.y -= e, this }, subVectors: function(e, t) { return this.x = e.x - t.x, this.y = e.y - t.y, this }, multiply: function(e) { return this.x *= e.x, this.y *= e.y, this }, multiplyScalar: function(e) { return this.x *= e, this.y *= e, this }, divide: function(e) { return this.x /= e.x, this.y /= e.y, this }, divideScalar: function(e) { if (0 !== e) { var t = 1 / e;
                        this.x *= t, this.y *= t } else this.x = 0, this.y = 0; return this }, min: function(e) { return this.x > e.x && (this.x = e.x), this.y > e.y && (this.y = e.y), this }, max: function(e) { return this.x < e.x && (this.x = e.x), this.y < e.y && (this.y = e.y), this }, clamp: function(e, t) { return this.x < e.x ? this.x = e.x : this.x > t.x && (this.x = t.x), this.y < e.y ? this.y = e.y : this.y > t.y && (this.y = t.y), this }, clampScalar: function() { var e, t; return function(i, r) { return void 0 === e && (e = new n.Vector2, t = new n.Vector2), e.set(i, i), t.set(r, r), this.clamp(e, t) } }(), floor: function() { return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this }, ceil: function() { return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this }, round: function() { return this.x = Math.round(this.x), this.y = Math.round(this.y), this }, roundToZero: function() { return this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x), this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y), this }, negate: function() { return this.x = -this.x, this.y = -this.y, this }, dot: function(e) { return this.x * e.x + this.y * e.y }, lengthSq: function() { return this.x * this.x + this.y * this.y }, length: function() { return Math.sqrt(this.x * this.x + this.y * this.y) }, normalize: function() { return this.divideScalar(this.length()) }, distanceTo: function(e) { return Math.sqrt(this.distanceToSquared(e)) }, distanceToSquared: function(e) { var t = this.x - e.x,
                        i = this.y - e.y; return t * t + i * i }, setLength: function(e) { var t = this.length(); return 0 !== t && e !== t && this.multiplyScalar(e / t), this }, lerp: function(e, t) { return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this }, lerpVectors: function(e, t, i) { return this.subVectors(t, e).multiplyScalar(i).add(e), this }, equals: function(e) { return e.x === this.x && e.y === this.y }, fromArray: function(e, t) { return void 0 === t && (t = 0), this.x = e[t], this.y = e[t + 1], this }, toArray: function(e, t) { return void 0 === e && (e = []), void 0 === t && (t = 0), e[t] = this.x, e[t + 1] = this.y, e }, fromAttribute: function(e, t, i) { return void 0 === i && (i = 0), t = t * e.itemSize + i, this.x = e.array[t], this.y = e.array[t + 1], this }, clone: function() { return new n.Vector2(this.x, this.y) } }, n.Vector3 = function(e, t, i) { this.x = e || 0, this.y = t || 0, this.z = i || 0 }, n.Vector3.prototype = { constructor: n.Vector3, set: function(e, t, i) { return this.x = e, this.y = t, this.z = i, this }, setX: function(e) { return this.x = e, this }, setY: function(e) { return this.y = e, this }, setZ: function(e) { return this.z = e, this }, setComponent: function(e, t) { switch (e) {
                        case 0:
                            this.x = t; break;
                        case 1:
                            this.y = t; break;
                        case 2:
                            this.z = t; break;
                        default:
                            throw new Error("index is out of range: " + e) } }, getComponent: function(e) { switch (e) {
                        case 0:
                            return this.x;
                        case 1:
                            return this.y;
                        case 2:
                            return this.z;
                        default:
                            throw new Error("index is out of range: " + e) } }, copy: function(e) { return this.x = e.x, this.y = e.y, this.z = e.z, this }, add: function(e, t) { return void 0 !== t ? (n.warn("THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."), this.addVectors(e, t)) : (this.x += e.x, this.y += e.y, this.z += e.z, this) }, addScalar: function(e) { return this.x += e, this.y += e, this.z += e, this }, addVectors: function(e, t) { return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this }, sub: function(e, t) { return void 0 !== t ? (n.warn("THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), this.subVectors(e, t)) : (this.x -= e.x, this.y -= e.y, this.z -= e.z, this) }, subScalar: function(e) { return this.x -= e, this.y -= e, this.z -= e, this }, subVectors: function(e, t) { return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this }, multiply: function(e, t) { return void 0 !== t ? (n.warn("THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."), this.multiplyVectors(e, t)) : (this.x *= e.x, this.y *= e.y, this.z *= e.z, this) }, multiplyScalar: function(e) { return this.x *= e, this.y *= e, this.z *= e, this }, multiplyVectors: function(e, t) { return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this }, applyEuler: function() { var e; return function(t) { return t instanceof n.Euler == !1 && n.error("THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order."), void 0 === e && (e = new n.Quaternion), this.applyQuaternion(e.setFromEuler(t)), this } }(), applyAxisAngle: function() { var e; return function(t, i) { return void 0 === e && (e = new n.Quaternion), this.applyQuaternion(e.setFromAxisAngle(t, i)), this } }(), applyMatrix3: function(e) { var t = this.x,
                        i = this.y,
                        r = this.z,
                        n = e.elements; return this.x = n[0] * t + n[3] * i + n[6] * r, this.y = n[1] * t + n[4] * i + n[7] * r, this.z = n[2] * t + n[5] * i + n[8] * r, this }, applyMatrix4: function(e) { var t = this.x,
                        i = this.y,
                        r = this.z,
                        n = e.elements; return this.x = n[0] * t + n[4] * i + n[8] * r + n[12], this.y = n[1] * t + n[5] * i + n[9] * r + n[13], this.z = n[2] * t + n[6] * i + n[10] * r + n[14], this }, applyProjection: function(e) { var t = this.x,
                        i = this.y,
                        r = this.z,
                        n = e.elements,
                        o = 1 / (n[3] * t + n[7] * i + n[11] * r + n[15]); return this.x = (n[0] * t + n[4] * i + n[8] * r + n[12]) * o, this.y = (n[1] * t + n[5] * i + n[9] * r + n[13]) * o, this.z = (n[2] * t + n[6] * i + n[10] * r + n[14]) * o, this }, applyQuaternion: function(e) { var t = this.x,
                        i = this.y,
                        r = this.z,
                        n = e.x,
                        o = e.y,
                        a = e.z,
                        s = e.w,
                        h = s * t + o * r - a * i,
                        l = s * i + a * t - n * r,
                        c = s * r + n * i - o * t,
                        u = -n * t - o * i - a * r; return this.x = h * s + u * -n + l * -a - c * -o, this.y = l * s + u * -o + c * -n - h * -a, this.z = c * s + u * -a + h * -o - l * -n, this }, project: function() { var e; return function(t) { return void 0 === e && (e = new n.Matrix4), e.multiplyMatrices(t.projectionMatrix, e.getInverse(t.matrixWorld)), this.applyProjection(e) } }(), unproject: function() { var e; return function(t) { return void 0 === e && (e = new n.Matrix4), e.multiplyMatrices(t.matrixWorld, e.getInverse(t.projectionMatrix)), this.applyProjection(e) } }(), transformDirection: function(e) { var t = this.x,
                        i = this.y,
                        r = this.z,
                        n = e.elements; return this.x = n[0] * t + n[4] * i + n[8] * r, this.y = n[1] * t + n[5] * i + n[9] * r, this.z = n[2] * t + n[6] * i + n[10] * r, this.normalize(), this }, divide: function(e) { return this.x /= e.x, this.y /= e.y, this.z /= e.z, this }, divideScalar: function(e) { if (0 !== e) { var t = 1 / e;
                        this.x *= t, this.y *= t, this.z *= t } else this.x = 0, this.y = 0, this.z = 0; return this }, min: function(e) { return this.x > e.x && (this.x = e.x), this.y > e.y && (this.y = e.y), this.z > e.z && (this.z = e.z), this }, max: function(e) { return this.x < e.x && (this.x = e.x), this.y < e.y && (this.y = e.y), this.z < e.z && (this.z = e.z), this }, clamp: function(e, t) { return this.x < e.x ? this.x = e.x : this.x > t.x && (this.x = t.x), this.y < e.y ? this.y = e.y : this.y > t.y && (this.y = t.y), this.z < e.z ? this.z = e.z : this.z > t.z && (this.z = t.z), this }, clampScalar: function() { var e, t; return function(i, r) { return void 0 === e && (e = new n.Vector3, t = new n.Vector3), e.set(i, i, i), t.set(r, r, r), this.clamp(e, t) } }(), floor: function() { return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this }, ceil: function() { return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this }, round: function() { return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this }, roundToZero: function() { return this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x), this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y), this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z), this }, negate: function() { return this.x = -this.x, this.y = -this.y, this.z = -this.z, this }, dot: function(e) { return this.x * e.x + this.y * e.y + this.z * e.z }, lengthSq: function() { return this.x * this.x + this.y * this.y + this.z * this.z }, length: function() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z) }, lengthManhattan: function() { return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) }, normalize: function() { return this.divideScalar(this.length()) }, setLength: function(e) { var t = this.length(); return 0 !== t && e !== t && this.multiplyScalar(e / t), this }, lerp: function(e, t) { return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this }, lerpVectors: function(e, t, i) { return this.subVectors(t, e).multiplyScalar(i).add(e), this }, cross: function(e, t) { if (void 0 !== t) return n.warn("THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."), this.crossVectors(e, t); var i = this.x,
                        r = this.y,
                        o = this.z; return this.x = r * e.z - o * e.y, this.y = o * e.x - i * e.z, this.z = i * e.y - r * e.x, this }, crossVectors: function(e, t) { var i = e.x,
                        r = e.y,
                        n = e.z,
                        o = t.x,
                        a = t.y,
                        s = t.z; return this.x = r * s - n * a, this.y = n * o - i * s, this.z = i * a - r * o, this }, projectOnVector: function() { var e, t; return function(i) { return void 0 === e && (e = new n.Vector3), e.copy(i).normalize(), t = this.dot(e), this.copy(e).multiplyScalar(t) } }(), projectOnPlane: function() { var e; return function(t) { return void 0 === e && (e = new n.Vector3), e.copy(this).projectOnVector(t), this.sub(e) } }(), reflect: function() { var e; return function(t) { return void 0 === e && (e = new n.Vector3), this.sub(e.copy(t).multiplyScalar(2 * this.dot(t))) } }(), angleTo: function(e) { var t = this.dot(e) / (this.length() * e.length()); return Math.acos(n.Math.clamp(t, -1, 1)) }, distanceTo: function(e) { return Math.sqrt(this.distanceToSquared(e)) }, distanceToSquared: function(e) { var t = this.x - e.x,
                        i = this.y - e.y,
                        r = this.z - e.z; return t * t + i * i + r * r }, setEulerFromRotationMatrix: function(e, t) { n.error("THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.") }, setEulerFromQuaternion: function(e, t) { n.error("THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.") }, getPositionFromMatrix: function(e) { return n.warn("THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition()."), this.setFromMatrixPosition(e) }, getScaleFromMatrix: function(e) { return n.warn("THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale()."), this.setFromMatrixScale(e) }, getColumnFromMatrix: function(e, t) { return n.warn("THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn()."), this.setFromMatrixColumn(e, t) }, setFromMatrixPosition: function(e) { return this.x = e.elements[12], this.y = e.elements[13], this.z = e.elements[14], this }, setFromMatrixScale: function(e) { var t = this.set(e.elements[0], e.elements[1], e.elements[2]).length(),
                        i = this.set(e.elements[4], e.elements[5], e.elements[6]).length(),
                        r = this.set(e.elements[8], e.elements[9], e.elements[10]).length(); return this.x = t, this.y = i, this.z = r, this }, setFromMatrixColumn: function(e, t) { var i = 4 * e,
                        r = t.elements; return this.x = r[i], this.y = r[i + 1], this.z = r[i + 2], this }, equals: function(e) { return e.x === this.x && e.y === this.y && e.z === this.z }, fromArray: function(e, t) { return void 0 === t && (t = 0), this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this }, toArray: function(e, t) { return void 0 === e && (e = []), void 0 === t && (t = 0), e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e }, fromAttribute: function(e, t, i) { return void 0 === i && (i = 0), t = t * e.itemSize + i, this.x = e.array[t], this.y = e.array[t + 1], this.z = e.array[t + 2], this }, clone: function() { return new n.Vector3(this.x, this.y, this.z) } }, n.Vector4 = function(e, t, i, r) { this.x = e || 0, this.y = t || 0, this.z = i || 0, this.w = void 0 !== r ? r : 1 }, n.Vector4.prototype = {
                constructor: n.Vector4,
                set: function(e, t, i, r) { return this.x = e, this.y = t, this.z = i, this.w = r, this },
                setX: function(e) { return this.x = e, this },
                setY: function(e) { return this.y = e, this },
                setZ: function(e) { return this.z = e, this },
                setW: function(e) { return this.w = e, this },
                setComponent: function(e, t) { switch (e) {
                        case 0:
                            this.x = t; break;
                        case 1:
                            this.y = t; break;
                        case 2:
                            this.z = t; break;
                        case 3:
                            this.w = t; break;
                        default:
                            throw new Error("index is out of range: " + e) } },
                getComponent: function(e) { switch (e) {
                        case 0:
                            return this.x;
                        case 1:
                            return this.y;
                        case 2:
                            return this.z;
                        case 3:
                            return this.w;
                        default:
                            throw new Error("index is out of range: " + e) } },
                copy: function(e) { return this.x = e.x, this.y = e.y, this.z = e.z, this.w = void 0 !== e.w ? e.w : 1, this },
                add: function(e, t) { return void 0 !== t ? (n.warn("THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead."), this.addVectors(e, t)) : (this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this) },
                addScalar: function(e) { return this.x += e, this.y += e, this.z += e, this.w += e, this },
                addVectors: function(e, t) { return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this },
                sub: function(e, t) { return void 0 !== t ? (n.warn("THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), this.subVectors(e, t)) : (this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this) },
                subScalar: function(e) { return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this },
                subVectors: function(e, t) { return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this },
                multiplyScalar: function(e) { return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this },
                applyMatrix4: function(e) {
                    var t = this.x,
                        i = this.y,
                        r = this.z,
                        n = this.w,
                        o = e.elements;
                    return this.x = o[0] * t + o[4] * i + o[8] * r + o[12] * n, this.y = o[1] * t + o[5] * i + o[9] * r + o[13] * n,
                        this.z = o[2] * t + o[6] * i + o[10] * r + o[14] * n, this.w = o[3] * t + o[7] * i + o[11] * r + o[15] * n, this
                },
                divideScalar: function(e) { if (0 !== e) { var t = 1 / e;
                        this.x *= t, this.y *= t, this.z *= t, this.w *= t } else this.x = 0, this.y = 0, this.z = 0, this.w = 1; return this },
                setAxisAngleFromQuaternion: function(e) { this.w = 2 * Math.acos(e.w); var t = Math.sqrt(1 - e.w * e.w); return 1e-4 > t ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this },
                setAxisAngleFromRotationMatrix: function(e) { var t, i, r, n, o = .01,
                        a = .1,
                        s = e.elements,
                        h = s[0],
                        l = s[4],
                        c = s[8],
                        u = s[1],
                        d = s[5],
                        p = s[9],
                        f = s[2],
                        m = s[6],
                        g = s[10]; if (Math.abs(l - u) < o && Math.abs(c - f) < o && Math.abs(p - m) < o) { if (Math.abs(l + u) < a && Math.abs(c + f) < a && Math.abs(p + m) < a && Math.abs(h + d + g - 3) < a) return this.set(1, 0, 0, 0), this;
                        t = Math.PI; var v = (h + 1) / 2,
                            y = (d + 1) / 2,
                            _ = (g + 1) / 2,
                            x = (l + u) / 4,
                            b = (c + f) / 4,
                            w = (p + m) / 4; return v > y && v > _ ? o > v ? (i = 0, r = .707106781, n = .707106781) : (i = Math.sqrt(v), r = x / i, n = b / i) : y > _ ? o > y ? (i = .707106781, r = 0, n = .707106781) : (r = Math.sqrt(y), i = x / r, n = w / r) : o > _ ? (i = .707106781, r = .707106781, n = 0) : (n = Math.sqrt(_), i = b / n, r = w / n), this.set(i, r, n, t), this } var T = Math.sqrt((m - p) * (m - p) + (c - f) * (c - f) + (u - l) * (u - l)); return Math.abs(T) < .001 && (T = 1), this.x = (m - p) / T, this.y = (c - f) / T, this.z = (u - l) / T, this.w = Math.acos((h + d + g - 1) / 2), this },
                min: function(e) { return this.x > e.x && (this.x = e.x), this.y > e.y && (this.y = e.y), this.z > e.z && (this.z = e.z), this.w > e.w && (this.w = e.w), this },
                max: function(e) { return this.x < e.x && (this.x = e.x), this.y < e.y && (this.y = e.y), this.z < e.z && (this.z = e.z), this.w < e.w && (this.w = e.w), this },
                clamp: function(e, t) { return this.x < e.x ? this.x = e.x : this.x > t.x && (this.x = t.x), this.y < e.y ? this.y = e.y : this.y > t.y && (this.y = t.y), this.z < e.z ? this.z = e.z : this.z > t.z && (this.z = t.z), this.w < e.w ? this.w = e.w : this.w > t.w && (this.w = t.w), this },
                clampScalar: function() { var e, t; return function(i, r) { return void 0 === e && (e = new n.Vector4, t = new n.Vector4), e.set(i, i, i, i), t.set(r, r, r, r), this.clamp(e, t) } }(),
                floor: function() { return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this },
                ceil: function() { return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this },
                round: function() { return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this },
                roundToZero: function() { return this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x), this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y), this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z), this.w = this.w < 0 ? Math.ceil(this.w) : Math.floor(this.w), this },
                negate: function() { return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this },
                dot: function(e) { return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w },
                lengthSq: function() { return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w },
                length: function() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w) },
                lengthManhattan: function() { return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w) },
                normalize: function() { return this.divideScalar(this.length()) },
                setLength: function(e) { var t = this.length(); return 0 !== t && e !== t && this.multiplyScalar(e / t), this },
                lerp: function(e, t) { return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this },
                lerpVectors: function(e, t, i) { return this.subVectors(t, e).multiplyScalar(i).add(e), this },
                equals: function(e) { return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w },
                fromArray: function(e, t) { return void 0 === t && (t = 0), this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this },
                toArray: function(e, t) { return void 0 === e && (e = []), void 0 === t && (t = 0), e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e },
                fromAttribute: function(e, t, i) { return void 0 === i && (i = 0), t = t * e.itemSize + i, this.x = e.array[t], this.y = e.array[t + 1], this.z = e.array[t + 2], this.w = e.array[t + 3], this },
                clone: function() { return new n.Vector4(this.x, this.y, this.z, this.w) }
            }, n.Euler = function(e, t, i, r) { this._x = e || 0, this._y = t || 0, this._z = i || 0, this._order = r || n.Euler.DefaultOrder }, n.Euler.RotationOrders = ["XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX"], n.Euler.DefaultOrder = "XYZ", n.Euler.prototype = { constructor: n.Euler, _x: 0, _y: 0, _z: 0, _order: n.Euler.DefaultOrder, get x() { return this._x }, set x(e) { this._x = e, this.onChangeCallback() }, get y() { return this._y }, set y(e) { this._y = e, this.onChangeCallback() }, get z() { return this._z }, set z(e) { this._z = e, this.onChangeCallback() }, get order() { return this._order }, set order(e) { this._order = e, this.onChangeCallback() }, set: function(e, t, i, r) { return this._x = e, this._y = t, this._z = i, this._order = r || this._order, this.onChangeCallback(), this }, copy: function(e) { return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this.onChangeCallback(), this }, setFromRotationMatrix: function(e, t, i) { var r = n.Math.clamp,
                        o = e.elements,
                        a = o[0],
                        s = o[4],
                        h = o[8],
                        l = o[1],
                        c = o[5],
                        u = o[9],
                        d = o[2],
                        p = o[6],
                        f = o[10]; return t = t || this._order, "XYZ" === t ? (this._y = Math.asin(r(h, -1, 1)), Math.abs(h) < .99999 ? (this._x = Math.atan2(-u, f), this._z = Math.atan2(-s, a)) : (this._x = Math.atan2(p, c), this._z = 0)) : "YXZ" === t ? (this._x = Math.asin(-r(u, -1, 1)), Math.abs(u) < .99999 ? (this._y = Math.atan2(h, f), this._z = Math.atan2(l, c)) : (this._y = Math.atan2(-d, a), this._z = 0)) : "ZXY" === t ? (this._x = Math.asin(r(p, -1, 1)), Math.abs(p) < .99999 ? (this._y = Math.atan2(-d, f), this._z = Math.atan2(-s, c)) : (this._y = 0, this._z = Math.atan2(l, a))) : "ZYX" === t ? (this._y = Math.asin(-r(d, -1, 1)), Math.abs(d) < .99999 ? (this._x = Math.atan2(p, f), this._z = Math.atan2(l, a)) : (this._x = 0, this._z = Math.atan2(-s, c))) : "YZX" === t ? (this._z = Math.asin(r(l, -1, 1)), Math.abs(l) < .99999 ? (this._x = Math.atan2(-u, c), this._y = Math.atan2(-d, a)) : (this._x = 0, this._y = Math.atan2(h, f))) : "XZY" === t ? (this._z = Math.asin(-r(s, -1, 1)), Math.abs(s) < .99999 ? (this._x = Math.atan2(p, c), this._y = Math.atan2(h, a)) : (this._x = Math.atan2(-u, f), this._y = 0)) : n.warn("THREE.Euler: .setFromRotationMatrix() given unsupported order: " + t), this._order = t, i !== !1 && this.onChangeCallback(), this }, setFromQuaternion: function() { var e; return function(t, i, r) { return void 0 === e && (e = new n.Matrix4), e.makeRotationFromQuaternion(t), this.setFromRotationMatrix(e, i, r), this } }(), setFromVector3: function(e, t) { return this.set(e.x, e.y, e.z, t || this._order) }, reorder: function() { var e = new n.Quaternion; return function(t) { e.setFromEuler(this), this.setFromQuaternion(e, t) } }(), equals: function(e) { return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order }, fromArray: function(e) { return this._x = e[0], this._y = e[1], this._z = e[2], void 0 !== e[3] && (this._order = e[3]), this.onChangeCallback(), this }, toArray: function(e, t) { return void 0 === e && (e = []), void 0 === t && (t = 0), e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._order, e }, toVector3: function(e) { return e ? e.set(this._x, this._y, this._z) : new n.Vector3(this._x, this._y, this._z) }, onChange: function(e) { return this.onChangeCallback = e, this }, onChangeCallback: function() {}, clone: function() { return new n.Euler(this._x, this._y, this._z, this._order) } }, n.Line3 = function(e, t) { this.start = void 0 !== e ? e : new n.Vector3, this.end = void 0 !== t ? t : new n.Vector3 }, n.Line3.prototype = { constructor: n.Line3, set: function(e, t) { return this.start.copy(e), this.end.copy(t), this }, copy: function(e) { return this.start.copy(e.start), this.end.copy(e.end), this }, center: function(e) { var t = e || new n.Vector3; return t.addVectors(this.start, this.end).multiplyScalar(.5) }, delta: function(e) { var t = e || new n.Vector3; return t.subVectors(this.end, this.start) }, distanceSq: function() { return this.start.distanceToSquared(this.end) }, distance: function() { return this.start.distanceTo(this.end) }, at: function(e, t) { var i = t || new n.Vector3; return this.delta(i).multiplyScalar(e).add(this.start) }, closestPointToPointParameter: function() { var e = new n.Vector3,
                        t = new n.Vector3; return function(i, r) { e.subVectors(i, this.start), t.subVectors(this.end, this.start); var o = t.dot(t),
                            a = t.dot(e),
                            s = a / o; return r && (s = n.Math.clamp(s, 0, 1)), s } }(), closestPointToPoint: function(e, t, i) { var r = this.closestPointToPointParameter(e, t),
                        o = i || new n.Vector3; return this.delta(o).multiplyScalar(r).add(this.start) }, applyMatrix4: function(e) { return this.start.applyMatrix4(e), this.end.applyMatrix4(e), this }, equals: function(e) { return e.start.equals(this.start) && e.end.equals(this.end) }, clone: function() { return (new n.Line3).copy(this) } }, n.Box2 = function(e, t) { this.min = void 0 !== e ? e : new n.Vector2(1 / 0, 1 / 0), this.max = void 0 !== t ? t : new n.Vector2(-(1 / 0), -(1 / 0)) }, n.Box2.prototype = { constructor: n.Box2, set: function(e, t) { return this.min.copy(e), this.max.copy(t), this }, setFromPoints: function(e) { this.makeEmpty(); for (var t = 0, i = e.length; i > t; t++) this.expandByPoint(e[t]); return this }, setFromCenterAndSize: function() { var e = new n.Vector2; return function(t, i) { var r = e.copy(i).multiplyScalar(.5); return this.min.copy(t).sub(r), this.max.copy(t).add(r), this } }(), copy: function(e) { return this.min.copy(e.min), this.max.copy(e.max), this }, makeEmpty: function() { return this.min.x = this.min.y = 1 / 0, this.max.x = this.max.y = -(1 / 0), this }, empty: function() { return this.max.x < this.min.x || this.max.y < this.min.y }, center: function(e) { var t = e || new n.Vector2; return t.addVectors(this.min, this.max).multiplyScalar(.5) }, size: function(e) { var t = e || new n.Vector2; return t.subVectors(this.max, this.min) }, expandByPoint: function(e) { return this.min.min(e), this.max.max(e), this }, expandByVector: function(e) { return this.min.sub(e), this.max.add(e), this }, expandByScalar: function(e) { return this.min.addScalar(-e), this.max.addScalar(e), this }, containsPoint: function(e) { return e.x < this.min.x || e.x > this.max.x || e.y < this.min.y || e.y > this.max.y ? !1 : !0 }, containsBox: function(e) { return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y ? !0 : !1 }, getParameter: function(e, t) { var i = t || new n.Vector2; return i.set((e.x - this.min.x) / (this.max.x - this.min.x), (e.y - this.min.y) / (this.max.y - this.min.y)) }, isIntersectionBox: function(e) { return e.max.x < this.min.x || e.min.x > this.max.x || e.max.y < this.min.y || e.min.y > this.max.y ? !1 : !0 }, clampPoint: function(e, t) { var i = t || new n.Vector2; return i.copy(e).clamp(this.min, this.max) }, distanceToPoint: function() { var e = new n.Vector2; return function(t) { var i = e.copy(t).clamp(this.min, this.max); return i.sub(t).length() } }(), intersect: function(e) { return this.min.max(e.min), this.max.min(e.max), this }, union: function(e) { return this.min.min(e.min), this.max.max(e.max), this }, translate: function(e) { return this.min.add(e), this.max.add(e), this }, equals: function(e) { return e.min.equals(this.min) && e.max.equals(this.max) }, clone: function() { return (new n.Box2).copy(this) } }, n.Box3 = function(e, t) { this.min = void 0 !== e ? e : new n.Vector3(1 / 0, 1 / 0, 1 / 0), this.max = void 0 !== t ? t : new n.Vector3(-(1 / 0), -(1 / 0), -(1 / 0)) }, n.Box3.prototype = { constructor: n.Box3, set: function(e, t) { return this.min.copy(e), this.max.copy(t), this }, setFromPoints: function(e) { this.makeEmpty(); for (var t = 0, i = e.length; i > t; t++) this.expandByPoint(e[t]); return this }, setFromCenterAndSize: function() { var e = new n.Vector3; return function(t, i) { var r = e.copy(i).multiplyScalar(.5); return this.min.copy(t).sub(r), this.max.copy(t).add(r), this } }(), setFromObject: function() { var e = new n.Vector3; return function(t) { var i = this; return t.updateMatrixWorld(!0), this.makeEmpty(), t.traverse(function(t) { var r = t.geometry; if (void 0 !== r)
                                if (r instanceof n.Geometry)
                                    for (var o = r.vertices, a = 0, s = o.length; s > a; a++) e.copy(o[a]), e.applyMatrix4(t.matrixWorld), i.expandByPoint(e);
                                else if (r instanceof n.BufferGeometry && void 0 !== r.attributes.position)
                                for (var h = r.attributes.position.array, a = 0, s = h.length; s > a; a += 3) e.set(h[a], h[a + 1], h[a + 2]), e.applyMatrix4(t.matrixWorld), i.expandByPoint(e) }), this } }(), copy: function(e) { return this.min.copy(e.min), this.max.copy(e.max), this }, makeEmpty: function() { return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -(1 / 0), this }, empty: function() { return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z }, center: function(e) { var t = e || new n.Vector3; return t.addVectors(this.min, this.max).multiplyScalar(.5) }, size: function(e) { var t = e || new n.Vector3; return t.subVectors(this.max, this.min) }, expandByPoint: function(e) { return this.min.min(e), this.max.max(e), this }, expandByVector: function(e) { return this.min.sub(e), this.max.add(e), this }, expandByScalar: function(e) { return this.min.addScalar(-e), this.max.addScalar(e), this }, containsPoint: function(e) { return e.x < this.min.x || e.x > this.max.x || e.y < this.min.y || e.y > this.max.y || e.z < this.min.z || e.z > this.max.z ? !1 : !0 }, containsBox: function(e) { return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z ? !0 : !1 }, getParameter: function(e, t) { var i = t || new n.Vector3; return i.set((e.x - this.min.x) / (this.max.x - this.min.x), (e.y - this.min.y) / (this.max.y - this.min.y), (e.z - this.min.z) / (this.max.z - this.min.z)) }, isIntersectionBox: function(e) { return e.max.x < this.min.x || e.min.x > this.max.x || e.max.y < this.min.y || e.min.y > this.max.y || e.max.z < this.min.z || e.min.z > this.max.z ? !1 : !0 }, clampPoint: function(e, t) { var i = t || new n.Vector3; return i.copy(e).clamp(this.min, this.max) }, distanceToPoint: function() { var e = new n.Vector3; return function(t) { var i = e.copy(t).clamp(this.min, this.max); return i.sub(t).length() } }(), getBoundingSphere: function() { var e = new n.Vector3; return function(t) { var i = t || new n.Sphere; return i.center = this.center(), i.radius = .5 * this.size(e).length(), i } }(), intersect: function(e) { return this.min.max(e.min), this.max.min(e.max), this }, union: function(e) { return this.min.min(e.min), this.max.max(e.max), this }, applyMatrix4: function() { var e = [new n.Vector3, new n.Vector3, new n.Vector3, new n.Vector3, new n.Vector3, new n.Vector3, new n.Vector3, new n.Vector3]; return function(t) { return e[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t), e[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t), e[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t), e[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t), e[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t), e[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t), e[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t), e[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t), this.makeEmpty(), this.setFromPoints(e), this } }(), translate: function(e) { return this.min.add(e), this.max.add(e), this }, equals: function(e) { return e.min.equals(this.min) && e.max.equals(this.max) }, clone: function() { return (new n.Box3).copy(this) } }, n.Matrix3 = function() { this.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]), arguments.length > 0 && n.error("THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.") }, n.Matrix3.prototype = { constructor: n.Matrix3, set: function(e, t, i, r, n, o, a, s, h) { var l = this.elements; return l[0] = e, l[3] = t, l[6] = i, l[1] = r, l[4] = n, l[7] = o, l[2] = a, l[5] = s, l[8] = h, this }, identity: function() { return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this }, copy: function(e) { var t = e.elements; return this.set(t[0], t[3], t[6], t[1], t[4], t[7], t[2], t[5], t[8]), this }, multiplyVector3: function(e) { return n.warn("THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead."), e.applyMatrix3(this) }, multiplyVector3Array: function(e) { return n.warn("THREE.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead."), this.applyToVector3Array(e) }, applyToVector3Array: function() { var e = new n.Vector3; return function(t, i, r) { void 0 === i && (i = 0), void 0 === r && (r = t.length); for (var n = 0, o = i; r > n; n += 3, o += 3) e.x = t[o], e.y = t[o + 1], e.z = t[o + 2], e.applyMatrix3(this), t[o] = e.x, t[o + 1] = e.y, t[o + 2] = e.z; return t } }(), multiplyScalar: function(e) { var t = this.elements; return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this }, determinant: function() { var e = this.elements,
                        t = e[0],
                        i = e[1],
                        r = e[2],
                        n = e[3],
                        o = e[4],
                        a = e[5],
                        s = e[6],
                        h = e[7],
                        l = e[8]; return t * o * l - t * a * h - i * n * l + i * a * s + r * n * h - r * o * s }, getInverse: function(e, t) { var i = e.elements,
                        r = this.elements;
                    r[0] = i[10] * i[5] - i[6] * i[9], r[1] = -i[10] * i[1] + i[2] * i[9], r[2] = i[6] * i[1] - i[2] * i[5], r[3] = -i[10] * i[4] + i[6] * i[8], r[4] = i[10] * i[0] - i[2] * i[8], r[5] = -i[6] * i[0] + i[2] * i[4], r[6] = i[9] * i[4] - i[5] * i[8], r[7] = -i[9] * i[0] + i[1] * i[8], r[8] = i[5] * i[0] - i[1] * i[4]; var o = i[0] * r[0] + i[1] * r[3] + i[2] * r[6]; if (0 === o) { var a = "Matrix3.getInverse(): can't invert matrix, determinant is 0"; if (t) throw new Error(a); return n.warn(a), this.identity(), this } return this.multiplyScalar(1 / o), this }, transpose: function() { var e, t = this.elements; return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this }, flattenToArrayOffset: function(e, t) { var i = this.elements; return e[t] = i[0], e[t + 1] = i[1], e[t + 2] = i[2], e[t + 3] = i[3], e[t + 4] = i[4], e[t + 5] = i[5], e[t + 6] = i[6], e[t + 7] = i[7], e[t + 8] = i[8], e }, getNormalMatrix: function(e) { return this.getInverse(e).transpose(), this }, transposeIntoArray: function(e) { var t = this.elements; return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this }, fromArray: function(e) { return this.elements.set(e), this }, toArray: function() { var e = this.elements; return [e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8]] }, clone: function() { return (new n.Matrix3).fromArray(this.elements) } }, n.Matrix4 = function() { this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), arguments.length > 0 && n.error("THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.") }, n.Matrix4.prototype = { constructor: n.Matrix4, set: function(e, t, i, r, n, o, a, s, h, l, c, u, d, p, f, m) { var g = this.elements; return g[0] = e, g[4] = t, g[8] = i, g[12] = r, g[1] = n, g[5] = o, g[9] = a, g[13] = s, g[2] = h, g[6] = l, g[10] = c, g[14] = u, g[3] = d, g[7] = p, g[11] = f, g[15] = m, this }, identity: function() { return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this }, copy: function(e) { return this.elements.set(e.elements), this }, extractPosition: function(e) { return n.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition()."), this.copyPosition(e) }, copyPosition: function(e) { var t = this.elements,
                        i = e.elements; return t[12] = i[12], t[13] = i[13], t[14] = i[14], this }, extractBasis: function(e, t, i) { var r = this.elements; return e.set(r[0], r[1], r[2]), t.set(r[4], r[5], r[6]), i.set(r[8], r[9], r[10]), this }, makeBasis: function(e, t, i) { return this.set(e.x, t.x, i.x, 0, e.y, t.y, i.y, 0, e.z, t.z, i.z, 0, 0, 0, 0, 1), this }, extractRotation: function() { var e = new n.Vector3; return function(t) { var i = this.elements,
                            r = t.elements,
                            n = 1 / e.set(r[0], r[1], r[2]).length(),
                            o = 1 / e.set(r[4], r[5], r[6]).length(),
                            a = 1 / e.set(r[8], r[9], r[10]).length(); return i[0] = r[0] * n, i[1] = r[1] * n, i[2] = r[2] * n, i[4] = r[4] * o, i[5] = r[5] * o, i[6] = r[6] * o, i[8] = r[8] * a, i[9] = r[9] * a, i[10] = r[10] * a, this } }(), makeRotationFromEuler: function(e) { e instanceof n.Euler == !1 && n.error("THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order."); var t = this.elements,
                        i = e.x,
                        r = e.y,
                        o = e.z,
                        a = Math.cos(i),
                        s = Math.sin(i),
                        h = Math.cos(r),
                        l = Math.sin(r),
                        c = Math.cos(o),
                        u = Math.sin(o); if ("XYZ" === e.order) { var d = a * c,
                            p = a * u,
                            f = s * c,
                            m = s * u;
                        t[0] = h * c, t[4] = -h * u, t[8] = l, t[1] = p + f * l, t[5] = d - m * l, t[9] = -s * h, t[2] = m - d * l, t[6] = f + p * l, t[10] = a * h } else if ("YXZ" === e.order) { var g = h * c,
                            v = h * u,
                            y = l * c,
                            _ = l * u;
                        t[0] = g + _ * s, t[4] = y * s - v, t[8] = a * l, t[1] = a * u, t[5] = a * c, t[9] = -s, t[2] = v * s - y, t[6] = _ + g * s, t[10] = a * h } else if ("ZXY" === e.order) { var g = h * c,
                            v = h * u,
                            y = l * c,
                            _ = l * u;
                        t[0] = g - _ * s, t[4] = -a * u, t[8] = y + v * s, t[1] = v + y * s, t[5] = a * c, t[9] = _ - g * s, t[2] = -a * l, t[6] = s, t[10] = a * h } else if ("ZYX" === e.order) { var d = a * c,
                            p = a * u,
                            f = s * c,
                            m = s * u;
                        t[0] = h * c, t[4] = f * l - p, t[8] = d * l + m, t[1] = h * u, t[5] = m * l + d, t[9] = p * l - f, t[2] = -l, t[6] = s * h, t[10] = a * h } else if ("YZX" === e.order) { var x = a * h,
                            b = a * l,
                            w = s * h,
                            T = s * l;
                        t[0] = h * c, t[4] = T - x * u, t[8] = w * u + b, t[1] = u, t[5] = a * c, t[9] = -s * c, t[2] = -l * c, t[6] = b * u + w, t[10] = x - T * u } else if ("XZY" === e.order) { var x = a * h,
                            b = a * l,
                            w = s * h,
                            T = s * l;
                        t[0] = h * c, t[4] = -u, t[8] = l * c, t[1] = x * u + T, t[5] = a * c, t[9] = b * u - w, t[2] = w * u - b, t[6] = s * c, t[10] = T * u + x } return t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this }, setRotationFromQuaternion: function(e) { return n.warn("THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion()."), this.makeRotationFromQuaternion(e) }, makeRotationFromQuaternion: function(e) { var t = this.elements,
                        i = e.x,
                        r = e.y,
                        n = e.z,
                        o = e.w,
                        a = i + i,
                        s = r + r,
                        h = n + n,
                        l = i * a,
                        c = i * s,
                        u = i * h,
                        d = r * s,
                        p = r * h,
                        f = n * h,
                        m = o * a,
                        g = o * s,
                        v = o * h; return t[0] = 1 - (d + f), t[4] = c - v, t[8] = u + g, t[1] = c + v, t[5] = 1 - (l + f), t[9] = p - m, t[2] = u - g, t[6] = p + m, t[10] = 1 - (l + d), t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this }, lookAt: function() { var e = new n.Vector3,
                        t = new n.Vector3,
                        i = new n.Vector3; return function(r, n, o) { var a = this.elements; return i.subVectors(r, n).normalize(), 0 === i.length() && (i.z = 1), e.crossVectors(o, i).normalize(), 0 === e.length() && (i.x += 1e-4, e.crossVectors(o, i).normalize()), t.crossVectors(i, e), a[0] = e.x, a[4] = t.x, a[8] = i.x, a[1] = e.y, a[5] = t.y, a[9] = i.y, a[2] = e.z, a[6] = t.z, a[10] = i.z, this } }(), multiply: function(e, t) { return void 0 !== t ? (n.warn("THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."), this.multiplyMatrices(e, t)) : this.multiplyMatrices(this, e) }, multiplyMatrices: function(e, t) { var i = e.elements,
                        r = t.elements,
                        n = this.elements,
                        o = i[0],
                        a = i[4],
                        s = i[8],
                        h = i[12],
                        l = i[1],
                        c = i[5],
                        u = i[9],
                        d = i[13],
                        p = i[2],
                        f = i[6],
                        m = i[10],
                        g = i[14],
                        v = i[3],
                        y = i[7],
                        _ = i[11],
                        x = i[15],
                        b = r[0],
                        w = r[4],
                        T = r[8],
                        M = r[12],
                        S = r[1],
                        C = r[5],
                        A = r[9],
                        E = r[13],
                        P = r[2],
                        L = r[6],
                        R = r[10],
                        F = r[14],
                        k = r[3],
                        O = r[7],
                        D = r[11],
                        B = r[15]; return n[0] = o * b + a * S + s * P + h * k, n[4] = o * w + a * C + s * L + h * O, n[8] = o * T + a * A + s * R + h * D, n[12] = o * M + a * E + s * F + h * B, n[1] = l * b + c * S + u * P + d * k, n[5] = l * w + c * C + u * L + d * O, n[9] = l * T + c * A + u * R + d * D, n[13] = l * M + c * E + u * F + d * B, n[2] = p * b + f * S + m * P + g * k, n[6] = p * w + f * C + m * L + g * O, n[10] = p * T + f * A + m * R + g * D, n[14] = p * M + f * E + m * F + g * B, n[3] = v * b + y * S + _ * P + x * k, n[7] = v * w + y * C + _ * L + x * O, n[11] = v * T + y * A + _ * R + x * D, n[15] = v * M + y * E + _ * F + x * B, this }, multiplyToArray: function(e, t, i) { var r = this.elements; return this.multiplyMatrices(e, t), i[0] = r[0], i[1] = r[1], i[2] = r[2], i[3] = r[3], i[4] = r[4], i[5] = r[5], i[6] = r[6], i[7] = r[7], i[8] = r[8], i[9] = r[9], i[10] = r[10], i[11] = r[11], i[12] = r[12], i[13] = r[13], i[14] = r[14], i[15] = r[15], this }, multiplyScalar: function(e) { var t = this.elements; return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this }, multiplyVector3: function(e) { return n.warn("THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead."), e.applyProjection(this) }, multiplyVector4: function(e) { return n.warn("THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead."), e.applyMatrix4(this) }, multiplyVector3Array: function(e) { return n.warn("THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead."), this.applyToVector3Array(e) }, applyToVector3Array: function() { var e = new n.Vector3; return function(t, i, r) { void 0 === i && (i = 0), void 0 === r && (r = t.length); for (var n = 0, o = i; r > n; n += 3, o += 3) e.x = t[o], e.y = t[o + 1], e.z = t[o + 2], e.applyMatrix4(this), t[o] = e.x, t[o + 1] = e.y, t[o + 2] = e.z; return t } }(), rotateAxis: function(e) { n.warn("THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead."), e.transformDirection(this) }, crossVector: function(e) { return n.warn("THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead."), e.applyMatrix4(this) }, determinant: function() { var e = this.elements,
                        t = e[0],
                        i = e[4],
                        r = e[8],
                        n = e[12],
                        o = e[1],
                        a = e[5],
                        s = e[9],
                        h = e[13],
                        l = e[2],
                        c = e[6],
                        u = e[10],
                        d = e[14],
                        p = e[3],
                        f = e[7],
                        m = e[11],
                        g = e[15]; return p * (+n * s * c - r * h * c - n * a * u + i * h * u + r * a * d - i * s * d) + f * (+t * s * d - t * h * u + n * o * u - r * o * d + r * h * l - n * s * l) + m * (+t * h * c - t * a * d - n * o * c + i * o * d + n * a * l - i * h * l) + g * (-r * a * l - t * s * c + t * a * u + r * o * c - i * o * u + i * s * l) }, transpose: function() { var e, t = this.elements; return e = t[1], t[1] = t[4], t[4] = e, e = t[2], t[2] = t[8], t[8] = e, e = t[6], t[6] = t[9], t[9] = e, e = t[3], t[3] = t[12], t[12] = e, e = t[7], t[7] = t[13], t[13] = e, e = t[11], t[11] = t[14], t[14] = e, this }, flattenToArrayOffset: function(e, t) { var i = this.elements; return e[t] = i[0], e[t + 1] = i[1], e[t + 2] = i[2], e[t + 3] = i[3], e[t + 4] = i[4], e[t + 5] = i[5], e[t + 6] = i[6], e[t + 7] = i[7], e[t + 8] = i[8], e[t + 9] = i[9], e[t + 10] = i[10], e[t + 11] = i[11], e[t + 12] = i[12], e[t + 13] = i[13], e[t + 14] = i[14], e[t + 15] = i[15], e }, getPosition: function() { var e = new n.Vector3; return function() { n.warn("THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead."); var t = this.elements; return e.set(t[12], t[13], t[14]) } }(), setPosition: function(e) { var t = this.elements; return t[12] = e.x, t[13] = e.y, t[14] = e.z, this }, getInverse: function(e, t) { var i = this.elements,
                        r = e.elements,
                        o = r[0],
                        a = r[4],
                        s = r[8],
                        h = r[12],
                        l = r[1],
                        c = r[5],
                        u = r[9],
                        d = r[13],
                        p = r[2],
                        f = r[6],
                        m = r[10],
                        g = r[14],
                        v = r[3],
                        y = r[7],
                        _ = r[11],
                        x = r[15];
                    i[0] = u * g * y - d * m * y + d * f * _ - c * g * _ - u * f * x + c * m * x, i[4] = h * m * y - s * g * y - h * f * _ + a * g * _ + s * f * x - a * m * x, i[8] = s * d * y - h * u * y + h * c * _ - a * d * _ - s * c * x + a * u * x, i[12] = h * u * f - s * d * f - h * c * m + a * d * m + s * c * g - a * u * g, i[1] = d * m * v - u * g * v - d * p * _ + l * g * _ + u * p * x - l * m * x, i[5] = s * g * v - h * m * v + h * p * _ - o * g * _ - s * p * x + o * m * x, i[9] = h * u * v - s * d * v - h * l * _ + o * d * _ + s * l * x - o * u * x, i[13] = s * d * p - h * u * p + h * l * m - o * d * m - s * l * g + o * u * g, i[2] = c * g * v - d * f * v + d * p * y - l * g * y - c * p * x + l * f * x, i[6] = h * f * v - a * g * v - h * p * y + o * g * y + a * p * x - o * f * x, i[10] = a * d * v - h * c * v + h * l * y - o * d * y - a * l * x + o * c * x, i[14] = h * c * p - a * d * p - h * l * f + o * d * f + a * l * g - o * c * g, i[3] = u * f * v - c * m * v - u * p * y + l * m * y + c * p * _ - l * f * _, i[7] = a * m * v - s * f * v + s * p * y - o * m * y - a * p * _ + o * f * _, i[11] = s * c * v - a * u * v - s * l * y + o * u * y + a * l * _ - o * c * _, i[15] = a * u * p - s * c * p + s * l * f - o * u * f - a * l * m + o * c * m; var b = o * i[0] + l * i[4] + p * i[8] + v * i[12]; if (0 == b) { var w = "THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0"; if (t) throw new Error(w); return n.warn(w), this.identity(), this } return this.multiplyScalar(1 / b), this }, translate: function(e) { n.error("THREE.Matrix4: .translate() has been removed.") }, rotateX: function(e) { n.error("THREE.Matrix4: .rotateX() has been removed.") }, rotateY: function(e) { n.error("THREE.Matrix4: .rotateY() has been removed.") }, rotateZ: function(e) { n.error("THREE.Matrix4: .rotateZ() has been removed.") }, rotateByAxis: function(e, t) { n.error("THREE.Matrix4: .rotateByAxis() has been removed.") }, scale: function(e) { var t = this.elements,
                        i = e.x,
                        r = e.y,
                        n = e.z; return t[0] *= i, t[4] *= r, t[8] *= n, t[1] *= i, t[5] *= r, t[9] *= n, t[2] *= i, t[6] *= r, t[10] *= n, t[3] *= i, t[7] *= r, t[11] *= n, this }, getMaxScaleOnAxis: function() { var e = this.elements,
                        t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2],
                        i = e[4] * e[4] + e[5] * e[5] + e[6] * e[6],
                        r = e[8] * e[8] + e[9] * e[9] + e[10] * e[10]; return Math.sqrt(Math.max(t, Math.max(i, r))) }, makeTranslation: function(e, t, i) { return this.set(1, 0, 0, e, 0, 1, 0, t, 0, 0, 1, i, 0, 0, 0, 1), this }, makeRotationX: function(e) { var t = Math.cos(e),
                        i = Math.sin(e); return this.set(1, 0, 0, 0, 0, t, -i, 0, 0, i, t, 0, 0, 0, 0, 1), this }, makeRotationY: function(e) { var t = Math.cos(e),
                        i = Math.sin(e); return this.set(t, 0, i, 0, 0, 1, 0, 0, -i, 0, t, 0, 0, 0, 0, 1), this }, makeRotationZ: function(e) { var t = Math.cos(e),
                        i = Math.sin(e); return this.set(t, -i, 0, 0, i, t, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this }, makeRotationAxis: function(e, t) { var i = Math.cos(t),
                        r = Math.sin(t),
                        n = 1 - i,
                        o = e.x,
                        a = e.y,
                        s = e.z,
                        h = n * o,
                        l = n * a; return this.set(h * o + i, h * a - r * s, h * s + r * a, 0, h * a + r * s, l * a + i, l * s - r * o, 0, h * s - r * a, l * s + r * o, n * s * s + i, 0, 0, 0, 0, 1), this }, makeScale: function(e, t, i) { return this.set(e, 0, 0, 0, 0, t, 0, 0, 0, 0, i, 0, 0, 0, 0, 1), this }, compose: function(e, t, i) { return this.makeRotationFromQuaternion(t), this.scale(i), this.setPosition(e), this }, decompose: function() { var e = new n.Vector3,
                        t = new n.Matrix4; return function(i, r, n) { var o = this.elements,
                            a = e.set(o[0], o[1], o[2]).length(),
                            s = e.set(o[4], o[5], o[6]).length(),
                            h = e.set(o[8], o[9], o[10]).length(),
                            l = this.determinant();
                        0 > l && (a = -a), i.x = o[12], i.y = o[13], i.z = o[14], t.elements.set(this.elements); var c = 1 / a,
                            u = 1 / s,
                            d = 1 / h; return t.elements[0] *= c, t.elements[1] *= c, t.elements[2] *= c, t.elements[4] *= u, t.elements[5] *= u, t.elements[6] *= u, t.elements[8] *= d, t.elements[9] *= d, t.elements[10] *= d, r.setFromRotationMatrix(t), n.x = a, n.y = s, n.z = h, this } }(), makeFrustum: function(e, t, i, r, n, o) { var a = this.elements,
                        s = 2 * n / (t - e),
                        h = 2 * n / (r - i),
                        l = (t + e) / (t - e),
                        c = (r + i) / (r - i),
                        u = -(o + n) / (o - n),
                        d = -2 * o * n / (o - n); return a[0] = s, a[4] = 0, a[8] = l, a[12] = 0, a[1] = 0, a[5] = h, a[9] = c, a[13] = 0, a[2] = 0, a[6] = 0, a[10] = u, a[14] = d, a[3] = 0, a[7] = 0, a[11] = -1, a[15] = 0, this }, makePerspective: function(e, t, i, r) { var o = i * Math.tan(n.Math.degToRad(.5 * e)),
                        a = -o,
                        s = a * t,
                        h = o * t; return this.makeFrustum(s, h, a, o, i, r) }, makeOrthographic: function(e, t, i, r, n, o) { var a = this.elements,
                        s = t - e,
                        h = i - r,
                        l = o - n,
                        c = (t + e) / s,
                        u = (i + r) / h,
                        d = (o + n) / l; return a[0] = 2 / s, a[4] = 0, a[8] = 0, a[12] = -c, a[1] = 0, a[5] = 2 / h, a[9] = 0, a[13] = -u, a[2] = 0, a[6] = 0, a[10] = -2 / l, a[14] = -d, a[3] = 0, a[7] = 0, a[11] = 0, a[15] = 1, this }, fromArray: function(e) { return this.elements.set(e), this }, toArray: function() { var e = this.elements; return [e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]] }, clone: function() { return (new n.Matrix4).fromArray(this.elements) } }, n.Ray = function(e, t) { this.origin = void 0 !== e ? e : new n.Vector3, this.direction = void 0 !== t ? t : new n.Vector3 }, n.Ray.prototype = { constructor: n.Ray, set: function(e, t) { return this.origin.copy(e), this.direction.copy(t), this }, copy: function(e) { return this.origin.copy(e.origin), this.direction.copy(e.direction), this }, at: function(e, t) { var i = t || new n.Vector3; return i.copy(this.direction).multiplyScalar(e).add(this.origin) }, recast: function() { var e = new n.Vector3; return function(t) { return this.origin.copy(this.at(t, e)), this } }(), closestPointToPoint: function(e, t) { var i = t || new n.Vector3;
                    i.subVectors(e, this.origin); var r = i.dot(this.direction); return 0 > r ? i.copy(this.origin) : i.copy(this.direction).multiplyScalar(r).add(this.origin) }, distanceToPoint: function() { var e = new n.Vector3; return function(t) { var i = e.subVectors(t, this.origin).dot(this.direction); return 0 > i ? this.origin.distanceTo(t) : (e.copy(this.direction).multiplyScalar(i).add(this.origin), e.distanceTo(t)) } }(), distanceSqToSegment: function() { var e = new n.Vector3,
                        t = new n.Vector3,
                        i = new n.Vector3; return function(r, n, o, a) { e.copy(r).add(n).multiplyScalar(.5), t.copy(n).sub(r).normalize(), i.copy(this.origin).sub(e); var s, h, l, c, u = .5 * r.distanceTo(n),
                            d = -this.direction.dot(t),
                            p = i.dot(this.direction),
                            f = -i.dot(t),
                            m = i.lengthSq(),
                            g = Math.abs(1 - d * d); if (g > 0)
                            if (s = d * f - p, h = d * p - f, c = u * g, s >= 0)
                                if (h >= -c)
                                    if (c >= h) { var v = 1 / g;
                                        s *= v, h *= v, l = s * (s + d * h + 2 * p) + h * (d * s + h + 2 * f) + m } else h = u, s = Math.max(0, -(d * h + p)), l = -s * s + h * (h + 2 * f) + m;
                        else h = -u, s = Math.max(0, -(d * h + p)), l = -s * s + h * (h + 2 * f) + m;
                        else -c >= h ? (s = Math.max(0, -(-d * u + p)), h = s > 0 ? -u : Math.min(Math.max(-u, -f), u), l = -s * s + h * (h + 2 * f) + m) : c >= h ? (s = 0, h = Math.min(Math.max(-u, -f), u), l = h * (h + 2 * f) + m) : (s = Math.max(0, -(d * u + p)), h = s > 0 ? u : Math.min(Math.max(-u, -f), u), l = -s * s + h * (h + 2 * f) + m);
                        else h = d > 0 ? -u : u, s = Math.max(0, -(d * h + p)), l = -s * s + h * (h + 2 * f) + m; return o && o.copy(this.direction).multiplyScalar(s).add(this.origin), a && a.copy(t).multiplyScalar(h).add(e), l } }(), isIntersectionSphere: function(e) { return this.distanceToPoint(e.center) <= e.radius }, intersectSphere: function() { var e = new n.Vector3; return function(t, i) { e.subVectors(t.center, this.origin); var r = e.dot(this.direction),
                            n = e.dot(e) - r * r,
                            o = t.radius * t.radius; if (n > o) return null; var a = Math.sqrt(o - n),
                            s = r - a,
                            h = r + a; return 0 > s && 0 > h ? null : 0 > s ? this.at(h, i) : this.at(s, i) } }(), isIntersectionPlane: function(e) { var t = e.distanceToPoint(this.origin); if (0 === t) return !0; var i = e.normal.dot(this.direction); return 0 > i * t ? !0 : !1 }, distanceToPlane: function(e) { var t = e.normal.dot(this.direction); if (0 == t) return 0 == e.distanceToPoint(this.origin) ? 0 : null; var i = -(this.origin.dot(e.normal) + e.constant) / t; return i >= 0 ? i : null }, intersectPlane: function(e, t) { var i = this.distanceToPlane(e); return null === i ? null : this.at(i, t) }, isIntersectionBox: function() { var e = new n.Vector3; return function(t) { return null !== this.intersectBox(t, e) } }(), intersectBox: function(e, t) { var i, r, n, o, a, s, h = 1 / this.direction.x,
                        l = 1 / this.direction.y,
                        c = 1 / this.direction.z,
                        u = this.origin; return h >= 0 ? (i = (e.min.x - u.x) * h, r = (e.max.x - u.x) * h) : (i = (e.max.x - u.x) * h, r = (e.min.x - u.x) * h), l >= 0 ? (n = (e.min.y - u.y) * l, o = (e.max.y - u.y) * l) : (n = (e.max.y - u.y) * l, o = (e.min.y - u.y) * l), i > o || n > r ? null : ((n > i || i !== i) && (i = n), (r > o || r !== r) && (r = o), c >= 0 ? (a = (e.min.z - u.z) * c, s = (e.max.z - u.z) * c) : (a = (e.max.z - u.z) * c, s = (e.min.z - u.z) * c), i > s || a > r ? null : ((a > i || i !== i) && (i = a), (r > s || r !== r) && (r = s), 0 > r ? null : this.at(i >= 0 ? i : r, t))) }, intersectTriangle: function() { var e = new n.Vector3,
                        t = new n.Vector3,
                        i = new n.Vector3,
                        r = new n.Vector3; return function(n, o, a, s, h) { t.subVectors(o, n), i.subVectors(a, n), r.crossVectors(t, i); var l, c = this.direction.dot(r); if (c > 0) { if (s) return null;
                            l = 1 } else { if (!(0 > c)) return null;
                            l = -1, c = -c } e.subVectors(this.origin, n); var u = l * this.direction.dot(i.crossVectors(e, i)); if (0 > u) return null; var d = l * this.direction.dot(t.cross(e)); if (0 > d) return null; if (u + d > c) return null; var p = -l * e.dot(r); return 0 > p ? null : this.at(p / c, h) } }(), applyMatrix4: function(e) { return this.direction.add(this.origin).applyMatrix4(e), this.origin.applyMatrix4(e), this.direction.sub(this.origin), this.direction.normalize(), this }, equals: function(e) { return e.origin.equals(this.origin) && e.direction.equals(this.direction) }, clone: function() { return (new n.Ray).copy(this) } }, n.Sphere = function(e, t) { this.center = void 0 !== e ? e : new n.Vector3, this.radius = void 0 !== t ? t : 0 }, n.Sphere.prototype = {
                constructor: n.Sphere,
                set: function(e, t) {
                    return this.center.copy(e), this.radius = t, this
                },
                setFromPoints: function() { var e = new n.Box3; return function(t, i) { var r = this.center;
                        void 0 !== i ? r.copy(i) : e.setFromPoints(t).center(r); for (var n = 0, o = 0, a = t.length; a > o; o++) n = Math.max(n, r.distanceToSquared(t[o])); return this.radius = Math.sqrt(n), this } }(),
                copy: function(e) { return this.center.copy(e.center), this.radius = e.radius, this },
                empty: function() { return this.radius <= 0 },
                containsPoint: function(e) { return e.distanceToSquared(this.center) <= this.radius * this.radius },
                distanceToPoint: function(e) { return e.distanceTo(this.center) - this.radius },
                intersectsSphere: function(e) { var t = this.radius + e.radius; return e.center.distanceToSquared(this.center) <= t * t },
                clampPoint: function(e, t) { var i = this.center.distanceToSquared(e),
                        r = t || new n.Vector3; return r.copy(e), i > this.radius * this.radius && (r.sub(this.center).normalize(), r.multiplyScalar(this.radius).add(this.center)), r },
                getBoundingBox: function(e) { var t = e || new n.Box3; return t.set(this.center, this.center), t.expandByScalar(this.radius), t },
                applyMatrix4: function(e) { return this.center.applyMatrix4(e), this.radius = this.radius * e.getMaxScaleOnAxis(), this },
                translate: function(e) { return this.center.add(e), this },
                equals: function(e) { return e.center.equals(this.center) && e.radius === this.radius },
                clone: function() { return (new n.Sphere).copy(this) }
            }, n.Frustum = function(e, t, i, r, o, a) { this.planes = [void 0 !== e ? e : new n.Plane, void 0 !== t ? t : new n.Plane, void 0 !== i ? i : new n.Plane, void 0 !== r ? r : new n.Plane, void 0 !== o ? o : new n.Plane, void 0 !== a ? a : new n.Plane] }, n.Frustum.prototype = { constructor: n.Frustum, set: function(e, t, i, r, n, o) { var a = this.planes; return a[0].copy(e), a[1].copy(t), a[2].copy(i), a[3].copy(r), a[4].copy(n), a[5].copy(o), this }, copy: function(e) { for (var t = this.planes, i = 0; 6 > i; i++) t[i].copy(e.planes[i]); return this }, setFromMatrix: function(e) { var t = this.planes,
                        i = e.elements,
                        r = i[0],
                        n = i[1],
                        o = i[2],
                        a = i[3],
                        s = i[4],
                        h = i[5],
                        l = i[6],
                        c = i[7],
                        u = i[8],
                        d = i[9],
                        p = i[10],
                        f = i[11],
                        m = i[12],
                        g = i[13],
                        v = i[14],
                        y = i[15]; return t[0].setComponents(a - r, c - s, f - u, y - m).normalize(), t[1].setComponents(a + r, c + s, f + u, y + m).normalize(), t[2].setComponents(a + n, c + h, f + d, y + g).normalize(), t[3].setComponents(a - n, c - h, f - d, y - g).normalize(), t[4].setComponents(a - o, c - l, f - p, y - v).normalize(), t[5].setComponents(a + o, c + l, f + p, y + v).normalize(), this }, intersectsObject: function() { var e = new n.Sphere; return function(t) { var i = t.geometry; return null === i.boundingSphere && i.computeBoundingSphere(), e.copy(i.boundingSphere), e.applyMatrix4(t.matrixWorld), this.intersectsSphere(e) } }(), intersectsSphere: function(e) { for (var t = this.planes, i = e.center, r = -e.radius, n = 0; 6 > n; n++) { var o = t[n].distanceToPoint(i); if (r > o) return !1 } return !0 }, intersectsBox: function() { var e = new n.Vector3,
                        t = new n.Vector3; return function(i) { for (var r = this.planes, n = 0; 6 > n; n++) { var o = r[n];
                            e.x = o.normal.x > 0 ? i.min.x : i.max.x, t.x = o.normal.x > 0 ? i.max.x : i.min.x, e.y = o.normal.y > 0 ? i.min.y : i.max.y, t.y = o.normal.y > 0 ? i.max.y : i.min.y, e.z = o.normal.z > 0 ? i.min.z : i.max.z, t.z = o.normal.z > 0 ? i.max.z : i.min.z; var a = o.distanceToPoint(e),
                                s = o.distanceToPoint(t); if (0 > a && 0 > s) return !1 } return !0 } }(), containsPoint: function(e) { for (var t = this.planes, i = 0; 6 > i; i++)
                        if (t[i].distanceToPoint(e) < 0) return !1; return !0 }, clone: function() { return (new n.Frustum).copy(this) } }, n.Plane = function(e, t) { this.normal = void 0 !== e ? e : new n.Vector3(1, 0, 0), this.constant = void 0 !== t ? t : 0 }, n.Plane.prototype = { constructor: n.Plane, set: function(e, t) { return this.normal.copy(e), this.constant = t, this }, setComponents: function(e, t, i, r) { return this.normal.set(e, t, i), this.constant = r, this }, setFromNormalAndCoplanarPoint: function(e, t) { return this.normal.copy(e), this.constant = -t.dot(this.normal), this }, setFromCoplanarPoints: function() { var e = new n.Vector3,
                        t = new n.Vector3; return function(i, r, n) { var o = e.subVectors(n, r).cross(t.subVectors(i, r)).normalize(); return this.setFromNormalAndCoplanarPoint(o, i), this } }(), copy: function(e) { return this.normal.copy(e.normal), this.constant = e.constant, this }, normalize: function() { var e = 1 / this.normal.length(); return this.normal.multiplyScalar(e), this.constant *= e, this }, negate: function() { return this.constant *= -1, this.normal.negate(), this }, distanceToPoint: function(e) { return this.normal.dot(e) + this.constant }, distanceToSphere: function(e) { return this.distanceToPoint(e.center) - e.radius }, projectPoint: function(e, t) { return this.orthoPoint(e, t).sub(e).negate() }, orthoPoint: function(e, t) { var i = this.distanceToPoint(e),
                        r = t || new n.Vector3; return r.copy(this.normal).multiplyScalar(i) }, isIntersectionLine: function(e) { var t = this.distanceToPoint(e.start),
                        i = this.distanceToPoint(e.end); return 0 > t && i > 0 || 0 > i && t > 0 }, intersectLine: function() { var e = new n.Vector3; return function(t, i) { var r = i || new n.Vector3,
                            o = t.delta(e),
                            a = this.normal.dot(o); if (0 == a) return 0 == this.distanceToPoint(t.start) ? r.copy(t.start) : void 0; var s = -(t.start.dot(this.normal) + this.constant) / a; return 0 > s || s > 1 ? void 0 : r.copy(o).multiplyScalar(s).add(t.start) } }(), coplanarPoint: function(e) { var t = e || new n.Vector3; return t.copy(this.normal).multiplyScalar(-this.constant) }, applyMatrix4: function() { var e = new n.Vector3,
                        t = new n.Vector3,
                        i = new n.Matrix3; return function(r, n) { var o = n || i.getNormalMatrix(r),
                            a = e.copy(this.normal).applyMatrix3(o),
                            s = this.coplanarPoint(t); return s.applyMatrix4(r), this.setFromNormalAndCoplanarPoint(a, s), this } }(), translate: function(e) { return this.constant = this.constant - e.dot(this.normal), this }, equals: function(e) { return e.normal.equals(this.normal) && e.constant == this.constant }, clone: function() { return (new n.Plane).copy(this) } }, n.Math = { generateUUID: function() { var e, t = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
                        i = new Array(36),
                        r = 0; return function() { for (var n = 0; 36 > n; n++) 8 == n || 13 == n || 18 == n || 23 == n ? i[n] = "-" : 14 == n ? i[n] = "4" : (2 >= r && (r = 33554432 + 16777216 * Math.random() | 0), e = 15 & r, r >>= 4, i[n] = t[19 == n ? 3 & e | 8 : e]); return i.join("") } }(), clamp: function(e, t, i) { return t > e ? t : e > i ? i : e }, clampBottom: function(e, t) { return t > e ? t : e }, mapLinear: function(e, t, i, r, n) { return r + (e - t) * (n - r) / (i - t) }, smoothstep: function(e, t, i) { return t >= e ? 0 : e >= i ? 1 : (e = (e - t) / (i - t), e * e * (3 - 2 * e)) }, smootherstep: function(e, t, i) { return t >= e ? 0 : e >= i ? 1 : (e = (e - t) / (i - t), e * e * e * (e * (6 * e - 15) + 10)) }, random16: function() { return (65280 * Math.random() + 255 * Math.random()) / 65535 }, randInt: function(e, t) { return Math.floor(this.randFloat(e, t)) }, randFloat: function(e, t) { return e + Math.random() * (t - e) }, randFloatSpread: function(e) { return e * (.5 - Math.random()) }, degToRad: function() { var e = Math.PI / 180; return function(t) { return t * e } }(), radToDeg: function() { var e = 180 / Math.PI; return function(t) { return t * e } }(), isPowerOfTwo: function(e) { return 0 === (e & e - 1) && 0 !== e }, nextPowerOfTwo: function(e) { return e--, e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, e++, e } }, n.Spline = function(e) {
                function t(e, t, i, r, n, o, a) { var s = .5 * (i - e),
                        h = .5 * (r - t); return (2 * (t - i) + s + h) * a + (-3 * (t - i) - 2 * s - h) * o + s * n + t } this.points = e; var i, r, o, a, s, h, l, c, u, d = [],
                    p = { x: 0, y: 0, z: 0 };
                this.initFromArray = function(e) { this.points = []; for (var t = 0; t < e.length; t++) this.points[t] = { x: e[t][0], y: e[t][1], z: e[t][2] } }, this.getPoint = function(e) { return i = (this.points.length - 1) * e, r = Math.floor(i), o = i - r, d[0] = 0 === r ? r : r - 1, d[1] = r, d[2] = r > this.points.length - 2 ? this.points.length - 1 : r + 1, d[3] = r > this.points.length - 3 ? this.points.length - 1 : r + 2, h = this.points[d[0]], l = this.points[d[1]], c = this.points[d[2]], u = this.points[d[3]], a = o * o, s = o * a, p.x = t(h.x, l.x, c.x, u.x, o, a, s), p.y = t(h.y, l.y, c.y, u.y, o, a, s), p.z = t(h.z, l.z, c.z, u.z, o, a, s), p }, this.getControlPointsArray = function() { var e, t, i = this.points.length,
                        r = []; for (e = 0; i > e; e++) t = this.points[e], r[e] = [t.x, t.y, t.z]; return r }, this.getLength = function(e) { var t, i, r, o, a = 0,
                        s = 0,
                        h = 0,
                        l = new n.Vector3,
                        c = new n.Vector3,
                        u = [],
                        d = 0; for (u[0] = 0, e || (e = 100), r = this.points.length * e, l.copy(this.points[0]), t = 1; r > t; t++) i = t / r, o = this.getPoint(i), c.copy(o), d += c.distanceTo(l), l.copy(o), a = (this.points.length - 1) * i, s = Math.floor(a), s != h && (u[s] = d, h = s); return u[u.length] = d, { chunks: u, total: d } }, this.reparametrizeByArcLength = function(e) { var t, i, r, o, a, s, h, l, c = [],
                        u = new n.Vector3,
                        d = this.getLength(); for (c.push(u.copy(this.points[0]).clone()), t = 1; t < this.points.length; t++) { for (s = d.chunks[t] - d.chunks[t - 1], h = Math.ceil(e * s / d.total), o = (t - 1) / (this.points.length - 1), a = t / (this.points.length - 1), i = 1; h - 1 > i; i++) r = o + i * (1 / h) * (a - o), l = this.getPoint(r), c.push(u.copy(l).clone());
                        c.push(u.copy(this.points[t]).clone()) } this.points = c } }, n.Triangle = function(e, t, i) { this.a = void 0 !== e ? e : new n.Vector3, this.b = void 0 !== t ? t : new n.Vector3, this.c = void 0 !== i ? i : new n.Vector3 }, n.Triangle.normal = function() { var e = new n.Vector3; return function(t, i, r, o) { var a = o || new n.Vector3;
                    a.subVectors(r, i), e.subVectors(t, i), a.cross(e); var s = a.lengthSq(); return s > 0 ? a.multiplyScalar(1 / Math.sqrt(s)) : a.set(0, 0, 0) } }(), n.Triangle.barycoordFromPoint = function() { var e = new n.Vector3,
                    t = new n.Vector3,
                    i = new n.Vector3; return function(r, o, a, s, h) { e.subVectors(s, o), t.subVectors(a, o), i.subVectors(r, o); var l = e.dot(e),
                        c = e.dot(t),
                        u = e.dot(i),
                        d = t.dot(t),
                        p = t.dot(i),
                        f = l * d - c * c,
                        m = h || new n.Vector3; if (0 == f) return m.set(-2, -1, -1); var g = 1 / f,
                        v = (d * u - c * p) * g,
                        y = (l * p - c * u) * g; return m.set(1 - v - y, y, v) } }(), n.Triangle.containsPoint = function() { var e = new n.Vector3; return function(t, i, r, o) { var a = n.Triangle.barycoordFromPoint(t, i, r, o, e); return a.x >= 0 && a.y >= 0 && a.x + a.y <= 1 } }(), n.Triangle.prototype = { constructor: n.Triangle, set: function(e, t, i) { return this.a.copy(e), this.b.copy(t), this.c.copy(i), this }, setFromPointsAndIndices: function(e, t, i, r) { return this.a.copy(e[t]), this.b.copy(e[i]), this.c.copy(e[r]), this }, copy: function(e) { return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this }, area: function() { var e = new n.Vector3,
                        t = new n.Vector3; return function() { return e.subVectors(this.c, this.b), t.subVectors(this.a, this.b), .5 * e.cross(t).length() } }(), midpoint: function(e) { var t = e || new n.Vector3; return t.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3) }, normal: function(e) { return n.Triangle.normal(this.a, this.b, this.c, e) }, plane: function(e) { var t = e || new n.Plane; return t.setFromCoplanarPoints(this.a, this.b, this.c) }, barycoordFromPoint: function(e, t) { return n.Triangle.barycoordFromPoint(e, this.a, this.b, this.c, t) }, containsPoint: function(e) { return n.Triangle.containsPoint(e, this.a, this.b, this.c) }, equals: function(e) { return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c) }, clone: function() { return (new n.Triangle).copy(this) } }, n.Clock = function(e) { this.autoStart = void 0 !== e ? e : !0, this.startTime = 0, this.oldTime = 0, this.elapsedTime = 0, this.running = !1 }, n.Clock.prototype = { constructor: n.Clock, start: function() { this.startTime = void 0 !== r.performance && void 0 !== r.performance.now ? r.performance.now() : Date.now(), this.oldTime = this.startTime, this.running = !0 }, stop: function() { this.getElapsedTime(), this.running = !1 }, getElapsedTime: function() { return this.getDelta(), this.elapsedTime }, getDelta: function() { var e = 0; if (this.autoStart && !this.running && this.start(), this.running) { var t = void 0 !== r.performance && void 0 !== r.performance.now ? r.performance.now() : Date.now();
                        e = .001 * (t - this.oldTime), this.oldTime = t, this.elapsedTime += e } return e } }, n.EventDispatcher = function() {}, n.EventDispatcher.prototype = { constructor: n.EventDispatcher, apply: function(e) { e.addEventListener = n.EventDispatcher.prototype.addEventListener, e.hasEventListener = n.EventDispatcher.prototype.hasEventListener, e.removeEventListener = n.EventDispatcher.prototype.removeEventListener, e.dispatchEvent = n.EventDispatcher.prototype.dispatchEvent }, addEventListener: function(e, t) { void 0 === this._listeners && (this._listeners = {}); var i = this._listeners;
                    void 0 === i[e] && (i[e] = []), -1 === i[e].indexOf(t) && i[e].push(t) }, hasEventListener: function(e, t) { if (void 0 === this._listeners) return !1; var i = this._listeners; return void 0 !== i[e] && -1 !== i[e].indexOf(t) ? !0 : !1 }, removeEventListener: function(e, t) { if (void 0 !== this._listeners) { var i = this._listeners,
                            r = i[e]; if (void 0 !== r) { var n = r.indexOf(t); - 1 !== n && r.splice(n, 1) } } }, dispatchEvent: function(e) { if (void 0 !== this._listeners) { var t = this._listeners,
                            i = t[e.type]; if (void 0 !== i) { e.target = this; for (var r = [], n = i.length, o = 0; n > o; o++) r[o] = i[o]; for (var o = 0; n > o; o++) r[o].call(this, e) } } } },
            function(e) { e.Raycaster = function(t, i, r, n) { this.ray = new e.Ray(t, i), this.near = r || 0, this.far = n || 1 / 0, this.params = { Sprite: {}, Mesh: {}, PointCloud: { threshold: 1 }, LOD: {}, Line: {} } }; var t = function(e, t) { return e.distance - t.distance },
                    i = function(e, t, r, n) { if (e.raycast(t, r), n === !0)
                            for (var o = e.children, a = 0, s = o.length; s > a; a++) i(o[a], t, r, !0) };
                e.Raycaster.prototype = { constructor: e.Raycaster, precision: 1e-4, linePrecision: 1, set: function(e, t) { this.ray.set(e, t) }, setFromCamera: function(t, i) { i instanceof e.PerspectiveCamera ? (this.ray.origin.copy(i.position), this.ray.direction.set(t.x, t.y, .5).unproject(i).sub(i.position).normalize()) : i instanceof e.OrthographicCamera ? (this.ray.origin.set(t.x, t.y, -1).unproject(i), this.ray.direction.set(0, 0, -1).transformDirection(i.matrixWorld)) : e.error("THREE.Raycaster: Unsupported camera type.") }, intersectObject: function(e, r) { var n = []; return i(e, this, n, r), n.sort(t), n }, intersectObjects: function(r, n) { var o = []; if (r instanceof Array == !1) return e.warn("THREE.Raycaster.intersectObjects: objects is not an Array."), o; for (var a = 0, s = r.length; s > a; a++) i(r[a], this, o, n); return o.sort(t), o } } }(n), n.Object3D = function() { Object.defineProperty(this, "id", { value: n.Object3DIdCount++ }), this.uuid = n.Math.generateUUID(), this.name = "", this.type = "Object3D", this.parent = void 0, this.children = [], this.up = n.Object3D.DefaultUp.clone(); var e = new n.Vector3,
                    t = new n.Euler,
                    i = new n.Quaternion,
                    r = new n.Vector3(1, 1, 1),
                    o = function() { i.setFromEuler(t, !1) },
                    a = function() { t.setFromQuaternion(i, void 0, !1) };
                t.onChange(o), i.onChange(a), Object.defineProperties(this, { position: { enumerable: !0, value: e }, rotation: { enumerable: !0, value: t }, quaternion: { enumerable: !0, value: i }, scale: { enumerable: !0, value: r } }), this.rotationAutoUpdate = !0, this.matrix = new n.Matrix4, this.matrixWorld = new n.Matrix4, this.matrixAutoUpdate = !0, this.matrixWorldNeedsUpdate = !1, this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.userData = {} }, n.Object3D.DefaultUp = new n.Vector3(0, 1, 0), n.Object3D.prototype = { constructor: n.Object3D, get eulerOrder() { return n.warn("THREE.Object3D: .eulerOrder has been moved to .rotation.order."), this.rotation.order }, set eulerOrder(e) { n.warn("THREE.Object3D: .eulerOrder has been moved to .rotation.order."), this.rotation.order = e }, get useQuaternion() { n.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.") }, set useQuaternion(e) { n.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.") }, applyMatrix: function(e) { this.matrix.multiplyMatrices(e, this.matrix), this.matrix.decompose(this.position, this.quaternion, this.scale) }, setRotationFromAxisAngle: function(e, t) { this.quaternion.setFromAxisAngle(e, t) }, setRotationFromEuler: function(e) { this.quaternion.setFromEuler(e, !0) }, setRotationFromMatrix: function(e) { this.quaternion.setFromRotationMatrix(e) }, setRotationFromQuaternion: function(e) { this.quaternion.copy(e) }, rotateOnAxis: function() { var e = new n.Quaternion; return function(t, i) { return e.setFromAxisAngle(t, i), this.quaternion.multiply(e), this } }(), rotateX: function() { var e = new n.Vector3(1, 0, 0); return function(t) { return this.rotateOnAxis(e, t) } }(), rotateY: function() { var e = new n.Vector3(0, 1, 0); return function(t) { return this.rotateOnAxis(e, t) } }(), rotateZ: function() { var e = new n.Vector3(0, 0, 1); return function(t) { return this.rotateOnAxis(e, t) } }(), translateOnAxis: function() { var e = new n.Vector3; return function(t, i) { return e.copy(t).applyQuaternion(this.quaternion), this.position.add(e.multiplyScalar(i)), this } }(), translate: function(e, t) { return n.warn("THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead."), this.translateOnAxis(t, e) }, translateX: function() { var e = new n.Vector3(1, 0, 0); return function(t) { return this.translateOnAxis(e, t) } }(), translateY: function() { var e = new n.Vector3(0, 1, 0); return function(t) { return this.translateOnAxis(e, t) } }(), translateZ: function() { var e = new n.Vector3(0, 0, 1); return function(t) { return this.translateOnAxis(e, t) } }(), localToWorld: function(e) { return e.applyMatrix4(this.matrixWorld) }, worldToLocal: function() { var e = new n.Matrix4; return function(t) { return t.applyMatrix4(e.getInverse(this.matrixWorld)) } }(), lookAt: function() { var e = new n.Matrix4; return function(t) { e.lookAt(t, this.position, this.up), this.quaternion.setFromRotationMatrix(e) } }(), add: function(e) { if (arguments.length > 1) { for (var t = 0; t < arguments.length; t++) this.add(arguments[t]); return this } return e === this ? (n.error("THREE.Object3D.add: object can't be added as a child of itself.", e), this) : (e instanceof n.Object3D ? (void 0 !== e.parent && e.parent.remove(e), e.parent = this, e.dispatchEvent({ type: "added" }), this.children.push(e)) : n.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", e), this) }, remove: function(e) { if (arguments.length > 1)
                        for (var t = 0; t < arguments.length; t++) this.remove(arguments[t]); var i = this.children.indexOf(e); - 1 !== i && (e.parent = void 0, e.dispatchEvent({ type: "removed" }), this.children.splice(i, 1)) }, getChildByName: function(e) { return n.warn("THREE.Object3D: .getChildByName() has been renamed to .getObjectByName()."), this.getObjectByName(e) }, getObjectById: function(e) { return this.getObjectByProperty("id", e) }, getObjectByName: function(e) { return this.getObjectByProperty("name", e) }, getObjectByProperty: function(e, t) { if (this[e] === t) return this; for (var i = 0, r = this.children.length; r > i; i++) { var n = this.children[i],
                            o = n.getObjectByProperty(e, t); if (void 0 !== o) return o } return void 0 }, getWorldPosition: function(e) { var t = e || new n.Vector3; return this.updateMatrixWorld(!0), t.setFromMatrixPosition(this.matrixWorld) }, getWorldQuaternion: function() { var e = new n.Vector3,
                        t = new n.Vector3; return function(i) { var r = i || new n.Quaternion; return this.updateMatrixWorld(!0), this.matrixWorld.decompose(e, r, t), r } }(), getWorldRotation: function() { var e = new n.Quaternion; return function(t) { var i = t || new n.Euler; return this.getWorldQuaternion(e), i.setFromQuaternion(e, this.rotation.order, !1) } }(), getWorldScale: function() { var e = new n.Vector3,
                        t = new n.Quaternion; return function(i) { var r = i || new n.Vector3; return this.updateMatrixWorld(!0), this.matrixWorld.decompose(e, t, r), r } }(), getWorldDirection: function() { var e = new n.Quaternion; return function(t) { var i = t || new n.Vector3; return this.getWorldQuaternion(e), i.set(0, 0, 1).applyQuaternion(e) } }(), raycast: function() {}, traverse: function(e) { e(this); for (var t = 0, i = this.children.length; i > t; t++) this.children[t].traverse(e) }, traverseVisible: function(e) { if (this.visible !== !1) { e(this); for (var t = 0, i = this.children.length; i > t; t++) this.children[t].traverseVisible(e) } }, traverseAncestors: function(e) { this.parent && (e(this.parent), this.parent.traverseAncestors(e)) }, updateMatrix: function() { this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0 }, updateMatrixWorld: function(e) { this.matrixAutoUpdate === !0 && this.updateMatrix(), (this.matrixWorldNeedsUpdate === !0 || e === !0) && (void 0 === this.parent ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), this.matrixWorldNeedsUpdate = !1, e = !0); for (var t = 0, i = this.children.length; i > t; t++) this.children[t].updateMatrixWorld(e) }, toJSON: function() { var e = { metadata: { version: 4.3, type: "Object", generator: "ObjectExporter" } },
                        t = {},
                        i = function(i) { if (void 0 === e.geometries && (e.geometries = []), void 0 === t[i.uuid]) { var r = i.toJSON();
                                delete r.metadata, t[i.uuid] = r, e.geometries.push(r) } return i.uuid },
                        r = {},
                        o = function(t) { if (void 0 === e.materials && (e.materials = []), void 0 === r[t.uuid]) { var i = t.toJSON();
                                delete i.metadata, r[t.uuid] = i, e.materials.push(i) } return t.uuid },
                        a = function(e) { var t = {}; if (t.uuid = e.uuid, t.type = e.type, "" !== e.name && (t.name = e.name), "{}" !== JSON.stringify(e.userData) && (t.userData = e.userData), e.visible !== !0 && (t.visible = e.visible), e instanceof n.PerspectiveCamera ? (t.fov = e.fov, t.aspect = e.aspect, t.near = e.near, t.far = e.far) : e instanceof n.OrthographicCamera ? (t.left = e.left, t.right = e.right, t.top = e.top, t.bottom = e.bottom, t.near = e.near, t.far = e.far) : e instanceof n.AmbientLight ? t.color = e.color.getHex() : e instanceof n.DirectionalLight ? (t.color = e.color.getHex(), t.intensity = e.intensity) : e instanceof n.PointLight ? (t.color = e.color.getHex(), t.intensity = e.intensity, t.distance = e.distance, t.decay = e.decay) : e instanceof n.SpotLight ? (t.color = e.color.getHex(), t.intensity = e.intensity, t.distance = e.distance, t.angle = e.angle, t.exponent = e.exponent, t.decay = e.decay) : e instanceof n.HemisphereLight ? (t.color = e.color.getHex(), t.groundColor = e.groundColor.getHex()) : e instanceof n.Mesh || e instanceof n.Line || e instanceof n.PointCloud ? (t.geometry = i(e.geometry), t.material = o(e.material), e instanceof n.Line && (t.mode = e.mode)) : e instanceof n.Sprite && (t.material = o(e.material)), t.matrix = e.matrix.toArray(), e.children.length > 0) { t.children = []; for (var r = 0; r < e.children.length; r++) t.children.push(a(e.children[r])) } return t }; return e.object = a(this), e }, clone: function(e, t) { if (void 0 === e && (e = new n.Object3D), void 0 === t && (t = !0), e.name = this.name, e.up.copy(this.up), e.position.copy(this.position), e.quaternion.copy(this.quaternion), e.scale.copy(this.scale), e.rotationAutoUpdate = this.rotationAutoUpdate, e.matrix.copy(this.matrix), e.matrixWorld.copy(this.matrixWorld), e.matrixAutoUpdate = this.matrixAutoUpdate, e.matrixWorldNeedsUpdate = this.matrixWorldNeedsUpdate, e.visible = this.visible, e.castShadow = this.castShadow, e.receiveShadow = this.receiveShadow, e.frustumCulled = this.frustumCulled, e.userData = JSON.parse(JSON.stringify(this.userData)), t === !0)
                        for (var i = 0; i < this.children.length; i++) { var r = this.children[i];
                            e.add(r.clone()) }
                    return e } }, n.EventDispatcher.prototype.apply(n.Object3D.prototype), n.Object3DIdCount = 0, n.Face3 = function(e, t, i, r, o, a) { this.a = e, this.b = t, this.c = i, this.normal = r instanceof n.Vector3 ? r : new n.Vector3, this.vertexNormals = r instanceof Array ? r : [], this.color = o instanceof n.Color ? o : new n.Color, this.vertexColors = o instanceof Array ? o : [], this.vertexTangents = [], this.materialIndex = void 0 !== a ? a : 0 }, n.Face3.prototype = { constructor: n.Face3, clone: function() { var e = new n.Face3(this.a, this.b, this.c);
                    e.normal.copy(this.normal), e.color.copy(this.color), e.materialIndex = this.materialIndex; for (var t = 0, i = this.vertexNormals.length; i > t; t++) e.vertexNormals[t] = this.vertexNormals[t].clone(); for (var t = 0, i = this.vertexColors.length; i > t; t++) e.vertexColors[t] = this.vertexColors[t].clone(); for (var t = 0, i = this.vertexTangents.length; i > t; t++) e.vertexTangents[t] = this.vertexTangents[t].clone(); return e } }, n.Face4 = function(e, t, i, r, o, a, s) { return n.warn("THREE.Face4 has been removed. A THREE.Face3 will be created instead."), new n.Face3(e, t, i, o, a, s) }, n.BufferAttribute = function(e, t) { this.array = e, this.itemSize = t, this.needsUpdate = !1 }, n.BufferAttribute.prototype = { constructor: n.BufferAttribute, get length() { return this.array.length }, copyAt: function(e, t, i) { e *= this.itemSize, i *= t.itemSize; for (var r = 0, n = this.itemSize; n > r; r++) this.array[e + r] = t.array[i + r]; return this }, set: function(e, t) { return void 0 === t && (t = 0), this.array.set(e, t), this }, setX: function(e, t) { return this.array[e * this.itemSize] = t, this }, setY: function(e, t) { return this.array[e * this.itemSize + 1] = t, this }, setZ: function(e, t) { return this.array[e * this.itemSize + 2] = t, this }, setXY: function(e, t, i) { return e *= this.itemSize, this.array[e] = t, this.array[e + 1] = i, this }, setXYZ: function(e, t, i, r) { return e *= this.itemSize, this.array[e] = t, this.array[e + 1] = i, this.array[e + 2] = r, this }, setXYZW: function(e, t, i, r, n) { return e *= this.itemSize, this.array[e] = t, this.array[e + 1] = i, this.array[e + 2] = r, this.array[e + 3] = n, this }, clone: function() { return new n.BufferAttribute(new this.array.constructor(this.array), this.itemSize) } }, n.Int8Attribute = function(e, t) { return n.warn("THREE.Int8Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), new n.BufferAttribute(e, t) }, n.Uint8Attribute = function(e, t) { return n.warn("THREE.Uint8Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), new n.BufferAttribute(e, t) }, n.Uint8ClampedAttribute = function(e, t) { return n.warn("THREE.Uint8ClampedAttribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), new n.BufferAttribute(e, t) }, n.Int16Attribute = function(e, t) { return n.warn("THREE.Int16Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), new n.BufferAttribute(e, t) }, n.Uint16Attribute = function(e, t) { return n.warn("THREE.Uint16Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), new n.BufferAttribute(e, t) }, n.Int32Attribute = function(e, t) { return n.warn("THREE.Int32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), new n.BufferAttribute(e, t) }, n.Uint32Attribute = function(e, t) { return n.warn("THREE.Uint32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), new n.BufferAttribute(e, t) }, n.Float32Attribute = function(e, t) { return n.warn("THREE.Float32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), new n.BufferAttribute(e, t) }, n.Float64Attribute = function(e, t) { return n.warn("THREE.Float64Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), new n.BufferAttribute(e, t) }, n.DynamicBufferAttribute = function(e, t) { n.BufferAttribute.call(this, e, t), this.updateRange = { offset: 0, count: -1 } }, n.DynamicBufferAttribute.prototype = Object.create(n.BufferAttribute.prototype), n.DynamicBufferAttribute.prototype.constructor = n.DynamicBufferAttribute, n.DynamicBufferAttribute.prototype.clone = function() { return new n.DynamicBufferAttribute(new this.array.constructor(this.array), this.itemSize) }, n.BufferGeometry = function() { Object.defineProperty(this, "id", { value: n.GeometryIdCount++ }), this.uuid = n.Math.generateUUID(), this.name = "", this.type = "BufferGeometry", this.attributes = {}, this.attributesKeys = [], this.drawcalls = [], this.offsets = this.drawcalls, this.boundingBox = null, this.boundingSphere = null }, n.BufferGeometry.prototype = {
                constructor: n.BufferGeometry,
                addAttribute: function(e, t) { return t instanceof n.BufferAttribute == !1 ? (n.warn("THREE.BufferGeometry: .addAttribute() now expects ( name, attribute )."), void(this.attributes[e] = { array: arguments[1], itemSize: arguments[2] })) : (this.attributes[e] = t, void(this.attributesKeys = Object.keys(this.attributes))) },
                getAttribute: function(e) { return this.attributes[e] },
                addDrawCall: function(e, t, i) { this.drawcalls.push({ start: e, count: t, index: void 0 !== i ? i : 0 }) },
                applyMatrix: function(e) { var t = this.attributes.position;
                    void 0 !== t && (e.applyToVector3Array(t.array), t.needsUpdate = !0); var i = this.attributes.normal; if (void 0 !== i) { var r = (new n.Matrix3).getNormalMatrix(e);
                        r.applyToVector3Array(i.array), i.needsUpdate = !0 } null !== this.boundingBox && this.computeBoundingBox(), null !== this.boundingSphere && this.computeBoundingSphere() },
                center: function() { this.computeBoundingBox(); var e = this.boundingBox.center().negate(); return this.applyMatrix((new n.Matrix4).setPosition(e)), e },
                fromGeometry: function(e, t) { t = t || { vertexColors: n.NoColors }; var i = e.vertices,
                        r = e.faces,
                        o = e.faceVertexUvs,
                        a = t.vertexColors,
                        s = o[0].length > 0,
                        h = 3 == r[0].vertexNormals.length,
                        l = new Float32Array(3 * r.length * 3);
                    this.addAttribute("position", new n.BufferAttribute(l, 3)); var c = new Float32Array(3 * r.length * 3); if (this.addAttribute("normal", new n.BufferAttribute(c, 3)), a !== n.NoColors) { var u = new Float32Array(3 * r.length * 3);
                        this.addAttribute("color", new n.BufferAttribute(u, 3)) } if (s === !0) { var d = new Float32Array(3 * r.length * 2);
                        this.addAttribute("uv", new n.BufferAttribute(d, 2)) } for (var p = 0, f = 0, m = 0; p < r.length; p++, f += 6, m += 9) { var g = r[p],
                            v = i[g.a],
                            y = i[g.b],
                            _ = i[g.c]; if (l[m] = v.x, l[m + 1] = v.y, l[m + 2] = v.z, l[m + 3] = y.x, l[m + 4] = y.y, l[m + 5] = y.z, l[m + 6] = _.x, l[m + 7] = _.y, l[m + 8] = _.z, h === !0) { var x = g.vertexNormals[0],
                                b = g.vertexNormals[1],
                                w = g.vertexNormals[2];
                            c[m] = x.x, c[m + 1] = x.y, c[m + 2] = x.z, c[m + 3] = b.x, c[m + 4] = b.y, c[m + 5] = b.z, c[m + 6] = w.x, c[m + 7] = w.y, c[m + 8] = w.z } else { var T = g.normal;
                            c[m] = T.x, c[m + 1] = T.y, c[m + 2] = T.z, c[m + 3] = T.x, c[m + 4] = T.y, c[m + 5] = T.z, c[m + 6] = T.x, c[m + 7] = T.y, c[m + 8] = T.z } if (a === n.FaceColors) { var M = g.color;
                            u[m] = M.r, u[m + 1] = M.g, u[m + 2] = M.b, u[m + 3] = M.r, u[m + 4] = M.g, u[m + 5] = M.b, u[m + 6] = M.r, u[m + 7] = M.g, u[m + 8] = M.b } else if (a === n.VertexColors) { var S = g.vertexColors[0],
                                C = g.vertexColors[1],
                                A = g.vertexColors[2];
                            u[m] = S.r, u[m + 1] = S.g, u[m + 2] = S.b, u[m + 3] = C.r, u[m + 4] = C.g, u[m + 5] = C.b, u[m + 6] = A.r, u[m + 7] = A.g, u[m + 8] = A.b } if (s === !0) { var E = o[0][p][0],
                                P = o[0][p][1],
                                L = o[0][p][2];
                            d[f] = E.x, d[f + 1] = E.y, d[f + 2] = P.x, d[f + 3] = P.y, d[f + 4] = L.x, d[f + 5] = L.y } } return this.computeBoundingSphere(), this },
                computeBoundingBox: function() { var e = new n.Vector3; return function() { null === this.boundingBox && (this.boundingBox = new n.Box3); var t = this.attributes.position.array; if (t) { var i = this.boundingBox;
                            i.makeEmpty(); for (var r = 0, o = t.length; o > r; r += 3) e.set(t[r], t[r + 1], t[r + 2]), i.expandByPoint(e) }(void 0 === t || 0 === t.length) && (this.boundingBox.min.set(0, 0, 0), this.boundingBox.max.set(0, 0, 0)), (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && n.error('THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.') } }(),
                computeBoundingSphere: function() { var e = new n.Box3,
                        t = new n.Vector3; return function() { null === this.boundingSphere && (this.boundingSphere = new n.Sphere); var i = this.attributes.position.array; if (i) { e.makeEmpty(); for (var r = this.boundingSphere.center, o = 0, a = i.length; a > o; o += 3) t.set(i[o], i[o + 1], i[o + 2]), e.expandByPoint(t);
                            e.center(r); for (var s = 0, o = 0, a = i.length; a > o; o += 3) t.set(i[o], i[o + 1], i[o + 2]), s = Math.max(s, r.distanceToSquared(t));
                            this.boundingSphere.radius = Math.sqrt(s), isNaN(this.boundingSphere.radius) && n.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.') } } }(),
                computeFaceNormals: function() {},
                computeVertexNormals: function() { var e = this.attributes; if (e.position) { var t = e.position.array; if (void 0 === e.normal) this.addAttribute("normal", new n.BufferAttribute(new Float32Array(t.length), 3));
                        else
                            for (var i = e.normal.array, r = 0, o = i.length; o > r; r++) i[r] = 0; var a, s, h, i = e.normal.array,
                            l = new n.Vector3,
                            c = new n.Vector3,
                            u = new n.Vector3,
                            d = new n.Vector3,
                            p = new n.Vector3; if (e.index)
                            for (var f = e.index.array, m = this.offsets.length > 0 ? this.offsets : [{ start: 0, count: f.length, index: 0 }], g = 0, v = m.length; v > g; ++g)
                                for (var y = m[g].start, _ = m[g].count, x = m[g].index, r = y, o = y + _; o > r; r += 3) a = 3 * (x + f[r]), s = 3 * (x + f[r + 1]), h = 3 * (x + f[r + 2]), l.fromArray(t, a), c.fromArray(t, s), u.fromArray(t, h), d.subVectors(u, c), p.subVectors(l, c), d.cross(p), i[a] += d.x, i[a + 1] += d.y, i[a + 2] += d.z, i[s] += d.x, i[s + 1] += d.y, i[s + 2] += d.z, i[h] += d.x, i[h + 1] += d.y, i[h + 2] += d.z;
                        else
                            for (var r = 0, o = t.length; o > r; r += 9) l.fromArray(t, r), c.fromArray(t, r + 3), u.fromArray(t, r + 6), d.subVectors(u, c), p.subVectors(l, c), d.cross(p), i[r] = d.x, i[r + 1] = d.y, i[r + 2] = d.z, i[r + 3] = d.x, i[r + 4] = d.y, i[r + 5] = d.z, i[r + 6] = d.x, i[r + 7] = d.y, i[r + 8] = d.z;
                        this.normalizeNormals(), e.normal.needsUpdate = !0 } },
                computeTangents: function() {
                    function e(e, t, i) { L.fromArray(r, 3 * e), R.fromArray(r, 3 * t), F.fromArray(r, 3 * i), k.fromArray(a, 2 * e), O.fromArray(a, 2 * t), D.fromArray(a, 2 * i), d = R.x - L.x, p = F.x - L.x, f = R.y - L.y, m = F.y - L.y, g = R.z - L.z, v = F.z - L.z, y = O.x - k.x, _ = D.x - k.x, x = O.y - k.y, b = D.y - k.y, w = 1 / (y * b - _ * x), B.set((b * d - x * p) * w, (b * f - x * m) * w, (b * g - x * v) * w), U.set((y * p - _ * d) * w, (y * m - _ * f) * w, (y * v - _ * g) * w), l[e].add(B), l[t].add(B), l[i].add(B), c[e].add(U), c[t].add(U), c[i].add(U) }

                    function t(e) { Y.fromArray(o, 3 * e), q.copy(Y), H = l[e], W.copy(H), W.sub(Y.multiplyScalar(Y.dot(H))).normalize(), X.crossVectors(q, H), j = X.dot(c[e]), G = 0 > j ? -1 : 1, h[4 * e] = W.x, h[4 * e + 1] = W.y, h[4 * e + 2] = W.z, h[4 * e + 3] = G }
                    if (void 0 === this.attributes.index || void 0 === this.attributes.position || void 0 === this.attributes.normal || void 0 === this.attributes.uv) return void n.warn("THREE.BufferGeometry: Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()");
                    var i = this.attributes.index.array,
                        r = this.attributes.position.array,
                        o = this.attributes.normal.array,
                        a = this.attributes.uv.array,
                        s = r.length / 3;
                    void 0 === this.attributes.tangent && this.addAttribute("tangent", new n.BufferAttribute(new Float32Array(4 * s), 4));
                    for (var h = this.attributes.tangent.array, l = [], c = [], u = 0; s > u; u++) l[u] = new n.Vector3, c[u] = new n.Vector3;
                    var d, p, f, m, g, v, y, _, x, b, w, T, M, S, C, A, E, P, L = new n.Vector3,
                        R = new n.Vector3,
                        F = new n.Vector3,
                        k = new n.Vector2,
                        O = new n.Vector2,
                        D = new n.Vector2,
                        B = new n.Vector3,
                        U = new n.Vector3;
                    0 === this.drawcalls.length && this.addDrawCall(0, i.length, 0);
                    var z = this.drawcalls;
                    for (S = 0, C = z.length; C > S; ++S) {
                        var N = z[S].start,
                            V = z[S].count,
                            I = z[S].index;
                        for (T = N, M = N + V; M > T; T += 3) A = I + i[T],
                            E = I + i[T + 1], P = I + i[T + 2], e(A, E, P)
                    }
                    var G, H, j, W = new n.Vector3,
                        X = new n.Vector3,
                        Y = new n.Vector3,
                        q = new n.Vector3;
                    for (S = 0, C = z.length; C > S; ++S) { var N = z[S].start,
                            V = z[S].count,
                            I = z[S].index; for (T = N, M = N + V; M > T; T += 3) A = I + i[T], E = I + i[T + 1], P = I + i[T + 2], t(A), t(E), t(P) }
                },
                computeOffsets: function(e) { void 0 === e && (e = 65535); for (var t = this.attributes.index.array, i = this.attributes.position.array, r = t.length / 3, n = new Uint16Array(t.length), o = 0, a = 0, s = [{ start: 0, count: 0, index: 0 }], h = s[0], l = 0, c = 0, u = new Int32Array(6), d = new Int32Array(i.length), p = new Int32Array(i.length), f = 0; f < i.length; f++) d[f] = -1, p[f] = -1; for (var m = 0; r > m; m++) { c = 0; for (var g = 0; 3 > g; g++) { var v = t[3 * m + g]; - 1 == d[v] ? (u[2 * g] = v, u[2 * g + 1] = -1, c++) : d[v] < h.index ? (u[2 * g] = v, u[2 * g + 1] = -1, l++) : (u[2 * g] = v, u[2 * g + 1] = d[v]) } var y = a + c; if (y > h.index + e) { var _ = { start: o, count: 0, index: a };
                            s.push(_), h = _; for (var x = 0; 6 > x; x += 2) { var b = u[x + 1];
                                b > -1 && b < h.index && (u[x + 1] = -1) } } for (var x = 0; 6 > x; x += 2) { var v = u[x],
                                b = u[x + 1]; - 1 === b && (b = a++), d[v] = b, p[b] = v, n[o++] = b - h.index, h.count++ } } return this.reorderBuffers(n, p, a), this.offsets = s, this.drawcalls = s, s },
                merge: function(e, t) { if (e instanceof n.BufferGeometry == !1) return void n.error("THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.", e);
                    void 0 === t && (t = 0); var i = this.attributes; for (var r in i)
                        if (void 0 !== e.attributes[r])
                            for (var o = i[r], a = o.array, s = e.attributes[r], h = s.array, l = s.itemSize, c = 0, u = l * t; c < h.length; c++, u++) a[u] = h[c]; return this },
                normalizeNormals: function() { for (var e, t, i, r, n = this.attributes.normal.array, o = 0, a = n.length; a > o; o += 3) e = n[o], t = n[o + 1], i = n[o + 2], r = 1 / Math.sqrt(e * e + t * t + i * i), n[o] *= r, n[o + 1] *= r, n[o + 2] *= r },
                reorderBuffers: function(e, t, i) { var r = {}; for (var n in this.attributes)
                        if ("index" != n) { var o = this.attributes[n].array;
                            r[n] = new o.constructor(this.attributes[n].itemSize * i) } for (var a = 0; i > a; a++) { var s = t[a]; for (var n in this.attributes)
                            if ("index" != n)
                                for (var h = this.attributes[n].array, l = this.attributes[n].itemSize, c = r[n], u = 0; l > u; u++) c[a * l + u] = h[s * l + u] } this.attributes.index.array = e; for (var n in this.attributes) "index" != n && (this.attributes[n].array = r[n], this.attributes[n].numItems = this.attributes[n].itemSize * i) },
                toJSON: function() { var e = { metadata: { version: 4, type: "BufferGeometry", generator: "BufferGeometryExporter" }, uuid: this.uuid, type: this.type, data: { attributes: {} } },
                        t = this.attributes,
                        i = this.offsets,
                        r = this.boundingSphere; for (var n in t) { var o = t[n],
                            a = Array.prototype.slice.call(o.array);
                        e.data.attributes[n] = { itemSize: o.itemSize, type: o.array.constructor.name, array: a } } return i.length > 0 && (e.data.offsets = JSON.parse(JSON.stringify(i))), null !== r && (e.data.boundingSphere = { center: r.center.toArray(), radius: r.radius }), e },
                clone: function() { var e = new n.BufferGeometry; for (var t in this.attributes) { var i = this.attributes[t];
                        e.addAttribute(t, i.clone()) } for (var r = 0, o = this.offsets.length; o > r; r++) { var a = this.offsets[r];
                        e.offsets.push({ start: a.start, index: a.index, count: a.count }) } return e },
                dispose: function() { this.dispatchEvent({ type: "dispose" }) }
            }, n.EventDispatcher.prototype.apply(n.BufferGeometry.prototype), n.Geometry = function() { Object.defineProperty(this, "id", { value: n.GeometryIdCount++ }), this.uuid = n.Math.generateUUID(), this.name = "", this.type = "Geometry", this.vertices = [], this.colors = [], this.faces = [], this.faceVertexUvs = [
                    []
                ], this.morphTargets = [], this.morphColors = [], this.morphNormals = [], this.skinWeights = [], this.skinIndices = [], this.lineDistances = [], this.boundingBox = null, this.boundingSphere = null, this.hasTangents = !1, this.dynamic = !0, this.verticesNeedUpdate = !1, this.elementsNeedUpdate = !1, this.uvsNeedUpdate = !1, this.normalsNeedUpdate = !1, this.tangentsNeedUpdate = !1, this.colorsNeedUpdate = !1, this.lineDistancesNeedUpdate = !1, this.groupsNeedUpdate = !1 }, n.Geometry.prototype = { constructor: n.Geometry, applyMatrix: function(e) { for (var t = (new n.Matrix3).getNormalMatrix(e), i = 0, r = this.vertices.length; r > i; i++) { var o = this.vertices[i];
                        o.applyMatrix4(e) } for (var i = 0, r = this.faces.length; r > i; i++) { var a = this.faces[i];
                        a.normal.applyMatrix3(t).normalize(); for (var s = 0, h = a.vertexNormals.length; h > s; s++) a.vertexNormals[s].applyMatrix3(t).normalize() } null !== this.boundingBox && this.computeBoundingBox(), null !== this.boundingSphere && this.computeBoundingSphere(), this.verticesNeedUpdate = !0, this.normalsNeedUpdate = !0 }, fromBufferGeometry: function(e) { for (var t = this, i = e.attributes, r = i.position.array, o = void 0 !== i.index ? i.index.array : void 0, a = void 0 !== i.normal ? i.normal.array : void 0, s = void 0 !== i.color ? i.color.array : void 0, h = void 0 !== i.uv ? i.uv.array : void 0, l = [], c = [], u = 0, d = 0; u < r.length; u += 3, d += 2) t.vertices.push(new n.Vector3(r[u], r[u + 1], r[u + 2])), void 0 !== a && l.push(new n.Vector3(a[u], a[u + 1], a[u + 2])), void 0 !== s && t.colors.push(new n.Color(s[u], s[u + 1], s[u + 2])), void 0 !== h && c.push(new n.Vector2(h[d], h[d + 1])); var p = function(e, i, r) { var o = void 0 !== a ? [l[e].clone(), l[i].clone(), l[r].clone()] : [],
                            u = void 0 !== s ? [t.colors[e].clone(), t.colors[i].clone(), t.colors[r].clone()] : [];
                        t.faces.push(new n.Face3(e, i, r, o, u)), void 0 !== h && t.faceVertexUvs[0].push([c[e].clone(), c[i].clone(), c[r].clone()]) }; if (void 0 !== o) { var f = e.drawcalls; if (f.length > 0)
                            for (var u = 0; u < f.length; u++)
                                for (var m = f[u], g = m.start, v = m.count, y = m.index, d = g, _ = g + v; _ > d; d += 3) p(y + o[d], y + o[d + 1], y + o[d + 2]);
                        else
                            for (var u = 0; u < o.length; u += 3) p(o[u], o[u + 1], o[u + 2]) } else
                        for (var u = 0; u < r.length / 3; u += 3) p(u, u + 1, u + 2); return this.computeFaceNormals(), null !== e.boundingBox && (this.boundingBox = e.boundingBox.clone()), null !== e.boundingSphere && (this.boundingSphere = e.boundingSphere.clone()), this }, center: function() { this.computeBoundingBox(); var e = this.boundingBox.center().negate(); return this.applyMatrix((new n.Matrix4).setPosition(e)), e }, computeFaceNormals: function() { for (var e = new n.Vector3, t = new n.Vector3, i = 0, r = this.faces.length; r > i; i++) { var o = this.faces[i],
                            a = this.vertices[o.a],
                            s = this.vertices[o.b],
                            h = this.vertices[o.c];
                        e.subVectors(h, s), t.subVectors(a, s), e.cross(t), e.normalize(), o.normal.copy(e) } }, computeVertexNormals: function(e) { var t, i, r, o, a, s; for (s = new Array(this.vertices.length), t = 0, i = this.vertices.length; i > t; t++) s[t] = new n.Vector3; if (e) { var h, l, c, u = new n.Vector3,
                            d = new n.Vector3; for (r = 0, o = this.faces.length; o > r; r++) a = this.faces[r], h = this.vertices[a.a], l = this.vertices[a.b], c = this.vertices[a.c], u.subVectors(c, l), d.subVectors(h, l), u.cross(d), s[a.a].add(u), s[a.b].add(u), s[a.c].add(u) } else
                        for (r = 0, o = this.faces.length; o > r; r++) a = this.faces[r], s[a.a].add(a.normal), s[a.b].add(a.normal), s[a.c].add(a.normal); for (t = 0, i = this.vertices.length; i > t; t++) s[t].normalize(); for (r = 0, o = this.faces.length; o > r; r++) a = this.faces[r], a.vertexNormals[0] = s[a.a].clone(), a.vertexNormals[1] = s[a.b].clone(), a.vertexNormals[2] = s[a.c].clone() }, computeMorphNormals: function() { var e, t, i, r, o; for (i = 0, r = this.faces.length; r > i; i++)
                        for (o = this.faces[i], o.__originalFaceNormal ? o.__originalFaceNormal.copy(o.normal) : o.__originalFaceNormal = o.normal.clone(), o.__originalVertexNormals || (o.__originalVertexNormals = []), e = 0, t = o.vertexNormals.length; t > e; e++) o.__originalVertexNormals[e] ? o.__originalVertexNormals[e].copy(o.vertexNormals[e]) : o.__originalVertexNormals[e] = o.vertexNormals[e].clone(); var a = new n.Geometry; for (a.faces = this.faces, e = 0, t = this.morphTargets.length; t > e; e++) { if (!this.morphNormals[e]) { this.morphNormals[e] = {}, this.morphNormals[e].faceNormals = [], this.morphNormals[e].vertexNormals = []; var s, h, l = this.morphNormals[e].faceNormals,
                                c = this.morphNormals[e].vertexNormals; for (i = 0, r = this.faces.length; r > i; i++) s = new n.Vector3, h = { a: new n.Vector3, b: new n.Vector3, c: new n.Vector3 }, l.push(s), c.push(h) } var u = this.morphNormals[e];
                        a.vertices = this.morphTargets[e].vertices, a.computeFaceNormals(), a.computeVertexNormals(); var s, h; for (i = 0, r = this.faces.length; r > i; i++) o = this.faces[i], s = u.faceNormals[i], h = u.vertexNormals[i], s.copy(o.normal), h.a.copy(o.vertexNormals[0]), h.b.copy(o.vertexNormals[1]), h.c.copy(o.vertexNormals[2]) } for (i = 0, r = this.faces.length; r > i; i++) o = this.faces[i], o.normal = o.__originalFaceNormal, o.vertexNormals = o.__originalVertexNormals }, computeTangents: function() {
                    function e(e, t, i, r, n, o, a) { c = e.vertices[t], u = e.vertices[i], d = e.vertices[r], p = l[n], f = l[o], m = l[a], g = u.x - c.x, v = d.x - c.x, y = u.y - c.y, _ = d.y - c.y, x = u.z - c.z, b = d.z - c.z, w = f.x - p.x, T = m.x - p.x, M = f.y - p.y, S = m.y - p.y, C = 1 / (w * S - T * M), F.set((S * g - M * v) * C, (S * y - M * _) * C, (S * x - M * b) * C), k.set((w * v - T * g) * C, (w * _ - T * y) * C, (w * b - T * x) * C), L[t].add(F), L[i].add(F), L[r].add(F), R[t].add(k), R[i].add(k), R[r].add(k) } var t, i, r, o, a, s, h, l, c, u, d, p, f, m, g, v, y, _, x, b, w, T, M, S, C, A, E, P, L = [],
                        R = [],
                        F = new n.Vector3,
                        k = new n.Vector3,
                        O = new n.Vector3,
                        D = new n.Vector3,
                        B = new n.Vector3; for (r = 0, o = this.vertices.length; o > r; r++) L[r] = new n.Vector3, R[r] = new n.Vector3; for (t = 0, i = this.faces.length; i > t; t++) h = this.faces[t], l = this.faceVertexUvs[0][t], e(this, h.a, h.b, h.c, 0, 1, 2); var U = ["a", "b", "c", "d"]; for (t = 0, i = this.faces.length; i > t; t++)
                        for (h = this.faces[t], a = 0; a < Math.min(h.vertexNormals.length, 3); a++) B.copy(h.vertexNormals[a]), s = h[U[a]], A = L[s], O.copy(A), O.sub(B.multiplyScalar(B.dot(A))).normalize(), D.crossVectors(h.vertexNormals[a], A), E = D.dot(R[s]), P = 0 > E ? -1 : 1, h.vertexTangents[a] = new n.Vector4(O.x, O.y, O.z, P);
                    this.hasTangents = !0 }, computeLineDistances: function() { for (var e = 0, t = this.vertices, i = 0, r = t.length; r > i; i++) i > 0 && (e += t[i].distanceTo(t[i - 1])), this.lineDistances[i] = e }, computeBoundingBox: function() { null === this.boundingBox && (this.boundingBox = new n.Box3), this.boundingBox.setFromPoints(this.vertices) }, computeBoundingSphere: function() { null === this.boundingSphere && (this.boundingSphere = new n.Sphere), this.boundingSphere.setFromPoints(this.vertices) }, merge: function(e, t, i) { if (e instanceof n.Geometry == !1) return void n.error("THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.", e); var r, o = this.vertices.length,
                        a = this.vertices,
                        s = e.vertices,
                        h = this.faces,
                        l = e.faces,
                        c = this.faceVertexUvs[0],
                        u = e.faceVertexUvs[0];
                    void 0 === i && (i = 0), void 0 !== t && (r = (new n.Matrix3).getNormalMatrix(t)); for (var d = 0, p = s.length; p > d; d++) { var f = s[d],
                            m = f.clone();
                        void 0 !== t && m.applyMatrix4(t), a.push(m) } for (d = 0, p = l.length; p > d; d++) { var g, v, y, _ = l[d],
                            x = _.vertexNormals,
                            b = _.vertexColors;
                        g = new n.Face3(_.a + o, _.b + o, _.c + o), g.normal.copy(_.normal), void 0 !== r && g.normal.applyMatrix3(r).normalize(); for (var w = 0, T = x.length; T > w; w++) v = x[w].clone(), void 0 !== r && v.applyMatrix3(r).normalize(), g.vertexNormals.push(v);
                        g.color.copy(_.color); for (var w = 0, T = b.length; T > w; w++) y = b[w], g.vertexColors.push(y.clone());
                        g.materialIndex = _.materialIndex + i, h.push(g) } for (d = 0, p = u.length; p > d; d++) { var M = u[d],
                            S = []; if (void 0 !== M) { for (var w = 0, T = M.length; T > w; w++) S.push(M[w].clone());
                            c.push(S) } } }, mergeMesh: function(e) { return e instanceof n.Mesh == !1 ? void n.error("THREE.Geometry.mergeMesh(): mesh not an instance of THREE.Mesh.", e) : (e.matrixAutoUpdate && e.updateMatrix(), void this.merge(e.geometry, e.matrix)) }, mergeVertices: function() { var e, t, i, r, n, o, a, s, h = {},
                        l = [],
                        c = [],
                        u = 4,
                        d = Math.pow(10, u); for (i = 0, r = this.vertices.length; r > i; i++) e = this.vertices[i], t = Math.round(e.x * d) + "_" + Math.round(e.y * d) + "_" + Math.round(e.z * d), void 0 === h[t] ? (h[t] = i, l.push(this.vertices[i]), c[i] = l.length - 1) : c[i] = c[h[t]]; var p = []; for (i = 0, r = this.faces.length; r > i; i++) { n = this.faces[i], n.a = c[n.a], n.b = c[n.b], n.c = c[n.c], o = [n.a, n.b, n.c]; for (var f = -1, m = 0; 3 > m; m++)
                            if (o[m] == o[(m + 1) % 3]) { f = m, p.push(i); break } } for (i = p.length - 1; i >= 0; i--) { var g = p[i]; for (this.faces.splice(g, 1), a = 0, s = this.faceVertexUvs.length; s > a; a++) this.faceVertexUvs[a].splice(g, 1) } var v = this.vertices.length - l.length; return this.vertices = l, v }, toJSON: function() {
                    function e(e, t, i) { return i ? e | 1 << t : e & ~(1 << t) }

                    function t(e) { var t = e.x.toString() + e.y.toString() + e.z.toString(); return void 0 !== d[t] ? d[t] : (d[t] = u.length / 3, u.push(e.x, e.y, e.z), d[t]) }

                    function i(e) { var t = e.r.toString() + e.g.toString() + e.b.toString(); return void 0 !== f[t] ? f[t] : (f[t] = p.length, p.push(e.getHex()), f[t]) }

                    function r(e) { var t = e.x.toString() + e.y.toString(); return void 0 !== g[t] ? g[t] : (g[t] = m.length / 2, m.push(e.x, e.y), g[t]) } var n = { metadata: { version: 4, type: "BufferGeometry", generator: "BufferGeometryExporter" }, uuid: this.uuid, type: this.type }; if ("" !== this.name && (n.name = this.name), void 0 !== this.parameters) { var o = this.parameters; for (var a in o) void 0 !== o[a] && (n[a] = o[a]); return n } for (var s = [], h = 0; h < this.vertices.length; h++) { var l = this.vertices[h];
                        s.push(l.x, l.y, l.z) } for (var c = [], u = [], d = {}, p = [], f = {}, m = [], g = {}, h = 0; h < this.faces.length; h++) { var v = this.faces[h],
                            y = !1,
                            _ = !1,
                            x = void 0 !== this.faceVertexUvs[0][h],
                            b = v.normal.length() > 0,
                            w = v.vertexNormals.length > 0,
                            T = 1 !== v.color.r || 1 !== v.color.g || 1 !== v.color.b,
                            M = v.vertexColors.length > 0,
                            S = 0; if (S = e(S, 0, 0), S = e(S, 1, y), S = e(S, 2, _), S = e(S, 3, x), S = e(S, 4, b), S = e(S, 5, w), S = e(S, 6, T), S = e(S, 7, M), c.push(S), c.push(v.a, v.b, v.c), x) { var C = this.faceVertexUvs[0][h];
                            c.push(r(C[0]), r(C[1]), r(C[2])) } if (b && c.push(t(v.normal)), w) { var A = v.vertexNormals;
                            c.push(t(A[0]), t(A[1]), t(A[2])) } if (T && c.push(i(v.color)), M) { var E = v.vertexColors;
                            c.push(i(E[0]), i(E[1]), i(E[2])) } } return n.data = {}, n.data.vertices = s, n.data.normals = u, p.length > 0 && (n.data.colors = p), m.length > 0 && (n.data.uvs = [m]), n.data.faces = c, n }, clone: function() { for (var e = new n.Geometry, t = this.vertices, i = 0, r = t.length; r > i; i++) e.vertices.push(t[i].clone()); for (var o = this.faces, i = 0, r = o.length; r > i; i++) e.faces.push(o[i].clone()); for (var i = 0, r = this.faceVertexUvs.length; r > i; i++) { var a = this.faceVertexUvs[i];
                        void 0 === e.faceVertexUvs[i] && (e.faceVertexUvs[i] = []); for (var s = 0, h = a.length; h > s; s++) { for (var l = a[s], c = [], u = 0, d = l.length; d > u; u++) { var p = l[u];
                                c.push(p.clone()) } e.faceVertexUvs[i].push(c) } } return e }, dispose: function() { this.dispatchEvent({ type: "dispose" }) } }, n.EventDispatcher.prototype.apply(n.Geometry.prototype), n.GeometryIdCount = 0, n.Camera = function() { n.Object3D.call(this), this.type = "Camera", this.matrixWorldInverse = new n.Matrix4, this.projectionMatrix = new n.Matrix4 }, n.Camera.prototype = Object.create(n.Object3D.prototype), n.Camera.prototype.constructor = n.Camera, n.Camera.prototype.getWorldDirection = function() { var e = new n.Quaternion; return function(t) { var i = t || new n.Vector3; return this.getWorldQuaternion(e), i.set(0, 0, -1).applyQuaternion(e) } }(), n.Camera.prototype.lookAt = function() { var e = new n.Matrix4; return function(t) { e.lookAt(this.position, t, this.up), this.quaternion.setFromRotationMatrix(e) } }(), n.Camera.prototype.clone = function(e) { return void 0 === e && (e = new n.Camera), n.Object3D.prototype.clone.call(this, e), e.matrixWorldInverse.copy(this.matrixWorldInverse), e.projectionMatrix.copy(this.projectionMatrix), e }, n.CubeCamera = function(e, t, i) { n.Object3D.call(this), this.type = "CubeCamera"; var r = 90,
                    o = 1,
                    a = new n.PerspectiveCamera(r, o, e, t);
                a.up.set(0, -1, 0), a.lookAt(new n.Vector3(1, 0, 0)), this.add(a); var s = new n.PerspectiveCamera(r, o, e, t);
                s.up.set(0, -1, 0), s.lookAt(new n.Vector3(-1, 0, 0)), this.add(s); var h = new n.PerspectiveCamera(r, o, e, t);
                h.up.set(0, 0, 1), h.lookAt(new n.Vector3(0, 1, 0)), this.add(h); var l = new n.PerspectiveCamera(r, o, e, t);
                l.up.set(0, 0, -1), l.lookAt(new n.Vector3(0, -1, 0)), this.add(l); var c = new n.PerspectiveCamera(r, o, e, t);
                c.up.set(0, -1, 0), c.lookAt(new n.Vector3(0, 0, 1)), this.add(c); var u = new n.PerspectiveCamera(r, o, e, t);
                u.up.set(0, -1, 0), u.lookAt(new n.Vector3(0, 0, -1)), this.add(u), this.renderTarget = new n.WebGLRenderTargetCube(i, i, { format: n.RGBFormat, magFilter: n.LinearFilter, minFilter: n.LinearFilter }), this.updateCubeMap = function(e, t) { var i = this.renderTarget,
                        r = i.generateMipmaps;
                    i.generateMipmaps = !1, i.activeCubeFace = 0, e.render(t, a, i), i.activeCubeFace = 1, e.render(t, s, i), i.activeCubeFace = 2, e.render(t, h, i), i.activeCubeFace = 3, e.render(t, l, i), i.activeCubeFace = 4, e.render(t, c, i), i.generateMipmaps = r, i.activeCubeFace = 5, e.render(t, u, i) } }, n.CubeCamera.prototype = Object.create(n.Object3D.prototype), n.CubeCamera.prototype.constructor = n.CubeCamera, n.OrthographicCamera = function(e, t, i, r, o, a) { n.Camera.call(this), this.type = "OrthographicCamera", this.zoom = 1, this.left = e, this.right = t, this.top = i, this.bottom = r, this.near = void 0 !== o ? o : .1, this.far = void 0 !== a ? a : 2e3, this.updateProjectionMatrix() }, n.OrthographicCamera.prototype = Object.create(n.Camera.prototype), n.OrthographicCamera.prototype.constructor = n.OrthographicCamera, n.OrthographicCamera.prototype.updateProjectionMatrix = function() { var e = (this.right - this.left) / (2 * this.zoom),
                    t = (this.top - this.bottom) / (2 * this.zoom),
                    i = (this.right + this.left) / 2,
                    r = (this.top + this.bottom) / 2;
                this.projectionMatrix.makeOrthographic(i - e, i + e, r + t, r - t, this.near, this.far) }, n.OrthographicCamera.prototype.clone = function() { var e = new n.OrthographicCamera; return n.Camera.prototype.clone.call(this, e), e.zoom = this.zoom, e.left = this.left, e.right = this.right, e.top = this.top, e.bottom = this.bottom, e.near = this.near, e.far = this.far, e.projectionMatrix.copy(this.projectionMatrix), e }, n.PerspectiveCamera = function(e, t, i, r) { n.Camera.call(this), this.type = "PerspectiveCamera", this.zoom = 1, this.fov = void 0 !== e ? e : 50, this.aspect = void 0 !== t ? t : 1, this.near = void 0 !== i ? i : .1, this.far = void 0 !== r ? r : 2e3, this.updateProjectionMatrix() }, n.PerspectiveCamera.prototype = Object.create(n.Camera.prototype), n.PerspectiveCamera.prototype.constructor = n.PerspectiveCamera, n.PerspectiveCamera.prototype.setLens = function(e, t) { void 0 === t && (t = 24), this.fov = 2 * n.Math.radToDeg(Math.atan(t / (2 * e))), this.updateProjectionMatrix() }, n.PerspectiveCamera.prototype.setViewOffset = function(e, t, i, r, n, o) { this.fullWidth = e, this.fullHeight = t, this.x = i, this.y = r, this.width = n, this.height = o, this.updateProjectionMatrix() }, n.PerspectiveCamera.prototype.updateProjectionMatrix = function() { var e = n.Math.radToDeg(2 * Math.atan(Math.tan(.5 * n.Math.degToRad(this.fov)) / this.zoom)); if (this.fullWidth) { var t = this.fullWidth / this.fullHeight,
                        i = Math.tan(n.Math.degToRad(.5 * e)) * this.near,
                        r = -i,
                        o = t * r,
                        a = t * i,
                        s = Math.abs(a - o),
                        h = Math.abs(i - r);
                    this.projectionMatrix.makeFrustum(o + this.x * s / this.fullWidth, o + (this.x + this.width) * s / this.fullWidth, i - (this.y + this.height) * h / this.fullHeight, i - this.y * h / this.fullHeight, this.near, this.far) } else this.projectionMatrix.makePerspective(e, this.aspect, this.near, this.far) }, n.PerspectiveCamera.prototype.clone = function() { var e = new n.PerspectiveCamera; return n.Camera.prototype.clone.call(this, e), e.zoom = this.zoom, e.fov = this.fov, e.aspect = this.aspect, e.near = this.near, e.far = this.far, e.projectionMatrix.copy(this.projectionMatrix), e }, n.Light = function(e) { n.Object3D.call(this), this.type = "Light", this.color = new n.Color(e) }, n.Light.prototype = Object.create(n.Object3D.prototype), n.Light.prototype.constructor = n.Light, n.Light.prototype.clone = function(e) { return void 0 === e && (e = new n.Light), n.Object3D.prototype.clone.call(this, e), e.color.copy(this.color), e }, n.AmbientLight = function(e) { n.Light.call(this, e), this.type = "AmbientLight" }, n.AmbientLight.prototype = Object.create(n.Light.prototype), n.AmbientLight.prototype.constructor = n.AmbientLight, n.AmbientLight.prototype.clone = function() { var e = new n.AmbientLight; return n.Light.prototype.clone.call(this, e), e }, n.AreaLight = function(e, t) { n.Light.call(this, e), this.type = "AreaLight", this.normal = new n.Vector3(0, -1, 0), this.right = new n.Vector3(1, 0, 0), this.intensity = void 0 !== t ? t : 1, this.width = 1, this.height = 1, this.constantAttenuation = 1.5, this.linearAttenuation = .5, this.quadraticAttenuation = .1 }, n.AreaLight.prototype = Object.create(n.Light.prototype), n.AreaLight.prototype.constructor = n.AreaLight, n.DirectionalLight = function(e, t) { n.Light.call(this, e), this.type = "DirectionalLight", this.position.set(0, 1, 0), this.target = new n.Object3D, this.intensity = void 0 !== t ? t : 1, this.castShadow = !1, this.onlyShadow = !1, this.shadowCameraNear = 50, this.shadowCameraFar = 5e3, this.shadowCameraLeft = -500, this.shadowCameraRight = 500, this.shadowCameraTop = 500, this.shadowCameraBottom = -500, this.shadowCameraVisible = !1, this.shadowBias = 0, this.shadowDarkness = .5, this.shadowMapWidth = 512, this.shadowMapHeight = 512, this.shadowCascade = !1, this.shadowCascadeOffset = new n.Vector3(0, 0, -1e3), this.shadowCascadeCount = 2, this.shadowCascadeBias = [0, 0, 0], this.shadowCascadeWidth = [512, 512, 512], this.shadowCascadeHeight = [512, 512, 512], this.shadowCascadeNearZ = [-1, .99, .998], this.shadowCascadeFarZ = [.99, .998, 1], this.shadowCascadeArray = [], this.shadowMap = null, this.shadowMapSize = null, this.shadowCamera = null, this.shadowMatrix = null }, n.DirectionalLight.prototype = Object.create(n.Light.prototype), n.DirectionalLight.prototype.constructor = n.DirectionalLight, n.DirectionalLight.prototype.clone = function() { var e = new n.DirectionalLight; return n.Light.prototype.clone.call(this, e), e.target = this.target.clone(), e.intensity = this.intensity, e.castShadow = this.castShadow, e.onlyShadow = this.onlyShadow, e.shadowCameraNear = this.shadowCameraNear, e.shadowCameraFar = this.shadowCameraFar, e.shadowCameraLeft = this.shadowCameraLeft, e.shadowCameraRight = this.shadowCameraRight, e.shadowCameraTop = this.shadowCameraTop, e.shadowCameraBottom = this.shadowCameraBottom, e.shadowCameraVisible = this.shadowCameraVisible, e.shadowBias = this.shadowBias, e.shadowDarkness = this.shadowDarkness, e.shadowMapWidth = this.shadowMapWidth, e.shadowMapHeight = this.shadowMapHeight, e.shadowCascade = this.shadowCascade, e.shadowCascadeOffset.copy(this.shadowCascadeOffset), e.shadowCascadeCount = this.shadowCascadeCount, e.shadowCascadeBias = this.shadowCascadeBias.slice(0), e.shadowCascadeWidth = this.shadowCascadeWidth.slice(0), e.shadowCascadeHeight = this.shadowCascadeHeight.slice(0), e.shadowCascadeNearZ = this.shadowCascadeNearZ.slice(0), e.shadowCascadeFarZ = this.shadowCascadeFarZ.slice(0), e }, n.HemisphereLight = function(e, t, i) { n.Light.call(this, e), this.type = "HemisphereLight", this.position.set(0, 100, 0), this.groundColor = new n.Color(t), this.intensity = void 0 !== i ? i : 1 }, n.HemisphereLight.prototype = Object.create(n.Light.prototype), n.HemisphereLight.prototype.constructor = n.HemisphereLight, n.HemisphereLight.prototype.clone = function() { var e = new n.HemisphereLight; return n.Light.prototype.clone.call(this, e), e.groundColor.copy(this.groundColor), e.intensity = this.intensity, e }, n.PointLight = function(e, t, i, r) { n.Light.call(this, e), this.type = "PointLight", this.intensity = void 0 !== t ? t : 1, this.distance = void 0 !== i ? i : 0, this.decay = void 0 !== r ? r : 1 }, n.PointLight.prototype = Object.create(n.Light.prototype), n.PointLight.prototype.constructor = n.PointLight, n.PointLight.prototype.clone = function() { var e = new n.PointLight; return n.Light.prototype.clone.call(this, e), e.intensity = this.intensity, e.distance = this.distance, e.decay = this.decay, e }, n.SpotLight = function(e, t, i, r, o, a) { n.Light.call(this, e), this.type = "SpotLight", this.position.set(0, 1, 0), this.target = new n.Object3D, this.intensity = void 0 !== t ? t : 1, this.distance = void 0 !== i ? i : 0, this.angle = void 0 !== r ? r : Math.PI / 3, this.exponent = void 0 !== o ? o : 10, this.decay = void 0 !== a ? a : 1, this.castShadow = !1, this.onlyShadow = !1, this.shadowCameraNear = 50, this.shadowCameraFar = 5e3, this.shadowCameraFov = 50, this.shadowCameraVisible = !1, this.shadowBias = 0, this.shadowDarkness = .5, this.shadowMapWidth = 512, this.shadowMapHeight = 512, this.shadowMap = null, this.shadowMapSize = null, this.shadowCamera = null, this.shadowMatrix = null }, n.SpotLight.prototype = Object.create(n.Light.prototype), n.SpotLight.prototype.constructor = n.SpotLight, n.SpotLight.prototype.clone = function() { var e = new n.SpotLight; return n.Light.prototype.clone.call(this, e), e.target = this.target.clone(), e.intensity = this.intensity, e.distance = this.distance, e.angle = this.angle, e.exponent = this.exponent, e.decay = this.decay, e.castShadow = this.castShadow, e.onlyShadow = this.onlyShadow, e.shadowCameraNear = this.shadowCameraNear, e.shadowCameraFar = this.shadowCameraFar, e.shadowCameraFov = this.shadowCameraFov, e.shadowCameraVisible = this.shadowCameraVisible, e.shadowBias = this.shadowBias, e.shadowDarkness = this.shadowDarkness, e.shadowMapWidth = this.shadowMapWidth, e.shadowMapHeight = this.shadowMapHeight, e }, n.Cache = { files: {}, add: function(e, t) { this.files[e] = t }, get: function(e) { return this.files[e] }, remove: function(e) { delete this.files[e] }, clear: function() { this.files = {} } }, n.Loader = function(e) { this.showStatus = e, this.statusDomElement = e ? n.Loader.prototype.addStatusElement() : null, this.imageLoader = new n.ImageLoader, this.onLoadStart = function() {}, this.onLoadProgress = function() {}, this.onLoadComplete = function() {} }, n.Loader.prototype = { constructor: n.Loader, crossOrigin: void 0, addStatusElement: function() { var e = document.createElement("div"); return e.style.position = "absolute", e.style.right = "0px", e.style.top = "0px", e.style.fontSize = "0.8em", e.style.textAlign = "left", e.style.background = "rgba(0,0,0,0.25)", e.style.color = "#fff", e.style.width = "120px", e.style.padding = "0.5em 0.5em 0.5em 0.5em", e.style.zIndex = 1e3, e.innerHTML = "Loading ...", e }, updateProgress: function(e) { var t = "Loaded ";
                    t += e.total ? (100 * e.loaded / e.total).toFixed(0) + "%" : (e.loaded / 1024).toFixed(2) + " KB", this.statusDomElement.innerHTML = t }, extractUrlBase: function(e) { var t = e.split("/"); return 1 === t.length ? "./" : (t.pop(), t.join("/") + "/") }, initMaterials: function(e, t) { for (var i = [], r = 0; r < e.length; ++r) i[r] = this.createMaterial(e[r], t); return i }, needsTangents: function(e) { for (var t = 0, i = e.length; i > t; t++) { var r = e[t]; if (r instanceof n.ShaderMaterial) return !0 } return !1 }, createMaterial: function(e, t) {
                    function i(e) { var t = Math.log(e) / Math.LN2; return Math.pow(2, Math.round(t)) }

                    function r(e, r, o, s, h, l, c) { var u, d = t + o,
                            p = n.Loader.Handlers.get(d); if (null !== p ? u = p.load(d) : (u = new n.Texture, p = a.imageLoader, p.crossOrigin = a.crossOrigin, p.load(d, function(e) { if (n.Math.isPowerOfTwo(e.width) === !1 || n.Math.isPowerOfTwo(e.height) === !1) { var t = i(e.width),
                                        r = i(e.height),
                                        o = document.createElement("canvas");
                                    o.width = t, o.height = r; var a = o.getContext("2d");
                                    a.drawImage(e, 0, 0, t, r), u.image = o } else u.image = e;
                                u.needsUpdate = !0 })), u.sourceFile = o, s && (u.repeat.set(s[0], s[1]), 1 !== s[0] && (u.wrapS = n.RepeatWrapping), 1 !== s[1] && (u.wrapT = n.RepeatWrapping)), h && u.offset.set(h[0], h[1]), l) { var f = { repeat: n.RepeatWrapping, mirror: n.MirroredRepeatWrapping };
                            void 0 !== f[l[0]] && (u.wrapS = f[l[0]]), void 0 !== f[l[1]] && (u.wrapT = f[l[1]]) } c && (u.anisotropy = c), e[r] = u }

                    function o(e) { return (255 * e[0] << 16) + (255 * e[1] << 8) + 255 * e[2] } var a = this,
                        s = "MeshLambertMaterial",
                        h = { color: 15658734, opacity: 1, map: null, lightMap: null, normalMap: null, bumpMap: null, wireframe: !1 }; if (e.shading) { var l = e.shading.toLowerCase(); "phong" === l ? s = "MeshPhongMaterial" : "basic" === l && (s = "MeshBasicMaterial") } void 0 !== e.blending && void 0 !== n[e.blending] && (h.blending = n[e.blending]), void 0 !== e.transparent && (h.transparent = e.transparent), void 0 !== e.opacity && e.opacity < 1 && (h.transparent = !0), void 0 !== e.depthTest && (h.depthTest = e.depthTest), void 0 !== e.depthWrite && (h.depthWrite = e.depthWrite), void 0 !== e.visible && (h.visible = e.visible), void 0 !== e.flipSided && (h.side = n.BackSide), void 0 !== e.doubleSided && (h.side = n.DoubleSide), void 0 !== e.wireframe && (h.wireframe = e.wireframe), void 0 !== e.vertexColors && ("face" === e.vertexColors ? h.vertexColors = n.FaceColors : e.vertexColors && (h.vertexColors = n.VertexColors)), e.colorDiffuse ? h.color = o(e.colorDiffuse) : e.DbgColor && (h.color = e.DbgColor), e.colorSpecular && (h.specular = o(e.colorSpecular)), e.colorEmissive && (h.emissive = o(e.colorEmissive)), void 0 !== e.transparency && (console.warn("THREE.Loader: transparency has been renamed to opacity"), e.opacity = e.transparency), void 0 !== e.opacity && (h.opacity = e.opacity), e.specularCoef && (h.shininess = e.specularCoef), e.mapDiffuse && t && r(h, "map", e.mapDiffuse, e.mapDiffuseRepeat, e.mapDiffuseOffset, e.mapDiffuseWrap, e.mapDiffuseAnisotropy), e.mapLight && t && r(h, "lightMap", e.mapLight, e.mapLightRepeat, e.mapLightOffset, e.mapLightWrap, e.mapLightAnisotropy), e.mapBump && t && r(h, "bumpMap", e.mapBump, e.mapBumpRepeat, e.mapBumpOffset, e.mapBumpWrap, e.mapBumpAnisotropy), e.mapNormal && t && r(h, "normalMap", e.mapNormal, e.mapNormalRepeat, e.mapNormalOffset, e.mapNormalWrap, e.mapNormalAnisotropy), e.mapSpecular && t && r(h, "specularMap", e.mapSpecular, e.mapSpecularRepeat, e.mapSpecularOffset, e.mapSpecularWrap, e.mapSpecularAnisotropy), e.mapAlpha && t && r(h, "alphaMap", e.mapAlpha, e.mapAlphaRepeat, e.mapAlphaOffset, e.mapAlphaWrap, e.mapAlphaAnisotropy), e.mapBumpScale && (h.bumpScale = e.mapBumpScale), e.mapNormalFactor && (h.normalScale = new n.Vector2(e.mapNormalFactor, e.mapNormalFactor)); var c = new n[s](h); return void 0 !== e.DbgName && (c.name = e.DbgName), c } }, n.Loader.Handlers = { handlers: [], add: function(e, t) { this.handlers.push(e, t) }, get: function(e) { for (var t = 0, i = this.handlers.length; i > t; t += 2) { var r = this.handlers[t],
                            n = this.handlers[t + 1]; if (r.test(e)) return n } return null } }, n.XHRLoader = function(e) { this.manager = void 0 !== e ? e : n.DefaultLoadingManager }, n.XHRLoader.prototype = { constructor: n.XHRLoader, load: function(e, t, i, r) { var o = this,
                        a = n.Cache.get(e); if (void 0 !== a) return void(t && t(a)); var s = new XMLHttpRequest;
                    s.open("GET", e, !0), s.addEventListener("load", function(i) { n.Cache.add(e, this.response), t && t(this.response), o.manager.itemEnd(e) }, !1), void 0 !== i && s.addEventListener("progress", function(e) { i(e) }, !1), void 0 !== r && s.addEventListener("error", function(e) { r(e) }, !1), void 0 !== this.crossOrigin && (s.crossOrigin = this.crossOrigin), void 0 !== this.responseType && (s.responseType = this.responseType), s.send(null), o.manager.itemStart(e) }, setResponseType: function(e) { this.responseType = e }, setCrossOrigin: function(e) { this.crossOrigin = e } }, n.ImageLoader = function(e) { this.manager = void 0 !== e ? e : n.DefaultLoadingManager }, n.ImageLoader.prototype = { constructor: n.ImageLoader, load: function(e, t, i, r) { var o = this,
                        a = n.Cache.get(e); if (void 0 !== a) return void t(a); var s = document.createElement("img"); return s.addEventListener("load", function(i) { n.Cache.add(e, this), t && t(this), o.manager.itemEnd(e) }, !1), void 0 !== i && s.addEventListener("progress", function(e) { i(e) }, !1), void 0 !== r && s.addEventListener("error", function(e) { r(e) }, !1), void 0 !== this.crossOrigin && (s.crossOrigin = this.crossOrigin), s.src = e, o.manager.itemStart(e), s }, setCrossOrigin: function(e) { this.crossOrigin = e } }, n.JSONLoader = function(e) { n.Loader.call(this, e), this.withCredentials = !1 }, n.JSONLoader.prototype = Object.create(n.Loader.prototype), n.JSONLoader.prototype.constructor = n.JSONLoader, n.JSONLoader.prototype.load = function(e, t, i) { i = i && "string" == typeof i ? i : this.extractUrlBase(e), this.onLoadStart(), this.loadAjaxJSON(this, e, t, i) }, n.JSONLoader.prototype.loadAjaxJSON = function(e, t, i, r, o) { var a = new XMLHttpRequest,
                    s = 0;
                a.onreadystatechange = function() { if (a.readyState === a.DONE)
                        if (200 === a.status || 0 === a.status) { if (a.responseText) { var h = JSON.parse(a.responseText),
                                    l = h.metadata; if (void 0 !== l) { if ("object" === l.type) return void n.error("THREE.JSONLoader: " + t + " should be loaded with THREE.ObjectLoader instead."); if ("scene" === l.type) return void n.error("THREE.JSONLoader: " + t + " seems to be a Scene. Use THREE.SceneLoader instead.") } var c = e.parse(h, r);
                                i(c.geometry, c.materials) } else n.error("THREE.JSONLoader: " + t + " seems to be unreachable or the file is empty.");
                            e.onLoadComplete() } else n.error("THREE.JSONLoader: Couldn't load " + t + " (" + a.status + ")");
                    else a.readyState === a.LOADING ? o && (0 === s && (s = a.getResponseHeader("Content-Length")), o({ total: s, loaded: a.responseText.length })) : a.readyState === a.HEADERS_RECEIVED && void 0 !== o && (s = a.getResponseHeader("Content-Length")) }, a.open("GET", t, !0), a.withCredentials = this.withCredentials, a.send(null) }, n.JSONLoader.prototype.parse = function(e, t) {
                function i(t) {
                    function i(e, t) { return e & 1 << t }
                    var r, o, s, h, l, c, u, d, p, f, m, g, v, y, _, x, b, w, T, M, S, C, A, E, P, L, R, F = e.faces,
                        k = e.vertices,
                        O = e.normals,
                        D = e.colors,
                        B = 0;
                    if (void 0 !== e.uvs) { for (r = 0; r < e.uvs.length; r++) e.uvs[r].length && B++; for (r = 0; B > r; r++) a.faceVertexUvs[r] = [] }
                    for (h = 0, l = k.length; l > h;) w = new n.Vector3, w.x = k[h++] * t, w.y = k[h++] * t, w.z = k[h++] * t, a.vertices.push(w);
                    for (h = 0, l = F.length; l > h;)
                        if (f = F[h++], m = i(f, 0), g = i(f, 1), v = i(f, 3), y = i(f, 4), _ = i(f, 5), x = i(f, 6), b = i(f, 7), m) { if (M = new n.Face3, M.a = F[h], M.b = F[h + 1], M.c = F[h + 3], S = new n.Face3, S.a = F[h + 1], S.b = F[h + 2], S.c = F[h + 3], h += 4, g && (p = F[h++], M.materialIndex = p, S.materialIndex = p), s = a.faces.length, v)
                                for (r = 0; B > r; r++)
                                    for (E = e.uvs[r], a.faceVertexUvs[r][s] = [], a.faceVertexUvs[r][s + 1] = [], o = 0; 4 > o; o++) d = F[h++], L = E[2 * d], R = E[2 * d + 1], P = new n.Vector2(L, R), 2 !== o && a.faceVertexUvs[r][s].push(P), 0 !== o && a.faceVertexUvs[r][s + 1].push(P); if (y && (u = 3 * F[h++], M.normal.set(O[u++], O[u++], O[u]), S.normal.copy(M.normal)), _)
                                for (r = 0; 4 > r; r++) u = 3 * F[h++], A = new n.Vector3(O[u++], O[u++], O[u]), 2 !== r && M.vertexNormals.push(A), 0 !== r && S.vertexNormals.push(A); if (x && (c = F[h++], C = D[c], M.color.setHex(C), S.color.setHex(C)), b)
                                for (r = 0; 4 > r; r++) c = F[h++], C = D[c], 2 !== r && M.vertexColors.push(new n.Color(C)), 0 !== r && S.vertexColors.push(new n.Color(C));
                            a.faces.push(M), a.faces.push(S) } else {
                            if (T = new n.Face3, T.a = F[h++], T.b = F[h++], T.c = F[h++], g && (p = F[h++], T.materialIndex = p), s = a.faces.length, v)
                                for (r = 0; B > r; r++)
                                    for (E = e.uvs[r], a.faceVertexUvs[r][s] = [], o = 0; 3 > o; o++) d = F[h++], L = E[2 * d], R = E[2 * d + 1], P = new n.Vector2(L, R), a.faceVertexUvs[r][s].push(P);
                            if (y && (u = 3 * F[h++], T.normal.set(O[u++], O[u++], O[u])), _)
                                for (r = 0; 3 > r; r++) u = 3 * F[h++], A = new n.Vector3(O[u++], O[u++], O[u]), T.vertexNormals.push(A);
                            if (x && (c = F[h++], T.color.setHex(D[c])), b)
                                for (r = 0; 3 > r; r++) c = F[h++],
                                    T.vertexColors.push(new n.Color(D[c]));
                            a.faces.push(T)
                        }
                }

                function r() { var t = void 0 !== e.influencesPerVertex ? e.influencesPerVertex : 2; if (e.skinWeights)
                        for (var i = 0, r = e.skinWeights.length; r > i; i += t) { var o = e.skinWeights[i],
                                s = t > 1 ? e.skinWeights[i + 1] : 0,
                                h = t > 2 ? e.skinWeights[i + 2] : 0,
                                l = t > 3 ? e.skinWeights[i + 3] : 0;
                            a.skinWeights.push(new n.Vector4(o, s, h, l)) }
                    if (e.skinIndices)
                        for (var i = 0, r = e.skinIndices.length; r > i; i += t) { var c = e.skinIndices[i],
                                u = t > 1 ? e.skinIndices[i + 1] : 0,
                                d = t > 2 ? e.skinIndices[i + 2] : 0,
                                p = t > 3 ? e.skinIndices[i + 3] : 0;
                            a.skinIndices.push(new n.Vector4(c, u, d, p)) } a.bones = e.bones, a.bones && a.bones.length > 0 && (a.skinWeights.length !== a.skinIndices.length || a.skinIndices.length !== a.vertices.length) && n.warn("THREE.JSONLoader: When skinning, number of vertices (" + a.vertices.length + "), skinIndices (" + a.skinIndices.length + "), and skinWeights (" + a.skinWeights.length + ") should match."), a.animation = e.animation, a.animations = e.animations }

                function o(t) { if (void 0 !== e.morphTargets) { var i, r, o, s, h, l; for (i = 0, r = e.morphTargets.length; r > i; i++)
                            for (a.morphTargets[i] = {}, a.morphTargets[i].name = e.morphTargets[i].name, a.morphTargets[i].vertices = [], h = a.morphTargets[i].vertices, l = e.morphTargets[i].vertices, o = 0, s = l.length; s > o; o += 3) { var c = new n.Vector3;
                                c.x = l[o] * t, c.y = l[o + 1] * t, c.z = l[o + 2] * t, h.push(c) } } if (void 0 !== e.morphColors) { var i, r, u, d, p, f, m; for (i = 0, r = e.morphColors.length; r > i; i++)
                            for (a.morphColors[i] = {}, a.morphColors[i].name = e.morphColors[i].name, a.morphColors[i].colors = [], p = a.morphColors[i].colors, f = e.morphColors[i].colors, u = 0, d = f.length; d > u; u += 3) m = new n.Color(16755200), m.setRGB(f[u], f[u + 1], f[u + 2]), p.push(m) } }
                var a = new n.Geometry,
                    s = void 0 !== e.scale ? 1 / e.scale : 1;
                if (i(s), r(), o(s), a.computeFaceNormals(), a.computeBoundingSphere(), void 0 === e.materials || 0 === e.materials.length) return { geometry: a };
                var h = this.initMaterials(e.materials, t);
                return this.needsTangents(h) && a.computeTangents(), { geometry: a, materials: h }
            }, n.LoadingManager = function(e, t, i) { var r = this,
                    n = 0,
                    o = 0;
                this.onLoad = e, this.onProgress = t, this.onError = i, this.itemStart = function(e) { o++ }, this.itemEnd = function(e) { n++, void 0 !== r.onProgress && r.onProgress(e, n, o), n === o && void 0 !== r.onLoad && r.onLoad() } }, n.DefaultLoadingManager = new n.LoadingManager, n.BufferGeometryLoader = function(e) { this.manager = void 0 !== e ? e : n.DefaultLoadingManager }, n.BufferGeometryLoader.prototype = { constructor: n.BufferGeometryLoader, load: function(e, t, i, r) { var o = this,
                        a = new n.XHRLoader(o.manager);
                    a.setCrossOrigin(this.crossOrigin), a.load(e, function(e) { t(o.parse(JSON.parse(e))) }, i, r) }, setCrossOrigin: function(e) { this.crossOrigin = e }, parse: function(e) { var t = new n.BufferGeometry,
                        i = e.data.attributes; for (var o in i) { var a = i[o],
                            s = new r[a.type](a.array);
                        t.addAttribute(o, new n.BufferAttribute(s, a.itemSize)) } var h = e.data.offsets;
                    void 0 !== h && (t.offsets = JSON.parse(JSON.stringify(h))); var l = e.data.boundingSphere; if (void 0 !== l) { var c = new n.Vector3;
                        void 0 !== l.center && c.fromArray(l.center), t.boundingSphere = new n.Sphere(c, l.radius) } return t } }, n.MaterialLoader = function(e) { this.manager = void 0 !== e ? e : n.DefaultLoadingManager }, n.MaterialLoader.prototype = { constructor: n.MaterialLoader, load: function(e, t, i, r) { var o = this,
                        a = new n.XHRLoader(o.manager);
                    a.setCrossOrigin(this.crossOrigin), a.load(e, function(e) { t(o.parse(JSON.parse(e))) }, i, r) }, setCrossOrigin: function(e) { this.crossOrigin = e }, parse: function(e) { var t = new n[e.type]; if (void 0 !== e.color && t.color.setHex(e.color), void 0 !== e.emissive && t.emissive.setHex(e.emissive), void 0 !== e.specular && t.specular.setHex(e.specular), void 0 !== e.shininess && (t.shininess = e.shininess), void 0 !== e.uniforms && (t.uniforms = e.uniforms), void 0 !== e.vertexShader && (t.vertexShader = e.vertexShader), void 0 !== e.fragmentShader && (t.fragmentShader = e.fragmentShader), void 0 !== e.vertexColors && (t.vertexColors = e.vertexColors), void 0 !== e.shading && (t.shading = e.shading), void 0 !== e.blending && (t.blending = e.blending), void 0 !== e.side && (t.side = e.side), void 0 !== e.opacity && (t.opacity = e.opacity), void 0 !== e.transparent && (t.transparent = e.transparent), void 0 !== e.wireframe && (t.wireframe = e.wireframe), void 0 !== e.size && (t.size = e.size), void 0 !== e.sizeAttenuation && (t.sizeAttenuation = e.sizeAttenuation), void 0 !== e.materials)
                        for (var i = 0, r = e.materials.length; r > i; i++) t.materials.push(this.parse(e.materials[i])); return t } }, n.ObjectLoader = function(e) { this.manager = void 0 !== e ? e : n.DefaultLoadingManager, this.texturePath = "" }, n.ObjectLoader.prototype = { constructor: n.ObjectLoader, load: function(e, t, i, r) { "" === this.texturePath && (this.texturePath = e.substring(0, e.lastIndexOf("/") + 1)); var o = this,
                        a = new n.XHRLoader(o.manager);
                    a.setCrossOrigin(this.crossOrigin), a.load(e, function(e) { o.parse(JSON.parse(e), t) }, i, r) }, setTexturePath: function(e) { this.texturePath = e }, setCrossOrigin: function(e) { this.crossOrigin = e }, parse: function(e, t) { var i = this.parseGeometries(e.geometries),
                        r = this.parseImages(e.images, function() { void 0 !== t && t(a) }),
                        n = this.parseTextures(e.textures, r),
                        o = this.parseMaterials(e.materials, n),
                        a = this.parseObject(e.object, i, o); return (void 0 === e.images || 0 === e.images.length) && void 0 !== t && t(a), a }, parseGeometries: function(e) { var t = {}; if (void 0 !== e)
                        for (var i = new n.JSONLoader, r = new n.BufferGeometryLoader, o = 0, a = e.length; a > o; o++) { var s, h = e[o]; switch (h.type) {
                                case "PlaneGeometry":
                                case "PlaneBufferGeometry":
                                    s = new n[h.type](h.width, h.height, h.widthSegments, h.heightSegments); break;
                                case "BoxGeometry":
                                case "CubeGeometry":
                                    s = new n.BoxGeometry(h.width, h.height, h.depth, h.widthSegments, h.heightSegments, h.depthSegments); break;
                                case "CircleGeometry":
                                    s = new n.CircleGeometry(h.radius, h.segments); break;
                                case "CylinderGeometry":
                                    s = new n.CylinderGeometry(h.radiusTop, h.radiusBottom, h.height, h.radialSegments, h.heightSegments, h.openEnded); break;
                                case "SphereGeometry":
                                    s = new n.SphereGeometry(h.radius, h.widthSegments, h.heightSegments, h.phiStart, h.phiLength, h.thetaStart, h.thetaLength); break;
                                case "IcosahedronGeometry":
                                    s = new n.IcosahedronGeometry(h.radius, h.detail); break;
                                case "TorusGeometry":
                                    s = new n.TorusGeometry(h.radius, h.tube, h.radialSegments, h.tubularSegments, h.arc); break;
                                case "TorusKnotGeometry":
                                    s = new n.TorusKnotGeometry(h.radius, h.tube, h.radialSegments, h.tubularSegments, h.p, h.q, h.heightScale); break;
                                case "BufferGeometry":
                                    s = r.parse(h); break;
                                case "Geometry":
                                    s = i.parse(h.data).geometry } s.uuid = h.uuid, void 0 !== h.name && (s.name = h.name), t[h.uuid] = s }
                    return t }, parseMaterials: function(e, t) { var i = {}; if (void 0 !== e)
                        for (var r = function(e) { return void 0 === t[e] && n.warn("THREE.ObjectLoader: Undefined texture", e), t[e] }, o = new n.MaterialLoader, a = 0, s = e.length; s > a; a++) { var h = e[a],
                                l = o.parse(h);
                            l.uuid = h.uuid, void 0 !== h.name && (l.name = h.name), void 0 !== h.map && (l.map = r(h.map)), void 0 !== h.bumpMap && (l.bumpMap = r(h.bumpMap), h.bumpScale && (l.bumpScale = new n.Vector2(h.bumpScale, h.bumpScale))), void 0 !== h.alphaMap && (l.alphaMap = r(h.alphaMap)), void 0 !== h.envMap && (l.envMap = r(h.envMap)), void 0 !== h.normalMap && (l.normalMap = r(h.normalMap), h.normalScale && (l.normalScale = new n.Vector2(h.normalScale, h.normalScale))), void 0 !== h.lightMap && (l.lightMap = r(h.lightMap)), void 0 !== h.specularMap && (l.specularMap = r(h.specularMap)), i[h.uuid] = l }
                    return i }, parseImages: function(e, t) { var i = this,
                        r = {}; if (void 0 !== e && e.length > 0) { var o = new n.LoadingManager(t),
                            a = new n.ImageLoader(o);
                        a.setCrossOrigin(this.crossOrigin); for (var s = function(e) { return i.manager.itemStart(e), a.load(e, function() { i.manager.itemEnd(e) }) }, h = 0, l = e.length; l > h; h++) { var c = e[h],
                                u = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(c.url) ? c.url : i.texturePath + c.url;
                            r[c.uuid] = s(u) } } return r }, parseTextures: function(e, t) { var i = {}; if (void 0 !== e)
                        for (var r = 0, o = e.length; o > r; r++) { var a = e[r];
                            void 0 === a.image && n.warn('THREE.ObjectLoader: No "image" speficied for', a.uuid), void 0 === t[a.image] && n.warn("THREE.ObjectLoader: Undefined image", a.image); var s = new n.Texture(t[a.image]);
                            s.needsUpdate = !0, s.uuid = a.uuid, void 0 !== a.name && (s.name = a.name), void 0 !== a.repeat && (s.repeat = new n.Vector2(a.repeat[0], a.repeat[1])), void 0 !== a.minFilter && (s.minFilter = n[a.minFilter]), void 0 !== a.magFilter && (s.magFilter = n[a.magFilter]), void 0 !== a.anisotropy && (s.anisotropy = a.anisotropy), a.wrap instanceof Array && (s.wrapS = n[a.wrap[0]], s.wrapT = n[a.wrap[1]]), i[a.uuid] = s }
                    return i }, parseObject: function() { var e = new n.Matrix4; return function(t, i, r) { var o, a = function(e) { return void 0 === i[e] && n.warn("THREE.ObjectLoader: Undefined geometry", e), i[e] },
                            s = function(e) { return void 0 === r[e] && n.warn("THREE.ObjectLoader: Undefined material", e), r[e] }; switch (t.type) {
                            case "Scene":
                                o = new n.Scene; break;
                            case "PerspectiveCamera":
                                o = new n.PerspectiveCamera(t.fov, t.aspect, t.near, t.far); break;
                            case "OrthographicCamera":
                                o = new n.OrthographicCamera(t.left, t.right, t.top, t.bottom, t.near, t.far); break;
                            case "AmbientLight":
                                o = new n.AmbientLight(t.color); break;
                            case "DirectionalLight":
                                o = new n.DirectionalLight(t.color, t.intensity); break;
                            case "PointLight":
                                o = new n.PointLight(t.color, t.intensity, t.distance, t.decay); break;
                            case "SpotLight":
                                o = new n.SpotLight(t.color, t.intensity, t.distance, t.angle, t.exponent, t.decay); break;
                            case "HemisphereLight":
                                o = new n.HemisphereLight(t.color, t.groundColor, t.intensity); break;
                            case "Mesh":
                                o = new n.Mesh(a(t.geometry), s(t.material)); break;
                            case "Line":
                                o = new n.Line(a(t.geometry), s(t.material), t.mode); break;
                            case "PointCloud":
                                o = new n.PointCloud(a(t.geometry), s(t.material)); break;
                            case "Sprite":
                                o = new n.Sprite(s(t.material)); break;
                            case "Group":
                                o = new n.Group; break;
                            default:
                                o = new n.Object3D } if (o.uuid = t.uuid, void 0 !== t.name && (o.name = t.name), void 0 !== t.matrix ? (e.fromArray(t.matrix), e.decompose(o.position, o.quaternion, o.scale)) : (void 0 !== t.position && o.position.fromArray(t.position), void 0 !== t.rotation && o.rotation.fromArray(t.rotation), void 0 !== t.scale && o.scale.fromArray(t.scale)), void 0 !== t.visible && (o.visible = t.visible), void 0 !== t.userData && (o.userData = t.userData), void 0 !== t.children)
                            for (var h in t.children) o.add(this.parseObject(t.children[h], i, r)); return o } }() }, n.TextureLoader = function(e) { this.manager = void 0 !== e ? e : n.DefaultLoadingManager }, n.TextureLoader.prototype = { constructor: n.TextureLoader, load: function(e, t, i, r) { var o = this,
                        a = new n.ImageLoader(o.manager);
                    a.setCrossOrigin(this.crossOrigin), a.load(e, function(e) { var i = new n.Texture(e);
                        i.needsUpdate = !0, void 0 !== t && t(i) }, i, r) }, setCrossOrigin: function(e) { this.crossOrigin = e } }, n.DataTextureLoader = n.BinaryTextureLoader = function() { this._parser = null }, n.BinaryTextureLoader.prototype = { constructor: n.BinaryTextureLoader, load: function(e, t, i, r) { var o = this,
                        a = new n.DataTexture,
                        s = new n.XHRLoader; return s.setResponseType("arraybuffer"), s.load(e, function(e) { var i = o._parser(e);
                        i && (void 0 !== i.image ? a.image = i.image : void 0 !== i.data && (a.image.width = i.width, a.image.height = i.height, a.image.data = i.data), a.wrapS = void 0 !== i.wrapS ? i.wrapS : n.ClampToEdgeWrapping, a.wrapT = void 0 !== i.wrapT ? i.wrapT : n.ClampToEdgeWrapping, a.magFilter = void 0 !== i.magFilter ? i.magFilter : n.LinearFilter, a.minFilter = void 0 !== i.minFilter ? i.minFilter : n.LinearMipMapLinearFilter, a.anisotropy = void 0 !== i.anisotropy ? i.anisotropy : 1, void 0 !== i.format && (a.format = i.format), void 0 !== i.type && (a.type = i.type), void 0 !== i.mipmaps && (a.mipmaps = i.mipmaps), 1 === i.mipmapCount && (a.minFilter = n.LinearFilter), a.needsUpdate = !0, t && t(a, i)) }, i, r), a } }, n.CompressedTextureLoader = function() { this._parser = null }, n.CompressedTextureLoader.prototype = { constructor: n.CompressedTextureLoader, load: function(e, t, i) { var r = this,
                        o = [],
                        a = new n.CompressedTexture;
                    a.image = o; var s = new n.XHRLoader; if (s.setResponseType("arraybuffer"), e instanceof Array)
                        for (var h = 0, l = function(i) { s.load(e[i], function(e) { var s = r._parser(e, !0);
                                    o[i] = { width: s.width, height: s.height, format: s.format, mipmaps: s.mipmaps }, h += 1, 6 === h && (1 == s.mipmapCount && (a.minFilter = n.LinearFilter), a.format = s.format, a.needsUpdate = !0, t && t(a)) }) }, c = 0, u = e.length; u > c; ++c) l(c);
                    else s.load(e, function(e) { var i = r._parser(e, !0); if (i.isCubemap)
                            for (var s = i.mipmaps.length / i.mipmapCount, h = 0; s > h; h++) { o[h] = { mipmaps: [] }; for (var l = 0; l < i.mipmapCount; l++) o[h].mipmaps.push(i.mipmaps[h * i.mipmapCount + l]), o[h].format = i.format, o[h].width = i.width, o[h].height = i.height } else a.image.width = i.width, a.image.height = i.height, a.mipmaps = i.mipmaps;
                        1 === i.mipmapCount && (a.minFilter = n.LinearFilter), a.format = i.format, a.needsUpdate = !0, t && t(a) }); return a } }, n.Material = function() { Object.defineProperty(this, "id", { value: n.MaterialIdCount++ }), this.uuid = n.Math.generateUUID(), this.name = "", this.type = "Material", this.side = n.FrontSide, this.opacity = 1, this.transparent = !1, this.blending = n.NormalBlending, this.blendSrc = n.SrcAlphaFactor, this.blendDst = n.OneMinusSrcAlphaFactor, this.blendEquation = n.AddEquation, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.depthTest = !0, this.depthWrite = !0, this.colorWrite = !0, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.alphaTest = 0, this.overdraw = 0, this.visible = !0, this._needsUpdate = !0 }, n.Material.prototype = { constructor: n.Material, get needsUpdate() { return this._needsUpdate }, set needsUpdate(e) { e === !0 && this.update(), this._needsUpdate = e }, setValues: function(e) { if (void 0 !== e)
                        for (var t in e) { var i = e[t]; if (void 0 !== i) { if (t in this) { var r = this[t];
                                    r instanceof n.Color ? r.set(i) : r instanceof n.Vector3 && i instanceof n.Vector3 ? r.copy(i) : "overdraw" == t ? this[t] = Number(i) : this[t] = i } } else n.warn("THREE.Material: '" + t + "' parameter is undefined.") } }, toJSON: function() { var e = { metadata: { version: 4.2, type: "material", generator: "MaterialExporter" }, uuid: this.uuid, type: this.type }; return "" !== this.name && (e.name = this.name), this instanceof n.MeshBasicMaterial ? (e.color = this.color.getHex(), this.vertexColors !== n.NoColors && (e.vertexColors = this.vertexColors), this.blending !== n.NormalBlending && (e.blending = this.blending), this.side !== n.FrontSide && (e.side = this.side)) : this instanceof n.MeshLambertMaterial ? (e.color = this.color.getHex(), e.emissive = this.emissive.getHex(), this.vertexColors !== n.NoColors && (e.vertexColors = this.vertexColors), this.shading !== n.SmoothShading && (e.shading = this.shading), this.blending !== n.NormalBlending && (e.blending = this.blending), this.side !== n.FrontSide && (e.side = this.side)) : this instanceof n.MeshPhongMaterial ? (e.color = this.color.getHex(), e.emissive = this.emissive.getHex(), e.specular = this.specular.getHex(), e.shininess = this.shininess, this.vertexColors !== n.NoColors && (e.vertexColors = this.vertexColors), this.shading !== n.SmoothShading && (e.shading = this.shading), this.blending !== n.NormalBlending && (e.blending = this.blending), this.side !== n.FrontSide && (e.side = this.side)) : this instanceof n.MeshNormalMaterial ? (this.blending !== n.NormalBlending && (e.blending = this.blending), this.side !== n.FrontSide && (e.side = this.side)) : this instanceof n.MeshDepthMaterial ? (this.blending !== n.NormalBlending && (e.blending = this.blending), this.side !== n.FrontSide && (e.side = this.side)) : this instanceof n.PointCloudMaterial ? (e.size = this.size, e.sizeAttenuation = this.sizeAttenuation, e.color = this.color.getHex(), this.vertexColors !== n.NoColors && (e.vertexColors = this.vertexColors), this.blending !== n.NormalBlending && (e.blending = this.blending)) : this instanceof n.ShaderMaterial ? (e.uniforms = this.uniforms, e.vertexShader = this.vertexShader, e.fragmentShader = this.fragmentShader) : this instanceof n.SpriteMaterial && (e.color = this.color.getHex()), this.opacity < 1 && (e.opacity = this.opacity), this.transparent !== !1 && (e.transparent = this.transparent), this.wireframe !== !1 && (e.wireframe = this.wireframe), e }, clone: function(e) { return void 0 === e && (e = new n.Material), e.name = this.name, e.side = this.side, e.opacity = this.opacity, e.transparent = this.transparent, e.blending = this.blending, e.blendSrc = this.blendSrc, e.blendDst = this.blendDst, e.blendEquation = this.blendEquation, e.blendSrcAlpha = this.blendSrcAlpha, e.blendDstAlpha = this.blendDstAlpha, e.blendEquationAlpha = this.blendEquationAlpha, e.depthTest = this.depthTest, e.depthWrite = this.depthWrite, e.polygonOffset = this.polygonOffset, e.polygonOffsetFactor = this.polygonOffsetFactor, e.polygonOffsetUnits = this.polygonOffsetUnits, e.alphaTest = this.alphaTest, e.overdraw = this.overdraw, e.visible = this.visible, e }, update: function() { this.dispatchEvent({ type: "update" }) }, dispose: function() { this.dispatchEvent({ type: "dispose" }) } }, n.EventDispatcher.prototype.apply(n.Material.prototype), n.MaterialIdCount = 0, n.LineBasicMaterial = function(e) { n.Material.call(this), this.type = "LineBasicMaterial", this.color = new n.Color(16777215), this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.vertexColors = n.NoColors, this.fog = !0, this.setValues(e) }, n.LineBasicMaterial.prototype = Object.create(n.Material.prototype), n.LineBasicMaterial.prototype.constructor = n.LineBasicMaterial, n.LineBasicMaterial.prototype.clone = function() { var e = new n.LineBasicMaterial; return n.Material.prototype.clone.call(this, e), e.color.copy(this.color), e.linewidth = this.linewidth, e.linecap = this.linecap, e.linejoin = this.linejoin, e.vertexColors = this.vertexColors, e.fog = this.fog, e }, n.LineDashedMaterial = function(e) { n.Material.call(this), this.type = "LineDashedMaterial", this.color = new n.Color(16777215), this.linewidth = 1, this.scale = 1, this.dashSize = 3, this.gapSize = 1, this.vertexColors = !1, this.fog = !0, this.setValues(e) }, n.LineDashedMaterial.prototype = Object.create(n.Material.prototype), n.LineDashedMaterial.prototype.constructor = n.LineDashedMaterial, n.LineDashedMaterial.prototype.clone = function() { var e = new n.LineDashedMaterial; return n.Material.prototype.clone.call(this, e), e.color.copy(this.color), e.linewidth = this.linewidth, e.scale = this.scale, e.dashSize = this.dashSize, e.gapSize = this.gapSize, e.vertexColors = this.vertexColors, e.fog = this.fog, e }, n.MeshBasicMaterial = function(e) { n.Material.call(this), this.type = "MeshBasicMaterial", this.color = new n.Color(16777215), this.map = null, this.lightMap = null, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.combine = n.MultiplyOperation, this.reflectivity = 1, this.refractionRatio = .98, this.fog = !0, this.shading = n.SmoothShading, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.vertexColors = n.NoColors, this.skinning = !1, this.morphTargets = !1, this.setValues(e) }, n.MeshBasicMaterial.prototype = Object.create(n.Material.prototype), n.MeshBasicMaterial.prototype.constructor = n.MeshBasicMaterial, n.MeshBasicMaterial.prototype.clone = function() { var e = new n.MeshBasicMaterial; return n.Material.prototype.clone.call(this, e), e.color.copy(this.color), e.map = this.map, e.lightMap = this.lightMap, e.specularMap = this.specularMap, e.alphaMap = this.alphaMap, e.envMap = this.envMap, e.combine = this.combine, e.reflectivity = this.reflectivity, e.refractionRatio = this.refractionRatio, e.fog = this.fog, e.shading = this.shading, e.wireframe = this.wireframe, e.wireframeLinewidth = this.wireframeLinewidth, e.wireframeLinecap = this.wireframeLinecap, e.wireframeLinejoin = this.wireframeLinejoin, e.vertexColors = this.vertexColors, e.skinning = this.skinning, e.morphTargets = this.morphTargets, e }, n.MeshLambertMaterial = function(e) { n.Material.call(this), this.type = "MeshLambertMaterial", this.color = new n.Color(16777215), this.emissive = new n.Color(0), this.wrapAround = !1, this.wrapRGB = new n.Vector3(1, 1, 1), this.map = null, this.lightMap = null, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.combine = n.MultiplyOperation, this.reflectivity = 1, this.refractionRatio = .98, this.fog = !0, this.shading = n.SmoothShading, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.vertexColors = n.NoColors, this.skinning = !1, this.morphTargets = !1, this.morphNormals = !1, this.setValues(e) }, n.MeshLambertMaterial.prototype = Object.create(n.Material.prototype), n.MeshLambertMaterial.prototype.constructor = n.MeshLambertMaterial, n.MeshLambertMaterial.prototype.clone = function() { var e = new n.MeshLambertMaterial; return n.Material.prototype.clone.call(this, e), e.color.copy(this.color), e.emissive.copy(this.emissive), e.wrapAround = this.wrapAround, e.wrapRGB.copy(this.wrapRGB), e.map = this.map, e.lightMap = this.lightMap, e.specularMap = this.specularMap, e.alphaMap = this.alphaMap, e.envMap = this.envMap, e.combine = this.combine, e.reflectivity = this.reflectivity, e.refractionRatio = this.refractionRatio, e.fog = this.fog, e.shading = this.shading, e.wireframe = this.wireframe, e.wireframeLinewidth = this.wireframeLinewidth, e.wireframeLinecap = this.wireframeLinecap, e.wireframeLinejoin = this.wireframeLinejoin, e.vertexColors = this.vertexColors, e.skinning = this.skinning, e.morphTargets = this.morphTargets, e.morphNormals = this.morphNormals, e }, n.MeshPhongMaterial = function(e) { n.Material.call(this), this.type = "MeshPhongMaterial", this.color = new n.Color(16777215), this.emissive = new n.Color(0), this.specular = new n.Color(1118481), this.shininess = 30, this.metal = !1, this.wrapAround = !1, this.wrapRGB = new n.Vector3(1, 1, 1), this.map = null, this.lightMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalScale = new n.Vector2(1, 1), this.specularMap = null, this.alphaMap = null, this.envMap = null, this.combine = n.MultiplyOperation, this.reflectivity = 1, this.refractionRatio = .98, this.fog = !0, this.shading = n.SmoothShading, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.vertexColors = n.NoColors, this.skinning = !1, this.morphTargets = !1, this.morphNormals = !1, this.setValues(e) }, n.MeshPhongMaterial.prototype = Object.create(n.Material.prototype), n.MeshPhongMaterial.prototype.constructor = n.MeshPhongMaterial, n.MeshPhongMaterial.prototype.clone = function() { var e = new n.MeshPhongMaterial; return n.Material.prototype.clone.call(this, e), e.color.copy(this.color), e.emissive.copy(this.emissive), e.specular.copy(this.specular), e.shininess = this.shininess, e.metal = this.metal, e.wrapAround = this.wrapAround, e.wrapRGB.copy(this.wrapRGB), e.map = this.map, e.lightMap = this.lightMap, e.bumpMap = this.bumpMap, e.bumpScale = this.bumpScale, e.normalMap = this.normalMap, e.normalScale.copy(this.normalScale), e.specularMap = this.specularMap, e.alphaMap = this.alphaMap, e.envMap = this.envMap, e.combine = this.combine, e.reflectivity = this.reflectivity, e.refractionRatio = this.refractionRatio, e.fog = this.fog, e.shading = this.shading, e.wireframe = this.wireframe, e.wireframeLinewidth = this.wireframeLinewidth, e.wireframeLinecap = this.wireframeLinecap, e.wireframeLinejoin = this.wireframeLinejoin, e.vertexColors = this.vertexColors, e.skinning = this.skinning, e.morphTargets = this.morphTargets, e.morphNormals = this.morphNormals, e }, n.MeshDepthMaterial = function(e) { n.Material.call(this), this.type = "MeshDepthMaterial", this.morphTargets = !1, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(e) }, n.MeshDepthMaterial.prototype = Object.create(n.Material.prototype), n.MeshDepthMaterial.prototype.constructor = n.MeshDepthMaterial, n.MeshDepthMaterial.prototype.clone = function() { var e = new n.MeshDepthMaterial; return n.Material.prototype.clone.call(this, e), e.wireframe = this.wireframe, e.wireframeLinewidth = this.wireframeLinewidth, e }, n.MeshNormalMaterial = function(e) { n.Material.call(this, e), this.type = "MeshNormalMaterial", this.wireframe = !1, this.wireframeLinewidth = 1, this.morphTargets = !1, this.setValues(e) }, n.MeshNormalMaterial.prototype = Object.create(n.Material.prototype), n.MeshNormalMaterial.prototype.constructor = n.MeshNormalMaterial, n.MeshNormalMaterial.prototype.clone = function() { var e = new n.MeshNormalMaterial; return n.Material.prototype.clone.call(this, e), e.wireframe = this.wireframe, e.wireframeLinewidth = this.wireframeLinewidth, e }, n.MeshFaceMaterial = function(e) { this.uuid = n.Math.generateUUID(), this.type = "MeshFaceMaterial", this.materials = e instanceof Array ? e : [] }, n.MeshFaceMaterial.prototype = { constructor: n.MeshFaceMaterial, toJSON: function() { for (var e = { metadata: { version: 4.2, type: "material", generator: "MaterialExporter" }, uuid: this.uuid, type: this.type, materials: [] }, t = 0, i = this.materials.length; i > t; t++) e.materials.push(this.materials[t].toJSON()); return e }, clone: function() { for (var e = new n.MeshFaceMaterial, t = 0; t < this.materials.length; t++) e.materials.push(this.materials[t].clone()); return e } }, n.PointCloudMaterial = function(e) { n.Material.call(this), this.type = "PointCloudMaterial", this.color = new n.Color(16777215), this.map = null, this.size = 1, this.sizeAttenuation = !0, this.vertexColors = n.NoColors, this.fog = !0, this.setValues(e) }, n.PointCloudMaterial.prototype = Object.create(n.Material.prototype), n.PointCloudMaterial.prototype.constructor = n.PointCloudMaterial, n.PointCloudMaterial.prototype.clone = function() { var e = new n.PointCloudMaterial; return n.Material.prototype.clone.call(this, e), e.color.copy(this.color), e.map = this.map, e.size = this.size, e.sizeAttenuation = this.sizeAttenuation, e.vertexColors = this.vertexColors, e.fog = this.fog, e }, n.ParticleBasicMaterial = function(e) { return n.warn("THREE.ParticleBasicMaterial has been renamed to THREE.PointCloudMaterial."), new n.PointCloudMaterial(e) }, n.ParticleSystemMaterial = function(e) { return n.warn("THREE.ParticleSystemMaterial has been renamed to THREE.PointCloudMaterial."), new n.PointCloudMaterial(e) }, n.ShaderMaterial = function(e) { n.Material.call(this), this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.attributes = null, this.vertexShader = "void main() {\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}", this.fragmentShader = "void main() {\n	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}", this.shading = n.SmoothShading, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.vertexColors = n.NoColors, this.skinning = !1, this.morphTargets = !1, this.morphNormals = !1, this.defaultAttributeValues = { color: [1, 1, 1], uv: [0, 0], uv2: [0, 0] }, this.index0AttributeName = void 0, this.setValues(e) }, n.ShaderMaterial.prototype = Object.create(n.Material.prototype), n.ShaderMaterial.prototype.constructor = n.ShaderMaterial, n.ShaderMaterial.prototype.clone = function() { var e = new n.ShaderMaterial; return n.Material.prototype.clone.call(this, e), e.fragmentShader = this.fragmentShader, e.vertexShader = this.vertexShader, e.uniforms = n.UniformsUtils.clone(this.uniforms), e.attributes = this.attributes, e.defines = this.defines, e.shading = this.shading, e.wireframe = this.wireframe, e.wireframeLinewidth = this.wireframeLinewidth, e.fog = this.fog, e.lights = this.lights, e.vertexColors = this.vertexColors, e.skinning = this.skinning, e.morphTargets = this.morphTargets, e.morphNormals = this.morphNormals, e }, n.RawShaderMaterial = function(e) { n.ShaderMaterial.call(this, e), this.type = "RawShaderMaterial" }, n.RawShaderMaterial.prototype = Object.create(n.ShaderMaterial.prototype), n.RawShaderMaterial.prototype.constructor = n.RawShaderMaterial, n.RawShaderMaterial.prototype.clone = function() { var e = new n.RawShaderMaterial; return n.ShaderMaterial.prototype.clone.call(this, e), e }, n.SpriteMaterial = function(e) { n.Material.call(this), this.type = "SpriteMaterial", this.color = new n.Color(16777215), this.map = null, this.rotation = 0, this.fog = !1, this.setValues(e) }, n.SpriteMaterial.prototype = Object.create(n.Material.prototype), n.SpriteMaterial.prototype.constructor = n.SpriteMaterial, n.SpriteMaterial.prototype.clone = function() { var e = new n.SpriteMaterial; return n.Material.prototype.clone.call(this, e), e.color.copy(this.color), e.map = this.map, e.rotation = this.rotation, e.fog = this.fog, e }, n.Texture = function(e, t, i, r, o, a, s, h, l) { Object.defineProperty(this, "id", { value: n.TextureIdCount++ }), this.uuid = n.Math.generateUUID(), this.name = "", this.sourceFile = "", this.image = void 0 !== e ? e : n.Texture.DEFAULT_IMAGE, this.mipmaps = [], this.mapping = void 0 !== t ? t : n.Texture.DEFAULT_MAPPING, this.wrapS = void 0 !== i ? i : n.ClampToEdgeWrapping, this.wrapT = void 0 !== r ? r : n.ClampToEdgeWrapping, this.magFilter = void 0 !== o ? o : n.LinearFilter, this.minFilter = void 0 !== a ? a : n.LinearMipMapLinearFilter, this.anisotropy = void 0 !== l ? l : 1, this.format = void 0 !== s ? s : n.RGBAFormat, this.type = void 0 !== h ? h : n.UnsignedByteType, this.offset = new n.Vector2(0, 0), this.repeat = new n.Vector2(1, 1), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this._needsUpdate = !1, this.onUpdate = null }, n.Texture.DEFAULT_IMAGE = void 0, n.Texture.DEFAULT_MAPPING = n.UVMapping, n.Texture.prototype = { constructor: n.Texture, get needsUpdate() { return this._needsUpdate }, set needsUpdate(e) { e === !0 && this.update(), this._needsUpdate = e }, clone: function(e) { return void 0 === e && (e = new n.Texture), e.image = this.image, e.mipmaps = this.mipmaps.slice(0), e.mapping = this.mapping, e.wrapS = this.wrapS, e.wrapT = this.wrapT, e.magFilter = this.magFilter, e.minFilter = this.minFilter, e.anisotropy = this.anisotropy, e.format = this.format, e.type = this.type, e.offset.copy(this.offset), e.repeat.copy(this.repeat), e.generateMipmaps = this.generateMipmaps, e.premultiplyAlpha = this.premultiplyAlpha, e.flipY = this.flipY, e.unpackAlignment = this.unpackAlignment, e }, update: function() { this.dispatchEvent({ type: "update" }) }, dispose: function() { this.dispatchEvent({ type: "dispose" }) } }, n.EventDispatcher.prototype.apply(n.Texture.prototype), n.TextureIdCount = 0, n.CubeTexture = function(e, t, i, r, o, a, s, h, l) { t = void 0 !== t ? t : n.CubeReflectionMapping, n.Texture.call(this, e, t, i, r, o, a, s, h, l), this.images = e }, n.CubeTexture.prototype = Object.create(n.Texture.prototype), n.CubeTexture.prototype.constructor = n.CubeTexture, n.CubeTexture.clone = function(e) { return void 0 === e && (e = new n.CubeTexture), n.Texture.prototype.clone.call(this, e), e.images = this.images, e }, n.CompressedTexture = function(e, t, i, r, o, a, s, h, l, c, u) { n.Texture.call(this, null, a, s, h, l, c, r, o, u), this.image = { width: t, height: i }, this.mipmaps = e, this.flipY = !1, this.generateMipmaps = !1 }, n.CompressedTexture.prototype = Object.create(n.Texture.prototype), n.CompressedTexture.prototype.constructor = n.CompressedTexture, n.CompressedTexture.prototype.clone = function() { var e = new n.CompressedTexture; return n.Texture.prototype.clone.call(this, e), e }, n.DataTexture = function(e, t, i, r, o, a, s, h, l, c, u) { n.Texture.call(this, null, a, s, h, l, c, r, o, u), this.image = { data: e, width: t, height: i } }, n.DataTexture.prototype = Object.create(n.Texture.prototype), n.DataTexture.prototype.constructor = n.DataTexture, n.DataTexture.prototype.clone = function() { var e = new n.DataTexture; return n.Texture.prototype.clone.call(this, e), e }, n.VideoTexture = function(e, t, i, r, o, a, s, h, l) { n.Texture.call(this, e, t, i, r, o, a, s, h, l), this.generateMipmaps = !1; var c = this,
                    u = function() { requestAnimationFrame(u), e.readyState === e.HAVE_ENOUGH_DATA && (c.needsUpdate = !0) };
                u() }, n.VideoTexture.prototype = Object.create(n.Texture.prototype), n.VideoTexture.prototype.constructor = n.VideoTexture, n.Group = function() { n.Object3D.call(this), this.type = "Group" }, n.Group.prototype = Object.create(n.Object3D.prototype), n.Group.prototype.constructor = n.Group, n.PointCloud = function(e, t) { n.Object3D.call(this), this.type = "PointCloud", this.geometry = void 0 !== e ? e : new n.Geometry, this.material = void 0 !== t ? t : new n.PointCloudMaterial({ color: 16777215 * Math.random() }) }, n.PointCloud.prototype = Object.create(n.Object3D.prototype), n.PointCloud.prototype.constructor = n.PointCloud, n.PointCloud.prototype.raycast = function() { var e = new n.Matrix4,
                    t = new n.Ray; return function(i, r) { var o = this,
                        a = o.geometry,
                        s = i.params.PointCloud.threshold; if (e.getInverse(this.matrixWorld), t.copy(i.ray).applyMatrix4(e), null === a.boundingBox || t.isIntersectionBox(a.boundingBox) !== !1) { var h = s / ((this.scale.x + this.scale.y + this.scale.z) / 3),
                            l = new n.Vector3,
                            c = function(e, n) { var a = t.distanceToPoint(e); if (h > a) { var s = t.closestPointToPoint(e);
                                    s.applyMatrix4(o.matrixWorld); var l = i.ray.origin.distanceTo(s);
                                    r.push({ distance: l, distanceToRay: a, point: s.clone(), index: n, face: null, object: o }) } }; if (a instanceof n.BufferGeometry) { var u = a.attributes,
                                d = u.position.array; if (void 0 !== u.index) { var p = u.index.array,
                                    f = a.offsets; if (0 === f.length) { var m = { start: 0, count: p.length, index: 0 };
                                    f = [m] } for (var g = 0, v = f.length; v > g; ++g)
                                    for (var y = f[g].start, _ = f[g].count, x = f[g].index, b = y, w = y + _; w > b; b++) { var T = x + p[b];
                                        l.fromArray(d, 3 * T), c(l, T) } } else
                                for (var M = d.length / 3, b = 0; M > b; b++) l.set(d[3 * b], d[3 * b + 1], d[3 * b + 2]), c(l, b) } else
                            for (var S = this.geometry.vertices, b = 0; b < S.length; b++) c(S[b], b) } } }(), n.PointCloud.prototype.clone = function(e) { return void 0 === e && (e = new n.PointCloud(this.geometry, this.material)), n.Object3D.prototype.clone.call(this, e), e }, n.ParticleSystem = function(e, t) { return n.warn("THREE.ParticleSystem has been renamed to THREE.PointCloud."), new n.PointCloud(e, t) }, n.Line = function(e, t, i) { n.Object3D.call(this), this.type = "Line", this.geometry = void 0 !== e ? e : new n.Geometry, this.material = void 0 !== t ? t : new n.LineBasicMaterial({ color: 16777215 * Math.random() }), this.mode = void 0 !== i ? i : n.LineStrip }, n.LineStrip = 0, n.LinePieces = 1, n.Line.prototype = Object.create(n.Object3D.prototype), n.Line.prototype.constructor = n.Line, n.Line.prototype.raycast = function() {
                var e = new n.Matrix4,
                    t = new n.Ray,
                    i = new n.Sphere;
                return function(r, o) {
                    var a = r.linePrecision,
                        s = a * a,
                        h = this.geometry;
                    if (null === h.boundingSphere && h.computeBoundingSphere(), i.copy(h.boundingSphere),
                        i.applyMatrix4(this.matrixWorld), r.ray.isIntersectionSphere(i) !== !1) { e.getInverse(this.matrixWorld), t.copy(r.ray).applyMatrix4(e); var l = new n.Vector3,
                            c = new n.Vector3,
                            u = new n.Vector3,
                            d = new n.Vector3,
                            p = this.mode === n.LineStrip ? 1 : 2; if (h instanceof n.BufferGeometry) { var f = h.attributes; if (void 0 !== f.index) { var m = f.index.array,
                                    g = f.position.array,
                                    v = h.offsets;
                                0 === v.length && (v = [{ start: 0, count: m.length, index: 0 }]); for (var y = 0; y < v.length; y++)
                                    for (var _ = v[y].start, x = v[y].count, b = v[y].index, w = _; _ + x - 1 > w; w += p) { var T = b + m[w],
                                            M = b + m[w + 1];
                                        l.fromArray(g, 3 * T), c.fromArray(g, 3 * M); var S = t.distanceSqToSegment(l, c, d, u); if (!(S > s)) { var C = t.origin.distanceTo(d);
                                            C < r.near || C > r.far || o.push({ distance: C, point: u.clone().applyMatrix4(this.matrixWorld), index: w, offsetIndex: y, face: null, faceIndex: null, object: this }) } } } else
                                for (var g = f.position.array, w = 0; w < g.length / 3 - 1; w += p) { l.fromArray(g, 3 * w), c.fromArray(g, 3 * w + 3); var S = t.distanceSqToSegment(l, c, d, u); if (!(S > s)) { var C = t.origin.distanceTo(d);
                                        C < r.near || C > r.far || o.push({ distance: C, point: u.clone().applyMatrix4(this.matrixWorld), index: w, face: null, faceIndex: null, object: this }) } } } else if (h instanceof n.Geometry)
                            for (var A = h.vertices, E = A.length, w = 0; E - 1 > w; w += p) { var S = t.distanceSqToSegment(A[w], A[w + 1], d, u); if (!(S > s)) { var C = t.origin.distanceTo(d);
                                    C < r.near || C > r.far || o.push({ distance: C, point: u.clone().applyMatrix4(this.matrixWorld), index: w, face: null, faceIndex: null, object: this }) } } }
                }
            }(), n.Line.prototype.clone = function(e) { return void 0 === e && (e = new n.Line(this.geometry, this.material, this.mode)), n.Object3D.prototype.clone.call(this, e), e }, n.Mesh = function(e, t) { n.Object3D.call(this), this.type = "Mesh", this.geometry = void 0 !== e ? e : new n.Geometry, this.material = void 0 !== t ? t : new n.MeshBasicMaterial({ color: 16777215 * Math.random() }), this.updateMorphTargets() }, n.Mesh.prototype = Object.create(n.Object3D.prototype), n.Mesh.prototype.constructor = n.Mesh, n.Mesh.prototype.updateMorphTargets = function() { if (void 0 !== this.geometry.morphTargets && this.geometry.morphTargets.length > 0) { this.morphTargetBase = -1, this.morphTargetForcedOrder = [], this.morphTargetInfluences = [], this.morphTargetDictionary = {}; for (var e = 0, t = this.geometry.morphTargets.length; t > e; e++) this.morphTargetInfluences.push(0), this.morphTargetDictionary[this.geometry.morphTargets[e].name] = e } }, n.Mesh.prototype.getMorphTargetIndexByName = function(e) { return void 0 !== this.morphTargetDictionary[e] ? this.morphTargetDictionary[e] : (n.warn("THREE.Mesh.getMorphTargetIndexByName: morph target " + e + " does not exist. Returning 0."), 0) }, n.Mesh.prototype.raycast = function() { var e = new n.Matrix4,
                    t = new n.Ray,
                    i = new n.Sphere,
                    r = new n.Vector3,
                    o = new n.Vector3,
                    a = new n.Vector3; return function(s, h) { var l = this.geometry; if (null === l.boundingSphere && l.computeBoundingSphere(), i.copy(l.boundingSphere), i.applyMatrix4(this.matrixWorld), s.ray.isIntersectionSphere(i) !== !1 && (e.getInverse(this.matrixWorld), t.copy(s.ray).applyMatrix4(e), null === l.boundingBox || t.isIntersectionBox(l.boundingBox) !== !1))
                        if (l instanceof n.BufferGeometry) { var c = this.material; if (void 0 === c) return; var u, d, p, f = l.attributes,
                                m = s.precision; if (void 0 !== f.index) { var g = f.index.array,
                                    v = f.position.array,
                                    y = l.offsets;
                                0 === y.length && (y = [{ start: 0, count: g.length, index: 0 }]); for (var _ = 0, x = y.length; x > _; ++_)
                                    for (var b = y[_].start, w = y[_].count, T = y[_].index, M = b, S = b + w; S > M; M += 3) { if (u = T + g[M], d = T + g[M + 1], p = T + g[M + 2], r.fromArray(v, 3 * u), o.fromArray(v, 3 * d), a.fromArray(v, 3 * p), c.side === n.BackSide) var C = t.intersectTriangle(a, o, r, !0);
                                        else var C = t.intersectTriangle(r, o, a, c.side !== n.DoubleSide); if (null !== C) { C.applyMatrix4(this.matrixWorld); var A = s.ray.origin.distanceTo(C);
                                            m > A || A < s.near || A > s.far || h.push({ distance: A, point: C, face: new n.Face3(u, d, p, n.Triangle.normal(r, o, a)), faceIndex: null, object: this }) } } } else
                                for (var v = f.position.array, M = 0, E = 0, S = v.length; S > M; M += 3, E += 9) { if (u = M, d = M + 1, p = M + 2, r.fromArray(v, E), o.fromArray(v, E + 3), a.fromArray(v, E + 6), c.side === n.BackSide) var C = t.intersectTriangle(a, o, r, !0);
                                    else var C = t.intersectTriangle(r, o, a, c.side !== n.DoubleSide); if (null !== C) { C.applyMatrix4(this.matrixWorld); var A = s.ray.origin.distanceTo(C);
                                        m > A || A < s.near || A > s.far || h.push({ distance: A, point: C, face: new n.Face3(u, d, p, n.Triangle.normal(r, o, a)), faceIndex: null, object: this }) } } } else if (l instanceof n.Geometry)
                        for (var u, d, p, P = this.material instanceof n.MeshFaceMaterial, L = P === !0 ? this.material.materials : null, m = s.precision, R = l.vertices, F = 0, k = l.faces.length; k > F; F++) { var O = l.faces[F],
                                c = P === !0 ? L[O.materialIndex] : this.material; if (void 0 !== c) { if (u = R[O.a], d = R[O.b], p = R[O.c], c.morphTargets === !0) { var D = l.morphTargets,
                                        B = this.morphTargetInfluences;
                                    r.set(0, 0, 0), o.set(0, 0, 0), a.set(0, 0, 0); for (var U = 0, z = D.length; z > U; U++) { var N = B[U]; if (0 !== N) { var V = D[U].vertices;
                                            r.x += (V[O.a].x - u.x) * N, r.y += (V[O.a].y - u.y) * N, r.z += (V[O.a].z - u.z) * N, o.x += (V[O.b].x - d.x) * N, o.y += (V[O.b].y - d.y) * N, o.z += (V[O.b].z - d.z) * N, a.x += (V[O.c].x - p.x) * N, a.y += (V[O.c].y - p.y) * N, a.z += (V[O.c].z - p.z) * N } } r.add(u), o.add(d), a.add(p), u = r, d = o, p = a } if (c.side === n.BackSide) var C = t.intersectTriangle(p, d, u, !0);
                                else var C = t.intersectTriangle(u, d, p, c.side !== n.DoubleSide); if (null !== C) { C.applyMatrix4(this.matrixWorld); var A = s.ray.origin.distanceTo(C);
                                    m > A || A < s.near || A > s.far || h.push({ distance: A, point: C, face: O, faceIndex: F, object: this }) } } } } }(), n.Mesh.prototype.clone = function(e, t) { return void 0 === e && (e = new n.Mesh(this.geometry, this.material)), n.Object3D.prototype.clone.call(this, e, t), e }, n.Bone = function(e) { n.Object3D.call(this), this.type = "Bone", this.skin = e }, n.Bone.prototype = Object.create(n.Object3D.prototype), n.Bone.prototype.constructor = n.Bone, n.Skeleton = function(e, t, i) { if (this.useVertexTexture = void 0 !== i ? i : !0, this.identityMatrix = new n.Matrix4, e = e || [], this.bones = e.slice(0), this.useVertexTexture) { var r;
                    r = this.bones.length > 256 ? 64 : this.bones.length > 64 ? 32 : this.bones.length > 16 ? 16 : 8, this.boneTextureWidth = r, this.boneTextureHeight = r, this.boneMatrices = new Float32Array(this.boneTextureWidth * this.boneTextureHeight * 4), this.boneTexture = new n.DataTexture(this.boneMatrices, this.boneTextureWidth, this.boneTextureHeight, n.RGBAFormat, n.FloatType), this.boneTexture.minFilter = n.NearestFilter, this.boneTexture.magFilter = n.NearestFilter, this.boneTexture.generateMipmaps = !1, this.boneTexture.flipY = !1 } else this.boneMatrices = new Float32Array(16 * this.bones.length); if (void 0 === t) this.calculateInverses();
                else if (this.bones.length === t.length) this.boneInverses = t.slice(0);
                else { n.warn("THREE.Skeleton bonInverses is the wrong length."), this.boneInverses = []; for (var o = 0, a = this.bones.length; a > o; o++) this.boneInverses.push(new n.Matrix4) } }, n.Skeleton.prototype.calculateInverses = function() { this.boneInverses = []; for (var e = 0, t = this.bones.length; t > e; e++) { var i = new n.Matrix4;
                    this.bones[e] && i.getInverse(this.bones[e].matrixWorld), this.boneInverses.push(i) } }, n.Skeleton.prototype.pose = function() { for (var e, t = 0, i = this.bones.length; i > t; t++) e = this.bones[t], e && e.matrixWorld.getInverse(this.boneInverses[t]); for (var t = 0, i = this.bones.length; i > t; t++) e = this.bones[t], e && (e.parent ? (e.matrix.getInverse(e.parent.matrixWorld), e.matrix.multiply(e.matrixWorld)) : e.matrix.copy(e.matrixWorld), e.matrix.decompose(e.position, e.quaternion, e.scale)) }, n.Skeleton.prototype.update = function() { var e = new n.Matrix4; return function() { for (var t = 0, i = this.bones.length; i > t; t++) { var r = this.bones[t] ? this.bones[t].matrixWorld : this.identityMatrix;
                        e.multiplyMatrices(r, this.boneInverses[t]), e.flattenToArrayOffset(this.boneMatrices, 16 * t) } this.useVertexTexture && (this.boneTexture.needsUpdate = !0) } }(), n.SkinnedMesh = function(e, t, i) { n.Mesh.call(this, e, t), this.type = "SkinnedMesh", this.bindMode = "attached", this.bindMatrix = new n.Matrix4, this.bindMatrixInverse = new n.Matrix4; var r = []; if (this.geometry && void 0 !== this.geometry.bones) { for (var o, a, s, h, l, c = 0, u = this.geometry.bones.length; u > c; ++c) a = this.geometry.bones[c], s = a.pos, h = a.rotq, l = a.scl, o = new n.Bone(this), r.push(o), o.name = a.name, o.position.set(s[0], s[1], s[2]), o.quaternion.set(h[0], h[1], h[2], h[3]), void 0 !== l ? o.scale.set(l[0], l[1], l[2]) : o.scale.set(1, 1, 1); for (var c = 0, u = this.geometry.bones.length; u > c; ++c) a = this.geometry.bones[c], -1 !== a.parent ? r[a.parent].add(r[c]) : this.add(r[c]) } this.normalizeSkinWeights(), this.updateMatrixWorld(!0), this.bind(new n.Skeleton(r, void 0, i)) }, n.SkinnedMesh.prototype = Object.create(n.Mesh.prototype), n.SkinnedMesh.prototype.constructor = n.SkinnedMesh, n.SkinnedMesh.prototype.bind = function(e, t) { this.skeleton = e, void 0 === t && (this.updateMatrixWorld(!0), t = this.matrixWorld), this.bindMatrix.copy(t), this.bindMatrixInverse.getInverse(t) }, n.SkinnedMesh.prototype.pose = function() { this.skeleton.pose() }, n.SkinnedMesh.prototype.normalizeSkinWeights = function() { if (this.geometry instanceof n.Geometry)
                    for (var e = 0; e < this.geometry.skinIndices.length; e++) { var t = this.geometry.skinWeights[e],
                            i = 1 / t.lengthManhattan();
                        i !== 1 / 0 ? t.multiplyScalar(i) : t.set(1) } }, n.SkinnedMesh.prototype.updateMatrixWorld = function(e) { n.Mesh.prototype.updateMatrixWorld.call(this, !0), "attached" === this.bindMode ? this.bindMatrixInverse.getInverse(this.matrixWorld) : "detached" === this.bindMode ? this.bindMatrixInverse.getInverse(this.bindMatrix) : n.warn("THREE.SkinnedMesh unreckognized bindMode: " + this.bindMode) }, n.SkinnedMesh.prototype.clone = function(e) { return void 0 === e && (e = new n.SkinnedMesh(this.geometry, this.material, this.useVertexTexture)), n.Mesh.prototype.clone.call(this, e), e }, n.MorphAnimMesh = function(e, t) { n.Mesh.call(this, e, t), this.type = "MorphAnimMesh", this.duration = 1e3, this.mirroredLoop = !1, this.time = 0, this.lastKeyframe = 0, this.currentKeyframe = 0, this.direction = 1, this.directionBackwards = !1, this.setFrameRange(0, this.geometry.morphTargets.length - 1) }, n.MorphAnimMesh.prototype = Object.create(n.Mesh.prototype), n.MorphAnimMesh.prototype.constructor = n.MorphAnimMesh, n.MorphAnimMesh.prototype.setFrameRange = function(e, t) { this.startKeyframe = e, this.endKeyframe = t, this.length = this.endKeyframe - this.startKeyframe + 1 }, n.MorphAnimMesh.prototype.setDirectionForward = function() { this.direction = 1, this.directionBackwards = !1 }, n.MorphAnimMesh.prototype.setDirectionBackward = function() { this.direction = -1, this.directionBackwards = !0 }, n.MorphAnimMesh.prototype.parseAnimations = function() { var e = this.geometry;
                e.animations || (e.animations = {}); for (var t, i = e.animations, r = /([a-z]+)_?(\d+)/, n = 0, o = e.morphTargets.length; o > n; n++) { var a = e.morphTargets[n],
                        s = a.name.match(r); if (s && s.length > 1) { var h = s[1];
                        i[h] || (i[h] = { start: 1 / 0, end: -(1 / 0) }); var l = i[h];
                        n < l.start && (l.start = n), n > l.end && (l.end = n), t || (t = h) } } e.firstAnimation = t }, n.MorphAnimMesh.prototype.setAnimationLabel = function(e, t, i) { this.geometry.animations || (this.geometry.animations = {}), this.geometry.animations[e] = { start: t, end: i } }, n.MorphAnimMesh.prototype.playAnimation = function(e, t) { var i = this.geometry.animations[e];
                i ? (this.setFrameRange(i.start, i.end), this.duration = 1e3 * ((i.end - i.start) / t), this.time = 0) : n.warn("THREE.MorphAnimMesh: animation[" + e + "] undefined in .playAnimation()") }, n.MorphAnimMesh.prototype.updateAnimation = function(e) { var t = this.duration / this.length;
                this.time += this.direction * e, this.mirroredLoop ? (this.time > this.duration || this.time < 0) && (this.direction *= -1, this.time > this.duration && (this.time = this.duration, this.directionBackwards = !0), this.time < 0 && (this.time = 0, this.directionBackwards = !1)) : (this.time = this.time % this.duration, this.time < 0 && (this.time += this.duration)); var i = this.startKeyframe + n.Math.clamp(Math.floor(this.time / t), 0, this.length - 1);
                i !== this.currentKeyframe && (this.morphTargetInfluences[this.lastKeyframe] = 0, this.morphTargetInfluences[this.currentKeyframe] = 1, this.morphTargetInfluences[i] = 0, this.lastKeyframe = this.currentKeyframe, this.currentKeyframe = i); var r = this.time % t / t;
                this.directionBackwards && (r = 1 - r), this.morphTargetInfluences[this.currentKeyframe] = r, this.morphTargetInfluences[this.lastKeyframe] = 1 - r }, n.MorphAnimMesh.prototype.interpolateTargets = function(e, t, i) { for (var r = this.morphTargetInfluences, n = 0, o = r.length; o > n; n++) r[n] = 0;
                e > -1 && (r[e] = 1 - i), t > -1 && (r[t] = i) }, n.MorphAnimMesh.prototype.clone = function(e) { return void 0 === e && (e = new n.MorphAnimMesh(this.geometry, this.material)), e.duration = this.duration, e.mirroredLoop = this.mirroredLoop, e.time = this.time, e.lastKeyframe = this.lastKeyframe, e.currentKeyframe = this.currentKeyframe, e.direction = this.direction, e.directionBackwards = this.directionBackwards, n.Mesh.prototype.clone.call(this, e), e }, n.LOD = function() { n.Object3D.call(this), this.objects = [] }, n.LOD.prototype = Object.create(n.Object3D.prototype), n.LOD.prototype.constructor = n.LOD, n.LOD.prototype.addLevel = function(e, t) { void 0 === t && (t = 0), t = Math.abs(t); for (var i = 0; i < this.objects.length && !(t < this.objects[i].distance); i++);
                this.objects.splice(i, 0, { distance: t, object: e }), this.add(e) }, n.LOD.prototype.getObjectForDistance = function(e) { for (var t = 1, i = this.objects.length; i > t && !(e < this.objects[t].distance); t++); return this.objects[t - 1].object }, n.LOD.prototype.raycast = function() { var e = new n.Vector3; return function(t, i) { e.setFromMatrixPosition(this.matrixWorld); var r = t.ray.origin.distanceTo(e);
                    this.getObjectForDistance(r).raycast(t, i) } }(), n.LOD.prototype.update = function() { var e = new n.Vector3,
                    t = new n.Vector3; return function(i) { if (this.objects.length > 1) { e.setFromMatrixPosition(i.matrixWorld), t.setFromMatrixPosition(this.matrixWorld); var r = e.distanceTo(t);
                        this.objects[0].object.visible = !0; for (var n = 1, o = this.objects.length; o > n && r >= this.objects[n].distance; n++) this.objects[n - 1].object.visible = !1, this.objects[n].object.visible = !0; for (; o > n; n++) this.objects[n].object.visible = !1 } } }(), n.LOD.prototype.clone = function(e) { void 0 === e && (e = new n.LOD), n.Object3D.prototype.clone.call(this, e); for (var t = 0, i = this.objects.length; i > t; t++) { var r = this.objects[t].object.clone();
                    r.visible = 0 === t, e.addLevel(r, this.objects[t].distance) } return e }, n.Sprite = function() { var e = new Uint16Array([0, 1, 2, 0, 2, 3]),
                    t = new Float32Array([-.5, -.5, 0, .5, -.5, 0, .5, .5, 0, -.5, .5, 0]),
                    i = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
                    r = new n.BufferGeometry; return r.addAttribute("index", new n.BufferAttribute(e, 1)), r.addAttribute("position", new n.BufferAttribute(t, 3)), r.addAttribute("uv", new n.BufferAttribute(i, 2)),
                    function(e) { n.Object3D.call(this), this.type = "Sprite", this.geometry = r, this.material = void 0 !== e ? e : new n.SpriteMaterial } }(), n.Sprite.prototype = Object.create(n.Object3D.prototype), n.Sprite.prototype.constructor = n.Sprite, n.Sprite.prototype.raycast = function() { var e = new n.Vector3; return function(t, i) { e.setFromMatrixPosition(this.matrixWorld); var r = t.ray.distanceToPoint(e);
                    r > this.scale.x || i.push({ distance: r, point: this.position, face: null, object: this }) } }(), n.Sprite.prototype.clone = function(e) { return void 0 === e && (e = new n.Sprite(this.material)), n.Object3D.prototype.clone.call(this, e), e }, n.Particle = n.Sprite, n.LensFlare = function(e, t, i, r, o) { n.Object3D.call(this), this.lensFlares = [], this.positionScreen = new n.Vector3, this.customUpdateCallback = void 0, void 0 !== e && this.add(e, t, i, r, o) }, n.LensFlare.prototype = Object.create(n.Object3D.prototype), n.LensFlare.prototype.constructor = n.LensFlare, n.LensFlare.prototype.add = function(e, t, i, r, o, a) { void 0 === t && (t = -1), void 0 === i && (i = 0), void 0 === a && (a = 1), void 0 === o && (o = new n.Color(16777215)), void 0 === r && (r = n.NormalBlending), i = Math.min(i, Math.max(0, i)), this.lensFlares.push({ texture: e, size: t, distance: i, x: 0, y: 0, z: 0, scale: 1, rotation: 1, opacity: a, color: o, blending: r }) }, n.LensFlare.prototype.updateLensFlares = function() { var e, t, i = this.lensFlares.length,
                    r = 2 * -this.positionScreen.x,
                    n = 2 * -this.positionScreen.y; for (e = 0; i > e; e++) t = this.lensFlares[e], t.x = this.positionScreen.x + r * t.distance, t.y = this.positionScreen.y + n * t.distance, t.wantedRotation = t.x * Math.PI * .25, t.rotation += .25 * (t.wantedRotation - t.rotation) }, n.Scene = function() { n.Object3D.call(this), this.type = "Scene", this.fog = null, this.overrideMaterial = null, this.autoUpdate = !0 }, n.Scene.prototype = Object.create(n.Object3D.prototype), n.Scene.prototype.constructor = n.Scene, n.Scene.prototype.clone = function(e) { return void 0 === e && (e = new n.Scene), n.Object3D.prototype.clone.call(this, e), null !== this.fog && (e.fog = this.fog.clone()), null !== this.overrideMaterial && (e.overrideMaterial = this.overrideMaterial.clone()), e.autoUpdate = this.autoUpdate, e.matrixAutoUpdate = this.matrixAutoUpdate, e }, n.Fog = function(e, t, i) { this.name = "", this.color = new n.Color(e), this.near = void 0 !== t ? t : 1, this.far = void 0 !== i ? i : 1e3 }, n.Fog.prototype.clone = function() { return new n.Fog(this.color.getHex(), this.near, this.far) }, n.FogExp2 = function(e, t) { this.name = "", this.color = new n.Color(e), this.density = void 0 !== t ? t : 25e-5 }, n.FogExp2.prototype.clone = function() { return new n.FogExp2(this.color.getHex(), this.density) }, n.ShaderChunk = {}, n.ShaderChunk.common = "#define PI 3.14159\n#define PI2 6.28318\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n\nfloat square( in float a ) { return a*a; }\nvec2  square( in vec2 a )  { return vec2( a.x*a.x, a.y*a.y ); }\nvec3  square( in vec3 a )  { return vec3( a.x*a.x, a.y*a.y, a.z*a.z ); }\nvec4  square( in vec4 a )  { return vec4( a.x*a.x, a.y*a.y, a.z*a.z, a.w*a.w ); }\nfloat saturate( in float a ) { return clamp( a, 0.0, 1.0 ); }\nvec2  saturate( in vec2 a )  { return clamp( a, 0.0, 1.0 ); }\nvec3  saturate( in vec3 a )  { return clamp( a, 0.0, 1.0 ); }\nvec4  saturate( in vec4 a )  { return clamp( a, 0.0, 1.0 ); }\nfloat average( in float a ) { return a; }\nfloat average( in vec2 a )  { return ( a.x + a.y) * 0.5; }\nfloat average( in vec3 a )  { return ( a.x + a.y + a.z) / 3.0; }\nfloat average( in vec4 a )  { return ( a.x + a.y + a.z + a.w) * 0.25; }\nfloat whiteCompliment( in float a ) { return saturate( 1.0 - a ); }\nvec2  whiteCompliment( in vec2 a )  { return saturate( vec2(1.0) - a ); }\nvec3  whiteCompliment( in vec3 a )  { return saturate( vec3(1.0) - a ); }\nvec4  whiteCompliment( in vec4 a )  { return saturate( vec4(1.0) - a ); }\nvec3 transformDirection( in vec3 normal, in mat4 matrix ) {\n	return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );\n}\n// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations\nvec3 inverseTransformDirection( in vec3 normal, in mat4 matrix ) {\n	return normalize( ( vec4( normal, 0.0 ) * matrix ).xyz );\n}\nvec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal) {\n	float distance = dot( planeNormal, point-pointOnPlane );\n	return point - distance * planeNormal;\n}\nfloat sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n	return sign( dot( point - pointOnPlane, planeNormal ) );\n}\nvec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n	return pointOnLine + lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) );\n}\nfloat calcLightAttenuation( float lightDistance, float cutoffDistance, float decayExponent ) {\n	if ( decayExponent > 0.0 ) {\n	  return pow( saturate( 1.0 - lightDistance / cutoffDistance ), decayExponent );\n	}\n	return 1.0;\n}\n\nvec3 inputToLinear( in vec3 a ) {\n#ifdef GAMMA_INPUT\n	return pow( a, vec3( float( GAMMA_FACTOR ) ) );\n#else\n	return a;\n#endif\n}\nvec3 linearToOutput( in vec3 a ) {\n#ifdef GAMMA_OUTPUT\n	return pow( a, vec3( 1.0 / float( GAMMA_FACTOR ) ) );\n#else\n	return a;\n#endif\n}\n", n.ShaderChunk.alphatest_fragment = "#ifdef ALPHATEST\n\n	if ( diffuseColor.a < ALPHATEST ) discard;\n\n#endif\n", n.ShaderChunk.lights_lambert_vertex = "vLightFront = vec3( 0.0 );\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack = vec3( 0.0 );\n\n#endif\n\ntransformedNormal = normalize( transformedNormal );\n\n#if MAX_DIR_LIGHTS > 0\n\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n	vec3 dirVector = transformDirection( directionalLightDirection[ i ], viewMatrix );\n\n	float dotProduct = dot( transformedNormal, dirVector );\n	vec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n	#ifdef DOUBLE_SIDED\n\n		vec3 directionalLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n		#ifdef WRAP_AROUND\n\n			vec3 directionalLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n		#endif\n\n	#endif\n\n	#ifdef WRAP_AROUND\n\n		vec3 directionalLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n		directionalLightWeighting = mix( directionalLightWeighting, directionalLightWeightingHalf, wrapRGB );\n\n		#ifdef DOUBLE_SIDED\n\n			directionalLightWeightingBack = mix( directionalLightWeightingBack, directionalLightWeightingHalfBack, wrapRGB );\n\n		#endif\n\n	#endif\n\n	vLightFront += directionalLightColor[ i ] * directionalLightWeighting;\n\n	#ifdef DOUBLE_SIDED\n\n		vLightBack += directionalLightColor[ i ] * directionalLightWeightingBack;\n\n	#endif\n\n}\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	for( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz - mvPosition.xyz;\n\n		float attenuation = calcLightAttenuation( length( lVector ), pointLightDistance[ i ], pointLightDecay[ i ] );\n\n		lVector = normalize( lVector );\n		float dotProduct = dot( transformedNormal, lVector );\n\n		vec3 pointLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n		#ifdef DOUBLE_SIDED\n\n			vec3 pointLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n			#ifdef WRAP_AROUND\n\n				vec3 pointLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n			#endif\n\n		#endif\n\n		#ifdef WRAP_AROUND\n\n			vec3 pointLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n			pointLightWeighting = mix( pointLightWeighting, pointLightWeightingHalf, wrapRGB );\n\n			#ifdef DOUBLE_SIDED\n\n				pointLightWeightingBack = mix( pointLightWeightingBack, pointLightWeightingHalfBack, wrapRGB );\n\n			#endif\n\n		#endif\n\n		vLightFront += pointLightColor[ i ] * pointLightWeighting * attenuation;\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += pointLightColor[ i ] * pointLightWeightingBack * attenuation;\n\n		#endif\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	for( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz - mvPosition.xyz;\n\n		float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - worldPosition.xyz ) );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );\n\n			float attenuation = calcLightAttenuation( length( lVector ), spotLightDistance[ i ], spotLightDecay[ i ] );\n\n			lVector = normalize( lVector );\n\n			float dotProduct = dot( transformedNormal, lVector );\n			vec3 spotLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n			#ifdef DOUBLE_SIDED\n\n				vec3 spotLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n				#ifdef WRAP_AROUND\n\n					vec3 spotLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n				#endif\n\n			#endif\n\n			#ifdef WRAP_AROUND\n\n				vec3 spotLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n				spotLightWeighting = mix( spotLightWeighting, spotLightWeightingHalf, wrapRGB );\n\n				#ifdef DOUBLE_SIDED\n\n					spotLightWeightingBack = mix( spotLightWeightingBack, spotLightWeightingHalfBack, wrapRGB );\n\n				#endif\n\n			#endif\n\n			vLightFront += spotLightColor[ i ] * spotLightWeighting * attenuation * spotEffect;\n\n			#ifdef DOUBLE_SIDED\n\n				vLightBack += spotLightColor[ i ] * spotLightWeightingBack * attenuation * spotEffect;\n\n			#endif\n\n		}\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec3 lVector = transformDirection( hemisphereLightDirection[ i ], viewMatrix );\n\n		float dotProduct = dot( transformedNormal, lVector );\n\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n		float hemiDiffuseWeightBack = -0.5 * dotProduct + 0.5;\n\n		vLightFront += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeightBack );\n\n		#endif\n\n	}\n\n#endif\n\nvLightFront += ambientLightColor;\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack += ambientLightColor;\n\n#endif\n", n.ShaderChunk.map_particle_pars_fragment = "#ifdef USE_MAP\n\n	uniform vec4 offsetRepeat;\n	uniform sampler2D map;\n\n#endif\n", n.ShaderChunk.default_vertex = "#ifdef USE_SKINNING\n\n	vec4 mvPosition = modelViewMatrix * skinned;\n\n#elif defined( USE_MORPHTARGETS )\n\n	vec4 mvPosition = modelViewMatrix * vec4( morphed, 1.0 );\n\n#else\n\n	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\n#endif\n\ngl_Position = projectionMatrix * mvPosition;\n", n.ShaderChunk.map_pars_fragment = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	varying vec2 vUv;\n\n#endif\n\n#ifdef USE_MAP\n\n	uniform sampler2D map;\n\n#endif", n.ShaderChunk.skinnormal_vertex = "#ifdef USE_SKINNING\n\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;\n\n	#ifdef USE_MORPHNORMALS\n\n	vec4 skinnedNormal = skinMatrix * vec4( morphedNormal, 0.0 );\n\n	#else\n\n	vec4 skinnedNormal = skinMatrix * vec4( normal, 0.0 );\n\n	#endif\n\n#endif\n", n.ShaderChunk.logdepthbuf_pars_vertex = "#ifdef USE_LOGDEPTHBUF\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		varying float vFragDepth;\n\n	#endif\n\n	uniform float logDepthBufFC;\n\n#endif", n.ShaderChunk.lightmap_pars_vertex = "#ifdef USE_LIGHTMAP\n\n	varying vec2 vUv2;\n\n#endif", n.ShaderChunk.lights_phong_fragment = "#ifndef FLAT_SHADED\n\n	vec3 normal = normalize( vNormal );\n\n	#ifdef DOUBLE_SIDED\n\n		normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n\n	#endif\n\n#else\n\n	vec3 fdx = dFdx( vViewPosition );\n	vec3 fdy = dFdy( vViewPosition );\n	vec3 normal = normalize( cross( fdx, fdy ) );\n\n#endif\n\nvec3 viewPosition = normalize( vViewPosition );\n\n#ifdef USE_NORMALMAP\n\n	normal = perturbNormal2Arb( -vViewPosition, normal );\n\n#elif defined( USE_BUMPMAP )\n\n	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n\n#endif\n\nvec3 totalDiffuseLight = vec3( 0.0 );\nvec3 totalSpecularLight = vec3( 0.0 );\n\n#if MAX_POINT_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\n		float attenuation = calcLightAttenuation( length( lVector ), pointLightDistance[ i ], pointLightDecay[ i ] );\n\n		lVector = normalize( lVector );\n\n		// diffuse\n\n		float dotProduct = dot( normal, lVector );\n\n		#ifdef WRAP_AROUND\n\n			float pointDiffuseWeightFull = max( dotProduct, 0.0 );\n			float pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n			vec3 pointDiffuseWeight = mix( vec3( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n\n		#else\n\n			float pointDiffuseWeight = max( dotProduct, 0.0 );\n\n		#endif\n\n		totalDiffuseLight += pointLightColor[ i ] * pointDiffuseWeight * attenuation;\n\n				// specular\n\n		vec3 pointHalfVector = normalize( lVector + viewPosition );\n		float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\n		float pointSpecularWeight = specularStrength * max( pow( pointDotNormalHalf, shininess ), 0.0 );\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, pointHalfVector ), 0.0 ), 5.0 );\n		totalSpecularLight += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * attenuation * specularNormalization;\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\n		float attenuation = calcLightAttenuation( length( lVector ), spotLightDistance[ i ], spotLightDecay[ i ] );\n\n		lVector = normalize( lVector );\n\n		float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );\n\n			// diffuse\n\n			float dotProduct = dot( normal, lVector );\n\n			#ifdef WRAP_AROUND\n\n				float spotDiffuseWeightFull = max( dotProduct, 0.0 );\n				float spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n				vec3 spotDiffuseWeight = mix( vec3( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n\n			#else\n\n				float spotDiffuseWeight = max( dotProduct, 0.0 );\n\n			#endif\n\n			totalDiffuseLight += spotLightColor[ i ] * spotDiffuseWeight * attenuation * spotEffect;\n\n			// specular\n\n			vec3 spotHalfVector = normalize( lVector + viewPosition );\n			float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\n			float spotSpecularWeight = specularStrength * max( pow( spotDotNormalHalf, shininess ), 0.0 );\n\n			float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n			vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, spotHalfVector ), 0.0 ), 5.0 );\n			totalSpecularLight += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * attenuation * specularNormalization * spotEffect;\n\n		}\n\n	}\n\n#endif\n\n#if MAX_DIR_LIGHTS > 0\n\n	for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n		vec3 dirVector = transformDirection( directionalLightDirection[ i ], viewMatrix );\n\n		// diffuse\n\n		float dotProduct = dot( normal, dirVector );\n\n		#ifdef WRAP_AROUND\n\n			float dirDiffuseWeightFull = max( dotProduct, 0.0 );\n			float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n			vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n\n		#else\n\n			float dirDiffuseWeight = max( dotProduct, 0.0 );\n\n		#endif\n\n		totalDiffuseLight += directionalLightColor[ i ] * dirDiffuseWeight;\n\n		// specular\n\n		vec3 dirHalfVector = normalize( dirVector + viewPosition );\n		float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\n		float dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );\n\n		/*\n		// fresnel term from skin shader\n		const float F0 = 0.128;\n\n		float base = 1.0 - dot( viewPosition, dirHalfVector );\n		float exponential = pow( base, 5.0 );\n\n		float fresnel = exponential + F0 * ( 1.0 - exponential );\n		*/\n\n		/*\n		// fresnel term from fresnel shader\n		const float mFresnelBias = 0.08;\n		const float mFresnelScale = 0.3;\n		const float mFresnelPower = 5.0;\n\n		float fresnel = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( -viewPosition ), normal ), mFresnelPower );\n		*/\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		// 		dirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization * fresnel;\n\n		vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );\n		totalSpecularLight += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec3 lVector = transformDirection( hemisphereLightDirection[ i ], viewMatrix );\n\n		// diffuse\n\n		float dotProduct = dot( normal, lVector );\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n\n		vec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		totalDiffuseLight += hemiColor;\n\n		// specular (sky light)\n\n		vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );\n		float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;\n		float hemiSpecularWeightSky = specularStrength * max( pow( max( hemiDotNormalHalfSky, 0.0 ), shininess ), 0.0 );\n\n		// specular (ground light)\n\n		vec3 lVectorGround = -lVector;\n\n		vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );\n		float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;\n		float hemiSpecularWeightGround = specularStrength * max( pow( max( hemiDotNormalHalfGround, 0.0 ), shininess ), 0.0 );\n\n		float dotProductGround = dot( normal, lVectorGround );\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, hemiHalfVectorSky ), 0.0 ), 5.0 );\n		vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 0.0 ), 5.0 );\n		totalSpecularLight += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n\n	}\n\n#endif\n\n#ifdef METAL\n\n	outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + ambientLightColor ) * specular + totalSpecularLight + emissive;\n\n#else\n\n	outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + ambientLightColor ) + totalSpecularLight + emissive;\n\n#endif\n",
            n.ShaderChunk.fog_pars_fragment = "#ifdef USE_FOG\n\n	uniform vec3 fogColor;\n\n	#ifdef FOG_EXP2\n\n		uniform float fogDensity;\n\n	#else\n\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n\n#endif", n.ShaderChunk.morphnormal_vertex = "#ifdef USE_MORPHNORMALS\n\n	vec3 morphedNormal = vec3( 0.0 );\n\n	morphedNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\n	morphedNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\n	morphedNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\n	morphedNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n\n	morphedNormal += normal;\n\n#endif", n.ShaderChunk.envmap_pars_fragment = "#ifdef USE_ENVMAP\n\n	uniform float reflectivity;\n	#ifdef ENVMAP_TYPE_CUBE\n		uniform samplerCube envMap;\n	#else\n		uniform sampler2D envMap;\n	#endif\n	uniform float flipEnvMap;\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\n		uniform float refractionRatio;\n\n	#else\n\n		varying vec3 vReflect;\n\n	#endif\n\n#endif\n", n.ShaderChunk.logdepthbuf_fragment = "#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\n\n	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\n\n#endif", n.ShaderChunk.normalmap_pars_fragment = "#ifdef USE_NORMALMAP\n\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n\n	// Per-Pixel Tangent Space Normal Mapping\n	// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html\n\n	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\n\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( vUv.st );\n		vec2 st1 = dFdy( vUv.st );\n\n		vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n		vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n		vec3 N = normalize( surf_norm );\n\n		vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n		mapN.xy = normalScale * mapN.xy;\n		mat3 tsn = mat3( S, T, N );\n		return normalize( tsn * mapN );\n\n	}\n\n#endif\n", n.ShaderChunk.lights_phong_pars_vertex = "#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n", n.ShaderChunk.lightmap_pars_fragment = "#ifdef USE_LIGHTMAP\n\n	varying vec2 vUv2;\n	uniform sampler2D lightMap;\n\n#endif", n.ShaderChunk.shadowmap_vertex = "#ifdef USE_SHADOWMAP\n\n	for( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;\n\n	}\n\n#endif", n.ShaderChunk.lights_phong_vertex = "#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	vWorldPosition = worldPosition.xyz;\n\n#endif", n.ShaderChunk.map_fragment = "#ifdef USE_MAP\n\n	vec4 texelColor = texture2D( map, vUv );\n\n	texelColor.xyz = inputToLinear( texelColor.xyz );\n\n	diffuseColor *= texelColor;\n\n#endif", n.ShaderChunk.lightmap_vertex = "#ifdef USE_LIGHTMAP\n\n	vUv2 = uv2;\n\n#endif", n.ShaderChunk.map_particle_fragment = "#ifdef USE_MAP\n\n	diffuseColor *= texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) * offsetRepeat.zw + offsetRepeat.xy );\n\n#endif\n", n.ShaderChunk.color_pars_fragment = "#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif\n", n.ShaderChunk.color_vertex = "#ifdef USE_COLOR\n\n	vColor.xyz = inputToLinear( color.xyz );\n\n#endif", n.ShaderChunk.skinning_vertex = "#ifdef USE_SKINNING\n\n	#ifdef USE_MORPHTARGETS\n\n	vec4 skinVertex = bindMatrix * vec4( morphed, 1.0 );\n\n	#else\n\n	vec4 skinVertex = bindMatrix * vec4( position, 1.0 );\n\n	#endif\n\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	skinned  = bindMatrixInverse * skinned;\n\n#endif\n", n.ShaderChunk.envmap_pars_vertex = "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP ) && ! defined( PHONG )\n\n	varying vec3 vReflect;\n\n	uniform float refractionRatio;\n\n#endif\n", n.ShaderChunk.linear_to_gamma_fragment = "\n	outgoingLight = linearToOutput( outgoingLight );\n", n.ShaderChunk.color_pars_vertex = "#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif", n.ShaderChunk.lights_lambert_pars_vertex = "uniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDecay[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDecay[ MAX_SPOT_LIGHTS ];\n\n#endif\n\n#ifdef WRAP_AROUND\n\n	uniform vec3 wrapRGB;\n\n#endif\n", n.ShaderChunk.map_pars_vertex = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	varying vec2 vUv;\n	uniform vec4 offsetRepeat;\n\n#endif\n", n.ShaderChunk.envmap_fragment = "#ifdef USE_ENVMAP\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\n		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\n\n		// Transforming Normal Vectors with the Inverse Transformation\n		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\n		#ifdef ENVMAP_MODE_REFLECTION\n\n			vec3 reflectVec = reflect( cameraToVertex, worldNormal );\n\n		#else\n\n			vec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );\n\n		#endif\n\n	#else\n\n		vec3 reflectVec = vReflect;\n\n	#endif\n\n	#ifdef DOUBLE_SIDED\n		float flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n	#else\n		float flipNormal = 1.0;\n	#endif\n\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 envColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\n	#elif defined( ENVMAP_TYPE_EQUIREC )\n		vec2 sampleUV;\n		sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );\n		sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n		vec4 envColor = texture2D( envMap, sampleUV );\n\n	#elif defined( ENVMAP_TYPE_SPHERE )\n		vec3 reflectView = flipNormal * normalize((viewMatrix * vec4( reflectVec, 0.0 )).xyz + vec3(0.0,0.0,1.0));\n		vec4 envColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5 );\n	#endif\n\n	envColor.xyz = inputToLinear( envColor.xyz );\n\n	#ifdef ENVMAP_BLENDING_MULTIPLY\n\n		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n\n	#elif defined( ENVMAP_BLENDING_MIX )\n\n		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n\n	#elif defined( ENVMAP_BLENDING_ADD )\n\n		outgoingLight += envColor.xyz * specularStrength * reflectivity;\n\n	#endif\n\n#endif\n", n.ShaderChunk.specularmap_pars_fragment = "#ifdef USE_SPECULARMAP\n\n	uniform sampler2D specularMap;\n\n#endif", n.ShaderChunk.logdepthbuf_vertex = "#ifdef USE_LOGDEPTHBUF\n\n	gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		vFragDepth = 1.0 + gl_Position.w;\n\n#else\n\n		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\n\n	#endif\n\n#endif", n.ShaderChunk.morphtarget_pars_vertex = "#ifdef USE_MORPHTARGETS\n\n	#ifndef USE_MORPHNORMALS\n\n	uniform float morphTargetInfluences[ 8 ];\n\n	#else\n\n	uniform float morphTargetInfluences[ 4 ];\n\n	#endif\n\n#endif", n.ShaderChunk.specularmap_fragment = "float specularStrength;\n\n#ifdef USE_SPECULARMAP\n\n	vec4 texelSpecular = texture2D( specularMap, vUv );\n	specularStrength = texelSpecular.r;\n\n#else\n\n	specularStrength = 1.0;\n\n#endif", n.ShaderChunk.fog_fragment = "#ifdef USE_FOG\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		float depth = gl_FragDepthEXT / gl_FragCoord.w;\n\n	#else\n\n		float depth = gl_FragCoord.z / gl_FragCoord.w;\n\n	#endif\n\n	#ifdef FOG_EXP2\n\n		float fogFactor = exp2( - square( fogDensity ) * square( depth ) * LOG2 );\n		fogFactor = whiteCompliment( fogFactor );\n\n	#else\n\n		float fogFactor = smoothstep( fogNear, fogFar, depth );\n\n	#endif\n	\n	outgoingLight = mix( outgoingLight, fogColor, fogFactor );\n\n#endif", n.ShaderChunk.bumpmap_pars_fragment = "#ifdef USE_BUMPMAP\n\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n\n	// Derivative maps - bump mapping unparametrized surfaces by Morten Mikkelsen\n	// http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html\n\n	// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)\n\n	vec2 dHdxy_fwd() {\n\n		vec2 dSTdx = dFdx( vUv );\n		vec2 dSTdy = dFdy( vUv );\n\n		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n\n		return vec2( dBx, dBy );\n\n	}\n\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n\n		vec3 vSigmaX = dFdx( surf_pos );\n		vec3 vSigmaY = dFdy( surf_pos );\n		vec3 vN = surf_norm;		// normalized\n\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n\n		float fDet = dot( vSigmaX, R1 );\n\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n\n	}\n\n#endif\n", n.ShaderChunk.defaultnormal_vertex = "#ifdef USE_SKINNING\n\n	vec3 objectNormal = skinnedNormal.xyz;\n\n#elif defined( USE_MORPHNORMALS )\n\n	vec3 objectNormal = morphedNormal;\n\n#else\n\n	vec3 objectNormal = normal;\n\n#endif\n\n#ifdef FLIP_SIDED\n\n	objectNormal = -objectNormal;\n\n#endif\n\nvec3 transformedNormal = normalMatrix * objectNormal;\n", n.ShaderChunk.lights_phong_pars_fragment = "uniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDecay[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDecay[ MAX_SPOT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n\n#ifdef WRAP_AROUND\n\n	uniform vec3 wrapRGB;\n\n#endif\n\nvarying vec3 vViewPosition;\n\n#ifndef FLAT_SHADED\n\n	varying vec3 vNormal;\n\n#endif\n", n.ShaderChunk.skinbase_vertex = "#ifdef USE_SKINNING\n\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n\n#endif", n.ShaderChunk.map_vertex = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n\n#endif", n.ShaderChunk.lightmap_fragment = "#ifdef USE_LIGHTMAP\n\n	outgoingLight *= diffuseColor.xyz * texture2D( lightMap, vUv2 ).xyz;\n\n#endif", n.ShaderChunk.shadowmap_pars_vertex = "#ifdef USE_SHADOWMAP\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n	uniform mat4 shadowMatrix[ MAX_SHADOWS ];\n\n#endif", n.ShaderChunk.color_fragment = "#ifdef USE_COLOR\n\n	diffuseColor.rgb *= vColor;\n\n#endif", n.ShaderChunk.morphtarget_vertex = "#ifdef USE_MORPHTARGETS\n\n	vec3 morphed = vec3( 0.0 );\n	morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n	morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n	morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n	morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n\n	#ifndef USE_MORPHNORMALS\n\n	morphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n	morphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n	morphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n	morphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n\n	#endif\n\n	morphed += position;\n\n#endif", n.ShaderChunk.envmap_vertex = "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP ) && ! defined( PHONG )\n\n	vec3 worldNormal = transformDirection( objectNormal, modelMatrix );\n\n	vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\n	#ifdef ENVMAP_MODE_REFLECTION\n\n		vReflect = reflect( cameraToVertex, worldNormal );\n\n	#else\n\n		vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\n	#endif\n\n#endif\n", n.ShaderChunk.shadowmap_fragment = "#ifdef USE_SHADOWMAP\n\n	#ifdef SHADOWMAP_DEBUG\n\n		vec3 frustumColors[3];\n		frustumColors[0] = vec3( 1.0, 0.5, 0.0 );\n		frustumColors[1] = vec3( 0.0, 1.0, 0.8 );\n		frustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n\n	#endif\n\n	#ifdef SHADOWMAP_CASCADE\n\n		int inFrustumCount = 0;\n\n	#endif\n\n	float fDepth;\n	vec3 shadowColor = vec3( 1.0 );\n\n	for( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		vec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\n\n				// if ( something && something ) breaks ATI OpenGL shader compiler\n				// if ( all( something, something ) ) using this instead\n\n		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n		bool inFrustum = all( inFrustumVec );\n\n				// don't shadow pixels outside of light frustum\n				// use just first frustum (for cascades)\n				// don't shadow pixels behind far plane of light frustum\n\n		#ifdef SHADOWMAP_CASCADE\n\n			inFrustumCount += int( inFrustum );\n			bvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n\n		#else\n\n			bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\n		#endif\n\n		bool frustumTest = all( frustumTestVec );\n\n		if ( frustumTest ) {\n\n			shadowCoord.z += shadowBias[ i ];\n\n			#if defined( SHADOWMAP_TYPE_PCF )\n\n						// Percentage-close filtering\n						// (9 pixel kernel)\n						// http://fabiensanglard.net/shadowmappingPCF/\n\n				float shadow = 0.0;\n\n		/*\n						// nested loops breaks shader compiler / validator on some ATI cards when using OpenGL\n						// must enroll loop manually\n\n				for ( float y = -1.25; y <= 1.25; y += 1.25 )\n					for ( float x = -1.25; x <= 1.25; x += 1.25 ) {\n\n						vec4 rgbaDepth = texture2D( shadowMap[ i ], vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy );\n\n								// doesn't seem to produce any noticeable visual difference compared to simple texture2D lookup\n								//vec4 rgbaDepth = texture2DProj( shadowMap[ i ], vec4( vShadowCoord[ i ].w * ( vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy ), 0.05, vShadowCoord[ i ].w ) );\n\n						float fDepth = unpackDepth( rgbaDepth );\n\n						if ( fDepth < shadowCoord.z )\n							shadow += 1.0;\n\n				}\n\n				shadow /= 9.0;\n\n		*/\n\n				const float shadowDelta = 1.0 / 9.0;\n\n				float xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n				float yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\n				float dx0 = -1.25 * xPixelOffset;\n				float dy0 = -1.25 * yPixelOffset;\n				float dx1 = 1.25 * xPixelOffset;\n				float dy1 = 1.25 * yPixelOffset;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\n			#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n						// Percentage-close filtering\n						// (9 pixel kernel)\n						// http://fabiensanglard.net/shadowmappingPCF/\n\n				float shadow = 0.0;\n\n				float xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n				float yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\n				float dx0 = -1.0 * xPixelOffset;\n				float dy0 = -1.0 * yPixelOffset;\n				float dx1 = 1.0 * xPixelOffset;\n				float dy1 = 1.0 * yPixelOffset;\n\n				mat3 shadowKernel;\n				mat3 depthKernel;\n\n				depthKernel[0][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				depthKernel[0][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				depthKernel[0][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				depthKernel[1][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				depthKernel[1][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				depthKernel[1][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				depthKernel[2][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				depthKernel[2][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				depthKernel[2][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n\n				vec3 shadowZ = vec3( shadowCoord.z );\n				shadowKernel[0] = vec3(lessThan(depthKernel[0], shadowZ ));\n				shadowKernel[0] *= vec3(0.25);\n\n				shadowKernel[1] = vec3(lessThan(depthKernel[1], shadowZ ));\n				shadowKernel[1] *= vec3(0.25);\n\n				shadowKernel[2] = vec3(lessThan(depthKernel[2], shadowZ ));\n				shadowKernel[2] *= vec3(0.25);\n\n				vec2 fractionalCoord = 1.0 - fract( shadowCoord.xy * shadowMapSize[i].xy );\n\n				shadowKernel[0] = mix( shadowKernel[1], shadowKernel[0], fractionalCoord.x );\n				shadowKernel[1] = mix( shadowKernel[2], shadowKernel[1], fractionalCoord.x );\n\n				vec4 shadowValues;\n				shadowValues.x = mix( shadowKernel[0][1], shadowKernel[0][0], fractionalCoord.y );\n				shadowValues.y = mix( shadowKernel[0][2], shadowKernel[0][1], fractionalCoord.y );\n				shadowValues.z = mix( shadowKernel[1][1], shadowKernel[1][0], fractionalCoord.y );\n				shadowValues.w = mix( shadowKernel[1][2], shadowKernel[1][1], fractionalCoord.y );\n\n				shadow = dot( shadowValues, vec4( 1.0 ) );\n\n				shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\n			#else\n\n				vec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\n				float fDepth = unpackDepth( rgbaDepth );\n\n				if ( fDepth < shadowCoord.z )\n\n		// spot with multiple shadows is darker\n\n					shadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );\n\n		// spot with multiple shadows has the same color as single shadow spot\n\n		// 					shadowColor = min( shadowColor, vec3( shadowDarkness[ i ] ) );\n\n			#endif\n\n		}\n\n\n		#ifdef SHADOWMAP_DEBUG\n\n			#ifdef SHADOWMAP_CASCADE\n\n				if ( inFrustum && inFrustumCount == 1 ) outgoingLight *= frustumColors[ i ];\n\n			#else\n\n				if ( inFrustum ) outgoingLight *= frustumColors[ i ];\n\n			#endif\n\n		#endif\n\n	}\n\n	// NOTE: I am unsure if this is correct in linear space.  -bhouston, Dec 29, 2014\n	shadowColor = inputToLinear( shadowColor );\n\n	outgoingLight = outgoingLight * shadowColor;\n\n#endif\n", n.ShaderChunk.worldpos_vertex = "#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\n\n	#ifdef USE_SKINNING\n\n		vec4 worldPosition = modelMatrix * skinned;\n\n	#elif defined( USE_MORPHTARGETS )\n\n		vec4 worldPosition = modelMatrix * vec4( morphed, 1.0 );\n\n	#else\n\n		vec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n\n	#endif\n\n#endif\n", n.ShaderChunk.shadowmap_pars_fragment = "#ifdef USE_SHADOWMAP\n\n	uniform sampler2D shadowMap[ MAX_SHADOWS ];\n	uniform vec2 shadowMapSize[ MAX_SHADOWS ];\n\n	uniform float shadowDarkness[ MAX_SHADOWS ];\n	uniform float shadowBias[ MAX_SHADOWS ];\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n\n	float unpackDepth( const in vec4 rgba_depth ) {\n\n		const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n		float depth = dot( rgba_depth, bit_shift );\n		return depth;\n\n	}\n\n#endif", n.ShaderChunk.skinning_pars_vertex = "#ifdef USE_SKINNING\n\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n\n	#ifdef BONE_TEXTURE\n\n		uniform sampler2D boneTexture;\n		uniform int boneTextureWidth;\n		uniform int boneTextureHeight;\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			float j = i * 4.0;\n			float x = mod( j, float( boneTextureWidth ) );\n			float y = floor( j / float( boneTextureWidth ) );\n\n			float dx = 1.0 / float( boneTextureWidth );\n			float dy = 1.0 / float( boneTextureHeight );\n\n			y = dy * ( y + 0.5 );\n\n			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\n			mat4 bone = mat4( v1, v2, v3, v4 );\n\n			return bone;\n\n		}\n\n	#else\n\n		uniform mat4 boneGlobalMatrices[ MAX_BONES ];\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			mat4 bone = boneGlobalMatrices[ int(i) ];\n			return bone;\n\n		}\n\n	#endif\n\n#endif\n", n.ShaderChunk.logdepthbuf_pars_fragment = "#ifdef USE_LOGDEPTHBUF\n\n	uniform float logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		#extension GL_EXT_frag_depth : enable\n		varying float vFragDepth;\n\n	#endif\n\n#endif", n.ShaderChunk.alphamap_fragment = "#ifdef USE_ALPHAMAP\n\n	diffuseColor.a *= texture2D( alphaMap, vUv ).g;\n\n#endif\n", n.ShaderChunk.alphamap_pars_fragment = "#ifdef USE_ALPHAMAP\n\n	uniform sampler2D alphaMap;\n\n#endif\n", n.UniformsUtils = { merge: function(e) { for (var t = {}, i = 0; i < e.length; i++) { var r = this.clone(e[i]); for (var n in r) t[n] = r[n] } return t }, clone: function(e) { var t = {}; for (var i in e) { t[i] = {}; for (var r in e[i]) { var o = e[i][r];
                            o instanceof n.Color || o instanceof n.Vector2 || o instanceof n.Vector3 || o instanceof n.Vector4 || o instanceof n.Matrix4 || o instanceof n.Texture ? t[i][r] = o.clone() : o instanceof Array ? t[i][r] = o.slice() : t[i][r] = o } } return t } }, n.UniformsLib = { common: { diffuse: { type: "c", value: new n.Color(15658734) }, opacity: { type: "f", value: 1 }, map: { type: "t", value: null }, offsetRepeat: { type: "v4", value: new n.Vector4(0, 0, 1, 1) }, lightMap: { type: "t", value: null }, specularMap: { type: "t", value: null }, alphaMap: { type: "t", value: null }, envMap: { type: "t", value: null }, flipEnvMap: { type: "f", value: -1 }, reflectivity: { type: "f", value: 1 }, refractionRatio: { type: "f", value: .98 }, morphTargetInfluences: { type: "f", value: 0 } }, bump: { bumpMap: { type: "t", value: null }, bumpScale: { type: "f", value: 1 } }, normalmap: { normalMap: { type: "t", value: null }, normalScale: { type: "v2", value: new n.Vector2(1, 1) } }, fog: { fogDensity: { type: "f", value: 25e-5 }, fogNear: { type: "f", value: 1 }, fogFar: { type: "f", value: 2e3 }, fogColor: { type: "c", value: new n.Color(16777215) } }, lights: { ambientLightColor: { type: "fv", value: [] }, directionalLightDirection: { type: "fv", value: [] }, directionalLightColor: { type: "fv", value: [] }, hemisphereLightDirection: { type: "fv", value: [] }, hemisphereLightSkyColor: { type: "fv", value: [] }, hemisphereLightGroundColor: { type: "fv", value: [] }, pointLightColor: { type: "fv", value: [] }, pointLightPosition: { type: "fv", value: [] }, pointLightDistance: { type: "fv1", value: [] }, pointLightDecay: { type: "fv1", value: [] }, spotLightColor: { type: "fv", value: [] }, spotLightPosition: { type: "fv", value: [] }, spotLightDirection: { type: "fv", value: [] }, spotLightDistance: { type: "fv1", value: [] }, spotLightAngleCos: { type: "fv1", value: [] }, spotLightExponent: { type: "fv1", value: [] }, spotLightDecay: { type: "fv1", value: [] } }, particle: { psColor: { type: "c", value: new n.Color(15658734) }, opacity: { type: "f", value: 1 }, size: { type: "f", value: 1 }, scale: { type: "f", value: 1 }, map: { type: "t", value: null }, offsetRepeat: { type: "v4", value: new n.Vector4(0, 0, 1, 1) }, fogDensity: { type: "f", value: 25e-5 }, fogNear: { type: "f", value: 1 }, fogFar: { type: "f", value: 2e3 }, fogColor: { type: "c", value: new n.Color(16777215) } }, shadowmap: { shadowMap: { type: "tv", value: [] }, shadowMapSize: { type: "v2v", value: [] }, shadowBias: { type: "fv1", value: [] }, shadowDarkness: { type: "fv1", value: [] }, shadowMatrix: { type: "m4v", value: [] } } }, n.ShaderLib = {
                basic: { uniforms: n.UniformsUtils.merge([n.UniformsLib.common, n.UniformsLib.fog, n.UniformsLib.shadowmap]), vertexShader: [n.ShaderChunk.common, n.ShaderChunk.map_pars_vertex, n.ShaderChunk.lightmap_pars_vertex, n.ShaderChunk.envmap_pars_vertex, n.ShaderChunk.color_pars_vertex, n.ShaderChunk.morphtarget_pars_vertex, n.ShaderChunk.skinning_pars_vertex, n.ShaderChunk.shadowmap_pars_vertex, n.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", n.ShaderChunk.map_vertex, n.ShaderChunk.lightmap_vertex, n.ShaderChunk.color_vertex, n.ShaderChunk.skinbase_vertex, "	#ifdef USE_ENVMAP", n.ShaderChunk.morphnormal_vertex, n.ShaderChunk.skinnormal_vertex, n.ShaderChunk.defaultnormal_vertex, "	#endif", n.ShaderChunk.morphtarget_vertex, n.ShaderChunk.skinning_vertex, n.ShaderChunk.default_vertex, n.ShaderChunk.logdepthbuf_vertex, n.ShaderChunk.worldpos_vertex, n.ShaderChunk.envmap_vertex, n.ShaderChunk.shadowmap_vertex, "}"].join("\n"), fragmentShader: ["uniform vec3 diffuse;", "uniform float opacity;", n.ShaderChunk.common, n.ShaderChunk.color_pars_fragment, n.ShaderChunk.map_pars_fragment, n.ShaderChunk.alphamap_pars_fragment, n.ShaderChunk.lightmap_pars_fragment, n.ShaderChunk.envmap_pars_fragment, n.ShaderChunk.fog_pars_fragment, n.ShaderChunk.shadowmap_pars_fragment, n.ShaderChunk.specularmap_pars_fragment, n.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	vec3 outgoingLight = vec3( 0.0 );", "	vec4 diffuseColor = vec4( diffuse, opacity );", n.ShaderChunk.logdepthbuf_fragment, n.ShaderChunk.map_fragment, n.ShaderChunk.color_fragment, n.ShaderChunk.alphamap_fragment, n.ShaderChunk.alphatest_fragment, n.ShaderChunk.specularmap_fragment, "	outgoingLight = diffuseColor.rgb;", n.ShaderChunk.lightmap_fragment, n.ShaderChunk.envmap_fragment, n.ShaderChunk.shadowmap_fragment, n.ShaderChunk.linear_to_gamma_fragment, n.ShaderChunk.fog_fragment, "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "}"].join("\n") },
                lambert: { uniforms: n.UniformsUtils.merge([n.UniformsLib.common, n.UniformsLib.fog, n.UniformsLib.lights, n.UniformsLib.shadowmap, { emissive: { type: "c", value: new n.Color(0) }, wrapRGB: { type: "v3", value: new n.Vector3(1, 1, 1) } }]), vertexShader: ["#define LAMBERT", "varying vec3 vLightFront;", "#ifdef DOUBLE_SIDED", "	varying vec3 vLightBack;", "#endif", n.ShaderChunk.common, n.ShaderChunk.map_pars_vertex, n.ShaderChunk.lightmap_pars_vertex, n.ShaderChunk.envmap_pars_vertex, n.ShaderChunk.lights_lambert_pars_vertex, n.ShaderChunk.color_pars_vertex, n.ShaderChunk.morphtarget_pars_vertex, n.ShaderChunk.skinning_pars_vertex, n.ShaderChunk.shadowmap_pars_vertex, n.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", n.ShaderChunk.map_vertex, n.ShaderChunk.lightmap_vertex, n.ShaderChunk.color_vertex, n.ShaderChunk.morphnormal_vertex, n.ShaderChunk.skinbase_vertex, n.ShaderChunk.skinnormal_vertex, n.ShaderChunk.defaultnormal_vertex, n.ShaderChunk.morphtarget_vertex, n.ShaderChunk.skinning_vertex, n.ShaderChunk.default_vertex, n.ShaderChunk.logdepthbuf_vertex, n.ShaderChunk.worldpos_vertex, n.ShaderChunk.envmap_vertex, n.ShaderChunk.lights_lambert_vertex, n.ShaderChunk.shadowmap_vertex, "}"].join("\n"), fragmentShader: ["uniform vec3 diffuse;", "uniform vec3 emissive;", "uniform float opacity;", "varying vec3 vLightFront;", "#ifdef DOUBLE_SIDED", "	varying vec3 vLightBack;", "#endif", n.ShaderChunk.common, n.ShaderChunk.color_pars_fragment, n.ShaderChunk.map_pars_fragment, n.ShaderChunk.alphamap_pars_fragment, n.ShaderChunk.lightmap_pars_fragment, n.ShaderChunk.envmap_pars_fragment, n.ShaderChunk.fog_pars_fragment, n.ShaderChunk.shadowmap_pars_fragment, n.ShaderChunk.specularmap_pars_fragment, n.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	vec3 outgoingLight = vec3( 0.0 );", "	vec4 diffuseColor = vec4( diffuse, opacity );", n.ShaderChunk.logdepthbuf_fragment, n.ShaderChunk.map_fragment, n.ShaderChunk.color_fragment, n.ShaderChunk.alphamap_fragment, n.ShaderChunk.alphatest_fragment, n.ShaderChunk.specularmap_fragment, "	#ifdef DOUBLE_SIDED", "		if ( gl_FrontFacing )", "			outgoingLight += diffuseColor.rgb * vLightFront + emissive;", "		else", "			outgoingLight += diffuseColor.rgb * vLightBack + emissive;", "	#else", "		outgoingLight += diffuseColor.rgb * vLightFront + emissive;", "	#endif", n.ShaderChunk.lightmap_fragment, n.ShaderChunk.envmap_fragment, n.ShaderChunk.shadowmap_fragment, n.ShaderChunk.linear_to_gamma_fragment, n.ShaderChunk.fog_fragment, "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "}"].join("\n") },
                phong: {
                    uniforms: n.UniformsUtils.merge([n.UniformsLib.common, n.UniformsLib.bump, n.UniformsLib.normalmap, n.UniformsLib.fog, n.UniformsLib.lights, n.UniformsLib.shadowmap, { emissive: { type: "c", value: new n.Color(0) }, specular: { type: "c", value: new n.Color(1118481) }, shininess: { type: "f", value: 30 }, wrapRGB: { type: "v3", value: new n.Vector3(1, 1, 1) } }]),
                    vertexShader: ["#define PHONG", "varying vec3 vViewPosition;", "#ifndef FLAT_SHADED", "	varying vec3 vNormal;", "#endif", n.ShaderChunk.common, n.ShaderChunk.map_pars_vertex, n.ShaderChunk.lightmap_pars_vertex, n.ShaderChunk.envmap_pars_vertex, n.ShaderChunk.lights_phong_pars_vertex, n.ShaderChunk.color_pars_vertex, n.ShaderChunk.morphtarget_pars_vertex, n.ShaderChunk.skinning_pars_vertex, n.ShaderChunk.shadowmap_pars_vertex, n.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", n.ShaderChunk.map_vertex, n.ShaderChunk.lightmap_vertex, n.ShaderChunk.color_vertex, n.ShaderChunk.morphnormal_vertex, n.ShaderChunk.skinbase_vertex, n.ShaderChunk.skinnormal_vertex, n.ShaderChunk.defaultnormal_vertex, "#ifndef FLAT_SHADED", "	vNormal = normalize( transformedNormal );", "#endif", n.ShaderChunk.morphtarget_vertex, n.ShaderChunk.skinning_vertex, n.ShaderChunk.default_vertex, n.ShaderChunk.logdepthbuf_vertex, "	vViewPosition = -mvPosition.xyz;", n.ShaderChunk.worldpos_vertex, n.ShaderChunk.envmap_vertex, n.ShaderChunk.lights_phong_vertex, n.ShaderChunk.shadowmap_vertex, "}"].join("\n"),
                    fragmentShader: ["#define PHONG", "uniform vec3 diffuse;", "uniform vec3 emissive;", "uniform vec3 specular;", "uniform float shininess;", "uniform float opacity;", n.ShaderChunk.common, n.ShaderChunk.color_pars_fragment, n.ShaderChunk.map_pars_fragment, n.ShaderChunk.alphamap_pars_fragment, n.ShaderChunk.lightmap_pars_fragment, n.ShaderChunk.envmap_pars_fragment, n.ShaderChunk.fog_pars_fragment, n.ShaderChunk.lights_phong_pars_fragment, n.ShaderChunk.shadowmap_pars_fragment, n.ShaderChunk.bumpmap_pars_fragment, n.ShaderChunk.normalmap_pars_fragment, n.ShaderChunk.specularmap_pars_fragment, n.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	vec3 outgoingLight = vec3( 0.0 );", "	vec4 diffuseColor = vec4( diffuse, opacity );", n.ShaderChunk.logdepthbuf_fragment, n.ShaderChunk.map_fragment, n.ShaderChunk.color_fragment, n.ShaderChunk.alphamap_fragment, n.ShaderChunk.alphatest_fragment, n.ShaderChunk.specularmap_fragment, n.ShaderChunk.lights_phong_fragment, n.ShaderChunk.lightmap_fragment, n.ShaderChunk.envmap_fragment, n.ShaderChunk.shadowmap_fragment, n.ShaderChunk.linear_to_gamma_fragment, n.ShaderChunk.fog_fragment, "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "}"].join("\n")
                },
                particle_basic: { uniforms: n.UniformsUtils.merge([n.UniformsLib.particle, n.UniformsLib.shadowmap]), vertexShader: ["uniform float size;", "uniform float scale;", n.ShaderChunk.common, n.ShaderChunk.color_pars_vertex, n.ShaderChunk.shadowmap_pars_vertex, n.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", n.ShaderChunk.color_vertex, "	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "	#ifdef USE_SIZEATTENUATION", "		gl_PointSize = size * ( scale / length( mvPosition.xyz ) );", "	#else", "		gl_PointSize = size;", "	#endif", "	gl_Position = projectionMatrix * mvPosition;", n.ShaderChunk.logdepthbuf_vertex, n.ShaderChunk.worldpos_vertex, n.ShaderChunk.shadowmap_vertex, "}"].join("\n"), fragmentShader: ["uniform vec3 psColor;", "uniform float opacity;", n.ShaderChunk.common, n.ShaderChunk.color_pars_fragment, n.ShaderChunk.map_particle_pars_fragment, n.ShaderChunk.fog_pars_fragment, n.ShaderChunk.shadowmap_pars_fragment, n.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	vec3 outgoingLight = vec3( 0.0 );", "	vec4 diffuseColor = vec4( psColor, opacity );", n.ShaderChunk.logdepthbuf_fragment, n.ShaderChunk.map_particle_fragment, n.ShaderChunk.color_fragment, n.ShaderChunk.alphatest_fragment, "	outgoingLight = diffuseColor.rgb;", n.ShaderChunk.shadowmap_fragment, n.ShaderChunk.fog_fragment, "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "}"].join("\n") },
                dashed: { uniforms: n.UniformsUtils.merge([n.UniformsLib.common, n.UniformsLib.fog, { scale: { type: "f", value: 1 }, dashSize: { type: "f", value: 1 }, totalSize: { type: "f", value: 2 } }]), vertexShader: ["uniform float scale;", "attribute float lineDistance;", "varying float vLineDistance;", n.ShaderChunk.common, n.ShaderChunk.color_pars_vertex, n.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", n.ShaderChunk.color_vertex, "	vLineDistance = scale * lineDistance;", "	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "	gl_Position = projectionMatrix * mvPosition;", n.ShaderChunk.logdepthbuf_vertex, "}"].join("\n"), fragmentShader: ["uniform vec3 diffuse;", "uniform float opacity;", "uniform float dashSize;", "uniform float totalSize;", "varying float vLineDistance;", n.ShaderChunk.common, n.ShaderChunk.color_pars_fragment, n.ShaderChunk.fog_pars_fragment, n.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	if ( mod( vLineDistance, totalSize ) > dashSize ) {", "		discard;", "	}", "	vec3 outgoingLight = vec3( 0.0 );", "	vec4 diffuseColor = vec4( diffuse, opacity );", n.ShaderChunk.logdepthbuf_fragment, n.ShaderChunk.color_fragment, "	outgoingLight = diffuseColor.rgb;", n.ShaderChunk.fog_fragment, "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "}"].join("\n") },
                depth: { uniforms: { mNear: { type: "f", value: 1 }, mFar: { type: "f", value: 2e3 }, opacity: { type: "f", value: 1 } }, vertexShader: [n.ShaderChunk.common, n.ShaderChunk.morphtarget_pars_vertex, n.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", n.ShaderChunk.morphtarget_vertex, n.ShaderChunk.default_vertex, n.ShaderChunk.logdepthbuf_vertex, "}"].join("\n"), fragmentShader: ["uniform float mNear;", "uniform float mFar;", "uniform float opacity;", n.ShaderChunk.common, n.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", n.ShaderChunk.logdepthbuf_fragment, "	#ifdef USE_LOGDEPTHBUF_EXT", "		float depth = gl_FragDepthEXT / gl_FragCoord.w;", "	#else", "		float depth = gl_FragCoord.z / gl_FragCoord.w;", "	#endif", "	float color = 1.0 - smoothstep( mNear, mFar, depth );", "	gl_FragColor = vec4( vec3( color ), opacity );", "}"].join("\n") },
                normal: { uniforms: { opacity: { type: "f", value: 1 } }, vertexShader: ["varying vec3 vNormal;", n.ShaderChunk.common, n.ShaderChunk.morphtarget_pars_vertex, n.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", "	vNormal = normalize( normalMatrix * normal );", n.ShaderChunk.morphtarget_vertex, n.ShaderChunk.default_vertex, n.ShaderChunk.logdepthbuf_vertex, "}"].join("\n"), fragmentShader: ["uniform float opacity;", "varying vec3 vNormal;", n.ShaderChunk.common, n.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	gl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );", n.ShaderChunk.logdepthbuf_fragment, "}"].join("\n") },
                cube: { uniforms: { tCube: { type: "t", value: null }, tFlip: { type: "f", value: -1 } }, vertexShader: ["varying vec3 vWorldPosition;", n.ShaderChunk.common, n.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", "	vWorldPosition = transformDirection( position, modelMatrix );", "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", n.ShaderChunk.logdepthbuf_vertex, "}"].join("\n"), fragmentShader: ["uniform samplerCube tCube;", "uniform float tFlip;", "varying vec3 vWorldPosition;", n.ShaderChunk.common, n.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );", n.ShaderChunk.logdepthbuf_fragment, "}"].join("\n") },
                equirect: { uniforms: { tEquirect: { type: "t", value: null }, tFlip: { type: "f", value: -1 } }, vertexShader: ["varying vec3 vWorldPosition;", n.ShaderChunk.common, n.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", "	vWorldPosition = transformDirection( position, modelMatrix );", "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", n.ShaderChunk.logdepthbuf_vertex, "}"].join("\n"), fragmentShader: ["uniform sampler2D tEquirect;", "uniform float tFlip;", "varying vec3 vWorldPosition;", n.ShaderChunk.common, n.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "vec3 direction = normalize( vWorldPosition );", "vec2 sampleUV;", "sampleUV.y = saturate( tFlip * direction.y * -0.5 + 0.5 );", "sampleUV.x = atan( direction.z, direction.x ) * RECIPROCAL_PI2 + 0.5;", "gl_FragColor = texture2D( tEquirect, sampleUV );", n.ShaderChunk.logdepthbuf_fragment, "}"].join("\n") },
                depthRGBA: { uniforms: {}, vertexShader: [n.ShaderChunk.common, n.ShaderChunk.morphtarget_pars_vertex, n.ShaderChunk.skinning_pars_vertex, n.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", n.ShaderChunk.skinbase_vertex, n.ShaderChunk.morphtarget_vertex, n.ShaderChunk.skinning_vertex, n.ShaderChunk.default_vertex, n.ShaderChunk.logdepthbuf_vertex, "}"].join("\n"), fragmentShader: [n.ShaderChunk.common, n.ShaderChunk.logdepthbuf_pars_fragment, "vec4 pack_depth( const in float depth ) {", "	const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );", "	const vec4 bit_mask = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );", "	vec4 res = mod( depth * bit_shift * vec4( 255 ), vec4( 256 ) ) / vec4( 255 );", "	res -= res.xxyz * bit_mask;", "	return res;", "}", "void main() {", n.ShaderChunk.logdepthbuf_fragment, "	#ifdef USE_LOGDEPTHBUF_EXT", "		gl_FragData[ 0 ] = pack_depth( gl_FragDepthEXT );", "	#else", "		gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );", "	#endif", "}"].join("\n") }
            }, n.WebGLRenderer = function(e) {
                function t(e) { e.__webglVertexBuffer = Re.createBuffer(), e.__webglColorBuffer = Re.createBuffer(), Fe.info.memory.geometries++ }

                function i(e) { e.__webglVertexBuffer = Re.createBuffer(), e.__webglColorBuffer = Re.createBuffer(), e.__webglLineDistanceBuffer = Re.createBuffer(), Fe.info.memory.geometries++ }

                function r(e) { e.__webglVertexBuffer = Re.createBuffer(), e.__webglNormalBuffer = Re.createBuffer(), e.__webglTangentBuffer = Re.createBuffer(), e.__webglColorBuffer = Re.createBuffer(), e.__webglUVBuffer = Re.createBuffer(), e.__webglUV2Buffer = Re.createBuffer(), e.__webglSkinIndicesBuffer = Re.createBuffer(), e.__webglSkinWeightsBuffer = Re.createBuffer(), e.__webglFaceBuffer = Re.createBuffer(), e.__webglLineBuffer = Re.createBuffer(); var t = e.numMorphTargets; if (t) { e.__webglMorphTargetsBuffers = []; for (var i = 0, r = t; r > i; i++) e.__webglMorphTargetsBuffers.push(Re.createBuffer()) } var n = e.numMorphNormals; if (n) { e.__webglMorphNormalsBuffers = []; for (var i = 0, r = n; r > i; i++) e.__webglMorphNormalsBuffers.push(Re.createBuffer()) } Fe.info.memory.geometries++ }

                function o(e) { var t = e.geometry,
                        i = e.material,
                        r = t.vertices.length; if (i.attributes) { void 0 === t.__webglCustomAttributesList && (t.__webglCustomAttributesList = []); for (var n in i.attributes) { var o = i.attributes[n]; if (!o.__webglInitialized || o.createUniqueBuffers) { o.__webglInitialized = !0; var a = 1; "v2" === o.type ? a = 2 : "v3" === o.type ? a = 3 : "v4" === o.type ? a = 4 : "c" === o.type && (a = 3), o.size = a, o.array = new Float32Array(r * a), o.buffer = Re.createBuffer(), o.buffer.belongsToAttribute = n, o.needsUpdate = !0 } t.__webglCustomAttributesList.push(o) } } }

                function a(e, t) { var i = e.vertices.length;
                    e.__vertexArray = new Float32Array(3 * i), e.__colorArray = new Float32Array(3 * i), e.__webglParticleCount = i, o(t) }

                function s(e, t) { var i = e.vertices.length;
                    e.__vertexArray = new Float32Array(3 * i), e.__colorArray = new Float32Array(3 * i), e.__lineDistanceArray = new Float32Array(1 * i), e.__webglLineCount = i, o(t) }

                function h(e, t) { var i = t.geometry,
                        r = e.faces3,
                        n = 3 * r.length,
                        o = 1 * r.length,
                        a = 3 * r.length,
                        s = l(t, e);
                    e.__vertexArray = new Float32Array(3 * n), e.__normalArray = new Float32Array(3 * n), e.__colorArray = new Float32Array(3 * n), e.__uvArray = new Float32Array(2 * n), i.faceVertexUvs.length > 1 && (e.__uv2Array = new Float32Array(2 * n)), i.hasTangents && (e.__tangentArray = new Float32Array(4 * n)), t.geometry.skinWeights.length && t.geometry.skinIndices.length && (e.__skinIndexArray = new Float32Array(4 * n), e.__skinWeightArray = new Float32Array(4 * n)); var h = null !== tt.get("OES_element_index_uint") && o > 21845 ? Uint32Array : Uint16Array;
                    e.__typeArray = h, e.__faceArray = new h(3 * o), e.__lineArray = new h(2 * a); var c = e.numMorphTargets; if (c) { e.__morphTargetsArrays = []; for (var u = 0, d = c; d > u; u++) e.__morphTargetsArrays.push(new Float32Array(3 * n)) } var p = e.numMorphNormals; if (p) { e.__morphNormalsArrays = []; for (var u = 0, d = p; d > u; u++) e.__morphNormalsArrays.push(new Float32Array(3 * n)) } if (e.__webglFaceCount = 3 * o, e.__webglLineCount = 2 * a, s.attributes) { void 0 === e.__webglCustomAttributesList && (e.__webglCustomAttributesList = []); for (var f in s.attributes) { var m = s.attributes[f],
                                g = {}; for (var v in m) g[v] = m[v]; if (!g.__webglInitialized || g.createUniqueBuffers) { g.__webglInitialized = !0; var y = 1; "v2" === g.type ? y = 2 : "v3" === g.type ? y = 3 : "v4" === g.type ? y = 4 : "c" === g.type && (y = 3), g.size = y, g.array = new Float32Array(n * y), g.buffer = Re.createBuffer(), g.buffer.belongsToAttribute = f, m.needsUpdate = !0, g.__original = m } e.__webglCustomAttributesList.push(g) } } e.__inittedArrays = !0 }

                function l(e, t) { return e.material instanceof n.MeshFaceMaterial ? e.material.materials[t.materialIndex] : e.material }

                function c(e) { return e instanceof n.MeshPhongMaterial == !1 && e.shading === n.FlatShading }

                function u(e, t, i) { var r, n, o, a, s, h, l, c, u, d, p, f = e.vertices,
                        m = f.length,
                        g = e.colors,
                        v = g.length,
                        y = e.__vertexArray,
                        _ = e.__colorArray,
                        x = e.verticesNeedUpdate,
                        b = e.colorsNeedUpdate,
                        w = e.__webglCustomAttributesList; if (x) { for (r = 0; m > r; r++) o = f[r], a = 3 * r, y[a] = o.x, y[a + 1] = o.y, y[a + 2] = o.z;
                        Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglVertexBuffer), Re.bufferData(Re.ARRAY_BUFFER, y, t) } if (b) { for (n = 0; v > n; n++) s = g[n], a = 3 * n, _[a] = s.r, _[a + 1] = s.g, _[a + 2] = s.b;
                        Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglColorBuffer), Re.bufferData(Re.ARRAY_BUFFER, _, t) } if (w)
                        for (h = 0, l = w.length; l > h; h++) { if (p = w[h], p.needsUpdate && (void 0 === p.boundTo || "vertices" === p.boundTo))
                                if (u = p.value.length, a = 0, 1 === p.size)
                                    for (c = 0; u > c; c++) p.array[c] = p.value[c];
                                else if (2 === p.size)
                                for (c = 0; u > c; c++) d = p.value[c], p.array[a] = d.x, p.array[a + 1] = d.y, a += 2;
                            else if (3 === p.size)
                                if ("c" === p.type)
                                    for (c = 0; u > c; c++) d = p.value[c], p.array[a] = d.r, p.array[a + 1] = d.g, p.array[a + 2] = d.b, a += 3;
                                else
                                    for (c = 0; u > c; c++) d = p.value[c], p.array[a] = d.x, p.array[a + 1] = d.y, p.array[a + 2] = d.z, a += 3;
                            else if (4 === p.size)
                                for (c = 0; u > c; c++) d = p.value[c], p.array[a] = d.x, p.array[a + 1] = d.y, p.array[a + 2] = d.z, p.array[a + 3] = d.w, a += 4;
                            Re.bindBuffer(Re.ARRAY_BUFFER, p.buffer), Re.bufferData(Re.ARRAY_BUFFER, p.array, t), p.needsUpdate = !1 } }

                function d(e, t) { var i, r, n, o, a, s, h, l, c, u, d, p, f = e.vertices,
                        m = e.colors,
                        g = e.lineDistances,
                        v = f.length,
                        y = m.length,
                        _ = g.length,
                        x = e.__vertexArray,
                        b = e.__colorArray,
                        w = e.__lineDistanceArray,
                        T = e.verticesNeedUpdate,
                        M = e.colorsNeedUpdate,
                        S = e.lineDistancesNeedUpdate,
                        C = e.__webglCustomAttributesList; if (T) { for (i = 0; v > i; i++) o = f[i], a = 3 * i, x[a] = o.x, x[a + 1] = o.y, x[a + 2] = o.z;
                        Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglVertexBuffer), Re.bufferData(Re.ARRAY_BUFFER, x, t) } if (M) { for (r = 0; y > r; r++) s = m[r], a = 3 * r, b[a] = s.r, b[a + 1] = s.g, b[a + 2] = s.b;
                        Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglColorBuffer), Re.bufferData(Re.ARRAY_BUFFER, b, t) } if (S) { for (n = 0; _ > n; n++) w[n] = g[n];
                        Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglLineDistanceBuffer), Re.bufferData(Re.ARRAY_BUFFER, w, t) } if (C)
                        for (h = 0, l = C.length; l > h; h++)
                            if (p = C[h], p.needsUpdate && (void 0 === p.boundTo || "vertices" === p.boundTo)) { if (a = 0, u = p.value.length, 1 === p.size)
                                    for (c = 0; u > c; c++) p.array[c] = p.value[c];
                                else if (2 === p.size)
                                    for (c = 0; u > c; c++) d = p.value[c], p.array[a] = d.x, p.array[a + 1] = d.y, a += 2;
                                else if (3 === p.size)
                                    if ("c" === p.type)
                                        for (c = 0; u > c; c++) d = p.value[c], p.array[a] = d.r, p.array[a + 1] = d.g, p.array[a + 2] = d.b, a += 3;
                                    else
                                        for (c = 0; u > c; c++) d = p.value[c], p.array[a] = d.x, p.array[a + 1] = d.y, p.array[a + 2] = d.z, a += 3;
                                else if (4 === p.size)
                                    for (c = 0; u > c; c++) d = p.value[c], p.array[a] = d.x, p.array[a + 1] = d.y, p.array[a + 2] = d.z, p.array[a + 3] = d.w, a += 4;
                                Re.bindBuffer(Re.ARRAY_BUFFER, p.buffer), Re.bufferData(Re.ARRAY_BUFFER, p.array, t), p.needsUpdate = !1 } }

                function p(e, t, i, r, o) { if (e.__inittedArrays) { var a, s, h, l, u, d, p, f, m, g, v, y, _, x, b, w, T, M, S, C, A, E, P, L, R, F, k, O, D, B, U, z, N, V, I, G, H, j, W, X, Y, q, K = c(o),
                            Z = 0,
                            Q = 0,
                            J = 0,
                            $ = 0,
                            ee = 0,
                            te = 0,
                            ie = 0,
                            re = 0,
                            ne = 0,
                            oe = 0,
                            ae = 0,
                            se = 0,
                            he = e.__vertexArray,
                            le = e.__uvArray,
                            ce = e.__uv2Array,
                            ue = e.__normalArray,
                            de = e.__tangentArray,
                            pe = e.__colorArray,
                            fe = e.__skinIndexArray,
                            me = e.__skinWeightArray,
                            ge = e.__morphTargetsArrays,
                            ve = e.__morphNormalsArrays,
                            ye = e.__webglCustomAttributesList,
                            _e = e.__faceArray,
                            xe = e.__lineArray,
                            be = t.geometry,
                            we = be.verticesNeedUpdate,
                            Te = be.elementsNeedUpdate,
                            Me = be.uvsNeedUpdate,
                            Se = be.normalsNeedUpdate,
                            Ce = be.tangentsNeedUpdate,
                            Ae = be.colorsNeedUpdate,
                            Ee = be.morphTargetsNeedUpdate,
                            Pe = be.vertices,
                            Le = e.faces3,
                            Fe = be.faces,
                            ke = be.faceVertexUvs[0],
                            Oe = be.faceVertexUvs[1],
                            De = be.skinIndices,
                            Be = be.skinWeights,
                            Ue = be.morphTargets,
                            ze = be.morphNormals; if (we) { for (a = 0, s = Le.length; s > a; a++) l = Fe[Le[a]], y = Pe[l.a], _ = Pe[l.b], x = Pe[l.c], he[Q] = y.x, he[Q + 1] = y.y, he[Q + 2] = y.z, he[Q + 3] = _.x, he[Q + 4] = _.y, he[Q + 5] = _.z, he[Q + 6] = x.x, he[Q + 7] = x.y, he[Q + 8] = x.z, Q += 9;
                            Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglVertexBuffer), Re.bufferData(Re.ARRAY_BUFFER, he, i) } if (Ee)
                            for (I = 0, G = Ue.length; G > I; I++) { for (ae = 0, a = 0, s = Le.length; s > a; a++) W = Le[a], l = Fe[W], y = Ue[I].vertices[l.a], _ = Ue[I].vertices[l.b], x = Ue[I].vertices[l.c], H = ge[I], H[ae] = y.x, H[ae + 1] = y.y, H[ae + 2] = y.z, H[ae + 3] = _.x, H[ae + 4] = _.y, H[ae + 5] = _.z, H[ae + 6] = x.x, H[ae + 7] = x.y, H[ae + 8] = x.z, o.morphNormals && (K ? (M = ze[I].faceNormals[W], S = M, C = M) : (X = ze[I].vertexNormals[W], M = X.a, S = X.b, C = X.c), j = ve[I], j[ae] = M.x, j[ae + 1] = M.y, j[ae + 2] = M.z, j[ae + 3] = S.x, j[ae + 4] = S.y, j[ae + 5] = S.z, j[ae + 6] = C.x, j[ae + 7] = C.y, j[ae + 8] = C.z), ae += 9;
                                Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglMorphTargetsBuffers[I]), Re.bufferData(Re.ARRAY_BUFFER, ge[I], i), o.morphNormals && (Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglMorphNormalsBuffers[I]), Re.bufferData(Re.ARRAY_BUFFER, ve[I], i)) }
                        if (Be.length) { for (a = 0, s = Le.length; s > a; a++) l = Fe[Le[a]], L = Be[l.a], R = Be[l.b], F = Be[l.c], me[oe] = L.x, me[oe + 1] = L.y, me[oe + 2] = L.z, me[oe + 3] = L.w, me[oe + 4] = R.x, me[oe + 5] = R.y, me[oe + 6] = R.z, me[oe + 7] = R.w, me[oe + 8] = F.x, me[oe + 9] = F.y, me[oe + 10] = F.z, me[oe + 11] = F.w, k = De[l.a], O = De[l.b], D = De[l.c], fe[oe] = k.x, fe[oe + 1] = k.y, fe[oe + 2] = k.z, fe[oe + 3] = k.w, fe[oe + 4] = O.x, fe[oe + 5] = O.y, fe[oe + 6] = O.z, fe[oe + 7] = O.w, fe[oe + 8] = D.x, fe[oe + 9] = D.y, fe[oe + 10] = D.z, fe[oe + 11] = D.w, oe += 12;
                            oe > 0 && (Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglSkinIndicesBuffer), Re.bufferData(Re.ARRAY_BUFFER, fe, i), Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglSkinWeightsBuffer), Re.bufferData(Re.ARRAY_BUFFER, me, i)) } if (Ae) { for (a = 0, s = Le.length; s > a; a++) l = Fe[Le[a]], p = l.vertexColors, f = l.color, 3 === p.length && o.vertexColors === n.VertexColors ? (A = p[0], E = p[1], P = p[2]) : (A = f, E = f, P = f), pe[ne] = A.r, pe[ne + 1] = A.g, pe[ne + 2] = A.b, pe[ne + 3] = E.r, pe[ne + 4] = E.g, pe[ne + 5] = E.b, pe[ne + 6] = P.r, pe[ne + 7] = P.g, pe[ne + 8] = P.b, ne += 9;
                            ne > 0 && (Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglColorBuffer), Re.bufferData(Re.ARRAY_BUFFER, pe, i)) } if (Ce && be.hasTangents) { for (a = 0, s = Le.length; s > a; a++) l = Fe[Le[a]], m = l.vertexTangents, b = m[0], w = m[1], T = m[2], de[ie] = b.x, de[ie + 1] = b.y, de[ie + 2] = b.z, de[ie + 3] = b.w, de[ie + 4] = w.x, de[ie + 5] = w.y, de[ie + 6] = w.z, de[ie + 7] = w.w, de[ie + 8] = T.x, de[ie + 9] = T.y, de[ie + 10] = T.z, de[ie + 11] = T.w, ie += 12;
                            Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglTangentBuffer), Re.bufferData(Re.ARRAY_BUFFER, de, i) } if (Se) { for (a = 0, s = Le.length; s > a; a++)
                                if (l = Fe[Le[a]], u = l.vertexNormals, d = l.normal, 3 === u.length && K === !1)
                                    for (B = 0; 3 > B; B++) z = u[B], ue[te] = z.x, ue[te + 1] = z.y, ue[te + 2] = z.z, te += 3;
                                else
                                    for (B = 0; 3 > B; B++) ue[te] = d.x, ue[te + 1] = d.y, ue[te + 2] = d.z, te += 3;
                            Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglNormalBuffer), Re.bufferData(Re.ARRAY_BUFFER, ue, i) } if (Me && ke) { for (a = 0, s = Le.length; s > a; a++)
                                if (h = Le[a], g = ke[h], void 0 !== g)
                                    for (B = 0; 3 > B; B++) N = g[B], le[J] = N.x, le[J + 1] = N.y, J += 2;
                            J > 0 && (Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglUVBuffer), Re.bufferData(Re.ARRAY_BUFFER, le, i)) } if (Me && Oe) { for (a = 0, s = Le.length; s > a; a++)
                                if (h = Le[a], v = Oe[h], void 0 !== v)
                                    for (B = 0; 3 > B; B++) V = v[B], ce[$] = V.x, ce[$ + 1] = V.y, $ += 2;
                            $ > 0 && (Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglUV2Buffer), Re.bufferData(Re.ARRAY_BUFFER, ce, i)) } if (Te) { for (a = 0, s = Le.length; s > a; a++) _e[ee] = Z, _e[ee + 1] = Z + 1, _e[ee + 2] = Z + 2, ee += 3, xe[re] = Z, xe[re + 1] = Z + 1, xe[re + 2] = Z, xe[re + 3] = Z + 2, xe[re + 4] = Z + 1, xe[re + 5] = Z + 2, re += 6, Z += 3;
                            Re.bindBuffer(Re.ELEMENT_ARRAY_BUFFER, e.__webglFaceBuffer), Re.bufferData(Re.ELEMENT_ARRAY_BUFFER, _e, i), Re.bindBuffer(Re.ELEMENT_ARRAY_BUFFER, e.__webglLineBuffer), Re.bufferData(Re.ELEMENT_ARRAY_BUFFER, xe, i) } if (ye)
                            for (B = 0, U = ye.length; U > B; B++)
                                if (q = ye[B], q.__original.needsUpdate) { if (se = 0, 1 === q.size) { if (void 0 === q.boundTo || "vertices" === q.boundTo)
                                            for (a = 0, s = Le.length; s > a; a++) l = Fe[Le[a]], q.array[se] = q.value[l.a], q.array[se + 1] = q.value[l.b], q.array[se + 2] = q.value[l.c], se += 3;
                                        else if ("faces" === q.boundTo)
                                            for (a = 0, s = Le.length; s > a; a++) Y = q.value[Le[a]], q.array[se] = Y, q.array[se + 1] = Y, q.array[se + 2] = Y, se += 3 } else if (2 === q.size) { if (void 0 === q.boundTo || "vertices" === q.boundTo)
                                            for (a = 0, s = Le.length; s > a; a++) l = Fe[Le[a]], y = q.value[l.a], _ = q.value[l.b], x = q.value[l.c], q.array[se] = y.x, q.array[se + 1] = y.y, q.array[se + 2] = _.x, q.array[se + 3] = _.y, q.array[se + 4] = x.x, q.array[se + 5] = x.y, se += 6;
                                        else if ("faces" === q.boundTo)
                                            for (a = 0, s = Le.length; s > a; a++) Y = q.value[Le[a]], y = Y, _ = Y, x = Y, q.array[se] = y.x, q.array[se + 1] = y.y, q.array[se + 2] = _.x, q.array[se + 3] = _.y, q.array[se + 4] = x.x, q.array[se + 5] = x.y, se += 6 } else if (3 === q.size) { var Ne; if (Ne = "c" === q.type ? ["r", "g", "b"] : ["x", "y", "z"], void 0 === q.boundTo || "vertices" === q.boundTo)
                                            for (a = 0, s = Le.length; s > a; a++) l = Fe[Le[a]], y = q.value[l.a], _ = q.value[l.b], x = q.value[l.c], q.array[se] = y[Ne[0]], q.array[se + 1] = y[Ne[1]], q.array[se + 2] = y[Ne[2]], q.array[se + 3] = _[Ne[0]], q.array[se + 4] = _[Ne[1]], q.array[se + 5] = _[Ne[2]], q.array[se + 6] = x[Ne[0]], q.array[se + 7] = x[Ne[1]], q.array[se + 8] = x[Ne[2]], se += 9;
                                        else if ("faces" === q.boundTo)
                                            for (a = 0, s = Le.length; s > a; a++) Y = q.value[Le[a]], y = Y, _ = Y, x = Y, q.array[se] = y[Ne[0]], q.array[se + 1] = y[Ne[1]], q.array[se + 2] = y[Ne[2]], q.array[se + 3] = _[Ne[0]], q.array[se + 4] = _[Ne[1]], q.array[se + 5] = _[Ne[2]], q.array[se + 6] = x[Ne[0]], q.array[se + 7] = x[Ne[1]], q.array[se + 8] = x[Ne[2]], se += 9;
                                        else if ("faceVertices" === q.boundTo)
                                            for (a = 0, s = Le.length; s > a; a++) Y = q.value[Le[a]], y = Y[0], _ = Y[1], x = Y[2], q.array[se] = y[Ne[0]], q.array[se + 1] = y[Ne[1]], q.array[se + 2] = y[Ne[2]], q.array[se + 3] = _[Ne[0]], q.array[se + 4] = _[Ne[1]], q.array[se + 5] = _[Ne[2]], q.array[se + 6] = x[Ne[0]], q.array[se + 7] = x[Ne[1]], q.array[se + 8] = x[Ne[2]], se += 9 } else if (4 === q.size)
                                        if (void 0 === q.boundTo || "vertices" === q.boundTo)
                                            for (a = 0, s = Le.length; s > a; a++) l = Fe[Le[a]], y = q.value[l.a], _ = q.value[l.b], x = q.value[l.c], q.array[se] = y.x, q.array[se + 1] = y.y, q.array[se + 2] = y.z, q.array[se + 3] = y.w, q.array[se + 4] = _.x, q.array[se + 5] = _.y, q.array[se + 6] = _.z, q.array[se + 7] = _.w, q.array[se + 8] = x.x, q.array[se + 9] = x.y, q.array[se + 10] = x.z, q.array[se + 11] = x.w, se += 12;
                                        else if ("faces" === q.boundTo)
                                        for (a = 0, s = Le.length; s > a; a++) Y = q.value[Le[a]], y = Y, _ = Y, x = Y, q.array[se] = y.x, q.array[se + 1] = y.y, q.array[se + 2] = y.z, q.array[se + 3] = y.w, q.array[se + 4] = _.x, q.array[se + 5] = _.y, q.array[se + 6] = _.z, q.array[se + 7] = _.w, q.array[se + 8] = x.x, q.array[se + 9] = x.y, q.array[se + 10] = x.z, q.array[se + 11] = x.w, se += 12;
                                    else if ("faceVertices" === q.boundTo)
                                        for (a = 0, s = Le.length; s > a; a++) Y = q.value[Le[a]], y = Y[0], _ = Y[1], x = Y[2], q.array[se] = y.x, q.array[se + 1] = y.y, q.array[se + 2] = y.z, q.array[se + 3] = y.w, q.array[se + 4] = _.x, q.array[se + 5] = _.y, q.array[se + 6] = _.z, q.array[se + 7] = _.w, q.array[se + 8] = x.x, q.array[se + 9] = x.y, q.array[se + 10] = x.z, q.array[se + 11] = x.w, se += 12;
                                    Re.bindBuffer(Re.ARRAY_BUFFER, q.buffer), Re.bufferData(Re.ARRAY_BUFFER, q.array, i) } r && (delete e.__inittedArrays, delete e.__colorArray, delete e.__normalArray, delete e.__tangentArray, delete e.__uvArray, delete e.__uv2Array, delete e.__faceArray, delete e.__vertexArray, delete e.__lineArray, delete e.__skinIndexArray, delete e.__skinWeightArray) } }

                function f(e, t, i, r) { for (var n = i.attributes, o = t.attributes, a = t.attributesKeys, s = 0, h = a.length; h > s; s++) { var l = a[s],
                            c = o[l]; if (c >= 0) { var u = n[l]; if (void 0 !== u) { var d = u.itemSize;
                                Re.bindBuffer(Re.ARRAY_BUFFER, u.buffer), et.enableAttribute(c), Re.vertexAttribPointer(c, d, Re.FLOAT, !1, 0, r * d * 4) } else void 0 !== e.defaultAttributeValues && (2 === e.defaultAttributeValues[l].length ? Re.vertexAttrib2fv(c, e.defaultAttributeValues[l]) : 3 === e.defaultAttributeValues[l].length && Re.vertexAttrib3fv(c, e.defaultAttributeValues[l])) } } et.disableUnusedAttributes() }

                function m(e, t, i) { var r = e.program.attributes; if (-1 !== i.morphTargetBase && r.position >= 0 ? (Re.bindBuffer(Re.ARRAY_BUFFER, t.__webglMorphTargetsBuffers[i.morphTargetBase]), et.enableAttribute(r.position), Re.vertexAttribPointer(r.position, 3, Re.FLOAT, !1, 0, 0)) : r.position >= 0 && (Re.bindBuffer(Re.ARRAY_BUFFER, t.__webglVertexBuffer), et.enableAttribute(r.position), Re.vertexAttribPointer(r.position, 3, Re.FLOAT, !1, 0, 0)), i.morphTargetForcedOrder.length)
                        for (var n, o = 0, a = i.morphTargetForcedOrder, s = i.morphTargetInfluences; o < e.numSupportedMorphTargets && o < a.length;) n = r["morphTarget" + o], n >= 0 && (Re.bindBuffer(Re.ARRAY_BUFFER, t.__webglMorphTargetsBuffers[a[o]]), et.enableAttribute(n), Re.vertexAttribPointer(n, 3, Re.FLOAT, !1, 0, 0)), n = r["morphNormal" + o], n >= 0 && e.morphNormals && (Re.bindBuffer(Re.ARRAY_BUFFER, t.__webglMorphNormalsBuffers[a[o]]), et.enableAttribute(n), Re.vertexAttribPointer(n, 3, Re.FLOAT, !1, 0, 0)), i.__webglMorphTargetInfluences[o] = s[a[o]], o++;
                    else { var h = [],
                            s = i.morphTargetInfluences,
                            l = i.geometry.morphTargets;
                        s.length > l.length && (console.warn("THREE.WebGLRenderer: Influences array is bigger than morphTargets array."), s.length = l.length); for (var c = 0, u = s.length; u > c; c++) { var d = s[c];
                            h.push([d, c]) } h.length > e.numSupportedMorphTargets ? (h.sort(y), h.length = e.numSupportedMorphTargets) : h.length > e.numSupportedMorphNormals ? h.sort(y) : 0 === h.length && h.push([0, 0]); for (var n, o = 0, p = e.numSupportedMorphTargets; p > o; o++)
                            if (h[o]) { var f = h[o][1];
                                n = r["morphTarget" + o], n >= 0 && (Re.bindBuffer(Re.ARRAY_BUFFER, t.__webglMorphTargetsBuffers[f]), et.enableAttribute(n), Re.vertexAttribPointer(n, 3, Re.FLOAT, !1, 0, 0)), n = r["morphNormal" + o], n >= 0 && e.morphNormals && (Re.bindBuffer(Re.ARRAY_BUFFER, t.__webglMorphNormalsBuffers[f]), et.enableAttribute(n), Re.vertexAttribPointer(n, 3, Re.FLOAT, !1, 0, 0)), i.__webglMorphTargetInfluences[o] = s[f] } else i.__webglMorphTargetInfluences[o] = 0 } null !== e.program.uniforms.morphTargetInfluences && Re.uniform1fv(e.program.uniforms.morphTargetInfluences, i.__webglMorphTargetInfluences) }

                function g(e, t) { return e.object.renderOrder !== t.object.renderOrder ? e.object.renderOrder - t.object.renderOrder : e.material.id !== t.material.id ? e.material.id - t.material.id : e.z !== t.z ? e.z - t.z : e.id - t.id }

                function v(e, t) { return e.object.renderOrder !== t.object.renderOrder ? e.object.renderOrder - t.object.renderOrder : e.z !== t.z ? t.z - e.z : e.id - t.id }

                function y(e, t) { return t[0] - e[0] }

                function _(e) { if (e.visible !== !1) { if (e instanceof n.Scene || e instanceof n.Group);
                        else if (M(e), e instanceof n.Light) Me.push(e);
                        else if (e instanceof n.Sprite) Pe.push(e);
                        else if (e instanceof n.LensFlare) Le.push(e);
                        else { var t = Se[e.id]; if (t && (e.frustumCulled === !1 || Xe.intersectsObject(e) === !0))
                                for (var i = 0, r = t.length; r > i; i++) { var o = t[i];
                                    T(o), o.render = !0, Fe.sortObjects === !0 && (qe.setFromMatrixPosition(e.matrixWorld), qe.applyProjection(Ye), o.z = qe.z) } } for (var i = 0, r = e.children.length; r > i; i++) _(e.children[i]) } }

                function x(e, t, i, r, o) { for (var a, s = 0, h = e.length; h > s; s++) { var l = e[s],
                            c = l.object,
                            u = l.buffer; if (Z(c, t), o) a = o;
                        else { if (a = l.material, !a) continue;
                            D(a) } Fe.setMaterialFaces(a), u instanceof n.BufferGeometry ? Fe.renderBufferDirect(t, i, r, a, u, c) : Fe.renderBuffer(t, i, r, a, u, c) } }

                function b(e, t, i, r, n, o) { for (var a, s = 0, h = e.length; h > s; s++) { var l = e[s],
                            c = l.object; if (c.visible) { if (o) a = o;
                            else { if (a = l[t], !a) continue;
                                D(a) } Fe.renderImmediateObject(i, r, n, a, c) } } }

                function w(e) { var t = e.object,
                        i = t.material;
                    i.transparent ? (e.transparent = i, e.opaque = null) : (e.opaque = i, e.transparent = null) }

                function T(e) { var t = e.object,
                        i = e.buffer,
                        r = t.geometry,
                        o = t.material; if (o instanceof n.MeshFaceMaterial) { var a = r instanceof n.BufferGeometry ? 0 : i.materialIndex;
                        o = o.materials[a], e.material = o, o.transparent ? Ee.push(e) : Ae.push(e) } else o && (e.material = o, o.transparent ? Ee.push(e) : Ae.push(e)) }

                function M(e) { void 0 === e.__webglInit && (e.__webglInit = !0, e._modelViewMatrix = new n.Matrix4, e._normalMatrix = new n.Matrix3, e.addEventListener("removed", bt)); var r = e.geometry; if (void 0 === r || void 0 === r.__webglInit && (r.__webglInit = !0, r.addEventListener("dispose", wt), r instanceof n.BufferGeometry ? Fe.info.memory.geometries++ : e instanceof n.Mesh ? C(e, r) : e instanceof n.Line ? void 0 === r.__webglVertexBuffer && (i(r), s(r, e), r.verticesNeedUpdate = !0, r.colorsNeedUpdate = !0, r.lineDistancesNeedUpdate = !0) : e instanceof n.PointCloud && void 0 === r.__webglVertexBuffer && (t(r), a(r, e), r.verticesNeedUpdate = !0, r.colorsNeedUpdate = !0)), void 0 === e.__webglActive)
                        if (e.__webglActive = !0, e instanceof n.Mesh) { if (r instanceof n.BufferGeometry) A(Se, r, e);
                            else if (r instanceof n.Geometry)
                                for (var o = Rt[r.id], h = 0, l = o.length; l > h; h++) A(Se, o[h], e) } else e instanceof n.Line || e instanceof n.PointCloud ? A(Se, r, e) : (e instanceof n.ImmediateRenderObject || e.immediateRenderCallback) && E(Ce, e) }

                function S(e, t) { for (var i, r, n = tt.get("OES_element_index_uint") ? 4294967296 : 65535, o = {}, a = e.morphTargets.length, s = e.morphNormals.length, h = {}, l = [], c = 0, u = e.faces.length; u > c; c++) { var d = e.faces[c],
                            p = t ? d.materialIndex : 0;
                        p in o || (o[p] = { hash: p, counter: 0 }), i = o[p].hash + "_" + o[p].counter, i in h || (r = { id: Ft++, faces3: [], materialIndex: p, vertices: 0, numMorphTargets: a, numMorphNormals: s }, h[i] = r, l.push(r)), h[i].vertices + 3 > n && (o[p].counter += 1, i = o[p].hash + "_" + o[p].counter, i in h || (r = { id: Ft++, faces3: [], materialIndex: p, vertices: 0, numMorphTargets: a, numMorphNormals: s }, h[i] = r, l.push(r))), h[i].faces3.push(c), h[i].vertices += 3 } return l }

                function C(e, t) { var i = e.material,
                        o = !1;
                    (void 0 === Rt[t.id] || t.groupsNeedUpdate === !0) && (delete Se[e.id], Rt[t.id] = S(t, i instanceof n.MeshFaceMaterial), t.groupsNeedUpdate = !1); for (var a = Rt[t.id], s = 0, l = a.length; l > s; s++) { var c = a[s];
                        void 0 === c.__webglVertexBuffer ? (r(c), h(c, e), t.verticesNeedUpdate = !0, t.morphTargetsNeedUpdate = !0, t.elementsNeedUpdate = !0, t.uvsNeedUpdate = !0, t.normalsNeedUpdate = !0, t.tangentsNeedUpdate = !0, t.colorsNeedUpdate = !0, o = !0) : o = !1, (o || void 0 === e.__webglActive) && A(Se, c, e) } e.__webglActive = !0 }

                function A(e, t, i) { var r = i.id;
                    e[r] = e[r] || [], e[r].push({ id: r, buffer: t, object: i, material: null, z: 0 }) }

                function E(e, t) { e.push({ id: null, object: t, opaque: null, transparent: null, z: 0 }) }

                function P(e) { var t = e.geometry; if (t instanceof n.BufferGeometry)
                        for (var i = t.attributes, r = t.attributesKeys, o = 0, a = r.length; a > o; o++) { var s = r[o],
                                h = i[s],
                                c = "index" === s ? Re.ELEMENT_ARRAY_BUFFER : Re.ARRAY_BUFFER;
                            void 0 === h.buffer ? (h.buffer = Re.createBuffer(), Re.bindBuffer(c, h.buffer), Re.bufferData(c, h.array, h instanceof n.DynamicBufferAttribute ? Re.DYNAMIC_DRAW : Re.STATIC_DRAW), h.needsUpdate = !1) : h.needsUpdate === !0 && (Re.bindBuffer(c, h.buffer), void 0 === h.updateRange || -1 === h.updateRange.count ? Re.bufferSubData(c, 0, h.array) : 0 === h.updateRange.count ? console.error("THREE.WebGLRenderer.updateObject: using updateRange for THREE.DynamicBufferAttribute and marked as needsUpdate but count is 0, ensure you are using set methods or updating manually.") : (Re.bufferSubData(c, h.updateRange.offset * h.array.BYTES_PER_ELEMENT, h.array.subarray(h.updateRange.offset, h.updateRange.offset + h.updateRange.count)), h.updateRange.count = 0), h.needsUpdate = !1) } else if (e instanceof n.Mesh) { t.groupsNeedUpdate === !0 && C(e, t); for (var f = Rt[t.id], o = 0, m = f.length; m > o; o++) { var g = f[o],
                                    v = l(e, g),
                                    y = v.attributes && L(v);
                                (t.verticesNeedUpdate || t.morphTargetsNeedUpdate || t.elementsNeedUpdate || t.uvsNeedUpdate || t.normalsNeedUpdate || t.colorsNeedUpdate || t.tangentsNeedUpdate || y) && p(g, e, Re.DYNAMIC_DRAW, !t.dynamic, v) } t.verticesNeedUpdate = !1, t.morphTargetsNeedUpdate = !1, t.elementsNeedUpdate = !1, t.uvsNeedUpdate = !1, t.normalsNeedUpdate = !1, t.colorsNeedUpdate = !1, t.tangentsNeedUpdate = !1, v.attributes && R(v) } else if (e instanceof n.Line) { var v = l(e, t),
                            y = v.attributes && L(v);
                        (t.verticesNeedUpdate || t.colorsNeedUpdate || t.lineDistancesNeedUpdate || y) && d(t, Re.DYNAMIC_DRAW), t.verticesNeedUpdate = !1, t.colorsNeedUpdate = !1, t.lineDistancesNeedUpdate = !1, v.attributes && R(v) } else if (e instanceof n.PointCloud) { var v = l(e, t),
                            y = v.attributes && L(v);
                        (t.verticesNeedUpdate || t.colorsNeedUpdate || y) && u(t, Re.DYNAMIC_DRAW, e), t.verticesNeedUpdate = !1, t.colorsNeedUpdate = !1, v.attributes && R(v) } }

                function L(e) { for (var t in e.attributes)
                        if (e.attributes[t].needsUpdate) return !0; return !1 }

                function R(e) { for (var t in e.attributes) e.attributes[t].needsUpdate = !1 }

                function F(e) { e instanceof n.Mesh || e instanceof n.PointCloud || e instanceof n.Line ? delete Se[e.id] : (e instanceof n.ImmediateRenderObject || e.immediateRenderCallback) && k(Ce, e), delete e.__webglInit, delete e._modelViewMatrix, delete e._normalMatrix, delete e.__webglActive }

                function k(e, t) { for (var i = e.length - 1; i >= 0; i--) e[i].object === t && e.splice(i, 1) }

                function O(e, t, i, r) { e.addEventListener("dispose", St); var o = kt[e.type]; if (o) { var a = n.ShaderLib[o];
                        e.__webglShader = { uniforms: n.UniformsUtils.clone(a.uniforms), vertexShader: a.vertexShader, fragmentShader: a.fragmentShader } } else e.__webglShader = { uniforms: e.uniforms, vertexShader: e.vertexShader, fragmentShader: e.fragmentShader }; var s = le(t),
                        h = ce(t),
                        l = he(r),
                        c = { precision: fe, supportsVertexTextures: lt, map: !!e.map, envMap: !!e.envMap, envMapMode: e.envMap && e.envMap.mapping, lightMap: !!e.lightMap, bumpMap: !!e.bumpMap, normalMap: !!e.normalMap, specularMap: !!e.specularMap, alphaMap: !!e.alphaMap, combine: e.combine, vertexColors: e.vertexColors, fog: i, useFog: e.fog, fogExp: i instanceof n.FogExp2, flatShading: e.shading === n.FlatShading, sizeAttenuation: e.sizeAttenuation, logarithmicDepthBuffer: be, skinning: e.skinning, maxBones: l, useVertexTexture: ct && r && r.skeleton && r.skeleton.useVertexTexture, morphTargets: e.morphTargets, morphNormals: e.morphNormals, maxMorphTargets: Fe.maxMorphTargets, maxMorphNormals: Fe.maxMorphNormals, maxDirLights: s.directional, maxPointLights: s.point, maxSpotLights: s.spot, maxHemiLights: s.hemi, maxShadows: h, shadowMapEnabled: Fe.shadowMapEnabled && r.receiveShadow && h > 0, shadowMapType: Fe.shadowMapType, shadowMapDebug: Fe.shadowMapDebug, shadowMapCascade: Fe.shadowMapCascade, alphaTest: e.alphaTest, metal: e.metal, wrapAround: e.wrapAround, doubleSided: e.side === n.DoubleSide, flipSided: e.side === n.BackSide },
                        u = []; if (o ? u.push(o) : (u.push(e.fragmentShader), u.push(e.vertexShader)), void 0 !== e.defines)
                        for (var d in e.defines) u.push(d), u.push(e.defines[d]); for (var d in c) u.push(d), u.push(c[d]); for (var p, f = u.join(), m = 0, g = ke.length; g > m; m++) { var v = ke[m]; if (v.code === f) { p = v, p.usedTimes++; break } } void 0 === p && (p = new n.WebGLProgram(Fe, f, e, c), ke.push(p), Fe.info.memory.programs = ke.length), e.program = p; var y = p.attributes; if (e.morphTargets) { e.numSupportedMorphTargets = 0; for (var _, x = "morphTarget", b = 0; b < Fe.maxMorphTargets; b++) _ = x + b, y[_] >= 0 && e.numSupportedMorphTargets++ } if (e.morphNormals) { e.numSupportedMorphNormals = 0; var _, x = "morphNormal"; for (b = 0; b < Fe.maxMorphNormals; b++) _ = x + b, y[_] >= 0 && e.numSupportedMorphNormals++ } e.uniformsList = []; for (var w in e.__webglShader.uniforms) { var T = e.program.uniforms[w];
                        T && e.uniformsList.push([e.__webglShader.uniforms[w], T]) } }

                function D(e) { e.transparent === !0 ? et.setBlending(e.blending, e.blendEquation, e.blendSrc, e.blendDst, e.blendEquationAlpha, e.blendSrcAlpha, e.blendDstAlpha) : et.setBlending(n.NoBlending), et.setDepthTest(e.depthTest), et.setDepthWrite(e.depthWrite), et.setColorWrite(e.colorWrite), et.setPolygonOffset(e.polygonOffset, e.polygonOffsetFactor, e.polygonOffsetUnits) }

                function B(e, t, i, r, o) {
                    Ne = 0, r.needsUpdate && (r.program && Lt(r), O(r, t, i, o), r.needsUpdate = !1), r.morphTargets && (o.__webglMorphTargetInfluences || (o.__webglMorphTargetInfluences = new Float32Array(Fe.maxMorphTargets)));
                    var a = !1,
                        s = !1,
                        h = !1,
                        l = r.program,
                        c = l.uniforms,
                        u = r.__webglShader.uniforms;
                    if (l.id !== Oe && (Re.useProgram(l.program), Oe = l.id, a = !0, s = !0, h = !0), r.id !== Be && (-1 === Be && (h = !0), Be = r.id, s = !0), (a || e !== ze) && (Re.uniformMatrix4fv(c.projectionMatrix, !1, e.projectionMatrix.elements),
                            be && Re.uniform1f(c.logDepthBufFC, 2 / (Math.log(e.far + 1) / Math.LN2)), e !== ze && (ze = e), (r instanceof n.ShaderMaterial || r instanceof n.MeshPhongMaterial || r.envMap) && null !== c.cameraPosition && (qe.setFromMatrixPosition(e.matrixWorld), Re.uniform3f(c.cameraPosition, qe.x, qe.y, qe.z)), (r instanceof n.MeshPhongMaterial || r instanceof n.MeshLambertMaterial || r instanceof n.MeshBasicMaterial || r instanceof n.ShaderMaterial || r.skinning) && null !== c.viewMatrix && Re.uniformMatrix4fv(c.viewMatrix, !1, e.matrixWorldInverse.elements)), r.skinning)
                        if (o.bindMatrix && null !== c.bindMatrix && Re.uniformMatrix4fv(c.bindMatrix, !1, o.bindMatrix.elements), o.bindMatrixInverse && null !== c.bindMatrixInverse && Re.uniformMatrix4fv(c.bindMatrixInverse, !1, o.bindMatrixInverse.elements), ct && o.skeleton && o.skeleton.useVertexTexture) { if (null !== c.boneTexture) { var d = q();
                                Re.uniform1i(c.boneTexture, d), Fe.setTexture(o.skeleton.boneTexture, d) } null !== c.boneTextureWidth && Re.uniform1i(c.boneTextureWidth, o.skeleton.boneTextureWidth), null !== c.boneTextureHeight && Re.uniform1i(c.boneTextureHeight, o.skeleton.boneTextureHeight) } else o.skeleton && o.skeleton.boneMatrices && null !== c.boneGlobalMatrices && Re.uniformMatrix4fv(c.boneGlobalMatrices, !1, o.skeleton.boneMatrices);
                    return s && (i && r.fog && I(u, i), (r instanceof n.MeshPhongMaterial || r instanceof n.MeshLambertMaterial || r.lights) && (Ze && (h = !0, J(t), Ze = !1), h ? (j(u, Qe), W(u, !0)) : W(u, !1)), (r instanceof n.MeshBasicMaterial || r instanceof n.MeshLambertMaterial || r instanceof n.MeshPhongMaterial) && U(u, r), r instanceof n.LineBasicMaterial ? z(u, r) : r instanceof n.LineDashedMaterial ? (z(u, r), N(u, r)) : r instanceof n.PointCloudMaterial ? V(u, r) : r instanceof n.MeshPhongMaterial ? G(u, r) : r instanceof n.MeshLambertMaterial ? H(u, r) : r instanceof n.MeshDepthMaterial ? (u.mNear.value = e.near, u.mFar.value = e.far, u.opacity.value = r.opacity) : r instanceof n.MeshNormalMaterial && (u.opacity.value = r.opacity), o.receiveShadow && !r._shadowPass && X(u, t), K(r.uniformsList)), Y(c, o), null !== c.modelMatrix && Re.uniformMatrix4fv(c.modelMatrix, !1, o.matrixWorld.elements), l
                }

                function U(e, t) { e.opacity.value = t.opacity, e.diffuse.value = t.color, e.map.value = t.map, e.lightMap.value = t.lightMap, e.specularMap.value = t.specularMap, e.alphaMap.value = t.alphaMap, t.bumpMap && (e.bumpMap.value = t.bumpMap, e.bumpScale.value = t.bumpScale), t.normalMap && (e.normalMap.value = t.normalMap, e.normalScale.value.copy(t.normalScale)); var i; if (t.map ? i = t.map : t.specularMap ? i = t.specularMap : t.normalMap ? i = t.normalMap : t.bumpMap ? i = t.bumpMap : t.alphaMap && (i = t.alphaMap), void 0 !== i) { var r = i.offset,
                            o = i.repeat;
                        e.offsetRepeat.value.set(r.x, r.y, o.x, o.y) } e.envMap.value = t.envMap, e.flipEnvMap.value = t.envMap instanceof n.WebGLRenderTargetCube ? 1 : -1, e.reflectivity.value = t.reflectivity, e.refractionRatio.value = t.refractionRatio }

                function z(e, t) { e.diffuse.value = t.color, e.opacity.value = t.opacity }

                function N(e, t) { e.dashSize.value = t.dashSize, e.totalSize.value = t.dashSize + t.gapSize, e.scale.value = t.scale }

                function V(e, t) { if (e.psColor.value = t.color, e.opacity.value = t.opacity, e.size.value = t.size, e.scale.value = ue.height / 2, e.map.value = t.map, null !== t.map) { var i = t.map.offset,
                            r = t.map.repeat;
                        e.offsetRepeat.value.set(i.x, i.y, r.x, r.y) } }

                function I(e, t) { e.fogColor.value = t.color, t instanceof n.Fog ? (e.fogNear.value = t.near, e.fogFar.value = t.far) : t instanceof n.FogExp2 && (e.fogDensity.value = t.density) }

                function G(e, t) { e.shininess.value = t.shininess, e.emissive.value = t.emissive, e.specular.value = t.specular, t.wrapAround && e.wrapRGB.value.copy(t.wrapRGB) }

                function H(e, t) { e.emissive.value = t.emissive, t.wrapAround && e.wrapRGB.value.copy(t.wrapRGB) }

                function j(e, t) { e.ambientLightColor.value = t.ambient, e.directionalLightColor.value = t.directional.colors, e.directionalLightDirection.value = t.directional.positions, e.pointLightColor.value = t.point.colors, e.pointLightPosition.value = t.point.positions, e.pointLightDistance.value = t.point.distances, e.pointLightDecay.value = t.point.decays, e.spotLightColor.value = t.spot.colors, e.spotLightPosition.value = t.spot.positions, e.spotLightDistance.value = t.spot.distances, e.spotLightDirection.value = t.spot.directions, e.spotLightAngleCos.value = t.spot.anglesCos, e.spotLightExponent.value = t.spot.exponents, e.spotLightDecay.value = t.spot.decays, e.hemisphereLightSkyColor.value = t.hemi.skyColors, e.hemisphereLightGroundColor.value = t.hemi.groundColors, e.hemisphereLightDirection.value = t.hemi.positions }

                function W(e, t) { e.ambientLightColor.needsUpdate = t, e.directionalLightColor.needsUpdate = t, e.directionalLightDirection.needsUpdate = t, e.pointLightColor.needsUpdate = t, e.pointLightPosition.needsUpdate = t, e.pointLightDistance.needsUpdate = t, e.pointLightDecay.needsUpdate = t, e.spotLightColor.needsUpdate = t, e.spotLightPosition.needsUpdate = t, e.spotLightDistance.needsUpdate = t, e.spotLightDirection.needsUpdate = t, e.spotLightAngleCos.needsUpdate = t, e.spotLightExponent.needsUpdate = t, e.spotLightDecay.needsUpdate = t, e.hemisphereLightSkyColor.needsUpdate = t, e.hemisphereLightGroundColor.needsUpdate = t, e.hemisphereLightDirection.needsUpdate = t }

                function X(e, t) { if (e.shadowMatrix)
                        for (var i = 0, r = 0, o = t.length; o > r; r++) { var a = t[r];
                            a.castShadow && (a instanceof n.SpotLight || a instanceof n.DirectionalLight && !a.shadowCascade) && (e.shadowMap.value[i] = a.shadowMap, e.shadowMapSize.value[i] = a.shadowMapSize, e.shadowMatrix.value[i] = a.shadowMatrix, e.shadowDarkness.value[i] = a.shadowDarkness, e.shadowBias.value[i] = a.shadowBias, i++) } }

                function Y(e, t) { Re.uniformMatrix4fv(e.modelViewMatrix, !1, t._modelViewMatrix.elements), e.normalMatrix && Re.uniformMatrix3fv(e.normalMatrix, !1, t._normalMatrix.elements) }

                function q() { var e = Ne; return e >= ot && n.warn("WebGLRenderer: trying to use " + e + " texture units while this GPU supports only " + ot), Ne += 1, e }

                function K(e) { for (var t, i, r, o = 0, a = e.length; a > o; o++) { var s = e[o][0]; if (s.needsUpdate !== !1) { var h = s.type,
                                l = s.value,
                                c = e[o][1]; switch (h) {
                                case "1i":
                                    Re.uniform1i(c, l); break;
                                case "1f":
                                    Re.uniform1f(c, l); break;
                                case "2f":
                                    Re.uniform2f(c, l[0], l[1]); break;
                                case "3f":
                                    Re.uniform3f(c, l[0], l[1], l[2]); break;
                                case "4f":
                                    Re.uniform4f(c, l[0], l[1], l[2], l[3]); break;
                                case "1iv":
                                    Re.uniform1iv(c, l); break;
                                case "3iv":
                                    Re.uniform3iv(c, l); break;
                                case "1fv":
                                    Re.uniform1fv(c, l); break;
                                case "2fv":
                                    Re.uniform2fv(c, l); break;
                                case "3fv":
                                    Re.uniform3fv(c, l); break;
                                case "4fv":
                                    Re.uniform4fv(c, l); break;
                                case "Matrix3fv":
                                    Re.uniformMatrix3fv(c, !1, l); break;
                                case "Matrix4fv":
                                    Re.uniformMatrix4fv(c, !1, l); break;
                                case "i":
                                    Re.uniform1i(c, l); break;
                                case "f":
                                    Re.uniform1f(c, l); break;
                                case "v2":
                                    Re.uniform2f(c, l.x, l.y); break;
                                case "v3":
                                    Re.uniform3f(c, l.x, l.y, l.z); break;
                                case "v4":
                                    Re.uniform4f(c, l.x, l.y, l.z, l.w); break;
                                case "c":
                                    Re.uniform3f(c, l.r, l.g, l.b); break;
                                case "iv1":
                                    Re.uniform1iv(c, l); break;
                                case "iv":
                                    Re.uniform3iv(c, l); break;
                                case "fv1":
                                    Re.uniform1fv(c, l); break;
                                case "fv":
                                    Re.uniform3fv(c, l); break;
                                case "v2v":
                                    void 0 === s._array && (s._array = new Float32Array(2 * l.length)); for (var u = 0, d = l.length; d > u; u++) r = 2 * u, s._array[r] = l[u].x, s._array[r + 1] = l[u].y;
                                    Re.uniform2fv(c, s._array); break;
                                case "v3v":
                                    void 0 === s._array && (s._array = new Float32Array(3 * l.length)); for (var u = 0, d = l.length; d > u; u++) r = 3 * u, s._array[r] = l[u].x, s._array[r + 1] = l[u].y, s._array[r + 2] = l[u].z;
                                    Re.uniform3fv(c, s._array); break;
                                case "v4v":
                                    void 0 === s._array && (s._array = new Float32Array(4 * l.length)); for (var u = 0, d = l.length; d > u; u++) r = 4 * u, s._array[r] = l[u].x, s._array[r + 1] = l[u].y, s._array[r + 2] = l[u].z, s._array[r + 3] = l[u].w;
                                    Re.uniform4fv(c, s._array); break;
                                case "m3":
                                    Re.uniformMatrix3fv(c, !1, l.elements); break;
                                case "m3v":
                                    void 0 === s._array && (s._array = new Float32Array(9 * l.length)); for (var u = 0, d = l.length; d > u; u++) l[u].flattenToArrayOffset(s._array, 9 * u);
                                    Re.uniformMatrix3fv(c, !1, s._array); break;
                                case "m4":
                                    Re.uniformMatrix4fv(c, !1, l.elements); break;
                                case "m4v":
                                    void 0 === s._array && (s._array = new Float32Array(16 * l.length)); for (var u = 0, d = l.length; d > u; u++) l[u].flattenToArrayOffset(s._array, 16 * u);
                                    Re.uniformMatrix4fv(c, !1, s._array); break;
                                case "t":
                                    if (t = l, i = q(), Re.uniform1i(c, i), !t) continue;
                                    t instanceof n.CubeTexture || t.image instanceof Array && 6 === t.image.length ? te(t, i) : t instanceof n.WebGLRenderTargetCube ? ie(t, i) : Fe.setTexture(t, i); break;
                                case "tv":
                                    void 0 === s._array && (s._array = []); for (var u = 0, d = s.value.length; d > u; u++) s._array[u] = q();
                                    Re.uniform1iv(c, s._array); for (var u = 0, d = s.value.length; d > u; u++) t = s.value[u], i = s._array[u], t && Fe.setTexture(t, i); break;
                                default:
                                    n.warn("THREE.WebGLRenderer: Unknown uniform type: " + h) } } } }

                function Z(e, t) { e._modelViewMatrix.multiplyMatrices(t.matrixWorldInverse, e.matrixWorld), e._normalMatrix.getNormalMatrix(e._modelViewMatrix) }

                function Q(e, t, i, r) { e[t] = i.r * r, e[t + 1] = i.g * r, e[t + 2] = i.b * r }

                function J(e) { var t, i, r, o, a, s, h, l, c = 0,
                        u = 0,
                        d = 0,
                        p = Qe,
                        f = p.directional.colors,
                        m = p.directional.positions,
                        g = p.point.colors,
                        v = p.point.positions,
                        y = p.point.distances,
                        _ = p.point.decays,
                        x = p.spot.colors,
                        b = p.spot.positions,
                        w = p.spot.distances,
                        T = p.spot.directions,
                        M = p.spot.anglesCos,
                        S = p.spot.exponents,
                        C = p.spot.decays,
                        A = p.hemi.skyColors,
                        E = p.hemi.groundColors,
                        P = p.hemi.positions,
                        L = 0,
                        R = 0,
                        F = 0,
                        k = 0,
                        O = 0,
                        D = 0,
                        B = 0,
                        U = 0,
                        z = 0,
                        N = 0,
                        V = 0,
                        I = 0; for (t = 0, i = e.length; i > t; t++)
                        if (r = e[t], !r.onlyShadow)
                            if (o = r.color, h = r.intensity, l = r.distance, r instanceof n.AmbientLight) { if (!r.visible) continue;
                                c += o.r, u += o.g, d += o.b } else if (r instanceof n.DirectionalLight) { if (O += 1, !r.visible) continue;
                        Ke.setFromMatrixPosition(r.matrixWorld), qe.setFromMatrixPosition(r.target.matrixWorld), Ke.sub(qe), Ke.normalize(), z = 3 * L, m[z] = Ke.x, m[z + 1] = Ke.y, m[z + 2] = Ke.z, Q(f, z, o, h), L += 1 } else if (r instanceof n.PointLight) { if (D += 1, !r.visible) continue;
                        N = 3 * R, Q(g, N, o, h), qe.setFromMatrixPosition(r.matrixWorld), v[N] = qe.x, v[N + 1] = qe.y, v[N + 2] = qe.z, y[R] = l, _[R] = 0 === r.distance ? 0 : r.decay, R += 1 } else if (r instanceof n.SpotLight) { if (B += 1, !r.visible) continue;
                        V = 3 * F, Q(x, V, o, h), Ke.setFromMatrixPosition(r.matrixWorld), b[V] = Ke.x, b[V + 1] = Ke.y, b[V + 2] = Ke.z, w[F] = l, qe.setFromMatrixPosition(r.target.matrixWorld), Ke.sub(qe), Ke.normalize(), T[V] = Ke.x, T[V + 1] = Ke.y, T[V + 2] = Ke.z, M[F] = Math.cos(r.angle), S[F] = r.exponent, C[F] = 0 === r.distance ? 0 : r.decay, F += 1 } else if (r instanceof n.HemisphereLight) { if (U += 1, !r.visible) continue;
                        Ke.setFromMatrixPosition(r.matrixWorld), Ke.normalize(), I = 3 * k, P[I] = Ke.x, P[I + 1] = Ke.y, P[I + 2] = Ke.z, a = r.color, s = r.groundColor, Q(A, I, a, h), Q(E, I, s, h), k += 1 } for (t = 3 * L, i = Math.max(f.length, 3 * O); i > t; t++) f[t] = 0; for (t = 3 * R, i = Math.max(g.length, 3 * D); i > t; t++) g[t] = 0; for (t = 3 * F, i = Math.max(x.length, 3 * B); i > t; t++) x[t] = 0; for (t = 3 * k, i = Math.max(A.length, 3 * U); i > t; t++) A[t] = 0; for (t = 3 * k, i = Math.max(E.length, 3 * U); i > t; t++) E[t] = 0;
                    p.directional.length = L, p.point.length = R, p.spot.length = F, p.hemi.length = k, p.ambient[0] = c, p.ambient[1] = u, p.ambient[2] = d }

                function $(e, t, i) { var r;
                    i ? (Re.texParameteri(e, Re.TEXTURE_WRAP_S, se(t.wrapS)), Re.texParameteri(e, Re.TEXTURE_WRAP_T, se(t.wrapT)), Re.texParameteri(e, Re.TEXTURE_MAG_FILTER, se(t.magFilter)), Re.texParameteri(e, Re.TEXTURE_MIN_FILTER, se(t.minFilter))) : (Re.texParameteri(e, Re.TEXTURE_WRAP_S, Re.CLAMP_TO_EDGE), Re.texParameteri(e, Re.TEXTURE_WRAP_T, Re.CLAMP_TO_EDGE), (t.wrapS !== n.ClampToEdgeWrapping || t.wrapT !== n.ClampToEdgeWrapping) && n.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping. ( " + t.sourceFile + " )"), Re.texParameteri(e, Re.TEXTURE_MAG_FILTER, ae(t.magFilter)), Re.texParameteri(e, Re.TEXTURE_MIN_FILTER, ae(t.minFilter)), t.minFilter !== n.NearestFilter && t.minFilter !== n.LinearFilter && n.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter. ( " + t.sourceFile + " )")), r = tt.get("EXT_texture_filter_anisotropic"), r && t.type !== n.FloatType && t.type !== n.HalfFloatType && (t.anisotropy > 1 || t.__currentAnisotropy) && (Re.texParameterf(e, r.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(t.anisotropy, Fe.getMaxAnisotropy())), t.__currentAnisotropy = t.anisotropy) }

                function ee(e, t) { if (e.width > t || e.height > t) { var i = t / Math.max(e.width, e.height),
                            r = document.createElement("canvas");
                        r.width = Math.floor(e.width * i), r.height = Math.floor(e.height * i); var o = r.getContext("2d"); return o.drawImage(e, 0, 0, e.width, e.height, 0, 0, r.width, r.height), n.warn("THREE.WebGLRenderer: image is too big (" + e.width + "x" + e.height + "). Resized to " + r.width + "x" + r.height, e), r } return e }

                function te(e, t) { if (6 === e.image.length)
                        if (e.needsUpdate) { e.image.__webglTextureCube || (e.addEventListener("dispose", Tt), e.image.__webglTextureCube = Re.createTexture(), Fe.info.memory.textures++), Re.activeTexture(Re.TEXTURE0 + t), Re.bindTexture(Re.TEXTURE_CUBE_MAP, e.image.__webglTextureCube), Re.pixelStorei(Re.UNPACK_FLIP_Y_WEBGL, e.flipY); for (var i = e instanceof n.CompressedTexture, r = e.image[0] instanceof n.DataTexture, o = [], a = 0; 6 > a; a++) !Fe.autoScaleCubemaps || i || r ? o[a] = r ? e.image[a].image : e.image[a] : o[a] = ee(e.image[a], ht); var s = o[0],
                                h = n.Math.isPowerOfTwo(s.width) && n.Math.isPowerOfTwo(s.height),
                                l = se(e.format),
                                c = se(e.type);
                            $(Re.TEXTURE_CUBE_MAP, e, h); for (var a = 0; 6 > a; a++)
                                if (i)
                                    for (var u, d = o[a].mipmaps, p = 0, f = d.length; f > p; p++) u = d[p], e.format !== n.RGBAFormat && e.format !== n.RGBFormat ? mt().indexOf(l) > -1 ? Re.compressedTexImage2D(Re.TEXTURE_CUBE_MAP_POSITIVE_X + a, p, l, u.width, u.height, 0, u.data) : n.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setCubeTexture()") : Re.texImage2D(Re.TEXTURE_CUBE_MAP_POSITIVE_X + a, p, l, u.width, u.height, 0, l, c, u.data);
                                else r ? Re.texImage2D(Re.TEXTURE_CUBE_MAP_POSITIVE_X + a, 0, l, o[a].width, o[a].height, 0, l, c, o[a].data) : Re.texImage2D(Re.TEXTURE_CUBE_MAP_POSITIVE_X + a, 0, l, l, c, o[a]);
                            e.generateMipmaps && h && Re.generateMipmap(Re.TEXTURE_CUBE_MAP), e.needsUpdate = !1, e.onUpdate && e.onUpdate() } else Re.activeTexture(Re.TEXTURE0 + t), Re.bindTexture(Re.TEXTURE_CUBE_MAP, e.image.__webglTextureCube) }

                function ie(e, t) { Re.activeTexture(Re.TEXTURE0 + t), Re.bindTexture(Re.TEXTURE_CUBE_MAP, e.__webglTexture) }

                function re(e, t, i) { Re.bindFramebuffer(Re.FRAMEBUFFER, e), Re.framebufferTexture2D(Re.FRAMEBUFFER, Re.COLOR_ATTACHMENT0, i, t.__webglTexture, 0) }

                function ne(e, t) { Re.bindRenderbuffer(Re.RENDERBUFFER, e), t.depthBuffer && !t.stencilBuffer ? (Re.renderbufferStorage(Re.RENDERBUFFER, Re.DEPTH_COMPONENT16, t.width, t.height), Re.framebufferRenderbuffer(Re.FRAMEBUFFER, Re.DEPTH_ATTACHMENT, Re.RENDERBUFFER, e)) : t.depthBuffer && t.stencilBuffer ? (Re.renderbufferStorage(Re.RENDERBUFFER, Re.DEPTH_STENCIL, t.width, t.height), Re.framebufferRenderbuffer(Re.FRAMEBUFFER, Re.DEPTH_STENCIL_ATTACHMENT, Re.RENDERBUFFER, e)) : Re.renderbufferStorage(Re.RENDERBUFFER, Re.RGBA4, t.width, t.height) }

                function oe(e) { e instanceof n.WebGLRenderTargetCube ? (Re.bindTexture(Re.TEXTURE_CUBE_MAP, e.__webglTexture), Re.generateMipmap(Re.TEXTURE_CUBE_MAP), Re.bindTexture(Re.TEXTURE_CUBE_MAP, null)) : (Re.bindTexture(Re.TEXTURE_2D, e.__webglTexture), Re.generateMipmap(Re.TEXTURE_2D), Re.bindTexture(Re.TEXTURE_2D, null)) }

                function ae(e) { return e === n.NearestFilter || e === n.NearestMipMapNearestFilter || e === n.NearestMipMapLinearFilter ? Re.NEAREST : Re.LINEAR }

                function se(e) { var t; if (e === n.RepeatWrapping) return Re.REPEAT; if (e === n.ClampToEdgeWrapping) return Re.CLAMP_TO_EDGE; if (e === n.MirroredRepeatWrapping) return Re.MIRRORED_REPEAT; if (e === n.NearestFilter) return Re.NEAREST; if (e === n.NearestMipMapNearestFilter) return Re.NEAREST_MIPMAP_NEAREST; if (e === n.NearestMipMapLinearFilter) return Re.NEAREST_MIPMAP_LINEAR; if (e === n.LinearFilter) return Re.LINEAR; if (e === n.LinearMipMapNearestFilter) return Re.LINEAR_MIPMAP_NEAREST; if (e === n.LinearMipMapLinearFilter) return Re.LINEAR_MIPMAP_LINEAR; if (e === n.UnsignedByteType) return Re.UNSIGNED_BYTE; if (e === n.UnsignedShort4444Type) return Re.UNSIGNED_SHORT_4_4_4_4; if (e === n.UnsignedShort5551Type) return Re.UNSIGNED_SHORT_5_5_5_1; if (e === n.UnsignedShort565Type) return Re.UNSIGNED_SHORT_5_6_5; if (e === n.ByteType) return Re.BYTE; if (e === n.ShortType) return Re.SHORT; if (e === n.UnsignedShortType) return Re.UNSIGNED_SHORT; if (e === n.IntType) return Re.INT; if (e === n.UnsignedIntType) return Re.UNSIGNED_INT; if (e === n.FloatType) return Re.FLOAT; if (t = tt.get("OES_texture_half_float"), null !== t && e === n.HalfFloatType) return t.HALF_FLOAT_OES; if (e === n.AlphaFormat) return Re.ALPHA; if (e === n.RGBFormat) return Re.RGB; if (e === n.RGBAFormat) return Re.RGBA; if (e === n.LuminanceFormat) return Re.LUMINANCE; if (e === n.LuminanceAlphaFormat) return Re.LUMINANCE_ALPHA; if (e === n.AddEquation) return Re.FUNC_ADD; if (e === n.SubtractEquation) return Re.FUNC_SUBTRACT; if (e === n.ReverseSubtractEquation) return Re.FUNC_REVERSE_SUBTRACT; if (e === n.ZeroFactor) return Re.ZERO; if (e === n.OneFactor) return Re.ONE; if (e === n.SrcColorFactor) return Re.SRC_COLOR; if (e === n.OneMinusSrcColorFactor) return Re.ONE_MINUS_SRC_COLOR; if (e === n.SrcAlphaFactor) return Re.SRC_ALPHA; if (e === n.OneMinusSrcAlphaFactor) return Re.ONE_MINUS_SRC_ALPHA; if (e === n.DstAlphaFactor) return Re.DST_ALPHA; if (e === n.OneMinusDstAlphaFactor) return Re.ONE_MINUS_DST_ALPHA; if (e === n.DstColorFactor) return Re.DST_COLOR; if (e === n.OneMinusDstColorFactor) return Re.ONE_MINUS_DST_COLOR; if (e === n.SrcAlphaSaturateFactor) return Re.SRC_ALPHA_SATURATE; if (t = tt.get("WEBGL_compressed_texture_s3tc"), null !== t) { if (e === n.RGB_S3TC_DXT1_Format) return t.COMPRESSED_RGB_S3TC_DXT1_EXT; if (e === n.RGBA_S3TC_DXT1_Format) return t.COMPRESSED_RGBA_S3TC_DXT1_EXT; if (e === n.RGBA_S3TC_DXT3_Format) return t.COMPRESSED_RGBA_S3TC_DXT3_EXT; if (e === n.RGBA_S3TC_DXT5_Format) return t.COMPRESSED_RGBA_S3TC_DXT5_EXT } if (t = tt.get("WEBGL_compressed_texture_pvrtc"), null !== t) { if (e === n.RGB_PVRTC_4BPPV1_Format) return t.COMPRESSED_RGB_PVRTC_4BPPV1_IMG; if (e === n.RGB_PVRTC_2BPPV1_Format) return t.COMPRESSED_RGB_PVRTC_2BPPV1_IMG; if (e === n.RGBA_PVRTC_4BPPV1_Format) return t.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG; if (e === n.RGBA_PVRTC_2BPPV1_Format) return t.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG } if (t = tt.get("EXT_blend_minmax"), null !== t) { if (e === n.MinEquation) return t.MIN_EXT; if (e === n.MaxEquation) return t.MAX_EXT } return 0 }

                function he(e) { if (ct && e && e.skeleton && e.skeleton.useVertexTexture) return 1024; var t = Re.getParameter(Re.MAX_VERTEX_UNIFORM_VECTORS),
                        i = Math.floor((t - 20) / 4),
                        r = i; return void 0 !== e && e instanceof n.SkinnedMesh && (r = Math.min(e.skeleton.bones.length, r), r < e.skeleton.bones.length && n.warn("WebGLRenderer: too many bones - " + e.skeleton.bones.length + ", this GPU supports just " + r + " (try OpenGL instead of ANGLE)")), r }

                function le(e) { for (var t = 0, i = 0, r = 0, o = 0, a = 0, s = e.length; s > a; a++) { var h = e[a];
                        h.onlyShadow || h.visible === !1 || (h instanceof n.DirectionalLight && t++, h instanceof n.PointLight && i++, h instanceof n.SpotLight && r++, h instanceof n.HemisphereLight && o++) } return { directional: t, point: i, spot: r, hemi: o } }

                function ce(e) { for (var t = 0, i = 0, r = e.length; r > i; i++) { var o = e[i];
                        o.castShadow && (o instanceof n.SpotLight && t++, o instanceof n.DirectionalLight && !o.shadowCascade && t++) } return t } console.log("THREE.WebGLRenderer", n.REVISION), e = e || {};
                var ue = void 0 !== e.canvas ? e.canvas : document.createElement("canvas"),
                    de = void 0 !== e.context ? e.context : null,
                    pe = 1,
                    fe = void 0 !== e.precision ? e.precision : "highp",
                    me = void 0 !== e.alpha ? e.alpha : !1,
                    ge = void 0 !== e.depth ? e.depth : !0,
                    ve = void 0 !== e.stencil ? e.stencil : !0,
                    ye = void 0 !== e.antialias ? e.antialias : !1,
                    _e = void 0 !== e.premultipliedAlpha ? e.premultipliedAlpha : !0,
                    xe = void 0 !== e.preserveDrawingBuffer ? e.preserveDrawingBuffer : !1,
                    be = void 0 !== e.logarithmicDepthBuffer ? e.logarithmicDepthBuffer : !1,
                    we = new n.Color(0),
                    Te = 0,
                    Me = [],
                    Se = {},
                    Ce = [],
                    Ae = [],
                    Ee = [],
                    Pe = [],
                    Le = [];
                this.domElement = ue, this.context = null, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.gammaFactor = 2, this.gammaInput = !1, this.gammaOutput = !1, this.shadowMapEnabled = !1, this.shadowMapType = n.PCFShadowMap, this.shadowMapCullFace = n.CullFaceFront, this.shadowMapDebug = !1, this.shadowMapCascade = !1, this.maxMorphTargets = 8, this.maxMorphNormals = 4, this.autoScaleCubemaps = !0, this.info = { memory: { programs: 0, geometries: 0, textures: 0 }, render: { calls: 0, vertices: 0, faces: 0, points: 0 } };
                var Re, Fe = this,
                    ke = [],
                    Oe = null,
                    De = null,
                    Be = -1,
                    Ue = "",
                    ze = null,
                    Ne = 0,
                    Ve = 0,
                    Ie = 0,
                    Ge = ue.width,
                    He = ue.height,
                    je = 0,
                    We = 0,
                    Xe = new n.Frustum,
                    Ye = new n.Matrix4,
                    qe = new n.Vector3,
                    Ke = new n.Vector3,
                    Ze = !0,
                    Qe = { ambient: [0, 0, 0], directional: { length: 0, colors: [], positions: [] }, point: { length: 0, colors: [], positions: [], distances: [], decays: [] }, spot: { length: 0, colors: [], positions: [], distances: [], directions: [], anglesCos: [], exponents: [], decays: [] }, hemi: { length: 0, skyColors: [], groundColors: [], positions: [] } };
                try { var Je = { alpha: me, depth: ge, stencil: ve, antialias: ye, premultipliedAlpha: _e, preserveDrawingBuffer: xe }; if (Re = de || ue.getContext("webgl", Je) || ue.getContext("experimental-webgl", Je), null === Re) throw null !== ue.getContext("webgl") ? "Error creating WebGL context with your selected attributes." : "Error creating WebGL context.";
                    ue.addEventListener("webglcontextlost", function(e) { e.preventDefault(), nt(), rt(), Se = {} }, !1) } catch ($e) { n.error("THREE.WebGLRenderer: " + $e) }
                var et = new n.WebGLState(Re, se);
                void 0 === Re.getShaderPrecisionFormat && (Re.getShaderPrecisionFormat = function() { return { rangeMin: 1, rangeMax: 1, precision: 1 } });
                var tt = new n.WebGLExtensions(Re);
                tt.get("OES_texture_float"), tt.get("OES_texture_float_linear"), tt.get("OES_texture_half_float"), tt.get("OES_texture_half_float_linear"), tt.get("OES_standard_derivatives"), be && tt.get("EXT_frag_depth");
                var it = function(e, t, i, r) { _e === !0 && (e *= r, t *= r, i *= r), Re.clearColor(e, t, i, r) },
                    rt = function() { Re.clearColor(0, 0, 0, 1), Re.clearDepth(1), Re.clearStencil(0), Re.enable(Re.DEPTH_TEST), Re.depthFunc(Re.LEQUAL), Re.frontFace(Re.CCW), Re.cullFace(Re.BACK), Re.enable(Re.CULL_FACE), Re.enable(Re.BLEND), Re.blendEquation(Re.FUNC_ADD), Re.blendFunc(Re.SRC_ALPHA, Re.ONE_MINUS_SRC_ALPHA), Re.viewport(Ve, Ie, Ge, He), it(we.r, we.g, we.b, Te) },
                    nt = function() { Oe = null, ze = null, Ue = "", Be = -1, Ze = !0, et.reset() };
                rt(), this.context = Re, this.state = et;
                var ot = Re.getParameter(Re.MAX_TEXTURE_IMAGE_UNITS),
                    at = Re.getParameter(Re.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
                    st = Re.getParameter(Re.MAX_TEXTURE_SIZE),
                    ht = Re.getParameter(Re.MAX_CUBE_MAP_TEXTURE_SIZE),
                    lt = at > 0,
                    ct = lt && tt.get("OES_texture_float"),
                    ut = Re.getShaderPrecisionFormat(Re.VERTEX_SHADER, Re.HIGH_FLOAT),
                    dt = Re.getShaderPrecisionFormat(Re.VERTEX_SHADER, Re.MEDIUM_FLOAT),
                    pt = Re.getShaderPrecisionFormat(Re.FRAGMENT_SHADER, Re.HIGH_FLOAT),
                    ft = Re.getShaderPrecisionFormat(Re.FRAGMENT_SHADER, Re.MEDIUM_FLOAT),
                    mt = function() { var e; return function() { if (void 0 !== e) return e; if (e = [], tt.get("WEBGL_compressed_texture_pvrtc") || tt.get("WEBGL_compressed_texture_s3tc"))
                                for (var t = Re.getParameter(Re.COMPRESSED_TEXTURE_FORMATS), i = 0; i < t.length; i++) e.push(t[i]); return e } }(),
                    gt = ut.precision > 0 && pt.precision > 0,
                    vt = dt.precision > 0 && ft.precision > 0;
                "highp" !== fe || gt || (vt ? (fe = "mediump", n.warn("THREE.WebGLRenderer: highp not supported, using mediump.")) : (fe = "lowp", n.warn("THREE.WebGLRenderer: highp and mediump not supported, using lowp."))), "mediump" !== fe || vt || (fe = "lowp", n.warn("THREE.WebGLRenderer: mediump not supported, using lowp."));
                var yt = new n.ShadowMapPlugin(this, Me, Se, Ce),
                    _t = new n.SpritePlugin(this, Pe),
                    xt = new n.LensFlarePlugin(this, Le);
                this.getContext = function() { return Re }, this.forceContextLoss = function() { tt.get("WEBGL_lose_context").loseContext() }, this.supportsVertexTextures = function() { return lt }, this.supportsFloatTextures = function() { return tt.get("OES_texture_float") }, this.supportsHalfFloatTextures = function() { return tt.get("OES_texture_half_float") }, this.supportsStandardDerivatives = function() { return tt.get("OES_standard_derivatives") }, this.supportsCompressedTextureS3TC = function() { return tt.get("WEBGL_compressed_texture_s3tc") }, this.supportsCompressedTexturePVRTC = function() { return tt.get("WEBGL_compressed_texture_pvrtc") }, this.supportsBlendMinMax = function() { return tt.get("EXT_blend_minmax") }, this.getMaxAnisotropy = function() { var e; return function() { if (void 0 !== e) return e; var t = tt.get("EXT_texture_filter_anisotropic"); return e = null !== t ? Re.getParameter(t.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0 } }(), this.getPrecision = function() { return fe }, this.getPixelRatio = function() { return pe }, this.setPixelRatio = function(e) { pe = e }, this.setSize = function(e, t, i) { ue.width = e * pe, ue.height = t * pe, i !== !1 && (ue.style.width = e + "px", ue.style.height = t + "px"), this.setViewport(0, 0, e, t) }, this.setViewport = function(e, t, i, r) { Ve = e * pe, Ie = t * pe, Ge = i * pe, He = r * pe, Re.viewport(Ve, Ie, Ge, He) }, this.setScissor = function(e, t, i, r) { Re.scissor(e * pe, t * pe, i * pe, r * pe) }, this.enableScissorTest = function(e) { e ? Re.enable(Re.SCISSOR_TEST) : Re.disable(Re.SCISSOR_TEST) }, this.getClearColor = function() { return we }, this.setClearColor = function(e, t) { we.set(e), Te = void 0 !== t ? t : 1, it(we.r, we.g, we.b, Te) }, this.getClearAlpha = function() { return Te }, this.setClearAlpha = function(e) { Te = e, it(we.r, we.g, we.b, Te) }, this.clear = function(e, t, i) { var r = 0;
                    (void 0 === e || e) && (r |= Re.COLOR_BUFFER_BIT), (void 0 === t || t) && (r |= Re.DEPTH_BUFFER_BIT), (void 0 === i || i) && (r |= Re.STENCIL_BUFFER_BIT), Re.clear(r) }, this.clearColor = function() { Re.clear(Re.COLOR_BUFFER_BIT) }, this.clearDepth = function() { Re.clear(Re.DEPTH_BUFFER_BIT) }, this.clearStencil = function() { Re.clear(Re.STENCIL_BUFFER_BIT) }, this.clearTarget = function(e, t, i, r) { this.setRenderTarget(e), this.clear(t, i, r) }, this.resetGLState = nt;
                var bt = function(e) { var t = e.target;
                        t.traverse(function(e) { e.removeEventListener("remove", bt), F(e) }) },
                    wt = function(e) { var t = e.target;
                        t.removeEventListener("dispose", wt), At(t) },
                    Tt = function(e) { var t = e.target;
                        t.removeEventListener("dispose", Tt), Et(t), Fe.info.memory.textures-- },
                    Mt = function(e) { var t = e.target;
                        t.removeEventListener("dispose", Mt), Pt(t), Fe.info.memory.textures-- },
                    St = function(e) { var t = e.target;
                        t.removeEventListener("dispose", St), Lt(t) },
                    Ct = function(e) { for (var t = ["__webglVertexBuffer", "__webglNormalBuffer", "__webglTangentBuffer", "__webglColorBuffer", "__webglUVBuffer", "__webglUV2Buffer", "__webglSkinIndicesBuffer", "__webglSkinWeightsBuffer", "__webglFaceBuffer", "__webglLineBuffer", "__webglLineDistanceBuffer"], i = 0, r = t.length; r > i; i++) { var n = t[i];
                            void 0 !== e[n] && (Re.deleteBuffer(e[n]), delete e[n]) } if (void 0 !== e.__webglCustomAttributesList) { for (var n in e.__webglCustomAttributesList) Re.deleteBuffer(e.__webglCustomAttributesList[n].buffer);
                            delete e.__webglCustomAttributesList } Fe.info.memory.geometries-- },
                    At = function(e) { if (delete e.__webglInit, e instanceof n.BufferGeometry) { for (var t in e.attributes) { var i = e.attributes[t];
                                void 0 !== i.buffer && (Re.deleteBuffer(i.buffer), delete i.buffer) } Fe.info.memory.geometries-- } else { var r = Rt[e.id]; if (void 0 !== r) { for (var o = 0, a = r.length; a > o; o++) { var s = r[o]; if (void 0 !== s.numMorphTargets) { for (var h = 0, l = s.numMorphTargets; l > h; h++) Re.deleteBuffer(s.__webglMorphTargetsBuffers[h]);
                                        delete s.__webglMorphTargetsBuffers } if (void 0 !== s.numMorphNormals) { for (var h = 0, l = s.numMorphNormals; l > h; h++) Re.deleteBuffer(s.__webglMorphNormalsBuffers[h]);
                                        delete s.__webglMorphNormalsBuffers } Ct(s) } delete Rt[e.id] } else Ct(e) } Ue = "" },
                    Et = function(e) { if (e.image && e.image.__webglTextureCube) Re.deleteTexture(e.image.__webglTextureCube), delete e.image.__webglTextureCube;
                        else { if (void 0 === e.__webglInit) return;
                            Re.deleteTexture(e.__webglTexture), delete e.__webglTexture, delete e.__webglInit } },
                    Pt = function(e) { if (e && void 0 !== e.__webglTexture) { if (Re.deleteTexture(e.__webglTexture), delete e.__webglTexture, e instanceof n.WebGLRenderTargetCube)
                                for (var t = 0; 6 > t; t++) Re.deleteFramebuffer(e.__webglFramebuffer[t]), Re.deleteRenderbuffer(e.__webglRenderbuffer[t]);
                            else Re.deleteFramebuffer(e.__webglFramebuffer), Re.deleteRenderbuffer(e.__webglRenderbuffer);
                            delete e.__webglFramebuffer, delete e.__webglRenderbuffer } },
                    Lt = function(e) { var t = e.program.program; if (void 0 !== t) { e.program = void 0; var i, r, n, o = !1; for (i = 0, r = ke.length; r > i; i++)
                                if (n = ke[i], n.program === t) { n.usedTimes--, 0 === n.usedTimes && (o = !0); break } if (o === !0) { var a = []; for (i = 0, r = ke.length; r > i; i++) n = ke[i], n.program !== t && a.push(n);
                                ke = a, Re.deleteProgram(t), Fe.info.memory.programs-- } } };
                this.renderBufferImmediate = function(e, t, i) { if (et.initAttributes(), e.hasPositions && !e.__webglVertexBuffer && (e.__webglVertexBuffer = Re.createBuffer()), e.hasNormals && !e.__webglNormalBuffer && (e.__webglNormalBuffer = Re.createBuffer()), e.hasUvs && !e.__webglUvBuffer && (e.__webglUvBuffer = Re.createBuffer()), e.hasColors && !e.__webglColorBuffer && (e.__webglColorBuffer = Re.createBuffer()), e.hasPositions && (Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglVertexBuffer), Re.bufferData(Re.ARRAY_BUFFER, e.positionArray, Re.DYNAMIC_DRAW), et.enableAttribute(t.attributes.position), Re.vertexAttribPointer(t.attributes.position, 3, Re.FLOAT, !1, 0, 0)), e.hasNormals) { if (Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglNormalBuffer), i instanceof n.MeshPhongMaterial == !1 && i.shading === n.FlatShading) { var r, o, a, s, h, l, c, u, d, p, f, m, g, v, y = 3 * e.count; for (v = 0; y > v; v += 9) g = e.normalArray, s = g[v], c = g[v + 1], p = g[v + 2], h = g[v + 3], u = g[v + 4], f = g[v + 5], l = g[v + 6], d = g[v + 7], m = g[v + 8], r = (s + h + l) / 3, o = (c + u + d) / 3, a = (p + f + m) / 3, g[v] = r, g[v + 1] = o, g[v + 2] = a, g[v + 3] = r, g[v + 4] = o, g[v + 5] = a, g[v + 6] = r, g[v + 7] = o, g[v + 8] = a } Re.bufferData(Re.ARRAY_BUFFER, e.normalArray, Re.DYNAMIC_DRAW), et.enableAttribute(t.attributes.normal), Re.vertexAttribPointer(t.attributes.normal, 3, Re.FLOAT, !1, 0, 0) } e.hasUvs && i.map && (Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglUvBuffer), Re.bufferData(Re.ARRAY_BUFFER, e.uvArray, Re.DYNAMIC_DRAW), et.enableAttribute(t.attributes.uv), Re.vertexAttribPointer(t.attributes.uv, 2, Re.FLOAT, !1, 0, 0)), e.hasColors && i.vertexColors !== n.NoColors && (Re.bindBuffer(Re.ARRAY_BUFFER, e.__webglColorBuffer), Re.bufferData(Re.ARRAY_BUFFER, e.colorArray, Re.DYNAMIC_DRAW), et.enableAttribute(t.attributes.color), Re.vertexAttribPointer(t.attributes.color, 3, Re.FLOAT, !1, 0, 0)), et.disableUnusedAttributes(), Re.drawArrays(Re.TRIANGLES, 0, e.count), e.count = 0 }, this.renderBufferDirect = function(e, t, i, r, o, a) { if (r.visible !== !1) { P(a); var s = B(e, t, i, r, a),
                            h = !1,
                            l = r.wireframe ? 1 : 0,
                            c = "direct_" + o.id + "_" + s.id + "_" + l; if (c !== Ue && (Ue = c, h = !0), h && et.initAttributes(), a instanceof n.Mesh) { var u = r.wireframe === !0 ? Re.LINES : Re.TRIANGLES,
                                d = o.attributes.index; if (d) { var p, m;
                                d.array instanceof Uint32Array && tt.get("OES_element_index_uint") ? (p = Re.UNSIGNED_INT, m = 4) : (p = Re.UNSIGNED_SHORT, m = 2); var g = o.offsets; if (0 === g.length) h && (f(r, s, o, 0), Re.bindBuffer(Re.ELEMENT_ARRAY_BUFFER, d.buffer)), Re.drawElements(u, d.array.length, p, 0), Fe.info.render.calls++, Fe.info.render.vertices += d.array.length, Fe.info.render.faces += d.array.length / 3;
                                else { h = !0; for (var v = 0, y = g.length; y > v; v++) { var _ = g[v].index;
                                        h && (f(r, s, o, _), Re.bindBuffer(Re.ELEMENT_ARRAY_BUFFER, d.buffer)), Re.drawElements(u, g[v].count, p, g[v].start * m), Fe.info.render.calls++, Fe.info.render.vertices += g[v].count, Fe.info.render.faces += g[v].count / 3 } } } else { h && f(r, s, o, 0); var x = o.attributes.position;
                                Re.drawArrays(u, 0, x.array.length / x.itemSize), Fe.info.render.calls++, Fe.info.render.vertices += x.array.length / x.itemSize, Fe.info.render.faces += x.array.length / (3 * x.itemSize) } } else if (a instanceof n.PointCloud) { var u = Re.POINTS,
                                d = o.attributes.index; if (d) { var p, m;
                                d.array instanceof Uint32Array && tt.get("OES_element_index_uint") ? (p = Re.UNSIGNED_INT, m = 4) : (p = Re.UNSIGNED_SHORT, m = 2); var g = o.offsets; if (0 === g.length) h && (f(r, s, o, 0), Re.bindBuffer(Re.ELEMENT_ARRAY_BUFFER, d.buffer)), Re.drawElements(u, d.array.length, p, 0), Fe.info.render.calls++, Fe.info.render.points += d.array.length;
                                else { g.length > 1 && (h = !0); for (var v = 0, y = g.length; y > v; v++) { var _ = g[v].index;
                                        h && (f(r, s, o, _), Re.bindBuffer(Re.ELEMENT_ARRAY_BUFFER, d.buffer)), Re.drawElements(u, g[v].count, p, g[v].start * m), Fe.info.render.calls++, Fe.info.render.points += g[v].count } } } else { h && f(r, s, o, 0); var x = o.attributes.position,
                                    g = o.offsets; if (0 === g.length) Re.drawArrays(u, 0, x.array.length / 3), Fe.info.render.calls++, Fe.info.render.points += x.array.length / 3;
                                else
                                    for (var v = 0, y = g.length; y > v; v++) Re.drawArrays(u, g[v].index, g[v].count), Fe.info.render.calls++, Fe.info.render.points += g[v].count } } else if (a instanceof n.Line) { var u = a.mode === n.LineStrip ? Re.LINE_STRIP : Re.LINES;
                            et.setLineWidth(r.linewidth * pe); var d = o.attributes.index; if (d) { var p, m;
                                d.array instanceof Uint32Array ? (p = Re.UNSIGNED_INT, m = 4) : (p = Re.UNSIGNED_SHORT, m = 2); var g = o.offsets; if (0 === g.length) h && (f(r, s, o, 0), Re.bindBuffer(Re.ELEMENT_ARRAY_BUFFER, d.buffer)), Re.drawElements(u, d.array.length, p, 0), Fe.info.render.calls++, Fe.info.render.vertices += d.array.length;
                                else { g.length > 1 && (h = !0); for (var v = 0, y = g.length; y > v; v++) { var _ = g[v].index;
                                        h && (f(r, s, o, _), Re.bindBuffer(Re.ELEMENT_ARRAY_BUFFER, d.buffer)), Re.drawElements(u, g[v].count, p, g[v].start * m), Fe.info.render.calls++, Fe.info.render.vertices += g[v].count } } } else { h && f(r, s, o, 0); var x = o.attributes.position,
                                    g = o.offsets; if (0 === g.length) Re.drawArrays(u, 0, x.array.length / 3), Fe.info.render.calls++, Fe.info.render.vertices += x.array.length / 3;
                                else
                                    for (var v = 0, y = g.length; y > v; v++) Re.drawArrays(u, g[v].index, g[v].count), Fe.info.render.calls++, Fe.info.render.vertices += g[v].count } } } }, this.renderBuffer = function(e, t, i, r, o, a) {
                    if (r.visible !== !1) {
                        P(a);
                        var s = B(e, t, i, r, a),
                            h = s.attributes,
                            l = !1,
                            c = r.wireframe ? 1 : 0,
                            u = o.id + "_" + s.id + "_" + c;
                        if (u !== Ue && (Ue = u, l = !0), l && et.initAttributes(), !r.morphTargets && h.position >= 0 ? l && (Re.bindBuffer(Re.ARRAY_BUFFER, o.__webglVertexBuffer),
                                et.enableAttribute(h.position), Re.vertexAttribPointer(h.position, 3, Re.FLOAT, !1, 0, 0)) : a.morphTargetBase && m(r, o, a), l) { if (o.__webglCustomAttributesList)
                                for (var d = 0, p = o.__webglCustomAttributesList.length; p > d; d++) { var f = o.__webglCustomAttributesList[d];
                                    h[f.buffer.belongsToAttribute] >= 0 && (Re.bindBuffer(Re.ARRAY_BUFFER, f.buffer), et.enableAttribute(h[f.buffer.belongsToAttribute]), Re.vertexAttribPointer(h[f.buffer.belongsToAttribute], f.size, Re.FLOAT, !1, 0, 0)) } h.color >= 0 && (a.geometry.colors.length > 0 || a.geometry.faces.length > 0 ? (Re.bindBuffer(Re.ARRAY_BUFFER, o.__webglColorBuffer), et.enableAttribute(h.color), Re.vertexAttribPointer(h.color, 3, Re.FLOAT, !1, 0, 0)) : void 0 !== r.defaultAttributeValues && Re.vertexAttrib3fv(h.color, r.defaultAttributeValues.color)), h.normal >= 0 && (Re.bindBuffer(Re.ARRAY_BUFFER, o.__webglNormalBuffer), et.enableAttribute(h.normal), Re.vertexAttribPointer(h.normal, 3, Re.FLOAT, !1, 0, 0)), h.tangent >= 0 && (Re.bindBuffer(Re.ARRAY_BUFFER, o.__webglTangentBuffer), et.enableAttribute(h.tangent), Re.vertexAttribPointer(h.tangent, 4, Re.FLOAT, !1, 0, 0)), h.uv >= 0 && (a.geometry.faceVertexUvs[0] ? (Re.bindBuffer(Re.ARRAY_BUFFER, o.__webglUVBuffer), et.enableAttribute(h.uv), Re.vertexAttribPointer(h.uv, 2, Re.FLOAT, !1, 0, 0)) : void 0 !== r.defaultAttributeValues && Re.vertexAttrib2fv(h.uv, r.defaultAttributeValues.uv)), h.uv2 >= 0 && (a.geometry.faceVertexUvs[1] ? (Re.bindBuffer(Re.ARRAY_BUFFER, o.__webglUV2Buffer), et.enableAttribute(h.uv2), Re.vertexAttribPointer(h.uv2, 2, Re.FLOAT, !1, 0, 0)) : void 0 !== r.defaultAttributeValues && Re.vertexAttrib2fv(h.uv2, r.defaultAttributeValues.uv2)), r.skinning && h.skinIndex >= 0 && h.skinWeight >= 0 && (Re.bindBuffer(Re.ARRAY_BUFFER, o.__webglSkinIndicesBuffer), et.enableAttribute(h.skinIndex), Re.vertexAttribPointer(h.skinIndex, 4, Re.FLOAT, !1, 0, 0), Re.bindBuffer(Re.ARRAY_BUFFER, o.__webglSkinWeightsBuffer), et.enableAttribute(h.skinWeight), Re.vertexAttribPointer(h.skinWeight, 4, Re.FLOAT, !1, 0, 0)), h.lineDistance >= 0 && (Re.bindBuffer(Re.ARRAY_BUFFER, o.__webglLineDistanceBuffer), et.enableAttribute(h.lineDistance), Re.vertexAttribPointer(h.lineDistance, 1, Re.FLOAT, !1, 0, 0)) }
                        if (et.disableUnusedAttributes(), a instanceof n.Mesh) { var g = o.__typeArray === Uint32Array ? Re.UNSIGNED_INT : Re.UNSIGNED_SHORT;
                            r.wireframe ? (et.setLineWidth(r.wireframeLinewidth * pe), l && Re.bindBuffer(Re.ELEMENT_ARRAY_BUFFER, o.__webglLineBuffer), Re.drawElements(Re.LINES, o.__webglLineCount, g, 0)) : (l && Re.bindBuffer(Re.ELEMENT_ARRAY_BUFFER, o.__webglFaceBuffer), Re.drawElements(Re.TRIANGLES, o.__webglFaceCount, g, 0)), Fe.info.render.calls++, Fe.info.render.vertices += o.__webglFaceCount, Fe.info.render.faces += o.__webglFaceCount / 3 } else if (a instanceof n.Line) { var v = a.mode === n.LineStrip ? Re.LINE_STRIP : Re.LINES;
                            et.setLineWidth(r.linewidth * pe), Re.drawArrays(v, 0, o.__webglLineCount), Fe.info.render.calls++ } else a instanceof n.PointCloud && (Re.drawArrays(Re.POINTS, 0, o.__webglParticleCount), Fe.info.render.calls++, Fe.info.render.points += o.__webglParticleCount)
                    }
                }, this.render = function(e, t, i, r) { if (t instanceof n.Camera == !1) return void n.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera."); var o = e.fog;
                    Ue = "", Be = -1, ze = null, Ze = !0, e.autoUpdate === !0 && e.updateMatrixWorld(), void 0 === t.parent && t.updateMatrixWorld(), e.traverse(function(e) { e instanceof n.SkinnedMesh && e.skeleton.update() }), t.matrixWorldInverse.getInverse(t.matrixWorld), Ye.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), Xe.setFromMatrix(Ye), Me.length = 0, Ae.length = 0, Ee.length = 0, Pe.length = 0, Le.length = 0, _(e), Fe.sortObjects === !0 && (Ae.sort(g), Ee.sort(v)), yt.render(e, t), Fe.info.render.calls = 0, Fe.info.render.vertices = 0, Fe.info.render.faces = 0, Fe.info.render.points = 0, this.setRenderTarget(i), (this.autoClear || r) && this.clear(this.autoClearColor, this.autoClearDepth, this.autoClearStencil); for (var a = 0, s = Ce.length; s > a; a++) { var h = Ce[a],
                            l = h.object;
                        l.visible && (Z(l, t), w(h)) } if (e.overrideMaterial) { var c = e.overrideMaterial;
                        D(c), x(Ae, t, Me, o, c), x(Ee, t, Me, o, c), b(Ce, "", t, Me, o, c) } else et.setBlending(n.NoBlending), x(Ae, t, Me, o, null), b(Ce, "opaque", t, Me, o, null), x(Ee, t, Me, o, null), b(Ce, "transparent", t, Me, o, null);
                    _t.render(e, t), xt.render(e, t, je, We), i && i.generateMipmaps && i.minFilter !== n.NearestFilter && i.minFilter !== n.LinearFilter && oe(i), et.setDepthTest(!0), et.setDepthWrite(!0), et.setColorWrite(!0) }, this.renderImmediateObject = function(e, t, i, r, n) { var o = B(e, t, i, r, n);
                    Ue = "", Fe.setMaterialFaces(r), n.immediateRenderCallback ? n.immediateRenderCallback(o, Re, Xe) : n.render(function(e) { Fe.renderBufferImmediate(e, o, r) }) };
                var Rt = {},
                    Ft = 0,
                    kt = { MeshDepthMaterial: "depth", MeshNormalMaterial: "normal", MeshBasicMaterial: "basic", MeshLambertMaterial: "lambert", MeshPhongMaterial: "phong", LineBasicMaterial: "basic", LineDashedMaterial: "dashed", PointCloudMaterial: "particle_basic" };
                this.setFaceCulling = function(e, t) { e === n.CullFaceNone ? Re.disable(Re.CULL_FACE) : (t === n.FrontFaceDirectionCW ? Re.frontFace(Re.CW) : Re.frontFace(Re.CCW), e === n.CullFaceBack ? Re.cullFace(Re.BACK) : e === n.CullFaceFront ? Re.cullFace(Re.FRONT) : Re.cullFace(Re.FRONT_AND_BACK), Re.enable(Re.CULL_FACE)) }, this.setMaterialFaces = function(e) { et.setDoubleSided(e.side === n.DoubleSide), et.setFlipSided(e.side === n.BackSide) }, this.uploadTexture = function(e) { void 0 === e.__webglInit && (e.__webglInit = !0, e.addEventListener("dispose", Tt), e.__webglTexture = Re.createTexture(), Fe.info.memory.textures++), Re.bindTexture(Re.TEXTURE_2D, e.__webglTexture), Re.pixelStorei(Re.UNPACK_FLIP_Y_WEBGL, e.flipY), Re.pixelStorei(Re.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e.premultiplyAlpha), Re.pixelStorei(Re.UNPACK_ALIGNMENT, e.unpackAlignment), e.image = ee(e.image, st); var t = e.image,
                        i = n.Math.isPowerOfTwo(t.width) && n.Math.isPowerOfTwo(t.height),
                        r = se(e.format),
                        o = se(e.type);
                    $(Re.TEXTURE_2D, e, i); var a, s = e.mipmaps; if (e instanceof n.DataTexture)
                        if (s.length > 0 && i) { for (var h = 0, l = s.length; l > h; h++) a = s[h], Re.texImage2D(Re.TEXTURE_2D, h, r, a.width, a.height, 0, r, o, a.data);
                            e.generateMipmaps = !1 } else Re.texImage2D(Re.TEXTURE_2D, 0, r, t.width, t.height, 0, r, o, t.data);
                    else if (e instanceof n.CompressedTexture)
                        for (var h = 0, l = s.length; l > h; h++) a = s[h], e.format !== n.RGBAFormat && e.format !== n.RGBFormat ? mt().indexOf(r) > -1 ? Re.compressedTexImage2D(Re.TEXTURE_2D, h, r, a.width, a.height, 0, a.data) : n.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Re.texImage2D(Re.TEXTURE_2D, h, r, a.width, a.height, 0, r, o, a.data);
                    else if (s.length > 0 && i) { for (var h = 0, l = s.length; l > h; h++) a = s[h], Re.texImage2D(Re.TEXTURE_2D, h, r, r, o, a);
                        e.generateMipmaps = !1 } else Re.texImage2D(Re.TEXTURE_2D, 0, r, r, o, e.image);
                    e.generateMipmaps && i && Re.generateMipmap(Re.TEXTURE_2D), e.needsUpdate = !1, e.onUpdate && e.onUpdate() }, this.setTexture = function(e, t) { Re.activeTexture(Re.TEXTURE0 + t), e.needsUpdate ? Fe.uploadTexture(e) : Re.bindTexture(Re.TEXTURE_2D, e.__webglTexture) }, this.setRenderTarget = function(e) { var t = e instanceof n.WebGLRenderTargetCube; if (e && void 0 === e.__webglFramebuffer) { void 0 === e.depthBuffer && (e.depthBuffer = !0), void 0 === e.stencilBuffer && (e.stencilBuffer = !0), e.addEventListener("dispose", Mt), e.__webglTexture = Re.createTexture(), Fe.info.memory.textures++; var i = n.Math.isPowerOfTwo(e.width) && n.Math.isPowerOfTwo(e.height),
                            r = se(e.format),
                            o = se(e.type); if (t) { e.__webglFramebuffer = [], e.__webglRenderbuffer = [], Re.bindTexture(Re.TEXTURE_CUBE_MAP, e.__webglTexture), $(Re.TEXTURE_CUBE_MAP, e, i); for (var a = 0; 6 > a; a++) e.__webglFramebuffer[a] = Re.createFramebuffer(), e.__webglRenderbuffer[a] = Re.createRenderbuffer(), Re.texImage2D(Re.TEXTURE_CUBE_MAP_POSITIVE_X + a, 0, r, e.width, e.height, 0, r, o, null), re(e.__webglFramebuffer[a], e, Re.TEXTURE_CUBE_MAP_POSITIVE_X + a), ne(e.__webglRenderbuffer[a], e);
                            i && Re.generateMipmap(Re.TEXTURE_CUBE_MAP) } else e.__webglFramebuffer = Re.createFramebuffer(), e.shareDepthFrom ? e.__webglRenderbuffer = e.shareDepthFrom.__webglRenderbuffer : e.__webglRenderbuffer = Re.createRenderbuffer(), Re.bindTexture(Re.TEXTURE_2D, e.__webglTexture), $(Re.TEXTURE_2D, e, i), Re.texImage2D(Re.TEXTURE_2D, 0, r, e.width, e.height, 0, r, o, null), re(e.__webglFramebuffer, e, Re.TEXTURE_2D), e.shareDepthFrom ? e.depthBuffer && !e.stencilBuffer ? Re.framebufferRenderbuffer(Re.FRAMEBUFFER, Re.DEPTH_ATTACHMENT, Re.RENDERBUFFER, e.__webglRenderbuffer) : e.depthBuffer && e.stencilBuffer && Re.framebufferRenderbuffer(Re.FRAMEBUFFER, Re.DEPTH_STENCIL_ATTACHMENT, Re.RENDERBUFFER, e.__webglRenderbuffer) : ne(e.__webglRenderbuffer, e), i && Re.generateMipmap(Re.TEXTURE_2D);
                        t ? Re.bindTexture(Re.TEXTURE_CUBE_MAP, null) : Re.bindTexture(Re.TEXTURE_2D, null), Re.bindRenderbuffer(Re.RENDERBUFFER, null), Re.bindFramebuffer(Re.FRAMEBUFFER, null) } var s, h, l, c, u;
                    e ? (s = t ? e.__webglFramebuffer[e.activeCubeFace] : e.__webglFramebuffer, h = e.width, l = e.height, c = 0, u = 0) : (s = null, h = Ge, l = He, c = Ve, u = Ie), s !== De && (Re.bindFramebuffer(Re.FRAMEBUFFER, s), Re.viewport(c, u, h, l), De = s), je = h, We = l }, this.readRenderTargetPixels = function(e, t, i, r, o, a) { if (!(e instanceof n.WebGLRenderTarget)) return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget."); if (e.__webglFramebuffer) { if (e.format !== n.RGBAFormat) return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA format. readPixels can read only RGBA format."); var s = !1;
                        e.__webglFramebuffer !== De && (Re.bindFramebuffer(Re.FRAMEBUFFER, e.__webglFramebuffer), s = !0), Re.checkFramebufferStatus(Re.FRAMEBUFFER) === Re.FRAMEBUFFER_COMPLETE ? Re.readPixels(t, i, r, o, Re.RGBA, Re.UNSIGNED_BYTE, a) : console.error("THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete."), s && Re.bindFramebuffer(Re.FRAMEBUFFER, De) } }, this.initMaterial = function() { n.warn("THREE.WebGLRenderer: .initMaterial() has been removed.") }, this.addPrePlugin = function() { n.warn("THREE.WebGLRenderer: .addPrePlugin() has been removed.") }, this.addPostPlugin = function() { n.warn("THREE.WebGLRenderer: .addPostPlugin() has been removed.") }, this.updateShadowMap = function() { n.warn("THREE.WebGLRenderer: .updateShadowMap() has been removed.") }
            }, n.WebGLRenderTarget = function(e, t, i) { this.width = e, this.height = t, i = i || {}, this.wrapS = void 0 !== i.wrapS ? i.wrapS : n.ClampToEdgeWrapping, this.wrapT = void 0 !== i.wrapT ? i.wrapT : n.ClampToEdgeWrapping, this.magFilter = void 0 !== i.magFilter ? i.magFilter : n.LinearFilter, this.minFilter = void 0 !== i.minFilter ? i.minFilter : n.LinearMipMapLinearFilter, this.anisotropy = void 0 !== i.anisotropy ? i.anisotropy : 1, this.offset = new n.Vector2(0, 0), this.repeat = new n.Vector2(1, 1), this.format = void 0 !== i.format ? i.format : n.RGBAFormat, this.type = void 0 !== i.type ? i.type : n.UnsignedByteType, this.depthBuffer = void 0 !== i.depthBuffer ? i.depthBuffer : !0, this.stencilBuffer = void 0 !== i.stencilBuffer ? i.stencilBuffer : !0, this.generateMipmaps = !0, this.shareDepthFrom = void 0 !== i.shareDepthFrom ? i.shareDepthFrom : null }, n.WebGLRenderTarget.prototype = { constructor: n.WebGLRenderTarget, setSize: function(e, t) { this.width = e, this.height = t }, clone: function() { var e = new n.WebGLRenderTarget(this.width, this.height); return e.wrapS = this.wrapS, e.wrapT = this.wrapT, e.magFilter = this.magFilter, e.minFilter = this.minFilter, e.anisotropy = this.anisotropy, e.offset.copy(this.offset), e.repeat.copy(this.repeat), e.format = this.format, e.type = this.type, e.depthBuffer = this.depthBuffer, e.stencilBuffer = this.stencilBuffer, e.generateMipmaps = this.generateMipmaps, e.shareDepthFrom = this.shareDepthFrom, e }, dispose: function() { this.dispatchEvent({ type: "dispose" }) } }, n.EventDispatcher.prototype.apply(n.WebGLRenderTarget.prototype), n.WebGLRenderTargetCube = function(e, t, i) { n.WebGLRenderTarget.call(this, e, t, i), this.activeCubeFace = 0 }, n.WebGLRenderTargetCube.prototype = Object.create(n.WebGLRenderTarget.prototype), n.WebGLRenderTargetCube.prototype.constructor = n.WebGLRenderTargetCube, n.WebGLExtensions = function(e) { var t = {};
                this.get = function(i) { if (void 0 !== t[i]) return t[i]; var r; switch (i) {
                        case "EXT_texture_filter_anisotropic":
                            r = e.getExtension("EXT_texture_filter_anisotropic") || e.getExtension("MOZ_EXT_texture_filter_anisotropic") || e.getExtension("WEBKIT_EXT_texture_filter_anisotropic"); break;
                        case "WEBGL_compressed_texture_s3tc":
                            r = e.getExtension("WEBGL_compressed_texture_s3tc") || e.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc"); break;
                        case "WEBGL_compressed_texture_pvrtc":
                            r = e.getExtension("WEBGL_compressed_texture_pvrtc") || e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"); break;
                        default:
                            r = e.getExtension(i) } return null === r && n.warn("THREE.WebGLRenderer: " + i + " extension not supported."), t[i] = r, r } }, n.WebGLProgram = function() { var e = 0,
                    t = function(e) { var t, i, r = []; for (var n in e) t = e[n], t !== !1 && (i = "#define " + n + " " + t, r.push(i)); return r.join("\n") },
                    i = function(e, t, i) { for (var r = {}, n = 0, o = i.length; o > n; n++) { var a = i[n];
                            r[a] = e.getUniformLocation(t, a) } return r },
                    r = function(e, t, i) { for (var r = {}, n = 0, o = i.length; o > n; n++) { var a = i[n];
                            r[a] = e.getAttribLocation(t, a) } return r }; return function(o, a, s, h) { var l = o,
                        c = l.context,
                        u = s.defines,
                        d = s.__webglShader.uniforms,
                        p = s.attributes,
                        f = s.__webglShader.vertexShader,
                        m = s.__webglShader.fragmentShader,
                        g = s.index0AttributeName;
                    void 0 === g && h.morphTargets === !0 && (g = "position"); var v = "SHADOWMAP_TYPE_BASIC";
                    h.shadowMapType === n.PCFShadowMap ? v = "SHADOWMAP_TYPE_PCF" : h.shadowMapType === n.PCFSoftShadowMap && (v = "SHADOWMAP_TYPE_PCF_SOFT"); var y = "ENVMAP_TYPE_CUBE",
                        _ = "ENVMAP_MODE_REFLECTION",
                        x = "ENVMAP_BLENDING_MULTIPLY"; if (h.envMap) { switch (s.envMap.mapping) {
                            case n.CubeReflectionMapping:
                            case n.CubeRefractionMapping:
                                y = "ENVMAP_TYPE_CUBE"; break;
                            case n.EquirectangularReflectionMapping:
                            case n.EquirectangularRefractionMapping:
                                y = "ENVMAP_TYPE_EQUIREC"; break;
                            case n.SphericalReflectionMapping:
                                y = "ENVMAP_TYPE_SPHERE" } switch (s.envMap.mapping) {
                            case n.CubeRefractionMapping:
                            case n.EquirectangularRefractionMapping:
                                _ = "ENVMAP_MODE_REFRACTION" } switch (s.combine) {
                            case n.MultiplyOperation:
                                x = "ENVMAP_BLENDING_MULTIPLY"; break;
                            case n.MixOperation:
                                x = "ENVMAP_BLENDING_MIX"; break;
                            case n.AddOperation:
                                x = "ENVMAP_BLENDING_ADD" } } var b, w, T = o.gammaFactor > 0 ? o.gammaFactor : 1,
                        M = t(u),
                        S = c.createProgram();
                    s instanceof n.RawShaderMaterial ? (b = "", w = "") : (b = ["precision " + h.precision + " float;", "precision " + h.precision + " int;", M, h.supportsVertexTextures ? "#define VERTEX_TEXTURES" : "", l.gammaInput ? "#define GAMMA_INPUT" : "", l.gammaOutput ? "#define GAMMA_OUTPUT" : "", "#define GAMMA_FACTOR " + T, "#define MAX_DIR_LIGHTS " + h.maxDirLights, "#define MAX_POINT_LIGHTS " + h.maxPointLights, "#define MAX_SPOT_LIGHTS " + h.maxSpotLights, "#define MAX_HEMI_LIGHTS " + h.maxHemiLights, "#define MAX_SHADOWS " + h.maxShadows, "#define MAX_BONES " + h.maxBones, h.map ? "#define USE_MAP" : "", h.envMap ? "#define USE_ENVMAP" : "", h.envMap ? "#define " + _ : "", h.lightMap ? "#define USE_LIGHTMAP" : "", h.bumpMap ? "#define USE_BUMPMAP" : "", h.normalMap ? "#define USE_NORMALMAP" : "", h.specularMap ? "#define USE_SPECULARMAP" : "", h.alphaMap ? "#define USE_ALPHAMAP" : "", h.vertexColors ? "#define USE_COLOR" : "", h.flatShading ? "#define FLAT_SHADED" : "", h.skinning ? "#define USE_SKINNING" : "", h.useVertexTexture ? "#define BONE_TEXTURE" : "", h.morphTargets ? "#define USE_MORPHTARGETS" : "", h.morphNormals ? "#define USE_MORPHNORMALS" : "", h.wrapAround ? "#define WRAP_AROUND" : "", h.doubleSided ? "#define DOUBLE_SIDED" : "", h.flipSided ? "#define FLIP_SIDED" : "", h.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", h.shadowMapEnabled ? "#define " + v : "", h.shadowMapDebug ? "#define SHADOWMAP_DEBUG" : "", h.shadowMapCascade ? "#define SHADOWMAP_CASCADE" : "", h.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "", h.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", "uniform mat4 modelMatrix;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat3 normalMatrix;", "uniform vec3 cameraPosition;", "attribute vec3 position;", "attribute vec3 normal;", "attribute vec2 uv;", "attribute vec2 uv2;", "#ifdef USE_COLOR", "	attribute vec3 color;", "#endif", "#ifdef USE_MORPHTARGETS", "	attribute vec3 morphTarget0;", "	attribute vec3 morphTarget1;", "	attribute vec3 morphTarget2;", "	attribute vec3 morphTarget3;", "	#ifdef USE_MORPHNORMALS", "		attribute vec3 morphNormal0;", "		attribute vec3 morphNormal1;", "		attribute vec3 morphNormal2;", "		attribute vec3 morphNormal3;", "	#else", "		attribute vec3 morphTarget4;", "		attribute vec3 morphTarget5;", "		attribute vec3 morphTarget6;", "		attribute vec3 morphTarget7;", "	#endif", "#endif", "#ifdef USE_SKINNING", "	attribute vec4 skinIndex;", "	attribute vec4 skinWeight;", "#endif", ""].join("\n"), w = ["precision " + h.precision + " float;", "precision " + h.precision + " int;", h.bumpMap || h.normalMap || h.flatShading ? "#extension GL_OES_standard_derivatives : enable" : "", M, "#define MAX_DIR_LIGHTS " + h.maxDirLights, "#define MAX_POINT_LIGHTS " + h.maxPointLights, "#define MAX_SPOT_LIGHTS " + h.maxSpotLights, "#define MAX_HEMI_LIGHTS " + h.maxHemiLights, "#define MAX_SHADOWS " + h.maxShadows, h.alphaTest ? "#define ALPHATEST " + h.alphaTest : "", l.gammaInput ? "#define GAMMA_INPUT" : "", l.gammaOutput ? "#define GAMMA_OUTPUT" : "", "#define GAMMA_FACTOR " + T, h.useFog && h.fog ? "#define USE_FOG" : "", h.useFog && h.fogExp ? "#define FOG_EXP2" : "", h.map ? "#define USE_MAP" : "", h.envMap ? "#define USE_ENVMAP" : "", h.envMap ? "#define " + y : "", h.envMap ? "#define " + _ : "", h.envMap ? "#define " + x : "", h.lightMap ? "#define USE_LIGHTMAP" : "", h.bumpMap ? "#define USE_BUMPMAP" : "", h.normalMap ? "#define USE_NORMALMAP" : "", h.specularMap ? "#define USE_SPECULARMAP" : "", h.alphaMap ? "#define USE_ALPHAMAP" : "", h.vertexColors ? "#define USE_COLOR" : "", h.flatShading ? "#define FLAT_SHADED" : "", h.metal ? "#define METAL" : "", h.wrapAround ? "#define WRAP_AROUND" : "", h.doubleSided ? "#define DOUBLE_SIDED" : "", h.flipSided ? "#define FLIP_SIDED" : "", h.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", h.shadowMapEnabled ? "#define " + v : "", h.shadowMapDebug ? "#define SHADOWMAP_DEBUG" : "", h.shadowMapCascade ? "#define SHADOWMAP_CASCADE" : "", h.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", "uniform mat4 viewMatrix;", "uniform vec3 cameraPosition;", ""].join("\n")); var C = new n.WebGLShader(c, c.VERTEX_SHADER, b + f),
                        A = new n.WebGLShader(c, c.FRAGMENT_SHADER, w + m);
                    c.attachShader(S, C), c.attachShader(S, A), void 0 !== g && c.bindAttribLocation(S, 0, g), c.linkProgram(S); var E = c.getProgramInfoLog(S);
                    c.getProgramParameter(S, c.LINK_STATUS) === !1 && n.error("THREE.WebGLProgram: shader error: " + c.getError(), "gl.VALIDATE_STATUS", c.getProgramParameter(S, c.VALIDATE_STATUS), "gl.getPRogramInfoLog", E), "" !== E && n.warn("THREE.WebGLProgram: gl.getProgramInfoLog()" + E), c.deleteShader(C), c.deleteShader(A); var P = ["viewMatrix", "modelViewMatrix", "projectionMatrix", "normalMatrix", "modelMatrix", "cameraPosition", "morphTargetInfluences", "bindMatrix", "bindMatrixInverse"];
                    h.useVertexTexture ? (P.push("boneTexture"), P.push("boneTextureWidth"), P.push("boneTextureHeight")) : P.push("boneGlobalMatrices"), h.logarithmicDepthBuffer && P.push("logDepthBufFC"); for (var L in d) P.push(L);
                    this.uniforms = i(c, S, P), P = ["position", "normal", "uv", "uv2", "tangent", "color", "skinIndex", "skinWeight", "lineDistance"]; for (var R = 0; R < h.maxMorphTargets; R++) P.push("morphTarget" + R); for (var R = 0; R < h.maxMorphNormals; R++) P.push("morphNormal" + R); for (var F in p) P.push(F); return this.attributes = r(c, S, P), this.attributesKeys = Object.keys(this.attributes), this.id = e++, this.code = a, this.usedTimes = 1, this.program = S, this.vertexShader = C, this.fragmentShader = A, this } }(), n.WebGLShader = function() { var e = function(e) { for (var t = e.split("\n"), i = 0; i < t.length; i++) t[i] = i + 1 + ": " + t[i]; return t.join("\n") }; return function(t, i, r) { var o = t.createShader(i); return t.shaderSource(o, r), t.compileShader(o), t.getShaderParameter(o, t.COMPILE_STATUS) === !1 && n.error("THREE.WebGLShader: Shader couldn't compile."), "" !== t.getShaderInfoLog(o) && n.warn("THREE.WebGLShader: gl.getShaderInfoLog()", t.getShaderInfoLog(o), e(r)), o } }(), n.WebGLState = function(e, t) { var i = new Uint8Array(16),
                    r = new Uint8Array(16),
                    o = null,
                    a = null,
                    s = null,
                    h = null,
                    l = null,
                    c = null,
                    u = null,
                    d = null,
                    p = null,
                    f = null,
                    m = null,
                    g = null,
                    v = null,
                    y = null,
                    _ = null,
                    x = null;
                this.initAttributes = function() { for (var e = 0, t = i.length; t > e; e++) i[e] = 0 }, this.enableAttribute = function(t) { i[t] = 1, 0 === r[t] && (e.enableVertexAttribArray(t), r[t] = 1) }, this.disableUnusedAttributes = function() { for (var t = 0, n = r.length; n > t; t++) r[t] !== i[t] && (e.disableVertexAttribArray(t), r[t] = 0) }, this.setBlending = function(i, r, d, p, f, m, g) { i !== o && (i === n.NoBlending ? e.disable(e.BLEND) : i === n.AdditiveBlending ? (e.enable(e.BLEND), e.blendEquation(e.FUNC_ADD), e.blendFunc(e.SRC_ALPHA, e.ONE)) : i === n.SubtractiveBlending ? (e.enable(e.BLEND), e.blendEquation(e.FUNC_ADD), e.blendFunc(e.ZERO, e.ONE_MINUS_SRC_COLOR)) : i === n.MultiplyBlending ? (e.enable(e.BLEND), e.blendEquation(e.FUNC_ADD), e.blendFunc(e.ZERO, e.SRC_COLOR)) : i === n.CustomBlending ? e.enable(e.BLEND) : (e.enable(e.BLEND), e.blendEquationSeparate(e.FUNC_ADD, e.FUNC_ADD), e.blendFuncSeparate(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA)), o = i), i === n.CustomBlending ? (f = f || r, m = m || d, g = g || p, (r !== a || f !== l) && (e.blendEquationSeparate(t(r), t(f)), a = r, l = f), (d !== s || p !== h || m !== c || g !== u) && (e.blendFuncSeparate(t(d), t(p), t(m), t(g)), s = d, h = p, c = m, u = g)) : (a = null, s = null, h = null, l = null, c = null, u = null) }, this.setDepthTest = function(t) { d !== t && (t ? e.enable(e.DEPTH_TEST) : e.disable(e.DEPTH_TEST), d = t) }, this.setDepthWrite = function(t) { p !== t && (e.depthMask(t), p = t) }, this.setColorWrite = function(t) { f !== t && (e.colorMask(t, t, t, t), f = t) }, this.setDoubleSided = function(t) { m !== t && (t ? e.disable(e.CULL_FACE) : e.enable(e.CULL_FACE), m = t) }, this.setFlipSided = function(t) { g !== t && (t ? e.frontFace(e.CW) : e.frontFace(e.CCW), g = t) }, this.setLineWidth = function(t) { t !== v && (e.lineWidth(t), v = t) }, this.setPolygonOffset = function(t, i, r) { y !== t && (t ? e.enable(e.POLYGON_OFFSET_FILL) : e.disable(e.POLYGON_OFFSET_FILL), y = t), !t || _ === i && x === r || (e.polygonOffset(i, r), _ = i, x = r) }, this.reset = function() { for (var e = 0; e < r.length; e++) r[e] = 0;
                    o = null, d = null, p = null, f = null, m = null, g = null } }, n.LensFlarePlugin = function(e, t) {
                function i(t) { var i = d.createProgram(),
                        r = d.createShader(d.FRAGMENT_SHADER),
                        n = d.createShader(d.VERTEX_SHADER),
                        o = "precision " + e.getPrecision() + " float;\n"; return d.shaderSource(r, o + t.fragmentShader), d.shaderSource(n, o + t.vertexShader), d.compileShader(r), d.compileShader(n), d.attachShader(i, r), d.attachShader(i, n), d.linkProgram(i), i } var r, o, a, s, h, l, c, u, d = e.context,
                    p = function() { var e = new Float32Array([-1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, 1, 0, 1]),
                            t = new Uint16Array([0, 1, 2, 0, 2, 3]);
                        r = d.createBuffer(), o = d.createBuffer(), d.bindBuffer(d.ARRAY_BUFFER, r), d.bufferData(d.ARRAY_BUFFER, e, d.STATIC_DRAW), d.bindBuffer(d.ELEMENT_ARRAY_BUFFER, o), d.bufferData(d.ELEMENT_ARRAY_BUFFER, t, d.STATIC_DRAW), c = d.createTexture(), u = d.createTexture(), d.bindTexture(d.TEXTURE_2D, c), d.texImage2D(d.TEXTURE_2D, 0, d.RGB, 16, 16, 0, d.RGB, d.UNSIGNED_BYTE, null), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_S, d.CLAMP_TO_EDGE), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_T, d.CLAMP_TO_EDGE), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_MAG_FILTER, d.NEAREST), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_MIN_FILTER, d.NEAREST), d.bindTexture(d.TEXTURE_2D, u), d.texImage2D(d.TEXTURE_2D, 0, d.RGBA, 16, 16, 0, d.RGBA, d.UNSIGNED_BYTE, null), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_S, d.CLAMP_TO_EDGE), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_T, d.CLAMP_TO_EDGE), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_MAG_FILTER, d.NEAREST), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_MIN_FILTER, d.NEAREST), l = d.getParameter(d.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0; var n;
                        n = l ? { vertexShader: ["uniform lowp int renderType;", "uniform vec3 screenPosition;", "uniform vec2 scale;", "uniform float rotation;", "uniform sampler2D occlusionMap;", "attribute vec2 position;", "attribute vec2 uv;", "varying vec2 vUV;", "varying float vVisibility;", "void main() {", "vUV = uv;", "vec2 pos = position;", "if( renderType == 2 ) {", "vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );", "visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );", "visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );", "vVisibility =        visibility.r / 9.0;", "vVisibility *= 1.0 - visibility.g / 9.0;", "vVisibility *=       visibility.b / 9.0;", "vVisibility *= 1.0 - visibility.a / 9.0;", "pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;", "pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;", "}", "gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );", "}"].join("\n"), fragmentShader: ["uniform lowp int renderType;", "uniform sampler2D map;", "uniform float opacity;", "uniform vec3 color;", "varying vec2 vUV;", "varying float vVisibility;", "void main() {", "if( renderType == 0 ) {", "gl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );", "} else if( renderType == 1 ) {", "gl_FragColor = texture2D( map, vUV );", "} else {", "vec4 texture = texture2D( map, vUV );", "texture.a *= opacity * vVisibility;", "gl_FragColor = texture;", "gl_FragColor.rgb *= color;", "}", "}"].join("\n") } : { vertexShader: ["uniform lowp int renderType;", "uniform vec3 screenPosition;", "uniform vec2 scale;", "uniform float rotation;", "attribute vec2 position;", "attribute vec2 uv;", "varying vec2 vUV;", "void main() {", "vUV = uv;", "vec2 pos = position;", "if( renderType == 2 ) {", "pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;", "pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;", "}", "gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );", "}"].join("\n"), fragmentShader: ["precision mediump float;", "uniform lowp int renderType;", "uniform sampler2D map;", "uniform sampler2D occlusionMap;", "uniform float opacity;", "uniform vec3 color;", "varying vec2 vUV;", "void main() {", "if( renderType == 0 ) {", "gl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );", "} else if( renderType == 1 ) {", "gl_FragColor = texture2D( map, vUV );", "} else {", "float visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a;", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a;", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a;", "visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;", "visibility = ( 1.0 - visibility / 4.0 );", "vec4 texture = texture2D( map, vUV );", "texture.a *= opacity * visibility;", "gl_FragColor = texture;", "gl_FragColor.rgb *= color;", "}", "}"].join("\n") }, a = i(n), s = { vertex: d.getAttribLocation(a, "position"), uv: d.getAttribLocation(a, "uv") }, h = { renderType: d.getUniformLocation(a, "renderType"), map: d.getUniformLocation(a, "map"), occlusionMap: d.getUniformLocation(a, "occlusionMap"), opacity: d.getUniformLocation(a, "opacity"), color: d.getUniformLocation(a, "color"), scale: d.getUniformLocation(a, "scale"), rotation: d.getUniformLocation(a, "rotation"), screenPosition: d.getUniformLocation(a, "screenPosition") } };
                this.render = function(i, f, m, g) { if (0 !== t.length) { var v = new n.Vector3,
                            y = g / m,
                            _ = .5 * m,
                            x = .5 * g,
                            b = 16 / g,
                            w = new n.Vector2(b * y, b),
                            T = new n.Vector3(1, 1, 0),
                            M = new n.Vector2(1, 1);
                        void 0 === a && p(), d.useProgram(a), d.enableVertexAttribArray(s.vertex), d.enableVertexAttribArray(s.uv), d.uniform1i(h.occlusionMap, 0), d.uniform1i(h.map, 1), d.bindBuffer(d.ARRAY_BUFFER, r), d.vertexAttribPointer(s.vertex, 2, d.FLOAT, !1, 16, 0), d.vertexAttribPointer(s.uv, 2, d.FLOAT, !1, 16, 8), d.bindBuffer(d.ELEMENT_ARRAY_BUFFER, o), d.disable(d.CULL_FACE), d.depthMask(!1); for (var S = 0, C = t.length; C > S; S++) { b = 16 / g, w.set(b * y, b); var A = t[S]; if (v.set(A.matrixWorld.elements[12], A.matrixWorld.elements[13], A.matrixWorld.elements[14]), v.applyMatrix4(f.matrixWorldInverse), v.applyProjection(f.projectionMatrix), T.copy(v), M.x = T.x * _ + _, M.y = T.y * x + x, l || M.x > 0 && M.x < m && M.y > 0 && M.y < g) { d.activeTexture(d.TEXTURE1), d.bindTexture(d.TEXTURE_2D, c), d.copyTexImage2D(d.TEXTURE_2D, 0, d.RGB, M.x - 8, M.y - 8, 16, 16, 0), d.uniform1i(h.renderType, 0), d.uniform2f(h.scale, w.x, w.y), d.uniform3f(h.screenPosition, T.x, T.y, T.z), d.disable(d.BLEND), d.enable(d.DEPTH_TEST), d.drawElements(d.TRIANGLES, 6, d.UNSIGNED_SHORT, 0), d.activeTexture(d.TEXTURE0), d.bindTexture(d.TEXTURE_2D, u), d.copyTexImage2D(d.TEXTURE_2D, 0, d.RGBA, M.x - 8, M.y - 8, 16, 16, 0), d.uniform1i(h.renderType, 1), d.disable(d.DEPTH_TEST), d.activeTexture(d.TEXTURE1), d.bindTexture(d.TEXTURE_2D, c), d.drawElements(d.TRIANGLES, 6, d.UNSIGNED_SHORT, 0), A.positionScreen.copy(T), A.customUpdateCallback ? A.customUpdateCallback(A) : A.updateLensFlares(), d.uniform1i(h.renderType, 2), d.enable(d.BLEND); for (var E = 0, P = A.lensFlares.length; P > E; E++) { var L = A.lensFlares[E];
                                    L.opacity > .001 && L.scale > .001 && (T.x = L.x, T.y = L.y, T.z = L.z, b = L.size * L.scale / g, w.x = b * y, w.y = b, d.uniform3f(h.screenPosition, T.x, T.y, T.z), d.uniform2f(h.scale, w.x, w.y), d.uniform1f(h.rotation, L.rotation), d.uniform1f(h.opacity, L.opacity), d.uniform3f(h.color, L.color.r, L.color.g, L.color.b), e.state.setBlending(L.blending, L.blendEquation, L.blendSrc, L.blendDst), e.setTexture(L.texture, 1), d.drawElements(d.TRIANGLES, 6, d.UNSIGNED_SHORT, 0)) } } } d.enable(d.CULL_FACE), d.enable(d.DEPTH_TEST), d.depthMask(!0), e.resetGLState() } } }, n.ShadowMapPlugin = function(e, t, i, r) {
                function o(e, t, r) { if (t.visible) { var n = i[t.id]; if (n && t.castShadow && (t.frustumCulled === !1 || m.intersectsObject(t) === !0))
                            for (var a = 0, s = n.length; s > a; a++) { var h = n[a];
                                t._modelViewMatrix.multiplyMatrices(r.matrixWorldInverse, t.matrixWorld), x.push(h) }
                        for (var a = 0, s = t.children.length; s > a; a++) o(e, t.children[a], r) } }

                function a(e, t) { var i = new n.DirectionalLight;
                    i.isVirtual = !0, i.onlyShadow = !0, i.castShadow = !0, i.shadowCameraNear = e.shadowCameraNear, i.shadowCameraFar = e.shadowCameraFar, i.shadowCameraLeft = e.shadowCameraLeft, i.shadowCameraRight = e.shadowCameraRight, i.shadowCameraBottom = e.shadowCameraBottom, i.shadowCameraTop = e.shadowCameraTop, i.shadowCameraVisible = e.shadowCameraVisible, i.shadowDarkness = e.shadowDarkness, i.shadowBias = e.shadowCascadeBias[t], i.shadowMapWidth = e.shadowCascadeWidth[t], i.shadowMapHeight = e.shadowCascadeHeight[t], i.pointsWorld = [], i.pointsFrustum = []; for (var r = i.pointsWorld, o = i.pointsFrustum, a = 0; 8 > a; a++) r[a] = new n.Vector3, o[a] = new n.Vector3; var s = e.shadowCascadeNearZ[t],
                        h = e.shadowCascadeFarZ[t]; return o[0].set(-1, -1, s), o[1].set(1, -1, s), o[2].set(-1, 1, s), o[3].set(1, 1, s), o[4].set(-1, -1, h), o[5].set(1, -1, h), o[6].set(-1, 1, h), o[7].set(1, 1, h), i }

                function s(e, t) { var i = e.shadowCascadeArray[t];
                    i.position.copy(e.position), i.target.position.copy(e.target.position), i.lookAt(i.target), i.shadowCameraVisible = e.shadowCameraVisible, i.shadowDarkness = e.shadowDarkness, i.shadowBias = e.shadowCascadeBias[t]; var r = e.shadowCascadeNearZ[t],
                        n = e.shadowCascadeFarZ[t],
                        o = i.pointsFrustum;
                    o[0].z = r, o[1].z = r, o[2].z = r, o[3].z = r, o[4].z = n, o[5].z = n, o[6].z = n, o[7].z = n }

                function h(e, t) { var i = t.shadowCamera,
                        r = t.pointsFrustum,
                        n = t.pointsWorld;
                    v.set(1 / 0, 1 / 0, 1 / 0), y.set(-(1 / 0), -(1 / 0), -(1 / 0)); for (var o = 0; 8 > o; o++) { var a = n[o];
                        a.copy(r[o]), a.unproject(e), a.applyMatrix4(i.matrixWorldInverse), a.x < v.x && (v.x = a.x), a.x > y.x && (y.x = a.x), a.y < v.y && (v.y = a.y), a.y > y.y && (y.y = a.y), a.z < v.z && (v.z = a.z), a.z > y.z && (y.z = a.z) } i.left = v.x, i.right = y.x, i.top = y.y, i.bottom = v.y, i.updateProjectionMatrix() }

                function l(e) { return e.material instanceof n.MeshFaceMaterial ? e.material.materials[0] : e.material }
                var c, u, d, p, f = e.context,
                    m = new n.Frustum,
                    g = new n.Matrix4,
                    v = new n.Vector3,
                    y = new n.Vector3,
                    _ = new n.Vector3,
                    x = [],
                    b = n.ShaderLib.depthRGBA,
                    w = n.UniformsUtils.clone(b.uniforms);
                c = new n.ShaderMaterial({ uniforms: w, vertexShader: b.vertexShader, fragmentShader: b.fragmentShader }), u = new n.ShaderMaterial({ uniforms: w, vertexShader: b.vertexShader, fragmentShader: b.fragmentShader, morphTargets: !0 }), d = new n.ShaderMaterial({ uniforms: w, vertexShader: b.vertexShader, fragmentShader: b.fragmentShader, skinning: !0 }), p = new n.ShaderMaterial({ uniforms: w, vertexShader: b.vertexShader, fragmentShader: b.fragmentShader, morphTargets: !0, skinning: !0 }), c._shadowPass = !0, u._shadowPass = !0, d._shadowPass = !0, p._shadowPass = !0, this.render = function(i, v) {
                    if (e.shadowMapEnabled !== !1) {
                        var y, b, w, T, M, S, C, A, E, P, L, R, F, k = [],
                            O = 0,
                            D = null;
                        for (f.clearColor(1, 1, 1, 1), f.disable(f.BLEND), f.enable(f.CULL_FACE), f.frontFace(f.CCW), e.shadowMapCullFace === n.CullFaceFront ? f.cullFace(f.FRONT) : f.cullFace(f.BACK), e.state.setDepthTest(!0), y = 0, b = t.length; b > y; y++)
                            if (F = t[y], F.castShadow)
                                if (F instanceof n.DirectionalLight && F.shadowCascade)
                                    for (M = 0; M < F.shadowCascadeCount; M++) { var B; if (F.shadowCascadeArray[M]) B = F.shadowCascadeArray[M];
                                        else { B = a(F, M), B.originalCamera = v; var U = new n.Gyroscope;
                                            U.position.copy(F.shadowCascadeOffset), U.add(B), U.add(B.target), v.add(U), F.shadowCascadeArray[M] = B } s(F, M), k[O] = B, O++ } else k[O] = F, O++;
                        for (y = 0, b = k.length; b > y; y++) {
                            if (F = k[y], !F.shadowMap) {
                                var z = n.LinearFilter;
                                e.shadowMapType === n.PCFSoftShadowMap && (z = n.NearestFilter);
                                var N = { minFilter: z, magFilter: z, format: n.RGBAFormat };
                                F.shadowMap = new n.WebGLRenderTarget(F.shadowMapWidth, F.shadowMapHeight, N), F.shadowMapSize = new n.Vector2(F.shadowMapWidth, F.shadowMapHeight), F.shadowMatrix = new n.Matrix4
                            }
                            if (!F.shadowCamera) { if (F instanceof n.SpotLight) F.shadowCamera = new n.PerspectiveCamera(F.shadowCameraFov, F.shadowMapWidth / F.shadowMapHeight, F.shadowCameraNear, F.shadowCameraFar);
                                else { if (!(F instanceof n.DirectionalLight)) { n.error("THREE.ShadowMapPlugin: Unsupported light type for shadow", F); continue } F.shadowCamera = new n.OrthographicCamera(F.shadowCameraLeft, F.shadowCameraRight, F.shadowCameraTop, F.shadowCameraBottom, F.shadowCameraNear, F.shadowCameraFar) } i.add(F.shadowCamera), i.autoUpdate === !0 && i.updateMatrixWorld() } F.shadowCameraVisible && !F.cameraHelper && (F.cameraHelper = new n.CameraHelper(F.shadowCamera), i.add(F.cameraHelper)), F.isVirtual && B.originalCamera == v && h(v, F), S = F.shadowMap, C = F.shadowMatrix, A = F.shadowCamera, A.position.setFromMatrixPosition(F.matrixWorld), _.setFromMatrixPosition(F.target.matrixWorld), A.lookAt(_), A.updateMatrixWorld(), A.matrixWorldInverse.getInverse(A.matrixWorld), F.cameraHelper && (F.cameraHelper.visible = F.shadowCameraVisible), F.shadowCameraVisible && F.cameraHelper.update(), C.set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, .5, .5, 0, 0, 0, 1), C.multiply(A.projectionMatrix), C.multiply(A.matrixWorldInverse), g.multiplyMatrices(A.projectionMatrix, A.matrixWorldInverse), m.setFromMatrix(g), e.setRenderTarget(S), e.clear(), x.length = 0, o(i, i, A);
                            var V, I, G;
                            for (w = 0, T = x.length; T > w; w++) L = x[w], R = L.object, E = L.buffer, V = l(R), I = void 0 !== R.geometry.morphTargets && R.geometry.morphTargets.length > 0 && V.morphTargets, G = R instanceof n.SkinnedMesh && V.skinning, P = R.customDepthMaterial ? R.customDepthMaterial : G ? I ? p : d : I ? u : c, e.setMaterialFaces(V), E instanceof n.BufferGeometry ? e.renderBufferDirect(A, t, D, P, E, R) : e.renderBuffer(A, t, D, P, E, R);
                            for (w = 0, T = r.length; T > w; w++) L = r[w], R = L.object, R.visible && R.castShadow && (R._modelViewMatrix.multiplyMatrices(A.matrixWorldInverse, R.matrixWorld), e.renderImmediateObject(A, t, D, c, R))
                        }
                        var H = e.getClearColor(),
                            j = e.getClearAlpha();
                        f.clearColor(H.r, H.g, H.b, j), f.enable(f.BLEND), e.shadowMapCullFace === n.CullFaceFront && f.cullFace(f.BACK), e.resetGLState()
                    }
                }
            }, n.SpritePlugin = function(e, t) {
                function i() { var t = u.createProgram(),
                        i = u.createShader(u.VERTEX_SHADER),
                        r = u.createShader(u.FRAGMENT_SHADER); return u.shaderSource(i, ["precision " + e.getPrecision() + " float;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform float rotation;", "uniform vec2 scale;", "uniform vec2 uvOffset;", "uniform vec2 uvScale;", "attribute vec2 position;", "attribute vec2 uv;", "varying vec2 vUV;", "void main() {", "vUV = uvOffset + uv * uvScale;", "vec2 alignedPosition = position * scale;", "vec2 rotatedPosition;", "rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;", "rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;", "vec4 finalPosition;", "finalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );", "finalPosition.xy += rotatedPosition;", "finalPosition = projectionMatrix * finalPosition;", "gl_Position = finalPosition;", "}"].join("\n")), u.shaderSource(r, ["precision " + e.getPrecision() + " float;", "uniform vec3 color;", "uniform sampler2D map;", "uniform float opacity;", "uniform int fogType;", "uniform vec3 fogColor;", "uniform float fogDensity;", "uniform float fogNear;", "uniform float fogFar;", "uniform float alphaTest;", "varying vec2 vUV;", "void main() {", "vec4 texture = texture2D( map, vUV );", "if ( texture.a < alphaTest ) discard;", "gl_FragColor = vec4( color * texture.xyz, texture.a * opacity );", "if ( fogType > 0 ) {", "float depth = gl_FragCoord.z / gl_FragCoord.w;", "float fogFactor = 0.0;", "if ( fogType == 1 ) {", "fogFactor = smoothstep( fogNear, fogFar, depth );", "} else {", "const float LOG2 = 1.442695;", "float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );", "fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );", "}", "gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );", "}", "}"].join("\n")), u.compileShader(i), u.compileShader(r), u.attachShader(t, i), u.attachShader(t, r), u.linkProgram(t), t }

                function r(e, t) { return e.z !== t.z ? t.z - e.z : t.id - e.id } var o, a, s, h, l, c, u = e.context,
                    d = new n.Vector3,
                    p = new n.Quaternion,
                    f = new n.Vector3,
                    m = function() { var e = new Float32Array([-.5, -.5, 0, 0, .5, -.5, 1, 0, .5, .5, 1, 1, -.5, .5, 0, 1]),
                            t = new Uint16Array([0, 1, 2, 0, 2, 3]);
                        o = u.createBuffer(), a = u.createBuffer(), u.bindBuffer(u.ARRAY_BUFFER, o), u.bufferData(u.ARRAY_BUFFER, e, u.STATIC_DRAW), u.bindBuffer(u.ELEMENT_ARRAY_BUFFER, a), u.bufferData(u.ELEMENT_ARRAY_BUFFER, t, u.STATIC_DRAW), s = i(), h = { position: u.getAttribLocation(s, "position"), uv: u.getAttribLocation(s, "uv") }, l = { uvOffset: u.getUniformLocation(s, "uvOffset"), uvScale: u.getUniformLocation(s, "uvScale"), rotation: u.getUniformLocation(s, "rotation"), scale: u.getUniformLocation(s, "scale"), color: u.getUniformLocation(s, "color"), map: u.getUniformLocation(s, "map"), opacity: u.getUniformLocation(s, "opacity"), modelViewMatrix: u.getUniformLocation(s, "modelViewMatrix"), projectionMatrix: u.getUniformLocation(s, "projectionMatrix"), fogType: u.getUniformLocation(s, "fogType"), fogDensity: u.getUniformLocation(s, "fogDensity"), fogNear: u.getUniformLocation(s, "fogNear"), fogFar: u.getUniformLocation(s, "fogFar"), fogColor: u.getUniformLocation(s, "fogColor"), alphaTest: u.getUniformLocation(s, "alphaTest") }; var r = document.createElement("canvas");
                        r.width = 8, r.height = 8; var d = r.getContext("2d");
                        d.fillStyle = "white", d.fillRect(0, 0, 8, 8), c = new n.Texture(r), c.needsUpdate = !0 };
                this.render = function(i, g) { if (0 !== t.length) { void 0 === s && m(), u.useProgram(s), u.enableVertexAttribArray(h.position), u.enableVertexAttribArray(h.uv), u.disable(u.CULL_FACE), u.enable(u.BLEND), u.bindBuffer(u.ARRAY_BUFFER, o), u.vertexAttribPointer(h.position, 2, u.FLOAT, !1, 16, 0), u.vertexAttribPointer(h.uv, 2, u.FLOAT, !1, 16, 8), u.bindBuffer(u.ELEMENT_ARRAY_BUFFER, a), u.uniformMatrix4fv(l.projectionMatrix, !1, g.projectionMatrix.elements), u.activeTexture(u.TEXTURE0), u.uniform1i(l.map, 0); var v = 0,
                            y = 0,
                            _ = i.fog;
                        _ ? (u.uniform3f(l.fogColor, _.color.r, _.color.g, _.color.b), _ instanceof n.Fog ? (u.uniform1f(l.fogNear, _.near), u.uniform1f(l.fogFar, _.far), u.uniform1i(l.fogType, 1), v = 1, y = 1) : _ instanceof n.FogExp2 && (u.uniform1f(l.fogDensity, _.density), u.uniform1i(l.fogType, 2), v = 2, y = 2)) : (u.uniform1i(l.fogType, 0), v = 0, y = 0); for (var x = 0, b = t.length; b > x; x++) { var w = t[x];
                            w._modelViewMatrix.multiplyMatrices(g.matrixWorldInverse, w.matrixWorld), w.z = -w._modelViewMatrix.elements[14] } t.sort(r); for (var T = [], x = 0, b = t.length; b > x; x++) { var w = t[x],
                                M = w.material;
                            u.uniform1f(l.alphaTest, M.alphaTest), u.uniformMatrix4fv(l.modelViewMatrix, !1, w._modelViewMatrix.elements), w.matrixWorld.decompose(d, p, f), T[0] = f.x, T[1] = f.y; var S = 0;
                            i.fog && M.fog && (S = y), v !== S && (u.uniform1i(l.fogType, S), v = S), null !== M.map ? (u.uniform2f(l.uvOffset, M.map.offset.x, M.map.offset.y), u.uniform2f(l.uvScale, M.map.repeat.x, M.map.repeat.y)) : (u.uniform2f(l.uvOffset, 0, 0), u.uniform2f(l.uvScale, 1, 1)), u.uniform1f(l.opacity, M.opacity), u.uniform3f(l.color, M.color.r, M.color.g, M.color.b), u.uniform1f(l.rotation, M.rotation), u.uniform2fv(l.scale, T), e.state.setBlending(M.blending, M.blendEquation, M.blendSrc, M.blendDst), e.state.setDepthTest(M.depthTest), e.state.setDepthWrite(M.depthWrite), M.map && M.map.image && M.map.image.width ? e.setTexture(M.map, 0) : e.setTexture(c, 0), u.drawElements(u.TRIANGLES, 6, u.UNSIGNED_SHORT, 0) } u.enable(u.CULL_FACE), e.resetGLState() } } }, n.GeometryUtils = { merge: function(e, t, i) { n.warn("THREE.GeometryUtils: .merge() has been moved to Geometry. Use geometry.merge( geometry2, matrix, materialIndexOffset ) instead."); var r;
                    t instanceof n.Mesh && (t.matrixAutoUpdate && t.updateMatrix(), r = t.matrix, t = t.geometry), e.merge(t, r, i) }, center: function(e) { return n.warn("THREE.GeometryUtils: .center() has been moved to Geometry. Use geometry.center() instead."), e.center() } }, n.ImageUtils = { crossOrigin: void 0, loadTexture: function(e, t, i, r) { var o = new n.ImageLoader;
                    o.crossOrigin = this.crossOrigin; var a = new n.Texture(void 0, t); return o.load(e, function(e) { a.image = e, a.needsUpdate = !0, i && i(a) }, void 0, function(e) { r && r(e) }), a.sourceFile = e, a }, loadTextureCube: function(e, t, i, r) { var o = [],
                        a = new n.ImageLoader;
                    a.crossOrigin = this.crossOrigin; var s = new n.CubeTexture(o, t);
                    s.flipY = !1; for (var h = 0, l = function(t) { a.load(e[t], function(e) { s.images[t] = e, h += 1, 6 === h && (s.needsUpdate = !0, i && i(s)) }, void 0, r) }, c = 0, u = e.length; u > c; ++c) l(c); return s }, loadCompressedTexture: function() { n.error("THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.") }, loadCompressedTextureCube: function() { n.error("THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.") }, getNormalMap: function(e, t) { var i = function(e, t) { return [e[1] * t[2] - e[2] * t[1], e[2] * t[0] - e[0] * t[2], e[0] * t[1] - e[1] * t[0]] },
                        r = function(e, t) { return [e[0] - t[0], e[1] - t[1], e[2] - t[2]] },
                        n = function(e) { var t = Math.sqrt(e[0] * e[0] + e[1] * e[1] + e[2] * e[2]); return [e[0] / t, e[1] / t, e[2] / t] };
                    t = 1 | t; var o = e.width,
                        a = e.height,
                        s = document.createElement("canvas");
                    s.width = o, s.height = a; var h = s.getContext("2d");
                    h.drawImage(e, 0, 0); for (var l = h.getImageData(0, 0, o, a).data, c = h.createImageData(o, a), u = c.data, d = 0; o > d; d++)
                        for (var p = 0; a > p; p++) { var f = 0 > p - 1 ? 0 : p - 1,
                                m = p + 1 > a - 1 ? a - 1 : p + 1,
                                g = 0 > d - 1 ? 0 : d - 1,
                                v = d + 1 > o - 1 ? o - 1 : d + 1,
                                y = [],
                                _ = [0, 0, l[4 * (p * o + d)] / 255 * t];
                            y.push([-1, 0, l[4 * (p * o + g)] / 255 * t]), y.push([-1, -1, l[4 * (f * o + g)] / 255 * t]), y.push([0, -1, l[4 * (f * o + d)] / 255 * t]), y.push([1, -1, l[4 * (f * o + v)] / 255 * t]), y.push([1, 0, l[4 * (p * o + v)] / 255 * t]), y.push([1, 1, l[4 * (m * o + v)] / 255 * t]), y.push([0, 1, l[4 * (m * o + d)] / 255 * t]), y.push([-1, 1, l[4 * (m * o + g)] / 255 * t]); for (var x = [], b = y.length, w = 0; b > w; w++) { var T = y[w],
                                    M = y[(w + 1) % b];
                                T = r(T, _), M = r(M, _), x.push(n(i(T, M))) } for (var S = [0, 0, 0], w = 0; w < x.length; w++) S[0] += x[w][0], S[1] += x[w][1], S[2] += x[w][2];
                            S[0] /= x.length, S[1] /= x.length, S[2] /= x.length; var C = 4 * (p * o + d);
                            u[C] = (S[0] + 1) / 2 * 255 | 0, u[C + 1] = (S[1] + 1) / 2 * 255 | 0, u[C + 2] = 255 * S[2] | 0, u[C + 3] = 255 }
                    return h.putImageData(c, 0, 0), s }, generateDataTexture: function(e, t, i) { for (var r = e * t, o = new Uint8Array(3 * r), a = Math.floor(255 * i.r), s = Math.floor(255 * i.g), h = Math.floor(255 * i.b), l = 0; r > l; l++) o[3 * l] = a, o[3 * l + 1] = s, o[3 * l + 2] = h; var c = new n.DataTexture(o, e, t, n.RGBFormat); return c.needsUpdate = !0, c } }, n.SceneUtils = { createMultiMaterialObject: function(e, t) { for (var i = new n.Object3D, r = 0, o = t.length; o > r; r++) i.add(new n.Mesh(e, t[r])); return i }, detach: function(e, t, i) { e.applyMatrix(t.matrixWorld), t.remove(e), i.add(e) }, attach: function(e, t, i) { var r = new n.Matrix4;
                    r.getInverse(i.matrixWorld), e.applyMatrix(r), t.remove(e), i.add(e) } }, n.FontUtils = { faces: {}, face: "helvetiker", weight: "normal", style: "normal", size: 150, divisions: 10, getFace: function() { try { return this.faces[this.face][this.weight][this.style] } catch (e) { throw "The font " + this.face + " with " + this.weight + " weight and " + this.style + " style is missing." } }, loadFace: function(e) { var t = e.familyName.toLowerCase(),
                        i = this; return i.faces[t] = i.faces[t] || {}, i.faces[t][e.cssFontWeight] = i.faces[t][e.cssFontWeight] || {}, i.faces[t][e.cssFontWeight][e.cssFontStyle] = e, i.faces[t][e.cssFontWeight][e.cssFontStyle] = e, e }, drawText: function(e) { var t, i = this.getFace(),
                        r = this.size / i.resolution,
                        o = 0,
                        a = String(e).split(""),
                        s = a.length,
                        h = []; for (t = 0; s > t; t++) { var l = new n.Path,
                            c = this.extractGlyphPoints(a[t], i, r, o, l);
                        o += c.offset, h.push(c.path) } var u = o / 2; return { paths: h, offset: u } }, extractGlyphPoints: function(e, t, i, r, o) { var a, s, h, l, c, u, d, p, f, m, g, v, y, _, x, b, w, T, M, S = [],
                        C = t.glyphs[e] || t.glyphs["?"]; if (C) { if (C.o)
                            for (l = C._cachedOutline || (C._cachedOutline = C.o.split(" ")), u = l.length, d = i, p = i, a = 0; u > a;) switch (c = l[a++]) {
                                case "m":
                                    f = l[a++] * d + r, m = l[a++] * p, o.moveTo(f, m); break;
                                case "l":
                                    f = l[a++] * d + r, m = l[a++] * p, o.lineTo(f, m); break;
                                case "q":
                                    if (g = l[a++] * d + r, v = l[a++] * p, x = l[a++] * d + r, b = l[a++] * p, o.quadraticCurveTo(x, b, g, v), M = S[S.length - 1])
                                        for (y = M.x, _ = M.y, s = 1, h = this.divisions; h >= s; s++) { var A = s / h;
                                            n.Shape.Utils.b2(A, y, x, g), n.Shape.Utils.b2(A, _, b, v) }
                                    break;
                                case "b":
                                    if (g = l[a++] * d + r, v = l[a++] * p, x = l[a++] * d + r, b = l[a++] * p, w = l[a++] * d + r, T = l[a++] * p, o.bezierCurveTo(x, b, w, T, g, v), M = S[S.length - 1])
                                        for (y = M.x, _ = M.y, s = 1, h = this.divisions; h >= s; s++) { var A = s / h;
                                            n.Shape.Utils.b3(A, y, x, w, g), n.Shape.Utils.b3(A, _, b, T, v) } }
                        return { offset: C.ha * i, path: o } } } }, n.FontUtils.generateShapes = function(e, t) { t = t || {}; var i = void 0 !== t.size ? t.size : 100,
                    r = void 0 !== t.curveSegments ? t.curveSegments : 4,
                    o = void 0 !== t.font ? t.font : "helvetiker",
                    a = void 0 !== t.weight ? t.weight : "normal",
                    s = void 0 !== t.style ? t.style : "normal";
                n.FontUtils.size = i, n.FontUtils.divisions = r, n.FontUtils.face = o, n.FontUtils.weight = a, n.FontUtils.style = s; for (var h = n.FontUtils.drawText(e), l = h.paths, c = [], u = 0, d = l.length; d > u; u++) Array.prototype.push.apply(c, l[u].toShapes()); return c },
            function(e) { var t = 1e-10,
                    i = function(e, t) { var i = e.length; if (3 > i) return null; var a, s, h, l = [],
                            c = [],
                            u = []; if (r(e) > 0)
                            for (s = 0; i > s; s++) c[s] = s;
                        else
                            for (s = 0; i > s; s++) c[s] = i - 1 - s; var d = i,
                            p = 2 * d; for (s = d - 1; d > 2;) { if (p-- <= 0) return n.warn("THREE.FontUtils: Warning, unable to triangulate polygon! in Triangulate.process()"), t ? u : l; if (a = s, a >= d && (a = 0), s = a + 1, s >= d && (s = 0), h = s + 1, h >= d && (h = 0), o(e, a, s, h, d, c)) { var f, m, g, v, y; for (f = c[a], m = c[s], g = c[h], l.push([e[f], e[m], e[g]]), u.push([c[a], c[s], c[h]]), v = s, y = s + 1; d > y; v++, y++) c[v] = c[y];
                                d--, p = 2 * d } } return t ? u : l },
                    r = function(e) { for (var t = e.length, i = 0, r = t - 1, n = 0; t > n; r = n++) i += e[r].x * e[n].y - e[n].x * e[r].y; return .5 * i },
                    o = function(e, i, r, n, o, a) { var s, h, l, c, u, d, p, f, m; if (h = e[a[i]].x, l = e[a[i]].y, c = e[a[r]].x, u = e[a[r]].y, d = e[a[n]].x, p = e[a[n]].y, t > (c - h) * (p - l) - (u - l) * (d - h)) return !1; var g, v, y, _, x, b, w, T, M, S, C, A, E, P, L; for (g = d - c, v = p - u, y = h - d, _ = l - p, x = c - h, b = u - l, s = 0; o > s; s++)
                            if (f = e[a[s]].x, m = e[a[s]].y, !(f === h && m === l || f === c && m === u || f === d && m === p) && (w = f - h, T = m - l, M = f - c, S = m - u, C = f - d, A = m - p, L = g * S - v * M, E = x * T - b * w, P = y * A - _ * C, L >= -t && P >= -t && E >= -t)) return !1; return !0 }; return e.Triangulate = i, e.Triangulate.area = r, e }(n.FontUtils), r._typeface_js = { faces: n.FontUtils.faces, loadFace: n.FontUtils.loadFace }, n.typeface_js = r._typeface_js, n.Audio = function(e) { n.Object3D.call(this), this.type = "Audio", this.context = e.context, this.source = this.context.createBufferSource(), this.source.onended = this.onEnded.bind(this), this.gain = this.context.createGain(), this.gain.connect(this.context.destination), this.panner = this.context.createPanner(), this.panner.connect(this.gain), this.autoplay = !1, this.startTime = 0, this.isPlaying = !1 }, n.Audio.prototype = Object.create(n.Object3D.prototype), n.Audio.prototype.constructor = n.Audio, n.Audio.prototype.load = function(e) { var t = this,
                    i = new XMLHttpRequest; return i.open("GET", e, !0), i.responseType = "arraybuffer", i.onload = function(e) { t.context.decodeAudioData(this.response, function(e) { t.source.buffer = e, t.autoplay && t.play() }) }, i.send(), this }, n.Audio.prototype.play = function() { if (this.isPlaying === !0) return void n.warn("THREE.Audio: Audio is already playing."); var e = this.context.createBufferSource();
                e.buffer = this.source.buffer, e.loop = this.source.loop, e.onended = this.source.onended, e.connect(this.panner), e.start(0, this.startTime), this.isPlaying = !0, this.source = e }, n.Audio.prototype.pause = function() { this.source.stop(), this.startTime = this.context.currentTime }, n.Audio.prototype.stop = function() { this.source.stop(), this.startTime = 0 }, n.Audio.prototype.onEnded = function() { this.isPlaying = !1 }, n.Audio.prototype.setLoop = function(e) { this.source.loop = e }, n.Audio.prototype.setRefDistance = function(e) { this.panner.refDistance = e }, n.Audio.prototype.setRolloffFactor = function(e) { this.panner.rolloffFactor = e }, n.Audio.prototype.setVolume = function(e) { this.gain.gain.value = e }, n.Audio.prototype.updateMatrixWorld = function() { var e = new n.Vector3; return function(t) { n.Object3D.prototype.updateMatrixWorld.call(this, t), e.setFromMatrixPosition(this.matrixWorld), this.panner.setPosition(e.x, e.y, e.z) } }(), n.AudioListener = function() { n.Object3D.call(this), this.type = "AudioListener", this.context = new(window.AudioContext || window.webkitAudioContext) }, n.AudioListener.prototype = Object.create(n.Object3D.prototype), n.AudioListener.prototype.constructor = n.AudioListener, n.AudioListener.prototype.updateMatrixWorld = function() { var e = new n.Vector3,
                    t = new n.Quaternion,
                    i = new n.Vector3,
                    r = new n.Vector3,
                    o = new n.Vector3,
                    a = new n.Vector3; return function(s) { n.Object3D.prototype.updateMatrixWorld.call(this, s); var h = this.context.listener,
                        l = this.up;
                    this.matrixWorld.decompose(e, t, i), r.set(0, 0, -1).applyQuaternion(t), o.subVectors(e, a), h.setPosition(e.x, e.y, e.z), h.setOrientation(r.x, r.y, r.z, l.x, l.y, l.z), h.setVelocity(o.x, o.y, o.z), a.copy(e) } }(), n.Curve = function() {}, n.Curve.prototype.getPoint = function(e) { return n.warn("THREE.Curve: Warning, getPoint() not implemented!"), null }, n.Curve.prototype.getPointAt = function(e) { var t = this.getUtoTmapping(e); return this.getPoint(t) }, n.Curve.prototype.getPoints = function(e) { e || (e = 5); var t, i = []; for (t = 0; e >= t; t++) i.push(this.getPoint(t / e)); return i }, n.Curve.prototype.getSpacedPoints = function(e) { e || (e = 5); var t, i = []; for (t = 0; e >= t; t++) i.push(this.getPointAt(t / e)); return i }, n.Curve.prototype.getLength = function() { var e = this.getLengths(); return e[e.length - 1] }, n.Curve.prototype.getLengths = function(e) { if (e || (e = this.__arcLengthDivisions ? this.__arcLengthDivisions : 200), this.cacheArcLengths && this.cacheArcLengths.length == e + 1 && !this.needsUpdate) return this.cacheArcLengths;
                this.needsUpdate = !1; var t, i, r = [],
                    n = this.getPoint(0),
                    o = 0; for (r.push(0), i = 1; e >= i; i++) t = this.getPoint(i / e), o += t.distanceTo(n), r.push(o), n = t; return this.cacheArcLengths = r, r }, n.Curve.prototype.updateArcLengths = function() { this.needsUpdate = !0, this.getLengths() }, n.Curve.prototype.getUtoTmapping = function(e, t) { var i, r = this.getLengths(),
                    n = 0,
                    o = r.length;
                i = t ? t : e * r[o - 1]; for (var a, s = 0, h = o - 1; h >= s;)
                    if (n = Math.floor(s + (h - s) / 2), a = r[n] - i, 0 > a) s = n + 1;
                    else { if (!(a > 0)) { h = n; break } h = n - 1 } if (n = h, r[n] == i) { var l = n / (o - 1); return l } var c = r[n],
                    u = r[n + 1],
                    d = u - c,
                    p = (i - c) / d,
                    l = (n + p) / (o - 1); return l }, n.Curve.prototype.getTangent = function(e) { var t = 1e-4,
                    i = e - t,
                    r = e + t;
                0 > i && (i = 0), r > 1 && (r = 1); var n = this.getPoint(i),
                    o = this.getPoint(r),
                    a = o.clone().sub(n); return a.normalize() }, n.Curve.prototype.getTangentAt = function(e) { var t = this.getUtoTmapping(e); return this.getTangent(t) }, n.Curve.Utils = { tangentQuadraticBezier: function(e, t, i, r) { return 2 * (1 - e) * (i - t) + 2 * e * (r - i) }, tangentCubicBezier: function(e, t, i, r, n) { return -3 * t * (1 - e) * (1 - e) + 3 * i * (1 - e) * (1 - e) - 6 * e * i * (1 - e) + 6 * e * r * (1 - e) - 3 * e * e * r + 3 * e * e * n }, tangentSpline: function(e, t, i, r, n) { var o = 6 * e * e - 6 * e,
                        a = 3 * e * e - 4 * e + 1,
                        s = -6 * e * e + 6 * e,
                        h = 3 * e * e - 2 * e; return o + a + s + h }, interpolate: function(e, t, i, r, n) { var o = .5 * (i - e),
                        a = .5 * (r - t),
                        s = n * n,
                        h = n * s; return (2 * t - 2 * i + o + a) * h + (-3 * t + 3 * i - 2 * o - a) * s + o * n + t } }, n.Curve.create = function(e, t) { return e.prototype = Object.create(n.Curve.prototype), e.prototype.constructor = e, e.prototype.getPoint = t, e }, n.CurvePath = function() { this.curves = [], this.bends = [], this.autoClose = !1 }, n.CurvePath.prototype = Object.create(n.Curve.prototype), n.CurvePath.prototype.constructor = n.CurvePath, n.CurvePath.prototype.add = function(e) { this.curves.push(e) }, n.CurvePath.prototype.checkConnection = function() {}, n.CurvePath.prototype.closePath = function() { var e = this.curves[0].getPoint(0),
                    t = this.curves[this.curves.length - 1].getPoint(1);
                e.equals(t) || this.curves.push(new n.LineCurve(t, e)) }, n.CurvePath.prototype.getPoint = function(e) { for (var t, i, r = e * this.getLength(), n = this.getCurveLengths(), o = 0; o < n.length;) { if (n[o] >= r) { t = n[o] - r, i = this.curves[o]; var a = 1 - t / i.getLength(); return i.getPointAt(a) } o++ } return null }, n.CurvePath.prototype.getLength = function() { var e = this.getCurveLengths(); return e[e.length - 1] }, n.CurvePath.prototype.getCurveLengths = function() { if (this.cacheLengths && this.cacheLengths.length == this.curves.length) return this.cacheLengths; var e, t = [],
                    i = 0,
                    r = this.curves.length; for (e = 0; r > e; e++) i += this.curves[e].getLength(), t.push(i); return this.cacheLengths = t, t }, n.CurvePath.prototype.getBoundingBox = function() { var e, t, i, r, o, a, s = this.getPoints();
                e = t = Number.NEGATIVE_INFINITY, r = o = Number.POSITIVE_INFINITY; var h, l, c, u, d = s[0] instanceof n.Vector3; for (u = d ? new n.Vector3 : new n.Vector2, l = 0, c = s.length; c > l; l++) h = s[l], h.x > e ? e = h.x : h.x < r && (r = h.x), h.y > t ? t = h.y : h.y < o && (o = h.y), d && (h.z > i ? i = h.z : h.z < a && (a = h.z)), u.add(h); var p = { minX: r, minY: o, maxX: e, maxY: t }; return d && (p.maxZ = i, p.minZ = a), p }, n.CurvePath.prototype.createPointsGeometry = function(e) { var t = this.getPoints(e, !0); return this.createGeometry(t) }, n.CurvePath.prototype.createSpacedPointsGeometry = function(e) { var t = this.getSpacedPoints(e, !0); return this.createGeometry(t) }, n.CurvePath.prototype.createGeometry = function(e) { for (var t = new n.Geometry, i = 0; i < e.length; i++) t.vertices.push(new n.Vector3(e[i].x, e[i].y, e[i].z || 0)); return t }, n.CurvePath.prototype.addWrapPath = function(e) { this.bends.push(e) }, n.CurvePath.prototype.getTransformedPoints = function(e, t) { var i, r, n = this.getPoints(e); for (t || (t = this.bends), i = 0, r = t.length; r > i; i++) n = this.getWrapPoints(n, t[i]); return n }, n.CurvePath.prototype.getTransformedSpacedPoints = function(e, t) { var i, r, n = this.getSpacedPoints(e); for (t || (t = this.bends), i = 0, r = t.length; r > i; i++) n = this.getWrapPoints(n, t[i]); return n }, n.CurvePath.prototype.getWrapPoints = function(e, t) { var i, r, n, o, a, s, h = this.getBoundingBox(); for (i = 0, r = e.length; r > i; i++) { n = e[i], o = n.x, a = n.y, s = o / h.maxX, s = t.getUtoTmapping(s, o); var l = t.getPoint(s),
                        c = t.getTangent(s);
                    c.set(-c.y, c.x).multiplyScalar(a), n.x = l.x + c.x, n.y = l.y + c.y } return e }, n.Gyroscope = function() { n.Object3D.call(this) }, n.Gyroscope.prototype = Object.create(n.Object3D.prototype), n.Gyroscope.prototype.constructor = n.Gyroscope, n.Gyroscope.prototype.updateMatrixWorld = function() { var e = new n.Vector3,
                    t = new n.Quaternion,
                    i = new n.Vector3,
                    r = new n.Vector3,
                    o = new n.Quaternion,
                    a = new n.Vector3; return function(n) { this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || n) && (this.parent ? (this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), this.matrixWorld.decompose(r, o, a), this.matrix.decompose(e, t, i), this.matrixWorld.compose(r, t, a)) : this.matrixWorld.copy(this.matrix), this.matrixWorldNeedsUpdate = !1, n = !0); for (var s = 0, h = this.children.length; h > s; s++) this.children[s].updateMatrixWorld(n) } }(), n.Path = function(e) { n.CurvePath.call(this), this.actions = [], e && this.fromPoints(e) }, n.Path.prototype = Object.create(n.CurvePath.prototype), n.Path.prototype.constructor = n.Path, n.PathActions = { MOVE_TO: "moveTo", LINE_TO: "lineTo", QUADRATIC_CURVE_TO: "quadraticCurveTo", BEZIER_CURVE_TO: "bezierCurveTo", CSPLINE_THRU: "splineThru", ARC: "arc", ELLIPSE: "ellipse" }, n.Path.prototype.fromPoints = function(e) { this.moveTo(e[0].x, e[0].y); for (var t = 1, i = e.length; i > t; t++) this.lineTo(e[t].x, e[t].y) }, n.Path.prototype.moveTo = function(e, t) { var i = Array.prototype.slice.call(arguments);
                this.actions.push({ action: n.PathActions.MOVE_TO, args: i }) }, n.Path.prototype.lineTo = function(e, t) { var i = Array.prototype.slice.call(arguments),
                    r = this.actions[this.actions.length - 1].args,
                    o = r[r.length - 2],
                    a = r[r.length - 1],
                    s = new n.LineCurve(new n.Vector2(o, a), new n.Vector2(e, t));
                this.curves.push(s), this.actions.push({ action: n.PathActions.LINE_TO, args: i }) }, n.Path.prototype.quadraticCurveTo = function(e, t, i, r) { var o = Array.prototype.slice.call(arguments),
                    a = this.actions[this.actions.length - 1].args,
                    s = a[a.length - 2],
                    h = a[a.length - 1],
                    l = new n.QuadraticBezierCurve(new n.Vector2(s, h), new n.Vector2(e, t), new n.Vector2(i, r));
                this.curves.push(l), this.actions.push({ action: n.PathActions.QUADRATIC_CURVE_TO, args: o }) }, n.Path.prototype.bezierCurveTo = function(e, t, i, r, o, a) { var s = Array.prototype.slice.call(arguments),
                    h = this.actions[this.actions.length - 1].args,
                    l = h[h.length - 2],
                    c = h[h.length - 1],
                    u = new n.CubicBezierCurve(new n.Vector2(l, c), new n.Vector2(e, t), new n.Vector2(i, r), new n.Vector2(o, a));
                this.curves.push(u), this.actions.push({ action: n.PathActions.BEZIER_CURVE_TO, args: s }) }, n.Path.prototype.splineThru = function(e) { var t = Array.prototype.slice.call(arguments),
                    i = this.actions[this.actions.length - 1].args,
                    r = i[i.length - 2],
                    o = i[i.length - 1],
                    a = [new n.Vector2(r, o)];
                Array.prototype.push.apply(a, e); var s = new n.SplineCurve(a);
                this.curves.push(s), this.actions.push({ action: n.PathActions.CSPLINE_THRU, args: t }) }, n.Path.prototype.arc = function(e, t, i, r, n, o) { var a = this.actions[this.actions.length - 1].args,
                    s = a[a.length - 2],
                    h = a[a.length - 1];
                this.absarc(e + s, t + h, i, r, n, o) }, n.Path.prototype.absarc = function(e, t, i, r, n, o) { this.absellipse(e, t, i, i, r, n, o) }, n.Path.prototype.ellipse = function(e, t, i, r, n, o, a) { var s = this.actions[this.actions.length - 1].args,
                    h = s[s.length - 2],
                    l = s[s.length - 1];
                this.absellipse(e + h, t + l, i, r, n, o, a) }, n.Path.prototype.absellipse = function(e, t, i, r, o, a, s) { var h = Array.prototype.slice.call(arguments),
                    l = new n.EllipseCurve(e, t, i, r, o, a, s);
                this.curves.push(l); var c = l.getPoint(1);
                h.push(c.x), h.push(c.y), this.actions.push({ action: n.PathActions.ELLIPSE, args: h }) }, n.Path.prototype.getSpacedPoints = function(e, t) { e || (e = 40); for (var i = [], r = 0; e > r; r++) i.push(this.getPoint(r / e)); return i }, n.Path.prototype.getPoints = function(e, t) { if (this.useSpacedPoints) return console.log("tata"), this.getSpacedPoints(e, t);
                e = e || 12; var i, r, o, a, s, h, l, c, u, d, p, f, m, g, v, y, _, x, b = []; for (i = 0, r = this.actions.length; r > i; i++) switch (o = this.actions[i], a = o.action, s = o.args, a) {
                    case n.PathActions.MOVE_TO:
                        b.push(new n.Vector2(s[0], s[1])); break;
                    case n.PathActions.LINE_TO:
                        b.push(new n.Vector2(s[0], s[1])); break;
                    case n.PathActions.QUADRATIC_CURVE_TO:
                        for (h = s[2], l = s[3], d = s[0], p = s[1], b.length > 0 ? (g = b[b.length - 1], f = g.x, m = g.y) : (g = this.actions[i - 1].args, f = g[g.length - 2], m = g[g.length - 1]), v = 1; e >= v; v++) y = v / e, _ = n.Shape.Utils.b2(y, f, d, h), x = n.Shape.Utils.b2(y, m, p, l), b.push(new n.Vector2(_, x)); break;
                    case n.PathActions.BEZIER_CURVE_TO:
                        for (h = s[4], l = s[5], d = s[0], p = s[1], c = s[2], u = s[3], b.length > 0 ? (g = b[b.length - 1], f = g.x, m = g.y) : (g = this.actions[i - 1].args, f = g[g.length - 2], m = g[g.length - 1]), v = 1; e >= v; v++) y = v / e, _ = n.Shape.Utils.b3(y, f, d, c, h), x = n.Shape.Utils.b3(y, m, p, u, l), b.push(new n.Vector2(_, x)); break;
                    case n.PathActions.CSPLINE_THRU:
                        g = this.actions[i - 1].args; var w = new n.Vector2(g[g.length - 2], g[g.length - 1]),
                            T = [w],
                            M = e * s[0].length;
                        T = T.concat(s[0]); var S = new n.SplineCurve(T); for (v = 1; M >= v; v++) b.push(S.getPointAt(v / M)); break;
                    case n.PathActions.ARC:
                        var C, A = s[0],
                            E = s[1],
                            P = s[2],
                            L = s[3],
                            R = s[4],
                            F = !!s[5],
                            k = R - L,
                            O = 2 * e; for (v = 1; O >= v; v++) y = v / O, F || (y = 1 - y), C = L + y * k, _ = A + P * Math.cos(C), x = E + P * Math.sin(C), b.push(new n.Vector2(_, x)); break;
                    case n.PathActions.ELLIPSE:
                        var C, A = s[0],
                            E = s[1],
                            D = s[2],
                            B = s[3],
                            L = s[4],
                            R = s[5],
                            F = !!s[6],
                            k = R - L,
                            O = 2 * e; for (v = 1; O >= v; v++) y = v / O, F || (y = 1 - y), C = L + y * k, _ = A + D * Math.cos(C), x = E + B * Math.sin(C), b.push(new n.Vector2(_, x)) }
                var U = b[b.length - 1],
                    z = 1e-10; return Math.abs(U.x - b[0].x) < z && Math.abs(U.y - b[0].y) < z && b.splice(b.length - 1, 1), t && b.push(b[0]), b }, n.Path.prototype.toShapes = function(e, t) {
                function i(e) { var t, i, r, o, a, s = [],
                        h = new n.Path; for (t = 0, i = e.length; i > t; t++) r = e[t], a = r.args, o = r.action, o == n.PathActions.MOVE_TO && 0 != h.actions.length && (s.push(h), h = new n.Path), h[o].apply(h, a); return 0 != h.actions.length && s.push(h), s }

                function r(e) { for (var t = [], i = 0, r = e.length; r > i; i++) { var o = e[i],
                            a = new n.Shape;
                        a.actions = o.actions, a.curves = o.curves, t.push(a) } return t }

                function o(e, t) { for (var i = 1e-10, r = t.length, n = !1, o = r - 1, a = 0; r > a; o = a++) { var s = t[o],
                            h = t[a],
                            l = h.x - s.x,
                            c = h.y - s.y; if (Math.abs(c) > i) { if (0 > c && (s = t[a], l = -l, h = t[o], c = -c), e.y < s.y || e.y > h.y) continue; if (e.y == s.y) { if (e.x == s.x) return !0 } else { var u = c * (e.x - s.x) - l * (e.y - s.y); if (0 == u) return !0; if (0 > u) continue;
                                n = !n } } else { if (e.y != s.y) continue; if (h.x <= e.x && e.x <= s.x || s.x <= e.x && e.x <= h.x) return !0 } } return n } var a = i(this.actions); if (0 == a.length) return []; if (t === !0) return r(a); var s, h, l, c = []; if (1 == a.length) return h = a[0], l = new n.Shape, l.actions = h.actions, l.curves = h.curves, c.push(l), c; var u = !n.Shape.Utils.isClockWise(a[0].getPoints());
                u = e ? !u : u; var d, p = [],
                    f = [],
                    m = [],
                    g = 0;
                f[g] = void 0, m[g] = []; var v, y; for (v = 0, y = a.length; y > v; v++) h = a[v], d = h.getPoints(), s = n.Shape.Utils.isClockWise(d), s = e ? !s : s, s ? (!u && f[g] && g++, f[g] = { s: new n.Shape, p: d }, f[g].s.actions = h.actions, f[g].s.curves = h.curves, u && g++, m[g] = []) : m[g].push({ h: h, p: d[0] }); if (!f[0]) return r(a); if (f.length > 1) { for (var _ = !1, x = [], b = 0, w = f.length; w > b; b++) p[b] = []; for (var b = 0, w = f.length; w > b; b++)
                        for (var T = m[b], M = 0; M < T.length; M++) { for (var S = T[M], C = !0, A = 0; A < f.length; A++) o(S.p, f[A].p) && (b != A && x.push({ froms: b, tos: A, hole: M }), C ? (C = !1, p[A].push(S)) : _ = !0);
                            C && p[b].push(S) } x.length > 0 && (_ || (m = p)) } var E, P, L; for (v = 0, y = f.length; y > v; v++)
                    for (l = f[v].s, c.push(l), E = m[v], P = 0, L = E.length; L > P; P++) l.holes.push(E[P].h); return c }, n.Shape = function() { n.Path.apply(this, arguments), this.holes = [] }, n.Shape.prototype = Object.create(n.Path.prototype), n.Shape.prototype.constructor = n.Shape, n.Shape.prototype.extrude = function(e) { var t = new n.ExtrudeGeometry(this, e); return t }, n.Shape.prototype.makeGeometry = function(e) { var t = new n.ShapeGeometry(this, e); return t }, n.Shape.prototype.getPointsHoles = function(e) { var t, i = this.holes.length,
                    r = []; for (t = 0; i > t; t++) r[t] = this.holes[t].getTransformedPoints(e, this.bends); return r }, n.Shape.prototype.getSpacedPointsHoles = function(e) { var t, i = this.holes.length,
                    r = []; for (t = 0; i > t; t++) r[t] = this.holes[t].getTransformedSpacedPoints(e, this.bends); return r }, n.Shape.prototype.extractAllPoints = function(e) { return { shape: this.getTransformedPoints(e), holes: this.getPointsHoles(e) } }, n.Shape.prototype.extractPoints = function(e) { return this.useSpacedPoints ? this.extractAllSpacedPoints(e) : this.extractAllPoints(e) }, n.Shape.prototype.extractAllSpacedPoints = function(e) { return { shape: this.getTransformedSpacedPoints(e), holes: this.getSpacedPointsHoles(e) } }, n.Shape.Utils = {
                triangulateShape: function(e, t) {
                    function i(e, t, i) { return e.x != t.x ? e.x < t.x ? e.x <= i.x && i.x <= t.x : t.x <= i.x && i.x <= e.x : e.y < t.y ? e.y <= i.y && i.y <= t.y : t.y <= i.y && i.y <= e.y }

                    function r(e, t, r, n, o) { var a = 1e-10,
                            s = t.x - e.x,
                            h = t.y - e.y,
                            l = n.x - r.x,
                            c = n.y - r.y,
                            u = e.x - r.x,
                            d = e.y - r.y,
                            p = h * l - s * c,
                            f = h * u - s * d; if (Math.abs(p) > a) { var m; if (p > 0) { if (0 > f || f > p) return []; if (m = c * u - l * d, 0 > m || m > p) return [] } else { if (f > 0 || p > f) return []; if (m = c * u - l * d, m > 0 || p > m) return [] } if (0 == m) return !o || 0 != f && f != p ? [e] : []; if (m == p) return !o || 0 != f && f != p ? [t] : []; if (0 == f) return [r]; if (f == p) return [n]; var g = m / p; return [{ x: e.x + g * s, y: e.y + g * h }] } if (0 != f || c * u != l * d) return []; var v = 0 == s && 0 == h,
                            y = 0 == l && 0 == c; if (v && y) return e.x != r.x || e.y != r.y ? [] : [e]; if (v) return i(r, n, e) ? [e] : []; if (y) return i(e, t, r) ? [r] : []; var _, x, b, w, T, M, S, C; return 0 != s ? (e.x < t.x ? (_ = e, b = e.x, x = t, w = t.x) : (_ = t, b = t.x, x = e, w = e.x), r.x < n.x ? (T = r, S = r.x, M = n, C = n.x) : (T = n, S = n.x, M = r, C = r.x)) : (e.y < t.y ? (_ = e, b = e.y, x = t, w = t.y) : (_ = t, b = t.y, x = e, w = e.y), r.y < n.y ? (T = r, S = r.y, M = n, C = n.y) : (T = n, S = n.y, M = r, C = r.y)), S >= b ? S > w ? [] : w == S ? o ? [] : [T] : C >= w ? [T, x] : [T, M] : b > C ? [] : b == C ? o ? [] : [_] : C >= w ? [_, x] : [_, M] }

                    function o(e, t, i, r) { var n = 1e-10,
                            o = t.x - e.x,
                            a = t.y - e.y,
                            s = i.x - e.x,
                            h = i.y - e.y,
                            l = r.x - e.x,
                            c = r.y - e.y,
                            u = o * h - a * s,
                            d = o * c - a * l; if (Math.abs(u) > n) { var p = l * h - c * s; return u > 0 ? d >= 0 && p >= 0 : d >= 0 || p >= 0 } return d > 0 }

                    function a(e, t) {
                        function i(e, t) { var i = y.length - 1,
                                r = e - 1;
                            0 > r && (r = i); var n = e + 1;
                            n > i && (n = 0); var a = o(y[e], y[r], y[n], s[t]); if (!a) return !1; var h = s.length - 1,
                                l = t - 1;
                            0 > l && (l = h); var c = t + 1; return c > h && (c = 0), a = o(s[t], s[l], s[c], y[e]), a ? !0 : !1 }

                        function n(e, t) { var i, n, o; for (i = 0; i < y.length; i++)
                                if (n = i + 1, n %= y.length, o = r(e, t, y[i], y[n], !0), o.length > 0) return !0; return !1 }

                        function a(e, i) { var n, o, a, s, h; for (n = 0; n < _.length; n++)
                                for (o = t[_[n]], a = 0; a < o.length; a++)
                                    if (s = a + 1, s %= o.length, h = r(e, i, o[a], o[s], !0), h.length > 0) return !0; return !1 } for (var s, h, l, c, u, d, p, f, m, g, v, y = e.concat(), _ = [], x = [], b = 0, w = t.length; w > b; b++) _.push(b); for (var T = 0, M = 2 * _.length; _.length > 0;) { if (M--, 0 > M) { console.log("Infinite Loop! Holes left:" + _.length + ", Probably Hole outside Shape!"); break } for (l = T; l < y.length; l++) { c = y[l], h = -1; for (var b = 0; b < _.length; b++)
                                    if (d = _[b], p = c.x + ":" + c.y + ":" + d, void 0 === x[p]) { s = t[d]; for (var S = 0; S < s.length; S++)
                                            if (u = s[S], i(l, S) && !n(c, u) && !a(c, u)) { h = S, _.splice(b, 1), f = y.slice(0, l + 1), m = y.slice(l), g = s.slice(h), v = s.slice(0, h + 1), y = f.concat(g).concat(v).concat(m), T = l; break } if (h >= 0) break;
                                        x[p] = !0 } if (h >= 0) break } } return y } for (var s, h, l, c, u, d, p = {}, f = e.concat(), m = 0, g = t.length; g > m; m++) Array.prototype.push.apply(f, t[m]); for (s = 0, h = f.length; h > s; s++) u = f[s].x + ":" + f[s].y, void 0 !== p[u] && n.warn("THREE.Shape: Duplicate point", u), p[u] = s; var v = a(e, t),
                        y = n.FontUtils.Triangulate(v, !1); for (s = 0, h = y.length; h > s; s++)
                        for (c = y[s], l = 0; 3 > l; l++) u = c[l].x + ":" + c[l].y, d = p[u], void 0 !== d && (c[l] = d); return y.concat() },
                isClockWise: function(e) { return n.FontUtils.Triangulate.area(e) < 0 },
                b2p0: function(e, t) { var i = 1 - e; return i * i * t },
                b2p1: function(e, t) { return 2 * (1 - e) * e * t },
                b2p2: function(e, t) { return e * e * t },
                b2: function(e, t, i, r) { return this.b2p0(e, t) + this.b2p1(e, i) + this.b2p2(e, r) },
                b3p0: function(e, t) { var i = 1 - e; return i * i * i * t },
                b3p1: function(e, t) { var i = 1 - e; return 3 * i * i * e * t },
                b3p2: function(e, t) { var i = 1 - e; return 3 * i * e * e * t },
                b3p3: function(e, t) { return e * e * e * t },
                b3: function(e, t, i, r, n) {
                    return this.b3p0(e, t) + this.b3p1(e, i) + this.b3p2(e, r) + this.b3p3(e, n);
                }
            }, n.LineCurve = function(e, t) { this.v1 = e, this.v2 = t }, n.LineCurve.prototype = Object.create(n.Curve.prototype), n.LineCurve.prototype.constructor = n.LineCurve, n.LineCurve.prototype.getPoint = function(e) { var t = this.v2.clone().sub(this.v1); return t.multiplyScalar(e).add(this.v1), t }, n.LineCurve.prototype.getPointAt = function(e) { return this.getPoint(e) }, n.LineCurve.prototype.getTangent = function(e) { var t = this.v2.clone().sub(this.v1); return t.normalize() }, n.QuadraticBezierCurve = function(e, t, i) { this.v0 = e, this.v1 = t, this.v2 = i }, n.QuadraticBezierCurve.prototype = Object.create(n.Curve.prototype), n.QuadraticBezierCurve.prototype.constructor = n.QuadraticBezierCurve, n.QuadraticBezierCurve.prototype.getPoint = function(e) { var t = new n.Vector2; return t.x = n.Shape.Utils.b2(e, this.v0.x, this.v1.x, this.v2.x), t.y = n.Shape.Utils.b2(e, this.v0.y, this.v1.y, this.v2.y), t }, n.QuadraticBezierCurve.prototype.getTangent = function(e) { var t = new n.Vector2; return t.x = n.Curve.Utils.tangentQuadraticBezier(e, this.v0.x, this.v1.x, this.v2.x), t.y = n.Curve.Utils.tangentQuadraticBezier(e, this.v0.y, this.v1.y, this.v2.y), t.normalize() }, n.CubicBezierCurve = function(e, t, i, r) { this.v0 = e, this.v1 = t, this.v2 = i, this.v3 = r }, n.CubicBezierCurve.prototype = Object.create(n.Curve.prototype), n.CubicBezierCurve.prototype.constructor = n.CubicBezierCurve, n.CubicBezierCurve.prototype.getPoint = function(e) { var t, i; return t = n.Shape.Utils.b3(e, this.v0.x, this.v1.x, this.v2.x, this.v3.x), i = n.Shape.Utils.b3(e, this.v0.y, this.v1.y, this.v2.y, this.v3.y), new n.Vector2(t, i) }, n.CubicBezierCurve.prototype.getTangent = function(e) { var t, i;
                t = n.Curve.Utils.tangentCubicBezier(e, this.v0.x, this.v1.x, this.v2.x, this.v3.x), i = n.Curve.Utils.tangentCubicBezier(e, this.v0.y, this.v1.y, this.v2.y, this.v3.y); var r = new n.Vector2(t, i); return r.normalize(), r }, n.SplineCurve = function(e) { this.points = void 0 == e ? [] : e }, n.SplineCurve.prototype = Object.create(n.Curve.prototype), n.SplineCurve.prototype.constructor = n.SplineCurve, n.SplineCurve.prototype.getPoint = function(e) { var t = this.points,
                    i = (t.length - 1) * e,
                    r = Math.floor(i),
                    o = i - r,
                    a = t[0 == r ? r : r - 1],
                    s = t[r],
                    h = t[r > t.length - 2 ? t.length - 1 : r + 1],
                    l = t[r > t.length - 3 ? t.length - 1 : r + 2],
                    c = new n.Vector2; return c.x = n.Curve.Utils.interpolate(a.x, s.x, h.x, l.x, o), c.y = n.Curve.Utils.interpolate(a.y, s.y, h.y, l.y, o), c }, n.EllipseCurve = function(e, t, i, r, n, o, a) { this.aX = e, this.aY = t, this.xRadius = i, this.yRadius = r, this.aStartAngle = n, this.aEndAngle = o, this.aClockwise = a }, n.EllipseCurve.prototype = Object.create(n.Curve.prototype), n.EllipseCurve.prototype.constructor = n.EllipseCurve, n.EllipseCurve.prototype.getPoint = function(e) { var t = this.aEndAngle - this.aStartAngle;
                0 > t && (t += 2 * Math.PI), t > 2 * Math.PI && (t -= 2 * Math.PI); var i;
                i = this.aClockwise === !0 ? this.aEndAngle + (1 - e) * (2 * Math.PI - t) : this.aStartAngle + e * t; var r = new n.Vector2; return r.x = this.aX + this.xRadius * Math.cos(i), r.y = this.aY + this.yRadius * Math.sin(i), r }, n.ArcCurve = function(e, t, i, r, o, a) { n.EllipseCurve.call(this, e, t, i, i, r, o, a) }, n.ArcCurve.prototype = Object.create(n.EllipseCurve.prototype), n.ArcCurve.prototype.constructor = n.ArcCurve, n.LineCurve3 = n.Curve.create(function(e, t) { this.v1 = e, this.v2 = t }, function(e) { var t = new n.Vector3; return t.subVectors(this.v2, this.v1), t.multiplyScalar(e), t.add(this.v1), t }), n.QuadraticBezierCurve3 = n.Curve.create(function(e, t, i) { this.v0 = e, this.v1 = t, this.v2 = i }, function(e) { var t = new n.Vector3; return t.x = n.Shape.Utils.b2(e, this.v0.x, this.v1.x, this.v2.x), t.y = n.Shape.Utils.b2(e, this.v0.y, this.v1.y, this.v2.y), t.z = n.Shape.Utils.b2(e, this.v0.z, this.v1.z, this.v2.z), t }), n.CubicBezierCurve3 = n.Curve.create(function(e, t, i, r) { this.v0 = e, this.v1 = t, this.v2 = i, this.v3 = r }, function(e) { var t = new n.Vector3; return t.x = n.Shape.Utils.b3(e, this.v0.x, this.v1.x, this.v2.x, this.v3.x), t.y = n.Shape.Utils.b3(e, this.v0.y, this.v1.y, this.v2.y, this.v3.y), t.z = n.Shape.Utils.b3(e, this.v0.z, this.v1.z, this.v2.z, this.v3.z), t }), n.SplineCurve3 = n.Curve.create(function(e) { this.points = void 0 == e ? [] : e }, function(e) { var t = this.points,
                    i = (t.length - 1) * e,
                    r = Math.floor(i),
                    o = i - r,
                    a = t[0 == r ? r : r - 1],
                    s = t[r],
                    h = t[r > t.length - 2 ? t.length - 1 : r + 1],
                    l = t[r > t.length - 3 ? t.length - 1 : r + 2],
                    c = new n.Vector3; return c.x = n.Curve.Utils.interpolate(a.x, s.x, h.x, l.x, o), c.y = n.Curve.Utils.interpolate(a.y, s.y, h.y, l.y, o), c.z = n.Curve.Utils.interpolate(a.z, s.z, h.z, l.z, o), c }), n.ClosedSplineCurve3 = n.Curve.create(function(e) { this.points = void 0 == e ? [] : e }, function(e) { var t = this.points,
                    i = (t.length - 0) * e,
                    r = Math.floor(i),
                    o = i - r;
                r += r > 0 ? 0 : (Math.floor(Math.abs(r) / t.length) + 1) * t.length; var a = t[(r - 1) % t.length],
                    s = t[r % t.length],
                    h = t[(r + 1) % t.length],
                    l = t[(r + 2) % t.length],
                    c = new n.Vector3; return c.x = n.Curve.Utils.interpolate(a.x, s.x, h.x, l.x, o), c.y = n.Curve.Utils.interpolate(a.y, s.y, h.y, l.y, o), c.z = n.Curve.Utils.interpolate(a.z, s.z, h.z, l.z, o), c }), n.AnimationHandler = { LINEAR: 0, CATMULLROM: 1, CATMULLROM_FORWARD: 2, add: function() { n.warn("THREE.AnimationHandler.add() has been deprecated.") }, get: function() { n.warn("THREE.AnimationHandler.get() has been deprecated.") }, remove: function() { n.warn("THREE.AnimationHandler.remove() has been deprecated.") }, animations: [], init: function(e) { if (e.initialized === !0) return e; for (var t = 0; t < e.hierarchy.length; t++) { for (var i = 0; i < e.hierarchy[t].keys.length; i++)
                            if (e.hierarchy[t].keys[i].time < 0 && (e.hierarchy[t].keys[i].time = 0), void 0 !== e.hierarchy[t].keys[i].rot && !(e.hierarchy[t].keys[i].rot instanceof n.Quaternion)) { var r = e.hierarchy[t].keys[i].rot;
                                e.hierarchy[t].keys[i].rot = (new n.Quaternion).fromArray(r) } if (e.hierarchy[t].keys.length && void 0 !== e.hierarchy[t].keys[0].morphTargets) { for (var o = {}, i = 0; i < e.hierarchy[t].keys.length; i++)
                                for (var a = 0; a < e.hierarchy[t].keys[i].morphTargets.length; a++) { var s = e.hierarchy[t].keys[i].morphTargets[a];
                                    o[s] = -1 } e.hierarchy[t].usedMorphTargets = o; for (var i = 0; i < e.hierarchy[t].keys.length; i++) { var h = {}; for (var s in o) { for (var a = 0; a < e.hierarchy[t].keys[i].morphTargets.length; a++)
                                        if (e.hierarchy[t].keys[i].morphTargets[a] === s) { h[s] = e.hierarchy[t].keys[i].morphTargetsInfluences[a]; break } a === e.hierarchy[t].keys[i].morphTargets.length && (h[s] = 0) } e.hierarchy[t].keys[i].morphTargetsInfluences = h } } for (var i = 1; i < e.hierarchy[t].keys.length; i++) e.hierarchy[t].keys[i].time === e.hierarchy[t].keys[i - 1].time && (e.hierarchy[t].keys.splice(i, 1), i--); for (var i = 0; i < e.hierarchy[t].keys.length; i++) e.hierarchy[t].keys[i].index = i } return e.initialized = !0, e }, parse: function(e) { var t = function(e, i) { i.push(e); for (var r = 0; r < e.children.length; r++) t(e.children[r], i) },
                        i = []; if (e instanceof n.SkinnedMesh)
                        for (var r = 0; r < e.skeleton.bones.length; r++) i.push(e.skeleton.bones[r]);
                    else t(e, i); return i }, play: function(e) {-1 === this.animations.indexOf(e) && this.animations.push(e) }, stop: function(e) { var t = this.animations.indexOf(e); - 1 !== t && this.animations.splice(t, 1) }, update: function(e) { for (var t = 0; t < this.animations.length; t++) this.animations[t].resetBlendWeights(); for (var t = 0; t < this.animations.length; t++) this.animations[t].update(e) } }, n.Animation = function(e, t) { this.root = e, this.data = n.AnimationHandler.init(t), this.hierarchy = n.AnimationHandler.parse(e), this.currentTime = 0, this.timeScale = 1, this.isPlaying = !1, this.loop = !0, this.weight = 0, this.interpolationType = n.AnimationHandler.LINEAR }, n.Animation.prototype = { constructor: n.Animation, keyTypes: ["pos", "rot", "scl"], play: function(e, t) { this.currentTime = void 0 !== e ? e : 0, this.weight = void 0 !== t ? t : 1, this.isPlaying = !0, this.reset(), n.AnimationHandler.play(this) }, stop: function() { this.isPlaying = !1, n.AnimationHandler.stop(this) }, reset: function() { for (var e = 0, t = this.hierarchy.length; t > e; e++) { var i = this.hierarchy[e];
                        void 0 === i.animationCache && (i.animationCache = { animations: {}, blending: { positionWeight: 0, quaternionWeight: 0, scaleWeight: 0 } }); var r = this.data.name,
                            n = i.animationCache.animations,
                            o = n[r];
                        void 0 === o && (o = { prevKey: { pos: 0, rot: 0, scl: 0 }, nextKey: { pos: 0, rot: 0, scl: 0 }, originalMatrix: i.matrix }, n[r] = o); for (var a = 0; 3 > a; a++) { for (var s = this.keyTypes[a], h = this.data.hierarchy[e].keys[0], l = this.getNextKeyWith(s, e, 1); l.time < this.currentTime && l.index > h.index;) h = l, l = this.getNextKeyWith(s, e, l.index + 1);
                            o.prevKey[s] = h, o.nextKey[s] = l } } }, resetBlendWeights: function() { for (var e = 0, t = this.hierarchy.length; t > e; e++) { var i = this.hierarchy[e],
                            r = i.animationCache; if (void 0 !== r) { var n = r.blending;
                            n.positionWeight = 0, n.quaternionWeight = 0, n.scaleWeight = 0 } } }, update: function() { var e = [],
                        t = new n.Vector3,
                        i = new n.Vector3,
                        r = new n.Quaternion,
                        o = function(e, t) { var i, r, n, o, s, h, l, c, u, d = [],
                                p = []; return i = (e.length - 1) * t, r = Math.floor(i), n = i - r, d[0] = 0 === r ? r : r - 1, d[1] = r, d[2] = r > e.length - 2 ? r : r + 1, d[3] = r > e.length - 3 ? r : r + 2, h = e[d[0]], l = e[d[1]], c = e[d[2]], u = e[d[3]], o = n * n, s = n * o, p[0] = a(h[0], l[0], c[0], u[0], n, o, s), p[1] = a(h[1], l[1], c[1], u[1], n, o, s), p[2] = a(h[2], l[2], c[2], u[2], n, o, s), p },
                        a = function(e, t, i, r, n, o, a) { var s = .5 * (i - e),
                                h = .5 * (r - t); return (2 * (t - i) + s + h) * a + (-3 * (t - i) - 2 * s - h) * o + s * n + t }; return function(a) { if (this.isPlaying !== !1 && (this.currentTime += a * this.timeScale, 0 !== this.weight)) { var s = this.data.length;
                            (this.currentTime > s || this.currentTime < 0) && (this.loop ? (this.currentTime %= s, this.currentTime < 0 && (this.currentTime += s), this.reset()) : this.stop()); for (var h = 0, l = this.hierarchy.length; l > h; h++)
                                for (var c = this.hierarchy[h], u = c.animationCache.animations[this.data.name], d = c.animationCache.blending, p = 0; 3 > p; p++) { var f = this.keyTypes[p],
                                        m = u.prevKey[f],
                                        g = u.nextKey[f]; if (this.timeScale > 0 && g.time <= this.currentTime || this.timeScale < 0 && m.time >= this.currentTime) { for (m = this.data.hierarchy[h].keys[0], g = this.getNextKeyWith(f, h, 1); g.time < this.currentTime && g.index > m.index;) m = g, g = this.getNextKeyWith(f, h, g.index + 1);
                                        u.prevKey[f] = m, u.nextKey[f] = g } var v = (this.currentTime - m.time) / (g.time - m.time),
                                        y = m[f],
                                        _ = g[f]; if (0 > v && (v = 0), v > 1 && (v = 1), "pos" === f) { if (this.interpolationType === n.AnimationHandler.LINEAR) { i.x = y[0] + (_[0] - y[0]) * v, i.y = y[1] + (_[1] - y[1]) * v, i.z = y[2] + (_[2] - y[2]) * v; var x = this.weight / (this.weight + d.positionWeight);
                                            c.position.lerp(i, x), d.positionWeight += this.weight } else if (this.interpolationType === n.AnimationHandler.CATMULLROM || this.interpolationType === n.AnimationHandler.CATMULLROM_FORWARD) { e[0] = this.getPrevKeyWith("pos", h, m.index - 1).pos, e[1] = y, e[2] = _, e[3] = this.getNextKeyWith("pos", h, g.index + 1).pos, v = .33 * v + .33; var b = o(e, v),
                                                x = this.weight / (this.weight + d.positionWeight);
                                            d.positionWeight += this.weight; var w = c.position; if (w.x = w.x + (b[0] - w.x) * x, w.y = w.y + (b[1] - w.y) * x, w.z = w.z + (b[2] - w.z) * x, this.interpolationType === n.AnimationHandler.CATMULLROM_FORWARD) { var T = o(e, 1.01 * v);
                                                t.set(T[0], T[1], T[2]), t.sub(w), t.y = 0, t.normalize(); var M = Math.atan2(t.x, t.z);
                                                c.rotation.set(0, M, 0) } } } else if ("rot" === f)
                                        if (n.Quaternion.slerp(y, _, r, v), 0 === d.quaternionWeight) c.quaternion.copy(r), d.quaternionWeight = this.weight;
                                        else { var x = this.weight / (this.weight + d.quaternionWeight);
                                            n.Quaternion.slerp(c.quaternion, r, c.quaternion, x), d.quaternionWeight += this.weight } else if ("scl" === f) { i.x = y[0] + (_[0] - y[0]) * v, i.y = y[1] + (_[1] - y[1]) * v, i.z = y[2] + (_[2] - y[2]) * v; var x = this.weight / (this.weight + d.scaleWeight);
                                        c.scale.lerp(i, x), d.scaleWeight += this.weight } }
                            return !0 } } }(), getNextKeyWith: function(e, t, i) { var r = this.data.hierarchy[t].keys; for (this.interpolationType === n.AnimationHandler.CATMULLROM || this.interpolationType === n.AnimationHandler.CATMULLROM_FORWARD ? i = i < r.length - 1 ? i : r.length - 1 : i %= r.length; i < r.length; i++)
                        if (void 0 !== r[i][e]) return r[i]; return this.data.hierarchy[t].keys[0] }, getPrevKeyWith: function(e, t, i) { var r = this.data.hierarchy[t].keys; for (i = this.interpolationType === n.AnimationHandler.CATMULLROM || this.interpolationType === n.AnimationHandler.CATMULLROM_FORWARD ? i > 0 ? i : 0 : i >= 0 ? i : i + r.length; i >= 0; i--)
                        if (void 0 !== r[i][e]) return r[i]; return this.data.hierarchy[t].keys[r.length - 1] } }, n.KeyFrameAnimation = function(e) { this.root = e.node, this.data = n.AnimationHandler.init(e), this.hierarchy = n.AnimationHandler.parse(this.root), this.currentTime = 0, this.timeScale = .001, this.isPlaying = !1, this.isPaused = !0, this.loop = !0; for (var t = 0, i = this.hierarchy.length; i > t; t++) { var r = this.data.hierarchy[t].keys,
                        o = this.data.hierarchy[t].sids,
                        a = this.hierarchy[t]; if (r.length && o) { for (var s = 0; s < o.length; s++) { var h = o[s],
                                l = this.getNextKeyWith(h, t, 0);
                            l && l.apply(h) } a.matrixAutoUpdate = !1, this.data.hierarchy[t].node.updateMatrix(), a.matrixWorldNeedsUpdate = !0 } } }, n.KeyFrameAnimation.prototype = { constructor: n.KeyFrameAnimation, play: function(e) { if (this.currentTime = void 0 !== e ? e : 0, this.isPlaying === !1) { this.isPlaying = !0; var t, i, r, o = this.hierarchy.length; for (t = 0; o > t; t++) { i = this.hierarchy[t], r = this.data.hierarchy[t], void 0 === r.animationCache && (r.animationCache = {}, r.animationCache.prevKey = null, r.animationCache.nextKey = null, r.animationCache.originalMatrix = i.matrix); var a = this.data.hierarchy[t].keys;
                            a.length && (r.animationCache.prevKey = a[0], r.animationCache.nextKey = a[1], this.startTime = Math.min(a[0].time, this.startTime), this.endTime = Math.max(a[a.length - 1].time, this.endTime)) } this.update(0) } this.isPaused = !1, n.AnimationHandler.play(this) }, stop: function() { this.isPlaying = !1, this.isPaused = !1, n.AnimationHandler.stop(this); for (var e = 0; e < this.data.hierarchy.length; e++) { var t = this.hierarchy[e],
                            i = this.data.hierarchy[e]; if (void 0 !== i.animationCache) { var r = i.animationCache.originalMatrix;
                            r.copy(t.matrix), t.matrix = r, delete i.animationCache } } }, update: function(e) { if (this.isPlaying !== !1) { this.currentTime += e * this.timeScale; var t = this.data.length;
                        this.loop === !0 && this.currentTime > t && (this.currentTime %= t), this.currentTime = Math.min(this.currentTime, t); for (var i = 0, r = this.hierarchy.length; r > i; i++) { var n = this.hierarchy[i],
                                o = this.data.hierarchy[i],
                                a = o.keys,
                                s = o.animationCache; if (a.length) { var h = s.prevKey,
                                    l = s.nextKey; if (l.time <= this.currentTime) { for (; l.time < this.currentTime && l.index > h.index;) h = l, l = a[h.index + 1];
                                    s.prevKey = h, s.nextKey = l } l.time >= this.currentTime ? h.interpolate(l, this.currentTime) : h.interpolate(l, l.time), this.data.hierarchy[i].node.updateMatrix(), n.matrixWorldNeedsUpdate = !0 } } } }, getNextKeyWith: function(e, t, i) { var r = this.data.hierarchy[t].keys; for (i %= r.length; i < r.length; i++)
                        if (r[i].hasTarget(e)) return r[i]; return r[0] }, getPrevKeyWith: function(e, t, i) { var r = this.data.hierarchy[t].keys; for (i = i >= 0 ? i : i + r.length; i >= 0; i--)
                        if (r[i].hasTarget(e)) return r[i]; return r[r.length - 1] } }, n.MorphAnimation = function(e) { this.mesh = e, this.frames = e.morphTargetInfluences.length, this.currentTime = 0, this.duration = 1e3, this.loop = !0, this.lastFrame = 0, this.currentFrame = 0, this.isPlaying = !1 }, n.MorphAnimation.prototype = { constructor: n.MorphAnimation, play: function() { this.isPlaying = !0 }, pause: function() { this.isPlaying = !1 }, update: function(e) { if (this.isPlaying !== !1) { this.currentTime += e, this.loop === !0 && this.currentTime > this.duration && (this.currentTime %= this.duration), this.currentTime = Math.min(this.currentTime, this.duration); var t = this.duration / this.frames,
                            i = Math.floor(this.currentTime / t),
                            r = this.mesh.morphTargetInfluences;
                        i != this.currentFrame && (r[this.lastFrame] = 0, r[this.currentFrame] = 1, r[i] = 0, this.lastFrame = this.currentFrame, this.currentFrame = i), r[i] = this.currentTime % t / t, r[this.lastFrame] = 1 - r[i] } } }, n.BoxGeometry = function(e, t, i, r, o, a) {
                function s(e, t, i, r, o, a, s, l) { var c, u, d, p = h.widthSegments,
                        f = h.heightSegments,
                        m = o / 2,
                        g = a / 2,
                        v = h.vertices.length; "x" === e && "y" === t || "y" === e && "x" === t ? c = "z" : "x" === e && "z" === t || "z" === e && "x" === t ? (c = "y", f = h.depthSegments) : ("z" === e && "y" === t || "y" === e && "z" === t) && (c = "x", p = h.depthSegments); var y = p + 1,
                        _ = f + 1,
                        x = o / p,
                        b = a / f,
                        w = new n.Vector3; for (w[c] = s > 0 ? 1 : -1, d = 0; _ > d; d++)
                        for (u = 0; y > u; u++) { var T = new n.Vector3;
                            T[e] = (u * x - m) * i, T[t] = (d * b - g) * r, T[c] = s, h.vertices.push(T) }
                    for (d = 0; f > d; d++)
                        for (u = 0; p > u; u++) { var M = u + y * d,
                                S = u + y * (d + 1),
                                C = u + 1 + y * (d + 1),
                                A = u + 1 + y * d,
                                E = new n.Vector2(u / p, 1 - d / f),
                                P = new n.Vector2(u / p, 1 - (d + 1) / f),
                                L = new n.Vector2((u + 1) / p, 1 - (d + 1) / f),
                                R = new n.Vector2((u + 1) / p, 1 - d / f),
                                F = new n.Face3(M + v, S + v, A + v);
                            F.normal.copy(w), F.vertexNormals.push(w.clone(), w.clone(), w.clone()), F.materialIndex = l, h.faces.push(F), h.faceVertexUvs[0].push([E, P, R]), F = new n.Face3(S + v, C + v, A + v), F.normal.copy(w), F.vertexNormals.push(w.clone(), w.clone(), w.clone()), F.materialIndex = l, h.faces.push(F), h.faceVertexUvs[0].push([P.clone(), L, R.clone()]) } } n.Geometry.call(this), this.type = "BoxGeometry", this.parameters = { width: e, height: t, depth: i, widthSegments: r, heightSegments: o, depthSegments: a }, this.widthSegments = r || 1, this.heightSegments = o || 1, this.depthSegments = a || 1; var h = this,
                    l = e / 2,
                    c = t / 2,
                    u = i / 2;
                s("z", "y", -1, -1, i, t, l, 0), s("z", "y", 1, -1, i, t, -l, 1), s("x", "z", 1, 1, e, i, c, 2), s("x", "z", 1, -1, e, i, -c, 3), s("x", "y", 1, -1, e, t, u, 4), s("x", "y", -1, -1, e, t, -u, 5), this.mergeVertices() }, n.BoxGeometry.prototype = Object.create(n.Geometry.prototype), n.BoxGeometry.prototype.constructor = n.BoxGeometry, n.CircleGeometry = function(e, t, i, r) { n.Geometry.call(this), this.type = "CircleGeometry", this.parameters = { radius: e, segments: t, thetaStart: i, thetaLength: r }, e = e || 50, t = void 0 !== t ? Math.max(3, t) : 8, i = void 0 !== i ? i : 0, r = void 0 !== r ? r : 2 * Math.PI; var o, a = [],
                    s = new n.Vector3,
                    h = new n.Vector2(.5, .5); for (this.vertices.push(s), a.push(h), o = 0; t >= o; o++) { var l = new n.Vector3,
                        c = i + o / t * r;
                    l.x = e * Math.cos(c), l.y = e * Math.sin(c), this.vertices.push(l), a.push(new n.Vector2((l.x / e + 1) / 2, (l.y / e + 1) / 2)) } var u = new n.Vector3(0, 0, 1); for (o = 1; t >= o; o++) this.faces.push(new n.Face3(o, o + 1, 0, [u.clone(), u.clone(), u.clone()])), this.faceVertexUvs[0].push([a[o].clone(), a[o + 1].clone(), h.clone()]);
                this.computeFaceNormals(), this.boundingSphere = new n.Sphere(new n.Vector3, e) }, n.CircleGeometry.prototype = Object.create(n.Geometry.prototype), n.CircleGeometry.prototype.constructor = n.CircleGeometry, n.CubeGeometry = function(e, t, i, r, o, a) { return n.warn("THREE.CubeGeometry has been renamed to THREE.BoxGeometry."), new n.BoxGeometry(e, t, i, r, o, a) }, n.CylinderGeometry = function(e, t, i, r, o, a, s, h) { n.Geometry.call(this), this.type = "CylinderGeometry", this.parameters = { radiusTop: e, radiusBottom: t, height: i, radialSegments: r, heightSegments: o, openEnded: a, thetaStart: s, thetaLength: h }, e = void 0 !== e ? e : 20, t = void 0 !== t ? t : 20, i = void 0 !== i ? i : 100, r = r || 8, o = o || 1, a = void 0 !== a ? a : !1, s = void 0 !== s ? s : 0, h = void 0 !== h ? h : 2 * Math.PI; var l, c, u = i / 2,
                    d = [],
                    p = []; for (c = 0; o >= c; c++) { var f = [],
                        m = [],
                        g = c / o,
                        v = g * (t - e) + e; for (l = 0; r >= l; l++) { var y = l / r,
                            _ = new n.Vector3;
                        _.x = v * Math.sin(y * h + s), _.y = -g * i + u, _.z = v * Math.cos(y * h + s), this.vertices.push(_), f.push(this.vertices.length - 1), m.push(new n.Vector2(y, 1 - g)) } d.push(f), p.push(m) } var x, b, w = (t - e) / i; for (l = 0; r > l; l++)
                    for (0 !== e ? (x = this.vertices[d[0][l]].clone(), b = this.vertices[d[0][l + 1]].clone()) : (x = this.vertices[d[1][l]].clone(), b = this.vertices[d[1][l + 1]].clone()), x.setY(Math.sqrt(x.x * x.x + x.z * x.z) * w).normalize(), b.setY(Math.sqrt(b.x * b.x + b.z * b.z) * w).normalize(), c = 0; o > c; c++) { var T = d[c][l],
                            M = d[c + 1][l],
                            S = d[c + 1][l + 1],
                            C = d[c][l + 1],
                            A = x.clone(),
                            E = x.clone(),
                            P = b.clone(),
                            L = b.clone(),
                            R = p[c][l].clone(),
                            F = p[c + 1][l].clone(),
                            k = p[c + 1][l + 1].clone(),
                            O = p[c][l + 1].clone();
                        this.faces.push(new n.Face3(T, M, C, [A, E, L])), this.faceVertexUvs[0].push([R, F, O]), this.faces.push(new n.Face3(M, S, C, [E.clone(), P, L.clone()])), this.faceVertexUvs[0].push([F.clone(), k, O.clone()]) }
                if (a === !1 && e > 0)
                    for (this.vertices.push(new n.Vector3(0, u, 0)), l = 0; r > l; l++) { var T = d[0][l],
                            M = d[0][l + 1],
                            S = this.vertices.length - 1,
                            A = new n.Vector3(0, 1, 0),
                            E = new n.Vector3(0, 1, 0),
                            P = new n.Vector3(0, 1, 0),
                            R = p[0][l].clone(),
                            F = p[0][l + 1].clone(),
                            k = new n.Vector2(F.x, 0);
                        this.faces.push(new n.Face3(T, M, S, [A, E, P])), this.faceVertexUvs[0].push([R, F, k]) }
                if (a === !1 && t > 0)
                    for (this.vertices.push(new n.Vector3(0, -u, 0)), l = 0; r > l; l++) { var T = d[o][l + 1],
                            M = d[o][l],
                            S = this.vertices.length - 1,
                            A = new n.Vector3(0, -1, 0),
                            E = new n.Vector3(0, -1, 0),
                            P = new n.Vector3(0, -1, 0),
                            R = p[o][l + 1].clone(),
                            F = p[o][l].clone(),
                            k = new n.Vector2(F.x, 1);
                        this.faces.push(new n.Face3(T, M, S, [A, E, P])), this.faceVertexUvs[0].push([R, F, k]) } this.computeFaceNormals() }, n.CylinderGeometry.prototype = Object.create(n.Geometry.prototype), n.CylinderGeometry.prototype.constructor = n.CylinderGeometry, n.ExtrudeGeometry = function(e, t) { return "undefined" == typeof e ? void(e = []) : (n.Geometry.call(this), this.type = "ExtrudeGeometry", e = e instanceof Array ? e : [e], this.addShapeList(e, t), void this.computeFaceNormals()) }, n.ExtrudeGeometry.prototype = Object.create(n.Geometry.prototype), n.ExtrudeGeometry.prototype.constructor = n.ExtrudeGeometry, n.ExtrudeGeometry.prototype.addShapeList = function(e, t) { for (var i = e.length, r = 0; i > r; r++) { var n = e[r];
                    this.addShape(n, t) } }, n.ExtrudeGeometry.prototype.addShape = function(e, t) {
                function i(e, t, i) { return t || n.error("THREE.ExtrudeGeometry: vec does not exist"), t.clone().multiplyScalar(i).add(e) }

                function r(e, t, i) { var r, o, a = 1e-10,
                        s = 1,
                        h = e.x - t.x,
                        l = e.y - t.y,
                        c = i.x - e.x,
                        u = i.y - e.y,
                        d = h * h + l * l,
                        p = h * u - l * c; if (Math.abs(p) > a) { var f = Math.sqrt(d),
                            m = Math.sqrt(c * c + u * u),
                            g = t.x - l / f,
                            v = t.y + h / f,
                            y = i.x - u / m,
                            _ = i.y + c / m,
                            x = ((y - g) * u - (_ - v) * c) / (h * u - l * c);
                        r = g + h * x - e.x, o = v + l * x - e.y; var b = r * r + o * o; if (2 >= b) return new n.Vector2(r, o);
                        s = Math.sqrt(b / 2) } else { var w = !1;
                        h > a ? c > a && (w = !0) : -a > h ? -a > c && (w = !0) : Math.sign(l) == Math.sign(u) && (w = !0), w ? (r = -l, o = h, s = Math.sqrt(d)) : (r = h, o = l, s = Math.sqrt(d / 2)) } return new n.Vector2(r / s, o / s) }

                function o() { if (x) { var e = 0,
                            t = W * e; for (q = 0; X > q; q++) j = U[q], l(j[2] + t, j[1] + t, j[0] + t); for (e = w + 2 * _, t = W * e, q = 0; X > q; q++) j = U[q], l(j[0] + t, j[1] + t, j[2] + t) } else { for (q = 0; X > q; q++) j = U[q], l(j[2], j[1], j[0]); for (q = 0; X > q; q++) j = U[q], l(j[0] + W * w, j[1] + W * w, j[2] + W * w) } }

                function a() { var e = 0; for (s(z, e), e += z.length, P = 0, L = D.length; L > P; P++) E = D[P], s(E, e), e += E.length }

                function s(e, t) { var i, r; for (q = e.length; --q >= 0;) { i = q, r = q - 1, 0 > r && (r = e.length - 1); var n = 0,
                            o = w + 2 * _; for (n = 0; o > n; n++) { var a = W * n,
                                s = W * (n + 1),
                                h = t + i + a,
                                l = t + r + a,
                                u = t + r + s,
                                d = t + i + s;
                            c(h, l, u, d, e, n, o, i, r) } } }

                function h(e, t, i) { R.vertices.push(new n.Vector3(e, t, i)) }

                function l(e, t, i) { e += F, t += F, i += F, R.faces.push(new n.Face3(e, t, i, null, null, S)); var r = A.generateTopUV(R, e, t, i);
                    R.faceVertexUvs[0].push(r) }

                function c(e, t, i, r, o, a, s, h, l) { e += F, t += F, i += F, r += F, R.faces.push(new n.Face3(e, t, r, null, null, C)), R.faces.push(new n.Face3(t, i, r, null, null, C)); var c = A.generateSideWallUV(R, e, t, i, r);
                    R.faceVertexUvs[0].push([c[0], c[1], c[3]]), R.faceVertexUvs[0].push([c[1], c[2], c[3]]) } var u, d, p, f, m, g = void 0 !== t.amount ? t.amount : 100,
                    v = void 0 !== t.bevelThickness ? t.bevelThickness : 6,
                    y = void 0 !== t.bevelSize ? t.bevelSize : v - 2,
                    _ = void 0 !== t.bevelSegments ? t.bevelSegments : 3,
                    x = void 0 !== t.bevelEnabled ? t.bevelEnabled : !0,
                    b = void 0 !== t.curveSegments ? t.curveSegments : 12,
                    w = void 0 !== t.steps ? t.steps : 1,
                    T = t.extrudePath,
                    M = !1,
                    S = t.material,
                    C = t.extrudeMaterial,
                    A = void 0 !== t.UVGenerator ? t.UVGenerator : n.ExtrudeGeometry.WorldUVGenerator;
                T && (u = T.getSpacedPoints(w), M = !0, x = !1, d = void 0 !== t.frames ? t.frames : new n.TubeGeometry.FrenetFrames(T, w, !1), p = new n.Vector3, f = new n.Vector3, m = new n.Vector3), x || (_ = 0, v = 0, y = 0); var E, P, L, R = this,
                    F = this.vertices.length,
                    k = e.extractPoints(b),
                    O = k.shape,
                    D = k.holes,
                    B = !n.Shape.Utils.isClockWise(O); if (B) { for (O = O.reverse(), P = 0, L = D.length; L > P; P++) E = D[P], n.Shape.Utils.isClockWise(E) && (D[P] = E.reverse());
                    B = !1 } var U = n.Shape.Utils.triangulateShape(O, D),
                    z = O; for (P = 0, L = D.length; L > P; P++) E = D[P], O = O.concat(E); for (var N, V, I, G, H, j, W = O.length, X = U.length, Y = [], q = 0, K = z.length, Z = K - 1, Q = q + 1; K > q; q++, Z++, Q++) Z === K && (Z = 0), Q === K && (Q = 0), Y[q] = r(z[q], z[Z], z[Q]); var J, $ = [],
                    ee = Y.concat(); for (P = 0, L = D.length; L > P; P++) { for (E = D[P], J = [], q = 0, K = E.length, Z = K - 1, Q = q + 1; K > q; q++, Z++, Q++) Z === K && (Z = 0), Q === K && (Q = 0), J[q] = r(E[q], E[Z], E[Q]);
                    $.push(J), ee = ee.concat(J) } for (N = 0; _ > N; N++) { for (I = N / _, G = v * (1 - I), V = y * Math.sin(I * Math.PI / 2), q = 0, K = z.length; K > q; q++) H = i(z[q], Y[q], V), h(H.x, H.y, -G); for (P = 0, L = D.length; L > P; P++)
                        for (E = D[P], J = $[P], q = 0, K = E.length; K > q; q++) H = i(E[q], J[q], V), h(H.x, H.y, -G) } for (V = y, q = 0; W > q; q++) H = x ? i(O[q], ee[q], V) : O[q], M ? (f.copy(d.normals[0]).multiplyScalar(H.x), p.copy(d.binormals[0]).multiplyScalar(H.y), m.copy(u[0]).add(f).add(p), h(m.x, m.y, m.z)) : h(H.x, H.y, 0); var te; for (te = 1; w >= te; te++)
                    for (q = 0; W > q; q++) H = x ? i(O[q], ee[q], V) : O[q], M ? (f.copy(d.normals[te]).multiplyScalar(H.x), p.copy(d.binormals[te]).multiplyScalar(H.y), m.copy(u[te]).add(f).add(p), h(m.x, m.y, m.z)) : h(H.x, H.y, g / w * te); for (N = _ - 1; N >= 0; N--) { for (I = N / _, G = v * (1 - I), V = y * Math.sin(I * Math.PI / 2), q = 0, K = z.length; K > q; q++) H = i(z[q], Y[q], V), h(H.x, H.y, g + G); for (P = 0, L = D.length; L > P; P++)
                        for (E = D[P], J = $[P], q = 0, K = E.length; K > q; q++) H = i(E[q], J[q], V), M ? h(H.x, H.y + u[w - 1].y, u[w - 1].x + G) : h(H.x, H.y, g + G) } o(), a() }, n.ExtrudeGeometry.WorldUVGenerator = { generateTopUV: function(e, t, i, r) { var o = e.vertices,
                        a = o[t],
                        s = o[i],
                        h = o[r]; return [new n.Vector2(a.x, a.y), new n.Vector2(s.x, s.y), new n.Vector2(h.x, h.y)] }, generateSideWallUV: function(e, t, i, r, o) { var a = e.vertices,
                        s = a[t],
                        h = a[i],
                        l = a[r],
                        c = a[o]; return Math.abs(s.y - h.y) < .01 ? [new n.Vector2(s.x, 1 - s.z), new n.Vector2(h.x, 1 - h.z), new n.Vector2(l.x, 1 - l.z), new n.Vector2(c.x, 1 - c.z)] : [new n.Vector2(s.y, 1 - s.z), new n.Vector2(h.y, 1 - h.z), new n.Vector2(l.y, 1 - l.z), new n.Vector2(c.y, 1 - c.z)] } }, n.ShapeGeometry = function(e, t) { n.Geometry.call(this), this.type = "ShapeGeometry", e instanceof Array == !1 && (e = [e]), this.addShapeList(e, t), this.computeFaceNormals() }, n.ShapeGeometry.prototype = Object.create(n.Geometry.prototype), n.ShapeGeometry.prototype.constructor = n.ShapeGeometry, n.ShapeGeometry.prototype.addShapeList = function(e, t) { for (var i = 0, r = e.length; r > i; i++) this.addShape(e[i], t); return this }, n.ShapeGeometry.prototype.addShape = function(e, t) { void 0 === t && (t = {}); var i, r, o, a = void 0 !== t.curveSegments ? t.curveSegments : 12,
                    s = t.material,
                    h = void 0 === t.UVGenerator ? n.ExtrudeGeometry.WorldUVGenerator : t.UVGenerator,
                    l = this.vertices.length,
                    c = e.extractPoints(a),
                    u = c.shape,
                    d = c.holes,
                    p = !n.Shape.Utils.isClockWise(u); if (p) { for (u = u.reverse(), i = 0, r = d.length; r > i; i++) o = d[i], n.Shape.Utils.isClockWise(o) && (d[i] = o.reverse());
                    p = !1 } var f = n.Shape.Utils.triangulateShape(u, d); for (i = 0, r = d.length; r > i; i++) o = d[i], u = u.concat(o); var m, g, v = u.length,
                    y = f.length; for (i = 0; v > i; i++) m = u[i], this.vertices.push(new n.Vector3(m.x, m.y, 0)); for (i = 0; y > i; i++) { g = f[i]; var _ = g[0] + l,
                        x = g[1] + l,
                        b = g[2] + l;
                    this.faces.push(new n.Face3(_, x, b, null, null, s)), this.faceVertexUvs[0].push(h.generateTopUV(this, _, x, b)) } }, n.LatheGeometry = function(e, t, i, r) { n.Geometry.call(this), this.type = "LatheGeometry", this.parameters = { points: e, segments: t, phiStart: i, phiLength: r }, t = t || 12, i = i || 0, r = r || 2 * Math.PI; for (var o = 1 / (e.length - 1), a = 1 / t, s = 0, h = t; h >= s; s++)
                    for (var l = i + s * a * r, c = Math.cos(l), u = Math.sin(l), d = 0, p = e.length; p > d; d++) { var f = e[d],
                            m = new n.Vector3;
                        m.x = c * f.x - u * f.y, m.y = u * f.x + c * f.y, m.z = f.z, this.vertices.push(m) }
                for (var g = e.length, s = 0, h = t; h > s; s++)
                    for (var d = 0, p = e.length - 1; p > d; d++) { var v = d + g * s,
                            y = v,
                            _ = v + g,
                            c = v + 1 + g,
                            x = v + 1,
                            b = s * a,
                            w = d * o,
                            T = b + a,
                            M = w + o;
                        this.faces.push(new n.Face3(y, _, x)), this.faceVertexUvs[0].push([new n.Vector2(b, w), new n.Vector2(T, w), new n.Vector2(b, M)]), this.faces.push(new n.Face3(_, c, x)), this.faceVertexUvs[0].push([new n.Vector2(T, w), new n.Vector2(T, M), new n.Vector2(b, M)]) } this.mergeVertices(), this.computeFaceNormals(), this.computeVertexNormals() }, n.LatheGeometry.prototype = Object.create(n.Geometry.prototype), n.LatheGeometry.prototype.constructor = n.LatheGeometry, n.PlaneGeometry = function(e, t, i, r) { console.info("THREE.PlaneGeometry: Consider using THREE.PlaneBufferGeometry for lower memory footprint."), n.Geometry.call(this), this.type = "PlaneGeometry", this.parameters = { width: e, height: t, widthSegments: i, heightSegments: r }, this.fromBufferGeometry(new n.PlaneBufferGeometry(e, t, i, r)) }, n.PlaneGeometry.prototype = Object.create(n.Geometry.prototype), n.PlaneGeometry.prototype.constructor = n.PlaneGeometry, n.PlaneBufferGeometry = function(e, t, i, r) { n.BufferGeometry.call(this), this.type = "PlaneBufferGeometry", this.parameters = { width: e, height: t, widthSegments: i, heightSegments: r }; for (var o = e / 2, a = t / 2, s = i || 1, h = r || 1, l = s + 1, c = h + 1, u = e / s, d = t / h, p = new Float32Array(l * c * 3), f = new Float32Array(l * c * 3), m = new Float32Array(l * c * 2), g = 0, v = 0, y = 0; c > y; y++)
                    for (var _ = y * d - a, x = 0; l > x; x++) { var b = x * u - o;
                        p[g] = b, p[g + 1] = -_, f[g + 2] = 1, m[v] = x / s, m[v + 1] = 1 - y / h, g += 3, v += 2 } g = 0; for (var w = new(p.length / 3 > 65535 ? Uint32Array : Uint16Array)(s * h * 6), y = 0; h > y; y++)
                    for (var x = 0; s > x; x++) { var T = x + l * y,
                            M = x + l * (y + 1),
                            S = x + 1 + l * (y + 1),
                            C = x + 1 + l * y;
                        w[g] = T, w[g + 1] = M, w[g + 2] = C, w[g + 3] = M, w[g + 4] = S, w[g + 5] = C, g += 6 } this.addAttribute("index", new n.BufferAttribute(w, 1)), this.addAttribute("position", new n.BufferAttribute(p, 3)), this.addAttribute("normal", new n.BufferAttribute(f, 3)), this.addAttribute("uv", new n.BufferAttribute(m, 2)) }, n.PlaneBufferGeometry.prototype = Object.create(n.BufferGeometry.prototype), n.PlaneBufferGeometry.prototype.constructor = n.PlaneBufferGeometry, n.RingGeometry = function(e, t, i, r, o, a) { n.Geometry.call(this), this.type = "RingGeometry", this.parameters = { innerRadius: e, outerRadius: t, thetaSegments: i, phiSegments: r, thetaStart: o, thetaLength: a }, e = e || 0, t = t || 50, o = void 0 !== o ? o : 0, a = void 0 !== a ? a : 2 * Math.PI, i = void 0 !== i ? Math.max(3, i) : 8, r = void 0 !== r ? Math.max(1, r) : 8; var s, h, l = [],
                    c = e,
                    u = (t - e) / r; for (s = 0; r + 1 > s; s++) { for (h = 0; i + 1 > h; h++) { var d = new n.Vector3,
                            p = o + h / i * a;
                        d.x = c * Math.cos(p), d.y = c * Math.sin(p), this.vertices.push(d), l.push(new n.Vector2((d.x / t + 1) / 2, (d.y / t + 1) / 2)) } c += u } var f = new n.Vector3(0, 0, 1); for (s = 0; r > s; s++) { var m = s * (i + 1); for (h = 0; i > h; h++) { var p = h + m,
                            g = p,
                            v = p + i + 1,
                            y = p + i + 2;
                        this.faces.push(new n.Face3(g, v, y, [f.clone(), f.clone(), f.clone()])), this.faceVertexUvs[0].push([l[g].clone(), l[v].clone(), l[y].clone()]), g = p, v = p + i + 2, y = p + 1, this.faces.push(new n.Face3(g, v, y, [f.clone(), f.clone(), f.clone()])), this.faceVertexUvs[0].push([l[g].clone(), l[v].clone(), l[y].clone()]) } } this.computeFaceNormals(), this.boundingSphere = new n.Sphere(new n.Vector3, c) }, n.RingGeometry.prototype = Object.create(n.Geometry.prototype), n.RingGeometry.prototype.constructor = n.RingGeometry, n.SphereGeometry = function(e, t, i, r, o, a, s) { n.Geometry.call(this), this.type = "SphereGeometry", this.parameters = { radius: e, widthSegments: t, heightSegments: i, phiStart: r, phiLength: o, thetaStart: a, thetaLength: s }, e = e || 50, t = Math.max(3, Math.floor(t) || 8), i = Math.max(2, Math.floor(i) || 6), r = void 0 !== r ? r : 0, o = void 0 !== o ? o : 2 * Math.PI, a = void 0 !== a ? a : 0, s = void 0 !== s ? s : Math.PI; var h, l, c = [],
                    u = []; for (l = 0; i >= l; l++) { var d = [],
                        p = []; for (h = 0; t >= h; h++) { var f = h / t,
                            m = l / i,
                            g = new n.Vector3;
                        g.x = -e * Math.cos(r + f * o) * Math.sin(a + m * s), g.y = e * Math.cos(a + m * s), g.z = e * Math.sin(r + f * o) * Math.sin(a + m * s), this.vertices.push(g), d.push(this.vertices.length - 1), p.push(new n.Vector2(f, 1 - m)) } c.push(d), u.push(p) } for (l = 0; i > l; l++)
                    for (h = 0; t > h; h++) { var v = c[l][h + 1],
                            y = c[l][h],
                            _ = c[l + 1][h],
                            x = c[l + 1][h + 1],
                            b = this.vertices[v].clone().normalize(),
                            w = this.vertices[y].clone().normalize(),
                            T = this.vertices[_].clone().normalize(),
                            M = this.vertices[x].clone().normalize(),
                            S = u[l][h + 1].clone(),
                            C = u[l][h].clone(),
                            A = u[l + 1][h].clone(),
                            E = u[l + 1][h + 1].clone();
                        Math.abs(this.vertices[v].y) === e ? (S.x = (S.x + C.x) / 2, this.faces.push(new n.Face3(v, _, x, [b, T, M])), this.faceVertexUvs[0].push([S, A, E])) : Math.abs(this.vertices[_].y) === e ? (A.x = (A.x + E.x) / 2, this.faces.push(new n.Face3(v, y, _, [b, w, T])), this.faceVertexUvs[0].push([S, C, A])) : (this.faces.push(new n.Face3(v, y, x, [b, w, M])), this.faceVertexUvs[0].push([S, C, E]), this.faces.push(new n.Face3(y, _, x, [w.clone(), T, M.clone()])), this.faceVertexUvs[0].push([C.clone(), A, E.clone()])) } this.computeFaceNormals(), this.boundingSphere = new n.Sphere(new n.Vector3, e) }, n.SphereGeometry.prototype = Object.create(n.Geometry.prototype), n.SphereGeometry.prototype.constructor = n.SphereGeometry, n.TextGeometry = function(e, t) { t = t || {}; var i = n.FontUtils.generateShapes(e, t);
                t.amount = void 0 !== t.height ? t.height : 50, void 0 === t.bevelThickness && (t.bevelThickness = 10), void 0 === t.bevelSize && (t.bevelSize = 8), void 0 === t.bevelEnabled && (t.bevelEnabled = !1), n.ExtrudeGeometry.call(this, i, t), this.type = "TextGeometry" }, n.TextGeometry.prototype = Object.create(n.ExtrudeGeometry.prototype), n.TextGeometry.prototype.constructor = n.TextGeometry, n.TorusGeometry = function(e, t, i, r, o) { n.Geometry.call(this), this.type = "TorusGeometry", this.parameters = { radius: e, tube: t, radialSegments: i, tubularSegments: r, arc: o }, e = e || 100, t = t || 40, i = i || 8, r = r || 6, o = o || 2 * Math.PI; for (var a = new n.Vector3, s = [], h = [], l = 0; i >= l; l++)
                    for (var c = 0; r >= c; c++) { var u = c / r * o,
                            d = l / i * Math.PI * 2;
                        a.x = e * Math.cos(u), a.y = e * Math.sin(u); var p = new n.Vector3;
                        p.x = (e + t * Math.cos(d)) * Math.cos(u), p.y = (e + t * Math.cos(d)) * Math.sin(u), p.z = t * Math.sin(d), this.vertices.push(p), s.push(new n.Vector2(c / r, l / i)), h.push(p.clone().sub(a).normalize()) }
                for (var l = 1; i >= l; l++)
                    for (var c = 1; r >= c; c++) { var f = (r + 1) * l + c - 1,
                            m = (r + 1) * (l - 1) + c - 1,
                            g = (r + 1) * (l - 1) + c,
                            v = (r + 1) * l + c,
                            y = new n.Face3(f, m, v, [h[f].clone(), h[m].clone(), h[v].clone()]);
                        this.faces.push(y), this.faceVertexUvs[0].push([s[f].clone(), s[m].clone(), s[v].clone()]), y = new n.Face3(m, g, v, [h[m].clone(), h[g].clone(), h[v].clone()]), this.faces.push(y), this.faceVertexUvs[0].push([s[m].clone(), s[g].clone(), s[v].clone()]) } this.computeFaceNormals() }, n.TorusGeometry.prototype = Object.create(n.Geometry.prototype), n.TorusGeometry.prototype.constructor = n.TorusGeometry, n.TorusKnotGeometry = function(e, t, i, r, o, a, s) {
                function h(e, t, i, r, o) { var a = Math.cos(e),
                        s = Math.sin(e),
                        h = t / i * e,
                        l = Math.cos(h),
                        c = r * (2 + l) * .5 * a,
                        u = r * (2 + l) * s * .5,
                        d = o * r * Math.sin(h) * .5; return new n.Vector3(c, u, d) } n.Geometry.call(this), this.type = "TorusKnotGeometry", this.parameters = {
                    radius: e,
                    tube: t,
                    radialSegments: i,
                    tubularSegments: r,
                    p: o,
                    q: a,
                    heightScale: s
                }, e = e || 100, t = t || 40, i = i || 64, r = r || 8, o = o || 2, a = a || 3, s = s || 1;
                for (var l = new Array(i), c = new n.Vector3, u = new n.Vector3, d = new n.Vector3, p = 0; i > p; ++p) { l[p] = new Array(r); var f = p / i * 2 * o * Math.PI,
                        m = h(f, a, o, e, s),
                        g = h(f + .01, a, o, e, s);
                    c.subVectors(g, m), u.addVectors(g, m), d.crossVectors(c, u), u.crossVectors(d, c), d.normalize(), u.normalize(); for (var v = 0; r > v; ++v) { var y = v / r * 2 * Math.PI,
                            _ = -t * Math.cos(y),
                            x = t * Math.sin(y),
                            b = new n.Vector3;
                        b.x = m.x + _ * u.x + x * d.x, b.y = m.y + _ * u.y + x * d.y, b.z = m.z + _ * u.z + x * d.z, l[p][v] = this.vertices.push(b) - 1 } }
                for (var p = 0; i > p; ++p)
                    for (var v = 0; r > v; ++v) { var w = (p + 1) % i,
                            T = (v + 1) % r,
                            M = l[p][v],
                            S = l[w][v],
                            C = l[w][T],
                            A = l[p][T],
                            E = new n.Vector2(p / i, v / r),
                            P = new n.Vector2((p + 1) / i, v / r),
                            L = new n.Vector2((p + 1) / i, (v + 1) / r),
                            R = new n.Vector2(p / i, (v + 1) / r);
                        this.faces.push(new n.Face3(M, S, A)), this.faceVertexUvs[0].push([E, P, R]), this.faces.push(new n.Face3(S, C, A)), this.faceVertexUvs[0].push([P.clone(), L, R.clone()]) } this.computeFaceNormals(), this.computeVertexNormals()
            }, n.TorusKnotGeometry.prototype = Object.create(n.Geometry.prototype), n.TorusKnotGeometry.prototype.constructor = n.TorusKnotGeometry, n.TubeGeometry = function(e, t, i, r, o, a) {
                function s(e, t, i) { return L.vertices.push(new n.Vector3(e, t, i)) - 1 } n.Geometry.call(this), this.type = "TubeGeometry", this.parameters = { path: e, segments: t, radius: i, radialSegments: r, closed: o }, t = t || 64, i = i || 1, r = r || 8, o = o || !1, a = a || n.TubeGeometry.NoTaper; var h, l, c, u, d, p, f, m, g, v, y, _, x, b, w, T, M, S, C, A, E, P = [],
                    L = this,
                    R = t + 1,
                    F = new n.Vector3,
                    k = new n.TubeGeometry.FrenetFrames(e, t, o),
                    O = k.tangents,
                    D = k.normals,
                    B = k.binormals; for (this.tangents = O, this.normals = D, this.binormals = B, v = 0; R > v; v++)
                    for (P[v] = [], u = v / (R - 1), g = e.getPointAt(u), h = O[v], l = D[v], c = B[v], p = i * a(u), y = 0; r > y; y++) d = y / r * 2 * Math.PI, f = -p * Math.cos(d), m = p * Math.sin(d), F.copy(g), F.x += f * l.x + m * c.x, F.y += f * l.y + m * c.y, F.z += f * l.z + m * c.z, P[v][y] = s(F.x, F.y, F.z); for (v = 0; t > v; v++)
                    for (y = 0; r > y; y++) _ = o ? (v + 1) % t : v + 1, x = (y + 1) % r, b = P[v][y], w = P[_][y], T = P[_][x], M = P[v][x], S = new n.Vector2(v / t, y / r), C = new n.Vector2((v + 1) / t, y / r), A = new n.Vector2((v + 1) / t, (y + 1) / r), E = new n.Vector2(v / t, (y + 1) / r), this.faces.push(new n.Face3(b, w, M)), this.faceVertexUvs[0].push([S, C, E]), this.faces.push(new n.Face3(w, T, M)), this.faceVertexUvs[0].push([C.clone(), A, E.clone()]);
                this.computeFaceNormals(), this.computeVertexNormals() }, n.TubeGeometry.prototype = Object.create(n.Geometry.prototype), n.TubeGeometry.prototype.constructor = n.TubeGeometry, n.TubeGeometry.NoTaper = function(e) { return 1 }, n.TubeGeometry.SinusoidalTaper = function(e) { return Math.sin(Math.PI * e) }, n.TubeGeometry.FrenetFrames = function(e, t, i) {
                function r() { f[0] = new n.Vector3, m[0] = new n.Vector3, a = Number.MAX_VALUE, s = Math.abs(p[0].x), h = Math.abs(p[0].y), l = Math.abs(p[0].z), a >= s && (a = s, d.set(1, 0, 0)), a >= h && (a = h, d.set(0, 1, 0)), a >= l && d.set(0, 0, 1), g.crossVectors(p[0], d).normalize(), f[0].crossVectors(p[0], g), m[0].crossVectors(p[0], f[0]) } var o, a, s, h, l, c, u, d = new n.Vector3,
                    p = [],
                    f = [],
                    m = [],
                    g = new n.Vector3,
                    v = new n.Matrix4,
                    y = t + 1,
                    _ = 1e-4; for (this.tangents = p, this.normals = f, this.binormals = m, c = 0; y > c; c++) u = c / (y - 1), p[c] = e.getTangentAt(u), p[c].normalize(); for (r(), c = 1; y > c; c++) f[c] = f[c - 1].clone(), m[c] = m[c - 1].clone(), g.crossVectors(p[c - 1], p[c]), g.length() > _ && (g.normalize(), o = Math.acos(n.Math.clamp(p[c - 1].dot(p[c]), -1, 1)), f[c].applyMatrix4(v.makeRotationAxis(g, o))), m[c].crossVectors(p[c], f[c]); if (i)
                    for (o = Math.acos(n.Math.clamp(f[0].dot(f[y - 1]), -1, 1)), o /= y - 1, p[0].dot(g.crossVectors(f[0], f[y - 1])) > 0 && (o = -o), c = 1; y > c; c++) f[c].applyMatrix4(v.makeRotationAxis(p[c], o * c)), m[c].crossVectors(p[c], f[c]) }, n.PolyhedronGeometry = function(e, t, i, r) {
                function o(e) { var t = e.normalize().clone();
                    t.index = u.vertices.push(t) - 1; var i = h(e) / 2 / Math.PI + .5,
                        r = l(e) / Math.PI + .5; return t.uv = new n.Vector2(i, 1 - r), t }

                function a(e, t, i) { var r = new n.Face3(e.index, t.index, i.index, [e.clone(), t.clone(), i.clone()]);
                    u.faces.push(r), x.copy(e).add(t).add(i).divideScalar(3); var o = h(x);
                    u.faceVertexUvs[0].push([c(e.uv, e, o), c(t.uv, t, o), c(i.uv, i, o)]) }

                function s(e, t) { for (var i = Math.pow(2, t), r = o(u.vertices[e.a]), n = o(u.vertices[e.b]), s = o(u.vertices[e.c]), h = [], l = 0; i >= l; l++) { h[l] = []; for (var c = o(r.clone().lerp(s, l / i)), d = o(n.clone().lerp(s, l / i)), p = i - l, f = 0; p >= f; f++) 0 == f && l == i ? h[l][f] = c : h[l][f] = o(c.clone().lerp(d, f / p)) } for (var l = 0; i > l; l++)
                        for (var f = 0; 2 * (i - l) - 1 > f; f++) { var m = Math.floor(f / 2);
                            f % 2 == 0 ? a(h[l][m + 1], h[l + 1][m], h[l][m]) : a(h[l][m + 1], h[l + 1][m + 1], h[l + 1][m]) } }

                function h(e) { return Math.atan2(e.z, -e.x) }

                function l(e) { return Math.atan2(-e.y, Math.sqrt(e.x * e.x + e.z * e.z)) }

                function c(e, t, i) { return 0 > i && 1 === e.x && (e = new n.Vector2(e.x - 1, e.y)), 0 === t.x && 0 === t.z && (e = new n.Vector2(i / 2 / Math.PI + .5, e.y)), e.clone() } n.Geometry.call(this), this.type = "PolyhedronGeometry", this.parameters = { vertices: e, indices: t, radius: i, detail: r }, i = i || 1, r = r || 0; for (var u = this, d = 0, p = e.length; p > d; d += 3) o(new n.Vector3(e[d], e[d + 1], e[d + 2])); for (var f = this.vertices, m = [], d = 0, g = 0, p = t.length; p > d; d += 3, g++) { var v = f[t[d]],
                        y = f[t[d + 1]],
                        _ = f[t[d + 2]];
                    m[g] = new n.Face3(v.index, y.index, _.index, [v.clone(), y.clone(), _.clone()]) } for (var x = new n.Vector3, d = 0, p = m.length; p > d; d++) s(m[d], r); for (var d = 0, p = this.faceVertexUvs[0].length; p > d; d++) { var b = this.faceVertexUvs[0][d],
                        w = b[0].x,
                        T = b[1].x,
                        M = b[2].x,
                        S = Math.max(w, Math.max(T, M)),
                        C = Math.min(w, Math.min(T, M));
                    S > .9 && .1 > C && (.2 > w && (b[0].x += 1), .2 > T && (b[1].x += 1), .2 > M && (b[2].x += 1)) } for (var d = 0, p = this.vertices.length; p > d; d++) this.vertices[d].multiplyScalar(i);
                this.mergeVertices(), this.computeFaceNormals(), this.boundingSphere = new n.Sphere(new n.Vector3, i) }, n.PolyhedronGeometry.prototype = Object.create(n.Geometry.prototype), n.PolyhedronGeometry.prototype.constructor = n.PolyhedronGeometry, n.DodecahedronGeometry = function(e, t) { this.parameters = { radius: e, detail: t }; var i = (1 + Math.sqrt(5)) / 2,
                    r = 1 / i,
                    o = [-1, -1, -1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0, -r, -i, 0, -r, i, 0, r, -i, 0, r, i, -r, -i, 0, -r, i, 0, r, -i, 0, r, i, 0, -i, 0, -r, i, 0, -r, -i, 0, r, i, 0, r],
                    a = [3, 11, 7, 3, 7, 15, 3, 15, 13, 7, 19, 17, 7, 17, 6, 7, 6, 15, 17, 4, 8, 17, 8, 10, 17, 10, 6, 8, 0, 16, 8, 16, 2, 8, 2, 10, 0, 12, 1, 0, 1, 18, 0, 18, 16, 6, 10, 2, 6, 2, 13, 6, 13, 15, 2, 16, 18, 2, 18, 3, 2, 3, 13, 18, 1, 9, 18, 9, 11, 18, 11, 3, 4, 14, 12, 4, 12, 0, 4, 0, 8, 11, 9, 5, 11, 5, 19, 11, 19, 7, 19, 5, 14, 19, 14, 4, 19, 4, 17, 1, 12, 14, 1, 14, 5, 1, 5, 9];
                n.PolyhedronGeometry.call(this, o, a, e, t) }, n.DodecahedronGeometry.prototype = Object.create(n.Geometry.prototype), n.DodecahedronGeometry.prototype.constructor = n.DodecahedronGeometry, n.IcosahedronGeometry = function(e, t) { var i = (1 + Math.sqrt(5)) / 2,
                    r = [-1, i, 0, 1, i, 0, -1, -i, 0, 1, -i, 0, 0, -1, i, 0, 1, i, 0, -1, -i, 0, 1, -i, i, 0, -1, i, 0, 1, -i, 0, -1, -i, 0, 1],
                    o = [0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1];
                n.PolyhedronGeometry.call(this, r, o, e, t), this.type = "IcosahedronGeometry", this.parameters = { radius: e, detail: t } }, n.IcosahedronGeometry.prototype = Object.create(n.Geometry.prototype), n.IcosahedronGeometry.prototype.constructor = n.IcosahedronGeometry, n.OctahedronGeometry = function(e, t) { this.parameters = { radius: e, detail: t }; var i = [1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1],
                    r = [0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2];
                n.PolyhedronGeometry.call(this, i, r, e, t), this.type = "OctahedronGeometry", this.parameters = { radius: e, detail: t } }, n.OctahedronGeometry.prototype = Object.create(n.Geometry.prototype), n.OctahedronGeometry.prototype.constructor = n.OctahedronGeometry, n.TetrahedronGeometry = function(e, t) { var i = [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1],
                    r = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1];
                n.PolyhedronGeometry.call(this, i, r, e, t), this.type = "TetrahedronGeometry", this.parameters = { radius: e, detail: t } }, n.TetrahedronGeometry.prototype = Object.create(n.Geometry.prototype), n.TetrahedronGeometry.prototype.constructor = n.TetrahedronGeometry, n.ParametricGeometry = function(e, t, i) { n.Geometry.call(this), this.type = "ParametricGeometry", this.parameters = { func: e, slices: t, stacks: i }; var r, o, a, s, h, l = this.vertices,
                    c = this.faces,
                    u = this.faceVertexUvs[0],
                    d = t + 1; for (r = 0; i >= r; r++)
                    for (h = r / i, o = 0; t >= o; o++) s = o / t, a = e(s, h), l.push(a); var p, f, m, g, v, y, _, x; for (r = 0; i > r; r++)
                    for (o = 0; t > o; o++) p = r * d + o, f = r * d + o + 1, m = (r + 1) * d + o + 1, g = (r + 1) * d + o, v = new n.Vector2(o / t, r / i), y = new n.Vector2((o + 1) / t, r / i), _ = new n.Vector2((o + 1) / t, (r + 1) / i), x = new n.Vector2(o / t, (r + 1) / i), c.push(new n.Face3(p, f, g)), u.push([v, y, x]), c.push(new n.Face3(f, m, g)), u.push([y.clone(), _, x.clone()]);
                this.computeFaceNormals(), this.computeVertexNormals() }, n.ParametricGeometry.prototype = Object.create(n.Geometry.prototype), n.ParametricGeometry.prototype.constructor = n.ParametricGeometry, n.AxisHelper = function(e) { e = e || 1; var t = new Float32Array([0, 0, 0, e, 0, 0, 0, 0, 0, 0, e, 0, 0, 0, 0, 0, 0, e]),
                    i = new Float32Array([1, 0, 0, 1, .6, 0, 0, 1, 0, .6, 1, 0, 0, 0, 1, 0, .6, 1]),
                    r = new n.BufferGeometry;
                r.addAttribute("position", new n.BufferAttribute(t, 3)), r.addAttribute("color", new n.BufferAttribute(i, 3)); var o = new n.LineBasicMaterial({ vertexColors: n.VertexColors });
                n.Line.call(this, r, o, n.LinePieces) }, n.AxisHelper.prototype = Object.create(n.Line.prototype), n.AxisHelper.prototype.constructor = n.AxisHelper, n.ArrowHelper = function() { var e = new n.Geometry;
                e.vertices.push(new n.Vector3(0, 0, 0), new n.Vector3(0, 1, 0)); var t = new n.CylinderGeometry(0, .5, 1, 5, 1); return t.applyMatrix((new n.Matrix4).makeTranslation(0, -.5, 0)),
                    function(i, r, o, a, s, h) { n.Object3D.call(this), void 0 === a && (a = 16776960), void 0 === o && (o = 1), void 0 === s && (s = .2 * o), void 0 === h && (h = .2 * s), this.position.copy(r), this.line = new n.Line(e, new n.LineBasicMaterial({ color: a })), this.line.matrixAutoUpdate = !1, this.add(this.line), this.cone = new n.Mesh(t, new n.MeshBasicMaterial({ color: a })), this.cone.matrixAutoUpdate = !1, this.add(this.cone), this.setDirection(i), this.setLength(o, s, h) } }(), n.ArrowHelper.prototype = Object.create(n.Object3D.prototype), n.ArrowHelper.prototype.constructor = n.ArrowHelper, n.ArrowHelper.prototype.setDirection = function() { var e, t = new n.Vector3; return function(i) { i.y > .99999 ? this.quaternion.set(0, 0, 0, 1) : i.y < -.99999 ? this.quaternion.set(1, 0, 0, 0) : (t.set(i.z, 0, -i.x).normalize(), e = Math.acos(i.y), this.quaternion.setFromAxisAngle(t, e)) } }(), n.ArrowHelper.prototype.setLength = function(e, t, i) { void 0 === t && (t = .2 * e), void 0 === i && (i = .2 * t), this.line.scale.set(1, e - t, 1), this.line.updateMatrix(), this.cone.scale.set(i, t, i), this.cone.position.y = e, this.cone.updateMatrix() }, n.ArrowHelper.prototype.setColor = function(e) { this.line.material.color.set(e), this.cone.material.color.set(e) }, n.BoxHelper = function(e) { var t = new n.BufferGeometry;
                t.addAttribute("position", new n.BufferAttribute(new Float32Array(72), 3)), n.Line.call(this, t, new n.LineBasicMaterial({ color: 16776960 }), n.LinePieces), void 0 !== e && this.update(e) }, n.BoxHelper.prototype = Object.create(n.Line.prototype), n.BoxHelper.prototype.constructor = n.BoxHelper, n.BoxHelper.prototype.update = function(e) { var t = e.geometry;
                null === t.boundingBox && t.computeBoundingBox(); var i = t.boundingBox.min,
                    r = t.boundingBox.max,
                    n = this.geometry.attributes.position.array;
                n[0] = r.x, n[1] = r.y, n[2] = r.z, n[3] = i.x, n[4] = r.y, n[5] = r.z, n[6] = i.x, n[7] = r.y, n[8] = r.z, n[9] = i.x, n[10] = i.y, n[11] = r.z, n[12] = i.x, n[13] = i.y, n[14] = r.z, n[15] = r.x, n[16] = i.y, n[17] = r.z, n[18] = r.x, n[19] = i.y, n[20] = r.z, n[21] = r.x, n[22] = r.y, n[23] = r.z, n[24] = r.x, n[25] = r.y, n[26] = i.z, n[27] = i.x, n[28] = r.y, n[29] = i.z, n[30] = i.x, n[31] = r.y, n[32] = i.z, n[33] = i.x, n[34] = i.y, n[35] = i.z, n[36] = i.x, n[37] = i.y, n[38] = i.z, n[39] = r.x, n[40] = i.y, n[41] = i.z, n[42] = r.x, n[43] = i.y, n[44] = i.z, n[45] = r.x, n[46] = r.y, n[47] = i.z, n[48] = r.x, n[49] = r.y, n[50] = r.z, n[51] = r.x, n[52] = r.y, n[53] = i.z, n[54] = i.x, n[55] = r.y, n[56] = r.z, n[57] = i.x, n[58] = r.y, n[59] = i.z, n[60] = i.x, n[61] = i.y, n[62] = r.z, n[63] = i.x, n[64] = i.y, n[65] = i.z, n[66] = r.x, n[67] = i.y, n[68] = r.z, n[69] = r.x, n[70] = i.y, n[71] = i.z, this.geometry.attributes.position.needsUpdate = !0, this.geometry.computeBoundingSphere(), this.matrix = e.matrixWorld, this.matrixAutoUpdate = !1 }, n.BoundingBoxHelper = function(e, t) { var i = void 0 !== t ? t : 8947848;
                this.object = e, this.box = new n.Box3, n.Mesh.call(this, new n.BoxGeometry(1, 1, 1), new n.MeshBasicMaterial({ color: i, wireframe: !0 })) }, n.BoundingBoxHelper.prototype = Object.create(n.Mesh.prototype), n.BoundingBoxHelper.prototype.constructor = n.BoundingBoxHelper, n.BoundingBoxHelper.prototype.update = function() { this.box.setFromObject(this.object), this.box.size(this.scale), this.box.center(this.position) }, n.CameraHelper = function(e) {
                function t(e, t, r) { i(e, r), i(t, r) }

                function i(e, t) { r.vertices.push(new n.Vector3), r.colors.push(new n.Color(t)), void 0 === a[e] && (a[e] = []), a[e].push(r.vertices.length - 1) } var r = new n.Geometry,
                    o = new n.LineBasicMaterial({ color: 16777215, vertexColors: n.FaceColors }),
                    a = {},
                    s = 16755200,
                    h = 16711680,
                    l = 43775,
                    c = 16777215,
                    u = 3355443;
                t("n1", "n2", s), t("n2", "n4", s), t("n4", "n3", s), t("n3", "n1", s), t("f1", "f2", s), t("f2", "f4", s), t("f4", "f3", s), t("f3", "f1", s), t("n1", "f1", s), t("n2", "f2", s), t("n3", "f3", s), t("n4", "f4", s), t("p", "n1", h), t("p", "n2", h), t("p", "n3", h), t("p", "n4", h), t("u1", "u2", l), t("u2", "u3", l), t("u3", "u1", l), t("c", "t", c), t("p", "c", u), t("cn1", "cn2", u), t("cn3", "cn4", u), t("cf1", "cf2", u), t("cf3", "cf4", u), n.Line.call(this, r, o, n.LinePieces), this.camera = e, this.matrix = e.matrixWorld, this.matrixAutoUpdate = !1, this.pointMap = a, this.update() }, n.CameraHelper.prototype = Object.create(n.Line.prototype), n.CameraHelper.prototype.constructor = n.CameraHelper, n.CameraHelper.prototype.update = function() { var e, t, i = new n.Vector3,
                    r = new n.Camera,
                    o = function(n, o, a, s) { i.set(o, a, s).unproject(r); var h = t[n]; if (void 0 !== h)
                            for (var l = 0, c = h.length; c > l; l++) e.vertices[h[l]].copy(i) }; return function() { e = this.geometry, t = this.pointMap; var i = 1,
                        n = 1;
                    r.projectionMatrix.copy(this.camera.projectionMatrix), o("c", 0, 0, -1), o("t", 0, 0, 1), o("n1", -i, -n, -1), o("n2", i, -n, -1), o("n3", -i, n, -1), o("n4", i, n, -1), o("f1", -i, -n, 1), o("f2", i, -n, 1), o("f3", -i, n, 1), o("f4", i, n, 1), o("u1", .7 * i, 1.1 * n, -1), o("u2", .7 * -i, 1.1 * n, -1), o("u3", 0, 2 * n, -1), o("cf1", -i, 0, 1), o("cf2", i, 0, 1), o("cf3", 0, -n, 1), o("cf4", 0, n, 1), o("cn1", -i, 0, -1), o("cn2", i, 0, -1), o("cn3", 0, -n, -1), o("cn4", 0, n, -1), e.verticesNeedUpdate = !0 } }(), n.DirectionalLightHelper = function(e, t) { n.Object3D.call(this), this.light = e, this.light.updateMatrixWorld(), this.matrix = e.matrixWorld, this.matrixAutoUpdate = !1, t = t || 1; var i = new n.Geometry;
                i.vertices.push(new n.Vector3(-t, t, 0), new n.Vector3(t, t, 0), new n.Vector3(t, -t, 0), new n.Vector3(-t, -t, 0), new n.Vector3(-t, t, 0)); var r = new n.LineBasicMaterial({ fog: !1 });
                r.color.copy(this.light.color).multiplyScalar(this.light.intensity), this.lightPlane = new n.Line(i, r), this.add(this.lightPlane), i = new n.Geometry, i.vertices.push(new n.Vector3, new n.Vector3), r = new n.LineBasicMaterial({ fog: !1 }), r.color.copy(this.light.color).multiplyScalar(this.light.intensity), this.targetLine = new n.Line(i, r), this.add(this.targetLine), this.update() }, n.DirectionalLightHelper.prototype = Object.create(n.Object3D.prototype), n.DirectionalLightHelper.prototype.constructor = n.DirectionalLightHelper, n.DirectionalLightHelper.prototype.dispose = function() { this.lightPlane.geometry.dispose(), this.lightPlane.material.dispose(), this.targetLine.geometry.dispose(), this.targetLine.material.dispose() }, n.DirectionalLightHelper.prototype.update = function() { var e = new n.Vector3,
                    t = new n.Vector3,
                    i = new n.Vector3; return function() { e.setFromMatrixPosition(this.light.matrixWorld), t.setFromMatrixPosition(this.light.target.matrixWorld), i.subVectors(t, e), this.lightPlane.lookAt(i), this.lightPlane.material.color.copy(this.light.color).multiplyScalar(this.light.intensity), this.targetLine.geometry.vertices[1].copy(i), this.targetLine.geometry.verticesNeedUpdate = !0, this.targetLine.material.color.copy(this.lightPlane.material.color) } }(), n.EdgesHelper = function(e, t, i) { var r = void 0 !== t ? t : 16777215;
                i = void 0 !== i ? i : 1; var o, a = Math.cos(n.Math.degToRad(i)),
                    s = [0, 0],
                    h = {},
                    l = function(e, t) { return e - t },
                    c = ["a", "b", "c"],
                    u = new n.BufferGeometry;
                e.geometry instanceof n.BufferGeometry ? (o = new n.Geometry, o.fromBufferGeometry(e.geometry)) : o = e.geometry.clone(), o.mergeVertices(), o.computeFaceNormals(); for (var d = o.vertices, p = o.faces, f = 0, m = 0, g = p.length; g > m; m++)
                    for (var v = p[m], y = 0; 3 > y; y++) { s[0] = v[c[y]], s[1] = v[c[(y + 1) % 3]], s.sort(l); var _ = s.toString();
                        void 0 === h[_] ? (h[_] = { vert1: s[0], vert2: s[1], face1: m, face2: void 0 }, f++) : h[_].face2 = m }
                var x = new Float32Array(2 * f * 3),
                    b = 0; for (var _ in h) { var w = h[_]; if (void 0 === w.face2 || p[w.face1].normal.dot(p[w.face2].normal) <= a) { var T = d[w.vert1];
                        x[b++] = T.x, x[b++] = T.y, x[b++] = T.z, T = d[w.vert2], x[b++] = T.x, x[b++] = T.y, x[b++] = T.z } } u.addAttribute("position", new n.BufferAttribute(x, 3)), n.Line.call(this, u, new n.LineBasicMaterial({ color: r }), n.LinePieces), this.matrix = e.matrixWorld, this.matrixAutoUpdate = !1 }, n.EdgesHelper.prototype = Object.create(n.Line.prototype), n.EdgesHelper.prototype.constructor = n.EdgesHelper, n.FaceNormalsHelper = function(e, t, i, r) { this.object = e, this.size = void 0 !== t ? t : 1; for (var o = void 0 !== i ? i : 16776960, a = void 0 !== r ? r : 1, s = new n.Geometry, h = this.object.geometry.faces, l = 0, c = h.length; c > l; l++) s.vertices.push(new n.Vector3, new n.Vector3);
                n.Line.call(this, s, new n.LineBasicMaterial({ color: o, linewidth: a }), n.LinePieces), this.matrixAutoUpdate = !1, this.normalMatrix = new n.Matrix3, this.update() }, n.FaceNormalsHelper.prototype = Object.create(n.Line.prototype), n.FaceNormalsHelper.prototype.constructor = n.FaceNormalsHelper, n.FaceNormalsHelper.prototype.update = function() { var e = this.geometry.vertices,
                    t = this.object,
                    i = t.geometry.vertices,
                    r = t.geometry.faces,
                    n = t.matrixWorld;
                t.updateMatrixWorld(!0), this.normalMatrix.getNormalMatrix(n); for (var o = 0, a = 0, s = r.length; s > o; o++, a += 2) { var h = r[o];
                    e[a].copy(i[h.a]).add(i[h.b]).add(i[h.c]).divideScalar(3).applyMatrix4(n), e[a + 1].copy(h.normal).applyMatrix3(this.normalMatrix).normalize().multiplyScalar(this.size).add(e[a]) } return this.geometry.verticesNeedUpdate = !0, this }, n.GridHelper = function(e, t) { var i = new n.Geometry,
                    r = new n.LineBasicMaterial({ vertexColors: n.VertexColors });
                this.color1 = new n.Color(4473924), this.color2 = new n.Color(8947848); for (var o = -e; e >= o; o += t) { i.vertices.push(new n.Vector3(-e, 0, o), new n.Vector3(e, 0, o), new n.Vector3(o, 0, -e), new n.Vector3(o, 0, e)); var a = 0 === o ? this.color1 : this.color2;
                    i.colors.push(a, a, a, a) } n.Line.call(this, i, r, n.LinePieces) }, n.GridHelper.prototype = Object.create(n.Line.prototype), n.GridHelper.prototype.constructor = n.GridHelper, n.GridHelper.prototype.setColors = function(e, t) { this.color1.set(e), this.color2.set(t), this.geometry.colorsNeedUpdate = !0 }, n.HemisphereLightHelper = function(e, t) { n.Object3D.call(this), this.light = e, this.light.updateMatrixWorld(), this.matrix = e.matrixWorld, this.matrixAutoUpdate = !1, this.colors = [new n.Color, new n.Color]; var i = new n.SphereGeometry(t, 4, 2);
                i.applyMatrix((new n.Matrix4).makeRotationX(-Math.PI / 2)); for (var r = 0, o = 8; o > r; r++) i.faces[r].color = this.colors[4 > r ? 0 : 1]; var a = new n.MeshBasicMaterial({ vertexColors: n.FaceColors, wireframe: !0 });
                this.lightSphere = new n.Mesh(i, a), this.add(this.lightSphere), this.update() }, n.HemisphereLightHelper.prototype = Object.create(n.Object3D.prototype), n.HemisphereLightHelper.prototype.constructor = n.HemisphereLightHelper, n.HemisphereLightHelper.prototype.dispose = function() { this.lightSphere.geometry.dispose(), this.lightSphere.material.dispose() }, n.HemisphereLightHelper.prototype.update = function() { var e = new n.Vector3; return function() { this.colors[0].copy(this.light.color).multiplyScalar(this.light.intensity), this.colors[1].copy(this.light.groundColor).multiplyScalar(this.light.intensity), this.lightSphere.lookAt(e.setFromMatrixPosition(this.light.matrixWorld).negate()), this.lightSphere.geometry.colorsNeedUpdate = !0 } }(), n.PointLightHelper = function(e, t) { this.light = e, this.light.updateMatrixWorld(); var i = new n.SphereGeometry(t, 4, 2),
                    r = new n.MeshBasicMaterial({ wireframe: !0, fog: !1 });
                r.color.copy(this.light.color).multiplyScalar(this.light.intensity), n.Mesh.call(this, i, r), this.matrix = this.light.matrixWorld, this.matrixAutoUpdate = !1 }, n.PointLightHelper.prototype = Object.create(n.Mesh.prototype), n.PointLightHelper.prototype.constructor = n.PointLightHelper, n.PointLightHelper.prototype.dispose = function() { this.geometry.dispose(), this.material.dispose() }, n.PointLightHelper.prototype.update = function() { this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity) }, n.SkeletonHelper = function(e) { this.bones = this.getBoneList(e); for (var t = new n.Geometry, i = 0; i < this.bones.length; i++) { var r = this.bones[i];
                    r.parent instanceof n.Bone && (t.vertices.push(new n.Vector3), t.vertices.push(new n.Vector3), t.colors.push(new n.Color(0, 0, 1)), t.colors.push(new n.Color(0, 1, 0))) } var o = new n.LineBasicMaterial({ vertexColors: n.VertexColors, depthTest: !1, depthWrite: !1, transparent: !0 });
                n.Line.call(this, t, o, n.LinePieces), this.root = e, this.matrix = e.matrixWorld, this.matrixAutoUpdate = !1, this.update() }, n.SkeletonHelper.prototype = Object.create(n.Line.prototype), n.SkeletonHelper.prototype.constructor = n.SkeletonHelper, n.SkeletonHelper.prototype.getBoneList = function(e) { var t = [];
                e instanceof n.Bone && t.push(e); for (var i = 0; i < e.children.length; i++) t.push.apply(t, this.getBoneList(e.children[i])); return t }, n.SkeletonHelper.prototype.update = function() { for (var e = this.geometry, t = (new n.Matrix4).getInverse(this.root.matrixWorld), i = new n.Matrix4, r = 0, o = 0; o < this.bones.length; o++) { var a = this.bones[o];
                    a.parent instanceof n.Bone && (i.multiplyMatrices(t, a.matrixWorld), e.vertices[r].setFromMatrixPosition(i), i.multiplyMatrices(t, a.parent.matrixWorld), e.vertices[r + 1].setFromMatrixPosition(i), r += 2) } e.verticesNeedUpdate = !0, e.computeBoundingSphere() }, n.SpotLightHelper = function(e) { n.Object3D.call(this), this.light = e, this.light.updateMatrixWorld(), this.matrix = e.matrixWorld, this.matrixAutoUpdate = !1; var t = new n.CylinderGeometry(0, 1, 1, 8, 1, !0);
                t.applyMatrix((new n.Matrix4).makeTranslation(0, -.5, 0)), t.applyMatrix((new n.Matrix4).makeRotationX(-Math.PI / 2)); var i = new n.MeshBasicMaterial({ wireframe: !0, fog: !1 });
                this.cone = new n.Mesh(t, i), this.add(this.cone), this.update() }, n.SpotLightHelper.prototype = Object.create(n.Object3D.prototype), n.SpotLightHelper.prototype.constructor = n.SpotLightHelper, n.SpotLightHelper.prototype.dispose = function() { this.cone.geometry.dispose(), this.cone.material.dispose() }, n.SpotLightHelper.prototype.update = function() { var e = new n.Vector3,
                    t = new n.Vector3; return function() { var i = this.light.distance ? this.light.distance : 1e4,
                        r = i * Math.tan(this.light.angle);
                    this.cone.scale.set(r, r, i), e.setFromMatrixPosition(this.light.matrixWorld), t.setFromMatrixPosition(this.light.target.matrixWorld), this.cone.lookAt(t.sub(e)), this.cone.material.color.copy(this.light.color).multiplyScalar(this.light.intensity) } }(), n.VertexNormalsHelper = function(e, t, i, r) { this.object = e, this.size = void 0 !== t ? t : 1; for (var o = void 0 !== i ? i : 16711680, a = void 0 !== r ? r : 1, s = new n.Geometry, h = e.geometry.faces, l = 0, c = h.length; c > l; l++)
                    for (var u = h[l], d = 0, p = u.vertexNormals.length; p > d; d++) s.vertices.push(new n.Vector3, new n.Vector3);
                n.Line.call(this, s, new n.LineBasicMaterial({ color: o, linewidth: a }), n.LinePieces), this.matrixAutoUpdate = !1, this.normalMatrix = new n.Matrix3, this.update() }, n.VertexNormalsHelper.prototype = Object.create(n.Line.prototype), n.VertexNormalsHelper.prototype.constructor = n.VertexNormalsHelper, n.VertexNormalsHelper.prototype.update = function(e) { var t = new n.Vector3; return function(e) { var i = ["a", "b", "c", "d"];
                    this.object.updateMatrixWorld(!0), this.normalMatrix.getNormalMatrix(this.object.matrixWorld); for (var r = this.geometry.vertices, n = this.object.geometry.vertices, o = this.object.geometry.faces, a = this.object.matrixWorld, s = 0, h = 0, l = o.length; l > h; h++)
                        for (var c = o[h], u = 0, d = c.vertexNormals.length; d > u; u++) { var p = c[i[u]],
                                f = n[p],
                                m = c.vertexNormals[u];
                            r[s].copy(f).applyMatrix4(a), t.copy(m).applyMatrix3(this.normalMatrix).normalize().multiplyScalar(this.size), t.add(r[s]), s += 1, r[s].copy(t), s += 1 }
                    return this.geometry.verticesNeedUpdate = !0, this } }(), n.VertexTangentsHelper = function(e, t, i, r) { this.object = e, this.size = void 0 !== t ? t : 1; for (var o = void 0 !== i ? i : 255, a = void 0 !== r ? r : 1, s = new n.Geometry, h = e.geometry.faces, l = 0, c = h.length; c > l; l++)
                    for (var u = h[l], d = 0, p = u.vertexTangents.length; p > d; d++) s.vertices.push(new n.Vector3), s.vertices.push(new n.Vector3);
                n.Line.call(this, s, new n.LineBasicMaterial({ color: o, linewidth: a }), n.LinePieces), this.matrixAutoUpdate = !1, this.update() }, n.VertexTangentsHelper.prototype = Object.create(n.Line.prototype), n.VertexTangentsHelper.prototype.constructor = n.VertexTangentsHelper, n.VertexTangentsHelper.prototype.update = function(e) { var t = new n.Vector3; return function(e) { var i = ["a", "b", "c", "d"];
                    this.object.updateMatrixWorld(!0); for (var r = this.geometry.vertices, n = this.object.geometry.vertices, o = this.object.geometry.faces, a = this.object.matrixWorld, s = 0, h = 0, l = o.length; l > h; h++)
                        for (var c = o[h], u = 0, d = c.vertexTangents.length; d > u; u++) { var p = c[i[u]],
                                f = n[p],
                                m = c.vertexTangents[u];
                            r[s].copy(f).applyMatrix4(a), t.copy(m).transformDirection(a).multiplyScalar(this.size), t.add(r[s]), s += 1, r[s].copy(t), s += 1 }
                    return this.geometry.verticesNeedUpdate = !0, this } }(), n.WireframeHelper = function(e, t) { var i = void 0 !== t ? t : 16777215,
                    r = [0, 0],
                    o = {},
                    a = function(e, t) { return e - t },
                    s = ["a", "b", "c"],
                    h = new n.BufferGeometry; if (e.geometry instanceof n.Geometry) { for (var l = e.geometry.vertices, c = e.geometry.faces, u = 0, d = new Uint32Array(6 * c.length), p = 0, f = c.length; f > p; p++)
                        for (var m = c[p], g = 0; 3 > g; g++) { r[0] = m[s[g]], r[1] = m[s[(g + 1) % 3]], r.sort(a); var v = r.toString();
                            void 0 === o[v] && (d[2 * u] = r[0], d[2 * u + 1] = r[1], o[v] = !0, u++) }
                    for (var y = new Float32Array(2 * u * 3), p = 0, f = u; f > p; p++)
                        for (var g = 0; 2 > g; g++) { var _ = l[d[2 * p + g]],
                                x = 6 * p + 3 * g;
                            y[x + 0] = _.x, y[x + 1] = _.y, y[x + 2] = _.z } h.addAttribute("position", new n.BufferAttribute(y, 3)) } else if (e.geometry instanceof n.BufferGeometry)
                    if (void 0 !== e.geometry.attributes.index) { var l = e.geometry.attributes.position.array,
                            b = e.geometry.attributes.index.array,
                            w = e.geometry.drawcalls,
                            u = 0;
                        0 === w.length && (w = [{ count: b.length, index: 0, start: 0 }]); for (var d = new Uint32Array(2 * b.length), T = 0, M = w.length; M > T; ++T)
                            for (var S = w[T].start, C = w[T].count, x = w[T].index, p = S, A = S + C; A > p; p += 3)
                                for (var g = 0; 3 > g; g++) { r[0] = x + b[p + g], r[1] = x + b[p + (g + 1) % 3], r.sort(a); var v = r.toString();
                                    void 0 === o[v] && (d[2 * u] = r[0], d[2 * u + 1] = r[1], o[v] = !0, u++) }
                        for (var y = new Float32Array(2 * u * 3), p = 0, f = u; f > p; p++)
                            for (var g = 0; 2 > g; g++) { var x = 6 * p + 3 * g,
                                    E = 3 * d[2 * p + g];
                                y[x + 0] = l[E], y[x + 1] = l[E + 1], y[x + 2] = l[E + 2] } h.addAttribute("position", new n.BufferAttribute(y, 3)) } else { for (var l = e.geometry.attributes.position.array, u = l.length / 3, P = u / 3, y = new Float32Array(2 * u * 3), p = 0, f = P; f > p; p++)
                            for (var g = 0; 3 > g; g++) { var x = 18 * p + 6 * g,
                                    L = 9 * p + 3 * g;
                                y[x + 0] = l[L], y[x + 1] = l[L + 1], y[x + 2] = l[L + 2]; var E = 9 * p + 3 * ((g + 1) % 3);
                                y[x + 3] = l[E], y[x + 4] = l[E + 1], y[x + 5] = l[E + 2] } h.addAttribute("position", new n.BufferAttribute(y, 3)) } n.Line.call(this, h, new n.LineBasicMaterial({ color: i }), n.LinePieces), this.matrix = e.matrixWorld, this.matrixAutoUpdate = !1 }, n.WireframeHelper.prototype = Object.create(n.Line.prototype), n.WireframeHelper.prototype.constructor = n.WireframeHelper, n.ImmediateRenderObject = function() { n.Object3D.call(this), this.render = function(e) {} }, n.ImmediateRenderObject.prototype = Object.create(n.Object3D.prototype), n.ImmediateRenderObject.prototype.constructor = n.ImmediateRenderObject, n.MorphBlendMesh = function(e, t) { n.Mesh.call(this, e, t), this.animationsMap = {}, this.animationsList = []; var i = this.geometry.morphTargets.length,
                    r = "__default",
                    o = 0,
                    a = i - 1,
                    s = i / 1;
                this.createAnimation(r, o, a, s), this.setAnimationWeight(r, 1) }, n.MorphBlendMesh.prototype = Object.create(n.Mesh.prototype), n.MorphBlendMesh.prototype.constructor = n.MorphBlendMesh, n.MorphBlendMesh.prototype.createAnimation = function(e, t, i, r) { var n = { startFrame: t, endFrame: i, length: i - t + 1, fps: r, duration: (i - t) / r, lastFrame: 0, currentFrame: 0, active: !1, time: 0, direction: 1, weight: 1, directionBackwards: !1, mirroredLoop: !1 };
                this.animationsMap[e] = n, this.animationsList.push(n) }, n.MorphBlendMesh.prototype.autoCreateAnimations = function(e) { for (var t, i = /([a-z]+)_?(\d+)/, r = {}, n = this.geometry, o = 0, a = n.morphTargets.length; a > o; o++) { var s = n.morphTargets[o],
                        h = s.name.match(i); if (h && h.length > 1) { var l = h[1];
                        r[l] || (r[l] = { start: 1 / 0, end: -(1 / 0) }); var c = r[l];
                        o < c.start && (c.start = o), o > c.end && (c.end = o), t || (t = l) } } for (var l in r) { var c = r[l];
                    this.createAnimation(l, c.start, c.end, e) } this.firstAnimation = t }, n.MorphBlendMesh.prototype.setAnimationDirectionForward = function(e) { var t = this.animationsMap[e];
                t && (t.direction = 1, t.directionBackwards = !1) }, n.MorphBlendMesh.prototype.setAnimationDirectionBackward = function(e) { var t = this.animationsMap[e];
                t && (t.direction = -1, t.directionBackwards = !0) }, n.MorphBlendMesh.prototype.setAnimationFPS = function(e, t) { var i = this.animationsMap[e];
                i && (i.fps = t, i.duration = (i.end - i.start) / i.fps) }, n.MorphBlendMesh.prototype.setAnimationDuration = function(e, t) { var i = this.animationsMap[e];
                i && (i.duration = t, i.fps = (i.end - i.start) / i.duration) }, n.MorphBlendMesh.prototype.setAnimationWeight = function(e, t) { var i = this.animationsMap[e];
                i && (i.weight = t) }, n.MorphBlendMesh.prototype.setAnimationTime = function(e, t) { var i = this.animationsMap[e];
                i && (i.time = t) }, n.MorphBlendMesh.prototype.getAnimationTime = function(e) { var t = 0,
                    i = this.animationsMap[e]; return i && (t = i.time), t }, n.MorphBlendMesh.prototype.getAnimationDuration = function(e) { var t = -1,
                    i = this.animationsMap[e]; return i && (t = i.duration), t }, n.MorphBlendMesh.prototype.playAnimation = function(e) { var t = this.animationsMap[e];
                t ? (t.time = 0, t.active = !0) : n.warn("THREE.MorphBlendMesh: animation[" + e + "] undefined in .playAnimation()") }, n.MorphBlendMesh.prototype.stopAnimation = function(e) { var t = this.animationsMap[e];
                t && (t.active = !1) }, n.MorphBlendMesh.prototype.update = function(e) { for (var t = 0, i = this.animationsList.length; i > t; t++) { var r = this.animationsList[t]; if (r.active) { var o = r.duration / r.length;
                        r.time += r.direction * e, r.mirroredLoop ? (r.time > r.duration || r.time < 0) && (r.direction *= -1, r.time > r.duration && (r.time = r.duration, r.directionBackwards = !0), r.time < 0 && (r.time = 0, r.directionBackwards = !1)) : (r.time = r.time % r.duration, r.time < 0 && (r.time += r.duration)); var a = r.startFrame + n.Math.clamp(Math.floor(r.time / o), 0, r.length - 1),
                            s = r.weight;
                        a !== r.currentFrame && (this.morphTargetInfluences[r.lastFrame] = 0, this.morphTargetInfluences[r.currentFrame] = 1 * s, this.morphTargetInfluences[a] = 0, r.lastFrame = r.currentFrame, r.currentFrame = a); var h = r.time % o / o;
                        r.directionBackwards && (h = 1 - h), this.morphTargetInfluences[r.currentFrame] = h * s, this.morphTargetInfluences[r.lastFrame] = (1 - h) * s } } }, "undefined" != typeof i ? ("undefined" != typeof t && t.exports && (i = t.exports = n), i.THREE = n) : this.THREE = n
    }, {}],
    37: [function(e, t, i) { var r = { emptyUserAgentDeviceType: "desktop", unknownUserAgentDeviceType: "phone", botUserAgentDeviceType: "bot" },
            n = { tv: "tv", tablet: "tablet", phone: "phone", desktop: "desktop", bot: "bot" };
        t.exports = function(e, t) { return t = t || {}, e && "" !== e ? e.match(/GoogleTV|SmartTV|Internet TV|NetCast|NETTV|AppleTV|boxee|Kylo|Roku|DLNADOC|CE\-HTML/i) ? n.tv : e.match(/Xbox|PLAYSTATION 3|Wii/i) ? n.tv : e.match(/iP(a|ro)d/i) || e.match(/tablet/i) && !e.match(/RX-34/i) || e.match(/FOLIO/i) ? n.tablet : e.match(/Linux/i) && e.match(/Android/i) && !e.match(/Fennec|mobi|HTC Magic|HTCX06HT|Nexus One|SC-02B|fone 945/i) ? n.tablet : e.match(/Kindle/i) || e.match(/Mac OS/i) && e.match(/Silk/i) ? n.tablet : e.match(/GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC( Flyer|_Flyer)|Sprint ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos S7|Dell Streak 7|Advent Vega|A101IT|A70BHT|MID7015|Next2|nook/i) || e.match(/MB511/i) && e.match(/RUTEM/i) ? n.tablet : e.match(/BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google Wireless Transcoder/i) ? n.phone : e.match(/Opera/i) && e.match(/Windows NT 5/i) && e.match(/HTC|Xda|Mini|Vario|SAMSUNG\-GT\-i8000|SAMSUNG\-SGH\-i9/i) ? n.phone : e.match(/Windows (NT|XP|ME|9)/) && !e.match(/Phone/i) && !e.match(/Bot|Spider|ia_archiver|NewsGator/i) || e.match(/Win( ?9|NT)/i) ? n.desktop : e.match(/Macintosh|PowerPC/i) && !e.match(/Silk/i) ? n.desktop : e.match(/Linux/i) && e.match(/X11/i) && !e.match(/Charlotte/i) ? n.desktop : e.match(/CrOS/) ? n.desktop : e.match(/Solaris|SunOS|BSD/i) ? n.desktop : e.match(/curl|Bot|B-O-T|Crawler|Spider|Spyder|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|Charlotte|NewsGator|TinEye|Cerberian|SearchSight|Zao|Scrubby|Qseero|PycURL|Pompos|oegp|SBIder|yoogliFetchAgent|yacy|webcollage|VYU2|voyager|updated|truwoGPS|StackRambler|Sqworm|silk|semanticdiscovery|ScoutJet|Nymesis|NetResearchServer|MVAClient|mogimogi|Mnogosearch|Arachmo|Accoona|holmes|htdig|ichiro|webis|LinkWalker|lwp-trivial/i) && !e.match(/mobile|Playstation/i) ? t.botUserAgentDeviceType || n.bot : t.unknownUserAgentDeviceType || n.phone : t.emptyUserAgentDeviceType || n.desktop }, t.exports.devices = n, t.exports.defaultOptions = r }, {}],
    38: [function(e, t, i) {
        ! function(e, r) {
            "use strict";
            var n = "0.7.9",
                o = "",
                a = "?",
                s = "function",
                h = "undefined",
                l = "object",
                c = "string",
                u = "major",
                d = "model",
                p = "name",
                f = "type",
                m = "vendor",
                g = "version",
                v = "architecture",
                y = "console",
                _ = "mobile",
                x = "tablet",
                b = "smarttv",
                w = "wearable",
                T = "embedded",
                M = {
                    extend: function(e, t) { for (var i in t) - 1 !== "browser cpu device engine os".indexOf(i) && t[i].length % 2 === 0 && (e[i] = t[i].concat(e[i])); return e },
                    has: function(e, t) { return "string" == typeof e ? -1 !== t.toLowerCase().indexOf(e.toLowerCase()) : !1 },
                    lowerize: function(e) { return e.toLowerCase() },
                    major: function(e) { return typeof e === c ? e.split(".")[0] : r }
                },
                S = { rgx: function() { for (var e, t, i, n, o, a, c, u = 0, d = arguments; u < d.length && !a;) { var p = d[u],
                                f = d[u + 1]; if (typeof e === h) { e = {}; for (n in f) o = f[n], typeof o === l ? e[o[0]] = r : e[o] = r } for (t = i = 0; t < p.length && !a;)
                                if (a = p[t++].exec(this.getUA()))
                                    for (n = 0; n < f.length; n++) c = a[++i], o = f[n], typeof o === l && o.length > 0 ? 2 == o.length ? typeof o[1] == s ? e[o[0]] = o[1].call(this, c) : e[o[0]] = o[1] : 3 == o.length ? typeof o[1] !== s || o[1].exec && o[1].test ? e[o[0]] = c ? c.replace(o[1], o[2]) : r : e[o[0]] = c ? o[1].call(this, c, o[2]) : r : 4 == o.length && (e[o[0]] = c ? o[3].call(this, c.replace(o[1], o[2])) : r) : e[o] = c ? c : r;
                            u += 2 } return e }, str: function(e, t) { for (var i in t)
                            if (typeof t[i] === l && t[i].length > 0) { for (var n = 0; n < t[i].length; n++)
                                    if (M.has(t[i][n], e)) return i === a ? r : i } else if (M.has(t[i], e)) return i === a ? r : i; return e } },
                C = { browser: { oldsafari: { version: { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" } } }, device: { amazon: { model: { "Fire Phone": ["SD", "KF"] } }, sprint: { model: { "Evo Shift 4G": "7373KT" }, vendor: { HTC: "APA", Sprint: "Sprint" } } }, os: { windows: { version: { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2000: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" } } } },
                A = { browser: [
                        [/(opera\smini)\/([\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, /(opera).+version\/([\w\.]+)/i, /(opera)[\/\s]+([\w\.]+)/i],
                        [p, g],
                        [/\s(opr)\/([\w\.]+)/i],
                        [
                            [p, "Opera"], g
                        ],
                        [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i, /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i, /(?:ms|\()(ie)\s([\w\.]+)/i, /(rekonq)\/([\w\.]+)*/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium)\/([\w\.-]+)/i],
                        [p, g],
                        [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],
                        [
                            [p, "IE"], g
                        ],
                        [/(edge)\/((\d+)?[\w\.]+)/i],
                        [p, g],
                        [/(yabrowser)\/([\w\.]+)/i],
                        [
                            [p, "Yandex"], g
                        ],
                        [/(comodo_dragon)\/([\w\.]+)/i],
                        [
                            [p, /_/g, " "], g
                        ],
                        [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i, /(uc\s?browser|qqbrowser)[\/\s]?([\w\.]+)/i],
                        [p, g],
                        [/(dolfin)\/([\w\.]+)/i],
                        [
                            [p, "Dolphin"], g
                        ],
                        [/((?:android.+)crmo|crios)\/([\w\.]+)/i],
                        [
                            [p, "Chrome"], g
                        ],
                        [/XiaoMi\/MiuiBrowser\/([\w\.]+)/i],
                        [g, [p, "MIUI Browser"]],
                        [/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i],
                        [g, [p, "Android Browser"]],
                        [/FBAV\/([\w\.]+);/i],
                        [g, [p, "Facebook"]],
                        [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],
                        [g, [p, "Mobile Safari"]],
                        [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],
                        [g, p],
                        [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
                        [p, [g, S.str, C.browser.oldsafari.version]],
                        [/(konqueror)\/([\w\.]+)/i, /(webkit|khtml)\/([\w\.]+)/i],
                        [p, g],
                        [/(navigator|netscape)\/([\w\.-]+)/i],
                        [
                            [p, "Netscape"], g
                        ],
                        [/fxios\/([\w\.-]+)/i],
                        [g, [p, "Firefox"]],
                        [/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i, /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf)[\/\s]?([\w\.]+)/i, /(links)\s\(([\w\.]+)/i, /(gobrowser)\/?([\w\.]+)*/i, /(ice\s?browser)\/v?([\w\._]+)/i, /(mosaic)[\/\s]([\w\.]+)/i],
                        [p, g]
                    ], cpu: [
                        [/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
                        [
                            [v, "amd64"]
                        ],
                        [/(ia32(?=;))/i],
                        [
                            [v, M.lowerize]
                        ],
                        [/((?:i[346]|x)86)[;\)]/i],
                        [
                            [v, "ia32"]
                        ],
                        [/windows\s(ce|mobile);\sppc;/i],
                        [
                            [v, "arm"]
                        ],
                        [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
                        [
                            [v, /ower/, "", M.lowerize]
                        ],
                        [/(sun4\w)[;\)]/i],
                        [
                            [v, "sparc"]
                        ],
                        [/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],
                        [
                            [v, M.lowerize]
                        ]
                    ], device: [
                        [/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],
                        [d, m, [f, x]],
                        [/applecoremedia\/[\w\.]+ \((ipad)/],
                        [d, [m, "Apple"],
                            [f, x]
                        ],
                        [/(apple\s{0,1}tv)/i],
                        [
                            [d, "Apple TV"],
                            [m, "Apple"]
                        ],
                        [/(archos)\s(gamepad2?)/i, /(hp).+(touchpad)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i],
                        [m, d, [f, x]],
                        [/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i],
                        [d, [m, "Amazon"],
                            [f, x]
                        ],
                        [/(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i],
                        [
                            [d, S.str, C.device.amazon.model],
                            [m, "Amazon"],
                            [f, _]
                        ],
                        [/\((ip[honed|\s\w*]+);.+(apple)/i],
                        [d, m, [f, _]],
                        [/\((ip[honed|\s\w*]+);/i],
                        [d, [m, "Apple"],
                            [f, _]
                        ],
                        [/(blackberry)[\s-]?(\w+)/i, /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i],
                        [m, d, [f, _]],
                        [/\(bb10;\s(\w+)/i],
                        [d, [m, "BlackBerry"],
                            [f, _]
                        ],
                        [/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i],
                        [d, [m, "Asus"],
                            [f, x]
                        ],
                        [/(sony)\s(tablet\s[ps])\sbuild\//i, /(sony)?(?:sgp.+)\sbuild\//i],
                        [
                            [m, "Sony"],
                            [d, "Xperia Tablet"],
                            [f, x]
                        ],
                        [/(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i],
                        [
                            [m, "Sony"],
                            [d, "Xperia Phone"],
                            [f, _]
                        ],
                        [/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i],
                        [m, d, [f, y]],
                        [/android.+;\s(shield)\sbuild/i],
                        [d, [m, "Nvidia"],
                            [f, y]
                        ],
                        [/(playstation\s[3portablevi]+)/i],
                        [d, [m, "Sony"],
                            [f, y]
                        ],
                        [/(sprint\s(\w+))/i],
                        [
                            [m, S.str, C.device.sprint.vendor],
                            [d, S.str, C.device.sprint.model],
                            [f, _]
                        ],
                        [/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i],
                        [m, d, [f, x]],
                        [/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, /(zte)-(\w+)*/i, /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i],
                        [m, [d, /_/g, " "],
                            [f, _]
                        ],
                        [/(nexus\s9)/i],
                        [d, [m, "HTC"],
                            [f, x]
                        ],
                        [/[\s\(;](xbox(?:\sone)?)[\s\);]/i],
                        [d, [m, "Microsoft"],
                            [f, y]
                        ],
                        [/(kin\.[onetw]{3})/i],
                        [
                            [d, /\./g, " "],
                            [m, "Microsoft"],
                            [f, _]
                        ],
                        [/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i, /mot[\s-]?(\w+)*/i, /(XT\d{3,4}) build\//i],
                        [d, [m, "Motorola"],
                            [f, _]
                        ],
                        [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],
                        [d, [m, "Motorola"],
                            [f, x]
                        ],
                        [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i, /((SM-T\w+))/i],
                        [
                            [m, "Samsung"], d, [f, x]
                        ],
                        [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-n900))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i, /sec-((sgh\w+))/i],
                        [
                            [m, "Samsung"], d, [f, _]
                        ],
                        [/(samsung);smarttv/i],
                        [m, d, [f, b]],
                        [/\(dtv[\);].+(aquos)/i],
                        [d, [m, "Sharp"],
                            [f, b]
                        ],
                        [/sie-(\w+)*/i],
                        [d, [m, "Siemens"],
                            [f, _]
                        ],
                        [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]+)*/i],
                        [
                            [m, "Nokia"], d, [f, _]
                        ],
                        [/android\s3\.[\s\w;-]{10}(a\d{3})/i],
                        [d, [m, "Acer"],
                            [f, x]
                        ],
                        [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],
                        [
                            [m, "LG"], d, [f, x]
                        ],
                        [/(lg) netcast\.tv/i],
                        [m, d, [f, b]],
                        [/(nexus\s[45])/i, /lg[e;\s\/-]+(\w+)*/i],
                        [d, [m, "LG"],
                            [f, _]
                        ],
                        [/android.+(ideatab[a-z0-9\-\s]+)/i],
                        [d, [m, "Lenovo"],
                            [f, x]
                        ],
                        [/linux;.+((jolla));/i],
                        [m, d, [f, _]],
                        [/((pebble))app\/[\d\.]+\s/i],
                        [m, d, [f, w]],
                        [/android.+;\s(glass)\s\d/i],
                        [d, [m, "Google"],
                            [f, w]
                        ],
                        [/android.+(\w+)\s+build\/hm\1/i, /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, /android.+(mi[\s\-_]*(?:one|one[\s_]plus)?[\s_]*(?:\d\w)?)\s+build/i],
                        [
                            [d, /_/g, " "],
                            [m, "Xiaomi"],
                            [f, _]
                        ],
                        [/(mobile|tablet);.+rv\:.+gecko\//i],
                        [
                            [f, M.lowerize], m, d
                        ]
                    ], engine: [
                        [/windows.+\sedge\/([\w\.]+)/i],
                        [g, [p, "EdgeHTML"]],
                        [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i],
                        [p, g],
                        [/rv\:([\w\.]+).*(gecko)/i],
                        [g, p]
                    ], os: [
                        [/microsoft\s(windows)\s(vista|xp)/i],
                        [p, g],
                        [/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],
                        [p, [g, S.str, C.os.windows.version]],
                        [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
                        [
                            [p, "Windows"],
                            [g, S.str, C.os.windows.version]
                        ],
                        [/\((bb)(10);/i],
                        [
                            [p, "BlackBerry"], g
                        ],
                        [/(blackberry)\w*\/?([\w\.]+)*/i, /(tizen)[\/\s]([\w\.]+)/i, /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i, /linux;.+(sailfish);/i],
                        [p, g],
                        [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],
                        [
                            [p, "Symbian"], g
                        ],
                        [/\((series40);/i],
                        [p],
                        [/mozilla.+\(mobile;.+gecko.+firefox/i],
                        [
                            [p, "Firefox OS"], g
                        ],
                        [/(nintendo|playstation)\s([wids3portablevu]+)/i, /(mint)[\/\s\(]?(\w+)*/i, /(mageia|vectorlinux)[;\s]/i, /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i, /(hurd|linux)\s?([\w\.]+)*/i, /(gnu)\s?([\w\.]+)*/i],
                        [p, g],
                        [/(cros)\s[\w]+\s([\w\.]+\w)/i],
                        [
                            [p, "Chromium OS"], g
                        ],
                        [/(sunos)\s?([\w\.]+\d)*/i],
                        [
                            [p, "Solaris"], g
                        ],
                        [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],
                        [p, g],
                        [/(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i],
                        [
                            [p, "iOS"],
                            [g, /_/g, "."]
                        ],
                        [/(mac\sos\sx)\s?([\w\s\.]+\w)*/i, /(macintosh|mac(?=_powerpc)\s)/i],
                        [
                            [p, "Mac OS"],
                            [g, /_/g, "."]
                        ],
                        [/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i, /(haiku)\s(\w+)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i, /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i, /(unix)\s?([\w\.]+)*/i],
                        [p, g]
                    ] },
                E = function(t, i) { if (!(this instanceof E)) return new E(t, i).getResult(); var r = t || (e && e.navigator && e.navigator.userAgent ? e.navigator.userAgent : o),
                        n = i ? M.extend(A, i) : A; return this.getBrowser = function() { var e = S.rgx.apply(this, n.browser); return e.major = M.major(e.version), e }, this.getCPU = function() { return S.rgx.apply(this, n.cpu) }, this.getDevice = function() { return S.rgx.apply(this, n.device) }, this.getEngine = function() { return S.rgx.apply(this, n.engine) }, this.getOS = function() { return S.rgx.apply(this, n.os) }, this.getResult = function() { return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() } }, this.getUA = function() { return r }, this.setUA = function(e) { return r = e, this }, this.setUA(r), this };
            E.VERSION = n, E.BROWSER = { NAME: p, MAJOR: u, VERSION: g }, E.CPU = { ARCHITECTURE: v }, E.DEVICE = { MODEL: d, VENDOR: m, TYPE: f, CONSOLE: y, MOBILE: _, SMARTTV: b, TABLET: x, WEARABLE: w, EMBEDDED: T }, E.ENGINE = { NAME: p, VERSION: g }, E.OS = { NAME: p, VERSION: g }, typeof i !== h ? (typeof t !== h && t.exports && (i = t.exports = E), i.UAParser = E) : typeof define === s && define.amd ? define(function() { return E }) : e.UAParser = E;
            var P = e.jQuery || e.Zepto;
            if (typeof P !== h) { var L = new E;
                P.ua = L.getResult(), P.ua.get = function() { return L.getUA() }, P.ua.set = function(e) { L.setUA(e); var t = L.getResult(); for (var i in t) P.ua[i] = t[i] } }
        }("object" == typeof window ? window : this)
    }, {}],
    39: [function(e, t, i) { t.exports = { projects: [{ name: "home", title: "Sylvain Pouyet", description: "graphic and motion designer", slideColor: { r: 255, g: 255, b: 255 } }, { name: "wayz", title: "wayz", description: "application tablette", video: "wayz", slideColor: { r: 255, g: 255, b: 255 } }, { name: "pancakes", title: "pancakes", description: "APPLICATION SMARTPHONE", video: "pancakes", slideColor: { r: 255, g: 255, b: 255 } }, { name: "scope", title: "scope", description: "APPLICATION SECOND ÉCRAN - WEBDESIGN", video: "scope", slideColor: { r: 255, g: 255, b: 255 } }, { name: "tenveux", title: "t'en veux ?", description: "APPLICATION SMARTPHONE", video: "tenveux", slideColor: { r: 255, g: 255, b: 255 } }, { name: "animation", title: "motion", description: "C'EST COOL ÇA BOUGE", video: "animation", slideColor: { r: 255, g: 255, b: 255 } }] } }, {}],
    40: [function(e, t, i) { "use strict";

        function r(e) { return e && e.__esModule ? e : { "default": e } }

        function n(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") } Object.defineProperty(i, "__esModule", { value: !0 }); var o = function() {
                function e(e, t) { for (var i = 0; i < t.length; i++) { var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r) } } return function(t, i, r) { return i && e(t.prototype, i), r && e(t, r), t } }(),
            a = e("./config"),
            s = r(a),
            h = e("./utils/Mediator.js"),
            l = r(h),
            c = e("gsap"),
            u = r(c),
            d = e("three"),
            p = r(d),
            f = e("./modules/spherematerialglow.js"),
            m = (r(f), e("./modules/datamaterial.js")),
            g = (r(m), e("./modules/SphereGeometry.js")),
            v = (r(g), e("./modules/camera")),
            y = r(v),
            _ = e("./modules/postprocessing"),
            x = r(_),
            b = e("./modules/field"),
            w = r(b),
            T = (e("./utils/math.js"), e("./utils/websocketmediator.js")),
            M = (r(T), e("dat-gui").GUI, s["default"].instance),
            S = l["default"].instance.emitter,
            C = function() {
                function e(t) { n(this, e), M.setOptions(t), this.timeline = new TimelineMax({ paused: !0 }), this.addEvents(), this.initScene(), u["default"].ticker.addEventListener("tick", this.update.bind(this)), this.onResize() } return o(e, [{ key: "initScene", value: function() { this.scene = new p["default"].Scene, this.renderer = new p["default"].WebGLRenderer({ transparent: !0, preserveDrawingBuffer: !0, antialias: !0, alpha: !0 }), this.renderer.setPixelRatio(window.devicePixelRatio), this.camera = new y["default"](50, window.innerWidth / window.innerHeight, 1, 1e4), this.renderer.setSize(window.innerWidth, window.innerHeight), this.container = document.querySelector(".wrapper"), this.canvas = this.renderer.domElement, this.container.appendChild(this.canvas), this.field = new w["default"](this.scene), M.isPosteffected && (this.posteffect = new x["default"](this.scene, this.camera, this.renderer)) } }, { key: "update", value: function() { this.renderer.setClearColor(0), this.field.update(), M.isPosteffected ? this.posteffect.render() : this.renderer.render(this.scene, this.camera) } }, { key: "onResize", value: function() { var e = window.innerWidth,
                            t = window.innerHeight;
                        this.renderer.setSize(e, t), this.camera.aspect = e / t, this.camera.updateProjectionMatrix() } }, { key: "addEvents", value: function() { S.on("resize", this.onResize.bind(this)) } }, { key: "initGUI", value: function() {} }]), e }();
        i["default"] = C, t.exports = i["default"] }, { "./config": 41, "./modules/SphereGeometry.js": 43, "./modules/camera": 44, "./modules/datamaterial.js": 45, "./modules/field": 46, "./modules/postprocessing": 47, "./modules/spherematerialglow.js": 48, "./utils/Mediator.js": 49, "./utils/math.js": 50, "./utils/websocketmediator.js": 51, "dat-gui": 14, gsap: 33, three: 36 }],
    41: [function(e, t, i) { "use strict";

        function r(e) { return e && e.__esModule ? e : { "default": e } }

        function n(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") } Object.defineProperty(i, "__esModule", { value: !0 }); var o = function() {
                function e(e, t) { for (var i = 0; i < t.length; i++) { var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r) } } return function(t, i, r) { return i && e(t.prototype, i), r && e(t, r), t } }(),
            a = e("ua-parser-js"),
            s = r(a),
            h = e("ua-device-type"),
            l = r(h),
            c = e("../media/json/data.json"),
            u = r(c),
            d = Symbol(),
            p = Symbol(),
            f = new s["default"],
            m = function() {
                function e(t) { if (n(this, e), t != p) throw "Cannot construct config singleton" } return o(e, [{ key: "init", value: function(e) { this.DEBUG = e.debug, this.DEBUG_LOG = e.debugLog, this.isPosteffected = e.isPosteffected, this.DEBUG_LOG && (window.console.log = function() {}), this.DEBUG_NOSOUND = e.debugNoSound; var t = void 0,
                            i = document.createElement("video");
                        t = i.canPlayType("video/webm") ? "webm" : "mp4", i = null, this.VIDEO_EXTENSION = "." + t, this.VIDEO_PATH = e.cdn ? e.s3url + t + "/" : e.videoPath + t + "/", this.IMAGE_PATH = e.imagesPath, this.IMAGEPACK_PATH = e.imagesPackPath, this.PATH = e.path, this.DATAJSON = u["default"], this.setDataJson(), f.setUA(navigator.userAgent), this.browser = f.getBrowser().name, this.version = f.getBrowser().version, this.os = f.getOS(), "IE" == this.browser && "11.0" !== this.version, this.devicePixelRatio = window.devicePixelRatio, this.device = l["default"](navigator.userAgent), this.isCapture = e.isCapture, this.websocketUrl = e.websocketUrl } }, { key: "setDataJson", value: function() {} }, { key: "get", value: function(e) { return this[d][e] } }, { key: "setOptions", value: function(e) { this.init(e) } }], [{ key: "instance", get: function() { return this[d] || (this[d] = new e(p)), this[d] } }]), e }();
        i["default"] = m, t.exports = i["default"] }, { "../media/json/data.json": 39, "ua-device-type": 37, "ua-parser-js": 38 }],
    42: [function(e, t, i) { "use strict";

        function r(e) { return e && e.__esModule ? e : { "default": e } } var n = e("./config.js"),
            o = r(n),
            a = e("./App.js"),
            s = r(a),
            h = e("domready"),
            l = r(h);
        o["default"].instance;
        l["default"](function() { return new s["default"]({ debug: !1, isPosteffected: !0, cdn: !0, s3url: "", websocketUrl: "ws://localhost:8000", videoPath: "", imagesPackPath: "", imagesPath: "", debugLog: !1, debugNoSound: !1, path: window.location.href.substr(0, location.href.lastIndexOf("/") + 1) }) }) }, { "./App.js": 40, "./config.js": 41, domready: 17 }],
    43: [function(e, t, i) { "use strict";

        function r(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") }

        function n(e, t) { if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t) } Object.defineProperty(i, "__esModule", { value: !0 }); var o = function(e, t, i) { for (var r = !0; r;) { var n = e,
                        o = t,
                        a = i;
                    s = l = h = void 0, r = !1, null === n && (n = Function.prototype); var s = Object.getOwnPropertyDescriptor(n, o); if (void 0 !== s) { if ("value" in s) return s.value; var h = s.get; return void 0 === h ? void 0 : h.call(a) } var l = Object.getPrototypeOf(n); if (null === l) return void 0;
                    e = l, t = o, i = a, r = !0 } },
            a = e("three"),
            s = function(e) {
                function t(e, i, n) { r(this, t), o(Object.getPrototypeOf(t.prototype), "constructor", this).call(this, e, i, n) } return n(t, e), t }(a.SphereGeometry);
        i["default"] = s, t.exports = i["default"] }, { three: 36 }],
    44: [function(e, t, i) { "use strict";

        function r(e) { return e && e.__esModule ? e : { "default": e } }

        function n(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") }

        function o(e, t) { if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t) } Object.defineProperty(i, "__esModule", { value: !0 }); var a = function(e, t, i) { for (var r = !0; r;) { var n = e,
                        o = t,
                        a = i;
                    s = l = h = void 0, r = !1, null === n && (n = Function.prototype); var s = Object.getOwnPropertyDescriptor(n, o); if (void 0 !== s) { if ("value" in s) return s.value; var h = s.get; return void 0 === h ? void 0 : h.call(a) } var l = Object.getPrototypeOf(n); if (null === l) return void 0;
                    e = l, t = o, i = a, r = !0 } },
            s = e("three"),
            h = r(s),
            l = e("three-orbit-controls")(h["default"]),
            c = function(e) {
                function t(e, i, r, o) { n(this, t), a(Object.getPrototypeOf(t.prototype), "constructor", this).call(this), this.fov = e, this.aspect = i, this.near = r, this.far = o, this.position.set(15.000461701608444, -3.4268775742966913, 12.055877139478579), this.controls = new l(this, document.querySelector(".wrapper")), this.aspect = window.innerWidth / window.innerHeight, this.updateProjectionMatrix() } return o(t, e), t }(h["default"].PerspectiveCamera);
        i["default"] = c, t.exports = i["default"] }, { three: 36, "three-orbit-controls": 35 }],
    45: [function(e, t, i) { "use strict";

        function r(e) { return e && e.__esModule ? e : { "default": e } }

        function n(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") }

        function o(e, t) { if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t) } Object.defineProperty(i, "__esModule", { value: !0 }); var a = function(e, t, i) { for (var r = !0; r;) { var n = e,
                        o = t,
                        a = i;
                    s = l = h = void 0, r = !1, null === n && (n = Function.prototype); var s = Object.getOwnPropertyDescriptor(n, o); if (void 0 !== s) { if ("value" in s) return s.value; var h = s.get; return void 0 === h ? void 0 : h.call(a) } var l = Object.getPrototypeOf(n); if (null === l) return void 0;
                    e = l, t = o, i = a, r = !0 } },
            s = e("three"),
            h = r(s),
            l = function(e) {
                function t() { n(this, t), a(Object.getPrototypeOf(t.prototype), "constructor", this).call(this), this.vertexColors = h["default"].FaceColors, this.uniforms = { texture: { type: "t", value: h["default"].ImageUtils.loadTexture("media/assets/world_lighter.png") }, mask: { type: "t", value: h["default"].ImageUtils.loadTexture("media/assets/world_white.png") }, amount: { type: "f", value: 400 }, smoothS: { type: "f", value: .4 } }, this.vertexShader = "#define GLSLIFY 1\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec2 coord;\n\n\nvoid main() {\n\n\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  vNormal = normalize( normalMatrix * normal );\n}", this.fragmentShader = "#define GLSLIFY 1\nuniform sampler2D texture;\nuniform sampler2D mask;\nuniform float amount;\nuniform float smoothS;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nfloat alpha;\nfloat alphaRatio;\n\nvoid main() {\n\n    alphaRatio = 2.0;\n\n    vec4 diffuse = texture2D( texture, vUv );\n\n    // discard ocean\n\n    if(diffuse.r < 0.) {\n    	discard;\n    }\n\n    vec4 mask = texture2D( mask, vUv );\n\n    if(mask.r > 0.) {\n\n        alphaRatio = 1.0;\n        \n        alpha = 1.0;\n\n    }\n  \n    alpha = smoothstep(smoothS, 1.0, sin( vUv.x * amount) * sin( vUv.y * amount));\n\n    \n    if(alpha == 0.) {\n        discard;\n    }\n\n    gl_FragColor = vec4( diffuse.rgb, alpha / alphaRatio);\n}", this.blending = h["default"].AdditiveBlending, this.transparent = !0 } return o(t, e), t }(h["default"].ShaderMaterial);
        i["default"] = l, t.exports = i["default"] }, { three: 36 }],
    46: [function(e, t, i) { "use strict";

        function r(e) { return e && e.__esModule ? e : { "default": e } }

        function n(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") } Object.defineProperty(i, "__esModule", { value: !0 }); var o = function() {
                function e(e, t) { for (var i = 0; i < t.length; i++) { var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r) } } return function(t, i, r) { return i && e(t.prototype, i), r && e(t, r), t } }(),
            a = e("three"),
            s = r(a),
            h = e("../../config"),
            l = r(h),
            c = e("../../utils/Mediator.js"),
            u = r(c),
            d = e("dat-gui").GUI,
            p = (l["default"].instance, u["default"].instance.emitter, function() {
                function e(t) { n(this, e), this.scene = t, this.clock = new s["default"].Clock(!0), this.options = { elevation: 0, noise_range: 1.9, sombrero_amplitude: .7, sombrero_frequency: 8, speed: 0, segments: 468, wireframe_color: "#ffffff", perlin_passes: 3, wireframe: !0, floor_visible: !0 }, this.uniforms = { time: { type: "f", value: 0 }, speed: { type: "f", value: this.options.speed }, elevation: { type: "f", value: this.options.elevation }, noise_range: { type: "f", value: this.options.noise_range }, offset: { type: "f", value: this.options.elevation }, perlin_passes: { type: "f", value: this.options.perlin_passes }, sombrero_amplitude: { type: "f", value: this.options.sombrero_amplitude }, sombrero_frequency: { type: "f", value: this.options.sombrero_frequency }, line_color: { type: "c", value: new s["default"].Color(this.options.wireframe_color) } }, this.plane_material = new s["default"].ShaderMaterial({ vertexShader: "#define GLSLIFY 1\n\n\n vec3 mod289(vec3 x)\n {\n   return x - floor(x * (1.0 / 289.0)) * 289.0;\n }\n\n vec4 mod289(vec4 x)\n {\n   return x - floor(x * (1.0 / 289.0)) * 289.0;\n }\n\n vec4 permute(vec4 x)\n {\n   return mod289(((x*34.0)+1.0)*x);\n }\n\n vec4 taylorInvSqrt(vec4 r)\n {\n   return 1.79284291400159 - 0.85373472095314 * r;\n }\n\n vec3 fade(vec3 t) {\n   return t*t*t*(t*(t*6.0-15.0)+10.0);\n }\n\n\n float cnoise(vec3 P)\n {\n   vec3 Pi0 = floor(P);\n   vec3 Pi1 = Pi0 + vec3(1.0);\n   Pi0 = mod289(Pi0);\n   Pi1 = mod289(Pi1);\n   vec3 Pf0 = fract(P);\n   vec3 Pf1 = Pf0 - vec3(1.0);\n   vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n   vec4 iy = vec4(Pi0.yy, Pi1.yy);\n   vec4 iz0 = Pi0.zzzz;\n   vec4 iz1 = Pi1.zzzz;\n\n   vec4 ixy = permute(permute(ix) + iy);\n   vec4 ixy0 = permute(ixy + iz0);\n   vec4 ixy1 = permute(ixy + iz1);\n\n   vec4 gx0 = ixy0 * (1.0 / 7.0);\n   vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n   gx0 = fract(gx0);\n   vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n   vec4 sz0 = step(gz0, vec4(0.0));\n   gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n   gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n   vec4 gx1 = ixy1 * (1.0 / 7.0);\n   vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n   gx1 = fract(gx1);\n   vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n   vec4 sz1 = step(gz1, vec4(0.0));\n   gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n   gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n   vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n   vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n   vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n   vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n   vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n   vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n   vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n   vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n   vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n   g000 *= norm0.x;\n   g010 *= norm0.y;\n   g100 *= norm0.z;\n   g110 *= norm0.w;\n   vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n   g001 *= norm1.x;\n   g011 *= norm1.y;\n   g101 *= norm1.z;\n   g111 *= norm1.w;\n\n   float n000 = dot(g000, Pf0);\n   float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n   float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n   float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n   float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n   float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n   float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n   float n111 = dot(g111, Pf1);\n\n   vec3 fade_xyz = fade(Pf0);\n   vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n   vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n   float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n   return 2.2 * n_xyz;\n }\n\n float pnoise(vec3 P, vec3 rep)\n {\n   vec3 Pi0 = mod(floor(P), rep);\n   vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);\n   Pi0 = mod289(Pi0);\n   Pi1 = mod289(Pi1);\n   vec3 Pf0 = fract(P);\n   vec3 Pf1 = Pf0 - vec3(1.0);\n   vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n   vec4 iy = vec4(Pi0.yy, Pi1.yy);\n   vec4 iz0 = Pi0.zzzz;\n   vec4 iz1 = Pi1.zzzz;\n\n   vec4 ixy = permute(permute(ix) + iy);\n   vec4 ixy0 = permute(ixy + iz0);\n   vec4 ixy1 = permute(ixy + iz1);\n\n   vec4 gx0 = ixy0 * (1.0 / 7.0);\n   vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n   gx0 = fract(gx0);\n   vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n   vec4 sz0 = step(gz0, vec4(0.0));\n   gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n   gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n   vec4 gx1 = ixy1 * (1.0 / 7.0);\n   vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n   gx1 = fract(gx1);\n   vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n   vec4 sz1 = step(gz1, vec4(0.0));\n   gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n   gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n   vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n   vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n   vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n   vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n   vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n   vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n   vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n   vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n   vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n   g000 *= norm0.x;\n   g010 *= norm0.y;\n   g100 *= norm0.z;\n   g110 *= norm0.w;\n   vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n   g001 *= norm1.x;\n   g011 *= norm1.y;\n   g101 *= norm1.z;\n   g111 *= norm1.w;\n\n   float n000 = dot(g000, Pf0);\n   float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n   float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n   float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n   float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n   float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n   float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n   float n111 = dot(g111, Pf1);\n\n   vec3 fade_xyz = fade(Pf0);\n   vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n   vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n   float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n   return 2.2 * n_xyz;\n }\n\n float rand(vec2 n)\n {\n   return 0.5 + 0.5 *\n      fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);\n }\n\n varying vec2  v_uv;\n varying vec3  v_line_color;\n\n\n uniform float time;\n uniform float speed;\n uniform float elevation;\n uniform float noise_range;\n uniform float perlin_passes;\n uniform float sombrero_amplitude;\n uniform float sombrero_frequency;\n uniform vec3  line_color;\n varying float z;\n\n #define M_PI 3.1415926535897932384626433832795\n\n void main()\n {\n     gl_PointSize = 1.;\n     v_uv          = uv;\n     v_line_color   = line_color;\n\n     // First perlin passes\n\n     float displacement  = pnoise( .4 * position + vec3( 0, speed * time, 0 ), vec3( 100.0 ) ) * 1. * noise_range;\n\n     if( perlin_passes > 2.0 ){\n\n       displacement       += pnoise( 2. * position + vec3( 0, speed * time * 5., 0 ), vec3( 100. ) ) * .3 * noise_range;\n       displacement       += pnoise( 8. * position + vec3( 0, speed * time * 20., 0 ), vec3( 100. ) ) * .1 * noise_range;\n\n     }\n     else if(perlin_passes > 1.0){\n\n       displacement       += pnoise( 8. * position + vec3( 0, speed * time * 20., 0 ), vec3( 100. ) ) * .1 * noise_range;\n     }\n\n\n     float distance = sqrt(((uv.x-0.5) * (uv.x-0.5)) + ((uv.y-0.5) * (uv.y-0.5)));\n     float z = (sombrero_amplitude * sin(((time * 0.5 * speed) - (distance * sombrero_frequency)) * M_PI));\n\n\n\n\n\n     // Sinus\n     displacement = displacement + (sin(position.x / 2. - M_PI / 2.)) * elevation;\n\n     vec3 newPosition = vec3(position.x + sin(displacement),position.y,displacement + z);\n     gl_Position      = projectionMatrix * modelViewMatrix * vec4( newPosition, 1. );\n\n     z = newPosition.z;\n }\n\n", fragmentShader: "#define GLSLIFY 1\n varying vec2 v_uv;\n varying vec3 v_line_color;\n\n\n varying float z;\n\n #define M_PI 3.1415926535897932384626433832795\n\n void main()\n {\n     vec4 temp;\n    \n     float alpha = sin(v_uv.y * M_PI) / 4.;\n     temp = vec4(v_line_color, alpha);\n     \n\n\n     gl_FragColor = temp;\n }\n", wireframe: this.options.wireframe, wireframeLinewidth: 1, transparent: !0, uniforms: this.uniforms }), this.buildPlanes(), this.initGui() } return o(e, [{ key: "update", value: function() { this.plane_material.uniforms.time.value = this.clock.getElapsedTime() } }, { key: "buildPlanes", value: function() { this.scene.remove(this.mesh), this.plane_geometry = new s["default"].PlaneBufferGeometry(20, 20, this.options.segments, this.options.segments), this.mesh = new s["default"].Mesh(this.plane_geometry, this.plane_material), this.scene.add(this.mesh) } }, { key: "initGui", value: function() { var e = this;
                        this.gui = new d, this.gui.values = {}, this.gui.values.speed = this.gui.add(this.options, "speed", -5, 5).step(.01), this.gui.values.segments = this.gui.add(this.options, "segments", 20, 800).step(1), this.gui.values.perlin_passes = this.gui.add(this.options, "perlin_passes", 1, 3).step(1), this.gui.values.noise_range = this.gui.add(this.options, "noise_range", -10, 10).step(.01), this.gui.values.sombrero_amplitude = this.gui.add(this.options, "sombrero_amplitude", -5, 5).step(.1), this.gui.values.sombrero_frequency = this.gui.add(this.options, "sombrero_frequency", 0, 100).step(.1), this.gui.values.wireframe_color = this.gui.addColor(this.options, "wireframe_color"), this.gui.values.wireframe = this.gui.add(this.options, "wireframe"), this.gui.values.wireframe.onChange(function(t) { e.plane_material.wireframe = t }), this.gui.values.noise_range.onChange(function(t) { e.uniforms.noise_range.value = t }), this.gui.values.speed.onChange(function(t) { e.uniforms.speed.value = t }), this.gui.values.perlin_passes.onChange(function(t) { e.uniforms.perlin_passes.value = t }), this.gui.values.sombrero_amplitude.onChange(function(t) { e.uniforms.sombrero_amplitude.value = t }), this.gui.values.sombrero_frequency.onChange(function(t) { e.uniforms.sombrero_frequency.value = t }), this.gui.values.wireframe_color.onChange(function(t) { e.uniforms.line_color.value = new s["default"].Color(t) }), this.gui.values.segments.onFinishChange(function(t) { e.buildPlanes(t) }) } }]), e }());
        i["default"] = p, t.exports = i["default"] }, { "../../config": 41, "../../utils/Mediator.js": 49, "dat-gui": 14, three: 36 }],
    47: [function(e, t, i) {
        "use strict";

        function r(e) { return e && e.__esModule ? e : { "default": e } }

        function n(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") } Object.defineProperty(i, "__esModule", { value: !0 });
        var o = function() {
                function e(e, t) { for (var i = 0; i < t.length; i++) { var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r) } } return function(t, i, r) { return i && e(t.prototype, i), r && e(t, r), t } }(),
            a = e("three"),
            s = (r(a), e("@superguigui/wagner")),
            h = r(s),
            l = e("../../config"),
            c = r(l),
            u = e("../../utils/Mediator.js"),
            d = r(u),
            p = e("dat-gui").GUI,
            f = c["default"].instance,
            m = d["default"].instance.emitter,
            g = function() {
                function t(e, i, r) { n(this, t), this.debug = !0, this.scene = e, this.camera = i, this.renderer = r, this.passes = [], this.composer = new h["default"].Composer(this.renderer), this.composer.setSize(window.innerWidth * f.devicePixelRatio, window.innerHeight * f.devicePixelRatio), this.initPasses(), this.initGUI(), m.on("resize", this.resize.bind(this)) }
                return o(t, [{ key: "initPasses", value: function() { var t = e("@superguigui/wagner/src/passes/bloom/MultiPassBloomPass");
                        this.BloomPass = { name: "bloompass", pass: new t, active: !0 }; var i = e("@superguigui/wagner/src/passes/symetric/symetric");
                        this.Symetric = { name: "Symetric", pass: new i, active: !0 }, this.Symetric.pass.params.mirrorCenter.x = .24, this.Symetric.pass.params.xMirror = !0, this.passes.push(this.BloomPass, this.Symetric) } }, { key: "render", value: function() { var e = this;
                        this.composer.reset(), this.composer.render(this.scene, this.camera), this.passes.forEach(function(t) { t.active && e.composer.pass(t.pass) }), this.composer.toScreen() } }, { key: "initGUI", value: function() { var e = this;
                        this.GUI = new p, this.passes.forEach(function(t, i) { t.pass.name = t.name; var r = e.GUI.addFolder(t.name),
                                n = t.pass.params;
                            r.add(t, "active"); for (var o in n)
                                if (n.hasOwnProperty(o)) { var a = e.toType(n[o]); if ("number" === a || "boolean" === a || "string" === a) r.add(n, o);
                                    else if ("object" === a) { var s = r.addFolder(o); for (var h in n[o])
                                            if (n[o].hasOwnProperty(h)) { var l = e.toType(n[o][h]);
                                                ("number" === l || "boolean" === l || "string" === l) && s.add(n[o], h) } } } }) } }, { key: "resize", value: function() { var e = window.innerWidth,
                            t = window.innerHeight;
                        this.composer.setSize(e * f.devicePixelRatio, t * f.devicePixelRatio) } }, { key: "toType", value: function(e) { return {}.toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase() } }]), t
            }();
        i["default"] = g, t.exports = i["default"]
    }, { "../../config": 41, "../../utils/Mediator.js": 49, "@superguigui/wagner": 1, "@superguigui/wagner/src/passes/bloom/MultiPassBloomPass": 6, "@superguigui/wagner/src/passes/symetric/symetric": 11, "dat-gui": 14, three: 36 }],
    48: [function(e, t, i) { "use strict";

        function r(e) { return e && e.__esModule ? e : { "default": e } }

        function n(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") }

        function o(e, t) { if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t) } Object.defineProperty(i, "__esModule", { value: !0 }); var a = function(e, t, i) { for (var r = !0; r;) { var n = e,
                        o = t,
                        a = i;
                    s = l = h = void 0, r = !1, null === n && (n = Function.prototype); var s = Object.getOwnPropertyDescriptor(n, o); if (void 0 !== s) { if ("value" in s) return s.value; var h = s.get; return void 0 === h ? void 0 : h.call(a) } var l = Object.getPrototypeOf(n); if (null === l) return void 0;
                    e = l, t = o, i = a, r = !0 } },
            s = e("three"),
            h = r(s),
            l = function(e) {
                function t() { n(this, t), a(Object.getPrototypeOf(t.prototype), "constructor", this).call(this), this.uniforms = { texture: { type: "t", value: h["default"].ImageUtils.loadTexture("media/assets/world_darker.png") } }, this.vertexShader = "#define GLSLIFY 1\nvarying vec3 vNormal;\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  vNormal = normalize( normalMatrix * normal );\n}", this.fragmentShader = "#define GLSLIFY 1\nuniform sampler2D texture;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvoid main() {\n  vec3 diffuse = texture2D( texture, vUv ).xyz;\n  float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );\n  vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );\n  gl_FragColor = vec4( diffuse + atmosphere, 1.0 );\n  //gl_FragColor = vec4(vUv, 0., 1.);\n}", this.blending = h["default"].AdditiveBlending, this.transparent = !1 } return o(t, e), t }(h["default"].ShaderMaterial);
        i["default"] = l, t.exports = i["default"] }, { three: 36 }],
    49: [function(e, t, i) { "use strict";

        function r(e) { return e && e.__esModule ? e : { "default": e } }

        function n(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") } Object.defineProperty(i, "__esModule", { value: !0 }); var o = function() {
                function e(e, t) { for (var i = 0; i < t.length; i++) { var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r) } } return function(t, i, r) { return i && e(t.prototype, i), r && e(t, r), t } }(),
            a = e("event-emitter"),
            s = r(a),
            h = e("lethargy"),
            l = (r(h), Symbol()),
            c = Symbol(),
            u = function() {
                function e(t) { if (n(this, e), t != c) throw "Cannot construct mediator singleton";
                    this.currentSlide = 0, this.emitter = s["default"]({}), window.emitter = this.emitter, this.addEvents() } return o(e, [{ key: "addEvents", value: function() { window.addEventListener("resize", this.onResize.bind(this)), emitter.on("move", this.onMove.bind(this)), emitter.on("turn", this.onTurn.bind(this)), emitter.on("setPenState", this.onSetPen.bind(this)) } }, { key: "onResize", value: function(e) { emitter.emit("resize") } }, { key: "onMove", value: function(e) {} }, { key: "onTurn", value: function(e) {} }, { key: "onSetPen", value: function(e) {} }], [{ key: "instance", get: function() { return this[l] || (this[l] = new e(c)), this[l] } }]), e }();
        i["default"] = u, t.exports = i["default"] }, { "event-emitter": 18, lethargy: 34 }],
    50: [function(e, t, i) { "use strict";

        function r(e) { return e * (Math.PI / 180) }

        function n(e) { return e * (180 / Math.PI) }

        function o(e, t, i, o) { var a = r(o - t);
            e = r(e), i = r(i), t = r(t); var s = Math.cos(i) * Math.cos(a),
                h = Math.cos(i) * Math.sin(a),
                l = Math.atan2(Math.sin(e) + Math.sin(i), Math.sqrt((Math.cos(e) + s) * (Math.cos(e) + s) + h * h)),
                c = t + Math.atan2(h, Math.cos(e) + s); return { lat: n(l), "long": n(c) } }

        function a(e, t) { t = 1.8 * t; var i = e.lat,
                r = e["long"],
                n = Math.PI / 2 - i * Math.PI / 180,
                o = 2 * Math.PI - r * Math.PI / 180,
                a = t * Math.sin(n) * Math.cos(o),
                s = t * Math.cos(n),
                h = t * Math.sin(n) * Math.sin(o); return { x: a, y: s, z: h } } Object.defineProperty(i, "__esModule", { value: !0 }), i.toRadians = r, i.toDegrees = n, i.midPointBeetweenLocation = o, i.getmidPositionFromPolar = a }, {}],
    51: [function(e, t, i) { "use strict";

        function r(e) { return e && e.__esModule ? e : { "default": e } }

        function n(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") } Object.defineProperty(i, "__esModule", { value: !0 }); var o = function() {
                function e(e, t) { for (var i = 0; i < t.length; i++) { var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r) } } return function(t, i, r) { return i && e(t.prototype, i), r && e(t, r), t } }(),
            a = e("./Mediator.js"),
            s = r(a),
            h = (s["default"].instance.emitter, function() {
                function e(t) { n(this, e), this.socket = new WebSocket(t), this.socket.onmessage = this.messageHandler.bind(this), this.socket.onopen = function(e) {}, this.socket.onerror = function(e) {} } return o(e, [{ key: "messageHandler", value: function(e) { JSON.parse(e.data) } }]), e }());
        i["default"] = h, t.exports = i["default"] }, { "./Mediator.js": 49 }]
}, {}, [42]);