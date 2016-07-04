

var game = new Phaser.Game(1200, 700, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });



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

    var stick = game.add.sprite(500, 500, 'stick');

    //  Here we add a new animation called 'walk'
    //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
    var walk = stick.animations.add('walk',[4,5,6,7,8]);
    var stand = stick.animations.add('stand',[2,3]);
    var crouch = stick.animations.add('crouch',[0]);
    var jump = stick.animations.add('jump',[1]);


    //  And this starts the animation playing by using its key ("walk")
    //  30 is the frame rate (30fps)
    //  true means it will loop when it finishes
    stick.animations.play('stand', 4, true);

    var keysdown = {};

    // keydown handler
    $(document).keydown(function(e){

      // Do we already know it's down?
      if (keysdown[e.which]) {
          // Ignore it
          return;
      }

      // Remember it's down
      keysdown[e.which] = true;

      // Do our thing
      switch(e.which){
        case 37: //left arrow

          console.log('left');
          stick.anchor.setTo(.5, 0);
          stick.scale.x = -1;
          stick.animations.play('walk', 7, true);
          break;

        case 38: //up arrow

          console.log('up');
          stick.animations.play('jump', 1, true);
          break;

        case 39: //right arrow

          console.log('right');
          stick.animations.play('walk', 7, true);
          break;

        case 40: //down arrow

          console.log('down');
          stick.animations.play('crouch', 1, true);
          break;

      }
      e.preventDefault();
    });

    // keyup handler
    $(document).keyup(function(e){
      // Remove this key from the map
      delete keysdown[e.which];
      // default to standing animation
      stick.animations.play('stand', 4, true);
      // return scale
      stick.scale.x = 1;
    });
}
