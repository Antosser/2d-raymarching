(function(){
	var canvas = $("canvas");
	var ctx = canvas[0].getContext("2d");
	var origin = {x: 20, y: 300}

	canvas.width(innerWidth)
	.height(innerHeight)
	.attr('width', innerWidth)
	.attr('height', innerHeight);

	ctx.lineWidth = 1;
	ctx.strokeStyle = 'black';

	var distanceToSqare = (ray, x, y, r) =>
		(x - r < ray.x && ray.x < x + r)
		? Math.min(Math.abs(ray.y - (y + r)), Math.abs(ray.y - (y - r)))
		: (y - r < ray.y && ray.y < y + r)
		? Math.min(Math.abs(ray.x - (x - r)), Math.abs(ray.x - (x + r)))
		: Math.min(Math.sqrt((ray.x - (x - r)) ** 2 + (ray.y - (y - r)) ** 2),
		Math.sqrt((ray.x - (x - r)) ** 2 + (ray.y - (y + r)) ** 2),
		Math.sqrt((ray.x - (x + r)) ** 2 + (ray.y - (y - r)) ** 2),
		Math.sqrt((ray.x - (x + r)) ** 2 + (ray.y - (y + r)) ** 2));

	var frame = e => {
		ctx.clearRect(0, 0, innerWidth, innerHeight);
		ctx.fillRect(origin.x - 10, origin.y - 10, 20, 20);
		ctx.fillRect(400 - 40, 400 - 40, 80, 80);
		ctx.fillRect(500 - 40, 250 - 40, 80, 80);
		ctx.fillRect(700 - 40, 400 - 40, 80, 80);

		var ray = {x: origin.x, y: origin.y};
		if (ray.x == e.offsetX && ray.y == ray.offsetY) {
			ray.x = -1;
		}
		var distanceToMouse = Math.sqrt((ray.x - e.offsetX) ** 2 + (ray.y - e.offsetY) ** 2);
		var directionVector = {x: (e.offsetX - ray.x) / distanceToMouse, y: (e.offsetY - ray.y) / distanceToMouse}

		for (let i = 0; i < 100; i++) {
			dist = Math.min(distanceToSqare(ray, 400, 400, 40), distanceToSqare(ray, 500, 250, 40), distanceToSqare(ray, 700, 400, 40))
			ctx.beginPath();
			ctx.arc(ray.x, ray.y, dist, 0, 2 * Math.PI);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(ray.x, ray.y);
			ray.x += directionVector.x * dist;	
			ray.y += directionVector.y * dist;	
			ctx.lineTo(ray.x, ray.y);
			ctx.stroke();

			if (distanceToSqare < 1 || ray.x > innerWidth || ray.x < 0 || ray.y > innerHeight || ray.y < 0) {
				break;
			}
		}

		ctx.beginPath();
		ctx.moveTo(ray.x, ray.y);
		ctx.lineTo(ray.x + directionVector.x * distanceToSqare, ray.y + directionVector.y * distanceToSqare);
		ctx.stroke();
	}
	
	canvas.mousemove(frame);
	canvas.click(e => {
		origin = {x: e.offsetX, y: e.offsetY};
	});
})();