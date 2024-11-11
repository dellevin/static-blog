昨晚上在家里搜搜，发现了这个小东西。之前是用来做badusb的。但是一直没有去真的实施（主要是胆小）。所以今天拿出来随便玩玩。



**下载Arduino IDE**

https://www.arduino.cc/en/software



**建议打开之后，第一件事就是挂代理，好多依赖都是需要代理才行的。**



简单配置：

File->Preferences->Settings

在这里面找到Additional boards manaqer URLs

然后在里面填入以下网址

http://digistump.com/package_digistump_index.json



点击旁边的那个按钮进行安装

![image-20230416161916169](./assets/%E7%94%A8digispark%E5%AE%9E%E7%8E%B0windows%E7%99%BB%E5%BD%95/image-20230416161916169.png)

然后就可以写了。



```c++
#include "DigiKeyboard.h"

void loop() {}

void setup() {
DigiKeyboard.sendKeyStroke(0);
DigiKeyboard.delay(50);
DigiKeyboard.sendKeyStroke(KEY_ENTER);
DigiKeyboard.delay(2000);
DigiKeyboard.print("qqqqq");//这里写开机密码的英文
DigiKeyboard.print("0000");//这里写开机密码的数字
DigiKeyboard.delay(1000);
DigiKeyboard.sendKeyStroke(KEY_ENTER);


}
```



英文和数字要分开写，测试过，好像英文和数字在一起只会有英文。

另外一定要引用`` "DigiKeyboard.h"``而不是`"Keyboard.h"`。再引用Keyboard.h之后，不知道为什么会编译失败一直提是HID.h找不到，网上找办法也找不到。难受得要死。

另外`DigiKeyboard.h`无法实现`ctrl+del+alt`的组合键操作，这也是难受的一点。

写完之后，点击左上角的对勾，看看有没有错。没有错的话，就可以点击对勾旁边的按钮进行编译 了。

![image-20230416162610765](./assets/%E7%94%A8digispark%E5%AE%9E%E7%8E%B0windows%E7%99%BB%E5%BD%95/image-20230416162610765.png)

出现这个界面，是告诉你要再60s内插入disgispark的，要在一分钟之内不插入的话会提示你超时。插入之后，就开始识别编译了。出现以下的界面，就说明编译成功了。

![53427679d6eba8d9f6d5c4c9ecb00859](./assets/%E7%94%A8digispark%E5%AE%9E%E7%8E%B0windows%E7%99%BB%E5%BD%95/53427679d6eba8d9f6d5c4c9ecb00859.jpg)

另外，要下载Digispark的驱动才可以。下面的是驱动下载的地址，然后点击64那个安装就可以了。

https://github.com/digistump/DigistumpArduino/releases

