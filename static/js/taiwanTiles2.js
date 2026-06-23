var overAllTexture

function setup() {
    createCanvas(windowWidth, windowHeight);
    background("#81D1DE");
    for (var x = 0; x < width; x += 60) {
        for (var y = 0; y < height; y += 60) {
            drawTaiwanTile(x, y)
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
    var bigBall = 30
    var smallBall = 13
    push()
    translate(x, y)
    stroke("#7B8E6E")
    push()
    translate(30, 30)
    fill("#30341F")
    ellipse(0, 0, bigBall)
    rotate(PI / 4)
    drawFlower(color(255), color("#E790CC"))
    pop()
    push()
    fill("#30341F")
    ellipse(0, 0, bigBall)
    rotate(PI / 4)
    drawFlower(color("#E790CC"), color("yellow"))
    pop()
    push()
    translate(60, 60)
    fill("#30341F")
    ellipse(0, 0, bigBall)
    rotate(PI / 4)
    drawFlower(color("#E790CC"), color("yellow"))
    pop()
    push()
    translate(0, 60)
    fill("#30341F")
    ellipse(0, 0, bigBall)
    rotate(PI / 4)
    drawFlower(color("#E790CC"), color("yellow"))
    pop()
    push()
    translate(60, 0)
    fill("#30341F")
    ellipse(0, 0, bigBall)
    rotate(PI / 4)
    drawFlower(color("#E790CC"), color("yellow"))
    pop()
    push()
    translate(45, 45)
    fill("#30341F")
    ellipse(0, 0, smallBall)
    pop()
    push()
    translate(15, 15)
    fill("#30341F")
    ellipse(0, 0, smallBall)
    pop()
    push()
    translate(15, 45)
    fill("#30341F")
    ellipse(0, 0, smallBall)
    pop()
    push()
    translate(45, 15)
    fill("#30341F")
    ellipse(0, 0, smallBall)
    pop()

    noFill() // tile background color
    noStroke()
    rect(0, 0, 60, 60)
    pop()
}

function drawFlower(clr, clr2) {
    push()
    noStroke()
    fill(clr)
    ellipse(0, 0, 25, 10)
    rotate(PI / 2)
    ellipse(0, 0, 25, 10)
    rotate(PI / 2)
    fill(clr2)
    ellipse(0, 0, 8, 8)
    pop()
}
