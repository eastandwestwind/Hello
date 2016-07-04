
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render:render});

var stick;
var jumpTimer = 0;
var cursors;
var jumpButton;
var facing = 'idle';

function preload() {
    //  2250 x 188 size of spritesheet
    //  250 x 188 is the size of each frame

    game.load.spritesheet('stick', 'stick/spritesheet.png', 250, 188, 9);

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

    game.physics.arcade.gravity.y = 500;
    stick.body.bounce.y = 0.2;
    stick.body.collideWorldBounds = true;


    stick.animations.add('walk',[4,5,6,7,8]);
    stick.animations.add('stand',[2,3]);
    stick.animations.add('crouch',[0]);
    stick.animations.add('jump',[1]);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {

    // game.physics.arcade.collide(player, layer);

    if (cursors.left.isDown)
    {
      if (stick.body.onFloor())
       {
           stick.scale.x = -1;
           stick.body.velocity.x=-160;
           stick.animations.play('walk', 9, true);
           facing = 'left';
       }
    }
    else if (cursors.right.isDown)
    {
      if (stick.body.onFloor())
        {
            stick.scale.x = 1;
            stick.body.velocity.x=160;
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
      if ('left' == facing)
        {
          stick.scale.x = -1;
          stick.animations.play('jump', 4, true);
        }
      else if ('right' == facing)
        {
          stick.scale.x = 1;
          stick.animations.play('jump', 4, true);
        }
      else
        {
          stick.scale.x = 1;
      }
      stick.body.velocity.y = -250;
      jumpTimer = game.time.now + 750;
    }
}

function render () {
  game.debug.text(game.time.suggestedFps, 32, 32);
}
