var overAllTexture
function setup() {
    createCanvas(windowWidth, windowHeight);
    background("#D4B999");
    for (var x = 0; x < width; x += 120) {
        for (var y = 0; y < height; y += 120) {
            drawTaiwanTile(x, y);
        }
    }
    overAllTexture = createGraphics(windowWidth, windowHeight)
    overAllTexture.loadPixels()
    for (var i = 0; i < windowWidth + 50; i++) {
        for (var o = 0; o < windowHeight + 50; o++) {
            overAllTexture.set(i, o, color(100, noise(i / 3, o / 3, o * i / 50) * random([0, 50, 100])))
        }
    }
    overAllTexture.updatePixels()
    push()
    blendMode(MULTIPLY)
    image(overAllTexture, 0, 0)
    pop()
}

function drawTaiwanTile(x, y) {
    push()
    translate(x, y)
    strokeWeight(2)
    stroke("#956342")
    push()
    translate(60, 60)
    drawOctagon(90, color('#A7713C'))
    pop()

    fill("#80949A")
    rect(0, 0, 20, 20)
    rect(120 - 20, 0, 20, 20)
    rect(120 - 20, 120 - 20, 20, 20)
    rect(0, 120 - 20, 20, 20)
    fill("#466367")

    ellipse(60, 60, 75, 75)
    ellipse(60, 60, 70, 70)
    ellipse(60, 60, 65, 65)
    ellipse(60, 60, 60, 60)
    noFill()
    strokeWeight(5)
    rect(0, 0, 120, 120)
    strokeWeight(2)
    push()
    translate(60, 60)
    drawOctagon(40, color('#D4B999'))
    pop()
    fill("#7D694C")
    rect(60 - 20, 60 - 20, 40, 40)
    fill('#D4B999')
    noStroke()

    ellipse(60, 60, 15, 38)
    ellipse(60, 60, 38, 15)
    fill('#466367')
    ellipse(60, 60, 15, 15)
    pop()

}

function drawOctagon(side = 30, clr = color(0)) {
    push()
    fill(clr)
    noStroke()
    for (var i = 0; i < 8; i++) {
        triangle(0, -side / 2 * (sqrt(3)), side / 2, 0, -side / 2, 0);
        rotate(PI / 4)
    }
    pop()
}