(function(){
	var canvas = $("canvas");
	var ctx = canvas[0].getContext("2d");
	var origin = {x: 20, y: 300};
	var accuracy = 1;

	canvas.width(innerWidth)
	.height(innerHeight)
	.attr('width', innerWidth)
	.attr('height', innerHeight);

	ctx.lineWidth = 1;

	// var distanceToSquare = (ray, x, y, r) =>
	// 	(x - r < ray.x && ray.x < x + r)
	// 	? Math.min(Math.abs(ray.y - (y + r)), Math.abs(ray.y - (y - r)))
	// 	: (y - r < ray.y && ray.y < y + r)
	// 	? Math.min(Math.abs(ray.x - (x - r)), Math.abs(ray.x - (x + r)))
	// 	: Math.min(Math.sqrt((ray.x - (x - r)) ** 2 + (ray.y - (y - r)) ** 2),
	// 	Math.sqrt((ray.x - (x - r)) ** 2 + (ray.y - (y + r)) ** 2),
	// 	Math.sqrt((ray.x - (x + r)) ** 2 + (ray.y - (y - r)) ** 2),
	// 	Math.sqrt((ray.x - (x + r)) ** 2 + (ray.y - (y + r)) ** 2));
	
	var distanceToSquare = (ray, x, y, r) => Math.hypot(...[Math.max(Math.abs(ray.x - x) - r, 0), Math.max(Math.abs(ray.y - y) - r, 0)]);

	var frame = e => {
		ctx.clearRect(0, 0, canvas.width(), canvas.height());
		ctx.fillRect(origin.x - 10, origin.y - 10, 20, 20);
		ctx.fillRect(400 - 40, 400 - 40, 80, 80);
		ctx.fillRect(500 - 40, 250 - 40, 80, 80);
		ctx.fillRect(700 - 40, 400 - 40, 80, 80);

		var ray = {x: origin.x, y: origin.y};
		if (ray.x == e.offsetX && ray.y == ray.offsetY) {
			ray.x = -1;
		}
		var distanceToMouse = Math.sqrt((ray.x - e.offsetX) ** 2 + (ray.y - e.offsetY) ** 2);
		var directionVector = {x: (e.offsetX - ray.x) / distanceToMouse, y: (e.offsetY - ray.y) / distanceToMouse};

		let stepsTaken = -1;
		for (let i = 0; i < 100; i++) {
			dist = Math.min(distanceToSquare(ray, 400, 400, 40), distanceToSquare(ray, 500, 250, 40), distanceToSquare(ray, 700, 400, 40));
			ctx.strokeStyle = "red";
			ctx.beginPath();
			ctx.arc(ray.x, ray.y, dist, 0, 2 * Math.PI);
			ctx.stroke();
			
			ctx.strokeStyle = "green";
			ctx.beginPath();
			ctx.moveTo(ray.x, ray.y);
			ray.x += directionVector.x * dist;	
			ray.y += directionVector.y * dist;	
			ctx.lineTo(ray.x, ray.y);
			ctx.stroke();

			if (dist < accuracy || ray.x > canvas.width() || ray.x < 0 || ray.y > canvas.height() || ray.y < 0) {
				stepsTaken = i + 1;
				break;
			}
		}
		ctx.font = "15px Arial";
		if (stepsTaken === -1) {
			ctx.fillText("100 steps", 5, 20);
		}
		else {
			ctx.fillText(stepsTaken + " steps", 5, 20);
		}
	}

	var frameAllDirections = () => {
		var startTime = Date.now();
		ctx.clearRect(0, 0, canvas.width(), canvas.height());
		ctx.fillRect(origin.x - 10, origin.y - 10, 20, 20);
		ctx.fillRect(400 - 40, 400 - 40, 80, 80);
		ctx.fillRect(500 - 40, 250 - 40, 80, 80);
		ctx.fillRect(700 - 40, 400 - 40, 80, 80);
		for (let i = 0; i < 1; i += .0005) {
			var ray = {x: origin.x, y: origin.y};
			var directionVector = {x: Math.cos(i * 2 * Math.PI), y: Math.sin(i * 2 * Math.PI)};
	
			for (let j = 0; j < 100; j++) {
				dist = Math.min(distanceToSquare(ray, 400, 400, 40), distanceToSquare(ray, 500, 250, 40), distanceToSquare(ray, 700, 400, 40));
				
				ctx.strokeStyle = "green";
				ctx.beginPath();
				ctx.moveTo(ray.x, ray.y);
				ray.x += directionVector.x * dist;	
				ray.y += directionVector.y * dist;	
				ctx.lineTo(ray.x, ray.y);
				ctx.stroke();
	
				if (dist < accuracy || ray.x > canvas.width() || ray.x < 0 || ray.y > canvas.height() || ray.y < 0) {
					break;
				}
			}
		}
		var delta = Date.now() - startTime;
		ctx.font = "15px Arial";
		ctx.fillText(delta + " milliseconds", 5, 20);
	}

	frame({offsetX: 21, offsetY: 300});
	canvas.mousemove(frame);
	canvas.click(e => {
		origin = {x: e.offsetX, y: e.offsetY};
		frame({offsetX: origin.x + 1, offsetY: origin.y});
	});
	$('html').keydown(e => {
		if (e.keyCode == 32) {
			frameAllDirections();
		}
		else if (e.code == 'KeyU') {
			accuracy = 100;
			console.log('Changed accuracy to ' + accuracy);
		}
		else if (e.code == 'KeyI') {
			accuracy = 10;
			console.log('Changed accuracy to ' + accuracy);
		}
		else if (e.code == 'KeyO') {
			accuracy = 1;
			console.log('Changed accuracy to ' + accuracy);
		}
		else if (e.code == 'KeyP') {
			accuracy = .1;
			console.log('Changed accuracy to ' + accuracy);
		}
		console.log(e)
	});
})();