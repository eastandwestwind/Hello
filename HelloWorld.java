import java.applet.*;
import java.awt.*;

public class HelloWorld extends Applet
{
  public void paint (Graphics g)
  {
    g.drawString("meowww!", 50, 25);
    g.drawRect (5,8,49,29);
  }
}
