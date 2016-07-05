
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update});

var stick;
var jumpTimer = 0;
var cursors;
var jumpButton;
var facing = 'idle';
var yAxis = p2.vec2.fromValues(0, 1);

function preload() {
    //  2250 x 188 size of spritesheet
    //  250 x 188 is the size of each frame
    game.load.spritesheet('stick', 'stick/spritesheet.png', 250, 188, 9);
    game.load.image('box1', 'box/box1.png');
    game.load.image('box2', 'box/box2.png');

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

    //  Enable p2 physics
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 500;
    game.physics.p2.world.defaultContactMaterial.friction = 0.3;
    game.physics.p2.world.setGlobalStiffness(1e5);

    // Enable p2 body physics
    game.physics.p2.enable(stick);
    stick.body.fixedRotation = true;
    stick.body.damping = 0.5;
    stick.body.setRectangle(58,120,0,-5,0);

    stick.animations.add('walk',[4,5,6,7,8]);
    stick.animations.add('stand',[2,3]);
    stick.animations.add('crouch',[0]);
    stick.animations.add('jump',[1]);

    var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', stick.body);
    var worldMaterial = game.physics.p2.createMaterial('worldMaterial');
    var boxMaterial = game.physics.p2.createMaterial('worldMaterial');

    //  4 trues = the 4 faces of the world in left, right, top, bottom order
    game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);

    //  A stack of boxes
    for (var i = 1; i < 7; i++)
    {
        var box1 = game.add.sprite(30, 645 - (95 * i), 'box1');
        game.physics.p2.enable(box1);
        box1.body.mass = 6;
        // box.body.static = true;
        box1.body.setMaterial(boxMaterial);
    }
    // another stack
    for (var i = 1; i < 3; i++)
    {
        var box2 = game.add.sprite(window.innerWidth-130, 645 - (95 * i), 'box2');
        game.physics.p2.enable(box2);
        box2.body.mass = 10;
        // box.body.static = true;
        box2.body.setMaterial(boxMaterial);
    }
    // another stack!
    for (var i = 1; i < 5; i++)
    {
        var box2 = game.add.sprite(window.innerWidth-80, 645 - (95 * i), 'box2');
        game.physics.p2.enable(box2);
        box2.body.mass = 10;
        // box.body.static = true;
        box2.body.setMaterial(boxMaterial);
    }
    // another stack!
    for (var i = 1; i < 8; i++)
    {
        var box2 = game.add.sprite(window.innerWidth-30, 645 - (95 * i), 'box2');
        game.physics.p2.enable(box2);
        box2.body.mass = 10;
        // box.body.static = true;
        box2.body.setMaterial(boxMaterial);
    }

    //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
    //  those 2 materials collide it uses the following settings.

    var groundPlayerCM = game.physics.p2.createContactMaterial(spriteMaterial, worldMaterial, { friction: 0.0 });
    var groundBoxesCM = game.physics.p2.createContactMaterial(worldMaterial, boxMaterial, { friction: 0.6 });

    //  Here are some more options you can set:

    // contactMaterial.friction = 0.0;     // Friction to use in the contact of these two materials.
    // contactMaterial.restitution = 0.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
    // contactMaterial.stiffness = 1e3;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
    // contactMaterial.relaxation = 0;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
    // contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
    // contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
    // contactMaterial.surfaceVelocity = 0.0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {

    // game.physics.arcade.collide(player, layer);

    if (cursors.left.isDown)
    {
      if (true == touchingDown() && game.time.now > jumpTimer + 75)
       {
           stick.body.moveLeft(160);
           stick.animations.play('walk', 9, true);
       }
      else {
        if (stick.body.velocity.x < 80)
        {
           stick.body.moveLeft(80);
        }
        stick.animations.play('jump', 4, true);
       }
       facing = 'left';
       stick.scale.x = -1;
    }
    else if (cursors.right.isDown)
    {
      if (true == touchingDown() && game.time.now > jumpTimer + 75)
        {
            stick.body.moveRight(160);
            stick.animations.play('walk', 9, true);
        }
      else {
        if (stick.body.velocity.x < 80)
        {
          stick.body.moveRight(80);
        }
        stick.animations.play('jump', 4, true);
      }
      facing = 'right'
      stick.scale.x = 1;
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

    if (jumpButton.isDown && game.time.now > jumpTimer + 750 && checkIfCanJump())
    {
      if ('left' == facing)
        {
          stick.scale.x = -1;
          stick.animations.play('jump', 4, true);
          stick.body.moveLeft(160);
        }
      else if ('right' == facing)
        {
          stick.scale.x = 1;
          stick.animations.play('jump', 4, true);
          stick.body.moveRight(160);
        }
      else
        {
          stick.scale.x = 1;
      }
      stick.body.moveUp(400);
      jumpTimer = game.time.now;
    }
}

function checkIfCanJump() {

    var result = false;

    for (var i=0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
    {
        var c = game.physics.p2.world.narrowphase.contactEquations[i];

        if (c.bodyA === stick.body.data || c.bodyB === stick.body.data)
        {
            var d = p2.vec2.dot(c.normalA, yAxis);

            if (c.bodyA === stick.body.data)
            {
                d *= -1;
            }

            if (d > 0.5)
            {
                result = true;
            }
        }
    }

    return result;

}

function touchingDown() {
  var yAxis = p2.vec2.fromValues(0, 1);
  var result = false;
  for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
  {
    var c = game.physics.p2.world.narrowphase.contactEquations[i];
    // cycles through all the contactEquations until it finds our "someone"
    if (c.bodyA === stick.body.data || c.bodyB === stick.body.data)
    {
      var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
      if (c.bodyA === stick.body.data) d *= -1;
      if (d > 0.5) result = true;
    }
  } return result;
}
