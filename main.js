function main() {

	// Grab the window width and height
	w = window.innerWidth;
	h = window.innerHeight;

	// Block variables
	number_of_blocks = 200;
	block_size = 8;
	block_velocity = 6;

	// Add the canvas element to the dom and initiate
	var canvas_wrapper = document.getElementById('canvas-wrapper');
	canvas_wrapper.innerHTML = '';
	canvas_wrapper.innerHTML += '<canvas id="board" width="' + w + '" height="' + h + '"></canvas>';
	// For debugging, show window width and height
	//canvas_wrapper.innerHTML += '<div class="dimensions">' + w + 'px x ' + h + 'px</div>';
	var canvas = document.getElementById('board');
	c = canvas.getContext('2d');

	// Create the blocks!
	createBlocks();

	// Create array for debris
	debris = [];

	// Create the render loop
	renderer = setInterval(function () {
		render();
	}, 40);
}

function createBlocks() {
	blocks = [];
	for (i = 0; i < number_of_blocks; i++) {
		// Decide on a starting point for each block
		x = Math.floor(Math.random() * ((w - (block_size * 2)) - block_size + 0)) + block_size;
		y = Math.floor(Math.random() * ((h - (block_size * 2)) - block_size + 0)) + block_size;

		// Give each block some directions and speed
		dx = Math.floor((Math.random() * block_velocity) + 1);
		dy = Math.floor((Math.random() * block_velocity) + 1);

		// Random chance of horizontal direction switch
		if (Math.floor((Math.random() * 2)) == 1) {
			dx = -dx;
		}

		// Random chance of vertical direction switch
		if (Math.floor((Math.random() * 2)) == 1) {
			dy = -dy;
		}

		// Add the blocks to array
		blocks[blocks.length] = {
			'id': i,
			'x': x,
			'y': y,
			'dx': dx,
			'dy': dy
		};
	}
}

// Draw the blocks on the canvas
function drawBlocks() {
	for (i = 0; i < blocks.length; i++) {
		c.fillStyle = 'rgba(255,255,255, 0.9)';
		c.fillRect(blocks[i].x, blocks[i].y, block_size, block_size);
	}
}

// Update the block positions on each loop
function moveBlocks() {
	for (i = 0; i < blocks.length; i++) {
		// Change direction flag
		changed_direction = false;

		// For a  50/50 chance of direction change
		// when block reaches canvas boundary
		r = Math.floor((Math.random() * 2) + 1);

		// Test if block is at a horizontal boundary
		// If true, reverse the horizontal direction
		if (blocks[i].x <= 0) {
			blocks[i].x = 0;
			changed_direction = true;
			blocks[i].dx = -blocks[i].dx;
			// Test against 50/50 chance of vertical direction change
			if (r == 2) {
				blocks[i].dy = -blocks[i].dy;
			}
		}

		if (blocks[i].x >= (w - block_size)) {
			blocks[i].x = w - block_size;
			changed_direction = true;
			blocks[i].dx = -blocks[i].dx;
			// Test against 50/50 chance of vertical direction change
			if (r == 2) {
				blocks[i].dy = -blocks[i].dy;
			}
		}

		// Test if block is at a vertical boundary
		// If true, reverse the vertical direction
		if (blocks[i].y <= 0) {
			blocks[i].y = 0;
			changed_direction = true;
			blocks[i].dy = -blocks[i].dy;
			// Test against 50/50 chance of horizontal direction change
			if (r == 2) {
				blocks[i].dx = -blocks[i].dx;
			}
		}

		if (blocks[i].y >= (h - block_size)) {
			blocks[i].y = (h - block_size);
			changed_direction = true;
			blocks[i].dy = -blocks[i].dy;
			// Test against 50/50 chance of horizontal direction change
			if (r == 2) {
				blocks[i].dx = -blocks[i].dx;
			}
		}

		// Change random number range to 1 - 100
		r = Math.floor((Math.random() * 100) + 1);

		// Test against previous direction change and
		// small odds to 'randomly' change the vertical
		// direction anywhere on the board.	
		if (r <= 3 && !changed_direction) {
			blocks[i].dy = -blocks[i].dy;
		}

		// Test against previous direction change and
		// small odds to 'randomly' change the horizontal
		// direction anywhere on the board.
		if (r >= 97 && !changed_direction) {
			blocks[i].dx = -blocks[i].dx;
		}

		// Update the block's coordinates
		blocks[i].x += blocks[i].dx;
		blocks[i].y += blocks[i].dy;
	}
}

function collisionTest() {
	// For each block, test again all other blocks a collision
	if (blocks.length > 1) {
		for (i = 0; i < blocks.length; i++) {
			tmp = i;
			for (b = 0; b < blocks.length; b++) {
				if (typeof blocks[i] != "undefined") {
					if (
						blocks[b].x <= (blocks[i].x + block_size) &&
						blocks[i].x <= (blocks[b].x + block_size) &&
						blocks[b].y <= (blocks[i].y + block_size) &&
						blocks[i].y <= (blocks[b].y + block_size)
					) {
						if (blocks[b].id != blocks[i].id) {
							explodeBlocks(blocks[b].x + (block_size / 2), blocks[b].y + (block_size / 2));
							blocks.splice(b, 1);
							blocks.splice(tmp, 1);
						}
					}
				}
			}
		}
	}
}

function getDebrisDuration() {
	// Return a random number for the debris duration
	i = Math.floor((Math.random() * 400) + 150);
	return i;
}

function explodeBlocks(x, y) {
	// Create debris at given location
	debris[debris.length] = {
		'd': 'n',
		'l': getDebrisDuration(),
		't': 0,
		'x': x,
		'y': y
	}
	debris[debris.length] = {
		'd': 'ne',
		'l': getDebrisDuration(),
		't': 0,
		'x': x,
		'y': y
	}
	debris[debris.length] = {
		'd': 'e',
		'l': getDebrisDuration(),
		't': 0,
		'x': x,
		'y': y
	}
	debris[debris.length] = {
		'd': 'se',
		'l': getDebrisDuration(),
		't': 0,
		'x': x,
		'y': y
	}
	debris[debris.length] = {
		'd': 's',
		'l': getDebrisDuration(),
		't': 0,
		'x': x,
		'y': y
	}
	debris[debris.length] = {
		'd': 'sw',
		'l': getDebrisDuration(),
		't': 0,
		'x': x,
		'y': y
	}
	debris[debris.length] = {
		'd': 'w',
		'l': getDebrisDuration(),
		't': 0,
		'x': x,
		'y': y
	}
	debris[debris.length] = {
		'd': 'nw',
		'l': getDebrisDuration(),
		't': 0,
		'x': x,
		'y': y
	}
}

function drawDebris() {
	for (i = 0; i < debris.length; i++) {
		// Set the drebis size
		debrisSize = block_size / 3;
		// Paint the debris to the canvas
		c.fillStyle = 'rgba(255,255,255, 0.6)';
		c.fillRect(debris[i].x, debris[i].y, debrisSize, debrisSize);
	}
}

function updateDebris() {
	// Calculate how far to move debris based on block size
	var distance = block_size / 4;
	for (i = 0; i < debris.length; i++) {
		// Update how far the debris has moved from its starting point
		// If it has moved past its designated length, remove it
		debris[i].t += distance;
		if (debris[i].t > debris[i].l) {
			debris.splice(i, 1);
		} else {
			// Update debris position based on it direction of travel
			switch (debris[i].d) {
				case 'n':
					debris[i].y -= distance;
					break;

				case 'ne':
					debris[i].y -= distance;
					debris[i].x += distance;
					break;

				case 'e':
					debris[i].x += distance;
					break;

				case 'se':
					debris[i].y += distance;
					debris[i].x += distance;
					break;

				case 's':
					debris[i].y += distance;
					break;

				case 'sw':
					debris[i].y += distance;
					debris[i].x -= distance;
					break;

				case 'w':
					debris[i].x -= distance;
					break;

				case 'nw':
					debris[i].y -= distance;
					debris[i].x -= distance;
					break;

				default:
					break;
			}
		}
	}
}

var render = function () {
	// Clear the canvas / paint with solid color
	c.fillStyle = 'rgba(17, 17, 17, 0.6)';
	c.fillRect(0, 0, w, h);

	// Run the movement function
	moveBlocks();

	// Paint the blocks to the canvas
	drawBlocks();

	// Check for collision
	collisionTest();

	// Paint the debris to the canvas
	drawDebris();

	// Run the debris movement function
	updateDebris();

	// Reset if less than 2 blocks remaining
	if (blocks.length < 2) {
		clearInterval(renderer);
		main();
	}

}

// Did the browser resize? If so, reset.
function resized() {
	clearInterval(renderer);
	main();
}

// Event listening for window resizing
//window.addEventListener( 'resize', resized );

// Let's do this!
main();