
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render:render});

var stick;
var jumpTimer = 0;
var cursors;
var jumpButton;
var facing = 'idle';

function preload() {
    //  2250 x 188 size of spritesheet
    //  250 x 188 is the size of each frame

    //  There are 18 frames in the PNG - you can leave this value blank if the frames fill up the entire PNG, but in this case there are some
    //  blank frames at the end, so we tell the loader how many to load

    game.load.spritesheet('stick', '_stick/spritesheet.png', 250, 188, 9);

    // frames
    // 0 = crouch front
    // 1 = jump right
    // 2 = stand1
    // 3 = stand2
    // 4:8 = walking right
}

function create() {
    game.stage.backgroundColor = "#ffffff";

    stick = game.add.sprite(game.width / 2, 500, 'stick');

    stick.anchor.setTo(.5, 0);

    // enable arcade physics
    game.physics.enable(stick, Phaser.Physics.ARCADE);

    game.physics.arcade.gravity.y = 1000;
    stick.body.bounce.y = 0.2;
    stick.body.collideWorldBounds = true;

    //  Here we add a new animation called 'walk'
    //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
    var walk = stick.animations.add('walk',[4,5,6,7,8]);
    var stand = stick.animations.add('stand',[2,3]);
    var crouch = stick.animations.add('crouch',[0]);
    var jump = stick.animations.add('jump',[1]);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {

    // game.physics.arcade.collide(player, layer);

    stick.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
      stick.body.velocity.x=-150;
      if (facing != 'left')
       {
           stick.scale.x = -1;
           stick.animations.play('walk', 9, true);
           facing = 'left';
       }
    }
    else if (cursors.right.isDown)
    {
      stick.body.velocity.x=150;
      if (facing != 'right')
        {
            stick.scale.x = 1;
            stick.animations.play('walk', 9, true);
            facing = 'right';
        }
    }
    else
    {
      facing = 'idle'
      // default to standing animation
      stick.animations.play('stand', 4, true);
      // return scale
      stick.scale.x = 1;
      // set velocity to 0
      stick.body.velocity.x=0;
    }

    if (jumpButton.isDown && stick.body.onFloor() && game.time.now > jumpTimer)
    {
      if (facing != 'left')
        {
          stick.scale.x = 1;
        }
      else {
          stick.scale.x = -1;
      }
      stick.animations.play('jump', 4, true);
      stick.body.velocity.y = -250;
      jumpTimer = game.time.now + 750;
    }
}

function render () {
  game.debug.text(game.time.suggestedFps, 32, 32);
}
