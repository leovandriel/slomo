const Bodies = Matter.Bodies
const Body = Matter.Body
const Common = Matter.Common
const Engine = Matter.Engine
const Mouse = Matter.Mouse
const MouseConstraint = Matter.MouseConstraint
const Render = Matter.Render
const World = Matter.World

// const width = 1400
// const height = 750
// const sides = 4
// const types = 4
// const size = 50
// const count = 150
// const gravity = 1
// const friction = 0.1
// const frictionAir = 0.01
// const frictionStatic = 0.5
// const restitution = 0
// const walls = 100

const width = 1400
const height = 750
const sides = 4
const types = 4
const size = 50
const count = 150
const gravity = 1e-2
const friction = 1e-4
const frictionAir = 1e-4
const frictionStatic = 1e-4
const restitution = 1
const walls = 100

const engine = Engine.create({})
const world = engine.world
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width, height,
    wireframes: false
  }
})

engine.world.gravity.y = gravity

const objects = [...Array(count).keys()].map(key => {
	const position = {
		x: Common.random(size, width - size),
		y: Common.random(size, height - size)
	}
	const type = Math.floor(Common.random(0, types))
	const radius = (size + 2 * size * type / types) / 3
	const hue = Math.floor(type / types * 360)
	const options = {
		chamfer: { radius: radius / 6 },
		density: 1 / radius / radius,
		friction, frictionAir, frictionStatic,
		restitution,
    render: {
      strokeStyle: `hsl(${hue},100%,50%)`,
      fillStyle: 'transparent',
      lineWidth: 3
    }
  }
	const body = Bodies.polygon(position.x, position.y, sides, radius, options)
	const action = 5e-3
	const force = {
		x: Common.random(-action, action),
		y: Common.random(-action, action)
	}
	Body.applyForce(body, position, force)
	return body
})

World.add(engine.world, objects)

const wallOpts = {
	isStatic: true,
	visible: false,
	friction, frictionAir, frictionStatic,
	restitution: 1
}

World.add(world, [
  Bodies.rectangle(width / 2, -walls / 2, width, walls, wallOpts),
  Bodies.rectangle(width / 2, height + walls / 2, width, walls, wallOpts),
  Bodies.rectangle(width + walls / 2, height / 2, walls, height, wallOpts),
  Bodies.rectangle(-walls / 2, height / 2, walls, height, wallOpts),
])

const mouse = Mouse.create(render.canvas)
const mouseConstraint = MouseConstraint.create(engine, {
	mouse: mouse,
	constraint: {
		stiffness: 0.2,
		render: {
			visible: false
		}
	}
})

World.add(world, mouseConstraint)
render.mouse = mouse

Engine.run(engine)
Render.run(render)
