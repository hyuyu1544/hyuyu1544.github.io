var overAllTexture
var colors = "666a86-788aa3-92b6b1-b2c9ab-e8ddb5-F8835E".split('-').map(a => "#" + a)
var planetNumber = 10
function drawPlanet(planet, planetID) {

	let quotient = int(frameCount / planet.freq)
	let p1ShawowBlur = (quotient % 4 == 0) ? 100 : 10
	let p2ShawowBlur = (quotient % 4 == 2) ? 100 : 10
	let transfer = quotient % 4

	push()
	noStroke()
	drawingContext.shadowColor = color(planet.p1Color)
	drawingContext.shadowBlur = p1ShawowBlur
	fill(planet.p1Color)
	translate(planet.p1.x, planet.p1.y)
	ellipse(0, 0, planet.p1Size)
	pop()

	push()
	noStroke()
	drawingContext.shadowColor = color(planet.p2Color)
	drawingContext.shadowBlur = p2ShawowBlur
	fill(planet.p2Color)
	translate(planet.p2.x, planet.p2.y)
	ellipse(0, 0, planet.p2Size)
	pop()

	if (transfer % 2 == 1) {
		let rr = planet.p1.dist(planet.p2)
		let ang = planet.p2.copy().sub(planet.p1).heading()
		push()
		translate(planet.p1.x, planet.p1.y)
		rotate(ang)
		if (transfer == 1) {
			stroke(planet.p1Color)
		} else {
			stroke(planet.p2Color)
		}
		beginShape()
		for (var i = 0; i < rr; i += 2) {
			let ratio = 5 * (rr / 2 - abs(i - rr / 2)) / rr //使線條的頭尾的波會比較小
			let yy
			yy = sin((i + frameCount / 5) / planet.freq * 100)
			vertex(i, yy * 5 * ratio)
		}
		endShape()
		pop()
	}




}

function setup() {
	createCanvas(800, 800);
	background(0)

	planets = Array.from({ length: planetNumber }, (d, i) => {
		let p1Size = random(20, 200)
		let p2Size = random(20, 200)
		let p1 = createVector(int(random(width)), int(random(height)))
		let p2 = createVector(int(random(width)), int(random(height)))
		let p1Color = random(colors)
		let p2Color = random(colors)
		let freq = random(30, 120)
		return {
			p1Size, p2Size, p1, p2, p1Color, p2Color, freq
		}
	})


	overAllTexture = createGraphics(800, 800)
	overAllTexture.loadPixels()
	for (var i = 0; i < 800 + 50; i++) {
		for (var o = 0; o < 800 + 50; o++) {
			overAllTexture.set(i, o, color(100, noise(i / 3, o / 3, o * i / 50) * random([0, 50, 100])))
		}
	}
	overAllTexture.updatePixels()
}

function draw() {
	background(0)

	planets.forEach((planet, planetID) => {
		drawPlanet(planet, planetID)

	})

	push()
	blendMode(MULTIPLY)
	image(overAllTexture, 0, 0)
	pop()
}

