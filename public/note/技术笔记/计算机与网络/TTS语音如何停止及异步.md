

SAPI.SpVoic微软的这个组件非常强大，但是网上中文资料十分少，遇到的问题只能靠自己摸索，一个个坑自己填。

比如我就遇到语音播放异步的问题，正常都是播放完了才能继续下面的代码，而这个却不行，网上搜索到的代码是speak方法后面加个1就可以，但是我使用了就是不行，后来调查发现是没有声明变量导致的。

```vbscript
CreateObject("SAPI.SpVoice").speak "你好",1  '错误的异步使用方式
```

上面这样写是不可以的，问题现象是直接没声音了。原理很简单，这个是临时创建的，如果是异步的话运行下一行代码这个就结束了，创建的临时变量随即释放，当然声音也没了。必须要修改为下面的：

```vbscript
Dim objSpeech As Object
objSpeech.speak "你好", 1
```

也就是必须要声明，执行下一行代码后这个变量还是存在的。



不过这里有另外一个问题，也就是停止播放的问题，为什么需要停止播放呢？因为有的时候我们在当前播放一句话的时候需要改播放新的信息，然而由于之前的没播放完，那么程序只能等待之前的播放完才行，这样就造成了系统有点卡，而且体验很不好。我之前做的办法是将对象释放，一释放世界就立马安静了。

```vbscript
'停止当前播放，不推荐
If objSpeech.Status.runningState = 2 Then '如果当前正在播放，那么就销毁之前的对象然后重建
    Set objSpeech = Nothing
    Set objSpeech = CreateObject("SAPI.SpVoice")
End If
```

释放后立马再创建，这样保证下面的代码能正常调用。

可是后来在网上看到一个帖子，他不是这样干的，而是用的下面代码：

```vbscript
'停止当前播放，推荐
If objSpeech.Status.runningState = 2 Then '如果当前正在播放，那么就播放一个空字符串，并且使用挂断之前的模式
    objSpeech.Speak "", 2
End If
```

确实也可以达到效果，再看看我之前的方法，比他这方法差多了，我那方法消耗系统资源比较大，甚至在对象创建与销毁的时候我觉得软件有那么一点点的小卡顿一下。所以推荐大家用上面的代码。



关于vb调用发声代码，我写了个方便调用的函数：

```vbscript
Public objSpeech As Object
 
'发声函数 sysdzw整理
Public Sub playContent(ByVal str1$)
    If objSpeech.Status.runningState = 2 Then '如果当前正在播放，那么就播放一个空字符串，并且使用挂断之前的模式
        objSpeech.Speak "", 2
    End If
    objSpeech.Speak str1, 1
End Sub
```

附上一张spvoice的类成员图：

![img](watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3N5c2R6dw==,size_16,color_FFFFFF,t_70.png)

可以看到SAPI还有很多其他的类，而一个spvoice就够我们研究的了，真是太强大了。虽然中文文档不全，但是好在微软的变量命名十分规范，根据名字基本就能猜出意思，上面那个判断是否是播放状态我就是根据变量名猜想加验证实现的。



再看下speak的第二个参数的情况，它是一个枚举类型，有很多值。我们可以看到上面代码中第二参数的1和2分别是什么意思，根据变量名几乎是一目了然，学计算机还是需要一点英文基础的呀。

Const SVSFlagsAsync = 1 '异步

Const SVSFPurgeBeforeSpeak = 2 '挂起之前播放

![img](watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3N5c2R6dw==,size_16,color_FFFFFF,t_70-1670406689061-1.png)